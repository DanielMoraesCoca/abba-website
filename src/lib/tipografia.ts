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

/**
 * Número por extenso, para prosa.
 *
 * A casa escreve número pequeno por extenso no texto corrido e em algarismo
 * quando ele é dado — "onze perguntas", mas "R$ 240 mil". Esta função serve
 * ao primeiro caso, e só cobre a faixa em que a regra vale.
 */
const EXTENSO = [
  'zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito',
  'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis',
  'dezessete', 'dezoito', 'dezenove', 'vinte',
] as const;

export function porExtenso(n: number): string {
  return EXTENSO[n] ?? String(n);
}

/** Primeira letra maiúscula, para quando o extenso abre a frase. */
export function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
