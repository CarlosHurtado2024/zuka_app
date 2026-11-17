// S1 · gancho — typewriter-moves (A error-retype), adaptado de demos/typography/typewriter-moves/TypewriterErrorRetype.tsx
// a vertical 1080×1920 y a Zuka: «El álgebra / es memorizar» → duda → borra «memorizar» → «es un viaje». Tres velocidades
// (escribir 2f, borrar 1.5f, reescribir 1.5f sin duda), cursor en tres estados, ranuras de ancho fijo con letra mono,
// subrayado de marcador en la palabra nueva y quietud final ≥ 50f (parámetros del demo, sin bajar de nivel).
import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, FONT, ramp } from '../fx/Polish';
import { LOOKS, Stage, TextReveal, alpha } from '../fx/Look';

export const S1_DURATION = 177;
const L = LOOKS.zuka;

const LINE1 = 'El álgebra';
const TEXT1 = 'es memorizar';
const KEEP = 3; // «es » se queda
const DEL = TEXT1.length - KEEP;
const TEXT2 = 'un viaje.';

const T0 = 4; // línea 1: 2f/carácter
const T1 = T0 + LINE1.length * 2 + 6; // línea 2, primera versión: 2f/carácter
const PAUSE_START = T1 + (TEXT1.length - 1) * 2; // duda
const DS = PAUSE_START + 28; // duda más larga: «memorizar» se alcanza a leer; luego borra a 1.5f/carácter
const RS = DS + Math.ceil(DEL * 1.5) + 4; // reescribir 1.5f/carácter
const TYPE2_END = RS + (TEXT2.length - 1) * 1.5;
const CURSOR_OFF = Math.ceil(TYPE2_END) + 20;

const SIZE = 112;
const CHAR_W = 68; // ranura fija (0.6em de la mono)
const LEFT = (1080 - 12 * CHAR_W) / 2;
const Y1 = 900, Y2 = Y1 + SIZE * 1.25;
const HL_START = Math.ceil(TYPE2_END) + 1;

const Row: React.FC<{ text: string; y: number; cursor: boolean }> = ({ text, y, cursor }) => (
  <div style={{ position: 'absolute', left: LEFT, top: y - (SIZE * 1.1) / 2, display: 'flex', alignItems: 'center', height: SIZE * 1.1 }}>
    {text.split('').map((c, i) => (
      <span key={i} style={{ display: 'inline-block', width: CHAR_W, textAlign: 'center', fontFamily: FONT.mono, fontSize: SIZE, fontWeight: 700, color: L.ink, lineHeight: 1.1 }}>
        {c === ' ' ? ' ' : c}
      </span>
    ))}
    {cursor && <span style={{ display: 'inline-block', width: 8, height: SIZE * 0.98, marginLeft: 4, borderRadius: 4, background: L.accent, boxShadow: `0 0 14px ${alpha(L.accent, 0.5)}` }} />}
  </div>
);

export const S1Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const n0 = f < T0 ? 0 : Math.min(LINE1.length, Math.floor((f - T0) / 2) + 1);
  const n1 = f < T1 ? 0 : Math.min(TEXT1.length, Math.floor((f - T1) / 2) + 1);
  const removed = f < DS ? 0 : Math.min(DEL, Math.floor((f - DS) / 1.5) + 1);
  const n2 = f < RS ? 0 : Math.min(TEXT2.length, Math.floor((f - RS) / 1.5) + 1);
  const line2 = TEXT1.slice(0, Math.max(KEEP, n1 - removed)).slice(0, n1) + TEXT2.slice(0, n2);
  const onLine2 = f >= T1;
  const cursorOn = (() => {
    if (f >= CURSOR_OFF) return false;
    if (f >= TYPE2_END) return Math.floor((f - TYPE2_END) / 5) % 2 === 0;
    if (f >= DS) return true;
    if (f >= PAUSE_START) return Math.floor((f - PAUSE_START) / 4) % 2 === 0;
    return true;
  })();
  const hl = ramp(f, HL_START, 14, EASE.snappy);
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.3 }} fill={{ x: 0.7, y: 0.95 }} intensity={0.7} />
      {/* marcador bajo «un viaje.» */}
      {hl > 0 && (
        <div style={{ position: 'absolute', left: LEFT + KEEP * CHAR_W - 10, top: Y2 + SIZE * 0.08, width: (TEXT2.length * CHAR_W - 14) * hl, height: SIZE * 0.38, borderRadius: 8,
          background: `linear-gradient(90deg, ${alpha(L.accent2, 0.55)} 0%, ${alpha(L.accent2, 0.42)} 100%)` }} />
      )}
      {/* rótulo superior: la mascota y la marca, alineados con el borde izquierdo de la escritura */}
      <div style={{ position: 'absolute', left: LEFT + 4, top: Y1 - SIZE * 0.55 - 150, display: 'flex', alignItems: 'center', gap: 22, opacity: ramp(f, 0, 12, EASE.out) }}>
        <Img src={staticFile('tex/mascota.png')} style={{ width: 96, height: 'auto' }} />
        <div style={{ fontFamily: FONT.sans, fontSize: 52, fontWeight: 500, color: L.ink2, lineHeight: 1.1 }}>
          Bienvenido a <span style={{ color: L.ink, fontWeight: 700 }}>Zuka</span><br /><span style={{ color: L.accent2, fontWeight: 600 }}>Curso de Álgebra</span>
        </div>
      </div>
      <Row text={LINE1.slice(0, n0)} y={Y1} cursor={cursorOn && !onLine2} />
      <Row text={line2} y={Y2} cursor={cursorOn && onLine2} />
      {/* subtítulo tras la quietud del cursor */}
      <div style={{ position: 'absolute', left: LEFT + 4, right: 80, top: Y2 + SIZE * 0.95, fontFamily: FONT.sans, fontSize: 60, fontWeight: 500, color: L.ink2, lineHeight: 1.2 }}>
        <div><TextReveal text="Aquí se juega," start={CURSOR_OFF - 4} by="word" variant="blur" each={16} gap={4} /></div>
        <div><TextReveal text="se explora y se entiende." start={CURSOR_OFF + 6} by="word" variant="blur" each={16} gap={4} /></div>
      </div>
    </div>
  );
};
