"""Contact sheets for eyeballing downloaded images: contact_sheet.py <dir> <outprefix> [per_sheet]"""
import os, sys
from PIL import Image, ImageDraw

d, pre = sys.argv[1], sys.argv[2]
per = int(sys.argv[3]) if len(sys.argv) > 3 else 30
fs = sorted(f for f in os.listdir(d) if f.endswith(".webp"))
T = 230
for s in range(0, len(fs), per):
    part = fs[s:s + per]
    cols = 6
    rows = -(-len(part) // cols)
    sheet = Image.new("RGB", (cols * T, rows * (T + 18)), "white")
    dr = ImageDraw.Draw(sheet)
    for i, f in enumerate(part):
        im = Image.open(os.path.join(d, f)).convert("RGB")
        im.thumbnail((T - 4, T - 4))
        x, y = (i % cols) * T, (i // cols) * (T + 18)
        sheet.paste(im, (x + 2, y + 2))
        dr.text((x + 2, y + T), f[:-5][:36], fill="black")
    sheet.save("%s%d.jpg" % (pre, s // per + 1), quality=70)
    print(len(part))
