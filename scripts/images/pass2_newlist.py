"""Pass 2: write <SCR>/p2/apply_report_all.json = {id: bytes} for every image added in pass 2 (ids in todo.json that now
have an image), for verification and the weight total in docs/images-pass-2.md."""
import json, os
SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
todo = {t[1] for t in json.load(open(SCR + "todo.json"))}
out = {}
for f in ["index", "sf-bay", "sf-studios", "colombia"]:
    d = json.load(open("data/opportunities/%s.json" % f))
    for e in (d["opportunities"] if isinstance(d, dict) else d):
        if e["id"] in todo and e.get("image"):
            out[e["id"]] = os.path.getsize("public" + e["image"]["src"])
json.dump(out, open(SCR + "p2/apply_report_all.json", "w"))
print(len(out), sum(out.values()) // 1024, "KB", max(out.values()) // 1024, "KB max")
