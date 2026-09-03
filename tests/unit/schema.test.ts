import { describe, expect, it } from 'vitest';
import { esquemaContato, esquemaPedidoAnalise } from '@/lib/analise/schema';
import { verificarLimite } from '@/lib/limite';

const RESPOSTAS_VALIDAS = {
  colaboradores: '51-200',
  faturamento: '10-50m',
  volume: '500-2k',
  toques: '3-4',
  fechamento: '4-7',
  numeroMedido: 'sim',
  latencia: 'mes',
  patrocinador: 'diretoria',
  tentativa: 'nada',
  dono: 'nomeado',
  prazo: 'nao',
};

describe('fronteira da análise', () => {
  it('aceita um pedido completo', () => {
    const r = esquemaPedidoAnalise.safeParse({
      empresa: 'Exemplo Ltda',
      setor: 'distribuição',
      respostas: RESPOSTAS_VALIDAS,
    });
    expect(r.success).toBe(true);
  });

  it('rejeita opção fora do conjunto declarado nas perguntas', () => {
    const r = esquemaPedidoAnalise.safeParse({
      empresa: 'Exemplo Ltda',
      setor: 'distribuição',
      respostas: { ...RESPOSTAS_VALIDAS, toques: 'muitos' },
    });
    expect(r.success).toBe(false);
  });

  it('rejeita pedido com resposta faltando', () => {
    const { toques, ...incompletas } = RESPOSTAS_VALIDAS;
    void toques;
    const r = esquemaPedidoAnalise.safeParse({
      empresa: 'Exemplo Ltda',
      setor: 'distribuição',
      respostas: incompletas,
    });
    expect(r.success).toBe(false);
  });
});

describe('fronteira do contato', () => {
  const BASE = {
    nome: 'Fulana de Tal',
    email: 'fulana@empresa.com.br',
    empresa: 'Empresa S.A.',
    origem: 'contato' as const,
  };

  it('aceita o mínimo: nome, e-mail e empresa', () => {
    expect(esquemaContato.safeParse(BASE).success).toBe(true);
  });

  it('rejeita e-mail malformado', () => {
    expect(esquemaContato.safeParse({ ...BASE, email: 'fulana@empresa' }).success).toBe(false);
  });

  it('a armadilha de robô só aceita string vazia', () => {
    expect(esquemaContato.safeParse({ ...BASE, website: '' }).success).toBe(true);
    expect(esquemaContato.safeParse({ ...BASE, website: 'http://spam' }).success).toBe(false);
  });

  it('corta mensagem acima do limite em vez de aceitar payload gigante', () => {
    const r = esquemaContato.safeParse({ ...BASE, mensagem: 'a'.repeat(2001) });
    expect(r.success).toBe(false);
  });
});

describe('limite de taxa', () => {
  it('permite até o máximo e barra a partir dali', () => {
    const chave = `teste-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      expect(verificarLimite(chave, 3, 60_000).permitido).toBe(true);
    }
    expect(verificarLimite(chave, 3, 60_000).permitido).toBe(false);
  });

  it('conta cada chave separadamente', () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    verificarLimite(a, 1, 60_000);
    expect(verificarLimite(a, 1, 60_000).permitido).toBe(false);
    expect(verificarLimite(b, 1, 60_000).permitido).toBe(true);
  });

  it('informa quantos segundos faltam para a janela reiniciar', () => {
    const chave = `t-${Math.random()}`;
    const r = verificarLimite(chave, 5, 30_000);
    expect(r.reinicioEmSegundos).toBeGreaterThan(0);
    expect(r.reinicioEmSegundos).toBeLessThanOrEqual(30);
  });
});
