// Pestaña Tutorías: cupos de un tutor, separar y cancelar una asesoría, etiquetas y registro en la app.
// Diseño: docs/superpowers/specs/2026-11-12-tutorias.md.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadScripts, get, ROOT } = require('./load');

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = loadScripts(['js/tutorias.js']);
const g = n => get(ctx, n);
const TUTORS = g('TUTORS'), CFG = g('TUTORIAS');
const tutorDays = g('tutorDays'), nextFree = g('nextFree'), bookTutoria = g('bookTutoria');
const activeTutorias = g('activeTutorias'), cancelTutoria = g('cancelTutoria');
const dayLabel = g('dayLabel'), hourLabel = g('hourLabel'), tutorsFor = g('tutorsFor');
const tutoriaText = g('tutoriaText'), tutoriaLink = g('tutoriaLink');

// Jueves 12 de noviembre de 2026, 3:30 p. m. (hora local).
const at = (d, h, m = 0) => new Date(2026, 10, d, h, m).getTime();
const NOW = at(12, 15, 30);
// Tutor de prueba: jueves (4) a las 4, 5 y 6 p. m.; lunes (1) a las 9 a. m.
const T = { id: 't1', name: 'Ana Ruiz', courses: ['algebra', 'trig'], mins: 45, hours: { 4: ['16:00', '17:00', '18:00'], 1: ['09:00'] } };
const all = [T];
const req = (o = {}) => ({ tutor: 't1', date: '2026-11-12', time: '17:00', course: 'algebra', topic: 'regla de tres', ...o });

test('tutorDays da los próximos 7 días con los cupos de cada uno', () => {
  const days = tutorDays(T, NOW, []);
  assert.equal(days.length, 7);
  assert.equal(days.map(d => d.date).join(), '2026-11-12,2026-11-13,2026-11-14,2026-11-15,2026-11-16,2026-11-17,2026-11-18');
  assert.equal(days[4].slots.map(s => s.time).join(), '09:00', 'el lunes');
  assert.equal(days[1].slots.length, 0, 'el viernes no atiende');
});

test('hoy solo quedan los cupos con una hora de anticipación', () => {
  // Son las 3:30: el de las 4:00 ya no se puede separar; 5:00 y 6:00 sí.
  assert.equal(tutorDays(T, NOW, [])[0].slots.map(s => s.time).join(), '17:00,18:00');
  assert.equal(tutorDays(T, at(12, 15, 0), [])[0].slots.map(s => s.time).join(), '16:00,17:00,18:00', 'justo una hora antes sí');
  assert.equal(tutorDays(T, at(12, 20), [])[0].slots.length, 0);
});

test('un cupo que choca con otra asesoría del estudiante sale ocupado', () => {
  const mine = [{ id: 'a', tutor: 'otro', date: '2026-11-12', time: '17:00', mins: 45 }];
  const s = tutorDays(T, NOW, mine)[0].slots;
  assert.equal(s.map(x => `${x.time}:${x.free}`).join(), '17:00:false,18:00:true');
});

test('nextFree es el primer cupo libre', () => {
  assert.equal(JSON.stringify(nextFree(T, NOW, [])), JSON.stringify({ date: '2026-11-12', time: '17:00' }));
  assert.equal(nextFree(T, at(12, 20), []).date, '2026-11-16');
  assert.equal(nextFree({ ...T, hours: {} }, NOW, []), null);
});

test('separar una asesoría la guarda con sus datos y no cambia la lista original', () => {
  const mine = [];
  const r = bookTutoria(mine, req({ topic: '  regla de tres  ' }), NOW, all);
  assert.equal(r.ok, true);
  assert.equal(mine.length, 0);
  assert.equal(r.list.length, 1);
  const b = r.booking;
  assert.equal([b.tutor, b.date, b.time, b.mins, b.course, b.topic, b.made].join('|'), `t1|2026-11-12|17:00|45|algebra|regla de tres|${NOW}`);
  assert.ok(b.id);
});

