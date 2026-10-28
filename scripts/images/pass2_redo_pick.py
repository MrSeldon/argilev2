"""Pass 2: drop the image of the given entry ids (data + file) so pass2_apply.py can re-apply a corrected pick.
Usage: pass2_redo_pick.py <id> [<id> ...]"""
import json, os, sys
ids = set(sys.argv[1:])
for f in ["index", "sf-bay", "sf-studios", "colombia"]:
    p = "data/opportunities/%s.json" % f
    d = json.load(open(p))
    for e in (d["opportunities"] if isinstance(d, dict) else d):
        if e["id"] in ids and e.get("image"):
            fp = "public" + e["image"]["src"]
            if os.path.exists(fp):
                os.remove(fp)
            del e["image"]
            print("dropped", e["id"])
    ind = 1 if f in ("sf-bay", "sf-studios") else 2
    out = json.dumps(d, ensure_ascii=False, indent=ind)
    open(p, "w").write(out + "\n")
