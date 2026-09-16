import type { Caminho, Fase } from './tipos';

/**
 * Os 3 caminhos e as 3 fases.
 * Origem: abba-ops/00-identidade/modelo-de-servico.md (canônico · V5).
 *
 * Vocabulário travado (marca-e-nomenclatura.md): "Mapa de Vazamento",
 * "AI Native · Ano 1", "Assinatura da Capacidade", "Exame Anual de IA",
 * "Portão da Prova", "Conselheiro de IA". Nunca "curso", nunca "módulo",
 * nunca "auditamos".
 */

export const CAMINHOS = [
  {
    id: 'mapa-de-vazamento',
    ordem: 1,
    nome: 'Mapa de Vazamento',
    chamada: 'Gratuito. A porta única de entrada.',
    descricao:
      'Uma análise da sua empresa feita só com informação pública, com a primeira página em reais: ' +
      'a faixa que estimamos estar saindo sem precisar sair, o vetor por onde ela sai e as premissas com fonte. ' +
      'Foi calculado de fora, e a gente diz isso na primeira linha.',
    paraQuem: 'Para qualquer empresa que queira ver o método antes de pagar por ele.',
    itens: [
      'Uma faixa em reais, nunca um número exato',
      'O vetor principal: por onde o dinheiro sai',
      'Três premissas numeradas, cada uma com a fonte citada',
      'As perguntas que só você pode responder, e que mudariam a estimativa',
      'O limite honesto declarado: o que não foi olhado',
    ],
    href: '/mapa-de-vazamento',
    cta: { texto: 'Começar a análise gratuita', href: '/analise' },
  },
  {
    id: 'programa',
    ordem: 2,
    nome: 'O Programa · AI Native · Ano 1',
    chamada: '12 meses, 3 fases, 3 portões de saída sem multa.',
    descricao:
      'A instalação completa: diagnóstico focado onde o dinheiro vaza, um caso construído com dados reais e medido ' +
      'contra métrica combinada por escrito, os casos aprovados em produção, a organização capacitada em turma nomeada ' +
      'com fluência medida em 30/60/90 dias, e a operação sob acordo de nível de serviço.',
    paraQuem: 'Para a empresa de médio porte que quer capacidade instalada, não mais um piloto.',
    itens: [
      'Fase 1 firme e pequena; o ano inteiro como opção',
      'Métrica de sucesso combinada por escrito na semana 1',
      'Entregável nomeado em todos os meses',
      'Relatório mensal: projetado × realizado',
      'Saída limpa em cada portão: quem sai leva tudo',
    ],
    href: '/programa',
    cta: { texto: 'Ver como o Programa funciona', href: '/programa' },
  },
  {
    id: 'conselheiro',
    ordem: 3,
    nome: 'Conselheiro de IA',
    chamada: 'A cadeira de direção estratégica, fracionária, do seu lado da mesa.',
    descricao:
      'Para a empresa que já tem IA rodando e precisa de direção e de prova independente, não de instalação. ' +
      'Uma cadeira fracionária com memória que melhora a cada ciclo: o que se acreditava, quando, com base em quê, ' +
      'e quem decidiu.',
    paraQuem: 'Para quem já construiu, já investiu, e precisa saber se aquilo está funcionando.',
    itens: [
      'Direção estratégica com probabilidade declarada e placar do próprio acerto',
      'Memória bitemporal: o histórico não se apaga, se corrige com nota datada',
      'Ritual trimestral em que os objetivos da diretoria dirigem o plano',
      'Prova independente do que já está no ar',
    ],
    href: '/conselheiro',
    cta: { texto: 'Conhecer o Conselheiro', href: '/conselheiro' },
  },
] as const satisfies readonly Caminho[];

export const FASES = [
  {
    id: 'fase-1',
    rotulo: 'Fase 1',
    nome: 'A Prova',
    janela: 'Semanas 1 a 6',
    promessa:
      'Sair da semana 6 com um caso rodando, um número medido e a fila inteira de oportunidades priorizada: ' +
      'independentemente de você seguir com a gente.',
    entregaveis: [
      'Diagnóstico focado nos processos onde o dinheiro vaza',
      'Métrica de sucesso combinada por escrito na semana 1, com humano nomeado do seu lado',
      'Um caso construído com dados reais e medido contra essa métrica',
      'O portfólio priorizado completo de oportunidades',
    ],
    portao: {
      nome: 'Portão da Prova',
      regra:
        'Semana 6: saída limpa, sem multa. Quem sai leva tudo. O portão retém execução, nunca informação.',
    },
  },
  {
    id: 'fase-2',
    rotulo: 'Fase 2',
    nome: 'A Construção',
    janela: 'Meses 2 a 6',
    promessa:
      'Os casos aprovados entram em produção e a organização aprende a operá-los, com fluência medida, não declarada.',
    entregaveis: [
      'Protótipo validado → decisão GO/NO-GO da diretoria com números na mesa',
      'Agentes sob medida com aprovação humana, em nuvem ou no seu servidor',
      'Plano executivo com arquitetura, sequência e orçamento',
      'Turma nomeada, com kickoff, semanas definidas e graduação',
      'Fluência medida em 30, 60 e 90 dias',
    ],
    portao: {
      nome: 'Portão 2',
      regra: 'Mês 6: revisão formal com a diretoria. Saída com aviso, sem multa.',
    },
  },
  {
    id: 'fase-3',
    rotulo: 'Fase 3',
    nome: 'A Durabilidade',
    janela: 'Meses 7 a 12',
    promessa:
      'A prova que janela curta não dá: a capacidade sobrevivendo sem a gente no operacional.',
    entregaveis: [
      'Operação sob acordo de nível de serviço',
      'Ligação semanal de 20 minutos: a cadência, não o contrato, é o que prende',
      'Relatório mensal: projetado × realizado',
      'Diário decisão → resultado, auditável pela sua diretoria',
      'O primeiro Exame Anual de IA e a conversa de renovação 30 dias antes do fim',
    ],
    portao: {
      nome: 'Fecho do Ano 1',
      regra:
        'A partir do ano 2, a Assinatura da Capacidade: operação, conselho trimestral e a re-medição anual comparada ano contra ano.',
    },
  },
] as const satisfies readonly Fase[];

/** A constante que atravessa as três fases. */
export const ALINHAMENTO = {
  titulo: 'O alinhamento com a diretoria não é uma fase',
  texto:
    'É o sistema de direção que atravessa tudo: resultados medidos contra os objetivos declarados pela sua diretoria → ' +
    'recomendação da ABBA, assinada → decisão do cliente → registro. Nós recomendamos com convicção. Quem decide é quem ' +
    'responde pela empresa.',
} as const;
