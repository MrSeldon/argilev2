"""Commons HTML search (the action API was 503ing) to list candidate files for a handful of entries."""
import html, json, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from common import curl, SCR

Q = {
 "rie": "Lucie Rie bowl", "ken-price": "Ken Price ceramic sculpture", "toshiko-takaezu": "Toshiko Takaezu",
 "ruth-duckworth": "Ruth Duckworth ceramic", "phil-rogers": "Phil Rogers potter", "lisa-hammond": "Lisa Hammond potter",
 "clary-illian": "Clary Illian", "shozo-michikawa": "Michikawa Shozo", "gwyn-hanssen-pigott": "Gwyn Hanssen Pigott",
 "akira-satake": "Akira Satake pottery", "nesta-nala": "Nesta Nala pot", "dyalvane": "Andile Dyalvane",
 "peter-lane": "Peter Lane ceramics", "ewen-henderson": "Ewen Henderson ceramic", "sandy-brown": "Sandy Brown potter",
 "ken-matsuzaki": "Ken Matsuzaki pottery", "la-borne": "La Borne poterie", "crystalline": "crystalline glaze vase",
 "smoke-firing": "smoke fired pottery", "picasso-vallauris": "Picasso ceramics Madoura", "shigaraki": "Shigaraki ware jar",
 "karatsu": "Karatsu ware", "arita": "Arita porcelain", "vallauris": "Vallauris poterie", "faenza": "Faenza ceramics majolica",
 "victoria-albert": "Victoria and Albert Museum Cromwell Road facade", "grottaglie": "Grottaglie ceramics",
 "icheon": "Icheon ceramics", "liquid": "glaze drip pottery", "stone": "stoneware pot unglazed", "skin": "terra sigillata pottery",
 "local-materials": "digging clay", "fire-collaboration": "wood kiln firing flames", "daily-object": "Japanese chawan tea bowl",
 "reduction-firing": "gas kiln reduction firing", "wood-firing": "noborigama wood kiln", "anagama": "anagama kiln firing",
 "press-molding": "pottery press mold", "slip-trailing": "slip trailed dish", "oxide-wash": "cobalt oxide pottery decoration",
 "crawling": "glaze crawling pottery", "carbon-trap": "carbon trap shino", "zulu": "Zulu ukhamba pot",
 "staffordshire": "Staffordshire pottery", "african-coil": "coil built pot Africa", "maria-black-on-black": "Maria Martinez black on black pot",
 "met-ceramics": "Metropolitan Museum Art ceramics gallery", "stone-x": "x",
}
out = {}
for k, q in Q.items():
    if k.endswith("-x"):
        continue
    u = "https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode(
        {"search": q, "ns6": 1, "fulltext": 1, "limit": 12})
    code, b = curl(u, min_gap=1.1)
    h = b.decode("utf-8", "ignore")
    fs = [html.unescape(f) for f in re.findall(r'title="(File:[^"]*\.(?:jpe?g|JPE?G|png|PNG))"', h) if "does not exist" not in f]
    out[k] = list(dict.fromkeys(fs))[:10]
    print(k, "|", q)
    for f in out[k]:
        print("    ", f)
json.dump(out, open(SCR + "inspo_search.json", "w"))
