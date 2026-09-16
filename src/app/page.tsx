import Link from 'next/link';
import { FaixaDeGrafo } from '@/components/brand/Grafo';
import { Capa } from '@/components/marketing/Capa';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { PrimeiraPergunta } from '@/components/marketing/PrimeiraPergunta';
import { Tese } from '@/components/marketing/Tese';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { porExtenso } from '@/lib/tipografia';
import { cn } from '@/lib/utils';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { evidencia } from '@/content/evidencias';
import { CONTATO, PRATELEIRA } from '@/content/identidade';
import { RECUSAS } from '@/content/manifesto';

/** Os três números da home. O resto do cânone vive em /evidencias. */
const NUMEROS_DA_HOME = ['rand-80', 'metr-19', 'dora-amplifica'] as const;

export default function PaginaInicial() {
  return (
    <>
      <Capa />

      {/* ── A prateleira ─────────────────────────────────────────────────
          Assimetria de 2:3: o título ocupa um terço e o argumento dois. A
          proporção desigual é o ponto — colunas iguais leem como tabela. */}
      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <TituloDeSecao
            sobretitulo="A prateleira"
            titulo={PRATELEIRA.titulo}
            className="max-w-none"
          />
          <Revelar className="space-y-7 lg:pt-3">
            <p className="max-w-[54ch] text-lede leading-[1.6] text-navy">
              {PRATELEIRA.texto}
            </p>
            <div className="rule-gold max-w-[54ch]" aria-hidden />
            <p className="max-w-[54ch] text-corpo leading-[1.7] text-ardosia">
              {PRATELEIRA.analogia}
            </p>
          </Revelar>
        </div>
      </Secao>

      {/* A faixa de grafo é o respiro entre a abertura e a tese: o único
          elemento que ignora a coluna, e por isso funciona como marco.
          Revelada por corte — a malha abre de borda a borda. */}
      <Revelar modo="corte">
        <FaixaDeGrafo semente={20260101} />
      </Revelar>

      {/* ── A tese, em escala ──────────────────────────────────────────── */}
      <Tese />

      {/* A pergunta vem logo depois da tese de propósito: quem acabou de ler
          que a maior parte do valor vive em pessoas e processos já tem a
          pergunta seguinte na cabeça, e é esta. */}
      <PrimeiraPergunta />

      {/* ── Os três caminhos ───────────────────────────────────────────── */}
      {/* ── Os três caminhos ───────────────────────────────────────────
          A grade é 1,35 : 1 : 1 de propósito. O Mapa de Vazamento é a porta
          única de entrada e é gratuito; dar a ele a mesma largura dos outros
          dois seria desenhar um cardápio, que é exatamente o que a doutrina
          proíbe. A hierarquia visual repete a hierarquia comercial. */}
      <Secao tom="claro" espaco="amplo" id="caminhos">
        <TituloDeSecao
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

      {/* ── A evidência ────────────────────────────────────────────────
          Sem faixa de grafo aqui. A primeira versão tinha uma, escura, e ela
          não se justificava: navy sobre navy lê como acidente, e um recurso
          usado duas vezes na mesma página deixa de ser marco e vira
          maneirismo. Uma vez, no lugar certo. */}
      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="Por que isso importa"
          titulo="Três números que explicam por que a ABBA existe."
          apoio={
            <p>
              Todo número que a gente usa sai com a fonte na frase, porque número de terceiro vira
              alvo de auditoria do cliente. Estes três são os que mais mudam a conversa.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-3" passo={0.08}>
          {NUMEROS_DA_HOME.map((id) => (
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

      {/* ── As três fases ──────────────────────────────────────────────
          Deslocada: depois de cinco seções alinhadas à esquerda, o olho já
          decorou a linha vertical. Quebrá-la aqui é o que faz a próxima
          seção ser lida em vez de folheada. */}
      <Secao tom="claro" espaco="amplo" alinhamento="deslocada">
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

      {/* ── O que recusamos ────────────────────────────────────────────── */}
      <Secao tom="gelo" espaco="amplo">
        <TituloDeSecao
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

      {/* ── Chamada final ──────────────────────────────────────────────── */}
      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.15] text-branco">
            A análise chega feita, não oferecida.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.65] text-ardosia-clara">
            Responda {porExtenso(TOTAL_DE_PERGUNTAS)} perguntas sobre a operação e a gente devolve, na
            hora, uma leitura
            preliminar do que estimamos estar vazando, com as premissas na mesa e o limite
            declarado na primeira linha.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Botao href="/analise" variante="primario-invertido">
              Começar a análise gratuita
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