test('no se separa lo que no existe, lo que ya pasó, lo que choca ni más del tope', () => {
  const err = (mine, o, now = NOW) => bookTutoria(mine, req(o), now, all).error;
  assert.equal(err([], { tutor: 'nadie' }), 'tutor');
  assert.equal(err([], { time: '15:00' }), 'slot', 'ese tutor no atiende a esa hora');
  assert.equal(err([], { time: '16:00' }), 'slot', 'falta menos de una hora');
  assert.equal(err([], { date: '2026-11-19', time: '17:00' }), 'slot', 'más allá de los 7 días');
  assert.equal(err([], { course: 'fis' }), 'course', 'ese tutor no enseña ese curso');
  const one = bookTutoria([], req(), NOW, all).list;
  assert.equal(err(one, {}), 'busy');
  const three = [0, 1, 2].map(i => ({ id: 'x' + i, tutor: 'z', date: '2026-11-14', time: `1${i}:00`, mins: 45 }));
  assert.equal(err(three, {}), 'max');
  assert.equal(CFG.max, 3);
  // Las que ya terminaron no cuentan para el tope.
  const old = [0, 1, 2].map(i => ({ id: 'o' + i, tutor: 'z', date: '2026-11-10', time: `1${i}:00`, mins: 45 }));
  assert.equal(bookTutoria(old, req(), NOW, all).ok, true);
});

test('el texto de lo que quiere repasar se recorta a 140 letras', () => {
  assert.equal(bookTutoria([], req({ topic: 'x'.repeat(300) }), NOW, all).booking.topic.length, 140);
  assert.equal(bookTutoria([], req({ topic: undefined }), NOW, all).booking.topic, '');
});

test('las asesorías pendientes salen en orden y desaparecen cuando terminan', () => {
  const mine = [
    { id: 'b', tutor: 't1', date: '2026-11-16', time: '09:00', mins: 45 },
    { id: 'a', tutor: 't1', date: '2026-11-12', time: '15:00', mins: 45 },   // empezó 3:00, termina 3:45
    { id: 'c', tutor: 't1', date: '2026-11-11', time: '17:00', mins: 45 },   // ayer
  ];
  assert.equal(activeTutorias(mine, NOW).map(b => b.id).join(), 'a,b', 'la que está en curso sigue visible');
  assert.equal(activeTutorias(mine, at(12, 15, 45)).map(b => b.id).join(), 'b');
  assert.equal(activeTutorias(undefined, NOW).length, 0);
});

test('datos dañados del almacenamiento no rompen nada: se descartan', () => {
  const bad = [null, 'x', { id: 'a' }, { id: 'b', date: '2026-11-13' }, { id: 'c', date: 'ayer', time: '17:00' },
    { id: 'ok', tutor: 't1', date: '2026-11-13', time: '10:00' }];
  assert.equal(activeTutorias(bad, NOW).map(b => b.id).join(), 'ok', 'sin mins dura 45');
  for (const junk of [{}, 'x', 7, null]) {
    assert.equal(activeTutorias(junk, NOW).length, 0);
    assert.equal(tutorDays(T, NOW, junk)[0].slots.length, 2);
    assert.equal(bookTutoria(junk, req(), NOW, all).list.length, 1);
    assert.equal(cancelTutoria(junk, 'a').length, 0);
  }
  assert.equal(bookTutoria(bad, req(), NOW, all).list.length, 2, 'al separar solo queda lo válido');
});

test('el choque es por intervalo: pegadas no chocan, montadas sí', () => {
  const free = mine => tutorDays(T, NOW, mine)[0].slots.map(s => s.free).join();
  assert.equal(free([{ id: 'a', date: '2026-11-12', time: '16:30', mins: 30 }]), 'true,true', 'termina justo a las 5:00');
  assert.equal(free([{ id: 'a', date: '2026-11-12', time: '16:30', mins: 45 }]), 'false,true');
  assert.equal(free([{ id: 'a', date: '2026-11-12', time: '17:30', mins: 45 }]), 'false,false', '5:30 a 6:15 toca los dos cupos');
});

test('los días siguen bien al cruzar fin de año', () => {
  const d = tutorDays(T, new Date(2026, 11, 29, 8).getTime(), []);
  assert.equal(d.map(x => x.date).slice(2, 5).join(), '2026-12-31,2027-01-01,2027-01-02');
  assert.equal(dayLabel('2027-01-04', new Date(2026, 11, 29, 8).getTime()), 'lun 4 ene');
});

test('cancelar quita solo esa asesoría', () => {
  const mine = [{ id: 'a' }, { id: 'b' }];
  assert.equal(cancelTutoria(mine, 'a').map(b => b.id).join(), 'b');
  assert.equal(mine.length, 2);
});

