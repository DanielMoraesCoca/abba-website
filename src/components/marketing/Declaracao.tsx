import { Revelar } from '@/components/motion/Revelar';
import { Secao } from '@/components/ui/Secao';
import { colar } from '@/lib/tipografia';

/**
 * Uma afirmação e a sua explicação, lado a lado.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Existia como código idêntico em duas páginas, e nas duas era uma coluna
 * estreita centralizada: a forma de um parágrafo de documento, não de uma
 * página desenhada.
 *
 * A primeira tentativa de corrigir foi deslocar a coluna para a direita,
 * como na home. Fotografei antes e depois e a foto reprovou: numa coluna
 * de 46rem centralizada, empurrar 7rem só faz o bloco parecer mal
 * centralizado. O deslocamento funciona na home porque lá o contêiner é
 * largo e existe um vizinho de borda a borda para contrastar.
 *
 * O que funciona é usar a largura: afirmação à esquerda em escala maior,
 * explicação à direita em escala menor. A assimetria vem da proporção
 * (1,1 : 1) e do salto de tamanho, não de um recuo.
 *
 * `text-balance` equilibra o comprimento das linhas, mas não impede um
 * artigo de ficar pendurado no fim de uma delas — `colar` resolve isso.
 * ──────────────────────────────────────────────────────────────────────── */

export function Declaracao({
  titulo,
  texto,
  tom = 'gelo',
}: {
  readonly titulo: string;
  readonly texto: string;
  readonly tom?: 'claro' | 'gelo';
}) {
  return (
    <Secao tom={tom} espaco="amplo">
      <Revelar>
        <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <h2 className="text-balance text-[1.9rem] leading-[1.2] text-navy-700 sm:text-[2.4rem]">
            {colar(titulo)}
          </h2>
          <p className="max-w-[46ch] text-[1.06rem] leading-[1.7] text-slate-700 lg:pt-2">
            {texto}
          </p>
        </div>
      </Revelar>
    </Secao>
  );
}
