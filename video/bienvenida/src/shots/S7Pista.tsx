// S7 · un ejercicio por dentro — scanline-annotate-focus (demos/effects/scanline-annotate-focus/ScanlineAnnotateFocus.tsx)
// adaptado a vertical. La página es la captura real del juego de Venn con la pista abierta. Igual que el demo: la línea de escaneo
// baja a velocidad constante (la mirada de la máquina, sin curva), deja una estela «ya leído»; al cruzar el borde inferior de cada
// parte, cuatro escuadras se cierran desde 76px afuera con resorte (damping 15) y a los 5f sale una etiqueta que se escribe sola.
// Colores separados: el contenido es la app; la máquina (línea, escuadras, etiquetas, estado) es oro.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, FONT, ramp, softShadow } from '../fx/Polish';
import { LOOKS, Stage, alpha, springAt } from '../fx/Look';
import layout from '../../public/tex/layout.json';

export const S7_DURATION = 215;
const L = LOOKS.zuka;
const MACHINE = '#ffc53d';
const INKM = '#1a1406';
const MONO = FONT.mono;
const K = 1.5;
const WW = 390 * K, WH = 844 * K, WX = 64, WY = 400;
const COLX = WX + WW + 44; // columna de rótulos, fuera del celular
// el juego en acción (capturas reales): pinta B − A → todo listo → «¡Correcto!»
const T_PAINT = 116, T_READY = 140, T_CHECK = 152;
const TAP = [{ t: T_PAINT - 6, x: 22 + 346 * 0.8, y: 327 + 415 * 0.6 }, { t: T_CHECK - 6, x: 195, y: 796 }];

const SCAN0 = 8, SCAN1 = 98, Y0 = -20, Y1 = WH + 10;
const scanY = (f: number) => Y0 + (Y1 - Y0) * Math.min(1, Math.max(0, (f - SCAN0) / (SCAN1 - SCAN0)));
const frameAtY = (y: number) => SCAN0 + ((y - Y0) / (Y1 - Y0)) * (SCAN1 - SCAN0);

type Target = { key: string; x: number; y: number; w: number; h: number; head: string; detail: string; tx: number; ty: number; ft: number };
const P = layout.pista;
const box = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x * K, y: b.y * K, w: b.w * K, h: b.h * K });
const TAG_H = 104;
const TARGETS: Target[] = (() => {
  const raw = [
    { key: 'reto', ...box({ x: 18, y: 120, w: 300, h: 64 }), head: 'RETO', detail: 'pinta B − A', place: 'right' },
    { key: 'pista', ...box(P.hint), head: 'PISTA', detail: 'te orienta', place: 'below' },
    { key: 'juego', ...box(P.canvas), head: 'JUEGO', detail: 'tocas zonas', place: 'inside' },
    { key: 'comprobar', ...box({ x: 20, y: 772, w: 350, h: 48 }), head: 'LISTO', detail: 'y compruebas', place: 'above' },
  ];
  let prev = -99;
  const out = raw.map((r) => ({ key: r.key, x: r.x, y: r.y, w: r.w, h: r.h, head: r.head, detail: r.detail, tx: COLX - WX, ty: r.y + r.h / 2 - TAG_H / 2, ft: 0 }));
  for (const t of [...out].sort((a, b) => a.y + a.h - (b.y + b.h))) { t.ft = Math.max(frameAtY(t.y + t.h), prev + 6); prev = t.ft; }
  return out;
})();
const LAST_FIRE = Math.max(...TARGETS.map((t) => t.ft));

