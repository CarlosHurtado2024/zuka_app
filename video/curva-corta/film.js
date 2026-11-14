// «La curva más corta» — 3D Map Explainer (clip de curiosidades de Zuka). 1080×1920, 24 fps.
// Un solo mundo: la misma imagen y el mismo relieve son el mapa plano (Mercator centrado en el Pacífico) y el globo; uM los
// enrolla (plano → cilindro → esfera). render(t): cámara por claves → globo, corte, placas → post → capa 2D (rutas que brillan,
// rótulos, medidas, subtítulos). EV alimenta mix.py; TEXTS alimenta readcheck.
import * as THREE from 'three';
import { makePost } from '/core/three/post.js';
import { clamp, seg, eo, eio, lerp, hash, track } from '/core/lib.js';
import { DUR, BEAT, q, T, NARR, LABELS, NYC, TYO, LON0, NORTH, TH, gcPoint, rhumbPoint, SLAB_GC, SLAB_RH, SLAB_DT } from './data.js';

const W = 1080, H = 1920, PI = Math.PI;
const SS = +(new URLSearchParams(location.search).get('ss') || 2);
const AMB = '#FFA63D', AMBC = '#FFD08A', TEAL = '#2FA3B0', TEALL = '#8FD6DE', WARM = '#F6EEE0', SEAT = '#BCDBE6', LANDT = '#F4E6CF';
await Promise.all(['500 40px Barlow', '600 40px Barlow', '400 24px Barlow'].map(f => document.fonts.load(f)));
await document.fonts.ready;

const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(SS); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#05080d');
const camera = new THREE.PerspectiveCamera(40, W / H, .005, 200);
const post = makePost(renderer, scene, camera, W, H, { ssaa: SS });
post.bloom.strength = .45; post.bloom.radius = .4; post.bloom.threshold = 1.35;
post.vig.uniforms.amt.value = .32; post.vig.uniforms.warm.value = .18; post.vig.uniforms.contrast.value = .12;

// ———————————————— geometría compartida (shader y capa 2D usan la misma fórmula) ————————————————
const rad = d => d * PI / 180, L0 = rad(LON0), EXAG = 20 / 6371 * 6.4;   // altura 0–1 del mapa → 0–6.4 km × 20
const wrapPi = a => ((a + 3 * PI) % (2 * PI)) - PI;
function morphPos(lat, lon, m, alt = 0) {
  const la = rad(lat), dl = wrapPi(rad(lon) - L0), m1 = clamp(m * 2), m2 = clamp(m * 2 - 1), k = Math.max(m1, 1e-4);
  const my = Math.log(Math.tan(PI / 4 + clamp(la, -1.48, 1.48) / 2));
  const cyl = [Math.sin(dl * k) / k, my, 1 - (1 - Math.cos(dl * k)) / k];
  const s = [Math.cos(la) * Math.sin(dl), Math.sin(la), Math.cos(la) * Math.cos(dl)];
  const nc = [Math.sin(dl * k), 0, Math.cos(dl * k)];
  const p = cyl.map((v, i) => lerp(v, s[i], m2)), n = new THREE.Vector3(...nc.map((v, i) => lerp(v, s[i], m2))).normalize();
  return { p: new THREE.Vector3(...p).addScaledVector(n, alt), n, s: new THREE.Vector3(...s) };
}
const sph = (lat, lon, r = 1) => morphPos(lat, lon, 1).s.multiplyScalar(r);

// ———————————————— el globo / mapa ————————————————
const TL = new THREE.TextureLoader();
const [albedo, height] = await Promise.all([TL.loadAsync('assets/albedo.jpg'), TL.loadAsync('assets/height.png')]);
albedo.colorSpace = THREE.SRGBColorSpace; albedo.anisotropy = 16; albedo.wrapS = THREE.RepeatWrapping;
height.wrapS = THREE.RepeatWrapping;
const NX = 1024, NY = 512, LATMAX = 89.95;
const ll = new Float32Array((NX + 1) * (NY + 1) * 2), idx = [];
for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) { const o = (j * (NX + 1) + i) * 2; ll[o] = -LATMAX + 2 * LATMAX * j / NY; ll[o + 1] = -180 + 360 * i / NX; }
for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1; idx.push(a, b, d, a, d, c); }
const gg = new THREE.BufferGeometry();
gg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((NX + 1) * (NY + 1) * 3), 3));
gg.setAttribute('ll', new THREE.BufferAttribute(ll, 2)); gg.setIndex(idx);
const U = { uM: { value: 0 }, uLon0: { value: L0 }, uExag: { value: EXAG }, uA: { value: albedo }, uH: { value: height },
  uSun: { value: new THREE.Vector3(0, 0, 1) }, uCut: { value: 0 }, uCutS: { value: 2 }, uCutN: { value: new THREE.Vector3(1, 0, 0) } };
