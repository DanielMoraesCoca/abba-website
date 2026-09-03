import type { Evidencia } from './tipos';

/**
 * O CÂNONE — os únicos números que podem aparecer no site.
 * Origem: abba-ops/00-identidade/base-de-evidencias.md §1.
 *
 * Regra absoluta da casa: número que não está aqui não sai em material
 * nenhum. Todo número sobe com a fonte na frase ("a RAND mediu", "a Gartner
 * projeta"), porque número de terceiro vira alvo de auditoria do cliente.
 *
 * Para adicionar: fonte primária + confiança + registrar PRIMEIRO no
 * abba-ops, depois aqui.
 */
export const EVIDENCIAS = [
  {
    id: 'rand-80',
    numero: 'mais de 80%',
    afirmacao: 'dos projetos de IA falham — o dobro da taxa de projetos de TI comuns.',
    fonte: 'RAND, “The Root Causes of Failure for AI Projects” — 65 entrevistas com engenheiros de ML sêniores',
    ano: 2024,
    confianca: 'alta',
    leitura:
      'É a pesquisa mais rigorosa que existe sobre o assunto. O problema não é exceção: é o comportamento padrão do mercado.',
  },
  {
    id: 'rand-causa-1',
    numero: 'causa nº 1',
    afirmacao:
      'de fracasso não é técnica: é começar sem combinar, antes, qual seria o critério de sucesso.',
    fonte: 'RAND, mesma pesquisa — causas 1 e 2 do ranking',
    ano: 2024,
    confianca: 'alta',
    leitura:
      'É a nossa tese, dita por terceiro. Por isso toda decisão aqui nasce com o número que ela precisa mover, combinado por escrito antes de qualquer linha de código.',
  },
  {
    id: 'metr-19',
    numero: '19% mais lentos',
    afirmacao:
      'foi o que aconteceu com desenvolvedores experientes usando IA — e eles saíram convencidos de que tinham ficado 20% mais rápidos.',
    fonte: 'METR — experimento randomizado, 16 desenvolvedores experientes, 246 tarefas reais',
    ano: 2025,
    confianca: 'alta',
    ressalva:
      'Medição forte, generalização limitada: amostra pequena, em código que os participantes já dominavam.',
    leitura:
      'Um erro de percepção de cerca de 40 pontos. Ninguém sabe se a IA ajudou sem medir de fora. É exatamente por isso que a ABBA existe.',
  },
  {
    id: 'cui-26',
    numero: '+26% de tarefas concluídas',
    afirmacao:
      'por desenvolvedores com IA — e os menos experientes são os que mais ganham.',
    fonte:
      'Cui et al., Management Science (revisado por pares) — 3 experimentos randomizados, 4.867 desenvolvedores',
    ano: 2025,
    confianca: 'alta',
    leitura:
      'O ganho de construção está indo para todo mundo. Saber construir com IA deixou de ser diferencial — achar o problema certo e medir o resultado, não.',
  },
  {
    id: 'dora-amplifica',
    numero: 'amplifica',
    afirmacao:
      'é o verbo do relatório DORA: a IA não conserta um time, ela amplifica o que já está lá. A adoção correlaciona positivamente com velocidade e negativamente com estabilidade.',
    fonte: 'DORA 2025 (Google) — cerca de 5.000 respondentes',
    ano: 2025,
    confianca: 'alta',
    leitura:
      'Time com a base arrumada acelera; time com processo bagunçado piora mais rápido. Arrumar a base não é atraso — é a condição do ganho.',
  },
  {
    id: 'bcg-5',
    numero: 'cerca de 5%',
    afirmacao: 'das organizações extraem ganho financeiro substancial de IA. 60% são retardatárias.',
    fonte: 'BCG, “The Widening AI Value Gap”',
    ano: 2025,
    confianca: 'media-alta',
    leitura: 'Uma em vinte empresas transformou IA em resultado financeiro de verdade.',
  },
  {
    id: 'gartner-40',
    numero: 'mais de 40%',
    afirmacao:
      'dos projetos de IA agêntica serão cancelados até o fim de 2027 — e dos milhares de fornecedores “de agentes”, cerca de 130 são reais.',
    fonte: 'Gartner (enquete com 3.412 participantes de webinar)',
    ano: 2025,
    confianca: 'media',
    ressalva: 'É enquete, não estudo controlado — e a Gartner declara isso.',
    leitura:
      'O mercado chama de “agente” quase tudo. A diferença entre os dois grupos aparece na medição, não no material de venda.',
  },
  {
    id: 'wharton-medicao',
    numero: '72% dizem medir',
    afirmacao:
      'o retorno de IA generativa — mas metade usa “qualidade de dados” como métrica, e 53% reportam retorno de apenas 1% a 5%.',
    fonte: 'Wharton Human-AI Research (GBK), ano 3',
    ano: 2025,
    confianca: 'media-alta',
    leitura:
      'Quase todo mundo diz que mede. Medição de verdade — combinada antes, ligada ao resultado financeiro — quase não existe.',
  },
  {
    id: 'kpmg-brasil-47',
    numero: '47% das empresas brasileiras',
    afirmacao: 'já oferecem treinamento de IA — acima dos EUA (28%), do Reino Unido (27%) e da Alemanha (20%).',
    fonte: 'KPMG / Universidade de Melbourne, “Trust, attitudes and use of AI”',
    ano: 2025,
    confianca: 'media-alta',
    leitura:
      'O Brasil não tem falta de treinamento de IA. Tem falta de treinamento que aparece no trabalho 90 dias depois.',
  },
  {
    id: 'mckinsey-outcome',
    numero: 'cerca de 25% da receita',
    afirmacao:
      'global da McKinsey em 2025 veio de contratos baseados em resultado.',
    fonte: 'Declaração pública da própria McKinsey',
    ano: 2025,
    confianca: 'media',
    ressalva:
      'É a firma falando da própria receita, sem auditoria de terceiro — vale como ordem de grandeza do topo do mercado, não como dado conferível.',
    leitura:
      'No topo do mercado, um quarto da receita já é atrelada a resultado. No médio porte brasileiro, quase ninguém oferece isso.',
  },
  {
    id: 'auditor-tenure',
    numero: '32,7 anos',
    afirmacao: 'é o tempo médio que um auditor fica com o mesmo cliente no S&P 500.',
    fonte: 'Audit Analytics, a partir de arquivamentos na SEC',
    ano: 2024,
    confianca: 'alta',
    leitura:
      'É o oposto do churn de serviços profissionais, que corre de 16% a 27% ao ano. Relação que se sustenta em prova recorrente não se renova por argumento de venda.',
  },
  {
    id: 'talento-98',
    numero: '98%',
    afirmacao:
      'das médias e grandes empresas brasileiras relatam dificuldade para contratar profissional qualificado em IA.',
    fonte: 'Pesquisas de mercado noticiadas por CartaCapital e Money Times',
    ano: 2025,
    confianca: 'media',
    ressalva: 'É imprensa citando pesquisa — falamos como “as pesquisas de mercado apontam”, nunca como dado próprio.',
    leitura:
      'Quem disputa esse talento contra banco e vaga em dólar, perde. É por isso que a cadeira de IA no médio porte nasce fracionária.',
  },
] as const satisfies readonly Evidencia[];

