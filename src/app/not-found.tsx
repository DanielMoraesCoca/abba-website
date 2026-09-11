import { Botao } from '@/components/ui/Botao';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

export default function NaoEncontrada() {
  return (
    <section
      data-fundo="escuro"
      className="capa-continua flex min-h-[70vh] items-center bg-navy-900 pt-[var(--header-h)]"
    >
      <Container largura="estreita">
        <Sobretitulo invertido>Erro 404</Sobretitulo>
        <h1 className="mt-7 text-4xl leading-[1.12] text-ice-100">
          Esta página não existe.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-[1.65] text-ice-200/70">
          Ou existiu e mudou de lugar. Nos dois casos, o caminho de volta é curto.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Botao href="/" variante="primario-invertido">
            Voltar ao início
          </Botao>
          <Botao href="/analise" variante="fantasma">
            Ir para a análise gratuita
          </Botao>
        </div>
      </Container>
    </section>
  );
}
