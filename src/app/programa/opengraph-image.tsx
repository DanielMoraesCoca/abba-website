import { cartaoSocial, TAMANHO_OG, TIPO_OG } from '@/lib/og';

export const alt = 'O Programa AI Native · Ano 1';
export const size = TAMANHO_OG;
export const contentType = TIPO_OG;

export default async function Imagem() {
  return cartaoSocial({
    sobretitulo: 'AI Native · Ano 1',
    titulo: 'Doze meses, três fases, três portões de saída sem multa.',
  });
}
