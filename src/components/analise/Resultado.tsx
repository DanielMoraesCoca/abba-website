'use client';

import { useState } from 'react';
import { Revelar } from '@/components/motion/Revelar';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { CampoTexto } from './Campos';
import { ROTULO_DO_VETOR, type Qualificacao, type Vetor } from '@/lib/analise/modelo';
import type { Narrativa } from '@/lib/analise/narrativa';
import { EMPRESA } from '@/content/identidade';
import { cn } from '@/lib/utils';

export interface RespostaAnalise {
  readonly empresa: string;
  readonly setor: string;
  readonly vetor: Vetor;
  readonly qualificacao: Qualificacao;
  readonly narrativa: Narrativa;
}

const CORES_DA_LEITURA: Record<Qualificacao['leitura'], string> = {
  'alvo-cheio': 'border-ouro',
  'alvo-real': 'border-ouro',
  'ainda-nao': 'border-ardosia',
};

/**
 * A tela da Primeira Leitura.
 *
 * ────────────────────────────────────────────────────────────────────────
 * A ordem dos blocos é doutrina, não estética:
 *   1. a leitura nomeada  — inclusive quando ela é "hoje não somos a escolha"
 *   2. o vetor            — por onde o dinheiro sai, sem dizer quanto
 *   3. as perguntas       — as que só quem está dentro pode responder
 *   4. o limite honesto   — isto foi lido de fora, e o que falta ver
 *   5. o próximo passo    — um e-mail, sem cadastro obrigatório
 *
 * A leitura do alvo vem PRIMEIRO e nunca é suavizada. Recusa é nomeada, não
 * disfarçada: é melhor dizer "hoje não" na primeira tela do que descobrir
 * no mês quatro.
 *
 * O que saiu daqui foi a faixa em reais, com a conta desenhada e as
 * premissas que a sustentavam. Não foi corte de escopo: uma cifra sobre a
 * empresa de quem lê, montada a partir do que ele mesmo declarou num
 * formulário, é um número que a casa publica sem ter entrado lá. O
 * cabeçalho de `lib/analise/faixa-suspensa.ts` tem a decisão inteira e o
 * que precisa acontecer para ela voltar.
 */
