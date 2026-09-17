import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { CRENCAS, NA_PRATICA, QUANDO_DIZEMOS_NAO, RECUSAS } from '@/content/manifesto';
import { PITCH } from '@/content/identidade';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Manifesto',
  descricao:
    'O que a ABBA acredita, o que recusa, e como isso se reconhece em qualquer conversa. ' +
    'A lista do que recusamos é o que torna a lista do que prometemos crível.',
  caminho: '/manifesto',
});

export default function PaginaManifesto() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Manifesto"
        titulo={
          <>
            Marca não é logo nem headline. É o conjunto de coisas que uma empresa faz de um jeito e{' '}
            <Enfase>não</Enfase> do outro.
          </>
        }
        apoio={
          <p>
            De forma tão consistente que o cliente consegue prever. Esta é a lista, e ela muda com
            decisão registrada, não com conveniência de proposta.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao sobretitulo="O que acreditamos" titulo="Sete convicções." />

        <RevelarLista className="mt-16 space-y-px" passo={0.04}>
          {CRENCAS.map((crenca) => (
            <RevelarItem
              as="article"
              key={crenca.numero}
              className="grid gap-5 border-t border-navy/15 py-9 md:grid-cols-[4rem_1fr] md:gap-10"
            >
              <p className="nums font-display text-secao leading-none text-ardosia">
                {String(crenca.numero).padStart(2, '0')}
              </p>
              <div>
                <h2 className="text-lede leading-snug text-navy">{crenca.titulo}</h2>
                <p className="mt-4 max-w-3xl text-corpo leading-[1.7] text-ardosia">
                  {crenca.texto}
                </p>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="O que recusamos"
          titulo="Cada recusa, com o que ela nos custa."
        />

        <RevelarLista className="mt-16 grid gap-x-14 gap-y-10 lg:grid-cols-2" passo={0.04}>
          {RECUSAS.map((item) => (
            <RevelarItem key={item.recusa} className="border-t border-ouro/35 pt-6">
              <h3 className="text-lede leading-snug text-branco">{item.recusa}</h3>
              <p className="mt-3 text-legenda leading-relaxed text-ardosia-clara">{item.porque}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Na prática"
          titulo="Postura que não muda comportamento é decoração. Estas são as marcas visíveis."
        />

        <RevelarLista as="ul" className="mt-14 space-y-6" passo={0.04}>
          {NA_PRATICA.map((item) => (
            <RevelarItem as="li" key={item} className="flex gap-5">
              <span aria-hidden className="mt-3.5 h-px w-7 shrink-0 bg-ouro" />
              <p className="text-corpo leading-[1.6] text-navy">{item}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="gelo" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Quando dizemos não"
          titulo="Recusa é nomeada, não disfarçada."
          apoio={
            <p>
              Sem critérios de recusa escritos, uma firma aceita o cliente errado justamente quando
              está mais precisando de receita, e é aí que o dano é maior. Então eles ficam
              publicados.
            </p>
          }
        />

        <RevelarLista className="mt-14 space-y-px" passo={0.05}>
          {QUANDO_DIZEMOS_NAO.map((item) => (
            <RevelarItem
              key={item.recusa}
              className="grid gap-4 border-t border-navy/15 py-7 md:grid-cols-[1fr_1.3fr] md:gap-10"
            >
              <h3 className="text-corpo font-medium leading-snug text-navy">
                {item.recusa}
              </h3>
              <p className="text-legenda leading-relaxed text-ardosia">{item.porque}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      {/* ╔══ VAGA DE IMAGEM ═══════════════════════════════════════════
          ║ FOTO 06 + FOTO 10
          ║ Uma afirmação contestada, e a escrita à mão · proporção 16:10 e 16:9
          ║
          ║ A memória recusando uma alegação de autoridade menor. E o detalhe fechado de uma página de anotação real.
          ║
          ║ AQUI: as duas fecham o manifesto, e são a mesma crença em duas tecnologias: o que a casa escreve à mão antes de ligar a máquina, e o que a máquina recusa sozinha depois.
          ║
          ║ Registro: src/content/fotografia.ts. Plano: abba-ops,
          ║ 08-materiais/marca/plano-de-fotografia.md.
          ║ Nenhuma captura sai com dado de cliente: gere com
          ║ USE_MOCK_LLM=true, não borre.
          ╚═════════════════════════════════════════════════════════════ */}

      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <p className="font-mono text-rotulo uppercase tracking-[0.2em] text-ouro">
            O teste de qualquer material novo
          </p>
          <blockquote className="mt-8 font-display text-lede leading-[1.45] text-branco">
            “{PITCH.frameDaCasa}”
          </blockquote>
          <p className="mt-8 text-corpo text-ardosia-clara">
            Se um material não cabe nessa frase, ele não é da ABBA.
          </p>
          <div className="mt-11 flex justify-center">
            <Botao href="/analise" variante="primario-invertido">
              Ver o método em ação
            </Botao>
          </div>
        </Revelar>
      </Secao>
    </>
  );
}
