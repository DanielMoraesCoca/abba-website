import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Manifesto da ABBA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Manifesto',
    titulo: 'A lista do que recusamos é o que torna a lista do que prometemos crível.',
  });
}
