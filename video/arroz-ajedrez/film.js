// «El arroz del rey» — Data Physicalization (clip de curiosidades de Zuka). 1080×1920, 24 fps.
// render(t): cámara por claves → granos, montones, placas y ficha (todo es función pura del tiempo) → desenfoque → capa 2D
// (lecturas, veredicto, fuente, subtítulos, cierre). EV alimenta mix.py; TEXTS alimenta readcheck.
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { makePost } from '/core/three/post.js';
import { clamp, seg, eo, lerp, hash, track } from '/core/lib.js';
import { DUR, BEAT, q, T, SQ_T, POUR, LABELS, READ, NARR, PLATES64, PLATES_REST, BRASS_EVERY } from './data.js';

const W = 1080, H = 1920;
const SS = +(new URLSearchParams(location.search).get('ss') || 2);
const BG = new THREE.Color('#c4beb4');
const INK = '#1c1d20', INK2 = 'rgba(28,29,32,.62)', ACC = '#d4521c';
await Promise.all(['300 60px Inter', '500 30px Inter', '400 30px Inter', '400 22px JBMono', '500 22px JBMono', '600 80px NotoSerif'].map(f => document.fonts.load(f)));
await document.fonts.ready;

const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(SS); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.06;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = BG.clone(); scene.fog = new THREE.Fog(BG.clone(), 40, 90);
const camera = new THREE.PerspectiveCamera(40, W / H, .05, 140);
const post = makePost(renderer, scene, camera, W, H, { ssaa: SS, ao: true, aoRadius: .1, aoThickness: .4, aoScale: 1.6, aoAmt: .7 });
post.bloom.strength = .06; post.bloom.threshold = 1.6;
post.vig.uniforms.amt.value = .26; post.vig.uniforms.warm.value = .2; post.vig.uniforms.contrast.value = .16;

// ———————————————— el set ————————————————
const BH = .16, BORDER = .4, BS = 8 + 2 * BORDER;     // casilla = 1 unidad = 5 cm
const sqXZ = n => { const r = Math.floor((n - 1) / 8), c = (n - 1) % 8; return [-3.5 + c, 3.5 - r]; };
const PT = .0135, PW = .9;                            // placa: 0.9 × 0.0135 × 0.9
const TA = [3.5, -3.5], TB = [5.45, -3.5];            // torre de la casilla 64 y torre de las casillas 1–63 (sobre su peana)
const KING = [.5, -3.5];                              // el rey, en e8

const hdr = await new RGBELoader().loadAsync('/core/assets/polyhaven/photo_studio_loft_hall_2k.hdr');
hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr; scene.environmentIntensity = .75; scene.environmentRotation = new THREE.Euler(0, 1.2, 0);
const key = new THREE.DirectionalLight('#fff1dc', 3.0);
key.position.set(-8, 5.6, 3.4); key.target.position.set(.5, 0, -1); key.castShadow = true; key.shadow.mapSize.set(4096, 4096);
Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: .5, far: 30 });
key.shadow.bias = -.00012; key.shadow.normalBias = .003; key.shadow.radius = 3;
const rim = new THREE.DirectionalLight('#b9d2ff', 1.9); rim.position.set(7, 4, -7);
const rim2 = new THREE.DirectionalLight('#c6dbff', 1.0); rim2.position.set(6, 3, 8);
const topL = new THREE.DirectionalLight('#eef2f8', .45); topL.position.set(1.5, 10, 3);
scene.add(key, key.target, rim, rim2, topL);

const TL = new THREE.TextureLoader();
const tex = async (u, srgb, rep = 1) => { const t = await TL.loadAsync(u); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 16; t.repeat.set(rep, rep); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
const [wD, wN, wR] = await Promise.all([tex('/core/assets/polyhaven/walnut_diff.jpg', true, 2), tex('/core/assets/polyhaven/walnut_nor.jpg', false, 2), tex('/core/assets/polyhaven/walnut_rough.jpg', false, 2)]);
const walnutImg = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = '/core/assets/polyhaven/walnut_diff.jpg'; });

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#bfb8ad', roughness: .94 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const walnut = new THREE.MeshStandardMaterial({ map: wD, normalMap: wN, roughnessMap: wR, roughness: 1, color: '#a88d78', normalScale: new THREE.Vector2(.6, .6) });

