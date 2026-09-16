import Link from 'next/link';
import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { FAIXAS_COLABORADORES } from '@/lib/analise/perguntas';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { porExtenso } from '@/lib/tipografia';

/**
 * A primeira pergunta da Análise, na porta.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A Análise é a única porta gratuita de entrada da ABBA, e na home ela
 * aparecia UMA vez, num botão perto do rodapé. Um visitante que não rolasse
 * até o fim não sabia que ela existia.
 *
 * Aqui ela começa. A pergunta é real — é literalmente a terceira pergunta
 * do assistente —, e a resposta viaja: cada opção é um link para
 * `/analise?porte=<faixa>`, e o assistente chega com o campo preenchido.
 * Não é isca; é o primeiro passo acontecendo antes da navegação.
 *
 * POR QUE LINKS E NÃO BOTÕES. Cinco links de verdade funcionam sem
 * JavaScript, abrem em nova aba, aparecem no histórico e são anunciados
 * como navegação por leitor de tela — que é o que de fato acontece. Um
 * botão que navega mente sobre o que faz.
 *
 * O lugar também é escolhido: abre o passo 5 da home, logo depois das
 * recusas escritas. Quem chegou até ali já leu por que a maioria erra, como
 * a casa faz diferente e por que dá para confiar. A pergunta seguinte
 * natural é sobre a própria empresa, e é esta.
 * ──────────────────────────────────────────────────────────────────────── */
export function PrimeiraPergunta() {
  return (
    <section data-fundo="escuro" className="bg-navy py-20 sm:py-24">
      <Container largura="larga">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Revelar>
            <Sobretitulo invertido>A primeira leitura começa aqui</Sobretitulo>
            <h2 className="mt-6 text-balance text-secao leading-[1.18] text-branco">
              Quantas pessoas trabalham na sua empresa?
            </h2>
            <p className="mt-6 max-w-[46ch] text-corpo leading-[1.7] text-ardosia-clara">
              É a primeira de {porExtenso(TOTAL_DE_PERGUNTAS)}. No fim sai onde vocês estão hoje, por onde
              o dinheiro sai, e qual é o passo seguinte. Sem cifra sobre a sua empresa: a gente não
              tem como saber isso de fora, e não finge que tem.
            </p>
          </Revelar>

          {/* Coluna única, não duas. Em duas colunas a seta de cada item é
              empurrada até a borda da célula e encosta no rótulo do item ao
              lado — parece pertencer ao seguinte. Uma lista de escolhas
              precisa que cada linha seja inequívoca. */}
          <Revelar as="ul" className="lg:pt-2">
            {FAIXAS_COLABORADORES.map((faixa) => (
              <li key={faixa.valor}>
                <Link
                  href={`/analise?porte=${faixa.valor}`}
                  className="group flex items-center justify-between gap-4 border-t border-branco/15 py-5 text-corpo text-ardosia-clara no-underline transition-colors duration-[var(--duration-micro)] ease-[var(--ease-micro)] hover:border-ouro-claro/60 hover:text-branco"
                >
                  {faixa.rotulo}
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-[0.85em] w-[0.85em] shrink-0 text-ouro-claro transition-transform duration-[var(--duration-micro)] ease-[var(--ease-micro)] group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </Link>
              </li>
            ))}
          </Revelar>
        </div>

        <p className="mt-12 font-mono text-rotulo tracking-wide text-ardosia-clara">
          Gratuito. Sem cadastro em lista. Cerca de três minutos.
        </p>
      </Container>
    </section>
  );
}
