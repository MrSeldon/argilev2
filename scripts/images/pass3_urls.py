"""Pass 2: register hand-found candidate image URLs (e.g. read from a page in the Browser pane) and fetch them with
a contact sheet.  Usage: pass3_urls.py <id> <referer-page> <url> [<url> ...]"""
import json, os, shutil, sys
sys.path.insert(0, "scripts/images")
from pass3_dl import do, S

id_, ref, urls = sys.argv[1], sys.argv[2], sys.argv[3:]
p = S + "pages/%s.json" % id_
try:
    rec = json.load(open(p))
except Exception:
    rec = {"id": id_}
rec.update(cands=urls, final=ref, status=200, via="manual")
json.dump(rec, open(p, "w"))
d = S + "dl/" + id_
if os.path.exists(d):
    shutil.rmtree(d)
do(id_)
