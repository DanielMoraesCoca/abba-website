# As referências, e o que cada uma ensina

> **Camada:** engenharia/desenho. Registra os sites que os sócios trouxeram
> como referência, o que foi possível apurar sobre cada um, e — o que
> importa — **qual decisão de desenho saiu daí**. Referência que não vira
> decisão é moodboard, e moodboard não se versiona.

## Uma limitação, e como ela foi contornada

O ambiente onde este site é construído tem saída de rede por lista de
permissão. **Nenhum dos oito domínios abre daqui.** A primeira versão deste
documento saiu só de busca — fichas do Awwwards, estudos de caso, imprensa
de design — e dizia onde eu não tinha visto com os próprios olhos.

Em 04/09 isso mudou. Daniel salvou três páginas pela Safari (Arquivo → Salvar
como → Arquivo web) e subiu os `.webarchive` aqui. Um webarchive é um plist
binário da Apple que embrulha o HTML, o CSS, as fontes e o JS da página
inteira. Deu para abrir e ler o código de produção de:

Oito lidas — sete de inspiração e uma que é outra coisa (ver abaixo).
Falta uma da lista original: paulkalkbrenner.net.

| Site | Feito | CSS | `clip-path` | `sticky` | `blend` | reduced-motion |
|---|---|---:|---:|---:|---:|---:|
| verostudio.com | à mão | 241 KB | **37** | 18 | 0 | **2** |
| pxpush.com | à mão | 62 KB | 15 | 6 | 9 | 0 |
| otsuka-air.jp | à mão | 320 KB | 7 | 18 | 0 | 0 |
| hobro.digital | à mão | 102 KB | 6 | 3 | 13 | 1 |
| sharplink.com | à mão | 3015 KB | 0 | 2 | 0 | 0 |
| alethia.earth | Framer | 259 KB | 2 | 2 | 2 | 0 |
| stateofaidesign.com | Framer | 625 KB | 2 | 4 | 0 | 0 |
| **ABBA hoje** | à mão | **16 KB** | **0** | **0** | 0 | **4** |

Duas leituras saltam da tabela.

**A primeira: `clip-path` é a técnica que nos falta.** As três referências
mais elogiadas e feitas à mão usam 37, 15 e 7 vezes; nós, zero. Não é
enfeite — é como se revela conteúdo sem depender de opacidade. A Vero anima
`inset(0 0 100%)` → `inset(0 0 0%)`, uma cortina que abre, e monta polígonos
a partir de uma variável CSS que o JavaScript atualiza:

```css
clip-path: polygon(calc(50% - 50% * var(--progress)) ... );
```

O deslocamento é do CSS; o JavaScript só escreve um número entre 0 e 1.

**A segunda: tamanho não é qualidade.** A Sharplink entrega 3 MB de CSS e
não usa `clip-path` uma vez sequer. A PX Push faz mais técnica em 62 KB.
A ABBA inteira são 16 KB de folha de estilo.

**O que está na seção "O vocabulário de movimento" abaixo foi medido no
código deles, não inferido.** É a diferença entre dizer "a transição é
suave" e ter os quatro números da curva.

Reproduzir o método: salvar como Arquivo web, subir aqui, e eu extraio com
`plistlib`. O script está em `scripts/ler-webarchive.py`.

## fatoanalytics.com não é referência. É concorrente.

> Lida em 08/09, a pedido. O que veio dela não é lição de desenho —
> é informação comercial, e por isso abre o documento.

**A Fato Analytics é uma consultoria brasileira de dados e IA.** A frase da
home é *"Profissionalizamos pessoas e negócios com Dados & IA"*. O gancho do
site é o **F-Score**, um índice de maturidade de gestão por dados em cinco
níveis, apresentado como uma caminhada presa à rolagem — o visitante desce e
os níveis avançam.

Ou seja: mesma praça, mesma promessa, e um índice de maturidade como porta
de entrada. A ABBA tem 25 dimensões e um Mapa de Vazamento; a Fato tem cinco
níveis e um F-Score. **A forma comercial é a mesma.**

E a coincidência estética é desconfortável:

| | Fato Analytics | ABBA |
|---|---|---|
| Corpo | Inter | Inter |
| Número e referência | JetBrains Mono | JetBrains Mono |
| Título | Aktiv Grotesk (sem serifa) | **Source Serif 4 (serifada)** |
| Curva-assinatura | `cubic-bezier(0.16, 1, 0.3, 1)` | `cubic-bezier(0.16, 1, 0.3, 1)` |

