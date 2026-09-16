/**
 * Preço.
 * Origem: abba-ops/03-comercial/tabela-de-precos.md (v3, Virada V5).
 *
 * ────────────────────────────────────────────────────────────────────────
 * PORTA DE UMA VIA. A tabela v3 traz, no topo, a ressalva dos sócios:
 * "preço público é porta de 1 via; Pedro valida antes de qualquer material
 * sair a cliente". Publicar preço na home é uma decisão que não se desfaz —
 * o mercado guarda o print. Por isso o site nasce com `PRECO_PUBLICO = false`:
 * mostra a ESTRUTURA do investimento (dois tempos, portão sem multa, o que
 * está incluso) sem os números.
 *
 * Quando os sócios decidirem publicar, é um booleano. Os números já estão
 * aqui, corretos e versionados, e as páginas já sabem renderizá-los.
 * ────────────────────────────────────────────────────────────────────────
 */
export const PRECO_PUBLICO = false;

export const PRECOS = {
  mapaDeVazamento: { rotulo: 'Gratuito', valor: 0 },
  programa: {
    entradaFirme: 26_000,
    porte: { P: 218_000, M: 278_000, G: 378_000 },
    trimestres: { P: 48_000, M: 63_000, G: 88_000 },
  },
  assinatura: { P: 11_000, M: 15_000, G: 21_000 },
  conselheiro: { mensal: 12_000, trimestral: 7_500, instalacaoMemoria: 15_000 },
} as const;

/** Regras comerciais que valem sendo o preço público ou não. */
export const REGRAS_DE_INVESTIMENTO = [
  {
    titulo: 'Contratação em dois tempos, num documento só',
    texto:
      'A fase 1 é firme e pequena: alçada de um diretor. As fases 2 e 3 entram no mesmo Termo já precificadas, ' +
      'mas como opção condicionada ao Portão da Prova. O comitê decide o ano uma vez; o investimento maior só anda ' +
      'com o caso medido na mesa.',
  },
  {
    titulo: 'Nenhuma multa em portão de saída',
    texto:
      'Saída na semana 6: você pagou a fase 1 e leva tudo, o caso rodando, o número medido e o portfólio priorizado completo. ' +
      'Saída no mês 6: aviso, sem multa. O portão retém execução, nunca informação.',
  },
  {
    titulo: 'Desconto seco não existe',
    texto:
      'Desconto ensina o cliente a esperar desconto e corrói a qualidade percebida: a literatura de varejo é consistente nisso. ' +
      'No lugar dele, bônus de fechamento com contrapartidas escritas.',
  },
  {
    titulo: 'O assessment de abertura nunca se cobra',
    texto: 'É a porta de entrada, e é de graça. Sem contrapartida, sem cadastro obrigatório em lista, sem cobrança depois.',
  },
] as const;
