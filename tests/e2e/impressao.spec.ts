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
  await expect(page.getByText(/lido de fora/i)).toBeVisible({ timeout: 20_000 });
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

  // O argumento inteiro fica: a leitura nomeada, o vetor e o limite.
  await expect(page.getByText(/Teste do alvo/i)).toBeVisible();
  await expect(page.getByText(/O vetor principal/i)).toBeVisible();
  await expect(page.getByText(/lido de fora/i)).toBeVisible();

  /* Bloco escuro vira claro no papel: tinta de fundo é desperdício e deixa
     o texto ilegível em impressora comum. É a regra que sobrou depois que o
     gráfico de decomposição saiu da tela — ele era o único elemento que
     precisava do caminho contrário, imprimir o fundo mesmo assim, porque a
     barra ERA o dado. */
  const fundo = await page
    .locator('[class*="bg-papel"]')
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  expect(fundo).not.toBe('rgb(255, 255, 255)');
});
