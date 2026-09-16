import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'primario-invertido';

const BASE =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-[3px] px-6 py-3.5 ' +
  'font-sans text-legenda font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] ' +
  'duration-[var(--duration-micro)] ease-[var(--ease-micro)] will-change-transform active:translate-y-px';

/**
 * Quatro variantes, duas por superfície. Briefing de marca §10.5.
 *
 * ────────────────────────────────────────────────────────────────────────
 * NENHUM BOTÃO DOURADO, EM FUNDO NENHUM. O site tinha dezessete usos de
 * ouro como preenchimento, e o ouro é acento: filete, numeral, marca, no
 * máximo uma palavra por bloco. Ouro em tudo vira Canva.
 *
 * E um primário por tela. Dois botões cheios competindo não dão duas
 * chances de conversão: dão uma decisão a mais para quem já está decidindo.
 * ──────────────────────────────────────────────────────────────────────── */
const VARIANTES: Record<Variante, string> = {
  /* sobre papel */
  primario: 'bg-navy text-branco hover:bg-navy-escuro',
  secundario:
    'border border-navy bg-transparent text-navy hover:bg-navy hover:text-branco',

  /* sobre navy */
  'primario-invertido': 'bg-papel text-navy hover:bg-branco',
  fantasma: 'border border-branco bg-transparent text-branco hover:bg-branco hover:text-navy',
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