export type EvidenciaId = (typeof EVIDENCIAS)[number]['id'];

/** Acesso por id, com erro alto e cedo se a chave não existir. */
export function evidencia(id: EvidenciaId): Evidencia {
  const achada = EVIDENCIAS.find((e) => e.id === id);
  if (!achada) {
    throw new Error(
      `Evidência "${id}" não existe no cânone. Antes de citar um número novo, registre-o em abba-ops/00-identidade/base-de-evidencias.md.`,
    );
  }
  return achada;
}

/**
 * O ÍNDICE PROIBIDO — números banidos de todo material.
 * Origem: base-de-evidencias.md §2. Usado pelo teste da régua do revisor.
 * Cada entrada explica por que caiu e o que usar no lugar; é isso que
 * impede o número de voltar por descuido daqui a seis meses.
 */
export const INDICE_PROIBIDO = [
  {
    padrao: /95\s*%[^.]{0,40}(pilotos?|projetos?)/i,
    rotulo: '“95% dos pilotos de IA falham” (MIT NANDA)',
    porque:
      'Não revisado por pares, baseado em percepção autorrelatada, e os autores vendem o framework que o próprio relatório recomenda.',
    substituto: 'RAND: mais de 80%, o dobro de TI comum, causa nº 1 = sem critério de sucesso.',
  },
  {
    padrao: /67\s*%[^.]{0,60}(parceiro|externo)/i,
    rotulo: '“parceiro externo acerta 67% vs 22–33% interno”',
    porque: 'Vem do mesmo relatório MIT NANDA. Aposentado.',
    substituto: 'A convergência RAND + METR + DORA — argumento por três fontes independentes.',
  },
  {
    padrao: /roi\s*(de\s*)?3x?\s*(a|até)\s*8x/i,
    rotulo: '“ROI de 3x a 8x em 12 meses”',
    porque: 'Frase idêntica copiada entre blogs de fornecedores, sem nenhuma fonte primária.',
    substituto: 'Payback calculado caso a caso com número DO cliente.',
  },
  {
    padrao: /90\s*%[^.]{0,50}treinamento/i,
    rotulo: '“90% das organizações falham em treinamento de IA”',
    porque: 'Manchete de fornecedor, sem metodologia.',
    substituto: 'KPMG 47% + Wharton (medição frouxa).',
  },
  {
    padrao: /payback\s+de\s+5,?1\s+meses/i,
    rotulo: '“payback de 5,1 meses em agentes”',
    porque: 'Só aparece em conteúdo com assinatura de geração por IA; fonte primária não localizada.',
    substituto: 'McKinsey 25% de receita atrelada a resultado.',
  },
  {
    padrao: /32\s*%[^.]{0,40}15\s*%[^.]{0,40}churn/i,
    rotulo: '“32% vs 15% de churn de firmas pequenas vs grandes”',
    porque: 'Sem fonte primária.',
    substituto: 'CustomerGauge 16–27% + tenure de 32,7 anos do auditor no S&P 500.',
  },
] as const;
