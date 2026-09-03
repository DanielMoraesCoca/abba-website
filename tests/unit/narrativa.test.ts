import { describe, expect, it } from 'vitest';
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
