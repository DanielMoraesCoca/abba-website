import { describe, expect, it, vi } from 'vitest';
import { contemNumeroProibido, narrativaDeterministica } from '@/lib/analise/narrativa';
import { estimar, type RespostasAnalise } from '@/lib/analise/modelo';

/**
 * A trava que separa o que é auditável do que não é.
 *
 * O modelo de linguagem escreve a prosa; o número sai de aritmética. Se um
 * número escapar para o texto gerado, a geração inteira é descartada. Estes
 * testes travam a verificação — afrouxá-la é abrir a porta para o site
 * publicar uma cifra que ninguém consegue refazer.
 */

const RESPOSTAS: RespostasAnalise = {
  colaboradores: '51-200',
  faturamento: '10-50m',
  volume: '500-2k',
  toques: '5-plus',
  fechamento: '8-15',
  numeroMedido: 'parcial',
  latencia: 'ano',
  patrocinador: 'financeiro',
  tentativa: 'ferramentas-soltas',
  dono: 'area',
  prazo: 'sim-12m',
};

describe('detecção de número em texto gerado', () => {
  it.each([
    ['R$ 400 mil por ano', 'cifra em reais'],
    ['cerca de 30% do faturamento', 'percentual'],
    ['aproximadamente 1200 documentos', 'número grande'],
    ['uma economia de 4,5 vezes', 'decimal'],
    ['algo perto de dois milhões', 'ordem de grandeza por extenso'],
  ])('rejeita %s (%s)', (texto) => {
    expect(contemNumeroProibido(texto)).toBe(true);
  });

  it.each([
    'O dinheiro sai na conferência repetida a cada troca de sistema.',
    'Três perguntas mudariam essa leitura nos dois sentidos.',
    'A exceção consome mais tempo do que o fluxo normal, e ninguém mede isso.',
  ])('aceita prosa sem número: %s', (texto) => {
    expect(contemNumeroProibido(texto)).toBe(false);
  });
});

describe('narrativa determinística', () => {
  const contexto = {
    empresa: 'Exemplo Ltda',
    setor: 'distribuição',
    respostas: RESPOSTAS,
    estimativa: estimar(RESPOSTAS),
  };

  it('é o que o site publica sem chave de API, e se declara como tal', () => {
    expect(narrativaDeterministica(contexto).origem).toBe('deterministica');
  });

  it('devolve exatamente três perguntas', () => {
    expect(narrativaDeterministica(contexto).perguntas).toHaveLength(3);
  });

  it('ela própria passa na trava de número', () => {
    const n = narrativaDeterministica(contexto);
    const tudo = [n.vetorFrase, n.oQueFaltaOlhar, ...n.perguntas].join(' ');
    expect(contemNumeroProibido(tudo)).toBe(false);
  });

  it('declara o limite: o que não dá para ver de fora', () => {
    expect(narrativaDeterministica(contexto).oQueFaltaOlhar).toMatch(/de fora/i);
  });
});

/**
 * O fusível global, medido pelo que importa: a rede.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Uma revisão de segurança mostrou que a trava por IP é contornável — ela
 * conta baldes por `X-Forwarded-For`, um cabeçalho que o cliente escreve.
 * Como a trava era a única coisa entre um laço e uma fatura de modelo de
 * linguagem, entrou um contador de chave fixa, sem nada a forjar.
 *
 * Este teste não pergunta se a resposta é a mesma — ela seria a mesma de
 * qualquer jeito, porque toda falha cai no texto determinístico. Ele
 * pergunta se a chamada PAGA aconteceu. Nenhuma ida à rede: essa é a
 * afirmação, e é a única que custa dinheiro se for falsa.
 * ──────────────────────────────────────────────────────────────────────── */
describe('o fusível global impede a chamada paga', () => {
  it('não toca a rede quando o teto da janela já foi gasto', async () => {
    vi.resetModules();
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-ant-chave-falsa-para-teste');
    vi.stubEnv('ABBA_LIMITE_GLOBAL_LLM', '2');

    const { gerarNarrativa } = await import('@/lib/analise/narrativa');
    const contexto = {
      empresa: 'Exemplo',
      setor: 'serviços',
      respostas: RESPOSTAS,
      estimativa: estimar(RESPOSTAS),
    };

    const idas: string[] = [];
    const espiao = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (entrada: RequestInfo | URL) => {
        idas.push(String(entrada));
        throw new Error('rede indisponível no teste');
      });

    try {
      // As duas primeiras gastam o teto e TENTAM a rede (é o esperado).
      await gerarNarrativa(contexto);
      await gerarNarrativa(contexto);
      const tentativasAntes = idas.length;
      expect(tentativasAntes).toBeGreaterThan(0);

      // Da terceira em diante o fusível está aberto: nada de rede.
      await gerarNarrativa(contexto);
      await gerarNarrativa(contexto);
      expect(
        idas.length,
        `o fusível deixou passar ${idas.length - tentativasAntes} chamada(s) paga(s)`,
      ).toBe(tentativasAntes);
    } finally {
      espiao.mockRestore();
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });
});
