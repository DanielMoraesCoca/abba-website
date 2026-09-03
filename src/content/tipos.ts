/**
 * Tipos do conteúdo do site.
 *
 * Regra da casa (abba-ops/00-identidade/base-de-evidencias.md): número
 * externo só existe se vier com fonte. O tipo `Evidencia` torna isso
 * estrutural — não há como escrever um número no site sem declarar de onde
 * ele veio e qual o nível de confiança. O teste
 * `tests/unit/regua-do-revisor.test.ts` fecha o cerco pelo outro lado,
 * varrendo o repositório atrás dos números do índice proibido.
 */

export type Confianca = 'alta' | 'media-alta' | 'media';

export interface Evidencia {
  /** Chave estável — usada em âncoras e em referências cruzadas. */
  readonly id: string;
  /** O número, como ele aparece na tela. Ex.: "mais de 80%". */
  readonly numero: string;
  /** O que o número diz, em uma frase. */
  readonly afirmacao: string;
  /** Fonte primária, nomeada. Sem isto o número não sobe. */
  readonly fonte: string;
  /** Ano da publicação da fonte. */
  readonly ano: number;
  readonly confianca: Confianca;
  /** Ressalva obrigatória quando a confiança não é alta. */
  readonly ressalva?: string;
  /** Por que este número importa para quem lê. */
  readonly leitura: string;
}

export interface Caminho {
  readonly id: string;
  readonly ordem: number;
  readonly nome: string;
  readonly chamada: string;
  readonly descricao: string;
  readonly paraQuem: string;
  readonly itens: readonly string[];
  readonly href: string;
  readonly cta: { readonly texto: string; readonly href: string };
}

export interface Fase {
  readonly id: string;
  readonly rotulo: string;
  readonly nome: string;
  readonly janela: string;
  readonly promessa: string;
  readonly entregaveis: readonly string[];
  readonly portao: { readonly nome: string; readonly regra: string };
}

export interface Crenca {
  readonly numero: number;
  readonly titulo: string;
  readonly texto: string;
}

export interface Recusa {
  readonly recusa: string;
  readonly porque: string;
}

export interface Dimensao {
  readonly grupo: string;
  readonly itens: readonly string[];
}

export interface Pergunta {
  readonly pergunta: string;
  readonly resposta: string;
}

export interface ItemNav {
  readonly rotulo: string;
  readonly href: string;
  readonly descricao?: string;
}
