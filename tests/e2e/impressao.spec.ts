import { expect, test } from '@playwright/test';

/**
 * A leitura da Análise tem que virar um documento.
 *
 * A ABBA vive de documento — proposta, relatório, termo —, e quem termina a
 * análise vai querer levar aquilo para a diretoria. Um site que ignora a
 * impressão entrega um PDF com menu e botão no meio do argumento.
 */

async function chegarAoResultado(page: import('@playwright/test').Page) {
  await page.goto('/analise');
  const escolher = (nome: string, valor: string) =>
    page.locator(`label:has(input[name="${nome}"][value="${valor}"])`).first().click();

  await page.fill('#empresa', 'Exemplo Distribuidora');
  await page.fill('#setor', 'distribuição');
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
}

// Um fluxo só para as duas asserções: percorrer o assistente inteiro custa
// dez segundos e uma chamada de API, e não há motivo para pagar isso duas
// vezes só para separar dois `test`.
test('no papel, sai um documento — não uma captura do site', async ({ page }) => {
  await chegarAoResultado(page);
  await page.emulateMedia({ media: 'print' });

  // Navegação, rodapé do site e formulário ficam fora.
  await expect(page.locator('header')).toBeHidden();
  await expect(page.locator('footer')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Salvar em PDF' })).toBeHidden();

  // O argumento inteiro fica: a faixa, o aviso de limite e as premissas.
  await expect(page.getByText(/calculado de fora/i)).toBeVisible();
  await expect(page.getByText('Premissa da ABBA').first()).toBeVisible();

  // Fundo de elemento não imprime por padrão. As barras SÃO o dado, então
  // elas carregam print-color-adjust: exact — sem isso o gráfico some do
  // papel e leva junto o argumento de que a conta é conferível.
  const ajuste = await page
    .locator('[data-tinta]')
    .first()
    .evaluate((el) => {
      const s = getComputedStyle(el);
      return s.printColorAdjust || s.webkitPrintColorAdjust;
    });
  expect(ajuste).toBe('exact');
});
