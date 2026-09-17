'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CampoTexto, GrupoDeOpcoes } from './Campos';
import { Resultado, type RespostaAnalise } from './Resultado';
import {
  FAIXAS_COLABORADORES,
  P_DONO,
  P_FECHAMENTO,
  P_LATENCIA,
  P_NUMERO_MEDIDO,
  P_PATROCINADOR,
  P_PRAZO,
  P_TENTATIVA,
  P_TOQUES,
  P_VOLUME,
} from '@/lib/analise/perguntas';
import { cn } from '@/lib/utils';

/**
 * O assistente da Primeira Leitura: quatro passos, onze respostas.
 *
 * Estado num objeto só, com chaves iguais às do esquema da API — o que o
 * formulário guarda é literalmente o que a rota valida. Menos tradução,
 * menos lugar para divergir.
 */

type Rascunho = Partial<Record<string, string>>;

interface Passo {
  readonly id: string;
  readonly titulo: string;
  readonly resumo: string;
  readonly campos: readonly string[];
}

const PASSOS: readonly Passo[] = [
  {
    id: 'empresa',
    titulo: 'A empresa',
    resumo: 'Para dimensionar a conta. Nada aqui é publicado nem guardado.',
    campos: ['empresa', 'setor', 'colaboradores'],
  },
  {
    id: 'caminho',
    titulo: 'O caminho do dinheiro',
    resumo: 'É onde o vazamento deixa rastro, e onde a aritmética começa.',
    campos: ['volume', 'toques', 'fechamento'],
  },
  {
    id: 'medicao',
    titulo: 'A medição',
    resumo: 'Sem número medido não existe prova possível. Só depoimento.',
    campos: ['numeroMedido', 'latencia', 'patrocinador'],
  },
  {
    id: 'prontidao',
    titulo: 'A prontidão',
    resumo: 'O que decide se a capacidade fica instalada depois que a gente sai.',
    campos: ['tentativa', 'dono', 'prazo'],
  },
];

/**
 * Portes que a URL pode semear. Derivado das próprias faixas — acrescentar
 * uma opção em `perguntas.ts` a torna aceitável aqui automaticamente.
 */
const PORTES_VALIDOS = new Set<string>(FAIXAS_COLABORADORES.map((f) => f.valor));

