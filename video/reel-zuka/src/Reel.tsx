// Reel de Zuka · 1080×1920, 30 fps. Seis planos sobre la rejilla de la música (public/audio/beats.json):
//   gancho → el teléfono con el mapa → reparto de minijuegos → Clips → racha/XP/vidas → cierre con la marca.
// Las pantallas son capturas reales de la app (capture.mjs); colores y letra son los de css/styles.css.
// Gramática de movimiento tomada de las tarjetas de video-shotcraft: blur-slide, radial-ripple-phone-chips,
// deck-deal-flyin y logo-shrink-wordmark-lockup (con sus tiempos y curvas), adaptadas a formato vertical.
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import beats from '../public/audio/beats.json';
import layout from '../public/textures/layout.json';

const { fontFamily } = loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });
export const FPS = 30;
const BF = beats.period * FPS;                              // cuadros por pulso
export const beatF = (n: number) => Math.round(n * BF);
// única tabla de tiempos: todo lo demás (sonido incluido) sale de aquí
export const SHOTS = {
  hook: { from: beatF(0), to: beatF(6) },
  phone: { from: beatF(6), to: beatF(16) },
  deal: { from: beatF(16), to: beatF(24) },
  clips: { from: beatF(24), to: beatF(32) },
  stats: { from: beatF(32), to: beatF(38) },
  outro: { from: beatF(38), to: beatF(47) },
};
export const TOTAL = SHOTS.outro.to + 8;

// ---- tokens de Zuka (css/styles.css) ----
const Z = { bg: '#0c0f1f', bg2: '#12162b', card: '#171c36', card2: '#1f2547', line: '#2a3160', ink: '#eef0ff', mute: '#8f97c4', brand: '#3d7bff',
  ok: '#2fd68f', bad: '#ff5a74', gold: '#ffc53d', fire: '#ff8a3d', outer: '#070913' };
const type = (size: number, weight = 800): React.CSSProperties => ({ fontFamily, fontSize: size, fontWeight: weight, lineHeight: 1.08, letterSpacing: '-0.025em' });

