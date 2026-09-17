import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDICE_PROIBIDO } from '@/content/evidencias';
import { VAGAS_DE_IMAGEM } from '@/content/fotografia';
import { EMPRESA } from '@/content/identidade';

/**
 * A RÉGUA DO REVISOR, aplicada ao código.
 *
 * O abba-ops tem uma régua que bloqueia material externo com número
 * proibido ou vocabulário errado. Um site é material externo que muda
 * sozinho, então a régua precisa rodar no CI — senão a primeira pressa
 * introduz o "95% dos pilotos falham" numa headline e ninguém percebe.
 *
 * Este teste varre o conteúdo e as páginas atrás de:
 *   1. números do índice proibido (base-de-evidencias.md §2)
 *   2. vocabulário banido (posicionamento.md — "não dizer / dizer")
 *   3. URL que não seja abbaservices.com.br
 *   4. e-mail de contato fora do oficial
 *
 * A varredura olha só o que o VISITANTE lê: comentários são removidos antes
 * da checagem, porque é dentro deles que as regras ficam documentadas — um
 * comentário dizendo "nunca escrever X" não é uma violação, é a própria
 * régua. E ignora `content/evidencias.ts` e a página que os publica, que
 * precisam citar os números proibidos para poder proibi-los.
 */

const RAIZ = new URL('../../src', import.meta.url).pathname;

/** Publicam os números proibidos como lista de banidos — precisam citá-los. */
const ISENTOS = new Set(['src/content/evidencias.ts', 'src/app/evidencias/page.tsx']);

/**
 * Isentos SÓ da checagem de vocabulário: o prompt da narrativa lista os
 * adjetivos de consultoria justamente para proibi-los ao modelo. A checagem
 * de números continua valendo para estes arquivos.
 */
const ISENTOS_DE_VOCABULARIO = new Set(['src/lib/analise/narrativa.ts']);

/**
 * Remove comentários antes da varredura. O `(?<!:)` no comentário de linha
 * evita cortar a partir do "//" de uma URL.
 */
function semComentarios(fonte: string): string {
  return fonte.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(?<!:)\/\/[^\n]*/g, ' ');
}

function arquivos(dir: string, acumulado: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) {
      arquivos(caminho, acumulado);
    } else if (/\.(ts|tsx)$/.test(entrada)) {
      acumulado.push(caminho);
    }
  }
  return acumulado;
}

function relativo(caminho: string): string {
  const i = caminho.indexOf('/src/');
  return i === -1 ? caminho : caminho.slice(i + 1);
}

const ARQUIVOS = arquivos(RAIZ)
  .map((caminho) => ({
    caminho: relativo(caminho),
    texto: semComentarios(readFileSync(caminho, 'utf8')),
  }))
  .filter(({ caminho }) => !ISENTOS.has(caminho));

/**
 * Vocabulário banido. Origem: posicionamento.md, tabela "não dizer / dizer".
 * As palavras escolhem o comprador: vocabulário de treinamento coloca a
 * oferta no orçamento de RH; vocabulário de instalação a coloca no
 * orçamento da diretoria.
 */
const VOCABULARIO_BANIDO: readonly { padrao: RegExp; porque: string }[] = [
  { padrao: /\bcurso de IA\b/i, porque: 'diga "instalação de capacidade de IA"' },
  { padrao: /\bsomos a auditoria\b/i, porque: 'a categoria "auditoria" é proibida; a analogia é permitida' },
  { padrao: /\bauditamos\b/i, porque: 'nunca dizer que auditamos — somos camada independente de prova' },
  { padrao: /\bnossos alunos\b/i, porque: 'diga "participantes" ou "campeões"' },
  { padrao: /\bcertificado de curso\b/i, porque: 'diga "certificação de capacidade" ou "graduação"' },
  { padrao: /\bAI Concierge\b/i, porque: 'o guia do portal se chama Iris, e só' },
  { padrao: /\bassessment-brain\b/i, porque: 'nome interno de ferramenta não aparece para cliente' },
  { padrao: /\babba-portal\b/i, porque: 'diga "Plataforma ABBA"' },
  { padrao: /\bdisruptiv/i, porque: 'o tom da casa é concreto: número, prazo, nome' },
  { padrao: /\brevolucionári/i, porque: 'idem' },
];

