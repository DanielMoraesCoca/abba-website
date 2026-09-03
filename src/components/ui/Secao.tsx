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
 * A seção é a unidade de ritmo do site. Alternar `tom` entre claro, gelo e
 * navy é o que dá cadência à rolagem — sem isso a página vira um documento
 * longo. A regra é simples: nunca dois navy seguidos, e o dourado nunca
 * vira fundo.
 */
export function Secao({
  children,
  tom = 'claro',
  largura = 'padrao',
  id,
  className,
  espaco = 'normal',
}: {
  readonly children: React.ReactNode;
  readonly tom?: Tom;
  readonly largura?: 'estreita' | 'padrao' | 'larga';
  readonly id?: string;
  readonly className?: string;
  readonly espaco?: 'normal' | 'amplo' | 'curto';
}) {
  return (
    <section
      id={id}
      className={cn(
        FUNDOS[tom],
        espaco === 'curto' && 'py-14 sm:py-16',
        espaco === 'normal' && 'py-20 sm:py-28',
        espaco === 'amplo' && 'py-24 sm:py-36',
        className,
      )}
    >
      <Container largura={largura}>{children}</Container>
    </section>
  );
}
