# Trabalhando neste repositório

## 1. O abba-ops é a fonte da verdade

Todo texto externo deste site vem de um documento em
[`abba-ops`](https://github.com/DanielMoraesCoca/abba-ops). Antes de escrever
ou alterar qualquer copy, leia:

- `00-identidade/posicionamento.md` — o vocabulário; a tabela "não dizer / dizer"
- `00-identidade/manifesto.md` — a postura e o tom
- `00-identidade/base-de-evidencias.md` — **os únicos números que podem sair**
- `00-identidade/marca-e-nomenclatura.md` — os nomes oficiais
- `00-identidade/identidade-visual.md` — a paleta e a tipografia

Se este repositório divergir do abba-ops, o abba-ops ganha.

## 2. Números

Número que não está em `src/content/evidencias.ts` não entra em lugar nenhum
do site. Para adicionar um: registre primeiro no `base-de-evidencias.md` do
abba-ops, com fonte primária e nível de confiança; depois traga para cá.

Confiança abaixo de "alta" **obriga** ressalva declarada — há teste para isso.

## 3. Este Next.js pode não ser o que você conhece

Antes de escrever código de framework, leia o guia relevante em
`node_modules/next/dist/docs/`. A versão instalada pode ter mudanças que
contradizem o que você lembra.

## 4. Antes de commitar

```bash
npm run check     # typecheck + lint + 71 unitários + build
npm run test:e2e  # 46 testes de ponta a ponta, desktop e celular
```

A régua do revisor (`tests/unit/regua-do-revisor.test.ts`) varre o código
atrás de número proibido, vocabulário banido e URL fora do domínio oficial.
Se ela falhar, **não afrouxe o teste** — corrija o texto. Ela existe porque
um site é material externo que muda sozinho, e a primeira pressa é onde o
"95% dos pilotos falham" reaparece numa headline.

## 5. A Análise ABBA tem uma divisão de trabalho que é doutrina

`modelo.ts` produz o número. `narrativa.ts` produz a prosa. O modelo de
linguagem nunca toca em cifra — e há uma verificação de saída que descarta a
geração inteira se um número escapar. Não mude isso sem decisão de sócio
registrada.

## 6. Idioma

Tudo em português brasileiro: copy, nome de arquivo, nome de variável,
comentário, mensagem de commit. Anglicismo só quando o termo não tem tradução
consolidada.
