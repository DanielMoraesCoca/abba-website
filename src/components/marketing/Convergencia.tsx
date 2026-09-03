import { evidencia } from '@/content/evidencias';

/**
 * A convergência: três medições independentes, uma conclusão.
 *
 * Este diagrama existe para responder à objeção mais forte que a ABBA
 * recebe — *"todo consultor de IA diz que a culpa é da adoção"* — sem
 * repetir a afirmação mais alto. A defesa não é retórica: é que três
 * grupos que não se conhecem, medindo coisas diferentes, com métodos
 * diferentes, chegaram ao mesmo lugar.
 *
 * O desenho é o argumento: três colunas que descem e se juntam numa linha
 * só. Um leitor cético entende a estrutura antes de ler o texto — e essa é
 * a única forma de argumento que funciona com cético.
 *
 * Por que aqui não há cor por categoria: as três fontes não são três
 * "séries" competindo, são três caminhos para o mesmo ponto. O que precisa
 * ser visível é a JUNÇÃO, e é ela que ganha o dourado. As colunas ficam
 * neutras de propósito.
 */

const FONTES = ['rand-causa-1', 'metr-19', 'dora-amplifica'] as const;

const O_QUE_MEDIU: Record<(typeof FONTES)[number], string> = {
  'rand-causa-1': 'Por que projetos de IA falham',
  'metr-19': 'Se quem usa IA percebe o próprio ganho',
  'dora-amplifica': 'O que a IA faz com times diferentes',
};

export function Convergencia() {
  return (
    <figure className="m-0">
      <div className="grid gap-px sm:grid-cols-3">
        {FONTES.map((id) => {
          const e = evidencia(id);
          return (
            <div key={id} className="flex flex-col border-t border-gold-500/40 pt-7">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-400">
                {O_QUE_MEDIU[id]}
              </p>
              <p className="nums mt-4 font-display text-[1.9rem] leading-[1.1] text-ice-100">
                {e.numero}
              </p>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-ice-200/80">{e.afirmacao}</p>
              <p className="mt-auto pt-6 font-mono text-[0.68rem] leading-relaxed text-ice-300/60">
                {e.fonte} ({e.ano})
              </p>
            </div>
          );
        })}
      </div>

      {/* A junção. Três hastes descem e entram numa linha só — o desenho é o
          argumento, e por isso ele é a única coisa dourada aqui. */}
      <svg
        viewBox="0 0 300 44"
        preserveAspectRatio="none"
        className="mt-2 h-11 w-full"
        aria-hidden
      >
        <path
          d="M50 0 V18 Q50 30 62 30 H238 Q250 30 250 18 V0 M150 0 V30"
          fill="none"
          stroke="var(--color-gold-500)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          opacity={0.85}
        />
        <circle cx={150} cy={30} r={4} fill="var(--color-gold-500)" />
      </svg>

      <figcaption className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold-400">
          Onde as três chegam
        </p>
        <p className="mt-5 font-display text-[1.35rem] leading-[1.5] text-ice-100 sm:text-[1.6rem]">
          Ninguém sabe se a IA ajudou sem combinar a métrica antes e medir de fora depois.
        </p>
        <p className="mt-5 text-[0.98rem] leading-[1.7] text-ice-200/75">
          Três grupos que não se conhecem, medindo coisas diferentes, com métodos diferentes. Não é
          a nossa opinião repetida três vezes — é o mesmo achado por três caminhos independentes. É
          por isso que a ABBA existe do jeito que existe.
        </p>
      </figcaption>
    </figure>
  );
}
