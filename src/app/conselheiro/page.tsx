import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { NumeroComFonte } from '@/components/marketing/NumeroComFonte';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { evidencia } from '@/content/evidencias';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Conselheiro de IA',
  descricao:
    'A cadeira de direção estratégica de IA, fracionária, do seu lado da mesa. Para a empresa que já tem IA rodando ' +
    'e precisa de direção e prova independente — não de instalação.',
  caminho: '/conselheiro',
});

const ENTREGAS = [
  {
    titulo: 'Presença no conselho',
    texto:
      'Participação estruturada na reunião de diretoria: resultados contra os objetivos declarados, no máximo três ' +
      'recomendações priorizadas, e a decisão registrada com nome e data.',
  },
  {
    titulo: 'Plano diretor vivo',
    texto:
      'O plano de IA deixa de ser documento e vira instrumento: revisado a cada ciclo, realinhado à visão da diretoria.',
  },
  {
    titulo: 'Arbitragem de fornecedores',
    texto:
      'Análise independente de qualquer proposta de IA que chegar à sua empresa: isso é real? é para vocês? qual o ' +
      'preço justo? Por escrito, sem conflito de interesse.',
  },
  {
    titulo: 'Governança e LGPD de IA',
    texto:
      'Vigilância contínua da política de IA: novos usos, novos riscos, adequação regulatória. Não é parecer jurídico ' +
      'nem representação perante a ANPD — e a gente diz isso antes de assinar.',
  },
  {
    titulo: 'Antena de oportunidades',
    texto:
      'O que aprendemos em todos os engajamentos, como padrão anonimizado, chega à sua mesa antes de chegar ao mercado. ' +
      'Nunca dado bruto de um cliente dentro de outro.',
  },
] as const;

const NAO_E = [
  { rotulo: 'Não é banco de horas', texto: 'É senioridade recorrente com pauta própria. Execução vira mini-ciclo ou programa, cotados à parte.' },
  { rotulo: 'Não é suporte técnico', texto: 'Isso é a Manutenção ABBA. As duas coisas convivem e se complementam.' },
  { rotulo: 'Não é parecer jurídico', texto: 'Nem representação perante a ANPD. Preparamos, apontamos e acompanhamos — não assinamos o parecer.' },
  { rotulo: 'Não é terceirização da decisão', texto: 'Recomendamos com convicção e assinamos a recomendação. Quem decide é quem responde pela empresa.' },
] as const;

export default function PaginaConselheiro() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Caminho 03"
        titulo="“Ótimo, vocês já têm IA. E quem senta do seu lado da mesa quando o fornecedor apresenta a fatura?”"
        apoio={
          <p>
            O Conselheiro de IA é a cadeira de estratégia de IA da sua empresa, ocupada pela ABBA em
            regime fracionário. Para quem já construiu, já investiu, e precisa de direção e de prova
            independente — não de instalação.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="O depoimento que queremos ouvir em doze meses"
          titulo="Se a entrega de um trimestre não estiver a caminho disto, o produto está sendo mal executado."
        />
        <Revelar className="mt-12 max-w-3xl border-l-2 border-gold-500 pl-8">
          <blockquote className="font-display text-xl leading-[1.55] text-navy-700">
            “Antes, cada fornecedor de IA que batia na porta virava uma reunião perdida e uma
            dúvida. Hoje temos um conselheiro que já conhece nossa operação, senta no nosso conselho
            a cada trimestre, corta o ruído dos vendedores e nos diz com convicção o que fazer — e o
            que não fazer.”
          </blockquote>
        </Revelar>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao invertido sobretitulo="O que entra" titulo="Cinco entregas, todo ciclo." />

        <RevelarLista className="mt-16 space-y-px" passo={0.05}>
          {ENTREGAS.map((entrega, i) => (
            <RevelarItem
              key={entrega.titulo}
              className="grid gap-5 border-t border-ice-200/15 py-8 md:grid-cols-[3rem_1fr_1.5fr] md:gap-10"
            >
              <span className="nums font-mono text-xs text-gold-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg leading-snug text-ice-100">{entrega.titulo}</h3>
              <p className="text-sm leading-relaxed text-ice-200/70">{entrega.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="O que não é"
          titulo="A seção do que não fazemos vem antes da conversa de preço."
        />
        <RevelarLista className="mt-14 grid gap-x-14 gap-y-9 sm:grid-cols-2" passo={0.05}>
          {NAO_E.map((item) => (
            <RevelarItem key={item.rotulo} className="border-t border-navy-700/15 pt-5">
              <h3 className="text-base font-medium leading-snug text-navy-700">{item.rotulo}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Por que a cadeira nasce fracionária"
          titulo="No médio porte brasileiro, disputar esse talento é uma briga perdida."
        />
        <RevelarLista className="mt-14 grid gap-10 lg:grid-cols-2" passo={0.07}>
          <RevelarItem>
            <NumeroComFonte evidencia={evidencia('talento-98')} />
          </RevelarItem>
          <RevelarItem>
            <NumeroComFonte evidencia={evidencia('auditor-tenure')} />
          </RevelarItem>
        </RevelarLista>
      </Secao>

      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-3xl leading-[1.2] text-ice-100">
            Uma regra que nos custa dinheiro, e fica escrita mesmo assim.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-[1.7] text-ice-200/75">
            O Conselheiro nunca é vendido a quem poderia comprar o Programa. São compradores
            diferentes, e empurrar o produto errado para o cliente certo é o jeito mais rápido de
            perder os dois.
          </p>
          <div className="mt-10 flex justify-center">
            <Botao href="/contato" variante="primario-invertido">
              Conversar sobre o Conselheiro
            </Botao>
          </div>
        </Revelar>
      </Secao>
    </>
  );
}
