import type { Contato } from './analise/schema';

/**
 * Registro de lead.
 *
 * O funil de verdade da ABBA vive no Drive (`01 Comercial/Leads/`) e no
 * pipeline — não num banco do site. Por isso aqui existe só uma porta:
 * se `ABBA_LEAD_WEBHOOK` estiver configurada, o contato é encaminhado para
 * lá; se não estiver, ele é registrado no log do servidor e o formulário
 * responde normalmente.
 *
 * A escolha de não falhar quando não há webhook é deliberada: um formulário
 * que quebra porque uma integração não está pronta perde o lead duas vezes.
 * O que NÃO se faz é fingir sucesso sem deixar rastro — daí o log.
 */

export type ResultadoLead =
  | { readonly estado: 'encaminhado' }
  | { readonly estado: 'registrado-em-log' }
  | { readonly estado: 'falhou'; readonly motivo: string };

export async function registrarLead(contato: Contato): Promise<ResultadoLead> {
  const destino = process.env.ABBA_LEAD_WEBHOOK;

  if (!destino) {
    console.info('[abba:lead] contato recebido sem webhook configurado', {
      empresa: contato.empresa,
      origem: contato.origem,
      recebidoEm: new Date().toISOString(),
    });
    return { estado: 'registrado-em-log' };
  }

  try {
    const resposta = await fetch(destino, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...contato, recebidoEm: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) {
      return { estado: 'falhou', motivo: `webhook respondeu ${resposta.status}` };
    }
    return { estado: 'encaminhado' };
  } catch (erro) {
    return { estado: 'falhou', motivo: erro instanceof Error ? erro.message : 'erro desconhecido' };
  }
}
