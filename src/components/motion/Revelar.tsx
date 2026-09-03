'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * A transição de entrada da casa.
 *
 * ────────────────────────────────────────────────────────────────────────
 * POR QUE ISTO NÃO USA UMA BIBLIOTECA DE ANIMAÇÃO.
 *
 * A primeira versão deste componente usava a `motion` — e funcionava. Só
 * que ela custava mais de cem quilobytes de JavaScript em TODA página, para
 * fazer uma coisa só: opacidade e dez pixels de deslocamento, com uma curva
 * fixa. Uma biblioteca de física de animação resolvendo um `transition` de
 * CSS.
 *
 * A troca foi medida: um IntersectionObserver único, compartilhado por
 * todos os elementos da página, mais duas propriedades de CSS. O resultado
 * na tela é o mesmo; o custo caiu para umas poucas centenas de bytes.
 *
 * Num site que vende "a gente mede de fora o que mudou", enviar cem
 * quilobytes para fazer um fade seria a piada errada.
 *
 * COMO FUNCIONA. O elemento nasce com `data-revelar` e o CSS o deixa
 * transparente e deslocado. Quando ele entra na tela, o observador troca
 * para `data-revelar="visivel"` e a transição roda. O `--atraso` escalona
 * listas sem um relógio em JavaScript.
 *
 * `prefers-reduced-motion` é tratado no CSS, num lugar só: quem pediu menos
 * movimento recebe o conteúdo já posicionado, sem transição e sem atraso.
 * ────────────────────────────────────────────────────────────────────────
 */

/**
 * Um observador para a página inteira. Criar um por elemento seria
 * dezenas de observadores fazendo o mesmo trabalho.
 */
let observador: IntersectionObserver | null = null;

function obterObservador(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;

  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.setAttribute('data-revelar', 'visivel');
        // Uma vez revelado, sempre revelado: o elemento sai da observação.
        observador?.unobserve(entrada.target);
      }
    },
    // A margem negativa embaixo evita que algo revele enquanto ainda está
    // meio fora da tela; a de cima deixa o conteúdo já rolado aparecer.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );

  return observador;
}

function useRevelar<T extends HTMLElement>(atraso: number) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const obs = obterObservador();
    if (!obs) {
      // Sem IntersectionObserver (navegador muito antigo, ou um leitor que
      // desligou), o conteúdo aparece: nunca fica escondido por falta de JS.
      elemento.setAttribute('data-revelar', 'visivel');
      return;
    }

    elemento.style.setProperty('--atraso', `${atraso}ms`);
    obs.observe(elemento);
    return () => obs.unobserve(elemento);
  }, [atraso]);

  return ref;
}

type Tag = 'div' | 'section' | 'article' | 'header' | 'li' | 'ul' | 'ol' | 'figure';

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: Tag;
}

export function Revelar({
  children,
  atraso = 0,
  className,
  as = 'div',
}: Props & { readonly atraso?: number }) {
  const ref = useRevelar<HTMLElement>(Math.round(atraso * 1000));
  const Componente = as as ElementType;

  return (
    <Componente ref={ref} data-revelar="" className={className}>
      {children}
    </Componente>
  );
}

/**
 * Escalonamento de lista. O atraso de cada filho é calculado no CSS a partir
 * do índice, sem relógio em JavaScript e sem um segundo observador.
 */
export function RevelarLista({
  children,
  className,
  passo = 0.09,
  as = 'div',
}: Props & { readonly passo?: number }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    elemento.style.setProperty('--passo', `${Math.round(passo * 1000)}ms`);
  }, [passo]);

  const Componente = as as ElementType;
  return (
    <Componente ref={ref} data-revelar-lista="" className={className}>
      {children}
    </Componente>
  );
}

/** Item de uma `RevelarLista`. O escalonamento vem do pai, via CSS. */
export function RevelarItem({ children, className, as = 'div' }: Props) {
  const ref = useRevelar<HTMLElement>(0);
  const Componente = as as ElementType;

  return (
    <Componente ref={ref} data-revelar="" className={className}>
      {children}
    </Componente>
  );
}
