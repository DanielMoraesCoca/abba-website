'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CampoTexto, GrupoDeOpcoes } from './Campos';
import { Resultado, type RespostaAnalise } from './Resultado';
import {
  FAIXAS_COLABORADORES,
  FAIXAS_FATURAMENTO,
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
 * O assistente da Análise ABBA: quatro passos, onze respostas.
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
    campos: ['empresa', 'setor', 'colaboradores', 'faturamento'],
  },
  {
    id: 'caminho',
    titulo: 'O caminho do dinheiro',
    resumo: 'É onde o vazamento deixa rastro — e onde a aritmética começa.',
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
                className={cn(
                  'nums flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300',
                  atual && 'text-navy-700',
                  feito && 'text-gold-700 hover:text-navy-700',
                  !atual && !feito && 'text-slate-400',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-px transition-all duration-500 ease-[var(--ease-micro)]',
                    atual ? 'w-8 bg-gold-500' : 'w-4 bg-current opacity-50',
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
          <p className="text-[0.95rem] leading-relaxed text-slate-600">{passoAtual?.resumo}</p>

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

                <GrupoDeOpcoes
                  pergunta={{
                    id: 'faturamento',
                    titulo: 'Qual a faixa de faturamento anual?',
                    ajuda:
                      'Serve só para um teto de sanidade: a estimativa nunca passa de uma fração pequena do faturamento. Se preferir não dizer, o teto simplesmente não é aplicado.',
                    opcoes: FAIXAS_FATURAMENTO,
                  }}
                  valor={rascunho.faturamento}
                  aoMudar={(v) => definir('faturamento', v)}
                  colunas={2}
                />
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
        <p role="alert" className="mt-8 border-l-2 border-alerta-700 pl-4 text-[0.95rem] text-alerta-700">
          {erro}
        </p>
      )}

      <div className="mt-14 flex flex-col-reverse gap-4 border-t border-navy-700/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => irPara(Math.max(passo - 1, 0))}
          disabled={passo === 0}
          className="self-start font-mono text-[0.78rem] uppercase tracking-[0.12em] text-slate-500 transition-colors hover:text-navy-700 disabled:invisible"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={() => (ultimo ? enviar() : irPara(passo + 1))}
          disabled={!completo || enviando}
          className={cn(
            'inline-flex items-center justify-center gap-2.5 rounded-[3px] px-7 py-3.5 font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-micro)]',
            'bg-navy-700 text-ice-100 hover:bg-navy-600',
            'disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-ice-100/80',
          )}
        >
          {enviando ? 'Calculando…' : ultimo ? 'Ver a leitura preliminar' : 'Continuar'}
        </button>
      </div>

      {!completo && (
        <p className="mt-4 text-right font-mono text-[0.72rem] text-slate-500">
          Responda tudo deste passo para continuar.
        </p>
      )}
    </div>
  );
}
