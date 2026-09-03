# As referências, e o que cada uma ensina

> **Camada:** engenharia/desenho. Registra os sites que os sócios trouxeram
> como referência, o que foi possível apurar sobre cada um, e — o que
> importa — **qual decisão de desenho saiu daí**. Referência que não vira
> decisão é moodboard, e moodboard não se versiona.

## Uma limitação, dita antes de tudo

O ambiente onde este site é construído tem saída de rede por lista de
permissão. **Nenhum dos oito domínios abre daqui** — nem por requisição, nem
pelo navegador. O que está abaixo veio de busca: fichas do Awwwards, estudos
de caso das agências, e a imprensa de design. Onde eu não pude ver com os
próprios olhos, está dito.

Se quiserem que eu trabalhe a partir do que vocês veem, o caminho é mandar
capturas de tela aqui no chat — daí eu leio a composição de verdade.

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
