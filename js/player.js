// Reproductor de clips verticales 9:16. Un clip es una secuencia de escenas animadas en canvas
// con fórmulas y subtítulos encima; si el clip trae `video`, se reproduce ese archivo.

const Narrator = {
  say(s) {
    if (!S.voice || !('speechSynthesis' in window) || !s) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakable(s));
    u.lang = 'es-ES'; u.rate = 1.05;
    speechSynthesis.speak(u);
  },
  stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); },
};

// Convierte TeX sencillo en algo pronunciable.
function speakable(s) {
  return s.replace(/\*\*/g, '').replace(/\$([^$]+)\$/g, (_, m) => m
    .replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, ' $1 sobre $2 ')
    .replace(/\\sqrt\{([^}]*)\}/g, ' raíz de $1 ')
    .replace(/\^2/g, ' al cuadrado').replace(/\^\{?(\w+)\}?/g, ' a la $1 ')
    .replace(/\\(sen|sin|cos|tan)/g, (_, f) => ({ sen: ' seno ', sin: ' seno ', cos: ' coseno ', tan: ' tangente ' })[f])
    .replace(/\\theta/g, ' theta ').replace(/\\pi/g, ' pi ').replace(/\\lim/g, ' límite ')
    .replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}_\\]/g, ' ').replace(/=/g, ' igual a ')
    .replace(/\s+/g, ' '));
}

class ClipPlayer {
  constructor(host, lesson, course, opts = {}) {
    this.lesson = lesson; this.course = course; this.opts = opts;
    this.scenes = (opts.clip || lesson.clip).scenes;
    this.total = this.scenes.reduce((s, x) => s + x.d, 0);
    this.t = 0; this.cur = -1; this.playing = false;
    const el = (this.el = document.createElement('div'));
    el.className = 'clip paused' + (opts.feed ? ' in-feed' : '');
    el.style.setProperty('--c', course.color);
    el.innerHTML = `<canvas></canvas>
      <div class="clip-prog">${this.scenes.map(() => '<i><b></b></i>').join('')}</div>
      <div class="clip-head"><span class="clip-course">${esc(course.name)}</span><strong>${esc(lesson.title)}</strong></div>
      <div class="clip-title"></div><div class="clip-steps"></div><div class="clip-text"></div>
      <div class="clip-play">${ICON.play}</div>`;
    host.appendChild(el);
    this.cv = el.querySelector('canvas');
    this.ctx = this.cv.getContext('2d');
    this.bars = [...el.querySelectorAll('.clip-prog b')];
    this.$title = el.querySelector('.clip-title');
    this.$steps = el.querySelector('.clip-steps');
    this.$text = el.querySelector('.clip-text');
    this.stepEls = [];
    el.addEventListener('click', () => this.toggle());
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
  }

  resize() {
    const r = this.el.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    if (!r.width) return;
    this.W = r.width; this.H = r.height;
    this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }

  toggle() { this.playing ? this.pause() : this.play(); }

  play() {
    if (this.playing) return;
    if (this.t >= this.total) { this.t = 0; this.cur = -1; }
    this.playing = true;
    this.el.classList.remove('paused');
    this.last = performance.now();
    this.render();
    this.speak();
    this.raf = requestAnimationFrame(this.tick);
  }

