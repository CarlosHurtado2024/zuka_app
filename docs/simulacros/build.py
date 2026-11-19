# -*- coding: utf-8 -*-
"""Simulacros tipo examen de admisión UdeA (Preuniversitario Zuka).

Uso:  python -X utf8 docs/simulacros/build.py [01 02 ...]   (sin argumentos: todos)
Lee docs/simulacros/src/sNN.txt y deja docs/simulacros/pdf/simulacro-NN.pdf
y docs/simulacros/pdf/claves-simulacros.pdf (claves y solución corta de razonamiento).

Formato de la fuente (el contenido es LaTeX; cada directiva empieza la línea):
  == LECTURA | == RAZONAMIENTO     sección
  ## Título                        subtítulo centrado (Texto Uno, Preguntas del Texto Dos…)
  p: párrafo                       párrafo numerado de un texto
  src: fuente                      nota de fuente
  ctx N: enunciado común           contexto de las N preguntas que siguen
  q: enunciado                     pregunta (q!: no baraja las opciones; la correcta lleva @*)
  @ opción                         la PRIMERA es la correcta; el script las baraja
  ! explicación                    solución corta (solo sale en las claves)
"""
import os, re, random, subprocess, sys, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT, TMP = (os.path.join(HERE, d) for d in ('src', 'pdf', 'tmp'))
DIRS = ('==', '##', 'p:', 'src:', 'ctx', 'q:', 'q!:', '@', '!', 'raw:')

PRE = r'''\documentclass[10pt,letterpaper]{article}
\usepackage[utf8]{inputenc}\usepackage[T1]{fontenc}
\usepackage[spanish,es-noshorthands,es-nodecimaldot]{babel}
\usepackage[scaled=.92]{helvet}\renewcommand\familydefault{\sfdefault}
\usepackage[top=1.9cm,bottom=1.7cm,left=1.5cm,right=1.5cm,headsep=.5cm]{geometry}
\usepackage{multicol,amsmath,amssymb,tikz,fancyhdr,array,microtype}
\usetikzlibrary{arrows.meta,calc,patterns}
\setlength\columnsep{.8cm}\setlength\parindent{0pt}\setlength\parskip{3pt}
\pagestyle{fancy}\fancyhf{}\renewcommand\headrulewidth{.3pt}
\fancyhead[R]{\small %(head)s}\fancyfoot[C]{\small\thepage}
\newcommand\st[2]{\par\hangindent2.2em\hangafter1\makebox[2.2em][l]{#1}#2\par}
\newcommand\vi[1]{\par\hangindent1.3em\hangafter1\makebox[1.3em][l]{\textbullet}#1\par}
\newcommand\bl{\rule{2.2em}{.4pt}}
\newcommand\sub[1]{\underline{#1}}
\newcommand\titulo[1]{\par\vspace{6pt}{\centering\bfseries #1\par}\vspace{3pt}}
\newenvironment{preg}[1]{\begin{list}{}{\leftmargin2.1em\labelwidth1.7em\labelsep.4em
  \topsep0pt\partopsep0pt\parsep2pt\itemsep0pt}\item[\textbf{#1.}\hfill]}{\end{list}}
\newcommand\op[2]{\par\hangindent1.6em\hangafter1\makebox[1.6em][l]{#1.}#2\par}
\newcommand\opi[3]{\makebox[#3\linewidth][l]{#1.\ \ #2}}
\raggedcolumns\sloppy
\begin{document}
'''

def clean_len(s):
    s = re.sub(r'\\(d?frac|tfrac)\{([^{}]*)\}\{([^{}]*)\}', r'\2/\3', s)
    s = re.sub(r'\\[a-zA-Z]+', 'xx', s)
    return len(re.sub(r'[{}$\\]', '', s).strip())

def parse(path):
    items, cur = [], None
    for line in open(path, encoding='utf-8').read().split('\n'):
        m = re.match(r'(==|##|p:|src:|ctx \d+:|q!:|q:|@\*|@|!|raw:)\s?(.*)', line)
        if m:
            cur = [m.group(1), m.group(2)]
            items.append(cur)
        elif cur is not None and line.strip():
            cur[1] += '\n' + line
        elif cur is not None and not line.strip() and cur[0] in ('raw:',):
            cur[1] += '\n'
    return items

