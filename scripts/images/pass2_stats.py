"""Pass 2: coverage before/after per file, weight of added images, licence mix."""
import collections, json, os
SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
todo = {t[1] for t in json.load(open(SCR + "todo.json"))}
before = {"index": 80, "sf-bay": 16, "sf-studios": 0, "colombia": 9}
tot = tw = commons = mx = 0
lic = collections.Counter()
for f in ["index", "sf-bay", "sf-studios", "colombia"]:
    d = json.load(open("data/opportunities/%s.json" % f))
    L = d["opportunities"] if isinstance(d, dict) else d
    c = sum(1 for e in L if e.get("image"))
    added = [e for e in L if e["id"] in todo and e.get("image")]
    sizes = [os.path.getsize("public" + e["image"]["src"]) for e in added]
    cm = sum(1 for e in added if "Wikimedia" in e["image"]["credit"])
    print(f, len(L), before[f], "->", c, "added", len(added), "KB", sum(sizes) // 1024, "commons", cm)
    tot += len(added); tw += sum(sizes); commons += cm; mx = max([mx] + sizes)
    for e in added:
        lic[e["image"]["license"]] += 1
print("total added", tot, round(tw / 1024 / 1024, 2), "MB", "commons", commons, "max KB", mx // 1024, "avg KB", tw // tot // 1024)
print(dict(lic))
