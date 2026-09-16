import { cn } from '@/lib/utils';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { Revelar } from '@/components/motion/Revelar';

/**
 * A palavra de ênfase dentro de um título.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Uma por título, no máximo, e sempre a palavra que carrega o argumento.
 * Duas ênfases numa frase é o mesmo que nenhuma: o olho não sabe mais para
 * onde ir e a frase fica gaguejando.
 *
 * O elemento é <em> e não <span> porque a ênfase é semântica antes de ser
 * visual: um leitor de tela também precisa ouvir onde a frase pesa. A
 * classe `.enfase` (globals.css) troca a romana pela itálica 300 da mesma
 * família — mudança de voz, não de volume.
 */
export function Enfase({ children }: { readonly children: React.ReactNode }) {
  return <em className="enfase">{children}</em>;
}

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
          'mt-5 text-secao leading-[1.12]',
          invertido ? 'text-branco' : 'text-navy',
        )}
      >
        {titulo}
      </h2>
      {apoio && (
        <div
          className={cn(
            'mt-6 text-corpo leading-[1.65]',
            invertido ? 'text-ardosia-clara' : 'text-ardosia',
          )}
        >
          {apoio}
        </div>
      )}
    </Revelar>
  );
}