  pause() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.el.classList.add('paused');
    Narrator.stop();
  }

  tick = now => {
    if (!this.playing) return;
    this.t += Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (this.t >= this.total) {
      this.opts.onEnd?.();
      if (this.opts.loop) { this.t = 0; this.cur = -1; }
      else { this.t = this.total; this.render(); this.playing = false; this.el.classList.add('paused'); return; }
    }
    this.render();
    this.raf = requestAnimationFrame(this.tick);
  };

  sceneAt(t) {
    let acc = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      const d = this.scenes[i].d;
      if (t < acc + d || i === this.scenes.length - 1) return [i, clamp01((t - acc) / d)];
      acc += d;
    }
  }

  render() {
    if (!this.W) return;
    const [i, lp] = this.sceneAt(this.t);
    if (i !== this.cur) { this.cur = i; this.showScene(i); }
    const sc = this.scenes[i], W = this.W, H = this.H;
    drawClipBg(this.ctx, W, H, this.course.color, this.t);
    // En el feed se deja libre la columna derecha de botones.
    const box = this.opts.feed
      ? { x: W * 0.07, y: H * 0.33, w: W * 0.86 - 64, h: H * 0.38 }
      : { x: W * 0.08, y: H * 0.3, w: W * 0.84, h: H * 0.4 };
    if (sc.viz) drawViz(this.ctx, sc.viz, ease(clamp01(lp / 0.8)), box);
    if (sc.steps) {
      const n = sc.steps.length, k = Math.min(n, 1 + Math.floor(lp * n * 1.25));
      this.stepEls.forEach((e, j) => e.classList.toggle('on', j < k));
    }
    this.bars.forEach((b, j) => { b.style.width = (j < i ? 100 : j > i ? 0 : lp * 100) + '%'; });
  }

  showScene(i) {
    const sc = this.scenes[i];
    this.$title.innerHTML = sc.title ? tex(sc.title) : '';
    this.$title.hidden = !sc.title;
    this.$steps.innerHTML = (sc.steps || []).map(s => `<div>${tex(s)}</div>`).join('');
    this.$steps.classList.toggle('below-title', !!sc.title);
    this.stepEls = [...this.$steps.children];
    this.$text.innerHTML = tex(sc.text);
    this.$text.classList.remove('in'); void this.$text.offsetWidth; this.$text.classList.add('in');
    if (this.playing) this.speak();
  }

  speak() {
    const sc = this.scenes[this.cur];
    if (sc) Narrator.say(sc.say || sc.text);
  }

  destroy() {
    this.pause();
    this.ro.disconnect();
    this.el.remove();
  }
}

// Controles compartidos de los videos: barra que se toca o arrastra para adelantar,
// tiempo y botones de ±10 s (visibles en pausa).
const VIDEO_UI = `
  <div class="seek" role="slider" aria-label="Posición del video"><div class="seek-track"><b></b></div></div>
  <span class="seek-time"></span>
  <div class="seek-skip">
    <button type="button" data-skip="-10" aria-label="Retroceder 10 segundos">−10 s</button>
    <button type="button" data-skip="10" aria-label="Adelantar 10 segundos">+10 s</button>
  </div>`;

// Botón redondo de audio (estilo LinkedIn Learning): bocina normal o tachada.
const MUTE_BTN = `<button class="v-mute" type="button" aria-label="Silenciar">${ICON.sound}</button>`;
function syncMuteBtn(btn, muted) {
  btn.innerHTML = muted ? ICON.mute : ICON.sound;
  btn.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar');
  btn.classList.toggle('is-muted', muted);
}

