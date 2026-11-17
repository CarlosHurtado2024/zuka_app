// S3 · mundos — carousel-3d (demos/ui-entrance/carousel-3d/Carousel3D.tsx) adaptado a vertical y a los 10 mundos de Álgebra:
// mismo giro (50 % continuo + 50 % por pasos de 21f, 8f de reposo), la tarjeta de enfrente se adelanta 44px y se ilumina,
// reflejo en el piso y perspectiva aérea. La cara de cada tarjeta lleva el arte real del mundo capturado de la app.
// carousel-3d — 8 张卡排成圆环整环自转一圈：每卡只绕 Y 公转、自身 billboard 朝外，正反两层同向贴图 +
// backface-visibility:hidden 保证任何时刻都正立不倒置；相机全程钉在浅俯角，首尾帧无缝 loop。
//
// 第二轮重设计（酸柠 · 镜头配方画廊；品牌轮：原「训练计划」换成 video-shotcraft 的镜头配方卡）：
// - look = lime（石墨暗场 + 荧光黄绿）。卡片放大到 340×460 原生像素、环半径 700px，整环占画宽约 70%；
//   卡面是为镜头设计的"镜头配方卡"：mono 编号、生成式图形（剖面 / 闪切柱 / 声波 / 圆环…）、
//   64px 大数字、30px 名称——转到正前方的那张被点亮（荧光描边 + 图形转荧光色 + 底光），其余保持石墨灰。
// - 节奏：不再是死匀速。转角 = 50% 匀速底 + 50% 分步（每 21f 一步 = 8f 停靠 + 13f smooth 换位），
//   整环永远在走（loop 稳态）但每 45° 有一次"推一把—停靠"的呼吸，正前方的卡在停靠时被读清；
//   8 步 × 21f = 168f 正好一圈，首尾帧逐像素可接。
// - 环下方大字幕随步进滚动换字（编号 + 72px 名称），相机固定不动（画廊而不是过山车）。
// - 空气透视：按方位角给卡面叠深色（最后方 70%）+ 地面反光盘 + 渐隐倒影环，环真正"落地"。
//
// 时间表（30fps，共 168f，可无缝循环）：
//   每 21f 一拍：0–8 停靠（正前方卡点亮、字幕定格）→ 8–21 换位（smooth，字幕上滚换字）；共 8 拍 = 360°
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, FONT } from '../fx/Polish';
import { LOOKS, Stage, alpha, type } from '../fx/Look';
import layout from '../../public/tex/layout.json';

export const CAROUSEL_3D_DURATION = 300; // 10 pasos × 30f = una vuelta (cada mundo se alcanza a leer)

const L = LOOKS.zuka;
const N = 10;
const RADIUS = 540;
const CW = 390;
const CH = 520;
const RING_Y = 900; // centro del anillo (vertical)
const CX0 = 540;
const FLOOR = CH / 2 + 10; // 卡脚下的地面（相对环中心）
const BEAT = 30; // cuadros por paso = reposo + cambio
const DWELL = 16;

