import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'ABBA Consultoria de IA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Consultoria de transformação em IA',
    titulo: 'Instalamos capacidade de IA, e provamos, de fora, o que ela mudou.',
  });
}
