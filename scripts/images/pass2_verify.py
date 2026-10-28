"""Pass 2: contact sheets of the final WebP files for every image added in pass 2 (final eyeball check).
Usage: pass2_verify.py [per_sheet] [only-new-ids-file]  -> <SCR>/p2/final/<n>.jpg"""
import json, os, sys
from PIL import Image, ImageDraw
SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
S = SCR + "p2/"
os.makedirs(S + "final", exist_ok=True)
added = set(json.load(open(S + "apply_report_all.json")))
only = set(open(sys.argv[2]).read().split()) if len(sys.argv) > 2 else None
items = []
for f in ["index", "sf-bay", "sf-studios", "colombia"]:
    d = json.load(open("data/opportunities/%s.json" % f))
    for e in (d["opportunities"] if isinstance(d, dict) else d):
        if e["id"] in added and (only is None or e["id"] in only):
            items.append((e["id"], "public" + e["image"]["src"]))
items.sort()
per = int(sys.argv[1]) if len(sys.argv) > 1 else 48
T = 200
for s in range(0, len(items), per):
    part = items[s:s + per]
    cols = 8
    rows = -(-len(part) // cols)
    sh = Image.new("RGB", (cols * T, rows * (T + 14)), "white")
    d = ImageDraw.Draw(sh)
    for i, (id_, fp) in enumerate(part):
        im = Image.open(fp).convert("RGB")
        im.thumbnail((T - 4, T - 4))
        x, y = (i % cols) * T, (i // cols) * (T + 14)
        sh.paste(im, (x + 2, y + 2))
        d.text((x + 2, y + T), id_[:34].encode("ascii", "replace").decode(), fill="black")
    sh.save(S + "final/%d.jpg" % (s // per + 1), quality=70)
print(len(items))
