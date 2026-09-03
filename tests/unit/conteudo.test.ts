import { describe, expect, it } from 'vitest';
import { CAMINHOS, FASES } from '@/content/caminhos';
import { EVIDENCIAS, evidencia } from '@/content/evidencias';
import { EMPRESA } from '@/content/identidade';
import { DIMENSOES, TOTAL_DIMENSOES } from '@/content/metodo';
import { NAV_PRINCIPAL, NAV_RODAPE } from '@/content/navegacao';
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
