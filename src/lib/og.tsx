import { ImageResponse } from 'next/og';
import { EMPRESA } from '@/content/identidade';

/**
 * O cartão social da ABBA.
 *
 * Um link colado no LinkedIn ou no WhatsApp é, muitas vezes, o primeiro
 * contato de alguém com a marca — antes mesmo do site abrir. Sem cartão, o
 * link vira um retângulo cinza com um domínio. Isso já é material externo, e
 * material externo da ABBA tem padrão.
 *
 * O desenho é o mesmo da capa: navy profundo, o grafo dourado da marca ao
 * fundo, sobretítulo, título serifado. Gerado no build, uma imagem por rota.
 *
 * `ImageResponse` roda no Satori, que suporta flexbox e um subconjunto de
 * CSS — nada de grid, nada de variável CSS. Por isso os hexadecimais estão
 * escritos à mão aqui, e é a única exceção do repositório: o teste da régua
 * não bloqueia hex, mas se a paleta mudar no abba-ops, este arquivo é o
 * segundo lugar a mudar depois do globals.css.
 */

const NAVY_900 = '#0E1729';
const GOLD_500 = '#C2A35B';
const GOLD_400 = '#D3B87F';
const ICE_100 = '#FBFBFC';
const ICE_300 = '#F1F2F4';

export const TAMANHO_OG = { width: 1200, height: 630 };
export const TIPO_OG = 'image/png';

/**
 * Busca a fonte de título no build. Se a rede falhar — CI sem saída, por
 * exemplo — o cartão sai com a fonte padrão do Satori em vez de o build
 * quebrar. Um cartão menos bonito é melhor que um deploy travado.
 */
async function fonteDeTitulo(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((r) => r.text());

    const url = /src:\s*url\((https:\/\/[^)]+)\)\s*format\('(?:truetype|opentype)'\)/.exec(css)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/** Nós do grafo de fundo — fixos, para o cartão ser idêntico em todo build. */
const NOS: readonly [number, number, number][] = [
  [812, 96, 7], [906, 148, 5], [742, 182, 6], [982, 232, 8], [858, 262, 9],
  [1088, 196, 5], [770, 330, 6], [948, 366, 7], [1052, 320, 6], [880, 452, 8],
  [1016, 470, 5], [1118, 402, 7], [792, 500, 6], [944, 556, 7], [1082, 552, 6],
];

const ARESTAS: readonly [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [4, 7], [7, 8],
  [8, 5], [6, 9], [7, 9], [9, 10], [10, 11], [8, 11], [9, 12], [12, 13],
  [13, 10], [13, 14], [14, 10],
];

function Grafo() {
  return (
    <svg
      width={1200}
      height={630}
      style={{ position: 'absolute', top: 0, left: 0 }}
      viewBox="0 0 1200 630"
    >
      {ARESTAS.map(([a, b], i) => {
        const de = NOS[a];
        const para = NOS[b];
        if (!de || !para) return null;
        return (
          <line
            key={i}
            x1={de[0]}
            y1={de[1]}
            x2={para[0]}
            y2={para[1]}
            stroke={GOLD_500}
            strokeWidth={1.4}
            strokeOpacity={0.3}
          />
        );
      })}
      {NOS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={GOLD_400} fillOpacity={0.5} />
      ))}
    </svg>
  );
}

export interface CartaoSocial {
  readonly sobretitulo: string;
  readonly titulo: string;
  readonly rodape?: string;
}

export async function cartaoSocial({ sobretitulo, titulo, rodape }: CartaoSocial) {
  const fonte = await fonteDeTitulo();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: NAVY_900,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        <Grafo />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 30, height: 1, background: GOLD_500 }} />
          <div
            style={{
              display: 'flex',
              color: GOLD_400,
              fontSize: 21,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            {sobretitulo}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: fonte ? 'Titulo' : undefined,
            color: ICE_100,
            fontSize: titulo.length > 70 ? 60 : 72,
            lineHeight: 1.13,
            letterSpacing: -1.2,
            maxWidth: 940,
          }}
        >
          {titulo}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: `1px solid ${GOLD_500}55`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                color: ICE_100,
                fontSize: 34,
                letterSpacing: 7,
                fontFamily: fonte ? 'Titulo' : undefined,
              }}
            >
              ABBA
            </div>
            <div style={{ display: 'flex', color: ICE_300, opacity: 0.55, fontSize: 19, letterSpacing: 2 }}>
              CONSULTORIA DE IA
            </div>
          </div>

          <div style={{ display: 'flex', color: GOLD_400, fontSize: 21, opacity: 0.85 }}>
            {rodape ?? EMPRESA.dominio}
          </div>
        </div>

      </div>
    ),
    {
      ...TAMANHO_OG,
      ...(fonte
        ? { fonts: [{ name: 'Titulo', data: fonte, weight: 600 as const, style: 'normal' as const }] }
        : {}),
    },
  );
}
