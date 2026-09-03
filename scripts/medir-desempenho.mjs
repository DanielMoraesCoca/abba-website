/**
 * Mede o desempenho real das páginas contra o build de produção.
 *
 * Existe porque "o site está rápido" é uma opinião até alguém medir, e esta
 * casa não vende opinião. Rode antes e depois de qualquer mudança que
 * acrescente peso — biblioteca nova, fonte nova, imagem nova — e compare.
 *
 *   npm run build
 *   npx next start -p 3265 &
 *   npm run medir
 *
 * O que os números querem dizer:
 *   LCP  — quando o maior elemento da tela terminou de pintar. Alvo: < 2,5s
 *          em rede real; o valor daqui é local, então serve para comparar
 *          uma versão com a outra, não para prometer nada a cliente.
 *   CLS  — o quanto a página se mexe sozinha depois de carregar. Alvo: 0.
 *   Rede — bytes que realmente atravessam a rede, já comprimidos. É o
 *          número que importa para quem está num 4G ruim.
 *   Parse— bytes depois de descomprimir: o que o navegador tem que
 *          interpretar. Sempre maior, e é o que custa CPU em aparelho fraco.
 *
 * Reportar um pelo outro seria exatamente o tipo de número impreciso que
 * esta casa não publica. Por isso os dois aparecem, sempre.
 */

import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:3265';
const ROTAS = ['/', '/analise', '/evidencias', '/programa', '/metodo'];
const ESPERA_MS = 2600;

/**
 * O orçamento. Medir sem orçamento é passatempo: alguém acrescenta uma
 * biblioteca, o número piora dez por cento, e ninguém percebe até o site
 * estar duas vezes mais lento um ano depois.
 *
 * Os valores são folgados de propósito — cerca de 30% acima do que o site
 * marca hoje. Um orçamento apertado demais vira alarme falso e o time
 * aprende a ignorar. Este só dispara quando alguma coisa mudou de verdade.
 *
 * Se estourar: não afrouxe o número antes de saber o que engordou. Rode
 * `npm run medir` e olhe a tabela por tipo de recurso, que é onde a
 * resposta costuma estar.
 */
const ORCAMENTO = {
  redeKB: 420,
  cls: 0.02,
};

let estourou = false;

const navegador = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
});

const porTipo = {};

for (const rota of ROTAS) {
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();

  let rede = 0;
  let parse = 0;
  let pedidos = 0;

  pagina.on('response', async (resposta) => {
    pedidos += 1;
    try {
      const corpo = await resposta.body();
      parse += corpo.length;

      // `sizes()` traz o que o servidor mandou de fato — comprimido. Quando
      // não estiver disponível, cai no tamanho descomprimido em vez de
      // reportar zero e mentir para baixo.
      const tamanhos = await resposta.request().sizes().catch(() => null);
      rede += tamanhos?.responseBodySize ?? corpo.length;

      if (rota === '/') {
        const tipo = (resposta.headers()['content-type'] ?? 'desconhecido').split(';')[0];
        porTipo[tipo] ??= { rede: 0, parse: 0 };
        porTipo[tipo].rede += tamanhos?.responseBodySize ?? corpo.length;
        porTipo[tipo].parse += corpo.length;
      }
    } catch {
      // Redirecionamentos e respostas sem corpo não contam.
    }
  });

  await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });

  const medidas = await pagina.evaluate(
    (espera) =>
      new Promise((resolver) => {
        const dados = { lcp: 0, cls: 0, tarefasLongas: 0 };
        new PerformanceObserver((lista) => {
          for (const entrada of lista.getEntries()) dados.lcp = entrada.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((lista) => {
          for (const entrada of lista.getEntries()) {
            if (!entrada.hadRecentInput) dados.cls += entrada.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((lista) => {
          dados.tarefasLongas += lista.getEntries().length;
        }).observe({ type: 'longtask', buffered: true });
        setTimeout(() => resolver(dados), espera);
      }),
    ESPERA_MS,
  );

  const redeKB = rede / 1024;
  const foraDoOrcamento = redeKB > ORCAMENTO.redeKB || medidas.cls > ORCAMENTO.cls;
  if (foraDoOrcamento) estourou = true;

  console.log(
    rota.padEnd(14),
    `LCP ${Math.round(medidas.lcp)}ms`.padEnd(11),
    `CLS ${medidas.cls.toFixed(4)}`.padEnd(12),
    `tarefas longas ${medidas.tarefasLongas}`.padEnd(18),
    `rede ${redeKB.toFixed(0)}KB`.padEnd(13),
    `parse ${(parse / 1024).toFixed(0)}KB`.padEnd(14),
    `${pedidos} pedidos`,
    foraDoOrcamento ? ' ← FORA DO ORÇAMENTO' : '',
  );

  await contexto.close();
}

console.log('\nA home, por tipo de recurso (rede / parse):');
for (const [tipo, b] of Object.entries(porTipo).sort((a, c) => c[1].rede - a[1].rede)) {
  console.log(
    `  ${(b.rede / 1024).toFixed(0).padStart(5)}KB / ${(b.parse / 1024).toFixed(0).padStart(5)}KB  ${tipo}`,
  );
}

await navegador.close();

if (estourou) {
  console.error(
    `\nOrçamento estourado: o teto é ${ORCAMENTO.redeKB} KB de rede e ${ORCAMENTO.cls} de CLS por página.` +
      '\nAntes de afrouxar o número, descubra o que engordou — a tabela por tipo de recurso, acima,' +
      '\ncostuma responder em dez segundos.',
  );
  process.exitCode = 1;
} else {
  console.log(
    `\nDentro do orçamento (teto: ${ORCAMENTO.redeKB} KB de rede, ${ORCAMENTO.cls} de CLS).`,
  );
}
