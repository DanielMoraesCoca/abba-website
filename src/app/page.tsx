import Link from 'next/link';
import { Capa } from '@/components/marketing/Capa';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { evidencia } from '@/content/evidencias';
import { HEADLINE, PRATELEIRA } from '@/content/identidade';
import { RECUSAS } from '@/content/manifesto';

/** Os três números da home. O resto do cânone vive em /evidencias. */
const NUMEROS_DA_HOME = ['rand-80', 'metr-19', 'dora-amplifica'] as const;

export default function PaginaInicial() {
  return (
    <>
      <Capa />

      {/* ── A prateleira ───────────────────────────────────────────────── */}
      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="A prateleira"
            titulo={PRATELEIRA.titulo}
            className="max-w-none"
          />
          <Revelar className="space-y-7">
            <p className="text-[1.15rem] leading-[1.65] text-navy-700">{PRATELEIRA.texto}</p>
            <div className="rule-gold" aria-hidden />
            <p className="text-[1.02rem] leading-[1.7] text-slate-600">{PRATELEIRA.analogia}</p>
          </Revelar>
        </div>
      </Secao>

      {/* ── A tese ─────────────────────────────────────────────────────── */}
      <Secao tom="gelo" largura="estreita">
        <Revelar>
          <p className="font-display text-[1.5rem] leading-[1.55] text-navy-700 sm:text-[1.85rem]">
            {HEADLINE.corpo}
          </p>
          {/* A honestidade sobre o que é tese e o que é medição É o
              posicionamento — por isso a nota fica ao lado da tese, não
              escondida numa página de metodologia. */}
          <p className="mt-8 border-l-2 border-gold-500 pl-5 font-mono text-[0.82rem] leading-relaxed text-slate-600">
            {HEADLINE.notaDaTese}
          </p>
        </Revelar>
      </Secao>

      {/* ── Os três caminhos ───────────────────────────────────────────── */}
      <Secao tom="claro" espaco="amplo" id="caminhos">
        <TituloDeSecao
          sobretitulo="A vitrine inteira"
          titulo="Três caminhos. Nada mais é oferecido em primeiro contato."
          apoio={
            <p>
              Um cardápio de serviços empurra a conversa para preço. Estes três caminhos existem
              porque atendem a três situações diferentes — e a primeira é de graça.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-8 lg:grid-cols-3" passo={0.1}>
          {CAMINHOS.map((caminho) => (
            <RevelarItem
              as="article"
              key={caminho.id}
              className="group flex flex-col border-t border-navy-700/15 pt-8 transition-colors duration-500 hover:border-gold-500"
            >
              <p className="nums font-mono text-[0.72rem] tracking-[0.2em] text-gold-700">
                {String(caminho.ordem).padStart(2, '0')}
              </p>
              <h3 className="mt-5 text-[1.45rem] leading-tight text-navy-700">{caminho.nome}</h3>
              <p className="mt-2 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">
                {caminho.chamada}
              </p>
              <p className="mt-5 text-[0.98rem] leading-[1.65] text-slate-700">
                {caminho.descricao}
              </p>

              <ul className="mt-7 space-y-2.5">
                {caminho.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.92rem] leading-relaxed text-slate-600"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={caminho.href}
                className="mt-8 inline-flex items-center gap-2 self-start font-mono text-[0.8rem] uppercase tracking-[0.12em] text-navy-700 transition-colors hover:text-gold-700"
              >
                {caminho.cta.texto}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-[var(--ease-abba)] group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* ── A evidência ────────────────────────────────────────────────── */}
      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="Por que isso importa"
          titulo="Três números que explicam por que a ABBA existe."
          apoio={
            <p>
              Todo número que a gente usa sai com a fonte na frase — porque número de terceiro vira
              alvo de auditoria do cliente. Estes três são os que mais mudam a conversa.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-3" passo={0.12}>
          {NUMEROS_DA_HOME.map((id) => (
            <RevelarItem key={id}>
              <NumeroComFonte evidencia={evidencia(id)} tom="escuro" />
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14">
          <Botao href="/evidencias" variante="fantasma">
            Ver a base de evidências inteira — inclusive o que a gente proibiu de usar
          </Botao>
        </Revelar>
      </Secao>

      {/* ── As três fases ──────────────────────────────────────────────── */}
      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="AI Native · Ano 1"
          titulo="Doze meses, três fases, três portões de saída sem multa."
          apoio={
            <p>
              A fase 1 é firme e pequena — alçada de um diretor. O ano inteiro entra no mesmo
              documento como opção, condicionada ao que a fase 1 provar.
            </p>
          }
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.1}>
          {FASES.map((fase) => (
            <RevelarItem
              as="article"
              key={fase.id}
              className="grid gap-6 border-t border-navy-700/15 py-10 md:grid-cols-[13rem_1fr] md:gap-12"
            >
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
                  {fase.rotulo}
                </p>
                <h3 className="mt-3 text-[1.55rem] leading-tight text-navy-700">{fase.nome}</h3>
                <p className="nums mt-2 font-mono text-[0.82rem] text-slate-500">{fase.janela}</p>
              </div>

              <div>
                <p className="text-[1.05rem] leading-[1.65] text-navy-700">{fase.promessa}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {fase.entregaveis.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.92rem] leading-relaxed text-slate-600"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-l-2 border-gold-500 pl-5 text-[0.92rem] leading-relaxed text-slate-700">
                  <strong className="font-medium text-navy-700">{fase.portao.nome}.</strong>{' '}
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

        <RevelarLista className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-2" passo={0.07}>
          {RECUSAS.slice(0, 6).map((item) => (
            <RevelarItem key={item.recusa} className="border-t border-navy-700/15 pt-5">
              <h3 className="text-[1.05rem] font-medium leading-snug text-navy-700">
                {item.recusa}
              </h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-slate-600">{item.porque}</p>
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
          <h2 className="text-[2rem] leading-[1.15] text-ice-100 sm:text-[2.7rem]">
            A análise chega feita, não oferecida.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[1.06rem] leading-[1.65] text-ice-200/75">
            Responda dez perguntas sobre a operação e a gente devolve, na hora, uma leitura
            preliminar do que estimamos estar vazando — com as premissas na mesa e o limite
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
          <p className="mt-8 font-mono text-[0.74rem] tracking-wide text-ice-300/60">
            Sem cadastro em lista. Sem cobrança depois. Leva cerca de três minutos.
          </p>
        </Revelar>
      </Secao>
    </>
  );
}
