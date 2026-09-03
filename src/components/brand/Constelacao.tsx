'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * A constelação da capa.
 *
 * A marca da ABBA é um grafo de nós dourados. Esta é essa mesma ideia em
 * movimento: uma malha que se desenha sozinha ao carregar e depois respira
 * devagar, atrás do título. Não é enfeite genérico — é o símbolo da empresa
 * ocupando o fundo, e é por isso que ele pode ficar ali sem competir com o
 * texto.
 *
 * Decisões que valem registro:
 * - Determinístico. A malha é gerada por um PRNG com semente fixa, então
 *   ela é a MESMA em toda visita e em todo servidor. Uma capa que muda a
 *   cada recarga não é identidade, é ruído — e quebraria a hidratação.
 * - Canvas, não DOM. Cento e poucos elementos animados em SVG custam caro
 *   no celular; num canvas é um desenho só.
 * - Respeita `prefers-reduced-motion`: desenha o quadro final e para.
 */

interface No {
  x: number;
  y: number;
  r: number;
  fase: number;
  amplitude: number;
}

const QTD_NOS = 62;
const DIST_MAX = 0.19; // fração da menor dimensão
const SEMENTE = 20260831;

/** PRNG determinístico (mulberry32). */
function prng(semente: number) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gerarNos(): No[] {
  const rand = prng(SEMENTE);
  const nos: No[] = [];
  for (let i = 0; i < QTD_NOS; i += 1) {
    nos.push({
      x: rand(),
      y: rand(),
      r: 1.1 + rand() * 2.4,
      fase: rand() * Math.PI * 2,
      amplitude: 0.002 + rand() * 0.005,
    });
  }
  return nos;
}

export function Constelacao({ className }: { readonly className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [pronto, setPronto] = useState(false);
  const nos = useMemo(() => gerarNos(), []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let largura = 0;
    let altura = 0;
    let quadro = 0;
    let inicio = 0;

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const caixa = canvas.getBoundingClientRect();
      largura = caixa.width;
      altura = caixa.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const desenhar = (t: number) => {
      if (!inicio) inicio = t;
      const decorrido = (t - inicio) / 1000;
      // A malha se desenha em 2,4s e depois só respira.
      const entrada = semMovimento ? 1 : Math.min(decorrido / 2.4, 1);
      const suave = 1 - Math.pow(1 - entrada, 3);

      ctx.clearRect(0, 0, largura, altura);
      const escala = Math.min(largura, altura);
      const limite = escala * DIST_MAX;

      const pontos = nos.map((n) => {
        const deriva = semMovimento ? 0 : Math.sin(decorrido * 0.22 + n.fase) * n.amplitude;
        return {
          x: (n.x + deriva) * largura,
          y: (n.y + deriva * 0.6) * altura,
          r: n.r,
        };
      });

      ctx.lineWidth = 0.7;
      for (let i = 0; i < pontos.length; i += 1) {
        for (let j = i + 1; j < pontos.length; j += 1) {
          const a = pontos[i];
          const b = pontos[j];
          if (!a || !b) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > limite) continue;
          // Arestas mais curtas são mais fortes; e tudo entra progressivamente.
          const forca = (1 - d / limite) * 0.34 * suave;
          ctx.strokeStyle = `rgba(194, 163, 91, ${forca.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of pontos) {
        ctx.fillStyle = `rgba(211, 184, 127, ${(0.55 * suave).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!semMovimento) {
        quadro = requestAnimationFrame(desenhar);
      }
    };

    redimensionar();
    setPronto(true);
    quadro = requestAnimationFrame(desenhar);
    window.addEventListener('resize', redimensionar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('resize', redimensionar);
    };
  }, [nos]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ opacity: pronto ? 1 : 0, transition: 'opacity 900ms var(--ease-abba)' }}
    />
  );
}
