import type { Pergunta } from './tipos';

/**
 * As perguntas que a ABBA realmente ouve.
 * Origem: abba-ops/03-comercial/kit-de-presenca.md ("as quatro objeções que
 * sempre vêm") + objecao-diretor-de-ia.md.
 *
 * ────────────────────────────────────────────────────────────────────────
 * POR QUE ESTAS RESPOSTAS ESTÃO PÚBLICAS, E NÃO GUARDADAS PARA A REUNIÃO.
 *
 * Objeção respondida no site é objeção que não consome os primeiros dez
 * minutos da conversa. Mais importante: publicar a resposta difícil — "não
 * temos histórico" — é a coisa que mais separa a ABBA de quem promete média
 * de mercado. O kit de presença diz, com todas as letras, que mentir sobre
 * isso é o único erro irrecuperável. Então não se mente, e não se esconde.
 *
 * REGRA: nenhuma resposta aqui pode conter número fora do cânone
 * (content/evidencias.ts). A régua do revisor varre este arquivo como varre
 * todo o resto.
 * ────────────────────────────────────────────────────────────────────────
 */

export const PERGUNTAS = [
  {
    pergunta: 'Já temos gente de TI e de dados fazendo isso. Onde vocês entram?',
    resposta:
      'A gente não substitui ninguém. Eles constroem — e no melhor dos casos constroem bem. O que costuma faltar é o registro que prova para a diretoria que valeu: métrica combinada antes, medida depois, assinada por gente de dentro. Isso não é trabalho de TI, e por definição não pode ser feito por quem executou.',
  },
  {
    pergunta: 'Já temos um diretor de IA — vocês não se aplicam a nós?',
    resposta:
      'Pelo contrário: isso coloca vocês na frente, e ele é o nosso melhor interlocutor. Duas perguntas honestas para ele: o que foi medido no último trimestre, e quantas pessoas existem para a fila de casos que ele já mapeou? Estratégia de IA é dele. O que não dá para comprar dentro de casa é braço de construção em escala e prova de terceiro — e é só isso que a gente vende.',
  },
  {
    pergunta: 'Vocês já fizeram isso em quantas empresas?',
    resposta:
      'Somos novos como firma, e não vou inventar média de mercado. O que dá para mostrar é o método e o sistema por trás dele, que estão prontos e testados, e o registro de tudo que a gente decidir junto — incluindo o que der errado, na mesma tipografia do que der certo. Para quem está comprando prova, isso costuma valer mais que um portfólio que ninguém pode auditar.',
  },
  {
    pergunta: 'Quanto custa?',
    resposta:
      'A contratação é em dois tempos, num documento só. A fase 1 é firme e pequena — alçada de um diretor — e entrega, em seis semanas, um caso construído com dados reais e medido contra métrica combinada por escrito. O ano inteiro entra no mesmo termo já precificado, mas como opção condicionada ao Portão da Prova. Os valores vão na proposta, depois da conversa: preço fora de contexto vira comparação com a coisa errada.',
  },
  {
    pergunta: 'O Mapa de Vazamento é gratuito mesmo? Qual é a pegadinha?',
    resposta:
      'É gratuito e não tem contrapartida. Na versão web, o resultado aparece antes de qualquer formulário — cadastro obrigatório é uma forma de cobrança. A versão completa é feita depois de uma conversa de 45 minutos e de uma pesquisa nossa, e continua sem custo. O que a gente ganha com isso é a chance de mostrar como trabalhamos antes de você pagar por qualquer coisa.',
  },
  {
    pergunta: 'E se a gente quiser sair no meio?',
    resposta:
      'Sai, e sem multa. São três portões ao longo do ano, e o primeiro é na semana 6. Quem sai nele pagou a fase 1 e leva tudo: o caso rodando, o número medido e o portfólio priorizado completo. O portão retém execução, nunca informação. A porta de saída limpa é argumento de venda, não concessão.',
  },
  {
    pergunta: 'Vocês usam os nossos dados para treinar alguma coisa?',
    resposta:
      'Não. Um cérebro por cliente, segregado, sem cruzamento entre clientes. Só circula agregado anonimizado, e com piso de privacidade escrito no código, não em política. Nada se apaga fora do caminho sancionado, que emite certificado — e isso vale inclusive contra a gente: verdade que some não era verdade.',
  },
  {
    pergunta: 'Vocês são uma auditoria de IA?',
    resposta:
      'Não, e a distinção importa. Funciona como uma auditoria — ninguém dispensa o auditor por ter CFO —, mas auditor em sentido estrito não pode construir nem treinar o que audita, e nós construímos e treinamos. O que somos é a camada independente de prova: a métrica é combinada antes com um humano nomeado do seu lado, quem valida o número é gente sua, e se vocês quiserem certificação formal, o certificador é um terceiro acreditado. Nunca nós.',
  },
] as const satisfies readonly Pergunta[];
