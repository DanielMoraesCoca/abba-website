import {
  AVISO_DE_FAIXA,
  CONTINGENCIA_POR_LATENCIA,
  CUSTO_HORA_ADMINISTRATIVO,
  DIAS_DE_FECHAMENTO,
  DOCUMENTOS_POR_MES,
  FATURAMENTO_MEDIO,
  MINUTOS_POR_DOCUMENTO,
  PESSOAS_NO_FECHAMENTO,
  PREMISSAS_DECLARADAS,
  TETO_SOBRE_FATURAMENTO,
  type Premissa,
} from './premissas';
import { vetorDe, type RespostasAnalise, type Vetor } from './modelo';
import type { FaixaFaturamento } from './perguntas';

/**
 * A FAIXA EM REAIS: SUSPENSA. NENHUMA PÁGINA IMPORTA ESTE ARQUIVO.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Isto é aritmética correta, testada, e fora do ar por decisão de produto.
 * Ela não foi apagada porque nada aqui está errado; ela foi desligada
 * porque a peça que ela alimentava não existe mais no site.
 *
 * POR QUÊ (briefing de marca §10.1):
 *
 *   A faixa saía de onze respostas que o próprio visitante declarou sobre a
 *   empresa dele. Por mais cuidadosa que seja a frase em volta, o que
 *   aparece na tela é uma cifra em reais que a casa publica sobre a empresa
 *   de quem lê, sem ter entrado lá. A trava 1 vale principalmente para os
 *   números que são nossos.
 *
 *   E essa peça exata já tinha sido aposentada uma vez, no abba-ops: o
 *   documento do Mapa de Vazamento especificava duas páginas abrindo com
 *   uma cifra estimada de dinheiro vazando, e foi substituído porque o
 *   produto nunca chegou a produzir isso.
 *
 * O QUE PRECISA ACONTECER PARA ELA VOLTAR:
 *
 *   Decisão dos sócios, e as três condições originais juntas: a conta
 *   aparece na mesma tela, o texto declara que a faixa saiu do que o
 *   visitante declarou, e em lugar nenhum ela é chamada de diagnóstico,
 *   assessment ou avaliação de prontidão.
 *
 * ENQUANTO ISSO:
 *
 *   Os testes deste arquivo continuam rodando em `tests/unit/modelo.test.ts`
 *   — inclusive o que tranca o teto de sanidade contra o faturamento, que
 *   já escondeu um piso inventado em uma de cada seis respostas. Uma
 *   aritmética suspensa e provada volta em uma linha. Uma aritmética
 *   suspensa e apodrecida volta em uma semana de depuração.
 *
 *   E a régua do revisor tranca a porta: um teste falha se qualquer arquivo
 *   de `src/app` ou `src/components` importar este módulo.
 * ════════════════════════════════════════════════════════════════════════
 */

/**
 * O faturamento saiu das perguntas quando a faixa foi suspensa: era a única
 * coisa que ele alimentava, e perguntar o faturamento de alguém para não
 * usar em nada é pior do que não perguntar. Ele continua declarado aqui
 * porque o teto de sanidade depende dele, e o teto volta junto com a faixa.
 */
export interface RespostasComFaturamento extends RespostasAnalise {
  readonly faturamento: FaixaFaturamento;
}

export interface Faixa {
  readonly min: number;
  readonly max: number;
}

export interface Estimativa {
  /** Faixa anual em reais. `null` quando não há aritmética possível. */
  readonly faixa: Faixa | null;
  readonly vetor: Vetor;
  readonly premissas: readonly Premissa[];
  readonly aviso: string;
  /** Por que a faixa não pôde ser calculada, quando for o caso. */
  readonly motivoSemFaixa?: string;
  /** Componentes da conta, para quem quiser conferir. Transparência é o produto. */
  readonly decomposicao: {
    readonly retrabalhoDocumental: Faixa;
    readonly atrasoDeFechamento: Faixa;
    readonly contingencia: Faixa;
    readonly tetoAplicado: boolean;
  } | null;
}

const MINUTOS_POR_HORA = 60;
/** Quanto de um dia extra de fechamento conta como dia perdido, no piso. */
const FRACAO_DE_DIA_PERDIDO = 0.5;
const MESES = 12;

