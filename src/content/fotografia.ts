/**
 * AS VAGAS DE IMAGEM DO SITE, ANTES DE EXISTIR IMAGEM.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Origem: abba-ops, 08-materiais/marca/plano-de-fotografia.md. Este arquivo
 * é a cópia operacional daquela lista, e a autoridade continua lá: se as
 * duas divergirem, o abba-ops está certo.
 *
 * POR QUE ISTO EXISTE ANTES DAS FOTOS.
 *
 * O site tem hoje uma imagem em `public/`, e ela é a marca. As oito
 * referências de desenho que a casa leu têm todas direção de arte com
 * imagem real. A distância entre o site de hoje e o que ele precisa ser é,
 * em boa parte, esta lista.
 *
 * Marcar as vagas primeiro resolve dois problemas de uma vez. O fotógrafo
 * recebe um briefing que diz onde cada tomada vai parar, em vez de uma lista
 * solta de ideias bonitas. E quem construir o componente de imagem depois
 * encontra as proporções já fechadas, em vez de inventar um corte e obrigar
 * a foto a obedecer o código.
 *
 * O COMPONENTE DE IMAGEM NÃO ESTÁ AQUI, E É DE PROPÓSITO. Componente que
 * nasce sem imagem fixa uma proporção por palpite. Ele entra quando os
 * arquivos existirem.
 *
 * A TRAVA QUE VALE PARA TODA CAPTURA: nenhuma sai com dado de cliente, e o
 * jeito certo não é borrar, é gerar. `USE_MOCK_LLM=true` mais um engajamento
 * de demonstração dá tela real com dado que não é de ninguém. Borrão diz ao
 * cético que havia algo ali, e a imagem vai parar dentro de um repositório
 * público.
 * ════════════════════════════════════════════════════════════════════════
 */

export interface VagaDeImagem {
  /** O identificador que aparece marcado no código, como `FOTO 01`. */
  readonly id: string;
  readonly lote: 1 | 2;
  readonly tomada: string;
  /** Proporção fechada no plano. O componente futuro obedece a ela. */
  readonly proporcao: string;
  /** O que precisa estar no quadro. É o briefing, literal. */
  readonly quadro: string;
  /**
   * Onde a imagem entra, por rota. `[]` quer dizer que a tomada existe no
   * plano e ainda não tem lugar no site de hoje: é honesto dizer isso em vez
   * de inventar uma seção para ela caber.
   */
  readonly rotas: readonly string[];
}

export const VAGAS_DE_IMAGEM = [
  {
    id: 'FOTO 01',
    lote: 1,
    tomada: 'A régua bloqueando uma frase',
    proporcao: '16:10',
    quadro:
      'O comando, a frase reprovada, o motivo e o código da doutrina. A casa impedindo a si mesma ' +
      'de exagerar, em código.',
    rotas: ['/', '/metodo'],
  },
  {
    id: 'FOTO 02',
    lote: 1,
    tomada: 'A métrica combinada antes',
    proporcao: '16:10',
    quadro:
      'O registro de uma decisão com o número-alvo e o humano nomeado, com o veredito ainda pendente.',
    rotas: ['/', '/metodo'],
  },
  {
    id: 'FOTO 03',
    lote: 1,
    tomada: 'O mesmo registro, medido depois',
    proporcao: '16:10',
    quadro:
      'A mesma decisão com resultado medido e assinatura. Par com a 02: é a prova inteira em duas telas.',
    rotas: ['/', '/programa'],
  },
  {
    id: 'FOTO 04',
    lote: 1,
    tomada: 'O ledger de evidências',
    proporcao: '16:10',
    quadro:
      'A página do relatório em que toda fonte aparece com id, provedor, confiança e citação literal.',
    rotas: ['/assessment-gratuito'],
  },
  {
    id: 'FOTO 05',
    lote: 1,
    tomada: 'A fila da manhã',
    proporcao: '16:10',
    quadro: 'As verdades que expiram, os gatilhos vencidos, as afirmações contestadas.',
    rotas: ['/conselheiro'],
  },
  {
    id: 'FOTO 06',
    lote: 1,
    tomada: 'Uma afirmação contestada',
    proporcao: '16:10',
    quadro:
      'Uma alegação de autoridade menor recusada contra verdade de autoridade maior. A memória se defendendo.',
    rotas: ['/conselheiro', '/manifesto'],
  },
  {
    id: 'FOTO 07',
    lote: 2,
    tomada: 'Os dois sócios, meio corpo',
    proporcao: '4:5',
    quadro:
      'Os dois, em conversa de trabalho, olhando um para o outro ou para a mesma tela. Não para a câmera.',
    rotas: ['/contato'],
  },
  {
    id: 'FOTO 08',
    lote: 2,
    tomada: 'Cada sócio, isolado',
    proporcao: '1:1',
    quadro: 'Retrato de três quartos, para a página de sócios e para o perfil.',
    /* Sem rota: o site de hoje não tem página de sócios, e a outra
       destinação da tomada é perfil de rede social, que não é o site.
       Inventar uma seção para a foto caber seria a foto mandando no site. */
    rotas: [],
  },
  {
    id: 'FOTO 09',
    lote: 2,
    tomada: 'A mesa em uso',
    proporcao: '3:2',
    quadro:
      'Caderno aberto com anotação de verdade, caneta, a tela ao fundo desfocada. Mão pode aparecer.',
    rotas: ['/metodo'],
  },
  {
    id: 'FOTO 10',
    lote: 2,
    tomada: 'A escrita à mão',
    proporcao: '16:9',
    quadro:
      'Detalhe fechado de uma página de anotação real. É a imagem que diz "aqui se pensa antes de ligar a máquina".',
    rotas: ['/manifesto'],
  },
  {
    id: 'FOTO 11',
    lote: 2,
    tomada: 'Brasília, sem cartão-postal',
    proporcao: '21:9',
    quadro: 'A cidade como contexto de trabalho, não como monumento. Sem Congresso, sem pôr do sol.',
    rotas: ['/contato'],
  },
] as const satisfies readonly VagaDeImagem[];
