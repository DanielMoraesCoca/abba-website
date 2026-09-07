'use client';

import { useEffect } from 'react';
import { Botao, BotaoAcao } from '@/components/ui/Botao';
import { Container } from '@/components/ui/Container';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

/**
 * O que o visitante vê quando algo quebra dentro de uma rota.
 *
 * ────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE ARQUIVO EXISTE.
 *
 * Sem ele, um erro não tratado mostra a tela padrão do Next: fundo branco,
 * texto em inglês, tipografia do sistema. Numa consultoria que vende rigor,
 * essa tela diz mais sobre a casa do que qualquer página bem feita.
 *
 * Falhar é inevitável; falhar sem marca e sem saída, não.
 *
 * O QUE NÃO SE MOSTRA. A mensagem crua do erro nunca aparece. Em produção o
 * Next já a substitui por um `digest` no servidor, mas um erro de cliente
 * chega aqui inteiro — e mensagem de exceção vaza caminho de arquivo, nome
 * de variável e, no pior caso, dado de quem estava preenchendo o
 * formulário. O visitante recebe o código curto; ele serve para o suporte
 * casar a queixa com o registro, e não diz nada a mais para quem o lê.
 * ──────────────────────────────────────────────────────────────────────── */
export default function Erro({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    // Registra no console do navegador, onde o suporte pede para olhar.
    // Um serviço de telemetria entra aqui quando existir — está na lista.
    console.error('[abba] falha em rota:', error.digest ?? error.message);
  }, [error]);

  return (
    <section
      data-fundo="escuro"
      className="flex min-h-[70vh] items-center bg-navy-900 pt-[var(--header-h)]"
    >
      <Container largura="estreita">
        <Sobretitulo invertido>Falha</Sobretitulo>
        <h1 className="mt-7 text-[2.2rem] leading-[1.12] text-ice-100 sm:text-[2.9rem]">
          Alguma coisa quebrou aqui.
        </h1>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-[1.65] text-ice-200/70">
          O erro é nosso, não seu. Tentar de novo costuma resolver — o que
          falhou pode ter sido uma resposta que demorou demais.
        </p>

        {error.digest && (
          <p className="mt-6 font-mono text-[0.85rem] text-ice-200/45">
            Código: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <BotaoAcao onClick={reset} variante="primario-invertido">
            Tentar de novo
          </BotaoAcao>
          <Botao href="/" variante="fantasma">
            Voltar ao início
          </Botao>
        </div>

        <p className="mt-12 text-[0.95rem] leading-[1.6] text-ice-200/55">
          Se insistir, escreva para{' '}
          <a
            href="mailto:contato@abbaservices.com.br"
            className="text-gold-400 underline decoration-gold-400/40 underline-offset-4 transition-colors duration-[var(--duration-micro)] hover:text-gold-300"
          >
            contato@abbaservices.com.br
          </a>{' '}
          com o código acima.
        </p>
      </Container>
    </section>
  );
}
