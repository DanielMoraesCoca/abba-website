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
    'e precisa de direção e prova independente, não de instalação.',
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
      'nem representação perante a ANPD, e a gente diz isso antes de assinar.',
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
  { rotulo: 'Não é parecer jurídico', texto: 'Nem representação perante a ANPD. Preparamos, apontamos e acompanhamos, não assinamos o parecer.' },
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
            independente, não de instalação.
          </p>
        }
      />

      {/* ISTO ERA UM DEPOIMENTO, E DEPOIMENTO SEM AUTOR NÃO EXISTE.
          ══════════════════════════════════════════════════════════════
          O bloco tinha o título "o depoimento que queremos ouvir em doze
          meses" e, embaixo, uma citação entre aspas com filete dourado. A
          moldura era honesta: dizia com todas as letras que era o que a
          casa QUER ouvir, não o que alguém disse.

          A forma não era. Quem rola uma página não lê sobretítulo: lê
          aspas, filete e serifa, e isso é o desenho universal de citação de
          cliente. A trava 4 não fala só de seções chamadas "cases". Ela
          proíbe depoimento sem aprovação nominal por escrito, e este não
          tinha aprovação porque não tinha autor. Era o único item do site
          que um concorrente conseguiria usar contra a ABBA, e caro
          justamente porque a casa vende prova.

          O conteúdo não morreu: virou primeira pessoa. Sem aspas, sem
          blockquote, sem filete de citação. É promessa assinada, que é o
          que ele sempre foi por baixo da forma errada.

          Quando existir um cliente com aprovação nominal por escrito, ele
          entra aqui do jeito certo: com nome, cargo e empresa. Até lá, não
          existe a seção. */}
      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="O que assumimos entregar"
          titulo="Se a entrega de um trimestre não estiver a caminho disto, o produto está sendo mal executado."
        />
        <Revelar className="mt-12 max-w-3xl">
          <p className="font-display text-lede leading-[1.55] text-navy">
            O que a ABBA se compromete a entregar em doze meses: que cada fornecedor de IA que bate
            na sua porta deixe de virar uma reunião perdida e uma dúvida. Que exista, do seu lado da
            mesa, um conselheiro que já conhece a sua operação, senta no seu conselho a cada
            trimestre, corta o ruído dos vendedores, e diz com convicção o que fazer e o que não
            fazer.
          </p>
        </Revelar>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao invertido sobretitulo="O que entra" titulo="Cinco entregas, todo ciclo." />

        <RevelarLista className="mt-16 space-y-px" passo={0.05}>
          {ENTREGAS.map((entrega, i) => (
            <RevelarItem
              key={entrega.titulo}
              className="grid gap-5 border-t border-ardosia-clara/15 py-8 md:grid-cols-[3rem_1fr_1.5fr] md:gap-10"
            >
              <span className="nums font-mono text-legenda text-ouro">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lede leading-snug text-branco">{entrega.titulo}</h3>
              <p className="text-legenda leading-relaxed text-ardosia-clara">{entrega.texto}</p>
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
            <RevelarItem key={item.rotulo} className="border-t border-navy/15 pt-5">
              <h3 className="text-corpo font-medium leading-snug text-navy">{item.rotulo}</h3>
              <p className="mt-2.5 text-legenda leading-relaxed text-ardosia">{item.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        {/* O segundo número aqui era o tempo médio de permanência do auditor
            no S&P 500. Ele saiu do site inteiro: não consta da base de
            evidências da casa, e número que não está na base não entra na
            página, por mais bem contado que seja o argumento que ele
            sustentava. O que entrou no lugar sai da base, está conferido, e
            responde à segunda metade da mesma pergunta: contratar essa
            cabeça é difícil, e comprar essa cabeça de fora é um campo
            minado. As duas coisas juntas são o motivo de a cadeira nascer
            fracionária. */}
        <TituloDeSecao
          sobretitulo="Por que a cadeira nasce fracionária"
          titulo="Contratar essa cabeça é briga perdida, e quem vende para ela chega em bando."
        />
        <RevelarLista className="mt-14 grid gap-10 lg:grid-cols-2" passo={0.07}>
          <RevelarItem>
            <NumeroComFonte evidencia={evidencia('talento-98')} />
          </RevelarItem>
          <RevelarItem>
            <NumeroComFonte evidencia={evidencia('gartner-40')} />
          </RevelarItem>
        </RevelarLista>
      </Secao>

      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.2] text-branco">
            Uma regra que nos custa dinheiro, e fica escrita mesmo assim.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.7] text-ardosia-clara">
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
