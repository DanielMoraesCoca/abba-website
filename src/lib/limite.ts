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
  if (operacoes % LIMPEZA_A_CADA === 0) {
    for (const [k, v] of JANELAS) {
      if (v.reinicioEm <= agora) JANELAS.delete(k);
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

/** Identifica o cliente pelo cabeçalho do proxy, com queda para um balde comum. */
export function identificar(headers: Headers): string {
  const encaminhado = headers.get('x-forwarded-for');
  if (encaminhado) {
    const primeiro = encaminhado.split(',')[0]?.trim();
    if (primeiro) return primeiro;
  }
  return headers.get('x-real-ip')?.trim() ?? 'desconhecido';
}
