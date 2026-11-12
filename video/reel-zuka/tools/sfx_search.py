"""Candidatos de efectos en Freesound (CC0) para cada acción del reel. Solo busca; no descarga.
    python -X utf8 video/reel-zuka/tools/sfx_search.py"""
import json, os, subprocess, sys
S = os.path.expanduser('~/.claude/skills/video-shotcraft/assets/scripts/sfx-source.py')
Q = [('whoosh short', 0.2, 1.2), ('pop', 0.05, 0.5), ('card flick', 0.05, 0.6), ('swipe', 0.15, 0.8), ('impact deep soft', 0.5, 2.5), ('sparkle chime', 0.6, 3.0), ('riser short', 0.8, 2.2), ('tick click soft', 0.02, 0.3)]
for q, a, b in Q:
    r = subprocess.run([sys.executable, '-I', '-X', 'utf8', S, 'search', q, '--license', 'cc0', '--min-duration', str(a), '--max-duration', str(b), '--limit', '5'], capture_output=True, text=True, encoding='utf-8')
    print('==', q)
    try:
        for x in json.loads(r.stdout)['results'][:5]:
            print('  ', x['id'], '|', x['title'][:44], '|', x['duration_seconds'], 's |', x.get('license'), '| descargas', x.get('downloads'), '| ', (x.get('tags') or [])[:5])
    except Exception as e:
        print('  ERR', e, r.stderr[-300:])