def structure(items, path):
    """Devuelve bloques y lista de preguntas; valida."""
    blocks, qs, q = [], [], None
    for k, v in items:
        v = v.strip()
        if k in ('q:', 'q!:'):
            q = {'stem': v, 'opts': [], 'fixed': k == 'q!:', 'ok': 0, 'why': '', 'n': len(qs) + 1}
            qs.append(q); blocks.append(('q', q))
        elif k in ('@', '@*'):
            if k == '@*': q['ok'] = len(q['opts'])
            q['opts'].append(v)
        elif k == '!':
            q['why'] = v
        elif k == '==':
            blocks.append(('sec', v, len(qs)))
        elif k == '##':
            blocks.append(('h', v))
        elif k == 'p:':
            blocks.append(('p', v))
        elif k == 'src:':
            blocks.append(('src', v))
        elif k == 'raw:':
            blocks.append(('raw', v))
        else:
            blocks.append(('ctx', int(k[4:-1]), v, len(qs)))
    err = []
    if len(qs) != 80: err.append('tiene %d preguntas (deben ser 80)' % len(qs))
    for q in qs:
        if len(q['opts']) != 4: err.append('pregunta %d con %d opciones' % (q['n'], len(q['opts'])))
        if len(set(q['opts'])) != len(q['opts']): err.append('pregunta %d con opciones repetidas' % q['n'])
    secs = [b for b in blocks if b[0] == 'sec']
    if [s[2] for s in secs] != [0, 40]: err.append('las secciones deben empezar en 1 y 41: %s' % secs)
    if err: sys.exit('%s: %s' % (os.path.basename(path), '; '.join(err)))
    return blocks, qs

def shuffle(qs, num):
    """Baraja opciones: cada letra sale 10 veces por sección y nunca 3 seguidas."""
    for s in (0, 40):
        rnd = random.Random(num * 100 + s)
        free = [q for q in qs[s:s + 40] if not q['fixed']]
        used = {L: 0 for L in 'ABCD'}
        for q in qs[s:s + 40]:
            if q['fixed']: used['ABCD'[q['ok']]] += 1
        pool = []
        for L in 'ABCD': pool += [L] * max(0, 10 - used[L])
        while len(pool) < len(free): pool.append(rnd.choice('ABCD'))
        pool = pool[:len(free)]
        for _ in range(400):
            rnd.shuffle(pool)
            if not any(pool[i] == pool[i + 1] == pool[i + 2] for i in range(len(pool) - 2)): break
        for q, L in zip(free, pool):
            good, bad = q['opts'][0], q['opts'][1:]
            rnd.shuffle(bad)
            i = 'ABCD'.index(L)
            q['opts'] = bad[:i] + [good] + bad[i:]
            q['ok'] = i
    for q in qs: q['key'] = 'ABCD'[q['ok']]

def opts_tex(q):
    o = q['opts']
    n = max(clean_len(x) for x in o)
    big = any('tikzpicture' in x for x in o)
    if big:
        cell = lambda i: r'\begin{minipage}[t]{.47\linewidth}%s.\ \raisebox{-.85\height}{%s}\end{minipage}' % ('ABCD'[i], o[i])
        return '\\par\\smallskip ' + cell(0) + r'\hfill ' + cell(1) + '\\par\\medskip ' + cell(2) + r'\hfill ' + cell(3) + '\\par'
    if n <= 6:
        return r'\par\smallskip ' + ''.join(r'\opi{%s}{%s}{.25}' % ('ABCD'[i], o[i]) for i in range(4)) + r'\par'
    if n <= 20:
        return (r'\par\smallskip ' + ''.join(r'\opi{%s}{%s}{.5}' % ('ABCD'[i], o[i]) for i in (0, 1)) + r'\par '
                + ''.join(r'\opi{%s}{%s}{.5}' % ('ABCD'[i], o[i]) for i in (2, 3)) + r'\par')
    return r'\par\smallskip ' + ''.join(r'\op{%s}{%s}' % ('ABCD'[i], o[i]) for i in range(4))

