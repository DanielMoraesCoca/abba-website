import type { Evidencia } from '@/content/tipos';
import { cn } from '@/lib/utils';

const ROTULO_CONFIANCA: Record<Evidencia['confianca'], string> = {
  alta: 'Confiança alta',
  'media-alta': 'Confiança média-alta',
  media: 'Confiança média',
};

/**
 * O jeito — o único jeito — de um número aparecer no site.
 *
 * A fonte não é nota de rodapé: ela é parte do componente, no mesmo bloco,
 * sem precisar de hover ou clique. Não existe caminho de código que exiba
 * um número da ABBA sem exibir de onde ele veio. Quando a confiança não é
 * alta, a ressalva aparece junto — não em outra página.
 */
export function NumeroComFonte({
  evidencia,
  tom = 'claro',
  className,
}: {
  readonly evidencia: Evidencia;
  readonly tom?: 'claro' | 'escuro';
  readonly className?: string;
}) {
  const escuro = tom === 'escuro';

  return (
    <figure
      className={cn(
        'flex h-full flex-col border-t pt-6',
        escuro ? 'border-gold-500/35' : 'border-navy-700/15',
        className,
      )}
    >
      <p
        className={cn(
          'nums font-display text-[2.6rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]',
          escuro ? 'text-gold-400' : 'text-navy-700',
        )}
      >
        {evidencia.numero}
      </p>

      <p
        className={cn(
          'mt-3 text-[1.02rem] leading-relaxed',
          escuro ? 'text-ice-200/85' : 'text-slate-700',
        )}
      >
        {evidencia.afirmacao}
      </p>

      <figcaption
        className={cn(
          'mt-auto pt-6 font-mono text-[0.68rem] leading-relaxed',
          escuro ? 'text-ice-300/65' : 'text-slate-500',
        )}
      >
        <span className={escuro ? 'text-gold-400' : 'text-gold-700'}>Fonte · </span>
        {evidencia.fonte} ({evidencia.ano}) · {ROTULO_CONFIANCA[evidencia.confianca]}
        {evidencia.ressalva && (
          <span className="mt-2 block italic">Ressalva: {evidencia.ressalva}</span>
        )}
      </figcaption>
    </figure>
  );
}
