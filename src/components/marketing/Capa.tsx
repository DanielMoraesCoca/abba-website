import { Constelacao } from '@/components/brand/Constelacao';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { HEADLINE } from '@/content/identidade';

/**
 * A capa. Navy profundo, a constelação da marca ao fundo, o dourado só nos
 * detalhes. A primeira frase diz o que não dá para fazer de dentro — é
 * regra de posicionamento, não escolha de copy.
 */
export function Capa() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 pb-24 pt-[calc(var(--header-h)+5rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+7rem)]">
      <Constelacao className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

      {/* Vinheta: escurece as bordas para o texto ganhar a página sem caixa. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_20%_25%,transparent_0%,var(--color-navy-900)_78%)]"
      />

      <Container largura="larga">
        <Revelar className="max-w-4xl">
          <Sobretitulo invertido>Consultoria de transformação em IA · Brasil</Sobretitulo>

          <h1 className="mt-8 text-[2.4rem] leading-[1.08] text-ice-100 sm:text-[3.4rem] lg:text-[4rem]">
            {HEADLINE.titulo}
          </h1>

          <p className="mt-8 max-w-2xl text-[1.1rem] leading-[1.6] text-ice-200/80 sm:text-[1.2rem]">
            {HEADLINE.sub}
          </p>

          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Botao href="/analise" variante="primario-invertido">
              Começar a análise gratuita
            </Botao>
            <Botao href="/o-que-fazemos" variante="fantasma">
              Ver como funciona
            </Botao>
          </div>
        </Revelar>

        {/* A régua de fatos: prazo, estrutura, garantia. Número, prazo, nome. */}
        <RevelarLista
          as="ul"
          className="mt-20 grid gap-px overflow-hidden border-y border-ice-200/12 sm:mt-28 sm:grid-cols-3"
          passo={0.11}
        >
          {[
            { chave: '6 semanas', valor: 'até a primeira prova medida, com métrica combinada na semana 1' },
            { chave: '3 portões', valor: 'de saída limpa ao longo do ano — nenhum deles com multa' },
            { chave: '25 dimensões', valor: 'na avaliação profunda, das quais quase todas exigem estar dentro' },
          ].map((item) => (
            <RevelarItem
              as="li"
              key={item.chave}
              className="border-t border-ice-200/12 py-7 first:border-t-0 sm:border-t-0"
            >
              <p className="nums font-display text-[1.7rem] text-gold-400">{item.chave}</p>
              <p className="mt-2 max-w-xs text-[0.94rem] leading-relaxed text-ice-300/65">
                {item.valor}
              </p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Container>
    </section>
  );
}
