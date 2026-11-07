// ¿Cuál conviene? (lección 1.3): en cada ronda, dos vitrinas con el mismo producto y ofertas
// distintas (descuentos sucesivos contra uno solo, subir y bajar el mismo porcentaje contra el
// precio de lista, un porcentaje contra una rebaja fija). Se arrastra el carrito a la vitrina más
// barata; los precios finales solo se revelan al comprobar.
// params = { rounds: [{ price, a: oferta, b: oferta }] }, oferta = { label, changes?: [%], off?: pesos }
// state = { picks: ['a' | 'b' | null] }

GAMES['mejor-oferta'] = (() => {
  const fmt = n => Math.round(n).toLocaleString('es-CO');
  const finalPrice = (price, offer) => Math.round((offer.changes || []).reduce((v, c) => v * (1 + c / 100), price) - (offer.off || 0));
  // La opción que conviene: la más barata (tiendas) o, con prefer: 'high', la que deja más (bancos).
  const cheaper = (r, p = {}) => {
    const a = finalPrice(r.price, r.a), b = finalPrice(r.price, r.b);
    if (a === b) return null;
    return (a < b) === (p.prefer !== 'high') ? 'a' : 'b';
  };

  function grade(state, params) {
    const ok = params.rounds.every((r, k) => {
      const best = cheaper(r, params);
      return state.picks[k] != null && (best === null || state.picks[k] === best);
    });
    const solution = params.rounds.map((r, k) => {
      const best = cheaper(r, params);
      return `Ronda ${k + 1}: A ${fmt(finalPrice(r.price, r.a))} · B ${fmt(finalPrice(r.price, r.b))} → ${best === null ? 'igual' : best.toUpperCase()}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const N = params.rounds.length;
    const st = { picks: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], shops = {}, home = null, drag = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      // El carrito en casa se ancla al pie (pista a H − 14) y las vitrinas ocupan lo que queda.
      const sw = (w - 36) / 2, sy = 88;
      home = { x: w / 2, y: h - 46 };
      const sh = Math.min(h * 0.52, home.y - 30 - sy);
      shops = { a: { x: 12, y: sy, w: sw, h: sh }, b: { x: 24 + sw, y: sy, w: sw, h: sh } };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.picks.every(v => v !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function cart(x, y, col) {
        p.stroke(col); p.strokeWeight(3); p.noFill();
        p.line(x - 26, y - 14, x - 18, y - 14); p.line(x - 18, y - 14, x - 12, y + 8); p.line(x - 12, y + 8, x + 18, y + 8);
        p.line(x + 18, y + 8, x + 24, y - 8); p.line(x + 24, y - 8, x - 16, y - 8);
        p.noStroke(); p.fill(col); p.circle(x - 6, y + 17, 8); p.circle(x + 14, y + 17, 8);
      }
      function shop(key, r) {
        const b = shops[key], off = r[key], pick = st.picks[cur] === key;
        const best = cheaper(r, params), good = best === null || key === best;
        const col = locked ? (pick ? (good ? C.ok : C.bad) : good ? C.ok : C.line) : pick ? C.brand : C.line;
        // Toldo y vitrina.
        p.noStroke(); p.fill(key === 'a' ? C.N : C.Q);
        for (let i = 0; i < 6; i++) { p.fill(i % 2 ? C.card : key === 'a' ? C.N : C.Q); p.rect(b.x + (i * b.w) / 6, b.y, b.w / 6, 14); }
        p.stroke(col); p.strokeWeight(pick ? 2.5 : 1.5); p.fill(C.card); p.rect(b.x, b.y + 14, b.w, b.h - 14, 0, 0, 12, 12);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(13);
        p.text(`${params.noun || 'Tienda'} ${key.toUpperCase()}`, b.x + 4, b.y + 22, b.w - 8, 20);
        // La oferta ocupa la franja entre el nombre y la zona del carrito / precio final.
        p.fill(C.N); p.textStyle(p.BOLD); p.textSize(b.w < 130 ? 11 : 14);
        p.text(off.label, b.x + 6, b.y + 44, b.w - 12, b.h - 44 - 40);
        if (locked) {
          p.fill(good ? C.ok : C.bad); p.textSize(15);
          p.text(`$ ${fmt(finalPrice(r.price, off))}`, b.x + 4, b.y + b.h - 34, b.w - 8, 20);
        } else if (pick) cart(b.x + b.w / 2, b.y + b.h - 24, C.brand);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur];
        tabs.forEach((t, i) => {
          const best = cheaper(params.rounds[i], params), v = st.picks[i];
          const col = locked ? (v !== null && (best === null || v === best) ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.ok : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(13);
        p.text(params.prefer === 'high' ? `$ ${fmt(r.price)} en los dos: ¿dónde queda más dinero?` : `Precio de lista $ ${fmt(r.price)} en las dos: ¿dónde sale más barato?`, 12, 44, W - 24, 42);
        shop('a', r); shop('b', r);
        if (!locked && st.picks[cur] === null && !drag) cart(home.x, home.y, C.mute);
        if (drag) cart(p.mouseX, p.mouseY, C.brand);
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Compras bien hechas!' : 'En verde, la opción que convenía') : params.prefer === 'high' ? 'Arrastra el carrito al banco que deja más dinero' : 'Arrastra el carrito a la vitrina más barata', W / 2, H - 14);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }   // las rondas se pueden repasar aun bloqueado
        if (locked) return;
        const key = st.picks[cur];
        const at = key === null ? Math.hypot(p.mouseX - home.x, p.mouseY - home.y) < 34 : inside(shops[key], p.mouseX, p.mouseY);
        if (!at) return;
        st.picks[cur] = null;   // el carrito sale de la vitrina y se puede llevar a la otra
        drag = true;
        ready();
        return false;
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const key = ['a', 'b'].find(k => inside(shops[k], p.mouseX, p.mouseY));
        drag = false;
        if (key) {
          st.picks[cur] = key; api.sfx?.tap?.();
          const next = st.picks.findIndex(v => v === null);
          if (next >= 0) cur = next;   // pasa sola a la siguiente ronda pendiente
        }
        ready();
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ picks: [...st.picks] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, finalPrice };
})();
