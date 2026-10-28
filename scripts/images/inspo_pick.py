"""Apply hand-picked Commons files (from inspo_search.json) and the exclusion list for inspirations."""
import json, sys
sys.path.insert(0, "scripts/images")
import inspo_resolve as R
from common import SCR

PICK = {
    "rie": "Bowl by Lucie Rie, National Museum Cardiff",
    "shozo-michikawa": "Michikawa Shozo 2017",
    "ewen-henderson": "Pinched, Coiled pot by Ewen Henderson",
    "crystalline": "Vase with crystal glaze coating 02",
    "shigaraki": "Shigaraki Jar.JPG",
    "karatsu": "Iwao Karatsu-ware tea bowl.jpg",
    "arita": "Arita porcelain bottle",
    "vallauris": "Vallauris atelier de potier",
    "faenza": "Faenza maiolica, piatto con leandro",
    "victoria-albert": "Knowledge by Alfred Drury",
    "grottaglie": "Capasoni (Grottaglie)",
    "icheon": "이천 도자기 축제 (4)",
    "liquid": "Uranium glazed drip bowl",
    "stone": "Teapot in the shape of a sheng",
    "skin": "ML - Terra sigillata Becher",
    "local-materials": "Julian Martinez digging clay",
    "daily-object": "Ido chawan Kizaemon",
    "anagama": "Scott Meyers at Anagama firing",
    "wood-firing": "Jiaotanxia dragon kiln",
    "slip-trailing": "Thrown, Slip Trailed, Feathered Dish",
    "zulu": "Black pot Ukhamba Zulu",
    "met-ceramics": "Jar with Dragon - MET",
    "african-coil": "__NIGERIA__",
}
EXCLUDE = """fire-collaboration reduction-firing press-molding carbon-trap tradition-innovation functional-sculpture
maria-black-on-black crawling volcanic constraint-creativity smoke-firing victoria-albert coiling sgraffito""".split()

if __name__ == "__main__":
    res = json.load(open(R.CACHE))
    srch = json.load(open(SCR + "inspo_search.json"))
    for k, sub in PICK.items():
        if sub == "__NIGERIA__":
            f = "Traditional pottery in Nigeria (Ikpu ite) 19.jpg"
        else:
            m = [x for x in srch[k] if sub in x]
            if not m:
                print("NO MATCH", k, sub)
                continue
            f = m[0][5:]
        info = R.commons_info(f)
        print(k, f, info and info.get("license"))
        if info:
            res[k] = dict(res.get(k, {}), info=info, **{"from": "search"})
    json.dump(res, open(R.CACHE, "w"))
    open(SCR + "inspo_exclude.txt", "w").write("\n".join(EXCLUDE))
