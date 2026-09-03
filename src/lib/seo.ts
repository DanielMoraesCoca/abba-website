import type { Metadata } from 'next';
import { EMPRESA, HEADLINE } from '@/content/identidade';

/**
 * Metadados do site.
 *
 * Regra da marca: URLs só em `abbaservices.com.br`. Nada de domínio de
 * plataforma em material externo — nem em canonical, nem em Open Graph.
 * `NEXT_PUBLIC_SITE_URL` existe para o ambiente de pré-visualização e cai
 * no domínio oficial quando não está definida.
 */
export const URL_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? EMPRESA.site;

interface Pagina {
  readonly titulo: string;
  readonly descricao: string;
  readonly caminho: string;
}

export function metadadosDaPagina({ titulo, descricao, caminho }: Pagina): Metadata {
  const url = new URL(caminho, URL_BASE).toString();
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      title: `${titulo} · ${EMPRESA.assinatura}`,
      description: descricao,
      url,
      siteName: EMPRESA.assinatura,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titulo} · ${EMPRESA.assinatura}`,
      description: descricao,
    },
  };
}

/** Dados estruturados da organização. Um só lugar, injetado no layout raiz. */
export function jsonLdOrganizacao() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: EMPRESA.assinatura,
    alternateName: EMPRESA.nome,
    url: URL_BASE,
    email: EMPRESA.email,
    description: HEADLINE.sub,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    knowsLanguage: 'pt-BR',
    sameAs: [EMPRESA.linkedin],
    serviceType: [
      'Consultoria de transformação em IA',
      'Avaliação de prontidão para IA',
      'Construção de agentes de IA',
      'Capacitação corporativa em IA',
    ],
  };
}
