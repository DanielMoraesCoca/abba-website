import { expect, test } from '@playwright/test';

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

test.describe('todas as páginas', () => {
  for (const rota of ROTAS) {
    test(`${rota} carrega, tem um H1 só e não rola na horizontal`, async ({ page }) => {
      const problemas: string[] = [];
      page.on('pageerror', (e) => problemas.push(String(e)));

      const resposta = await page.goto(rota);
      expect(resposta?.status()).toBe(200);

      // Exatamente um H1 por página — estrutura de documento, não estética.
      await expect(page.locator('h1')).toHaveCount(1);

      // O corpo nunca rola na horizontal, em nenhuma largura.
      const rolagem = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(rolagem, `${rota} rola ${rolagem}px na horizontal`).toBeLessThanOrEqual(1);

      expect(problemas).toEqual([]);
    });
  }
});

test('o idioma declarado é pt-BR', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('a primeira parada do teclado é pular para o conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
});

test('o rodapé usa só o domínio oficial', async ({ page }) => {
  await page.goto('/');
  const texto = (await page.locator('footer').textContent()) ?? '';
  expect(texto).toContain('abbaservices.com.br');
  expect(texto).not.toMatch(/vercel\.app|netlify\.app/);
});

test('a página inexistente devolve 404 com caminho de volta', async ({ page }) => {
  const resposta = await page.goto('/pagina-que-nao-existe');
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole('link', { name: /Voltar ao início/i })).toBeVisible();
});
