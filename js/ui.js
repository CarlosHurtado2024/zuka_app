// Utilidades compartidas: escape HTML, render de TeX, íconos, toasts, sonido y confeti.

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Texto con fórmulas entre $...$ (KaTeX) y **negritas**.
function tex(s) {
  return String(s ?? '').split(/(\$[^$]+\$)/g).map(part => {
    if (part.length > 2 && part[0] === '$' && part[part.length - 1] === '$') {
      const src = part.slice(1, -1);
      if (window.katex) {
        try { return katex.renderToString(src, { throwOnError: false }); } catch (e) { /* cae al texto plano */ }
      }
      return `<span class="tex-fallback">${esc(src)}</span>`;
    }
    return esc(part).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }).join('');
}

const svg = (d, fill) => `<svg class="i${fill ? ' f' : ''}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON = {
  learn: svg('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  clips: svg('<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M10 9l5 3-5 3z"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  flame: svg('<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>', true),
  bolt: svg('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', true),
  heart: svg('<path d="M12 21s-8-5.5-8-11.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.5 12 21 12 21z"/>', true),
  heartLine: svg('<path d="M12 21s-8-5.5-8-11.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.5 12 21 12 21z"/>'),
  bookmark: svg('<path d="M6 3h12v18l-6-4-6 4z"/>'),
  sound: svg('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
  mute: svg('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  play: svg('<path d="M8 5l11 7-11 7z"/>', true),
  check: svg('<path d="M5 12l5 5 9-10"/>'),
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  star: svg('<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>', true),
  down: svg('<path d="M6 9l6 6 6-6"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
};

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2200);
  setTimeout(() => t.remove(), 2600);
}

// Efectos de sonido sintetizados (sin archivos de audio).
const Sfx = (() => {
  let ac;
  const tone = (f, d, type = 'sine', t0 = 0, g = 0.08) => {
    if (!S.sfx) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), v = ac.createGain(), s = ac.currentTime + t0;
      o.type = type; o.frequency.value = f;
      v.gain.setValueAtTime(g, s);
      v.gain.exponentialRampToValueAtTime(0.0001, s + d);
      o.connect(v).connect(ac.destination);
      o.start(s); o.stop(s + d);
    } catch (e) { /* sin audio */ }
  };
  return {
    tap: () => tone(660, 0.06, 'triangle', 0, 0.04),
    ok: () => { tone(784, 0.12); tone(1046, 0.2, 'sine', 0.1); navigator.vibrate?.(15); },
    bad: () => { tone(196, 0.25, 'square', 0, 0.035); navigator.vibrate?.([40, 40, 40]); },
    win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, 'triangle', i * 0.1)),
  };
})();

function confetti(cv) {
  const ctx = cv.getContext('2d'), r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.scale(dpr, dpr);
  const P = Array.from({ length: 140 }, () => ({
    x: r.width / 2, y: r.height * 0.3, vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 10 - 3,
    s: 5 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3,
    c: PAL[Math.floor(Math.random() * PAL.length)],
  }));
  let n = 0;
  (function frame() {
    if (!cv.isConnected) return;
    ctx.clearRect(0, 0, r.width, r.height);
    for (const p of P) {
      p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (++n < 200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, r.width, r.height);
  })();
}