const globe = new THREE.Mesh(gg, new THREE.ShaderMaterial({
  uniforms: U, side: THREE.DoubleSide,
  vertexShader: `
    uniform float uM, uLon0, uExag; uniform sampler2D uH; attribute vec2 ll;
    varying vec2 vUv; varying vec3 vN; varying vec3 vS;
    void main(){
      float la = radians(ll.x), dl = radians(ll.y), m1 = clamp(uM * 2., 0., 1.), m2 = clamp(uM * 2. - 1., 0., 1.), k = max(m1, 1e-4);
      float my = log(tan(3.14159265 / 4. + clamp(la, -1.48, 1.48) / 2.));
      vec3 cyl = vec3(sin(dl * k) / k, my, 1. - (1. - cos(dl * k)) / k);
      vec3 s = vec3(cos(la) * sin(dl), sin(la), cos(la) * cos(dl));
      vec3 n = normalize(mix(vec3(sin(dl * k), 0., cos(dl * k)), s, m2));
      vUv = vec2((ll.y + degrees(uLon0) + 180.) / 360., (ll.x + 90.) / 180.);
      float h = texture2D(uH, vec2(fract(vUv.x), vUv.y)).r;
      vec3 p = mix(cyl, s, m2) + n * h * uExag;
      vN = n; vS = s;
      gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
    }`,
  fragmentShader: `
    uniform sampler2D uA; uniform vec3 uSun, uCutN; uniform float uM, uCut, uCutS;
    varying vec2 vUv; varying vec3 vN; varying vec3 vS;
    void main(){
      if (uCut > .5 && dot(vS, uCutN) > uCutS) discard;
      vec2 uv = vec2(fract(vUv.x), vUv.y);
      vec3 a = textureGrad(uA, uv, dFdx(vUv), dFdy(vUv)).rgb;
      float d = dot(normalize(vN), uSun);
      float lit = mix(1., smoothstep(-.18, .45, d) * .92 + .08, smoothstep(.5, 1., uM));
      gl_FragColor = vec4(min(a * (.18 + 1.02 * lit), vec3(.92)), 1.);
    }`,
}));
globe.frustumCulled = false; scene.add(globe);

