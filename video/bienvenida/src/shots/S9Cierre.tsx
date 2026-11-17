// S9 · cierre — outro-group-photo-launch (demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx) adaptado a vertical y a Zuka:
// piezas reales de la app (mundos, juegos, el PDF, un clip, la mascota) vuelan desde los cuatro lados con sobrepaso real
// (bezier y1 > 1) y rodean la marca; la marca entra letra por letra como sello, la regla dorada crece y aparece la invitación.
// outro-group-photo-launch —— 全片元素四方飞来围住字标合影，crane 落机位 + 舞台光 +
// 金尘做成发布会收场。outro/品牌收尾，多功能产品"全家福"式终镜，能量推到全片最高。
// 参考实现从 template SceneOutroLive 剥离（self-contained）：
// 9 个页面元素从四方带旋转飞入（cue 4 起每 3f 一个，飞 12f，bezier y1>1 真过冲，
// 渲染顺序=cue 顺序后到者叠上），落地强调色 glow（0.35→0）；字标 letterpress 逐字
// 登场（delay=42+i·1.8）全员退后排（opacity −12% / saturate −8%）；rule 长出 +
// 190px 延长线射出；crane 运镜 perspective rotateX(4°→0) + scale 落下后缓推；
// 发布会三件套：开场光带扫过、字标背后舞台光、20 颗确定性金尘上飘；背景页 blur 化
// 景深；落定后 sign-off hold 30f。outro 不加解说 caption 保持干净。
// 品牌轮：字标 = video-shotcraft「镜刻」标志 + 全小写字标（品牌字体），标志与字母同一套 letterpress
// 入场（标志先压 4f）；下方眉题换成品牌短句。背景页 / 合影元素是真实截图纹理，里面的字保留。
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { PageCam2D } from '../fx/PageCam2D';
import { EASE, FONT, Grain, SpeedBlur, ramp, velocity } from '../fx/Polish';

export const OUTRO_GROUP_PHOTO_LAUNCH_DURATION = 165; // 145 del demo + tiempo para leer la invitación

const LETTERS = 'Zuka'.split('');
const VW = 1080, VH = 1920;

const FLY_EASE = Easing.bezier(0.34, 1.4, 0.44, 1);
const CRANE_EASE = Easing.bezier(0.3, 0, 0.2, 1);

type FlyEl = { key: string; file: string; w: number; h: number; cx: number; cy: number; scale: number; rot: number; dx: number; dy: number; radius: number; cue: number };
// orden de dibujo = orden de llegada (los que llegan después quedan encima)
const ELS: FlyEl[] = [
  { key: 'w0', file: 'world-0.png', w: 384, h: 387, cx: 300, cy: 300, scale: 0.6, rot: -6, dx: -420, dy: -260, radius: 194, cue: 4 },
  { key: 'w3', file: 'world-3.png', w: 387, h: 387, cx: 790, cy: 290, scale: 0.55, rot: 5, dx: 420, dy: -260, radius: 194, cue: 7 },
  { key: 'g1', file: 'juego-alg-0c-2.jpg', w: 780, h: 1688, cx: 150, cy: 610, scale: 0.19, rot: -6, dx: -480, dy: 0, radius: 60, cue: 10 },
  { key: 'g2', file: 'juego-alg-4-0.jpg', w: 780, h: 1688, cx: 930, cy: 640, scale: 0.19, rot: 6, dx: 480, dy: 0, radius: 60, cue: 13 },
  { key: 'pdf', file: 'pdf-1.png', w: 1241, h: 1754, cx: 250, cy: 1390, scale: 0.16, rot: -5, dx: -400, dy: 320, radius: 18, cue: 16 },
  { key: 'clip', file: 'clip-1.png', w: 1170, h: 2532, cx: 830, cy: 1400, scale: 0.13, rot: 5, dx: 400, dy: 320, radius: 70, cue: 19 },
  { key: 'w6', file: 'world-6.png', w: 387, h: 387, cx: 200, cy: 1700, scale: 0.5, rot: 4, dx: -300, dy: 360, radius: 194, cue: 22 },
  { key: 'w9', file: 'world-9.png', w: 384, h: 387, cx: 880, cy: 1720, scale: 0.5, rot: -4, dx: 300, dy: 360, radius: 194, cue: 25 },
];