// tablero: casillas de arce y nogal; incrustación clara con el número de casilla y, desde la 11, los granos grabados
{
  const C = 4096, c = document.createElement('canvas'); c.width = c.height = C;
  const x = c.getContext('2d'), px = v => (v + BS / 2) / BS * C, U = C / BS;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) x.drawImage(walnutImg, i * C / 4, j * C / 4, C / 4, C / 4);
  x.fillStyle = 'rgba(40,24,14,.28)'; x.fillRect(0, 0, C, C);
  for (let n = 1; n <= 64; n++) {
    const [sx, sz] = sqXZ(n), r = Math.floor((n - 1) / 8), col = (n - 1) % 8, light = (r + col) % 2 === 1;
    const X0 = px(sx - .5), Z0 = px(sz - .5);
    x.fillStyle = light ? 'rgba(238,214,168,.74)' : 'rgba(70,42,24,.30)'; x.fillRect(X0, Z0, U, U);
    const ink = light ? 'rgba(84,56,34,.82)' : 'rgba(239,228,207,.86)';
    x.fillStyle = ink; x.textBaseline = 'top'; x.textAlign = 'left';
    x.font = `500 ${Math.round(U * .12)}px JBMono`; x.fillText(String(n), X0 + U * .07, Z0 + U * .06);
    if (n >= 11) {
      const s = String(1n << BigInt(n - 1)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      const groups = s.split(' '), lines = [];
      for (let i = groups.length; i > 0; i -= 3) lines.unshift(groups.slice(Math.max(0, i - 3), i).join(' '));
      let fs = U * .16; x.font = `400 ${fs}px JBMono`;
      const wmax = Math.max(...lines.map(l => x.measureText(l).width)); if (wmax > U * .84) fs *= U * .84 / wmax;
      x.font = `400 ${Math.round(fs)}px JBMono`; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
      lines.forEach((l, i) => x.fillText(l, X0 + U * .93, Z0 + U * .9 - (lines.length - 1 - i) * fs * 1.12));
    }
  }
  // filete claro alrededor de las casillas
  x.strokeStyle = 'rgba(239,228,207,.9)'; x.lineWidth = 6; x.strokeRect(px(-4) - 10, px(-4) - 10, U * 8 + 20, U * 8 + 20);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const box = new THREE.Mesh(new THREE.BoxGeometry(BS, BH - .012, BS), walnut); box.position.y = (BH - .012) / 2; box.castShadow = box.receiveShadow = true; scene.add(box);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(BS, BS), new THREE.MeshStandardMaterial({ map: t, normalMap: wN, normalScale: new THREE.Vector2(.35, .35), roughness: .55, polygonOffset: true, polygonOffsetFactor: -2 }));
  top.rotation.x = -Math.PI / 2; top.position.y = BH; top.receiveShadow = true; scene.add(top);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.15, BH, 1.15), walnut); plinth.position.set(TB[0], BH / 2, TB[1]); plinth.castShadow = plinth.receiveShadow = true; scene.add(plinth);
}

// ———————————————— granos (las casillas 1–10: 1 023 granos de verdad) ————————————————
const GR = [], HEAPS = [];
for (let n = 1; n <= 10; n++) {
  const N = 2 ** (n - 1), [sx, sz] = sqXZ(n), S = SQ_T[n];
  if (n === 1) { GR.push({ n, x: sx + .03, z: sz - .02, y: BH + .016, yaw: .5, pit: 0, rol: 0, t0: S, land: S + .45, mode: 'g' }); continue; }
  if (n <= 8) {
    const L = .35 + .07 * (n - 2);
    for (let k = 0; k < N; k++) {
      const land = S + L * Math.pow((k + 1) / N, .85);
      GR.push({ n, x: sx + (hash(n * 97 + k * 1.3) - .5) * .76, z: sz + (hash(n * 31 + k * 2.7) - .5) * .76, y: BH + .016 + (n === 8 && k % 3 === 0 ? .026 : 0) + hash(k * 5.1 + n) * .004,
        yaw: hash(n * 13 + k * 7.7) * Math.PI * 2, pit: 0, rol: (hash(k * 3.3 + n) - .5) * .3, t0: land - .14, land, mode: 'c' });
    }
    continue;
  }
  // montón: cono con ángulo de reposo de 33°; volumen aparente de un grano = 0.031 cm³ = 2.5e-4 unidades³
  const V = N * 2.5e-4, tn = Math.tan(33 * Math.PI / 180), r = Math.cbrt(3 * V / (Math.PI * tn)), h = r * tn;
  const pts = [];
  for (let k = 0; k < N; k++) {
    const rho = r * Math.sqrt(hash(n * 11 + k * 1.91)) * .98, a = hash(n * 7 + k * 3.17) * Math.PI * 2;
    const ys = h * (1 - rho / r), y = BH + .014 + Math.max(0, ys - hash(k * 9.3 + n) * .04);
    pts.push({ n, x: sx + rho * Math.cos(a), z: sz + rho * Math.sin(a), y, yaw: hash(k * 4.4 + n * 3) * Math.PI * 2, pit: (hash(k * 2.2 + n) - .5) * 1.1, rol: (hash(k * 6.6 + n) - .5) * .6 });
  }
  // el montón crece parejo: cada grano cae donde está la superficie en ese momento y el montón se ensancha con él
  pts.forEach((p, k) => { p.land = S + POUR * Math.pow((k + 1) / N, .9); p.t0 = p.land - .32; p.mode = 'p'; p.cx = sx; p.cz = sz; p.sk = Math.cbrt((k + 1) / N); GR.push(p); });
  HEAPS.push({ n, sx, sz, r, h, S, N, pts });
}
const grainGeo = new THREE.CapsuleGeometry(.024, .088, 3, 10); grainGeo.rotateZ(Math.PI / 2); grainGeo.scale(1, .8, 1);
const grainMat = new THREE.MeshPhysicalMaterial({ color: '#f2ead8', roughness: .4, clearcoat: .25, clearcoatRoughness: .4, sheen: .4, sheenColor: new THREE.Color('#fff8ea') });
const grainMesh = new THREE.InstancedMesh(grainGeo, grainMat, GR.length); grainMesh.castShadow = grainMesh.receiveShadow = true; grainMesh.frustumCulled = false;
GR.forEach((g, i) => { const v = .9 + hash(i * 1.7) * .13; grainMesh.setColorAt(i, new THREE.Color(v, v * .99, v * .95)); });
grainMesh.instanceColor.needsUpdate = true; scene.add(grainMesh);
const heapMat = new THREE.MeshStandardMaterial({ color: '#e8dfca', roughness: .85 });
for (const hp of HEAPS) {
  hp.mesh = new THREE.Mesh(new THREE.ConeGeometry(hp.r * .93, hp.h * .9, 48), heapMat); hp.mesh.castShadow = hp.mesh.receiveShadow = true; scene.add(hp.mesh);
}

