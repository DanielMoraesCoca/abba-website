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
        escuro ? 'border-ouro/35' : 'border-navy/15',
        className,
      )}
    >
      <p
        className={cn(
          'nums font-display text-secao leading-[1.05] tracking-[-0.02em]',
          escuro ? 'text-ouro-claro' : 'text-navy',
        )}
      >
        {evidencia.numero}
      </p>

      <p
        className={cn(
          'mt-3 text-corpo leading-relaxed',
          escuro ? 'text-ardosia-clara' : 'text-ardosia',
        )}
      >
        {evidencia.afirmacao}
      </p>

      <figcaption
        className={cn(
          'mt-auto pt-6 font-mono text-rotulo leading-relaxed',
          escuro ? 'text-ardosia-clara' : 'text-ardosia',
        )}
      >
        <span className={escuro ? 'text-ouro-claro' : 'text-ardosia'}>Fonte · </span>
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
                ? 'decoration-ouro-claro/40 hover:text-branco hover:decoration-ouro-claro'
                : 'decoration-ardosia/40 hover:text-navy hover:decoration-navy',
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
          /* A ressalva era itálica dentro de uma legenda em mono, e a Plex
             Mono não tem itálica carregada: o navegador inclinava a romana
             na marra. O rótulo "Ressalva" já separa a frase do resto; o que
             ela precisava era de ar, não de inclinação falsa. */
          <span className="mt-2 block">Ressalva: {evidencia.ressalva}</span>
        )}
      </figcaption>
    </figure>
  );
}
