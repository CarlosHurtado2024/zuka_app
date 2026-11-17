// S4 · un mundo — crane-rise-reveal (demos/opening/crane-rise-reveal/CraneRiseReveal.tsx) adaptado a vertical 1080×1920.
// El «mundo» es la captura real de la Pradera de Venn (página alta, 390 × 1750 px CSS a 3x). La grúa arranca a 3.0× pegada
// al nivel 1 («EMPIEZA»), respira (+1.5 %), sube con la curva bezier(0.2,0,0.25,1) del demo y, con desenfoque de cámara en el
// tramo rápido, deja la página entera como un objeto sobre el escenario. Cada nodo que cruza el borde superior del visor
// recibe un barrido de luz (la «fila que entra» del demo). Al final: rótulos del jefe, la evaluación y el resumen en PDF.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { bezier, ramp, mix, EASE, FONT, softShadow } from '../fx/Polish';
import { LOOKS, Stage, alpha, springAt } from '../fx/Look';
import layout from '../../public/tex/layout.json';

export const S4_DURATION = 195;
const L = LOOKS.zuka;
const VW = 1080, VH = 1920;
const HOLD = 24;
const MOVE_END = 120;
const BLUR_END = 60;
const crane = bezier(0.2, 0, 0.25, 1);

const WP = layout['world-page'];
const CROP0 = 70, CROP1 = 1640; // tramo de la página que se ve (tarjeta del mundo → «Siguiente»)
const K = 1.08; // px de mundo por px CSS de la página
const WX = 88, WW = 390 * K, WH = (CROP1 - CROP0) * K, WY = (VH - WH) / 2;
const px = (x: number) => WX + x * K, py = (y: number) => WY + (y - CROP0) * K;

// nodos que «entran» (el centro de cada caja, en coordenadas de mundo)
const ITEMS = [...WP.nodes, WP.summary].map((b: { x: number; y: number; w: number; h: number }) => ({ x: px(b.x), y: py(b.y), w: b.w * K, h: b.h * K }));
const FIRST = ITEMS[0];

const S0 = 3.0;
const BREATH = 0.015;
const camAt = (frame: number) => {
  const breath = ramp(frame, 0, HOLD, EASE.smooth);
  const e = crane(Math.min(1, Math.max(0, (frame - HOLD) / (MOVE_END - HOLD))));
  const s0 = S0 * (1 + BREATH * breath);
  const s = mix(s0, 1, e);
  const fx = mix(FIRST.x + FIRST.w / 2, VW / 2, e);
  const fy = mix(FIRST.y + FIRST.h / 2 - 40, VH / 2, e);
  return { s, e, tx: VW / 2 - fx * s, ty: VH / 2 - fy * s, visTop: fy - VH / 2 / s };
};
const TRIG = ITEMS.map((it) => {
  if (camAt(HOLD).visTop <= it.y) return -1;
  for (let f = HOLD; f <= MOVE_END; f++) if (camAt(f).visTop <= it.y + 2) return f;
  return MOVE_END;
});

