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
import type {
  Dono,
  FaixaColaboradores,
  FaixaFaturamento,
  Fechamento,
  Latencia,
  NumeroMedido,
  Patrocinador,
  Prazo,
  Tentativa,
  Toques,
  Volume,
} from './perguntas';

/**
 * O modelo de estimativa do Mapa de Vazamento — versão web.
 *
 * É aritmética, não IA. Isto é deliberado e é o ponto do produto: o número
 * sai de uma conta que qualquer CFO consegue refazer no guardanapo, com as
 * premissas na mesa. O modelo de linguagem entra depois, e só escreve a
 * prosa em volta (o vetor e as perguntas) — ele nunca produz, ajusta ou
 * arredonda o número. Um número gerado por LLM não seria auditável, e a
 * casa vende auditabilidade.
 *
 * As cinco regras de honestidade (mapa-de-vazamento.md) estão codificadas:
 *   1. faixa, nunca ponto            → `faixa: [min, max]`, sempre
 *   2. premissa sem fonte não entra  → `Premissa.base` é obrigatório
 *   3. a faixa pode ser pequena      → nenhum piso artificial
 *   4. nunca prometer captura total  → `AVISO_DE_FAIXA`, sempre renderizado
 *   5. sem dado de cliente no doc    → nada aqui persiste sem consentimento
 */

export interface RespostasAnalise {
  readonly colaboradores: FaixaColaboradores;
  readonly faturamento: FaixaFaturamento;
  readonly volume: Volume;
  readonly toques: Toques;
  readonly fechamento: Fechamento;
  readonly numeroMedido: NumeroMedido;
  readonly latencia: Latencia;
  readonly patrocinador: Patrocinador;
  readonly tentativa: Tentativa;
  readonly dono: Dono;
  readonly prazo: Prazo;
}

export type Vetor =
  | 'retrabalho-fiscal'
  | 'latencia-da-descoberta'
  | 'imposto-da-coordenacao'
  | 'ausencia-de-medicao';

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

/** Placar do teste do alvo: 0 a 6. Não é nota de crédito — é leitura de estágio. */
export interface Qualificacao {
  readonly placar: number;
  readonly maximo: 6;
  readonly leitura: 'alvo-cheio' | 'alvo-real' | 'ainda-nao';
  readonly titulo: string;
  readonly texto: string;
  readonly proximoPasso: string;
}

const MINUTOS_POR_HORA = 60;
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

function escolherVetor(r: RespostasAnalise): Vetor {
  if (r.numeroMedido === 'nao') return 'ausencia-de-medicao';
  if (r.latencia === 'ano') return 'latencia-da-descoberta';
  if (r.toques === '5-plus') return 'retrabalho-fiscal';
  if (r.fechamento === '8-15' || r.fechamento === 'acima-15') return 'imposto-da-coordenacao';
  return 'retrabalho-fiscal';
}

export const ROTULO_DO_VETOR: Record<Vetor, string> = {
  'retrabalho-fiscal': 'Retrabalho no caminho do documento fiscal',
  'latencia-da-descoberta': 'Latência da descoberta — o erro só aparece quando já custou caro',
  'imposto-da-coordenacao': 'Imposto da coordenação — o fechamento paga a conta da fricção',
  'ausencia-de-medicao': 'Ausência de medição — o vazamento existe e ninguém consegue vê-lo',
};

export const EXPLICACAO_DO_VETOR: Record<Vetor, string> = {
  'retrabalho-fiscal':
    'O dinheiro sai em conferência repetida, digitação de novo e correção a cada quebra entre sistemas. ' +
    'É o vazamento mais comum e o mais fácil de medir, porque deixa rastro em cada documento.',
  'latencia-da-descoberta':
    'Descobrir a perda no ano seguinte é caro por três vias somadas: a perda original, o custo de corrigi-la fora do ' +
    'exercício, e o que já não dá mais para recuperar. É onde o vazamento vive escondido.',
  'imposto-da-coordenacao':
    'O fechamento longo não é causa, é sintoma: ele é o lugar onde toda a fricção do mês se acumula e cobra a conta ' +
    'em horas de gente cara. Eliminar coordenação costuma render mais que automatizar tarefa.',
  'ausencia-de-medicao':
    'Sem um número medido não existe prova possível — só depoimento. Este é o vazamento que precisa ser resolvido ' +
    'primeiro, porque sem ele nenhum dos outros pode ser demonstrado.',
};

