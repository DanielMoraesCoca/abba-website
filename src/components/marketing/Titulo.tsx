import { cn } from '@/lib/utils';
import { RotuloPreso } from '@/components/ui/RotuloPreso';
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
  preso = false,
  className,
}: {
  readonly sobretitulo?: string;
  readonly titulo: React.ReactNode;
  readonly apoio?: React.ReactNode;
  readonly invertido?: boolean;
  readonly centralizado?: boolean;
  /**
   * Prende o sobretítulo no alto enquanto a seção rola por baixo. Ver
   * `RotuloPreso`: é a diferença entre uma página que rola e uma que
   * conduz, e vale só em seção longa. Numa seção de uma tela, prender um
   * rótulo é movimento sem informação.
   */
  readonly preso?: boolean;
  readonly className?: string;
}) {
  /* O rótulo preso fica FORA do `Revelar`, e isto não é arrumação: é a
     única forma de funcionar. `Revelar` anima `transform`, e um ancestral
     com transform vira bloco contenedor de `position: sticky`. Dentro dele
     o rótulo prenderia contra o próprio cabeçalho, que tem a altura de duas
     linhas, e não contra a seção. Ele não quebraria: ele simplesmente não
     faria nada, que é pior, porque ninguém percebe. */
  if (preso && sobretitulo) {
    return (
      <>
        <RotuloPreso invertido={invertido}>{sobretitulo}</RotuloPreso>
        <TituloDeSecao
          titulo={titulo}
          apoio={apoio}
          invertido={invertido}
          centralizado={centralizado}
          className={cn('mt-8', className)}
        />
      </>
    );
  }

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
          sobretitulo ? 'mt-5' : '',
          'text-secao leading-[1.12]',
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
