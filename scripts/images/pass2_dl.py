"""Pass 2, step 2: download candidate images for each crawled page, drop tiny/odd ones, dedupe,
and write per-entry contact sheets for eyeballing. Usage: pass2_dl.py [id ...]  (default: all crawled, not yet done)
Output: <SCR>/p2/dl/<id>/<n>.<ext>, <SCR>/p2/dl/<id>/meta.json, <SCR>/p2/sheets/<id>.jpg"""
import json, os, glob, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageOps

SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
S = SCR + "p2/"
UA = "Mozilla/5.0"  # see pass2_crawl.py
os.makedirs(S + "sheets", exist_ok=True)
MAXC = 16


def ahash(im):
    g = im.convert("L").resize((8, 8))
    px = list(g.getdata())
    m = sum(px) / 64
    return "".join("1" if p > m else "0" for p in px)


def one(arg):
    d, i, u, ref = arg
    ext = "jpg"
    p = "%s/%02d.%s" % (d, i, ext)
    subprocess.run(["curl", "-sL", "--max-time", "30", "--max-filesize", "12000000", "-A", UA, "-e", ref, "-o", p, u],
                   capture_output=True)
    try:
        if os.path.getsize(p) < 15000:
            os.remove(p)
            return None
        im = Image.open(p)
        im.load()
        w, h = im.size
        if w < 600 or h < 350 or w / h > 3.2 or h / w > 1.6:
            os.remove(p)
            return None
        return {"n": i, "url": u, "w": w, "h": h, "kb": os.path.getsize(p) // 1024, "hash": ahash(im), "path": p}
    except Exception:
        if os.path.exists(p):
            os.remove(p)
        return None


def sheet(id_, items):
    T = 300
    cols = min(4, max(1, len(items)))
    rows = -(-len(items) // cols)
    sh = Image.new("RGB", (cols * T, rows * (T + 16)), "white")
    dr = ImageDraw.Draw(sh)
    for k, it in enumerate(items):
        im = ImageOps.exif_transpose(Image.open(it["path"])).convert("RGB")
        im.thumbnail((T - 4, T - 4))
        x, y = (k % cols) * T, (k // cols) * (T + 16)
        sh.paste(im, (x + 2, y + 2))
        dr.text((x + 4, y + T), "%s #%d %dx%d %dKB" % (id_[:18], it["n"], it["w"], it["h"], it["kb"]), fill="black")
    sh.save(S + "sheets/%s.jpg" % id_, quality=72)


def do(id_):
    rec = json.load(open(S + "pages/%s.json" % id_))
    d = S + "dl/" + id_
    if os.path.exists(d + "/meta.json"):
        return
    os.makedirs(d, exist_ok=True)
    ref = rec.get("final") or rec["url"] or ""
    args = [(d, i, u, ref) for i, u in enumerate(rec["cands"][:MAXC])]
    with ThreadPoolExecutor(8) as ex:
        res = [r for r in ex.map(one, args) if r]
    seen, keep = set(), []
    for r in res:
        if r["hash"] in seen:
            os.remove(r["path"])
            continue
        seen.add(r["hash"])
        keep.append(r)
    keep = keep[:8]
    for r in res:
        if r not in keep and os.path.exists(r["path"]):
            os.remove(r["path"])
    json.dump(keep, open(d + "/meta.json", "w"))
    if keep:
        sheet(id_, keep)


if __name__ == "__main__":
    ids = sys.argv[1:] or [os.path.basename(f)[:-5] for f in sorted(glob.glob(S + "pages/*.json"))]
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(do, ids))
    print("done")
