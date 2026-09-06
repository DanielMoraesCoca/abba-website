import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Camadas } from '@/components/marketing/Camadas';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import {
  DIMENSOES,
  PRINCIPIO_DO_ORGANISMO,
  PROTOCOLO_DE_PROVA,
  TOTAL_DIMENSOES,
} from '@/content/metodo';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Método',
  descricao:
    'Sete camadas de leitura, 25 dimensões em 9 grupos, e um protocolo de prova com quatro regras: ' +
    'a métrica é combinada antes, quem valida é gente do cliente, e a certificação é sempre de terceiro.',
  caminho: '/metodo',
});

export default function PaginaMetodo() {
  return (
    <>
      <CapaDePagina
        sobretitulo="O método"
        titulo="A maioria das avaliações para na terceira camada. A transformação de verdade exige ler a empresa como um organismo."
        apoio={
          <p>
            Missão, economia, operação, rupturas, ativos ocultos, pontos cegos e visão. Sete
            profundidades, e a avaliação só começa a valer da quarta em diante.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="As sete camadas"
          titulo="Cada camada é uma pergunta que a anterior não consegue responder."
        />

        {/* Por corte: a cortina desce camada a camada, na mesma direção em
            que o diagrama deve ser lido. A forma repete o argumento. */}
        <Revelar className="mt-16" modo="corte">
          <Camadas />
        </Revelar>
      </Secao>

      <Secao tom="navy" largura="estreita" espaco="amplo">
        <Revelar>
          <h2 className="text-[1.9rem] leading-[1.2] text-ice-100 sm:text-[2.4rem]">
            {PRINCIPIO_DO_ORGANISMO.titulo}
          </h2>
          <p className="mt-8 text-[1.08rem] leading-[1.7] text-ice-200/80">
            {PRINCIPIO_DO_ORGANISMO.texto}
          </p>
          <p className="mt-8 border-l-2 border-gold-500 pl-6 text-[1.02rem] leading-[1.7] text-gold-300">
            {PRINCIPIO_DO_ORGANISMO.corolario}
          </p>
        </Revelar>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo={`A anatomia · ${TOTAL_DIMENSOES} dimensões`}
          titulo="Nove grupos, e quase nenhum deles se enxerga de fora."
          apoio={
            <p>
              Esta é a estrutura da Avaliação em 25 dimensões. As perguntas de cada dimensão — as
              que realmente fazem o trabalho — ficam na sala com o cliente, não no site.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-x-12 gap-y-11 sm:grid-cols-2 lg:grid-cols-3" passo={0.04}>
          {DIMENSOES.map((grupo) => (
            <RevelarItem key={grupo.grupo} className="border-t border-navy-700/15 pt-6">
              <h3 className="text-[1.08rem] font-medium leading-snug text-navy-700">
                {grupo.grupo}
              </h3>
              <ul className="mt-4 space-y-2">
                {grupo.itens.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.92rem] leading-relaxed text-slate-600"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-2.5 shrink-0 bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        <TituloDeSecao
          sobretitulo="O protocolo de prova"
          titulo="Quatro regras que separam prova de depoimento."
          apoio={
            <p>
              A analogia com auditoria é honesta: ninguém dispensa o auditor por ter CFO. A
              diferença é que a ABBA também constrói e treina — e é a separação de papéis abaixo que
              permite fazer as três coisas sem conflito.
            </p>
          }
        />

        <RevelarLista className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2" passo={0.05}>
          {PROTOCOLO_DE_PROVA.map((regra, i) => (
            <RevelarItem key={regra.titulo} className="border-t border-navy-700/15 pt-6">
              <p className="nums font-mono text-[0.72rem] text-gold-700">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-[1.15rem] leading-snug text-navy-700">{regra.titulo}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-slate-600">{regra.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14">
          <Botao href="/analise">Ver uma amostra do método, de graça</Botao>
        </Revelar>
      </Secao>
    </>
  );
}
