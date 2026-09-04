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

| Site | CSS lido | Feito à mão? |
|---|---|---|
| otsuka-air.jp | 328 KB | sim |
| sharplink.com | 3,09 MB | sim |
| hobro.digital | 105 KB | sim |
| alethia.earth | 266 KB (inline) | não — Framer |
| stateofaidesign.com | 640 KB (inline) | não — Framer |

Faltam três: paulkalkbrenner.net, pxpush.com, verostudio.com.

**O que está na seção "O vocabulário de movimento" abaixo foi medido no
código deles, não inferido.** É a diferença entre dizer "a transição é
suave" e ter os quatro números da curva.

Reproduzir o método: salvar como Arquivo web, subir aqui, e eu extraio com
`plistlib`. O script está em `scripts/ler-webarchive.py`.

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

Dos cinco lidos — todos premiados —, **quatro não têm uma única regra
`prefers-reduced-motion`**. O quinto, a hobro, tem exatamente uma:
`html { scroll-behavior: auto }`. Desliga a rolagem suave e deixa todas as
animações rodando.

Quem configurou o sistema operacional para reduzir movimento recebe a
animação inteira nos cinco. A ABBA respeita desde o começo, no bloco inteiro.
Não vamos abrir mão disso para parecer com eles.

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
