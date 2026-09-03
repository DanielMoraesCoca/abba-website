import type { ItemNav } from './tipos';

export const NAV_PRINCIPAL = [
  { rotulo: 'O que fazemos', href: '/o-que-fazemos', descricao: 'Os três caminhos e as três fases' },
  { rotulo: 'O Programa', href: '/programa', descricao: 'AI Native · Ano 1' },
  { rotulo: 'Conselheiro', href: '/conselheiro', descricao: 'A cadeira fracionária de IA' },
  { rotulo: 'Método', href: '/metodo', descricao: 'As 25 dimensões e o protocolo de prova' },
  { rotulo: 'Evidências', href: '/evidencias', descricao: 'Os números que usamos, com a fonte' },
  { rotulo: 'Manifesto', href: '/manifesto', descricao: 'O que acreditamos e o que recusamos' },
] as const satisfies readonly ItemNav[];

export const NAV_RODAPE = {
  empresa: [
    { rotulo: 'O que fazemos', href: '/o-que-fazemos' },
    { rotulo: 'Manifesto', href: '/manifesto' },
    { rotulo: 'Método', href: '/metodo' },
    { rotulo: 'Evidências', href: '/evidencias' },
  ],
  caminhos: [
    { rotulo: 'Mapa de Vazamento', href: '/mapa-de-vazamento' },
    { rotulo: 'O Programa', href: '/programa' },
    { rotulo: 'Conselheiro de IA', href: '/conselheiro' },
    { rotulo: 'Análise gratuita', href: '/analise' },
  ],
  legal: [
    { rotulo: 'Privacidade', href: '/privacidade' },
    { rotulo: 'Contato', href: '/contato' },
  ],
} as const satisfies Record<string, readonly ItemNav[]>;
