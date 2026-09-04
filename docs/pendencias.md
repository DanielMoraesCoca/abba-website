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

Apontar `abbaservices.com.br` para o site e confirmar que
`contato@abbaservices.com.br` chega em alguém. Enquanto o domínio não estiver
apontado, a regra da marca proíbe mandar qualquer URL de pré-visualização para
prospect.

## 10. O cabeçalho sobre fundo escuro · **chapéu Desenho**

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
