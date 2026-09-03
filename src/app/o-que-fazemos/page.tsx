import Link from 'next/link';
import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { ALINHAMENTO, CAMINHOS, FASES } from '@/content/caminhos';
import { PRECO_PUBLICO, REGRAS_DE_INVESTIMENTO } from '@/content/precos';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'O que fazemos',
  descricao:
    'Três caminhos e três fases: o Mapa de Vazamento gratuito, o Programa AI Native · Ano 1, e o Conselheiro de IA. ' +
    'Como a ABBA instala capacidade e prova o que mudou.',
  caminho: '/o-que-fazemos',
});

export default function PaginaOQueFazemos() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Modelo de serviço"
        titulo="Não vendemos cardápio. Vendemos um programa que instala capacidade e prova o que ela mudou."
        apoio={
          <p>
            Não treinamento. Não ferramenta. Não piloto solto que morre em slide. Três caminhos, e
            só três, porque atendem a três situações diferentes — e a primeira é de graça.
          </p>
        }
      />

      <Secao tom="claro" espaco="amplo">
        <RevelarLista className="space-y-px" passo={0.1}>
          {CAMINHOS.map((caminho) => (
            <RevelarItem
              as="article"
              key={caminho.id}
              className="grid gap-8 border-t border-navy-700/15 py-12 lg:grid-cols-[16rem_1fr] lg:gap-16"
            >
              <div>
                <p className="nums font-mono text-[0.72rem] tracking-[0.2em] text-gold-700">
                  Caminho {String(caminho.ordem).padStart(2, '0')}
                </p>
                <h2 className="mt-4 text-[1.7rem] leading-tight text-navy-700">{caminho.nome}</h2>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-500">
                  {caminho.chamada}
                </p>
              </div>

              <div>
                <p className="text-[1.08rem] leading-[1.7] text-navy-700">{caminho.descricao}</p>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-slate-600">
                  <span className="font-medium text-navy-700">Para quem. </span>
                  {caminho.paraQuem}
                </p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {caminho.itens.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.94rem] leading-relaxed text-slate-600">
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={caminho.href}
                  className="mt-8 inline-flex items-center gap-2 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-navy-700 underline-offset-4 transition-colors hover:text-gold-700 hover:underline"
                >
                  {caminho.cta.texto} →
                </Link>
              </div>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="O Programa por dentro"
          titulo="Doze meses em três fases, cada uma com um portão de saída."
          apoio={
            <p>
              A estrutura existe para tratar o seu risco por desenho, não por promessa: a entrada é
              pequena e firme, o investimento maior só anda com o caso medido na mesa, e sair nunca
              custa multa.
            </p>
          }
        />

        <RevelarLista className="mt-16 grid gap-10 lg:grid-cols-3" passo={0.11}>
          {FASES.map((fase) => (
            <RevelarItem
              as="article"
              key={fase.id}
              className="flex flex-col border-t border-gold-500/40 pt-7"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold-400">
                {fase.rotulo} · {fase.janela}
              </p>
              <h3 className="mt-4 text-[1.5rem] leading-tight text-ice-100">{fase.nome}</h3>
              <p className="mt-5 text-[0.98rem] leading-[1.7] text-ice-200/80">{fase.promessa}</p>

              <ul className="mt-6 space-y-2.5">
                {fase.entregaveis.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9rem] leading-relaxed text-ice-300/70">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold-500/70" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-7 font-mono text-[0.78rem] leading-relaxed text-gold-400/90">
                {fase.portao.nome}: {fase.portao.regra}
              </p>
            </RevelarItem>
          ))}
        </RevelarLista>
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
          titulo="Como o dinheiro é combinado — e o que a gente nunca faz com ele."
          apoio={
            PRECO_PUBLICO ? undefined : (
              <p>
                Os valores vão na proposta, não no site: o Termo do Programa é feito depois da
                conversa, e um preço fora de contexto vira comparação com a coisa errada. As regras,
                essas, valem sempre e estão aqui.
              </p>
            )
          }
        />

        <RevelarLista className="mt-14 grid gap-x-14 gap-y-9 sm:grid-cols-2" passo={0.08}>
          {REGRAS_DE_INVESTIMENTO.map((regra) => (
            <RevelarItem key={regra.titulo} className="border-t border-navy-700/15 pt-5">
              <h3 className="text-[1.08rem] font-medium leading-snug text-navy-700">
                {regra.titulo}
              </h3>
              <p className="mt-2.5 text-[0.94rem] leading-relaxed text-slate-600">{regra.texto}</p>
            </RevelarItem>
          ))}
        </RevelarLista>

        <Revelar className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Botao href="/analise">Começar pelo Mapa de Vazamento</Botao>
          <Botao href="/contato" variante="secundario">
            Falar com um sócio
          </Botao>
        </Revelar>
      </Secao>
    </>
  );
}
