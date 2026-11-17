// S8 · Clips — radial-ripple-phone-chips (demos/effects/radial-ripple-phone-chips/RadialRipplePhoneChips.tsx) adaptado a
// vertical y a la pestaña Clips de Zuka. Cuatro anillos concéntricos respiran desfasados (1.7 rad entre capas), el celular sube
// 90px y se asienta con su sombra, el feed real (cuatro curiosidades capturadas de la app) avanza a velocidad constante
// —es reproducción automática, sin curva— y dos fichas salen con resorte (damping 13) desde los bordes del celular, 30f una de
// otra, y solo después empiezan a flotar ±8px. Cierre con el rótulo en la parte baja.
import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, FONT, ramp } from '../fx/Polish';
import { LOOKS, Stage, TextReveal, alpha, springAt, type } from '../fx/Look';

export const S8_DURATION = 180;
const L = LOOKS.zuka;
const DUR = S8_DURATION;
const ACCENT = '#ff5a74';
const SANS = FONT.sans;
const RINGS = [
  { size: 2400, color: '#11163a' },
  { size: 1900, color: '#151b45' },
  { size: 1420, color: '#1a2152' },
  { size: 960, color: '#202865' },
].map((r, i) => ({ ...r, phase: i * 1.7 }));
const SW = 520, SH = SW * 844 / 390; // pantalla
const FRAME = 12, BLACK = 9;
const PW = SW + 2 * (FRAME + BLACK), PH = SH + 2 * (FRAME + BLACK);
const PX = (1080 - PW) / 2, PY = 960 - PH / 2;
const CLIPS = ['clip-0', 'clip-1', 'clip-2', 'clip-3'];
const BAR = 62 / 844 * SH; // franja de chips arriba (se queda fija); el resto de cada captura es el video

