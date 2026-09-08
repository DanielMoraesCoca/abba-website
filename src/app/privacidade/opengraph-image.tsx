import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'A política de privacidade da ABBA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

/**
 * A privacidade também é uma página que se compartilha.
 *
 * Ela estava na sitemap — pública e indexável, como uma página legal deve
 * ser — declarando `twitter:card = summary_large_image` e sem imagem
 * nenhuma. Isso é pior do que não declarar card grande: quem manda o link
 * recebe um retângulo vazio onde a marca deveria estar.
 *
 * Descoberto conferindo as dez imagens sociais uma a uma, contra as onze
 * rotas da sitemap. Nenhum teste falhava, e nenhum falharia.
 */
export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Privacidade',
    titulo: 'O que este site coleta, o que não coleta, e por quê.',
  });
}
