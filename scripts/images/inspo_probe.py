import json, urllib.parse, sys
sys.path.insert(0, "scripts/images")
from common import api, SCR


def fname(u):
    u = urllib.parse.unquote(u)
    parts = u.split('/')
    if '/thumb/' in u:
        return parts[-2]
    return parts[-1]


if __name__ == "__main__":
    d = json.load(open('data/inspirations/index.json'))
    entries = []
    for k, v in d.items():
        if isinstance(v, list):
            for x in v:
                entries.append((k, x))
    names = {x['id']: fname(x['imageUrl']) for k, x in entries}
    out = {}
    ids = list(names)
    for i in range(0, len(ids), 15):
        chunk = ids[i:i + 15]
        titles = "|".join("File:" + names[c].replace('_', ' ') for c in chunk)
        r = api(action='query', titles=titles, prop='imageinfo',
                iiprop='extmetadata|url|size', iiurlwidth=1400)
        for pg in r['query']['pages'].values():
            out[pg['title']] = pg.get('imageinfo') and pg['imageinfo'][0] or None
    json.dump({'names': names, 'info': out}, open(SCR + 'probe.json', 'w'))
    print(len(names), sum(1 for v in out.values() if v))
    for c in ids:
        t = "File:" + names[c].replace('_', ' ')
        if not out.get(t):
            print("MISSING", c, names[c])