// ---- suavizados ----
const cl = (x: number) => Math.max(0, Math.min(1, x));
const EASE = { out: Easing.bezier(0.16, 1, 0.3, 1), snappy: Easing.bezier(0.2, 0.9, 0.2, 1), smooth: Easing.bezier(0.4, 0, 0.2, 1), deal: Easing.bezier(0.3, 0, 0.2, 1), settle: Easing.bezier(0.3, 0, 0.25, 1.15) };
const ramp = (f: number, t0: number, d: number, e: (x: number) => number = EASE.out) => e(cl((f - t0) / d));
const ioCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const Bg: React.FC<{ glow?: string; y?: number }> = ({ glow = '#1a2460', y = 0.42 }) => (
  <AbsoluteFill style={{ background: Z.outer }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% ${y * 100}%, ${glow} 0%, ${Z.bg} 55%, ${Z.outer} 100%)` }} />
  </AbsoluteFill>
);

// palabra a palabra: y 0.38em→0, desenfoque 18→0 y opacidad por la misma curva (blur-slide)
const BlurWords: React.FC<{ text: string; start: number; each?: number; gap?: number; style?: React.CSSProperties; accent?: Record<number, string> }> = ({ text, start, each = 16, gap = 5, style, accent = {} }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.26em', ...style }}>
      {text.split(' ').map((w, i) => {
        const k = ramp(f, start + i * gap, each, EASE.out);
        return <span key={i} style={{ display: 'inline-block', opacity: k, transform: `translateY(${((1 - k) * 0.38).toFixed(4)}em)`, filter: `blur(${((1 - k) * 18).toFixed(2)}px)`, color: accent[i] }}>{w}</span>;
      })}
    </div>
  );
};

// ---- el teléfono: marco claro (la app es oscura) y la pantalla recortada ----
const Phone: React.FC<{ w: number; children: React.ReactNode; style?: React.CSSProperties; lift?: number }> = ({ w, children, style, lift = 0 }) => {
  const h = w * (844 / 390) + 34, r = w * 0.14;
  return (
    <div style={{ position: 'absolute', width: w + 34, height: h, ...style }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: r + 14, boxShadow: `0 6px 14px rgba(0,0,0,.5), 0 ${50 + lift * 30}px ${100 + lift * 40}px -24px rgba(0,0,0,.75), 0 0 ${120}px -10px rgba(61,123,255,.28)` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: r + 14, padding: 9, boxSizing: 'border-box', background: 'linear-gradient(145deg, #dfe4f7 0%, #8d95b8 28%, #c9cfe8 55%, #6f7697 80%, #b3badb 100%)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.4)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: r + 6, background: '#05060d', padding: 8, boxSizing: 'border-box' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: r, overflow: 'hidden', background: Z.bg }}>
            {children}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(118deg, rgba(255,255,255,0) 32%, rgba(255,255,255,.07) 44%, rgba(255,255,255,0) 56%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ t0: number; phase: number; side: -1 | 1; color: string; icon: React.ReactNode; children: React.ReactNode; style: React.CSSProperties; dur: number }> = ({ t0, phase, side, color, icon, children, style, dur }) => {
  const f = useCurrentFrame(), t = f / (dur - 1);
  const s = spring({ frame: f - t0, fps: FPS, config: { damping: 13, stiffness: 190 } });
  const slide = ramp(f, t0, 20, EASE.snappy), floatIn = ramp(f, t0 + 18, 24, EASE.smooth);
  const fl = Math.sin(t * Math.PI * 4 + phase) * 8 * floatIn;
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 20, padding: '16px 38px 16px 16px', borderRadius: 999, whiteSpace: 'nowrap',
      background: 'linear-gradient(180deg, #ffffff 0%, #eef1ff 100%)', color: '#0c0f1f', ...type(40, 800), letterSpacing: '-0.02em',
      boxShadow: 'inset 0 1px 0 #fff, 0 3px 6px rgba(0,0,0,.2), 0 30px 60px -16px rgba(0,0,0,.6)',
      opacity: cl((f - t0) / 5), transform: `translateX(${(side * (1 - slide) * -28).toFixed(2)}px) translateY(${fl.toFixed(2)}px) scale(${(0.8 + 0.2 * s).toFixed(4)})`,
      transformOrigin: side < 0 ? 'left center' : 'right center', ...style }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{icon}</div>
      {children}
    </div>
  );
};
const Ico = { play: <svg width={34} height={34} viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z" fill="#fff" /></svg>,
  game: <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#0c0f1f" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><rect x={2.5} y={7} width={19} height={11} rx={5.5} /><path d="M7 12.5h4M9 10.5v4" /><circle cx={16.5} cy={12.5} r={1.2} fill="#0c0f1f" /></svg> };

// =================== 1 · gancho ===================
const Hook: React.FC = () => {
  const f = useCurrentFrame(), d = SHOTS.hook.to - SHOTS.hook.from;
  const out = 1 - ramp(f, d - 7, 7, EASE.smooth);
  return (
    <AbsoluteFill>
      <Bg y={0.5} />
      <div style={{ position: 'absolute', left: 90, right: 70, top: 600, color: Z.ink, ...type(156), opacity: out, transform: `scale(${(1 + 0.02 * (f / d)).toFixed(4)})`, transformOrigin: 'left center' }}>
        <BlurWords text="Las mates" start={5} />
        <BlurWords text="no tienen que" start={beatF(1) + 2} style={{ marginTop: 14 }} />
        <BlurWords text="aburrirte." start={beatF(2) + 6} style={{ marginTop: 14, color: Z.gold }} />
      </div>
    </AbsoluteFill>
  );
};

// =================== 2 · el teléfono con el mapa (radial-ripple-phone-chips) ===================
const RINGS = [{ size: 2700, color: '#10142c' }, { size: 2120, color: '#141a3a' }, { size: 1560, color: '#182048' }, { size: 1040, color: '#1d2757' }].map((r, i) => ({ ...r, phase: i * 1.7 }));
const PhoneHero: React.FC = () => {
  const f = useCurrentFrame(), DUR = SHOTS.phone.to - SHOTS.phone.from, t = f / (DUR - 1);
  const PWd = 560, PX = (1080 - PWd - 34) / 2, PY = 450;
  const rise = ramp(f, 0, 26, EASE.snappy), scrollP = cl((t - 0.08) / 0.9), sc = PWd / 390;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: Z.outer }} />
      {RINGS.map(({ size, color, phase }, i) => (
        <div key={i} style={{ position: 'absolute', left: 540 - size / 2, top: 1070 - size / 2, width: size, height: size, borderRadius: '50%',
          background: `linear-gradient(180deg, rgba(120,150,255,.10) 0%, rgba(120,150,255,0) 40%), ${color}`, boxShadow: 'inset 0 2px 0 rgba(150,175,255,.22), 0 0 0 1.5px rgba(120,150,255,.14)',
          transform: `scale(${(1 + 0.06 * Math.sin(t * Math.PI * 3 + phase)).toFixed(5)})` }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 46% 34% at 50% 56%, rgba(61,123,255,.22) 0%, rgba(61,123,255,0) 100%)' }} />
      <Phone w={PWd} lift={1 - rise} style={{ left: PX, top: PY, transform: `translateY(${((1 - rise) * 90).toFixed(2)}px)`, opacity: Math.min(1, rise * 2.2) }}>
        {/* el camino de niveles baja a velocidad constante: «adentro hay contenido» */}
        <Img src={staticFile('textures/world-tall.png')} style={{ position: 'absolute', left: 0, top: -56 * sc, width: '100%', transform: `translateY(${(-560 * 1.3 * scrollP).toFixed(2)}px)` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 58 * sc, overflow: 'hidden' }}><Img src={staticFile('textures/map.png')} style={{ width: '100%' }} /></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 * sc, overflow: 'hidden' }}><Img src={staticFile('textures/map.png')} style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }} /></div>
      </Phone>
      <Chip t0={37} phase={0} side={-1} color={Z.brand} icon={Ico.play} dur={DUR} style={{ top: 800, left: 48 }}>Videos cortos</Chip>
      <Chip t0={67} phase={1.8} side={1} color={Z.gold} icon={Ico.game} dur={DUR} style={{ top: 1380, right: 48 }}>Minijuegos</Chip>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', color: Z.ink, ...type(104) }}>
        <BlurWords text="Aprende jugando" start={90} each={18} gap={6} style={{ justifyContent: 'center' }} />
      </div>
    </AbsoluteFill>
  );
};

// =================== 3 · reparto de minijuegos (deck-deal-flyin) ===================
const GAMES = ['game-mueve-parabola', 'game-corta-pizza', 'game-noria', 'game-engranajes', 'game-pinta-venn', 'game-mapa-tesoro'] as const;
const CARD = 420, GX = [102, 558], GY = [520, 964, 1408];
const cue = (k: number) => 30 + 10 * k - 0.9 * k * (k - 1);    // intervalos 10 → 2.8 cuadros: acelera fuerte
const Deal: React.FC = () => {
  const f = useCurrentFrame(), d = SHOTS.deal.to - SHOTS.deal.from;
  const press = Math.sin(Math.PI * cl((f - 18) / 12)) * 48;      // el mazo se hunde antes del primer naipe
  const pile = { x: 540 - CARD / 2, y: 1640 };
  const landed = GAMES.filter((_, k) => f >= cue(k) + 8).length;
  const count = Math.round(interpolate(f, [cue(0) + 8, cue(5) + 8, cue(5) + 34], [0, 6, 136], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }));
  return (
    <AbsoluteFill>
      <Bg y={0.55} glow="#161d4d" />
      <div style={{ position: 'absolute', left: 70, right: 40, top: 262, color: Z.ink, ...type(84), whiteSpace: 'nowrap', opacity: ramp(f, 4, 12), transform: `translateY(${((1 - ramp(f, 4, 16)) * 24).toFixed(2)}px)` }}>
        <span style={{ color: Z.gold, fontVariantNumeric: 'tabular-nums', ...type(150), display: 'inline-block', width: 292, textAlign: 'right', marginRight: 24, opacity: landed > 1 ? 1 : 0 }}>{Math.max(count, landed)}</span>minijuegos
        <div style={{ ...type(56, 700), color: Z.mute, marginTop: 2, marginLeft: 316 }}>cada uno enseña algo</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${(1 + 0.015 * cl((f - 70) / (d - 70))).toFixed(5)})`, transformOrigin: '50% 60%' }}>
        {GAMES.map((g, k) => {
          const b = (layout as any)[g] as { x: number; y: number; w: number; h: number }, sc = CARD / b.w;
          const tx = GX[k % 2], ty = GY[Math.floor(k / 2)], c = cue(k);
          const p = ramp(f, c, 8, EASE.deal), st = f >= c + 8 ? ramp(f, c + 8, 4, EASE.settle) : 0;
          const flying = f >= c && f < c + 8, arc = Math.sin(Math.PI * p);
          const jx = (((k * 7) % 9) - 4) * 2, jr = (((k * 5) % 7) - 3);
          const x = interpolate(p, [0, 1], [pile.x + jx, tx]), y = interpolate(p, [0, 1], [pile.y - k * 5 + (f < c ? press : 0), ty]);
          const s = interpolate(p, [0, 1], [0.42, 1]) * (1 + 0.06 * arc) * (f >= c + 8 ? 0.996 + 0.004 * st : 1);
          const rot = interpolate(p, [0, 1], [jr * 2, 0]);
          const sh = f < c ? 0.4 : interpolate(cl((f - c - 2) / 12), [0, 1], [1, 0.35]);
          return (
            <div key={g} style={{ position: 'absolute', left: 0, top: 0, width: CARD, height: CARD, borderRadius: 40, overflow: 'hidden', zIndex: f < c ? 10 - k : 20 + k,
              transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`, transformOrigin: 'top left', background: '#0f1226',
              boxShadow: `0 0 0 2px ${Z.line}, 0 ${(4 + 30 * sh).toFixed(1)}px ${(10 + 50 * sh).toFixed(1)}px rgba(0,0,0,${(0.35 + 0.3 * sh).toFixed(2)})`, filter: flying ? `blur(${(2.2 * arc).toFixed(2)}px)` : undefined }}>
              <Img src={staticFile(`textures/${g}.png`)} style={{ position: 'absolute', width: 390 * sc, left: -b.x * sc, top: -(b.y + 46) * sc }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =================== 4 · Clips: el feed se desliza ===================
const Clips: React.FC = () => {
  const f = useCurrentFrame(), PWd = 560, PX = (1080 - PWd - 34) / 2, H = PWd * (844 / 390);
  const rise = ramp(f, 0, 22, EASE.snappy);
  const sw = spring({ frame: f - beatF(4), fps: FPS, config: { damping: 18, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Bg y={0.6} glow="#231a52" />
      <div style={{ position: 'absolute', left: 70, right: 70, top: 262, color: Z.ink, ...type(92) }}>
        <BlurWords text="Clips: datos" start={4} />
        <BlurWords text="curiosos" start={14} style={{ color: '#a78bfa' }} />
      </div>
      <Phone w={PWd} lift={1 - rise} style={{ left: PX, top: 590, transform: `translateY(${((1 - rise) * 110).toFixed(2)}px) rotate(${(-2 + 2 * rise).toFixed(2)}deg)`, opacity: Math.min(1, rise * 2.2) }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', transform: `translateY(${(-H * sw).toFixed(2)}px)` }}>
          <Img src={staticFile('textures/clips-playing.png')} style={{ width: '100%', display: 'block' }} />
          <Img src={staticFile('textures/clips-abejas.png')} style={{ width: '100%', display: 'block' }} />
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

// =================== 5 · racha, XP y vidas ===================
const Flame = <svg width={96} height={96} viewBox="5 1.500 14 21"><path d="M12 2c1 3.5 5 5.5 5 10.5A5 5 0 0 1 7 12.5c0-1.6.6-2.9 1.6-3.9.2 1.6 1 2.6 2 3C10.200 8.500 11 5 12 2z" fill={Z.fire} /></svg>;
const Bolt = <svg width={96} height={96} viewBox="0 0 24 24"><path d="M13 2 5 13.500h5.500L9.500 22 18 10h-5.500z" fill={Z.gold} /></svg>;
const Heart = <svg width={96} height={96} viewBox="0 0 24 24"><path d="M12 20.500s-7.500-4.600-7.500-10A4.300 4.300 0 0 1 12 7.800a4.300 4.300 0 0 1 7.500 2.700c0 5.400-7.500 10-7.500 10z" fill={Z.bad} /></svg>;
const Stats: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [{ icon: Flame, to: 7, unit: 'días de racha', color: Z.fire, t0: 4 }, { icon: Bolt, to: 1280, unit: 'XP ganados', color: Z.gold, t0: 4 + beatF(1) }, { icon: Heart, to: 5, unit: 'vidas', color: Z.bad, t0: 4 + beatF(2) }];
  return (
    <AbsoluteFill>
      <Bg y={0.5} glow="#1b2256" />
      <div style={{ position: 'absolute', left: 90, right: 70, top: 410, color: Z.ink, ...type(104) }}><BlurWords text="Cada día cuenta" start={0} each={14} gap={4} /></div>
      {rows.map((r, i) => {
        const s = spring({ frame: f - r.t0, fps: FPS, config: { damping: 14, stiffness: 170 } });
        const n = Math.round(interpolate(f, [r.t0, r.t0 + 16], [0, r.to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }));
        return (
          <div key={i} style={{ position: 'absolute', left: 90, right: 90, top: 640 + i * 300, height: 250, borderRadius: 56, background: Z.card, boxShadow: `0 0 0 2px ${Z.line}, 0 30px 60px -20px rgba(0,0,0,.6)`,
            display: 'flex', alignItems: 'center', gap: 36, padding: '0 56px', boxSizing: 'border-box', opacity: cl((f - r.t0) / 5), transform: `translateY(${((1 - s) * 60).toFixed(2)}px) scale(${(0.9 + 0.1 * s).toFixed(4)})` }}>
            {r.icon}
            <div style={{ ...type(150), color: r.color, fontVariantNumeric: 'tabular-nums', minWidth: 120 }}>{n}</div>
            <div style={{ ...type(54, 700), color: Z.mute, letterSpacing: '-0.01em' }}>{r.unit}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =================== 6 · cierre (logo-shrink-wordmark-lockup) ===================
const Outro: React.FC = () => {
  const f = useCurrentFrame(), DUR = SHOTS.outro.to - SHOTS.outro.from, t = f / (DUR - 1);
  const col = ioCubic(cl((t - 0.02) / 0.26)), brake = t > 0.26 && t < 0.37 ? Math.sin(Math.PI * (t - 0.26) / 0.11) * 0.06 : 0;
  const sc = 5.4 - 4.4 * col + brake, heal = cl((t - 0.10) / 0.18), swap = cl((t - 0.24) / 0.08);
  const up = ioCubic(cl((t - 0.34) / 0.13)), logo = ramp(f, DUR * 0.44, 20, EASE.out), tag = cl((t - 0.56) / 0.12);
  const masc = spring({ frame: f - Math.round(DUR * 0.62), fps: FPS, config: { damping: 12, stiffness: 150 } });
  const IC = 300;
  return (
    <AbsoluteFill>
      <Bg y={0.42} glow="#1c2a78" />
      <div style={{ position: 'absolute', left: 540 - (IC * sc) / 2, top: 660 - 150 * up - (IC * sc) / 2, width: IC * sc, height: IC * sc, borderRadius: '50%', boxSizing: 'border-box', border: '16px solid #dfe9ff', opacity: (1 - swap) * cl(f / 5), boxShadow: `0 0 ${(46 * (1 - heal) + 8).toFixed(0)}px ${Z.brand}, inset 0 0 ${(40 * (1 - heal) + 6).toFixed(0)}px ${Z.brand}` }} />
      <div style={{ position: 'absolute', left: 540 - IC / 2, top: 660 - IC / 2 - 150 * up, width: IC, height: IC, transform: `scale(${Math.min(sc, 1.2).toFixed(4)})` }}>
        <Img src={staticFile('brand/icon-512.png')} style={{ position: 'absolute', inset: 0, width: IC, height: IC, borderRadius: IC * 0.24, opacity: swap, boxShadow: '0 30px 80px -10px rgba(61,123,255,.55)' }} />
      </div>
      <Img src={staticFile('brand/logo-dark.png')} style={{ position: 'absolute', left: 540 - 300, top: 740, width: 600, opacity: logo, transform: `translateY(${((1 - logo) * 26).toFixed(2)}px)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 990, textAlign: 'center', color: Z.ink, ...type(76, 800), opacity: tag, transform: `translateY(${((1 - tag) * 14).toFixed(2)}px)` }}>
        Matemáticas <span style={{ color: Z.gold }}>que se juegan</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', opacity: cl((t - 0.66) / 0.1) }}>
        <span style={{ display: 'inline-block', padding: '26px 56px', borderRadius: 999, background: Z.brand, color: '#fff', ...type(50, 800), letterSpacing: '-0.01em', boxShadow: '0 10px 0 #2a57c2, 0 30px 60px -16px rgba(61,123,255,.6)' }}>Ábrela en tu celular</span>
      </div>
      <Img src={staticFile('brand/mascota.png')} style={{ position: 'absolute', left: 540 - 120, top: 1350, width: 240, transform: `translateY(${((1 - masc) * 160).toFixed(2)}px) scale(${(0.7 + 0.3 * masc).toFixed(4)})`, opacity: cl(masc * 2) }} />
    </AbsoluteFill>
  );
};

// ---- sonido: tabla central, todo relativo a SHOTS ----
const sfx = (id: string) => `audio/sfx/fs-${id}.mp3`;
const OD = SHOTS.outro.to - SHOTS.outro.from;
export const SFX: { from: number; src: string; volume: number; dur?: number }[] = [
  { from: SHOTS.hook.from + beatF(2) + 6, src: sfx('528561'), volume: 0.5 },                 // «aburrirte.» cae
  { from: SHOTS.phone.from, src: sfx('427823'), volume: 0.5 },                               // el teléfono sube
  { from: SHOTS.phone.from + 37, src: sfx('328119'), volume: 0.7 },                          // ficha «Videos cortos»
  { from: SHOTS.phone.from + 67, src: sfx('789793'), volume: 0.7 },                          // ficha «Minijuegos»
  ...[0, 1, 2, 3, 4, 5].map(k => ({ from: SHOTS.deal.from + Math.round(cue(k)), src: sfx('120508'), volume: 0.8 - k * 0.08 })),   // el reparto: cada naipe más bajo
  { from: SHOTS.clips.from, src: sfx('427823'), volume: 0.35 },                              // sube el segundo teléfono
  { from: SHOTS.clips.from + beatF(4) - 2, src: sfx('515625'), volume: 0.6 },                // el feed se desliza
  { from: SHOTS.stats.from + 4, src: sfx('328119'), volume: 0.6 },                           // racha
  { from: SHOTS.stats.from + 4 + beatF(1), src: sfx('789793'), volume: 0.6 },                // XP
  { from: SHOTS.stats.from + 4 + beatF(2), src: sfx('328119'), volume: 0.6 },                // vidas
  { from: SHOTS.outro.from - 22, src: sfx('863826'), volume: 0.45, dur: 34 },                // subida hacia el cierre
  { from: SHOTS.outro.from + Math.round(OD * 0.27), src: sfx('350978'), volume: 0.5 },       // el anillo frena en el icono
  { from: SHOTS.outro.from + Math.round(OD * 0.44), src: sfx('759840'), volume: 0.5 },       // entra el logo
  { from: SHOTS.outro.from + Math.round(OD * 0.62), src: sfx('789793'), volume: 0.55 },       // la mascota
];
export const Reel: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const { durationInFrames } = useVideoConfig();
  const f = useCurrentFrame();
  const seq = (k: keyof typeof SHOTS, C: React.FC) => <Sequence from={SHOTS[k].from} durationInFrames={SHOTS[k].to - SHOTS[k].from + (k === 'outro' ? 8 : 0)}><C /></Sequence>;
  return (
    <AbsoluteFill style={{ background: Z.outer }}>
      {seq('hook', Hook)}{seq('phone', PhoneHero)}{seq('deal', Deal)}{seq('clips', Clips)}{seq('stats', Stats)}{seq('outro', Outro)}
      {bgm && <Audio src={staticFile('audio/bgm.mp3')} startFrom={Math.round(beats.start * FPS)} volume={ff => interpolate(ff, [0, 8, durationInFrames - 26, durationInFrames - 1], [0, 0.38, 0.38, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />}
      {SFX.map((s, i) => <Sequence key={i} from={s.from} durationInFrames={s.dur ?? 60}><Audio src={staticFile(s.src)} volume={s.volume} /></Sequence>)}
      {f < 0 ? null : null}
    </AbsoluteFill>
  );
};
