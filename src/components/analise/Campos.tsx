'use client';

import { cn } from '@/lib/utils';
import type { PerguntaFechada } from '@/lib/analise/perguntas';

/**
 * Os controles do formulário.
 *
 * Escolha de acessibilidade: as opções são `<input type="radio">` de
 * verdade, escondidos visualmente, com o rótulo inteiro clicável. Um
 * <div role="radio"> pareceria igual e se comportaria pior — teclado,
 * leitor de tela e autofill vêm de graça com o elemento nativo.
 */

export function GrupoDeOpcoes<T extends string>({
  pergunta,
  valor,
  aoMudar,
  colunas = 1,
}: {
  readonly pergunta: PerguntaFechada<T>;
  readonly valor: T | undefined;
  readonly aoMudar: (v: T) => void;
  readonly colunas?: 1 | 2;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-[1.22rem] leading-snug text-navy-700 sm:text-[1.4rem]">
        {pergunta.titulo}
      </legend>
      {pergunta.ajuda && (
        <p className="mt-3 max-w-2xl text-[0.94rem] leading-relaxed text-slate-600">
          {pergunta.ajuda}
        </p>
      )}

      <div className={cn('mt-7 grid gap-2.5', colunas === 2 && 'sm:grid-cols-2')}>
        {pergunta.opcoes.map((opcao) => {
          const selecionado = valor === opcao.valor;
          return (
            <label
              key={opcao.valor}
              className={cn(
                'group flex cursor-pointer items-start gap-3.5 rounded-[3px] border px-5 py-4 transition-all duration-300 ease-[var(--ease-abba)]',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-500',
                selecionado
                  ? 'border-navy-700 bg-navy-700/[0.04] shadow-[inset_2px_0_0_var(--color-gold-500)]'
                  : 'border-navy-700/15 bg-paper hover:border-navy-700/40 hover:bg-ice-200/50',
              )}
            >
              <input
                type="radio"
                name={pergunta.id}
                value={opcao.valor}
                checked={selecionado}
                onChange={() => aoMudar(opcao.valor as T)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'mt-[0.35rem] h-3 w-3 shrink-0 rounded-full border transition-colors duration-300',
                  selecionado ? 'border-navy-700 bg-navy-700' : 'border-slate-400 bg-transparent',
                )}
              />
              <span className="min-w-0">
                <span className="block text-[1rem] leading-snug text-navy-700">{opcao.rotulo}</span>
                {opcao.nota && (
                  <span className="mt-1 block text-[0.86rem] leading-relaxed text-slate-500">
                    {opcao.nota}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CampoTexto({
  id,
  rotulo,
  ajuda,
  valor,
  aoMudar,
  placeholder,
  tipo = 'text',
  obrigatorio = false,
  erro,
}: {
  readonly id: string;
  readonly rotulo: string;
  readonly ajuda?: string;
  readonly valor: string;
  readonly aoMudar: (v: string) => void;
  readonly placeholder?: string;
  readonly tipo?: 'text' | 'email' | 'tel';
  readonly obrigatorio?: boolean;
  readonly erro?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-medium text-navy-700">
        {rotulo}
        {!obrigatorio && <span className="ml-2 text-[0.82rem] text-slate-500">(opcional)</span>}
      </label>
      {ajuda && <p className="mt-1.5 text-[0.86rem] text-slate-500">{ajuda}</p>}
      <input
        id={id}
        type={tipo}
        value={valor}
        required={obrigatorio}
        placeholder={placeholder}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={cn(
          'mt-3 w-full rounded-[3px] border bg-paper px-4 py-3 text-[1rem] text-navy-700 transition-colors duration-300',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40',
          erro ? 'border-alerta-700' : 'border-navy-700/20 focus:border-navy-700/50',
        )}
      />
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-2 text-[0.86rem] text-alerta-700">
          {erro}
        </p>
      )}
    </div>
  );
}