const ChipIcon: React.FC<{ kind: 'heart' | 'atom' }> = ({ kind }) => (
  <div style={{ width: 64, height: 64, borderRadius: 32, flex: 'none', background: kind === 'heart' ? ACCENT : L.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 1px 0 ${alpha('#ffffff', 0.3)}` }}>
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {kind === 'heart' ? <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        : <><circle cx={12} cy={12} r={1.6} fill="#fff" /><ellipse cx={12} cy={12} rx={9} ry={3.6} /><ellipse cx={12} cy={12} rx={9} ry={3.6} transform="rotate(60 12 12)" /><ellipse cx={12} cy={12} rx={9} ry={3.6} transform="rotate(120 12 12)" /></>}
    </svg>
  </div>
);

export const S8Clips: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / (DUR - 1);
  const rise = ramp(f, 0, 26, EASE.snappy);
  const phoneY = (1 - rise) * 90;
  const phoneOp = Math.min(1, rise * 2.2);
  const scrollP = Math.min(1, Math.max(0, (t - 0.08) / 0.9));
  const scrollY = -(SH - BAR) * 2.2 * scrollP;
  const chip = (t0: number, ph: number, side: -1 | 1): React.CSSProperties => {
    const s = springAt(f, t0, { damping: 13, stiffness: 190 });
    const slide = ramp(f, t0, 20, EASE.snappy);
    const floatIn = ramp(f, t0 + 18, 24, EASE.smooth);
    const fl = Math.sin(t * Math.PI * 2 * 2 + ph) * 8 * floatIn;
    return {
      opacity: Math.min(1, Math.max(0, (f - t0) / 5)),
      transform: `translateX(${(side * (1 - slide) * -28).toFixed(2)}px) translateY(${fl.toFixed(2)}px) scale(${(0.8 + 0.2 * s).toFixed(4)})`,
      transformOrigin: side < 0 ? 'right center' : 'left center',
    };
  };
  const chipBase: React.CSSProperties = {
    position: 'absolute', display: 'flex', alignItems: 'center', gap: 20, padding: '14px 36px 14px 14px', borderRadius: 999,
    background: 'linear-gradient(180deg, #ffffff 0%, #eef0ff 100%)', color: '#0c0f1f', whiteSpace: 'nowrap', ...type(44, 650), letterSpacing: '-0.01em',
    boxShadow: `inset 0 1px 0 #ffffff, 0 3px 6px ${alpha('#000000', 0.2)}, 0 30px 60px -16px ${alpha('#000000', 0.6)}`,
  };
  const wordmark = 96;
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.4, y: 0.0 }} fill={null} vignette={0.45}>
        {RINGS.map(({ size, color, phase }, i) => (
          <div key={i} style={{ position: 'absolute', left: 540 - size / 2, top: 1010 - size / 2, width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(180deg, rgba(120,150,255,0.10) 0%, rgba(120,150,255,0) 40%), ${color}`,
            boxShadow: `inset 0 2px 0 rgba(150,175,255,0.22), 0 0 0 1.5px rgba(150,175,255,0.14), 0 10px 40px ${alpha('#000000', 0.2 + i * 0.04)}`,
            transform: `scale(${(1 + 0.06 * Math.sin(t * Math.PI * 2 * 1.5 + phase)).toFixed(5)})` }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 34% at 50% 52%, rgba(61,123,255,0.35) 0%, rgba(61,123,255,0) 100%)' }} />
      </Stage>
      {/* titular */}
      <div style={{ position: 'absolute', left: 90, top: 110, fontFamily: SANS, color: L.ink, opacity: ramp(f, 0, 12, EASE.out) }}>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.14em', color: L.accent2 }}>PESTAÑA CLIPS</div>
        <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.0 }}>Datos curiosos</div>
      </div>
      {/* celular */}
      <div style={{ position: 'absolute', left: PX, top: PY, width: PW, height: PH, transform: `translateY(${phoneY.toFixed(2)}px)`, opacity: phoneOp }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 86, boxShadow: `0 4px 10px ${alpha('#000000', 0.3)}, 0 ${40 + (1 - rise) * 30}px ${80 + (1 - rise) * 40}px -20px ${alpha('#000000', 0.6)}, 0 90px 140px -40px ${alpha('#000000', 0.4)}` }} />
        {[{ side: -1, y: 240, h: 80 }, { side: -1, y: 340, h: 80 }, { side: 1, y: 290, h: 130 }].map((b, i) => (
          <div key={i} style={{ position: 'absolute', top: b.y, width: 6, height: b.h, borderRadius: 3, left: b.side < 0 ? -4 : PW - 2, background: 'linear-gradient(90deg, #3a4170, #8a93c8, #3a4170)' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 86, padding: FRAME, background: 'linear-gradient(145deg, #a9b2e6 0%, #4c5590 30%, #8d97d0 55%, #343b6a 80%, #7f89c4 100%)',
          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35), inset 0 0 0 3px rgba(10,12,30,0.35)' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 72, background: '#05060c', padding: BLACK, boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 62, background: '#0c0f1f', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: BAR + 44, width: '100%', transform: `translateY(${scrollY.toFixed(2)}px)` }}>
                {CLIPS.map((c) => (
                  <div key={c} style={{ position: 'relative', width: SW, height: SH - BAR, overflow: 'hidden' }}>
                    <Img src={staticFile(`tex/${c}.png`)} style={{ position: 'absolute', left: 0, top: -BAR, width: SW, height: SH }} />
                  </div>
                ))}
              </div>
              {/* barra de chips fija, bajo la isla */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: SW, height: BAR + 44, overflow: 'hidden', background: '#000000' }}>
                <Img src={staticFile('tex/clip-0.png')} style={{ position: 'absolute', left: 0, top: 44, width: SW, height: SH }} />
              </div>
              <div style={{ position: 'absolute', left: '50%', top: 16, width: 140, height: 40, marginLeft: -70, borderRadius: 20, background: '#05060c' }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(118deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.08) 44%, rgba(255,255,255,0) 56%)' }} />
            </div>
          </div>
        </div>
      </div>
      {/* fichas */}
      <div style={{ ...chipBase, top: PY - 104, left: 90, ...chip(37, 0, -1) }}><ChipIcon kind="atom" />Mate y ciencia</div>
      <div style={{ ...chipBase, top: PY + PH + 26, right: 90, ...chip(67, 1.8, 1) }}><ChipIcon kind="heart" />Me gusta</div>
      {/* rótulo de cierre */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: PY + PH + 150, color: L.ink, fontFamily: SANS, fontSize: 58, fontWeight: 500, lineHeight: 1.1 }}>
        <TextReveal text="Una idea, un clip." by="word" variant="rise" start={wordmark} each={18} gap={3} />
      </div>
    </div>
  );
};
