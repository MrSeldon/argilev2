"""Pass 2 fallback: Wikimedia Commons photos of an institution/place, found through its English Wikipedia article's
media list (REST). Downloads up to 8 freely licensed JPEGs per entry as 1000px thumbnails and builds a contact sheet.
Usage: pass3_wiki.py            (runs QUERIES below; resumable)  Output: <SCR>/p3/dl/<id>/ + sheets/<id>.jpg, meta.json with Commons file names."""
import json, os, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR
from pass3_dl import sheet, ahash, S
from PIL import Image

QUERIES = json.load(open("scripts/images/pass3_wiki_queries.json"))
SKIP = re.compile(r"logo|flag|map|seal|coat_of|signature|diagram|icon|symbol|emblem|crest|plan|wordmark|\.svg|\.png|\.gif|portrait|headshot|poster|banner|stamp", re.I)
WP = "https://en.wikipedia.org/api/rest_v1/page/media-list/"


def media(title):
    code, b = curl(WP + urllib.parse.quote(title.replace(" ", "_"), safe=""), min_gap=1.1)
    if code != 200:
        return []
    out = []
    for it in json.loads(b).get("items", []):
        if it.get("type") != "image":
            continue
        t = it.get("title", "")
        if not t.lower().endswith((".jpg", ".jpeg")) or SKIP.search(t):
            continue
        srcs = it.get("srcset") or []
        if not srcs or "/wikipedia/commons/" not in srcs[-1]["src"]:
            continue
        out.append(t[5:] if t.startswith("File:") else t)
    return out


def do(id_):
    d = S + "dl/" + id_ + "__wiki"  # kept apart from the website candidates under dl/<id>
    if os.path.exists(d + "/meta.json"):
        return
    os.makedirs(d, exist_ok=True)
    files = []
    for title in QUERIES[id_]:
        for f in media(title):
            if f not in files:
                files.append(f)
        if len(files) >= 8:
            break
    keep, seen = [], set()
    for i, f in enumerate(files[:8]):
        p = "%s/%02d.jpg" % (d, i)
        code = curl("https://commons.wikimedia.org/wiki/Special:FilePath/%s?width=800" % urllib.parse.quote(f.replace(" ", "_"), safe="(),!'~_.-"),
                    out=p, min_gap=0.7)
        try:
            im = Image.open(p)
            im.load()
            w, h = im.size
            if w < 600 or h < 350 or os.path.getsize(p) < 15000:
                os.remove(p)
                continue
            hsh = ahash(im)
            if hsh in seen:
                os.remove(p)
                continue
            seen.add(hsh)
            keep.append({"n": i, "file": f, "w": w, "h": h, "kb": os.path.getsize(p) // 1024, "hash": hsh, "path": p})
        except Exception:
            if os.path.exists(p):
                os.remove(p)
    keep = keep[:8]
    json.dump(keep, open(d + "/meta.json", "w"))
    if keep:
        sheet(id_ + "__wiki", keep)
    print(id_, len(files), len(keep), flush=True)


if __name__ == "__main__":
    ids = sys.argv[1:] or list(QUERIES)
    for i in ids:
        do(i)