// Piñón de ajustes: velocidad (se recuerda entre videos) y, con Bunny, calidad, en un solo menú.
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const GEAR_ICON = `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const SPEED_UI = `<div class="v-speed">
    <button class="v-gear" type="button" aria-haspopup="true" aria-label="Ajustes del video">${GEAR_ICON}</button>
    <div class="v-q-menu" role="menu" hidden>
      <p class="v-set-h">Velocidad <span class="v-speed-now"></span></p>
      <div class="v-set-row v-speed-list"></div>
      <div class="v-quality" hidden>
        <p class="v-set-h">Calidad <span class="v-q-now"></span></p>
        <div class="v-set-row v-q-list"></div>
      </div>
    </div>
  </div>`;

function attachSpeed(el, apply) {
  const wrap = el.querySelector('.v-speed'), btn = wrap.querySelector('.v-gear'), menu = wrap.querySelector('.v-q-menu');
  const list = wrap.querySelector('.v-speed-list');
  const render = () => {
    const cur = S.videoSpeed || 1;
    wrap.querySelector('.v-speed-now').textContent = cur === 1 ? 'Normal' : `${cur}x`;
    list.querySelectorAll('button').forEach(b => b.classList.toggle('on', Number(b.dataset.r) === cur));
  };
  list.innerHTML = SPEEDS.map(r => `<button type="button" data-r="${r}">${r}x</button>`).join('');
  wrap.addEventListener('click', e => e.stopPropagation());
  btn.addEventListener('click', () => { menu.hidden = !menu.hidden; });
  list.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    S.videoSpeed = Number(b.dataset.r);
    save();
    apply(S.videoSpeed);
    render();
  }));
  render();
  apply(S.videoSpeed || 1);
}

function attachSeek(el, api) {
  const zone = el.querySelector('.seek'), bar = zone.querySelector('b'), label = el.querySelector('.seek-time');
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const show = t => {
    const d = api.duration();
    if (!d) return;
    bar.style.width = (100 * t) / d + '%';
    label.textContent = `${mmss(t)} / ${mmss(d)}`;
  };
  const timeAt = e => {
    const r = zone.getBoundingClientRect();
    return clamp01((e.clientX - r.left) / r.width) * api.duration();
  };
  let dragging = false;
  zone.addEventListener('pointerdown', e => {
    e.stopPropagation();
    if (!api.duration()) return;
    dragging = true;
    zone.setPointerCapture(e.pointerId);
    el.classList.add('seeking');
    show(timeAt(e));
  });
  zone.addEventListener('pointermove', e => { if (dragging) show(timeAt(e)); });
  zone.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('seeking');
    api.seek(timeAt(e));
  });
  zone.addEventListener('click', e => e.stopPropagation());
  el.querySelectorAll('[data-skip]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const t = Math.min(api.duration(), Math.max(0, api.time() + Number(b.dataset.skip)));
    api.seek(t);
    show(t);
  }));
  return { update: () => { if (!dragging) show(api.time()); } };
}

// hls.js reproduce los videos por partes (HLS) de Bunny Stream con varias calidades.
let hlsLib = null;
function loadHls() {
  hlsLib ??= new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js';
    s.onload = () => resolve(window.Hls);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return hlsLib;
}

const MAX_QUALITY = 1080;

// Variante para videos propios: un .mp4 (clip.video) o un video de Bunny Stream
// (clip.bunny = '<id del video>'). El video ya trae su encabezado y sus subtítulos;
// aquí van la barra para adelantar, el botón de sonido y, con Bunny, el de calidad.
class VideoClip {
  constructor(host, lesson, course, opts = {}) {
    this.opts = opts;
    this.wantPlay = false;
    const clip = opts.clip || lesson.clip;
    const base = clip.bunny ? `https://${BUNNY_CDN}/${clip.bunny}` : '';
    const src = clip.bunny ? `${base}/playlist.m3u8` : clip.video;
    const el = (this.el = document.createElement('div'));
    // En la lección no hay miniatura: mientras carga se ve la rueda (.clip-loading) sobre fondo liso,
    // y no una imagen fija que luego salta al video. En el feed de Clips la miniatura sí ayuda a hojear.
    el.className = 'clip paused is-video' + (opts.feed ? ' in-feed' : ' loading');
    el.style.setProperty('--c', course.color);
    el.innerHTML = `<video playsinline preload="metadata"${opts.feed && base ? ` poster="${esc(base)}/thumbnail.jpg"` : ''}></video>
      <div class="clip-loading" role="status" aria-label="Cargando video"><i></i></div>
      <div class="clip-play">${ICON.play}</div>${VIDEO_UI}${MUTE_BTN}${SPEED_UI}`;
    host.appendChild(el);
    this.v = el.querySelector('video');
    this.muteBtn = el.querySelector('.v-mute');
    // Con sonido por defecto; si el navegador lo bloquea, play() arranca en silencio.
    this.v.muted = !!S.videoMuted;
    syncMuteBtn(this.muteBtn, this.v.muted);
    const seek = attachSeek(el, {
      duration: () => this.v.duration || 0,
      time: () => this.v.currentTime,
      seek: t => { this.v.currentTime = t; },
    });
    this.v.addEventListener('timeupdate', seek.update);
    this.v.addEventListener('volumechange', () => syncMuteBtn(this.muteBtn, this.v.muted));
    const setRate = r => { this.v.defaultPlaybackRate = r; this.v.playbackRate = r; };
    attachSpeed(el, setRate);
    this.v.addEventListener('loadedmetadata', () => setRate(S.videoSpeed || 1));
    // Arranque automático: si play() se pidió antes de que el video estuviera listo (HLS carga
    // aparte) o el navegador lo pospuso, se vuelve a intentar en cuanto se puede reproducir.
    this.v.addEventListener('canplay', () => { if (this.wantPlay && this.v.paused) this.play(); });
    // La rueda se ve desde que se pide reproducir hasta el primer cuadro en movimiento, y vuelve si
    // el video se queda esperando datos (conexión lenta).
    const loading = on => this.el.classList.toggle('loading', on);
    this.v.addEventListener('playing', () => loading(false));
    this.v.addEventListener('waiting', () => loading(this.wantPlay && !this.opts.feed));
    // Si el video no carga, quien creó el reproductor puede cambiarlo por las escenas de respaldo (opts.onFail).
    this.v.addEventListener('error', () => { this.stall(); opts.onFail?.(); });
    this.v.addEventListener('ended', () => {
      opts.onEnd?.();
      if (opts.loop) { this.v.currentTime = 0; this.play(); } else this.el.classList.add('paused');
    });
    this.muteBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.v.muted = !this.v.muted;
      S.videoMuted = this.v.muted;
      save();
    });
    el.addEventListener('click', () => this.toggle());
    if (/\.m3u8($|\?)/.test(src)) this.attachHls(src); else this.v.src = src;
  }

  // hls.js se carga con la app (index.html), así el video arranca en el mismo toque que abre
  // la clase y el navegador permite el sonido. Si aún no está, se carga aquí.
  attachHls(src) {
    if (window.Hls) return this.setupHls(window.Hls, src);
    loadHls().then(Hls => this.setupHls(Hls, src), () => this.setupHls(null, src));
  }

  setupHls(Hls, src) {
    if (this.dead) return;
    if (Hls?.isSupported()) {
      this.hls = new Hls({ maxMaxBufferLength: 60 });
      this.hls.loadSource(src);
      this.hls.attachMedia(this.v);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.setupQuality());
      this.hls.on(Hls.Events.LEVEL_SWITCHED, () => this.showQuality());
      // Sin red o sin el video, hls.js no dispara 'error' en el <video>: se avisa aquí.
      this.hls.on(Hls.Events.ERROR, (_, d) => { if (d.fatal) this.stall(); });
    } else {
      // Safari en iPhone reproduce HLS por sí mismo; ahí la calidad es siempre automática.
      this.v.src = src;
    }
    if (this.wantPlay) this.play();
  }

  // Calidad "p" de un nivel: el nombre que le da Bunny (1080p/video.m3u8) o, si no, el lado
  // corto de la imagen (en un video vertical 1080 × 1920 es 1080p, no 1920p).
  qualityOf(level) {
    const named = String(level.url?.[0] ?? level.url ?? '').match(/(\d{3,4})p\//);
    if (named) return Number(named[1]);
    return Math.min(level.width || level.height, level.height || level.width) || 0;
  }

  // Una opción por calidad (hasta 1080p), de mayor a menor, más "Automática".
  setupQuality() {
    const best = new Map();
    this.hls.levels.forEach((l, i) => {
      const q = this.qualityOf(l);
      if (!q || q > MAX_QUALITY) return;
      if (!best.has(q) || l.bitrate > this.hls.levels[best.get(q)].bitrate) best.set(q, i);
    });
    this.levels = [...best].sort((a, b) => b[0] - a[0]).map(([height, index]) => ({ height, index }));
    if (!this.levels.length) return;
    const maxIndex = Math.max(...this.levels.map(l => l.index));
    this.hls.autoLevelCapping = maxIndex;
    const menu = this.el.querySelector('.v-quality .v-q-list');
    menu.innerHTML = [`<button type="button" data-q="auto">Auto</button>`,
      ...this.levels.map(l => `<button type="button" data-q="${l.height}">${l.height}p</button>`)].join('');
    menu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      S.videoQuality = b.dataset.q === 'auto' ? 'auto' : Number(b.dataset.q);
      save();
      this.applyQuality();
    }));
    this.applyQuality();
    this.el.querySelector('.v-quality').hidden = this.levels.length < 2;
  }

  applyQuality() {
    const pick = this.levels.find(l => l.height === S.videoQuality);
    this.hls.currentLevel = pick ? pick.index : -1;
    this.showQuality();
  }

  showQuality() {
    if (!this.hls || !this.levels) return;
    const auto = this.hls.autoLevelEnabled;
    const level = this.hls.levels[this.hls.currentLevel];
    const now = level && this.qualityOf(level);
    this.el.querySelector('.v-quality .v-q-now').textContent = auto ? `Auto${now ? ` · ${now}p` : ''}` : `${now}p`;
    this.el.querySelectorAll('.v-quality .v-q-list button').forEach(b => {
      b.classList.toggle('on', auto ? b.dataset.q === 'auto' : Number(b.dataset.q) === now);
    });
  }

  get playing() { return !this.v.paused; }
  toggle() { this.playing ? this.pause() : this.play(); }

  play() {
    this.wantPlay = true;
    this.v.autoplay = true;
    this.el.classList.remove('paused');
    if (!this.opts.feed && (this.v.paused || this.v.readyState < 3)) this.el.classList.add('loading');
    this.v.play().catch(e => {
      // Si el navegador bloquea el sonido, arranca en silencio y ofrece activarlo.
      // Si ni en silencio deja arrancar, se quita la rueda y queda el botón de reproducir.
      const blocked = er => { if (er?.name === 'NotAllowedError') this.pause(); };
      if (this.v.muted || !this.wantPlay) return blocked(e);
      this.v.muted = true; this.v.play().catch(blocked);
    });
  }

  // El video no pudo cargar: sin rueda, con el botón de reproducir para reintentar.
  stall() { this.wantPlay = false; this.el.classList.remove('loading'); this.el.classList.add('paused'); }

  pause() { this.wantPlay = false; this.v.autoplay = false; this.v.pause(); this.el.classList.add('paused'); this.el.classList.remove('loading'); }
  speak() {}

  destroy() {
    this.dead = true;
    this.pause();
    this.hls?.destroy();
    this.v.removeAttribute('src');
    this.v.load();
    this.el.remove();
  }
}

