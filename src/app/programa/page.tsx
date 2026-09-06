import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { LinhaDoPrograma } from '@/components/marketing/LinhaDoPrograma';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { ALINHAMENTO, FASES } from '@/content/caminhos';
import { evidencia } from '@/content/evidencias';
import { PRECO_PUBLICO, REGRAS_DE_INVESTIMENTO } from '@/content/precos';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'O Programa · AI Native · Ano 1',
  descricao:
    'Doze meses, três fases e três portões de saída sem multa. Diagnóstico focado, um caso construído com dados reais ' +
    'e medido, construção em produção, capacitação com fluência medida e operação sob acordo de nível de serviço.',
  caminho: '/programa',
});

const ASSINATURA = [
  'Operação sob acordo de nível de serviço',
  'Ritual semanal de 20 minutos',
  'Relatório mensal: projetado × realizado',
  'Conselho trimestral com a diretoria',
  'Exame Anual de IA: a re-medição completa, comparada ano contra ano',
] as const;

export default function PaginaPrograma() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Caminho 02 · AI Native · Ano 1"
        titulo="Um documento, dois tempos: a fase 1 é firme e pequena; o ano inteiro é opção."
        apoio={
          <p>
            O comitê decide o ano uma vez. O investimento maior só anda com o caso medido na mesa. E
            cada portão de saída é limpo — quem sai leva tudo que já foi construído e medido.
          </p>
        }
      />

      {/* A régua do ano, antes das fases em detalhe: primeiro o mapa,
          depois o território. */}
      <Secao tom="claro" espaco="normal">
        <Revelar>
          <LinhaDoPrograma />
        </Revelar>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        <RevelarLista className="space-y-px" passo={0.06}>
          {FASES.map((fase) => (
            <RevelarItem
              as="article"
              key={fase.id}
              className="grid gap-8 border-t border-navy-700/15 py-12 lg:grid-cols-[15rem_1fr] lg:gap-16"
            >
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
                  {fase.rotulo}
                </p>
                <h2 className="mt-4 text-[1.8rem] leading-tight text-navy-700">{fase.nome}</h2>
                <p className="nums mt-2 font-mono text-[0.84rem] text-slate-500">{fase.janela}</p>
              </div>

              <div>
                <p className="text-[1.1rem] leading-[1.7] text-navy-700">{fase.promessa}</p>

                <h3 className="mt-9 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                  O que entra
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {fase.entregaveis.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.94rem] leading-relaxed text-slate-600">
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 border-l-2 border-gold-500 pl-6">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold-700">
                    {fase.portao.nome}
                  </p>
                  <p className="mt-2.5 text-[0.98rem] leading-[1.7] text-navy-700">
                    {fase.portao.regra}
                  </p>
                </div>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="Por que o portão existe"
          titulo="Porque a evidência diz que começar sem critério de sucesso é a causa nº 1 de fracasso."
          apoio={
            <p>
              A estrutura do Programa não é uma preferência de método. Ela é a resposta operacional a
              três medições independentes que apontam para o mesmo lugar.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-3" passo={0.07}>
          {(['rand-causa-1', 'metr-19', 'wharton-medicao'] as const).map((id) => (
            <RevelarItem key={id}>
              <NumeroComFonte evidencia={evidencia(id)} tom="escuro" />
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="Ano 2 em diante"
            titulo="A Assinatura da Capacidade."
            className="max-w-none"
          />
          <Revelar>
            <p className="text-[1.08rem] leading-[1.7] text-navy-700">
              Você não renova um projeto: entra numa assinatura. Caso de uso novo vira mini-ciclo
              dentro dela — expansão, não venda nova. E a renovação automática só existe a partir do
              ano 2, nunca na entrada: ela funciona depois que o cliente já decidiu ficar.
            </p>
            <ul className="mt-8 space-y-3">
              {ASSINATURA.map((item) => (
                <li key={item} className="flex gap-3.5 text-[0.98rem] leading-relaxed text-slate-700">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.96rem] leading-relaxed text-slate-600">
              A série histórica de maturidade é o artefato que se valoriza a cada ano — e que
              ninguém corta sem ter que explicar ao conselho.
            </p>
          </Revelar>
        </div>
      </Secao>

      <Secao tom="gelo" largura="estreita">
        <Revelar>
          <h2 className="text-[1.8rem] leading-snug text-navy-700 sm:text-[2.2rem]">
            {ALINHAMENTO.titulo}
          </h2>
          <p className="mt-6 text-[1.06rem] leading-[1.7] text-slate-700">{ALINHAMENTO.texto}</p>
        </Revelar>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Investimento"
          titulo="As regras do dinheiro, publicadas."
          apoio={
            PRECO_PUBLICO ? undefined : (
              <p>
                Os valores vão no Termo do Programa, depois da conversa. As regras abaixo valem
                sempre, com ou sem proposta na mesa.
              </p>
            )
          }
        />
        <RevelarLista className="mt-14 grid gap-x-14 gap-y-9 sm:grid-cols-2" passo={0.05}>
          {REGRAS_DE_INVESTIMENTO.map((regra) => (
            <RevelarItem key={regra.titulo} className="border-t border-navy-700/15 pt-5">
              <h3 className="text-[1.08rem] font-medium leading-snug text-navy-700">
                {regra.titulo}
              </h3>
              <p className="mt-2.5 text-[0.94rem] leading-relaxed text-slate-600">{regra.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14 border-t border-navy-700/15 pt-10">
          <p className="max-w-2xl text-[1.02rem] leading-[1.7] text-navy-700">
            <span className="font-medium">Escassez verdadeira, declarada como fato. </span>
            Três a quatro Programas novos por ano é a capacidade real de dois sócios. Não é tática —
            é aritmética de agenda, e a gente prefere dizer antes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Botao href="/analise">Começar pelo Mapa de Vazamento</Botao>
            <Botao href="/contato" variante="secundario">
              Falar com um sócio
            </Botao>
          </div>
        </Revelar>
      </Secao>
    </>
  );
}
