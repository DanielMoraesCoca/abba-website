import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { HEADLINE } from '@/content/identidade';

/**
 * A tese dos 70%, em escala.
 *
 * ────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE BLOCO É GRANDE.
 *
 * A tese é a frase mais importante do site — é o que explica por que a ABBA
 * faz o que faz — e até agora ela era um parágrafo do mesmo tamanho de
 * todos os outros. O olho passava por ela sem parar.
 *
 * Contraste de escala é o instrumento mais barato de composição que existe:
 * não custa um byte, não pede movimento, e é o que diz ao leitor onde ele
 * deveria desacelerar. É a diferença entre um texto bem tratado e uma
 * página desenhada.
 *
 * O NÚMERO É GRANDE E A RESSALVA VEM JUNTO, NO MESMO BLOCO. A base de
 * evidências é explícita: os 70% são tese da casa, não estatística medida.
 * Dar escala a um número e esconder a ressalva noutra tela seria
 * exatamente o truque que a régua do revisor existe para impedir. Aqui a
 * ênfase e o limite chegam ao olho no mesmo instante.
 * ────────────────────────────────────────────────────────────────────────
 */
export function Tese() {
  // Padding assimétrico de propósito: a faixa de grafo logo acima JÁ é a
  // separação, então o topo é curto. Somar o respiro da faixa ao padding
  // cheio criava trezentos pixels de nada — que foi o que a primeira
  // revisão desta seção mostrou.
  return (
    <section className="bg-ice-200 pt-10 pb-20 sm:pt-14 sm:pb-28">
      <Container largura="larga">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <Revelar>
            {/* O número em escala de display. É o único lugar do site em que
                um numeral ocupa a tela — e por isso ele funciona. */}
            <p
              className="nums font-display text-[7rem] leading-[0.82] tracking-[-0.04em] text-navy-700 sm:text-[11rem] lg:text-[13rem]"
              aria-hidden
            >
              70
              <span className="align-super text-[0.34em] text-gold-600">%</span>
            </p>
          </Revelar>

          <Revelar atraso={0.12} className="lg:pt-4">
            <p className="max-w-[34ch] font-display text-[1.6rem] leading-[1.3] text-navy-700 sm:text-[2.1rem]">
              do valor de uma transformação em IA vive em pessoas, processos e cultura.
            </p>
            <p className="mt-8 max-w-[52ch] text-[1.05rem] leading-[1.7] text-slate-700">
              O seu fornecedor te vendeu os outros 30%. Nós instalamos o resto, com método próprio,
              plataforma própria e resultado verificado no final — num registro que a sua diretoria
              pode auditar.
            </p>

            <div className="rule-gold mt-10 max-w-[52ch]" aria-hidden />

            <p className="mt-6 max-w-[52ch] font-mono text-[0.82rem] leading-relaxed text-slate-600">
              {HEADLINE.notaDaTese}
            </p>
          </Revelar>
        </div>
      </Container>
    </section>
  );
}
