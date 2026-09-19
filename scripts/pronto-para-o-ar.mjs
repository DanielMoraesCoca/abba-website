/**
 * ESTÁ PRONTO PARA SUBIR?
 *
 * ════════════════════════════════════════════════════════════════════════
 * A lista do que precisa ser verdade antes de apontar o domínio existia em
 * três lugares: `docs/pendencias.md`, o `.env.example`, e a cabeça de quem
 * escreveu. Lista em três lugares é lista que diverge, e esta é a que não
 * pode: quem aponta o domínio não é quem escreveu o site.
 *
 * Este comando responde uma pergunta só, com saída zero ou um, e diz o que
 * falta e onde mexer. Ele NÃO é um teste: os testes garantem que o site está
 * correto, isto garante que o AMBIENTE está pronto para recebê-lo.
 *
 *   npm run pronto                  confere o que não depende de servidor
 *   npm run build && npm run pronto  confere também o que só aparece no build
 *
 * Três níveis, e a diferença importa:
 *
 *   BLOQUEIA  o site não deve ir ao ar assim. Sai com código 1.
 *   AVISA     vai ao ar, com um custo que alguém precisa ter aceitado.
 *   OK        conferido.
 *
 * A regra de ouro deste arquivo: ele só afirma o que mediu. Nada aqui
 * pergunta "está configurado?" e aceita a resposta; cada item lê o valor, o
 * arquivo ou o build.
 * ════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync } from 'node:fs';

const itens = [];
const anotar = (nivel, titulo, detalhe, onde) =>
  itens.push({ nivel, titulo, detalhe, onde });

/* ── 1. O controlador dos dados ─────────────────────────────────────────
   A única pendência que os sócios classificaram como não-adiável: revisão
   de advogado pode vir depois do ar, identificação do controlador não. */
const controlador = readFileSync('src/content/controlador.ts', 'utf8');
const faltando = [...controlador.matchAll(/(razaoSocial|cnpj|encarregado):\s*A_PREENCHER/g)].map(
  (m) => ({ razaoSocial: 'razão social', cnpj: 'CNPJ', encarregado: 'encarregado' })[m[1]],
);
if (faltando.length > 0) {
  anotar(
    'BLOQUEIA',
    'O controlador dos dados não está identificado',
    `Falta: ${faltando.join(', ')}. Quem exerce um direito precisa saber contra quem exerce.`,
    'src/content/controlador.ts',
  );
} else {
  anotar('OK', 'Controlador identificado na página de privacidade', '', '');
}

/* ── 2. As variáveis de ambiente ────────────────────────────────────────
   Nenhuma delas quebra o site. Duas delas mudam o que acontece com quem
   preenche um formulário, e é isso que precisa ser uma decisão. */
if (!process.env.ABBA_LEAD_WEBHOOK) {
  anotar(
    'BLOQUEIA',
    'Os formulários não têm para onde mandar o contato',
    'Sem ABBA_LEAD_WEBHOOK o formulário responde "Recebido" e o lead fica só no log do ' +
      'servidor, que em hospedagem gerenciada é efêmero e ninguém lê. O visitante acha que ' +
      'falou com a casa, e não falou.',
    '.env.example · ABBA_LEAD_WEBHOOK',
  );
} else {
  anotar('OK', 'Webhook de contato configurado', '', '');
}

if (!process.env.ANTHROPIC_API_KEY) {
  anotar(
    'AVISA',
    'A Primeira Leitura vai sair sempre no texto determinístico',
    'Sem ANTHROPIC_API_KEY a leitura, o vetor e as perguntas saem completos: o que não sai é ' +
      'a prosa escrita pelo modelo. Medido: a página não quebra. É degradação aceita, não defeito.',
    '.env.example · ANTHROPIC_API_KEY',
  );
} else {
  anotar('OK', 'Chave da camada de linguagem presente', '', '');
}

const site = process.env.NEXT_PUBLIC_SITE_URL;
if (site && !/^https:\/\/([a-z0-9-]+\.)*abbaservices\.com\.br\/?$/.test(site)) {
  anotar(
    'BLOQUEIA',
    'NEXT_PUBLIC_SITE_URL aponta para fora do domínio da casa',
    `Valor: ${site}. Ele manda no canônico, no mapa do site e nos cartões sociais. Em produção ` +
      'o padrão já é o domínio certo: o jeito certo de usar esta variável é NÃO usá-la.',
    '.env.example · NEXT_PUBLIC_SITE_URL',
  );
} else {
  anotar('OK', 'Domínio canônico correto', '', '');
}

/* ── 3. As portas de uma via ────────────────────────────────────────────
   Preço e nomes de sócios não se despublicam. Aqui o comando não julga o
   valor: ele só garante que ninguém foi ao ar sem perceber que mudou. */
const precos = readFileSync('src/content/precos.ts', 'utf8');
const socios = readFileSync('src/content/socios.ts', 'utf8');
const precoPublico = /PRECO_PUBLICO\s*=\s*true/.test(precos);
const sociosPublicos = /SOCIOS_PUBLICOS\s*=\s*true/.test(socios);
anotar(
  'OK',
  `Portas de uma via: preço ${precoPublico ? 'PÚBLICO' : 'fechado'}, sócios ${
    sociosPublicos ? 'PÚBLICOS' : 'fechados'
  }`,
  precoPublico || sociosPublicos
    ? 'Uma delas está aberta. Confirme que foi decisão, porque o mercado guarda o print.'
    : '',
  '',
);

/* ── 4. O que só existe depois do build ─────────────────────────────────
   Pulado quando não há build, em vez de reprovar: rodar o comando antes de
   construir é uso legítimo. */
if (existsSync('.next/server/app/sitemap.xml.body')) {
  const mapa = readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
  const vazamentos = ['/quem-responde'].filter((r) => mapa.includes(r));
  if (vazamentos.length > 0) {
    anotar(
      'BLOQUEIA',
      'Rota não publicada entrou no mapa do site',
      `No mapa: ${vazamentos.join(', ')}.`,
      'src/app/sitemap.ts',
    );
  } else {
    anotar('OK', 'Mapa do site sem rota não publicada', '', '');
  }
} else {
  anotar('AVISA', 'Mapa do site não conferido', 'Rode `npm run build` antes para incluir esta checagem.', '');
}

/* ── Saída ──────────────────────────────────────────────────────────── */
const ordem = { BLOQUEIA: 0, AVISA: 1, OK: 2 };
itens.sort((a, b) => ordem[a.nivel] - ordem[b.nivel]);

const cor = { BLOQUEIA: '\x1b[31m', AVISA: '\x1b[33m', OK: '\x1b[32m' };
console.log('');
for (const { nivel, titulo, detalhe, onde } of itens) {
  console.log(`${cor[nivel]}${nivel.padEnd(8)}\x1b[0m ${titulo}`);
  if (detalhe) console.log(`         ${detalhe.replace(/(.{76}) /g, '$1\n         ')}`);
  if (onde) console.log(`         \x1b[2monde: ${onde}\x1b[0m`);
}

const bloqueios = itens.filter((i) => i.nivel === 'BLOQUEIA').length;
console.log('');
if (bloqueios > 0) {
  console.log(
    `\x1b[31m${bloqueios} ${bloqueios === 1 ? 'coisa impede' : 'coisas impedem'} o site de subir.\x1b[0m`,
  );
  process.exit(1);
}
console.log('\x1b[32mPronto para apontar o domínio.\x1b[0m');
