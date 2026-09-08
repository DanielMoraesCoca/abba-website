# Pendências antes do site ir ao ar

> Lista curta e honesta do que falta. Cada item diz **quem decide** e **onde
> mexer**. Nenhuma delas impede o site de rodar hoje; todas impedem que ele
> seja considerado pronto para prospect.

## 1. Calibrar as premissas do modelo de estimativa · **sócios**

**Onde:** [`src/lib/analise/premissas.ts`](../src/lib/analise/premissas.ts)

As faixas de minutos por documento e de custo/hora administrativa são a
calibragem inicial, deliberadamente conservadora, e estão marcadas no código
como `tipo: 'premissa'` — o site as apresenta como assunção da ABBA, nunca
como estatística. Ainda assim, elas produzem o número que vai à mesa da
diretoria de um prospect. **Precisam de um "ok" explícito dos sócios.**

Um jeito rápido de calibrar: rodar a análise com os números de dois ou três
clientes reais e ver se a faixa cai onde a intuição dos sócios cai. Se não
cair, mexer nas constantes — os testes de honestidade continuam valendo.

## 2. Decidir se preço é público · **Pedro**

**Onde:** [`src/content/precos.ts`](../src/content/precos.ts) — `PRECO_PUBLICO`

A [tabela v3](https://github.com/DanielMoraesCoca/abba-ops) traz a ressalva:
"preço público é porta de 1 via; Pedro valida antes de qualquer material sair
a cliente". Publicar preço na home é decisão que não se desfaz — o mercado
guarda o print. Por isso o site nasce mostrando a **estrutura** do
investimento sem os números.

Os valores já estão versionados e corretos, e as páginas já sabem renderizá-los.
Publicar é mudar um booleano — e o teste em `tests/unit/conteudo.test.ts`
obriga quem mudar a atualizar o teste no mesmo commit, deixando a decisão
registrada no histórico do git.

## 3. Revisão jurídica da política de privacidade · **sócios + advogado**

**Onde:** [`src/app/privacidade/page.tsx`](../src/app/privacidade/page.tsx)

O texto descreve com precisão o que o site faz hoje, em português claro. Mas
não foi revisto por advogado, e **a razão social e o CNPJ da ABBA ainda não
estão definidos** (pendência do societário, no abba-ops). Os dados do
controlador precisam entrar antes de o site receber tráfego real.

## 4. Ligar o funil de leads · **chapéu Comercial**

**Onde:** [`src/lib/leads.ts`](../src/lib/leads.ts) — variável `ABBA_LEAD_WEBHOOK`

Hoje, sem webhook configurado, um contato é registrado no log do servidor e o
formulário responde normalmente. Isso é melhor que quebrar, e pior que
funcionar. O destino natural é o que o abba-ops já define: a pasta do lead no
Drive (`01 Comercial/Leads/`) e o pipeline.

## 5. Conferir os PDFs primários das fontes · **sócios**

A base de evidências do abba-ops registra que RAND, METR e DORA foram lidos
via fontes secundárias confiáveis, por bloqueio de rede no ambiente de
pesquisa, e que os PDFs originais precisam ser conferidos dígito a dígito
antes de uso em material impresso. **O site é material externo.** A conferência
vale para ele também.

## 6. Registrar a régua web no abba-ops · **sócios**

**Onde:** [`docs/identidade-visual-web.md`](identidade-visual-web.md)

Os degraus derivados da paleta e o vermelho de alerta precisam ser registrados
no `00-identidade/identidade-visual.md`, pela regra de lá: nenhuma cor entra
sem registro.

## 7. Fotografia e retratos · **sócios**

O site foi construído sem foto de banco de imagem — de propósito. Stock genérico
de "executivos apontando para gráfico" contradiz tudo que o manifesto diz. O
lugar onde uma foto real ganharia muito: **os retratos dos sócios**, na página
de contato ou numa página "quem somos" que ainda não existe. Duas fotos boas,
em luz natural, valem mais que vinte de catálogo.

## 8. Testar a camada de linguagem com chave real · **chapéu Tecnologia**

**Onde:** [`src/lib/analise/narrativa.ts`](../src/lib/analise/narrativa.ts)

O caminho determinístico está testado e é o que vai ao ar sem chave. O
caminho com o modelo — incluindo a verificação que descarta a geração
inteira se um número escapar para o texto — nunca rodou contra a API de
verdade, porque o ambiente onde este site foi construído não tinha chave.

Antes de ligar em produção: rodar umas dez análises com `ANTHROPIC_API_KEY`
definida, conferir que o texto sai no tom da casa e que nenhuma cifra
aparece na prosa. Se aparecer, a trava funciona — mas é melhor saber antes.

## 9. Domínio, hospedagem e e-mail · **chapéu Tecnologia**

> **Acrescentado em 08/09, pela revisão de segurança:** ao escolher a
> hospedagem, confirme se ela SOBRESCREVE o cabeçalho `X-Forwarded-For`
> recebido do cliente (Vercel, Cloudflare e a maioria dos provedores
> sérios sobrescrevem; um proxy caseiro mal configurado não). Confirmado,
> ligue `ABBA_PROXY_CONFIAVEL=1`. Sem isso a trava por IP é decorativa —
> quem quiser varia o cabeçalho e ganha um balde novo por requisição.
> O fusível global (`ABBA_LIMITE_GLOBAL_LLM`, padrão 120 por 10 min) já
> protege a fatura de qualquer jeito, mas é a última linha, não a única
> que deveria existir.


Apontar `abbaservices.com.br` para o site e confirmar que
`contato@abbaservices.com.br` chega em alguém. Enquanto o domínio não estiver
apontado, a regra da marca proíbe mandar qualquer URL de pré-visualização para
prospect.

## 10. O cabeçalho sobre fundo escuro · **RESOLVIDA em 06/09**

> Decidida pela saída 2 — inversão ciente do conteúdo, com os tokens da
> casa. O registro do raciocínio fica abaixo.

Hoje o cabeçalho decide a própria cor por distância de rolagem: acima de
24px vira claro com texto navy, abaixo fica transparente com texto gelo.
Isso é um **palpite sobre o que está atrás**, e ele só acerta porque toda
página começa com capa escura. Nas seções `tom="navy"` e no rodapé, uma
barra clara atravessa a faixa escura.

A hobro.digital resolve isso com uma linha, sem JavaScript:

```css
.header.header-inverse { mix-blend-mode: difference }
```

O cabeçalho inverte contra o que passa por baixo. Sobre claro fica escuro,
sobre escuro fica claro. Contraste garantido por construção — é literalmente
a diferença máxima entre duas cores.

**Por que não apliquei direto:** `difference` garante contraste e destrói
cor. A hobro pode porque a paleta dela é branco, preto e cinza. O ouro
`#836B34` invertido sobre navy não é ouro — é uma cor que a ABBA não possui.
Trocaríamos identidade por conveniência técnica.

Três saídas, para os sócios escolherem:

1. **Deixar como está.** Não há falha de contraste — o axe passa nas 12
   páginas. É só uma barra clara cortando uma faixa escura. Custo zero.
2. **Inversão ciente do conteúdo.** Um `IntersectionObserver` marca quando
   uma seção escura está sob o cabeçalho e troca para uma variante escura
   feita com os tokens da ABBA. Mesma ideia da hobro, cor da casa preservada.
   Custo: um observador, uma variante, e regravar as 20 referências visuais.
3. **`difference` só no logotipo.** O logotipo é monocromático; inverter só
   ele não toca no ouro. Meio-termo barato.

Minha recomendação é a 2. A 1 é defensável e a 3 é um remendo.

### O que foi feito

As superfícies escuras se anunciam com `data-fundo="escuro"` — `Secao` nos
tons navy, `FaixaDeGrafo` escura, `Capa`, `CapaDePagina` e o rodapé. Nenhuma
delas sabe que o cabeçalho existe: só declaram o próprio fundo.

O cabeçalho observa com um `IntersectionObserver` cujo recorte é achatado
numa faixa de 1px na base dele — só intersecta o que está exatamente atrás.
Três superfícies em vez de duas: transparente no topo, clara sobre claro,
navy-900 sobre escuro. O botão da Análise, que era sólido navy, vira
contorno sobre escuro, onde o sólido desapareceria.

**Um erro no caminho, e ele importa.** A primeira versão lia a altura do
cabeçalho do token: `parseFloat(--header-h)`. O token é `4.5rem`, e
`parseFloat('4.5rem')` devolve `4.5` — a faixa de detecção nasceu a quatro
pixels do topo da tela e nunca encostou em nada. O cabeçalho continuava
claro sobre navy e nenhum teste reclamava. Agora a altura é medida do
elemento, que sabe o próprio tamanho em pixels.

**A cobertura que faltava.** A auditoria do axe roda no topo de cada página,
onde o cabeçalho é transparente — o estado escuro nunca foi auditado por
ninguém. Um estado que só aparece rolando é um estado que ninguém revisa.
`acessibilidade.spec.ts` agora rola até uma seção escura e audita ali; o
teste foi verificado reintroduzindo o bug do `parseFloat`, e ele reprova.

**E uma confirmação:** medi o comportamento antigo (barra sempre clara sobre
seção navy) com o axe. Zero violações. O que eu disse acima continua de pé —
não era falha de contraste, era composição. A troca foi de desenho, não
correção de acessibilidade.

## 11. `clip-path`: a técnica que falta · **RESOLVIDA em 06/09**

> Decidida pela saída 1 — variante, não substituição, em três lugares.

Das sete referências lidas, as três feitas à mão mais elogiadas usam
`clip-path` 37 (Vero), 15 (PX Push) e 7 vezes (Otsuka). A ABBA usa zero.

Não é enfeite. É o segundo jeito de revelar conteúdo — por corte, não por
opacidade. Uma cortina que abre revela sem que o texto passe por estados
semitransparentes, o que é melhor para leitura e melhor para contraste.

A forma mínima é uma linha:

```css
transition: clip-path 1s var(--ease-abba);
clip-path: inset(0 0 100%);   /* fechado */
clip-path: inset(0 0 0%);     /* aberto  */
```

A forma avançada da Vero liga o corte a uma variável que o JavaScript
atualiza — o cálculo do polígono fica no CSS, o JS só escreve um número
entre 0 e 1.

**Por que não apliquei:** trocar ou somar um segundo modo de revelação muda
o estado intermediário de praticamente toda seção, e regrava as 20
referências de regressão visual. É decisão de desenho, não correção.

Duas saídas:

1. **Variante, não substituição.** `[data-revelar='corte']` como segundo
   modo, aplicado só onde a cortina diz algo — a faixa de grafo, a tese, os
   números das evidências. O modo atual continua padrão.
2. **Deixar como está.** O `translateY` + opacidade que temos é correto e
   passa em tudo. `clip-path` é ganho de repertório, não de qualidade.

Recomendo a 1, restrita a três lugares. Repertório usado em toda seção vira
maneirismo.

### O que foi feito

`Revelar` e `RevelarItem` ganharam `modo`: `desloca` (o padrão, inalterado)
e `corte`. Os três lugares:

| Onde | Por quê |
|---|---|
| o numeral **70%** da tese | num numeral de 13rem, meio segundo de meio-tom é meio segundo de borrão |
| o **diagrama das sete camadas** | a cortina desce na direção em que o diagrama deve ser lido |
| a **faixa de grafo** da home | a malha abre de borda a borda, como marco |

Quem pediu menos movimento recebe `clip-path: none`, não a cortina
congelada — sem essa regra o conteúdo sumiria para sempre. É a distinção
que a Vero aplica na seta do scroll cue: estado substituto, não estado
congelado.

## 12. A colisão com a Fato Analytics · **chapéu Marca + Comercial**

Descoberto em 08/09 ao ler o código de `fatoanalytics.com`, trazida como
referência de desenho. Não é referência: é concorrente direto.

Consultoria brasileira de dados e IA, com um índice de maturidade em cinco
níveis (**F-Score**) como porta de entrada. Mesma praça, mesma promessa,
mesma forma comercial que o nosso Mapa de Vazamento.

E, sem que ninguém tenha copiado ninguém:

| | Fato | ABBA |
|---|---|---|
| Corpo | Inter | Inter |
| Número | JetBrains Mono | JetBrains Mono |
| Título | Aktiv Grotesk | **Source Serif 4** |
| Curva de entrada | `cubic-bezier(0.16, 1, 0.3, 1)` | a mesma |

A curva é a *expo out*, conhecida — a coincidência é honesta. Mas o efeito
sobre quem olha os dois sites no mesmo dia não depende de ter havido cópia.

**O que já nos separa:** o título serifado. É o único elemento tipográfico
que eles não têm, e é o que carrega o argumento da casa — documento, laudo,
coisa que se assina. Deixou de ser gosto e virou o diferencial.

Três saídas, para os sócios:

1. **Reforçar a serifa.** Não mudar nada de fonte; usar Source Serif em
   mais lugares onde hoje há Inter — sobretítulos de seção, primeira linha
   de bloco, os rótulos das faixas. Barato, reversível, e aprofunda o que
   já é nosso.
2. **Trocar a curva.** Uma curva própria em vez da expo out. Custa uma
   linha e três referências visuais. Ganho pequeno: ninguém compara curvas
   entre abas. Faria pelo princípio, não pelo efeito.
3. **Trocar a fonte de corpo.** A Inter é a fonte-padrão de todo site de
   tecnologia da década — a Fato usa, e mais uns dez mil. Sair dela é a
   mudança mais funda e a mais cara: reescala tudo e regrava as vinte
   referências visuais.

Recomendo a 1 agora e a 3 na conversa de identidade, se houver. A 2 é
higiene, não estratégia.

**O que isto NÃO é:** motivo para copiar o F-Score. Um índice de cinco
níveis é mais fácil de vender que 25 dimensões, e é justamente por isso que
não é nosso. A profundidade é o produto.

## 13. Revisão de segurança de 08/09 · **RESOLVIDA no mesmo dia**

Feita antes do lançamento, na superfície que importa: as duas rotas de API,
a fronteira do modelo de linguagem, a trava de taxa, o webhook de lead e os
cabeçalhos.

**O que estava certo e continua:** a CSP não permite recurso de terceiro
nenhum; as duas rotas validam tudo com zod antes de encostar em qualquer
lógica; o texto livre chega ao modelo delimitado e declarado como dado, e a
saída é verificada antes de publicar; a Análise não persiste nada; a
armadilha do formulário de contato responde 200 sem ensinar o que falhou; e
toda falha do modelo cai no texto determinístico, então o site não quebra
por causa da API.

**A falha encontrada.** `identificar()` confiava em `X-Forwarded-For` sem
ressalva. É um cabeçalho que o cliente escreve: variando o valor a cada
requisição, ganha-se um balde novo por chamada e a trava por IP deixa de
existir. E a trava era a única coisa entre um laço e uma fatura de modelo
de linguagem — o próprio comentário do arquivo dizia isso: *"cada análise
pode disparar uma chamada paga. Sem trava, um laço distraído vira
fatura."*

Consequência secundária: cada valor forjado criava uma entrada nova no mapa
de janelas, que crescia sem teto.

**A correção, em três partes.**

1. **Um fusível global** (`narrativa.ts`), de chave fixa — não pergunta
   quem está chamando, então não há o que forjar. Ao estourar, cai no texto
   determinístico: o visitante recebe a análise inteira, inclusive o número,
   porque o número sempre foi aritmética. Degradação, não interrupção.
   Padrão de 120 por 10 minutos, ajustável por `ABBA_LIMITE_GLOBAL_LLM`.
2. **Teto de chaves** no mapa de janelas, com descarte das vencidas
   primeiro e das mais antigas depois.
3. **Recusa de valor longo demais** para ser endereço (o IPv6 mais longo
   tem 45 caracteres), e a suposição sobre o proxy escrita no arquivo, com
   `ABBA_PROXY_CONFIAVEL` e uma nota na pendência 9.

Travado por testes, todos verificados removendo a defesa. O do fusível não
pergunta se a resposta é a mesma — seria a mesma de qualquer jeito, já que
toda falha cai no determinístico. Ele espia a rede e afirma que **nenhuma
chamada paga aconteceu**, que é a única coisa que custa dinheiro se for
falsa.
