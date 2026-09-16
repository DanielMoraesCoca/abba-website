import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Convergencia } from '@/components/marketing/Convergencia';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Secao } from '@/components/ui/Secao';
import { EVIDENCIAS, INDICE_PROIBIDO } from '@/content/evidencias';
import { HEADLINE } from '@/content/identidade';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Base de evidências',
  descricao:
    'Todo número que a ABBA usa, com fonte primária e nível de confiança, e a lista dos números que proibimos ' +
    'de usar, com o motivo de cada um.',
  caminho: '/evidencias',
});

export default function PaginaEvidencias() {
  return (
    <>
      <CapaDePagina
        sobretitulo="A base de evidências"
        titulo={
          <>
            Todo número que usamos, com a fonte. E os que <Enfase>proibimos</Enfase> de usar, com o
            motivo.
          </>
        }
        apoio={
          <p>
            Metade do conteúdo que ranqueia sobre “IA corporativa” é marketing de fornecedor, com
            estatísticas que se citam em círculo. Nós vendemos prova. Uma empresa que vende prova e
            cita número de folclore está morta na primeira reunião com um cético técnico. Por isso
            esta página é pública: número que não está aqui não sai da nossa boca nem do nosso
            material.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="O cânone"
          titulo="Os números aprovados para uso externo."
          apoio={
            <p>
              Cada linha traz o número, a fonte primária, o ano e o nível de confiança. Quando a
              confiança não é alta, a ressalva vem junto, não em outra página, não em letra miúda.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-x-12 gap-y-14 lg:grid-cols-2" passo={0.04}>
          {EVIDENCIAS.map((item) => (
            <RevelarItem key={item.id} className="flex flex-col">
              <NumeroComFonte evidencia={item} />
              <p className="mt-5 text-legenda leading-relaxed text-ardosia">
                <span className="font-mono text-rotulo uppercase tracking-[0.12em] text-ardosia">
                  Leitura ·{' '}
                </span>
                {item.leitura}
              </p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* A convergência vem depois do cânone: primeiro o leitor vê que
          cada número tem fonte, depois vê que três fontes independentes
          apontam para o mesmo lugar. A ordem é o argumento. */}
      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="A convergência"
          titulo="Três medições independentes, uma conclusão."
          apoio={
            <p>
              A objeção mais forte que a gente recebe é que todo consultor de IA diz que a culpa é
              da adoção. A resposta não é dizer mais alto.
            </p>
          }
        />
        <Revelar className="mt-16">
          <Convergencia />
        </Revelar>
      </Secao>

      <Secao tom="gelo" largura="estreita">
        <Revelar>
          <h2 className="text-lede leading-snug text-navy">
            E a leitura sobre onde o valor vive? Essa não é estatística.
          </h2>
          <p className="mt-6 text-corpo leading-[1.7] text-ardosia">
            {HEADLINE.corpo}
          </p>
          <p className="mt-6 text-corpo leading-[1.7] text-ardosia">
            Frases desse tipo circulam no mercado sem medição rigorosa. Fingir que a nossa é número
            medido nos colocaria no mesmo balaio que combatemos. Então dizemos o que ela é:{' '}
            <strong className="font-medium text-navy">convicção e leitura de mercado</strong>. O
            que citamos com fonte é outra coisa. RAND, METR, DORA, BCG. A honestidade sobre o que é
            tese e o que é medição é o posicionamento.
          </p>
        </Revelar>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="O índice proibido"
          titulo="Os números que a gente baniu do próprio material."
          apoio={
            <p>
              Alguns destes já foram argumento comercial nosso. Doeu aposentar, e é exatamente por
              isso que a lista está publicada. Se um sócio usar um deles, o material volta.
            </p>
          }
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.05}>
          {INDICE_PROIBIDO.map((item) => (
            <RevelarItem
              key={item.rotulo}
              className="grid gap-6 border-t border-ardosia-clara/15 py-8 md:grid-cols-[1fr_1.4fr] md:gap-12"
            >
              <h3 className="text-corpo leading-snug text-branco line-through decoration-ouro/70 decoration-1">
                {item.rotulo}
              </h3>
              <div className="space-y-3">
                <p className="text-legenda leading-relaxed text-ardosia-clara">{item.porque}</p>
                <p className="text-legenda leading-relaxed text-ouro-claro/90">
                  <span className="font-mono text-rotulo uppercase tracking-[0.12em]">
                    No lugar ·{' '}
                  </span>
                  {item.substituto}
                </p>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14 max-w-2xl border-l-2 border-ouro pl-6">
          <p className="text-corpo leading-[1.7] text-ardosia-clara">
            Regra geral: todo número de terceiro sai com a fonte na frase, como em “a RAND mediu” ou “a
            Gartner projeta”, e vira alvo de auditoria do cliente. Número sem dono é boato com
            dígitos.
          </p>
        </Revelar>
      </Secao>
    </>
  );
}
