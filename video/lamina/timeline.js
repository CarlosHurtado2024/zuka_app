// Línea de tiempo de una película lámina: le pone portada y resumen a las escenas de FILM y pasa todo a tiempos absolutos.
// Es pura (sin canvas): la usan la página y tests/lamina.test.js.
const INTRO = 8.5;
const TR = 0.8;                                         // transición entre escenas
const finLayout = F => { const n = F.sum.length, te = 1.4 + n * 1.5 + 0.6; return { n, te, dur: te + 9.5 }; };
function timeline(F) {
  const fin = finLayout(F);
  const scenes = [
    { id: '_intro', name: 'Portada', dur: INTRO, caps: [], narr: F.intro ? [[0.8, INTRO - 0.5, F.intro]] : [], ev: [[0.3, 'rise'], [INTRO - 1.5, 'dive', 1.3]] },
    ...F.scenes,
    { id: '_fin', name: 'Resumen', dur: fin.dur, caps: [], narr: F.finNarr || [],
      ev: [...F.sum.map((_, i) => [1.4 + i * 1.5, 'sum', i]), [fin.te, 'end'], [fin.te + 3, 'rise']] },
  ];
  let t = 0; const SC = [], CAPS = [], NARR = [], EV = [];
  scenes.forEach((s, i) => {
    SC.push({ id: s.id, name: s.name, t0: t, t1: t + s.dur, i });
    for (const c of s.caps || []) CAPS.push({ a: +(t + c[0]).toFixed(2), b: +(t + c[1]).toFixed(2), k: c[2], l1: c[3], l2: c[4] });
    for (const n of s.narr || []) NARR.push([+(t + n[0]).toFixed(2), +(t + n[1]).toFixed(2), n[2]]);
    for (const e of s.ev || []) EV.push({ t: +(t + e[0]).toFixed(2), type: e[1], v: e[2] ?? 0 });
    if (i) EV.push({ t: +t.toFixed(2), type: 'scene', v: i });
    t += s.dur;
  });
  return { DUR: +t.toFixed(2), scenes, SC, CAPS, NARR, EV: EV.sort((a, b) => a.t - b.t), fin, INTRO, TR };
}
// texto sin marcas: lo que se lee (para medir tiempos de lectura y largos de renglón)
const plain = s => String(s).replace(/\$/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/\\[,; ]/g, ' ').replace(/[{}\\^_]/g, '');
if (typeof module !== 'undefined') module.exports = { timeline, plain, finLayout, INTRO, TR };