// ———————————————— placas: 1 placa = un año de toda la cosecha mundial de arroz ————————————————
const PL = [];
for (const [tw, N, S] of [['A', PLATES64, T.towerA], ['B', PLATES_REST, T.towerB]]) {
  const [x, z] = tw === 'A' ? TA : TB;
  for (let k = 0; k < N; k++) {
    const land = S + T.towerLen * Math.pow((k + 1) / N, .85);
    PL.push({ tw, k, x, z, brass: (k + 1) % BRASS_EVERY === 0, t0: land - .12, land,
      jx: (hash(k * 1.3 + (tw === 'A' ? 0 : 50)) - .5) * .012, jz: (hash(k * 2.9 + (tw === 'A' ? 7 : 70)) - .5) * .012, ja: (hash(k * 3.7 + (tw === 'A' ? 3 : 30)) - .5) * .03, shade: .9 + hash(k * 5.3 + (tw === 'A' ? 1 : 9)) * .13 });
  }
}
const plateGeo = new THREE.BoxGeometry(PW, PT * .985, PW);
const alu = new THREE.MeshStandardMaterial({ color: '#d6dadf', metalness: 1, roughness: .33 });
const ceramic = new THREE.MeshPhysicalMaterial({ color: '#ece4d2', roughness: .5, clearcoat: .35, clearcoatRoughness: .3 });
const brass = new THREE.MeshStandardMaterial({ color: '#d2b07a', metalness: 1, roughness: .27 });
const groups = { alu: [], cer: [], brass: [] };
for (const p of PL) { const g = p.brass ? 'brass' : p.tw === 'A' ? 'alu' : 'cer'; p.g = g; p.idx = groups[g].length; groups[g].push(p); }
const pmesh = {};
for (const [g, mat] of [['alu', alu], ['cer', ceramic], ['brass', brass]]) {
  const m = new THREE.InstancedMesh(plateGeo, mat, groups[g].length); m.castShadow = m.receiveShadow = true; m.frustumCulled = false;
  for (const p of groups[g]) { const v = g === 'cer' ? .97 + (p.shade - .97) * .4 : p.shade; m.setColorAt(p.idx, new THREE.Color(v, v, v)); }
  m.instanceColor.needsUpdate = true; scene.add(m); pmesh[g] = m;
}
const topOf = tw => BH + (tw === 'A' ? PLATES64 : PLATES_REST) * PT;
const landedPlates = (tw, t) => { let c = 0; for (const p of PL) if (p.tw === tw && p.land <= t) c++; return c; };

// ———————————————— el rey (latón torneado) ————————————————
{
  const prof = [[0, 0], [.42, 0], [.42, .07], [.35, .11], [.37, .15], [.27, .2], [.2, .45], [.15, .95], [.14, 1.18], [.26, 1.23], [.26, 1.29], [.16, 1.33], [.22, 1.52], [.19, 1.62], [0, 1.66]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const king = new THREE.Group();
  const kb = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), brass); kb.castShadow = kb.receiveShadow = true; king.add(kb);
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(.06, .3, .06), brass); c1.position.y = 1.8; const c2 = new THREE.Mesh(new THREE.BoxGeometry(.2, .06, .06), brass); c2.position.y = 1.85;
  for (const m of [c1, c2]) { m.castShadow = true; king.add(m); }
  king.position.set(KING[0], BH, KING[1]); scene.add(king);
}

