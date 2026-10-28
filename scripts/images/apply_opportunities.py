"""Merge audit results into data/opportunities/*.json, download + convert images.
Usage: python3 scripts/images/apply_opportunities.py   (idempotent; reads <SCR>/results/*.json)"""
import glob, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, "scripts/images")
from common import SCR, to_webp

TODAY = "2026-10-28"
BUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
RAW = SCR + "dl_opp/"
os.makedirs(RAW, exist_ok=True)
OUT = "public/images/opportunities/"
os.makedirs(OUT, exist_ok=True)

R = {}
for f in glob.glob(SCR + "results/*.json"):
    R.update(json.load(open(f)))

files = {"index": "data/opportunities/index.json", "sf-bay": "data/opportunities/sf-bay.json",
         "colombia": "data/opportunities/colombia.json"}


def load(p):
    d = json.load(open(p))
    return d, (d["opportunities"] if isinstance(d, dict) else d)


data = {k: load(p) for k, p in files.items()}


def dl(item):
    id_, url = item
    raw = RAW + id_
    if not os.path.exists(raw):
        subprocess.run(["curl", "-sL", "--max-time", "40", "-A", BUA, "-e", url, "-o", raw, url])
    dst = OUT + id_ + ".webp"
    try:
        if os.path.getsize(raw) < 12000:
            return id_, None
        size, bytes_ = to_webp(raw, dst)
        if min(size) < 300 or max(size) < 500:
            os.remove(dst)
            return id_, None
        return id_, (size, bytes_)
    except Exception as e:
        if os.path.exists(dst):
            os.remove(dst)
        return id_, None


want = []
seen_urls = {}
for k, (d, L) in data.items():
    for x in L:
        r = R.get(x["id"])
        if r and r["decision"] == "keep" and r.get("imageUrl"):
            u = r["imageUrl"]
            if u in seen_urls:  # same photo for several entries: keep first only
                r["imageUrl"] = None
                continue
            seen_urls[u] = x["id"]
            want.append((x["id"], u))
with ThreadPoolExecutor(8) as ex:
    got = dict(ex.map(dl, want))

report = {"removed": [], "kept": {}, "images": {}}
for k, (d, L) in data.items():
    new = []
    for x in L:
        r = R.get(x["id"])
        if r is None:
            raise SystemExit("missing result for " + x["id"])
        if r["decision"] == "remove":
            report["removed"].append((k, x["id"], x["name"], x["type"], r["reason"]))
            continue
        if r.get("status"):
            x["status"] = r["status"]
        x["lastVerified"] = TODAY
        if r.get("newWebsite"):
            x["website"] = r["newWebsite"]
        if r.get("newDescription"):
            x["description"] = r["newDescription"]
        for fk, v in (r.get("updates") or {}).items():
            if "." in fk:
                a, b = fk.split(".", 1)
                x.setdefault(a, {})[b] = v
            elif fk == "duration":
                x["duration"] = dict(x.get("duration") or {}, display=v) if isinstance(x.get("duration"), dict) else {"display": v}
            else:
                x[fk] = v
        x.pop("image", None)
        g = got.get(x["id"])
        if g and r.get("imageUrl"):
            org = r.get("org") or x["name"]
            c = r.get("commons")
            if c:
                img = {"src": "/images/opportunities/%s.webp" % x["id"], "alt": r.get("imageAlt") or x["name"],
                       "credit": "%s / Wikimedia Commons" % (c.get("author") or "unknown author"),
                       "creditUrl": c.get("pageUrl") or r["imageUrl"], "license": c.get("license") or "see Commons"}
            else:
                img = {"src": "/images/opportunities/%s.webp" % x["id"], "alt": r.get("imageAlt") or x["name"],
                       "credit": "Image: %s" % org, "creditUrl": x.get("website") or r["imageUrl"],
                       "license": "publisher image"}
            x["image"] = img
            report["images"][x["id"]] = g[1]
        new.append(x)
    if isinstance(d, dict):
        d["opportunities"] = new
        md = d.get("metadata", {})
        md["totalEntries"] = len(new)
        md["lastUpdated"] = TODAY
        types = {}
        for x in new:
            types[x["type"]] = types.get(x["type"], 0) + 1
        md["types"] = types
    else:
        d = new
    json.dump(d, open(files[k], "w"), ensure_ascii=False, indent=2)
    open(files[k], "a").write("\n")
    report["kept"][k] = len(new)
json.dump(report, open(SCR + "apply_report.json", "w"))
print(report["kept"], len(report["removed"]), len(report["images"]), sum(report["images"].values()) // 1024, "KB")