const Bracket: React.FC<{ t: Target; frame: number }> = ({ t, frame }) => {
  const f = frame - t.ft;
  if (f < 0) return null;
  const s = springAt(frame, t.ft, { damping: 15, stiffness: 210 });
  const pad = 76 * (1 - s);
  const op = Math.min(1, f / 3);
  const arm = 44 - 14 * ramp(frame, t.ft + 3, 12, EASE.out);
  const flash = ramp(frame, t.ft + 3, 3, EASE.out) * (1 - ramp(frame, t.ft + 6, 12, EASE.out));
  const x = t.x - pad, y = t.y - pad, w = t.w + pad * 2, h = t.h + pad * 2;
  const d = [`M${x} ${y + arm}V${y}H${x + arm}`, `M${x + w - arm} ${y}H${x + w}V${y + arm}`, `M${x + w} ${y + h - arm}V${y + h}H${x + w - arm}`, `M${x + arm} ${y + h}H${x}V${y + h - arm}`].join('');
  return (
    <>
      <div style={{ position: 'absolute', left: t.x, top: t.y, width: t.w, height: t.h, borderRadius: 12, background: alpha(MACHINE, 0.1 * flash), boxShadow: `inset 0 0 0 3px ${alpha(MACHINE, 0.45 * flash)}` }} />
      <svg width={WW} height={WH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op }}>
        <path d={d} fill="none" stroke={MACHINE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
};

const Label: React.FC<{ t: Target; frame: number }> = ({ t, frame }) => {
  const s0 = t.ft + 5;
  if (frame < s0) return null;
  const rise = ramp(frame, s0, 12, EASE.out);
  const pop = ramp(frame, s0, 4, EASE.out);
  const lineK = ramp(frame, t.ft + 2, 10, EASE.snappy);
  const full = t.detail;
  const typed = Math.floor(Math.min(full.length, (frame - s0 - 3) * 1.6 + 1));
  const y0 = t.y + t.h / 2;
  return (
    <>
      {/* línea guía desde la escuadra hasta el rótulo */}
      <div style={{ position: 'absolute', left: t.x + t.w + 8, top: y0 - 2, width: (t.tx - t.x - t.w - 18) * lineK, height: 4, borderRadius: 2, background: MACHINE, opacity: 0.9 }} />
      <div style={{ position: 'absolute', left: t.tx - 12, top: y0 - 8, width: 16, height: 16, borderRadius: 8, background: MACHINE, transform: `scale(${lineK})` }} />
      <div style={{ position: 'absolute', left: t.tx + 10, top: t.ty, width: 1080 - COLX - 40, opacity: pop, transform: `translateY(${((1 - rise) * 10).toFixed(2)}px)`, fontFamily: FONT.sans }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '0.1em', color: MACHINE, lineHeight: 1 }}>{t.head}</div>
        <div style={{ fontSize: 46, fontWeight: 600, color: L.ink, lineHeight: 1.05, marginTop: 8, minHeight: 48 }}>{full.slice(0, Math.max(0, typed))}</div>
      </div>
    </>
  );
};

// un toque: anillo que se abre y se apaga
const Tap: React.FC<{ frame: number; t: number; x: number; y: number }> = ({ frame, t, x, y }) => {
  const k = (frame - t) / 14; if (k < 0 || k > 1) return null;
  return (
    <>
      <div style={{ position: 'absolute', left: x * K - 22, top: y * K - 22, width: 44, height: 44, borderRadius: 22, background: '#ffffff', opacity: 0.85 * (1 - k) }} />
      <div style={{ position: 'absolute', left: x * K - (22 + 60 * k), top: y * K - (22 + 60 * k), width: 44 + 120 * k, height: 44 + 120 * k, borderRadius: '50%', border: '6px solid #ffffff', opacity: 1 - k }} />
    </>
  );
};

