import { CapaDePagina } from '@/components/marketing/CapaDePagina';
import { Revelar } from '@/components/motion/Revelar';
import { Secao } from '@/components/ui/Secao';
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
 * PENDÊNCIA JURÍDICA (docs/pendencias.md): este texto descreve com precisão
 * o que o site faz hoje, mas ainda não foi revisto por advogado, e a razão
 * social e o CNPJ da ABBA ainda não estão definidos. Antes do site ir ao ar,
 * um advogado revisa e os dados do controlador entram aqui.
 */
const BLOCOS = [
  {
    titulo: 'O que este site coleta',
    paragrafos: [
      'Se você preencher o formulário de contato ou pedir a conversa ao final da análise, coletamos o que você digitar: nome, cargo, e-mail, empresa, telefone e a mensagem. Só isso, e só porque você escreveu.',
      'As respostas da Análise ABBA são processadas para calcular o resultado e descartadas em seguida. Elas não são gravadas em banco de dados, não são associadas a você e não voltam em nenhuma conversa futura — a não ser que você mesmo as repita.',
    ],
  },
  {
    titulo: 'O que este site não faz',
    paragrafos: [
      'Não usamos cookie de rastreamento, pixel de rede publicitária, mapa de calor nem gravação de sessão. Não há script de terceiro carregando nesta página: a política de segurança de conteúdo do servidor bloqueia isso por configuração, não por promessa.',
      'Não vendemos, alugamos nem compartilhamos o seu contato com ninguém. Não colocamos você em lista de e-mail automática. Se você escrever, um sócio responde — é esse o fluxo inteiro.',
    ],
  },
  {
    titulo: 'Processamento por modelo de linguagem',
    paragrafos: [
      'A Análise ABBA usa um modelo de linguagem para escrever o texto de apoio ao redor do número. O que é enviado ao provedor do modelo são as suas respostas de múltipla escolha, o nome da empresa e o setor que você declarou — nada de contato, nada de dado pessoal.',
      'O número em si nunca passa pelo modelo: ele sai de uma conta aritmética no nosso servidor. Se a chamada ao modelo falhar, o site usa um texto preparado e o resultado sai igual.',
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
            Se algo aqui não estiver claro, é falha nossa — escreva e a gente reescreve.
          </p>
        }
        largura="estreita"
      />

      <Secao tom="claro" largura="estreita" espaco="amplo">
        <div className="space-y-14">
          {BLOCOS.map((bloco) => (
            <Revelar as="section" key={bloco.titulo}>
              <h2 className="text-xl leading-snug text-navy-700">{bloco.titulo}</h2>
              <div className="mt-5 space-y-4">
                {bloco.paragrafos.map((p) => (
                  <p key={p} className="text-base leading-[1.75] text-slate-700">
                    {p}
                  </p>
                ))}
              </div>
            </Revelar>
          ))}

          <Revelar as="section" className="border-t border-navy-700/15 pt-10">
            <h2 className="text-xl leading-snug text-navy-700">Como falar com a gente</h2>
            <p className="mt-5 text-base leading-[1.75] text-slate-700">
              Qualquer pedido sobre os seus dados vai para{' '}
              <a
                href={`mailto:${EMPRESA.email}`}
                className="text-teal-600 underline-offset-4 hover:underline"
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
