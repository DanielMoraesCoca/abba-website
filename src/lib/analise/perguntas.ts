/**
 * As perguntas da Análise ABBA na web.
 *
 * Origem: abba-ops/03-comercial/mapa-de-vazamento.md (as 5 perguntas da
 * conversa de 45 min) + abba-ops/00-identidade/alvo.md (o teste do alvo).
 *
 * Desenho: as perguntas do Mapa foram traduzidas de abertas para fechadas,
 * porque a versão web não tem um sócio do outro lado para interpretar
 * resposta livre. A conversa de 45 minutos continua existindo e continua
 * sendo onde a estimativa fica defensável — o site diz isso explicitamente
 * na tela de resultado. Nada aqui substitui aquela conversa.
 */

export interface Opcao<T extends string> {
  readonly valor: T;
  readonly rotulo: string;
  /** Texto curto que ajuda quem responde a se localizar. */
  readonly nota?: string;
}

export interface PerguntaFechada<T extends string> {
  readonly id: string;
  readonly titulo: string;
  readonly ajuda?: string;
  readonly opcoes: readonly Opcao<T>[];
}

// ---------------------------------------------------------------------------
// Bloco 1 — a empresa
// ---------------------------------------------------------------------------

export const FAIXAS_COLABORADORES = [
  { valor: 'ate-50', rotulo: 'Até 50 pessoas' },
  { valor: '51-200', rotulo: 'De 51 a 200' },
  { valor: '201-500', rotulo: 'De 201 a 500' },
  { valor: '501-2000', rotulo: 'De 501 a 2.000' },
  { valor: 'acima-2000', rotulo: 'Mais de 2.000' },
] as const;
export type FaixaColaboradores = (typeof FAIXAS_COLABORADORES)[number]['valor'];

export const FAIXAS_FATURAMENTO = [
  { valor: 'ate-10m', rotulo: 'Até R$ 10 milhões' },
  { valor: '10-50m', rotulo: 'De R$ 10 a 50 milhões' },
  { valor: '50-200m', rotulo: 'De R$ 50 a 200 milhões' },
  { valor: '200-1b', rotulo: 'De R$ 200 milhões a 1 bilhão' },
  { valor: 'acima-1b', rotulo: 'Acima de R$ 1 bilhão' },
  { valor: 'prefiro-nao-dizer', rotulo: 'Prefiro não dizer' },
] as const;
export type FaixaFaturamento = (typeof FAIXAS_FATURAMENTO)[number]['valor'];

// ---------------------------------------------------------------------------
// Bloco 2 — as cinco perguntas do Mapa de Vazamento
// ---------------------------------------------------------------------------

