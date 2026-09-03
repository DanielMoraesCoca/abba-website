import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Conselheiro de IA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Caminho 03',
    titulo: 'A cadeira de IA, fracionária, do seu lado da mesa.',
  });
}
