"""Pass 2 fallback: Commons full-text file search for entries with no usable site photo or Wikipedia article image.
Usage: pass3_csearch.py <id> "<query>" ["<query>" ...]  -> downloads up to 8 JPEG thumbnails (>=600 px wide) of the
search hits into <SCR>/p3/dl/<id>__wiki/ with a contact sheet and meta.json (file names), then pass3_meta.py <id>
prints author/licence for the choice."""
import html, json, os, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR
from pass3_dl import sheet, ahash, S
from PIL import Image

SKIP = re.compile(r"logo|flag|map|seal|coat_of|signature|diagram|icon|symbol|emblem|crest|plan|wordmark|portrait|headshot|poster|banner|stamp|\.svg|\.png|\.gif|\.pdf|\.tif", re.I)
id_, queries = sys.argv[1], sys.argv[2:]
files = []
for q in queries:
    u = "https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode({"search": q, "ns6": 1, "fulltext": 1, "limit": 14})
    code, b = curl(u, min_gap=1.1)
    h = b.decode("utf-8", "ignore")
    for f in re.findall(r'title="(File:[^"]*\.(?:jpe?g|JPE?G))"', h):
        f = html.unescape(f)[5:]
        if f not in files and not SKIP.search(f):
            files.append(f)
d = S + "dl/" + id_ + "__wiki"
os.makedirs(d, exist_ok=True)
keep, seen = [], set()
for i, f in enumerate(files[:12]):
    p = "%s/%02d.jpg" % (d, i)
    curl("https://commons.wikimedia.org/wiki/Special:FilePath/%s?width=800" % urllib.parse.quote(f.replace(" ", "_"), safe="(),!'~_.-"), out=p, min_gap=0.7)
    try:
        im = Image.open(p)
        im.load()
        w, h2 = im.size
        if w < 600 or h2 < 350 or os.path.getsize(p) < 15000:
            os.remove(p)
            continue
        hs = ahash(im)
        if hs in seen:
            os.remove(p)
            continue
        seen.add(hs)
        keep.append({"n": i, "file": f, "w": w, "h": h2, "kb": os.path.getsize(p) // 1024, "hash": hs, "path": p})
    except Exception:
        if os.path.exists(p):
            os.remove(p)
keep = keep[:8]
json.dump(keep, open(d + "/meta.json", "w"))
if keep:
    sheet(id_ + "__wiki", keep)
print(id_, len(files), len(keep), [k["file"][:40] for k in keep])
