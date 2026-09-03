import { NextResponse } from 'next/server';
import { esquemaPedidoAnalise } from '@/lib/analise/schema';
import { estimar, qualificar, type RespostasAnalise } from '@/lib/analise/modelo';
import { gerarNarrativa } from '@/lib/analise/narrativa';
import { identificar, limiteDoAmbiente, verificarLimite } from '@/lib/limite';

/**
 * A Análise ABBA.
 *
 * Não persiste nada. As respostas entram, o resultado sai, e a requisição
 * acaba — não há banco, não há cookie de perfil, não há identificador de
 * visitante. O contato, se a pessoa quiser deixar, vai por outra rota e por
 * decisão dela. É a regra 5 do Mapa de Vazamento ("sem dado de cliente no
 * documento enquanto não houver contrato") aplicada à infraestrutura, e não
 * só ao PDF.
 *
 * A rota é dinâmica de propósito: cada análise é uma resposta única.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAXIMO_POR_JANELA = limiteDoAmbiente('ABBA_LIMITE_ANALISE', 8);
const JANELA_MS = 10 * 60 * 1000;

export async function POST(requisicao: Request) {
  const chave = identificar(requisicao.headers);
  const limite = verificarLimite(`analise:${chave}`, MAXIMO_POR_JANELA, JANELA_MS);

  if (!limite.permitido) {
    return NextResponse.json(
      {
        erro: 'limite',
        mensagem:
          'Você já fez algumas análises seguidas. Espere alguns minutos — ou fale com a gente direto, ' +
          'que é mais rápido de qualquer jeito.',
      },
      { status: 429, headers: { 'Retry-After': String(limite.reinicioEmSegundos) } },
    );
  }

  let corpo: unknown;
  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ erro: 'json', mensagem: 'Requisição inválida.' }, { status: 400 });
  }

  const validado = esquemaPedidoAnalise.safeParse(corpo);
  if (!validado.success) {
    return NextResponse.json(
      {
        erro: 'validacao',
        mensagem: 'Faltou alguma resposta. Volte e complete os passos.',
        detalhes: validado.error.issues.map((i) => ({
          campo: i.path.join('.'),
          problema: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { empresa, setor } = validado.data;
  // O esquema é derivado das opções das perguntas, então os valores já são
  // do conjunto certo; o `as` só reconcilia o tipo largo do zod com os
  // literais do modelo.
  const respostas = validado.data.respostas as RespostasAnalise;

  const estimativa = estimar(respostas);
  const qualificacao = qualificar(respostas);
  const narrativa = await gerarNarrativa({ empresa, setor, respostas, estimativa });

  return NextResponse.json(
    { empresa, setor, estimativa, qualificacao, narrativa },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
