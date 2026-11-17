import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Main, TOTAL, SHOTS } from './Main';

export const Root: React.FC = () => (
  <>
    <Composition id="Bienvenida" component={Main} durationInFrames={TOTAL} fps={30} width={1080} height={1920} defaultProps={{ bgm: true }} />
    {SHOTS.map((s) => (
      <Composition key={s.id} id={'S-' + s.id} component={s.C} durationInFrames={s.dur} fps={30} width={1080} height={1920} />
    ))}
  </>
);
