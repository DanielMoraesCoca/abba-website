'use client';

import { useState } from 'react';
import { CampoTexto } from '@/components/analise/Campos';
import { EMPRESA } from '@/content/identidade';
import { cn } from '@/lib/utils';

export function FormularioContato() {
  const [campos, setCampos] = useState({
    nome: '',
    cargo: '',
    email: '',
    empresa: '',
    telefone: '',
    mensagem: '',
    website: '',
  });
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'ok' | 'erro'>('parado');
  const [mensagemErro, setMensagemErro] = useState('');

  const definir = (campo: keyof typeof campos) => (valor: string) =>
    setCampos((atual) => ({ ...atual, [campo]: valor }));

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado('enviando');
    setMensagemErro('');

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...campos, origem: 'contato' }),
      });

      if (!resposta.ok) {
        const corpo = (await resposta.json().catch(() => null)) as { mensagem?: string } | null;
        setMensagemErro(corpo?.mensagem ?? 'Não conseguimos enviar agora.');
        setEstado('erro');
        return;
      }
      setEstado('ok');
    } catch {
      setMensagemErro('Sem conexão com o servidor. Tente de novo em instantes.');
      setEstado('erro');
    }
  }

  if (estado === 'ok') {
    return (
      <div className="border-l-2 border-gold-500 pl-7">
        <h2 className="font-display text-[1.6rem] text-navy-700">Recebido.</h2>
        <p className="mt-4 max-w-xl text-[1.02rem] leading-[1.7] text-slate-700">
          Um sócio responde em 24 horas úteis. Se for para a conversa de descoberta, ela leva 30
          minutos e a gente chega com pergunta, não com apresentação.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="grid items-end gap-6 sm:grid-cols-2" noValidate>
      <CampoTexto id="nome" rotulo="Seu nome" valor={campos.nome} aoMudar={definir('nome')} obrigatorio />
      <CampoTexto id="cargo" rotulo="Cargo" valor={campos.cargo} aoMudar={definir('cargo')} />
      <CampoTexto
        id="empresa-contato"
        rotulo="Empresa"
        valor={campos.empresa}
        aoMudar={definir('empresa')}
        obrigatorio
      />
      <CampoTexto
        id="telefone"
        rotulo="Telefone"
        tipo="tel"
        valor={campos.telefone}
        aoMudar={definir('telefone')}
      />
      <div className="sm:col-span-2">
        <CampoTexto
          id="email-contato"
          rotulo="E-mail corporativo"
          tipo="email"
          valor={campos.email}
          aoMudar={definir('email')}
          obrigatorio
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="mensagem" className="block text-[0.95rem] font-medium text-navy-700">
          O que está acontecendo aí <span className="text-slate-500">(opcional)</span>
        </label>
        <p className="mt-1.5 text-[0.86rem] text-slate-500">
          Se já houver um número em reais que dói, esse é o melhor jeito de começar.
        </p>
        <textarea
          id="mensagem"
          rows={5}
          value={campos.mensagem}
          onChange={(e) => definir('mensagem')(e.target.value)}
          className="mt-3 w-full rounded-[3px] border border-navy-700/20 bg-paper px-4 py-3 text-[1rem] leading-relaxed text-navy-700 transition-colors duration-300 placeholder:text-slate-400 focus:border-navy-700/50 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </div>

      <div aria-hidden className="hidden">
        <label htmlFor="website-contato">Não preencha este campo</label>
        <input
          id="website-contato"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={campos.website}
          onChange={(e) => definir('website')(e.target.value)}
        />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={estado === 'enviando'}
          className={cn(
            'inline-flex items-center justify-center rounded-[3px] bg-navy-700 px-7 py-3.5 font-medium text-ice-100',
            'transition-colors duration-300 hover:bg-navy-600 disabled:opacity-60',
          )}
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
        </button>
        <p className="font-mono text-[0.72rem] leading-relaxed text-slate-500">
          Respondemos em 24 horas úteis. Sem lista, sem sequência automática.
        </p>
      </div>

      {estado === 'erro' && (
        <p role="alert" className="sm:col-span-2 text-[0.94rem] text-alerta-700">
          {mensagemErro} Você também pode escrever direto para {EMPRESA.email}.
        </p>
      )}
    </form>
  );
}
