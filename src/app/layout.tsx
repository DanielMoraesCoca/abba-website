import { ViewTransition } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { Cabecalho } from '@/components/marketing/Cabecalho';
import { Rodape } from '@/components/marketing/Rodape';
import { EMPRESA, HEADLINE } from '@/content/identidade';
import { URL_BASE, jsonLdOrganizacao } from '@/lib/seo';
import './globals.css';

/**
 * Tipografia: Source Serif nos títulos (a tradução para tela do Aptos
 * Display dos documentos), Inter no corpo (mesma escolha da Plataforma),
 * JetBrains Mono em número, prazo e referência. `display: 'swap'` para o
 * texto aparecer antes da fonte terminar de chegar.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Só os pesos que o site realmente usa. O itálico serifado e o peso 500 do
// mono estavam sendo baixados — 80 KB por visita — e nenhuma regra os
// pedia. Antes de acrescentar um peso aqui, confira que existe elemento
// usando ele.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600'],
  variable: '--font-source-serif',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: {
    default: `${EMPRESA.assinatura} · ${HEADLINE.titulo}`,
    template: `%s · ${EMPRESA.nome}`,
  },
  description: HEADLINE.sub,
  applicationName: EMPRESA.assinatura,
  authors: [{ name: EMPRESA.assinatura, url: EMPRESA.site }],
  creator: EMPRESA.assinatura,
  publisher: EMPRESA.assinatura,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: URL_BASE,
    siteName: EMPRESA.assinatura,
    title: HEADLINE.titulo,
    description: HEADLINE.sub,
  },
};

export const viewport: Viewport = {
  themeColor: '#1B2A4A',
  colorScheme: 'light',
};

export default function LayoutRaiz({ children }: { readonly children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {/* Atalho de teclado: primeira parada do Tab em qualquer página. */}
        <a
          href="#conteudo"
          className="sr-only rounded-[3px] bg-navy-700 px-4 py-2 text-ice-100 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Pular para o conteúdo
        </a>

        <Cabecalho />
        {/* Transição de rota. O React aciona a View Transitions API do
            navegador a cada navegação; as regras de animação vivem em
            globals.css, onde `prefers-reduced-motion` também as desliga.
            Sem suporte no navegador, a navegação acontece normalmente,
            sem animação — degradação limpa, nada de polyfill. */}
        <ViewTransition name="conteudo">
          <main id="conteudo">{children}</main>
        </ViewTransition>
        <Rodape />

        <script
          type="application/ld+json"
          // Dados estruturados: conteúdo estático nosso, sem entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganizacao()) }}
        />
      </body>
    </html>
  );
}
