// Preuniversitario UdeA · Comprensión lectora con textos de verdad (spec 2026-11-19-preuda-lectura-textos). Va después de
// preuda-lectura.js y de los preuda-l-<mundo>.js: en cada mundo terminado, cada lección pasa a tener 7 juegos distintos sobre un
// mismo texto, y el mundo una evaluación en formato real (pregunta-examen). PU_LEC_HECHOS lista los mundos terminados: la prueba
// tests/preuda-lectura.test.js les exige el estándar.
const PU_LEC_HECHOS = [];
(() => {
  const lessons = PU_LECTURA.flatMap(u => u.lessons);
  const L = id => { const l = lessons.find(l => l.id === id); if (!l) throw new Error(`no existe ${id}`); return l; };
  // La guía se dibuja sobre el lienzo solo en los juegos de p5; estos son HTML y usan la tarjeta «Cómo se juega».
  const setLesson = (id, list) => { L(id).ex = list; };
  // Evaluación del mundo: [lección, nota de repaso, ejercicio]. Formato real: tiempo del examen (2 min 15 s por pregunta).
  const setExam = (world, title, items) => {
    const u = PU_LECTURA.find(u => u.world === world), order = u.lessons.map(l => l.id);
    u.exam = { id: `exam-${world}`, title, minutes: 0, items: items.map(([lesson, review, ex]) => ({ lesson, review, ex: { ...ex, exam: true } })) };
    u.exam.items.sort((a, b) => order.indexOf(a.lesson) - order.indexOf(b.lesson));
    u.exam.minutes = Math.max(8, Math.ceil(u.exam.items.length * 2.25));
    PU_LEC_HECHOS.push(world);
  };
  PU_LEC_JUEGOS.forEach(f => f({ L, setLesson, setExam }));
})();
