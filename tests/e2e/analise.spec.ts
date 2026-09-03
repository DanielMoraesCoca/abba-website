import { expect, test } from '@playwright/test';

/**
 * O caminho que o prospect percorre.
 *
 * Este teste vale mais que os unitários da estimativa juntos para uma
 * pergunta específica: a Análise ABBA continua entregando resultado sem
 * pedir cadastro? É a promessa mais fácil de quebrar sem querer, numa
 * refatoração de formulário.
 */

async function responderTudo(page: import('@playwright/test').Page) {
  const escolher = (nome: string, valor: string) =>
    page.locator(`input[name="${nome}"][value="${valor}"]`).first().check({ force: true });

  await page.fill('#empresa', 'Exemplo Distribuidora');
  await page.fill('#setor', 'distribuição');
  await escolher('colaboradores', '201-500');
  await escolher('faturamento', '50-200m');
  await page.getByRole('button', { name: 'Continuar' }).click();

  await escolher('volume', '10k-50k');
  await escolher('toques', '5-plus');
  await escolher('fechamento', '8-15');
  await page.getByRole('button', { name: 'Continuar' }).click();

  await escolher('numeroMedido', 'parcial');
  await escolher('latencia', 'ano');
  await escolher('patrocinador', 'financeiro');
  await page.getByRole('button', { name: 'Continuar' }).click();

  await escolher('tentativa', 'piloto-parou');
  await escolher('dono', 'nomeado');
  await escolher('prazo', 'sim-12m');
  await page.getByRole('button', { name: 'Ver a leitura preliminar' }).click();
}

test('entrega o resultado sem exigir cadastro', async ({ page }) => {
  await page.goto('/analise');
  await responderTudo(page);

  // Uma faixa, nunca um ponto.
  await expect(page.getByText(/R\$ .+ a R\$ /)).toBeVisible({ timeout: 20_000 });

  // O aviso de faixa aparece na tela, sem clique e sem hover.
  await expect(page.getByText(/calculado de fora/i)).toBeVisible();
  await expect(page.getByText(/não captura a faixa inteira/i)).toBeVisible();

  // As premissas se declaram como assunção ou como evidência externa.
  await expect(page.getByText('Premissa da ABBA').first()).toBeVisible();

  // O formulário de contato vem DEPOIS do resultado, não antes.
  await expect(page.getByRole('heading', { name: /Mapa de Vazamento completo/i })).toBeVisible();
});

test('não avança com o passo incompleto', async ({ page }) => {
  await page.goto('/analise');
  const continuar = page.getByRole('button', { name: 'Continuar' });
  await expect(continuar).toBeDisabled();

  await page.fill('#empresa', 'Exemplo');
  await expect(continuar).toBeDisabled();
});

test('dá para voltar e corrigir uma resposta', async ({ page }) => {
  await page.goto('/analise');
  await page.fill('#empresa', 'Exemplo');
  await page.fill('#setor', 'serviços');
  await page.locator('input[name="colaboradores"][value="51-200"]').check({ force: true });
  await page.locator('input[name="faturamento"][value="10-50m"]').check({ force: true });
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('button', { name: '← Voltar' }).click();
  await expect(page.locator('#empresa')).toHaveValue('Exemplo');
});
