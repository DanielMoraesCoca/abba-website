import { cn } from '@/lib/utils';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { Revelar } from '@/components/motion/Revelar';

/**
 * O cabeçalho de seção. Existe para que toda seção do site tenha o mesmo
 * ritmo: sobretítulo dourado, título serifado, uma linha de apoio.
 */
export function TituloDeSecao({
  sobretitulo,
  titulo,
  apoio,
  invertido = false,
  centralizado = false,
  className,
}: {
  readonly sobretitulo?: string;
  readonly titulo: React.ReactNode;
  readonly apoio?: React.ReactNode;
  readonly invertido?: boolean;
  readonly centralizado?: boolean;
  readonly className?: string;
}) {
  return (
    <Revelar
      as="header"
      className={cn('max-w-3xl', centralizado && 'mx-auto text-center', className)}
    >
      {sobretitulo && (
        <Sobretitulo invertido={invertido} className={centralizado ? 'justify-center' : undefined}>
          {sobretitulo}
        </Sobretitulo>
      )}
      <h2
        className={cn(
          'mt-5 text-3xl leading-[1.12]',
          invertido ? 'text-ice-100' : 'text-navy-700',
        )}
      >
        {titulo}
      </h2>
      {apoio && (
        <div
          className={cn(
            'mt-6 text-base leading-[1.65]',
            invertido ? 'text-ice-200/75' : 'text-slate-700',
          )}
        >
          {apoio}
        </div>
      )}
    </Revelar>
  );
}
