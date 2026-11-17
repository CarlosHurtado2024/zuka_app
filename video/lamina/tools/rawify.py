"""Convierte en R`…` cada cadena '…' de una película que tenga una barra (\\frac, \\{, \\sqrt…): en una cadena normal de
JavaScript la barra se come la letra siguiente. Lee el archivo como JavaScript (cadenas, plantillas y comentarios), así que
no empareja comillas equivocadas.   python video/lamina/tools/rawify.py [película …]"""
import sys, glob, os
HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'films')

def rawify(src):
    out, i, n = [], 0, len(src)
    tpl_depth = []                                   # pila: dentro de ${…} de una plantilla
    while i < n:
        c = src[i]
        if c == '/' and src.startswith('//', i):
            j = src.find('\n', i); j = n if j < 0 else j; out.append(src[i:j]); i = j; continue
        if c == '/' and src.startswith('/*', i):
            j = src.find('*/', i) + 2; out.append(src[i:j]); i = j; continue
        if c in '\'"':
            j = i + 1; has = False
            while j < n and src[j] != c:
                if src[j] == '\\': has = True; j += 2; continue
                j += 1
            body = src[i + 1:j]
            if c == "'" and has and '`' not in body and '${' not in body and '\\\\' not in body and "\\'" not in body:
                out.append('R`' + body + '`')
            else:
                out.append(src[i:j + 1])
            i = j + 1; continue
        if c == '`':
            j = i + 1
            while j < n and src[j] != '`':
                if src[j] == '\\': j += 2; continue
                if src.startswith('${', j):              # salta la expresión interna completa
                    d = 1; j += 2
                    while j < n and d:
                        if src[j] == '{': d += 1
                        elif src[j] == '}': d -= 1
                        j += 1
                    continue
                j += 1
            out.append(src[i:j + 1]); i = j + 1; continue
        out.append(c); i += 1
    return ''.join(out)

if __name__ == '__main__':
    names = sys.argv[1:] or [os.path.basename(p)[:-3] for p in glob.glob(os.path.join(HERE, '*.js'))]
    for nm in names:
        p = os.path.join(HERE, nm + '.js'); s = open(p, encoding='utf-8').read(); r = rawify(s)
        if r != s: open(p, 'w', encoding='utf-8', newline='\n').write(r); print('convertido', nm)