// ———————————————— la ficha final: «2⁶⁴ − 1» grabado ————————————————
const PR = .78, PH = .08;
const puck = (() => {
  const pc = document.createElement('canvas'); pc.width = pc.height = 1024; const g2 = pc.getContext('2d');
  g2.fillStyle = '#fff'; g2.fillRect(0, 0, 1024, 1024); g2.strokeStyle = g2.fillStyle = '#3b2a12';
  g2.lineWidth = 5; g2.beginPath(); g2.arc(512, 512, 470, 0, Math.PI * 2); g2.stroke();
  for (let a = 0; a < 64; a++) { const ang = a / 64 * Math.PI * 2, r1 = a % 8 === 0 ? 410 : 430; g2.lineWidth = a % 8 === 0 ? 5 : 2.5; g2.beginPath(); g2.moveTo(512 + 452 * Math.sin(ang), 512 + 452 * Math.cos(ang)); g2.lineTo(512 + r1 * Math.sin(ang), 512 + r1 * Math.cos(ang)); g2.stroke(); }
  g2.textAlign = 'left'; g2.font = '300 230px Inter'; const wb = g2.measureText('2').width; g2.font = '300 120px Inter'; const we = g2.measureText('64').width;
  g2.font = '300 200px Inter'; const wr = g2.measureText(' − 1').width, x0 = 512 - (wb + we + wr) / 2;
  g2.font = '300 230px Inter'; g2.fillText('2', x0, 600); g2.font = '300 120px Inter'; g2.fillText('64', x0 + wb + 4, 470); g2.font = '300 200px Inter'; g2.fillText(' − 1', x0 + wb + we + 8, 600); g2.textAlign = 'center';
  g2.font = '500 56px JBMono'; g2.fillText('GRANOS', 512, 720);
  const pt = new THREE.CanvasTexture(pc); pt.colorSpace = THREE.SRGBColorSpace; pt.anisotropy = 16;
  const topM = new THREE.MeshStandardMaterial({ color: '#dcbd86', map: pt, metalness: 1, roughness: .26 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(PR, PR, PH, 160), [brass, topM, brass]); m.castShadow = m.receiveShadow = true; scene.add(m); return m;
})();
const PUCK_XZ = [0, 0];

const heapScale = (hp, t) => { let c = 0; for (const p of hp.pts) if (p.land <= t) c++; else break; return Math.cbrt(c / hp.N); };
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), ONE = new THREE.Vector3(1, 1, 1), ZERO = new THREE.Vector3();
function update(t) {
  const hs = HEAPS.map(hp => heapScale(hp, t));
  GR.forEach((g, i) => {
    if (t < g.t0) { M4.compose(P.set(0, -5, 0), Q.identity(), ZERO); grainMesh.setMatrixAt(i, M4); return; }
    const u = seg(t, g.t0, g.land); let y = g.y;
    if (g.mode === 'c') y += .3 * Math.pow(1 - u, 2);
    else if (g.mode === 'p') y += 1.4 * (1 - u * u);
    else { y += .9 * (1 - u * u); if (t > g.land) { const b = t - g.land; y += .02 * Math.exp(-b * 8) * Math.abs(Math.sin(b * 22)); } }
    const spin = (1 - u) * 2.4;
    let gx = g.x, gz = g.z;
    if (g.mode === 'p') {
      const sk = t < g.land ? g.sk : hs[g.n - 9];
      gx = g.cx + (g.x - g.cx) * sk; gz = g.cz + (g.z - g.cz) * sk; y = BH + (g.y - BH) * sk + (y - g.y);
    }
    P.set(gx, y, gz); Q.setFromEuler(E.set(g.pit + spin * .3, g.yaw + spin, g.rol, 'YXZ')); M4.compose(P, Q, ONE); grainMesh.setMatrixAt(i, M4);
  });
  grainMesh.instanceMatrix.needsUpdate = true;
  for (const hp of HEAPS) {
    const s = heapScale(hp, t) * .97;
    hp.mesh.visible = s > .05; hp.mesh.scale.setScalar(Math.max(s, .01)); hp.mesh.position.set(hp.sx, BH + hp.h * .45 * s, hp.sz);
  }
  for (const p of PL) {
    if (t < p.t0) { M4.compose(P.set(0, -5, 0), Q.identity(), ZERO); pmesh[p.g].setMatrixAt(p.idx, M4); continue; }
    const u = seg(t, p.t0, p.land);
    P.set(p.x + p.jx, BH + PT * (p.k + .5) + .1 * (1 - eo(u)), p.z + p.jz); Q.setFromEuler(E.set(0, p.ja, 0)); M4.compose(P, Q, ONE); pmesh[p.g].setMatrixAt(p.idx, M4);
  }
  for (const g in pmesh) pmesh[g].instanceMatrix.needsUpdate = true;
  const t0 = T.puck - .55, u = seg(t, t0, T.puck);
  puck.visible = t > t0;
  let y = BH + PH / 2 + 3.2 * (1 - u * u);
  if (t > T.puck) { const b = t - T.puck; y += .02 * Math.exp(-b * 9) * Math.abs(Math.sin(b * 24)); }
  puck.position.set(PUCK_XZ[0], y, PUCK_XZ[1]); puck.rotation.set(0, Math.PI / 2 + (1 - eo(u)) * .8, 0);
}

