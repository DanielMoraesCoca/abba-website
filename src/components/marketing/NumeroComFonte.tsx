import type { Evidencia } from '@/content/tipos';
import { cn } from '@/lib/utils';

/** "2026-09-09" → "09/2026". Mês e ano bastam; o dia é ruído aqui. */
function formatarConferencia(iso: string): string {
  const [ano, mes] = iso.split('-');
  return `${mes}/${ano}`;
}

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
          'nums font-display text-4xl leading-[1.05] tracking-[-0.02em]',
          escuro ? 'text-gold-400' : 'text-navy-700',
        )}
      >
        {evidencia.numero}
      </p>

      <p
        className={cn(
          'mt-3 text-base leading-relaxed',
          escuro ? 'text-ice-200/85' : 'text-slate-700',
        )}
      >
        {evidencia.afirmacao}
      </p>

      <figcaption
        className={cn(
          'mt-auto pt-6 font-mono text-mono leading-relaxed',
          escuro ? 'text-ice-300/65' : 'text-slate-500',
        )}
      >
        <span className={escuro ? 'text-gold-400' : 'text-gold-700'}>Fonte · </span>
        {/* Quando há página oficial, a fonte É o link. Não é rodapé nem
            ícone: é o próprio nome, clicável, no mesmo bloco. O leitor que
            quiser conferir confere em um gesto — e é isso que separa "com
            fonte" de "com fonte que dá para ver". */}
        {evidencia.url ? (
          <a
            href={evidencia.url}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'underline decoration-[1px] underline-offset-[0.22em] transition-colors duration-[var(--duration-micro)]',
              escuro
                ? 'decoration-gold-400/40 hover:text-ice-100 hover:decoration-gold-400'
                : 'decoration-gold-700/40 hover:text-navy-700 hover:decoration-gold-700',
            )}
          >
            {evidencia.fonte}
          </a>
        ) : (
          evidencia.fonte
        )}{' '}
        ({evidencia.ano}) · {ROTULO_CONFIANCA[evidencia.confianca]}
        {evidencia.conferidaEm && (
          <> · conferida em {formatarConferencia(evidencia.conferidaEm)}</>
        )}
        {evidencia.ressalva && (
          <span className="mt-2 block italic">Ressalva: {evidencia.ressalva}</span>
        )}
      </figcaption>
    </figure>
  );
}
