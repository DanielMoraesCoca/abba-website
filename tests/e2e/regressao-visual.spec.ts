import { expect, test } from '@playwright/test';

/**
 * Regressão visual: a rede de segurança que faltava.
 *
 * ────────────────────────────────────────────────────────────────────────
 * O PROBLEMA QUE ISTO RESOLVE, E QUE NENHUM OUTRO TESTE PEGA.
 *
 * O site tem uma folha de estilo compartilhada por onze páginas. Mexer num
 * token — um degrau da rampa, um espaçamento, a altura da barra fixa —
 * muda todas elas de uma vez. Os testes que já existiam verificam que o
 * conteúdo está lá, que o contraste passa e que nada rola na horizontal.
 * Nenhum deles percebe um cabeçalho que encavalou, uma coluna que ficou
 * órfã ou um diagrama que desalinhou.
 *
 * É exatamente o tipo de erro que ninguém vê no commit e o cliente vê na
 * primeira visita.
 *
 * COMO FUNCIONA. A primeira execução grava as imagens de referência em
 * `tests/e2e/regressao-visual.spec.ts-snapshots/`. Dali em diante, cada
 * execução compara. Quando a diferença for intencional — e ela costuma
 * ser —, atualize com:
 *
 *     npm run test:visual -- --update-snapshots
 *
 * e olhe o diff das imagens no commit antes de aceitar. A referência é
 * código: revisar a mudança dela é revisar o desenho.
 *
 * O QUE FOI ESTABILIZADO PARA O TESTE NÃO PISCAR. Três fontes de ruído
 * levariam a falhas aleatórias, e cada uma é desligada na preparação: a
 * transição de entrada (que anima opacidade por 720ms), a constelação da
 * capa (canvas com animação contínua) e o cursor de foco. Um teste que às
 * vezes falha é pior que teste nenhum, porque ensina o time a ignorá-lo.
 * ────────────────────────────────────────────────────────────────────────
 */

const PAGINAS = [
  { nome: 'home', rota: '/' },
  { nome: 'o-que-fazemos', rota: '/o-que-fazemos' },
  { nome: 'programa', rota: '/programa' },
  { nome: 'conselheiro', rota: '/conselheiro' },
  { nome: 'metodo', rota: '/metodo' },
  { nome: 'evidencias', rota: '/evidencias' },
  { nome: 'manifesto', rota: '/manifesto' },
  { nome: 'mapa-de-vazamento', rota: '/mapa-de-vazamento' },
  { nome: 'analise', rota: '/analise' },
  { nome: 'contato', rota: '/contato' },
  { nome: 'privacidade', rota: '/privacidade' },
] as const;

/** Desliga tudo que muda entre uma execução e outra. */
const ESTABILIZAR = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  [data-revelar] { opacity: 1 !important; transform: none !important; }
  /* A constelação da capa é um canvas que respira: some para a foto. */
  canvas { visibility: hidden !important; }
`;

async function preparar(page: import('@playwright/test').Page, rota: string) {
  await page.goto(rota, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: ESTABILIZAR });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-revelar]')) {
      el.setAttribute('data-revelar', 'visivel');
    }
  });
  // As fontes precisam ter chegado, senão a primeira foto sai no fallback
  // e a segunda na fonte certa — e o teste acusa uma mudança que não houve.
  await page.evaluate(() => document.fonts.ready);
}

test.describe('regressão visual', () => {
  for (const { nome, rota } of PAGINAS) {
    test(`${nome} não mudou sem querer`, async ({ page }) => {
      await preparar(page, rota);
      await expect(page).toHaveScreenshot(`${nome}.png`, {
        fullPage: true,
        // `scale: 'device'` respeita o deviceScaleFactor do projeto (0,5) e
        // grava a imagem em meia resolução. Sem isto o padrão é `'css'`, que
        // normaliza para pixels de CSS e ignora a escala — foi assim que a
        // primeira tentativa de encolher as referências não encolheu nada.
        scale: 'device',
        // Tolerância pequena: absorve o antialiasing do texto, que varia
        // um pouco entre execuções, sem deixar passar meio pixel de
        // deslocamento em nada que importe.
        maxDiffPixelRatio: 0.002,
        animations: 'disabled',
      });
    });
  }
});

test('a leitura da Análise não mudou sem querer', async ({ page }) => {
  await page.goto('/analise');
  const escolher = (nome: string, valor: string) =>
    page.locator(`label:has(input[name="${nome}"][value="${valor}"])`).first().click();

  // Respostas fixas: a foto tem que ser sempre a mesma leitura.
  await page.fill('#empresa', 'Exemplo Distribuidora');
  await page.fill('#setor', 'distribuicao');
  await escolher('colaboradores', '201-500');
  await escolher('faturamento', '50-200m');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('volume', '2k-10k');
  await escolher('toques', '3-4');
  await escolher('fechamento', '8-15');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('numeroMedido', 'parcial');
  await escolher('latencia', 'trimestre');
  await escolher('patrocinador', 'financeiro');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('tentativa', 'piloto-parou');
  await escolher('dono', 'nomeado');
  await escolher('prazo', 'sim-12m');
  await page.getByRole('button', { name: 'Ver a leitura preliminar' }).click();
  await expect(page.getByText(/calculado de fora/i)).toBeVisible({ timeout: 20_000 });

  await page.addStyleTag({ content: ESTABILIZAR });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-revelar]')) {
      el.setAttribute('data-revelar', 'visivel');
    }
  });
  await page.evaluate(() => document.fonts.ready);

  // O texto de apoio vem do caminho determinístico (sem chave de API), então
  // é estável. Com chave, ele varia — e aí esta foto precisa ser recriada
  // ou o bloco de prosa, mascarado.
  await expect(page).toHaveScreenshot('analise-resultado.png', {
    fullPage: true,
    scale: 'device',
    maxDiffPixelRatio: 0.002,
    animations: 'disabled',
  });
});
