"""Pass 2: print Commons author/licence (extmetadata API) for the candidate files of one wiki sheet.
Usage: pass3_meta.py <id>   (reads <SCR>/p3/dl/<id>__wiki/meta.json)"""
import json, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR

id_ = sys.argv[1]
for it in json.load(open(SCR + "p3/dl/%s__wiki/meta.json" % id_)):
    u = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {"action": "query", "titles": "File:" + it["file"], "prop": "imageinfo", "iiprop": "extmetadata", "format": "json"})
    code, b = curl(u, min_gap=1.0)
    try:
        m = list(json.loads(b)["query"]["pages"].values())[0]["imageinfo"][0]["extmetadata"]
        a = re.sub(r"<[^>]+>", "", m.get("Artist", {}).get("value", "?"))
        print(it["n"], it["file"][:60], "|", a[:50], "|", m.get("LicenseShortName", {}).get("value"))
    except Exception as e:
        print(it["n"], it["file"][:60], "ERR", code)
