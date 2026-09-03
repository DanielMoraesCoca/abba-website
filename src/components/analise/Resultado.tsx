'use client';

import { useState } from 'react';
import { Revelar } from '@/components/motion/Revelar';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { CampoTexto } from './Campos';
import { Decomposicao } from './Decomposicao';
import { formatarFaixa, ROTULO_DO_VETOR, type Estimativa, type Qualificacao } from '@/lib/analise/modelo';
import type { Narrativa } from '@/lib/analise/narrativa';
import { EMPRESA } from '@/content/identidade';
import { cn } from '@/lib/utils';

export interface RespostaAnalise {
  readonly empresa: string;
  readonly setor: string;
  readonly estimativa: Estimativa;
  readonly qualificacao: Qualificacao;
  readonly narrativa: Narrativa;
}

const CORES_DA_LEITURA: Record<Qualificacao['leitura'], string> = {
  'alvo-cheio': 'border-gold-500',
  'alvo-real': 'border-teal-500',
  'ainda-nao': 'border-slate-400',
};

/**
 * A tela de resultado — a "primeira página" do Mapa de Vazamento, na web.
 *
 * A ordem dos blocos não é estética, é doutrina (mapa-de-vazamento.md):
 *   1. a faixa em reais   — um número faz o leitor reagir
 *   1b. a conta desenhada — de que partes a faixa é feita
 *   2. o vetor            — por onde o dinheiro sai
 *   3. as premissas       — numeradas, com a base de cada uma
 *   4. o aviso de faixa   — foi calculado de fora
 *   5. as perguntas       — as que só ele pode responder
 *   6. a leitura do alvo  — inclusive quando ela é "hoje não somos a escolha"
 *
 * O aviso nunca fica atrás de um clique, e a leitura do alvo nunca é
 * suavizada. Recusa é nomeada, não disfarçada.
 */
