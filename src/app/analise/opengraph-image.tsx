import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Análise ABBA: a leitura preliminar do seu vazamento';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Gratuito · três minutos',
    titulo: 'A análise chega feita, não oferecida.',
  });
}
