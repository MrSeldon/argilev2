"""Pass 2 clean-up: tidy scraped Commons author strings and bring any image still over ~200 KB under it.
Idempotent. Usage: python3 scripts/images/pass2_fix.py"""
import json, os, re
from PIL import Image

FILES = ["index", "sf-bay", "sf-studios", "colombia"]
CREDIT = {  # entry id -> credit string (author as shown on the Commons file page)
    "u-florida-ceramics": "University of Florida Digital Collections / Wikimedia Commons",
    "u-delaware-ceramics": "Cargoudel / Wikimedia Commons",
    "musashino-art-university": "Hykw-a4 / Wikimedia Commons",
    "harvard-ceramics": "Mancala / Wikimedia Commons",
    "u-kentucky-ceramics": "Seicer / Wikimedia Commons",
    "national-taiwan-arts": "Foxy Who / Wikimedia Commons",
    "florida-state-ceramics": "Tim Ross (original by TrbleClef) / Wikimedia Commons",
    "ccsf-ceramics": "Mariwlqs / Wikimedia Commons",
    "daad-germany": "Raimond Spekking / Wikimedia Commons",
    "macdowell": "Magicpiano / Wikimedia Commons",
    "co-expoartesanias-2026": "Rainercol / Wikimedia Commons",
}
ALT = {
    "u-delaware-ceramics": "Memorial fountain and magnolias at the University of Delaware",
    "vlir-uos-belgium": "Graduates in caps and gowns celebrating, from the VLIR-UOS site",
    "akademie-schloss-solitude": "Two people talking beside suspended textile works, from the Akademie Schloss Solitude site",
    "between-bridges": "Plywood wall and a hanging monitor in an exhibition space, from the Between Bridges site",
    "iaspis-residency": "Framed works hung salon-style along a gallery corridor, from the IASPIS site",
    "ics-hungary": "Residents at a long table with white porcelain forms, International Ceramics Studio, Hungary",
    "wvu-ceramics": "A student assembling a sculpture at a work table, from the West Virginia University art program",
    "kyoto-seika-ceramics": "Students outside a building on the Kyoto Seika University campus",
}
LIMIT = 200 * 1024

for f in FILES:
    p = "data/opportunities/%s.json" % f
    d = json.load(open(p))
    L = d["opportunities"] if isinstance(d, dict) else d
    for e in L:
        im = e.get("image")
        if not im:
            continue
        if e["id"] in CREDIT and "Wikimedia" in im["credit"]:
            im["credit"] = CREDIT[e["id"]]
        if e["id"] in ALT:
            im["alt"] = ALT[e["id"]]
        fp = "public" + im["src"]
        if os.path.exists(fp) and os.path.getsize(fp) > LIMIT:
            img = Image.open(fp).convert("RGB")
            side = max(img.size)
            for target in (1200, 1100, 1000, 900):
                w, h = img.size
                s = target / max(w, h)
                small = img.resize((round(w * s), round(h * s)), Image.LANCZOS) if s < 1 else img
                for q in (76, 70, 64, 58):
                    small.save(fp, "WEBP", quality=q, method=6)
                    if os.path.getsize(fp) <= LIMIT:
                        break
                if os.path.getsize(fp) <= LIMIT:
                    break
            print("recompressed", e["id"], small.size, os.path.getsize(fp) // 1024, "KB")
    json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
    open(p, "a").write("\n")
