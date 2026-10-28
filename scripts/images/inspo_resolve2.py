"""Second pass: curated Wikipedia article candidates for entries the automatic pass missed or got wrong."""
import json, sys
sys.path.insert(0, "scripts/images")
import inspo_resolve as R

OVR = {
    "african-coil": ["Pottery of Africa", "African pottery", "Coil pottery"],
    "song-dynasty": ["Ding ware", "Ru ware", "Five Great Kilns", "Chinese ceramics"],
    "imari": ["Imari ware", "Arita ware"],
    "staffordshire": ["Staffordshire pottery", "Staffordshire figures", "Staffordshire Potteries"],
    "zulu": ["Zulu pottery", "Ukhamba", "Zulu people"],
    "islamic-luster": ["Lustreware", "Islamic pottery", "Luster"],
    "sancai": ["Sancai", "Tang dynasty pottery"],
    "yixing": ["Yixing clay teapot", "Yixing ware"],
    "karatsu": ["Karatsu ware"],
    "meissen": ["Meissen porcelain", "Meissen Porcelain Manufactory"],
    "shigaraki": ["Shigaraki ware"],
    "iznik": ["Iznik pottery"],
    "buncheong": ["Buncheong"],
    "mishima": ["Mishima (pottery)", "Mishima ware", "Inlay (pottery)"],
    "rie": ["Lucie Rie"],
    "ken-price": ["Ken Price (artist)", "Ken Price"],
    "toshiko-takaezu": ["Toshiko Takaezu"],
    "ruth-duckworth": ["Ruth Duckworth"],
    "phil-rogers": ["Phil Rogers (potter)", "Phil Rogers (ceramicist)"],
    "lisa-hammond": ["Lisa Hammond (potter)", "Lisa Hammond"],
    "clary-illian": ["Clary Illian"],
    "shozo-michikawa": ["Shozo Michikawa", "Shōzō Michikawa"],
    "jennifer-lee": ["Jennifer Lee (potter)", "Jennifer Lee (ceramicist)"],
    "gwyn-hanssen-pigott": ["Gwyn Hanssen Pigott"],
    "akira-satake": ["Akira Satake"],
    "nesta-nala": ["Nesta Nala"],
    "dyalvane": ["Andile Dyalvane"],
    "peter-lane": ["Peter Lane (potter)", "Peter Lane (ceramicist)"],
    "ewen-henderson": ["Ewen Henderson"],
    "sandy-brown": ["Sandy Brown (potter)", "Sandy Brown (ceramicist)"],
    "ken-matsuzaki": ["Ken Matsuzaki"],
    "mashiko": ["Mashiko ware", "Mashiko, Tochigi"],
    "jingdezhen": ["Jingdezhen porcelain", "Jingdezhen"],
    "oaxaca": ["San Bartolo Coyotepec", "Oaxaca"],
    "grottaglie": ["Grottaglie ceramics", "Grottaglie"],
    "st-ives": ["St Ives, Cornwall", "Leach Pottery"],
    "stoke-on-trent": ["Gladstone Pottery Museum", "Bottle kiln", "Stoke-on-Trent"],
    "arita": ["Arita ware", "Arita, Saga"],
    "vallauris": ["Madoura Pottery", "Vallauris"],
    "seto": ["Seto ware", "Seto, Aichi"],
    "met-ceramics": ["Metropolitan Museum of Art"],
    "victoria-albert": ["Victoria and Albert Museum"],
    "faenza": ["Faenza pottery", "Faenza"],
    "fez": ["Fez pottery", "Fez, Morocco"],
    "icheon": ["Icheon ceramics", "Icheon"],
    "la-borne": ["La Borne", "La Borne (Cher)"],
    "tokoname": ["Tokoname ware", "Tokoname"],
    "deruta": ["Deruta pottery", "Deruta ceramics", "Deruta"],
    "volcanic": ["Ash glaze", "Crater glaze", "Lava glaze"],
    "liquid": ["Glaze (ceramics)", "Glaze"],
    "stone": ["Stoneware"],
    "skin": ["Slip (ceramics)", "Terra sigillata"],
    "ash": ["Ash glaze", "Ash glaze (ceramics)", "Wood ash"],
    "crystalline": ["Crystalline glaze", "Crystalline glaze (ceramics)"],
    "carbon-trap": ["Saggar firing", "Saggar", "Pit firing"],
    "oil-spot": ["Tenmoku", "Jian ware", "Jianyang ware"],
    "crawling": ["Crawling (ceramics)", "Crazing", "Craquelure"],
    "celadon-surface": ["Longquan celadon", "Korean celadon", "Goryeo celadon"],
    "copper-red": ["Sang de boeuf (pottery)", "Oxblood glaze", "Copper-red glaze"],
    "hares-fur": ["Tenmoku", "Jian ware", "Jianyang ware"],
    "burnishing": ["Burnishing (pottery)", "Burnishing (metalworking)", "Burnished pottery"],
    "wood-firing": ["Anagama kiln", "Wood-fired kiln", "Noborigama"],
    "pit-firing": ["Pit fired pottery", "Pit firing", "Pit fire"],
    "reduction-firing": ["Reduction firing", "Kiln"],
    "slip-trailing": ["Slipware", "Slip decoration", "Slip trailing"],
    "nerikomi": ["Nerikomi", "Agateware"],
    "ash-glazing": ["Natural ash glaze", "Wood ash glaze", "Ash glaze"],
    "raku-firing": ["Raku ware", "Raku firing"],
    "soda-firing": ["Soda firing", "Salt glaze pottery", "Soda glaze"],
    "anagama": ["Anagama kiln"],
    "press-molding": ["Press moulding", "Slump moulding", "Mold (manufacturing)"],
    "slip-casting": ["Slip casting"],
    "smoke-firing": ["Smoke firing", "Saggar firing"],
    "oxide-wash": ["Cobalt blue", "Underglaze", "Iron oxide"],
    "local-materials": ["Clay", "Earthenware"],
    "beauty-of-use": ["Mingei", "Mashiko ware"],
    "fire-collaboration": ["Kiln", "Noborigama"],
    "constraint-creativity": ["Pottery", "Potter's wheel"],
    "daily-object": ["Tableware", "Teacup", "Chawan"],
    "time-in-clay": ["Terracotta Army", "Terracotta", "Archaeological pottery"],
    "anonymous-craft": ["Mingei", "Folk art"],
    "tradition-innovation": ["Contemporary ceramics", "Studio pottery"],
    "material-honesty": ["Studio pottery", "Stoneware"],
    "slow-making": ["Potter's wheel", "Pottery"],
    "functional-sculpture": ["Contemporary ceramics", "Ceramic art"],
    "korean-invasion": ["Karatsu ware", "Imjin War"],
    "jomon-discovery": ["Jōmon pottery", "Jōmon period"],
    "leach-hamada-meeting": ["Leach Pottery", "Bernard Leach"],
    "voulkos-otis": ["Otis College of Art and Design", "Peter Voulkos"],
    "meissen-secret": ["Böttger stoneware", "Johann Friedrich Böttger", "Meissen porcelain"],
    "maria-black-on-black": ["San Ildefonso Pueblo pottery", "San Ildefonso Pueblo", "Black-on-black ware"],
    "chojiro-first-raku": ["Chōjirō", "Raku ware"],
    "rie-coper-studio": ["Hans Coper", "Lucie Rie"],
    "song-five-kilns": ["Five Great Kilns", "Ru ware"],
    "picasso-vallauris": ["Pablo Picasso's ceramics", "Picasso ceramics", "Madoura Pottery"],
    "mingei-movement": ["Japan Folk Crafts Museum", "Mingei"],
    "dona-rosa-discovery": ["Barro negro pottery", "Rosa Real de Nieto"],
    "chinese-export-collapse": ["Chinese export porcelain", "Kraak porcelain"],
    "potters-book": ["A Potter's Book", "Bernard Leach"],
    "ohr-rediscovery": ["George E. Ohr", "Biloxi, Mississippi"],
}
# entries whose first-pass image was kept; do not re-resolve others
if __name__ == "__main__":
    res = json.load(open(R.CACHE))
    for k, cands in OVR.items():
        rec = res.get(k, {"name": k})
        rec['info'] = None
        rec['from'] = None
        for c in cands:
            wl = R.wp_lead(c)
            if wl:
                info = R.commons_info(wl['file'])
                if info:
                    rec['from'] = 'wiki:' + wl['article']
                    rec['wiki'] = wl
                    rec['info'] = info
                    break
        res[k] = rec
        json.dump(res, open(R.CACHE, 'w'))
        print(k, rec['from'], (rec['info'] or {}).get('file'), (rec['info'] or {}).get('license'), flush=True)
    print("done2")
