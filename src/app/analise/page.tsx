import { Suspense } from 'react';
import { Assistente } from '@/components/analise/Assistente';
import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { maiuscula, porExtenso } from '@/lib/tipografia';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'A primeira leitura',
  descricao:
    `${maiuscula(porExtenso(TOTAL_DE_PERGUNTAS))} perguntas fechadas sobre a sua operação, e de volta onde vocês ` +
    'estão e qual é o passo seguinte. Gratuito, sem cadastro, com o limite declarado na mesma tela.',
  caminho: '/analise',
});

export default function PaginaAnalise() {
  return (
    <>
      <section data-fundo="escuro" className="capa-continua bg-navy-escuro pb-16 pt-[calc(var(--header-h)+4.5rem)] sm:pb-20">
        <Container largura="estreita">
          <Revelar>
            <Sobretitulo invertido>Gratuito · cerca de três minutos</Sobretitulo>
            <h1 className="mt-7 text-secao leading-[1.12] text-branco">
              A leitura chega feita, não oferecida.
            </h1>
            <p className="mt-7 text-corpo leading-[1.65] text-ardosia-clara">
              {maiuscula(porExtenso(TOTAL_DE_PERGUNTAS))} perguntas fechadas sobre como o dinheiro anda dentro da
              sua empresa. De volta, onde vocês estão hoje, por onde o dinheiro sai, as perguntas que
              só quem está dentro responde, e o passo seguinte. Sem cadastro obrigatório: a leitura
              aparece antes de qualquer formulário.
            </p>
          </Revelar>
        </Container>
      </section>

      <section className="bg-branco py-16 sm:py-24">
        <Container largura="estreita">
          {/* O Assistente lê `?porte=` da URL, e ler parâmetro de busca no
              cliente exige esta fronteira. Sem ela a página inteira sairia
              do build estático e passaria a ser renderizada a cada pedido —
              o custo de uma pergunta adiantada não pode ser esse. */}
          <Suspense fallback={<div className="min-h-[28rem]" />}>
            <Assistente />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
