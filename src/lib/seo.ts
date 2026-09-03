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

/**
 * Dados estruturados por página.
 *
 * O JSON-LD da organização (acima) vale para o site inteiro. Estes descrevem
 * o que cada página específica é — um serviço, uma lista de perguntas
 * frequentes — e é o que faz a diferença entre um resultado de busca com uma
 * linha e um com contexto.
 *
 * Regra que vale aqui como vale em qualquer peça externa: **nada de número
 * que não esteja no cânone**, e nada de `aggregateRating` ou depoimento
 * inventado para ganhar estrela na busca. Marcação estruturada é uma
 * declaração ao mecanismo de busca; mentir nela é mentir por escrito.
 */

interface ServicoDescrito {
  readonly nome: string;
  readonly descricao: string;
  readonly caminho: string;
  readonly etapas?: readonly { readonly nome: string; readonly texto: string }[];
}

export function jsonLdServico({ nome, descricao, caminho, etapas }: ServicoDescrito) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: nome,
    description: descricao,
    url: new URL(caminho, URL_BASE).toString(),
    serviceType: 'Consultoria de transformação em IA',
    provider: { '@type': 'Organization', name: EMPRESA.assinatura, url: URL_BASE },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    availableLanguage: 'pt-BR',
    ...(etapas
      ? {
          hasPart: etapas.map((e) => ({
            '@type': 'Service',
            name: e.nome,
            description: e.texto,
          })),
        }
      : {}),
  };
}

export function jsonLdPerguntas(
  perguntas: readonly { readonly pergunta: string; readonly resposta: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  };
}
