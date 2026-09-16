import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { FormularioContato } from '@/components/marketing/FormularioContato';
import { Revelar } from '@/components/motion/Revelar';
import { Secao } from '@/components/ui/Secao';
import { CONTATO, EMPRESA } from '@/content/identidade';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Contato',
  descricao:
    'Fale com um sócio da ABBA. Todo contato é respondido em 24 horas úteis, e a primeira conversa é de descoberta, ' +
    'não de apresentação.',
  caminho: '/contato',
});

export default function PaginaContato() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Contato"
        titulo="A primeira conversa é de descoberta. A gente chega com pergunta, não com apresentação."
        apoio={<p>{CONTATO.prazoResposta}</p>}
      />

      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <Revelar className="space-y-10">
            <div>
              <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
                Direto
              </h2>
              <a
                href={`mailto:${EMPRESA.email}`}
                className="mt-4 block font-display text-lede text-navy underline-offset-4 hover:underline"
              >
                {EMPRESA.email}
              </a>
            </div>

            <div>
              <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
                Capacidade
              </h2>
              <p className="mt-4 text-legenda leading-[1.7] text-ardosia">
                {CONTATO.capacidade}
              </p>
            </div>

            <div>
              <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
                Antes de escrever
              </h2>
              <p className="mt-4 text-legenda leading-[1.7] text-ardosia">
                Se você quiser chegar na conversa com material, comece pela análise gratuita: ela
                leva três minutos e devolve uma faixa em reais com as premissas na mesa. A conversa
                fica melhor com ela do que sem.
              </p>
            </div>
          </Revelar>

          <Revelar>
            <FormularioContato />
          </Revelar>
        </div>
      </Secao>
    </>
  );
}