// 20 gold dust motes, all parameters index-derived (deterministic)
// 质感：每颗带一圈暖光晕（亮场上才看得见"金"），另加 6 颗前景失焦大光斑（bokeh）做景深层
const DUST = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 439 + 137) % VW,
  y0: (i * 613 + 271) % VH,
  rise: 0.3 + (i % 5) * 0.11,
  swayAmp: 9 + (i % 4) * 5,
  swayFreq: 0.022 + (i % 3) * 0.008,
  phase: (i * 0.83) % (Math.PI * 2),
  size: 2.4 + (i % 3) * 0.9,
  opacity: 0.35 + ((i * 7) % 5) * 0.09,
}));
const BOKEH = Array.from({ length: 6 }, (_, i) => ({
  x: (i * 701 + 260) % VW,
  y0: (i * 389 + 640) % VH,
  rise: 0.55 + (i % 3) * 0.2,
  size: 14 + (i % 3) * 7,
  opacity: 0.1 + (i % 2) * 0.06,
}));

export const S9Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = OUTRO_GROUP_PHOTO_LAUNCH_DURATION;

  const blur = interpolate(frame, [0, 24], [0, 14], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.4, 1),
  });
  const rule = interpolate(frame, [58, 70], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const tag = ramp(frame, 68, 12, EASE.out);
  // 收尾淡到暖墨色（显式底色，不淡到透明），ease-in：先慢后快地"熄灯"
  const fadeOut = 1 - ramp(frame, duration - 12, 11, EASE.exit); // 末帧恰好全暗，定格尾帧干净
  const recede = interpolate(frame, [42, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // crane on the whole group-photo layer
  const craneT = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CRANE_EASE,
  });
  // 缓推从零速起步（与 crane 的减速收尾衔接，避免 f40 处速度突变）
  const pushT = ramp(frame, 36, duration - 36, EASE.smooth);
  const camScale = 1.06 - 0.06 * craneT + 0.035 * pushT;
  const camTilt = 4 * (1 - craneT);

  // opening light sweep
  const sweepX = interpolate(frame, [2, 14], [-700, VW + 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const sweepOpacity = interpolate(frame, [2, 5, 11, 14], [0, 0.12, 0.12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // stage light behind the wordmark
  const stageLight = interpolate(frame, [42, 50, 58], [0, 0.55, 0.32], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const vignette = interpolate(frame, [42, 54], [0, 0.1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // rule extension lines
  const ruleExt = interpolate(frame, [58, 66], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const ruleExtFade = interpolate(frame, [66, 72], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // empujón final: un destello dorado detrás de la marca cuando sale la frase, y la marca crece 4 %
  const flash = interpolate(frame, [68, 74, 96], [0, 0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const punch = 1 + 0.04 * ramp(frame, 66, 22, EASE.overshoot);
  // one breath of letter-spacing once the wordmark is fully set
  const wordSpacing = interpolate(frame, [62, 66], [-0.01, 0.005], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ background: '#05060c' }}>
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* group-photo layer under a slow crane-in camera */}
      <AbsoluteFill
        style={{
          transform: `perspective(1400px) rotateX(${camTilt}deg) scale(${camScale})`,
          transformOrigin: '50% 45%',
        }}
      >
        {/* blur 只作用背景页：PageCam2D 自闭合，飞入元素放在未过滤的兄弟层
            （屏幕空间坐标，与 template SceneOutroLive 同构）——放进 children
            会连"合影元素"一起糊掉，只剩字标清晰 */}
        <PageCam2D src="tex/home.png" pageH={844} pageW={390} vw={VW} vh={VH} keys={[{ frame: 0, cx: 195, cy: 422, zoom: 2.3 }]} blur={blur} bg="#0c0f1f" />
        {/* velo azul noche bajo los elementos que vuelan */}
        <AbsoluteFill style={{ background: 'radial-gradient(900px 1300px at 50% 48%, rgba(12,15,31,0.82), rgba(12,15,31,0.62) 60%, rgba(12,15,31,0.45))', pointerEvents: 'none' }} />

        {/* group photo: elements fly in from all sides and settle around the wordmark */}
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {ELS.map((el) => {
            if (frame < el.cue) return null;
            const t = interpolate(frame, [el.cue, el.cue + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: FLY_EASE,
            });
            const opacity = interpolate(frame, [el.cue, el.cue + 3], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const x = el.dx * (1 - t);
            const y = el.dy * (1 - t);
            const rot = el.rot * (2 - t);
            const scale = el.scale * (1.12 - 0.12 * t);
            const air = Math.max(0, 1 - t);
            const shadow =
              air > 0.01
                ? `0 ${10 + 26 * air}px ${24 + 46 * air}px rgba(30,25,18,${0.16 + 0.1 * air}), 0 2px 6px rgba(30,25,18,.08)`
                : '0 10px 24px rgba(30,25,18,.16), 0 2px 6px rgba(30,25,18,.08)';
            const settledOpacity = opacity * (1 - 0.12 * recede);
            const saturate = 1 - 0.08 * recede;
            // 方向性运动模糊：按屏幕速度（px/帧）沿飞行方向拖影，落地后为 0（替代滞后 ghost 残影）
            const posAt = (fr: number) => {
              const tt = interpolate(fr, [el.cue, el.cue + 12], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: FLY_EASE,
              });
              return [el.dx * (1 - tt), el.dy * (1 - tt)];
            };
            const vx = velocity((fr) => posAt(fr)[0], frame);
            const vy = velocity((fr) => posAt(fr)[1], frame);
            // 落地压实：过冲回落的那 4f 里接触影收紧、元素 1.5% 轻压
            const land = interpolate(frame, [el.cue + 9, el.cue + 12, el.cue + 16], [0, 1, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <SpeedBlur key={el.key} vx={vx} vy={vy} amount={0.3} max={22}>
                <div
                  style={{
                    position: 'absolute', left: el.cx - el.w / 2, top: el.cy - el.h / 2,
                    width: el.w, height: el.h,
                    transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale * (1 - 0.015 * land)})`,
                    transformOrigin: 'center center', borderRadius: el.radius, overflow: 'hidden',
                    boxShadow: land > 0.01 ? `0 ${10 - 5 * land}px ${24 - 12 * land}px rgba(30,25,18,${0.16 + 0.06 * land}), 0 2px 6px rgba(30,25,18,${0.08 + 0.06 * land})` : shadow,
                    opacity: settledOpacity, filter: `saturate(${saturate})`,
                  }}
                >
                  <Img src={staticFile(`tex/${el.file}`)} style={{ position: 'absolute', inset: 0, width: el.w, height: el.h, display: 'block' }} />
                </div>
              </SpeedBlur>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* gold dust drifting up in front of the group photo */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {DUST.map((d, i) => {
          const y = (((d.y0 - frame * d.rise) % VH) + VH) % VH;
          const x = d.x + Math.sin(frame * d.swayFreq + d.phase) * d.swayAmp;
          const twinkle = 0.7 + 0.3 * Math.sin(frame * 0.21 + d.phase * 3);
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y, width: d.size, height: d.size,
                borderRadius: '50%', background: 'oklch(78% 0.085 80)', opacity: d.opacity * twinkle,
                boxShadow: `0 0 ${d.size * 2.5}px ${d.size * 0.6}px oklch(84% 0.08 82 / 0.6)`,
              }}
            />
          );
        })}
        {/* 前景失焦光斑：大而虚、上飘更快，压在合影最前面做景深 */}
        {BOKEH.map((b, i) => {
          const y = (((b.y0 - frame * b.rise) % (VH + 100)) + VH + 100) % (VH + 100) - 50;
          return (
            <div
              key={`b${i}`}
              style={{
                position: 'absolute', left: b.x, top: y, width: b.size, height: b.size, borderRadius: '50%',
                background: 'radial-gradient(circle, oklch(86% 0.1 82 / 0.9) 0%, oklch(86% 0.1 82 / 0.35) 55%, oklch(86% 0.1 82 / 0) 72%)',
                opacity: b.opacity, filter: 'blur(2px)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* opening light sweep */}
      {sweepOpacity > 0 ? (
        <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}>
          <div
            style={{
              position: 'absolute', top: 0, bottom: 0, left: sweepX - 300, width: 600,
              background: 'linear-gradient(90deg, rgba(255,244,224,0), rgba(255,244,224,1) 50%, rgba(255,244,224,0))',
              opacity: sweepOpacity,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* stage light behind the wordmark */}
      {stageLight > 0 ? (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: 'radial-gradient(620px 420px at 540px 960px, rgba(61,123,255,0.75), rgba(61,123,255,0.25) 55%, rgba(61,123,255,0) 75%)',
            opacity: stageLight,
          }}
        />
      ) : null}

      {/* closing vignette */}
      {vignette > 0 ? (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: 'radial-gradient(900px 1500px at 50% 50%, rgba(3,4,12,0) 55%, rgba(3,4,12,0.75) 100%)',
            opacity: vignette,
          }}
        />
      ) : null}

      {/* wordmark sign-off */}
      {flash > 0 ? <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(560px 420px at 540px 960px, rgba(255,197,61,0.9), rgba(255,197,61,0.25) 50%, rgba(255,197,61,0) 75%)', opacity: flash, mixBlendMode: 'screen' }} /> : null}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center', transform: `scale(${punch.toFixed(4)})` }}>
          <div style={{
            fontFamily: FONT.sans, fontSize: 180, fontWeight: 700, lineHeight: 1.1, color: '#eef0ff', letterSpacing: `${0.03 + wordSpacing}em`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            // letterpress：下沿 1px 纸面高光 + 一层极软的环境影，让字标"压"在合影之上而不是浮在纸上
            textShadow: '0 2px 0 rgba(255,255,255,0.12), 0 18px 46px rgba(0,0,0,0.5)',
          }}>
            {(() => {
              // 标志先压：比首字母早 4f，同一套 letterpress（上抬 + 放大 + 虚焦 → 落定）
              const t = interpolate(frame, [38, 46], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.75, 0.3, 1),
              });
              return (
                <div style={{
                  marginRight: 36, opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`,
                  filter: t < 0.995 ? `blur(${(1 - t) * 8}px)` : undefined,
                }}>
                  <Img src={staticFile('tex/mascota.png')} style={{ width: 170, height: 'auto', display: 'block' }} />
                </div>
              );
            })()}
            {LETTERS.map((ch, i) => {
              const delay = Math.round(42 + i * 1.8);
              const t = interpolate(frame, [delay, delay + 8], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.75, 0.3, 1),
              });
              return (
                <span
                  key={i}
                  style={{
                    opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`,
                    filter: `blur(${(1 - t) * 8}px)`, display: 'inline-block', whiteSpace: 'pre',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div style={{ position: 'relative', height: 7, width: 300, margin: '34px auto 0' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: '#ffc53d', transform: `scaleX(${rule})` }} />
            {ruleExt > 0 && ruleExtFade > 0 ? (
              <>
                <div style={{ position: 'absolute', top: 3, height: 1.5, right: '100%', width: 190 * ruleExt, background: '#ffc53d', opacity: ruleExtFade }} />
                <div style={{ position: 'absolute', top: 3, height: 1.5, left: '100%', width: 190 * ruleExt, background: '#ffc53d', opacity: ruleExtFade }} />
              </>
            ) : null}
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: 60, fontWeight: 500, color: '#c9cff0', marginTop: 34, lineHeight: 1.15, opacity: tag, transform: `translateY(${(1 - tag) * 6}px)` }}>
            Tu viaje empieza en la<br /><span style={{ color: '#ffc53d', fontWeight: 700 }}>Pradera de Venn</span>
          </div>
        </div>
      </AbsoluteFill>
      {/* 极弱胶片颗粒：大面积奶白纸面防色带 */}
      <Grain opacity={0.045} />
    </AbsoluteFill>
    </AbsoluteFill>
  );
};
