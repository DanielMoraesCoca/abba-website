import { describe, expect, it } from 'vitest';
import {
  arredondarOrdemDeGrandeza,
  estimar,
  formatarFaixa,
  formatarReais,
  qualificar,
  type RespostasAnalise,
} from '@/lib/analise/modelo';
import { TETO_SOBRE_FATURAMENTO, FATURAMENTO_MEDIO } from '@/lib/analise/premissas';

/**
 * As cinco regras de honestidade do Mapa de Vazamento, travadas em teste.
 *
 * Se algum destes falhar e você não tiver mudado o modelo de propósito:
 * pare. Cada um corresponde a uma regra que os sócios escreveram em
 * abba-ops/03-comercial/mapa-de-vazamento.md, e afrouxá-la em silêncio é
 * exatamente o tipo de erosão que a régua existe para impedir.
 */

const BASE: RespostasAnalise = {
  colaboradores: '201-500',
  faturamento: '50-200m',
  volume: '2k-10k',
  toques: '3-4',
  fechamento: '4-7',
  numeroMedido: 'sim',
  latencia: 'trimestre',
  patrocinador: 'diretoria',
  tentativa: 'piloto-parou',
  dono: 'nomeado',
  prazo: 'sim-12m',
};

function comAs(mudancas: Partial<RespostasAnalise>): RespostasAnalise {
  return { ...BASE, ...mudancas };
}

describe('regra 1 — faixa, nunca ponto', () => {
  it('sempre devolve um mínimo estritamente menor que o máximo', () => {
    const e = estimar(BASE);
    expect(e.faixa).not.toBeNull();
    expect(e.faixa!.min).toBeLessThan(e.faixa!.max);
  });

  it('a faixa é larga o bastante para não passar por precisão falsa', () => {
    const e = estimar(BASE);
    // Menos de 50% de amplitude relativa sugeriria uma precisão que uma
    // estimativa feita de fora não tem.
    expect(e.faixa!.max / e.faixa!.min).toBeGreaterThan(1.5);
  });
});

describe('regra 2 — premissa sem base não entra', () => {
  it('toda premissa declarada traz texto e base', () => {
    for (const premissa of estimar(BASE).premissas) {
      expect(premissa.texto.length).toBeGreaterThan(30);
      expect(premissa.base.length).toBeGreaterThan(20);
    }
  });

  it('cada premissa se declara como evidência externa ou como assunção da casa', () => {
    for (const premissa of estimar(BASE).premissas) {
      expect(['evidencia', 'premissa']).toContain(premissa.tipo);
    }
  });
});

describe('regra 3 — a faixa pode ser pequena', () => {
  it('operação arrumada e pequena produz faixa muito menor que operação quebrada', () => {
    const arrumada = estimar(
      comAs({ volume: 'ate-500', toques: 'ate-2', fechamento: 'ate-3', latencia: 'mes' }),
    );
    const quebrada = estimar(
      comAs({ volume: '10k-50k', toques: '5-plus', fechamento: 'acima-15', latencia: 'ano' }),
    );
    expect(arrumada.faixa!.max).toBeLessThan(quebrada.faixa!.min);
  });

  it('não existe piso artificial: a faixa mínima acompanha o volume declarado', () => {
    const minima = estimar(
      comAs({
        volume: 'ate-500',
        toques: 'ate-2',
        fechamento: 'ate-3',
        latencia: 'mes',
        colaboradores: 'ate-50',
      }),
    );
    expect(minima.faixa!.min).toBeLessThan(60_000);
  });
});

describe('regra 4 — nunca prometer a captura da faixa inteira', () => {
  it('o aviso de faixa acompanha toda estimativa, com ou sem número', () => {
    const comNumero = estimar(BASE);
    const semNumero = estimar(comAs({ volume: 'nao-sei' }));
    for (const e of [comNumero, semNumero]) {
      expect(e.aviso).toMatch(/calculad[oa] de fora/i);
      expect(e.aviso).toMatch(/fração/i);
    }
  });
});

