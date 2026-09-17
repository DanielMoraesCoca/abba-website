/**
 * ROLAR ATÉ UM ELEMENTO, RESPEITANDO QUEM PEDIU MENOS MOVIMENTO.
 *
 * ════════════════════════════════════════════════════════════════════════
 * ESTE ARQUIVO EXISTE POR CAUSA DE UM FURO NA PRÓPRIA DOUTRINA DA CASA.
 *
 * A regra escrita é que `prefers-reduced-motion` é tratado no CSS, num lugar
 * só, e em todo o resto do site isso é verdade: `globals.css` desliga as
 * animações, as transições e o `scroll-behavior` do documento numa regra de
 * mídia única.
 *
 * `scrollIntoView({ behavior: 'smooth' })` fura essa regra. Pela
 * especificação, o `behavior` passado no JavaScript VENCE o
 * `scroll-behavior` do CSS: a regra de mídia simplesmente não alcança a
 * chamada. Eram três chamadas, todas no assistente da Primeira Leitura.
 *
 * POR QUE IMPORTA MAIS DO QUE PARECE. Quem liga "reduzir movimento"
 * costuma ter motivo vestibular, e um salto suave de página inteira é
 * justamente o gatilho. É a única tela do site em que a pessoa interage, e
 * eram três saltos: ao avançar de passo, ao voltar, e ao chegar no
 * resultado.
 *
 * POR QUE AS AUDITORIAS NÃO PEGAM. O defeito só existe em tempo de
 * execução, sob uma preferência do sistema operacional que nem o axe nem o
 * Lighthouse simulam. Trinta auditorias passavam com ele no lugar.
 *
 * A função é a única porta: quem precisar rolar até alguma coisa chama
 * daqui, e o furo não volta por uma chamada nova em outro arquivo.
 * ════════════════════════════════════════════════════════════════════════
 */
export function rolarAte(alvo: Element | null | undefined): void {
  if (!alvo) return;

  /* `matchMedia` não existe na renderização do servidor, e esta função pode
     ser chamada de um efeito que roda antes da hidratação em algum caminho
     futuro. Sem a guarda, o site quebraria no servidor por causa de uma
     rolagem. */
  const reduzido =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
}
