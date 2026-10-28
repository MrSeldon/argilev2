"""Manual curation pass after eyeballing contact sheets: drop logos, text banners, collages, off-topic shots."""
import json, os

DROP = """arquetopia co-raquira-concurso-torneros co-feria-nacional-artesanal-pitalito co-la-chamba-arcilla-predio
sfbay-wheelhouse-clay-studio usa-fellowship hambidge vlir-uos-belgium pottery-nw-apprentice sonoma sjsu-ceramics
sfbay-castro-clay""".split()
for f in ["index", "sf-bay", "colombia"]:
    p = "data/opportunities/%s.json" % f
    d = json.load(open(p))
    L = d["opportunities"] if isinstance(d, dict) else d
    for x in L:
        if x["id"] in DROP and "image" in x:
            del x["image"]
            fp = "public/images/opportunities/%s.webp" % x["id"]
            if os.path.exists(fp):
                os.remove(fp)
    json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
    open(p, "a").write("\n")
