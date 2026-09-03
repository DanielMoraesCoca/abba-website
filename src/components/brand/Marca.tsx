import { cn } from '@/lib/utils';

/**
 * A marca-símbolo da ABBA: um grafo de nós dourados em forma de cérebro.
 * Redesenhada como SVG a partir do PNG versionado em abba-ops
 * (`08-materiais/marca/abba-logo.png`), porque a marca precisa ser nítida
 * em qualquer tamanho, herdar a cor do contexto e pesar quase nada.
 *
 * O grafo aqui é uma redução deliberada — os nós de maior grau do original,
 * suficientes para a marca ser reconhecível a 24px. O PNG original continua
 * em /brand/abba-marca.png para uso em peças que precisem do desenho cheio.
 */

interface Props {
  readonly className?: string;
  readonly titulo?: string;
}

/** Nós do hemisfério esquerdo, em coordenadas de um viewBox 100×110. */
const NOS_ESQUERDA: readonly [number, number, number][] = [
  [45, 7, 2.6], [28, 12, 3.2], [17, 21, 2.4], [39, 16, 2.0], [46, 26, 2.2],
  [9, 34, 2.4], [19, 30, 2.8], [26, 24, 2.2], [36, 35, 3.0], [11, 48, 2.0],
  [21, 44, 2.6], [43, 43, 2.2], [7, 62, 3.2], [18, 59, 3.0], [27, 53, 2.4],
  [37, 55, 3.4], [7, 71, 2.0], [24, 66, 2.8], [40, 66, 2.6], [13, 82, 2.0],
  [28, 78, 3.2], [34, 77, 2.2], [45, 71, 3.0], [25, 92, 2.2], [39, 88, 2.6],
  [30, 100, 2.8], [38, 101, 2.0], [44, 94, 2.4],
];

const ARESTAS_ESQUERDA: readonly [number, number][] = [
  [0, 1], [0, 3], [1, 2], [1, 3], [3, 4], [2, 6], [5, 6], [6, 7], [7, 8],
  [4, 8], [5, 9], [9, 10], [10, 8], [8, 11], [11, 4], [9, 12], [12, 13],
  [13, 14], [14, 15], [15, 11], [12, 16], [13, 17], [17, 15], [15, 18],
  [16, 19], [17, 20], [20, 21], [21, 18], [18, 22], [19, 20], [20, 23],
  [23, 25], [25, 26], [26, 24], [24, 27], [27, 22], [21, 24],
];

/** Espelho aproximado para o hemisfério direito, com deriva própria. */
const NOS_DIREITA: readonly [number, number, number][] = [
  [63, 8, 2.6], [54, 12, 1.8], [76, 15, 2.8], [72, 25, 2.4], [58, 29, 2.4],
  [66, 30, 2.0], [84, 27, 3.0], [55, 39, 3.2], [69, 35, 3.0], [79, 37, 2.4],
  [90, 39, 2.6], [77, 47, 2.2], [88, 50, 2.6], [59, 53, 3.0], [55, 65, 2.4],
  [83, 58, 2.8], [93, 64, 3.2], [80, 68, 2.6], [59, 76, 3.4], [70, 74, 2.4],
  [76, 79, 3.2], [66, 84, 2.0], [85, 84, 2.0], [62, 96, 3.0], [73, 97, 2.4],
  [79, 91, 2.6], [88, 88, 2.8],
];

const ARESTAS_DIREITA: readonly [number, number][] = [
  [0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 3], [3, 6], [6, 9], [4, 7],
  [7, 8], [8, 9], [9, 10], [10, 12], [9, 11], [11, 12], [7, 13], [13, 14],
  [13, 8], [12, 16], [15, 16], [15, 17], [17, 16], [14, 18], [18, 19],
  [19, 20], [20, 17], [18, 21], [21, 23], [23, 24], [24, 25], [25, 20],
  [25, 26], [26, 22], [22, 15], [19, 21],
];

function Hemisferio({
  nos,
  arestas,
}: {
  readonly nos: readonly [number, number, number][];
  readonly arestas: readonly [number, number][];
}) {
  return (
    <g>
      <g strokeWidth={0.9} strokeLinecap="round" opacity={0.62}>
        {arestas.map(([a, b], i) => {
          const de = nos[a];
          const para = nos[b];
          if (!de || !para) return null;
          return <line key={i} x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />;
        })}
      </g>
      <g stroke="none">
        {nos.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </g>
  );
}

export function Marca({ className, titulo = 'ABBA' }: Props) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={cn('h-8 w-auto', className)}
      role="img"
      aria-label={titulo}
      fill="currentColor"
      stroke="currentColor"
    >
      <Hemisferio nos={NOS_ESQUERDA} arestas={ARESTAS_ESQUERDA} />
      <Hemisferio nos={NOS_DIREITA} arestas={ARESTAS_DIREITA} />
    </svg>
  );
}

/** Marca + palavra, o bloco de assinatura padrão. */
export function Logotipo({
  className,
  compacto = false,
}: {
  readonly className?: string;
  readonly compacto?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Marca className="h-7 w-auto text-gold-500" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-semibold tracking-[0.14em] text-current">
          ABBA
        </span>
        {/* A opacidade é 80 e não 60: a 8,8px, 60 dava 4,0:1 sobre branco e
            reprovava. Texto minúsculo por desenho exige que o contraste
            compense — não o contrário. */}
        {!compacto && (
          <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-current opacity-80">
            Consultoria de IA
          </span>
        )}
      </span>
    </span>
  );
}
