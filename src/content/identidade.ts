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

/** A headline canônica. Vale para site, deck e conversa. */
export const HEADLINE = {
  titulo: 'Instalamos capacidade de IA, e provamos, de fora, o que ela mudou.',
  sub:
    'A ABBA faz o que não dá para fazer de dentro: avalia a fundo, constrói as soluções certas, ' +
    'treina todos os níveis da equipe, e prova o resultado como terceiro — número combinado antes, ' +
    'medido depois, assinado por gente.',
  corpo:
    'A nossa leitura é que a maior parte do valor de uma transformação em IA — algo perto de 70% — ' +
    'vive em pessoas, processos e cultura. O seu fornecedor te vendeu os outros 30%. ' +
    'Nós instalamos o resto, com método próprio, plataforma própria e resultado verificado no final, ' +
    'num registro que a sua diretoria pode auditar.',
  /**
   * A tese dos 70/30 é convicção da casa, não estatística medida — e o site
   * diz isso em voz alta. É exatamente o tipo de honestidade que a base de
   * evidências exige (§ "O estatuto do 70/30").
   */
  notaDaTese:
    'Os 70% são a nossa tese, não um estudo. O que citamos com fonte é outra coisa: RAND, METR, DORA, BCG.',
} as const;

/** A prateleira: a primeira frase de qualquer peça diz o que não dá para fazer de dentro. */
export const PRATELEIRA = {
  titulo: 'A camada independente de prova, com músculo de execução',
  texto:
    'Estratégia de IA é do seu diretor. Duas coisas, por definição, não podem ser internas: ' +
    'construção em escala e prova de terceiro. É nelas que a ABBA entra — ao lado de quem já está lá dentro, ' +
    'nunca no lugar dele.',
  /**
   * A analogia com auditoria é permitida; a categoria é proibida
   * (marca-e-nomenclatura.md). Nunca escrever "somos a auditoria de IA".
   */
  analogia:
    'Funciona como uma auditoria: ninguém dispensa o auditor por ter CFO. A diferença é que também construímos e treinamos — ' +
    'e por isso a certificação, quando o cliente a quiser, é sempre de um terceiro acreditado, nunca nossa.',
} as const;

export const PITCH = {
  quinzeSegundos:
    'A gente faz duas coisas que não dá para fazer de dentro de uma empresa: constrói capacidade de IA em escala — ' +
    'agentes, processos, time inteiro treinado — e prova, como terceiro, o que mudou: número combinado antes, ' +
    'medido depois, assinado. Não é curso, não é ferramenta, não é piloto sem métrica.',
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
