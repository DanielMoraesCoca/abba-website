/**
 * Injeta um bloco JSON-LD. Um lugar só, para o `dangerouslySetInnerHTML`
 * não se espalhar por página nenhuma.
 *
 * O conteúdo é sempre estático e nosso — nunca entrada de usuário. Se um dia
 * alguém quiser interpolar algo vindo de fora aqui, a resposta é não.
 */
export function DadosEstruturados({ dados }: { readonly dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