const Cam: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => {
  const { s, tx, ty } = camAt(frame);
  return <div style={{ position: 'absolute', width: VW, height: VH, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>{children}</div>;
};

const DOTS = (() => {
  const out: { x: number; y: number }[] = [];
  for (let y = -900; y <= 2900; y += 54) for (let x = -900; x <= 2000; x += 54) out.push({ x, y });
  return out;
})();
const BackDots: React.FC<{ frame: number }> = ({ frame }) => {
  const { s, tx, ty } = camAt(frame);
  const k = 0.35, sp = 1 + (s - 1) * k;
  const ox = VW / 2 + (tx + (VW / 2) * s - VW / 2) * k - (VW / 2) * sp;
  const oy = VH / 2 + (ty + (VH / 2) * s - VH / 2) * k - (VH / 2) * sp;
  return (
    <svg width={VW} height={VH} style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${sp.toFixed(4)})`}>
        {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={1.8} fill={alpha(L.ink, 0.12)} />)}
      </g>
    </svg>
  );
};

const World: React.FC<{ frame: number }> = ({ frame }) => {
  const elev = mix(6, 40, ramp(frame, HOLD + 30, MOVE_END - HOLD - 20, EASE.swift));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: WX, top: WY, width: WW, height: WH, borderRadius: 34, overflow: 'hidden', background: '#0c0f1f',
        boxShadow: `inset 0 0 0 1px ${L.line}, ${softShadow(elev, { color: L.shadow, strength: 2.4 })}` }}>
        <Img src={staticFile('tex/world-page.png')} style={{ position: 'absolute', left: 0, top: -CROP0 * K, width: WW, height: WP.h * K }} />
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.02 }} fill={{ x: 0.85, y: 1 }} grain={0} vignette={0.3}>
        <BackDots frame={frame} />
      </Stage>
      <Cam frame={frame}><World frame={frame} /></Cam>
    </AbsoluteFill>
  );
};

// barrido de luz sobre cada nodo cuando entra por arriba (fuera del desenfoque, como en el demo)
const Sweeps: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
    <Cam frame={frame}>
      {ITEMS.map((it, i) => {
        const t = TRIG[i]; if (t < 0) return null;
        const p = ramp(frame, t, 20, EASE.out);
        const op = Math.min(1, ramp(frame, t, 3, EASE.linear)) * (1 - ramp(frame, t + 6, 18, EASE.out));
        if (op <= 0.002) return null;
        const head = mix(-0.2, 1.1, p);
        return (
          <div key={i} style={{ position: 'absolute', left: WX + 8, top: it.y - 6, width: WW - 16, height: it.h + 12, borderRadius: 18, opacity: op,
            background: `linear-gradient(90deg, ${alpha(L.accent, 0.03)} 0%, ${alpha(L.accent, 0.28)} ${(head * 100).toFixed(1)}%, ${alpha(L.accent, 0)} ${((head + 0.22) * 100).toFixed(1)}%)`,
            boxShadow: `inset 0 0 0 1.5px ${alpha(L.accent, 0.3)}` }} />
        );
      })}
    </Cam>
  </AbsoluteFill>
);

// rótulos finales (espacio de mundo = pantalla, porque la cámara termina en 1:1)
const CALLOUTS = [
  { box: WP.boss, t: 126, kick: 'JEFE FINAL', line: 'se vence pensando', col: '#ff5a74' },
  { box: WP.exam, t: 140, kick: 'EVALUACIÓN', line: 'te dice qué repasar', col: L.accent2 },
];
const Callouts: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {CALLOUTS.map((c, i) => {
      const k = springAt(frame, c.t, { damping: 18 });
      const lineK = ramp(frame, c.t, 12, EASE.snappy);
      const x0 = px(c.box.x + c.box.w), y0 = py(c.box.y + c.box.h / 2), x1 = 600;
      return (
        <React.Fragment key={i}>
          <div style={{ position: 'absolute', left: x0 + 10, top: y0 - 2, width: (x1 - x0 - 24) * lineK, height: 4, borderRadius: 2, background: c.col, opacity: 0.9 }} />
          <div style={{ position: 'absolute', left: x0 - 2, top: y0 - 9, width: 18, height: 18, borderRadius: 9, background: c.col, transform: `scale(${lineK})` }} />
          <div style={{ position: 'absolute', left: x1, top: y0 - 62, opacity: k, transform: `translateX(${(1 - k) * 40}px)`, fontFamily: FONT.sans }}>
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.12em', color: c.col }}>{c.kick}</div>
            <div style={{ fontSize: 64, fontWeight: 600, color: L.ink, lineHeight: 1.05, maxWidth: 440 }}>{c.line}</div>
          </div>
        </React.Fragment>
      );
    })}
    {/* rótulo superior: el mundo */}
    <div style={{ position: 'absolute', left: 600, top: py(WP.card.y) + 20, opacity: ramp(frame, 112, 14, EASE.out), fontFamily: FONT.sans }}>
      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '0.12em', color: L.accent }}>MUNDO 1</div>
      <div style={{ fontSize: 64, fontWeight: 700, color: L.ink, lineHeight: 1.0 }}>un camino<br />de niveles</div>
    </div>
  </AbsoluteFill>
);

export const S4Mundo: React.FC = () => {
  const frame = useCurrentFrame();
  const fast = frame > HOLD + 1 && frame < BLUR_END;
  const vig = 1 - ramp(frame, HOLD, 60, EASE.swift);
  return (
    <AbsoluteFill style={{ background: L.bg[1], overflow: 'hidden' }}>
      {fast ? <CameraMotionBlur shutterAngle={150} samples={10}><Page /></CameraMotionBlur> : <Page />}
      <Sweeps frame={frame} />
      <Callouts frame={frame} />
      <AbsoluteFill style={{ pointerEvents: 'none', opacity: vig, background: `radial-gradient(ellipse 75% 70% at 50% 50%, ${alpha(L.shadow, 0)} 55%, ${alpha(L.shadow, 0.4)} 100%)` }} />
    </AbsoluteFill>
  );
};
