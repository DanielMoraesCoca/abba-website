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

## 8. Domínio, hospedagem e e-mail · **chapéu Tecnologia**

Apontar `abbaservices.com.br` para o site e confirmar que
`contato@abbaservices.com.br` chega em alguém. Enquanto o domínio não estiver
apontado, a regra da marca proíbe mandar qualquer URL de pré-visualização para
prospect.
