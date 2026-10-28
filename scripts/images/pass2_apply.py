"""Pass 2 final step: for every chosen image (<SCR>/p2/picks.py) convert to WebP (<=1400px, q~78, ~<=180 KB) in
public/images/opportunities/<id>.webp and write the "image" object into data/opportunities/*.json.
Website images: credit "Image: <org>", creditUrl = the entry's page, license "publisher image".
Wikimedia Commons images (src "<id>__wiki"): author + licence read from the Commons file page.
Usage: python3 scripts/images/pass2_apply.py   (idempotent)"""
import json, os, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, to_webp, SCR
import inspo_resolve as R

S = SCR + "p2/"
OUT = "public/images/opportunities/"
ns = {}
exec(open("scripts/images/pass2_picks.py").read(), ns)  # chosen candidate per entry (n = candidate number on the contact sheet)
P = ns["P"]
FILES = {"index": "data/opportunities/index.json", "sf-bay": "data/opportunities/sf-bay.json",
         "sf-studios": "data/opportunities/sf-studios.json", "colombia": "data/opportunities/colombia.json"}
FREE = re.compile(r"CC0|CC BY|Public domain|PD|GFDL|Attribution", re.I)


def load(p):
    d = json.load(open(p))
    return d, (d["opportunities"] if isinstance(d, dict) else d)


data = {k: load(p) for k, p in FILES.items()}
byid = {x["id"]: (k, x) for k, (d, L) in data.items() for x in L}
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
        raw = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/p2/dl/%s/full_%02d.jpg" % (src, n)
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
    size, nbytes = to_webp(raw, dst)
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
for k, (d, L) in data.items():
    json.dump(d, open(FILES[k], "w"), ensure_ascii=False, indent=2)
    open(FILES[k], "a").write("\n")
json.dump(report, open(S + "apply_report.json", "w"))
print(len(report), "images,", sum(v[2] for v in report.values()) // 1024, "KB total")
