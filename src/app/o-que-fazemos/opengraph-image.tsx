import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'O que a ABBA faz';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Modelo de serviço',
    titulo: 'Não vendemos cardápio. Vendemos capacidade instalada e prova.',
  });
}
