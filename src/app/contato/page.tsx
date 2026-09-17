import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Enfase } from '@/components/marketing/Titulo';
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
        titulo={
          <>
            A primeira conversa é de descoberta. A gente chega com <Enfase>pergunta</Enfase>, não com
            apresentação.
          </>
        }
        apoio={<p>{CONTATO.prazoResposta}</p>}
      />

      {/* ╔══ VAGA DE IMAGEM ═══════════════════════════════════════════
          ║ FOTO 07
          ║ Os dois sócios, meio corpo · proporção 4:5
          ║
          ║ Os dois, em conversa de trabalho, olhando um para o outro ou para a mesma tela. Não para a câmera.
          ║
          ║ AQUI: ao lado do formulário. A página diz "falar com um sócio": é aqui que o leitor vê com quem vai falar.
          ║
          ║ Registro: src/content/fotografia.ts. Plano: abba-ops,
          ║ 08-materiais/marca/plano-de-fotografia.md.
          ║ Nenhuma captura sai com dado de cliente: gere com
          ║ USE_MOCK_LLM=true, não borre.
          ╚═════════════════════════════════════════════════════════════ */}

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
                Se você quiser chegar na conversa com material, comece pela primeira leitura: ela
                leva três minutos e devolve onde vocês estão e qual é o passo seguinte. A conversa
                fica melhor com ela do que sem.
              </p>
            </div>
          </Revelar>

          <Revelar>
            <FormularioContato />
          </Revelar>
        </div>
      </Secao>

      {/* ╔══ VAGA DE IMAGEM ═══════════════════════════════════════════
          ║ FOTO 11
          ║ Brasília, sem cartão-postal · proporção 21:9
          ║
          ║ A cidade como contexto de trabalho, não como monumento. Sem
          ║ Congresso, sem pôr do sol.
          ║
          ║ AQUI: sangria de borda a borda, fechando a página, depois do
          ║ formulário. É a única imagem do site que diz de ONDE a casa
          ║ fala, e o lugar dela é o fim de uma conversa, não o começo de
          ║ uma. Em 21:9 ela é uma faixa, não um fundo: uma foto de cidade
          ║ atrás de texto vira papel de parede de consultoria.
          ║
          ║ Registro: src/content/fotografia.ts. Plano: abba-ops,
          ║ 08-materiais/marca/plano-de-fotografia.md.
          ║ Nenhuma captura sai com dado de cliente: gere com
          ║ USE_MOCK_LLM=true, não borre.
          ╚═════════════════════════════════════════════════════════════ */}
    </>
  );
}
