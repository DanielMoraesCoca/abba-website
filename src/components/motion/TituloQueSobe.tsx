/**
 * A manchete que sobe, palavra por palavra.
 *
 * ════════════════════════════════════════════════════════════════════════
 * Este é o único momento do site com animação de entrada palavra a palavra,
 * e a restrição é o ponto. Um site inteiro assim é um site que se exibe; um
 * site com um momento assim, na primeira tela e em nenhuma outra, é um site
 * que sabe onde o leitor está olhando.
 *
 * COMO FUNCIONA, E POR QUE SEM JAVASCRIPT.
 *
 * Cada palavra vira dois elementos: um invólucro com `overflow: hidden` e,
 * dentro dele, a palavra deslocada para baixo da própria altura. A animação
 * traz a palavra de volta ao zero, e o invólucro faz o resto: ela nasce de
 * trás de uma borda, como tipo saindo de uma matriz.
 *
 * A manchete está acima da dobra, então ela não espera observador nenhum: a
 * animação dispara no carregamento, e o escalonamento sai de `--i`, que é o
 * índice da palavra. Zero ouvintes de evento, zero quadros recalculados.
 *
 * AS TRÊS ARMADILHAS, E COMO CADA UMA ESTÁ TRATADA.
 *
 *   1. `overflow: hidden` corta descendente. O "q" de "que" e o "p" de
 *      "capacidade" desceriam abaixo da caixa da linha e seriam decepados.
 *      O invólucro ganha respiro embaixo e o desconta na margem: a caixa
 *      cresce para caber a perna da letra, e a linha não se mexe.
 *
 *   2. Deslocamento de leiaute. Nada muda de tamanho: o invólucro já ocupa
 *      a largura da palavra desde o primeiro quadro, e o que se move é o
 *      conteúdo dentro dele. O CLS medido continua zero.
 *
 *   3. Leitor de tela. O texto continua sendo o texto: um <h1> com as
 *      mesmas palavras e os mesmos espaços entre elas. Quebrar em <span>
 *      não quebra a leitura, e é por isso que o espaço vai FORA do
 *      invólucro, como texto de verdade, e não como margem em CSS.
 *
 * Quem pediu menos movimento recebe a manchete parada, já no lugar. Não uma
 * versão apressada da animação: nenhuma.
 * ════════════════════════════════════════════════════════════════════════
 */
export function TituloQueSobe({
  texto,
  className,
  as: Elemento = 'h1',
}: {
  readonly texto: string;
  readonly className?: string;
  /** `h1` na capa; qualquer outro nível onde a hierarquia pedir. */
  readonly as?: 'h1' | 'h2' | 'p';
}) {
  const palavras = texto.split(' ');

  return (
    <Elemento className={className} data-titulo-sobe>
      {palavras.map((palavra, i) => (
        // A chave carrega o índice porque a mesma palavra pode repetir na
        // frase, e duas chaves iguais fariam o React reaproveitar o nó
        // errado no meio de uma animação escalonada.
        <span key={`${palavra}-${i}`}>
          <span className="palavra" style={{ '--i': i } as React.CSSProperties}>
            <span>{palavra}</span>
          </span>
          {i < palavras.length - 1 ? ' ' : null}
        </span>
      ))}
    </Elemento>
  );
}
