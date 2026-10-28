"""Fetch every opportunity website once; cache status, og:image, title and visible text.
Output: <SCR>/pages/<id>.json  (not committed; scratch cache for the audit)."""
import json, os, re, subprocess, sys, html
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, "scripts/images")
from common import SCR

OUT = SCR + "pages/"
os.makedirs(OUT, exist_ok=True)
BROWSER_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 LeFourArgile/1.0 (devin.maloney@gmail.com)")


def meta(h, *keys):
    for k in keys:
        m = re.search(r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']+)["\']' % k, h, re.I) or \
            re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']%s["\']' % k, h, re.I)
        if m:
            return html.unescape(m.group(1))
    return None


def fetch(item):
    id_, url = item
    path = OUT + id_ + ".json"
    if os.path.exists(path):
        return
    rec = {"id": id_, "url": url, "status": None}
    if url and url.startswith("http"):
        try:
            r = subprocess.run(["curl", "-sL", "--max-time", "25", "--max-filesize", "3000000", "-A", BROWSER_UA,
                                "-w", "\n__CODE__%{http_code} %{url_effective}", url],
                               capture_output=True, timeout=40)
            body = r.stdout.decode("utf-8", "ignore")
            body, _, tail = body.rpartition("\n__CODE__")
            code, _, final = tail.partition(" ")
            rec["status"] = int(code or 0)
            rec["final"] = final.strip()
            rec["title"] = (re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S) or [None, None])[1]
            if rec["title"]:
                rec["title"] = html.unescape(re.sub(r"\s+", " ", rec["title"]).strip())
            rec["ogImage"] = meta(body, "og:image", "twitter:image", "og:image:url")
            rec["ogDesc"] = meta(body, "og:description", "description")
            t = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", body, flags=re.S | re.I)
            t = re.sub(r"<[^>]+>", " ", t)
            t = html.unescape(re.sub(r"\s+", " ", t)).strip()
            rec["text"] = t[:7000]
            rec["years"] = sorted(set(re.findall(r"\b(202[3-7])\b", t)))
        except Exception as e:
            rec["error"] = str(e)[:100]
    json.dump(rec, open(path, "w"))


if __name__ == "__main__":
    items = []
    for f in ["index", "sf-bay", "colombia"]:
        d = json.load(open("data/opportunities/%s.json" % f))
        L = d["opportunities"] if isinstance(d, dict) else d
        for x in L:
            items.append((x["id"], x.get("website")))
    with ThreadPoolExecutor(16) as ex:
        list(ex.map(fetch, items))
    print("done", len(items))
