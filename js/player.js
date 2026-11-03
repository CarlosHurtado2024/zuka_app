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

// Variante para clips grabados (mp4/webm) con la misma interfaz. El video ya trae
// su encabezado y sus subtítulos, así que aquí solo va la barra de progreso.
class VideoClip {
  constructor(host, lesson, course, opts = {}) {
    this.opts = opts;
    const el = (this.el = document.createElement('div'));
    el.className = 'clip paused is-video' + (opts.feed ? ' in-feed' : '');
    el.style.setProperty('--c', course.color);
    el.innerHTML = `<video src="${esc(lesson.clip.video)}" playsinline muted preload="metadata"></video>
      <div class="clip-prog"><i><b></b></i></div>
      <div class="clip-play">${ICON.play}</div>`;
    host.appendChild(el);
    this.v = el.querySelector('video');
    const bar = el.querySelector('.clip-prog b');
    this.v.addEventListener('timeupdate', () => {
      if (this.v.duration) bar.style.width = (100 * this.v.currentTime) / this.v.duration + '%';
    });
    this.v.addEventListener('ended', () => {
      opts.onEnd?.();
      if (opts.loop) { this.v.currentTime = 0; this.play(); } else this.el.classList.add('paused');
    });
    el.addEventListener('click', () => this.toggle());
  }
  get playing() { return !this.v.paused; }
  toggle() { this.playing ? this.pause() : this.play(); }
  play() { this.v.play().catch(() => {}); this.el.classList.remove('paused'); }
  pause() { this.v.pause(); this.el.classList.add('paused'); }
  speak() {}
  destroy() { this.pause(); this.v.removeAttribute('src'); this.v.load(); this.el.remove(); }
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
      <div class="clip-prog"><i><b></b></i></div>
      <div class="clip-play">${ICON.play}</div>
      <button class="yt-sound" type="button" hidden>${ICON.mute}<span>Activar sonido</span></button>`;
    host.appendChild(el);
    this.bar = el.querySelector('.clip-prog b');
    this.soundBtn = el.querySelector('.yt-sound');
    el.querySelector('.yt-shield').addEventListener('click', () => this.toggle());
    this.soundBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.player?.unMute();
      this.soundBtn.hidden = true;
    });
    // Tamaño "cover": el video 9:16 llena el marco y el iframe tiene 64 px extra arriba
    // y abajo (franjas donde YouTube pinta avatar, título y logo), que quedan fuera.
    this.layout = () => {
      const f = el.querySelector('.yt-crop iframe');
      const { width: W, height: H } = el.getBoundingClientRect();
      if (!f || !W) return;
      const vh = Math.max(H, (W * 16) / 9), vw = (vh * 9) / 16;
      Object.assign(f.style, {
        width: vw + 'px', height: vh + 128 + 'px',
        left: (W - vw) / 2 + 'px', top: (H - vh) / 2 - 64 + 'px',
      });
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
      this.ticker = setInterval(() => {
        const d = this.player.getDuration();
        if (d) this.bar.style.width = (100 * this.player.getCurrentTime()) / d + '%';
      }, 250);
    } else if (state === 0) {
      this.bar.style.width = '100%';
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
    : lesson.clip.video ? new VideoClip(host, lesson, course, opts)
      : new ClipPlayer(host, lesson, course, opts);
