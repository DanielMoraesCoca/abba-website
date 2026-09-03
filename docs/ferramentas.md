# As ferramentas: o que usar, o que evitar, e por quê

> **Camada:** engenharia. Registra a decisão de ferramental do site e o
> motivo de cada escolha — inclusive as recusas. Existe porque "por que não
> usamos X?" é uma pergunta que volta a cada seis meses, e responder de
> memória é como as decisões se desfazem sozinhas.

## A pergunta errada e a certa

A pergunta natural é *"qual ferramenta de IA constrói o site mais
potente?"*. Ela leva a Lovable, v0, Bolt, Framer AI — e todas são muito boas
no que fazem: **chegar rápido à primeira versão**.

A pergunta que separa um site profissional de um site bonito é outra:
**quais laços de retorno existem para que a última versão fique melhor que a
primeira?** Nenhum gerador responde essa. Um estúdio responde com QA,
auditoria, orçamento e revisão de desenho.

Este documento é a lista desses laços.

## O que a ABBA usa hoje

| Papel num estúdio | Aqui | O que ele derruba |
|---|---|---|
| Engenharia | Next.js 16, React 19, TypeScript estrito, Tailwind v4 | — |
| QA | Playwright (98 testes, desktop e celular) | fluxo quebrado, rota 404, rolagem horizontal |
| Acessibilidade | axe-core, WCAG 2.2 AA em todas as páginas | contraste, rótulo faltando, ordem de cabeçalho |
| Regressão visual | Playwright `toHaveScreenshot`, referências versionadas | encavalamento, coluna órfã, diagrama desalinhado |
| Desempenho | `npm run medir`, com orçamento que falha o CI | biblioteca nova que engorda o site sem ninguém ver |
| Revisor de conteúdo | `regua-do-revisor.test.ts` | número proibido, vocabulário errado, URL fora do domínio |
| Compatibilidade | Safari e Firefox no CI | o que só quebra fora do Chromium |

**O que nenhuma dessas cobre e continua sendo humano:** decidir o que o site
deve dizer, e olhar para ele e sentir se está certo.

## O que a ABBA recusa, e por quê

### Geradores de site por IA (Lovable, v0, Bolt, Base44)

Ótimos para chegar do zero a uma primeira versão em uma tarde. Errados para
este site, por três motivos:

1. **O site já passou desse ponto.** Alimentar o repositório atual num
   gerador produziria uma versão mais genérica, não menos: eles convergem
   para o mesmo desenho porque foram treinados nele.
2. **A régua do revisor não sobrevive.** Um gerador não sabe que "95% dos
   pilotos de IA falham" é proibido nesta casa, nem que o dourado precisa de
   5,1:1 sobre branco. Essas regras vivem em código aqui — e é isso que as
   faz durar.
3. **O custo aparece depois.** A [base de
   evidências](https://github.com/DanielMoraesCoca/abba-ops) da casa
   registra a varredura da Escape.tech em 5.600 aplicações "vibe-coded" em
   produção: cerca de 2.000 vulnerabilidades críticas, 400 chaves expostas,
   175 vazamentos de dados pessoais. É um número que a ABBA usa para vender.
   Seria estranho o site dela ser um deles.

### Construtores visuais (Framer, Webflow)

Excelentes, e a escolha certa para muita gente. Errados aqui por uma razão
específica: **a Análise ABBA é software**, não uma página. Ela tem modelo
aritmético auditável, verificação de saída do modelo de linguagem, limite de
taxa e uma trava que descarta texto com número. Nada disso cabe num
construtor visual, e reconstruir o site em volta dele significaria manter
duas coisas.

Se um dia a maior parte do trabalho virar publicar conteúdo em vez de
manter software, a conversa muda — e aí o Webflow tem um servidor MCP que
me deixaria operar o CMS direto.

## O que vale conectar, quando fizer sentido

### Figma (servidor MCP oficial)

**A ferramenta mais valiosa da lista, e a única que resolve a lacuna real.**

O que separa este site de um feito por um estúdio não é código — é que um
estúdio tem um designer desenhando antes de alguém programar. O servidor MCP
da Figma fecha exatamente esse vão: em vez de eu imitar uma captura de tela,
ele me entrega a estrutura de camadas, os tokens de espaçamento, as
variáveis e os estilos, e eu implemento fielmente. Também funciona ao
contrário — devolver a interface construída como camadas editáveis.

**Quando conectar:** no dia em que existir um designer no projeto, ou um
arquivo Figma da marca. Antes disso, não há o que ler.

Conecta-se em claude.ai → Conectores. Ressalva honesta: o conector é de
2026 e o ecossistema ainda está amadurecendo.

### Claude Design (a tela de artboards)

A alternativa sem Figma e sem designer contratado: eu desenho as pranchetas,
os sócios ajustam visualmente — clicar, arrastar, editar texto — e a versão
salva vira a referência. Serve bem para o que falta aqui: uma fonte de
verdade de desenho que os sócios consigam revisar sem depender de mim.

### Um serviço de diferença visual hospedado (Chromatic, Percy, Argos)

Só se as referências versionadas incomodarem. Hoje elas ocupam 5 MB e têm
uma vantagem que o serviço pago não tem: **a mudança de desenho aparece no
diff do pull request**, revisável como código.

## A lacuna que ferramenta nenhuma resolve

**Fotografia.** O site foi construído de propósito sem banco de imagens —
executivo genérico apontando para gráfico contradiz o manifesto inteiro. Mas
a ausência de imagem real é hoje a maior diferença visível entre este site e
o de um estúdio.

O que resolve: duas fotos boas dos sócios, em luz natural, feitas por um
fotógrafo. Custa pouco, leva uma tarde, e nenhum modelo generativo substitui
— porque o valor da foto é ela ser verdadeira. Está registrado como a
pendência 7.
