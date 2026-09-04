'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logotipo } from '@/components/brand/Marca';
import { Container } from '@/components/ui/Container';
import { NAV_PRINCIPAL } from '@/content/navegacao';
import { cn } from '@/lib/utils';

/**
 * Barra fixa. Nasce transparente sobre a capa e ganha fundo quando a página
 * rola — a marca aparece sobre a imagem, não sobre uma faixa branca.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  // Fecha o menu quando a rota muda. É o padrão do React para ajustar estado
  // em resposta a uma mudança de prop — feito durante a renderização, não num
  // efeito, que causaria uma renderização em cascata.
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setAberto(false);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-micro)]',
        rolou || aberto
          ? 'border-b border-navy-700/10 bg-paper/92 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container largura="larga" className="flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          aria-label="ABBA — página inicial"
          className={cn(
            'transition-colors duration-500',
            rolou || aberto ? 'text-navy-700' : 'text-ice-100',
          )}
        >
          <Logotipo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV_PRINCIPAL.map((item) => {
            const ativo = caminho === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                /* Sem prefetch. Os seis itens do menu entram na tela junto
                   com a página, e prefazer os seis custava cerca de 180 KB
                   antes de o visitante demonstrar qualquer intenção. Como
                   toda rota aqui é estática, o clique busca uma carga só, na
                   hora, e a navegação continua rápida. O prefetch fica
                   reservado para o link que a gente REALMENTE quer que seja
                   instantâneo: a análise gratuita, logo abaixo. */
                prefetch={false}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'relative py-1 text-[0.92rem] transition-colors duration-300',
                  rolou
                    ? 'text-slate-600 hover:text-navy-700'
                    : 'text-ice-200/80 hover:text-ice-100',
                  ativo && (rolou ? 'text-navy-700' : 'text-ice-100'),
                  // O sublinhado dourado cresce da esquerda; é o mesmo gesto
                  // do fio dourado que separa as seções.
                  'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-gold-500 after:transition-[width] after:duration-[var(--duration-micro)] after:ease-[var(--ease-micro)]',
                  ativo ? 'after:w-full' : 'after:w-0 hover:after:w-full',
                )}
              >
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/analise"
            className={cn(
              'hidden rounded-[3px] px-5 py-2.5 text-[0.9rem] font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-micro)] sm:inline-flex',
              rolou
                ? 'bg-navy-700 text-ice-100 hover:bg-navy-600'
                : 'border border-ice-200/30 text-ice-100 hover:border-gold-400/80 hover:text-gold-300',
            )}
          >
            Análise gratuita
          </Link>

          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            className={cn(
              'flex h-10 w-10 items-center justify-center lg:hidden',
              rolou || aberto ? 'text-navy-700' : 'text-ice-100',
            )}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
              {aberto ? (
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              ) : (
                <path d="M2.5 6h15M2.5 14h15" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {aberto && (
        <div
          id="menu-movel"
          className="border-t border-navy-700/10 bg-paper lg:hidden"
        >
          <Container largura="larga" className="flex flex-col py-4">
            {NAV_PRINCIPAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-ice-400/70 py-4 last:border-0"
              >
                <span className="block text-navy-700">{item.rotulo}</span>
                {item.descricao && (
                  <span className="mt-0.5 block text-sm text-slate-500">{item.descricao}</span>
                )}
              </Link>
            ))}
            <Link
              href="/analise"
              className="mt-4 rounded-[3px] bg-navy-700 px-5 py-3.5 text-center text-ice-100"
            >
              Análise gratuita
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
