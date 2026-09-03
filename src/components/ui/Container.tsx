import { cn } from '@/lib/utils';

/**
 * A largura da coluna. Três larguras, e só três — é o que mantém o site
 * parecendo uma coisa só em vez de vinte páginas parecidas.
 */
export function Container({
  children,
  largura = 'padrao',
  className,
}: {
  readonly children: React.ReactNode;
  readonly largura?: 'estreita' | 'padrao' | 'larga';
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 sm:px-8',
        largura === 'estreita' && 'max-w-[46rem]',
        largura === 'padrao' && 'max-w-[68rem]',
        largura === 'larga' && 'max-w-[84rem]',
        className,
      )}
    >
      {children}
    </div>
  );
}
