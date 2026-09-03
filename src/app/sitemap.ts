import type { MetadataRoute } from 'next';
import { URL_BASE } from '@/lib/seo';

/**
 * Mapa do site. Prioridade reflete o funil real: a análise gratuita é a
 * porta única de entrada, então ela empata com a home.
 */
const ROTAS: readonly { caminho: string; prioridade: number }[] = [
  { caminho: '/', prioridade: 1 },
  { caminho: '/analise', prioridade: 1 },
  { caminho: '/o-que-fazemos', prioridade: 0.9 },
  { caminho: '/programa', prioridade: 0.9 },
  { caminho: '/mapa-de-vazamento', prioridade: 0.8 },
  { caminho: '/conselheiro', prioridade: 0.8 },
  { caminho: '/metodo', prioridade: 0.7 },
  { caminho: '/evidencias', prioridade: 0.7 },
  { caminho: '/manifesto', prioridade: 0.6 },
  { caminho: '/contato', prioridade: 0.6 },
  { caminho: '/privacidade', prioridade: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return ROTAS.map(({ caminho, prioridade }) => ({
    url: new URL(caminho, URL_BASE).toString(),
    lastModified: agora,
    changeFrequency: 'monthly',
    priority: prioridade,
  }));
}
