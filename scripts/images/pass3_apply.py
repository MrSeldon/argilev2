"""Pass 3 final step: for every chosen image (scripts/images/pass3_picks.py) convert to WebP (<=1400px, q~78, <200 KB)
in public/images/opportunities/<id>.webp and add the "image" object to bay-ceramics.json, bay-making.json and funding.json.
Website images: credit "Image: <org>", creditUrl = the source entry's website, license "publisher image".
Wikimedia Commons images (src "<id>__wiki"): author + licence read from the Commons file page, creditUrl = the file page.
Each file keeps its original JSON layout (bay-ceramics: indent 1, the other two: indent 2) so the diff only adds image blocks.
Usage: python3 scripts/images/pass3_apply.py   (idempotent)"""
import json, os, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR
import inspo_resolve as R
from PIL import Image, ImageOps

S = SCR + "p3/"
OUT = "public/images/opportunities/"
LIMIT = 200 * 1024
ns = {}
exec(open("scripts/images/pass3_picks.py").read(), ns)
P = ns["P"]
FILES = {"bay-ceramics": ("data/opportunities/bay-ceramics.json", 1), "bay-making": ("data/opportunities/bay-making.json", 2),
         "funding": ("data/opportunities/funding.json", 2)}
FREE = re.compile(r"CC0|CC BY|Public domain|PD|GFDL|Attribution", re.I)


def webp(src, dst):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    for target in (1400, 1300, 1200, 1100, 1000, 900):
        w, h = im.size
        s = min(1.0, target / max(w, h))
        small = im.resize((round(w * s), round(h * s)), Image.LANCZOS) if s < 1 else im
        for q in (78, 72, 66, 60, 55):
            small.save(dst, "WEBP", quality=q, method=6)
            if os.path.getsize(dst) <= LIMIT:
                return small.size, os.path.getsize(dst)
    return small.size, os.path.getsize(dst)


data = {}
for k, (p, ind) in FILES.items():
    data[k] = json.load(open(p))
byid = {x["id"]: (k, x) for k, L in data.items() for x in L}
report = {}
for id_, (n, alt, org, src) in P.items():
    if id_ not in byid:
        print("missing entry", id_)
        continue
    kind, x = byid[id_]
    if x.get("image"):
        print("already has image", id_)
        continue
    commons = None
    if src.endswith("__wiki"):
        meta = json.load(open(S + "dl/%s/meta.json" % src))
        it = next(m for m in meta if m["n"] == n)
        info = R.commons_info(it["file"])
        if not info or not info.get("license") or not FREE.search(info["license"]):
            print("NOT FREE / no info", id_, it["file"], info and info.get("license"))
            continue
        raw = S + "dl/%s/full_%02d.jpg" % (src, n)
        if not os.path.exists(raw):
            curl("https://commons.wikimedia.org/wiki/Special:FilePath/%s?width=1400" % urllib.parse.quote(it["file"].replace(" ", "_"), safe="(),!'~_.-"),
                 out=raw, min_gap=1.1)
        commons = info
        credit_url = info["page"]
    else:
        raw = S + "dl/%s/%02d.jpg" % (src, n)
        credit_url = byid[src][1].get("website") if src in byid else x.get("website")
        credit_url = credit_url or x.get("website")
    dst = OUT + id_ + ".webp"
    size, nbytes = webp(raw, dst)
    if commons:
        artist = commons.get("artist") or "unknown author"
        img = {"src": "/images/opportunities/%s.webp" % id_, "alt": alt,
               "credit": "%s / Wikimedia Commons" % artist, "creditUrl": credit_url,
               "license": commons.get("license") or "see Commons"}
    else:
        img = {"src": "/images/opportunities/%s.webp" % id_, "alt": alt,
               "credit": "Image: %s" % (org or x["name"]), "creditUrl": credit_url, "license": "publisher image"}
    x["image"] = img
    report[id_] = (kind, size, nbytes)
for k, (p, ind) in FILES.items():
    out = json.dumps(data[k], ensure_ascii=False, indent=ind) + "\n"
    open(p, "w").write(out)
json.dump(report, open(S + "apply_report.json", "w"))
print(len(report), "images,", sum(v[2] for v in report.values()) // 1024, "KB total")
