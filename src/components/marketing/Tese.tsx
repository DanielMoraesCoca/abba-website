import { Revelar } from '@/components/motion/Revelar';
import { Container } from '@/components/ui/Container';
import { HEADLINE } from '@/content/identidade';

/**
 * A leitura da casa sobre onde o valor vive.
 *
 * ════════════════════════════════════════════════════════════════════════
 * O NUMERAL DE DISPLAY SAIU DAQUI, E ESTA É A PARTE IMPORTANTE DO ARQUIVO.
 *
 * Até a versão anterior, este bloco abria com "70%" ocupando a tela. O
 * argumento para isso era bom: contraste de escala é o instrumento mais
 * barato de composição que existe, não custa um byte, não pede movimento, e
 * diz ao leitor onde desacelerar.
 *
 * O argumento contra é melhor, e venceu. Os 70/30 são TESE DA CASA, não
 * estatística medida: nenhum estudo diz isso, e a base de evidências marca
 * a linha como convicção. Um numeral em corpo de display é lido como número
 * medido por qualquer pessoa, por mais cuidadosa que seja a frase ao redor.
 * A ressalva ficava logo abaixo, e mesmo assim: quem dá a um número o
 * tamanho de manchete já disse que ele é dado, e a letra miúda não desfaz.
 *
 * Num site cuja tese inteira é honestidade sobre número, esse era o pior
 * lugar possível para um número se disfarçar de medição.
 *
 * O que ficou é a mesma leitura, em corpo de texto, na redação aprovada
 * (`HEADLINE.corpo`), e no passo 3 do argumento em vez da abertura. A
 * ênfase agora vem da medida curta e do espaço em volta: os instrumentos
 * que não mentem sobre a natureza do que está escrito.
 *
 * Se alguém quiser o numeral de volta: ele volta no dia em que existir
 * medição com fonte primária, e aí ele para de ser tese.
 * ════════════════════════════════════════════════════════════════════════
 */
export function Tese() {
  return (
    <section className="bg-papel py-20 sm:py-28">
      <Container largura="larga">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
          <Revelar modo="corte">
            <p className="font-mono text-rotulo uppercase leading-[1.7] tracking-[0.22em] text-ardosia">
              A leitura da casa
            </p>
          </Revelar>

          <Revelar atraso={0.12}>
            <p className="max-w-[44ch] font-display text-lede leading-[1.35] text-navy">
              {HEADLINE.corpo}
            </p>

            <div className="rule-gold mt-10 max-w-[52ch]" aria-hidden />

            <p className="mt-6 max-w-[52ch] font-mono text-legenda leading-relaxed text-ardosia">
              {HEADLINE.notaDaTese}
            </p>
          </Revelar>
        </div>
      </Container>
    </section>
  );
}
