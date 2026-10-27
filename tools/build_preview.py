#!/usr/bin/env python3
"""Bundle the Atlas static site into one standalone HTML file for easy offline preview."""
from pathlib import Path
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
css=(root/'assets/style.css').read_text(encoding='utf-8')
data=(root/'data/datasets.js').read_text(encoding='utf-8')
js=(root/'assets/app.js').read_text(encoding='utf-8')
favicon=(root/'assets/favicon.svg').read_bytes()
html=html.replace('<link rel="stylesheet" href="assets/style.css" />','<style>\n'+css+'\n</style>')
html=html.replace('<script defer src="data/datasets.js"></script>','')
html=html.replace('<script defer src="assets/app.js"></script>','')
html=html.replace('href="assets/favicon.svg"', 'href="data:image/svg+xml;base64,'+base64.b64encode(favicon).decode('ascii')+'"')
assert '</script' not in data.lower() and '</script' not in js.lower()
html=html.replace('</body>', '<script>\n'+data+'\n</script>\n<script>\n'+js+'\n</script>\n</body>')
out=root.parent/'Embodied_Atlas_Standalone_Preview.html'
out.write_text(html,encoding='utf-8')
print('Saved',out,'bytes',out.stat().st_size)
