import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { TituloDeSecao } from '@/components/marketing/Titulo';
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
        titulo="Marca não é logo nem headline. É o conjunto de coisas que uma empresa faz de um jeito e não do outro."
        apoio={
          <p>
            De forma tão consistente que o cliente consegue prever. Esta é a lista — e ela muda com
            decisão registrada, não com conveniência de proposta.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao sobretitulo="O que acreditamos" titulo="Sete convicções." />

        <RevelarLista className="mt-16 space-y-px" passo={0.06}>
          {CRENCAS.map((crenca) => (
            <RevelarItem
              as="article"
              key={crenca.numero}
              className="grid gap-5 border-t border-navy-700/15 py-9 md:grid-cols-[4rem_1fr] md:gap-10"
            >
              <p className="nums font-display text-[2rem] leading-none text-gold-700">
                {String(crenca.numero).padStart(2, '0')}
              </p>
              <div>
                <h2 className="text-[1.3rem] leading-snug text-navy-700">{crenca.titulo}</h2>
                <p className="mt-4 max-w-3xl text-[1.02rem] leading-[1.7] text-slate-700">
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

        <RevelarLista className="mt-16 grid gap-x-14 gap-y-10 lg:grid-cols-2" passo={0.06}>
          {RECUSAS.map((item) => (
            <RevelarItem key={item.recusa} className="border-t border-gold-500/35 pt-6">
              <h3 className="text-[1.1rem] leading-snug text-ice-100">{item.recusa}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-ice-200/70">{item.porque}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="claro" espaco="amplo">
        <TituloDeSecao
          sobretitulo="Na prática"
          titulo="Postura que não muda comportamento é decoração. Estas são as marcas visíveis."
        />

        <RevelarLista as="ul" className="mt-14 space-y-6" passo={0.06}>
          {NA_PRATICA.map((item) => (
            <RevelarItem as="li" key={item} className="flex gap-5">
              <span aria-hidden className="mt-3.5 h-px w-7 shrink-0 bg-gold-500" />
              <p className="text-[1.08rem] leading-[1.6] text-navy-700">{item}</p>
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
              está mais precisando de receita — e é aí que o dano é maior. Então eles ficam
              publicados.
            </p>
          }
        />

        <RevelarLista className="mt-14 space-y-px" passo={0.07}>
          {QUANDO_DIZEMOS_NAO.map((item) => (
            <RevelarItem
              key={item.recusa}
              className="grid gap-4 border-t border-navy-700/15 py-7 md:grid-cols-[1fr_1.3fr] md:gap-10"
            >
              <h3 className="text-[1.06rem] font-medium leading-snug text-navy-700">
                {item.recusa}
              </h3>
              <p className="text-[0.96rem] leading-relaxed text-slate-600">{item.porque}</p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="navy-profundo" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-500">
            O teste de qualquer material novo
          </p>
          <blockquote className="mt-8 font-display text-[1.5rem] leading-[1.45] text-ice-100 sm:text-[2rem]">
            “{PITCH.frameDaCasa}”
          </blockquote>
          <p className="mt-8 text-[1rem] text-ice-200/65">
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
