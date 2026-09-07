import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'primario-invertido';

const BASE =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-[3px] px-6 py-3.5 ' +
  'font-sans text-[0.94rem] font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] ' +
  'duration-[var(--duration-micro)] ease-[var(--ease-micro)] will-change-transform active:translate-y-px';

const VARIANTES: Record<Variante, string> = {
  primario:
    'bg-navy-700 text-ice-100 shadow-[0_1px_2px_rgb(27_42_74/0.2)] hover:bg-navy-600 hover:shadow-[0_10px_28px_-12px_rgb(27_42_74/0.55)]',
  'primario-invertido':
    'bg-gold-500 text-navy-900 hover:bg-gold-400 hover:shadow-[0_10px_28px_-12px_rgb(194_163_91/0.6)]',
  secundario:
    'border border-navy-700/25 bg-transparent text-navy-700 hover:border-navy-700/60 hover:bg-navy-700/[0.04]',
  fantasma:
    'border border-ice-200/25 bg-transparent text-ice-200 hover:border-gold-400/70 hover:text-gold-300',
};

/** A seta que anda. Movimento pequeno, sempre para a direita, sempre igual. */
function Seta() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-[0.9em] w-[0.9em] translate-x-0 transition-transform duration-[var(--duration-micro)] ease-[var(--ease-micro)] group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

interface Props {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly variante?: Variante;
  readonly className?: string;
  readonly comSeta?: boolean;
}

export function Botao({ href, children, variante = 'primario', className, comSeta = true }: Props) {
  const externo = href.startsWith('http') || href.startsWith('mailto:');
  const conteudo = (
    <>
      {children}
      {comSeta && <Seta />}
    </>
  );

  if (externo) {
    return (
      <a
        href={href}
        className={cn(BASE, VARIANTES[variante], className)}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {conteudo}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(BASE, VARIANTES[variante], className)}>
      {conteudo}
    </Link>
  );
}

/**
 * O mesmo botão, quando a ação acontece na página em vez de levar a outra.
 *
 * Existe separado de propósito. Um `Botao` com `href` opcional aceitaria
 * nenhum dos dois ou os dois ao mesmo tempo, e o tipo pararia de dizer a
 * verdade sobre o elemento que sai no HTML. Aqui é `<button>`, sempre — que
 * é o que um leitor de tela precisa ouvir quando a coisa não navega.
 */
export function BotaoAcao({
  onClick,
  children,
  variante = 'primario',
  className,
  comSeta = false,
  type = 'button',
}: Omit<Props, 'href'> & {
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(BASE, VARIANTES[variante], className)}
    >
      {children}
      {comSeta && <Seta />}
    </button>
  );
}
