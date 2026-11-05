"""Remove only empty outer paper margins from gallery thumbnails, never originals."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import re

root = Path(__file__).resolve().parents[1]
assets = root / 'assets/documentation/neomodernizm'
page = root / 'portfolio/neomodernizm/index.html'
with page.open(encoding='utf-8', newline='') as stream:
    html = stream.read()
results = []
for number in range(50, 65):
    with Image.open(assets / f'details/arkusz-{number}.png') as image:
        # Retain all marks, with a safety margin, and trim at most 5% per edge.
        mask = image.convert('L').point(lambda value: 255 if value < 245 else 0)
        bounds = mask.getbbox()
        assert bounds, f'Empty sheet {number}'
        w, h = image.size
        pad = 48
        box = (max(0, min(bounds[0] - pad, int(w * .05))),
               max(0, min(bounds[1] - pad, int(h * .05))),
               min(w, max(bounds[2] + pad, int(w * .95))),
               min(h, max(bounds[3] + pad, int(h * .95))))
        assert box[0] <= bounds[0] and box[1] <= bounds[1]
        assert box[2] >= bounds[2] and box[3] >= bounds[3]
        thumbnail = ImageOps.contain(image.crop(box), (960, 960), Image.Resampling.LANCZOS)
        thumbnail.save(assets / f'thumbs/arkusz-{number}.webp', 'WEBP', quality=90, method=6)
        pattern = rf'(<img src="../../assets/documentation/neomodernizm/thumbs/arkusz-{number}\.webp"[^>]*?)width="\d+" height="\d+"'
        html, count = re.subn(pattern, rf'\g<1>width="{thumbnail.width}" height="{thumbnail.height}"', html)
        assert count in (1, 2), (number, count)
        results.append({'page': number, 'source': [w, h], 'crop': box, 'thumbnail': list(thumbnail.size)})
page.write_text(html, encoding='utf-8', newline='')
print(json.dumps(results))
