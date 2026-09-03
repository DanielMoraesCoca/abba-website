import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Auditoria automática de acessibilidade, em toda página.
 *
 * O que uma ferramenta automática pega é uma fração do que importa — ela
 * não julga se um texto alternativo é bom, nem se a ordem de leitura faz
 * sentido. Mas o que ela pega, ela pega sempre: contraste insuficiente,
 * campo sem rótulo, marco sem nome, ordem de cabeçalho quebrada. São erros
 * que entram por descuido e ficam meses.
 *
 * A régua é WCAG 2.2 nível AA. Não é aspiração: é o piso de qualquer
 * material público de uma empresa que se apresenta como séria.
 */

const ROTAS = [
  '/',
  '/o-que-fazemos',
  '/programa',
  '/conselheiro',
  '/metodo',
  '/evidencias',
  '/manifesto',
  '/mapa-de-vazamento',
  '/analise',
  '/contato',
  '/privacidade',
];

const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Põe todo elemento no estado final ANTES de auditar.
 *
 * A transição de entrada leva 720ms; auditar durante ela mede cores
 * misturadas com o fundo e produz reprovações que não existem na tela
 * parada. Desligar a transição, em vez de esperar por ela, torna o teste
 * determinístico — esperar seria uma corrida que às vezes ganha.
 */
async function revelarTudo(page: import('@playwright/test').Page) {
  await page.addStyleTag({
    content: '[data-revelar]{transition:none !important;animation:none !important}',
  });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-revelar]')) {
      el.setAttribute('data-revelar', 'visivel');
    }
  });
}

function relatar(violacoes: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  return violacoes
    .map(
      (v) =>
        `\n  [${v.impact}] ${v.id}: ${v.help}\n` +
        v.nodes
          .slice(0, 4)
          .map((n) => `    → ${n.target.join(' ')}\n      ${n.failureSummary?.split('\n')[1] ?? ''}`)
          .join('\n'),
    )
    .join('\n');
}

test.describe('WCAG 2.2 AA', () => {
  for (const rota of ROTAS) {
    test(`${rota} não tem violação automática`, async ({ page }) => {
      await page.goto(rota, { waitUntil: 'networkidle' });
      await revelarTudo(page);

      const { violations } = await new AxeBuilder({ page }).withTags(REGRAS).analyze();
      expect(violations, relatar(violations)).toEqual([]);
    });
  }
});

test('o menu móvel é operável por teclado e anuncia o próprio estado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');

  const botao = page.getByRole('button', { name: 'Abrir menu' });
  await expect(botao).toHaveAttribute('aria-expanded', 'false');

  await botao.press('Enter');
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('o assistente da Análise passa no axe também na tela de resultado', async ({ page }) => {
  await page.goto('/analise');
  const escolher = (nome: string, valor: string) =>
    page.locator(`label:has(input[name="${nome}"][value="${valor}"])`).first().click();

  await page.fill('#empresa', 'Exemplo');
  await page.fill('#setor', 'serviços');
  await escolher('colaboradores', '51-200');
  await escolher('faturamento', '10-50m');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('volume', '2k-10k');
  await escolher('toques', '3-4');
  await escolher('fechamento', '4-7');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('numeroMedido', 'sim');
  await escolher('latencia', 'trimestre');
  await escolher('patrocinador', 'diretoria');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await escolher('tentativa', 'piloto-parou');
  await escolher('dono', 'nomeado');
  await escolher('prazo', 'sim-12m');
  await page.getByRole('button', { name: 'Ver a leitura preliminar' }).click();

  await expect(page.getByText(/calculado de fora/i)).toBeVisible({ timeout: 20_000 });
  await revelarTudo(page);

  const { violations } = await new AxeBuilder({ page }).withTags(REGRAS).analyze();
  expect(violations, relatar(violations)).toEqual([]);
});
