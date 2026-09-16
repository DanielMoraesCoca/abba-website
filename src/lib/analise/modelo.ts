import type {
  Dono,
  FaixaColaboradores,
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
 * A leitura da Primeira Leitura: o vetor e o teste do alvo.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Este módulo é determinístico de ponta a ponta. Entram onze respostas
 * fechadas, sai uma leitura nomeada e um próximo passo, por regra escrita,
 * sem modelo de linguagem no caminho. A prosa em volta vem depois, em
 * narrativa.ts, e nunca decide nada.
 *
 * O que NÃO está mais aqui é a faixa em reais. Ela foi para
 * `faixa-suspensa.ts`, fora do caminho de qualquer página, e o comentário
 * de lá explica por quê. A regra que sobra é curta: esta peça não publica
 * número sobre a empresa de quem lê.
 * ──────────────────────────────────────────────────────────────────────── */

export interface RespostasAnalise {
  readonly colaboradores: FaixaColaboradores;
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

/** Placar do teste do alvo: 0 a 6. Não é nota de crédito — é leitura de estágio. */
export interface Qualificacao {
  readonly placar: number;
  readonly maximo: 6;
  readonly leitura: 'alvo-cheio' | 'alvo-real' | 'ainda-nao';
  readonly titulo: string;
  readonly texto: string;
  readonly proximoPasso: string;
}

/**
 * Por onde o dinheiro sai, segundo o que foi declarado. A ordem dos testes
 * é a ordem de prioridade: não medir vem antes de tudo, porque sem número
 * medido nenhum dos outros vetores pode sequer ser demonstrado.
 */
export function vetorDe(r: RespostasAnalise): Vetor {
  if (r.numeroMedido === 'nao') return 'ausencia-de-medicao';
  if (r.latencia === 'ano') return 'latencia-da-descoberta';
  if (r.toques === '5-plus') return 'retrabalho-fiscal';
  if (r.fechamento === '8-15' || r.fechamento === 'acima-15') return 'imposto-da-coordenacao';
  return 'retrabalho-fiscal';
}

export const ROTULO_DO_VETOR: Record<Vetor, string> = {
  'retrabalho-fiscal': 'Retrabalho no caminho do documento fiscal',
  'latencia-da-descoberta': 'Latência da descoberta: o erro só aparece quando já custou caro',
  'imposto-da-coordenacao': 'Imposto da coordenação: o fechamento paga a conta da fricção',
  'ausencia-de-medicao': 'Ausência de medição: o vazamento existe e ninguém consegue vê-lo',
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
    'Sem um número medido não existe prova possível: só depoimento. Este é o vazamento que precisa ser resolvido ' +
    'primeiro, porque sem ele nenhum dos outros pode ser demonstrado.',
};

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
        'A conversa de 45 minutos, e o assessment da sua empresa chega feito, não oferecido, entregue.',
    };
  }

  if (arredondado >= 3) {
    return {
      placar: arredondado,
      maximo: 6,
      leitura: 'alvo-real',
      titulo: 'Vocês são alvo real: ainda não maduro, e isso não é crítica.',
      texto:
        'Falta pelo menos uma das condições que sustentam a prova: patrocínio na diretoria, um número já medido, ' +
        'ou um candidato a dono. Começar antes disso é começar sem critério de sucesso: a causa nº 1 de fracasso ' +
        'medida pela RAND.',
      proximoPasso:
        'O assessment gratuito agora, e a conversa sobre qual dessas condições dá para destravar primeiro.',
    };
  }

  return {
    placar: arredondado,
    maximo: 6,
    leitura: 'ainda-nao',
    titulo: 'Hoje, provavelmente, não somos a escolha certa para vocês.',
    texto:
      'É melhor dizer isso agora do que descobrir no mês quatro. Sem patrocinador, sem número medido e sem candidato ' +
      'a dono, o trabalho não instala capacidade: vira dependência, e é exatamente o que a gente recusa fazer.',
    proximoPasso:
      'Ainda assim, o assessment da sua empresa é seu, de graça. E a condição que falta está nomeada acima: quando ela mudar, ' +
      'a conversa muda junto.',
  };
}
