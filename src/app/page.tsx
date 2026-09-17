import Link from 'next/link';
import { Capa } from '@/components/marketing/Capa';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { PrimeiraPergunta } from '@/components/marketing/PrimeiraPergunta';
import { Tese } from '@/components/marketing/Tese';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { porExtenso } from '@/lib/tipografia';
import { cn } from '@/lib/utils';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { evidencia } from '@/content/evidencias';
import { CONTATO, HEADLINE, PRATELEIRA } from '@/content/identidade';
import { RECUSAS } from '@/content/manifesto';

/**
 * A HOME É UM ARGUMENTO EM CINCO PASSOS, NESTA ORDEM.
 *
 * ════════════════════════════════════════════════════════════════════════
 * A ordem vem do briefing de marca §8 e não é negociável por gosto: é a
 * ordem em que um desconhecido aceita ouvir. A regra que a governa cabe
 * numa linha, e a versão anterior desta página a quebrava logo na segunda
 * seção: NÃO ABRIR FALANDO DA EMPRESA.
 *
 *   1. o problema dele       o piloto que não virou operação
 *   2. por que a maioria erra a prova, com fonte
 *   3. como se faz diferente o número combinado antes
 *   4. por que dá para confiar as recusas escritas, e quem assina
 *   5. o convite             a primeira leitura, e um e-mail
 *
 * Cada passo tem UMA palavra em itálico no título. Uma, não duas: duas
 * ênfases numa frase é o mesmo que nenhuma.
 *
 * Os números de cada passo saem da base de evidências, com a fonte dentro
 * da própria frase, pelo `NumeroComFonte`. Não existe caminho de código
 * nesta página que mostre um número sem mostrar de onde ele veio.
 * ════════════════════════════════════════════════════════════════════════
 */

/**
 * Passo 2: por que a maioria erra.
 *
 * Quatro, e não dois. Os dois primeiros abriam uma seção própria de passo 1,
 * logo abaixo da capa, e a seção inteira saiu quando o passo 1 virou a
 * própria capa. Eles não foram descartados: o tamanho do fracasso e a
 * quantidade de treinamento que não vira trabalho SÃO "por que a maioria
 * erra". Estavam separados da própria conclusão por uma quebra de seção.
 */
const NUMEROS_DO_ERRO = ['rand-80', 'rand-causa-1', 'wharton-medicao', 'kpmg-brasil-47'] as const;

/** Passo 3: como se faz diferente. */
const NUMEROS_DO_METODO = ['metr-19', 'dora-amplifica', 'cui-26'] as const;

/** Passo 4: por que dá para confiar. */
const NUMEROS_DA_CONFIANCA = ['bcg-5', 'mckinsey-outcome'] as const;

