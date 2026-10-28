"""Pass 2: stack several per-entry contact sheets into numbered review pages.
Usage: pass3_batch.py <per_page>   -> <SCR>/p3/review/<n>.jpg and review/index.json (ids per page)"""
import json, os, sys, glob
from PIL import Image, ImageDraw

SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
S = SCR + "p3/"
per = int(sys.argv[1]) if len(sys.argv) > 1 else 3
if len(sys.argv) > 3:  # explicit sheet names: pass3_batch.py <per_page> <outdir-name> <sheet> [<sheet> ...]
    RV = sys.argv[2]
    ids = [i for i in sys.argv[3:] if os.path.exists(S + "sheets/%s.jpg" % i)]
else:
    RV = "review"
    todo = json.load(open(SCR + "todo3.json"))
    ids = [t[1] for t in todo if os.path.exists(S + "sheets/%s.jpg" % t[1])]
os.makedirs(S + RV, exist_ok=True)
idx = {}
for p in range(0, len(ids), per):
    part = ids[p:p + per]
    ims = []
    for i in part:
        im = Image.open(S + "sheets/%s.jpg" % i)
        ims.append(im)
    W = max(i.width for i in ims)
    H = sum(i.height + 22 for i in ims)
    pg = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(pg)
    y = 0
    for i, im in zip(part, ims):
        d.rectangle([0, y, W, y + 18], fill=(230, 230, 120))
        d.text((4, y + 3), i, fill="black")
        pg.paste(im, (0, y + 22))
        y += im.height + 22
    n = p // per + 1
    pg.save(S + RV + "/%03d.jpg" % n, quality=70)
    idx[n] = part
json.dump(idx, open(S + RV + "/index.json", "w"))
print(len(ids), len(idx))
