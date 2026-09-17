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
 * O desenho é o mesmo da capa: navy profundo, sobretítulo em ouro, título
 * em Newsreader, e nada mais. Gerado no build, uma imagem por rota.
 *
 * O QUE SAIU DAQUI, E POR QUE ISTO É O LUGAR MAIS IMPORTANTE DE TER SAÍDO.
 *
 * Havia uma constelação de nós e linhas douradas ocupando o terço direito
 * do cartão. Ela é o logo de cérebro aposentado em outra forma, e a régua de
 * imagem da casa reprova circuito. A capa da home já tinha sido limpa; este
 * arquivo passou despercebido porque ninguém abre um cartão social durante o
 * trabalho.
 *
 * E ele é a superfície MAIS pública que existe: um link colado no LinkedIn
 * ou no WhatsApp mostra este cartão antes de qualquer pessoa abrir o site.
 * A marca aposentada estava viajando exatamente onde ela mais aparece.
 *
 * `ImageResponse` roda no Satori, que suporta flexbox e um subconjunto de
 * CSS: nada de grid, nada de variável de CSS. Por isso os hexadecimais estão
 * escritos à mão aqui, e é a única exceção do repositório. Se a paleta mudar
 * no abba-ops, este arquivo é o segundo lugar a mudar depois do globals.css.
 */

/* A paleta fechada do briefing §2, escrita à mão porque o Satori não lê
   variável de CSS. Os valores anteriores eram da paleta antiga e nenhum
   deles existia mais: o navy estava dois pontos mais escuro, o ouro claro
   era outro tom, e o branco era um quase-branco azulado. */
const NAVY_ESCURO = '#101B31';
const OURO = '#C2A35B';
const OURO_CLARO = '#D8BE7C';
const BRANCO = '#FFFFFF';
const ARDOSIA_CLARA = '#C3CAD8';

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
      // Newsreader 400, que é a face de título do site. Era Source Serif 600:
      // a fonte do CORPO, num peso que o site não carrega em lugar nenhum.
      'https://fonts.googleapis.com/css2?family=Newsreader:wght@400&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((r) => r.text());

    const url = /src:\s*url\((https:\/\/[^)]+)\)\s*format\('(?:truetype|opentype)'\)/.exec(css)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
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
          background: NAVY_ESCURO,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 30, height: 1, background: OURO }} />
          <div
            style={{
              display: 'flex',
              color: OURO_CLARO,
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
            color: BRANCO,
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
            borderTop: `1px solid ${OURO}59`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                color: BRANCO,
                fontSize: 34,
                letterSpacing: 7,
                fontFamily: fonte ? 'Titulo' : undefined,
              }}
            >
              ABBA
            </div>
            {/* Sem opacidade. O cinza a 55% marcava 2,9 contra o navy, e um
                cartão social é lido em miniatura, num feed, muitas vezes por
                cima de um brilho de tela. A ardósia clara cheia resolve. */}
            <div style={{ display: 'flex', color: ARDOSIA_CLARA, fontSize: 19, letterSpacing: 2 }}>
              CONSULTORIA DE IA
            </div>
          </div>

          <div style={{ display: 'flex', color: OURO_CLARO, fontSize: 21 }}>
            {rodape ?? EMPRESA.dominio}
          </div>
        </div>

      </div>
    ),
    {
      ...TAMANHO_OG,
      ...(fonte
        ? { fonts: [{ name: 'Titulo', data: fonte, weight: 400 as const, style: 'normal' as const }] }
        : {}),
    },
  );
}
