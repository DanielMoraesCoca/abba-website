import { expect, test } from '@playwright/test';

const ROTAS = [
  '/',
  '/o-que-fazemos',
  '/programa',
  '/conselheiro',
  '/metodo',
  '/evidencias',
  '/manifesto',
  '/assessment-gratuito',
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

/**
 * A régua de progresso.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Construída depois de medir: a home tem 15 telas no celular,
 * /o-que-fazemos 13, /evidencias quase 13. Numa página dessas o leitor
 * perde a noção de quanto falta.
 *
 * É CSS puro — `animation-timeline: scroll()`, sem um ouvinte de evento.
 * Justamente por não ter JavaScript, nada aqui falharia em voz alta se a
 * regra sumisse do `globals.css` numa refatoração: a página continuaria
 * perfeita e a régua simplesmente não existiria mais. Daí este teste.
 * ──────────────────────────────────────────────────────────────────────── */
test('a régua de progresso acompanha a rolagem', async ({ page }) => {
  await page.goto('/');

  const suportado = await page.evaluate(() => CSS.supports('animation-timeline: scroll()'));
  test.skip(!suportado, 'navegador sem animation-timeline: a régua não deve existir mesmo');

  const escala = () =>
    page.evaluate(() => {
      const cabecalho = document.querySelector('header[data-progresso]');
      if (!cabecalho) return Number.NaN;
      const matriz = new DOMMatrixReadOnly(getComputedStyle(cabecalho, '::after').transform);
      return matriz.a; // o fator de escala horizontal
    });

  await expect.poll(escala).toBeLessThan(0.02);

  const irPara = (fracao: number) =>
    page.evaluate((f) => {
      const alcance = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: alcance * f, behavior: 'instant' });
    }, fracao);

  await irPara(0.5);
  await expect.poll(escala).toBeGreaterThan(0.45);
  await expect.poll(escala).toBeLessThan(0.55);

  await irPara(1);
  await expect.poll(escala).toBeGreaterThan(0.98);
});

/**
 * A capa contínua entre páginas.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Onze páginas começam com o mesmo bloco navy. Um `view-transition-name`
 * compartilhado tira esse bloco do esvanecimento geral: em vez de sumir e
 * voltar a cada navegação, ele muda de altura e troca o texto de dentro.
 *
 * O que este teste protege é a parte silenciosa. Um `view-transition-name`
 * precisa ser ÚNICO na página — dois elementos com o mesmo nome fazem o
 * navegador abortar a transição inteira, sem erro no console e sem nada
 * quebrado na tela. O site continuaria perfeito e a continuidade
 * simplesmente deixaria de existir, e ninguém descobriria.
 * ──────────────────────────────────────────────────────────────────────── */
const ROTAS_COM_CAPA = [
  '/',
  '/o-que-fazemos',
  '/programa',
  '/conselheiro',
  '/metodo',
  '/evidencias',
  '/manifesto',
  '/assessment-gratuito',
  '/analise',
  '/contato',
  '/rota-que-nao-existe',
];

for (const rota of ROTAS_COM_CAPA) {
  test(`${rota} tem exatamente uma capa contínua`, async ({ page }) => {
    await page.goto(rota, { waitUntil: 'domcontentloaded' });

    const nomes = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .map((el) => getComputedStyle(el).viewTransitionName)
        .filter((n) => n === 'capa'),
    );

    expect(nomes, `esperado exatamente um elemento com view-transition-name: capa`).toHaveLength(1);
  });
}

test('a cor da superfície mora no grupo, não nos retratos', async ({ page }) => {
  /**
   * Sem fundo no grupo existe um instante em que o retrato antigo já
   * esvaneceu e o novo ainda não entrou — e o branco do corpo aparece por
   * baixo. A superfície pisca para cinza, que é justamente o que este
   * trabalho existe para eliminar. Só apareceu ao fotografar o meio da
   * transição com a animação dez vezes mais lenta.
   */
  await page.goto('/');

  const regra = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((folha) => {
        try {
          return [...folha.cssRules];
        } catch {
          return [];
        }
      })
      .map((r) => r.cssText)
      .find((t) => t.includes('view-transition-group(capa)')),
  );

  expect(regra, 'nenhuma regra para ::view-transition-group(capa)').toBeTruthy();
  expect(regra, 'o grupo precisa carregar o navy da superfície').toMatch(/background-color/);
});

/**
 * Toda página da sitemap é compartilhável.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A imagem social só aparece quando alguém manda o link no WhatsApp ou no
 * LinkedIn — que é exatamente como um sócio divulga. Se ela quebrar, nada
 * no site parece errado: a página abre normal, os testes passam, e só o
 * destinatário vê o card vazio. Ninguém volta para contar.
 *
 * Foi o que aconteceu: a /privacidade estava na sitemap declarando
 * `twitter:card = summary_large_image` — prometendo um card grande — sem
 * imagem nenhuma. Um retângulo vazio no lugar da marca. Descoberto
 * conferindo as dez imagens contra as onze rotas, à mão.
 *
 * A lista sai da SITEMAP e não de um array aqui. Assim, uma página nova
 * que entre na sitemap entra neste teste no mesmo commit, sem ninguém
 * precisar lembrar.
 * ──────────────────────────────────────────────────────────────────────── */
test('toda rota da sitemap tem imagem social que funciona', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const rotas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]!).pathname)
    .map((p) => (p === '' ? '/' : p));

  expect(rotas.length, 'a sitemap voltou vazia').toBeGreaterThan(5);

  const falhas: string[] = [];

  for (const rota of rotas) {
    await page.goto(rota, { waitUntil: 'domcontentloaded' });

    const meta = await page.evaluate(() => {
      const ler = (prop: string) =>
        document.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ?? null;
      return {
        imagem: ler('og:image'),
        largura: ler('og:image:width'),
        altura: ler('og:image:height'),
        alt: ler('og:image:alt'),
        cardTwitter:
          document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') ?? null,
      };
    });

    if (!meta.imagem) {
      // Declarar card grande sem imagem é o pior dos dois mundos: o leitor
      // recebe um retângulo vazio onde deveria estar a marca.
      falhas.push(
        `${rota}: sem og:image` +
          (meta.cardTwitter === 'summary_large_image'
            ? ' — e ainda promete twitter:card=summary_large_image'
            : ''),
      );
      continue;
    }

    if (meta.largura !== '1200' || meta.altura !== '630') {
      falhas.push(`${rota}: dimensões ${meta.largura}x${meta.altura}, esperado 1200x630`);
    }
    if (!meta.alt) falhas.push(`${rota}: og:image sem texto alternativo`);

    const resposta = await request.get(new URL(meta.imagem).pathname + new URL(meta.imagem).search);
    if (!resposta.ok()) {
      falhas.push(`${rota}: a imagem respondeu ${resposta.status()}`);
    } else if (!resposta.headers()['content-type']?.startsWith('image/')) {
      falhas.push(`${rota}: a imagem veio como ${resposta.headers()['content-type']}`);
    }
  }

  expect(falhas, `\n  ${falhas.join('\n  ')}\n`).toEqual([]);
});
