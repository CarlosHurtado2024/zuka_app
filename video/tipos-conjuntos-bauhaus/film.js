// «Tipos de conjuntos y relaciones entre ellos» (lección alg-0b de Zuka) · estilo Bauhaus Shapes, 1080×1920.
// Una sola línea de tiempo: SC (escenas, en pulsos de 0.625 s), una función de dibujo por escena, EV (sonido y
// narración, en segundos de película) y texts(t) para la comprobación de lectura. Guion: TREATMENT.md.
// Un círculo grande es un conjunto; un punto, un cuadrado o un triángulo pequeño es un elemento.
import { clamp, lerp, eo, ei, eio, back } from '/core/lib.js';

export function setupFilm(X){
const { g, P, W, H, SANS, disc, poly, rect, line, arc, cross, measure, finish } = X;
const TAU = Math.PI*2, BEAT = 0.625;

// ---------------- escenas ----------------
const NAMES = ['titulo','vacio','trampa','unitario','finito','infinito','universal','sub','nosub','iguales','disjuntos','partes','repaso'];
const BEATS = [12, 32, 20, 26, 20, 26, 30, 26, 42, 30, 30, 64, 22];
const SC = []; { let a = 0; BEATS.forEach((b,i)=>{ SC.push({ id:NAMES[i], t0:a*BEAT, d:b*BEAT }); a += b; }); }
const FULL = SC[SC.length-1].t0 + SC[SC.length-1].d;
const EV = [];
const ev = (sc,u,type,o={}) => EV.push({ t:+(SC[sc].t0+u).toFixed(3), type, pan:0, ...o });

// ---------------- tiempo ----------------
const K = (u,a,d) => clamp((u-a)/d);                                     // avance 0..1 desde a durante d
const vis = (u,a,b=1e9) => Math.min(eo(K(u,a,.55)), 1-ei(K(u,b,.45)));   // entra en a, se va en b
const fall = (y,k) => y - (1-back(k,1.4))*900;                           // cae desde arriba y asienta con rebote

// ---------------- texto (con registro para readcheck) ----------------
let REC = null;
function T(str,x,y,o={},id=null){
  const { size=40, weight=800, col=P.ink, align='left', base='alphabetic', track=0 } = o;
  g.save(); g.translate(x,y);
  g.font=`${weight} ${size}px ${SANS}`; g.fillStyle=col; g.textAlign=align; g.textBaseline=base;
  g.letterSpacing = track ? `${track}px` : '0px';
  g.fillText(str,0,0);
  if (REC && id!==false){
    const w = g.measureText(str).width, x0 = align==='center' ? -w/2 : align==='right' ? -w : 0;
    const y0 = base==='middle' ? -size*0.4 : -size*0.78, y1 = base==='middle' ? size*0.4 : size*0.2;
    const m = g.getTransform(), pts = [[x0,y0],[x0+w,y0],[x0,y1],[x0+w,y1]].map(([px,py])=>[m.a*px+m.c*py+m.e, m.b*px+m.d*py+m.f]);
    REC.push({ id:id||str, text:str, x0:Math.min(...pts.map(p=>p[0])), y0:Math.min(...pts.map(p=>p[1])), x1:Math.max(...pts.map(p=>p[0])), y1:Math.max(...pts.map(p=>p[1])) });
  }
  g.restore();
}
const NC = false;   // decorativo (contadores, letras dentro de un elemento): no es texto de lectura
const fitSize = (str,size,weight,maxW,track=0) => { let s = size; while (s > 20 && measure(str,s,weight,SANS,track) > maxW) s -= 2; return s; };
// Una palabra sube por una ranura sobre su línea base (k = 0 escondida, 1 puesta).
function rise(str,x,y,o,k,id){
  if (k <= 0.001) return;
  const size = o.size || 40;
  g.save(); g.beginPath(); g.rect(-400, y-size*1.05, W+800, size*1.36); g.clip();
  const keep = REC; if (k < 0.6) REC = null;
  T(str, x, y+(1-k)*size*1.45, o, id); REC = keep;
  g.restore();
}
const word = (str,y,u,a,b,size=170) => rise(str, W/2, y, { size:fitSize(str,size,800,830,-3), weight:800, align:'center', track:-3 }, vis(u,a,b));
// Una línea de lectura se descubre de izquierda a derecha (centrada en cx).
function reveal(str,cx,y,o,k,id){
  if (k <= 0.001) return;
  const size = o.size || 48, w = measure(str,size,o.weight??500,SANS,o.track??0);
  g.save(); g.beginPath(); g.rect(cx-w/2-6, y-size*1.1, (w+12)*k, size*1.5); g.clip();
  const keep = REC; if (k < 0.6) REC = null;
  T(str, cx-w/2, y, { weight:500, ...o, size }, id); REC = keep;
  g.restore();
}
const read = (str,y,u,a,b,size=50) => reveal(str, W/2, y, { size:fitSize(str,size,500,860), weight:500 }, vis(u,a,b));
const caps = (str,x,y,u,a,b,o={}) => rise(str, x, y, { size:30, weight:700, track:5, align:'center', ...o }, vis(u,a,b));

// ---------------- signos hechos con formas (la fuente no trae ∅ ⊆ ⊄ ≠) ----------------
const SYMW = { empty:.74, sub:.66, nsub:.66, neq:.56 };
function sym(name,x,y,size,col){
  const h = size*0.70, lw = Math.max(4, size*0.085);
  if (name === 'empty'){ const cx = x+size*0.37, cy = y-h*0.5, r = h*0.40;
    arc(cx,cy,r,0,TAU,col,lw); line([[cx-r*1.05,cy+r*1.3],[cx+r*1.05,cy-r*1.3]],col,lw); }
  else if (name === 'sub' || name === 'nsub'){ const w = size*0.66, r = h*0.30, top = y-h*0.95;
    g.strokeStyle=col; g.lineWidth=lw; g.lineCap='butt'; g.lineJoin='round'; g.beginPath();
    g.moveTo(x+w,top); g.lineTo(x+r+2,top); g.arc(x+r+2,top+r,r,-Math.PI/2,Math.PI/2,true); g.lineTo(x+w,top+2*r); g.stroke();
    line([[x,y-h*0.06],[x+w,y-h*0.06]],col,lw);
    if (name === 'nsub') line([[x+w*0.22,y+h*0.10],[x+w*0.80,top-h*0.14]],col,lw); }
  else if (name === 'neq'){ const w = size*0.56;
    line([[x,y-h*0.64],[x+w,y-h*0.64]],col,lw); line([[x,y-h*0.32],[x+w,y-h*0.32]],col,lw);
    line([[x+w*0.24,y-h*0.08],[x+w*0.76,y-h*0.88]],col,lw); }
}
// Fórmula centrada en cx. groups = [[a, ...piezas]]: cada grupo sube en su momento `a`; una pieza es texto o {s:'signo'}.
function formula(groups,cx,y,size,u,b=1e9,weight=600){
  const gap = size*0.16, wOf = p => typeof p === 'string' ? measure(p,size,weight) : SYMW[p.s]*size;
  let total = 0; groups.forEach(gr => gr.slice(1).forEach(p => { total += wOf(p)+gap; })); total -= gap;
  let x = cx-total/2;
  for (const gr of groups){
    const k = vis(u,gr[0],b);
    g.save(); g.beginPath(); g.rect(-400, y-size*1.1, W+800, size*1.42); g.clip(); g.translate(0,(1-k)*size*1.5);
    for (const p of gr.slice(1)){
      if (k > 0.001){ if (typeof p === 'string'){ const keep = REC; if (k < 0.6) REC = null; T(p,x,y,{size,weight}); REC = keep; } else sym(p.s,x,y,size,P.ink); }
      x += wOf(p)+gap;
    }
    g.restore();
  }
}

// ---------------- formas ----------------
function dot(x,y,r,col,ch,chCol=P.light){ disc(x,y,r,col); if (ch) T(ch,x,y+r*0.06,{ size:r*1.25, weight:700, col:chCol, align:'center', base:'middle' },NC); }
function sq(x,y,s,col,ch){ rect(x-s/2,y-s/2,s,s,col); if (ch) T(ch,x,y+s*0.04,{ size:s*0.6, weight:700, col:P.ink, align:'center', base:'middle' },NC); }
function tri(x,y,s,col){ const h = s*0.866; poly([[x,y-h*0.62],[x+s/2,y+h*0.38],[x-s/2,y+h*0.38]],col); }
// El compás barre el conjunto: una cuña que crece y el brazo que la dibuja.
function sweep(x,y,r,k,col){
  if (k <= 0) return;
  if (k >= 1){ disc(x,y,r,col); return; }
  const a0 = -Math.PI/2, a1 = a0+TAU*eio(k);
  g.fillStyle=col; g.beginPath(); g.moveTo(x,y); g.arc(x,y,r,a0,a1); g.closePath(); g.fill();
  line([[x,y],[x+Math.cos(a1)*r,y+Math.sin(a1)*r]],P.ink,3); cross(x,y,P.ink);
}
// Lo que comparten dos discos, en un tercer color y con borde duro.
function lens(ax,ay,ar,bx,by,br,col){ g.save(); g.beginPath(); g.arc(ax,ay,ar,0,TAU); g.clip(); disc(bx,by,br,col); g.restore(); }
// Línea de construcción: se traza de un extremo al otro en `a` y se recoge en `b`.
function gl(u,dir,pos,a,b=1e9,lo=0,hi=null){
  const p0 = eio(K(u,b,.4)), p1 = eio(K(u,a,.5)); if (p1 <= p0) return;
  const L = (hi ?? (dir === 'h' ? W : H))-lo;
  if (dir === 'h') line([[lo+L*p0,pos],[lo+L*p1,pos]],P.ink,2); else line([[pos,lo+L*p0],[pos,lo+L*p1]],P.ink,2);
}
// Los elementos de {●, ■, ▲} (bits 1, 2, 4) acomodados alrededor de (cx, cy).
function elems(bits,cx,cy,sc=1){
  const ids = [1,2,4].filter(b => bits & b), n = ids.length;
  const off = n === 1 ? [[0,0]] : n === 2 ? [[-40,0],[40,0]] : [[-44,-30],[44,-30],[0,42]];
  ids.forEach((b,i) => { const x = cx+off[i][0]*sc, y = cy+off[i][1]*sc;
    if (b === 1) disc(x,y,30*sc,P.red); else if (b === 2) sq(x,y,54*sc,P.blue); else tri(x,y+4*sc,66*sc,P.yel); });
}

// ---------------- cámara ----------------
const cam = (s=1,cx=W/2,cy=H/2,dx=0,dy=0) => g.setTransform(s,0,0,s, W/2-s*cx+dx, H/2-s*cy+dy);
const scr = (dx=0,dy=0) => g.setTransform(1,0,0,1,dx,dy);
// Látigo: la escena entra desde la derecha y sale por la izquierda, con rectas largas que llevan la velocidad.
const whipIn = u => (1-eo(K(u,0,.5)))*W, whipOut = (u,d) => -ei(K(u,d-.45,.45))*W;
function speedLines(dx){ if (Math.abs(dx) < 2) return; scr(); [330,960,1590].forEach(y => line([[0,y],[W,y]],P.ink,2)); }

const S0 = { x:540, y:1000, r:330 };   // el conjunto principal

// ================= 0 · título =================
let TFS = 0;
function s0(u){
  cam();
  gl(u,'v',132,.0,5.6); gl(u,'h',1500,.25,5.8); gl(u,'h',1330,.5,6.0);
  const my = eio(K(u,6.5,.9));
  sweep(540, lerp(760,S0.y,my), 330, K(u,.6,1.6), P.tint);
  caps('ÁLGEBRA · CONJUNTOS', 132, 210, u, .3, 6.3, { align:'left' });
  if (!TFS){ TFS = 150; const wAll = s => measure('C',s,800,SANS,-3)+s*0.71+12+measure('NJUNTOS',s,800,SANS,-3); while (wAll(TFS) > 816) TFS -= 2; }
  const fs = TFS, o = { size:fs, weight:800, track:-3 };
  rise('TIPOS DE', 132, 1330, o, vis(u,2.2,6.3));
  const k2 = vis(u,2.7,6.4), wC = measure('C',fs,800,SANS,-3), oR = fs*0.355, ox = 132+wC+oR+4;
  rise('C', 132, 1500, o, k2, 'CONJUNTOS'); rise('NJUNTOS', ox+oR+8, 1500, o, k2, NC);
  const kd = K(u,3.3,.6), ko = ei(K(u,6.4,.5));
  if (kd > 0) disc(ox, fall(1500-fs*0.355,kd)+ko*700, oR, P.red);
  rise('y sus relaciones', 136, 1610, { size:68, weight:300, track:8 }, vis(u,4.0,6.4));
}
ev(0,0,'grid',{d:.5,pan:-.6}); ev(0,.25,'grid',{d:.5}); ev(0,.5,'grid',{d:.5}); ev(0,.6,'sweep',{d:1.6});
ev(0,2.2,'rise'); ev(0,2.7,'rise'); ev(0,3.85,'drop',{n:0}); ev(0,4.0,'rise'); ev(0,2.2,'chord',{big:true}); ev(0,6.5,'whoosh',{d:.9});

// ================= 1 · el conjunto vacío =================
const DAYS = ['L','M','M','J','V','S','D'];
function s1(u,d){
  const z = 1+0.10*eio(K(u,10.8,7)), dx = whipOut(u,d);
  cam(z,540,1000,dx);
  disc(S0.x,S0.y,S0.r,P.tint);
  DAYS.forEach((ch,i) => {
    const c0 = 3.4+i*.9, kin = K(u,1.0+i*.25,.5); if (kin <= 0) return;
    const x = 180+i*120 + (1-back(kin,1.2))*900 - ei(K(u,10.3+i*.06,.5))*1300;
    sq(x, 420+Math.sin(K(u,c0,.8)*Math.PI)*170, 96, u > c0+.45 ? P.tint : P.yel, ch);
  });
  scr(dx);
  read('días que empiezan por Z', 250, u, .3, 10.4, 56);
  word('VACÍO', 1560, u, 12.7);
  formula([[14.2, {s:'empty'}, '=', '{', '}']], W/2, 1730, 104, u);
  speedLines(dx);
}
ev(1,.3,'rise'); DAYS.forEach((_,i) => { ev(1,1.3+i*.25,'clack',{pan:-.6+i*.2}); ev(1,3.8+i*.9,'tap',{n:i,pan:-.6+i*.2}); });
ev(1,10.3,'whoosh',{d:.7}); ev(1,11.0,'mute',{d:1.7}); ev(1,12.7,'chord',{big:true}); ev(1,12.7,'rise'); ev(1,14.2,'rise'); ev(1,19.5,'whoosh',{d:.5});

// ================= 2 · la trampa: {∅} no es vacío =================
function s2(u,d){
  const dx = whipIn(u), kf = ei(K(u,d-.8,.8))*1500;
  cam(1,W/2,H/2,dx);
  disc(S0.x,S0.y+kf,S0.r,P.tint);
  const kin = K(u,1.0,.7); if (kin > 0) disc(S0.x, fall(S0.y,kin)+kf*1.2, 120, P.yel);
  scr(dx);
  formula([[2.4, '{', {s:'empty'}, '}'], [6.5, {s:'neq'}, {s:'empty'}]], W/2, 1560, 170, u, d-1.1);
  read('tiene un elemento', 1720, u, 4.0, d-1.1, 58);
  speedLines(dx);
}
ev(2,1.55,'thud',{f:80}); ev(2,1.55,'drop',{n:2}); ev(2,2.4,'rise'); ev(2,4.0,'rise'); ev(2,6.5,'clack'); ev(2,6.5,'chord'); ev(2,11.7,'whoosh',{d:.8});

// ================= 3 · unitario =================
function s3(u,d){
  cam();
  const m = eio(K(u,7.6,1.2)), kf = ei(K(u,15.4,.8))*1500;
  gl(u,'h',880,14.4); gl(u,'h',1120,14.6);
  const cx = lerp(540,760,m), r = lerp(330,210,m), rd = lerp(64,48,m);
  sweep(cx, S0.y+kf, r, K(u,0,1.2), P.tint);
  const kin = K(u,1.6,.6);
  if (kin > 0){
    disc(cx, fall(S0.y,kin)+kf*1.15, rd, P.red);
    const kl = vis(u,2.6,7.2);
    if (kl > 0){ const w = measure('Bogotá',56,600); g.save(); g.beginPath(); g.rect(cx+rd,S0.y-50,w+40,100); g.clip();
      const keep = REC; if (kl < .6) REC = null; T('Bogotá', cx+rd+18-(1-kl)*(w+30), S0.y+18, { size:56, weight:600 }); REC = keep; g.restore(); }
  }
  const k2 = K(u,9.0,.6); if (k2 > 0) disc(250, fall(S0.y,k2)+kf*1.3, 48, P.red);
  const kn = vis(u,10.0,15.2); if (kn > 0){ g.save(); g.beginPath(); g.rect(380,900,200,170); g.clip(); sym('neq',412,1040+(1-kn)*160,130,P.ink); g.restore(); }
  rise('Bogotá', 250, 1290, { size:50, weight:600, align:'center' }, vis(u,10.6,15.2), 'Bogotá sola');
  rise('{ Bogotá }', 760, 1290, { size:50, weight:600, align:'center' }, vis(u,11.2,15.2), 'Bogotá en llaves');
  read('la capital de Colombia', 250, u, .6, 15.2, 56);
  word('UNITARIO', 1560, u, 3.6, 15.2);
  formula([[5.0, '{', 'Bogotá', '}']], W/2, 1730, 92, u, 7.3);
  read('el elemento no es el conjunto', 1720, u, 12.0, 15.2, 52);
}
ev(3,0,'sweep',{d:1.2}); ev(3,.6,'rise'); ev(3,2.15,'drop',{n:0}); ev(3,2.6,'rise'); ev(3,3.6,'rise'); ev(3,3.6,'chord'); ev(3,5.0,'rise');
ev(3,7.6,'whoosh',{d:1.1}); ev(3,9.55,'drop',{n:3,pan:-.5}); ev(3,10.0,'clack'); ev(3,10.6,'rise'); ev(3,11.2,'rise'); ev(3,12.0,'rise');
ev(3,14.4,'grid',{d:.5}); ev(3,14.6,'grid',{d:.5}); ev(3,15.4,'whoosh',{d:.8});

// ================= 4 · finito =================
const FIN = [[360,880],[480,880],[600,880],[720,880],[420,1120],[540,1120],[660,1120]];
function s4(u,d){
  cam();
  gl(u,'h',880,-1,5.0); gl(u,'h',1120,-1,5.2);
  const kd = K(u,.3,.7), rr = S0.r*(1-ei(K(u,d-.5,.5)));
  if (kd > 0) disc(S0.x, S0.y+(1-back(kd,1.2))*1500, rr, P.tint);
  let n = 0;
  FIN.forEach(([x,y],i) => { const k = K(u,1.4+i*.45,.45); if (k <= 0) return; if (k >= .8) n++;
    sq(x, fall(y,k)+ei(K(u,11.3+i*.04,.6))*1500, 92, P.yel, DAYS[i]); });
  const kn = vis(u,1.6,11.2);
  if (n) rise(String(n), 948, 470, { size:260, weight:800, align:'right', track:-6 }, kn, n === 7 ? 'siete' : NC);
  caps('ELEMENTOS', 940, 530, u, 5.0, 11.2, { align:'right' });
  word('FINITO', 1560, u, 5.4, 11.2);
  read('se cuentan y se acaban', 1720, u, 6.6, 11.2, 58);
}
ev(4,.8,'thud',{f:70}); FIN.forEach((_,i) => { ev(4,1.4+i*.45+.38,'clack',{pan:-.3+i*.1}); ev(4,1.4+i*.45+.38,'drop',{n:i}); });
ev(4,5.0,'grid',{d:.4}); ev(4,5.4,'rise'); ev(4,5.4,'chord'); ev(4,6.6,'rise'); ev(4,11.3,'whoosh',{d:.9});

// ================= 5 · infinito: punto → línea → plano =================
const AX = 200, BX = 880, LV = [2.6,3.5,4.3,5.0,5.6,6.2,7.4,8.6,9.8];
function s5(u,d){
  const kz = eio(K(u,6.4,5.2)), kb = eio(K(u,12.8,1.6));
  const z = 1+3*kz-3*kb, cx = lerp(540,285,kz-kb);
  cam(z,cx,1000);
  const ks = eio(K(u,1.0,.8)); if (ks > 0) line([[AX,1000],[AX+(BX-AX)*ks,1000]],P.ink,5/z);
  LV.forEach((t0,i) => { const L = i+1, k = K(u,t0,.35); if (k <= 0) return;
    const r = 30*Math.pow(0.72,L)*back(k), n = 1<<L, x0 = cx-W/2/z-40, x1 = cx+W/2/z+40;
    for (let j = 1; j < n; j += 2){ const x = AX+(BX-AX)*j/n; if (x > x0 && x < x1) disc(x,1000,r,P.blue); } });
  const ka = back(K(u,.2,.4)), kb2 = back(K(u,.6,.4));
  disc(AX,1000,30*ka,P.blue); disc(BX,1000,30*kb2,P.blue);
  const kf = eio(K(u,11.2,1.6)), kp = ei(K(u,15.0,1.25));
  if (kf > 0){ const hh = 16+kp*1100, xa = AX-30-kp*400, xb = AX-30+(BX-AX+60)*kf+kp*400; rect(xa,1000-hh,xb-xa,hh*2,P.blue); }
  scr();
  if (kp < .5){
    read('entre dos puntos siempre cabe otro', 420, u, 2.2, 14.4, 50);
    word('INFINITO', 1560, u, 9.0, 14.4);
  }
}
ev(5,.2,'drop',{n:0,pan:-.6}); ev(5,.6,'drop',{n:4,pan:.6}); ev(5,1.0,'grid',{d:.8}); ev(5,2.2,'rise');
LV.forEach((t0,i) => ev(5,t0,'drop',{n:i+1})); ev(5,6.4,'whoosh',{d:1.4}); ev(5,9.0,'rise'); ev(5,9.0,'chord');
ev(5,11.2,'sweep',{d:1.6}); ev(5,12.8,'whoosh',{d:1.2}); ev(5,15.0,'whoosh',{d:1.2}); ev(5,15.0,'thud',{f:55});

// ================= 6 · el conjunto universal =================
const UR = { x0:120, y0:400, x1:960, y1:1420 }, UV = { x:540, y:860, r:250 }, VOW = ['a','e','i','o','u'];
const CONS = (() => { const out = [];
  for (let y = 520; y <= 1330; y += 90) for (let x = 200; x <= 880; x += 85){
    if (Math.hypot(x-UV.x,y-UV.y) < UV.r+42) continue;
    if (x < 330 && y < 640) continue;
    if (y > 1300 && x > 300 && x < 780) continue;
    out.push([x,y, Math.sin(x*12.9898+y*78.233)*43758.5453 % 1]); }
  return out.sort((a,b) => a[2]-b[2]).slice(0,22); })();
function s6(u,d){
  const dx = whipOut(u,d);
  cam(1,W/2,H/2,dx);
  const k = eio(K(u,.2,1.2));
  rect(lerp(-20,UR.x0,k), lerp(-20,UR.y0,k), lerp(W+40,UR.x1-UR.x0,k), lerp(H+40,UR.y1-UR.y0,k), P.blue);
  rise('U', 172, 560, { size:140, weight:800, col:P.light }, vis(u,1.4));
  sweep(UV.x,UV.y,UV.r,K(u,2.2,1.0),P.tint);
  VOW.forEach((ch,i) => { const kk = K(u,3.6+i*.4,.55); if (kk <= 0) return; const a = -Math.PI/2+i*TAU/5;
    dot(UV.x+Math.cos(a)*145, fall(UV.y+Math.sin(a)*145,kk), 50, P.red, ch); });
  caps('VOCALES', UV.x, UV.y+12, u, 5.8);
  CONS.forEach(([x,y],j) => { const kk = K(u,6.0+j*.1,.3); if (kk > 0) disc(x,y,17*back(kk),P.light); });
  caps('CONSONANTES', 540, 1385, u, 8.6, 1e9, { col:P.light });
  scr(dx);
  word('UNIVERSAL', 1590, u, 9.2);
  read('todo lo del tema: aquí, las letras', 1740, u, 10.6, 1e9, 52);
  speedLines(dx);
}
ev(6,.2,'whoosh',{d:1.2}); ev(6,1.3,'thud',{f:60}); ev(6,1.4,'rise'); ev(6,2.2,'sweep',{d:1.0});
VOW.forEach((_,i) => ev(6,3.6+i*.4+.5,'drop',{n:i})); ev(6,5.8,'rise');
CONS.forEach((_,j) => ev(6,6.0+j*.1,'tick',{n:j,pan:-.5+(j%5)*.25})); ev(6,8.6,'rise'); ev(6,9.2,'rise'); ev(6,9.2,'chord',{big:true}); ev(6,10.6,'rise'); ev(6,18.3,'whoosh',{d:.5});

// ================= 7 · subconjunto =================
const SL = { x:540, y:1010, r:370 };
function s7(u,d){
  const dx = whipIn(u), kf = ei(K(u,d-.8,.8))*1500;
  cam(1,W/2,H/2,dx);
  disc(SL.x,SL.y+kf,SL.r,P.tint);
  for (let i = 0; i < 14; i++){ const a = i*TAU/14+.2; disc(SL.x+Math.cos(a)*295, SL.y+Math.sin(a)*295+kf, 15, P.light); }
  const m = eio(K(u,2.5,1.5)), vy = lerp(430,1090,m)+kf*1.2;
  disc(540,vy,160,P.yel);
  for (let i = 0; i < 5; i++){ const a = -Math.PI/2+i*TAU/5; disc(540+Math.cos(a)*82, vy+Math.sin(a)*82, 25, P.red); }
  const kl = vis(u,.7,d-1.0);
  rise('L', 150, 700+kf, { size:104, weight:800, align:'center' }, kl, NC);
  rise('V', 760, vy-80, { size:104, weight:800, align:'center' }, kl, NC);
  scr(dx);
  word('SUBCONJUNTO', 1560, u, 5.0, d-1.1);
  formula([[6.6, 'V', {s:'sub'}, 'L']], W/2, 1710, 112, u, d-1.1);
  read('todo elemento de V está en L', 1810, u, 8.2, d-1.1, 48);
  speedLines(dx);
}
ev(7,.7,'rise'); ev(7,2.5,'whoosh',{d:1.4}); ev(7,3.95,'thud',{f:75}); ev(7,3.95,'chord'); ev(7,5.0,'rise'); ev(7,6.6,'rise'); ev(7,8.2,'rise'); ev(7,15.45,'whoosh',{d:.8});

// ================= 8 · cuando no es subconjunto; el vacío y uno mismo =================
const NS = { x:440, y:880, r:320 }, NB = { x:760, y:1200, r:250 };
function s8(u,d){
  const dx = whipIn(u)+whipOut(u,d), kz = eio(K(u,5.4,2))-eio(K(u,9.4,1.0));
  cam(1+0.2*kz, lerp(540,640,kz), lerp(960,1060,kz), dx);
  sweep(NS.x,NS.y,NS.r,K(u,.4,1.0),P.tint);
  const kB = K(u,3.0,1.0), fB = ei(K(u,10.6,.8))*1500;
  if (kB > 0 && fB < 1400){
    g.save(); g.translate(0,fB);
    sweep(NB.x,NB.y,NB.r,kB,P.yel);
    if (kB >= 1 && fB < 1) lens(NS.x,NS.y,NS.r,NB.x,NB.y,NB.r,P.blue);
    const ka = K(u,4.4,.55); if (ka > 0) dot(840,fall(1280,ka),42,P.red,'a');
    rise('B', 955, 975, { size:104, weight:800, align:'center' }, vis(u,3.6), NC);
    g.restore();
    if (fB >= 1) { /* al caer B, lo común vuelve a ser solo de S */ }
  }
  [['s',625,1065,1.4],['o',330,760,1.7],['l',300,980,2.0]].forEach(([ch,x,y,a]) => { const k = K(u,a,.55); if (k > 0) dot(x,fall(y,k),42,P.red,ch); });
  rise('S', 150, 560, { size:104, weight:800, align:'center' }, vis(u,.9), NC);
  const ke = back(K(u,12.2,.5))*(1-ei(K(u,18.2,.4))); if (ke > 0) disc(520,760,95*ke,P.yel);
  const kg = K(u,19.0,.9); if (kg > 0) arc(NS.x,NS.y,lerp(420,NS.r,eio(kg)),0,TAU,P.ink,5);
  scr(dx);
  read('las letras de SOL', 250, u, .8, 10.2, 56);
  formula([[5.6, 'B', {s:'nsub'}, 'S']], W/2, 1640, 132, u, 10.2);
  read('la a quedó afuera', 1770, u, 6.8, 10.2, 54);
  formula([[13.2, {s:'empty'}, {s:'sub'}, 'S']], W/2, 1640, 132, u, 18.2);
  read('el vacío cabe en todo conjunto', 1770, u, 14.0, 18.2, 54);
  formula([[19.9, 'S', {s:'sub'}, 'S']], W/2, 1640, 132, u);
  read('y todo conjunto cabe en sí mismo', 1770, u, 20.6, 1e9, 54);
  speedLines(dx);
}
ev(8,.4,'sweep',{d:1.0}); ev(8,.8,'rise'); [1.4,1.7,2.0].forEach((a,i) => ev(8,a+.5,'drop',{n:i,pan:-.3})); ev(8,3.0,'sweep',{d:1.0});
ev(8,4.9,'drop',{n:5,pan:.5}); ev(8,5.4,'whoosh',{d:1.2}); ev(8,5.6,'rise'); ev(8,5.6,'clack'); ev(8,6.8,'rise'); ev(8,10.6,'whoosh',{d:.8});
ev(8,12.6,'thud',{f:85}); ev(8,13.2,'rise'); ev(8,13.2,'chord'); ev(8,14.0,'rise'); ev(8,19.0,'sweep',{d:.9}); ev(8,19.9,'thud',{f:65}); ev(8,19.9,'chord'); ev(8,20.6,'rise'); ev(8,25.8,'whoosh',{d:.5});

// ================= 9 · conjuntos iguales =================
const EA = { x:540, y:720, r:240 }, SLOT = [[-88,-88],[88,-88],[-88,88],[88,88]];
const AM = ['a','m','o','r'], RO = ['r','o','m','a'];
function s9(u,d){
  const dx = whipIn(u), kf = ei(K(u,d-.8,.8))*1500;
  cam(1,W/2,H/2,dx);
  const m = eio(K(u,10.4,1.4)), by = lerp(1290,EA.y,m)+kf*1.2, kdr = eo(K(u,9.8,.5)), kp = eio(K(u,8.0,1.4));
  disc(EA.x,EA.y+kf,EA.r,P.tint);
  disc(EA.x,by,EA.r*(1-kdr),P.yel);
  RO.forEach((ch,i) => { const k = K(u,4.6+i*.45,.55); if (k <= 0) return; const j = AM.indexOf(ch);
    const x = lerp(SLOT[i][0],SLOT[j][0],kp), y = lerp(SLOT[i][1],SLOT[j][1],kp) - Math.sin(kp*Math.PI)*(i%2?34:-34);
    dot(EA.x+x, fall(by+y,k), 50, P.red, ch); });
  AM.forEach((ch,i) => { const k = K(u,1.2+i*.45,.55); if (k > 0) dot(EA.x+SLOT[i][0], fall(EA.y+SLOT[i][1],k)+kf, 50, P.red, ch); });
  if (kdr > 0) arc(EA.x,by,EA.r,0,TAU,P.ink,5);
  rise('A', 850, 520+kf, { size:92, weight:800, align:'center' }, vis(u,1.0), NC);
  rise('B', 230, by-200, { size:92, weight:800, align:'center' }, vis(u,4.4), NC);
  scr(dx);
  rise('AMOR', 132, 400, { size:112, weight:800, track:-2 }, vis(u,.6,d-1.1));
  rise('ROMA', 132, 1720, { size:112, weight:800, track:-2 }, vis(u,4.0,10.0));
  formula([[12.4, 'A', '=', 'B']], W/2, 1290, 170, u, d-1.1);
  word('IGUALES', 1560, u, 13.2, d-1.1);
  read('mismos elementos; el orden no importa', 1720, u, 14.2, d-1.1, 48);
  speedLines(dx);
}
ev(9,.6,'rise'); AM.forEach((_,i) => ev(9,1.2+i*.45+.5,'drop',{n:i})); ev(9,4.0,'rise'); RO.forEach((_,i) => ev(9,4.6+i*.45+.5,'drop',{n:3-i}));
ev(9,8.0,'whoosh',{d:1.3}); ev(9,9.8,'grid',{d:.5}); ev(9,10.4,'whoosh',{d:1.3}); ev(9,11.8,'thud',{f:70}); ev(9,11.8,'chord',{big:true});
ev(9,12.4,'rise'); ev(9,13.2,'rise'); ev(9,14.2,'rise'); ev(9,17.95,'whoosh',{d:.8});

// ================= 10 · disjuntos (y lo que pasa si se cruzan) =================
function s10(u,d){
  cam();
  const kin = back(K(u,.3,.9),1.2), m = eio(K(u,11,1.5));
  const lx = lerp(-320,300,kin)+110*m, rx = lerp(1400,780,kin)-110*m, y = 900;
  disc(lx,y,205,P.tint); disc(rx,y,205,P.yel);
  if (m > 0) lens(lx,y,205,rx,y,205,P.blue);
  for (let i = 0; i < 3; i++){ const a = Math.PI/2+i*TAU/3;
    disc(lx-60*m+Math.cos(a)*85, y+Math.sin(a)*85, 40, P.red);
    sq(rx+60*m+Math.cos(a+Math.PI)*85, y+Math.sin(a+Math.PI)*85, 72, P.red); }
  gl(u,'v',540,2.4,9.4,640,1160);
  const kt = K(u,13.2,.55); if (kt > 0) tri(540, fall(y,kt), 84, P.red);
  read('redondas y cuadradas', 330, u, 1.5, 9.8, 58);
  word('DISJUNTOS', 1440, u, 4.0, 10.0);
  read('no comparten ningún elemento', 1590, u, 5.2, 10.0, 54);
  read('si comparten algo, se cruzan', 1440, u, 13.8, 17.4, 56);
  caps('LO VEREMOS EN LA PRÓXIMA PARTE', 540, 1540, u, 14.2, 17.5);
  const kx = ei(K(u,d-1.15,1.15)); if (kx > 0) disc(540,y,kx*2300,P.blue);
}
ev(10,1.05,'clack',{pan:-.5}); ev(10,1.1,'clack',{pan:.5}); ev(10,1.1,'thud',{f:75}); ev(10,1.5,'rise'); ev(10,2.4,'grid',{d:.5});
ev(10,4.0,'rise'); ev(10,4.0,'chord'); ev(10,5.2,'rise'); ev(10,9.4,'grid',{d:.4}); ev(10,11,'whoosh',{d:1.4}); ev(10,12.5,'thud',{f:65});
ev(10,13.7,'drop',{n:4}); ev(10,13.8,'rise'); ev(10,14.2,'rise'); ev(10,17.6,'whoosh',{d:1.1});

// ================= 11 · todos los subconjuntos: el conjunto de partes =================
const PT = { x:540, y:470, r:200 };
const LA = [ [0,540,800,5.0], [1,270,1010,7.4], [2,540,1010,8.0], [4,810,1010,8.6], [3,270,1220,10.8], [5,540,1220,11.25], [6,810,1220,11.7], [7,540,1430,13.4] ];
const CNT = [ ['1',800,5.5], ['3',1010,9.2], ['3',1220,12.3], ['1',1430,13.9] ];
const COLX = [165,415,665,915], ROWY = [1000,1230], STG = [21.4, 24.6, 27.8];
function s11(u,d){
  cam();
  const kf = ei(K(u,d-.8,.8))*1500;
  sweep(PT.x,PT.y+kf,PT.r,K(u,.9,.9),P.tint);
  const k0 = eio(K(u,0,1.1)), sx = PT.x+44, sy = PT.y-30, sw = lerp(W*1.3,54,k0), sh = lerp(H*1.3,54,k0);
  const kd = K(u,1.9,.5), kt = K(u,2.3,.5);
  if (kd > 0) disc(PT.x-44, fall(PT.y-30,kd)+kf, 30, P.red);
  if (kt > 0) tri(PT.x, fall(PT.y+46,kt)+kf, 66, P.yel);
  rect(lerp(W/2,sx,k0)-sw/2, lerp(H/2,sy,k0)-sh/2+kf, sw, sh, P.blue);
  rise('T', 800, 320+kf, { size:104, weight:800, align:'center' }, vis(u,2.6), NC);
  // primera cuenta: por tamaños, sobre la retícula
  [270,540,810].forEach((x,i) => gl(u,'v',x,3.0+i*.2,14.6+i*.1,700,1540)); [800,1010,1220,1430].forEach((y,i) => gl(u,'h',y,3.6+i*.15,14.9+i*.1,160,920));
  const outA = ei(K(u,19.8,.5));
  LA.forEach(([bits,x,y,a]) => { const k = back(K(u,a,.45),1.6)*(1-outA); if (k <= 0) return;
    disc(x,y,88*k,P.tint); if (k > .6) elems(bits,x,y,.62*k); });
  CNT.forEach(([s,y,a]) => rise(s, 96, y+30, { size:84, weight:800, align:'center' }, vis(u,a,19.4), NC));
  formula([[15.6, '1', '+', '3', '+', '3', '+', '1'], [16.9, '=', '8']], W/2, 1720, 104, u, 19.4);
  // segunda cuenta: cada forma entra o no entra, y las combinaciones se duplican
  for (let b = 0; b < 8; b++){
    const st = b < 2 ? 0 : b < 4 ? 1 : 2, a = STG[st]+(st === 0 ? b*.5 : 0), k = K(u,a,.7); if (k <= 0) continue;
    const from = st === 0 ? b : st === 1 ? b-2 : b-4, e = eio(k);
    const x = lerp(COLX[from>>1],COLX[b>>1],st ? e : 1), y = ROWY[b&1]+kf;
    const pop = st === 0 ? back(k,1.6) : 1;
    disc(x,y,88*pop,P.tint); elems(st && e < .55 ? from : b, x, y, .62*pop);
  }
  [[1,21.0,24.2],[2,24.4,27.4],[4,27.6,30.8]].forEach(([bit,a,b]) => { const k = vis(u,a,b); if (k <= 0) return;
    g.save(); g.beginPath(); g.rect(0,790,W,70); g.clip(); g.translate(0,(1-k)*80); elems(bit,300,830,.55); g.restore();
    rise('ENTRA O NO ENTRA', 350, 842, { size:32, weight:700, track:5 }, k, 'entra o no '+bit); });
  [['2',22.4,25.2],['4',25.4,28.4],['8',28.6,30.8]].forEach(([s,a,b]) => rise(s, W/2, 1580, { size:250, weight:800, align:'center', track:-6 }, vis(u,a,b), s === '8' ? 'ocho' : NC));
  formula([[31.2, '2', '·', '2', '·', '2'], [32.9, '=', '8']], W/2, 1750, 124, u, d-1.1);
  rise('P(T)', W/2, 1480, { size:170, weight:800, align:'center', track:-4 }, vis(u,34.4,d-1.1));
  read('el conjunto de partes de T', 1580, u, 35.4, d-1.1, 48);
}
ev(11,0,'whoosh',{d:1.1}); ev(11,.9,'sweep',{d:.9}); ev(11,2.35,'drop',{n:0}); ev(11,2.75,'drop',{n:2}); ev(11,2.6,'rise');
[0,1,2,3,4,5,6].forEach(i => ev(11,3.0+i*.18,'grid',{d:.45,pan:-.6+i*.2}));
LA.forEach(([b,x,y,a],i) => { ev(11,a+.3,'drop',{n:i,pan:(x-540)/540}); ev(11,a+.3,'pop',{pan:(x-540)/540}); });
CNT.forEach(([s,y,a]) => ev(11,a,'rise')); ev(11,14.6,'grid',{d:.5}); ev(11,15.6,'rise'); ev(11,16.2,'mute',{d:.7}); ev(11,16.9,'chord',{big:true}); ev(11,16.9,'rise');
ev(11,19.8,'whoosh',{d:.6}); ev(11,21.6,'drop',{n:0}); ev(11,22.1,'drop',{n:1}); ev(11,22.4,'rise');
ev(11,24.6,'whoosh',{d:.7}); ev(11,25.3,'clack'); ev(11,25.3,'drop',{n:3}); ev(11,25.4,'rise');
ev(11,27.8,'whoosh',{d:.7}); ev(11,28.5,'clack'); ev(11,28.5,'drop',{n:5}); ev(11,28.6,'chord'); ev(11,28.6,'rise');
ev(11,31.2,'rise'); ev(11,32.0,'mute',{d:.9}); ev(11,32.9,'chord',{big:true}); ev(11,32.9,'rise'); ev(11,34.4,'rise'); ev(11,35.4,'rise'); ev(11,39.2,'whoosh',{d:.8});

// ================= 12 · repaso y cierre =================
const RV = [ [480,.6,'vacío · unitario','finito · infinito'], [860,2.6,'subconjunto','iguales · disjuntos'], [1240,4.6,'conjunto de partes','2 · 2 · 2 = 8'] ];
function s12(u,d){
  cam();
  const kg = K(u,9.6,2.8), out = ei(K(u,9.0,.5));
  RV.forEach(([y,a,l1,l2],i) => {
    const k = back(K(u,a,.5),1.5)*(i ? 1-out : 1); if (k <= 0) return;
    if (i === 0){ const e = eio(kg); disc(lerp(250,540,e), lerp(y,960,e), 110*k+ei(kg)*1700, P.tint); if (out < 1) disc(250,y,32*k*(1-out),P.red); }
    if (i === 1){ disc(250,y,110*k,P.tint); disc(270,y+22,56*k,P.yel); }
    if (i === 2) [[-54,-54],[54,-54],[-54,54],[54,54]].forEach(([ox,oy],j) => { disc(250+ox*k,y+oy*k,46*k,P.tint); elems([1,2,4,7][j],250+ox*k,y+oy*k,.32*k); });
    rise(l1, 420, y-6, { size:fitSize(l1,58,800,560), weight:800, track:-1 }, vis(u,a+.3,8.8));
    rise(l2, 420, y+62, { size:fitSize(l2,46,500,560), weight:500 }, vis(u,a+.7,8.8));
  });
  caps('SIGUE · OPERACIONES ENTRE CONJUNTOS', 540, 975, u, 9.7, 1e9, { size:fitSize('SIGUE · OPERACIONES ENTRE CONJUNTOS',32,700,880,4), track:4 });
}
RV.forEach(([y,a],i) => { ev(12,a+.3,'thud',{f:80-i*8}); ev(12,a+.3,'drop',{n:i*2}); ev(12,a+.3,'rise'); ev(12,a+.7,'rise'); });
ev(12,6.0,'chord'); ev(12,9.0,'whoosh',{d:.6}); ev(12,9.6,'sweep',{d:2.6}); ev(12,9.7,'rise'); ev(12,11.4,'chord',{big:true});

// ---------------- narración (para la locución futura; sale como .srt, no se dibuja) ----------------
const NARR = [
  [1,.4,'Busquemos los días de la semana que empiezan por la letra zeta. Revisemos uno por uno.'],
  [1,10.4,'Ninguno cumple. El conjunto existe, pero no tiene elementos: es el conjunto vacío. Se escribe con llaves sin nada adentro, o con un círculo cruzado por una raya.'],
  [2,.6,'Una trampa común: llaves con el símbolo de vacío adentro no es el vacío. Es una caja que guarda una caja vacía: tiene un elemento.'],
  [3,.4,'Un conjunto unitario tiene un solo elemento. Por ejemplo, las capitales de Colombia: solo hay una.'],
  [3,8.0,'Ojo: el elemento es Bogotá, y el conjunto es Bogotá entre llaves. No son lo mismo, como un lápiz no es un estuche con un lápiz.'],
  [4,.6,'Si los elementos se terminan de contar, el conjunto es finito. Los días de la semana se cuentan y se acaban.'],
  [5,.4,'Pero hay conjuntos que nunca se acaban. En un segmento, entre dos puntos siempre cabe otro, y entre esos, otro más, sin fin.'],
  [5,11.0,'Tantos puntos, tan juntos, que forman la línea entera. Ese conjunto es infinito.'],
  [6,.6,'Cuando hablamos de un tema, todos los objetos de ese tema forman el conjunto universal, que se llama U.'],
  [6,6.0,'Si el tema son las letras, las vocales quedan en su círculo y las consonantes afuera de él, pero dentro de U. El universal depende de lo que estemos estudiando.'],
  [7,.6,'Ahora comparemos dos conjuntos. Cada vocal es también una letra: todas las vocales están dentro de las letras.'],
  [7,6.4,'V es subconjunto de L cuando todo elemento de V es también elemento de L. El círculo de V queda completamente adentro.'],
  [8,.6,'Basta un solo elemento afuera para que no sea subconjunto. El conjunto ese, a no es subconjunto de las letras de sol, porque la a no está.'],
  [8,11.4,'Dos detalles: el vacío es subconjunto de cualquier conjunto, porque no tiene nada que pueda quedar afuera.'],
  [8,18.8,'Y todo conjunto es subconjunto de sí mismo.'],
  [9,.6,'Amor y roma son palabras distintas, pero miremos el conjunto de sus letras.'],
  [9,7.6,'Tienen exactamente las mismas letras, en otro orden. Como el orden no importa, son el mismo conjunto: A es igual a B.'],
  [10,.6,'Dos conjuntos son disjuntos cuando no tienen ningún elemento en común. Formas redondas y formas cuadradas, por ejemplo: los círculos no se tocan.'],
  [10,10.6,'Si compartieran algo, se cruzarían, y lo común quedaría donde se cruzan. Eso lo estudiaremos en la próxima parte.'],
  [11,.8,'El conjunto T tiene tres formas. Contemos todos sus subconjuntos, ordenados por tamaño para no olvidar ninguno.'],
  [11,4.8,'Sin ninguna forma: el vacío. Con una sola: tres opciones. Con dos: otras tres. Y con las tres a la vez: una. En total, ocho.'],
  [11,20.4,'Otra forma de verlo: cada forma entra o no entra. Con la primera hay dos opciones, y cada forma nueva las duplica: dos, cuatro, ocho.'],
  [11,34.0,'La colección de todos los subconjuntos se llama conjunto de partes, pe de T. Siempre incluye al vacío y al conjunto completo.'],
  [12,.4,'Los conjuntos tienen tipos según cuántos elementos tienen, y se relacionan entre sí: uno dentro de otro, iguales o separados.'],
];
NARR.forEach(([sc,u,text],i) => { const t = SC[sc].t0+u, nx = NARR[i+1], end = nx ? SC[nx[0]].t0+nx[1]-.2 : FULL-.5;
  EV.push({ t:+t.toFixed(3), type:'narr', d:+Math.min(end-t, text.length/13+1.2).toFixed(2), text }); });

// ---------------- la película ----------------
const DRAW = [s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12];
function frame(t){
  g.setTransform(1,0,0,1,0,0); rect(0,0,W,H,P.paper);
  let i = SC.findIndex(s => t < s.t0+s.d); if (i < 0) i = SC.length-1;
  DRAW[i](Math.max(0,t-SC[i].t0), SC[i].d);
  g.setTransform(1,0,0,1,0,0);
}
function render(t){ frame(t); finish(); }
function texts(t){ REC = []; frame(t); const r = REC; REC = null; return r; }
EV.sort((a,b) => a.t-b.t);
return { FULL, SC, EV, render, texts };
}
