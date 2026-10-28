"""Pass 2 fallback: for sites that block curl (403/0/5xx) or gave no image candidates, read the Internet Archive's
latest snapshot of the page (plus a couple of subpages) and collect candidate image URLs the same way as pass2_crawl.
Usage: pass2_wayback.py id [id ...]   (rewrites <SCR>/p2/pages/<id>.json cands; delete dl/<id> then run pass2_dl.py <id>)"""
import json, os, re, sys, shutil, urllib.parse
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, "scripts/images")
from pass2_crawl import get, cands, sublinks, S


def work(id_):
    path = S + "pages/%s.json" % id_
    rec = json.load(open(path))
    url = rec["url"]
    wb = "https://web.archive.org/web/2025/" + url
    code, fin, body = get(wb, timeout=40)
    rec["wb_status"] = code
    c = []
    if code == 200 and body:
        def fix(u):
            return u
        c = cands(body, fin)
        # keep only real image hosts, not archive.org chrome
        c = [u for u in c if "archive.org/_static" not in u and "web-static.archive.org" not in u]
        for sl in sublinks(body, fin, 3):
            c2, f2, b2 = get(sl, timeout=30)
            if c2 == 200:
                c += [u for u in cands(b2, f2) if "archive.org/_static" not in u and "web-static.archive.org" not in u]
    seen = set()
    rec["cands"] = [x for x in c if not (x in seen or seen.add(x))][:40]
    json.dump(rec, open(path, "w"))
    d = S + "dl/" + id_
    if os.path.exists(d):
        shutil.rmtree(d)
    print(id_, code, len(rec["cands"]), flush=True)


if __name__ == "__main__":
    with ThreadPoolExecutor(2) as ex:  # archive.org resets connections under heavier parallelism
        list(ex.map(work, sys.argv[1:]))