export function Resultado({ dados, aoRecomecar }: {
  readonly dados: RespostaAnalise;
  readonly aoRecomecar: () => void;
}) {
  const { vetor, qualificacao, narrativa, empresa } = dados;

  return (
    /* A CASCATA DO RESULTADO.
       ──────────────────────────────────────────────────────────────────
       `data-revelar-lista` liga o escalonamento que o resto do site já usa:
       cada bloco filho recebe `--indice` pela posição e atrasa a própria
       entrada em `--passo`. Aqui o passo é 40ms, e não os 60ms do padrão,
       porque estes blocos são LONGOS: com seis blocos a 60ms o último
       espera trezentos e sessenta milissegundos depois do primeiro, e o
       leitor já começou a ler. A 40ms o texto chega na ordem em que se lê,
       que é o ponto, e não numa fila.

       Não é uma lista de verdade, e por isso não é <ul>: é o mesmo
       mecanismo de CSS aplicado a seções irmãs. */
    <div data-revelar-lista style={{ '--passo': '40ms' } as React.CSSProperties} className="space-y-16">
      {/* 1 · A leitura nomeada */}
      <Revelar as="section">
        <Sobretitulo>Primeira leitura · {empresa}</Sobretitulo>

        <h2
          className={cn(
            'mt-7 border-l-2 pl-7 text-secao leading-[1.12] text-navy',
            CORES_DA_LEITURA[qualificacao.leitura],
          )}
        >
          {qualificacao.titulo}
        </h2>
        <p className="mt-7 max-w-2xl text-corpo leading-[1.7] text-ardosia">
          {qualificacao.texto}
        </p>
        <p className="nums mt-7 font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
          Teste do alvo · {qualificacao.placar.toString().replace('.', ',')} de{' '}
          {qualificacao.maximo} condições
        </p>

        {/* A ORIGEM DA LEITURA, COLADA NA LEITURA.
            ──────────────────────────────────────────────────────────────
            Esta frase já existia mais abaixo, no bloco do limite honesto, e
            estar na mesma PÁGINA não é o mesmo que estar na mesma TELA.
            Quem lê "vocês estão prontos para a conversa inteira" precisa
            saber, no mesmo campo de visão, que isso saiu do que ele mesmo
            declarou em dez respostas fechadas, e de mais nada. A ressalva
            que chega três blocos depois do veredito chega tarde. */}
        <p className="mt-4 max-w-2xl text-legenda leading-[1.65] text-ardosia">
          Esta leitura foi montada só com o que você declarou nas respostas acima. A ABBA não
          consultou nada sobre a sua empresa, e não publica número nenhum sobre ela.
        </p>
      </Revelar>

      {/* 2 · O vetor */}
      <Revelar as="section" className="border-t border-navy/15 pt-10">
        <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
          O vetor principal
        </h2>
        <p className="mt-5 text-lede leading-snug text-navy">{ROTULO_DO_VETOR[vetor]}</p>
        <p className="mt-5 max-w-2xl text-corpo leading-[1.7] text-ardosia">
          {narrativa.vetorFrase}
        </p>
      </Revelar>

      {/* 3 · As perguntas que só quem está dentro responde */}
      <Revelar as="section" className="border-t border-navy/15 pt-10">
        <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
          O que a gente perguntaria à sua diretoria
        </h2>
        <ul className="mt-7 space-y-5">
          {narrativa.perguntas.map((pergunta) => (
            <li key={pergunta} className="flex gap-4">
              <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-ouro" />
              <p className="text-corpo leading-[1.65] text-navy">{pergunta}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-legenda leading-[1.7] text-ardosia">
          {narrativa.oQueFaltaOlhar}
        </p>
      </Revelar>

      {/* 4 · O limite honesto, e 5 · o próximo passo. Vêm juntos de
           propósito: o convite só é honesto depois de o limite estar na
           tela, e o limite só não é desculpa se vier com um passo. */}
      <Revelar as="section" className="bg-papel p-7 sm:p-9">
        <h2 className="font-mono text-rotulo uppercase tracking-[0.2em] text-ardosia">
          O limite honesto
        </h2>
        <p className="mt-5 max-w-2xl text-corpo leading-[1.7] text-navy">
          Isto foi lido de fora, com o que você declarou em respostas fechadas, e nada mais.
          Não é diagnóstico, não é avaliação de prontidão, e não põe número nenhum na sua operação:
          é onde vocês estão e qual é o passo seguinte.
        </p>
        <p className="mt-5 max-w-2xl text-corpo leading-[1.7] text-navy">
          <span className="font-medium">Próximo passo. </span>
          {qualificacao.proximoPasso}
        </p>
      </Revelar>

      <div data-sem-impressao>
        <FormularioDeContato empresaSugerida={empresa} />
      </div>

      <div
        data-sem-impressao
        className="flex flex-col gap-4 border-t border-navy/15 pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="font-mono text-rotulo leading-relaxed tracking-[0.02em] text-ardosia">
          Texto de apoio gerado{' '}
          {narrativa.origem === 'modelo'
            ? 'com apoio de modelo de linguagem, sobre número calculado por modelo aritmético'
            : 'sem modelo de linguagem (modo determinístico)'}
          . O número nunca sai de um modelo de linguagem.
        </p>
        <div className="flex flex-wrap gap-6">
          {/* Levar isto para a diretoria é o próximo passo natural, e a
              folha de estilo de impressão entrega um documento em vez de
              uma captura de página com menu no meio. */}
          <button
            type="button"
            onClick={() => window.print()}
            className="font-mono text-rotulo uppercase tracking-[0.12em] text-navy underline-offset-4 hover:underline"
          >
            Salvar em PDF
          </button>
          <button
            type="button"
            onClick={aoRecomecar}
            className="font-mono text-rotulo uppercase tracking-[0.12em] text-ardosia underline-offset-4 hover:underline"
          >
            Refazer com outras respostas
          </button>
        </div>
      </div>
    </div>
  );
}

function FormularioDeContato({ empresaSugerida }: { readonly empresaSugerida: string }) {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [armadilha, setArmadilha] = useState('');
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'ok' | 'erro'>('parado');
  const [mensagemErro, setMensagemErro] = useState('');

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEstado('enviando');
    setMensagemErro('');

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nome,
          cargo,
          email,
          empresa: empresaSugerida,
          origem: 'analise',
          website: armadilha,
        }),
      });

      if (!resposta.ok) {
        const corpo = (await resposta.json().catch(() => null)) as { mensagem?: string } | null;
        setMensagemErro(corpo?.mensagem ?? 'Não conseguimos enviar agora.');
        setEstado('erro');
        return;
      }
      setEstado('ok');
    } catch {
      setMensagemErro('Sem conexão com o servidor. Tente de novo em instantes.');
      setEstado('erro');
    }
  }

  if (estado === 'ok') {
    return (
      <section className="bg-navy p-8 text-ardosia-clara sm:p-10">
        <h2 className="font-display text-lede text-branco">Recebido.</h2>
        <p className="mt-4 max-w-xl text-corpo leading-[1.7] text-ardosia-clara">
          Um sócio responde em 24 horas úteis com uma proposta de horário. A conversa é de 45
          minutos, são cinco perguntas, e a gente não apresenta nada nela: quem apresenta antes de
          entender vende o produto errado.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-navy p-8 text-ardosia-clara sm:p-10">
      <h2 className="font-display text-lede leading-snug text-branco">
        Quer o assessment gratuito da sua empresa?
      </h2>
      <p className="mt-4 max-w-2xl text-corpo leading-[1.7] text-ardosia-clara">
        O que você leu acima saiu das suas respostas e nada mais. O assessment é outra coisa: a gente monta um
        documento sobre a sua empresa com informação pública, com nota de maturidade, oportunidades
        priorizadas e o registro de cada fonte, e apresenta ao vivo numa conversa de 45 minutos. É
        gratuito também.
      </p>
      <p className="mt-4 max-w-2xl text-corpo leading-[1.7] text-ardosia-clara">
        Escrever para{' '}
        <a
          href={`mailto:${EMPRESA.email}`}
          className="text-ouro-claro underline underline-offset-4"
        >
          {EMPRESA.email}
        </a>{' '}
        resolve igual. O formulário abaixo é atalho, nunca cadastro.
      </p>

      <form onSubmit={enviar} className="mt-8 grid items-end gap-5 sm:grid-cols-2" noValidate>
        <CampoTexto
          id="contato-nome"
          rotulo="Seu nome"
          valor={nome}
          aoMudar={setNome}
          obrigatorio
          tom="escuro"
        />
        <CampoTexto
          id="contato-cargo"
          rotulo="Cargo"
          valor={cargo}
          aoMudar={setCargo}
          tom="escuro"
        />
        <div className="sm:col-span-2">
          <CampoTexto
            id="contato-email"
            rotulo="E-mail corporativo"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            obrigatorio
            tom="escuro"
          />
        </div>

        {/* Armadilha para robô — escondida de gente, visível para script. */}
        <div aria-hidden className="hidden">
          <label htmlFor="contato-website">Não preencha este campo</label>
          <input
            id="contato-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={armadilha}
            onChange={(e) => setArmadilha(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={estado === 'enviando'}
            className="inline-flex items-center justify-center rounded-[3px] bg-ouro px-7 py-3.5 font-medium text-navy transition-colors duration-300 hover:bg-ouro-claro disabled:opacity-60"
          >
            {estado === 'enviando' ? 'Enviando…' : 'Quero a conversa de 45 minutos'}
          </button>
          <p className="font-mono text-rotulo leading-relaxed tracking-[0.02em] text-ardosia-clara">
            Só usamos para responder. Nada de lista, nada de sequência automática.
          </p>
        </div>

        {estado === 'erro' && (
          <p role="alert" className="sm:col-span-2 text-legenda text-ouro-claro">
            {mensagemErro} Você também pode escrever direto para {EMPRESA.email}.
          </p>
        )}
      </form>
    </section>
  );
}
