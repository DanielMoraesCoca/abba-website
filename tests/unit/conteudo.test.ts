import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { CRENCAS, RECUSAS } from '@/content/manifesto';
import { EVIDENCIAS, evidencia } from '@/content/evidencias';
import type { Evidencia } from '@/content/tipos';
import { EMPRESA } from '@/content/identidade';
import { CAMADAS, DIMENSOES, TOTAL_DIMENSOES } from '@/content/metodo';
import { NAV_PRINCIPAL, NAV_RODAPE } from '@/content/navegacao';
import { PERGUNTAS } from '@/content/perguntas';
import { TOTAL_DE_PERGUNTAS, esquemaRespostas } from '@/lib/analise/schema';
import { colar } from '@/lib/tipografia';
import { PRECO_PUBLICO } from '@/content/precos';
import {
  BIO_DA_CASA,
  GESTICULA_VINCULO,
  SOCIOS,
  SOCIOS_PUBLICOS,
  esperandoAprovacao,
  faltaPreencher,
} from '@/content/socios';

describe('cânone de evidências', () => {
  // `EVIDENCIAS` é tupla literal (para derivar os ids). Ler um campo opcional
  // que nem todo membro tem é erro de tipo na união; no tipo nominal, não.
  const CANONE: readonly Evidencia[] = EVIDENCIAS;

  it('confiança alta exige página oficial para conferir', () => {
    // "Alta" quer dizer: qualquer pessoa confere em um clique. Sem URL, o
    // máximo honesto é média-alta — por mais sólida que a fonte seja.
    for (const item of CANONE) {
      if (item.confianca === 'alta') {
        expect(item.url, `evidência ${item.id} é "alta" sem url`).toMatch(/^https:\/\//);
      }
    }
  });

  it('toda url é https e sem espaço', () => {
    for (const item of CANONE) {
      if (item.url) expect(item.url, item.id).toMatch(/^https:\/\/\S+$/);
    }
  });

  it('data de conferência é ISO e não está no futuro', () => {
    const hoje = new Date().toISOString().slice(0, 10);
    for (const item of CANONE) {
      if (!item.conferidaEm) continue;
      expect(item.conferidaEm, item.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.conferidaEm <= hoje, `${item.id} conferida no futuro`).toBe(true);
    }
  });

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

describe('sócios', () => {
  it('as bios continuam fora do ar até o ok dos sócios (porta de uma via)', () => {
    /* Mesmo mecanismo do preço, e pelo mesmo motivo: nome de pessoa em
       material externo não se desfaz. O buscador guarda, o arquivo da web
       guarda. Este teste não impede a publicação: obriga quem publicar a
       mudar o teste no mesmo commit, deixando a decisão no histórico. */
    expect(SOCIOS_PUBLICOS).toBe(false);
  });

  it('nada vai ao ar com buraco de conteúdo por preencher', () => {
    /* A porta pode abrir por engano antes das bios existirem. Se isso
       acontecer, o site publicaria "[PRECISA DE NOME COMPLETO]" como se
       fosse o nome de um sócio. */
    if (SOCIOS_PUBLICOS) expect(faltaPreencher()).toEqual([]);
  });

  it('nada vai ao ar com linha ainda em rascunho', () => {
    /* Texto escrito não é texto aprovado. As duas linhas saíram da matriz de
       chapéus do abba-ops e são fiéis a ela, e mesmo assim são rascunho até
       os sócios lerem: é o nome deles na frase. */
    if (SOCIOS_PUBLICOS) expect(esperandoAprovacao()).toEqual([]);
  });

  /**
   * A TRAVA DA PARTE RELACIONADA (abba-ops, V4g item d).
   *
   * ──────────────────────────────────────────────────────────────────────
   * Um dos sócios tem vínculo profissional com o fornecedor cuja tecnologia
   * a ABBA implanta. Afirmar esse vínculo em público faria o guardião do
   * cliente (jurídico, DPO, controladoria) enxergar parte relacionada, e a
   * independência é o produto que esta casa vende. Declarar é decisão dos
   * sócios COM ADVOGADO, com política escrita de conflito de interesse, e
   * NÃO é decisão de marketing.
   *
   * A página de sócios é exatamente onde esse leitor chega, e exatamente
   * quando ele está avaliando se a prova é independente.
   *
   * O teste guarda as duas partes que se pode verificar em texto. A parte
   * mais escorregadia é a segunda: GESTICULAR o vínculo sem nomeá-lo é pior
   * que nomear, porque convida a pergunta e parece esconder. E ela é a que
   * entra com boa intenção, quando alguém quiser somar credibilidade de
   * origem a uma bio daqui a seis meses.
   * ────────────────────────────────────────────────────────────────────── */
  it('toda linha descreve o chapéu na ABBA, e não um currículo', () => {
    for (const socio of SOCIOS) {
      expect(
        socio.linha.startsWith('Responde'),
        `a linha de ${socio.id} não começa em "Responde": bio que abre por origem puxa cargo de origem`,
      ).toBe(true);
    }
  });

  it('nenhuma linha gesticula para um vínculo de fornecedor', () => {
    const texto = [...SOCIOS.map((s) => `${s.nome} ${s.linha}`), BIO_DA_CASA].join(' ');
    for (const padrao of GESTICULA_VINCULO) {
      expect(padrao.test(texto), `vocabulário que gesticula vínculo: /${padrao.source}/`).toBe(
        false,
      );
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
    ['navy-escuro', 'o fundo'],
    ['branco', 'o texto'],
    ['papel', 'o botão'],
    ['navy', 'o texto do botão'],
    ['ouro', 'a marca'],
    ['ouro-claro', 'o link'],
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

/**
 * Números escritos à mão na prosa têm que bater com os dados.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A home dizia "dez perguntas" enquanto o esquema validava onze. Aquele
 * caso foi resolvido interpolando a contagem, mas a mesma armadilha está
 * armada em quinze arquivos: "sete camadas", "25 dimensões", "9 grupos",
 * "três caminhos", "três fases". Hoje todos corretos — e nenhum deles
 * sabe que existe uma fonte da verdade.
 *
 * Interpolar tudo deixaria a prosa ilegível. A trava é outra: varrer o
 * texto e conferir cada contagem contra os dados. Se alguém acrescentar
 * uma camada ou uma dimensão, quinze arquivos passam a mentir de uma vez —
 * e este teste diz quais.
 * ──────────────────────────────────────────────────────────────────────── */
describe('contagens na prosa batem com os dados', () => {
  /**
   * Compostos vêm primeiro: a alternância do regex casa a primeira opção
   * que serve, e sem isto "vinte e cinco dimensões" casaria como "cinco".
   * Foi o que aconteceu na primeira versão — o teste acusou erro no texto
   * quando o errado era ele.
   */
  const EXTENSO: Record<string, number> = {
    'vinte e cinco': 25, 'vinte e quatro': 24, 'vinte e três': 23,
    doze: 12, onze: 11, dez: 10, nove: 9, oito: 8, sete: 7, seis: 6,
    cinco: 5, quatro: 4, três: 3, duas: 2, dois: 2, uma: 1, um: 1,
  };

  /**
   * Só substantivos que têm UM sentido neste código.
   *
   * "grupos" ficou de fora depois da varredura: aparece como os nove
   * grupos de dimensões, mas também como "três grupos de pesquisa"
   * (RAND, METR, DORA) e "os dois grupos" de fornecedores de agente. Um
   * gatilho que grita em texto correto ensina todo mundo a ignorá-lo, e
   * aí ele deixa de proteger o caso real.
   */
  const ESPERADO: Record<string, number> = {
    camadas: CAMADAS.length,
    dimensões: TOTAL_DIMENSOES,
    caminhos: CAMINHOS.length,
    fases: FASES.length,
    crenças: CRENCAS.length,
    recusas: RECUSAS.length,
  };

  const arquivos = globSync('src/**/*.{ts,tsx}').filter((f) => !f.includes('/tipos.ts'));
  const numeros = Object.keys(EXTENSO).join('|');

  it.each(Object.keys(ESPERADO))('"N %s" nunca contradiz os dados', (substantivo) => {
    const esperado = ESPERADO[substantivo]!;
    const padrao = new RegExp(`\\b(\\d{1,2}|${numeros})\\s+${substantivo}\\b`, 'gi');

    const erros: string[] = [];
    for (const arquivo of arquivos) {
      for (const achado of readFileSync(arquivo, 'utf8').matchAll(padrao)) {
        const valor = EXTENSO[achado[1]!.toLowerCase()] ?? Number(achado[1]);
        if (valor !== esperado) {
          erros.push(`${arquivo}: "${achado[0]}" — os dados dizem ${esperado}`);
        }
      }
    }

    expect(erros, `\n  ${erros.join('\n  ')}\n`).toEqual([]);
  });
});

