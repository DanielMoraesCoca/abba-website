/**
 * Limite de taxa por IP, em memória.
 *
 * Escopo honesto: isto protege contra o abuso trivial (alguém segurando o
 * botão, um script simples) e nada mais. Numa implantação com várias
 * instâncias, cada uma tem o seu contador. Quando o volume justificar,
 * troca-se por um contador compartilhado — a interface abaixo não muda.
 *
 * O motivo de existir agora: cada análise pode disparar uma chamada paga
 * de modelo. Sem trava, um laço distraído vira fatura.
 */

interface Janela {
  contagem: number;
  reinicioEm: number;
}

const JANELAS = new Map<string, Janela>();
const LIMPEZA_A_CADA = 500;

/**
 * Teto de chaves vivas.
 *
 * Sem ele, quem forja `X-Forwarded-For` a cada requisição cria uma entrada
 * nova por chamada e o mapa cresce sem fim — a mesma falha vira consumo de
 * memória além do desvio da trava. Ao encostar no teto, as entradas
 * vencidas saem primeiro; se ainda assim estiver cheio, a mais antiga sai.
 * Perder uma janela antiga é aceitável; crescer sem limite não é.
 */
const MAXIMO_DE_CHAVES = 10_000;
let operacoes = 0;

export interface ResultadoLimite {
  readonly permitido: boolean;
  readonly restantes: number;
  readonly reinicioEmSegundos: number;
}

export function verificarLimite(
  chave: string,
  maximo: number,
  janelaMs: number,
): ResultadoLimite {
  const agora = Date.now();

  operacoes += 1;
  if (operacoes % LIMPEZA_A_CADA === 0 || JANELAS.size >= MAXIMO_DE_CHAVES) {
    for (const [k, v] of JANELAS) {
      if (v.reinicioEm <= agora) JANELAS.delete(k);
    }
    // Ainda cheio depois de varrer os vencidos: descarta os mais antigos.
    // `Map` itera na ordem de inserção, então os primeiros são os mais
    // velhos.
    if (JANELAS.size >= MAXIMO_DE_CHAVES) {
      const excedente = JANELAS.size - MAXIMO_DE_CHAVES + 1;
      let removidas = 0;
      for (const k of JANELAS.keys()) {
        JANELAS.delete(k);
        if (++removidas >= excedente) break;
      }
    }
  }

  const atual = JANELAS.get(chave);
  if (!atual || atual.reinicioEm <= agora) {
    JANELAS.set(chave, { contagem: 1, reinicioEm: agora + janelaMs });
    return { permitido: true, restantes: maximo - 1, reinicioEmSegundos: Math.ceil(janelaMs / 1000) };
  }

  atual.contagem += 1;
  const restantes = Math.max(maximo - atual.contagem, 0);
  return {
    permitido: atual.contagem <= maximo,
    restantes,
    reinicioEmSegundos: Math.ceil((atual.reinicioEm - agora) / 1000),
  };
}

/**
 * Lê um limite de variável de ambiente, com o valor de produção como padrão.
 *
 * Existe porque o próprio conjunto de testes de ponta a ponta esbarrou no
 * limite: ele percorre o fluxo da Análise várias vezes, do mesmo IP, em
 * menos de dez minutos — que é exatamente o comportamento que a trava
 * bloqueia, e ela estava certa em bloquear.
 *
 * A saída NÃO é um atalho de teste no código de produção. É configuração:
 * um limite razoável por padrão, ajustável por ambiente. Um valor ausente,
 * vazio ou não numérico cai no padrão — configuração errada nunca deve
 * abrir a porta, sempre deve manter a trava.
 */
export function limiteDoAmbiente(variavel: string, padrao: number): number {
  const bruto = process.env[variavel];
  if (!bruto) return padrao;
  const valor = Number.parseInt(bruto, 10);
  return Number.isFinite(valor) && valor > 0 ? valor : padrao;
}

/**
 * Identifica o cliente pelo cabeçalho do proxy.
 *
 * ────────────────────────────────────────────────────────────────────────
 * LEIA ISTO ANTES DE CONFIAR NESTA FUNÇÃO.
 *
 * `X-Forwarded-For` é escrito pelo cliente e reescrito pelo proxy. Se a
 * hospedagem não sobrescrever o cabeçalho recebido, qualquer pessoa manda
 * um valor diferente a cada requisição e ganha um balde novo por chamada —
 * a trava por IP deixa de existir.
 *
 * Isso NÃO é hipótese: era o comportamento aqui, e a trava é a única coisa
 * entre um laço e uma fatura de modelo de linguagem. A correção tem duas
 * partes, e esta é a menor delas:
 *
 * 1. Aqui: `ABBA_PROXY_CONFIAVEL=1` declara que a hospedagem sobrescreve o
 *    cabeçalho. Sem essa declaração, o cabeçalho continua sendo usado
 *    (senão o site inteiro cairia num balde só), mas ninguém deve tratar a
 *    trava por IP como defesa contra abuso deliberado.
 * 2. Em `narrativa.ts`: um fusível GLOBAL, que não depende de identificar
 *    ninguém e por isso não tem como ser forjado. É ele que protege a
 *    fatura de verdade.
 *
 * Ao apontar o domínio (pendência 9), confirme como a hospedagem trata
 * `X-Forwarded-For` e ligue a variável.
 * ──────────────────────────────────────────────────────────────────────── */
export function identificar(headers: Headers): string {
  const encaminhado = headers.get('x-forwarded-for');
  if (encaminhado) {
    const primeiro = encaminhado.split(',')[0]?.trim();
    // Um valor absurdamente longo é tentativa de encher o mapa de chaves,
    // não um endereço. Endereço IPv6 mais longo tem 45 caracteres.
    if (primeiro && primeiro.length <= 45) return primeiro;
  }
  const real = headers.get('x-real-ip')?.trim();
  return real && real.length <= 45 ? real : 'desconhecido';
}
