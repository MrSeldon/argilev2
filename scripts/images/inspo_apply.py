"""Download each resolved Commons image once (1 req/s, descriptive UA), convert to WebP, update data/inspirations/index.json.
Reads <SCR>/inspo_resolved.json (written by inspo_resolve*.py) and optional <SCR>/inspo_exclude.txt."""
import json, os, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR, to_webp

res = json.load(open(SCR + "inspo_resolved.json"))
excl = set(open(SCR + "inspo_exclude.txt").read().split()) if os.path.exists(SCR + "inspo_exclude.txt") else set()
RAW = SCR + "dl_inspo/"
os.makedirs(RAW, exist_ok=True)
OUT = "public/images/inspirations/"
os.makedirs(OUT, exist_ok=True)
BADLIC = re.compile(r"fair use|non-free|copyrighted|all rights", re.I)


def thumb_url(orig, w=1400):
    m = re.match(r"(https://upload\.wikimedia\.org/wikipedia/commons)/([0-9a-f]/[0-9a-f]{2})/(.+)$", orig)
    if not m:
        return orig
    return "%s/thumb/%s/%s/%dpx-%s" % (m.group(1), m.group(2), m.group(3), w, m.group(3))


def short_artist(a):
    a = re.sub(r"^(Author|Photographer|Credit)\s*:?\s*", "", a or "", flags=re.I).strip()
    a = re.sub(r"\s+", " ", a)
    return a[:70] if a else "unknown author"


d = json.load(open("data/inspirations/index.json"))
ok = fail = 0
used = {}
for cat, v in d.items():
    if not isinstance(v, list):
        continue
    for x in v:
        k = x["id"]
        rec = res.get(k, {})
        info = rec.get("info")
        x.pop("image", None)
        good = (info and info.get("original") and k not in excl and info.get("license")
                and not BADLIC.search(info["license"]) and not info["original"].lower().endswith((".svg", ".tif", ".tiff", ".pdf", ".ogg", ".webm", ".gif"))
                and info["file"] not in used)
        if good:
            raw = RAW + k
            if not os.path.exists(raw) or os.path.getsize(raw) < 3000:
                code = curl(thumb_url(info["original"]), out=raw, min_gap=1.1)
                if code != 200 or os.path.getsize(raw) < 3000:
                    code = curl(info["original"], out=raw, min_gap=1.1, timeout=90)
            try:
                size, nbytes = to_webp(raw, OUT + k + ".webp")
                x["image"] = {"src": "/images/inspirations/%s.webp" % k,
                              "alt": x["name"] + " (" + info["file"][5:].rsplit(".", 1)[0][:90] + ")",
                              "credit": "%s / Wikimedia Commons" % short_artist(info.get("artist")),
                              "creditUrl": info["page"], "license": info["license"].strip()}
                used[info["file"]] = k
                ok += 1
            except Exception as e:
                print("FAIL", k, e)
                good = False
                fail += 1
        if x.get("image"):
            x["hasImage"] = True
        else:
            x["hasImage"] = False
        x.pop("imageUrl", None)
d.setdefault("metadata", {})["imagePolicy"] = ("Images are local WebP files in public/images/inspirations/, downloaded once from Wikimedia Commons "
                                                "(each entry's `image` field carries credit, creditUrl and license). Entries without an image use fallbackColor.")
json.dump(d, open("data/inspirations/index.json", "w"), ensure_ascii=False, indent=2)
open("data/inspirations/index.json", "a").write("\n")
print("ok", ok, "fail", fail)
