// Carga scripts del navegador (sin módulos) en un contexto aislado de Node para probar su lógica.
// Las constantes de nivel superior de cada script quedan visibles con get(ctx, 'NOMBRE').
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadScripts(files) {
  const doc = { createElement: () => ({}), head: { appendChild() {} } };
  const ctx = vm.createContext({ document: doc, console, Math, setTimeout, clearTimeout });
  ctx.window = ctx;
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  return ctx;
}

const get = (ctx, name) => vm.runInContext(name, ctx);

// Carga el kit y un juego, y devuelve el registro GAMES.
function loadGame(file) {
  return get(loadScripts(['js/games/kit.js', file]), 'GAMES');
}

module.exports = { loadScripts, loadGame, get, ROOT };
