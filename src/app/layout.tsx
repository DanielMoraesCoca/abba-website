import { ViewTransition } from 'react';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Newsreader, Source_Serif_4 } from 'next/font/google';
import { Cabecalho } from '@/components/marketing/Cabecalho';
import { Rodape } from '@/components/marketing/Rodape';
import { EMPRESA, HEADLINE } from '@/content/identidade';
import { URL_BASE, jsonLdOrganizacao } from '@/lib/seo';
import './globals.css';

/**
 * Tipografia da casa, conforme o briefing de marca (§3 e §10.7).
 *
 * ────────────────────────────────────────────────────────────────────────
 * Três famílias, e cada uma com um cargo:
 *
 *   Newsreader       títulos, em 400. Romana e itálica são duas declarações
 *                    separadas, e a razão está no comentário abaixo.
 *   Source Serif 4   corpo. A Inter saiu inteira, e é intencional: as três
 *                    famílias são a face de quem escreve relatório. Serifa
 *                    em tela deixou de ser problema há uma década, e a
 *                    mitigação para página longa é entrelinha 1,6 com
 *                    medida de 62 a 70 caracteres, não trocar de fonte.
 *                    Vai sem `weight`: a Source Serif é variável, então um
 *                    arquivo só cobre o 400 do corpo e o 600 do <strong>.
 *   IBM Plex Mono    rótulo, número, e-mail, dado. NUNCA em texto corrido.
 *                    Em formulário, o rótulo do campo é mono e o valor que
 *                    a pessoa digita é Source Serif. Não é variável, e o
 *                    site só usa um peso: 400, e nada mais.
 *
 * O peso do que a página baixa, medido com `npm run medir` contra o build
 * de produção: 106KB de fonte, e a home em 323KB de rede contra um teto de
 * 420KB. A versão anterior deste arquivo pedia o produto cruzado de dois
 * pesos por dois estilos em duas famílias — doze arquivos, 239KB, e a home
 * em 457KB, fora do orçamento. Ninguém tinha escolhido isso: é o que uma
 * lista de `weight` e uma de `style` fazem quando se multiplicam.
 * ────────────────────────────────────────────────────────────────────────
 *
 * Sobre o eixo `opsz`, que NÃO está aqui: a Newsreader tem corpo óptico, e
 * o briefing pedia 36 nos títulos grandes. Pedir o eixo custa o arquivo
 * variável inteiro sem subconjunto — medido: as duas faces da Newsreader
 * saltaram de 45KB para 279KB, e a home foi a 549KB. Trinta e cinco por
 * cento do orçamento da página inteira por um ajuste de desenho de letra
 * que só aparece lado a lado. Ficou o desenho padrão. Se um dia a fonte for
 * servida da nossa própria origem, dá para cortar o eixo na mão e o cálculo
 * muda. */
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-newsreader',
});

/**
 * A itálica de ênfase é uma declaração à parte, de propósito.
 *
 * Pedir `weight: ['300','400']` junto de `style: ['normal','italic']` baixa
 * quatro arquivos: 300 romana e 400 itálica não têm uso nenhum na página.
 * Duas declarações pedem exatamente as duas faces que existem: a romana 400
 * do título e a itálica 300 da palavra de ênfase.
 */
const newsreaderItalica = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300'],
  style: 'italic',
  variable: '--font-newsreader-italica',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-plex-mono',
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
      className={`${newsreader.variable} ${newsreaderItalica.variable} ${sourceSerif.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {/* Atalho de teclado: primeira parada do Tab em qualquer página. */}
        <a
          href="#conteudo"
          className="sr-only rounded-[3px] bg-navy px-4 py-2 text-branco focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
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
