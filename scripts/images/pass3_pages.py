"""Pass 2: gather image candidates from an explicit list of pages of one site and fetch them with a contact sheet.
Usage: pass3_pages.py <id> <page-url> [<page-url> ...]   (candidates come from pass3_crawl.cands; then pass3_dl.do)"""
import json, os, shutil, sys
sys.path.insert(0, "scripts/images")
from pass3_crawl import get, cands, S
from pass3_dl import do

id_, pages = sys.argv[1], sys.argv[2:]
allc = []
for u in pages:
    code, fin, body = get(u, timeout=30)
    if code == 200:
        allc += cands(body, fin or u)
seen = set()
allc = [x for x in allc if not (x in seen or seen.add(x))][:40]
p = S + "pages/%s.json" % id_
try:
    rec = json.load(open(p))
except Exception:
    rec = {"id": id_}
rec.update(cands=allc, final=pages[0], status=200, via="pages")
json.dump(rec, open(p, "w"))
d = S + "dl/" + id_
if os.path.exists(d):
    shutil.rmtree(d)
do(id_)
print(id_, len(allc))