test('etiquetas de día y de hora en español', () => {
  assert.equal(dayLabel('2026-11-12', NOW), 'Hoy');
  assert.equal(dayLabel('2026-11-13', NOW), 'Mañana');
  assert.equal(dayLabel('2026-11-16', NOW), 'lun 16 nov');
  assert.equal(dayLabel('2026-11-12', at(12, 23, 59)), 'Hoy');
  assert.equal(hourLabel('09:00'), '9:00 a. m.');
  assert.equal(hourLabel('12:30'), '12:30 p. m.');
  assert.equal(hourLabel('16:00'), '4:00 p. m.');
  assert.equal(hourLabel('00:15'), '12:15 a. m.');
});

test('el aviso por WhatsApp lleva tutor, día, hora y tema; sin número no hay enlace', () => {
  const b = bookTutoria([], req(), NOW, all).booking;
  const txt = tutoriaText(b, T, 'Sara', 'Álgebra', NOW);
  for (const part of ['Sara', 'Ana Ruiz', 'Hoy', '5:00 p. m.', 'Álgebra', 'regla de tres']) assert.ok(txt.includes(part), part);
  assert.equal(tutoriaLink(txt, ''), '');
  assert.equal(tutoriaLink('hola & chao', '57 300-123'), 'https://wa.me/57300123?text=hola%20%26%20chao');
});

test('los tutores están bien escritos: cursos que existen, horas válidas y algún cupo en la semana', () => {
  const courses = ['algebra', 'trig', 'calc', 'geo', 'fis', 'int', 'lin'];
  assert.ok(TUTORS.length >= 3);
  assert.equal(new Set(TUTORS.map(t => t.id)).size, TUTORS.length);
  for (const t of TUTORS) {
    assert.ok(t.name && t.role && t.bio && /^#[0-9a-f]{6}$/i.test(t.color), t.id);
    assert.ok(t.bio.length <= 110, `${t.id}: bio de ${t.bio.length} letras`);
    assert.ok(t.courses.length && t.courses.every(c => courses.includes(c)), `${t.id}: cursos`);
    assert.ok(t.mins >= 20 && t.mins <= 60);
    const times = Object.entries(t.hours);
    assert.ok(times.length, `${t.id}: sin horario`);
    for (const [dow, hs] of times) {
      assert.ok(+dow >= 0 && +dow <= 6);
      assert.ok(hs.length && hs.every(h => /^([01]\d|2[0-3]):[0-5]\d$/.test(h)), `${t.id}: horas del día ${dow}`);
      assert.equal(hs.join(), [...hs].sort().join(), `${t.id}: horas en orden`);
    }
    assert.ok(nextFree(t, NOW, []), `${t.id}: sin cupos esta semana`);
    if (t.link) assert.match(t.link, /^https:\/\//);
  }
  for (const c of ['algebra', 'trig', 'calc']) assert.ok(tutorsFor(c).length, `nadie enseña ${c}`);
  assert.equal(tutorsFor('all').length, TUTORS.length);
});

test('mientras sean tutores de ejemplo, la pestaña lo dice', () => {
  const src = read('js/tutorias.js');
  if (CFG.demo) assert.match(src, /TUTORIAS\.demo \?/);
  assert.equal(CFG.leadMin, 60);
  assert.equal(CFG.days, 7);
});

test('Tutorías está en el menú, en index.html, en el service worker y en el recorrido', () => {
  const index = read('index.html'), sw = read('sw.js'), app = read('js/app.js');
  assert.match(index, /<button data-tab="clips">Clips<\/button>\s*<button data-tab="tutorias">Tutorías<\/button>\s*<button data-tab="profile">/);
  assert.ok(index.indexOf('js/tutorias.js') > 0 && index.indexOf('js/tutorias.js') < index.indexOf('js/app.js'));
  assert.match(sw, /'js\/tutorias\.js'/);
  assert.match(app, /tutorias: renderTutorias/);
  assert.match(app, /tutorias: \[\]/);
  assert.match(app, /tutorias: S\.tutorias/, 'reiniciar el progreso no borra las citas');
  const steps = get(loadScripts(['js/tour.js']), 'TOUR_STEPS');
  assert.match(steps.find(s => s.id === 'tutorias').target.join(), /data-tab="tutorias"/);
});
