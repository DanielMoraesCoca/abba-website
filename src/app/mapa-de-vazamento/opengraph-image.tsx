import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Mapa de Vazamento';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Caminho 01 · gratuito',
    titulo: 'Três hipóteses fazem pensar. Um número faz reagir.',
  });
}
