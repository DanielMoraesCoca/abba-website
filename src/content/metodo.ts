import type { Dimensao } from './tipos';

/**
 * O método — as 25 dimensões em 9 grupos, e as sete camadas de leitura.
 * Origem: assessment-brain/src/framework/framework.js (o framework canônico).
 *
 * ────────────────────────────────────────────────────────────────────────
 * O QUE ENTRA NO SITE E O QUE NÃO ENTRA.
 * O framework é o IP da casa. O site publica a ESTRUTURA — os grupos e o
 * nome de cada dimensão — porque estrutura demonstra profundidade e não se
 * copia com proveito. As "killer questions" de cada dimensão, que são o
 * instrumento de fato, NÃO sobem: ficam no framework.js e na sala com o
 * cliente. Se algum dia alguém quiser publicá-las, é decisão de sócio
 * registrada, não edição de arquivo.
 * ────────────────────────────────────────────────────────────────────────
 */

export const CAMADAS = [
  { num: 1, nome: 'Missão', pergunta: 'Para que esta empresa existe, de fato?' },
  { num: 2, nome: 'Economia', pergunta: 'Como ela realmente ganha dinheiro?' },
  { num: 3, nome: 'Operação', pergunta: 'Como o trabalho realmente flui?' },
  { num: 4, nome: 'Rupturas', pergunta: 'Onde o trabalho quebra, atrasa ou vaza valor?' },
  { num: 5, nome: 'Ativos ocultos', pergunta: 'O que a empresa sabe e não usa?' },
  { num: 6, nome: 'Pontos cegos', pergunta: 'O que ela não sabe e deveria saber?' },
  {
    num: 7,
    nome: 'Visão',
    pergunta: 'Como esta empresa seria se fosse construída hoje, do zero, com IA?',
  },
] as const;

export const PRINCIPIO_DO_ORGANISMO = {
  titulo: 'Uma empresa não é uma máquina. É um organismo.',
  texto:
    'Quando se introduz IA numa organização, não se está instalando software — está se fazendo cirurgia. O organismo reage: ' +
    'adapta ou rejeita, e compensa de formas inesperadas. Às vezes a ineficiência que você quer automatizar é o sistema ' +
    'imunológico: remova-a e a empresa fica mais rápida, mas perde a capacidade de detectar problemas.',
  corolario:
    'A arquitetura técnica segue a arquitetura política, nunca o contrário. A melhor solução falha se ameaçar o poder da pessoa errada.',
} as const;

export const DIMENSOES = [
  {
    grupo: 'Fundação estratégica',
    itens: ['O DNA da empresa', 'O vão entre a visão de IA e o que ela faz', 'Inteligência competitiva'],
  },
  {
    grupo: 'Realidade operacional',
    itens: [
      'Como a empresa realmente funciona',
      'Topologia do fluxo de informação',
      'O território das exceções',
      'O imposto da coordenação',
      'Sazonalidade e ritmo',
      'O mapa de latência',
    ],
  },
  {
    grupo: 'Tecnologia e integração',
    itens: ['O parque tecnológico', 'Gravidade de integração'],
  },
  {
    grupo: 'Inteligência financeira',
    itens: ['O mapa do dinheiro', 'A linha de base de medição'],
  },
  {
    grupo: 'Arquitetura de decisão',
    itens: ['O mapa de decisões', 'Análise dos modos de falha'],
  },
  {
    grupo: 'Pessoas e conhecimento',
    itens: ['A realidade das pessoas', 'A taxa de decaimento do conhecimento', 'Estrutura de poder e política'],
  },
  {
    grupo: 'Cliente e confiança',
    itens: ['A experiência do cliente', 'A arquitetura da confiança'],
  },
  {
    grupo: 'Dados e conformidade',
    itens: ['Ativos de dados ocultos', 'Risco e conformidade'],
  },
  {
    grupo: 'Prontidão para o futuro',
    itens: ['O precipício da escalabilidade', 'A dimensão ética', 'Construir hoje ou amanhã'],
  },
] as const satisfies readonly Dimensao[];

export const TOTAL_DIMENSOES = DIMENSOES.reduce((soma, g) => soma + g.itens.length, 0);

/** O protocolo de prova, em quatro regras publicáveis. */
export const PROTOCOLO_DE_PROVA = [
  {
    titulo: 'A métrica é combinada antes',
    texto:
      'Antes de construir qualquer coisa, a métrica de sucesso vai para o papel — com um humano nomeado do lado do cliente ' +
      'que responde por ela.',
  },
  {
    titulo: 'Quem valida o número é gente do cliente',
    texto:
      'Não somos nós que declaramos o resultado. A validação é assinada por alguém de dentro, com nome e cargo.',
  },
  {
    titulo: 'O sistema tem trava contra maquiar o próprio placar',
    texto:
      'Probabilidade declarada não pode ser reescrita depois da medição, e previsão feita após o resultado é bloqueada. ' +
      'A trava é código, não promessa.',
  },
  {
    titulo: 'Certificação, quando houver, é de terceiro',
    texto:
      'Se o cliente quiser certificação formal — ISO 42001, por exemplo — o certificador é um terceiro acreditado. Nunca nós. ' +
      'É essa separação de papéis que nos permite construir, treinar e provar sem conflito.',
  },
] as const;
