// El circuito lógico (Preuniversitario, pu-lo-1 a pu-lo-3; spec 2026-11-18-preuda-razonamiento-completo): dos interruptores p y
// q. En serie el bombillo prende solo si los dos están cerrados (p ∧ q); en paralelo, si alguno lo está (p ∨ q). Un interruptor
// marcado con ¬ funciona al revés (cerrado cuando su letra es falsa), y un inversor antes del bombillo niega todo. Se tocan los
// interruptores hasta que el bombillo quede como se pide.
// params = { rounds: [{ op: 'and' | 'or', neg?: [bool, bool], out?: bool, want: bool, fix?: { p?: bool, q?: bool } }] }
// state = { rounds: [{ v: [p, q] }] }
GAMES['circuito-logico'] = (() => {
  const val = (r, v) => { const a = r.neg?.[0] ? !v[0] : v[0], b = r.neg?.[1] ? !v[1] : v[1], x = r.op === 'and' ? a && b : a || b; return r.out ? !x : x; };
  const fixed = r => ['p', 'q'].map(k => r.fix?.[k]);
  const ok = (s, r) => val(r, s.v) === r.want && fixed(r).every((f, i) => f === undefined || s.v[i] === f);
  const sols = r => [[false, false], [false, true], [true, false], [true, true]].filter(v => ok({ v }, r));
  const tex = r => { const a = r.neg?.[0] ? '\\neg p' : 'p', b = r.neg?.[1] ? '\\neg q' : 'q', x = `${a} ${r.op === 'and' ? '\\wedge' : '\\vee'} ${b}`; return r.out ? `\\neg(${x})` : x; };
  const game = roundsGame({
    aspect: 1.25,
    init: r => { const f = fixed(r), v = [f[0] ?? false, f[1] ?? false]; if (ok({ v }, r)) { const i = f[1] === undefined ? 1 : 0; v[i] = !v[i]; } return { v }; },
    ok,
    solution: r => { const v = sols(r)[0]; return `p ${v[0] ? 'V' : 'F'}, q ${v[1] ? 'V' : 'F'}`; },
    prompt: r => `${r.want ? 'Prende' : 'Apaga'} el bombillo: $${tex(r)}$`,
    foot: () => 'Toca los interruptores para abrirlos o cerrarlos',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: sols(r)[0] } : G.s, good = ok(s, r), lit = val(r, s.v), W = G.W;
      const x0 = 30, x1 = W - 30, yT = 120, yB = 290, mid = (yT + yB) / 2;
      const wire = on => { p.stroke(on ? C.sun : C.line); p.strokeWeight(on ? 3 : 2); };
      wire(lit); p.noFill();
      p.line(x0, yT, x0, yB); p.line(x0, yB, x1, yB); p.line(x1, yB, x1, yT);
      p.noStroke(); p.fill(C.mute); p.rect(x0 - 10, mid - 18, 20, 36, 4); TK.label(p, C, '+', x0, mid - 8, inkOn(C.mute), 10, 16);
      const sw = (i, x, y) => {
        const on = r.neg?.[i] ? !s.v[i] : s.v[i], fx = fixed(r)[i] !== undefined;
        p.stroke(on ? C.sun : C.ink); p.strokeWeight(3); p.line(x - 22, y, x - 12, y); p.line(x + 12, y, x + 22, y);
        if (on) p.line(x - 12, y, x + 12, y); else p.line(x - 12, y, x + 8, y - 16);
        p.noStroke(); p.fill(C.ink); p.circle(x - 12, y, 6); p.circle(x + 12, y, 6);
        TK.label(p, C, `$${r.neg?.[i] ? '\\neg ' : ''}${'pq'[i]}$`, x, y - 26, fx ? C.mute : C.brand, 13, 50);
        TK.label(p, C, s.v[i] ? `${'pq'[i]} = V` : `${'pq'[i]} = F`, x, y + 20, fx ? C.mute : C.ink, 10, 60);
        return { x, y, i, fx };
      };
      if (r.op === 'and') {
        const xa = x0 + (x1 - x0) * 0.3, xb = x0 + (x1 - x0) * 0.62;
        wire(lit); p.line(x0, yT, xa - 22, yT); p.line(xa + 22, yT, xb - 22, yT); p.line(xb + 22, yT, x1, yT);
        G.sw = [sw(0, xa, yT), sw(1, xb, yT)];
      } else {
        const xs = x0 + (x1 - x0) * 0.42, ya = yT - 10, yb = yT + 60, xl = xs - 50, xr = xs + 50;
        wire(lit); p.line(x0, yT, xl, yT); p.line(xl, ya, xl, yb); p.line(xr, ya, xr, yb); p.line(xr, yT, x1, yT);
        p.line(xl, ya, xs - 22, ya); p.line(xs + 22, ya, xr, ya); p.line(xl, yb, xs - 22, yb); p.line(xs + 22, yb, xr, yb);
        G.sw = [sw(0, xs, ya), sw(1, xs, yb)];
      }
      if (r.out) { const xi = x1 - 40; p.stroke(C.ink); p.strokeWeight(1.5); p.fill(C.card); p.rect(xi - 16, yT - 12, 32, 24, 5); TK.label(p, C, '$\\neg$', xi, yT, C.ink, 13, 30); }
      const bx = (x0 + x1) / 2;
      if (lit) { p.noStroke(); p.fill(RK.al(p, C.sun, 70)); p.circle(bx, yB, 64); }
      p.stroke(C.ink); p.strokeWeight(1.5); p.fill(lit ? C.sun : C.card); p.circle(bx, yB, 34);
      RK.strip(p, C, G.fb, `$${tex(r)} = ${lit ? 'V' : 'F'}$`, { kicker: lit ? 'el bombillo prende' : 'el bombillo está apagado', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const w = (G.sw || []).find(o => Math.hypot(x - o.x, y - o.y) < 30); if (!w) return false; if (!w.fx) { G.s.v[w.i] = !G.s.v[w.i]; G.touch(); } return true; },
    demo: G => { const w = G.sw?.find(o => !o.fx); return w ? { from: w, to: w, text: 'Toca el interruptor', ty: w.y + 42 } : null; },
    peek: G => ({ sw: G.sw }),
  });
  return Object.assign(game, { answer: r => ({ v: sols(r)[0] }) });
})();
