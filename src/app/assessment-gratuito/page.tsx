import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { EMPRESA } from '@/content/identidade';
import { metadadosDaPagina } from '@/lib/seo';

/**
 * O Assessment gratuito, que até aqui se chamava Mapa de Vazamento.
 *
 * ════════════════════════════════════════════════════════════════════════
 * A troca de nome não é cosmética, e o motivo precisa ficar escrito aqui
 * porque é a coisa mais fácil de desfazer sem querer.
 *
 * O Mapa de Vazamento era um documento de duas páginas que abria com uma
 * faixa em reais do dinheiro estimado como vazando. Ele foi aposentado no
 * abba-ops por decisão do sócio, depois da leitura de um relatório real,
 * por uma razão simples: a ferramenta nunca produziu aquilo. O nome externo
 * fixado em marca-e-nomenclatura.md é Assessment gratuito, e a anatomia real
 * está em 03-comercial/assessment-gratuito.md.
 *
 * O que esta página NÃO pode fazer, e cada proibição tem dono:
 *
 *   · citar ou linkar o endereço onde o assessment é gerado. Ele não está
 *     aberto ao público. Todo convite aqui vai para o e-mail da casa.
 *   · prometer tempo de geração. Existe um número medido em casa, e ele foi
 *     lido uma vez como se fosse o tempo que o visitante gasta respondendo.
 *     Não é, e por isso não aparece.
 *   · prometer acurácia, garantia ou nível de serviço.
 *   · citar cliente, depoimento ou logo. Não existe nenhum aprovado por
 *     escrito, então não existe a seção.
 * ════════════════════════════════════════════════════════════════════════
 */

export const metadata = metadadosDaPagina({
  titulo: 'Assessment gratuito',
  descricao:
    'A peça de abertura da ABBA, gratuita: um assessment de IA da sua empresa montado só com informação ' +
    'pública, com nota de maturidade, oportunidades priorizadas e o registro de cada fonte usada.',
  caminho: '/assessment-gratuito',
});

/**
 * As quatro provas de honestidade. Saem da anatomia do relatório real, e
 * cada uma é uma crença do manifesto rodando em produção, de graça, para um
 * desconhecido.
 */
const PROVAS = [
  {
    titulo: 'Todo achado se classifica sozinho',
    texto:
      'Cada coisa que o documento afirma vem com três rótulos: se é da sua empresa ou da sua indústria, se é fato ' +
      'declarado ou hipótese nossa, e qual a confiança que a gente deposita nela. O leitor sabe o peso de cada linha ' +
      'sem precisar perguntar.',
  },
  {
    titulo: 'As fontes vêm inteiras, no fim',
    texto:
      'Não é uma lista de links. É o registro de cada evidência usada, com identificador, o provedor, a citação ' +
      'literal e o endereço. Dá para conferir uma por uma, e é para isso que ele existe.',
  },
  {
    titulo: 'O que não se sabe fica escrito como não sabido',
    texto:
      'Campo que a pesquisa não encontrou aparece como desconhecido. Nunca é preenchido por dedução, e nunca some da ' +
      'página para o documento parecer mais completo do que é.',
  },
  {
    titulo: 'O vazio ganha uma seção própria',
    texto:
      'Existe uma seção inteira dedicada ao que a gente não conseguiu descobrir sobre vocês de fora. Um documento ' +
      'comercial normal teria omitido isso e ninguém sentiria falta. Aqui ele vira a pauta da conversa.',
  },
] as const;

/**
 * As cinco perguntas da conversa. Continuam sendo o teste de alvo saindo de
 * graça, e continuam sem apresentação nenhuma em volta.
 */
const CONVERSA = [
  'Me conta o caminho de uma nota fiscal aí dentro, do pedido até o pagamento: quem toca, em que sistema.',
  'O que mais atrasa o fechamento do mês? E quanto tempo ele leva hoje?',
  'Tem algum número em reais que dói hoje e que vocês já medem?',
  'Quando vocês descobrem que perderam dinheiro: no mês, no trimestre, no ano seguinte?',
  'Se esse número melhorasse 20%, quem na empresa comemoraria?',
] as const;

const DENTRO = [
  {
    rotulo: 'Nota de maturidade',
    texto:
      'De zero a cinco em seis eixos: estratégia, processos, dados, tecnologia, pessoas e governança. Com nota geral ' +
      'e o estágio nomeado.',
  },
  {
    rotulo: 'Sinais recentes',
    texto:
      'O que mudou na sua empresa e no seu setor, datado, com a evidência ao lado. Mudança de liderança, movimento ' +
      'regulatório, movimento de mercado.',
  },
  {
    rotulo: 'Oportunidades priorizadas',
    texto:
      'Impacto contra esforço, com uma nota de prioridade, e cada oportunidade abre com o problema, o valor esperado, ' +
      'o que precisa estar pronto antes, e os riscos dela.',
  },
  {
    rotulo: 'Um piloto nomeado',
    texto:
      'A recomendação de abertura não é um menu: é uma frase que começa com "comece por", com escopo e resultado ' +
      'esperado. Se estiver errada, é uma frase para discordar, e discordância é conversa.',
  },
  {
    rotulo: 'Roadmap em três horizontes',
    texto: 'Otimizar, escalar, reinventar. Com o que cai em cada um, e por quê.',
  },
  {
    rotulo: 'O registro das fontes',
    texto:
      'Toda evidência usada, com citação literal e endereço. É a última seção do documento e costuma ser a mais longa.',
  },
] as const;

