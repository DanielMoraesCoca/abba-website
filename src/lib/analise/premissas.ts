/**
 * As premissas do modelo de estimativa.
 *
 * ────────────────────────────────────────────────────────────────────────
 * LEIA ISTO ANTES DE MEXER EM QUALQUER NÚMERO DESTE ARQUIVO.
 *
 * A regra da casa (base-de-evidencias.md) é: número externo só sai com
 * fonte primária, e só depois de registrado no abba-ops. Uma estimativa
 * feita de fora, porém, precisa assumir coisas — e a doutrina da casa
 * resolve isso do jeito certo: as premissas são NUMERADAS, DECLARADAS e
 * apresentadas junto do resultado, incluindo "o que assumimos e ainda não
 * sabemos".
 *
 * Por isso cada premissa aqui carrega um campo `tipo`:
 *
 *   'evidencia'  — número do cânone, com fonte externa conferível.
 *   'premissa'   — assunção da ABBA. NÃO é estatística. A tela mostra
 *                  isso com todas as letras, e a conversa de 45 minutos
 *                  existe justamente para corrigi-la.
 *
 * Nenhuma premissa deste arquivo pode ser apresentada como fato medido.
 * O componente que renderiza o resultado depende do `tipo` para escolher
 * o rótulo — não há caminho de código que exiba um número daqui sem dizer
 * o que ele é.
 *
 * PENDÊNCIA DE SÓCIO: as faixas de minutos e de custo/hora abaixo são a
 * calibragem inicial, deliberadamente conservadora. Elas precisam de um
 * "ok" dos sócios antes do site ir ao ar — está registrado em
 * docs/pendencias.md.
 * ────────────────────────────────────────────────────────────────────────
 */

export type TipoDePremissa = 'evidencia' | 'premissa';

export interface Premissa {
  readonly id: string;
  readonly tipo: TipoDePremissa;
  readonly texto: string;
  /** Fonte, quando `tipo` é 'evidencia'. Base do raciocínio, quando é 'premissa'. */
  readonly base: string;
}

/**
 * Minutos de retrabalho por documento fiscal, por faixa de toques.
 * Faixa sempre — [mínimo, máximo]. Nunca um ponto.
 *
 * Racional: cada quebra entre sistemas gera conferência, digitação de novo,
 * e-mail de dúvida e correção. O piso assume um fluxo já razoavelmente
 * arrumado; o teto assume o que a gente vê em operação com planilha no meio.
 */
export const MINUTOS_POR_DOCUMENTO = {
  'ate-2': [0.8, 2.0],
  '3-4': [2.5, 6.0],
  '5-plus': [6.0, 13.0],
  // Quem não sabe responder recebe a faixa do padrão do mercado, alargada
  // para os dois lados — não sabemos, e a estimativa tem que dizer isso.
  'nao-sei': [1.5, 9.0],
} as const satisfies Record<string, readonly [number, number]>;

/**
 * Custo por hora de trabalho administrativo-financeiro, já carregado
 * (salário + encargos + benefícios + estrutura), em reais.
 */
export const CUSTO_HORA_ADMINISTRATIVO: readonly [number, number] = [42, 78];

/** Ponto médio de documentos/mês por faixa declarada. */
export const DOCUMENTOS_POR_MES = {
  'ate-500': 300,
  '500-2k': 1_200,
  '2k-10k': 5_500,
  '10k-50k': 27_000,
  'acima-50k': 80_000,
  'nao-sei': 0, // sem volume não há aritmética; o resultado sai qualitativo
} as const satisfies Record<string, number>;

/**
 * Dias de fechamento acima da referência de 3 dias úteis, e quantas pessoas
 * a mais o atraso costuma ocupar. Vira horas, e horas viram reais.
 */
export const DIAS_DE_FECHAMENTO = {
  'ate-3': 0,
  '4-7': 2.5,
  '8-15': 8,
  'acima-15': 14,
  'nao-sei': 4,
} as const satisfies Record<string, number>;

export const PESSOAS_NO_FECHAMENTO = {
  'ate-50': 2,
  '51-200': 4,
  '201-500': 7,
  '501-2000': 12,
  'acima-2000': 20,
} as const satisfies Record<string, number>;

/**
 * Contingência por latência da descoberta: percentual somado à faixa.
 * Quanto mais tarde o erro aparece, mais caro ele já ficou — multa, juros,
 * crédito perdido por decadência, retrabalho de exercício fechado.
 */