/** P1. "Me conta o caminho de uma nota fiscal aí dentro, do pedido ao pagamento." */
export const P_TOQUES = {
  id: 'toques',
  titulo: 'Do pedido ao pagamento, por quantos sistemas ou pessoas um documento passa?',
  ajuda: 'Conte cada troca de mão e cada troca de sistema — inclusive planilha e e-mail.',
  opcoes: [
    { valor: 'ate-2', rotulo: 'Até 2', nota: 'Fluxo curto, geralmente dentro de um ERP só' },
    { valor: '3-4', rotulo: 'De 3 a 4', nota: 'O padrão do médio porte brasileiro' },
    { valor: '5-plus', rotulo: '5 ou mais', nota: 'Cada quebra entre sistemas é retrabalho' },
    { valor: 'nao-sei', rotulo: 'Não sei dizer', nota: 'Resposta legítima — e já é um achado' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Toques = (typeof P_TOQUES)['opcoes'][number]['valor'];

/** P2. "O que mais atrasa o fechamento do mês? Quanto tempo ele leva hoje?" */
export const P_FECHAMENTO = {
  id: 'fechamento',
  titulo: 'Quantos dias úteis leva o fechamento do mês?',
  ajuda: 'O fechamento é o termômetro universal de fricção financeira — vale em qualquer setor.',
  opcoes: [
    { valor: 'ate-3', rotulo: 'Até 3 dias' },
    { valor: '4-7', rotulo: 'De 4 a 7 dias' },
    { valor: '8-15', rotulo: 'De 8 a 15 dias' },
    { valor: 'acima-15', rotulo: 'Mais de 15 dias' },
    { valor: 'nao-sei', rotulo: 'Não sei dizer' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Fechamento = (typeof P_FECHAMENTO)['opcoes'][number]['valor'];

/** P3. "Tem algum número em reais que dói hoje e que vocês já medem?" */
export const P_NUMERO_MEDIDO = {
  id: 'numeroMedido',
  titulo: 'Existe hoje um número em reais que dói — e que vocês já medem?',
  ajuda:
    'Esta é a pergunta mais importante das seis. Sem um número medido, não existe prova possível — só depoimento.',
  opcoes: [
    { valor: 'sim', rotulo: 'Sim, medimos e acompanhamos' },
    { valor: 'parcial', rotulo: 'Existe o número, mas a medição é frouxa' },
    { valor: 'nao', rotulo: 'Não. A dor é real, mas não está medida' },
  ],
} as const satisfies PerguntaFechada<string>;
export type NumeroMedido = (typeof P_NUMERO_MEDIDO)['opcoes'][number]['valor'];

/** P4. "Quando vocês descobrem que perderam dinheiro?" */
export const P_LATENCIA = {
  id: 'latencia',
  titulo: 'Quando vocês descobrem que perderam dinheiro?',
  ajuda: 'A latência da descoberta é onde o vazamento vive escondido.',
  opcoes: [
    { valor: 'mes', rotulo: 'No mesmo mês' },
    { valor: 'trimestre', rotulo: 'No trimestre' },
    { valor: 'ano', rotulo: 'No ano seguinte — geralmente na auditoria ou no fisco' },
    { valor: 'nao-sei', rotulo: 'Sinceramente, não sei' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Latencia = (typeof P_LATENCIA)['opcoes'][number]['valor'];

/** P5. "Se esse número melhorasse 20%, quem na empresa comemoraria?" */
export const P_PATROCINADOR = {
  id: 'patrocinador',
  titulo: 'Se esse número melhorasse 20%, quem na empresa comemoraria?',
  ajuda: 'Identifica o patrocinador real — que quase nunca é quem marcou a reunião.',
  opcoes: [
    { valor: 'diretoria', rotulo: 'A diretoria ou o dono' },
    { valor: 'financeiro', rotulo: 'O financeiro ou o controller' },
    { valor: 'operacao', rotulo: 'A operação ou a gerência de área' },
    { valor: 'ti', rotulo: 'A TI' },
    { valor: 'ninguem', rotulo: 'Ninguém claramente' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Patrocinador = (typeof P_PATROCINADOR)['opcoes'][number]['valor'];

// ---------------------------------------------------------------------------
// Bloco 3 — o teste do alvo (o que qualifica, e o que faz a gente dizer não)
// ---------------------------------------------------------------------------

export const P_TENTATIVA = {
  id: 'tentativa',
  titulo: 'O que já tentaram com IA — e o que aconteceu depois do piloto?',
  opcoes: [
    { valor: 'producao', rotulo: 'Temos coisa em produção, rodando de verdade' },
    { valor: 'piloto-parou', rotulo: 'Fizemos piloto e ele não virou operação' },
    { valor: 'ferramentas-soltas', rotulo: 'As pessoas usam ferramentas por conta própria' },
    { valor: 'nada', rotulo: 'Ainda não tentamos nada estruturado' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Tentativa = (typeof P_TENTATIVA)['opcoes'][number]['valor'];

export const P_DONO = {
  id: 'dono',
  titulo: 'Quem, aí dentro, ficaria dono disso depois que a gente saísse?',
  ajuda: 'Sem candidato a dono, a capacidade não fica instalada — e a gente não aceita o trabalho.',
  opcoes: [
    { valor: 'nomeado', rotulo: 'Tem pessoa com nome e cara' },
    { valor: 'area', rotulo: 'Uma área ficaria, sem pessoa definida' },
    { valor: 'ninguem', rotulo: 'Honestamente, ninguém' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Dono = (typeof P_DONO)['opcoes'][number]['valor'];

export const P_PRAZO = {
  id: 'prazo',
  titulo: 'Existe alguma obrigação com data pela frente?',
  ajuda:
    'Reforma tributária, fiscalização, cláusula de cliente grande, certificação. Prazo externo não elimina ninguém — ordena a fila.',
  opcoes: [
    { valor: 'sim-12m', rotulo: 'Sim, nos próximos 12 meses' },
    { valor: 'sim-depois', rotulo: 'Sim, mas mais adiante' },
    { valor: 'nao', rotulo: 'Nada nos pressiona hoje' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Prazo = (typeof P_PRAZO)['opcoes'][number]['valor'];

/** Volume de documentos fiscais — a alavanca aritmética da estimativa. */
export const P_VOLUME = {
  id: 'volume',
  titulo: 'Quantos documentos fiscais a empresa emite ou recebe por mês?',
  ajuda:
    'Notas de entrada e de saída somadas, em ordem de grandeza. Se não souber, escolha a faixa mais próxima do seu palpite.',
  opcoes: [
    { valor: 'ate-500', rotulo: 'Até 500' },
    { valor: '500-2k', rotulo: 'De 500 a 2 mil' },
    { valor: '2k-10k', rotulo: 'De 2 mil a 10 mil' },
    { valor: '10k-50k', rotulo: 'De 10 mil a 50 mil' },
    { valor: 'acima-50k', rotulo: 'Mais de 50 mil' },
    { valor: 'nao-sei', rotulo: 'Não sei dizer' },
  ],
} as const satisfies PerguntaFechada<string>;
export type Volume = (typeof P_VOLUME)['opcoes'][number]['valor'];
