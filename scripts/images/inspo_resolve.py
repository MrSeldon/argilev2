"""Resolve a freely licensed Commons file for each inspiration entry (HTML + REST only; the action API was 503ing).
Step A: filename in the entry's existing imageUrl, if the Commons file page exists.
Step B: lead image of the English Wikipedia article (REST summary) for a few title candidates.
Then read license/author from the Commons file page. Cache: <SCR>/inspo_resolved.json. 1 req/s."""
import json, os, re, sys, html, time, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR

CACHE = SCR + "inspo_resolved.json"
res = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
WP = "https://en.wikipedia.org/api/rest_v1/page/summary/"
CM = "https://commons.wikimedia.org/wiki/File:"
FREE = re.compile(r"CC0|CC BY|Public domain|PD|GFDL|Attribution", re.I)


def get(url, tries=4):
    for i in range(tries):
        code, body = curl(url, min_gap=1.1)
        if code in (200, 404):
            return code, body.decode("utf-8", "ignore")
        time.sleep(10 + 10 * i)
    return 0, ""


def fname(u):
    u = urllib.parse.unquote(u)
    parts = u.split('/')
    return (parts[-2] if '/thumb/' in u else parts[-1]).split('?')[0]


def clean(s):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()


def commons_info(name):
    name = name.replace(' ', '_')
    code, h = get(CM + urllib.parse.quote(name, safe="(),!'~_.-"))
    if code != 200 or 'licensetpl' not in h and 'Permission' not in h:
        return None
    lic = re.search(r'licensetpl&#95;short"[^>]*>([^<]+)<', h)
    link = re.search(r'rel="license" href="([^"]+)"', h)
    art = re.search(r'id="fileinfotpl&#95;aut".*?</td>\s*<td[^>]*>(.*?)</td>', h, re.S)
    orig = re.search(r'(https://upload\.wikimedia\.org/wikipedia/commons/[0-9a-f]/[0-9a-f]{2}/[^"?]+)\?utm_source=commons[^"]*content=original', h)
    wh = re.search(r'fullImageLink.*?(\d[\d,]*)\s*[×x]\s*(\d[\d,]*)\s*pixels', h, re.S)
    return {"file": "File:" + name.replace('_', ' '), "license": clean(lic.group(1)) if lic else None,
            "licenseUrl": link.group(1) if link else None, "artist": clean(art.group(1))[:120] if art else None,
            "original": orig.group(1) if orig else None,
            "page": "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(name)}


def wp_lead(title):
    code, b = get(WP + urllib.parse.quote(title.replace(' ', '_')))
    if code != 200:
        return None
    j = json.loads(b)
    if j.get("type") == "disambiguation" or not j.get("originalimage"):
        return None
    src = j["originalimage"]["source"]
    if "/commons/" not in src:
        return None
    return {"article": j["title"], "file": fname(src)}


if __name__ == "__main__":
    d = json.load(open('data/inspirations/index.json'))
    for cat, v in d.items():
        if not isinstance(v, list):
            continue
        for x in v:
            k = x['id']
            if k in res and res[k].get('info'):
                continue
            rec = {"cat": cat, "name": x['name'], "orig": fname(x['imageUrl'])}
            info = commons_info(rec['orig'])
            rec['from'] = 'orig' if info else None
            if not info:
                nm = x['name']
                base = re.sub(r"\s*\(.*?\)", "", nm)
                cands = [nm, base]
                if cat in ('traditions', 'techniques', 'surfaces'):
                    cands += [base + " pottery", base + " ware", base + " ceramics"]
                for c in dict.fromkeys(cands):
                    wl = wp_lead(c)
                    if wl:
                        rec['wiki'] = wl
                        info = commons_info(wl['file'])
                        if info:
                            rec['from'] = 'wiki:' + wl['article']
                            break
            rec['info'] = info
            res[k] = rec
            json.dump(res, open(CACHE, 'w'))
            print(k, rec['from'], (info or {}).get('file'), (info or {}).get('license'), flush=True)
    print("done")
