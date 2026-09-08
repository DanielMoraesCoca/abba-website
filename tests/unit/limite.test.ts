import { describe, expect, it } from 'vitest';
import { identificar, limiteDoAmbiente, verificarLimite } from '@/lib/limite';

/**
 * A trava de taxa, e o que ela realmente protege.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Escrito depois de uma revisão de segurança que achou uma falha real: a
 * identificação por `X-Forwarded-For` é forjável, e a trava por IP era a
 * única coisa entre um laço e uma fatura de modelo de linguagem.
 *
 * A correção não foi "confiar melhor no cabeçalho" — não dá para confiar
 * num cabeçalho que o cliente escreve. Foi acrescentar um contador de chave
 * FIXA, que não pergunta quem está chamando e por isso não tem o que
 * forjar. Estes testes travam as duas metades.
 * ──────────────────────────────────────────────────────────────────────── */

const cabecalhos = (entradas: Record<string, string>) => new Headers(entradas);

describe('identificar', () => {
  it('usa o primeiro endereço da cadeia encaminhada', () => {
    expect(identificar(cabecalhos({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe(
      '203.0.113.7',
    );
  });

  it('cai no x-real-ip quando não há cadeia', () => {
    expect(identificar(cabecalhos({ 'x-real-ip': '203.0.113.9' }))).toBe('203.0.113.9');
  });

  it('recusa valor longo demais para ser endereço', () => {
    // Um valor gigante por requisição encheria o mapa de chaves. O IPv6
    // mais longo tem 45 caracteres; acima disso não é endereço.
    const gigante = 'a'.repeat(4000);
    expect(identificar(cabecalhos({ 'x-forwarded-for': gigante }))).toBe('desconhecido');
    expect(identificar(cabecalhos({ 'x-real-ip': gigante }))).toBe('desconhecido');
  });
});

describe('o fusível de chave fixa não é contornável', () => {
  it('conta todas as chamadas juntas, venha de onde vier', () => {
    const chave = `fusivel-teste-${Math.random()}`;
    const permitidas = [...Array(5)].map(
      () => verificarLimite(chave, 3, 60_000).permitido,
    );

    expect(permitidas).toEqual([true, true, true, false, false]);
  });

  it('a trava por IP, ao contrário, cede a um cabeçalho variado', () => {
    // Este teste documenta a falha, não a corrige — é exatamente por isso
    // que o fusível global existe. Se um dia ele passar a reprovar, é
    // porque alguém tornou a identificação inforjável, e aí o fusível
    // vira redundância bem-vinda, não remendo.
    const prefixo = `ip-teste-${Math.random()}`;
    const forjadas = [...Array(20)].map(
      (_, i) => verificarLimite(`${prefixo}:198.51.100.${i}`, 3, 60_000).permitido,
    );

    expect(forjadas.every(Boolean)).toBe(true);
  });
});

describe('limiteDoAmbiente', () => {
  it.each([
    ['', 8],
    ['0', 8],
    ['-5', 8],
    ['abacaxi', 8],
    ['40', 40],
  ])('%s vira %i — configuração errada nunca abre a porta', (bruto, esperado) => {
    process.env.ABBA_TESTE_LIMITE = bruto;
    expect(limiteDoAmbiente('ABBA_TESTE_LIMITE', 8)).toBe(esperado);
    delete process.env.ABBA_TESTE_LIMITE;
  });

  it('ausente cai no padrão', () => {
    delete process.env.ABBA_TESTE_LIMITE;
    expect(limiteDoAmbiente('ABBA_TESTE_LIMITE', 8)).toBe(8);
  });
});