export const S7Pista: React.FC = () => {
  const frame = useCurrentFrame();
  const ly = scanY(frame);
  const lineOn = ramp(frame, SCAN0 - 4, 5, EASE.out) * (1 - ramp(frame, SCAN1, 8, EASE.exit));
  const fired = TARGETS.filter((t) => frame >= t.ft).length;
  const done = ramp(frame, LAST_FIRE + 8, 8, EASE.out);
  const push = 1 + 0.03 * ramp(frame, 0, S7_DURATION, EASE.swift);
  const scanProg = Math.min(1, Math.max(0, (frame - SCAN0) / (SCAN1 - SCAN0)));
  return (
    <AbsoluteFill>
      <Stage look={L} keyLight={{ x: 0.3, y: 0.05 }} fill={{ x: 0.9, y: 0.95 }} vignette={0.4} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push.toFixed(5)})`, transformOrigin: '50% 54%' }}>
        {/* titular + línea de estado (fuera de la ventana) */}
        <div style={{ position: 'absolute', left: WX, top: 110, fontFamily: FONT.sans, color: L.ink, opacity: ramp(frame, 0, 12, EASE.out) }}>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.14em', color: L.accent }}>CADA EJERCICIO</div>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.0 }}>con su pista</div>
        </div>
        <div style={{ position: 'absolute', left: WX, top: WY - 64, width: WW, height: 48, font: `600 30px ${MONO}`, color: L.ink, display: 'flex', alignItems: 'center', opacity: ramp(frame, 0, 10, EASE.out) }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, marginRight: 16, background: done > 0.5 ? MACHINE : alpha(MACHINE, 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 3))), boxShadow: `0 0 0 6px ${alpha(MACHINE, 0.14)}` }} />
          <span style={{ color: done > 0.5 ? MACHINE : L.ink, letterSpacing: '0.06em' }}>{frame >= T_CHECK ? '¡CORRECTO!' : done > 0.5 ? 'A JUGAR' : 'REVISANDO'}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 170, height: 6, borderRadius: 3, background: alpha(L.ink, 0.12), overflow: 'hidden' }}>
              <div style={{ width: `${(scanProg * 100).toFixed(2)}%`, height: '100%', background: MACHINE, borderRadius: 3 }} />
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: fired === TARGETS.length ? MACHINE : L.ink }}>{String(fired).padStart(2, '0')}</span>
              <span style={{ color: L.ink3 }}> / {String(TARGETS.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
        {/* la pantalla real */}
        <div style={{ position: 'absolute', left: WX, top: WY, width: WW, height: WH, borderRadius: 44, overflow: 'hidden',
          boxShadow: `${softShadow(30, { color: '#000000', strength: 2.4 })}, 0 0 0 1.5px ${alpha(L.ink, 0.12)}` }}>
          <Img src={staticFile('tex/pista.png')} style={{ position: 'absolute', inset: 0, width: WW, height: WH }} />
          <Img src={staticFile('tex/pista-pintada.png')} style={{ position: 'absolute', inset: 0, width: WW, height: WH, opacity: ramp(frame, T_PAINT, 6, EASE.out) }} />
          <Img src={staticFile('tex/pista-lista.png')} style={{ position: 'absolute', inset: 0, width: WW, height: WH, opacity: ramp(frame, T_READY, 6, EASE.out) }} />
          <Img src={staticFile('tex/pista-acierto.png')} style={{ position: 'absolute', inset: 0, width: WW, height: WH, opacity: ramp(frame, T_CHECK, 5, EASE.out) }} />
          {lineOn > 0.01 && (
            <>
              <div style={{ position: 'absolute', left: 0, width: WW, top: ly - 160, height: 160, opacity: lineOn, background: `linear-gradient(180deg, ${alpha(MACHINE, 0)} 0%, ${alpha(MACHINE, 0.05)} 60%, ${alpha(MACHINE, 0.14)} 100%)` }} />
              <div style={{ position: 'absolute', left: 0, width: WW, top: ly - 100, height: 100, opacity: lineOn * 0.8,
                backgroundImage: `radial-gradient(circle, ${alpha(MACHINE, 0.55)} 1.5px, transparent 2.2px)`, backgroundSize: '20px 20px',
                WebkitMaskImage: 'linear-gradient(180deg, transparent, #000)', maskImage: 'linear-gradient(180deg, transparent, #000)' }} />
              <div style={{ position: 'absolute', left: 0, width: WW, top: ly - 2, height: 4, opacity: lineOn, background: MACHINE, boxShadow: `0 0 12px ${alpha(MACHINE, 0.6)}, 0 0 30px ${alpha(MACHINE, 0.32)}` }} />
            </>
          )}
        </div>
        <div style={{ position: 'absolute', left: WX, top: WY, width: WW, height: WH }}>
          <div style={{ opacity: 1 - ramp(frame, T_PAINT - 14, 10, EASE.out) }}>{TARGETS.map((t) => <Bracket key={t.key} t={t} frame={frame} />)}</div>
          {TARGETS.map((t) => <Label key={t.key} t={t} frame={frame} />)}
          {TAP.map((p, i) => <Tap key={i} frame={frame} t={p.t} x={p.x} y={p.y} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
