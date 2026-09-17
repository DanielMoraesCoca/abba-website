import Link from 'next/link';
import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Declaracao } from '@/components/marketing/Declaracao';
import { DadosEstruturados } from '@/components/marketing/DadosEstruturados';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { ALINHAMENTO, CAMINHOS } from '@/content/caminhos';
import { PERGUNTAS } from '@/content/perguntas';
import { PRECO_PUBLICO, REGRAS_DE_INVESTIMENTO } from '@/content/precos';
import { jsonLdPerguntas, metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'O que fazemos',
  descricao:
    'Três caminhos e três fases: o assessment gratuito, o Programa AI Native · Ano 1, e o Conselheiro de IA. ' +
    'Como a ABBA instala capacidade e prova o que mudou.',
  caminho: '/o-que-fazemos',
});

export default function PaginaOQueFazemos() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Modelo de serviço"
        titulo={
          <>
            Não vendemos cardápio. Vendemos um programa que instala capacidade e{' '}
            <Enfase>prova</Enfase> o que ela mudou.
          </>
        }
        apoio={
          <p>
            Não treinamento. Não ferramenta. Não piloto solto que morre em slide. Três caminhos, e
            só três, porque atendem a três situações diferentes, e a primeira é de graça.
          </p>
        }
      />

      {/* ESTA PÁGINA ESCOLHE. ELA NÃO RESUME.
          ══════════════════════════════════════════════════════════════
          O que estava aqui era a descrição completa dos três caminhos, com
          a mesma `descricao` e os mesmos cinco `itens` que a home já
          renderiza e que /assessment-gratuito, /programa e /conselheiro
          renderizam com mais profundidade. Três lugares contando a mesma
          coisa, e o terceiro sempre pior que o segundo.

          O papel desta página é o outro: decidir QUAL dos três é o seu. O
          que decide isso é a condição de entrada de cada um, que já existe
          no conteúdo como `paraQuem`. Então é ela que aparece, primeiro e
          em corpo de leitura, e a descrição some. Quem se reconhece numa
          linha clica; quem não se reconhece em nenhuma tem a conversa, que
          é o quarto caminho e sempre foi.

          O que a página perdeu em palavras ela ganhou em função. */}
      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Qual é o seu"
          titulo={
            <>
              Três portas, e a condição de entrada de cada uma está{' '}
              <Enfase>escrita</Enfase>.
            </>
          }
          apoio={
            <p>
              Se você não se reconhecer em nenhuma das três, a conversa resolve em quarenta e cinco
              minutos e não custa nada. Vender o caminho errado para o cliente certo é o jeito mais
              rápido de perder os dois.
            </p>
          }
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.07}>
          {CAMINHOS.map((caminho) => (
            <RevelarItem
              as="article"
              key={caminho.id}
              className="grid gap-6 border-t border-navy/15 py-10 lg:grid-cols-[16rem_1fr] lg:gap-16"
            >
              <div>
                <p className="nums font-mono text-rotulo tracking-[0.2em] text-ardosia">
                  Caminho {String(caminho.ordem).padStart(2, '0')}
                </p>
                <h2 className="mt-4 text-lede leading-tight text-navy">{caminho.nome}</h2>
                <p className="mt-3 text-legenda leading-relaxed text-ardosia">
                  {caminho.chamada}
                </p>
              </div>

              <div>
                <p className="max-w-[54ch] text-corpo leading-[1.7] text-navy">
                  {caminho.paraQuem}
                </p>

                <Link
                  href={caminho.href}
                  className="mt-7 inline-flex items-center gap-2 font-mono text-legenda uppercase tracking-[0.12em] text-navy underline-offset-4 transition-colors hover:text-ardosia hover:underline"
                >
                  {caminho.cta.texto} →
                </Link>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* AS TRÊS FASES SAÍRAM DAQUI, E ERAM A TERCEIRA CÓPIA.
          ──────────────────────────────────────────────────────────────
          A home conta as três fases com os entregáveis e o portão de cada
          uma. A /programa conta com a linha do tempo, o preço da saída e o
          que o cliente leva embora em cada portão. Esta página contava uma
          terceira vez, mais curta que as duas, sem acrescentar nada.

          Uma prateleira que reconta o catálogo inteiro deixa de ser
          prateleira. O leitor que quiser as fases clica no Caminho 02, que
          é o que a linha acima existe para fazer. */}

      <Declaracao titulo={ALINHAMENTO.titulo} texto={ALINHAMENTO.texto} />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Investimento"
          titulo="Como o dinheiro é combinado, e o que a gente nunca faz com ele."
          apoio={
            PRECO_PUBLICO ? undefined : (
              <p>
                Os valores vão na proposta, não no site: o Termo do Programa é feito depois da
                conversa, e um preço fora de contexto vira comparação com a coisa errada. As regras,
                essas, valem sempre e estão aqui.
              </p>
            )
          }
        />

        <RevelarLista className="mt-14 grid gap-x-14 gap-y-9 sm:grid-cols-2" passo={0.05}>
          {REGRAS_DE_INVESTIMENTO.map((regra) => (
            <RevelarItem key={regra.titulo} className="border-t border-navy/15 pt-5">
              <h3 className="text-corpo font-medium leading-snug text-navy">
                {regra.titulo}
              </h3>
              <p className="mt-2.5 text-legenda leading-relaxed text-ardosia">{regra.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Botao href="/assessment-gratuito">Começar pelo assessment gratuito</Botao>
          <Botao href="/contato" variante="secundario">
            Falar com um sócio
          </Botao>
        </Revelar>
      </Secao>

      {/* As objeções, respondidas antes da reunião. Publicar a resposta
          difícil — "não temos histórico" — é o que mais separa a ABBA de
          quem promete média de mercado. */}
      <Secao tom="gelo" espaco="amplo" id="perguntas">
        <TituloDeSecao
          sobretitulo="As perguntas que a gente ouve"
          titulo="Inclusive a difícil, respondida do mesmo jeito que respondemos na sala."
        />

        <RevelarLista as="ul" className="mt-14 space-y-px" passo={0.04}>
          {PERGUNTAS.map((item) => (
            <RevelarItem
              as="li"
              key={item.pergunta}
              className="grid gap-4 border-t border-navy/15 py-8 md:grid-cols-[1fr_1.4fr] md:gap-12"
            >
              <h3 className="text-corpo font-medium leading-snug text-navy">
                {item.pergunta}
              </h3>
              <p className="text-legenda leading-[1.7] text-ardosia">{item.resposta}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <DadosEstruturados dados={jsonLdPerguntas(PERGUNTAS)} />
      {/* O dado estruturado do Programa mudou de página junto com o
          conteúdo. Ele descrevia as três fases, e as três fases não estão
          mais aqui: marcação que descreve o que a página não mostra é
          exatamente o que buscador chama de conteúdo enganoso, e é o tipo de
          coisa que uma casa que vende prova não faz nem por descuido. Foi
          para /programa, que é onde as fases moram. */}
    </>
  );
}