A curva é a mesma, dígito por dígito. Não houve cópia de lado nenhum — é
uma curva conhecida, a *expo out*, que qualquer um encontra nos mesmos
lugares. Mas duas casas do mesmo ramo, na mesma praça, com a mesma fonte de
corpo, a mesma fonte de número e a mesma curva de entrada, se parecem.

**O que hoje separa as duas é a serifa.** O título serifado da ABBA é o
único elemento tipográfico que a Fato não tem, e ele carrega o argumento
inteiro da casa: documento, laudo, coisa que se assina. Isso deixou de ser
uma escolha de gosto e passou a ser o diferencial visível.

Não mexi em nada por causa disso. Virou a pendência 12, com as opções.

**O que ela ensina de desenho:** o F-Score é o movimento 3 da proposta —
rolagem como linha do tempo — feito com GSAP + ScrollTrigger + Lenis. Vale
ver a ideia; a implementação não, pelo mesmo motivo já registrado: o Lenis
sequestra o scroll nativo. E é a terceira das oito a respeitar
`prefers-reduced-motion`.

## O vocabulário de movimento (medido)

### As curvas

| Site | Curva | Usos | Para quê |
|---|---|---|---|
| **Otsuka** | `cubic-bezier(.3,.26,.38,1)` | **66** | tudo que responde ao ponteiro |
| Otsuka | `cubic-bezier(.43,.05,.17,1)` | 5 | deslocamento de entrada |
| Sharplink | 20 curvas nomeadas (`--ease-out-expo`…) | — | conjunto Penner inteiro em variáveis |
| Alethia | nenhuma | 0 | é um site Framer: o movimento é todo JS |

A Otsuka usa **uma curva para quase tudo** e uma segunda só para entradas. É
o oposto de inventar uma curva por componente — e é o que a ABBA já fazia,
com a diferença de que ela separa os dois papéis e nós usávamos uma só.

### A linha que mais ensinou

```css
transition:
  transform 1.1s calc(var(--index) * .04s)        cubic-bezier(.43,.05,.17,1),
  opacity    .7s calc(var(--index) * .04s + .3s)  cubic-bezier(.3,.26,.38,1);
```

Três decisões numa linha só, todas contra o instinto:

1. **`transform` e `opacity` não compartilham nada** — nem duração (1,1s vs
   0,7s), nem curva, nem atraso.
2. **A opacidade entra 300 ms DEPOIS do deslocamento.** O elemento começa a
   se mover ainda invisível e só então materializa. É o que separa um bloco
   que *chega* de um bloco que *pisca*.
3. **O escalonamento é aritmética de CSS** sobre `--index`, a 40 ms.

### Os números que dão a "sensação"

- **Otsuka** — durações: `.3s` (23×) para ponteiro, `.5s` (28×) para estado,
  `1.1s` para entrada. Três magnitudes de deslocamento: `translate3d(0,100%,0)`,
  `50%`, `10%`. E 18 usos de `position: sticky` — a página prende blocos
  enquanto o resto rola.
- **Alethia** — `lerp: 0.12` no Lenis. É o número que dá o peso premium: a
  página persegue o seu scroll com 12% de aproximação por quadro. Molas em
  `stiffness: 400–550`, `damping: 25–50`, `mass: 1`.
- **Sharplink** — uma família só, duas larguras: `Archivo` (4000 usos) e
  `Archivo Narrow` (2400). Identidade tipográfica sem custo de segunda fonte.

### O segundo lote, e um resultado negativo

**stateofaidesign.com não ensina quase nada, e o motivo importa.** São 640 KB
de CSS, mas é um site Framer — o mesmo estúdio da Alethia. Os 12 usos de
`mask-image` que pareciam técnica de desenho são ícones do próprio Framer, e
os 52 blocos `@supports` são detecção de Safari da plataforma. O que sobra do
designer: uma curva, `cubic-bezier(.44,0,.56,1)` (simétrica, suave), e
durações curtíssimas — `.15s` e `.2s`. Isso corrobora o nosso `--ease-micro`
a 240 ms; não muda nada.

A lição de método: **num site Framer, o CSS é da ferramenta, não de quem
desenhou.** Vale ver, não vale copiar. Dos cinco lidos, dois são assim.

**hobro.digital é feita à mão, e é a mais densa por byte.** 105 KB de CSS —
um trigésimo da Sharplink — e mais técnica dentro.

| Técnica | Uso | O que faz |
|---|---|---|
| `mix-blend-mode: difference` | 10× | inverte o elemento contra o que passa atrás |
| `cubic-bezier(.785,.135,.15,.86)` | 12× | *easeInOutCirc*, a 1s–1,2s, para momentos grandes |
| `transition: clip-path 1s` | 1× | revelação por corte, não por opacidade |
| quatro papéis tipográficos | — | `--font-title`, `--font-text`, `--font-typewriter`, `--font-cursive` |

