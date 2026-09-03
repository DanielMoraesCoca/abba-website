import { cn } from '@/lib/utils';

/**
 * O sobretítulo (eyebrow): mono, caixa alta, entrelinha larga, com um traço
 * dourado curto à esquerda. É o detalhe que assina a página sem gritar —
 * o dourado aparece aqui e quase em nenhum outro lugar.
 */
export function Sobretitulo({
  children,
  className,
  invertido = false,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly invertido?: boolean;
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em]',
        invertido ? 'text-gold-400' : 'text-gold-700',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('h-px w-6', invertido ? 'bg-gold-400/70' : 'bg-gold-600/70')}
      />
      {children}
    </p>
  );
}
