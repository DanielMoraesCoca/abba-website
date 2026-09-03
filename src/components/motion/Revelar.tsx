'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * A transição de entrada da casa. UMA curva, UM deslocamento, UMA duração —
 * declaradas nos tokens em globals.css e repetidas aqui porque a biblioteca
 * de animação não lê CSS.
 *
 * `useReducedMotion` não é acessibilidade decorativa: quem pediu menos
 * movimento recebe o conteúdo já posicionado, sem opacidade animada, sem
 * atraso. Nada de "fade mais rápido".
 */

const CURVA = [0.16, 1, 0.3, 1] as const;

const VARIANTES: Variants = {
  oculto: { opacity: 0, y: 18 },
  visivel: (atraso: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: CURVA, delay: atraso },
  }),
};

export function Revelar({
  children,
  atraso = 0,
  className,
  as = 'div',
}: {
  readonly children: ReactNode;
  readonly atraso?: number;
  readonly className?: string;
  readonly as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const semMovimento = useReducedMotion();
  const Componente = motion[as];

  if (semMovimento) {
    const Estatico = as;
    return <Estatico className={className}>{children}</Estatico>;
  }

  return (
    <Componente
      className={className}
      variants={VARIANTES}
      custom={atraso}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
    >
      {children}
    </Componente>
  );
}

/**
 * Escalonamento: os filhos entram em sequência, 90ms entre eles.
 * Acima de ~6 filhos o escalonamento vira espera — use `passo` menor.
 */
export function RevelarLista({
  children,
  className,
  passo = 0.09,
  as = 'div',
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly passo?: number;
  readonly as?: 'div' | 'ul' | 'ol';
}) {
  const semMovimento = useReducedMotion();
  const Componente = motion[as];

  if (semMovimento) {
    const Estatico = as;
    return <Estatico className={className}>{children}</Estatico>;
  }

  return (
    <Componente
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        oculto: {},
        visivel: { transition: { staggerChildren: passo, delayChildren: 0.05 } },
      }}
    >
      {children}
    </Componente>
  );
}

/** Item de uma `RevelarLista`. */
export function RevelarItem({
  children,
  className,
  as = 'div',
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: 'div' | 'li' | 'article';
}) {
  const semMovimento = useReducedMotion();
  const Componente = motion[as];

  if (semMovimento) {
    const Estatico = as;
    return <Estatico className={className}>{children}</Estatico>;
  }

  return (
    <Componente
      className={className}
      variants={{
        oculto: { opacity: 0, y: 16 },
        visivel: { opacity: 1, y: 0, transition: { duration: 0.68, ease: CURVA } },
      }}
    >
      {children}
    </Componente>
  );
}