describe('teto de sanidade', () => {
  it('a faixa superior nunca ultrapassa a fração declarada do faturamento', () => {
    const e = estimar(
      comAs({
        faturamento: 'ate-10m',
        volume: 'acima-50k',
        toques: '5-plus',
        fechamento: 'acima-15',
        latencia: 'ano',
        colaboradores: 'acima-2000',
      }),
    );
    const teto = FATURAMENTO_MEDIO['ate-10m'] * TETO_SOBRE_FATURAMENTO;
    // O arredondamento para ordem de grandeza pode subir até 5% acima do teto.
    expect(e.faixa!.max).toBeLessThanOrEqual(teto * 1.05);
    expect(e.decomposicao?.tetoAplicado).toBe(true);
  });

  it('sem faturamento declarado, o teto não é aplicado e a faixa segue a aritmética', () => {
    const e = estimar(comAs({ faturamento: 'prefiro-nao-dizer' }));
    expect(e.decomposicao?.tetoAplicado).toBe(false);
  });
});

describe('sem volume, sem número', () => {
  it('recusa publicar faixa e explica por quê', () => {
    const e = estimar(comAs({ volume: 'nao-sei' }));
    expect(e.faixa).toBeNull();
    expect(e.decomposicao).toBeNull();
    expect(e.motivoSemFaixa).toMatch(/volume/i);
  });
});

describe('escolha do vetor', () => {
  it('sem número medido, o vetor é a própria ausência de medição', () => {
    expect(estimar(comAs({ numeroMedido: 'nao' })).vetor).toBe('ausencia-de-medicao');
  });

  it('descoberta só no ano seguinte aponta latência', () => {
    expect(estimar(comAs({ latencia: 'ano' })).vetor).toBe('latencia-da-descoberta');
  });

  it('fechamento longo com o resto em ordem aponta coordenação', () => {
    expect(estimar(comAs({ fechamento: 'acima-15', toques: '3-4' })).vetor).toBe(
      'imposto-da-coordenacao',
    );
  });
});

describe('teste do alvo', () => {
  it('empresa com patrocínio, número medido e dono nomeado é alvo cheio', () => {
    expect(qualificar(BASE).leitura).toBe('alvo-cheio');
  });

  it('sem patrocínio, sem número e sem dono, a recusa é nomeada e não disfarçada', () => {
    const q = qualificar(
      comAs({
        patrocinador: 'ninguem',
        numeroMedido: 'nao',
        dono: 'ninguem',
        tentativa: 'nada',
        prazo: 'nao',
        volume: 'nao-sei',
        toques: 'nao-sei',
      }),
    );
    expect(q.leitura).toBe('ainda-nao');
    expect(q.titulo).toMatch(/não somos a escolha certa/i);
    // Mesmo recusando, o mapa continua sendo dele: nunca se cobra.
    expect(q.proximoPasso).toMatch(/de graça/i);
  });

  it('o placar nunca passa do máximo declarado', () => {
    const q = qualificar(BASE);
    expect(q.placar).toBeLessThanOrEqual(q.maximo);
  });
});

describe('apresentação dos números', () => {
  it('arredonda para dois algarismos significativos', () => {
    expect(arredondarOrdemDeGrandeza(342_718)).toBe(340_000);
    expect(arredondarOrdemDeGrandeza(1_284_000)).toBe(1_300_000);
    expect(arredondarOrdemDeGrandeza(0)).toBe(0);
  });

  it('formata em reais na ordem de grandeza certa', () => {
    expect(formatarReais(340_000)).toBe('R$ 340 mil');
    expect(formatarReais(1_300_000)).toBe('R$ 1,3 milhões');
    expect(formatarFaixa({ min: 340_000, max: 890_000 })).toBe('R$ 340 mil a R$ 890 mil');
  });
});