O achado é este:

```css
.header.header-inverse { mix-blend-mode: difference }
```

O cabeçalho da hobro **não sabe onde a página está — ele reage ao que passa
por baixo.** Sobre claro fica escuro, sobre escuro fica claro, sem
JavaScript e sem medir scroll.

O nosso faz o contrário: `scrollY > 24` decide entre transparente-com-texto-
gelo e claro-com-texto-navy. É um palpite sobre o que está atrás, e ele só
acerta porque toda página começa com capa escura. Ver a discussão em
`pendencias.md` — a técnica da hobro garante contraste mas destrói cor de
marca, e o ouro e o navy da ABBA não são negociáveis.

### Onde nós estamos à frente

**Correção.** Eu escrevi, com três e depois com cinco sites lidos, que
nenhuma referência respeitava `prefers-reduced-motion`. Com sete lidos isso
não se sustenta: a **Vero respeita, e tão bem quanto nós** — o mesmo reset
universal, mais uma degradação pensada.

O placar honesto: das sete, **cinco ignoram**, a hobro tem uma regra mínima
(`html { scroll-behavior: auto }`, que desliga a rolagem suave e deixa as
animações rodando) e a Vero cobre de verdade.

E a Vero ensina uma distinção que vale mais que o placar. O reset universal
congela tudo em `0.01ms`; para a maioria dos elementos isso basta, porque o
estado final é o estado certo. Mas há elementos cujo estado congelado não
serve — e para esses ela dá um estado **substituto**:

```css
@media (prefers-reduced-motion: reduce) {
  .ScrollCue .chevron { opacity: .45; animation: none }
}
```

A seta que pulsava não some nem trava: fica visível e parada, a 45%.

Isso a ABBA já fazia em quatro lugares — `[data-revelar]` volta a
`opacity: 1; transform: none`, `[data-passo]` perde a animação, a transição
de rota é anulada, e a constelação em canvas desenha o quadro final e para.
Aqui a Vero confirma o método em vez de corrigi-lo.

### O que foi lido e recusado

**Lenis / scroll suave por JS** (Alethia). Sequestra o scroll nativo, quebra
`Ctrl+F`, atrapalha leitor de tela, e custa uma biblioteca no orçamento de
420 KB. A sensação é boa; o preço é alto e recai sobre quem já tem menos.
Fica de fora.

**As 20 curvas nomeadas** (Sharplink). Um catálogo de easing é liberdade para
cada componente inventar a sua — exatamente o que faz um site perder a cara.
Duas curvas com papéis definidos, não vinte à disposição.

## As decisões que saíram da leitura do código

| # | Decisão | Onde |
|---|---|---|
| 1 | `transform` lidera, `opacity` entra 160 ms depois | `globals.css` |
| 2 | Duas curvas com papel: `--ease-abba` (entrada) e `--ease-micro` (ponteiro) | `globals.css` |
| 3 | Entrada mais longa (900 ms) e fade mais curto (560 ms) | `globals.css` |
| 4 | Micro-interação a 240 ms, não 300 | 6 componentes |
| 5 | Escalonamento de 90 ms para 60 ms | `globals.css` |
| 6 | `--ease-abba-reverso` para o que sai de cena | `globals.css` |
| 7 | Revelação por corte (`clip-path`), em três lugares | `globals.css`, `Revelar.tsx` |
| 8 | Cabeçalho ciente do que passa por baixo | `Cabecalho.tsx`, `Secao.tsx` |
| 9 | Escalonamento corrigido de verdade: 40–80 ms | 8 páginas |
| 10 | Afirmação e explicação lado a lado | `Declaracao.tsx` |
| 11 | Artigo curto não fica pendurado no fim da linha | `lib/tipografia.ts` |
| 12 | A primeira pergunta da Análise na porta da home | `PrimeiraPergunta.tsx` |
| 13 | A contagem de perguntas derivada do esquema | `analise/schema.ts` |
| 14 | Régua de progresso, em CSS puro | `globals.css` |

A 14 é a resposta ao movimento 3, e ela saiu de uma medição, não de uma
vontade. As páginas foram medidas: a home tem 15 telas no celular,
`/o-que-fazemos` 13, `/evidencias` quase 13. O problema real numa página
dessas não é falta de espetáculo — é o leitor não saber quanto falta.