describe('índice proibido de números', () => {
  it.each(INDICE_PROIBIDO.map((i) => [i.rotulo, i.padrao] as const))(
    'nenhum arquivo do site contém %s',
    (rotulo, padrao) => {
      const ofensores = ARQUIVOS.filter(({ texto }) => padrao.test(texto)).map((a) => a.caminho);
      expect(
        ofensores,
        `Número banido encontrado (${rotulo}). Veja abba-ops/00-identidade/base-de-evidencias.md §2.`,
      ).toEqual([]);
    },
  );
});

describe('vocabulário', () => {
  it.each(VOCABULARIO_BANIDO.map((v) => [v.padrao.source, v.padrao, v.porque] as const))(
    'nenhum arquivo usa /%s/',
    (_fonte, padrao, porque) => {
      const ofensores = ARQUIVOS.filter(
        ({ caminho, texto }) => !ISENTOS_DE_VOCABULARIO.has(caminho) && padrao.test(texto),
      ).map((a) => a.caminho);
      expect(ofensores, `Vocabulário fora do padrão: ${porque}.`).toEqual([]);
    },
  );
});

describe('domínio único', () => {
  it('não existe URL de plataforma no código', () => {
    const ofensores = ARQUIVOS.filter(({ texto }) =>
      /https?:\/\/[\w.-]*\.(vercel\.app|netlify\.app|herokuapp\.com)/i.test(texto),
    ).map((a) => a.caminho);
    expect(
      ofensores,
      'Regra da marca: URLs só em abbaservices.com.br. Nunca URL de plataforma em material externo.',
    ).toEqual([]);
  });

  it('o único e-mail de contato citado é o oficial', () => {
    const encontrados = new Set<string>();
    for (const { texto } of ARQUIVOS) {
      for (const achado of texto.matchAll(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)) {
        const email = achado[0].toLowerCase();
        // O co-autor dos commits e endereços de exemplo em comentário não contam.
        if (email.endsWith('abbaservices.com.br')) encontrados.add(email);
      }
    }
    expect([...encontrados]).toEqual([EMPRESA.email]);
  });
});

/**
 * A FAIXA EM REAIS CONTINUA DESLIGADA.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A aritmética da faixa não foi apagada: ela está em
 * `lib/analise/faixa-suspensa.ts`, provada pelos testes de
 * `modelo.test.ts`, esperando uma decisão dos sócios. O cabeçalho de lá
 * explica a decisão inteira.
 *
 * O risco de guardar código bom e desligado é óbvio: alguém importa "só
 * para ver", e a cifra volta ao ar sem que ninguém tenha decidido nada. É
 * um acidente de uma linha, e uma cifra em reais sobre a empresa de quem lê
 * é justamente o que a peça deixou de publicar.
 *
 * Então a porta fica trancada por teste. Se este falhar, a pergunta não é
 * como fazer o teste passar: é quem decidiu religar a faixa, e se as três
 * condições do briefing (a conta na mesma tela, a origem declarada, e nunca
 * chamar aquilo de diagnóstico) estão cumpridas.
 * ──────────────────────────────────────────────────────────────────────── */