function faixa(min: number, max: number): Faixa {
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

/**
 * Arredonda para ordem de grandeza — dois algarismos significativos.
 * "R$ 340 mil a R$ 890 mil" é honesto. "R$ 342.718" é uma mentira com
 * aparência de precisão, e o primeiro CFO competente desmonta.
 */
export function arredondarOrdemDeGrandeza(valor: number): number {
  if (valor <= 0) return 0;
  const magnitude = Math.floor(Math.log10(valor));
  const passo = Math.pow(10, Math.max(magnitude - 1, 0));
  return Math.round(valor / passo) * passo;
}

/**
 * Calcula a faixa anual de vazamento estimado.
 * Ver premissas.ts para a origem de cada constante.
 */
export function estimar(r: RespostasComFaturamento): Estimativa {
  const vetor = vetorDe(r);
  const base = {
    vetor,
    premissas: PREMISSAS_DECLARADAS,
    aviso: AVISO_DE_FAIXA,
  } as const;

  const docsPorMes = DOCUMENTOS_POR_MES[r.volume];
  if (docsPorMes === 0) {
    return {
      ...base,
      faixa: null,
      decomposicao: null,
      motivoSemFaixa:
        'Sem uma ordem de grandeza do volume de documentos, qualquer faixa que a gente publicasse seria chute com ' +
        'aparência de conta. Preferimos não publicar. Na conversa, essa é a primeira pergunta.',
    };
  }

  const [minPorDoc, maxPorDoc] = MINUTOS_POR_DOCUMENTO[r.toques];
  const [custoHoraMin, custoHoraMax] = CUSTO_HORA_ADMINISTRATIVO;

  // 1. Retrabalho no caminho do documento
  const horasMesMin = (docsPorMes * minPorDoc) / MINUTOS_POR_HORA;
  const horasMesMax = (docsPorMes * maxPorDoc) / MINUTOS_POR_HORA;
  const retrabalho = faixa(
    horasMesMin * custoHoraMin * MESES,
    horasMesMax * custoHoraMax * MESES,
  );

  // 2. Atraso de fechamento — dias acima da referência × pessoas × jornada
  const diasExtras = DIAS_DE_FECHAMENTO[r.fechamento];
  const pessoas = PESSOAS_NO_FECHAMENTO[r.colaboradores];
  const horasFechamentoMes = diasExtras * pessoas * 8;
  // O `0.5` no piso é assunção declarada (premissa p3 em premissas.ts): nem
  // todo dia extra de fechamento é dia inteiro perdido. Estava só neste
  // comentário; agora está na tela, porque premissa que o visitante não lê
  // não é premissa declarada.
  const atraso = faixa(
    horasFechamentoMes * custoHoraMin * MESES * FRACAO_DE_DIA_PERDIDO,
    horasFechamentoMes * custoHoraMax * MESES,
  );

  // 3. Contingência por latência da descoberta
  const [contMin, contMax] = CONTINGENCIA_POR_LATENCIA[r.latencia];
  const subtotalMin = retrabalho.min + atraso.min;
  const subtotalMax = retrabalho.max + atraso.max;
  const contingencia = faixa(subtotalMin * contMin, subtotalMax * contMax);

  let min = subtotalMin + contingencia.min;
  let max = subtotalMax + contingencia.max;

  /* Teto de sanidade contra o faturamento declarado.
     ────────────────────────────────────────────────────────────────────
     A versão anterior tinha um furo que ia direto na promessa do produto.
     Ela fazia:

         if (max > teto) { max = teto; }
         if (min > max)  { min = max * 0.35; }

     Aquele `0.35` não vinha de lugar nenhum. Não estava nas premissas
     declaradas, não estava na tela, e o visitante não tinha como refazer
     a conta — que é exatamente o que o site promete que ele consegue
     fazer. Medido sobre o espaço inteiro de respostas: das 12.000
     combinações que produzem faixa, 4.017 batem no teto e **1.849 (15,4%)
     recebiam esse mínimo inventado**. Uma em cada seis.

     Pior: a explicação na tela dizia só que "a ponta de cima foi cortada",
     então quem lesse concluiria, com razão, que a ponta de baixo continuava
     sendo a aritmética. Não continuava.

     A correção não inventa nada. Quando o teto corta o topo, o piso desce
     pelo MESMO fator — a faixa inteira é reescalada, e a razão entre as
     pontas, que é a aritmética, fica intacta. É uma operação só, e ela cabe
     numa frase que o visitante confere: "o topo foi cortado em 2,5% do
     faturamento declarado, e a faixa inteira foi reduzida na mesma
     proporção".

     O piso só é tocado quando precisa: se a aritmética já cabia embaixo do
     teto, ela fica como está. Reduzir um mínimo honesto seria inventar para
     baixo, o oposto do problema, mas invenção do mesmo jeito.          */
  const faturamento = FATURAMENTO_MEDIO[r.faturamento];
  let tetoAplicado = false;
  if (faturamento > 0) {
    const teto = faturamento * TETO_SOBRE_FATURAMENTO;
    if (max > teto) {
      const fator = teto / max;
      max = teto;
      tetoAplicado = true;
      // Só reescala o piso se ele também estourou o teto. `fator` é o mesmo
      // que encolheu o topo, então a razão entre as pontas não muda.
      if (min > max) min *= fator;
    }
  }

  return {
    ...base,
    faixa: faixa(arredondarOrdemDeGrandeza(min), arredondarOrdemDeGrandeza(max)),
    decomposicao: {
      retrabalhoDocumental: retrabalho,
      atrasoDeFechamento: atraso,
      contingencia,
      tetoAplicado,
    },
  };
}

/** Formata a faixa em reais, em ordem de grandeza legível. */
export function formatarFaixa(f: Faixa): string {
  return `${formatarReais(f.min)} a ${formatarReais(f.max)}`;
}

export function formatarReais(valor: number): string {
  if (valor >= 1_000_000) {
    const milhoes = valor / 1_000_000;
    const texto = milhoes >= 10 ? milhoes.toFixed(0) : milhoes.toFixed(1).replace('.', ',');
    return `R$ ${texto} milhões`;
  }
  if (valor >= 1_000) {
    return `R$ ${Math.round(valor / 1_000)} mil`;
  }
  return `R$ ${Math.round(valor)}`;
}
