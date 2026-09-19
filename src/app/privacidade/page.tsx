import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Revelar } from '@/components/motion/Revelar';
import { Secao } from '@/components/ui/Secao';
import { CONTROLADOR, faltaNoControlador } from '@/content/controlador';
import { EMPRESA } from '@/content/identidade';
import { metadadosDaPagina } from '@/lib/seo';

export const metadata = metadadosDaPagina({
  titulo: 'Privacidade',
  descricao:
    'O que este site coleta, o que ele não coleta, e o que a ABBA faz com o que você envia. Em português claro.',
  caminho: '/privacidade',
});

/**
 * Política de privacidade em linguagem direta.
 *
 * ────────────────────────────────────────────────────────────────────────
 * PENDÊNCIA JURÍDICA (docs/pendencias.md), e ela tem duas metades com
 * urgências diferentes:
 *
 *   A revisão de advogado pode vir depois do ar. O texto descreve com
 *   precisão o que o site faz, e o que falta é conferência profissional,
 *   não correção de fato.
 *
 *   A identificação do controlador NÃO pode. Quem exerce um direito precisa
 *   saber contra quem exerce, e até aqui esta página falava em "a gente" e
 *   "nós" com um e-mail no fim. O bloco existe agora e lê de
 *   `content/controlador.ts`: quando o CNPJ sair, publicar é preencher três
 *   campos.
 *
 * Enquanto os campos estiverem vazios a página MOSTRA o buraco, e
 * `npm run pronto` recusa o lançamento. Esconder seria pior que a ausência.
 * ──────────────────────────────────────────────────────────────────────── */
const BLOCOS = [
  {
    titulo: 'O que este site coleta',
    paragrafos: [
      'Se você preencher o formulário de contato ou pedir a conversa ao final da análise, coletamos o que você digitar: nome, cargo, e-mail, empresa, telefone e a mensagem. Só isso, e só porque você escreveu.',
      'As respostas da Primeira Leitura são processadas para calcular o resultado e descartadas em seguida. Elas não são gravadas em banco de dados, não são associadas a você e não voltam em nenhuma conversa futura, a não ser que você mesmo as repita.',
    ],
  },
  {
    titulo: 'O que este site não faz',
    paragrafos: [
      'Não usamos cookie de rastreamento, pixel de rede publicitária, mapa de calor nem gravação de sessão. Não há script de terceiro carregando nesta página: a política de segurança de conteúdo do servidor bloqueia isso por configuração, não por promessa.',
      'Não vendemos, alugamos nem compartilhamos o seu contato com ninguém. Não colocamos você em lista de e-mail automática. Se você escrever, um sócio responde: é esse o fluxo inteiro.',
    ],
  },
  {
    titulo: 'Processamento por modelo de linguagem',
    paragrafos: [
      'A Primeira Leitura usa um modelo de linguagem para escrever o texto de apoio em volta da leitura. O que é enviado ao provedor do modelo são as suas respostas de múltipla escolha, o nome da empresa e o setor que você declarou: nada de contato, nada de dado pessoal.',
      'A leitura em si nunca passa pelo modelo: ela sai de uma regra escrita no nosso servidor. Se a chamada ao modelo falhar, o site usa um texto preparado e o resultado sai igual. E a página não publica número nenhum sobre a sua empresa.',
    ],
  },
  {
    titulo: 'Por quanto tempo guardamos',
    paragrafos: [
      'O seu contato fica registrado no funil comercial da ABBA enquanto a conversa estiver viva, e por até 24 meses depois do último contato. Passado isso, ele é apagado.',
      'A qualquer momento você pode pedir para ver, corrigir ou apagar o que temos sobre você. Escreva para o e-mail abaixo e a solicitação é atendida em até 15 dias.',
    ],
  },
  {
    titulo: 'Dados de cliente em engajamento',
    paragrafos: [
      'Esta página trata do site. Documento e dado de cliente contratado seguem regra própria e mais restrita, definida em contrato: um repositório segregado por cliente, sem cruzamento entre clientes, com caminho de exclusão que emite certificado. Nada é apagado fora desse caminho.',
    ],
  },
] as const;

export default function PaginaPrivacidade() {
  return (
    <>
      <CapaDePagina
        sobretitulo="Privacidade"
        titulo="O que este site coleta, o que ele não coleta, e o que fazemos com isso."
        apoio={
          <p>
            Sem parágrafo de trinta linhas e sem “podemos compartilhar com parceiros selecionados”.
            Se algo aqui não estiver claro, é falha nossa: escreva e a gente reescreve.
          </p>
        }
        largura="estreita"
      />

      <Secao tom="claro" largura="estreita" espaco="amplo">
        <div className="space-y-14">
          {BLOCOS.map((bloco) => (
            <Revelar as="section" key={bloco.titulo}>
              <h2 className="text-lede leading-snug text-navy">{bloco.titulo}</h2>
              <div className="mt-5 space-y-4">
                {bloco.paragrafos.map((p) => (
                  <p key={p} className="text-corpo leading-[1.75] text-ardosia">
                    {p}
                  </p>
                ))}
              </div>
            </Revelar>
          ))}

          <Revelar as="section" className="border-t border-navy/15 pt-10">
            <h2 className="text-lede leading-snug text-navy">Quem é o controlador</h2>
            <p className="mt-5 text-corpo leading-[1.75] text-ardosia">
              O controlador dos dados tratados neste site é{' '}
              <strong className="font-medium text-navy">{CONTROLADOR.razaoSocial}</strong>, inscrita
              no CNPJ sob o número{' '}
              <span className="nums font-medium text-navy">{CONTROLADOR.cnpj}</span>. Os pedidos dos
              titulares são respondidos por{' '}
              <strong className="font-medium text-navy">{CONTROLADOR.encarregado}</strong>, pelo
              e-mail abaixo.
            </p>
            {faltaNoControlador().length > 0 && (
              /* Visível, e não escondido: a página está no ar sem um dado que
                 a lei pede, e quem abrir precisa ver isso, inclusive nós. O
                 aviso some sozinho quando os campos forem preenchidos. */
              <p className="mt-5 font-mono text-rotulo uppercase leading-relaxed tracking-[0.12em] text-alerta">
                Falta preencher: {faltaNoControlador().join(' · ')}
              </p>
            )}
          </Revelar>

          <Revelar as="section" className="border-t border-navy/15 pt-10">
            <h2 className="text-lede leading-snug text-navy">Como falar com a gente</h2>
            <p className="mt-5 text-corpo leading-[1.75] text-ardosia">
              Qualquer pedido sobre os seus dados vai para{' '}
              <a
                href={`mailto:${EMPRESA.email}`}
                className="text-navy underline-offset-4 hover:underline"
              >
                {EMPRESA.email}
              </a>
              .
            </p>
          </Revelar>
        </div>
      </Secao>
    </>
  );
}
