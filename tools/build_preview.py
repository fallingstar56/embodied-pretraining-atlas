#!/usr/bin/env python3
"""Bundle the Atlas static site into one standalone HTML file for easy offline preview."""
from pathlib import Path
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
css=(root/'assets/style.css').read_text(encoding='utf-8')
scripts=['data/datasets.js','data/annotation_taxonomy.js','data/facet_reviews.js','assets/facets.js','assets/app.js']
inline=[]
for src in scripts:
    code=(root/src).read_text(encoding='utf-8')
    assert '</script' not in code.lower(), src
    html=html.replace(f'<script defer src="{src}"></script>', '')
    inline.append('<script>\n'+code+'\n</script>')
favicon=(root/'assets/favicon.svg').read_bytes()
html=html.replace('<link rel="stylesheet" href="assets/style.css" />','<style>\n'+css+'\n</style>')
html=html.replace('href="assets/favicon.svg"', 'href="data:image/svg+xml;base64,'+base64.b64encode(favicon).decode('ascii')+'"')
for src,mime in [('ANNOTATION_AUDIT.md','text/markdown'),('data/annotation_audit.csv','text/csv')]:
    payload=base64.b64encode((root/src).read_bytes()).decode('ascii')
    html=html.replace(f'href="{src}"',f'href="data:{mime};base64,{payload}" download="{Path(src).name}"')
html=html.replace('</body>', '\n'.join(inline)+'\n</body>')
out=root.parent/'Embodied_Atlas_Standalone_Preview.html'
out.write_text(html,encoding='utf-8')
print('Saved',out,'bytes',out.stat().st_size)
