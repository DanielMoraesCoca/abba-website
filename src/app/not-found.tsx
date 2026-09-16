import { Botao } from '@/components/ui/Botao';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

export default function NaoEncontrada() {
  return (
    <section
      data-fundo="escuro"
      className="capa-continua flex min-h-[70vh] items-center bg-navy-escuro pt-[var(--header-h)]"
    >
      <Container largura="estreita">
        <Sobretitulo invertido>Erro 404</Sobretitulo>
        <h1 className="mt-7 text-secao leading-[1.12] text-branco">
          Esta página não existe.
        </h1>
        <p className="mt-6 max-w-lg text-corpo leading-[1.65] text-ardosia-clara">
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
