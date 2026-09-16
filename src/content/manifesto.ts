import type { Crenca, Recusa } from './tipos';

/**
 * O manifesto — a postura da casa.
 * Origem: abba-ops/00-identidade/manifesto.md (íntegra das seções externas).
 *
 * Publicar o manifesto no site é uma decisão de posicionamento: uma empresa
 * que vende prova precisa deixar por escrito o que recusa. A lista de
 * recusas é o que torna a lista de promessas crível.
 */

export const CRENCAS = [
  {
    numero: 1,
    titulo: 'O problema da IA nas empresas não é técnico.',
    texto:
      'A tecnologia está pronta e é acessível. O que falha é a adoção: pessoas, processos, decisão, responsabilidade. ' +
      'A maior parte do valor mora ali, e é ali que ninguém trabalha.',
  },
  {
    numero: 2,
    titulo: 'Não existe resultado sem número combinado antes.',
    texto:
      'Um projeto que começa sem métrica de sucesso acordada não pode dar certo, porque não existe definição do que seria ' +
      '“certo”. Registrar a decisão com métrica antes de começar não é burocracia: é a intervenção que mais move o resultado.',
  },
  {
    numero: 3,
    titulo: 'A IA gera; o humano assina; a diretoria decide.',
    texto:
      'Modelo centauro, sem exceção. Nenhum documento nosso chega ao cliente sem passar por um par de olhos humanos que ' +
      'responde por ele com o próprio nome.',
  },
  {
    numero: 4,
    titulo: 'Memória vale mais que talento isolado.',
    texto:
      'Um consultor bom responde bem à pergunta de hoje. Uma memória que acumula responde à pergunta de hoje com o que ' +
      'aprendeu nos últimos dois anos naquela empresa, e não vai embora quando alguém troca de emprego.',
  },
  {
    numero: 5,
    titulo: 'Auditabilidade é um recurso, não um custo.',
    texto:
      'Guardamos a linha do tempo inteira: o que se acreditava, quando, com base em quê, e quem decidiu. Quando o regulador, ' +
      'o conselho ou o próprio cliente perguntar, a resposta existe.',
  },
  {
    numero: 6,
    titulo: 'Nosso sucesso é o cliente precisar menos de nós no operacional.',
    texto:
      'Instalamos capacidade. Se ao final do programa a empresa depende da ABBA para operar, nós falhamos: mesmo que o ' +
      'contrato continue.',
  },
  {
    numero: 7,
    titulo: 'Prevemos onde há base para prever, e dizemos onde não há.',
    texto:
      'Declaramos probabilidade com nome em cada recomendação e mantemos o placar do nosso próprio acerto. E recusamos, por ' +
      'escrito, prever o que a evidência diz que a IA prevê mal: mudança de regime, cauda, “o que acontece se fizermos X”. ' +
      'Num mercado onde todos prometem prever, publicar o limite é o que torna o resto crível.',
  },
] as const satisfies readonly Crenca[];

export const RECUSAS = [
  {
    recusa: 'Prometer acurácia onde só medimos coerência',
    porque: 'Vender um número que não temos destrói a única coisa que não se recompra: credibilidade técnica.',
  },
  {
    recusa: 'Piloto sem métrica',
    porque: 'É a receita documentada do fracasso. Aceitar é vender uma derrota com nota fiscal.',
  },
  {
    recusa: 'Slide sem caminho até produção',
    porque: 'Estratégia que não chega a rodar é entretenimento caro.',
  },
  {
    recusa: 'Ser o dono da decisão do cliente',
    porque:
      'Recomendamos com convicção e assinamos a recomendação. Quem decide é quem responde pela empresa.',
  },
  {
    recusa: 'Cruzar dado entre clientes',
    porque:
      'Um cérebro por cliente, segregado. Só o agregado anonimizado circula, e com piso de privacidade escrito no código.',
  },
  {
    recusa: 'Apagar histórico',
    porque:
      'Nada se deleta fora do caminho sancionado, que emite certificado. Verdade que some não era verdade.',
  },
  {
    recusa: 'Prever mudança de regime e contrafactual causal',
    porque:
      'A evidência é dura: modelos mais capazes preveem pior em séries com quebra de regime, e “o que acontece se fizermos X” ' +
      'está fora do alcance. Vender isso é ser desmentido pelo primeiro trimestre ruim.',
  },
  {
    recusa: 'Preço 100% por resultado',
    porque: 'Vira disputa de atribuição, não parceria.',
  },
] as const satisfies readonly Recusa[];

/** As marcas visíveis: postura que não muda comportamento é decoração. */
export const NA_PRATICA = [
  'Toda proposta nossa tem uma seção do que não vamos fazer. Escopo sem limite é escopo sem preço.',
  'Todo documento nosso declara o próprio limite. O Mapa de Vazamento diz que foi calculado de fora.',
  'Todo número nosso tem premissa citada, ou não é publicado.',
  'O que deu errado entra no relatório, na mesma tipografia do que deu certo.',
  'Recusa é nomeada, não disfarçada. Quando não somos a escolha certa, dizemos qual condição falta.',
  'Ninguém da ABBA fala “a IA decidiu”. A IA rascunhou; alguém assinou.',
] as const;

/** Quando dizemos não. Publicar isso qualifica melhor que qualquer formulário. */
export const QUANDO_DIZEMOS_NAO = [
  {
    recusa: 'Não há patrocinador na diretoria',
    porque:
      'O trabalho é de mudança organizacional. Sem mandato, a adoção morre na capacitação e a culpa fica com a gente.',
  },
  {
    recusa: 'Querem piloto sem métrica de sucesso definida antes',
    porque:
      'É a causa nº 1 de fracasso medida pela RAND. Aceitar é vender uma derrota.',
  },
  {
    recusa: 'Querem terceirizar a decisão, não aprender a decidir',
    porque:
      'Nosso modelo é centauro: a IA gera, o humano assina. Quem quer a decisão terceirizada compra outra coisa.',
  },
  {
    recusa: 'Um só cliente passaria de 30% da nossa receita sem plano de diluição',
    porque: 'É um ponto de não-retorno que declaramos por escrito antes de acontecer.',
  },
] as const satisfies readonly Recusa[];
