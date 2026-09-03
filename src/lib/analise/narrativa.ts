import Anthropic from '@anthropic-ai/sdk';
import { EXPLICACAO_DO_VETOR, ROTULO_DO_VETOR, type Estimativa, type RespostasAnalise } from './modelo';

/**
 * A camada de linguagem da Análise ABBA.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A DIVISÃO DE TRABALHO, QUE É DOUTRINA E NÃO DETALHE DE IMPLEMENTAÇÃO:
 *
 *   modelo.ts    → produz O NÚMERO. Aritmética pura, auditável, testada.
 *   narrativa.ts → produz A PROSA em volta do número. Nunca o número.
 *
 * O modelo de linguagem escreve o vetor em linguagem de negócio e as
 * perguntas que só o cliente pode responder. Ele é proibido de citar
 * qualquer cifra, percentual ou estatística — e essa proibição não é só
 * uma instrução no prompt: `contemNumeroProibido()` verifica a saída e
 * descarta a geração inteira se um número escapar, caindo no texto
 * determinístico.
 *
 * Motivo: a casa vende prova auditável. Um número que saiu de um modelo de
 * linguagem não é auditável, e a primeira pessoa competente a perguntar
 * "de onde saiu isso?" derruba a peça inteira.
 * ────────────────────────────────────────────────────────────────────────
 */

export interface Narrativa {
  /** Uma frase dizendo por onde o dinheiro sai, na linguagem do cliente. */
  readonly vetorFrase: string;
  /** Três perguntas que só quem está dentro pode responder. */
  readonly perguntas: readonly string[];
  /** O que a gente olharia na avaliação profunda que não dá para ver de fora. */
  readonly oQueFaltaOlhar: string;
  /** De onde este texto veio — aparece no rodapé do resultado. */
  readonly origem: 'modelo' | 'deterministica';
}

export interface ContextoNarrativa {
  readonly empresa: string;
  readonly setor: string;
  readonly respostas: RespostasAnalise;
  readonly estimativa: Estimativa;
}

const MODELO = 'claude-opus-5';

/**
 * Rejeita qualquer saída que contenha cifra, percentual ou número grande.
 * Números pequenos por extenso ("três", "cinco") passam; dígitos que
 * pareçam quantidade financeira, não.
 */
export function contemNumeroProibido(texto: string): boolean {
  return (
    /R\$\s*[\d.,]/i.test(texto) ||
    /\d+\s*%/.test(texto) ||
    /\b\d{3,}\b/.test(texto) ||
    /\b\d+[.,]\d+\b/.test(texto) ||
    /\b(milh(ão|ões)|bilh(ão|ões))\b/i.test(texto)
  );
}

const INSTRUCOES = `Você escreve a prosa de abertura do Mapa de Vazamento da ABBA — uma consultoria brasileira de transformação em IA que vende uma coisa só: prova auditável.

O TOM DA CASA (não negociável):
- Português brasileiro. A conclusão vem antes da justificativa.
- Concreto: processo, prazo, papel. Nunca adjetivo de consultoria ("inovador", "disruptivo", "estratégico").
- Honesto sobre o que não se sabe. Respeitoso com a inteligência de quem lê — nada de didatismo.
- Frases curtas. Nada de "é importante ressaltar que", "vale destacar", "nesse sentido".

A REGRA ABSOLUTA:
Você NÃO escreve nenhum número. Nem cifra, nem percentual, nem quantidade, nem "milhões". O número já foi calculado por um modelo aritmético auditável e aparece ao lado do seu texto. Se você escrever um número, o texto inteiro é descartado.

O QUE VOCÊ ESCREVE:
1. vetorFrase — UMA frase dizendo por onde o dinheiro sai nesta empresa, específica ao que foi declarado. Não repita o rótulo do vetor; traduza-o para a operação descrita.
2. perguntas — TRÊS perguntas que só alguém de dentro pode responder e que mudariam a estimativa nos dois sentidos. Perguntas de operação, não de intenção. Nada de "qual é o seu objetivo com IA".
3. oQueFaltaOlhar — DUAS frases sobre o que a avaliação profunda veria e que não dá para ver de fora. Termine reconhecendo o limite, sem se desculpar.

Responda apenas com JSON válido, no formato:
{"vetorFrase": "...", "perguntas": ["...", "...", "..."], "oQueFaltaOlhar": "..."}`;

