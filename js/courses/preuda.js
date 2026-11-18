// Curso Preuniversitario UdeA (spec 2026-11-18-curso-preuda): preuniversitario para el examen de admisión, con dos componentes que
// se estudian por separado: Razonamiento lógico (js/courses/preuda-razonamiento.js) y Comprensión lectora
// (js/courses/preuda-lectura.js). Cada unidad es un mundo con `block`; `blocks` da el nombre y la descripción de cada
// componente, que el mapa muestra como encabezado. Nace en borrador (js/cuenta.js): se habilita tras revisión docente.

const COURSE_PREUDA = {
  id: 'preuda', level: 'Admisión', name: 'Preuniversitario UdeA', icon: 'pU', color: '#a3e635',
  tagline: 'El examen de admisión: razonamiento lógico y comprensión lectora.',
  blocks: [
    { id: 'razonamiento', name: 'Razonamiento lógico', desc: '40 preguntas sin calculadora · la mitad del puntaje' },
    { id: 'lectura', name: 'Comprensión lectora', desc: '40 preguntas sobre dos textos largos · la otra mitad' },
  ],
  units: [...PU_RAZONAMIENTO, ...PU_LECTURA],
};