export function Resultado({ dados, aoRecomecar }: {
  readonly dados: RespostaAnalise;
  readonly aoRecomecar: () => void;
}) {
  const { estimativa, qualificacao, narrativa, empresa } = dados;

  return (
    <div className="space-y-16">
      {/* 1 · A faixa */}
      <Revelar as="section">
        <Sobretitulo>Leitura preliminar · {empresa}</Sobretitulo>

        {estimativa.faixa ? (
          <>
            <p className="mt-7 text-[1rem] text-slate-600">
              Com o que você declarou, estimamos que esteja saindo, por ano, sem precisar sair:
            </p>
            <p className="nums mt-4 font-display text-[2.6rem] leading-[1.08] text-navy-700 sm:text-[3.6rem]">
              {formatarFaixa(estimativa.faixa)}
            </p>
            <p className="mt-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-gold-700">
              Faixa anual, em ordem de grandeza — nunca um número exato
            </p>
          </>
        ) : (
          <>
            <p className="mt-7 font-display text-[1.7rem] leading-snug text-navy-700 sm:text-[2.1rem]">
              Não vamos publicar uma faixa aqui.
            </p>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-[1.7] text-slate-700">
              {estimativa.motivoSemFaixa}
            </p>
          </>
        )}
      </Revelar>

      {/* 1b · A conta desenhada — só quando houve conta. */}
      {estimativa.decomposicao && (
        <Revelar as="section" className="border-t border-navy-700/15 pt-10">
          <Decomposicao estimativa={estimativa} />
        </Revelar>
      )}

      {/* 2 · O vetor */}
      <Revelar as="section" className="border-t border-navy-700/15 pt-10">
        <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
          O vetor principal
        </h2>
        <p className="mt-5 text-[1.3rem] leading-snug text-navy-700">
          {ROTULO_DO_VETOR[estimativa.vetor]}
        </p>
        <p className="mt-5 max-w-2xl text-[1.02rem] leading-[1.7] text-slate-700">
          {narrativa.vetorFrase}
        </p>
      </Revelar>

      {/* 3 · As premissas */}
      <Revelar as="section" className="border-t border-navy-700/15 pt-10">
        <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
          As premissas — numeradas, e cada uma com a sua base
        </h2>
        <ol className="mt-7 space-y-7">
          {estimativa.premissas.map((premissa, i) => (
            <li key={premissa.id} className="grid gap-4 sm:grid-cols-[2.5rem_1fr]">
              <span className="nums font-display text-[1.5rem] leading-none text-gold-600">
                {i + 1}
              </span>
              <div>
                <p className="text-[1rem] leading-[1.7] text-navy-700">{premissa.texto}</p>
                <p className="mt-2.5 text-[0.86rem] leading-relaxed text-slate-600">
                  <span
                    className={cn(
                      'mr-2 font-mono text-[0.68rem] uppercase tracking-[0.12em]',
                      premissa.tipo === 'evidencia' ? 'text-teal-600' : 'text-slate-500',
                    )}
                  >
                    {premissa.tipo === 'evidencia' ? 'Evidência externa' : 'Premissa da ABBA'}
                  </span>
                  {premissa.base}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Revelar>

      {/* 4 · O aviso de faixa — texto fixo, nunca escondido */}
      <Revelar as="section" className="bg-ice-200 p-7 sm:p-9">
        <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
          O limite honesto
        </h2>
        <p className="mt-5 text-[1rem] leading-[1.7] text-navy-700">{estimativa.aviso}</p>
      </Revelar>

      {/* 5 · As perguntas que só quem está dentro responde */}
      <Revelar as="section" className="border-t border-navy-700/15 pt-10">
        <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold-700">
          O que a gente perguntaria à sua diretoria
        </h2>
        <ul className="mt-7 space-y-5">
          {narrativa.perguntas.map((pergunta) => (
            <li key={pergunta} className="flex gap-4">
              <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-gold-500" />
              <p className="text-[1.05rem] leading-[1.65] text-navy-700">{pergunta}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[0.98rem] leading-[1.7] text-slate-600">
          {narrativa.oQueFaltaOlhar}
        </p>
      </Revelar>

      {/* 6 · A leitura do alvo */}
      <Revelar
        as="section"
        className={cn('border-l-2 pl-7', CORES_DA_LEITURA[qualificacao.leitura])}
      >
        <p className="nums font-mono text-[0.72rem] uppercase tracking-[0.2em] text-slate-500">
          Teste do alvo · {qualificacao.placar.toString().replace('.', ',')} de {qualificacao.maximo}
        </p>
        <h2 className="mt-4 font-display text-[1.5rem] leading-snug text-navy-700">
          {qualificacao.titulo}
        </h2>
        <p className="mt-4 max-w-2xl text-[1rem] leading-[1.7] text-slate-700">
          {qualificacao.texto}
        </p>
        <p className="mt-5 max-w-2xl text-[1rem] leading-[1.7] text-navy-700">
          <span className="font-medium">Próximo passo. </span>
          {qualificacao.proximoPasso}
        </p>
      </Revelar>

      <FormularioDeContato empresaSugerida={empresa} />

      <div className="flex flex-col gap-4 border-t border-navy-700/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.72rem] leading-relaxed text-slate-500">
          Texto de apoio gerado{' '}
          {narrativa.origem === 'modelo'
            ? 'com apoio de modelo de linguagem, sobre número calculado por modelo aritmético'
            : 'sem modelo de linguagem (modo determinístico)'}
          . O número nunca sai de um modelo de linguagem.
        </p>
        <button
          type="button"
          onClick={aoRecomecar}
          className="self-start font-mono text-[0.78rem] uppercase tracking-[0.12em] text-navy-700 underline-offset-4 hover:underline"
        >
          Refazer com outras respostas
        </button>
      </div>
    </div>
  );
}

function FormularioDeContato({ empresaSugerida }: { readonly empresaSugerida: string }) {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [armadilha, setArmadilha] = useState('');
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'ok' | 'erro'>('parado');
  const [mensagemErro, setMensagemErro] = useState('');

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado('enviando');
    setMensagemErro('');

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nome,
          cargo,
          email,
          empresa: empresaSugerida,
          origem: 'analise',
          website: armadilha,
        }),
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
      <section className="bg-navy-700 p-8 text-ice-200 sm:p-10">
        <h2 className="font-display text-[1.5rem] text-ice-100">Recebido.</h2>
        <p className="mt-4 max-w-xl text-[1rem] leading-[1.7] text-ice-200/80">
          Um sócio responde em 24 horas úteis com uma proposta de horário. A conversa é de 45
          minutos, são cinco perguntas, e a gente não apresenta nada nela — quem apresenta antes de
          entender vende o produto errado.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-navy-700 p-8 text-ice-200 sm:p-10">
      <h2 className="font-display text-[1.6rem] leading-snug text-ice-100">
        Quer o Mapa de Vazamento completo?
      </h2>
      <p className="mt-4 max-w-2xl text-[1rem] leading-[1.7] text-ice-200/75">
        O que você viu acima foi calculado com onze respostas. O Mapa completo é feito depois de uma
        conversa de 45 minutos e de uma pesquisa nossa sobre a sua empresa — e continua gratuito.
        Deixe um contato só se quiser essa conversa.
      </p>

      <form onSubmit={enviar} className="mt-8 grid items-end gap-5 sm:grid-cols-2" noValidate>
        <div className="[&_label]:text-ice-200 [&_input]:border-ice-200/25 [&_input]:bg-navy-800 [&_input]:text-ice-100 [&_p]:text-ice-300/60">
          <CampoTexto id="contato-nome" rotulo="Seu nome" valor={nome} aoMudar={setNome} obrigatorio />
        </div>
        <div className="[&_label]:text-ice-200 [&_input]:border-ice-200/25 [&_input]:bg-navy-800 [&_input]:text-ice-100 [&_p]:text-ice-300/60">
          <CampoTexto id="contato-cargo" rotulo="Cargo" valor={cargo} aoMudar={setCargo} />
        </div>
        <div className="sm:col-span-2 [&_label]:text-ice-200 [&_input]:border-ice-200/25 [&_input]:bg-navy-800 [&_input]:text-ice-100 [&_p]:text-ice-300/60">
          <CampoTexto
            id="contato-email"
            rotulo="E-mail corporativo"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            obrigatorio
          />
        </div>

        {/* Armadilha para robô — escondida de gente, visível para script. */}
        <div aria-hidden className="hidden">
          <label htmlFor="contato-website">Não preencha este campo</label>
          <input
            id="contato-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={armadilha}
            onChange={(e) => setArmadilha(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="inline-flex items-center justify-center rounded-[3px] bg-gold-500 px-7 py-3.5 font-medium text-navy-900 transition-colors duration-300 hover:bg-gold-400 disabled:opacity-60"
          >
            {estado === 'enviando' ? 'Enviando…' : 'Quero a conversa de 45 minutos'}
          </button>
          <p className="font-mono text-[0.72rem] leading-relaxed text-ice-300/50">
            Só usamos para responder. Nada de lista, nada de sequência automática.
          </p>
        </div>

        {estado === 'erro' && (
          <p role="alert" className="sm:col-span-2 text-[0.92rem] text-gold-300">
            {mensagemErro} Você também pode escrever direto para {EMPRESA.email}.
          </p>
        )}
      </form>
    </section>
  );
}