def body(blocks, num):
    out, par, open_cols = [], 0, False
    def cols(on):
        nonlocal open_cols
        if on and not open_cols: out.append(r'\begin{multicols}{2}')
        if not on and open_cols: out.append(r'\end{multicols}')
        open_cols = on
    for b in blocks:
        t = b[0]
        if t == 'sec':
            cols(False)
            if b[2]: out.append(r'\clearpage')
            name = 'PRUEBA DE COMPETENCIA LECTORA' if b[1].startswith('LECT') else 'PRUEBA DE RAZONAMIENTO LÓGICO'
            out.append(r'{\centering\large\bfseries %s\par}\vspace{4pt}' % name)
            cols(True)
        elif t == 'h':
            if b[1].lower().startswith('texto'): par = 0
            out.append(r'\titulo{%s}' % b[1])
        elif t == 'p':
            par += 1
            out.append(r'\par\hspace{1em}\textbf{%d.} %s\par' % (par, b[1]))
        elif t == 'src':
            out.append(r'\par{\raggedleft\footnotesize %s\par}\vspace{4pt}' % b[1])
        elif t == 'raw':
            out.append(b[1])
        elif t == 'ctx':
            a, z = b[3] + 1, b[3] + b[1]
            out.append(r'\titulo{Preguntas %d a %d}' % (a, z) if z > a else r'\titulo{Pregunta %d}' % a)
            out.append(b[2] + r'\par\vspace{3pt}')
        else:
            q = b[1]
            out.append(r'\par\vspace{5pt}\noindent\begin{minipage}{\linewidth}\begin{preg}{%d}%s%s\end{preg}\end{minipage}\par'
                       % (q['n'], q['stem'], opts_tex(q)))
    cols(False)
    return '\n'.join(out)

def cover(num):
    return r'''\thispagestyle{empty}\vspace*{2.2cm}
{\centering {\Large PREUNIVERSITARIO ZUKA\par}\vspace{.9cm}
{\huge\bfseries Simulacro de examen de admisión\par}\vspace{.3cm}
{\Large tipo Universidad de Antioquia\par}\vspace{1.1cm}
{\Huge\bfseries Simulacro %d\par}\vspace{1.6cm}}
\begin{center}\begin{minipage}{.78\linewidth}\large
\textbf{LEA ATENTAMENTE LAS SIGUIENTES INSTRUCCIONES}\par\medskip
\vi{El simulacro consta de 80 preguntas: 40 de competencia lectora y 40 de razonamiento lógico.}
\vi{Dispone de 3 horas para responderlo. No se permite calculadora, celular ni material de consulta.}
\vi{Cada pregunta tiene una única respuesta correcta entre las opciones A, B, C y D.}
\vi{Marque sus respuestas en la hoja de respuestas de la última página, rellenando por completo el círculo de la opción elegida.}
\vi{Las figuras no están necesariamente a escala, salvo que se indique lo contrario.}
\vi{Use los espacios en blanco del cuadernillo para sus operaciones.}
\par\vspace{1.4cm}\normalsize
Material de práctica elaborado por Zuka para su preuniversitario. No es un examen oficial ni
reproduce preguntas de la Universidad de Antioquia: los textos y los problemas son originales
y siguen la estructura y los tipos de pregunta del examen de admisión.
\end{minipage}\end{center}\clearpage
''' % num