// Variante para videos de YouTube (clip: { youtube: '<id>' }). Usa el reproductor
// oficial sin controles; el iframe se agranda dentro de un marco con overflow oculto
// para recortar la franja de arriba (avatar y título del canal) y la de abajo
// (logo), y una capa transparente encima evita que esa interfaz aparezca al tocar.
let ytApi = null;
function loadYouTubeApi() {
  if (!ytApi) {
    ytApi = new Promise(resolve => {
      if (window.YT?.Player) return resolve();
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
  }
  return ytApi;
}

class YouTubeClip {
  constructor(host, lesson, course, opts = {}) {
    this.opts = opts;
    this.wantPlay = false;
    this.player = null;
    const el = (this.el = document.createElement('div'));
    el.className = 'clip paused is-video is-youtube' + (opts.feed ? ' in-feed' : '');
    el.style.setProperty('--c', course.color);
    el.innerHTML = `<div class="yt-crop"><div class="yt-frame"></div></div>
      <div class="yt-shield"></div>
      <div class="clip-play">${ICON.play}</div>${VIDEO_UI}${MUTE_BTN}${SPEED_UI}`;
    host.appendChild(el);
    this.seekUi = attachSeek(el, {
      duration: () => this.player?.getDuration?.() || 0,
      time: () => this.player?.getCurrentTime?.() || 0,
      seek: t => {
        this.player.seekTo(t, true);
        if (el.classList.contains('ended')) this.play();
      },
    });
    this.muteBtn = el.querySelector('.v-mute');
    syncMuteBtn(this.muteBtn, !!S.videoMuted);
    attachSpeed(el, r => this.player?.setPlaybackRate?.(r));
    el.querySelector('.yt-shield').addEventListener('click', () => this.toggle());
    this.muteBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (!this.player?.isMuted) return;
      const muted = !this.player.isMuted();
      muted ? this.player.mute() : this.player.unMute();
      S.videoMuted = muted;
      save();
      syncMuteBtn(this.muteBtn, muted);
    });
    // El video 9:16 se ve completo (sin cortar los bordes) y el iframe tiene 64 px extra
    // arriba y abajo (franjas donde YouTube pinta avatar, título y logo), que quedan fuera.
    this.layout = () => {
      const f = el.querySelector('.yt-crop iframe');
      const { width: W, height: H } = el.getBoundingClientRect();
      if (!f || !W) return;
      const vw = Math.min(W, (H * 9) / 16), vh = (vw * 16) / 9;
      // El marco recortado mide justo lo que el video; el iframe sobresale 64 px por arriba y por abajo.
      Object.assign(el.querySelector('.yt-crop').style, {
        width: vw + 'px', height: vh + 'px', left: (W - vw) / 2 + 'px', top: (H - vh) / 2 + 'px',
      });
      Object.assign(f.style, { width: vw + 'px', height: vh + 128 + 'px', left: '0px', top: '-64px' });
    };
    this.ro = new ResizeObserver(this.layout);
    this.ro.observe(el);
    loadYouTubeApi().then(() => {
      if (this.dead) return;
      this.player = new YT.Player(el.querySelector('.yt-frame'), {
        videoId: (opts.clip || lesson.clip).youtube,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3,
          disablekb: 1, fs: 0, cc_load_policy: 0, origin: location.origin,
        },
        events: {
          onReady: () => {
            el.classList.add('ready');
            this.layout();
            if (S.videoMuted) this.player.mute();
            this.player.setPlaybackRate(S.videoSpeed || 1);
            if (this.wantPlay) this.play();
          },
          onStateChange: e => this.onState(e.data),
        },
      });
    });
  }

  get playing() { return this.player?.getPlayerState?.() === 1; }
  toggle() { this.wantPlay ? this.pause() : this.play(); }

  play() {
    this.wantPlay = true;
    this.el.classList.remove('paused', 'ended');
    if (!this.player?.playVideo) return;
    this.player.playVideo();
    // Si el navegador bloquea la reproducción con sonido, arranca en silencio y ofrece activarlo.
    clearTimeout(this.autoplayCheck);
    this.autoplayCheck = setTimeout(() => {
      if (this.wantPlay && !this.dead && this.player.getPlayerState() !== 1) {
        this.player.mute();
        this.player.playVideo();
        syncMuteBtn(this.muteBtn, true);
      }
    }, 900);
  }

  pause() {
    this.wantPlay = false;
    this.el.classList.add('paused');
    this.player?.pauseVideo?.();
  }

  onState(state) {
    clearInterval(this.ticker);
    if (state === 1) {
      this.el.classList.remove('paused', 'ended');
      syncMuteBtn(this.muteBtn, this.player.isMuted());
      this.ticker = setInterval(this.seekUi.update, 250);
    } else if (state === 2) {
      this.seekUi.update();
    } else if (state === 0) {
      this.seekUi.update();
      this.opts.onEnd?.();
      if (this.opts.loop) { this.player.seekTo(0); this.player.playVideo(); }
      else { this.wantPlay = false; this.el.classList.add('paused', 'ended'); }
    }
  }

  speak() {}

  destroy() {
    this.dead = true;
    this.wantPlay = false;
    clearInterval(this.ticker);
    clearTimeout(this.autoplayCheck);
    this.ro.disconnect();
    this.player?.destroy?.();
    this.el.remove();
  }
}

const makePlayer = (host, lesson, course, opts) =>
  // opts.clip elige uno de los videos de la lección (ver clipsOf); por defecto, el primero.
  (opts.clip || lesson.clip).youtube ? new YouTubeClip(host, lesson, course, opts)
    : (opts.clip || lesson.clip).video || (opts.clip || lesson.clip).bunny ? new VideoClip(host, lesson, course, opts)
      : new ClipPlayer(host, lesson, course, opts);