// ———————————————— cámara: una sola toma ————————————————
// [cámara x, y, z, mira x, y, z, foco x, y, z, abertura]
const [s1x, s1z] = sqXZ(1), [s9x, s9z] = sqXZ(9);
const CAMK = [
  [0.0, [-3.92, .4, 4.34, -3.48, .17, 3.48, -3.47, .17, 3.48, 30]],
  [3.4, [-4.05, .5, 4.6, -3.45, .2, 3.45, -3.47, .17, 3.48, 26]],
  [7.0, [-3.6, .85, 5.6, -2.9, .2, 3.45, -2.5, .17, 3.5, 20]],
  [9.0, [-2.0, 1.05, 6.0, -1.5, .2, 3.45, -1.5, .17, 3.5, 18]],
  [13.0, [1.2, 1.2, 6.3, 1.6, .2, 3.45, 1.5, .17, 3.5, 17]],
  [16.2, [3.3, 1.35, 6.5, 3.2, .22, 3.45, 3.5, .17, 3.5, 16]],
  [18.5, [.2, 2.2, 6.2, -2.7, .35, 2.6, -3, .3, 2.5, 14]],
  [24.6, [.6, 2.5, 6.6, -2.8, .38, 2.5, -3, .3, 2.5, 13]],
  [26.4, [.2, 12.5, 18.5, 0, 0, .4, 0, .16, .5, 4]],
  [35.6, [1.6, 10.5, 14.5, .9, 0, -1.1, .9, .16, -1, 4]],
  [38.0, [4.75, 1.45, -1.05, 3.45, .2, -3.4, 3.5, .16, -3.5, 18]],
  [44.6, [4.9, 1.55, -.85, 3.45, .22, -3.4, 3.5, .16, -3.5, 17]],
  [46.4, [6.2, 1.6, .9, 4.0, .9, -3.5, 3.5, .7, -3.5, 12]],
  [50.2, [7.6, 4.0, 5.2, 4.0, 2.9, -3.2, 4.45, 2.6, -3.5, 8]],
  [54.0, [9.1, 4.6, 9.6, 3.75, 4.3, -3.0, 4.45, 3, -3.5, 6]],
  [57.6, [9.3, 4.7, 9.9, 3.7, 4.35, -2.95, 4.45, 3, -3.5, 6]],
  [63.0, [6.8, 23, 21, 1.0, 1.2, 1.6, .5, .3, -.5, 2]],
  [DUR, [5.8, 24, 18.5, .7, 1.0, 2.0, .3, .3, -.3, 2]],
];
const CAM = track(CAMK);
const fwd = new THREE.Vector3(), V3 = (a, b, c) => new THREE.Vector3(a, b, c);
const DBG = new URLSearchParams(location.search).get('top');
function setCamera(t) {
  const c = DBG ? [0, 26, .01, 0, 0, 0, 0, 0, 0, 0] : CAM(t);
  camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(); camera.getWorldDirection(fwd);
  post.dof.focus = Math.max(.15, V3(c[6], c[7], c[8]).sub(camera.position).dot(fwd)); post.dof.aper = c[9]; post.dof.maxCoc = 14;
}
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };

// ———————————————— capa 2D ————————————————
const ov = document.getElementById('ov'), g = ov.getContext('2d');
const XL = 160, XR = 920;                             // zona segura de la app: 14 %–86 % del ancho
let TXT = [];
function text(id, s, x, y, font, color, a = 1, align = 'left', o = {}) {
  if (a <= .01) return 0;
  g.globalAlpha = a; g.font = font; g.fillStyle = color; g.textAlign = align; g.fillText(s, x, y);
  const w = g.measureText(s).width, sz = parseFloat(font.split(' ')[1]);
  const x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  if (!o.noReport && a > .5) TXT.push({ id, text: o.report ?? s, x0, y0: y - sz, x1: x0 + w, y1: y + sz * .25, ...(o.pass ? { pass: true } : {}) });
  g.globalAlpha = 1; return w;
}
const width = (s, font) => { g.font = font; return g.measureText(s).width; };
function line(pts, a, color = INK, w = 1.6) { if (a <= .01) return; g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.globalAlpha = 1; }
function dot(x, y, a, color = INK, r = 4) { if (a <= .01) return; g.globalAlpha = a; g.fillStyle = color; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
function plate(x, y, w, h, a) { if (a <= .01) return; g.globalAlpha = a * .86; g.fillStyle = '#efebe4'; g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill(); g.globalAlpha = 1; }
function swatch(x, y, kind, a) { if (a <= .01) return; g.globalAlpha = a; g.fillStyle = kind === 'alu' ? '#a9adb2' : kind === 'cer' ? '#ece4d2' : '#efe7d4'; g.strokeStyle = INK; g.lineWidth = 1; g.fillRect(x, y - 18, 18, 18); g.strokeRect(x + .5, y - 17.5, 17, 17); g.globalAlpha = 1; }

const F = { lab: '500 30px Inter', val: '300 60px Inter', ext: '400 28px Inter', mono: '400 22px JBMono', hero: '300 92px Inter' };
// lectura: punto en el objeto, guía, placa de papel con rótulo + valor (+ extra); se acomoda dentro de la zona segura
function reading(id, wp, lines, a, o = {}) {
  if (a <= .01) return null;
  const [ax, ay] = proj(wp), k = eo(a), rise = 16 * (1 - k);
  const fonts = [F.lab, o.big ? F.hero : F.val, F.ext, F.ext];
  const ws = lines.map((s, i) => width(s, fonts[i]) + (i === 0 && o.kind ? 28 : 0)), w = Math.max(...ws);
  const hs = [40, o.big ? 100 : 68, 40, 40], hh = lines.reduce((s, _, i) => s + hs[i], 0) + 24;
  let bx = o.side < 0 ? ax - (o.dx ?? 90) - w : ax + (o.dx ?? 90), by = ay - (o.dy ?? 220);
  bx = clamp(bx, XL + 14, XR - 14 - w); by = clamp(by, o.minY ?? 250, o.maxY ?? 1330);
  plate(bx - 16, by - 12 + rise, w + 32, hh, a);
  const lx = ax < bx ? bx - 16 : ax > bx + w ? bx + w + 16 : ax, ly = clamp(ay, by - 12, by - 12 + hh);
  dot(ax, ay, a, o.color || INK); line([[ax, ay], [lerp(ax, lx, k), lerp(ay, ly < ay ? by + hh - 12 : by - 12, k)]], a * .85, o.color || INK);
  let y = by + rise;
  lines.forEach((s, i) => {
    y += hs[i];
    const xx = i === 0 && o.kind ? bx + 28 : bx;
    if (i === 0 && o.kind) swatch(bx, y - 6, o.kind, a);
    text(id + i, s, xx, y - 8, fonts[i], i === 1 ? (o.color || INK) : INK2, a, 'left', { pass: o.pass });
  });
  return [bx, by, bx + w, by + hh];
}
function verdict(id, lines, a) {
  if (a <= .01) return;
  const x = XL + 10, y = 300, f = '500 44px Inter', w = Math.max(...lines.map(s => width(s, f)));
  plate(x - 22, y - 62, w + 44, 70 + 58 * (lines.length - 1) + 32, a);
  lines.forEach((s, i) => text(id + i, s, x, y + i * 58, f, ACC, a));
  line([[x, y + 58 * (lines.length - 1) + 22], [x + w * eo(a), y + 58 * (lines.length - 1) + 22]], a, ACC, 2.4);
}
const env = (t, a, b, fi = .35, fo = .35) => Math.min(seg(t, a, a + fi), 1 - seg(t, b - fo, b));
const grainTop = (n, t) => { const [x, z] = sqXZ(n); return V3(x, BH + .04, z); };

const FS = '500 34px Inter', SUB_Y = 1560;
function subtitles(t) {
  for (const c of NARR) {
    const a = seg(t, c.t0 - .08, c.t0 + .12) * (1 - seg(t, c.t1 - .15, c.t1));
    if (a <= .01) continue;
    const w = width(c.text, FS);
    g.globalAlpha = a * .8; const gr = g.createLinearGradient(XL - 30, 0, XL + w + 120, 0);
    gr.addColorStop(0, 'rgba(236,232,224,.94)'); gr.addColorStop(.8, 'rgba(236,232,224,.8)'); gr.addColorStop(1, 'rgba(236,232,224,0)');
    g.fillStyle = gr; g.fillRect(XL - 30, SUB_Y - 52, w + 150, 74); g.globalAlpha = 1;
    line([[XL - 14, SUB_Y - 40], [XL - 14, SUB_Y + 10]], a, INK, 2);
    text('sub', c.text, XL, SUB_Y, FS, INK, a, 'left', { noReport: true });
  }
}
window.SUBCHECK = { cues: NARR.map(c => ({ id: c.id, text: c.text, w: Math.round(width(c.text, FS)) })), safe: XR - XL };
window.SUBCHECK.ok = window.SUBCHECK.cues.every(c => c.w <= window.SUBCHECK.safe);

function overlay(t) {
  g.clearRect(0, 0, W, H); TXT = [];
  // ① casilla 1: el primer grano; la unidad
  reading('s1', grainTop(1, t), [LABELS.sq1, LABELS.unitGrain], env(t, 1.0, 6.9), { side: 1, dx: 60, dy: 380, kind: 'grain' });
  // ② la fila 1: el contador va con la casilla que acaba de llenarse (pasa de largo); en la 8 se queda
  for (let n = 2; n <= 8; n++) {
    const a0 = SQ_T[n] + .35, a1 = n < 8 ? SQ_T[n + 1] + .3 : q(7) + .6;
    const a = env(t, a0, a1, .2, .25);
    if (a > .01) reading('r' + n, grainTop(n, t), [`casilla ${n}`, `${2 ** (n - 1)} granos`], a, { side: 1, dx: 40, dy: 360, pass: n < 8, kind: 'grain' });
  }
  // ③ montones
  reading('r9', grainTop(9, t).setY(.55), ['casilla 9', '256 granos'], env(t, SQ_T[9] + 1.2, SQ_T[10] + .4), { side: 1, dx: 120, dy: 300, pass: true });
  reading('r10', grainTop(10, t).setY(.6), LABELS.sq10, env(t, SQ_T[10] + 1.3, q(10) + .2), { side: 1, dx: 110, dy: 330 });
  // ④ el tablero vacío: lecturas grabadas que la cámara va encontrando
  for (const n of [20, 30, 40, 50]) {
    const [x, z] = sqXZ(n), a = env(t, T.read[n], T.read[n] + (n === 50 ? 4.2 : 3.6));
    reading('g' + n, V3(x, BH, z), READ[n], a, { side: n === 50 ? -1 : 1, dx: 50, dy: 420, minY: 300, maxY: 900 });
  }
  // ⑤ casilla 64
  {
    const a = env(t, T.hero, q(18) + .4), [x, z] = sqXZ(64);
    if (a > .01) {
      const k = eo(a), [ax, ay] = proj(V3(x, BH, z)), x0 = XL + 10, y0 = 330 + 16 * (1 - k);
      const L = LABELS.hero, gs = L[1].split(' '), n1 = gs.slice(0, 4).join(' '), n2 = gs.slice(4).join(' '), w = Math.max(width(n1, F.hero), width(L[2], F.ext), width(L[3], F.ext));
      plate(x0 - 18, y0 - 60, w + 36, 384, a);
      text('h0', L[0], x0, y0, F.lab, INK2, a);
      text('h1', n1, x0, y0 + 100, F.hero, INK, a, 'left', { report: L[1] }); text('h2', n2, x0, y0 + 196, F.hero, INK, a, 'left', { report: L[1] + ' ' });
      text('h3', L[2], x0, y0 + 254, F.ext, INK2, a); text('h4', L[3], x0, y0 + 300, F.ext, INK2, a);
      dot(ax, ay, a); line([[ax, ay], [lerp(ax, x0 + w * .5, k), lerp(ay, y0 + 324, k)]], a * .85);
    }
  }
  // ⑥ la unidad nueva: una placa y una de latón
  {
    const a = env(t, T.unit[0], T.unit[1]);
    if (a > .01) {
      const pp = k => proj(V3(TA[0] - PW / 2, BH + PT * (k + .5), TA[1] + PW / 2));
      const [x1, y1] = pp(4), [x2, y2] = pp(9);
      dot(x1, y1, a); dot(x2, y2, a, '#8a6a2e');
      const f = '500 36px Inter', w1 = Math.max(width(LABELS.unit1, f), width(LABELS.unit1b, F.ext)), bx = XL + 10, by = 330;
      plate(bx - 16, by - 50, w1 + 32, 116, a);
      text('u1', LABELS.unit1, bx, by, f, INK, a); text('u1b', LABELS.unit1b, bx, by + 46, F.ext, INK2, a);
      line([[x1, y1], [bx + w1 * .6, by + 66]], a * .8);
      const w2 = width(LABELS.unit2, f), cy = 560;
      plate(bx - 16, cy - 50, w2 + 60, 70, a); g.globalAlpha = a; g.fillStyle = '#d2b07a'; g.fillRect(bx, cy - 24, 18, 18); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(bx + .5, cy - 23.5, 17, 17); g.globalAlpha = 1;
      text('u2', LABELS.unit2, bx + 30, cy, f, INK, a);
      line([[x2, y2], [bx + w2 * .5, cy + 20]], a * .8);
    }
  }
  // ⑦ las dos torres: lecturas en una columna; luego el veredicto
  {
    const a = env(t, T.hold, T.verdict + .3);
    if (a > .01) {
      const lA = landedPlates('A', t), lB = landedPlates('B', t);
      reading('tA', V3(TA[0], BH + lA * PT, TA[1]), LABELS.towerA, a, { side: -1, dx: 120, dy: -60, minY: 660, maxY: 900, kind: 'alu' });
      reading('tB', V3(TB[0], BH + lB * PT, TB[1]), LABELS.towerB, a, { side: 1, dx: 0, dy: 280, minY: 400, maxY: 470, kind: 'cer' });
    }
    verdict('v', LABELS.verdict, env(t, T.verdict, T.crane + 2.8));
  }
  // ⑧ todo el tablero
  {
    const a = env(t, T.totalRead, T.puck - .1);
    if (a > .01) {
      const k = eo(a), x0 = XL + 10, y0 = 300 + 16 * (1 - k), L = LABELS.total, gs = L[1].split(' '), n1 = gs.slice(0, 4).join(' '), n2 = gs.slice(4).join(' ');
      const w = Math.max(width(n1, F.hero), width(L[2], F.ext), width(L[3], F.ext));
      plate(x0 - 18, y0 - 60, w + 36, 384, a);
      text('t0', L[0], x0, y0, F.lab, INK2, a);
      text('t1', n1, x0, y0 + 100, F.hero, ACC, a, 'left', { report: L[1] }); text('t2', n2, x0, y0 + 196, F.hero, ACC, a, 'left', { report: L[1] + ' ' });
      text('t3', L[2], x0, y0 + 254, F.ext, INK2, a); text('t4', L[3], x0, y0 + 300, F.ext, INK, a);
    }
  }
  // ⑨ la ficha y el primer grano (cerrar el círculo)
  {
    const a = env(t, T.puck + .2, DUR + 1);
    if (a > .01) {
      const [px, py] = proj(V3(PUCK_XZ[0], BH + PH, PUCK_XZ[1] - PR * .9)), s = 'la cuenta del rey', x0 = XL + 10, y0 = 320, w = width(s, '500 40px Inter');
      plate(x0 - 16, y0 - 52, w + 32, 74, a); text('pk', s, x0, y0, '500 40px Inter', ACC, a);
      line([[x0 + w * .5, y0 + 22], [lerp(x0 + w * .5, px, eo(a)), lerp(y0 + 22, py, eo(a))]], a, ACC, 1.8); dot(px, py, a * seg(t, T.puck + .5, T.puck + .7), ACC, 5);
    }
    const b = env(t, T.grain1, DUR + 1);
    if (b > .01) {
      const [gx, gy] = proj(grainTop(1, t)), s = LABELS.sq1, w = width(s, '500 34px Inter'), x0 = XL + 10, y0 = 470;
      plate(x0 - 16, y0 - 46, w + 32, 66, b); text('g1', s, x0, y0, '500 34px Inter', INK, b);
      line([[x0 + w * .3, y0 + 20], [lerp(x0 + w * .3, gx, eo(b)), lerp(y0 + 20, gy, eo(b))]], b, INK, 1.6); dot(gx, gy, b * seg(t, T.grain1 + .4, T.grain1 + .6), ACC, 5);
    }
  }
  // fuente (desde que aparecen cantidades calculadas)
  {
    const a = env(t, T.read[20] - .2, DUR + 1);
    text('src0', LABELS.source[0], XR, 132, '400 22px Inter', INK2, a, 'right');
    text('src1', LABELS.source[1], XR, 162, '400 22px Inter', INK2, a, 'right');
  }
  // cierre
  {
    const a = seg(t, T.end, T.end + .4), b = seg(t, T.end + .25, T.end + .65), x = XL + 10, y = 1220, r = v => 16 * (1 - eo(v));
    if (a > .01) plate(x - 22, y - 92, 640, 210, Math.min(a, .9));
    text('e1', LABELS.title, x, y + r(a), '600 80px NotoSerif', INK, a);
    text('e2', LABELS.sub, x + 2, y + 52 + r(a), '300 34px Inter', INK2, a);
    line([[x, y + 76], [x + 340 * eo(b), y + 76]], b, INK, 1.2);
    text('e3', LABELS.style, x, y + 108, '400 20px JBMono', INK2, b);
  }
  subtitles(t);
}

// ———————————————— cuadro ————————————————
window.DUR = DUR;
window.render = t => { update(t); setCamera(t); post.composer.render(); overlay(t); };
window.TEXTS = t => { window.render(t); return TXT; };

// sonido: cascadas de granos, montones, placas, latón, lecturas, silencios, golpes, cámara
const EV = [];
for (let n = 1; n <= 10; n++) {
  const N = 2 ** (n - 1);
  if (n === 1) EV.push({ t: SQ_T[1] + .45, type: 'grain1' });
  else if (n <= 8) EV.push({ t: SQ_T[n], type: 'cascade', d: +(.35 + .07 * (n - 2)).toFixed(3), n: N, sq: n });
  else EV.push({ t: SQ_T[n], type: 'pour', d: POUR + .3, n: N, sq: n });
}
for (const p of PL) if (p.brass) EV.push({ t: +p.land.toFixed(3), type: 'brass', mat: p.tw, h: (p.k + 1) / BRASS_EVERY });
EV.push({ t: T.towerA, type: 'stack', mat: 'A', d: T.towerLen, n: PLATES64 }, { t: T.towerB, type: 'stack', mat: 'B', d: T.towerLen, n: PLATES_REST });
for (const n of [20, 30, 40, 50]) EV.push({ t: T.read[n], type: 'read', v: .5 });
EV.push({ t: T.hero, type: 'read', v: .8 }, { t: T.totalRead, type: 'read', v: .8 }, { t: T.grain1, type: 'read', v: .5 });
EV.push({ t: T.suck, type: 'suck', d: T.verdict - T.suck }, { t: T.verdict, type: 'turn' },
  { t: T.suck2, type: 'suck', d: T.puck - T.suck2 }, { t: T.puck, type: 'puck' }, { t: T.end, type: 'end' },
  { t: 17.3, type: 'whoosh', d: 1.0, v: .4 }, { t: 25.0, type: 'whoosh', d: 1.6, v: .6 }, { t: 35.8, type: 'whoosh', d: 2.0, v: .6 },
  { t: 57.6, type: 'whoosh', d: 4.0, v: .7 });
for (const c of NARR) EV.push({ t: c.t0, type: 'narr', d: +(c.t1 - c.t0).toFixed(2), text: c.text });
EV.sort((a, b) => a.t - b.t);
window.EV = EV;
window.render(0);
window.READY = true;
