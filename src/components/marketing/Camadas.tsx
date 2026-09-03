import { CAMADAS } from '@/content/metodo';

/**
 * As sete camadas de leitura, desenhadas como profundidade.
 *
 * Este é o diagrama que carrega o diferencial inteiro da avaliação, e por
 * isso ele existe: a frase "a maioria das avaliações para na terceira
 * camada" é uma afirmação sobre PROFUNDIDADE, e profundidade é uma coisa
 * que o olho entende num desenho e não entende numa lista numerada.
 *
 * O que o desenho faz e o texto não faria:
 * - Uma linha marca onde a maioria para. As três camadas acima dela ficam
 *   claras; as quatro abaixo, escuras. A diferença de território é imediata.
 * - A escuridão cresce com a profundidade — é a mesma gramática do gráfico
 *   da decomposição, e ali ela significa "menos sólido". Aqui significa
 *   "mais fundo". Em ambos os casos, o tom carrega informação em vez de
 *   decorar.
 *
 * Componente de servidor, sem JavaScript.
 */

/** Abaixo desta camada é território que exige estar dentro. */
const ONDE_A_MAIORIA_PARA = 3;

export function Camadas() {
  return (
    <figure className="m-0">
      <ol className="relative m-0 list-none p-0">
        {CAMADAS.map((camada) => {
          const profunda = camada.num > ONDE_A_MAIORIA_PARA;
          // Sete degraus de luminância: o navy fecha conforme desce.
          const opacidade = profunda ? 0.06 + (camada.num - 3) * 0.055 : 0.02;
          const primeiraProfunda = camada.num === ONDE_A_MAIORIA_PARA + 1;

          return (
            <li key={camada.num} className="relative">
              {primeiraProfunda && (
                <div className="relative mb-3 mt-6 flex items-center gap-4">
                  <span aria-hidden className="h-px flex-1 bg-gold-500/70" />
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-700">
                    A maioria das avaliações para aqui
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-gold-500/70" />
                </div>
              )}

              <div
                className="grid items-baseline gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[2.5rem_9rem_1fr]"
                style={{ background: `rgb(27 42 74 / ${opacidade})` }}
              >
                <span className="nums font-mono text-[0.78rem] text-gold-700">
                  {String(camada.num).padStart(2, '0')}
                </span>
                <span className="text-[1.06rem] leading-snug text-navy-700">{camada.nome}</span>
                <span className="text-[0.98rem] leading-relaxed text-slate-600">
                  {camada.pergunta}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-8 max-w-2xl text-[0.98rem] leading-[1.7] text-slate-700">
        Da quarta camada para baixo, quase nada se enxerga de fora: onde o trabalho quebra, o que a
        empresa sabe e não usa, o que ela não sabe que deveria saber.{' '}
        <strong className="font-medium text-navy-700">
          É exatamente aí que a Avaliação em 25 dimensões trabalha
        </strong>{' '}
        — e é por isso que o Mapa de Vazamento, feito de fora, declara o próprio limite na primeira
        linha.
      </figcaption>
    </figure>
  );
}
