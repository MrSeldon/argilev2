"""Pass 2: re-serialise the four opportunity files with each file's original JSON layout (so git diffs show only the
added "image" blocks): sf-bay.json and sf-studios.json use 1-space indent, index.json and colombia.json use 2."""
import json, subprocess

INDENT = {"index": 2, "colombia": 2, "sf-bay": 1, "sf-studios": 1}
for f, ind in INDENT.items():
    p = "data/opportunities/%s.json" % f
    orig = subprocess.run(["git", "show", "HEAD:" + p], capture_output=True, text=True).stdout
    d = json.load(open(p))
    out = json.dumps(d, ensure_ascii=False, indent=ind)
    if orig.endswith("\n"):
        out += "\n"
    open(p, "w").write(out)
    print(f, "orig non-ascii:", any(ord(c) > 127 for c in orig))
