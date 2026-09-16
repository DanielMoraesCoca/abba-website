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
    page.locator(`label:has(input[name="${nome}"][value="${valor}"])`).first().click();

  await page.fill('#empresa', 'Exemplo Distribuidora');
  await page.fill('#setor', 'distribuição');
  await escolher('colaboradores', '201-500');
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

  // A leitura é nomeada, e aparece antes de qualquer outra coisa.
  await expect(page.getByText(/Teste do alvo/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/O vetor principal/i)).toBeVisible();

  /* NENHUMA cifra em reais na tela. A faixa está suspensa (briefing §10.1),
     e este é o teste que percebe se ela voltou sem decisão. */
  await expect(page.getByText(/R\$/)).toHaveCount(0);

  // O limite aparece sem clique e sem hover.
  await expect(page.getByText(/lido de fora/i)).toBeVisible();

  // O formulário de contato vem DEPOIS da leitura, não antes.
  await expect(
    page.getByRole('heading', { name: /assessment gratuito da sua empresa/i }),
  ).toBeVisible();
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
  await page.locator('label:has(input[name="colaboradores"][value="51-200"])').first().click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('button', { name: '← Voltar' }).click();
  await expect(page.locator('#empresa')).toHaveValue('Exemplo');
});

/**
 * A primeira pergunta na porta da home.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A Análise é a única porta gratuita da ABBA e aparecia na home uma vez
 * só, num botão perto do rodapé. Agora a primeira pergunta é feita ali
 * mesmo, e a resposta viaja em `?porte=`.
 *
 * Duas coisas precisam continuar verdadeiras, e elas puxam em direções
 * opostas: a resposta tem que atravessar a navegação, e a URL não pode
 * virar um jeito de escrever no formulário o que se quiser.
 * ──────────────────────────────────────────────────────────────────────── */
test('a resposta dada na home chega preenchida na primeira leitura', async ({ page }) => {
  await page.goto('/');

  const escolha = page.getByRole('link', { name: 'De 201 a 500' });
  await escolha.scrollIntoViewIfNeeded();
  await escolha.click();

  await expect(page).toHaveURL(/\/analise\?porte=201-500/);
  await expect(page.locator('input[name="colaboradores"][value="201-500"]')).toBeChecked();

  // O resto do passo continua em branco: a home responde uma pergunta, não
  // finge ter respondido as outras.
  await expect(page.locator('#empresa')).toHaveValue('');
  await expect(page.locator('#setor')).toHaveValue('');
});

test('um porte forjado na URL não deixa o passo avançar', async ({ page }) => {
  /**
   * A primeira versão deste teste checava que nenhuma faixa aparecia
   * marcada — e passava mesmo com a validação removida, porque o grupo de
   * opções só renderiza rádios das faixas conhecidas: um valor forjado
   * nunca teria como aparecer marcado, com ou sem defesa. Era um teste que
   * afirmava uma coisa já verdadeira.
   *
   * O que de fato muda sem a validação é que o rascunho passa a carregar
   * um valor que o servidor vai recusar, e o passo se dá por completo sem
   * que ninguém tenha escolhido faixa nenhuma. A pessoa preencheria tudo
   * para só então tomar um erro. É isso que se mede aqui.
   */
  await page.goto('/analise?porte=' + encodeURIComponent('acima-9000'));

  await page.fill('#empresa', 'Exemplo');
  await page.fill('#setor', 'serviços');

  await expect(page.locator('input[name="colaboradores"]:checked')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();

  // E com uma faixa de verdade escolhida, o passo anda normalmente.
  await page.locator('label:has(input[name="colaboradores"][value="201-500"])').first().click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();
});
