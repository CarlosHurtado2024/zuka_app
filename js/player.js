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
    this.scenes = lesson.clip.scenes;
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
    const clip = lesson.clip;
    const base = clip.bunny ? `https://${BUNNY_CDN}/${clip.bunny}` : '';
    const src = clip.bunny ? `${base}/playlist.m3u8` : clip.video;
    const el = (this.el = document.createElement('div'));
    el.className = 'clip paused is-video' + (opts.feed ? ' in-feed' : '');
    el.style.setProperty('--c', course.color);
    el.innerHTML = `<video playsinline preload="metadata"${opts.feed ? ' muted' : ''}${base ? ` poster="${esc(base)}/thumbnail.jpg"` : ''}></video>
      <div class="clip-play">${ICON.play}</div>${VIDEO_UI}
      <button class="v-sound" type="button" hidden>${ICON.mute}<span>Activar sonido</span></button>
      <div class="v-quality" hidden>
        <button class="v-q-btn" type="button" aria-haspopup="true">Auto</button>
        <div class="v-q-menu" role="menu" hidden></div>
      </div>`;
    host.appendChild(el);
    this.v = el.querySelector('video');
    this.sound = el.querySelector('.v-sound');
    const seek = attachSeek(el, {
      duration: () => this.v.duration || 0,
      time: () => this.v.currentTime,
      seek: t => { this.v.currentTime = t; },
    });
    this.v.addEventListener('timeupdate', seek.update);
    this.v.addEventListener('play', () => { this.sound.hidden = !this.v.muted; });
    this.v.addEventListener('ended', () => {
      opts.onEnd?.();
      if (opts.loop) { this.v.currentTime = 0; this.play(); } else this.el.classList.add('paused');
    });
    this.sound.addEventListener('click', e => { e.stopPropagation(); this.v.muted = false; this.sound.hidden = true; });
    el.querySelector('.v-quality').addEventListener('click', e => e.stopPropagation());
    el.querySelector('.v-q-btn').addEventListener('click', () => {
      const menu = el.querySelector('.v-q-menu');
      menu.hidden = !menu.hidden;
    });
    el.addEventListener('click', () => this.toggle());
    if (/\.m3u8($|\?)/.test(src)) this.attachHls(src); else this.v.src = src;
  }

  async attachHls(src) {
    let Hls = null;
    try { Hls = await loadHls(); } catch (e) { /* sin hls.js: se intenta HLS nativo */ }
    if (this.dead) return;
    if (Hls?.isSupported()) {
      this.hls = new Hls({ maxMaxBufferLength: 60 });
      this.hls.loadSource(src);
      this.hls.attachMedia(this.v);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.setupQuality());
      this.hls.on(Hls.Events.LEVEL_SWITCHED, () => this.showQuality());
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
    const menu = this.el.querySelector('.v-q-menu');
    menu.innerHTML = [`<button type="button" data-q="auto">Automática</button>`,
      ...this.levels.map(l => `<button type="button" data-q="${l.height}">${l.height}p</button>`)].join('');
    menu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      S.videoQuality = b.dataset.q === 'auto' ? 'auto' : Number(b.dataset.q);
      save();
      this.applyQuality();
      menu.hidden = true;
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
    this.el.querySelector('.v-q-btn').textContent = auto ? `Auto${now ? ` · ${now}p` : ''}` : `${now}p`;
    this.el.querySelectorAll('.v-q-menu button').forEach(b => {
      b.classList.toggle('on', auto ? b.dataset.q === 'auto' : Number(b.dataset.q) === now);
    });
  }

  get playing() { return !this.v.paused; }
  toggle() { this.playing ? this.pause() : this.play(); }

  play() {
    this.wantPlay = true;
    this.el.classList.remove('paused');
    this.v.play().catch(() => {
      // Si el navegador bloquea el sonido, arranca en silencio y ofrece activarlo.
      if (!this.v.muted && this.wantPlay) { this.v.muted = true; this.v.play().catch(() => {}); }
    });
  }

  pause() { this.wantPlay = false; this.v.pause(); this.el.classList.add('paused'); }
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
      <div class="clip-play">${ICON.play}</div>${VIDEO_UI}
      <button class="yt-sound" type="button" hidden>${ICON.mute}<span>Activar sonido</span></button>`;
    host.appendChild(el);
    this.seekUi = attachSeek(el, {
      duration: () => this.player?.getDuration?.() || 0,
      time: () => this.player?.getCurrentTime?.() || 0,
      seek: t => {
        this.player.seekTo(t, true);
        if (el.classList.contains('ended')) this.play();
      },
    });
    this.soundBtn = el.querySelector('.yt-sound');
    el.querySelector('.yt-shield').addEventListener('click', () => this.toggle());
    this.soundBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.player?.unMute();
      this.soundBtn.hidden = true;
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
        videoId: lesson.clip.youtube,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3,
          disablekb: 1, fs: 0, cc_load_policy: 0, origin: location.origin,
        },
        events: {
          onReady: () => { el.classList.add('ready'); this.layout(); if (this.wantPlay) this.play(); },
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
        this.soundBtn.hidden = false;
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
      if (this.player.isMuted()) this.soundBtn.hidden = false;
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
  lesson.clip.youtube ? new YouTubeClip(host, lesson, course, opts)
    : lesson.clip.video || lesson.clip.bunny ? new VideoClip(host, lesson, course, opts)
      : new ClipPlayer(host, lesson, course, opts);