A leitura fácil de "rolagem como linha do tempo" seria prender uma seção e
avançá-la degrau a degrau, como a fatoanalytics.com faz com o F-Score
usando GSAP + ScrollTrigger + Lenis. Não foi o caminho, e os dois motivos
importam:

1. Os candidatos naturais — a régua do Programa e as sete camadas — fazem
   o argumento **por serem vistos inteiros**. "A primeira saída acontece
   muito cedo" depende de ver os três portões de uma vez; "da quarta camada
   para baixo é outro lugar" depende de ver o claro e o escuro juntos.
   Revelar degrau a degrau enfraqueceria as duas.
2. Prender a rolagem tira do leitor o controle de passar rápido. Num site
   que se lê, isso é custo.

O que a medição pedia era dizer ONDE a pessoa está. Um fio dourado — o
mesmo que separa as seções — enchendo conforme a página anda.

E isso o CSS faz sozinho: `animation-timeline: scroll()` liga a animação à
barra de rolagem sem um único ouvinte de evento. **Zero JavaScript** contra
as três bibliotecas da Fato, e o orçamento de rede não mexeu um byte. Onde
o navegador não suporta, o `@supports` não aplica e a régua não existe.

A 10 saiu de uma tentativa **reprovada**, e isso vale registrar. O plano era
espalhar o `alinhamento="deslocada"` da home para as sete páginas internas —
o movimento 1 da proposta, "sete seções, uma forma só". Fotografei antes e
depois com o Chromium e olhei: numa coluna de 46rem centralizada, empurrar
7rem para a direita não quebra eixo nenhum, só faz o bloco parecer mal
centralizado. O deslocamento funciona na home porque lá o contêiner é largo
e existe um vizinho de borda a borda para contrastar.

Revertido. O que funciona é usar a largura — afirmação à esquerda em escala
maior, explicação à direita em escala menor —, e esse padrão já existia na
seção da Assinatura, no `programa`. `Declaracao` não inventa forma: alinha
duas páginas com a linguagem que a casa já tinha.

E o diagnóstico da proposta não se sustentou depois de olhar o conteúdo.
Das sete seções estreitas, duas eram o mesmo bloco copiado (viraram
`Declaracao`), três são fechamentos centralizados com botão — e
centralizado é a forma certa para um fecho — e duas são argumento longo,
onde coluna estreita é a medida certa para leitura. Cinco das sete já
estavam certas.

A 9 corrigiu um erro **meu**, da decisão 5. Eu baixei o escalonamento de
90 ms para 60 ms no `globals.css` e declarei a mudança feita. Ela não teve
efeito nenhum: `RevelarLista` injeta `--passo` como estilo em linha, e todos
os 25 chamadores passavam o próprio valor — de 70 a 120 ms. Estilo em linha
vence token. Agora o componente só injeta quando quem chama pede outro
valor, e os 25 chamadores foram reescalonados para uma escada de 40 a 80 ms,
com piso de 40 — o valor medido na Otsuka. A espera do décimo segundo item
caiu de 1320 ms para 880 ms.

A lição, que vale mais que o número: **uma mudança em token não é uma
mudança até você conferir que ninguém a sobrepõe.**

A 6 corrigiu um erro nosso. A saída da transição de rota usava
`--ease-abba` — uma curva de **entrada**, que desacelera forte no fim.
Numa saída isso faz o elemento perder quase toda a opacidade nos primeiros
quadros e depois pairar quase invisível: parece travamento. A Vero mantém o
par `--ease-custom-1` / `--ease-custom-1-reverse`, e espelhar é aritmética —
`cubic-bezier(x1,y1,x2,y2)` vira `cubic-bezier(1-x2,1-y2,1-x1,1-y1)`.

As 20 referências de regressão visual passaram sem regravar nenhuma: a
mudança é de tempo, não de estado final.

## O padrão que os oito sites revelam

Sete dos oito puderam ser identificados. E eles não são um apanhado de
gostos: são um conjunto coerente.

| Site | O que é | Quem fez | Reconhecimento |
|---|---|---|---|
| **alethia.earth** | Climate-tech: verificação de impacto ambiental em tempo real | ++hellohello | Site of the Day (Awwwards e FWA) |
| **stateofaidesign.com** | O relatório *AI in Design 2026*, do Designer Fund | ++hellohello | Referência do ano no assunto |
| **sharplink.com** | Empresa de capital aberto | Studio Freight | SOTD · 7,38/10 · categoria Business & Corporate |
| **hobro.digital** | Agência de design | (própria) | SOTD · 7,29/10 |
| **pxpush.com** | Estúdio de design por assinatura | (próprio) | SOTD |
| **verostudio.com** | Esculturas sob medida a partir de vestidos de noiva | — | SOTD |
| **paulkalkbrenner.net** | Músico alemão | — | Indicado |
| otsuka-air.jp | Não localizado em busca | — | — |

