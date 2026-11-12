import React from 'react';
import { Composition } from 'remotion';
import { FPS, Reel, TOTAL } from './Reel';

export const Root: React.FC = () => (
  <Composition id="ReelZuka" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{ bgm: true }} />
);
