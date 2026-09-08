import { Suspense } from 'react';
import { Assistente } from '@/components/analise/Assistente';
import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { maiuscula, porExtenso } from '@/lib/tipografia';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Análise ABBA — a leitura preliminar do seu vazamento',
  descricao:
    `${maiuscula(porExtenso(TOTAL_DE_PERGUNTAS))} perguntas sobre a sua operação e uma faixa em reais do que estimamos estar saindo sem precisar sair. ` +
    'Gratuito, com as premissas na mesa e o limite declarado.',
  caminho: '/analise',
});

export default function PaginaAnalise() {
  return (
    <>
      <section data-fundo="escuro" className="capa-continua bg-navy-900 pb-16 pt-[calc(var(--header-h)+4.5rem)] sm:pb-20">
        <Container largura="estreita">
          <Revelar>
            <Sobretitulo invertido>Gratuito · cerca de três minutos</Sobretitulo>
            <h1 className="mt-7 text-[2.1rem] leading-[1.12] text-ice-100 sm:text-[2.9rem]">
              A análise chega feita, não oferecida.
            </h1>
            <p className="mt-7 text-[1.05rem] leading-[1.65] text-ice-200/75">
              {maiuscula(porExtenso(TOTAL_DE_PERGUNTAS))} perguntas sobre como o dinheiro anda dentro da sua
              empresa. No fim, uma faixa
              anual em reais, o vetor por onde ele sai, as premissas que usamos e o que não deu para
              ver de fora. Sem cadastro obrigatório: o resultado aparece antes de qualquer formulário.
            </p>
          </Revelar>
        </Container>
      </section>

      <section className="bg-paper py-16 sm:py-24">
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
