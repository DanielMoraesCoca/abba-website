import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'Base de evidências da ABBA';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'Base de evidências',
    titulo: 'Todo número que usamos, com a fonte. E os que proibimos, com o motivo.',
  });
}
