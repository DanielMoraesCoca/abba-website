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
