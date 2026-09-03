import { z } from 'zod';
import {
  FAIXAS_COLABORADORES,
  FAIXAS_FATURAMENTO,
  P_DONO,
  P_FECHAMENTO,
  P_LATENCIA,
  P_NUMERO_MEDIDO,
  P_PATROCINADOR,
  P_PRAZO,
  P_TENTATIVA,
  P_TOQUES,
  P_VOLUME,
} from './perguntas';

/**
 * A fronteira de confiança da Análise ABBA.
 *
 * Tudo que chega pela rede passa por aqui antes de encostar no modelo de
 * estimativa. Os enums são derivados das próprias perguntas — acrescentar
 * uma opção em `perguntas.ts` a torna válida aqui automaticamente, e
 * remover uma a invalida. Não existe lista duplicada para sair de sincronia.
 */

function enumDeOpcoes<T extends { readonly opcoes: readonly { readonly valor: string }[] }>(
  pergunta: T,
) {
  const valores = pergunta.opcoes.map((o) => o.valor) as [string, ...string[]];
  return z.enum(valores);
}

function enumDeFaixas<T extends readonly { readonly valor: string }[]>(faixas: T) {
  return z.enum(faixas.map((f) => f.valor) as [string, ...string[]]);
}

export const esquemaRespostas = z.object({
  colaboradores: enumDeFaixas(FAIXAS_COLABORADORES),
  faturamento: enumDeFaixas(FAIXAS_FATURAMENTO),
  volume: enumDeOpcoes(P_VOLUME),
  toques: enumDeOpcoes(P_TOQUES),
  fechamento: enumDeOpcoes(P_FECHAMENTO),
  numeroMedido: enumDeOpcoes(P_NUMERO_MEDIDO),
  latencia: enumDeOpcoes(P_LATENCIA),
  patrocinador: enumDeOpcoes(P_PATROCINADOR),
  tentativa: enumDeOpcoes(P_TENTATIVA),
  dono: enumDeOpcoes(P_DONO),
  prazo: enumDeOpcoes(P_PRAZO),
});

/**
 * Nome de empresa e de setor são os ÚNICOS campos de texto livre que
 * chegam ao modelo de linguagem. Isso os torna a superfície de injeção de
 * prompt do site: alguém pode digitar quebras de linha e instruções no
 * lugar do nome da empresa e tentar sequestrar a geração.
 *
 * A primeira camada de defesa é esta: um nome de empresa não tem quebra de
 * linha, nem caractere de controle. O conjunto permitido cobre o português
 * inteiro (acento e cedilha), dígitos e a pontuação que aparece em razão
 * social de verdade — `&`, ponto, vírgula, hífen, apóstrofo, barra,
 * parênteses. Uma empresa cujo nome não cabe aqui é rara; uma injeção que
 * cabe, mais rara ainda.
 *
 * A segunda camada está em `narrativa.ts` (o valor entra delimitado e
 * declarado como dado), e a terceira na verificação da saída.
 */
const NOME_PROPRIO = /^[\p{L}\p{N} .,'’&·/()+-]+$/u;

const textoCurtoSeguro = (rotulo: string) =>
  z
    .string()
    .trim()
    .min(2, `${rotulo} muito curto`)
    .max(120)
    .refine((v) => NOME_PROPRIO.test(v), `${rotulo} tem caractere que não aceitamos`);

export const esquemaPedidoAnalise = z.object({
  empresa: textoCurtoSeguro('Nome da empresa'),
  setor: textoCurtoSeguro('Setor'),
  respostas: esquemaRespostas,
});

export type PedidoAnalise = z.infer<typeof esquemaPedidoAnalise>;

/**
 * Contato: opcional por desenho. O resultado da análise aparece ANTES e
 * INDEPENDENTE deste formulário — o Mapa de Vazamento nunca se cobra, e
 * cadastro obrigatório é uma forma de cobrança.
 */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const esquemaContato = z.object({
  nome: z.string().trim().min(2, 'Nome muito curto').max(120),
  cargo: z.string().trim().max(120).optional().default(''),
  email: z
    .string()
    .trim()
    .max(180)
    .refine((v) => REGEX_EMAIL.test(v), 'E-mail inválido'),
  empresa: z.string().trim().min(2).max(120),
  telefone: z.string().trim().max(40).optional().default(''),
  mensagem: z.string().trim().max(2000).optional().default(''),
  /** Origem do lead, para o registro no funil. */
  origem: z.enum(['analise', 'contato']),
  /**
   * Armadilha para robô: campo escondido no formulário. Humano nunca
   * preenche; preenchido, a requisição é descartada em silêncio.
   */
  website: z.string().max(0).optional().default(''),
});

export type Contato = z.infer<typeof esquemaContato>;