describe('a faixa em reais permanece suspensa', () => {
  const SUPERFICIE = ARQUIVOS.filter(
    ({ caminho }) => caminho.startsWith('src/app/') || caminho.startsWith('src/components/'),
  );

  it('nenhuma página nem componente importa a aritmética suspensa', () => {
    const ofensores = SUPERFICIE.filter(({ texto }) => /faixa-suspensa/.test(texto)).map(
      (a) => a.caminho,
    );
    expect(
      ofensores,
      'A faixa em reais está suspensa por decisão de produto (briefing de marca §10.1).',
    ).toEqual([]);
  });

  it('nenhuma página nem componente formata reais', () => {
    const ofensores = SUPERFICIE.filter(({ texto }) =>
      /\bR\$\s*\{|formatarReais|formatarFaixa/.test(texto),
    ).map((a) => a.caminho);
    expect(
      ofensores,
      'Esta peça não publica cifra em reais sobre a empresa de quem lê.',
    ).toEqual([]);
  });
});

/**
 * A MARCA APOSENTADA NÃO VOLTA.
 *
 * ────────────────────────────────────────────────────────────────────────
 * O logo antigo da ABBA era um cérebro, e ele foi aposentado. Depois disso
 * ele reapareceu três vezes, sempre disfarçado da mesma forma: uma malha de
 * nós ligados por linhas. Na capa da home, como constelação em canvas. Na
 * home inteira, como faixa de grafo entre seções. No cartão social e no
 * ícone da aba, como SVG desenhado à mão.
 *
 * Os três eram bem-feitos, e é por isso que sobreviveram: ninguém olha um
 * favicon durante o trabalho, e um cartão social só aparece depois que o
 * link já foi colado em algum lugar. O briefing §10.3 é explícito: a
 * constelação de nós e linhas É o logo de cérebro em outra forma, a régua
 * de imagem reprova circuito, e a marca da casa é o NOME, escrito, sem
 * símbolo.
 *
 * Este teste fecha a porta pelo lado de fora. Se ele falhar, a pergunta não
 * é como fazê-lo passar: é quem desenhou um grafo de novo, e onde.
 *
 * O que NÃO é violação, e por isso a contagem tem folga: a Convergência tem
 * um ponto no encontro de três linhas, e a Linha do Programa tem um ponto
 * por portão. São diagramas de um argumento e de um calendário, não a
 * marca.
 * ──────────────────────────────────────────────────────────────────────── */
describe('o grafo aposentado', () => {
  const TETO_DE_PONTOS = 4;

  it('nenhum arquivo do site desenha uma malha de nós', () => {
    const ofensores = ARQUIVOS.filter(({ texto }) => {
      const pontos = (texto.match(/<circle/g) ?? []).length;
      return pontos > TETO_DE_PONTOS;
    }).map((a) => a.caminho);

    expect(
      ofensores,
      'A marca da ABBA é o nome escrito, sem símbolo. Nada de nós e linhas.',
    ).toEqual([]);
  });

  it('o ícone da aba é a letra, não o grafo', () => {
    const icone = readFileSync(join(RAIZ, 'app/icon.svg'), 'utf8');
    expect(icone, 'o ícone voltou a ser um grafo de nós').not.toMatch(/<circle/);
    expect(icone, 'o ícone precisa carregar a letra da marca').toMatch(/>A</);
  });

  it('o cartão social não desenha nada além de tipografia', () => {
    const og = readFileSync(join(RAIZ, 'lib/og.tsx'), 'utf8');
    expect(og, 'o cartão social voltou a desenhar um grafo').not.toMatch(/<circle|<line\b/);
  });
});

/**
 * A DOUTRINA DO MOVIMENTO REDUZIDO, TRANCADA.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A regra da casa é que `prefers-reduced-motion` mora no CSS, num lugar só.
 * `scrollIntoView({ behavior: 'smooth' })` é a única API que fura isso: o
 * `behavior` do JavaScript vence o `scroll-behavior` do CSS, e a regra de
 * mídia não alcança a chamada.
 *
 * O furo já aconteceu uma vez, em três chamadas do assistente da Primeira
 * Leitura, e passou por trinta auditorias de acessibilidade: o defeito só
 * existe em tempo de execução, sob uma preferência do sistema que nem o axe
 * nem o Lighthouse simulam.
 *
 * Então a porta é uma só, `lib/rolagem.ts`, e este teste guarda a porta.
 * ──────────────────────────────────────────────────────────────────────── */
describe('movimento reduzido', () => {
  it('ninguém pede rolagem suave direto, fora da porta única', () => {
    const ofensores = ARQUIVOS.filter(
      ({ caminho, texto }) =>
        caminho !== 'src/lib/rolagem.ts' && /behavior:\s*['"]smooth['"]/.test(texto),
    ).map((a) => a.caminho);

    expect(
      ofensores,
      'Use `rolarAte()` de lib/rolagem.ts: ela respeita prefers-reduced-motion, que o CSS não alcança aqui.',
    ).toEqual([]);
  });

  it('a porta única consulta a preferência antes de rolar', () => {
    const porta = readFileSync(join(RAIZ, 'lib/rolagem.ts'), 'utf8');
    expect(porta).toMatch(/prefers-reduced-motion/);
  });
});

/**
 * AS VAGAS DE IMAGEM NÃO PODEM SE PERDER DO PLANO.
 *
 * ────────────────────────────────────────────────────────────────────────
 * O site tem hoje uma imagem, e ela é a marca. As onze tomadas do plano de
 * fotografia (abba-ops) já têm lugar marcado no código, e o comentário de
 * cada vaga é o que o fotógrafo e o chapéu Tecnologia vão receber como
 * briefing: o que precisa estar no quadro, em que proporção, e por que ali.
 *
 * Marcador é comentário, e comentário apodrece calado. Entre marcar a vaga
 * e a foto existir vão semanas, e no meio delas alguém refatora uma página.
 * Este teste é o que impede a vaga de sumir sem ninguém perceber, e impede o
 * caminho contrário: um marcador citando uma tomada que saiu do plano.
 *
 * Ele lê o arquivo CRU, sem tirar comentário, porque aqui o comentário é o
 * conteúdo. É a exceção da varredura, e é o motivo de ela existir à parte.
 * ──────────────────────────────────────────────────────────────────────── */
describe('as vagas de imagem', () => {
  const PAGINAS = arquivos(RAIZ)
    .filter((c) => relativo(c).startsWith('src/app/'))
    .map((c) => ({ caminho: relativo(c), cru: readFileSync(c, 'utf8') }));

  const comLugar = VAGAS_DE_IMAGEM.filter((v) => v.rotas.length > 0);

  it.each(comLugar.map((v) => [v.id, v.tomada] as const))(
    '%s (%s) está marcada em alguma página',
    (id) => {
      const onde = PAGINAS.filter((p) => p.cru.includes(id)).map((p) => p.caminho);
      expect(
        onde.length,
        `Nenhuma página marca ${id}. O plano diz onde ela entra; se a página mudou, mova o marcador em vez de apagá-lo.`,
      ).toBeGreaterThan(0);
    },
  );

  it('nenhum marcador cita uma tomada que não está no plano', () => {
    const conhecidos = new Set<string>(VAGAS_DE_IMAGEM.map((v) => v.id));
    const orfaos: string[] = [];

    for (const { caminho, cru } of PAGINAS) {
      for (const achado of cru.matchAll(/║ (FOTO \d{2})(?: \+ (FOTO \d{2}))?/g)) {
        for (const id of [achado[1], achado[2]]) {
          if (id && !conhecidos.has(id)) orfaos.push(`${caminho}: ${id}`);
        }
      }
    }

    expect(orfaos, 'Marcador aponta para tomada fora do registro.').toEqual([]);
  });

  it('tomada sem rota não aparece marcada em página nenhuma', () => {
    /* Hoje todas as onze têm destino: a FOTO 08, os retratos individuais,
       era a única sem, e a decisão V5o resolveu isso criando a página que
       faltava em vez de descartar a tomada. O teste fica porque o caso volta
       a acontecer: a próxima tomada nova nasce sem lugar, e `rotas: []` é a
       resposta honesta enquanto ninguém decidir onde ela entra. O que não
       pode é existir marcador para uma vaga que se declara sem destino. */
    const semLugar: readonly { id: string; rotas: readonly string[] }[] = VAGAS_DE_IMAGEM;
    for (const vaga of semLugar) {
      if (vaga.rotas.length > 0) continue;
      expect(
        PAGINAS.some((p) => p.cru.includes(vaga.id)),
        `${vaga.id} se declara sem destino e mesmo assim está marcada numa página.`,
      ).toBe(false);
    }
  });
});
