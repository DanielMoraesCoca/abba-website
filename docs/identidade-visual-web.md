# Identidade visual na web: a régua derivada

> **Camada:** engenharia. Este documento explica como a paleta canônica do
> [`abba-ops/00-identidade/identidade-visual.md`](https://github.com/DanielMoraesCoca/abba-ops)
> vira um sistema de tela. Ele **não substitui** aquele documento: se os dois
> divergirem, o abba-ops ganha e este arquivo é corrigido.
>
> **Pendência:** os degraus derivados abaixo devem ser registrados de volta no
> abba-ops (a regra de lá diz "nunca introduzir cor nova sem registrar aqui").
> Derivação de luminância da mesma matiz não é cor nova — mas o registro
> continua sendo obrigatório.

## Por que existem degraus além dos seis hexadecimais

Papel impresso tem uma superfície só. Tela tem estado: repouso, foco, passagem
do mouse, desabilitado, texto sobre fundo escuro, texto sobre fundo claro. Com
seis cores não dá para atender contraste AA em todos esses estados sem
inventar cinza aleatório na hora — que é exatamente como uma identidade se
dissolve.

Então cada matiz canônica ganhou uma rampa. **Todas as rampas foram geradas a
partir da cor canônica**, movendo só luminância. Nenhuma matiz nova entrou.

| Papel | Canônica | Token | Degraus derivados |
|---|---|---|---|
| Primária · azul-marinho | `#1B2A4A` | `--color-navy-700` | 300 a 950 |
| Acento · dourado | `#C2A35B` | `--color-gold-500` | 100 a 800 |
| Neutro escuro · ardósia | `#5A6472` | `--color-slate-600` | 400 a 800 |
| Neutro claro · gelo | `#E8E8E8` | `--color-ice-400` | 100 a 500 |
| Apoio · petróleo | `#2E8B9A` | `--color-teal-500` | 100, 400, 600, 700 |
| Base · branco | `#FFFFFF` | `--color-paper` | — |

Uma exceção declarada: **`--color-alerta-700` (`#9A2A2A`)**, o vermelho de erro
de formulário. Material impresso não tem campo inválido, então a paleta
canônica nunca precisou dele. É o mínimo necessário para sinalizar erro com
contraste AA sobre branco, dessaturado para não brigar com o navy. **Precisa
ser registrado no abba-ops.**

## Os degraus que o contraste define, não a estética

Três valores da rampa **não** foram escolhidos por gosto. Eles são o degrau
mais claro que ainda passa nos 4,5:1 que a WCAG 2.2 AA exige para texto
pequeno — que é justamente onde eles aparecem:

| Token | Valor | Sobre branco | Sobre gelo | O que reprovava antes |
|---|---|---|---|---|
| `--color-gold-700` | `#836B34` | 5,1:1 | 4,8:1 | `#8C7439` dava 4,32 |
| `--color-slate-500` | `#66707D` | 5,0:1 | 4,7:1 | `#79828F` dava 3,89 |
| `--color-alerta-700` | `#9A2A2A` | 7,5:1 | — | (nasceu correto) |

`--color-slate-400` fica abaixo do piso **de propósito**: é reservado a
placeholder e a controle desabilitado, que a norma isenta. Não use em texto
que o leitor precise ler.

### Piso de opacidade em texto sobre fundo escuro

Escurecer texto com opacidade é confortável de escrever e é como o contraste
se perde sem ninguém notar. Medido sobre o navy:

| Cor | Opacidade mínima |
|---|---|
| `ice-100` / `ice-200` / `ice-300` | 0,60 |
| `gold-400` | 0,75 |
| `gold-500` | 0,85 — prefira o `gold-400` cheio |

A auditoria automática (`tests/e2e/acessibilidade.spec.ts`) derruba o build
se algum desses pisos for furado. Ela roda o axe-core com as regras WCAG 2.2
AA nas onze páginas, em desktop e celular.

## Como o dourado se comporta

O documento canônico diz: "usar com parcimônia". Na web isso virou regra
executável — o dourado aparece em exatamente quatro lugares:

1. o sobretítulo de seção (`Sobretitulo`), com o traço curto à esquerda;
2. o fio divisor (`.rule-gold`), que desvanece nas pontas em vez de ser uma
   régua cheia;
3. os marcadores de lista (o traço de 12px antes do item);
4. números de destaque sobre fundo navy.

**O dourado nunca é fundo de área grande** e nunca é cor de corpo de texto.
Sobre branco ele não passa em contraste AA para texto pequeno — por isso o
texto dourado em fundo claro usa `gold-700`, não `gold-500`.

## Tipografia

| Papel | Fonte na web | O que ela traduz |
|---|---|---|
| Títulos | Source Serif 4 | Aptos Display dos documentos |
| Corpo | Inter | mesma escolha da Plataforma ABBA |
| Número, prazo, referência | JetBrains Mono | o tom "número, prazo, nome" |

Aptos não é distribuída para web, e usar uma imitação seria pior que uma
escolha declarada. Source Serif dá o mesmo peso editorial sóbrio.

Números comparáveis usam `.nums` (numeral tabular): coluna que dança destrói a
leitura de qualquer tabela ou faixa em reais.

## Movimento

Uma curva (`--ease-abba`), uma distância (18px), uma duração (720ms). Tudo que
entra em cena usa `Revelar`. O escalonamento de lista é 90ms entre itens.

`prefers-reduced-motion` é tratado em **um** lugar (`globals.css`) e mais uma
vez nos componentes de movimento, que renderizam o elemento estático em vez de
animar mais rápido. Quem pediu menos movimento recebe o conteúdo posicionado,
não uma versão apressada da animação.

## A constelação

A marca da ABBA é um grafo de nós dourados. A capa usa essa mesma ideia em
movimento, num canvas único, com malha gerada por PRNG de semente fixa —
**a mesma malha em toda visita**. Capa que muda a cada recarga não é
identidade, é ruído.


## A escala tipográfica (11/09)

> Reconstruída depois de uma auditoria. O que existia não era escala.

**O diagnóstico, com número.** O site tinha **53 tamanhos de fonte
distintos** e **zero `clamp()`**. Medido contra o CSS de produção das
referências que os sócios trouxeram:

| Site | Tamanhos | `clamp()` |
|---|---:|---:|
| PX Push | 7 | 7 |
| Hobro | 9 | 165 |
| Vero | 12 | 9 |
| Sharplink | 15 | 0 |
| Fato Analytics | 18 | 12 |
| Otsuka Air | 25 | 3 |
| **ABBA (antes)** | **53** | **0** |

O pior grupo era o corpo: `0.98`, `1`, `1.02`, `1.04`, `1.05`, `1.06` e
`1.08rem` — sessenta e cinco usos para a mesma coisa. Ninguém enxerga a
diferença entre 1,02 e 1,05; todo mundo sente que nada está em proporção.
É isso que faz uma página parecer básica mesmo com cor, espaço e conteúdo
certos.

**Onze degraus, cada um fluido.** Interpolam entre 360px e 1440px de
viewport. Isso eliminou os **25 saltos por breakpoint**: o tipo cresce
continuamente em vez de pular no `sm:`, que é a diferença entre um desenho
e três desenhos costurados.

**Entrelinha e espacejamento vêm com o degrau**, e é aí que a escala deixa
de ser uma lista de tamanhos e vira tipografia. Duas regras óticas:

- Quanto maior o tipo, **menor a entrelinha** — de 1,68 no corpo a 0,82 no
  numeral de display. Em 4rem, entrelinha de corpo abre buracos e a frase
  deixa de ler como unidade.
- Quanto maior o tipo, **mais apertado o espacejamento** — de 0 no corpo a
  −0,042em no display. O olho julga o espaço em proporção à altura do
  caractere, não em valor absoluto. Serifada grande com espacejamento de
  texto corrido é a marca mais confiável de site feito sem tipógrafo, e era
  o nosso caso.
- O mono vai no sentido contrário: **+0,18em**. Versalete curto precisa de
  ar para não virar borrão.

**Ganho colateral de acessibilidade:** os dois menores tamanhos do site
(`0.55rem` na assinatura da marca e `0.66rem` no rodapé) subiram para o
piso de `0.7rem`. As quinze auditorias do axe continuam passando.

**O que NÃO mudou, e é decisão dos sócios:** as famílias. Source Serif 4
nos títulos, Inter no corpo, JetBrains Mono nos números. A escala é
estrutura e não tem risco de marca; trocar a família é outra conversa —
ver pendência 16.
