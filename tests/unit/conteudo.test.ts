import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { EVIDENCIAS, evidencia } from '@/content/evidencias';
import { EMPRESA } from '@/content/identidade';
import { DIMENSOES, TOTAL_DIMENSOES } from '@/content/metodo';
import { NAV_PRINCIPAL, NAV_RODAPE } from '@/content/navegacao';
import { PERGUNTAS } from '@/content/perguntas';
import { TOTAL_DE_PERGUNTAS, esquemaRespostas } from '@/lib/analise/schema';
import { colar } from '@/lib/tipografia';
import { PRECO_PUBLICO } from '@/content/precos';

describe('cânone de evidências', () => {
  it('todo número tem fonte nomeada, ano e nível de confiança', () => {
    for (const item of EVIDENCIAS) {
      expect(item.fonte.length, `evidência ${item.id} sem fonte`).toBeGreaterThan(10);
      expect(item.ano).toBeGreaterThan(2015);
      expect(['alta', 'media-alta', 'media']).toContain(item.confianca);
    }
  });

  it('confiança abaixo de alta obriga ressalva declarada', () => {
    for (const item of EVIDENCIAS) {
      if (item.confianca === 'media') {
        expect(item.ressalva, `evidência ${item.id} é média e não traz ressalva`).toBeTruthy();
      }
    }
  });

  it('os identificadores são únicos', () => {
    const ids = EVIDENCIAS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('citar um número que não está no cânone falha alto e cedo', () => {
    // @ts-expect-error — o tipo já impede; o teste garante o comportamento em runtime.
    expect(() => evidencia('numero-inventado')).toThrow(/não existe no cânone/i);
  });
});

describe('o framework é o IP', () => {
  it('publica 25 dimensões, o número canônico', () => {
    expect(TOTAL_DIMENSOES).toBe(25);
  });

  it('publica nove grupos', () => {
    expect(DIMENSOES).toHaveLength(9);
  });

  it('não publica as perguntas de cada dimensão — só a estrutura', () => {
    // As "killer questions" são o instrumento; se aparecerem aqui, o IP
    // vazou para o site. Uma pergunta traz "?", um nome de dimensão não.
    for (const grupo of DIMENSOES) {
      for (const item of grupo.itens) {
        expect(item).not.toContain('?');
      }
    }
  });
});

describe('preço', () => {
  it('continua fora do ar até decisão de sócio (porta de uma via)', () => {
    // Este teste não impede a publicação: ele obriga quem publicar a mudar
    // o teste no mesmo commit, deixando a decisão no histórico do git.
    expect(PRECO_PUBLICO).toBe(false);
  });
});

describe('navegação', () => {
  it('todo link interno começa com barra', () => {
    const todos = [...NAV_PRINCIPAL, ...Object.values(NAV_RODAPE).flat()];
    for (const item of todos) {
      expect(item.href.startsWith('/'), `${item.rotulo} aponta para ${item.href}`).toBe(true);
    }
  });

  it('os três caminhos apontam para páginas que existem na navegação ou na vitrine', () => {
    const conhecidos = new Set([
      ...NAV_PRINCIPAL.map((i) => i.href),
      ...Object.values(NAV_RODAPE).flat().map((i) => i.href),
    ]);
    for (const caminho of CAMINHOS) {
      expect(conhecidos.has(caminho.href), `${caminho.nome} → ${caminho.href}`).toBe(true);
    }
  });
});

describe('estrutura do Programa', () => {
  it('tem três fases, cada uma com portão de saída nomeado', () => {
    expect(FASES).toHaveLength(3);
    for (const fase of FASES) {
      expect(fase.portao.nome.length).toBeGreaterThan(3);
      expect(fase.entregaveis.length).toBeGreaterThan(2);
    }
  });

  it('nenhum portão menciona multa como custo de sair', () => {
    for (const fase of FASES) {
      expect(fase.portao.regra).not.toMatch(/com multa/i);
    }
  });
});

describe('marca', () => {
  it('o domínio e o e-mail oficiais são os do abba-ops', () => {
    expect(EMPRESA.dominio).toBe('abbaservices.com.br');
    expect(EMPRESA.email).toBe('contato@abbaservices.com.br');
    expect(EMPRESA.site).toBe('https://abbaservices.com.br');
  });
});

describe('perguntas frequentes', () => {
  it('toda resposta é substantiva — nada de recheio de busca', () => {
    // A régua é sobre a RESPOSTA. A primeira versão deste teste também
    // exigia perguntas longas e reprovou "Quanto custa?", que é a melhor
    // pergunta da página justamente por ser curta. Padding de copy para
    // satisfazer um limite arbitrário é o teste mandando no conteúdo.
    for (const p of PERGUNTAS) {
      // Interrogação de verdade: estas entradas viram Question/Answer no
      // JSON-LD, e uma afirmação no lugar da pergunta é marcação errada.
      // As objeções chegam como afirmação na sala; aqui elas viram a
      // pergunta que estava por trás.
      expect(p.pergunta.trim().endsWith('?'), p.pergunta).toBe(true);
      expect(p.resposta.length, p.pergunta).toBeGreaterThan(120);
    }
  });

  it('a pergunta difícil está publicada, e a resposta não finge portfólio', () => {
    const historico = PERGUNTAS.find((p) => /quantas empresas/i.test(p.pergunta));
    expect(historico, 'a pergunta sobre histórico não pode sumir do site').toBeTruthy();
    expect(historico!.resposta).toMatch(/novos como firma/i);
    expect(historico!.resposta).not.toMatch(/dezenas|centenas|líder de mercado/i);
  });

  it('nenhuma resposta se declara auditoria', () => {
    for (const p of PERGUNTAS) {
      expect(p.resposta).not.toMatch(/somos (a|uma) auditoria/i);
    }
  });
});

/**
 * As cores escritas à mão no `global-error`.
 *
 * ────────────────────────────────────────────────────────────────────────
 * O `global-error.tsx` substitui o documento inteiro quando o layout raiz
 * falha, então não pode importar o `globals.css` nem componente nenhum: um
 * arquivo que só roda quando tudo quebrou não pode depender do que quebrou.
 * As cores da marca vão em linha, copiadas à mão.
 *
 * Copiadas à mão significa que elas DERIVAM. Na primeira escrita, três dos
 * quatro hex estavam errados — um navy quase certo, um gelo azulado demais
 * e um dourado trocado. Ninguém veria: é a página que quase nunca aparece.
 *
 * Este teste é a única coisa que liga aquele arquivo ao sistema de cores.
 * ──────────────────────────────────────────────────────────────────────── */
describe('global-error usa as cores canônicas da marca', () => {
  const fonte = readFileSync(
    new URL('../../src/app/global-error.tsx', import.meta.url),
    'utf8',
  );
  const css = readFileSync(new URL('../../src/app/globals.css', import.meta.url), 'utf8');

  const token = (nome: string) => {
    const achado = new RegExp(`--color-${nome}:\\s*(#[0-9A-Fa-f]{6})`).exec(css);
    if (!achado) throw new Error(`token --color-${nome} não existe no globals.css`);
    return achado[1];
  };

  it.each([
    ['navy-900', 'o fundo'],
    ['ice-100', 'o texto'],
    ['gold-500', 'o botão'],
    ['gold-400', 'o link'],
  ])('%s (%s) bate com o token', (nome) => {
    expect(fonte).toContain(token(nome));
  });

  it('não usa nenhum hex fora da paleta', () => {
    const usados = new Set(fonte.match(/#[0-9A-Fa-f]{6}/g) ?? []);
    const paleta = new Set(
      (css.match(/--color-[a-z0-9-]+:\s*#[0-9A-Fa-f]{6}/g) ?? []).map((l) => l.split(/:\s*/)[1]),
    );
    const intrusos = [...usados].filter((c) => !paleta.has(c));
    expect(intrusos, `hex fora da paleta em global-error.tsx: ${intrusos.join(', ')}`).toEqual([]);
  });
});

describe('colar — artigos e preposições curtos não ficam pendurados', () => {
  const NBSP = ' ';

  it('cola a palavra de uma letra à seguinte', () => {
    expect(colar('O alinhamento com a diretoria')).toBe(
      `O${NBSP}alinhamento com a${NBSP}diretoria`,
    );
  });

  it('cola palavra de duas letras, e acentuada', () => {
    expect(colar('é uma fase')).toBe(`é${NBSP}uma fase`);
    expect(colar('em três fases')).toBe(`em${NBSP}três fases`);
  });

  it('não toca em palavra de três letras ou mais', () => {
    expect(colar('com convicção sempre')).toBe('com convicção sempre');
  });

  it('não inventa nem remove caracteres além da troca de espaço', () => {
    const original = 'O teste de qualquer material novo, e o resto.';
    const colado = colar(original);
    expect(colado.length).toBe(original.length);
    expect(colado.replaceAll(NBSP, ' ')).toBe(original);
  });
});

/**
 * O número de perguntas é derivado, nunca digitado.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A home dizia "dez perguntas" enquanto /analise e /mapa-de-vazamento
 * diziam "onze". Onze era o certo. Num site cuja tese é honestidade sobre
 * número, um número errado sobre o próprio produto é o pior lugar para
 * errar — e ninguém percebeu porque cada página estava certa sozinha.
 *
 * Interpolar `TOTAL_DE_PERGUNTAS` torna a divergência impossível. Este
 * teste impede a reintrodução: se alguém voltar a digitar o extenso, ele
 * reprova e diz onde.
 * ──────────────────────────────────────────────────────────────────────── */
describe('a contagem de perguntas vem do esquema', () => {
  it('é o número de campos que o esquema valida', () => {
    expect(TOTAL_DE_PERGUNTAS).toBe(Object.keys(esquemaRespostas.shape).length);
  });

  it('nenhuma página digita a contagem por extenso', () => {
    const paginas = globSync('src/app/**/page.tsx');
    expect(paginas.length).toBeGreaterThan(5);

    const digitado = /\b(nove|dez|onze|doze|treze)\s+perguntas/i;
    const culpadas = paginas.filter((f) => digitado.test(readFileSync(f, 'utf8')));

    expect(
      culpadas,
      `contagem digitada à mão (use porExtenso(TOTAL_DE_PERGUNTAS)): ${culpadas.join(', ')}`,
    ).toEqual([]);
  });
});
