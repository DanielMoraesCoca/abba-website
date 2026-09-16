import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDICE_PROIBIDO } from '@/content/evidencias';
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
