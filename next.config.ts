import type { NextConfig } from 'next';

/**
 * Política de segurança de conteúdo.
 *
 * O que ela garante, e é o que a página de privacidade afirma: **nenhum
 * recurso de terceiro carrega neste site** — script, folha de estilo, fonte,
 * imagem ou chamada de rede. Tudo é `'self'`. As fontes são servidas pelo
 * próprio domínio (next/font baixa e hospeda no build), então não há sequer
 * uma origem de fonte externa para permitir.
 *
 * O que ela NÃO garante, dito com todas as letras: `'unsafe-inline'` em
 * script é necessário porque as páginas são pré-renderizadas estaticamente e
 * o Next injeta o script de hidratação inline. A alternativa — nonce por
 * requisição — obrigaria toda página a virar dinâmica, trocando a velocidade
 * de um site institucional por uma proteção contra injeção que só importaria
 * se este site tivesse entrada de usuário renderizada, e ele não tem: as
 * duas rotas de API validam tudo no servidor e devolvem JSON.
 *
 * Se um dia entrar analytics ou qualquer script externo, ele entra AQUI,
 * explicitamente, com a origem nomeada — nunca como <script> solto numa
 * página.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** Cabeçalhos aplicados a todas as respostas. */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
