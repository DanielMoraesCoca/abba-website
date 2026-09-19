/**
 * QUEM É O CONTROLADOR DOS DADOS.
 *
 * ════════════════════════════════════════════════════════════════════════
 * A página de privacidade descrevia com precisão o que o site faz e não
 * dizia QUEM faz. Ela falava em "a gente" e "nós", e o único identificador
 * era um e-mail. Quem quisesse exercer um direito não teria contra quem
 * exercê-lo.
 *
 * É a única pendência do lançamento que os sócios classificaram como
 * não-adiável: revisão de advogado pode vir depois do ar, identificação do
 * controlador não. Este arquivo existe para que, quando o CNPJ sair, publicar
 * seja preencher três campos, e não escrever uma seção.
 *
 * ENQUANTO OS CAMPOS ESTIVEREM VAZIOS, a página mostra o buraco em vez de
 * escondê-lo, e `npm run pronto` recusa o lançamento. Esconder seria pior
 * que a ausência: a ausência é visível, o disfarce não.
 *
 * O ENCARREGADO é campo à parte de propósito. A LGPD pede a identificação
 * de quem responde pelos pedidos dos titulares, e "o mesmo e-mail de
 * contato comercial" é uma resposta possível, mas precisa ser uma ESCOLHA
 * registrada, não um descuido de quem preencheu só dois campos.
 * ════════════════════════════════════════════════════════════════════════
 */

/** Marca de campo por preencher. A página e o `npm run pronto` leem isto. */
export const A_PREENCHER = '[A PREENCHER]';

export const CONTROLADOR = {
  /** Razão social completa, como está no cartão do CNPJ. */
  razaoSocial: A_PREENCHER,
  /** Só os dígitos com a pontuação do documento: 00.000.000/0001-00. */
  cnpj: A_PREENCHER,
  /**
   * Quem responde pelos pedidos dos titulares. Pode ser um dos sócios, e
   * pode usar o e-mail da casa: o que não pode é ficar em branco.
   */
  encarregado: A_PREENCHER,
  /** Para onde vão os pedidos sobre dados. Já existe e não depende do CNPJ. */
  email: 'contato@abbaservices.com.br',
} as const;

/** Os campos que ainda faltam. Vazio quer dizer pronto para o ar. */
export function faltaNoControlador(): readonly string[] {
  const buracos: string[] = [];
  if (CONTROLADOR.razaoSocial === A_PREENCHER) buracos.push('razão social');
  if (CONTROLADOR.cnpj === A_PREENCHER) buracos.push('CNPJ');
  if (CONTROLADOR.encarregado === A_PREENCHER) buracos.push('encarregado');
  return buracos;
}
