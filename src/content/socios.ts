/**
 * OS SÓCIOS, E A PORTA DE UMA VIA QUE SEGURA A PÁGINA.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Origem: abba-ops, decisão V5o (17/09). A página de sócios existe porque a
 * trava 4 tira caso, depoimento e logo de cliente, e sem nenhuma dessas
 * coisas o site não tem PROVA HUMANA nenhuma. Uma casa cujo argumento é
 * "assinado por gente", sem gente, é uma contradição que o leitor sente
 * antes de saber nomear.
 *
 * `SOCIOS_PUBLICOS = false` é o mesmo mecanismo do preço, e pelo mesmo
 * motivo: nome de pessoa em material externo é porta de uma via. A decisão
 * registrada em V5o deixou uma pendência explícita, "sócios: aprovar as
 * duas bios para publicação", e ela não foi cumprida ainda. Enquanto for
 * falso, a rota existe e não é linkada de lugar nenhum, não entra no mapa do
 * site, e pede para não ser indexada. Publicar é um booleano, e o teste em
 * `tests/unit/conteudo.test.ts` obriga quem mudar a registrar a decisão no
 * mesmo commit.
 *
 * ────────────────────────────────────────────────────────────────────────
 * DUAS COISAS QUE NÃO BATERAM COM O QUE A DECISÃO SUPÔS, E PRECISAM DE VOCÊS
 *
 * 1. NÃO EXISTEM DUAS BIOS. O `posicionamento.md` §"Bio dos fundadores" tem
 *    UMA linha, escrita para servir a qualquer fundador no LinkedIn. Duas
 *    bios idênticas numa página de sócios não provam nada: elas gastam o
 *    espaço da única prova humana do site para dizer a mesma frase duas
 *    vezes. O que falta é uma linha por pessoa, e só os sócios podem
 *    escrevê-la.
 *
 * 2. A BIO APROVADA NÃO PASSA NA TRAVA 6 COMO ESTÁ. Ela termina em
 *    "instalamos os 70% que todo fornecedor de IA ignora". Os 70/30 são tese
 *    da casa, não estatística, e a forma aprovada para o site (§10.8) é a
 *    frase em corpo de texto, nunca o numeral solto. A adaptação está abaixo
 *    e é mínima: o numeral sai, o argumento fica. "Mid-market" também virou
 *    "médio porte", que é o que o resto do site fala.
 *
 * A REGRA PEDRO MOURA (V4g) VALE AQUI SEM EXCEÇÃO: ele aparece como sócio da
 * ABBA, nunca como executivo de um fornecedor falando daquele fornecedor.
 * Nada neste arquivo cita empresa de terceiro, e nada pode passar a citar.
 * ════════════════════════════════════════════════════════════════════════
 */

/** Porta de uma via. Ver o cabeçalho, e V5o no abba-ops. */
export const SOCIOS_PUBLICOS = false;

/**
 * A bio compartilhada, adaptada do `posicionamento.md` para a régua do site.
 * Ela diz o que a casa é. O que diferencia uma pessoa da outra é a linha
 * própria de cada uma, abaixo, e é ela que falta.
 */
export const BIO_DA_CASA =
  'Sócio-fundador da ABBA, consultoria de transformação em IA para o médio porte brasileiro. ' +
  'Instalamos a parte que o mercado não vende.';

export interface Socio {
  readonly id: string;
  readonly nome: string;
  /** A linha que distingue esta pessoa da outra. Sem prêmio, sem anos de mercado, sem adjetivo. */
  readonly linha: string;
}

export const SOCIOS = [
  {
    id: 'pedro',
    nome: 'Pedro Moura',
    linha: '[PRECISA DE UMA LINHA]',
  },
  {
    /* O primeiro nome aparece no CLAUDE.md deste repositório; o sobrenome
       completo, não. Chutar sobrenome numa página de sócios é pior do que
       deixar em branco, então fica em branco. É uma linha para preencher. */
    id: 'daniel',
    nome: '[PRECISA DE NOME COMPLETO]',
    linha: '[PRECISA DE UMA LINHA]',
  },
] as const satisfies readonly Socio[];

/** O que ainda falta preencher. Usado pela página para se recusar a ir ao ar. */
export function faltaPreencher(): readonly string[] {
  const buracos: string[] = [];
  for (const socio of SOCIOS) {
    if (socio.nome.includes('[PRECISA')) buracos.push(`${socio.id}: nome`);
    if (socio.linha.includes('[PRECISA')) buracos.push(`${socio.id}: linha`);
  }
  return buracos;
}
