// Línea de tiempo única (SHOTS es la fuente de verdad: los cortes, el sonido y los subtítulos se derivan de aquí).
import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { S1Gancho, S1_DURATION } from './shots/S1Gancho';
import { S2Recorrido, SPOTLIGHT_HERO_CARD_DURATION } from './shots/S2Recorrido';
import { S3Mundos, CAROUSEL_3D_DURATION } from './shots/S3Mundos';
import { S4Mundo, S4_DURATION } from './shots/S4Mundo';
import { S5Pdf, S5_DURATION } from './shots/S5Pdf';
import { S6Leccion, S6_DURATION } from './shots/S6Leccion';
import { S7Pista, S7_DURATION } from './shots/S7Pista';
import { S8Clips, S8_DURATION } from './shots/S8Clips';
import { S9Cierre, OUTRO_GROUP_PHOTO_LAUNCH_DURATION } from './shots/S9Cierre';

export type Shot = { id: string; C: React.FC; dur: number };
export const SHOTS: Shot[] = [
  { id: 'gancho', C: S1Gancho, dur: S1_DURATION },
  { id: 'recorrido', C: S2Recorrido, dur: SPOTLIGHT_HERO_CARD_DURATION },
  { id: 'mundos', C: S3Mundos, dur: CAROUSEL_3D_DURATION },
  { id: 'mundo', C: S4Mundo, dur: S4_DURATION },
  { id: 'pdf', C: S5Pdf, dur: S5_DURATION },
  { id: 'leccion', C: S6Leccion, dur: S6_DURATION },
  { id: 'pista', C: S7Pista, dur: S7_DURATION },
  { id: 'clips', C: S8Clips, dur: S8_DURATION },
  { id: 'cierre', C: S9Cierre, dur: OUTRO_GROUP_PHOTO_LAUNCH_DURATION },
];
export const FROM: Record<string, number> = {};
let acc = 0;
for (const s of SHOTS) { FROM[s.id] = acc; acc += s.dur; }
export const TOTAL = acc;

// Música: «House Vibez» (Lily J, Mixkit, licencia libre sin atribución obligatoria); entra en 0.8 s y sale en los últimos 1.6 s.
export const Main: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: '#070913' }}>
    {bgm && <Audio src={staticFile('audio/bgm.mp3')} volume={(f) => 0.55 * interpolate(f, [0, 24, TOTAL - 48, TOTAL - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />}
    {SHOTS.map((s) => (
      <Sequence key={s.id} from={FROM[s.id]} durationInFrames={s.dur}>
        <s.C />
      </Sequence>
    ))}
  </AbsoluteFill>
);
