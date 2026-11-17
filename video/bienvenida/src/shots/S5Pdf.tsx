// S5 · resumen en PDF — scan-bracket-sweep (demos/effects/scan-bracket-sweep/ScanBracketSweep.tsx) adaptado a vertical.
// El documento es la página 1 real del resumen de la Pradera de Venn (media/resumenes/conjuntos.pdf, 150 dpi). Igual que el demo:
// el documento entra con escala 0.86→1 y queda quieto; cuatro escuadras en L caen desde 8px afuera con un leve rebote; una franja
// de luz (núcleo fino + halo + estela que se alarga con la velocidad) recorre la hoja 5 veces, lenta en los extremos y rápida
// en el medio. Coordenadas de diseño 270×480 con DesignStage raster="zoom" (la letra se rasteriza al tamaño final).
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { DesignStage, E, lerp, seg, useT } from '../fx/Motion';
import { EASE, FONT, Grain, softShadow } from '../fx/Polish';
import { LOOKS, Stage, TextReveal } from '../fx/Look';

export const S5_DURATION = 165;
const L = LOOKS.zuka;
const SCAN = '61,123,255'; // azul de la app
const INK = L.ink;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const inOutSin = (x: number) => 0.5 - Math.cos(Math.PI * clamp01(x)) / 2;

const DW = 214, DH = DW * 1.414;
const DX = (270 - DW) / 2, DY = 112;
const CS = 30;
const CORNERS = [
  { left: -7, top: -7, d: 'M1 29V1h28', dx: 1, dy: 1 },
  { left: DW + 7 - CS, top: -7, d: 'M1 1h28v28', dx: -1, dy: 1 },
  { left: DW + 7 - CS, top: DH + 7 - CS, d: 'M29 1v28H1', dx: -1, dy: -1 },
  { left: -7, top: DH + 7 - CS, d: 'M29 29H1V1', dx: 1, dy: -1 },
];
const PASSES = 5;
const TAIL = 90;
const scanAt = (t: number) => {
  const sp = seg(t, 0.17, 0.95, E.linear);
  const raw = sp * PASSES;
  const pi = Math.min(PASSES - 1, Math.floor(raw));
  const local = clamp01((raw - pi) / 0.88);
  const dir = pi % 2 === 0 ? 1 : -1;
  const prog = inOutSin(local);
  return { y: dir > 0 ? prog * DH : DH - prog * DH, dir };
};

export const S5Pdf: React.FC = () => {
  const t = useT();
  const dt = 1 / (S5_DURATION - 1);
  const dp = seg(t, 0, 0.11, EASE.snappy);
  const elev = lerp(dp, 22, 6);
  const { y, dir } = scanAt(t);
  const speed = Math.abs(scanAt(t + dt / 2).y - scanAt(t - dt / 2).y);
  const PEAK = (DH * Math.PI) / 2 / (((0.78 * S5_DURATION) / PASSES) * 0.88);
  const tail = TAIL * Math.pow(clamp01(speed / PEAK), 0.75);
  const clipOp = seg(t, 0.16, 0.2) * (1 - seg(t, 0.93, 0.99));
  const f = t * (S5_DURATION - 1);
  return (
    <AbsoluteFill>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.36 }} fill={{ x: 0.2, y: 0.95 }} intensity={0.8} />
      <DesignStage w={270} h={480} bg="transparent" raster="zoom">
        {/* titular */}
        <div style={{ position: 'absolute', left: 22, top: 30, fontFamily: FONT.sans, color: INK, lineHeight: 1 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: '#2fd68f' }}>RESUMEN EN PDF</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>
            <TextReveal text="Uno por cada mundo" start={10} by="word" variant="rise" each={16} gap={4} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: DX, top: DY, width: DW, height: DH }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden', background: '#fff',
            boxShadow: `${softShadow(elev / 3, { strength: 3, color: '#000000' })}`,
            transformOrigin: '50% 50%', transform: `scale(${lerp(dp, 0.86, 1)})`, opacity: clamp01(dp * 3) }}>
            <Img src={staticFile('tex/pdf-1.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
          {/* franja de escaneo recortada a la hoja */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden', pointerEvents: 'none', opacity: clipOp }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0, transform: `translateY(${y.toFixed(3)}px)` }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: tail, top: dir > 0 ? -tail : 0, mixBlendMode: 'multiply',
                background: dir > 0 ? `linear-gradient(180deg, rgba(${SCAN},0) 0%, rgba(${SCAN},0.06) 55%, rgba(${SCAN},0.22) 100%)`
                  : `linear-gradient(0deg, rgba(${SCAN},0) 0%, rgba(${SCAN},0.06) 55%, rgba(${SCAN},0.22) 100%)` }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: -5, height: 10, background: `linear-gradient(180deg, rgba(${SCAN},0) 0%, rgba(${SCAN},0.24) 50%, rgba(${SCAN},0) 100%)` }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: -0.6, height: 1.2,
                background: `linear-gradient(90deg, rgba(${SCAN},0.55) 0%, rgb(${SCAN}) 18%, #9cc0ff 50%, rgb(${SCAN}) 82%, rgba(${SCAN},0.55) 100%)`,
                boxShadow: `0 0 2.5px rgba(${SCAN},0.75)` }} />
            </div>
          </div>
          {CORNERS.map((c, i) => {
            const t0 = 0.08 + i * 0.022;
            const a = seg(t, t0, t0 + 0.03);
            const p = EASE.overshoot(clamp01((t - t0) / 0.055));
            const off = (1 - p) * 8;
            return (
              <svg key={i} width={CS} height={CS} viewBox={`0 0 ${CS} ${CS}`} style={{ position: 'absolute', left: c.left, top: c.top, overflow: 'visible', opacity: a,
                transform: `translate(${(-off * c.dx).toFixed(3)}px,${(-off * c.dy).toFixed(3)}px)` }}>
                <path d={c.d} fill="none" stroke={L.accent2} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );
          })}
        </div>
        {/* pie: lo que trae */}
        <div style={{ position: 'absolute', left: 22, right: 22, top: DY + DH + 16, display: 'flex', gap: 5, flexWrap: 'wrap', fontFamily: FONT.sans }}>
          {['teoría', 'ejemplos', 'taller de 10 ejercicios'].map((s, i) => {
            const k = clamp01((f - 40 - i * 8) / 10);
            return <span key={s} style={{ padding: '3px 7px', borderRadius: 9, background: 'rgba(47,214,143,0.14)', border: '0.5px solid rgba(47,214,143,0.5)',
              color: INK, fontSize: 9.5, fontWeight: 600, opacity: k, transform: `translateY(${(1 - EASE.snappy(k)) * 6}px)` }}>{s}</span>;
          })}
        </div>
      </DesignStage>
      <Grain opacity={0.05} blend="soft-light" />
    </AbsoluteFill>
  );
};