**Dois dos oito são do mesmo estúdio** (++hellohello, de Montevidéu), e os
dois resolvem exatamente o problema de comunicação da ABBA: fazer conteúdo
técnico e denso parecer claro e confiável.

Isso não é gosto por espetáculo. É gosto por **rigor bem apresentado**.

## O que cada referência ensinou, e o que virou código

### Alethia — a linguagem visual da marca vira estrutura

O estúdio descreve o problema assim: *traduzir dado científico complexo numa
experiência clara e confiável para público não técnico, sem sacrificar rigor
nem credibilidade* — e o risco a evitar: *cair na abstração científica ou no
otimismo de superfície*. Trocando "ambiental" por "de IA", é a frase de
abertura da ABBA.

A resposta deles: um **sistema modular construído sobre regras e
comportamentos, não sobre um conjunto de imagens fixas**, com diagramas de
rede como linguagem visual e tipografia analítica (Beausite Classic +
Geist Mono).

**O que virou código:** [`Grafo.tsx`](../src/components/brand/Grafo.tsx). A
marca da ABBA já É um grafo — faltava usá-lo como *estrutura* e não como
enfeite de capa. A `FaixaDeGrafo` é o único elemento do site que ignora a
coluna, e é isso que a faz funcionar como marco entre seções. Determinística,
sem JavaScript, poucos quilobytes.

E a lição mais profunda — sistema de regras em vez de ativos fixos — já é o
que a ABBA tem: tokens com contraste medido, régua do revisor, orçamento de
desempenho. Isso não precisou mudar; precisou ser reconhecido como o ativo
que é.

### SharpLink — disciplina cromática numa empresa séria

Site de empresa de capital aberto, categoria Business & Corporate, Site of
the Day com **duas cores**: um azul e um cinza claro. Notas: desenho 7,44 ·
usabilidade 7,25 · criatividade 7,5 · conteúdo 7,25.

**O que ensinou, e é uma correção de expectativa:** o prêmio se ganha na
faixa de 7,3 a 7,4, não em 9. E se ganha **na nossa categoria**, com uma
paleta tão restrita quanto a nossa. A ABBA já é navy + dourado sobre branco.
A disciplina não precisa mudar — precisa ser executada com mais composição.

### State of AI Design — um relatório que é um site

Análise escrita, visualização de dados, vídeo e casos interativos numa peça
só, "sem desabar sob o próprio peso". O estúdio construiu **uma ferramenta
própria para gerar visualizações de dados no idioma da marca**.

**O que ensinou:** é o caminho natural da página de [evidências](../src/app/evidencias/page.tsx),
que hoje é uma lista bem tratada e poderia ser a peça de referência do
mercado brasileiro sobre o assunto. E valida a direção do gráfico da
decomposição: número da casa, desenhado no idioma da casa.

## As decisões que saíram desta pesquisa

1. **A faixa de grafo** como marco estrutural entre seções — uma vez na
   página, de borda a borda. A primeira tentativa colocou duas; a segunda
   foi removida, porque recurso usado duas vezes deixa de ser marco e vira
   maneirismo.
2. **A tese dos 70% em escala de display** ([`Tese.tsx`](../src/components/marketing/Tese.tsx)).
   Contraste de escala é o instrumento de composição mais barato que existe.
   **A ressalva vai no mesmo bloco**: dar escala a um número e esconder a
   ressalva noutra tela seria o truque que a régua do revisor existe para
   impedir.
3. **Hierarquia entre os três caminhos** — a grade é 1,35 : 1 : 1. O Mapa de
   Vazamento é a porta única e é gratuito; dar a ele a mesma largura dos
   outros seria desenhar um cardápio, que é o que a doutrina proíbe. A
   hierarquia visual passou a repetir a hierarquia comercial.
4. **`alinhamento="deslocada"`** na `Secao`. Depois de cinco seções alinhadas
   à esquerda, o olho decorou a linha vertical. Quebrá-la é o que faz a
   próxima seção ser lida em vez de folheada.

## O que continua faltando, e nenhuma referência resolve

**Fotografia.** Todas as oito referências têm direção de arte com imagem
real. A ABBA não tem nenhuma, e banco de imagem está fora de questão —
executivo genérico apontando para gráfico contradiz o manifesto inteiro.
Duas fotos boas dos sócios, luz natural, um fotógrafo, uma tarde. É a
pendência 7.
