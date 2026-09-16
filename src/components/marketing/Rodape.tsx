import Link from 'next/link';
import { Logotipo } from '@/components/brand/Marca';
import { Container } from '@/components/ui/Container';
import { EMPRESA } from '@/content/identidade';
import { NAV_RODAPE } from '@/content/navegacao';

const GRUPOS = [
  { titulo: 'A empresa', itens: NAV_RODAPE.empresa },
  { titulo: 'Os caminhos', itens: NAV_RODAPE.caminhos },
  { titulo: 'Institucional', itens: NAV_RODAPE.legal },
] as const;

export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer data-fundo="escuro" className="bg-navy-escuro text-ardosia-clara">
      <Container largura="larga" className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Logotipo className="text-branco" />
            <p className="mt-6 max-w-xs text-legenda leading-relaxed text-ardosia-clara">
              Instalamos capacidade de IA e provamos o que ela mudou: com número combinado antes e
              medido depois, assinado por gente.
            </p>
            <a
              href={`mailto:${EMPRESA.email}`}
              className="mt-6 inline-block font-mono text-legenda text-ouro-claro underline-offset-4 transition-colors hover:text-ouro-claro hover:underline"
            >
              {EMPRESA.email}
            </a>
          </div>

          {GRUPOS.map((grupo) => (
            <nav key={grupo.titulo} aria-label={grupo.titulo}>
              <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ouro-claro">
                {grupo.titulo}
              </h2>
              <ul className="mt-5 space-y-3">
                {grupo.itens.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      /* O rodapé tem doze links e aparece em toda página:
                         prefazer todos seria o maior gasto de rede do site,
                         para a área de menor intenção de clique. */
                      prefetch={false}
                      className="text-legenda text-ardosia-clara transition-colors duration-300 hover:text-branco"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule-gold mt-16" aria-hidden />

        <div className="mt-8 flex flex-col gap-3 font-mono text-rotulo tracking-wide text-ardosia-clara sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {EMPRESA.assinatura} · {EMPRESA.dominio}
          </p>
          <p>{EMPRESA.pais} · pt-BR</p>
        </div>
      </Container>
    </footer>
  );
}
