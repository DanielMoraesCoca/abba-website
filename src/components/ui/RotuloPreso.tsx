import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { cn } from '@/lib/utils';

/**
 * O RÓTULO QUE PRENDE NO ALTO ENQUANTO A PROVA ROLA POR BAIXO.
 *
 * ════════════════════════════════════════════════════════════════════════
 * POR QUE ISTO NÃO É ENFEITE.
 *
 * Uma página longa que rola é uma sequência de seções. Uma página que
 * CONDUZ é uma sequência de passos, e a diferença entre as duas coisas é o
 * leitor saber, a qualquer momento, em qual deles está. A home da ABBA é um
 * argumento em cinco passos: se o leitor perde a conta no meio da prova, o
 * argumento vira uma pilha de blocos bonitos.
 *
 * Medido nas referências que o sócio escolheu: a Otsuka Air usa
 * `position: sticky` dezoito vezes. A ABBA usava zero. Era a técnica que
 * faltava, e é a última: depois dela, mais efeito piora.
 *
 * AS TRÊS REGRAS, E CADA UMA EXISTE POR UM MOTIVO.
 *
 *   1. UM POR VEZ. O rótulo é filho direto da coluna da seção, então ele
 *      prende dentro dela e solta quando ela acaba. Dois rótulos nunca
 *      disputam o topo, porque duas seções nunca ocupam o topo ao mesmo
 *      tempo. A regra sai de graça da estrutura; não é vigilância.
 *
 *   2. SAÍDA NATURAL NO FIM. Ninguém prende a rolagem, ninguém empurra a
 *      página para uma posição que o leitor não pediu. Rolar rápido
 *      continua funcionando. Sticky que não solta é rolagem sequestrada, e
 *      isso a casa já recusou por escrito.
 *
 *   3. FUNDO OPACO, DA COR DA SEÇÃO. Vem de `--fundo-secao`, que a `Secao`
 *      declara. Sem isso o conteúdo atravessa o rótulo enquanto passa por
 *      baixo, e o resultado não lê como camada: lê como defeito de
 *      renderização. É a mesma lição do cabeçalho de vidro, que custou uma
 *      fotografia no celular para ser aprendida.
 *
 * O `-mx` negativo com o mesmo `px` de volta estica o fundo até as bordas da
 * coluna sem mexer no alinhamento do texto: o que rola por baixo fica
 * mascarado de ponta a ponta, inclusive no vão de respiro da coluna.
 *
 * `z-30` fica abaixo do cabeçalho (`z-50`) de propósito: quando os dois se
 * encontram, quem cobre é o cabeçalho.
 * ════════════════════════════════════════════════════════════════════════
 */
export function RotuloPreso({
  children,
  invertido = false,
  className,
}: {
  readonly children: React.ReactNode;
  readonly invertido?: boolean;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        'sticky top-[var(--header-h)] z-30 -mx-6 bg-[var(--fundo-secao)] px-6 py-4 sm:-mx-8 sm:px-8',
        className,
      )}
    >
      <Sobretitulo invertido={invertido}>{children}</Sobretitulo>
      {/* O fio fica no fim do bloco preso, e não no começo: enquanto o
          rótulo está solto ele lê como um sublinhado do próprio rótulo;
          quando prende, vira a borda da camada que passou a existir. Um
          elemento, dois papéis, nenhum condicional. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-px',
          invertido ? 'bg-ardosia-clara/15' : 'bg-navy/10',
        )}
      />
    </div>
  );
}