export const CONTINGENCIA_POR_LATENCIA = {
  mes: [0.02, 0.06],
  trimestre: [0.06, 0.15],
  ano: [0.14, 0.32],
  'nao-sei': [0.08, 0.25],
} as const satisfies Record<string, readonly [number, number]>;

/**
 * Teto de sanidade: a faixa superior nunca passa deste percentual do
 * faturamento declarado. Existe para impedir que uma combinação improvável
 * de respostas produza um número absurdo — um mapa inflado vende uma
 * reunião e perde a relação.
 */
export const TETO_SOBRE_FATURAMENTO = 0.025;

/** Ponto médio do faturamento anual declarado, em reais. */
export const FATURAMENTO_MEDIO = {
  'ate-10m': 6_000_000,
  '10-50m': 28_000_000,
  '50-200m': 110_000_000,
  '200-1b': 520_000_000,
  'acima-1b': 1_600_000_000,
  'prefiro-nao-dizer': 0,
} as const satisfies Record<string, number>;

/** As premissas que aparecem na tela, na ordem em que aparecem. */
export const PREMISSAS_DECLARADAS: readonly Premissa[] = [
  {
    id: 'p1',
    tipo: 'premissa',
    texto:
      'Cada troca de sistema ou de mão no caminho de um documento fiscal custa alguns minutos de conferência, ' +
      'digitação repetida e correção. A faixa usada aqui vai de menos de um minuto, num fluxo arrumado, ' +
      'a pouco mais de doze, num fluxo com planilha no meio.',
    base:
      'Assunção da ABBA, calibrada pela nossa leitura de operações de médio porte. Não é estatística medida: ' +
      'é a primeira coisa que a conversa de 45 minutos corrige.',
  },
  {
    id: 'p2',
    tipo: 'premissa',
    texto:
      'A hora de trabalho administrativo-financeiro, já carregada com encargos, benefícios e estrutura, ' +
      'custa entre R$ 42 e R$ 78 no médio porte brasileiro.',
    base:
      'Assunção da ABBA a partir de faixas salariais públicas do mercado, com carga de encargos do regime mais comum. ' +
      'Se a sua folha for diferente, a faixa inteira anda junto.',
  },
  {
    id: 'p3',
    tipo: 'premissa',
    texto:
      'Um dia a mais de fechamento contábil não é um dia inteiro de trabalho perdido. No piso da faixa, ' +
      'contamos metade de cada dia extra; no topo, o dia inteiro.',
    base:
      'Assunção da ABBA. Ela existe para o piso não herdar o pior caso de todas as parcelas ao mesmo tempo: ' +
      'uma faixa em que as duas pontas são cenários extremos não informa nada.',
  },
  {
    id: 'p4',
    tipo: 'premissa',
    texto:
      'A estimativa nunca é publicada acima de 2,5% do faturamento que você declarou. Se a soma das parcelas ' +
      'passar disso, o topo é cortado nesse limite e a faixa inteira desce na mesma proporção: a razão entre ' +
      'as duas pontas, que é a aritmética, fica intacta.',
    base:
      'Trava de sanidade da ABBA. Uma combinação improvável de respostas pode somar um número absurdo, e publicar ' +
      'absurdo com aparência de conta é pior do que não publicar. Quando a trava dispara, a barra mostra onde ela ' +
      'cortou, e é sinal de que a conversa vale muito mais que a conta.',
  },
  {
    id: 'p5',
    tipo: 'evidencia',
    texto:
      'A causa nº 1 de fracasso em projetos de IA não é técnica: é começar sem combinar, antes, qual seria o critério de sucesso. ' +
      'Por isso esta estimativa é o começo de uma conversa sobre a métrica, não uma promessa de captura.',
    base: 'RAND, “The Root Causes of Failure for AI Projects” (2024): 65 entrevistas com engenheiros de ML sêniores.',
  },
] as const;

/** O aviso de faixa. Texto fixo — não editar sem passar pelo abba-ops. */
export const AVISO_DE_FAIXA =
  'Isto foi calculado de fora, com o que você declarou nesta tela e nada mais. Uma única resposta sua na conversa ' +
  'pode mover a faixa nos dois sentidos: para cima ou para baixo. E a ABBA não captura a faixa inteira: o que se ' +
  'captura é uma fração dela, e isso a gente diz em voz alta antes de qualquer proposta.';