def sheet(num):
    rows = []
    for r in range(20):
        cells = []
        for c in range(4):
            n = c * 20 + r + 1
            cells.append(r'\textbf{%d}&' % n + '&'.join(r'\tikz[baseline=-.6ex]\node[circle,draw,inner sep=0pt,minimum size=4.6mm,font=\scriptsize]{%s};' % L for L in 'ABCD'))
        rows.append('&\\hspace{5mm}&'.join(cells) + r'\\[1.6mm]')
    return r'''\clearpage\thispagestyle{empty}
{\centering{\Large\bfseries Hoja de respuestas · Simulacro %d\par}\vspace{.5cm}}
Nombre: \rule{9cm}{.4pt}\hfill Fecha: \rule{3.5cm}{.4pt}\par\vspace{.3cm}
Competencia lectora: preguntas 1 a 40\hfill Razonamiento lógico: preguntas 41 a 80\par\vspace{.5cm}
{\centering\renewcommand\arraystretch{1}\setlength\tabcolsep{1.6pt}
\begin{tabular}{r@{\hspace{2mm}}cccc c r@{\hspace{2mm}}cccc c r@{\hspace{2mm}}cccc c r@{\hspace{2mm}}cccc}
%s
\end{tabular}\par}
\vfill Aciertos en competencia lectora: \rule{1.5cm}{.4pt} de 40\hfill Aciertos en razonamiento lógico: \rule{1.5cm}{.4pt} de 40
''' % (num, '\n'.join(rows))

def latex(name, tex):
    os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    open(os.path.join(TMP, name + '.tex'), 'w', encoding='utf-8').write(tex)
    for _ in range(2):
        r = subprocess.run(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', name + '.tex'],
                           cwd=TMP, capture_output=True, text=True, encoding='latin1')
        if r.returncode:
            log = r.stdout.split('\n')
            i = next((i for i, l in enumerate(log) if l.startswith('!')), len(log) - 15)
            sys.exit('%s: error de LaTeX\n%s' % (name, '\n'.join(log[max(0, i - 3):i + 12])))
    bad = [l for l in r.stdout.split('\n') if 'Overfull \\hbox' in l and float(re.search(r'\(([\d.]+)pt', l).group(1)) > 8]
    shutil.copy(os.path.join(TMP, name + '.pdf'), os.path.join(OUT, name + '.pdf'))
    return bad

def main():
    want = sys.argv[1:]
    files = sorted(f for f in os.listdir(SRC) if re.match(r's\d\d\.txt$', f))
    keys = []
    for f in files:
        num = int(f[1:3])
        blocks, qs = structure(parse(os.path.join(SRC, f)), f)
        shuffle(qs, num)
        keys.append((num, qs))
        if want and f[1:3] not in want: continue
        tex = PRE % {'head': 'Simulacro %d · Examen de admisión tipo UdeA · Preuniversitario Zuka' % num}
        tex += cover(num) + body(blocks, num) + sheet(num) + '\n\\end{document}\n'
        bad = latex('simulacro-%02d' % num, tex)
        print('simulacro-%02d.pdf  claves: %s' % (num, ''.join(q['key'] for q in qs)), '| líneas desbordadas: %d' % len(bad) if bad else '')
    tex = PRE % {'head': 'Claves de los simulacros · Preuniversitario Zuka'}
    for num, qs in keys:
        tex += r'{\centering\Large\bfseries Simulacro %d · Claves\par}\vspace{6pt}' % num
        tex += r'{\centering\setlength\tabcolsep{4pt}\begin{tabular}{|*{20}{c|}}\hline' + '\n'
        for a in range(0, 80, 20):
            tex += '&'.join(r'\footnotesize %d' % q['n'] for q in qs[a:a + 20]) + r'\\' + '\n'
            tex += '&'.join(r'\textbf{%s}' % q['key'] for q in qs[a:a + 20]) + r'\\\hline' + '\n'
        tex += r'\end{tabular}\par}\vspace{8pt}{\bfseries Razonamiento lógico: solución corta\par}\begin{multicols}{2}\small' + '\n'
        for q in qs[40:]:
            tex += r'\par\hangindent2.1em\hangafter1\makebox[2.1em][l]{\textbf{%d.}}\textbf{%s.} %s\par' % (q['n'], q['key'], q['why'] or '') + '\n'
        tex += r'\end{multicols}\clearpage' + '\n'
    latex('claves-simulacros', tex + '\\end{document}\n')
    print('claves-simulacros.pdf')

if __name__ == '__main__':
    main()
