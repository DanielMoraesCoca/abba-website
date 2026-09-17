import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { TituloQueSobe } from '@/components/motion/TituloQueSobe';
import { Botao } from '@/components/ui/Botao';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { ABERTURA } from '@/content/identidade';

/**
 * A capa: o passo 1 do argumento, e nada da ABBA.
 *
 * ════════════════════════════════════════════════════════════════════════
 * A primeira frase da home é o problema de quem lê. Isso é a §8 do briefing,
 * e a regra que a governa cabe numa linha: não abrir falando da empresa.
 *
 * Aqui estava a `HEADLINE.titulo`, que descreve o que a ABBA faz. Duas
 * coisas erradas numa só: quebrava a ordem do argumento, e usava como
 * manchete uma frase que nunca foi manchete. Aquela frase é o teste de
 * pertencimento da casa, a régua contra a qual todo material novo é medido.
 * Ela desceu para fechar o passo 3, onde o leitor já está perguntando
 * "então o que vocês são?".
 * ════════════════════════════════════════════════════════════════════════
 */
export function Capa() {
  return (
    <section data-fundo="escuro" className="capa-continua relative isolate overflow-hidden bg-navy-escuro pb-24 pt-[calc(var(--header-h)+5rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+7rem)]">
      {/* A capa é TIPOGRAFIA SOBRE NAVY, e nada mais.

          O que estava aqui era uma constelação de nós e linhas desenhada em
          canvas. Ela saiu porque é o logo de cérebro aposentado em outra
          forma, e porque a régua de imagem reprova circuito. Onde esta
          página pedir imagem no futuro, a resposta é captura de tela real
          do software da casa: a régua bloqueando uma frase, o registro com
          a métrica combinada antes. É a única imagem que ninguém consegue
          falsificar, e num mercado onde o feed está cheio de natureza-morta
          gerada por IA, isso é o ativo.

          O véu radial foi junto: ele existia para o texto vencer a
          constelação, e sem ela vira gradiente sem motivo. */}

      <Container largura="larga">
        <Revelar className="max-w-4xl">
          <Sobretitulo invertido>Transformação em IA · Brasil</Sobretitulo>

          {/* A manchete sobe palavra por palavra, e é o único lugar do
              site com esse tratamento. Ver `TituloQueSobe`. */}
          <TituloQueSobe
            texto={ABERTURA.titulo}
            enfase={ABERTURA.enfase}
            className="mt-8 text-topo leading-[1.08] text-branco"
          />

          {/* Medida: `3xl` e não `2xl`. O lede corre em 34px na tela larga,
              e numa coluna de 2xl isso dá sete linhas de quarenta e poucos
              caracteres. A régua da casa pede de 62 a 70 para texto de
              leitura, e a medida curta demais cansa tanto quanto a longa:
              o olho volta para a esquerda antes de pegar ritmo. */}
          <p className="mt-8 max-w-3xl text-lede leading-[1.55] text-ardosia-clara">
            {ABERTURA.lede}
          </p>

          <p className="mt-6 max-w-2xl text-corpo leading-[1.7] text-ardosia-clara">
            {ABERTURA.diagnostico}
          </p>

          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Botao href="/analise" variante="primario-invertido">
              Fazer a primeira leitura
            </Botao>
            {/* "Ver como funciona" era o rótulo. A pesquisa sobre chamada de
                ação é consistente: rótulo vago ("saiba mais", "como funciona")
                rende menos que rótulo com objeto — o leitor decide melhor
                quando sabe O QUE vai ver. O objeto aqui é o Programa. */}
            <Botao href="/o-que-fazemos" variante="fantasma">
              Ver como o Programa funciona
            </Botao>
          </div>
        </Revelar>

        {/* A régua de fatos: prazo, estrutura, profundidade. Número e nome, nunca
            adjetivo. E nada aqui é promessa de nível de serviço: são três coisas
            que o Programa TEM, não três coisas que a casa garante. */}
        <RevelarLista
          as="ul"
          className="mt-20 grid gap-px overflow-hidden border-y border-ardosia-clara/12 sm:mt-28 sm:grid-cols-3"
          passo={0.07}
        >
          {[
            { chave: '6 semanas', valor: 'até a primeira prova medida, com métrica combinada na semana 1' },
            { chave: '3 portões', valor: 'de saída limpa ao longo do ano: nenhum deles com multa' },
            { chave: '25 dimensões', valor: 'na avaliação profunda, das quais quase todas exigem estar dentro' },
          ].map((item) => (
            <RevelarItem
              as="li"
              key={item.chave}
              className="border-t border-ardosia-clara/12 py-7 first:border-t-0 sm:border-t-0"
            >
              <p className="nums font-display text-lede text-ouro-claro">{item.chave}</p>
              <p className="mt-2 max-w-xs text-legenda leading-relaxed text-ardosia-clara">
                {item.valor}
              </p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Container>
    </section>
  );
}
