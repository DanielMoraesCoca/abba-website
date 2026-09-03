import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Configuração plana (flat config). `eslint-config-next` já exporta neste
 * formato na versão 16 — não passar pelo FlatCompat, que quebra ao tentar
 * validar a estrutura circular de plugins do config do Next.
 */
const configuracao = [
  { ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Variável ignorada de propósito se marca com `_` na frente.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
];

export default configuracao;
