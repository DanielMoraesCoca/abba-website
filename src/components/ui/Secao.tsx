import { cn } from '@/lib/utils';
import { Container } from './Container';

type Tom = 'claro' | 'gelo' | 'navy' | 'navy-profundo';

const FUNDOS: Record<Tom, string> = {
  claro: 'bg-branco text-navy',
  gelo: 'bg-papel text-navy',
  navy: 'bg-navy text-ardosia-clara',
  'navy-profundo': 'bg-navy-escuro text-ardosia-clara',
};

/**
 * A MESMA COR, EM VARIÁVEL, PARA QUEM PRECISA MASCARAR.
 *
 * O rótulo preso (`RotuloPreso`) flutua sobre o conteúdo da própria seção
 * enquanto ele rola por baixo. Para isso ele precisa de um fundo OPACO e
 * exatamente igual ao da seção, senão o texto atravessa o rótulo: é a mesma
 * lição que o cabeçalho de vidro deu, e ela custou uma fotografia no celular
 * para ser aprendida.
 *
 * A seção não sabe quem vai usar isso. Ela só declara a própria cor numa
 * variável, e quem precisar que leia. É o mesmo contrato do `data-fundo`,
 * que o cabeçalho lê para saber o que está passando por baixo dele.
 */
const COR_DO_FUNDO: Record<Tom, string> = {
  claro: 'var(--color-branco)',
  gelo: 'var(--color-papel)',
  navy: 'var(--color-navy)',
  'navy-profundo': 'var(--color-navy-escuro)',
};

/**
 * A seção é a unidade de ritmo do site.
 *
 * ────────────────────────────────────────────────────────────────────────
 * O QUE ESTAVA ERRADO ATÉ AQUI, E POR QUE `alinhamento` EXISTE.
 *
 * A primeira versão tinha um recurso de ritmo só: alternar o tom do fundo.
 * Resultado — sete seções seguidas com a MESMA forma, todas começando no
 * mesmo x, todas com a mesma largura. Um documento bem composto, não uma
 * página desenhada.
 *
 * `alinhamento` é a correção mínima e estrutural: a seção pode deslocar o
 * próprio conteúdo para a direita, quebrando a linha vertical que o olho
 * segue. Combinado com `sangria`, que ignora a coluna de vez, o site ganha
 * três formas em vez de uma.
 *
 * A disciplina continua: nunca dois navy seguidos, o dourado nunca vira
 * fundo, e o deslocamento só existe acima de `lg` — em telas estreitas
 * qualquer recuo vira aperto.
 * ────────────────────────────────────────────────────────────────────────
 */
export function Secao({
  children,
  tom = 'claro',
  largura = 'padrao',
  id,
  className,
  espaco = 'normal',
  alinhamento = 'esquerda',
  sangria = false,
}: {
  readonly children: React.ReactNode;
  readonly tom?: Tom;
  readonly largura?: 'estreita' | 'padrao' | 'larga';
  readonly id?: string;
  readonly className?: string;
  readonly espaco?: 'normal' | 'amplo' | 'curto';
  /** `deslocada` empurra o conteúdo para a direita a partir de `lg`. */
  readonly alinhamento?: 'esquerda' | 'deslocada';
  /** Ignora a coluna e ocupa a largura inteira da tela. */
  readonly sangria?: boolean;
}) {
  const conteudo = sangria ? (
    <>{children}</>
  ) : (
    <Container largura={largura}>{children}</Container>
  );

  return (
    <section
      id={id}
      /* O cabeçalho lê este atributo para saber o que está passando por
         baixo dele. A seção não sabe que o cabeçalho existe — ela só declara
         o próprio fundo, e quem precisa que leia. */
      data-fundo={tom === 'navy' || tom === 'navy-profundo' ? 'escuro' : 'claro'}
      style={{ '--fundo-secao': COR_DO_FUNDO[tom] } as React.CSSProperties}
      className={cn(
        FUNDOS[tom],
        espaco === 'curto' && 'py-14 sm:py-16',
        espaco === 'normal' && 'py-20 sm:py-28',
        espaco === 'amplo' && 'py-24 sm:py-36',
        className,
      )}
    >
      {alinhamento === 'deslocada' && !sangria ? (
        <Container largura={largura}>
          <div className="lg:pl-[16%]">{children}</div>
        </Container>
      ) : (
        conteudo
      )}
    </section>
  );
}
