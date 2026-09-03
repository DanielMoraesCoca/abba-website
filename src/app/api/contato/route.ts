import { NextResponse } from 'next/server';
import { esquemaContato } from '@/lib/analise/schema';
import { registrarLead } from '@/lib/leads';
import { identificar, limiteDoAmbiente, verificarLimite } from '@/lib/limite';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAXIMO_POR_JANELA = limiteDoAmbiente('ABBA_LIMITE_CONTATO', 5);
const JANELA_MS = 15 * 60 * 1000;

export async function POST(requisicao: Request) {
  const chave = identificar(requisicao.headers);
  const limite = verificarLimite(`contato:${chave}`, MAXIMO_POR_JANELA, JANELA_MS);

  if (!limite.permitido) {
    return NextResponse.json(
      { erro: 'limite', mensagem: 'Muitos envios seguidos. Tente de novo em alguns minutos.' },
      { status: 429, headers: { 'Retry-After': String(limite.reinicioEmSegundos) } },
    );
  }

  let corpo: unknown;
  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ erro: 'json', mensagem: 'Requisição inválida.' }, { status: 400 });
  }

  const validado = esquemaContato.safeParse(corpo);
  if (!validado.success) {
    return NextResponse.json(
      {
        erro: 'validacao',
        mensagem: 'Confira os campos destacados.',
        detalhes: validado.error.issues.map((i) => ({
          campo: i.path.join('.'),
          problema: i.message,
        })),
      },
      { status: 400 },
    );
  }

  // Armadilha preenchida: robô. Responde 200 para não ensinar o que falhou.
  if (validado.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const resultado = await registrarLead(validado.data);

  if (resultado.estado === 'falhou') {
    console.error('[abba:lead] falha ao encaminhar contato', resultado.motivo);
    return NextResponse.json(
      {
        erro: 'entrega',
        mensagem:
          'Não conseguimos registrar seu contato agora. Escreva direto para contato@abbaservices.com.br — ' +
          'a gente responde em 24 horas úteis.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
