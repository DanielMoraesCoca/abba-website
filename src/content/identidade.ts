/**
 * Identidade da ABBA para consumo externo.
 * Origem: abba-ops/00-identidade/{posicionamento,manifesto,marca-e-nomenclatura}.md
 *
 * Este arquivo é a tradução literal daqueles documentos para o site. Se
 * divergirem, o abba-ops ganha. Não reescreva copy aqui sem mudar lá.
 */

export const EMPRESA = {
  nome: 'ABBA',
  assinatura: 'ABBA Consultoria de IA',
  dominio: 'abbaservices.com.br',
  site: 'https://abbaservices.com.br',
  email: 'contato@abbaservices.com.br',
  linkedin: 'https://www.linkedin.com/company/abbaservices',
  pais: 'Brasil',
  idioma: 'pt-BR',
} as const;

/**
 * A ABERTURA DA HOME: o problema de quem lê, antes de qualquer coisa nossa.
 *
 * ════════════════════════════════════════════════════════════════════════
 * O que abria a home era a `HEADLINE.titulo` daqui de baixo, e isso era um
 * uso que a régua da casa nunca autorizou. Aquela frase não é manchete: é o
 * TESTE DE PERTENCIMENTO do briefing (§1), a régua contra a qual todo
 * material novo é medido. "Se um material não cabe nessa frase, ele não é
 * da ABBA." Teste, não título. Ela continua no /manifesto exatamente nesse
 * papel, e agora fecha o passo 3 da home, onde responde a uma pergunta que
 * o leitor já tem.
 *
 * No lugar dela entra o passo 1 do argumento: não abrir falando da empresa.
 * ════════════════════════════════════════════════════════════════════════
 */
export const ABERTURA = {
  titulo: 'Você já tentou IA. O piloto não virou operação.',
  /** A palavra que vai na itálica de ênfase. Uma, e é a que carrega a frase. */
  enfase: 'operação',
  lede:
    'Três coisas chegaram juntas na sua mesa: a reforma tributária, que o seu financeiro já trata ' +
    'como obrigação; o jurídico usando ferramenta de IA que ninguém aprovou; e um piloto que ' +
    'funcionou na demonstração e não sobreviveu ao trimestre seguinte.',
  diagnostico:
    'Nenhuma das três é falta de tecnologia. As três são a mesma coisa: ninguém combinou, antes de ' +
    'começar, o que seria dar certo.',
} as const;

/**
 * A headline canônica: o teste de pertencimento.
 *
 * Não é manchete de home. Ver o comentário de `ABERTURA`, acima.
 */
export const HEADLINE = {
  titulo: 'Instalamos capacidade de IA, e provamos, de fora, o que ela mudou.',
  sub:
    'A ABBA faz o que não dá para fazer de dentro: avalia a fundo, constrói as soluções certas, ' +
    'treina todos os níveis da equipe, e prova o resultado como terceiro: número combinado antes, ' +
    'medido depois, assinado por gente.',
  corpo:
    'A nossa leitura é que a maior parte do valor de uma transformação de IA vive em pessoas, ' +
    'processo e cultura, e o mercado vende o resto. ' +
    'Nós instalamos o resto, com método próprio, plataforma própria e resultado verificado no final, ' +
    'num registro que a sua diretoria pode auditar.',
  /**
   * A tese dos 70/30 é convicção da casa, não estatística medida, e o site
   * diz isso em voz alta. É exatamente o tipo de honestidade que a base de
   * evidências exige (§ "O estatuto do 70/30").
   *
   * A nota deixou de falar em "os 70%" quando o numeral saiu da tela: citar
   * um número na ressalva de um parágrafo que não mostra número nenhum é
   * reintroduzir pela porta dos fundos exatamente o que a decisão tirou.
   */
  notaDaTese:
    'A leitura acima é tese da casa, não estudo. O que a gente cita com fonte é outra coisa: RAND, METR, DORA, BCG.',
} as const;

/** A prateleira: a primeira frase de qualquer peça diz o que não dá para fazer de dentro. */
export const PRATELEIRA = {
  titulo: 'A camada independente de prova, com músculo de execução',
  texto:
    'Estratégia de IA é do seu diretor. Duas coisas, por definição, não podem ser internas: ' +
    'construção em escala e prova de terceiro. É nelas que a ABBA entra: ao lado de quem já está lá dentro, ' +
    'nunca no lugar dele.',
  /**
   * A analogia com auditoria é permitida; a categoria é proibida
   * (marca-e-nomenclatura.md). Nunca escrever "somos a auditoria de IA".
   */
  analogia:
    'Funciona como uma auditoria: ninguém dispensa o auditor por ter CFO. A diferença é que também construímos e treinamos: ' +
    'e por isso a certificação, quando o cliente a quiser, é sempre de um terceiro acreditado, nunca nossa.',
} as const;

export const PITCH = {
  quinzeSegundos:
    'A gente faz duas coisas que não dá para fazer de dentro de uma empresa. A primeira é construir ' +
    'capacidade de IA em escala, com agentes, processos e o time inteiro treinado. A segunda é provar, ' +
    'como terceiro, o que mudou: número combinado antes, medido depois, assinado. Não é curso, não é ferramenta, não é piloto sem métrica.',
  frameDaCasa:
    'Instalamos capacidade de IA e provamos o que ela mudou: com número combinado antes e medido depois, assinado por gente.',
} as const;

export const CONTATO = {
  email: EMPRESA.email,
  prazoResposta: 'Todo contato é respondido em 24 horas úteis.',
  capacidade:
    'A nossa capacidade real é de 3 a 4 Programas novos por ano. Não é tática de escassez: é quantas ' +
    'empresas dois sócios conseguem atender sem baixar o padrão.',
} as const;
