import { formatarReais, type Estimativa } from '@/lib/analise/modelo';
import { TETO_SOBRE_FATURAMENTO } from '@/lib/analise/premissas';

/**
 * 0.025 → "2,5%". Sai da constante, nunca digitado — se o teto mudar, a
 * frase na tela muda junto, e não existe a possibilidade de a explicação
 * dizer um número e a conta usar outro.
 */
function formatarPorcentagem(fracao: number): string {
  return `${(fracao * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
}

/**
 * A conta, desenhada.
 *
 * ────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE GRÁFICO EXISTE E POR QUE ELE É ASSIM.
 *
 * A ABBA promete um número que qualquer CFO refaz no guardanapo. Uma faixa
 * em reais sozinha não cumpre essa promessa — ela pede confiança. A conta
 * desenhada cumpre: mostra de que partes o número é feito, e em que
 * proporção.
 *
 * A FORMA. Isto é composição, não identidade — não são três categorias
 * disputando atenção, são três parcelas de uma soma. Por isso uma rampa de
 * UM tom só (o navy da marca), e não três cores. Uma paleta categórica aqui
 * seria a resposta errada para a pergunta certa.
 *
 * A ORDEM DOS TONS CARREGA SIGNIFICADO, e isso está escrito na legenda para
 * o leitor: quanto mais claro o tom, MENOS sólida a parcela. O retrabalho
 * (escuro) sai de volume × minutos × custo — aritmética direta. A
 * contingência (claro) é um percentual sobre o resto, a parcela mais
 * assumida das três. Um leitor atento percebe isso sem ler a legenda, e é
 * exatamente esse tipo de leitor que a gente quer.
 *
 * DUAS BARRAS, NÃO UMA. Uma barra só obrigaria a escolher um ponto — média
 * ou mediana — e a regra nº 1 do Mapa de Vazamento é faixa, nunca ponto.
 * Então desenhamos as duas pontas: como a soma se compõe no mínimo e como
 * ela se compõe no máximo. O leitor vê a incerteza em vez de ler sobre ela.
 *
 * O TETO APARECE COMO CORTE, NÃO COMO SILÊNCIO. Quando a trava de sanidade
 * corta a ponta de cima, a barra continua desenhando a soma real das
 * parcelas e um fio dourado marca onde o corte caiu. Desenhar a soma já
 * cortada esconderia a trava; desenhar a soma sem dizer do corte
 * contradiria o número da manchete. Um CFO competente pega qualquer uma das
 * duas em dez segundos — e é exatamente ele que a gente quer que leia.
 * ────────────────────────────────────────────────────────────────────────
 */

interface Parcela {
  readonly id: string;
  readonly rotulo: string;
  readonly cor: string;
  readonly corTexto: string;
  readonly explicacao: string;
  readonly min: number;
  readonly max: number;
}

/** Gap na cor da superfície entre segmentos — 2px, igual em toda a pilha. */
const GAP = 2;
const ALTURA_BARRA = 26;

export function Decomposicao({ estimativa }: { readonly estimativa: Estimativa }) {
  const { decomposicao, faixa } = estimativa;
  if (!decomposicao || !faixa) return null;

  const parcelas: readonly Parcela[] = [
    {
      id: 'retrabalho',
      rotulo: 'Retrabalho no caminho do documento',
      cor: 'var(--color-navy-700)',
      corTexto: 'var(--color-ice-100)',
      explicacao: 'volume de documentos × minutos por passagem × custo da hora',
      min: decomposicao.retrabalhoDocumental.min,
      max: decomposicao.retrabalhoDocumental.max,
    },
    {
      id: 'fechamento',
      rotulo: 'Dias de fechamento acima da referência',
      cor: 'var(--color-navy-500)',
      corTexto: 'var(--color-ice-100)',
      explicacao: 'dias extras × pessoas envolvidas × jornada × custo da hora',
      min: decomposicao.atrasoDeFechamento.min,
      max: decomposicao.atrasoDeFechamento.max,
    },
    {
      id: 'contingencia',
      rotulo: 'Contingência pela latência da descoberta',
      cor: 'var(--color-navy-300)',
      corTexto: 'var(--color-navy-800)',
      explicacao: 'percentual sobre as duas parcelas acima — a mais assumida das três',
      min: decomposicao.contingencia.min,
      max: decomposicao.contingencia.max,
    },
  ];

  const somaMin = parcelas.reduce((s, p) => s + p.min, 0);
  const somaMax = parcelas.reduce((s, p) => s + p.max, 0);
  // Ambas as barras compartilham a mesma escala: a barra do mínimo TEM que
  // parecer menor. Normalizar cada uma para 100% mentiria sobre a faixa.
  const escala = Math.max(somaMin, somaMax);
  const posicaoDoTeto = decomposicao.tetoAplicado ? (faixa.max / escala) * 100 : null;

  return (
    <figure className="m-0">
      <figcaption className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
        De que a faixa é feita
      </figcaption>

      <p className="mt-5 max-w-2xl text-[0.98rem] leading-[1.7] text-slate-700">
        Três parcelas somadas, nas duas pontas da faixa. Quanto mais claro o tom, menos sólida a
        parcela: o retrabalho sai de aritmética direta; a contingência é a mais assumida das três.
      </p>

      <div className="mt-9 space-y-7">
        {(
          [
            { chave: 'min' as const, rotulo: 'Ponta de baixo', total: somaMin },
            { chave: 'max' as const, rotulo: 'Ponta de cima', total: somaMax },
          ]
        ).map(({ chave, rotulo, total }) => (
          <div key={chave}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-slate-500">
                {rotulo}
              </span>
              {/* O rótulo é a SOMA DESENHADA, não a faixa publicada — senão a
                  barra e o número ao lado dela contariam histórias diferentes
                  sempre que o teto cortasse. */}
              <span className="nums font-mono text-[0.82rem] text-navy-700">
                {formatarReais(total)}
                {chave === 'max' && posicaoDoTeto !== null && (
                  <span className="text-gold-700"> → cortada em {formatarReais(faixa.max)}</span>
                )}
              </span>
            </div>

            <div
              className="relative mt-2.5 flex w-full"
              style={{ height: ALTURA_BARRA }}
              role="img"
              aria-label={
                parcelas.map((p) => `${p.rotulo}: ${formatarReais(p[chave])}`).join('; ') +
                (chave === 'max' && posicaoDoTeto !== null
                  ? `. Soma cortada pelo teto em ${formatarReais(faixa.max)}.`
                  : '')
              }
            >
              {parcelas.map((parcela, i) => {
                const largura = (parcela[chave] / escala) * 100;
                if (largura <= 0) return null;
                const ultimo = i === parcelas.length - 1;
                return (
                  <div
                    key={parcela.id}
                    data-tinta
                    style={{
                      width: `${largura}%`,
                      background: parcela.cor,
                      marginRight: ultimo ? 0 : GAP,
                      // Ponta arredondada só no fim do dado; a base é reta.
                      borderRadius: ultimo ? '0 3px 3px 0' : i === 0 ? '3px 0 0 3px' : 0,
                    }}
                  />
                );
              })}
              {/* O ar que sobra até a escala comum — é ele que faz a barra de
                  baixo LER como menor em vez de as duas encherem a linha. */}
              <div style={{ width: `${100 - (total / escala) * 100}%` }} />

              {/* O fio do teto: onde a trava de sanidade cortou a faixa. */}
              {chave === 'max' && posicaoDoTeto !== null && (
                <span
                  aria-hidden
                  className="absolute top-[-0.4rem] bottom-[-0.4rem] w-px bg-gold-500"
                  style={{ left: `${posicaoDoTeto}%` }}
                />
              )}
            </div>

            {chave === 'max' && posicaoDoTeto !== null && (
              <p
                className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-gold-700"
                style={{ marginLeft: `min(${posicaoDoTeto}%, calc(100% - 9rem))` }}
              >
                ↑ teto
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Legenda: sempre presente, porque são três séries. Cada linha traz o
          valor nas duas pontas — o que a barra não consegue rotular por
          dentro sem cortar texto. */}
      <ul className="mt-9 space-y-4 border-t border-navy-700/15 pt-7">
        {parcelas.map((parcela) => (
          <li key={parcela.id} className="grid gap-x-4 gap-y-1 sm:grid-cols-[0.75rem_1fr_auto]">
            <span
              aria-hidden
              data-tinta
              className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-[1px]"
              style={{ background: parcela.cor }}
            />
            <span>
              <span className="block text-[0.96rem] leading-snug text-navy-700">
                {parcela.rotulo}
              </span>
              <span className="mt-0.5 block text-[0.86rem] leading-relaxed text-slate-600">
                {parcela.explicacao}
              </span>
            </span>
            <span className="nums self-start whitespace-nowrap font-mono text-[0.8rem] text-slate-600 sm:text-right">
              {formatarReais(parcela.min)} – {formatarReais(parcela.max)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-7 text-[0.86rem] leading-relaxed text-slate-500">
        Os valores acima são a conta cheia. A faixa publicada no topo da página é essa mesma conta
        arredondada para dois algarismos significativos — porque precisão de real, numa estimativa
        feita de fora, seria precisão inventada.
      </p>

      {decomposicao.tetoAplicado && (
        <p className="mt-6 border-l-2 border-gold-500 pl-5 text-[0.92rem] leading-relaxed text-slate-700">
          <span className="font-medium text-navy-700">O teto foi aplicado. </span>
          A soma das parcelas passou de {formatarPorcentagem(TETO_SOBRE_FATURAMENTO)} do faturamento
          que você declarou, então a ponta de cima foi cortada nesse limite — é o fio dourado na
          barra acima. Quando o piso também passava do teto, ele desceu na mesma proporção, para a
          razão entre as duas pontas continuar sendo a aritmética. A trava existe para impedir que
          uma combinação improvável de respostas produza um número absurdo. Quando ela dispara, é
          sinal de que a conversa vale muito mais que a conta.
        </p>
      )}
    </figure>
  );
}
