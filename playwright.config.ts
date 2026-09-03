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
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
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
