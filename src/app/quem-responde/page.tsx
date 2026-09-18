import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Enfase, TituloDeSecao } from '@/components/marketing/Titulo';
import { Revelar, RevelarItem, RevelarLista } from '@/components/motion/Revelar';
import { Botao } from '@/components/ui/Botao';
import { Secao } from '@/components/ui/Secao';
import { EMPRESA } from '@/content/identidade';
import {
  BIO_DA_CASA,
  RESUMO_PARA_BUSCA,
  SOCIOS,
  SOCIOS_PUBLICOS,
  esperandoAprovacao,
  faltaPreencher,
} from '@/content/socios';
import { metadadosDaPagina } from '@/lib/seo';

/**
 * QUEM RESPONDE: a única prova humana que a trava 4 deixa de pé.
 *
 * ════════════════════════════════════════════════════════════════════════
 * POR QUE A PÁGINA EXISTE (decisão V5o, abba-ops).
 *
 * O site não tem caso de cliente, nem depoimento, nem logo, e não vai ter
 * enquanto não houver aprovação nominal por escrito. Essa é a trava 4 e ela
 * está certa. A consequência é que o site inteiro ficou sem NENHUMA prova
 * humana, e quem abre este site quase sempre foi indicado por alguém: está
 * conferindo quem são estas pessoas. Uma casa cujo argumento é "assinado por
 * gente", sem gente, é uma contradição que o leitor sente antes de saber
 * nomear.
 *
 * POR QUE O NOME É ESTE.
 *
 * Não é "Sobre nós", não é "Quem somos", não é "Nossa história": bio de
 * consultoria genérica está na lista do que já cansou, e o nome tinha que
 * sair do que a página PROVA, como saíram /evidencias e /manifesto.
 *
 * E não é "Quem assina", que era o candidato óbvio, porque essa frase já tem
 * dono no site e o dono não é a ABBA. O briefing §10.11 é explícito: quem
 * assina o resultado medido é um humano NOMEADO DO CLIENTE, e é isso que
 * torna a prova independente. Usar a mesma palavra aqui faria a página dizer
 * o contrário do que a casa vende, com as mesmas letras.
 *
 * "Quem responde" é a outra metade e não colide: do lado do cliente alguém
 * assina o veredito; deste lado, duas pessoas respondem pelo trabalho. É o
 * mesmo verbo que o manifesto já usa em "quem decide é quem responde pela
 * empresa".
 *
 * A PÁGINA PERTENCE AO PASSO 4, por que dá para confiar. Não é seção
 * institucional solta e não entra no menu como categoria própria: chega-se a
 * ela pelo passo 4 da home, que é onde a pergunta existe.
 *
 * ENQUANTO `SOCIOS_PUBLICOS` FOR FALSO, a rota existe e não é linkada de
 * lugar nenhum, não entra no mapa do site, e pede para não ser indexada. Os
 * buracos aparecem na tela de propósito: é para os sócios lerem a página de
 * verdade antes de aprovar, e não uma versão de rascunho em outro lugar.
 * ════════════════════════════════════════════════════════════════════════
 */

export const metadata = {
  ...metadadosDaPagina({
    titulo: 'Quem responde',
    /* O resumo vem de content/socios.ts, e não está escrito aqui, para a
       varredura da trava alcançá-lo junto com as bios. Ele é lido no
       resultado de busca e na prévia de link, por quem talvez nunca abra a
       página, e é o primeiro campo que uma passada de SEO mexe. */
    descricao: RESUMO_PARA_BUSCA,
    caminho: '/quem-responde',
  }),
  /* Não indexar enquanto as bios não tiverem o ok dos sócios. Nome de pessoa
     em material externo é porta de uma via: o buscador guarda, o arquivo da
     web guarda, e desfazer não desfaz. */
  ...(SOCIOS_PUBLICOS ? {} : { robots: { index: false, follow: false } }),
};

