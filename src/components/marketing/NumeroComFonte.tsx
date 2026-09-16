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
          /* `tracking-[0.02em]` cancela a entreletra de rótulo.
             ────────────────────────────────────────────────────────────
             O degrau de 13px do sistema carrega `letter-spacing: .24em`,
             porque foi desenhado para RÓTULO: três palavras em caixa alta,
             onde o ar entre as letras é o que dá a elas peso de etiqueta.
             Esta legenda não é rótulo: é a linha da fonte, com nome de
             pesquisa, ano e nível de confiança. Com .24em ela quebrava em
             seis linhas e empurrava o número para longe da própria fonte.
             Fotografei e reprovei. */
          'mt-auto pt-6 font-mono text-rotulo leading-relaxed tracking-[0.02em]',
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
      </figcaption>

      {/* A RESSALVA SAI DA MONO. É regra, não gosto.
          ──────────────────────────────────────────────────────────────
          A régua da casa diz que IBM Plex Mono vale para rótulo, número,
          e-mail e dado, e NUNCA para texto corrido. A ressalva da METR tem
          sessenta palavras: é texto corrido, por qualquer definição. Em
          mono de 13px, numa coluna de um terço, ela virava um muro cinza
          de quinze linhas que dominava a seção e fazia o leitor pular
          justamente a parte mais honesta do bloco.

          Em Source Serif de 16px ela lê como o que é: a frase em que a
          casa conta o limite da própria evidência. A ressalva continua
          visível sem clique e sem hover, que é a única coisa que a trava
          exige dela.

          O itálico também saiu: a Plex Mono não tinha itálica carregada e
          o navegador inclinava a romana na marra. O rótulo "Ressalva" já
          separa a frase do resto. */}
      {evidencia.ressalva && (
        <p
          className={cn(
            'mt-4 text-legenda leading-[1.6]',
            escuro ? 'text-ardosia-clara' : 'text-ardosia',
          )}
        >
          <span
            className={cn(
              'mr-1.5 font-mono text-rotulo uppercase tracking-[0.12em]',
              escuro ? 'text-ouro-claro' : 'text-ardosia',
            )}
          >
            Ressalva
          </span>
          {evidencia.ressalva}
        </p>
      )}
    </figure>
  );
}
