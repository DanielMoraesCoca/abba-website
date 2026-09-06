import { cn } from '@/lib/utils';
import { Container } from './Container';

type Tom = 'claro' | 'gelo' | 'navy' | 'navy-profundo';

const FUNDOS: Record<Tom, string> = {
  claro: 'bg-paper text-navy-700',
  gelo: 'bg-ice-200 text-navy-700',
  navy: 'bg-navy-700 text-ice-200',
  'navy-profundo': 'bg-navy-900 text-ice-200',
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