function descreverRespostas(c: ContextoNarrativa): string {
  const { respostas: r, estimativa } = c;
  return [
    `Empresa: ${c.empresa}`,
    `Setor declarado: ${c.setor}`,
    `Porte: ${r.colaboradores} colaboradores`,
    `Toques no caminho de um documento fiscal: ${r.toques}`,
    `Volume de documentos por mês: ${r.volume}`,
    `Dias de fechamento do mês: ${r.fechamento}`,
    `Existe número em reais já medido: ${r.numeroMedido}`,
    `Quando descobrem a perda: ${r.latencia}`,
    `Quem comemoraria uma melhora: ${r.patrocinador}`,
    `Histórico com IA: ${r.tentativa}`,
    `Candidato a dono depois da saída da ABBA: ${r.dono}`,
    `Obrigação com data pela frente: ${r.prazo}`,
    `Vetor identificado pelo modelo: ${ROTULO_DO_VETOR[estimativa.vetor]}`,
    estimativa.faixa
      ? 'O modelo produziu uma faixa em reais (você não a vê e não deve mencioná-la).'
      : 'O modelo NÃO produziu faixa, por falta de volume declarado. Reconheça isso na sua resposta.',
  ].join('\n');
}

/** Texto determinístico. É o que vai ao ar sem chave de API, e na falha. */
export function narrativaDeterministica(c: ContextoNarrativa): Narrativa {
  const { estimativa: e, respostas: r } = c;
  const perguntas: string[] = [];

  perguntas.push(
    r.toques === 'nao-sei'
      ? 'Quem, nominalmente, toca um documento fiscal entre a emissão e a baixa no financeiro — e em qual sistema cada pessoa trabalha?'
      : 'Em quais dessas passagens o dado é redigitado, e em quais ele viaja sozinho entre os sistemas?',
  );
  perguntas.push(
    r.numeroMedido === 'nao'
      ? 'Se vocês tivessem que escolher hoje um único número em reais para acompanhar toda semana, qual seria — e quem o assinaria?'
      : 'Esse número que vocês já medem está em sistema ou está na cabeça das pessoas? Dá para extrair a série dos últimos doze meses?',
  );
  perguntas.push(
    r.latencia === 'ano'
      ? 'Das perdas descobertas no ano passado, quantas ainda dava para recuperar quando apareceram?'
      : 'O que precisaria acontecer para vocês descobrirem a perda uma semana depois em vez de um mês?',
  );

  return {
    vetorFrase: EXPLICACAO_DO_VETOR[e.vetor],
    perguntas,
    oQueFaltaOlhar:
      'A avaliação profunda olha vinte e cinco dimensões, e quase todas exigem estar dentro: como a informação viaja ' +
      'separadamente do trabalho, onde as exceções consomem o dia, e quem tem poder de barrar uma mudança. ' +
      'Nada disso aparece de fora — esta leitura foi feita com o que você declarou e mais nada.',
    origem: 'deterministica',
  };
}

interface RespostaBruta {
  vetorFrase?: unknown;
  perguntas?: unknown;
  oQueFaltaOlhar?: unknown;
}

function validar(bruta: RespostaBruta): Omit<Narrativa, 'origem'> | null {
  const { vetorFrase, perguntas, oQueFaltaOlhar } = bruta;
  if (typeof vetorFrase !== 'string' || typeof oQueFaltaOlhar !== 'string') return null;
  if (!Array.isArray(perguntas) || perguntas.length === 0) return null;
  if (!perguntas.every((p): p is string => typeof p === 'string')) return null;

  const tudo = [vetorFrase, oQueFaltaOlhar, ...perguntas].join(' ');
  if (contemNumeroProibido(tudo)) return null;
  if (vetorFrase.length < 40 || vetorFrase.length > 600) return null;

  return { vetorFrase, perguntas: perguntas.slice(0, 3), oQueFaltaOlhar };
}

/**
 * Gera a narrativa com o modelo, caindo no texto determinístico em
 * qualquer falha — sem chave, erro de rede, JSON inválido, ou número
 * vazado na saída. O site nunca quebra por causa da API.
 */
export async function gerarNarrativa(c: ContextoNarrativa): Promise<Narrativa> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return narrativaDeterministica(c);
  }

  try {
    const client = new Anthropic();
    const resposta = await client.messages.create({
      model: MODELO,
      max_tokens: 4000,
      system: INSTRUCOES,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: descreverRespostas(c) }],
    });

    if (resposta.stop_reason === 'refusal') return narrativaDeterministica(c);

    const texto = resposta.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    const json = texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1);
    const validada = validar(JSON.parse(json) as RespostaBruta);
    if (!validada) return narrativaDeterministica(c);

    return { ...validada, origem: 'modelo' };
  } catch {
    // Silêncio deliberado: a causa da falha não interessa a quem está na
    // tela, e o texto determinístico é bom o bastante para publicar.
    return narrativaDeterministica(c);
  }
}
