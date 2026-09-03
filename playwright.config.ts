import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de ponta a ponta.
 *
 * Roda contra o build de produção, não contra o `dev`: o que quebra em
 * produção — pré-renderização, hidratação, cabeçalho de segurança — não
 * aparece no servidor de desenvolvimento.
 *
 * O Chromium já está instalado no ambiente; `PLAYWRIGHT_CHROMIUM` permite
 * apontar para ele sem baixar de novo.
 */
const PORTA = 3311;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: 'on-first-retry',
    locale: 'pt-BR',
    ...(process.env.PLAYWRIGHT_CHROMIUM
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM } }
      : {}),
  },
  /* Uma foto é comparada pixel a pixel: um viewport diferente é uma foto
     diferente. Fixar o tamanho aqui evita que a referência dependa da
     janela padrão do dispositivo emulado. */
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002 } },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      testIgnore: /regressao-visual/,
    },
    {
      name: 'celular',
      use: { ...devices['Pixel 7'], viewport: { width: 412, height: 900 } },
      testIgnore: /regressao-visual/,
    },

    /* A regressão visual tem projeto próprio por causa de uma coisa só: a
       escala em que a foto é gravada. As referências são páginas inteiras,
       e em escala de dispositivo cheia pesavam quase 1 MB cada — 14 MB por
       rodada de mudança de desenho, no histórico do git para sempre.
       
       A escala de cada projeto foi MEDIDA, não escolhida:
       
       - Desktop a 0,5 (720px de largura). Encolhe a referência em quatro
         vezes e o texto continua estável entre execuções.
       - Celular a 1,0 (412px). A primeira tentativa usou 0,5 aqui também, e
         o teste começou a falhar sozinho: 5% dos pixels diferentes entre
         duas execuções idênticas. O motivo é o contrário do que eu supus —
         meia escala AUMENTA o ruído de antialiasing, porque cada pixel
         passa a carregar mais glifo. A 412px o Pixel 7 já dá uma imagem
         pequena, e o texto volta a ser determinístico.
       
       O ganho colateral de versionar as referências: a mudança de desenho
       aparece no diff do pull request, revisável como código. */
    {
      name: 'visual-desktop',
      testMatch: /regressao-visual/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 0.5,
      },
    },
    {
      name: 'visual-celular',
      testMatch: /regressao-visual/,
      use: { ...devices['Pixel 7'], viewport: { width: 412, height: 900 }, deviceScaleFactor: 1 },
    },

    /* Safari e Firefox só no CI.
       
       Motivo honesto: o ambiente onde este site foi construído bloqueia o
       download desses dois navegadores, então esta configuração NUNCA foi
       executada aqui. Ela roda pela primeira vez no CI — e se falhar lá, é
       porque encontrou algo real, não porque está errada. O Safari é o que
       mais diverge (`backdrop-filter`, unidades de viewport, a API de
       transição de rota), e é o navegador de boa parte de uma diretoria.
       
       A regressão visual fica de fora: o antialiasing difere entre motores
       e a comparação pixel a pixel viraria alarme falso. O que se quer aqui
       é comportamento, não pixel. */
    ...(process.env.CI
      ? [
          {
            name: 'safari',
            testIgnore: /regressao-visual/,
            use: { ...devices['Desktop Safari'] },
          },
          {
            name: 'firefox',
            testIgnore: /regressao-visual/,
            use: { ...devices['Desktop Firefox'] },
          },
        ]
      : []),
  ],
  webServer: {
    command: `npx next start -p ${PORTA}`,
    // O conjunto percorre o fluxo da Análise umas dez vezes, do mesmo IP,
    // em poucos minutos — e a trava de produção bloqueia isso, com razão.
    // Não é um furo na trava: é o mesmo código lendo outro limite, do jeito
    // que qualquer ambiente configuraria o seu.
    env: { ABBA_LIMITE_ANALISE: '400', ABBA_LIMITE_CONTATO: '400' },
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