export default function PaginaQuemResponde() {
  const pendencias = [...faltaPreencher(), ...esperandoAprovacao()];

  return (
    <>
      <CapaDePagina
        sobretitulo="Passo 04 · por que dá para confiar"
        titulo={
          <>
            Duas pessoas respondem por isto, e elas têm <Enfase>nome</Enfase>.
          </>
        }
        apoio={
          <p>
            Este site não tem caso de cliente, nem depoimento, nem logo. É regra da casa, e ela vale
            enquanto não houver aprovação por escrito de quem é citado. O que sobra como prova
            humana são as duas pessoas que assinam o trabalho, e elas estão aqui.
          </p>
        }
      />

      {pendencias.length > 0 && (
        /* O aviso é para os sócios, e some sozinho quando os buracos forem
           preenchidos. Ele fica em vermelho de alerta e não na paleta da
           marca de propósito: isto não é desenho de página, é uma nota de
           produção que não pode ser confundida com conteúdo. */
        <Secao tom="gelo" espaco="curto">
          <Revelar>
            <p className="font-mono text-rotulo uppercase tracking-[0.2em] text-alerta">
              Rascunho · não publicado
            </p>
            <p className="mt-4 max-w-2xl text-corpo leading-[1.7] text-navy">
              Esta página não está linkada em lugar nenhum do site e pede para não ser indexada.
              Pendente: {pendencias.join(' · ')}. As duas linhas saíram da matriz de chapéus e
              esperam o ok dos sócios. Depois disso, publicar é trocar
              <code className="mx-1.5 font-mono text-legenda">SOCIOS_PUBLICOS</code>
              para verdadeiro em <code className="font-mono text-legenda">content/socios.ts</code>.
            </p>
          </Revelar>
        </Secao>
      )}

      <Secao tom="claro" espaco="amplo">
        <RevelarLista className="grid gap-x-16 gap-y-14 lg:grid-cols-2" passo={0.08}>
          {SOCIOS.map((socio) => (
            <RevelarItem as="article" key={socio.id} className="border-t border-navy/15 pt-7">
              {/* ╔══ VAGA DE IMAGEM ═══════════════════════════════════════════
                  ║ FOTO 08
                  ║ Cada sócio, isolado · proporção 1:1
                  ║
                  ║ Retrato de três quartos.
                  ║
                  ║ AQUI: um por sócio, acima do nome. A tomada 08 ficou sem
                  ║ destino enquanto o site não tinha onde pôr rosto. Esta é
                  ║ a página que a decisão V5o criou para ela, e o corte 1:1
                  ║ do plano é o que cabe nesta grade de duas colunas.
                  ║
                  ║ A LEGENDA SEGUE A MESMA TRAVA DA BIO: nada de cargo de
                  ║ origem, nada de empresa de terceiro, nem nomeada nem
                  ║ gesticulada. Ver o cabeçalho de content/socios.ts. O
                  ║ texto alternativo diz o nome e o papel na ABBA, e nada
                  ║ mais.
                  ║
                  ║ Registro: src/content/fotografia.ts. Plano: abba-ops,
                  ║ 08-materiais/marca/plano-de-fotografia.md.
                  ║ Nenhuma captura sai com dado de cliente: gere com
                  ║ USE_MOCK_LLM=true, não borre.
                  ╚═════════════════════════════════════════════════════════════ */}
              <h2 className="text-secao leading-[1.12] text-navy">{socio.nome}</h2>
              <p className="mt-5 max-w-[46ch] text-corpo leading-[1.7] text-navy">{socio.linha}</p>
              <p className="mt-5 max-w-[46ch] text-legenda leading-relaxed text-ardosia">
                {BIO_DA_CASA}
              </p>
            </RevelarItem>
          ))}
        </RevelarLista>
      </Secao>

      <Secao tom="navy" espaco="amplo">
        <TituloDeSecao
          invertido
          sobretitulo="O que responder significa aqui"
          titulo={
            <>
              Não é disponibilidade. É a mesma pessoa na semana 1 e no mês{' '}
              <Enfase>doze</Enfase>.
            </>
          }
          apoio={
            <p>
              A ABBA tem capacidade para três a quatro Programas novos por ano, e isso não é tática
              de escassez: é aritmética de agenda de dois sócios. Quem combina a métrica na semana 1
              é quem senta na reunião em que o resultado é lido.
            </p>
          }
        />

        <Revelar className="mt-14 max-w-2xl border-l-2 border-ouro pl-7">
          <p className="text-corpo leading-[1.7] text-ardosia-clara">
            O que a casa recusa também tem nome. Quando a resposta certa é “hoje não somos a
            escolha para vocês”, ela é dita por uma destas duas pessoas, na conversa, e a condição
            que falta é nomeada junto.
          </p>
        </Revelar>
      </Secao>

      <Secao tom="claro" largura="estreita" espaco="amplo">
        <Revelar className="text-center">
          <h2 className="text-secao leading-[1.2] text-navy">
            A conversa é com uma destas duas pessoas.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-corpo leading-[1.7] text-ardosia">
            Não existe equipe de vendas entre você e elas, e não existe funil. Um e-mail chega
            direto.
          </p>
          <div className="mt-10 flex justify-center">
            <Botao href={`mailto:${EMPRESA.email}`}>Escrever para um sócio</Botao>
          </div>
          <p className="mt-8 font-mono text-rotulo leading-relaxed tracking-[0.02em] text-ardosia">
            {EMPRESA.email}
          </p>
        </Revelar>
      </Secao>
    </>
  );
}
