import { FASES } from '@/content/caminhos';

/**
 * O Programa, desenhado como mecanismo.
 *
 * A lista de fases já existe na página; ela responde "o que entra". Este
 * diagrama responde outra pergunta, que a lista não consegue: **onde estão
 * as saídas**. Três portões, distribuídos de um jeito específico — o
 * primeiro muito cedo, na semana 6 — e é essa distribuição que trata o
 * risco de quem compra. Uma lista esconde a assimetria; a régua a mostra.
 *
 * Decisões de desenho:
 * - Escala real. A fase 1 ocupa seis semanas de doze meses, e no desenho ela
 *   ocupa a fração correspondente. Desenhar os três blocos com o mesmo
 *   tamanho seria mais bonito e seria mentira.
 * - SVG com viewBox e sem largura fixa: escala em qualquer tela sem
 *   recalcular nada no cliente.
 * - Sem JavaScript. É um componente de servidor puro — o diagrama chega
 *   pronto no HTML.
 */

const LARGURA = 1000;
const ALTURA = 200;
const MARGEM_X = 8;
const Y_RAIL = 96;
const ALTURA_RAIL = 34;
const MESES = 12;

/** Fim de cada fase, em meses. A fase 1 são 6 semanas ≈ 1,4 mês. */
const FIM_DA_FASE = [1.4, 6, 12] as const;

const TOM_DA_FASE = ['var(--color-navy-700)', 'var(--color-navy-500)', 'var(--color-navy-400)'];

function x(mes: number): number {
  return MARGEM_X + (mes / MESES) * (LARGURA - MARGEM_X * 2);
}

export function LinhaDoPrograma() {
  const inicios = [0, ...FIM_DA_FASE.slice(0, -1)];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="w-full"
        role="img"
        aria-labelledby="titulo-linha-programa desc-linha-programa"
      >
        <title id="titulo-linha-programa">
          Os doze meses do Programa, com as três fases e os três portões de saída
        </title>
        <desc id="desc-linha-programa">
          {FASES.map(
            (f, i) =>
              `${f.nome}, ${f.janela}, terminando no ${f.portao.nome}${i < FASES.length - 1 ? '. ' : '.'}`,
          ).join('')}{' '}
          Nenhum portão cobra multa.
        </desc>

        {/* Régua dos meses — recessiva, hairline, sólida. */}
        <g aria-hidden>
          {Array.from({ length: MESES + 1 }, (_, mes) => (
            <line
              key={mes}
              x1={x(mes)}
              x2={x(mes)}
              y1={Y_RAIL + ALTURA_RAIL + 10}
              y2={Y_RAIL + ALTURA_RAIL + (mes % 3 === 0 ? 20 : 15)}
              stroke="currentColor"
              className="text-navy-700/25"
              strokeWidth={1}
            />
          ))}
          {[0, 3, 6, 9, 12].map((mes) => (
            <text
              key={mes}
              x={x(mes)}
              y={Y_RAIL + ALTURA_RAIL + 40}
              textAnchor={mes === 0 ? 'start' : mes === MESES ? 'end' : 'middle'}
              className="fill-slate-500 font-mono text-[15px]"
            >
              {mes === 0 ? 'início' : `mês ${mes}`}
            </text>
          ))}
        </g>

        {/* As três fases, na proporção real do calendário. */}
        {FASES.map((fase, i) => {
          const de = x(inicios[i] ?? 0);
          const ate = x(FIM_DA_FASE[i] ?? 0);
          // Gap de 2px na cor da superfície entre segmentos que se tocam.
          const largura = ate - de - (i < FASES.length - 1 ? 3 : 0);
          return (
            <g key={fase.id}>
              <rect
                x={de}
                y={Y_RAIL}
                width={largura}
                height={ALTURA_RAIL}
                rx={i === 0 ? 3 : 0}
                fill={TOM_DA_FASE[i]}
              />
              <text
                x={de + 4}
                y={Y_RAIL - 34}
                className="fill-gold-700 font-mono text-[14px] uppercase tracking-[0.18em]"
              >
                {fase.rotulo}
              </text>
              <text x={de + 4} y={Y_RAIL - 12} className="fill-navy-700 text-[21px]">
                {fase.nome}
              </text>
            </g>
          );
        })}

        {/* Os portões. É o que a lista não mostra: a primeira saída limpa
            acontece muito cedo, e nenhuma delas cobra multa. */}
        {FASES.map((fase, i) => {
          const posicao = x(FIM_DA_FASE[i] ?? 0);
          const ultimo = i === FASES.length - 1;
          return (
            <g key={`portao-${fase.id}`}>
              <line
                x1={posicao}
                x2={posicao}
                y1={Y_RAIL - 6}
                y2={Y_RAIL + ALTURA_RAIL + 6}
                stroke="var(--color-gold-500)"
                strokeWidth={2}
              />
              <circle cx={posicao} cy={Y_RAIL - 6} r={4} fill="var(--color-gold-500)" />
              <text
                x={ultimo ? posicao - 6 : posicao}
                y={Y_RAIL + ALTURA_RAIL + 62}
                textAnchor={ultimo ? 'end' : i === 0 ? 'start' : 'middle'}
                className="fill-navy-700 font-mono text-[15px] uppercase tracking-[0.1em]"
              >
                {fase.portao.nome}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-8 max-w-2xl text-sm leading-[1.7] text-slate-700">
        As fases estão desenhadas na proporção real do calendário — a fase 1 são seis semanas de
        doze meses, e é assim que ela aparece. O que a régua mostra e uma lista esconde:{' '}
        <strong className="font-medium text-navy-700">
          a primeira saída limpa acontece muito cedo
        </strong>
        , e nenhum dos três portões cobra multa.
      </figcaption>
    </figure>
  );
}
