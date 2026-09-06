import { cn } from '@/lib/utils';

/**
 * O grafo da marca em escala estrutural.
 *
 * ────────────────────────────────────────────────────────────────────────
 * DE ONDE VEIO ESTA DECISÃO.
 *
 * A Alethia — empresa de verificação de impacto ambiental, mesmo problema
 * de comunicação que a ABBA tem — resolve o vão entre "dado técnico" e
 * "confiável" com uma linguagem visual construída sobre diagramas de rede,
 * aplicada como sistema modular de regras, não como um punhado de imagens
 * fixas. A ABBA já tem essa linguagem: a marca-símbolo É um grafo.
 *
 * O que faltava era usá-la como ESTRUTURA e não como enfeite de capa. Este
 * componente é a marca em escala de arquitetura — uma faixa conectiva que
 * separa e liga seções, dando ao olho um marco entre blocos de texto.
 *
 * Três decisões que o fazem valer o espaço:
 * - Determinístico. Mesma malha em toda visita e em todo servidor.
 * - Sem JavaScript. Componente de servidor: chega pronto no HTML.
 * - Sem custo de rede. É SVG inline, poucos quilobytes, sem requisição.
 * ────────────────────────────────────────────────────────────────────────
 */

const LARGURA = 1200;

/** PRNG determinístico (mulberry32) — a malha nunca muda entre execuções. */
function prng(semente: number) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface No {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}

/**
 * Gera a malha. `densidade` controla quantos nós; `semente` permite que
 * cada faixa do site tenha um desenho próprio e ainda assim estável.
 */
function malha(semente: number, altura: number, densidade: number) {
  const rand = prng(semente);
  const nos: No[] = [];

  for (let i = 0; i < densidade; i += 1) {
    nos.push({
      x: rand() * LARGURA,
      // Concentra os nós no miolo vertical: a faixa fica com ar em cima e
      // embaixo em vez de encostar nas bordas.
      y: altura * (0.18 + rand() * 0.64),
      r: 1.4 + rand() * 2.8,
    });
  }

  const limite = Math.min(LARGURA, altura * 2.4) * 0.13;
  const arestas: { de: No; para: No; forca: number }[] = [];

  for (let i = 0; i < nos.length; i += 1) {
    for (let j = i + 1; j < nos.length; j += 1) {
      const a = nos[i];
      const b = nos[j];
      if (!a || !b) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > limite) continue;
      arestas.push({ de: a, para: b, forca: 1 - d / limite });
    }
  }

  return { nos, arestas };
}

interface Props {
  readonly altura?: number;
  readonly densidade?: number;
  readonly semente?: number;
  readonly tom?: 'claro' | 'escuro';
  readonly className?: string;
}

export function Grafo({
  altura = 150,
  densidade = 46,
  semente = 20260903,
  tom = 'claro',
  className,
}: Props) {
  const { nos, arestas } = malha(semente, altura, densidade);
  const escuro = tom === 'escuro';

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${altura}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('block w-full', className)}
      style={{ height: altura }}
      aria-hidden
      focusable="false"
    >
      <g
        stroke={escuro ? 'var(--color-gold-500)' : 'var(--color-navy-700)'}
        strokeWidth={0.8}
        strokeLinecap="round"
      >
        {arestas.map((a, i) => (
          <line
            key={i}
            x1={a.de.x}
            y1={a.de.y}
            x2={a.para.x}
            y2={a.para.y}
            // Aresta curta é mais forte que aresta longa: o olho lê
            // agrupamento em vez de uma teia uniforme.
            strokeOpacity={(escuro ? 0.4 : 0.22) * a.forca}
          />
        ))}
      </g>
      <g fill={escuro ? 'var(--color-gold-400)' : 'var(--color-navy-600)'}>
        {nos.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fillOpacity={escuro ? 0.55 : 0.3} />
        ))}
      </g>
    </svg>
  );
}

/**
 * A faixa conectiva entre seções. Sangra de borda a borda de propósito: é o
 * único elemento do site que ignora a coluna, e é isso que o faz funcionar
 * como respiro — o olho registra a mudança de regra.
 */
export function FaixaDeGrafo({
  semente,
  tom = 'claro',
  altura = 130,
}: {
  readonly semente: number;
  readonly tom?: 'claro' | 'escuro';
  readonly altura?: number;
}) {
  return (
    <div
      data-fundo={tom === 'escuro' ? 'escuro' : 'claro'}
      className={cn(
        'relative overflow-hidden',
        tom === 'escuro' ? 'bg-navy-900' : 'bg-ice-200',
      )}
    >
      <Grafo semente={semente} tom={tom} altura={altura} />
      {/* Esmaece nas laterais para a malha não terminar num corte seco. */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          tom === 'escuro'
            ? 'bg-[linear-gradient(to_right,var(--color-navy-900),transparent_18%,transparent_82%,var(--color-navy-900))]'
            : 'bg-[linear-gradient(to_right,var(--color-ice-200),transparent_18%,transparent_82%,var(--color-ice-200))]',
        )}
      />
    </div>
  );
}
