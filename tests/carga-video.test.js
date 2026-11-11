// Mientras carga el video de una lección se ve una rueda de carga sobre fondo liso, no la miniatura de
// Bunny (que aparecía como imagen fija y luego saltaba al video). En el feed de Clips la miniatura sigue.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const player = read('js/player.js'), css = read('css/styles.css');
const videoClip = player.slice(player.indexOf('class VideoClip'), player.indexOf('class YouTubeClip') > 0 ? player.indexOf('class YouTubeClip') : undefined);

test('la miniatura (poster) solo se usa en el feed, no en la lección', () => {
  assert.match(videoClip, /opts\.feed\s*&&\s*base/, 'el poster depende de opts.feed');
});

test('el reproductor de video tiene una rueda de carga', () => {
  assert.ok(videoClip.includes('class="clip-loading"'), 'falta el elemento .clip-loading');
  assert.match(videoClip, /classList\.(add|toggle)\('loading'/, 'el clip se marca con la clase loading');
  assert.match(videoClip, /'playing'/, 'la rueda se quita cuando el video empieza (evento playing)');
  assert.match(videoClip, /'waiting'/, 'la rueda vuelve si el video se queda esperando datos');
});

test('la rueda nunca queda girando para siempre: autoplay bloqueado o red caída dejan el botón de play', () => {
  assert.match(videoClip, /if \(this\.v\.muted \|\| !this\.wantPlay\) return blocked\(e\)/, 'bloqueo con el video ya en silencio');
  assert.match(videoClip, /Hls\.Events\.ERROR[\s\S]{0,120}fatal[\s\S]{0,120}this\.stall\(\)/, 'error fatal de hls.js quita la rueda');
  assert.match(videoClip, /addEventListener\('error', \(\) => this\.stall\(\)\)/, 'error del <video> deja el botón de play');
  assert.match(videoClip, /stall\(\)\s*\{[^}]*remove\('loading'\)[^}]*add\('paused'\)/, 'stall quita la rueda y muestra el play');
});

test('en el feed de Clips no sale la rueda (tiene miniatura y repite en bucle)', () => {
  assert.match(videoClip, /!this\.opts\.feed\s*&&\s*\(this\.v\.paused/, 'play() no marca loading en el feed');
});

test('la rueda gira, usa colores del tema y respeta el movimiento reducido', () => {
  assert.match(css, /\.clip\.loading \.clip-loading\s*\{[^}]*opacity:\s*1/, 'visible solo con .loading');
  assert.match(css, /@keyframes spin\b/, 'animación spin');
  assert.match(css, /\.clip-loading[^{]*\{[^}]*var\(--c/, 'el arco usa el color del curso');
  assert.match(css, /prefers-reduced-motion[^{]*\{[^@]*clip-loading/, 'con movimiento reducido gira más despacio o no gira');
  assert.match(css, /\.clip\.loading \.clip-play\s*\{[^}]*opacity:\s*0/, 'mientras carga no se muestra el botón de play');
});