// atmósfera (solo en el globo) y estrellas
const atm = new THREE.Mesh(new THREE.SphereGeometry(1.035, 96, 48), new THREE.ShaderMaterial({
  uniforms: { uA: { value: 0 } }, transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
  vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float uA; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(clamp(1. - abs(dot(vN, vV)), 0., 1.), 5.); gl_FragColor = vec4(vec3(.45, .68, 1.) * f * .75 * uA, 1.); }`,
}));
scene.add(atm);
{
  const n = 2200, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = hash(i * 1.7) * 2 - 1, a = hash(i * 3.1) * 2 * PI, r = Math.sqrt(1 - u * u); p.set([r * Math.cos(a) * 80, u * 80, r * Math.sin(a) * 80], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#c9d6e8', size: 1.6, sizeAttenuation: false, transparent: true, opacity: .55 })));
}

// el corte: plano por el centro, Nueva York y Tokio; el lado de la cámara se va y queda la sección (corteza, manto, núcleo)
const vNY = sph(NYC.lat, NYC.lon), vTY = sph(TYO.lat, TYO.lon);
const GCN = new THREE.Vector3().crossVectors(vNY, vTY).normalize();
const MIDV = vNY.clone().add(vTY).normalize();
const disc = new THREE.Mesh(new THREE.CircleGeometry(.998, 160), new THREE.ShaderMaterial({
  uniforms: { uA: { value: 0 } }, transparent: true, side: THREE.DoubleSide, depthWrite: true,
  vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `uniform float uA; varying vec2 vP; void main(){ float r = length(vP);
    vec3 c = r < .192 ? mix(vec3(1., .82, .45), vec3(.95, .62, .25), r / .192) : r < .546 ? mix(vec3(.78, .38, .12), vec3(.55, .22, .08), (r - .192) / .354)
      : r < .985 ? mix(vec3(.42, .16, .07), vec3(.30, .12, .07), (r - .546) / .44) : vec3(.36, .27, .20);
    float ring = smoothstep(.004, 0., abs(r - .546)) * .35 + smoothstep(.004, 0., abs(r - .192)) * .35;
    gl_FragColor = vec4(c * (.9 + ring), uA); }`,
}));
disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), GCN); disc.position.addScaledVector(GCN, -.0015); disc.visible = false; scene.add(disc);

// placas: 1 placa = 1 000 km, en el Pacífico, una columna junto a la otra
const P0 = { lat: 30, lon: -168 };
const pUp = sph(P0.lat, P0.lon), pEast = new THREE.Vector3(0, 1, 0).cross(pUp).normalize(), pNorth = pUp.clone().cross(pEast).normalize();
const ST = .0072, SW = .03;
const SLABS = [];
for (const [kind, n, off] of [['gc', SLAB_GC, -.03], ['rh', SLAB_RH, .03]]) {
  for (let k = 0; k < Math.ceil(n); k++) SLABS.push({ kind, k, frac: Math.min(1, n - k), off, land: T.slabs[0] + k * SLAB_DT + (kind === 'rh' ? SLAB_DT * .5 : 0) });
}
const slabGeo = new THREE.BoxGeometry(SW, ST, SW);
const slabMesh = {};
for (const kind of ['gc', 'rh']) {
  const col = new THREE.Color(kind === 'gc' ? AMB : TEAL).multiplyScalar(kind === 'gc' ? 1.25 : 1.35);
  const m = new THREE.InstancedMesh(slabGeo, new THREE.MeshBasicMaterial({ color: col, toneMapped: false }), SLABS.filter(s => s.kind === kind).length);
  m.frustumCulled = false; scene.add(m); slabMesh[kind] = m;
  SLABS.filter(s => s.kind === kind).forEach((s, i) => { s.i = i; const v = s.k % 2 ? .82 : 1; m.setColorAt(i, new THREE.Color(v, v, v)); });
  m.instanceColor.needsUpdate = true;
}
const BASIS = new THREE.Matrix4().makeBasis(pEast, pUp, pNorth);
const slabTop = (kind, t) => { let h = 0; for (const s of SLABS) if (s.kind === kind && s.land <= t) h = (s.k + s.frac) * ST; return h; };
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromRotationMatrix(BASIS), V = new THREE.Vector3(), SC = new THREE.Vector3();
const slabBase = pUp.clone().multiplyScalar(1.0005);

// ———————————————— cámara ————————————————
// claves [pos x y z, mira x y z, arriba x y z]; las del vuelo se sacan de la ruta
const look = (pos, tgt, up) => [...pos.toArray(), ...tgt.toArray(), ...up.toArray()];
const mapP = (lat, lon) => morphPos(lat, lon, 0).p;
const Y = new THREE.Vector3(0, 1, 0);
const camMap = (cx, cy, d, tilt = 0) => look(new THREE.Vector3(cx, cy - tilt, 1 + d), new THREE.Vector3(cx, cy, 1), Y);
const globeView = (lat, lon, r, tlat = lat, tlon = lon, tr = 0) => look(sph(lat, lon, r), sph(tlat, tlon, tr), Y);
const cutPos = GCN.clone().multiplyScalar(Math.sign(GCN.dot(sph(50, -150))) || 1);
const CUTN = cutPos.clone().normalize();
const KEYS = [
  [0, camMap(.36, .55, 7.6, .3)],
  [7.5, camMap(.34, .62, 7.2, .5)],
  [17.0, camMap(.32, .7, 6.9, .7)],
  [23.0, globeView(50, -150, 4.7, 46, -150, .2)],
  [27.6, globeView(52, -154, 4.6, 47, -152, .2)],
  [31.0, look(CUTN.clone().multiplyScalar(5.9), new THREE.Vector3(0, 0, 0).addScaledVector(MIDV, .25), MIDV)],
  [45.6, look(CUTN.clone().multiplyScalar(5.7).addScaledVector(MIDV, .1), new THREE.Vector3(0, 0, 0).addScaledVector(MIDV, .27), MIDV)],
];
// vuelo sobre Alaska: el avión va de f = 0.30 a 0.60 entre 48.4 y 57.4 s
const FLY = [48.4, 57.4], FF = [.30, .60];
const planeF = t => lerp(FF[0], FF[1], seg(t, FLY[0], FLY[1]));
for (let t = FLY[0]; t <= FLY[1] + .01; t += .6) {
  const f = planeF(t), a = gcPoint(NYC, TYO, f - .07), b = gcPoint(NYC, TYO, f + .045);
  const pa = sph(a.lat - 2.2, a.lon, 1.16), pb = sph(b.lat, b.lon, 1.0);
  KEYS.push([+t.toFixed(2), look(pa, pb, pa.clone().normalize())]);
}
// las placas, de lado y de frente
const slabCam = (back, lift) => look(slabBase.clone().addScaledVector(pNorth, -back).addScaledVector(pUp, lift), slabBase.clone().addScaledVector(pUp, .03).addScaledVector(pNorth, .05), pUp);
KEYS.push([59.0, slabCam(.5, .34)], [64.0, slabCam(.42, .28)], [69.4, slabCam(.41, .27)]);
const endView = (lat, lon, r) => { const c = sph(lat, lon, r); return look(c, new THREE.Vector3(0, 0, 0).addScaledVector(Y, .78), Y); };
KEYS.push([74.0, endView(30, -158, 4.9)], [DUR, endView(28, -150, 5.2)]);
const CAM = track(KEYS);
const fwd = new THREE.Vector3();
function setCamera(t) {
  const c = CAM(t);
  camera.position.set(c[0], c[1], c[2]); camera.up.set(c[6], c[7], c[8]).normalize(); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld();
  camera.getWorldDirection(fwd);
  const dist = camera.position.distanceTo(new THREE.Vector3(c[3], c[4], c[5]));
  post.dof.focus = dist; post.dof.aper = 2.2; post.dof.maxCoc = 6;
  // el sol sigue a la cámara: arriba a la izquierda y un poco de frente
  const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
  U.uSun.value.copy(right.multiplyScalar(-.55).addScaledVector(camera.up, .45).addScaledVector(fwd, -.7)).normalize();
}
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };

// ———————————————— estado por tiempo ————————————————
const M = t => eio(seg(t, T.morph[0], T.morph[1]));
const CUT = t => Math.min(eo(seg(t, T.cut[0], T.cut[1])), 1 - eio(seg(t, T.uncut[0], T.uncut[1])));
function update(t) {
  const m = M(t); U.uM.value = m; atm.material.uniforms.uA.value = seg(m, .7, 1);
  const c = CUT(t);
  U.uCut.value = c > 0 ? 1 : 0; U.uCutS.value = lerp(1.1, 0, c); U.uCutN.value.copy(CUTN);
  disc.visible = c > .01; disc.material.uniforms.uA.value = seg(c, .3, 1);
  for (const s of SLABS) {
    const u = seg(t, s.land - .18, s.land), on = t >= s.land - .18 && t < T.routes + 3;
    const y = (s.k + s.frac / 2) * ST + .012 * (1 - eo(u));
    V.copy(slabBase).addScaledVector(pEast, s.off).addScaledVector(pUp, y);
    if (on) SC.set(1, s.frac * .86, 1); else SC.set(0, 0, 0);
    M4.compose(V, Q, SC); slabMesh[s.kind].setMatrixAt(s.i, M4);
  }
  for (const k in slabMesh) slabMesh[k].instanceMatrix.needsUpdate = true;
}

// ———————————————— capa 2D ————————————————
const ov = document.getElementById('ov'), g = ov.getContext('2d');
const XL = 160, XR = 920;
let TXT = [];
const F = (w, s) => `${w} ${s}px Barlow`;
function text(id, s, x, y, font, color, a = 1, align = 'left', o = {}) {
  if (a <= .01) return 0;
  g.save(); g.globalAlpha = a; g.font = font; g.fillStyle = color; g.textAlign = align;
  if (o.track) g.letterSpacing = o.track + 'px';
  g.fillText(s, x, y); const w = g.measureText(s).width; g.restore();
  const sz = parseFloat(font.split(' ')[1]), x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  if (!o.noReport && a > .5) TXT.push({ id, text: o.report ?? s, x0, y0: y - sz, x1: x0 + w, y1: y + sz * .25, ...(o.pass ? { pass: true } : {}) });
  return w;
}
const width = (s, font, tr = 0) => { g.save(); g.font = font; if (tr) g.letterSpacing = tr + 'px'; const w = g.measureText(s).width; g.restore(); return w; };
function line(pts, a, color, w = 2, dash) { if (a <= .01 || pts.length < 2) return; g.save(); g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = w; if (dash) g.setLineDash(dash); g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
function dot(x, y, a, color, r = 5) { if (a <= .01) return; g.save(); g.globalAlpha = a; g.fillStyle = color; g.beginPath(); g.arc(x, y, r, 0, 2 * PI); g.fill(); g.restore(); }
function glowLine(pts, a, color, core, w = 3) {
  if (a <= .01) return;
  for (const seg_ of pts) {
    if (seg_.length < 2) continue;
    g.save(); g.globalCompositeOperation = 'lighter';
    line(seg_, a * .35, color, w * 4.5); line(seg_, a * .55, color, w * 2.2); line(seg_, a, core, w);
    g.restore();
  }
}
// muestras de una ruta proyectadas, partidas donde la ruta queda detrás del globo o fuera del corte
const camPos = () => camera.position;
function routePts(fn, f1, m, alt = .006, n = 160) {
  const out = []; let cur = [];
  const cut = CUT(tNow) > .01;
  for (let i = 0; i <= n; i++) {
    const f = f1 * i / n, p = fn(f), mp = morphPos(p.lat, p.lon, m, alt);
    let vis = mp.n.dot(V.copy(camPos()).sub(mp.p)) > 0;
    if (cut && mp.s.dot(CUTN) > U.uCutS.value + .002) vis = false;
    if (cut && U.uCutS.value < .17 && Math.abs(mp.s.dot(CUTN)) < .01) vis = true;   // sobre el borde del corte
    const [x, y, z] = proj(mp.p);
    if (vis && z < 1) cur.push([x, y]); else if (cur.length) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}
const at = (lat, lon, m, alt = .006) => { const mp = morphPos(lat, lon, m, alt); const vis = mp.n.dot(V.copy(camPos()).sub(mp.p)) > 0; const [x, y] = proj(mp.p); return { x, y, vis }; };
const env = (t, a, b, fi = .4, fo = .4) => Math.min(seg(t, a, a + fi), 1 - seg(t, b - fo, b));
const GC = f => gcPoint(NYC, TYO, f), RH = f => rhumbPoint(NYC, TYO, f);
function plane(x, y, ang, a, s = 1) {
  if (a <= .01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang); g.scale(s, s); g.fillStyle = WARM;
  g.beginPath(); g.moveTo(16, 0); g.lineTo(4, -3); g.lineTo(-2, -15); g.lineTo(-6, -15); g.lineTo(-3, -3); g.lineTo(-11, -2.5); g.lineTo(-14, -8); g.lineTo(-16, -8);
  g.lineTo(-14, 0); g.lineTo(-16, 8); g.lineTo(-14, 8); g.lineTo(-11, 2.5); g.lineTo(-3, 3); g.lineTo(-6, 15); g.lineTo(-2, 15); g.lineTo(4, 3); g.closePath(); g.fill(); g.restore();
}
function pin(id, p, name, a, side = 1, t0 = 0, t = 0) {
  if (a <= .01 || !p.vis || p.y < 200 || p.y > 1440 || p.x < 0 || p.x > W) return;
  const ring = seg(t, t0, t0 + 1.2);
  if (ring > 0 && ring < 1) { g.save(); g.globalAlpha = a * (1 - ring); g.strokeStyle = AMBC; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, 8 + 40 * eo(ring), 0, 2 * PI); g.stroke(); g.restore(); }
  g.save(); g.globalCompositeOperation = 'lighter'; dot(p.x, p.y, a * .5, AMB, 12); g.restore(); dot(p.x, p.y, a, WARM, 5.5);
  const f = F(600, 30), w = width(name, f, 4);
  let x = side > 0 ? p.x + 18 : p.x - 18 - w; x = clamp(x, XL, XR - w);
  text(id, name, x, p.y - 16, f, WARM, a, 'left', { track: 4 });
}
function mapLabel(id, s, lat, lon, m, color, size, a) {
  const p = at(lat, lon, m, .01); if (!p.vis || a <= .01) return;
  const f = F(500, size), w = width(s, f, size * .3);
  if (p.x - w / 2 < XL || p.x + w / 2 > XR || p.y < 220 || p.y > 1420) return;
  text(id, s, p.x, p.y, f, color, a * .9, 'center', { track: size * .3, pass: true });
}

const FS = F(500, 42), SUB_Y = 1570;
function subtitles(t) {
  for (const c of NARR) {
    const a = seg(t, c.t0 - .08, c.t0 + .14) * (1 - seg(t, c.t1 - .16, c.t1));
    if (a <= .01) continue;
    const w = width(c.text, FS);
    g.save(); g.globalAlpha = a * .85; const gr = g.createLinearGradient(XL - 40, 0, XL + w + 140, 0);
    gr.addColorStop(0, 'rgba(5,10,16,.86)'); gr.addColorStop(.8, 'rgba(5,10,16,.7)'); gr.addColorStop(1, 'rgba(5,10,16,0)');
    g.fillStyle = gr; g.fillRect(XL - 40, SUB_Y - 56, w + 180, 80); g.restore();
    line([[XL - 16, SUB_Y - 42], [XL - 16, SUB_Y + 10]], a, AMB, 3);
    text('sub', c.text, XL, SUB_Y, FS, WARM, a, 'left', { noReport: true });
  }
}
window.SUBCHECK = { cues: NARR.map(c => ({ id: c.id, text: c.text, w: Math.round(width(c.text, FS)) })), safe: XR - XL };
window.SUBCHECK.ok = window.SUBCHECK.cues.every(c => c.w <= window.SUBCHECK.safe);

function reading(id, x, y, big, name, sub, color, a, align = 'left') {
  if (a <= .01) return; const r = 16 * (1 - eo(a));
  text(id + 'n', name, x, y + r, F(600, 26), color === AMB ? AMBC : TEALL, a, align, { track: 3 });
  text(id + 'v', big, x, y + 78 + r, F(600, 84), color, a, align);
  if (sub) text(id + 's', sub, x, y + 118 + r, F(400, 26), SEAT, a, align);
}

let tNow = 0;
function overlay(t) {
  g.clearRect(0, 0, W, H); TXT = [];
  const m = M(t), c = CUT(t);
  const mapA = 1 - seg(t, T.cut[0] - .6, T.cut[0]);           // rótulos del mapa: se van al cortar
  // nombres del mapa (pasan; no se cronometran)
  const la = env(t, 1.0, T.morph[0] + .4, 1, .6);
  for (const [s, lat, lon] of [['OCÉANO PACÍFICO', 12, -150], ['OCÉANO ÁRTICO', 79, -165], ['MAR DE BERING', 55.5, -178]]) mapLabel('sea' + s, s, lat, lon, m, SEAT, 26, la);
  for (const [s, lat, lon] of [['ALASKA', 62, -153], ['CANADÁ', 57, -108], ['RUSIA', 64, 145], ['ESTADOS UNIDOS', 38, -98]]) mapLabel('land' + s, s, lat, lon, m, LANDT, 28, la);
  // la recta del mapa (verde azulado) y la ruta del avión (ámbar)
  const rhA = env(t, T.rhDraw[0], T.cut[0] + .2, .2, .5);
  const rhF = eio(seg(t, T.rhDraw[0], T.rhDraw[1]));
  if (rhA > .01 && rhF > 0) glowLine(routePts(RH, rhF, m), rhA, TEAL, TEALL, 3);
  const gcF = eio(seg(t, T.gcDraw[0], T.gcDraw[1]));
  const gcA = env(t, T.gcDraw[0], T.routes + 12, .2, .3) * (1 - .35 * env(t, T.slabs[0] - .5, T.routes, .6, .6));
  if (gcF > 0) glowLine(routePts(GC, gcF, m, t > FLY[0] - 1.5 && t < FLY[1] + 1 ? .022 : .006), gcA, AMB, AMBC, 3.4);
  // el avión: al dibujarse la ruta y en el vuelo bajo
  {
    let f = null, s = 1;
    if (t >= T.gcDraw[0] && t < T.morph[0]) f = gcF;
    if (t >= FLY[0] - .4 && t < FLY[1] + .4) { f = planeF(t); s = 1.5; }
    if (f !== null) {
      const al = s > 1 ? .024 : .008, p = GC(Math.max(.001, f)), q2 = GC(Math.min(1, f + .01)), a1 = at(p.lat, p.lon, m, al), a2 = at(q2.lat, q2.lon, m, al);
      // estela
      const tail = routePts(fx => GC(Math.max(0, f - .06) + fx), Math.min(.06, f), m, al, 24);
      g.save(); g.globalCompositeOperation = 'lighter'; for (const sgm of tail) line(sgm, .55, WARM, 2); g.restore();
      if (a1.vis) plane(a1.x, a1.y, Math.atan2(a2.y - a1.y, a2.x - a1.x), env(t, T.gcDraw[0], 1e9, .3, .3) * (t < FLY[0] - .4 ? 1 - seg(t, T.morph[0] - .5, T.morph[0]) : env(t, FLY[0] - .4, FLY[1] + .4, .3, .3)), s);
    }
  }
  // ciudades
  {
    const a = (1 - c) * (t < T.slabs[0] - .5 || t > T.routes ? 1 : 0);
    pin('pNY', at(NYC.lat, NYC.lon, m), NYC.name, seg(t, T.pinNY, T.pinNY + .4) * a, -1, T.pinNY, t);
    pin('pTY', at(TYO.lat, TYO.lon, m), TYO.name, seg(t, T.pinTY, T.pinTY + .4) * a, 1, T.pinTY, t);
  }
  // título
  {
    const a = env(t, T.title[0], T.title[1], .5, .5), x = XL + 10, y = 330, r = 16 * (1 - eo(a));
    const p = at(TYO.lat, TYO.lon, m);
    if (a > .01) {
      line([[p.x, p.y], [lerp(p.x, x + 40, eo(a)), lerp(p.y, y + 86, eo(a))]], a * .7, WARM, 1.4);
      text('t1', LABELS.title, x, y + r, F(600, 64), WARM, a, 'left', { track: 6 });
      text('t2', LABELS.titleSub, x, y + 58 + r, F(500, 34), AMBC, a);
    }
  }
  // rótulos de las rutas
  {
    const a = env(t, T.rhLabel, T.morph[0] + .2), p = RH(.62), q1 = at(p.lat, p.lon, m);
    if (a > .01 && q1.vis) { const s = LABELS.rh, f = F(600, 28), w = width(s, f, 3), x = clamp(q1.x - w / 2, XL, XR - w); line([[q1.x, q1.y], [q1.x, q1.y + 70 * eo(a)]], a, TEALL, 1.4); text('lrh', s, x, q1.y + 104, f, TEALL, a, 'left', { track: 3 }); }
    const b = env(t, T.gcLabel, T.morph[0] + .2), pg = GC(.5), q2 = at(pg.lat, pg.lon, m);
    if (b > .01 && q2.vis) { const s = LABELS.gc, f = F(600, 28), w = width(s, f, 3), x = clamp(q2.x - w / 2, XL, XR - w); line([[q2.x, q2.y], [q2.x, q2.y - 70 * eo(b)]], b, AMBC, 1.4); text('lgc', s, x, q2.y - 84, f, AMBC, b, 'left', { track: 3 }); }
    // ya en el globo: otra vez los dos nombres
    const d = env(t, 23.6, T.cut[0], .5, .5);
    if (d > .01) {
      const pr = RH(.55), a3 = at(pr.lat, pr.lon, m), pg2 = GC(.5), a4 = at(pg2.lat, pg2.lon, m);
      if (a3.vis) { const s = LABELS.rh, f = F(600, 28), w = width(s, f, 3); text('grh', s, clamp(a3.x - w / 2, XL, XR - w), a3.y + 56, f, TEALL, d, 'left', { track: 3 }); }
      if (a4.vis) { const s = LABELS.gc, f = F(600, 28), w = width(s, f, 3); text('ggc', s, clamp(a4.x - w / 2, XL, XR - w), a4.y - 30, f, AMBC, d, 'left', { track: 3 }); }
    }
  }
  // el corte: centro, radios, ángulo, arco, cuenta y cuerda
  if (c > .01) {
    const k = seg(t, T.cut[1], T.cut[1] + .4) * (1 - seg(t, T.uncut[0] - .5, T.uncut[0]));
    const [cx, cy] = proj(new THREE.Vector3()), [nx, ny] = proj(vNY), [tx, ty] = proj(vTY);
    text('cc', LABELS.cutCap, XL + 10, 250, F(500, 26), SEAT, k, 'left', { track: 4 });
    text('ch', LABELS.cutHead, XL + 10, 312, F(600, 58), WARM, k, 'left', { track: 3 });
    const kc = seg(t, T.center, T.center + .3) * k; dot(cx, cy, kc, WARM, 6);
    const kr = eo(seg(t, T.radii[0], T.radii[1])) * k;
    if (kr > 0) {
      line([[cx, cy], [lerp(cx, nx, kr), lerp(cy, ny, kr)]], k, WARM, 2.4); line([[cx, cy], [lerp(cx, tx, kr), lerp(cy, ty, kr)]], k, WARM, 2.4);
      const kn = seg(t, T.radii[1], T.radii[1] + .3) * k;
      for (const [s, x, y, al] of [[NYC.name, nx, ny, 'left'], [TYO.name, tx, ty, 'right']]) { dot(x, y, kn, WARM, 6); const f = F(600, 28), w = width(s, f, 3); text('cn' + s, s, clamp(x - w / 2, XL, XR - w), y + 48, f, WARM, kn, 'left', { track: 3 }); }
      const mx = (cx + nx) / 2, my = (cy + ny) / 2; text('rr', LABELS.radius, clamp(mx + 48, XL, XR - 200), my + 40, F(600, 32), WARM, seg(t, T.radii[1], T.radii[1] + .3) * k);
    }
    const ka = seg(t, T.angle, T.angle + .5) * k;
    if (ka > .01) {
      const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40 * eo(seg(t, T.angle, T.angle + .7)); const v = vNY.clone().multiplyScalar(Math.sin((1 - f) * TH)).addScaledVector(vTY, Math.sin(f * TH)).divideScalar(Math.sin(TH)).multiplyScalar(.36); pts.push(proj(v).slice(0, 2)); }
      line(pts, ka, AMBC, 2.6);
      const mid = proj(MIDV.clone().multiplyScalar(.43));
      const s = LABELS.angle, f = F(600, 36), w = width(s, f);
      text('ang', s, clamp(mid[0] - w / 2, XL, XR - w), mid[1] - 8, f, AMBC, ka);
    }
    const kd = seg(t, T.arc, T.arc + .5) * k;
    if (kd > .01) {
      const mid = proj(MIDV.clone().multiplyScalar(1.07)); const s = LABELS.arc, f = F(600, 54), w = width(s, f);
      text('arc', s, clamp(mid[0] - w / 2, XL, XR - w), mid[1] - 14, f, AMB, kd);
    }
    const kk = seg(t, T.calc, T.calc + .5) * k;
    text('calc', LABELS.calc, XL + 10, 1270 + 16 * (1 - eo(kk)), F(600, 46), AMBC, kk);
    const kh = seg(t, T.chordT, T.chordT + .5) * k;
    if (kh > .01) {
      line([[nx, ny], [lerp(nx, tx, eo(kh)), lerp(ny, ty, eo(kh))]], kh, WARM, 2.2, [10, 10]);
      text('cho', LABELS.chord, XL + 10, 1340, F(600, 36), WARM, kh, 'left', { track: 2 });
      text('chs', LABELS.chordSub, XL + 10, 1380, F(400, 28), SEAT, kh);
    }
  }
  // vuelo: el punto más al norte y el relieve
  {
    const a = env(t, T.north, FLY[1] + .2), p = at(NORTH.lat, NORTH.lon, 1, .022);
    if (a > .01 && p.vis) {
      dot(p.x, p.y, a, WARM, 6); const s = LABELS.north, f = F(600, 32), w = width(s, f, 2), right = p.x < W / 2, x = right ? clamp(p.x + 80, XL, XR - w) : clamp(p.x - 80 - w, XL, XR - w), y = clamp(p.y - 120, 260, 1300);
      line([[p.x, p.y], [right ? p.x + 60 : p.x - 60, y + 10], [right ? x - 8 : x + w + 8, y + 10]], a, WARM, 1.4); text('nor', s, x, y, f, WARM, a, 'left', { track: 2 });
    }
    text('rel', LABELS.relief, XR, 250, F(500, 24), SEAT, env(t, FLY[0], FLY[1] + .4), 'right', { track: 3 });
  }
  // las placas
  {
    const a = env(t, T.slabs[0] - .2, T.routes, .4, .5);
    text('slab', LABELS.slab, XL + 10, 1290, F(600, 34), WARM, a, 'left', { track: 3 });
    for (const [kind, big, name, col, side] of [['gc', LABELS.gcKm, LABELS.gcName, AMB, -1], ['rh', LABELS.rhKm, LABELS.rhName, TEAL, 1]]) {
      const h = env(t, kind === 'gc' ? T.holdGc : T.hold, T.routes, .4, .5);
      if (h > .01) {
        const top = slabBase.clone().addScaledVector(pEast, kind === 'gc' ? -.03 : .03).addScaledVector(pUp, slabTop(kind, t));
        const [px, py] = proj(top);
        const f = F(600, 84), w = Math.max(width(big, f), width(name, F(600, 26), 3));
        const x = side < 0 ? XL + 10 : XR, y = 400;
        line([[px, py], [px, y + 104]], h * .8, col === AMB ? AMBC : TEALL, 1.4);
        reading('r' + kind, x, y, big, name, null, col, h, side < 0 ? 'left' : 'right');
      }
    }
    const v = env(t, T.verdict, T.routes, .5, .5);
    text('diff', LABELS.diff, XL + 10, 1380 + 16 * (1 - eo(v)), F(600, 52), AMB, v);
  }
  // cierre: el ecuador también es un círculo máximo
  {
    const a = env(t, T.routes, DUR + 1, .8, .1);
    if (a > .01) {
      glowLine(routePts(f => ({ lat: 0, lon: -180 + 360 * f }), 1, 1, .004, 240), a * .7, AMB, AMBC, 2);
      text('eq', LABELS.equator, XL + 10, 1450, F(500, 26), AMBC, a, 'left', { track: 2 });
    }
    const e = seg(t, T.end, T.end + .6), x = XL + 10, y = 330, r = 16 * (1 - eo(e));
    if (e > .01) line([[x, y - 70], [x + 60, y - 70]], e, AMB, 4);
    text('e1', LABELS.endTitle, x, y + r, F(600, 64), WARM, e, 'left', { track: 6 });
    text('e2', LABELS.endSub[0], x, y + 52 + r, F(400, 32), SEAT, e); text('e2b', LABELS.endSub[1], x, y + 90 + r, F(400, 32), SEAT, e);
    text('e3', LABELS.endStyle, x, y + 136, F(500, 22), SEAT, seg(t, T.end + .3, T.end + .9), 'left', { track: 4 });
  }
  // fuentes
  {
    const a = Math.max(env(t, 1.0, 8.2, .5, .5), env(t, T.end, DUR + 1, .5, .1)) * .9;
    text('src0', LABELS.source[0], XR, 132, F(400, 20), SEAT, a, 'right', { pass: true });
    text('src1', LABELS.source[1], XR, 158, F(400, 20), SEAT, a, 'right', { pass: true });
  }
  subtitles(t);
}

window.DUR = DUR;
window.render = t => { tNow = t; update(t); setCamera(t); post.composer.render(); overlay(t); };
window.TEXTS = t => { window.render(t); return TXT; };

const EV = [
  { t: T.pinNY, type: 'chime', n: 0 }, { t: T.pinTY, type: 'chime', n: 2 },
  { t: T.rhDraw[0], type: 'ignite', d: T.rhDraw[1] - T.rhDraw[0], c: 'teal' }, { t: T.gcDraw[0], type: 'ignite', d: T.gcDraw[1] - T.gcDraw[0], c: 'amber' },
  { t: T.morph[0], type: 'whoosh', d: T.morph[1] - T.morph[0], v: .8 },
  { t: T.cut[0], type: 'tear', d: T.cut[1] - T.cut[0] }, { t: T.cut[0], type: 'hush', d: T.uncut[0] - T.cut[0] },
  { t: T.center, type: 'tick' }, { t: T.radii[1], type: 'tick' }, { t: T.angle, type: 'chime', n: 4 }, { t: T.arc, type: 'chime', n: 5 }, { t: T.calc, type: 'chime', n: 7 }, { t: T.chordT, type: 'tick' },
  { t: T.uncut[0], type: 'whoosh', d: 1.4, v: .5 }, { t: FLY[0], type: 'air', d: FLY[1] - FLY[0] + 1 }, { t: T.north, type: 'chime', n: 6 },
  ...SLABS.map(s => ({ t: +s.land.toFixed(3), type: 'slab', kind: s.kind, k: s.k })),
  { t: T.verdict - 1.25, type: 'suck', d: 1.25 }, { t: T.verdict, type: 'turn' },
  { t: T.routes, type: 'whoosh', d: 2.5, v: .6 }, { t: T.end, type: 'end' },
  ...NARR.map(c => ({ t: c.t0, type: 'narr', d: +(c.t1 - c.t0).toFixed(2), text: c.text })),
].sort((a, b) => a.t - b.t);
window.EV = EV;
window.render(0);
window.READY = true;
