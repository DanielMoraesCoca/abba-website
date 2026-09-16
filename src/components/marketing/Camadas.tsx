import { CAMADAS } from '@/content/metodo';
import { cn } from '@/lib/utils';

/**
 * As sete camadas de leitura, desenhadas como profundidade.
 *
 * Este é o diagrama que carrega o diferencial inteiro da avaliação: a frase
 * "a maioria das avaliações para na terceira camada" é uma afirmação sobre
 * PROFUNDIDADE, e profundidade o olho entende num desenho e não entende
 * numa lista numerada.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A PRIMEIRA VERSÃO ERRAVA, E O ERRO ENSINOU O DESENHO CERTO.
 *
 * Ela escurecia o fundo por opacidade, degrau a degrau, mantendo o texto
 * escuro. A auditoria de contraste derrubou: a partir de 8% de opacidade o
 * dourado do numeral já reprovava, e a faixa toda que sobrava (2% a 6%) era
 * pouca para o olho ler como profundidade. O gradiente sutil brigava com a
 * legibilidade e perdia as duas.
 *
 * A correção é mais forte do que o original: abaixo da linha, o território
 * vira escuro DE VERDADE — navy fechando até quase preto, texto claro. A
 * mudança deixa de ser um degradê e passa a ser uma travessia. É o que a
 * frase diz: da quarta camada para baixo é outro lugar.
 * ────────────────────────────────────────────────────────────────────────
 */

/** Abaixo desta camada é território que exige estar dentro. */
const ONDE_A_MAIORIA_PARA = 3;

/** Os quatro degraus de profundidade, do mais raso ao mais fundo. */
const FUNDO_PROFUNDO = ['bg-navy', 'bg-navy', 'bg-navy-escuro', 'bg-navy-escuro'];

export function Camadas() {
  return (
    <figure className="m-0">
      <ol className="m-0 list-none p-0">
        {CAMADAS.map((camada) => {
          const profunda = camada.num > ONDE_A_MAIORIA_PARA;
          // As três rasas dividem UM tom, e é de propósito: elas são um
          // território só — o que todo mundo alcança. Um degradê entre elas
          // sugeriria uma progressão que não existe, e (medido) empurrava o
          // numeral dourado para baixo dos 4,5:1 nos tons mais fechados.
          const fundo = profunda
            ? FUNDO_PROFUNDO[camada.num - ONDE_A_MAIORIA_PARA - 1]
            : 'bg-papel';

          return (
            <li key={camada.num}>
              {camada.num === ONDE_A_MAIORIA_PARA + 1 && (
                <div className="my-5 flex items-center gap-4">
                  <span aria-hidden className="h-px flex-1 bg-ouro/70" />
                  <span className="text-center font-mono text-rotulo uppercase tracking-[0.16em] text-navy">
                    A maioria das avaliações para aqui
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-ouro/70" />
                </div>
              )}

              <div
                className={cn(
                  'grid items-baseline gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[2.5rem_9rem_1fr]',
                  // Um fio branco separa as rasas entre si; no escuro o
                  // próprio degrau de navy já separa.
                  !profunda && camada.num > 1 && 'border-t border-branco',
                  fundo,
                )}
              >
                <span
                  className={cn(
                    'nums font-mono text-rotulo',
                    profunda ? 'text-ouro-claro' : 'text-navy',
                  )}
                >
                  {String(camada.num).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-corpo leading-snug',
                    profunda ? 'text-branco' : 'text-navy',
                  )}
                >
                  {camada.nome}
                </span>
                <span
                  className={cn(
                    'text-legenda leading-relaxed',
                    profunda ? 'text-ardosia-clara' : 'text-ardosia',
                  )}
                >
                  {camada.pergunta}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-8 max-w-2xl text-legenda leading-[1.7] text-ardosia">
        Da quarta camada para baixo, quase nada se enxerga de fora: onde o trabalho quebra, o que a
        empresa sabe e não usa, o que ela não sabe que deveria saber.{' '}
        <strong className="font-medium text-navy">
          É exatamente aí que a Avaliação em 25 dimensões trabalha
        </strong>{' '}, e é por isso que o Mapa de Vazamento, feito de fora, declara o próprio limite na primeira
        linha.
      </figcaption>
    </figure>
  );
}