export function Assistente() {
  /**
   * A home faz a primeira pergunta na própria porta e manda a resposta em
   * `?porte=`. A URL é entrada de fora como qualquer outra: só um valor que
   * já existe entre as faixas é aceito, e qualquer outra coisa é ignorada
   * em silêncio — quem chegar com `?porte=<script>` começa do zero, sem
   * mensagem de erro que ensine o que tentar em seguida.
   *
   * Semeado no inicializador do estado, não num efeito: ler a URL depois da
   * primeira renderização causaria um piscar de campo vazio para preenchido.
   */
  const parametros = useSearchParams();
  const porteDaUrl = parametros.get('porte');

  const [passo, setPasso] = useState(0);
  const [rascunho, setRascunho] = useState<Rascunho>(() =>
    porteDaUrl && PORTES_VALIDOS.has(porteDaUrl) ? { colaboradores: porteDaUrl } : {},
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<RespostaAnalise | null>(null);
  const topo = useRef<HTMLDivElement | null>(null);

  const definir = useCallback((campo: string, valor: string) => {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const passoAtual = PASSOS[passo];
  const completo = useMemo(() => {
    if (!passoAtual) return false;
    return passoAtual.campos.every((campo) => {
      const valor = rascunho[campo];
      return typeof valor === 'string' && valor.trim().length >= (campo === 'empresa' || campo === 'setor' ? 2 : 1);
    });
  }, [passoAtual, rascunho]);

  const irPara = useCallback((indice: number) => {
    setPasso(indice);
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  async function enviar() {
    setEnviando(true);
    setErro('');

    /* Sobe para o topo do assistente ANTES de trocar o conteúdo.
       ────────────────────────────────────────────────────────────────
       A tela de espera é muito mais curta que o formulário do último
       passo. Sem isto, a página encolhe embaixo de quem acabou de clicar e
       a rolagem, que estava no fim do formulário, passa a apontar para o
       rodapé: o visitante clica em "ver a leitura" e cai nos links
       institucionais, sem nunca ver que alguma coisa começou.

       Fotografado no celular, que é onde a queda é maior. */
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const { empresa, setor, ...respostas } = rascunho;

    try {
      const resposta = await fetch('/api/analise', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ empresa, setor, respostas }),
      });

      const corpo = (await resposta.json().catch(() => null)) as
        | (RespostaAnalise & { mensagem?: string })
        | null;

      if (!resposta.ok || !corpo) {
        setErro(corpo?.mensagem ?? 'Não conseguimos calcular agora. Tente de novo em instantes.');
        setEnviando(false);
        return;
      }

      setResultado(corpo);
      topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setErro('Sem conexão com o servidor. Tente de novo em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  if (enviando) {
    return (
      <div ref={topo} className="scroll-mt-[calc(var(--header-h)+2rem)]">
        <Esperando empresa={rascunho.empresa ?? 'sua empresa'} />
      </div>
    );
  }

  if (resultado) {
    return (
      <div ref={topo} className="scroll-mt-[calc(var(--header-h)+2rem)]">
        <Resultado
          dados={resultado}
          aoRecomecar={() => {
            setResultado(null);
            setRascunho({});
            setPasso(0);
          }}
        />
      </div>
    );
  }

  const ultimo = passo === PASSOS.length - 1;

  return (
    <div ref={topo} className="scroll-mt-[calc(var(--header-h)+2rem)]">
      {/* O PROGRESSO É UM FIO, E NÃO UM NÚMERO.
          ──────────────────────────────────────────────────────────────
          "Passo 2 de 4" e "50%" são linguagem de formulário: dizem ao
          leitor que ele está numa fila. Um fio que enche diz a mesma coisa
          sem contar nada, e é lido de relance, que é como progresso deve
          ser lido.

          O fio é `aria-hidden` porque a informação já existe de forma
          melhor para quem usa leitor de tela: a lista abaixo é uma <ol> com
          `aria-current="step"` no item atual, e isso é anunciado com o nome
          do passo, não com uma fração. Duplicar viraria ruído. */}
      <div aria-hidden className="mb-9 h-px w-full bg-navy/10">
        <div
          className="h-full bg-ouro transition-[width] duration-[var(--duration-reveal)] ease-[var(--ease-abba)]"
          style={{ width: `${((passo + 1) / PASSOS.length) * 100}%` }}
        />
      </div>

      <ol className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Etapas da análise">
        {PASSOS.map((p, i) => {
          const feito = i < passo;
          const atual = i === passo;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => (i <= passo ? irPara(i) : undefined)}
                disabled={i > passo}
                aria-current={atual ? 'step' : undefined}
                /* `min-h-11` são os 44px que a WCAG pede de alvo de toque, e
                   o `-my-3` devolve a altura extra ao leiaute para a régua
                   de passos não engordar. Quem responde isto é um diretor
                   no celular, não um designer no desktop: um alvo de 22px
                   erra, e errar aqui é voltar um passo sem querer. */
                className={cn(
                  'nums flex min-h-11 items-center gap-2 -my-3 font-mono text-rotulo uppercase tracking-[0.14em] transition-colors duration-300',
                  atual && 'text-navy',
                  feito && 'text-ardosia hover:text-navy',
                  !atual && !feito && 'text-ardosia',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-px transition-all duration-500 ease-[var(--ease-micro)]',
                    atual ? 'w-8 bg-ouro' : 'w-4 bg-current opacity-50',
                  )}
                />
                {String(i + 1).padStart(2, '0')} {p.titulo}
              </button>
            </li>
          );
        })}
      </ol>

      {/* A `key` no passo remonta a árvore a cada avanço, e o CSS anima a
          entrada. Uma biblioteca de presença resolveria o mesmo problema
          com muito mais código enviado — e aqui não há saída para animar:
          o passo antigo sai da tela junto com a remontagem. */}
      <div key={passo} data-passo className="mt-10">
          <p className="text-legenda leading-relaxed text-ardosia">{passoAtual?.resumo}</p>

          <div className="mt-10 space-y-14">
            {passo === 0 && (
              <>
                <div className="grid items-end gap-6 sm:grid-cols-2">
                  <CampoTexto
                    id="empresa"
                    rotulo="Nome da empresa"
                    valor={rascunho.empresa ?? ''}
                    aoMudar={(v) => definir('empresa', v)}
                    obrigatorio
                  />
                  <CampoTexto
                    id="setor"
                    rotulo="Setor"
                    ajuda="Como você descreveria em duas palavras."
                    placeholder="Ex.: distribuição farmacêutica"
                    valor={rascunho.setor ?? ''}
                    aoMudar={(v) => definir('setor', v)}
                    obrigatorio
                  />
                </div>

                <GrupoDeOpcoes
                  pergunta={{
                    id: 'colaboradores',
                    titulo: 'Quantas pessoas trabalham na empresa?',
                    opcoes: FAIXAS_COLABORADORES,
                  }}
                  valor={rascunho.colaboradores}
                  aoMudar={(v) => definir('colaboradores', v)}
                  colunas={2}
                />

                {/* A pergunta de faturamento saiu daqui.
                    Ela servia a uma coisa só: o teto de sanidade da faixa
                    em reais. Com a faixa suspensa, ela virava uma pergunta
                    sobre o dinheiro de um estranho que não alimentava nada
                    do que ele ia ler na tela seguinte. */}
              </>
            )}

            {passo === 1 && (
              <>
                <GrupoDeOpcoes
                  pergunta={P_VOLUME}
                  valor={rascunho.volume}
                  aoMudar={(v) => definir('volume', v)}
                  colunas={2}
                />
                <GrupoDeOpcoes
                  pergunta={P_TOQUES}
                  valor={rascunho.toques}
                  aoMudar={(v) => definir('toques', v)}
                />
                <GrupoDeOpcoes
                  pergunta={P_FECHAMENTO}
                  valor={rascunho.fechamento}
                  aoMudar={(v) => definir('fechamento', v)}
                  colunas={2}
                />
              </>
            )}

            {passo === 2 && (
              <>
                <GrupoDeOpcoes
                  pergunta={P_NUMERO_MEDIDO}
                  valor={rascunho.numeroMedido}
                  aoMudar={(v) => definir('numeroMedido', v)}
                />
                <GrupoDeOpcoes
                  pergunta={P_LATENCIA}
                  valor={rascunho.latencia}
                  aoMudar={(v) => definir('latencia', v)}
                  colunas={2}
                />
                <GrupoDeOpcoes
                  pergunta={P_PATROCINADOR}
                  valor={rascunho.patrocinador}
                  aoMudar={(v) => definir('patrocinador', v)}
                  colunas={2}
                />
              </>
            )}

            {passo === 3 && (
              <>
                <GrupoDeOpcoes
                  pergunta={P_TENTATIVA}
                  valor={rascunho.tentativa}
                  aoMudar={(v) => definir('tentativa', v)}
                />
                <GrupoDeOpcoes
                  pergunta={P_DONO}
                  valor={rascunho.dono}
                  aoMudar={(v) => definir('dono', v)}
                />
                <GrupoDeOpcoes
                  pergunta={P_PRAZO}
                  valor={rascunho.prazo}
                  aoMudar={(v) => definir('prazo', v)}
                />
              </>
            )}
          </div>
      </div>

      {erro && (
        <p role="alert" className="mt-8 border-l-2 border-alerta pl-4 text-legenda text-alerta">
          {erro}
        </p>
      )}

      <div className="mt-14 flex flex-col-reverse gap-4 border-t border-navy/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => irPara(Math.max(passo - 1, 0))}
          disabled={passo === 0}
          className="-mx-3 inline-flex min-h-11 items-center self-start px-3 font-mono text-rotulo uppercase tracking-[0.12em] text-ardosia transition-colors hover:text-navy disabled:invisible"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={() => (ultimo ? enviar() : irPara(passo + 1))}
          disabled={!completo}
          className={cn(
            'inline-flex items-center justify-center gap-2.5 rounded-[3px] px-7 py-3.5 font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-micro)]',
            'bg-navy text-branco hover:bg-navy',
            'disabled:cursor-not-allowed disabled:bg-ardosia disabled:text-branco',
          )}
        >
          {ultimo ? 'Ver a leitura preliminar' : 'Continuar'}
        </button>
      </div>

      {!completo && (
        <p className="mt-4 text-right font-mono text-rotulo text-ardosia">
          Responda tudo deste passo para continuar.
        </p>
      )}
    </div>
  );
}

/**
 * A TELA DE ESPERA, QUE ERA O MOMENTO MAIS FRÁGIL DA EXPERIÊNCIA INTEIRA.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Até aqui, clicar em "Ver a leitura preliminar" trocava o rótulo do botão
 * para "Calculando…" e não acontecia mais nada. O formulário inteiro ficava
 * na tela, parado, enquanto uma chamada a um modelo de linguagem levava
 * alguns segundos. Quem já respondeu tudo e clicou não fica olhando para o
 * botão: olha para a página, e a página não dizia nada.
 *
 * É a única tela do site em que o visitante FAZ alguma coisa, e era a única
 * em que a casa deixava ele sem resposta.
 *
 * TRÊS DECISÕES, E CADA UMA É DOUTRINA E NÃO ENFEITE.
 *
 *   1. A ESPERA CONTA O QUE ESTÁ ACONTECENDO, com o nome da empresa dele na
 *      frase. Não é "aguarde": é "a leitura já está pronta, o texto em
 *      volta está sendo escrito". Isso é verdade literal da arquitetura: a
 *      leitura sai de regra determinística e já existe quando a chamada
 *      paga começa.
 *
 *   2. A ESPERA REPETE A TRAVA. "Nenhum número sobre a sua empresa sai de
 *      um modelo de linguagem" é a frase mais importante do produto, e este
 *      é o único instante em que o leitor está parado, olhando, sem nada
 *      para ler. É o melhor lugar do site para ela, e ela estava em toda
 *      parte menos aqui.
 *
 *   3. O FIO NÃO FINGE SABER QUANTO FALTA. Não há porcentagem, não há
 *      contagem regressiva, não há "quase lá". Não existe progresso
 *      conhecido para mostrar, e inventar um seria a mesma mentira com
 *      aparência de precisão que a casa recusa em número. O fio diz a única
 *      coisa verdadeira: ainda está acontecendo.
 *
 * `aria-busy` e `role="status"` fazem o leitor de tela anunciar a mudança
 * sem roubar o foco de quem está navegando por teclado.
 * ════════════════════════════════════════════════════════════════════════
 */
function Esperando({ empresa }: { readonly empresa: string }) {
  return (
    <section
      role="status"
      aria-busy="true"
      className="border-t border-navy/15 pt-10"
    >
      <p className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
        Montando a leitura
      </p>

      <p className="mt-6 max-w-2xl text-lede leading-snug text-navy">
        A leitura de {empresa} já está pronta. O que está sendo escrito agora é o texto em volta
        dela.
      </p>

      <div data-fio-de-espera aria-hidden className="relative mt-9 h-px w-full overflow-hidden bg-navy/10" />

      <p className="mt-9 max-w-2xl text-corpo leading-[1.7] text-ardosia">
        Onde vocês estão e qual é o passo seguinte saem de uma regra escrita, no nosso servidor, que
        não mudou desde que você começou a responder. O modelo de linguagem escreve a prosa, e só
        ela: se um número escapar para o texto dele, a geração inteira é descartada e entra o texto
        preparado. Nenhum número sobre a sua empresa sai de um modelo de linguagem.
      </p>
    </section>
  );
}
