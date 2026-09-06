import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

/**
 * A capa das páginas internas. Curta de propósito: navy, sobretítulo,
 * título, uma linha de apoio. Nenhuma página interna disputa a capa da home.
 */
export function CapaDePagina({
  sobretitulo,
  titulo,
  apoio,
  largura = 'padrao',
}: {
  readonly sobretitulo: string;
  readonly titulo: string;
  readonly apoio?: React.ReactNode;
  readonly largura?: 'estreita' | 'padrao' | 'larga';
}) {
  return (
    <section data-fundo="escuro" className="bg-navy-900 pb-16 pt-[calc(var(--header-h)+4.5rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+6rem)]">
      <Container largura={largura}>
        <Revelar className="max-w-3xl">
          <Sobretitulo invertido>{sobretitulo}</Sobretitulo>
          <h1 className="mt-7 text-[2.2rem] leading-[1.1] text-ice-100 sm:text-[3.1rem]">
            {titulo}
          </h1>
          {apoio && (
            <div className="mt-8 text-[1.06rem] leading-[1.65] text-ice-200/75">{apoio}</div>
          )}
        </Revelar>
      </Container>
    </section>
  );
}
