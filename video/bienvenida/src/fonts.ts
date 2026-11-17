// Letra local (sin red): Jost, la de los juegos y videos de Zuka. @remotion/fonts registra la fuente y hace que Remotion
// espere a que cargue antes de cada cuadro.
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

loadFont({ family: 'Jost', url: staticFile('fonts/Jost.ttf'), weight: '100 900', format: 'truetype' });
