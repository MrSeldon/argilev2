"""Generate docs/opportunities-cleanup.md and docs/images-and-cleanup-report.md from the data + apply report."""
import collections, json, os, subprocess, sys
sys.path.insert(0, "scripts/images")
from common import SCR

rep = json.load(open(SCR + "apply_report.json"))
FILES = {"index": "data/opportunities/index.json", "sf-bay": "data/opportunities/sf-bay.json",
         "colombia": "data/opportunities/colombia.json"}


def load_json(txt):
    d = json.loads(txt)
    return d["opportunities"] if isinstance(d, dict) else d


old = {k: load_json(subprocess.run(["git", "show", "HEAD:" + p], capture_output=True, text=True).stdout)
       for k, p in FILES.items()}
new = {k: load_json(open(p).read()) for k, p in FILES.items()}

# ---- cleanup doc
out = ["# Opportunities cleanup (2026-10-28)", "",
       "Entries removed from `data/opportunities/*.json` during the audit, with the reason. Every kept entry in "
       "`index.json` was checked against its official page (or a found replacement page); `status` is `active` "
       "(evidence from 2025-2026) or `unconfirmed` (exists, no recent evidence). Deadlines/costs were only changed "
       "when a page stated them.", "",
       "| File | id | Name | Type | Reason |", "|---|---|---|---|---|"]
for f, id_, name, typ, reason in rep["removed"]:
    out.append("| %s | `%s` | %s | %s | %s |" % (f, id_, name.replace("|", "/"), typ, reason.replace("|", "/")))
out.append("")
open("docs/opportunities-cleanup.md", "w").write("\n".join(out))

# ---- report
R = ["# Images and cleanup report (2026-10-28)", ""]
R += ["## Opportunities: counts", "", "| File | Before | Removed | Kept | active | unconfirmed | other status |", "|---|---|---|---|---|---|---|"]
for k in FILES:
    st = collections.Counter(x.get("status") for x in new[k])
    R.append("| %s | %d | %d | %d | %d | %d | %d |" % (k, len(old[k]), len(old[k]) - len(new[k]), len(new[k]),
                                                      st["active"], st["unconfirmed"],
                                                      len(new[k]) - st["active"] - st["unconfirmed"]))
R += ["", "## Opportunities: by type (kept / removed / unconfirmed / with image)", ""]
for k in FILES:
    R += ["### " + k, "", "| Type | Before | Kept | Removed | Unconfirmed | With image |", "|---|---|---|---|---|---|"]
    types = sorted(set(x["type"] for x in old[k]))
    for t in types:
        b = [x for x in old[k] if x["type"] == t]
        n = [x for x in new[k] if x["type"] == t]
        R.append("| %s | %d | %d | %d | %d | %d |" % (t, len(b), len(n), len(b) - len(n),
                                                      sum(1 for x in n if x.get("status") == "unconfirmed"),
                                                      sum(1 for x in n if x.get("image"))))
    R.append("")
tot_img = tot_kb = 0
R += ["## Image coverage and weight", "", "| Set | Entries | With image | Coverage | Weight |", "|---|---|---|---|---|"]


def wt(d):
    n = 0
    for f in os.listdir(d):
        n += os.path.getsize(os.path.join(d, f))
    return n


for k in FILES:
    c = sum(1 for x in new[k] if x.get("image"))
    R.append("| opportunities/%s | %d | %d | %d%% | - |" % (k, len(new[k]), c, round(100 * c / len(new[k]))))
ins = json.load(open("data/inspirations/index.json"))
ie = [x for v in ins.values() if isinstance(v, list) for x in v]
ic = sum(1 for x in ie if x.get("image"))
R.append("| inspirations | %d | %d | %d%% | - |" % (len(ie), ic, round(100 * ic / len(ie))))
ow, iw = wt("public/images/opportunities"), wt("public/images/inspirations")
R += ["", "Opportunity images: %d files, %.1f MB (avg %d KB). Inspiration images: %d files, %.1f MB (avg %d KB). "
      "Total %.1f MB." % (len(os.listdir("public/images/opportunities")), ow / 1e6,
                          ow / 1024 / max(1, len(os.listdir("public/images/opportunities"))),
                          len(os.listdir("public/images/inspirations")), iw / 1e6,
                          iw / 1024 / max(1, len(os.listdir("public/images/inspirations"))), (ow + iw) / 1e6), ""]
big = sorted(((os.path.getsize("public/images/%s/%s" % (d, f)), d, f) for d in ("opportunities", "inspirations")
              for f in os.listdir("public/images/" + d)), reverse=True)[:5]
R += ["Largest: " + ", ".join("%s/%s (%d KB)" % (d, f, s // 1024) for s, d, f in big), ""]
open("docs/images-and-cleanup-report.md", "w").write("\n".join(R) + "\n" + open("scripts/images/report_tail.md").read()
                                                       if os.path.exists("scripts/images/report_tail.md") else "\n".join(R))
print("\n".join(R))
