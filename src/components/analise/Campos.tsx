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
      <legend className="text-lede leading-snug text-navy">
        {pergunta.titulo}
      </legend>
      {pergunta.ajuda && (
        <p className="mt-3 max-w-2xl text-legenda leading-relaxed text-ardosia">
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
                'group flex cursor-pointer items-start gap-3.5 rounded-[3px] border px-5 py-4 transition-all duration-[var(--duration-micro)] ease-[var(--ease-micro)]',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy',
                selecionado
                  ? 'border-navy bg-navy/[0.04] shadow-[inset_2px_0_0_var(--color-ouro)]'
                  : 'border-navy/15 bg-branco hover:border-navy/40 hover:bg-papel/50',
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
                  selecionado ? 'border-navy bg-navy' : 'border-ardosia bg-transparent',
                )}
              />
              <span className="min-w-0">
                <span className="block text-corpo leading-snug text-navy">{opcao.rotulo}</span>
                {opcao.nota && (
                  <span className="mt-1 block text-legenda leading-relaxed text-ardosia">
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

/**
 * `tom` existe porque este campo aparece nos dois fundos do site: branco no
 * formulário de contato, navy no bloco que fecha a Análise. A primeira
 * versão resolvia isso com sobrescritas de classe no elemento pai
 * (`[&_label]:text-ardosia-clara`) — e elas alcançavam o rótulo mas esqueciam o
 * "(opcional)" e a linha de ajuda, que ficavam em ardósia escura sobre
 * navy: 2,8:1, reprovado. A auditoria pegou. Uma prop explícita não tem
 * como esquecer um pedaço.
 */
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
  tom = 'claro',
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
  readonly tom?: 'claro' | 'escuro';
}) {
  const escuro = tom === 'escuro';

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          'block text-legenda font-medium',
          escuro ? 'text-branco' : 'text-navy',
        )}
      >
        {rotulo}
        {!obrigatorio && (
          <span className={cn('ml-2 text-legenda', escuro ? 'text-ardosia-clara' : 'text-ardosia')}>
            (opcional)
          </span>
        )}
      </label>
      {ajuda && (
        <p className={cn('mt-1.5 text-legenda', escuro ? 'text-ardosia-clara' : 'text-ardosia')}>
          {ajuda}
        </p>
      )}
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
          'mt-3 w-full rounded-[3px] border px-4 py-3 text-corpo transition-colors duration-300',
          'focus:outline-none focus:ring-2 focus:ring-navy/40',
          escuro
            ? 'border-ardosia-clara/30 bg-navy-escuro text-branco placeholder:text-ardosia-clara'
            : 'border-navy/20 bg-branco text-navy placeholder:text-ardosia',
          erro && (escuro ? 'border-ouro-claro' : 'border-alerta'),
          !erro && (escuro ? 'focus:border-ardosia-clara/60' : 'focus:border-navy/50'),
        )}
      />
      {erro && (
        <p
          id={`${id}-erro`}
          role="alert"
          className={cn('mt-2 text-legenda', escuro ? 'text-ouro-claro' : 'text-alerta')}
        >
          {erro}
        </p>
      )}
    </div>
  );
}
