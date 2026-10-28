"""Pass 3: re-crawl selected entries with a full desktop-browser User-Agent (some sites answer 406 to the short one,
and a few return nothing useful without it), then download candidates and build contact sheets.
Usage: pass3_retry.py <id> [<id> ...]"""
import json, os, shutil, sys
sys.path.insert(0, "scripts/images")
import pass3_crawl as C
import pass3_dl as D

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
C.UA = UA
D.UA = UA
todo = {t[1]: t for t in json.load(open(C.SCR + "todo3.json"))}
for i in sys.argv[1:]:
    p = C.S + "pages/%s.json" % i
    if os.path.exists(p):
        os.remove(p)
    C.work(todo[i])
    shutil.rmtree(D.S + "dl/" + i, ignore_errors=True)
    D.do(i)
    r = json.load(open(p))
    m = D.S + "dl/%s/meta.json" % i
    print(i, r["status"], len(r["cands"]), len(json.load(open(m))) if os.path.exists(m) else None, flush=True)
