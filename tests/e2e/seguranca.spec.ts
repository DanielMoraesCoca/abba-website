import { expect, test } from '@playwright/test';

/**
 * O que a página de privacidade afirma tem que ser verdade na resposta HTTP.
 *
 * A frase publicada é: "não há script de terceiro carregando nesta página: a
 * política de segurança de conteúdo do servidor bloqueia isso por
 * configuração, não por promessa". Este teste é o "não por promessa".
 */

test('a resposta traz a política de segurança de conteúdo', async ({ request }) => {
  const resposta = await request.get('/');
  const csp = resposta.headers()['content-security-policy'];

  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  // Nenhuma origem externa permitida em lugar nenhum da política.
  expect(csp).not.toMatch(/https?:\/\//);
});

test('os demais cabeçalhos de segurança estão no lugar', async ({ request }) => {
  const h = (await request.get('/')).headers();
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['strict-transport-security']).toContain('max-age=');
  expect(h['x-powered-by']).toBeUndefined();
});

test('nenhuma página carrega recurso de fora do domínio', async ({ page }) => {
  const externos: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.hostname !== 'localhost' && url.protocol !== 'data:') externos.push(r.url());
  });

  for (const rota of ['/', '/analise', '/evidencias']) {
    await page.goto(rota, { waitUntil: 'networkidle' });
  }

  expect(externos, 'o site não deve buscar nada de terceiro').toEqual([]);
});

test('a análise não devolve resposta armazenável em cache', async ({ request }) => {
  const resposta = await request.post('/api/analise', {
    data: {
      empresa: 'Exemplo',
      setor: 'serviços',
      respostas: {
        colaboradores: '51-200',
        faturamento: '10-50m',
        volume: '500-2k',
        toques: '3-4',
        fechamento: '4-7',
        numeroMedido: 'sim',
        latencia: 'mes',
        patrocinador: 'diretoria',
        tentativa: 'nada',
        dono: 'nomeado',
        prazo: 'nao',
      },
    },
  });

  expect(resposta.status()).toBe(200);
  expect(resposta.headers()['cache-control']).toContain('no-store');
});

test('a análise recusa payload inválido com 400', async ({ request }) => {
  const resposta = await request.post('/api/analise', {
    data: { empresa: 'X', setor: 'y', respostas: {} },
  });
  expect(resposta.status()).toBe(400);
});
