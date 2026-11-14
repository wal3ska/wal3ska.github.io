"""Index the original course material without modifying it."""
from pathlib import Path
import json
import fitz

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data'
OUT.mkdir(exist_ok=True)
documents = []
for path in sorted(ROOT.glob('*.pdf')):
    doc = fitz.open(path)
    pages = [page.get_text(sort=True) for page in doc]
    documents.append({'name': path.name, 'path': path.name, 'pages': pages,
                      'pageCount': len(pages), 'size': path.stat().st_size})
    (OUT / (path.stem + '.txt')).write_text('\n\n'.join(f'--- Sayfa {i+1} ---\n{p}' for i,p in enumerate(pages)), encoding='utf-8')
examples = []
for path in sorted(ROOT.rglob('*')):
    rel = path.relative_to(ROOT)
    if not path.is_file() or any(p.startswith('.') for p in rel.parts):
        continue
    if rel.parts[0] in ('data', 'scripts', 'node_modules', 'vendor', 'src', 'tests', 'dist', 'assets', 'content', 'output', 'tmp', 'licenses'):
        continue
    if path.suffix == '.pdf':
        continue
    if len(rel.parts) == 1 and path.name not in ('init.sh', 'history_01.txt'):
        continue
    content = path.read_bytes().decode('utf-8', errors='replace')
    examples.append({'name': path.name, 'path': rel.as_posix(), 'content': content,
                     'language': 'c' if path.suffix in ('.c','.h') else 'bash' if path.suffix == '.sh' else 'text',
                     'size': path.stat().st_size})
(OUT / 'materials.json').write_text(json.dumps({'documents': documents, 'examples': examples}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'pdf':len(documents), 'pages':sum(d['pageCount'] for d in documents), 'sourceFiles':len(examples)}, ensure_ascii=False))
