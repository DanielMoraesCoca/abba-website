'use client';

/**
 * O último recurso.
 *
 * ────────────────────────────────────────────────────────────────────────
 * Este arquivo só entra em cena se o PRÓPRIO layout raiz falhar. Quando
 * isso acontece não existe cabeçalho, não existe rodapé, e as fontes da
 * casa não carregaram — o `global-error` substitui o documento inteiro,
 * `<html>` e `<body>` incluídos.
 *
 * Por isso ele não importa componente nenhum e não depende do `globals.css`:
 * um arquivo que só roda quando tudo quebrou não pode depender de nada que
 * possa ter quebrado. O estilo vai em linha, com as cores da marca escritas
 * à mão e uma pilha de fontes do sistema. É feio de manter e é o certo.
 *
 * O texto é curto de propósito. Quem chega aqui não quer explicação: quer
 * saber se o problema é dele, e como sair.
 * ──────────────────────────────────────────────────────────────────────── */
export default function ErroGlobal({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          background: '#0E1729',
          color: '#FBFBFC',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <main style={{ margin: '0 auto', maxWidth: '34rem', padding: '2rem 1.5rem' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#C2A35B',
            }}
          >
            ABBA
          </p>

          <h1
            style={{
              margin: '1.6rem 0 0',
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              lineHeight: 1.14,
              fontWeight: 400,
            }}
          >
            O site não conseguiu carregar.
          </h1>

          <p
            style={{
              margin: '1.4rem 0 0',
              fontSize: '1.02rem',
              lineHeight: 1.65,
              color: 'rgba(251,251,252,0.7)',
            }}
          >
            A falha é nossa. Recarregar resolve na maior parte das vezes.
          </p>

          {error.digest && (
            <p
              style={{
                margin: '1.4rem 0 0',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: '0.85rem',
                color: 'rgba(251,251,252,0.45)',
              }}
            >
              Código: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            style={{
              margin: '2.4rem 0 0',
              padding: '0.85rem 1.5rem',
              border: 0,
              borderRadius: '3px',
              background: '#C2A35B',
              color: '#0E1729',
              font: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Recarregar
          </button>

          <p
            style={{
              margin: '3rem 0 0',
              fontSize: '0.94rem',
              lineHeight: 1.6,
              color: 'rgba(251,251,252,0.55)',
            }}
          >
            Se insistir:{' '}
            <a href="mailto:contato@abbaservices.com.br" style={{ color: '#D3B87F' }}>
              contato@abbaservices.com.br
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
