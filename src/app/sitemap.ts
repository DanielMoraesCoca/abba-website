import type { MetadataRoute } from 'next';
import { SOCIOS_PUBLICOS } from '@/content/socios';
import { URL_BASE } from '@/lib/seo';

/**
 * Mapa do site. Prioridade reflete o funil real: a primeira leitura é a
 * porta única de entrada, então ela empata com a home.
 */
const ROTAS: readonly { caminho: string; prioridade: number }[] = [
  { caminho: '/', prioridade: 1 },
  { caminho: '/analise', prioridade: 1 },
  { caminho: '/o-que-fazemos', prioridade: 0.9 },
  { caminho: '/programa', prioridade: 0.9 },
  { caminho: '/assessment-gratuito', prioridade: 0.8 },
  { caminho: '/conselheiro', prioridade: 0.8 },
  { caminho: '/metodo', prioridade: 0.7 },
  { caminho: '/evidencias', prioridade: 0.7 },
  { caminho: '/manifesto', prioridade: 0.6 },
  { caminho: '/contato', prioridade: 0.6 },
  { caminho: '/privacidade', prioridade: 0.2 },
  /* `/quem-responde` entra aqui quando os sócios aprovarem as bios. Até lá a
     rota existe, não é linkada e pede para não ser indexada: nome de pessoa
     em material externo é porta de uma via. Ver content/socios.ts. */
  ...(SOCIOS_PUBLICOS ? [{ caminho: '/quem-responde', prioridade: 0.5 }] : []),
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