export default function PaginaAssessmentGratuito() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Caminho 01 · gratuito"
        titulo={
          <>
            Um documento sobre a sua empresa, montado antes de vocês{' '}
            <Enfase>pedirem</Enfase>, e sem cobrar por ele.
          </>
        }
        apoio={
          <p>
            O assessment gratuito é a peça de abertura da ABBA. A gente monta um documento de
            dezenas de páginas sobre a sua empresa usando só informação pública, com nota de
            maturidade, oportunidades priorizadas e o registro de cada fonte, e apresenta ao vivo. O
            exemplar de referência da casa tem 31 páginas. Não custa nada, e não pede nenhum dado
            seu.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="Por que a gente entrega antes"
            titulo={
              <>
                Quem manda uma proposta pede confiança. Quem manda um trabalho feito{' '}
                <Enfase>mostra</Enfase> o que sabe fazer.
              </>
            }
            className="max-w-none"
          />
          <Revelar className="space-y-6 text-corpo leading-[1.7] text-ardosia">
            <p>
              A objeção que a ABBA mais recebe é justa: todo consultor de IA diz as mesmas coisas.
              Responder mais alto não resolve. Entregar o método rodando, antes de qualquer
              contrato, resolve.
            </p>
            <p>
              E o documento escolhe quem lê. Uma nota de maturidade baixa num papel que veio de fora
              é desconfortável na medida certa: o leitor concorda, corrige ou discorda, e as três
              são conversa. A ausência de reação é um PDF arquivado.
            </p>
            <p className="border-l-2 border-ouro pl-6 text-navy">
              O gancho é honesto e é sempre o mesmo: isto foi montado de fora, com informação
              pública. Imagine com os dados de dentro.
            </p>
          </Revelar>
        </div>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="O que vem dentro"
          titulo={
            <>
              Seis blocos, e o mais <Enfase>longo</Enfase> deles é a lista das fontes.
            </>
          }
        />

        <RevelarLista className="mt-16 space-y-px" passo={0.05}>
          {DENTRO.map((item, i) => (
            <RevelarItem
              key={item.rotulo}
              className="grid gap-5 border-t border-ardosia-clara/15 py-8 md:grid-cols-[3rem_1fr_1.4fr] md:gap-10"
            >
              <span className="nums font-mono text-legenda text-ouro">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-corpo leading-snug text-branco">{item.rotulo}</h3>
              <p className="text-legenda leading-relaxed text-ardosia-clara">{item.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="As quatro provas"
          titulo={
            <>
              O documento diz o tempo inteiro o quanto ele <Enfase>não</Enfase> sabe.
            </>
          }
          apoio={
            <p>
              Não é modéstia. É o único jeito de as poucas certezas dele valerem alguma coisa: num
              documento em que tudo é afirmado com a mesma firmeza, nada é confiável.
            </p>
          }
        />
        <RevelarLista className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2" passo={0.06}>
          {PROVAS.map((prova) => (
            <RevelarItem key={prova.titulo} className="border-t border-navy/15 pt-6">
              <h3 className="text-lede leading-snug text-navy">{prova.titulo}</h3>
              <p className="mt-3 text-legenda leading-relaxed text-ardosia">{prova.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <TituloDeSecao
            sobretitulo="A conversa de 45 minutos"
            titulo={
              <>
                Cinco perguntas, nesta ordem. E a gente não <Enfase>apresenta</Enfase> nada nelas.
              </>
            }
            apoio={
              <p>
                Quem apresenta antes de entender vende o produto errado. A pauta da conversa sai
                pronta do próprio documento, na seção do que a gente não descobriu sobre vocês.
              </p>
            }
            className="max-w-none"
          />

          <RevelarLista as="ol" className="space-y-7" passo={0.05}>
            {CONVERSA.map((pergunta, i) => (
              <RevelarItem as="li" key={pergunta} className="flex gap-5">
                <span className="nums mt-1 font-display text-lede leading-none text-ouro-escuro">
                  {i + 1}
                </span>
                <p className="text-corpo leading-[1.6] text-navy">{pergunta}</p>
              </RevelarItem>
            ))}
          </RevelarLista>
        </div>
      </Secao>

      <Secao tom="claro" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.2] text-navy">
            Para pedir o seu, um e-mail basta.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.7] text-ardosia">
            Diga o nome da empresa e o site dela. A gente monta o assessment, confere achado por
            achado antes de mostrar, e marca a conversa. O documento vai depois da apresentação,
            nunca antes: ele foi feito para ser discutido, não para ser arquivado.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Botao href={`mailto:${EMPRESA.email}`}>Pedir o assessment por e-mail</Botao>
            <Botao href="/analise" variante="secundario">
              Ou fazer a primeira leitura agora
            </Botao>
          </div>
          <p className="mt-8 font-mono text-rotulo leading-relaxed text-ardosia">{EMPRESA.email}</p>
        </Revelar>
      </Secao>
    </>
  );
}
