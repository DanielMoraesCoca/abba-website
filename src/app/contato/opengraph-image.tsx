import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Falar com a ABBA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Contato',
    titulo: 'A primeira conversa é de descoberta, não de apresentação.',
  });
}