export default function PaginaInicial() {
  return (
    <>
      <Capa />

      {/* AQUI HAVIA UMA FAIXA DE GRAFO, E ELA SAIU.
          ──────────────────────────────────────────────────────────────
          Era uma malha de nós e linhas douradas atravessando a largura da
          tela, como respiro entre a capa e o passo 2. O componente
          existia, era bem-feito, era determinístico e não custava uma
          requisição de rede.

          E era o logo de cérebro aposentado em outra forma, que é
          exatamente o que o briefing §10.3 tirou do site: a constelação da
          capa saiu por esse motivo, e esta faixa é a mesma figura em escala
          de arquitetura. A própria documentação do componente dizia "a
          marca-símbolo É um grafo", e a marca deixou de ter símbolo: ela é
          o nome, escrito.

          O respiro não sumiu junto. Quem separa o passo 1 do passo 2 agora
          é a troca de fundo, de branco para navy, que é o único corte de
          tom dessa força na página inteira. Um marco que já existia e
          estava sendo somado a outro.

          Onde esta página pedir imagem no futuro, a resposta continua
          sendo a mesma do briefing §7: captura de tela real do software da
          casa. A régua bloqueando uma frase. O registro com a métrica
          combinada antes. É a única imagem que ninguém consegue
          falsificar, e é o que nenhum concorrente tem. */}

      {/* ── Passo 2 · Por que a maioria erra ─────────────────────────────
          Fundo navy: é o único passo do argumento em que a ABBA não aparece,
          e a mudança de tom marca isso melhor do que qualquer rótulo. Aqui
          só falam a RAND e a Wharton. */}
      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="Passo 02 · por que a maioria erra"
          titulo={
            <>
              A causa número um não é <Enfase>técnica</Enfase>.
            </>
          }
          apoio={
            <p>
              A pesquisa mais séria que existe sobre isso, da RAND, mediu que mais de 80% dos
              projetos de IA falham, o dobro dos projetos de TI comuns, e que a causa número um é
              começar sem combinar o que seria dar certo.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-2" passo={0.08}>
          {NUMEROS_DO_ERRO.map((id) => (
            <RevelarItem key={id}>
              <NumeroComFonte evidencia={evidencia(id)} tom="escuro" />
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14">
          <Botao href="/evidencias" variante="fantasma">
            Ver a base de evidências inteira, inclusive o que a gente proibiu de usar
          </Botao>
        </Revelar>
      </Secao>

      {/* ── Passo 3 · Como se faz diferente ───────────────────────────── */}
      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Passo 03 · como se faz diferente"
          titulo={
            <>
              O número é combinado <Enfase>antes</Enfase>.
            </>
          }
          apoio={
            <p>
              A METR mediu desenvolvedores experientes ficando 19% mais lentos com IA enquanto saíam
              convencidos de que tinham ficado 20% mais rápidos: um erro de percepção de quarenta
              pontos que só aparece quando alguém mede de fora.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-3" passo={0.08}>
          {NUMEROS_DO_METODO.map((id) => (
            <RevelarItem key={id}>
              <NumeroComFonte evidencia={evidencia(id)} />
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* A leitura dos 70/30, em prosa. Ela desceu da abertura para cá por
          decisão do briefing (§10.8): é tese da casa, não estatística, e um
          numeral de display na primeira tela seria lido como medição por
          qualquer pessoa, por mais cuidadosa que fosse a frase ao redor. */}
      <Tese />

      {/* ── Ainda o passo 3: a prateleira, e os três caminhos ──────────
          A grade é 1,35 : 1 : 1 de propósito. O assessment gratuito é a porta
          única de entrada e é gratuito; dar a ele a mesma largura dos outros
          dois seria desenhar um cardápio, que é exatamente o que a doutrina
          proíbe. A hierarquia visual repete a hierarquia comercial.

          Fundo branco, e não papel: o bloco da leitura da casa, logo acima,
          já é papel. Duas seções claras adjacentes no mesmo tom viram um
          bloco só, e o ritmo da página some justamente na emenda entre o
          argumento e a oferta. */}
      <Secao tom="claro" espaco="amplo" id="caminhos">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <TituloDeSecao
            sobretitulo="A prateleira"
            titulo={PRATELEIRA.titulo}
            className="max-w-none"
          />
          <Revelar className="space-y-7 lg:pt-3">
            <p className="max-w-[54ch] text-lede leading-[1.6] text-navy">{PRATELEIRA.texto}</p>
            <div className="rule-gold max-w-[54ch]" aria-hidden />
            <p className="max-w-[54ch] text-corpo leading-[1.7] text-ardosia">
              {PRATELEIRA.analogia}
            </p>
          </Revelar>
        </div>

        <TituloDeSecao
          className="mt-24"
          sobretitulo="A vitrine inteira"
          titulo="Três caminhos. Nada mais é oferecido em primeiro contato."
          apoio={
            <p>
              Um cardápio de serviços empurra a conversa para preço. Estes três caminhos existem
              porque atendem a três situações diferentes, e a primeira é de graça.
            </p>
          }
        />

        <RevelarLista
          className="mt-16 grid gap-x-10 gap-y-14 lg:grid-cols-[1.35fr_1fr_1fr]"
          passo={0.07}
        >
          {CAMINHOS.map((caminho) => (
            <RevelarItem
              as="article"
              key={caminho.id}
              className={cn(
                'group flex flex-col border-t pt-8 transition-colors duration-500 hover:border-ouro',
                caminho.ordem === 1
                  ? 'border-ouro/70'
                  : 'border-navy/15',
              )}
            >
              <p className="nums font-mono text-rotulo tracking-[0.2em] text-ardosia">
                {String(caminho.ordem).padStart(2, '0')}
              </p>
              <h3
                className={cn(
                  'mt-5 leading-tight text-navy',
                  caminho.ordem === 1 ? 'text-secao' : 'text-lede',
                )}
              >
                {caminho.nome}
              </h3>
              <p className="mt-2 font-mono text-rotulo uppercase tracking-[0.12em] text-ardosia">
                {caminho.chamada}
              </p>
              <p className="mt-5 text-legenda leading-[1.65] text-ardosia">
                {caminho.descricao}
              </p>

              <ul className="mt-7 space-y-2.5">
                {caminho.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-legenda leading-relaxed text-ardosia"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ouro" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={caminho.href}
                className="mt-8 inline-flex items-center gap-2 self-start font-mono text-legenda uppercase tracking-[0.12em] text-navy transition-colors hover:text-ardosia"
              >
                {caminho.cta.texto}
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--duration-micro)] ease-[var(--ease-micro)] group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* ── Ainda o passo 3: as três fases ─────────────────────────────
          Deslocada: depois de cinco seções alinhadas à esquerda, o olho já
          decorou a linha vertical. Quebrá-la aqui é o que faz a próxima
          seção ser lida em vez de folheada. */}
      <Secao tom="gelo" espaco="amplo" alinhamento="deslocada">
        <TituloDeSecao
          sobretitulo="AI Native · Ano 1"
          titulo="Doze meses, três fases, três portões de saída sem multa."
          apoio={
            <p>
              A fase 1 é firme e pequena: alçada de um diretor. O ano inteiro entra no mesmo
              documento como opção, condicionada ao que a fase 1 provar.
            </p>
          }
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.07}>
          {FASES.map((fase) => (
            <RevelarItem
              as="article"
              key={fase.id}
              className="grid gap-6 border-t border-navy/15 py-10 md:grid-cols-[13rem_1fr] md:gap-12"
            >
              <div>
                <p className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
                  {fase.rotulo}
                </p>
                <h3 className="mt-3 text-lede leading-tight text-navy">{fase.nome}</h3>
                <p className="nums mt-2 font-mono text-legenda text-ardosia">{fase.janela}</p>
              </div>

              <div>
                <p className="text-corpo leading-[1.65] text-navy">{fase.promessa}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {fase.entregaveis.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-legenda leading-relaxed text-ardosia"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ouro" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-l-2 border-ouro pl-5 text-legenda leading-relaxed text-ardosia">
                  <strong className="font-medium text-navy">{fase.portao.nome}.</strong>{' '}
                  {fase.portao.regra}
                </p>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* ── O fecho do passo 3: a definição, e só agora ────────────────
          Esta é a frase que abria a home até aqui, e o lugar dela é este.

          Ela é o teste de pertencimento da casa: a régua contra a qual todo
          material novo é medido ("se um material não cabe nessa frase, ele
          não é da ABBA"). Como abertura, ela respondia uma pergunta que o
          leitor ainda não tinha feito, e fazia a home abrir falando da
          empresa, que é o que a §8 proíbe.

          Depois de três seções sobre o problema dele, sobre o que a medição
          diz, e sobre como o trabalho é feito, a pergunta existe. É aqui que
          "então o que vocês são?" tem resposta, e a resposta é uma
          definição, não uma promessa. */}
      <Secao tom="navy" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <p className="font-mono text-rotulo uppercase leading-[1.7] tracking-[0.22em] text-ouro-claro">
            Em uma frase
          </p>
          <p className="mt-8 font-display text-secao leading-[1.15] text-branco">
            {HEADLINE.titulo}
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-corpo leading-[1.7] text-ardosia-clara">
            {HEADLINE.sub}
          </p>
        </Revelar>
      </Secao>

      {/* ── Passo 4 · Por que dá para confiar ───────────────────────────
          O título deste passo foi escrito errado uma vez, e o erro vale a
          nota: a primeira versão dizia "o que a gente recusa está escrito",
          como se a credibilidade viesse da nossa assinatura. Vem do
          contrário. Quem valida o veredito é uma pessoa NOMEADA DO CLIENTE,
          e é isso que torna a prova independente de nós. */}
      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Passo 04 · por que dá para confiar"
          titulo={
            <>
              Quem assina o resultado trabalha na <Enfase>sua</Enfase> empresa.
            </>
          }
          apoio={
            <p>
              A métrica é combinada antes com uma pessoa nomeada do seu time, e o veredito volta
              validado por ela: é isso que torna a prova independente, e é por isso que a ABBA não
              assina sozinha.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-2" passo={0.08}>
          {NUMEROS_DA_CONFIANCA.map((id) => (
            <RevelarItem key={id}>
              <NumeroComFonte evidencia={evidencia(id)} />
            </RevelarItem>
          ))}
        </RevelarLista>

        <TituloDeSecao
          className="mt-24"
          sobretitulo="O manifesto"
          titulo="A lista do que recusamos é o que torna a lista do que prometemos crível."
          apoio={
            <p>
              Uma empresa é o conjunto de coisas que ela faz de um jeito e não do outro, de forma
              tão consistente que o cliente consegue prever. Esta é parte da lista.
            </p>
          }
        />

        <RevelarLista className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-2" passo={0.05}>
          {RECUSAS.slice(0, 6).map((item) => (
            <RevelarItem key={item.recusa} className="border-t border-navy/15 pt-5">
              <h3 className="text-corpo font-medium leading-snug text-navy">
                {item.recusa}
              </h3>
              <p className="mt-2 text-legenda leading-relaxed text-ardosia">{item.porque}</p>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-12">
          <Botao href="/manifesto" variante="secundario">
            Ler o manifesto inteiro
          </Botao>
        </Revelar>
      </Secao>

      {/* ── Passo 5 · O convite ─────────────────────────────────────────
          A primeira pergunta é feita aqui mesmo, e a resposta viaja em
          `?porte=`. Quem já leu os quatro passos anteriores não deveria
          precisar de mais um clique para começar. */}
      <PrimeiraPergunta />

      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.15] text-branco">
            A primeira <Enfase>leitura</Enfase>, sem cifra e sem cadastro.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.65] text-ardosia-clara">
            Responda {porExtenso(TOTAL_DE_PERGUNTAS)} perguntas sobre a operação e a gente devolve, na hora,
            onde vocês estão, por onde o dinheiro sai, e o passo seguinte. Com o limite do que dá
            para ver de fora declarado na mesma tela.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Botao href="/analise" variante="primario-invertido">
              Fazer a primeira leitura
            </Botao>
            <Botao href="/contato" variante="fantasma">
              Falar com um sócio
            </Botao>
          </div>
          {/* O que reduz o risco percebido de clicar em "Falar com um sócio"
              não é adjetivo: é saber quando a resposta vem. A promessa já
              existia na página de contato; quem decide na home não chegava
              lá. */}
          <p className="mt-8 font-mono text-rotulo tracking-wide text-ardosia-clara">
            Sem cadastro em lista. Sem cobrança depois. Leva cerca de três minutos.{' '}
            {CONTATO.prazoResposta}
          </p>
        </Revelar>
      </Secao>
    </>
  );
}
