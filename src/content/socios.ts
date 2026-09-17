/**
 * OS SÓCIOS, A PORTA DE UMA VIA, E A TRAVA DA PARTE RELACIONADA.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Origem: abba-ops, decisão V5o (17/09). A página de sócios existe porque a
 * trava 4 tira caso, depoimento e logo de cliente, e sem nenhuma dessas
 * coisas o site não tem PROVA HUMANA nenhuma. Uma casa cujo argumento é
 * "assinado por gente", sem gente, é uma contradição que o leitor sente
 * antes de saber nomear.
 *
 * `SOCIOS_PUBLICOS = false` é o mesmo mecanismo do preço, e pelo mesmo
 * motivo: nome de pessoa em material externo é porta de uma via. Enquanto
 * for falso, a rota existe e não é linkada de lugar nenhum, não entra no
 * mapa do site, e pede para não ser indexada. Publicar é um booleano, e os
 * testes em `tests/unit/conteudo.test.ts` obrigam quem mudar a registrar a
 * decisão no mesmo commit e recusam a publicação com buraco aberto.
 *
 * ════════════════════════════════════════════════════════════════════════
 * A TRAVA QUE GOVERNA A BIO DO PEDRO (abba-ops, V4g item d)
 *
 * O Pedro tem vínculo profissional com o fornecedor cuja tecnologia a ABBA
 * implanta. A decisão registrada é clara sobre a consequência: afirmar esse
 * vínculo em público faria o guardião do cliente (jurídico, DPO,
 * controladoria) enxergar PARTE RELACIONADA, e a independência é o produto
 * que esta casa vende. Declarar o vínculo é decisão futura dos sócios COM
 * ADVOGADO, exige política escrita de conflito de interesse, e não é decisão
 * de marketing.
 *
 * Uma página de sócios é exatamente onde esse leitor chega, e exatamente
 * quando ele está avaliando se a prova é independente. E uma bio
 * profissional puxa o cargo de origem por instinto, porque é isso que uma
 * bio faz. Por isso a trava tem TRÊS partes, e a terceira é a que escapa:
 *
 *   1. A bio do Pedro NÃO nomeia o fornecedor.
 *   2. E não o GESTICULA. "Experiência em uma das principais plataformas de
 *      agentes" é PIOR que a menção: convida a pergunta e parece esconder.
 *   3. Ela descreve o que ele RESPONDE DENTRO DA ABBA, que é o que a página
 *      promete mostrar e é verdade inteira por si.
 *
 * Vale igual para foto, legenda e dado estruturado. Não existe dado
 * estruturado de pessoa nesta página, e não pode passar a existir sem
 * passar por esta trava.
 *
 * `tests/unit/conteudo.test.ts` guarda as três partes: toda linha começa em
 * "Responde", e o vocabulário de gesticulação é recusado por padrão.
 *
 * ════════════════════════════════════════════════════════════════════════
 * O QUE AINDA FALTA, E POR QUÊ
 *
 * As duas linhas abaixo são RASCUNHO, não texto aprovado. Elas saíram da
 * matriz de chapéus (P6, abba-ops 01-setores/README.md), que já diz de que
 * cada sócio responde, e por isso são fiéis: o Daniel tem Comercial,
 * Entrega e Financeiro-Admin; o Pedro tem Capacitação e Tecnologia, e
 * Tecnologia inclui segurança. Os sócios aprovam antes de publicar.
 *
 * E falta o nome completo do Daniel. O primeiro nome está no CLAUDE.md
 * deste repositório; o resto, não. Inferir sobrenome de nome de usuário do
 * GitHub não é fonte para nome em site público, e nome errado numa página de
 * sócios é o tipo de erro que o leitor nunca esquece.
 * ════════════════════════════════════════════════════════════════════════
 */

/** Porta de uma via. Ver o cabeçalho, e V5o no abba-ops. */
export const SOCIOS_PUBLICOS = false;

/**
 * A bio compartilhada, adaptada do `posicionamento.md` para a régua do site.
 *
 * Duas adaptações, e as duas precisam de conferência dos sócios. A linha
 * aprovada termina em "instalamos os 70% que todo fornecedor de IA ignora":
 * os 70/30 são tese da casa e não estatística (trava 6), e a forma aprovada
 * para o site (§10.8) é a frase em corpo de texto, nunca o numeral solto. O
 * numeral saiu e o argumento ficou. "Mid-market" virou "médio porte", que é
 * o que o resto do site fala.
 */
export const BIO_DA_CASA =
  'Sócio-fundador da ABBA, consultoria de transformação em IA para o médio porte brasileiro. ' +
  'Instalamos a parte que o mercado não vende.';

export interface Socio {
  readonly id: string;
  readonly nome: string;
  /**
   * De que esta pessoa responde DENTRO da ABBA. Começa em "Responde" por
   * contrato, e a razão está na trava do cabeçalho: uma linha que começa
   * assim descreve um chapéu; uma que começa em "Com X anos de" descreve um
   * currículo, e currículo puxa o cargo de origem.
   *
   * Sem prêmio, sem anos de mercado, sem adjetivo.
   */
  readonly linha: string;
  /** Rascunho aguardando aprovação dos sócios. Bloqueia a publicação. */
  readonly linhaEmRascunho: boolean;
}

export const SOCIOS = [
  {
    id: 'daniel',
    nome: '[PRECISA DE NOME COMPLETO]',
    linha:
      'Responde pelo que a ABBA promete ao cliente: a primeira conversa, o número combinado antes, ' +
      'e o resultado que volta medido. É quem senta na mesa do primeiro contato ao conselho.',
    linhaEmRascunho: true,
  },
  {
    id: 'pedro',
    nome: 'Pedro Moura',
    linha:
      'Responde pelo que a ABBA constrói e pelo que ela ensina: o software que mede, a plataforma ' +
      'em que o time do cliente aprende, e a segurança dos dois.',
    linhaEmRascunho: true,
  },
] as const satisfies readonly Socio[];

/**
 * Vocabulário que gesticula para um vínculo sem nomeá-lo. É a parte 2 da
 * trava, e a mais fácil de introduzir com boa intenção: quem "melhorar" uma
 * bio daqui a seis meses vai querer somar credibilidade de origem, e é
 * exatamente isso que a decisão dos sócios proíbe até haver política escrita
 * de conflito de interesse.
 */
export const GESTICULA_VINCULO: readonly RegExp[] = [
  /uma das (principais|maiores|líderes)/i,
  /líder (de|do) mercado/i,
  /gigante (de|da|do)/i,
  /big ?tech/i,
  /gestor|executivo|diretor|vice-presidente|head\b|c[toe]o\b/i,
  /\bex-/i,
  /experiência (em|na|no|com) (uma|um|as|os)/i,
  /passagem (por|pela|pelo)/i,
  /vem d[ao]s?\b|veio d[ao]s?\b/i,
  /fornecedor|plataforma de agentes|de dentro da ind[úu]stria/i,
];

/** O que ainda falta preencher. Usado pela página para se recusar a ir ao ar. */
export function faltaPreencher(): readonly string[] {
  const buracos: string[] = [];
  for (const socio of SOCIOS) {
    if (socio.nome.includes('[PRECISA')) buracos.push(`${socio.id}: nome completo`);
    if (socio.linha.includes('[PRECISA')) buracos.push(`${socio.id}: linha`);
  }
  return buracos;
}

/** O que está escrito e ainda espera o ok dos sócios. Também bloqueia. */
export function esperandoAprovacao(): readonly string[] {
  return SOCIOS.filter((s) => s.linhaEmRascunho).map((s) => `${s.id}: linha em rascunho`);
}
