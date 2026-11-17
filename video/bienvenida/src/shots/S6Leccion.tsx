// S6 · una lección — card-stack (demos/ui-entrance/card-stack/CardStack.tsx) adaptado a vertical y a capturas reales:
// nueve pantallas de una lección (el video y ocho juegos distintos) caen desde abajo con resorte, cada vez más seguido
// (EASE.out), cada aterrizaje hunde la pila 5px; preparación de 6f (la pila se aprieta 2 %), abanico con resorte de
// amortiguación 20 (6.5° y 105px por carta, pivote bajo la carta), la cámara se aleja a 0.88 y la carta del centro —el video
// de la lección— sale 72px con borde azul y un solo brillo. Mismo orden de apilado todo el tiempo (sin saltos de zIndex).
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, FONT, mix, ramp, softShadow } from '../fx/Polish';
import { LOOKS, Sheen, Stage, TextReveal, alpha, springAt, stagger, type } from '../fx/Look';

export const S6_DURATION = 175;
const L = LOOKS.zuka;
const N = 9;
const CW = 330;
const CH = CW * 844 / 390;
const CX = 540;
const CY = 1090;
const ROT = 6.5;
const TX = 104;
const FEATURED = 4;
const CARDS = ['juego-alg-0c-2.jpg', 'juego-alg-12-1.jpg', 'juego-alg-21a-1.jpg', 'juego-alg-4-0.jpg', 'leccion-video.jpg',
  'juego-alg-71-0.jpg', 'juego-alg-11-0.jpg', 'juego-alg-0a-0.jpg', 'juego-alg-14-2.jpg'];

const rand = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const START = Array.from({ length: N }, (_, i) => 2 + stagger(i, N, 40, EASE.out));
const inAt = (f: number, i: number) => (f < START[i] ? 0 : springAt(f, START[i], { damping: 13, stiffness: 150 }));
const DROP = 1400;

export const S6Leccion: React.FC = () => {
  const f = useCurrentFrame();
  const dip = START.reduce((d, s) => d + Math.sin(clamp01((f - s - 6) / 9) * Math.PI) * 5, 0);
  const squeeze = 1 - 0.02 * Math.sin(clamp01((f - 62) / 10) * Math.PI);
  const fan = f < 68 ? 0 : springAt(f, 68, { damping: 20, stiffness: 95 });
  const camPush = mix(1, 1.06, ramp(f, 0, 64, EASE.smooth));
  const cam = mix(camPush, 0.88, ramp(f, 64, 42, EASE.smooth)) * mix(1, 1.017, ramp(f, 122, 40, EASE.smooth));
  const lift = ramp(f, 102, 18, EASE.overshoot);
  const ring = ramp(f, 104, 12, EASE.out);
  const sheen = ramp(f, 108, 22, EASE.smooth);
  return (
    <AbsoluteFill style={{ background: L.bg[1] }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.12 }} fill={{ x: 0.5, y: 1 }} intensity={0.8}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1500, height: 260, background: `linear-gradient(180deg, ${alpha(L.accent, 0)} 0%, ${alpha(L.accent, 0.1)} 40%, ${alpha(L.accent, 0)} 100%)` }} />
      </Stage>
      {/* rótulo superior y contador de cartas */}
      <div style={{ position: 'absolute', left: 90, top: 230, fontFamily: FONT.sans, fontSize: 44, fontWeight: 700, letterSpacing: '0.14em', color: L.accent, opacity: ramp(f, 0, 12, EASE.out) }}>
        CADA NIVEL
      </div>
      <div style={{ position: 'absolute', right: 90, top: 236, fontFamily: FONT.sans, fontSize: 36, fontWeight: 600, letterSpacing: '0.1em', color: L.ink3, opacity: ramp(f, 4, 12, EASE.out) }}>
        {`${String(START.filter((s) => f >= s + 6).length).padStart(2, '0')} / ${String(N).padStart(2, '0')}`}
      </div>
      <div style={{ position: 'absolute', left: 90, right: 60, top: 300 }}>
        <div style={{ ...type(96, 700), color: L.ink }}><TextReveal text="Un video corto" by="word" variant="rise" start={100} each={18} gap={3} /></div>
        <div style={{ ...type(96, 700), color: L.ink, marginTop: 6 }}><TextReveal text="y juegos." by="word" variant="rise" start={108} each={18} gap={3} /></div>
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.toFixed(4)})`, transformOrigin: `${CX}px ${CY + 160}px` }}>
        <div style={{ position: 'absolute', left: CX - mix(240, 900, fan) / 2, top: CY + CH / 2 - 40 + dip, width: mix(240, 900, fan), height: 90,
          borderRadius: '50%', background: `radial-gradient(ellipse at center, ${alpha(L.shadow, 0.6)} 0%, ${alpha(L.shadow, 0)} 70%)`, opacity: ramp(f, 6, 20, EASE.out) }} />
        <div style={{ position: 'absolute', inset: 0, perspective: '1800px' }}>
          {CARDS.map((c, i) => {
            const p = inAt(f, i);
            const y = (1 - p) * DROP;
            const vy = ((1 - inAt(f + 0.5, i)) - (1 - inAt(f - 0.5, i))) * DROP;
            const blurY = Math.min(10, Math.abs(vy) * 0.18);
            const k = i - (N - 1) / 2;
            const jitR = (rand(i * 3 + 1) - 0.5) * 6.4;
            const jitX = (rand(i * 5 + 2) - 0.5) * 22;
            const tilt = (i % 2 ? 1 : -1) * 9 * (y / DROP);
            const rot = mix(jitR + tilt, k * ROT, fan);
            const tx = mix(jitX, k * TX, fan);
            const feat = i === FEATURED;
            const ly = feat ? -72 * lift : 0;
            const elev = 6 + (y / DROP) * 50 + (feat ? 26 * lift : 0);
            if (f < START[i]) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: CX - CW / 2, top: CY - CH / 2, width: CW, height: CH, transformOrigin: '50% 130%',
                transform: `translate3d(${tx.toFixed(2)}px, ${(y + dip + ly).toFixed(2)}px, ${i * 2}px) rotate(${rot.toFixed(3)}deg) scale(${squeeze.toFixed(4)})`, zIndex: i }}>
                {blurY > 0.4 && (
                  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
                    <filter id={`cs-vb-${i}`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation={`0 ${blurY.toFixed(2)}`} /></filter>
                  </svg>
                )}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', background: L.surface, border: `1.5px solid ${L.line}`, boxSizing: 'border-box',
                  boxShadow: `${softShadow(elev, { color: '#000000', strength: 2.4 })}` + (feat && ring > 0 ? `, 0 0 0 ${(4 * ring).toFixed(2)}px ${alpha(L.accent, 0.95 * ring)}` : ''),
                  filter: blurY > 0.4 ? `url(#cs-vb-${i})` : undefined }}>
                  <Img src={staticFile(`tex/${c}`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  {feat && <Sheen progress={sheen} strength={0.7} width={0.18} />}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, right: 60, top: 1630, fontFamily: FONT.sans, fontSize: 66, fontWeight: 500, color: L.ink2, lineHeight: 1.1,
        opacity: ramp(f, 118, 14, EASE.out), transform: `translateY(${(1 - ramp(f, 118, 18, EASE.snappy)) * 16}px)` }}>
        Primero la idea; luego<br />la juegas, sin prisa.
      </div>
    </AbsoluteFill>
  );
};
