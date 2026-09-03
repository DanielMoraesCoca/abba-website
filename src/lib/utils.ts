/** Junta classes condicionalmente. Pequeno de propósito: uma dependência a menos. */
export function cn(...partes: (string | false | null | undefined)[]): string {
  return partes.filter(Boolean).join(' ');
}
