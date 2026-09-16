import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { TOTAL_DE_PERGUNTAS } from '@/lib/analise/schema';
import { maiuscula, porExtenso } from '@/lib/tipografia';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Mapa de Vazamento',
  descricao:
    'A peça de abertura da ABBA, gratuita: uma faixa em reais do que estimamos estar saindo da sua empresa sem ' +
    'precisar sair, com premissas numeradas, fonte citada e o limite declarado.',
  caminho: '/mapa-de-vazamento',
});

const REGRAS = [
  {
    titulo: 'Faixa, nunca número exato',
    texto:
      'Um número exato calculado de fora é uma mentira com aparência de precisão, e o primeiro CFO competente que ' +
      'ele encontrar vai desmontá-la em trinta segundos.',
  },
  {
    titulo: 'Premissa sem fonte não entra',
    texto:
      'Se não há referência pública citável ou uma assunção que a gente assuma como nossa, com todas as letras, o item ' +
      'simplesmente sai do mapa.',
  },
  {
    titulo: 'A faixa pode ser pequena',
    texto:
      'Se a estimativa honesta for baixa, ela vai baixa. Um mapa inflado vende uma reunião e perde a relação.',
  },
  {
    titulo: 'Nunca prometemos capturar a faixa inteira',
    texto:
      'O mapa estima o vazamento. A captura é uma fração dele, e isso a gente diz em voz alta na apresentação, ' +
      'antes de qualquer proposta.',
  },
  {
    titulo: 'Sem dado seu no documento',
    texto:
      'Enquanto não houver contrato, só informação pública e o que você nos disse na conversa. Nada mais.',
  },
] as const;

const CONVERSA = [
  'Me conta o caminho de uma nota fiscal aí dentro, do pedido até o pagamento: quem toca, em que sistema.',
  'O que mais atrasa o fechamento do mês? E quanto tempo ele leva hoje?',
  'Tem algum número em reais que dói hoje e que vocês já medem?',
  'Quando vocês descobrem que perderam dinheiro: no mês, no trimestre, no ano seguinte?',
  'Se esse número melhorasse 20%, quem na empresa comemoraria?',
] as const;

export default function PaginaMapaDeVazamento() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Caminho 01 · gratuito"
        titulo="Três hipóteses fazem o leitor pensar. Um número faz o leitor reagir."
        apoio={
          <p>
            O Mapa de Vazamento é a primeira página da Análise ABBA: uma faixa em reais do dinheiro
            que estimamos estar saindo da sua empresa sem precisar sair. Concordar, discordar ou
            corrigir: qualquer uma das três é uma conversa. A ausência de reação é um PDF
            arquivado.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="Por que um número"
            titulo="O número também escolhe quem lê."
            className="max-w-none"
          />
          <Revelar className="space-y-6 text-corpo leading-[1.7] text-ardosia">
            <p>
              Hipótese de IA circula na TI. Faixa de dinheiro vazando circula na diretoria e no
              financeiro: que é exatamente onde a decisão mora.
            </p>
            <p>
              E a estimativa é independente de setor por construção. Ela se apoia no que a lei
              brasileira padroniza, como nota fiscal eletrônica, SPED e obrigações acessórias, e em
              referências públicas, não em conhecimento de indústria que a gente ainda não tem sobre
              a sua.
            </p>
            <p className="border-l-2 border-ouro pl-6 text-navy">
              O gancho é honesto e é sempre o mesmo: isto foi feito de fora. Imagine com os dados de
              dentro.
            </p>
          </Revelar>
        </div>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="As regras de honestidade"
          titulo="Cinco regras que não se negociam, nem quando custam a venda."
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.05}>
          {REGRAS.map((regra, i) => (
            <RevelarItem
              key={regra.titulo}
              className="grid gap-5 border-t border-ardosia-clara/15 py-8 md:grid-cols-[3rem_1fr_1.4fr] md:gap-10"
            >
              <span className="nums font-mono text-legenda text-ouro">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-corpo leading-snug text-branco">{regra.titulo}</h3>
              <p className="text-legenda leading-relaxed text-ardosia-clara">{regra.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="A conversa de 45 minutos"
            titulo="Cinco perguntas, nesta ordem. E nós não apresentamos nada nela."
            apoio={
              <p>
                Quem apresenta antes de entender vende o produto errado. A conversa é coleta: é o
                que torna a estimativa defensável.
              </p>
            }
            className="max-w-none"
          />

          <RevelarLista as="ol" className="space-y-7" passo={0.05}>
            {CONVERSA.map((pergunta, i) => (
              <RevelarItem as="li" key={pergunta} className="flex gap-5">
                <span className="nums mt-1 font-display text-lede leading-none text-ouro">
                  {i + 1}
                </span>
                <p className="text-corpo leading-[1.6] text-navy">{pergunta}</p>
              </RevelarItem>
            ))}
          </RevelarLista>
        </div>
      </Secao>

      <Secao tom="gelo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.2] text-navy">
            A versão web responde na hora.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.7] text-ardosia">
            {maiuscula(porExtenso(TOTAL_DE_PERGUNTAS))} perguntas fechadas em lugar das cinco abertas, uma faixa
            calculada por aritmética
            que você consegue refazer, e as mesmas cinco regras de honestidade valendo. O Mapa
            completo continua vindo depois da conversa, e continua gratuito.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Botao href="/analise">Começar a análise gratuita</Botao>
            <Botao href="/contato" variante="secundario">
              Marcar a conversa direto
            </Botao>
          </div>
        </Revelar>
      </Secao>
    </>
  );
}