const WORLDS = layout.worlds as { name: string; sub: string }[];

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixHex = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), q = clamp01(t);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * q)).join(',')})`;
};

// 转角（0→1 圈）：50% 匀速 + 50% 分步（停靠 DWELL 帧 + smooth 换位）；f=168 恰为 1 圈
const stepPart = (f: number) => {
  const k = Math.floor(f / BEAT);
  const local = f - k * BEAT;
  return (k + EASE.smooth(clamp01((local - DWELL) / (BEAT - DWELL)))) / N;
};
const turnAt = (f: number) => 0.5 * (f / (N * BEAT)) + 0.5 * stepPart(f);

export const S3Mundos: React.FC = () => {
  const f = useCurrentFrame();
  const spin = turnAt(f) * 360;
  // 每张卡的世界方位角（0 = 正前方）
  const azimuth = (i: number) => ((((i * 360) / N - spin) % 360) + 540) % 360 - 180;
  const depthOf = (i: number) => (1 - Math.cos((azimuth(i) * Math.PI) / 180)) / 2;
  const hlOf = (i: number) => EASE.smooth(clamp01(1 - Math.abs(azimuth(i)) / 26));

  // 字幕：停靠时定格当前卡，换位时上滚到下一张
  const k = Math.floor(f / BEAT);
  const roll = EASE.smooth(clamp01((f - k * BEAT - DWELL) / (BEAT - DWELL)));

  const renderCard = (i: number, reflect: boolean) => {
    const d = depthOf(i);
    const hl = reflect ? 0 : hlOf(i);
    const face: React.CSSProperties = {
      position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', boxSizing: 'border-box',
      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
      background: `linear-gradient(165deg, ${L.surface2} 0%, ${L.surface} 60%, #0f110d 100%)`,
      border: `1.5px solid ${hl > 0.01 ? alpha(L.accent, 0.25 + 0.6 * hl) : alpha('#ffffff', 0.1)}`,
      boxShadow: `inset 0 1px 0 ${alpha('#ffffff', 0.1)}`,
      ...(reflect
        ? {
            // 透明度只能挂在叶子层：挂在 preserve-3d 容器上会把整环拍平
            opacity: 0.08,
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.85) 100%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.85) 100%)',
          }
        : {}),
    };
    const body = (
      <>
        <Face i={i} hl={hl} />
        {/* 空气透视：越靠后越暗（只叠一层带色相的深色，不改几何） */}
        <div style={{ position: 'absolute', inset: 0, background: L.bg[2], opacity: (0.7 * d).toFixed(3) }} />
      </>
    );
    return (
      <div key={i} style={{
        position: 'absolute', left: -CW / 2, top: -CH / 2, width: CW, height: CH, transformStyle: 'preserve-3d',
        // 卡只做环上定位（绕 Y 公转 + 沿法向推出半径），永不绕 X/Z——永远正立
        // 转到正前方的卡沿法向多推出 44px（只平移不旋转），停靠时读作"被选中"
        transform: `rotateY(${(i * 360) / N}deg) translateZ(${(RADIUS + 44 * hlOf(i)).toFixed(2)}px)`,
      }}>
        <div style={face}>{body}</div>
        <div style={{ ...face, transform: 'rotateY(180deg)' }}>{body}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: L.bg[2] }}>
      <Stage look={L} keyLight={{ x: 0.5, y: 0.16 }} fill={{ x: 0.5, y: 1.0 }} intensity={0.5} />

      {/* 正前方卡脚下的荧光底光（固定在画面上，不随环转） */}
      <div style={{
        position: 'absolute', left: CX0 - 460, top: RING_Y + 120, width: 920, height: 420, borderRadius: '50%',
        background: `radial-gradient(ellipse at 50% 40%, ${alpha(L.accent, 0.16)} 0%, ${alpha(L.accent, 0)} 65%)`,
      }} />

      {/* 3D 场景：perspective 2200px；相机固定浅俯角 */}
      <div style={{ position: 'absolute', inset: 0, perspective: '2200px', perspectiveOrigin: `50% ${RING_Y - 60}px` }}>
        <div style={{
          position: 'absolute', left: CX0, top: RING_Y, width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `translateZ(${-RADIUS}px) rotateX(-9deg)`,
        }}>
          {/* 地面反光盘 + 刻度环 */}
          <div style={{
            position: 'absolute', left: -RADIUS * 1.35, top: FLOOR - RADIUS * 1.35, width: RADIUS * 2.7, height: RADIUS * 2.7, borderRadius: '50%',
            transform: 'rotateX(90deg)',
            background: `radial-gradient(circle, ${alpha(L.accent, 0.1)} 0%, ${alpha(L.accent, 0.03)} 45%, transparent 66%)`,
          }} />
          <svg width={RADIUS * 2.4} height={RADIUS * 2.4} viewBox={`${-RADIUS * 1.2} ${-RADIUS * 1.2} ${RADIUS * 2.4} ${RADIUS * 2.4}`}
            style={{ position: 'absolute', left: -RADIUS * 1.2, top: FLOOR - RADIUS * 1.2, transform: `rotateX(90deg) rotateZ(${spin}deg)`, overflow: 'visible' }}>
            <circle r={RADIUS * 1.08} fill="none" stroke={alpha('#ffffff', 0.08)} strokeWidth={2} />
            {Array.from({ length: 96 }, (_, t) => {
              const a = (t / 96) * Math.PI * 2;
              const r0 = RADIUS * (t % 12 === 0 ? 1.02 : 1.05);
              return <line key={t} x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={RADIUS * 1.08 * Math.cos(a)} y2={RADIUS * 1.08 * Math.sin(a)}
                stroke={t % 12 === 0 ? alpha(L.accent, 0.5) : alpha('#ffffff', 0.12)} strokeWidth={t % 12 === 0 ? 3 : 2} />;
            })}
          </svg>
          {/* 倒影环：以地面为镜面翻转 */}
          <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translateY(${FLOOR * 2}px) scaleY(-1) rotateY(${-spin}deg)` }}>
            {Array.from({ length: N }, (_, i) => renderCard(i, true))}
          </div>
          {/* 圆环载体：唯一的逐帧变量 */}
          <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateY(${-spin}deg)` }}>
            {Array.from({ length: N }, (_, i) => renderCard(i, false))}
          </div>
        </div>
      </div>

      {/* 字幕：编号 + 名称，随步进上滚换字（裁切窗） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: RING_Y + 362, height: 150, overflow: 'hidden' }}>
        {[0, 1].map((j) => {
          const c = (k + j) % N;
          const y = (j - roll) * 150;
          return (
            <div key={j} style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              transform: `translateY(${y.toFixed(2)}px)`, opacity: 1 - Math.abs(j - roll) * 0.9,
            }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 700, letterSpacing: '0.14em', color: L.accent2 }}>{`MUNDO ${c + 1} DE 10`}</span>
              <span style={{ ...type(84, 700), color: L.ink }}>{WORLDS[c].name}</span>
            </div>
          );
        })}
      </div>

      {/* titular: lo que es el curso */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 250, fontFamily: FONT.sans, color: L.ink }}>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.14em', color: L.accent }}>TU RUTA</div>
        <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.02em' }}>10 mundos,<br />un camino.</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── cara de la tarjeta (330×440): arte real del mundo + número + nombre ─────────────
const Face: React.FC<{ i: number; hl: number }> = ({ i, hl }) => {
  const w = WORLDS[i];
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 55% at 30% 0%, ${alpha('#ffffff', 0.08)} 0%, transparent 60%)` }} />
      <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', fontFamily: FONT.sans, fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', color: L.ink3 }}>
        <span>{`MUNDO ${i + 1}`}</span>
        <span style={{ color: hl > 0.5 ? L.accent2 : L.ink3 }}>●</span>
      </div>
      <Img src={staticFile(`tex/world-${i}.png`)} style={{ position: 'relative', width: 290, height: 290, marginTop: 20, borderRadius: '50%',
        boxShadow: hl > 0.01 ? `0 0 ${(40 * hl).toFixed(1)}px ${alpha(L.accent, 0.5 * hl)}` : undefined }} />
      <div style={{ position: 'relative', ...type(40, 700), color: L.ink, marginTop: 24, textAlign: 'center' }}>{w.name}</div>
      <div style={{ position: 'relative', fontFamily: FONT.sans, fontSize: 24, fontWeight: 500, color: L.ink2, marginTop: 6 }}>{w.sub.replace(/^Mundo \d+ · 0\//, '') + ' lecciones'}</div>
    </div>
  );
};