/**
 * Calcula a faixa anual de vazamento estimado.
 * Ver premissas.ts para a origem de cada constante.
 */
export function estimar(r: RespostasAnalise): Estimativa {
  const vetor = escolherVetor(r);
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
  const atraso = faixa(
    horasFechamentoMes * custoHoraMin * MESES * 0.5, // metade: nem todo dia extra é dia perdido
    horasFechamentoMes * custoHoraMax * MESES,
  );

  // 3. Contingência por latência da descoberta
  const [contMin, contMax] = CONTINGENCIA_POR_LATENCIA[r.latencia];
  const subtotalMin = retrabalho.min + atraso.min;
  const subtotalMax = retrabalho.max + atraso.max;
  const contingencia = faixa(subtotalMin * contMin, subtotalMax * contMax);

  let min = subtotalMin + contingencia.min;
  let max = subtotalMax + contingencia.max;

  // Teto de sanidade contra o faturamento declarado.
  const faturamento = FATURAMENTO_MEDIO[r.faturamento];
  let tetoAplicado = false;
  if (faturamento > 0) {
    const teto = faturamento * TETO_SOBRE_FATURAMENTO;
    if (max > teto) {
      max = teto;
      tetoAplicado = true;
    }
    if (min > max) min = max * 0.35;
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

/**
 * O teste do alvo, aplicado às respostas.
 * Origem: abba-ops/00-identidade/alvo.md — 5 perguntas + 1 de calendário.
 *
 * A leitura é publicada para quem responde, inclusive quando ela é "hoje
 * não somos a escolha certa". Recusa nomeada, não disfarçada.
 */
export function qualificar(r: RespostasAnalise): Qualificacao {
  let placar = 0;
  if (r.patrocinador === 'diretoria' || r.patrocinador === 'financeiro') placar += 1;
  if (r.tentativa === 'piloto-parou' || r.tentativa === 'producao') placar += 1;
  if (r.numeroMedido === 'sim') placar += 1;
  else if (r.numeroMedido === 'parcial') placar += 0.5;
  if (r.dono === 'nomeado') placar += 1;
  else if (r.dono === 'area') placar += 0.5;
  if (r.volume !== 'nao-sei' && r.toques !== 'nao-sei') placar += 1;
  if (r.prazo === 'sim-12m') placar += 1;
  else if (r.prazo === 'sim-depois') placar += 0.5;

  const arredondado = Math.round(placar * 2) / 2;

  if (arredondado >= 5) {
    return {
      placar: arredondado,
      maximo: 6,
      leitura: 'alvo-cheio',
      titulo: 'Vocês estão prontos para a conversa inteira.',
      texto:
        'Há patrocinador com poder, há um número medido e há alguém que fica dono depois que a gente sai. ' +
        'São as três condições que fazem a diferença entre capacidade instalada e mais um projeto.',
      proximoPasso:
        'A conversa de 45 minutos, e o Mapa de Vazamento completo chega feito — não oferecido, entregue.',
    };
  }

  if (arredondado >= 3) {
    return {
      placar: arredondado,
      maximo: 6,
      leitura: 'alvo-real',
      titulo: 'Vocês são alvo real — ainda não maduro, e isso não é crítica.',
      texto:
        'Falta pelo menos uma das condições que sustentam a prova: patrocínio na diretoria, um número já medido, ' +
        'ou um candidato a dono. Começar antes disso é começar sem critério de sucesso — a causa nº 1 de fracasso ' +
        'medida pela RAND.',
      proximoPasso:
        'O Mapa de Vazamento agora, e a conversa sobre qual dessas condições dá para destravar primeiro.',
    };
  }

  return {
    placar: arredondado,
    maximo: 6,
    leitura: 'ainda-nao',
    titulo: 'Hoje, provavelmente, não somos a escolha certa para vocês.',
    texto:
      'É melhor dizer isso agora do que descobrir no mês quatro. Sem patrocinador, sem número medido e sem candidato ' +
      'a dono, o trabalho não instala capacidade — vira dependência, e é exatamente o que a gente recusa fazer.',
    proximoPasso:
      'Ainda assim, o Mapa de Vazamento é seu, de graça. E a condição que falta está nomeada acima: quando ela mudar, ' +
      'a conversa muda junto.',
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
