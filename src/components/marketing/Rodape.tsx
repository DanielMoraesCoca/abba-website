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
    <footer className="bg-navy-900 text-ice-300">
      <Container largura="larga" className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Logotipo className="text-ice-100" />
            <p className="mt-6 max-w-xs text-[0.94rem] leading-relaxed text-ice-300/70">
              Instalamos capacidade de IA e provamos o que ela mudou: com número combinado antes e
              medido depois, assinado por gente.
            </p>
            <a
              href={`mailto:${EMPRESA.email}`}
              className="mt-6 inline-block font-mono text-[0.82rem] text-gold-400 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
            >
              {EMPRESA.email}
            </a>
          </div>

          {GRUPOS.map((grupo) => (
            <nav key={grupo.titulo} aria-label={grupo.titulo}>
              <h2 className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold-500/80">
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
                      className="text-[0.94rem] text-ice-300/75 transition-colors duration-300 hover:text-ice-100"
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

        <div className="mt-8 flex flex-col gap-3 font-mono text-[0.72rem] tracking-wide text-ice-300/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {EMPRESA.assinatura} · {EMPRESA.dominio}
          </p>
          <p>{EMPRESA.pais} · pt-BR</p>
        </div>
      </Container>
    </footer>
  );
}
