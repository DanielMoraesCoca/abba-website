# abba-website

O site institucional da ABBA Consultoria de IA — `abbaservices.com.br`.

> **A fonte da verdade do negócio é o repositório [`abba-ops`](https://github.com/DanielMoraesCoca/abba-ops).**
> Todo texto deste site é tradução de um documento de lá. Se os dois
> divergirem, o abba-ops ganha e este repositório é corrigido — nunca o
> contrário. Não escreva copy nova aqui sem mudar lá primeiro.

## O que este site é

Uma peça externa que precisa fazer três coisas:

1. **Dizer, na primeira frase, o que não dá para fazer de dentro de uma
   empresa** — construção em escala e prova de terceiro. É regra de
   posicionamento, não escolha de redação.
2. **Publicar as evidências e os limites**, inclusive os números que a casa
   proibiu de usar. Uma empresa que vende prova e cita número de folclore
   está morta na primeira reunião com um cético técnico.
3. **Abrigar a Análise ABBA**, a versão web do Mapa de Vazamento: a peça de
   abertura gratuita, que devolve uma faixa em reais com as premissas na mesa.

## Rodando

```bash
npm install
cp .env.example .env.local   # opcional: sem chave, o site funciona igual
npm run dev                  # http://localhost:3000
```

```bash
npm run check      # typecheck + lint + 95 unitários + build
npm run test:e2e   # 98 testes de ponta a ponta (Chromium, desktop e celular)
npm run medir      # desempenho real, com orçamento que falha se estourar
npm run test:visual  # regressão visual contra as referências versionadas
```

Os 98 testes de ponta a ponta incluem uma auditoria **WCAG 2.2 AA** com
axe-core nas onze páginas, em desktop e celular. Ela derrubou seis
violações reais de contraste na primeira execução e hoje trava o build se
alguma voltar — inclusive uma que forçou um diagrama melhor
(`docs/identidade-visual-web.md`).

**O site funciona sem `ANTHROPIC_API_KEY`.** A Análise ABBA cai no texto
determinístico e o número — que nunca dependeu do modelo — sai idêntico.

## A estrutura

```
src/
  app/            rotas (App Router) + duas rotas de API
  components/
    brand/        a marca-símbolo em SVG e a constelação da capa
    ui/           primitivas: Container, Secao, Botao, Sobretitulo
    motion/       Revelar — a transição de entrada da casa, uma só
    marketing/    blocos das páginas
    analise/      o assistente da Análise ABBA
  content/        TODO o texto do site, tipado. Traduzido do abba-ops
  lib/
    analise/      o domínio da análise: perguntas, premissas, modelo, narrativa
    seo.ts        metadados e dados estruturados
    limite.ts     limite de taxa por IP
    leads.ts      a porta de saída para o funil comercial
tests/unit/       incluindo a régua do revisor
docs/             a régua visual da web e as pendências
```

## As três decisões que estruturam este código

### 1. Nenhum número aparece sem a fonte

O tipo `Evidencia` exige fonte, ano e nível de confiança. O componente
`NumeroComFonte` renderiza os três juntos, no mesmo bloco, sem hover e sem
clique. **Não existe caminho de código que mostre um número da ABBA sem
mostrar de onde ele veio.** O índice proibido de `base-de-evidencias.md` está
versionado em `content/evidencias.ts`, e o teste `regua-do-revisor.test.ts`
varre o repositório inteiro atrás dele a cada `npm test`.

Esse mesmo teste checa vocabulário (nunca "curso de IA", nunca "auditamos",
nunca nome interno de ferramenta) e domínio (só `abbaservices.com.br`).

### 2. Texto livre do visitante é tratado como dado, nunca como instrução

Nome da empresa e setor são os únicos campos livres que chegam ao modelo de
linguagem — e por isso são a superfície de injeção de prompt do site. A
defesa é em três camadas: o esquema recusa quebra de linha, caractere de
controle e qualquer coisa fora do conjunto que um nome de empresa
brasileiro usa; o prompt entrega esses valores delimitados e declarados
como dado; e a saída passa pela verificação de número antes de aparecer na
tela.

### 3. O número é aritmética; o modelo de linguagem só escreve a prosa

Na Análise ABBA:

- `lib/analise/modelo.ts` **produz o número** — uma conta que qualquer CFO
  refaz no guardanapo, com as premissas declaradas ao lado.
- `lib/analise/narrativa.ts` **produz o texto em volta** — o vetor em
  linguagem de negócio e as perguntas que só quem está dentro responde.

O modelo é proibido de citar qualquer cifra, e a proibição não é só uma
instrução no prompt: `contemNumeroProibido()` verifica a saída e descarta a
geração inteira se um número escapar, caindo no texto determinístico. Um
número que saiu de um modelo de linguagem não é auditável, e a casa vende
auditabilidade.

As cinco regras de honestidade do Mapa de Vazamento estão travadas em teste:
faixa nunca ponto, premissa sempre com base declarada, sem piso artificial,
aviso de faixa sempre renderizado, e nada persistido.

### 4. O resultado da Análise é um documento

A ABBA vive de documento — proposta, relatório, termo —, e quem termina a
análise vai levar aquilo para a diretoria. A folha de estilo de impressão
entrega um documento com a assinatura da casa em vez de uma captura da
página com menu no meio do argumento; o gráfico da conta carrega
`print-color-adjust: exact`, senão sumiria do papel (fundo de elemento não
imprime por padrão) e levaria junto a prova de que a conta é conferível.

### 5. A análise não cobra nada — nem cadastro

O resultado aparece **antes** de qualquer formulário. Cadastro obrigatório é
uma forma de cobrança, e o Mapa de Vazamento nunca se cobra. Nada das
respostas é gravado: elas entram, o resultado sai, a requisição acaba.

## Desempenho

Medido contra o build de produção (`npm run medir`), em rede local:

| | rede | parse | LCP | CLS |
|---|---|---|---|---|
| Home | 318 KB | 873 KB | ~1,0 s | 0 |
| Demais páginas | ~305 KB | ~810 KB | ~0,95 s | 0 |

**Rede** é o que atravessa o cabo, já comprimido; **parse** é o que o
navegador tem que interpretar. Reportar um pelo outro seria o tipo de número
impreciso que esta casa não publica, então os dois aparecem.

Três decisões que produziram esses números, em ordem de efeito:

1. **A biblioteca de animação saiu.** Ela custava mais de 100 KB em toda
   página para fazer opacidade e dez pixels de deslocamento. No lugar: um
   `IntersectionObserver` compartilhado e duas propriedades de CSS
   (`components/motion/Revelar.tsx`). Mesmo resultado na tela.
2. **O prefetch do menu e do rodapé foi desligado.** Dezoito links visíveis
   prefaziam a rota inteira antes de o visitante demonstrar qualquer
   intenção — 231 KB, caiu para 95 KB. O prefetch fica onde a intenção é
   real: a análise gratuita e os cartões dos três caminhos.
3. **Duas famílias de fonte eram baixadas e nunca usadas** (o itálico
   serifado e o peso 500 do mono): 80 KB por visita, em regra nenhuma.

CLS zero não é sorte: nenhuma fonte troca de métrica depois de carregar
(`display: swap` com fallback dimensionado pelo `next/font`), e a transição
de entrada anima só opacidade e `transform`, que não reflow.

## De onde vem o desenho

[`docs/referencias.md`](docs/referencias.md) registra os sites que os sócios
trouxeram como referência e — o que importa — **qual decisão de desenho saiu
de cada um**. Referência que não vira decisão é moodboard, e moodboard não
se versiona.

## As ferramentas, e as recusas

[`docs/ferramentas.md`](docs/ferramentas.md) registra o ferramental e o
motivo de cada escolha — inclusive por que este site não usa gerador de IA
nem construtor visual, e qual é a única ferramenta que fecharia a lacuna
real (o servidor MCP da Figma, no dia em que houver um designer).

## O que falta

Ver [`docs/pendencias.md`](docs/pendencias.md) — oito itens, cada um com quem
decide e onde mexer. Os dois mais importantes: **calibrar as premissas do
modelo com os sócios** e **decidir se preço vai ao ar** (hoje não vai:
`PRECO_PUBLICO = false`, porque a tabela v3 declara que preço público é porta
de uma via).

## Régua visual

[`docs/identidade-visual-web.md`](docs/identidade-visual-web.md) explica como a
paleta canônica (navy `#1B2A4A` + dourado `#C2A35B`) vira sistema de tela, por
que existem degraus derivados, e as quatro únicas situações em que o dourado
aparece.
