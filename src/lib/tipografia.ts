/**
 * Regras de composição que o CSS não tem como aplicar.
 */

/**
 * Cola palavras de uma ou duas letras à palavra seguinte, com espaço
 * inquebrável.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Em português, artigo e preposição curtos no fim de linha são defeito de
 * composição: o olho recomeça a linha seguinte sem o apoio sintático. Uma
 * linha terminando em "com a" força uma releitura curta que ninguém nota
 * conscientemente e todo mundo sente.
 *
 * `text-wrap: balance` equilibra o comprimento das linhas, mas não decide
 * ONDE elas quebram — não existe propriedade de CSS para isto.
 *
 * Fica aqui, e não no conteúdo, de propósito: o que os sócios escrevem é
 * texto; onde a linha quebra é tipografia, e tipografia é do desenho.
 * ──────────────────────────────────────────────────────────────────────── */
export function colar(texto: string): string {
  return texto.replace(/(^|\s)(\p{L}{1,2})\s/gu, '$1$2 ');
}
