'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Logotipo } from '@/components/brand/Marca';
import { Container } from '@/components/ui/Container';
import { NAV_PRINCIPAL } from '@/content/navegacao';
import { cn } from '@/lib/utils';

/**
 * Observa o que está passando POR BAIXO do cabeçalho.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A versão anterior decidia a cor por distância de rolagem: acima de 24px,
 * claro com texto navy. Isso não é observação, é palpite — e o palpite só
 * acertava porque toda página começa com capa escura. Nas seções navy e no
 * rodapé, uma barra clara atravessava a faixa escura.
 *
 * A hobro.digital resolve com uma linha, `mix-blend-mode: difference`: o
 * cabeçalho inverte contra o que passa atrás. Contraste garantido por
 * construção. Não copiamos, e o motivo é de marca — `difference` garante
 * contraste e DESTRÓI cor. A hobro pode porque a paleta dela é branco,
 * preto e cinza; o ouro #836B34 invertido sobre navy não é ouro.
 *
 * Aqui a mesma ideia com a cor da casa: as superfícies escuras se anunciam
 * com `data-fundo="escuro"`, e um observador com o recorte colapsado numa
 * faixa fina na altura do cabeçalho diz qual delas está embaixo agora.
 * ──────────────────────────────────────────────────────────────────────── */
function useFundoSobOCabecalho(ref: RefObject<HTMLElement | null>) {
  // Começa em `false` de propósito. Enquanto a página não rolou, a superfície
  // é transparente e esta resposta não é consultada; quando passa a ser, o
  // observador já disparou — ele emite uma leitura inicial por alvo
  // observado. Assim não existe um estado inicial para adivinhar.
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    const escuras = document.querySelectorAll('[data-fundo="escuro"]');
    if (escuras.length === 0) return;

    let observador: IntersectionObserver | null = null;
    const emCena = new Set<Element>();

    const montar = () => {
      observador?.disconnect();
      emCena.clear();

      // Medido do elemento, não lido do token. `--header-h` é `4.5rem`, e
      // `parseFloat('4.5rem')` devolve 4.5 — a faixa de detecção nasceu a
      // quatro pixels do topo e nunca encostou em nada. O elemento sabe a
      // própria altura em pixels; o token, não.
      const altura = ref.current?.getBoundingClientRect().height ?? 0;
      if (altura === 0) return;

      // Achata o recorte numa linha de 1px na base do cabeçalho: só
      // intersecta o que está exatamente ali atrás.
      const base = Math.max(0, window.innerHeight - altura - 1);

      observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) emCena.add(entrada.target);
            else emCena.delete(entrada.target);
          }
          setEscuro(emCena.size > 0);
        },
        { rootMargin: `-${altura}px 0px -${base}px 0px`, threshold: 0 },
      );

      for (const elemento of escuras) observador.observe(elemento);
    };

    montar();
    window.addEventListener('resize', montar);
    return () => {
      window.removeEventListener('resize', montar);
      observador?.disconnect();
    };
  }, [ref]);

  return escuro;
}

/**
 * Barra fixa. Nasce transparente sobre a capa e ganha fundo quando a página
 * rola — a marca aparece sobre a imagem, não sobre uma faixa branca. Rolando,
 * a cor do fundo segue o que estiver passando por baixo.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();
  const refCabecalho = useRef<HTMLElement | null>(null);
  const sobreEscuro = useFundoSobOCabecalho(refCabecalho);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  // Três estados, não dois. O menu aberto força a superfície clara porque
  // o painel que ele abre é claro.
  const superficie = aberto ? 'clara' : !rolou ? 'transparente' : sobreEscuro ? 'escura' : 'clara';
  const textoClaro = superficie !== 'clara';

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
      ref={refCabecalho}
      /* A régua de progresso mora no `::after` deste elemento, em CSS puro.
         Ver o bloco "O progresso da página" no globals.css. */
      data-progresso
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color] duration-500 ease-[var(--ease-micro)]',
        /* Fundo OPACO, e não vidro fosco.
           ──────────────────────────────────────────────────────────────
           Era `bg-branco/92` com desfoque de 12px. Fotografei no celular e
           reprovei: oito por cento de transparência sobre uma manchete de
           55px deixa a frase legível ATRÁS da marca. "A camada independente"
           passando por dentro do "ABBA" não lê como vidro, lê como defeito
           de renderização. O desfoque não salva: doze pixels é pouco para
           tipo desse corpo, e é justamente o tipo grande que fica embaixo
           do cabeçalho numa página que se lê.

           Opaco também sai mais barato: desfoque de fundo é composição a
           cada quadro de rolagem, e no aparelho fraco isso aparece.

           O estado transparente continua existindo, e é onde o efeito
           valia: no topo da capa, onde não há nada para atravessar. */
        superficie === 'clara' && 'border-b border-navy/10 bg-branco',
        superficie === 'escura' && 'border-b border-branco/10 bg-navy-escuro',
        superficie === 'transparente' && 'border-b border-transparent bg-transparent',
      )}
    >
      <Container largura="larga" className="flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          aria-label="ABBA: página inicial"
          className={cn(
            'transition-colors duration-500',
            textoClaro ? 'text-branco' : 'text-navy',
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
                   instantâneo: a primeira leitura, logo abaixo. */
                prefetch={false}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'relative py-1 text-legenda transition-colors duration-300',
                  textoClaro
                    ? 'text-ardosia-clara hover:text-branco'
                    : 'text-ardosia hover:text-navy',
                  ativo && (textoClaro ? 'text-branco' : 'text-navy'),
                  // O sublinhado dourado cresce da esquerda; é o mesmo gesto
                  // do fio dourado que separa as seções.
                  'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-ouro after:transition-[width] after:duration-[var(--duration-micro)] after:ease-[var(--ease-micro)]',
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
              'hidden rounded-[3px] px-5 py-2.5 text-legenda font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-micro)] sm:inline-flex',
              // Sólido navy sobre fundo claro. Sobre escuro, o mesmo sólido
              // desapareceria no fundo — ali ele vira contorno, o mesmo
              // tratamento que já tinha sobre a capa.
              textoClaro
                ? 'border border-ardosia-clara/30 text-branco hover:border-ouro-claro/80 hover:text-ouro-claro'
                : 'bg-navy text-branco hover:bg-navy',
            )}
          >
            Primeira leitura
          </Link>

          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            className={cn(
              'flex h-10 w-10 items-center justify-center lg:hidden',
              textoClaro ? 'text-branco' : 'text-navy',
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
          className="border-t border-navy/10 bg-branco lg:hidden"
        >
          <Container largura="larga" className="flex flex-col py-4">
            {NAV_PRINCIPAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-papel/70 py-4 last:border-0"
              >
                <span className="block text-navy">{item.rotulo}</span>
                {item.descricao && (
                  <span className="mt-0.5 block text-legenda text-ardosia">{item.descricao}</span>
                )}
              </Link>
            ))}
            <Link
              href="/analise"
              className="mt-4 rounded-[3px] bg-navy px-5 py-3.5 text-center text-branco"
            >
              Primeira leitura
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
