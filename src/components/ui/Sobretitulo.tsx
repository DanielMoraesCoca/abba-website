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
        // `items-start` + o deslocamento no traço mantêm o fio alinhado à
        // PRIMEIRA linha quando o sobretítulo quebra no celular; com
        // `items-center` ele flutuaria no meio das duas linhas.
        'flex items-start gap-3 font-mono text-[0.68rem] uppercase leading-[1.7] tracking-[0.22em]',
        invertido ? 'text-gold-400' : 'text-gold-700',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-[0.8em] h-px w-6 shrink-0',
          invertido ? 'bg-gold-400/70' : 'bg-gold-600/70',
        )}
      />
      {children}
    </p>
  );
}
