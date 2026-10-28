// Authoring source for the canonical glaze-materials glossary.
// Run `npm run glazes:glossary` to regenerate data/materials/glossary.json.
//
// Each entry: m(id, name, kind, synonyms, analysis, extra)
//  - synonyms: "|"-separated; English trade names, Italian, French, Spanish/
//    Portuguese, German and a few Russian/Japanese names seen in Glazy.
//  - analysis: typical oxide weight % ("SiO2 46 Al2O3 37 LOI 14"). Only where
//    the material is well characterised; brand frits we are unsure of are left
//    blank rather than guessed.
//  - extra.group: materials in the same group are treated as close substitutes
//    when checking "what I can make now" (e.g. any potash feldspar).
//  - extra.variable: local/natural materials whose chemistry varies a lot.
//    These always carry the warning "variable: test tile first".
//  - extra.optional: suspenders/deflocculants/water - never block a recipe.
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const out = [];
function m(id, name, kind, synonyms = "", analysis = "", extra = {}) {
  const a = {};
  if (analysis) {
    const parts = analysis.trim().split(/\s+/);
    for (let i = 0; i < parts.length; i += 2) a[parts[i]] = Number(parts[i + 1]);
  }
  out.push({
    id,
    name,
    kind,
    synonyms: synonyms ? synonyms.split("|").map((s) => s.trim()).filter(Boolean) : [],
    ...(analysis ? { analysis: a } : {}),
    ...extra,
  });
}
const V = (group, note) => ({ group, variable: true, note: note || "Variable: test tile first." });

// ---------------------------------------------------------------- silica
m("silica", "Silica", "silica", "silica 325|silica 200|silica 400|silica #500|silica #400|silica - g&w|quartz|flint|silice|silice 400|silice c400|quarzo|farina di quarzo|quarzite macinata|cuarzo|cuarzo ceramico 200|quartzo|quartzo minasolo|quarzmehl|quarzmehl w 10|silice w10|кварц|кварцевая мука|кварцевая мука silverbond 15|珪石|福島珪石|fukushima silica|quartz / silice 325m|silica sand ground|silverbond", "SiO2 99.6 Al2O3 0.2 Fe2O3 0.05", { group: "silica" });
m("sand", "Sand (local)", "local", "sabbia|sable|arena|river sand|sand", "SiO2 85 Al2O3 6 Fe2O3 2 CaO 2 K2O 1.5 Na2O 1 LOI 2", V("silica"));
m("rice-husk-ash", "Rice husk ash", "local", "rice hull ash|cenere di lolla di riso|cendre de balle de riz", "SiO2 90 K2O 2.5 CaO 1 MgO 0.8 P2O5 0.6 LOI 4", V());

// ---------------------------------------------------------------- kaolins & clays
m("kaolin", "Kaolin", "clay", "china clay|caolino|kaolin pulverise|kaolin pulvérisé|caolin|caolín|caulim|caulim minasolo|kaolin #400|kaolin g|kaolin g1|kaolin e|kaolin a|kaolin b|kaolin (wbh,minerco)|caolin pz|caolin nacional jm325|caolín patagónico|caolin patagonico|kaolin/caolín sur del río - blanco lavado|devon china clay|china clay, bathpotters|georgia kaolin|super standard porcelain kaolin|ssp kaolin|kaolin polwhite kl|kaolin imerys polwhite|kaolin 233|kaolin 232|zettlitzer kaolin|argilla primaria|argile kaolinique|каолин|каолин кфн-2|カオリン|高嶺土|p42 kaolin san rocco|p54 pratoleva kaolin|kaolin eckalite 1|eckalite 1|eckalite 2|bennington kaolin|avery kaolin|helmer kaolin|tile #6 kaolin|tile 6 kaolin|korean kaolin|朝鮮カオリン", "SiO2 46.5 Al2O3 38.5 Fe2O3 0.6 TiO2 0.5 K2O 0.4 Na2O 0.1 CaO 0.2 MgO 0.1 LOI 13.5", { group: "kaolin" });
m("epk", "EP Kaolin (EPK)", "clay", "epk|ep kaolin|edgar plastic kaolin|kaolin (epk)", "SiO2 45.7 Al2O3 37.4 Fe2O3 0.8 TiO2 0.4 CaO 0.3 MgO 0.1 K2O 0.4 Na2O 0.1 P2O5 0.3 LOI 13.9", { group: "kaolin" });
m("grolleg", "Grolleg kaolin", "clay", "grolleg|china-clay grolleg 1319|grolleg 1319|english china clay", "SiO2 47.8 Al2O3 37.1 Fe2O3 0.7 K2O 1.9 Na2O 0.1 CaO 0.1 MgO 0.3 LOI 12", { group: "kaolin" });
m("calcined-kaolin", "Calcined kaolin", "clay", "caolino calcinato|kaolin calcine|kaolin calciné|kalziniertes kaolin|glomax ll calcined kaolin|glomax|calcined grolleg kaolin|calcined kaolin g1|каолин кальцинированный|каолин кальцинированный микао|metakaolin", "SiO2 53.5 Al2O3 44.5 Fe2O3 0.8 TiO2 0.5 K2O 0.4", { group: "calcined-kaolin" });
m("halloysite", "New Zealand halloysite", "clay", "new zealand halloysite|nz halloysite|halloysite|premium kaolin nz", "SiO2 49.5 Al2O3 35.5 Fe2O3 0.3 TiO2 0.1 LOI 14.5", { group: "kaolin" });
m("calcined-halloysite", "Calcined halloysite", "clay", "calcined new zealand halloysite", "SiO2 58 Al2O3 41.5 Fe2O3 0.3", { group: "calcined-kaolin" });
m("molochite", "Molochite", "clay", "molochite|calcined china clay grog", "SiO2 54.5 Al2O3 42.5 K2O 1.6 Fe2O3 0.7");
m("ball-clay", "Ball clay", "clay", "argilla plastica|argille plastiche|argile plastique|argile à grès|ball clay hsm|arcilla plastica|arcilla potter|bentonite-free ball clay|ball clay hva/pm|ball clay (hva/pm, minerco)|hvar ball clay|ball-clay", "SiO2 54 Al2O3 30 TiO2 1.4 Fe2O3 1.1 K2O 1 Na2O 0.3 CaO 0.3 MgO 0.4 LOI 11.5", { group: "ball-clay" });
m("om4-ball-clay", "Kentucky OM #4 ball clay", "clay", "om4|om #4|om-4 ball clay|kentucky om #4 ball clay|kentucky ball clay|old mine #4", "SiO2 52 Al2O3 31.3 TiO2 1.6 Fe2O3 1 K2O 0.9 Na2O 0.2 CaO 0.3 MgO 0.3 LOI 12.4", { group: "ball-clay" });
m("tennessee-ball-clay", "Tennessee ball clay", "clay", "tennessee ball clay|tennessee #10 ball clay|tennessee #5 ball|tennessee #9|c & c ball clay|c&c ball clay|xx sagger ball clay|xx sagger|bell dark ball clay|ball clay dark bell|hymod at ball clay", "SiO2 54 Al2O3 29 TiO2 1.5 Fe2O3 1.3 K2O 1.2 Na2O 0.3 MgO 0.4 CaO 0.3 LOI 11.5", { group: "ball-clay" });
m("hyplas-71", "Hyplas 71 ball clay", "clay", "hyplas 71|hyplas 71 ball clay|hyplas 71 ball clay p3354", "SiO2 66 Al2O3 21 TiO2 1.2 Fe2O3 1 K2O 2.6 Na2O 0.4 MgO 0.4 LOI 7", { group: "ball-clay" });
m("calcined-ball-clay", "Calcined ball clay", "clay", "calcined b13 ball clay|calcined ball clay", "SiO2 60 Al2O3 34 TiO2 1.6 Fe2O3 1.3 K2O 1.2", { group: "calcined-kaolin" });
m("bentonite", "Bentonite", "clay", "bentonite|bentonita|bentonita prf comacsa|bentonite - eccabond|бентонит|national standard bentonite|western bentonite", "SiO2 61 Al2O3 21 Fe2O3 3.5 MgO 2.5 Na2O 2.4 CaO 0.8 K2O 0.4 TiO2 0.2 LOI 7.5", { group: "bentonite" });
m("macaloid", "Macaloid (hectorite)", "additive", "macaloid|hectorite|bentone", "SiO2 55 MgO 25 Li2O 1.1 Na2O 3 F 5 LOI 10", { group: "bentonite" });
m("veegum", "Veegum T", "additive", "veegum|veegum t|veegum cer", "SiO2 60 MgO 22 Al2O3 5 Na2O 2.5 CaO 2 LOI 8", { group: "bentonite" });
m("redart", "Redart", "clay", "redart|cedar heights redart", "SiO2 64.3 Al2O3 16.4 Fe2O3 7 TiO2 1.1 CaO 0.3 MgO 1.6 K2O 4.2 Na2O 0.4 LOI 4.9", { group: "red-clay" });
m("red-clay", "Red earthenware clay", "clay", "red clay|terracotta|argilla rossa|argilla da terracotta|argile rouge|arcilla roja|arcilla roja comacsa|newman red clay|galisteo red clay|refined overberg earthenware|earthenware clay|argila sao simao|argila são simão|yellow river clay|yellow brick clay|cuda-clay, yellow brick clay", "SiO2 60 Al2O3 18 Fe2O3 6.5 TiO2 1 CaO 1 MgO 1.5 K2O 3 Na2O 0.6 LOI 8", { group: "red-clay" });
m("goldart", "Goldart", "clay", "goldart|gold art stoneware clay", "SiO2 57 Al2O3 28 Fe2O3 1.2 TiO2 1.9 CaO 0.2 MgO 0.4 K2O 1.2 Na2O 0.1 LOI 9.5", { group: "stoneware-clay" });
m("fireclay", "Fireclay", "clay", "fireclay|fire clay|argilla refrattaria|argile réfractaire|argile refractaire|lincoln 60 fireclay|lincoln fireclay|hawthorne bond|a.p. green|ap green fireclay", "SiO2 55 Al2O3 30 Fe2O3 1.6 TiO2 1.7 CaO 0.3 MgO 0.5 K2O 1 Na2O 0.2 LOI 9.7", { group: "stoneware-clay" });
m("stoneware-clay", "Stoneware clay (body)", "clay", "stoneware clay|clay|argilla da gres|argile à grès|grès|519 psh white stoneware cone 6|roseville clay|sheffield clay|oldenwalder clay|argila branca pantano grande|caulim branco-pb-br", "SiO2 62 Al2O3 24 Fe2O3 1.5 TiO2 1 K2O 2 Na2O 0.5 CaO 0.4 MgO 0.5 LOI 8", { group: "stoneware-clay", note: "Clay bodies vary - use the supplier's analysis if you have it." });
m("porcelain-body", "Porcelain body (slip)", "clay", "english porcelain|porcelain|porcellana|porcelaine|porcelain slip", "SiO2 63 Al2O3 24 K2O 3 Na2O 0.8 CaO 0.4 MgO 0.2 Fe2O3 0.4 LOI 7.5");
m("albany-slip", "Albany slip", "slip-clay", "albany slip|albany slip clay|albany slip substitute", "SiO2 57.6 Al2O3 14.6 Fe2O3 5.2 CaO 5.8 MgO 2.7 K2O 3.2 Na2O 0.8 TiO2 0.8 LOI 9.4", { group: "slip-clay-dark" });
m("alberta-slip", "Alberta slip", "slip-clay", "alberta slip|alberta slip raw", "SiO2 60.5 Al2O3 13.4 Fe2O3 4.3 CaO 4.4 MgO 3.3 K2O 2.9 Na2O 0.8 TiO2 0.5 MnO 0.1 LOI 9.8", { group: "slip-clay-dark" });
m("alberta-slip-roasted", "Alberta slip (roasted)", "slip-clay", "alberta slip 1000f roasted|alberta slip roasted|roasted alberta slip|calcined alberta slip", "SiO2 67 Al2O3 14.9 Fe2O3 4.8 CaO 4.9 MgO 3.7 K2O 3.2 Na2O 0.9 TiO2 0.6", { group: "slip-clay-dark" });
m("barnard-slip", "Barnard slip", "slip-clay", "barnard slip|barnard clay|blackbird clay|barnard slip substitute", "SiO2 45.5 Al2O3 8 Fe2O3 28 MnO 5.6 CaO 0.5 MgO 0.6 K2O 1 Na2O 0.3 TiO2 0.4 LOI 9", { group: "slip-clay-iron" });
m("ravenscrag-slip", "Ravenscrag slip", "slip-clay", "ravenscrag slip|ravenscrag|ravenscrag slip raw", "SiO2 61 Al2O3 13.2 CaO 6.3 MgO 1.4 K2O 4.5 Na2O 1.6 Fe2O3 0.6 TiO2 0.3 LOI 10.5", { group: "ravenscrag" });
m("ravenscrag-roasted", "Ravenscrag slip (roasted)", "slip-clay", "ravenscrag slip 1000f roast|ravenscrag slip roast|ravenscrag roasted", "SiO2 68 Al2O3 14.7 CaO 7 MgO 1.6 K2O 5 Na2O 1.8 Fe2O3 0.7 TiO2 0.3", { group: "ravenscrag" });
m("pyrophyllite", "Pyrophyllite", "clay", "pyrophyllite|pirofillite|pyrax|pyrax b", "SiO2 66.7 Al2O3 28.3 LOI 5");
m("wild-clay", "Wild clay (local dig)", "local", "wild clay|local clay|argilla locale|argilla selvatica|terra locale|argile locale|argile sauvage|creek clay|river clay|dug clay|clay from the garden", "SiO2 58 Al2O3 17 Fe2O3 6 TiO2 0.9 CaO 3 MgO 1.8 K2O 2.6 Na2O 0.8 LOI 9.5", V("wild-clay", "Variable: test tile first. Typical iron-bearing surface clay; fire a sample and, ideally, get it analysed."));

// ---------------------------------------------------------------- feldspars & feldspathic rocks
m("potash-feldspar", "Potash feldspar", "feldspar", "feldspar|potash feldspar|k feldspar|k-feldspar|orthoclase|microcline|feldspato potassico|feldspato potássico|feldspato potassico mck 325 minasolo|feldspato k minasolo|feldspath potassique|feldspath potassique icе10|feldspath potassique ice10|feldspath potassique fp325|feldspath potassique norflux|feldspath potassique norflot|feldspath custer (orthose)|orthose|feldespato potasico|feldespato potásico|feldespato sip|feldespato yurac comacsa|feldespato potassico #200 remina|kalifeldspat|kali-feldspat k 2/75|feldspat kali k2/75 jäger|feldspar k 2/75|potash feldspar k 2/75|kali veldspaat|kalifeldspat (silica)|полевой шпат|полевой шпат пшс - гжель|カリ長石|potash feldspar crecer|potash feldspar (bath potter's)|bps potash feldspar|nr potassium feldspar|quantum ap200f potassium feldspar|potash feldspar cps|potash feldspar (zheng yi sk7)|potash feldspar dp hasta diciembre 2018|p10 sanidine|sanidine|kona a-3 feldspar|kona a3", "SiO2 66 Al2O3 18.5 K2O 11 Na2O 3 CaO 0.4 Fe2O3 0.1 LOI 0.4", { group: "potash-feldspar" });
m("custer-feldspar", "Custer feldspar", "feldspar", "custer|custer feldspar|custer feldspar (1989)|custer - new|custer feldspar (2000-2012 ron roy)", "SiO2 68.5 Al2O3 17 K2O 10 Na2O 3 CaO 0.3 Fe2O3 0.1 LOI 0.3", { group: "potash-feldspar" });
m("g200-feldspar", "G-200 feldspar", "feldspar", "g-200 feldspar|g200 feldspar|g-200|g200 hp feldspar, g200hp|g-200 hp|g200hp", "SiO2 66.8 Al2O3 18.4 K2O 10.1 Na2O 3.2 CaO 0.9 Fe2O3 0.1 LOI 0.3", { group: "potash-feldspar" });
m("k200-feldspar", "K-200 feldspar", "feldspar", "k-200 feldspar|k200", "SiO2 66 Al2O3 18.5 K2O 11.8 Na2O 2.6 CaO 0.4 LOI 0.4", { group: "potash-feldspar" });
m("mahavir-feldspar", "Mahavir potash feldspar", "feldspar", "mahavir potash feldspar|mahavir feldspar|mahavir", "SiO2 66.5 Al2O3 18 K2O 12.5 Na2O 2.3 CaO 0.3 LOI 0.3", { group: "potash-feldspar" });
m("forshammar-feldspar", "Forshammar feldspar", "feldspar", "forshammar feldspar|forshammer feldspar|forshammar", "SiO2 68 Al2O3 17.6 K2O 9.6 Na2O 4 CaO 0.4 LOI 0.3", { group: "potash-feldspar" });
m("kingman-feldspar", "Kingman feldspar", "feldspar", "kingman feldspar|kingman", "SiO2 66 Al2O3 18.7 K2O 12.5 Na2O 2.3 CaO 0.3 LOI 0.2", { group: "potash-feldspar" });
m("buckingham-feldspar", "Buckingham feldspar", "feldspar", "buckingham feldspar|buckingham", "SiO2 65.5 Al2O3 19.2 K2O 12.5 Na2O 2.6 CaO 0.2 LOI 0.2", { group: "potash-feldspar" });
m("fff-feldspar", "FFF feldspar", "feldspar", "fff feldspar|fff|полевой шпат fff", "SiO2 66.4 Al2O3 19.1 K2O 10.4 Na2O 3.8 CaO 0.4 LOI 0.2", { group: "potash-feldspar" });
m("oxford-feldspar", "Oxford feldspar", "feldspar", "oxford feldspar", "SiO2 66.7 Al2O3 18.8 K2O 10.7 Na2O 3.4 CaO 0.3 LOI 0.2", { group: "potash-feldspar" });
m("soda-feldspar", "Soda feldspar", "feldspar", "soda feldspar|na feldspar|na-feltspat|na-feltspat (silica)|albite|albita|albita minasolo|feldspato sodico|feldspath sodique|feldspath sodique (hins)|feldespato sodico|feldespato sódico|natronfeldspat|natronfeldspat carl jäger lf 90|natron veldspaat|natron felspat maxum la 75|bps soda feldspar|soda feldspar (bath potters)|soda feldspar crecer arg|feldspath mixte ea4|feldspath mixte|ソーダ長石", "SiO2 68.5 Al2O3 19.4 Na2O 10 K2O 1 CaO 0.6 Fe2O3 0.1 LOI 0.3", { group: "soda-feldspar" });
m("kona-f4", "Kona F-4 feldspar", "feldspar", "kona f-4 feldspar|kona f4|f-4 feldspar|kona f-4", "SiO2 66.8 Al2O3 19.6 Na2O 6.9 K2O 4.8 CaO 1.6 Fe2O3 0.1 LOI 0.3", { group: "soda-feldspar" });
m("minspar-200", "Minspar 200", "feldspar", "minspar 200|minspar|nc-4 feldspar|nc-4|nc4", "SiO2 67.2 Al2O3 19.4 Na2O 7 K2O 4 CaO 1.8 Fe2O3 0.1 LOI 0.3", { group: "soda-feldspar" });
m("c6-feldspar", "C-6 feldspar", "feldspar", "c-6 feldspar|c6 feldspar", "SiO2 66.4 Al2O3 19.4 Na2O 6.6 K2O 5.6 CaO 1.4 LOI 0.4", { group: "soda-feldspar" });
m("nepheline-syenite", "Nepheline syenite", "feldspar", "nepheline syenite|neph sye|neph syenite|nepheline syenite a270|neph sye a270|nepheline syenite norwegian|nepheline syenite, north cape|north cape nepheline|nepheline syenite spectrum a270|nephelin syenit (sibelco spectrum)|nephelin syenite (sepctrum n, minerco)|nephelin-syenit 334|nepheline syenite, bath potters|néphéline syénite|nepheline syenite (ceradel 2022)|nefelina|nefelina sienite|nefelina ab|néphéline|нефелин|нефелин сиенит|нефелин сиенит (altaflux-45)|тонкомолотый нефелин-сиенит altaflux-45|spectrum a270|a270", "SiO2 60.2 Al2O3 23.6 Na2O 10.6 K2O 4.8 CaO 0.4 MgO 0.1 Fe2O3 0.1 LOI 0.7", { group: "nepheline" });
m("cornwall-stone", "Cornwall stone", "feldspar", "cornwall stone|cornish stone|synthetic cornish stone|pietra di cornovaglia|pierre de cornouailles|kentucky stone|cornwall stone substitute|china stone", "SiO2 72 Al2O3 15.5 K2O 4.5 Na2O 2.5 CaO 1.8 F 0.6 Fe2O3 0.2 LOI 2.5", { group: "cornwall-stone" });
m("porcelain-stone", "Porcelain stone (glaze stone)", "feldspar", "glaze stone|glaze stone 釉果|glaze stone 釉果 2015|sanbao porcelain stone 三宝瓷石|sanbao porcelain stone|三宝瓷石|釉果|porcelain stone|petuntse|baidunzi", "SiO2 74 Al2O3 15 K2O 3 Na2O 2.5 CaO 1 Fe2O3 0.6 LOI 3", { group: "cornwall-stone" });
m("pegmatite", "Pegmatite", "feldspar", "pegmatite|pegmatita|pegmatita prodesco|feldspath mixte u200 - pegmatite|u200", "SiO2 74 Al2O3 15 K2O 5 Na2O 4 CaO 0.6 Fe2O3 0.2 LOI 0.5", { group: "cornwall-stone" });
m("plastic-vitrox", "Plastic Vitrox", "feldspar", "plastic vitrox|vitrox", "SiO2 76 Al2O3 14 K2O 5.2 Na2O 0.5 CaO 0.5 Fe2O3 0.2 LOI 3");
m("spodumene", "Spodumene", "feldspar", "spodumene|spodumène|spodumene - australian|spodumene - canadian|espodumena|espodumênio|espodumênio minasolo|espodumênio ab|feldspath lithique spodumène|feldspath lithique|сподумен", "SiO2 64 Al2O3 26 Li2O 7 Na2O 0.5 K2O 0.4 Fe2O3 0.4 LOI 0.5", { group: "spodumene" });
m("petalite", "Petalite", "feldspar", "petalite|pétalite|petalita", "SiO2 77.7 Al2O3 16.6 Li2O 4.5 Na2O 0.3 K2O 0.3 LOI 0.6");
m("lepidolite", "Lepidolite", "feldspar", "lepidolite|lepidolita", "SiO2 55 Al2O3 25 K2O 9 Li2O 4 Na2O 0.6 F 6 LOI 1.5");
m("granite", "Granite dust", "local", "granite|granito|granit|granite dust|wisconsin red granite|devil's playground granite|polvere di granito", "SiO2 72 Al2O3 14 K2O 4.5 Na2O 3.5 CaO 1.5 Fe2O3 2.2 MgO 0.5 TiO2 0.3 LOI 0.8", V("granite"));
m("basalt", "Basalt", "local", "basalt|basalto|basalte|basalto tobías oberá - misiones arg.|basalto tobias obera", "SiO2 49 Al2O3 15 Fe2O3 11.5 CaO 10 MgO 7 Na2O 2.5 K2O 0.8 TiO2 1.6 MnO 0.2 LOI 1", V("basalt"));
m("volcanic-ash", "Volcanic ash", "local", "volcanic ash|volcanic ash - mt. st. helens|cenere vulcanica|cendre volcanique|ceniza volcanica|tufo|tuff|pozzolana", "SiO2 68 Al2O3 14 K2O 4 Na2O 4 CaO 2 Fe2O3 2.5 MgO 0.7 TiO2 0.4 LOI 4", V("volcanic-ash"));
m("pumice", "Pumice", "local", "pumice|hess pumice|pomice|pierre ponce|piedra pomez", "SiO2 70.5 Al2O3 13.3 K2O 4.3 Na2O 4.1 CaO 0.8 Fe2O3 1.4 MgO 0.2 LOI 4.5", V("volcanic-ash"));
m("diaspro-verde", "Green jasper (P19 diaspro verde)", "local", "p19 diaspro verde|diaspro verde|diaspro", "SiO2 80 Fe2O3 8 Al2O3 6 CaO 1.5 MgO 1 LOI 3", V());

// ---------------------------------------------------------------- calcium & magnesium fluxes
m("whiting", "Whiting (calcium carbonate)", "flux", "whiting|calcium carbonate|carbonato di calcio|carbonate de calcium|carbonate de calcium (solargil 2018)|carbonate de calcium (peter lavem)|carbonate de chaux|carbonate de chaux (ceradel 2022)|blanc de meudon|blanc d'espagne|craie|chalk|calcite|calcita|calcita minasolo|carbonato de calcio|carbonato de cálcio|carbonato de cálcio extra leve|cálcio extra leve|calcio extra leve|creta|creta prodesco|tiza|tiza cisne comacsa|kreide|kreide 190|мел|карбонат кальция|炭酸カルシウム|石灰石粉|whitewater limestone", "CaO 55.9 MgO 0.3 SiO2 0.3 LOI 43.5", { group: "whiting" });
m("limestone", "Limestone (local)", "local", "limestone|calcare|pietra calcarea|calcaire|piedra caliza|marble dust|polvere di marmo|poudre de marbre", "CaO 52 MgO 1.5 SiO2 3 Al2O3 0.8 Fe2O3 0.5 LOI 42.2", V("whiting"));
m("lime-slaked", "Slaked lime (calcium hydroxide)", "local", "lime|slaked lime|hydrated lime|calcium hydroxide|calce|calce spenta|grassello di calce|chaux|chaux éteinte|chaux eteinte|cal apagada|cal hidratada|kalkhydrat", "CaO 74 MgO 0.8 SiO2 0.5 LOI 24.7", V("lime", "Variable: test tile first. Builder's lime can be dolomitic; old lime absorbs CO2 and becomes whiting-like. 100 g slaked lime gives about as much CaO as 135 g whiting."));
m("lime-quick", "Quicklime (calcium oxide)", "local", "quicklime|quick lime|calcium oxide|calce viva|chaux vive|cal viva|branntkalk", "CaO 95 MgO 1 SiO2 1 LOI 3", V("lime", "Variable: test tile first. Caustic - slake it before use; it reacts with water and air."));
m("eggshell", "Eggshell (ground)", "local", "eggshell|egg shell|guscio d'uovo|gusci d'uovo|coquille d'oeuf|coquilles d'œufs|cascara de huevo", "CaO 53 MgO 0.5 P2O5 0.4 LOI 46", V("whiting"));
m("oyster-shell", "Oyster shell (ground)", "local", "oyster shell|seashell|conchiglie|coquille d'huître|shell lime", "CaO 52 MgO 0.4 SiO2 0.8 Na2O 0.3 LOI 46", V("whiting"));
m("dolomite", "Dolomite", "flux", "dolomite|dolomia|dolomie|dolomie (solargil 2018)|dolomite (ceradel)|dolomita|dolomita blanca 325|dolomita -colombo-pr-br|camadil dolomite|доломит|ドロマイト", "CaO 30.4 MgO 21.9 SiO2 0.2 Fe2O3 0.1 LOI 47.4", { group: "dolomite" });
m("talc", "Talc", "flux", "talc|talco|talco blanco micronizado|talco minasolo|talkum|talkum 22/hk|talc 2c|talc (peter lavem)|amtalc-c98 talc|amtalc c98|talc - amtalc c98/pioneer|talc - cps|silverline 303 talc, montana talc|montana talc|тальк|タルク|満州タルク|manchurian talc|steatite|steatite powder", "SiO2 62 MgO 31 CaO 0.5 Al2O3 0.5 Fe2O3 0.2 LOI 5.8", { group: "talc" });
m("calcined-talc", "Calcined talc", "flux", "calcined talc|calcined talc, magnesium silicate|calcined talc - microfil 20|talco calcinato|talc calciné", "SiO2 65.8 MgO 32.9 CaO 0.5 Al2O3 0.5", { group: "talc" });
m("wollastonite", "Wollastonite", "flux", "wollastonite|wollastonita|wollastonita prodesco|wollastonit|wollastonit mm 81|vansil w-30 wollastonite|vansil w-20 wollastonite|wollastonite - vansil|nyad wollastonite|волластонит|волластонит (миволл)", "CaO 47 SiO2 51 Fe2O3 0.3 MgO 0.4 Al2O3 0.3 LOI 1", { group: "wollastonite" });
m("magnesium-carbonate", "Magnesium carbonate", "flux", "magnesium carbonate|carbonato di magnesio|carbonate de magnésium|carbonato de magnesio|magnesite|light magnesium carbonate|магнезит", "MgO 42 CaO 0.5 LOI 57.5", { group: "magnesium-carbonate" });
m("magnesium-oxide", "Magnesium oxide (magnesia)", "flux", "magnesium oxide|magnesia|ossido di magnesio|oxyde de magnésium|calcined magnesia", "MgO 98 CaO 1 LOI 1", { group: "magnesium-carbonate" });
m("bone-ash", "Bone ash", "flux", "bone ash|natural bone ash|cenere d'ossa|cenere di ossa|cendre d'os|cendre d'os (solargil 2018)|ceniza de hueso|ceniza de huesos|knochenasche", "CaO 55.8 P2O5 42 MgO 1 LOI 1.2", { group: "bone-ash" });
m("synthetic-bone-ash", "Synthetic bone ash (tricalcium phosphate)", "flux", "tricalcium phosphate, synthetic bone ash|synthetic bone ash|tricalcium phosphate|tcp|fosfato tricalcico|fosfato de calcio|phosphate tricalcique|calcium phosphate", "CaO 54.2 P2O5 45.8", { group: "bone-ash" });
m("fluorspar", "Fluorspar", "flux", "fluorspar|fluorite|spatofluore|fluorine spar|spath fluor|calcium fluoride", "CaO 71.8 F 48.7");

// ---------------------------------------------------------------- alkaline earth / alkali carbonates
m("barium-carbonate", "Barium carbonate", "flux", "barium carbonate|carbonato di bario|carbonate de baryum|carbonato de bario|bariumkarbonat|炭酸バリウム", "BaO 77.7 LOI 22.3", { group: "barium-carbonate", note: "Toxic raw material - use a mask and gloves; test barium glazes for leaching on food surfaces." });
m("barium-sulfate", "Barium sulfate", "flux", "barium sulfate|barium sulphate|barite|baryte|solfato di bario|sulfate de baryum", "BaO 65.7 LOI 34.3");
m("strontium-carbonate", "Strontium carbonate", "flux", "strontium carbonate|carbonato di stronzio|carbonate de strontium|carbonato de estroncio|炭酸ストロンチウム", "SrO 70.2 LOI 29.8", { group: "strontium-carbonate" });
m("lithium-carbonate", "Lithium carbonate", "flux", "lithium carbonate|carbonato di litio|carbonate de lithium|carbonato de litio|炭酸リチウム", "Li2O 40.4 LOI 59.6", { group: "lithium-carbonate" });
m("zinc-oxide", "Zinc oxide", "flux", "zinc oxide|zinc|ossido di zinco|oxyde de zinc|óxido de zinc|oxido de zinc|óxido de zinco|oxido de zinco mpi-325|zinkoxid|оксид цинка|calcined zinc oxide|酸化亜鉛", "ZnO 100", { group: "zinc-oxide" });
m("soda-ash", "Soda ash (sodium carbonate)", "flux", "soda ash|sodium carbonate|carbonato di sodio|carbonate de sodium|carbonato de sodio|soude|washing soda|soda", "Na2O 58.5 LOI 41.5", { group: "soda-ash" });
m("sodium-bicarbonate", "Sodium bicarbonate", "flux", "sodium bicarbonate|baking soda|bicarbonato di sodio|bicarbonate de soude|bicarbonato de sodio", "Na2O 36.9 LOI 63.1", { group: "soda-ash" });
m("pearl-ash", "Pearl ash (potassium carbonate)", "flux", "pearl ash|potassium carbonate|carbonato di potassio|carbonate de potassium|potash", "K2O 68.2 LOI 31.8");
m("salt", "Salt (sodium chloride)", "flux", "salt|sodium chloride|sale|sel|sal|sea salt|sale marino", "Na2O 53 LOI 47");
m("sodium-silicate", "Sodium silicate", "additive", "sodium silicate|water glass|silicato di sodio|silicate de sodium|silicato de sodio", "SiO2 29 Na2O 9 LOI 62", { optional: true });
m("cryolite", "Cryolite", "flux", "cryolite|criolite|cryolithe|criolita", "Na2O 44.3 Al2O3 24.3 F 54.3");
m("lead-carbonate", "Lead carbonate", "flux", "lead carbonate|white lead|carbonato di piombo|carbonate de plomb|biacca", "PbO 86.3 LOI 13.7", { note: "Highly toxic. Not recommended - choose a lead-free alternative." });
m("red-lead", "Red lead", "flux", "red lead|minium|minio|lead tetroxide", "PbO 97.7 LOI 2.3", { note: "Highly toxic. Not recommended - choose a lead-free alternative." });
m("portland-cement", "Portland cement", "local", "portland cement|cement|cemento|ciment", "CaO 63 SiO2 21 Al2O3 5 Fe2O3 3 MgO 2 K2O 0.8 Na2O 0.3 LOI 4.9", V());

// ---------------------------------------------------------------- borates
m("gerstley-borate", "Gerstley borate", "flux", "gerstley borate|gerstley|gerstly borate|gb", "CaO 19.4 Na2O 3.9 B2O3 26.8 MgO 3.4 SiO2 14.8 Al2O3 1 K2O 0.3 Fe2O3 0.4 SrO 0.6 LOI 29.4", { group: "gerstley" });
m("laguna-borate", "Laguna borate", "flux", "laguna borate|laguna gerstley substitute", "CaO 21 Na2O 4.5 B2O3 27 MgO 3.2 SiO2 13 Al2O3 1 LOI 30", { group: "gerstley" });
m("gillespie-borate", "Gillespie borate", "flux", "gillespie borate|gillespie", "CaO 20 Na2O 3.9 B2O3 26.2 MgO 4.8 SiO2 13 Al2O3 0.6 LOI 31.5", { group: "gerstley" });
m("colemanite", "Colemanite", "flux", "colemanite|colemanita|colemanita ab|kalkborat|boro-calcite", "CaO 27.2 B2O3 50.8 SiO2 2 LOI 20", { group: "colemanite" });
m("calcined-colemanite", "Calcined colemanite", "flux", "colemanita calcinada|calcined colemanite", "CaO 34 B2O3 63.5 SiO2 2.5", { group: "colemanite" });
m("cadycal", "Cadycal (calcium borate)", "flux", "cadycal|cadycal 100|calcium borate", "CaO 31 B2O3 47 SiO2 4 MgO 2 LOI 16", { group: "colemanite" });
m("ulexite", "Ulexite", "flux", "ulexite|ulexit|ulexita|улексит|улексит (химпэк)|ulexite turkish kutahya cinikop seramik company", "Na2O 7.7 CaO 13.8 B2O3 43 LOI 35.5", { group: "ulexite" });
m("borax", "Borax", "flux", "borax|borace|borate de sodium|borato de sodio|sodium borate|borax decahydrate", "Na2O 16.3 B2O3 36.5 LOI 47.2", { group: "borax" });
m("boric-acid", "Boric acid", "flux", "boric acid|acido borico|acide borique|ácido bórico", "B2O3 56.3 LOI 43.7");

// ---------------------------------------------------------------- alumina
m("alumina-hydrate", "Alumina hydrate", "refractory", "alumina hydrate|aluminium hydroxide|aluminum hydroxide|idrossido di alluminio|idrato di allumina|hydrate d'alumine|hydroxyde d'aluminium|hidróxido de aluminio", "Al2O3 65.4 LOI 34.6", { group: "alumina" });
m("calcined-alumina", "Calcined alumina", "refractory", "alumina|calcined alumina|allumina|allumina calcinata|alumine|alumine calcinée|alumine calcinée (céradel 2019)|alúmina", "Al2O3 99.6 Na2O 0.3", { group: "alumina" });

// ---------------------------------------------------------------- frits
const frit = (id, name, syn, an = "", extra = {}) => m(id, name, "frit", syn, an, extra);
frit("frit-3134", "Ferro Frit 3134", "ferro frit 3134|frit 3134|3134|fritte 3134|fritte 3134 (ceradel 2022)|fusion frit f-12|f-12|pemco p-54|pemco frit p-54|ferro frit 3134-2 (174)|frit 3134-2", "CaO 20.1 Na2O 10.3 B2O3 23.1 SiO2 46.5", { group: "frit-3134" });
frit("frit-3124", "Ferro Frit 3124", "ferro frit 3124|frit 3124|3124|fusion frit f-2|f-2|pemco frit p-311|p-311", "CaO 14.1 Na2O 6.3 K2O 0.7 B2O3 13.6 Al2O3 9.9 SiO2 55.4", { group: "frit-3124" });
frit("frit-3110", "Ferro Frit 3110", "ferro frit 3110|frit 3110|3110|fusion frit f-75|fusion frit 75|f-75|pemco frit p-1505", "CaO 6.3 Na2O 15.3 K2O 2.4 B2O3 2.6 Al2O3 3.7 SiO2 69.7", { group: "frit-3110" });
frit("frit-3195", "Ferro Frit 3195", "ferro frit 3195|frit 3195|3195|fusion frit f-524|fusion frit f524|f-524|pemco frit p-25|pemco p-25", "CaO 11.6 Na2O 5.6 B2O3 23 Al2O3 12 SiO2 47.8", { group: "frit-3195" });
frit("frit-3249", "Ferro Frit 3249", "ferro frit 3249|frit 3249|3249|fusion frit f-69|f-69", "MgO 11.4 CaO 0.4 Na2O 0.3 B2O3 28.6 Al2O3 9.6 SiO2 49.7", { group: "frit-3249" });
frit("frit-3269", "Ferro Frit 3269", "ferro frit 3269|frit 3269|3269", "Na2O 16.8 K2O 2.9 CaO 0.9 B2O3 2.8 Al2O3 2.9 SiO2 73.7");
frit("frit-3289", "Ferro Frit 3289", "frit 3289|ferro frit 3289|3289", "");
frit("frit-3292", "Ferro Frit 3292", "frit 3292|ferro frit 3292|3292", "");
frit("frit-3304", "Ferro Frit 3304", "ferro frit 3304|frit 3304|3304", "");
frit("frit-3417", "Ferro Frit 3417", "frit 3417|ferro frit 3417", "");
frit("frit-3185", "Ferro Frit 3185", "frit 3185|ferro frit 3185", "");
frit("frit-3247", "Ferro Frit 3247", "frit 3247|ferro frit 3247", "");
frit("frit-3278", "Ferro Frit 3278", "frit 3278|ferro frit 3278", "");
frit("frit-3819", "Ferro Frit 3819", "frit 3819|ferro frit 3819", "");
frit("frit-5301", "Ferro Frit 5301", "ferro frit 5301|frit 5301", "");
frit("frit-4124", "Frit 4124", "frit 4124", "");
frit("frit-3221", "Frit 3221 (calcium borate)", "frit 3221 calciumboraat|frit 3221", "");
frit("pemco-p626", "Pemco Frit P-626", "pemco frit p-626|p-626", "");
frit("pemco-p830", "Frit P-830 (boron alkaline)", "frit boron alcaline p830|p830|p-830", "");
frit("fusion-f38", "Fusion Frit F-38", "fusion frit f-38|f-38", "");
frit("fusion-f15", "Fusion Frit F-15", "fusion frit f-15|f-15", "");
frit("fusion-f644", "Fusion Frit F-644", "fusion frit f644|fusion frit 644|f644", "");
frit("fusion-f367", "Fusion Frit 367", "fusion frit 367", "");
frit("frit-6004", "Frit 6004", "frit 6004", "");
frit("jm-169", "Johnson Matthey Frit 169", "johnson matthey frit 169|jm 169|frit 169", "");
frit("hommel-14", "Hommel Frit 14", "hommel frit 14", "");
frit("crecer-804", "Crecer Frit 804", "crecer frit 804|frita crecer bs 804|crecer 804", "");
frit("crecer-857", "Crecer Frit 857", "crecer frit 857", "");
frit("frita-096", "Frita 096 (Brazil)", "frita 096|frita 096 brazil|0930_frita 096", "");
frit("frit-fsb-510", "Frit FSB 510", "frit fsb 510 na2o|fsb 510", "");
frit("frit-90158", "Frit 90158", "frit 90158 (ceramiccon)|frit 90158", "");
frit("frita-cc202", "Frita CC 202", "frita cc 202", "");
frit("frita-dp002", "Frita 002 (DP Colors)", "frita 002 de dp colors", "");
frit("colorobbia-fsa5015", "Colorobbia FSA 5015", "fsa 5015 (colorobbia)|fsa 5015", "");
frit("standard-borax-frit", "Standard borax frit", "standard borax frit|standard borax frit 'e', bath potters|boraxfrit|mok1 borax frit|borax frit", "Na2O 7 CaO 8 B2O3 18 Al2O3 7 SiO2 60", { group: "borax-frit" });
frit("calcium-borate-frit", "Calcium borate frit", "calcium borate frit|фриттованный борат кальция|fr8 fritte boro-calcique|fritte boro-calcique", "CaO 18 Na2O 3 B2O3 30 SiO2 45 Al2O3 4", { group: "frit-3134" });
frit("high-alkaline-frit", "High alkaline frit", "potclays/bps high alkaline frit|high alkaline frit|alkaline frit", "Na2O 13 K2O 2 CaO 4 B2O3 5 Al2O3 4 SiO2 72", { group: "alkaline-frit" });
frit("soft-alkaline-frit", "Soft alkaline frit (P2963)", "p2963 soft alkaline frit|soft alkaline frit", "Na2O 10 K2O 1 CaO 5 B2O3 18 Al2O3 6 SiO2 60", { group: "alkaline-frit" });
frit("raku-frit", "Raku frit", "rakufritte|rakufritte m 233 864|raku frit", "");
frit("leadfree-frit", "Lead-free frit (generic)", "lead-free frit|無鉛フリット lead-free frit (tougei shop)|無鉛フリット|frit|fritte|fritta|frita|cer|cer 1|cer 12|apm 112|portabor a|portabor", "", { note: "Unspecified frit - check the maker's analysis." });
frit("lead-bisilicate", "Lead bisilicate frit", "lead bisilicate frit|lead bisilicate|bisilicato di piombo", "PbO 65 SiO2 33 Al2O3 2", { note: "Contains lead. Not for functional ware unless lab tested." });
frit("lead-monosilicate", "Lead monosilicate frit", "lead monosilicate frit|lead monosilicate", "PbO 84 SiO2 16", { note: "Contains lead. Not for functional ware unless lab tested." });

// ---------------------------------------------------------------- colourants: iron
const col = (id, name, syn, an, extra = {}) => m(id, name, "colorant", syn, an, extra);
col("red-iron-oxide", "Red iron oxide", "red iron oxide|iron oxide|iron oxide red|red iron|rio|ossido di ferro|ossido di ferro rosso|ossido ferrico|oxyde de fer|oxyde de fer rouge|fer oxyde naturel|óxido de hierro|oxido de hierro rojo|óxido de ferro|eisenoxid|eisenoxid rot|hematite|hématite|hématite 6253|ematite|оксид железа|弁柄|bengara|spanish red iron oxide", "Fe2O3 98 SiO2 1", { group: "red-iron-oxide" });
col("black-iron-oxide", "Black iron oxide", "black iron oxide|magnetite|ossido di ferro nero|oxyde de fer noir|óxido de hierro negro|iron oxide black", "Fe2O3 103", { group: "red-iron-oxide" });
col("yellow-iron-oxide", "Yellow iron oxide", "yellow iron oxide|ossido di ferro giallo|oxyde de fer jaune|iron oxide yellow|goethite", "Fe2O3 86 LOI 14", { group: "red-iron-oxide" });
col("yellow-ochre", "Yellow ochre", "yellow ochre|ochre|ocher|ocra|ocra gialla|ocre|ocre jaune|ocre amarillo", "Fe2O3 22 SiO2 50 Al2O3 15 CaO 1 LOI 12", V("ochre"));
col("red-ochre", "Red ochre", "red ochre|ocra rossa|ocre rouge|terra rossa|sienna|burnt sienna|terra di siena", "Fe2O3 45 SiO2 32 Al2O3 12 CaO 1 LOI 10", V("ochre"));
col("crocus-martis", "Crocus martis", "crocus martis|crocus marti", "Fe2O3 85 SO3 5 LOI 10");
col("ilmenite", "Ilmenite", "ilmenite|ilmenite powder|ilmenita|illmenite", "Fe2O3 47 TiO2 50 MnO 1 SiO2 1", { group: "ilmenite" });
col("granular-ilmenite", "Granular ilmenite", "granular ilmenite|ilmenite granular|illmenite granular", "Fe2O3 47 TiO2 50 MnO 1 SiO2 1", { group: "ilmenite" });
col("iron-chromate", "Iron chromate", "iron chromate|cromato di ferro|chromite", "Cr2O3 45 Fe2O3 52");
col("burnt-umber", "Burnt umber", "burnt umber|terra d'ombra bruciata|terre d'ombre brûlée|umber|raw umber|terra d'ombra", "Fe2O3 52 MnO 13 SiO2 18 Al2O3 6 CaO 2 LOI 9", V("umber"));
col("iron-spangles", "Iron spangles", "iron spangles|iron filings|scaglie di ferro", "Fe2O3 100");
col("iron-sulfate", "Iron sulfate", "iron sulfate|ferrous sulfate|solfato di ferro|sulfate de fer", "Fe2O3 28 LOI 72");

// ---------------------------------------------------------------- colourants: copper, cobalt, chrome, manganese, nickel
col("copper-carbonate", "Copper carbonate", "copper carbonate|carbonato di rame|carbonate de cuivre|carbonato de cobre|kupferkarbonat|basic copper carbonate|炭酸銅", "CuO 71.9 LOI 28.1", { group: "copper" });
col("black-copper-oxide", "Black copper oxide", "black copper oxide|copper oxide|cupric oxide|ossido di rame|ossido di rame nero|oxyde de cuivre|oxyde de cuivre noir|oxyde de cuivre (céradel 2019)|óxido de cobre|kupferoxid|酸化銅", "CuO 100", { group: "copper" });
col("red-copper-oxide", "Red copper oxide", "red copper oxide|cuprous oxide|ossido di rame rosso|oxyde de cuivre rouge", "CuO 111", { group: "copper" });
col("copper-sulfate", "Copper sulfate", "copper sulfate|copper sulphate|solfato di rame|sulfate de cuivre|blue vitriol", "CuO 31.9 LOI 68.1");
col("cobalt-carbonate", "Cobalt carbonate", "cobalt carbonate|carbonato di cobalto|carbonate de cobalt|carbonato de cobalto|kobaltkarbonat", "CoO 63 LOI 37", { group: "cobalt" });
col("cobalt-oxide", "Cobalt oxide", "cobalt oxide|black cobalt oxide|ossido di cobalto|oxyde de cobalt|óxido de cobalto|kobaltoxid|酸化コバルト", "CoO 93.4 LOI 6.6", { group: "cobalt" });
col("cobalt-sulfate", "Cobalt sulfate", "cobalt sulfate|solfato di cobalto|sulfate de cobalt", "CoO 26.7 LOI 73.3");
col("chrome-oxide", "Chrome oxide", "chrome oxide|chromium oxide|green chrome oxide|ossido di cromo|oxyde de chrome|óxido de cromo|chromoxid", "Cr2O3 100", { group: "chrome" });
col("potassium-dichromate", "Potassium dichromate", "potassium dichromate|bicromato di potassio", "K2O 32 Cr2O3 51.7 LOI 16.3", { note: "Toxic - handle with great care." });
col("manganese-dioxide", "Manganese dioxide", "manganese dioxide|manganese|biossido di manganese|ossido di manganese|bioxyde de manganèse|dioxyde de manganèse|oxyde de manganèse|óxido de manganeso|dióxido de manganeso|braunstein|pyrolusite", "MnO 81.6 LOI 18.4", { group: "manganese", note: "Fumes during firing - ventilate the kiln." });
col("manganese-carbonate", "Manganese carbonate", "manganese carbonate|carbonato di manganese|carbonate de manganèse", "MnO 61.7 LOI 38.3", { group: "manganese" });
col("granular-manganese", "Granular manganese", "granular manganese|manganese granular", "MnO 81.6 LOI 18.4", { group: "manganese" });
col("nickel-oxide-black", "Black nickel oxide", "black nickel oxide|nickel oxide|nickel oxide black|ossido di nichel|ossido di nichel nero|oxyde de nickel|óxido de níquel", "NiO 100", { group: "nickel" });
col("nickel-oxide-green", "Green nickel oxide", "green nickel oxide|ossido di nichel verde|oxyde de nickel vert", "NiO 100", { group: "nickel" });
col("nickel-carbonate", "Nickel carbonate", "nickel carbonate|carbonato di nichel|carbonate de nickel", "NiO 63 LOI 37", { group: "nickel" });

// ---------------------------------------------------------------- titanium, opacifiers, rare earths & specials
col("rutile", "Rutile", "rutile|rutilo|rutile (céradel 2019)|rutile powder|light rutile|dark rutile|ルチール", "TiO2 90 Fe2O3 7 SiO2 1.5 ZrO2 0.5", { group: "rutile" });
col("granular-rutile", "Granular rutile", "granular rutile|rutile granular", "TiO2 90 Fe2O3 7 SiO2 1.5", { group: "rutile" });
m("titanium-dioxide", "Titanium dioxide", "opacifier", "titanium dioxide|titanium|titanium oxide|biossido di titanio|ossido di titanio|dioxyde de titane|oxyde de titane|dióxido de titanio|titandioxid|titania", "TiO2 100", { group: "titanium" });
m("tin-oxide", "Tin oxide", "opacifier", "tin oxide|tin|stannic oxide|ossido di stagno|oxyde d'étain|oxyde d'etain|oxyde d'étain (peter lavem)|óxido de estaño|oxido de estanho|zinnoxid|酸化錫", "SnO2 100", { group: "tin" });
m("zircon", "Zircon opacifier (zirconium silicate)", "opacifier", "zircopax|zircopax plus|superpax|ultrox|opax|zircon|zirconium silicate|silicato di zirconio|zircone|silicate de zirconium|silicato de circonio|zirkonsilikat|tinkar z|zircosil|excelopax", "ZrO2 66 SiO2 33 Al2O3 0.5", { group: "zircon" });
m("zirconium-dioxide", "Zirconium dioxide", "opacifier", "zirconium dioxide|zirconium oxide|zirconia|biossido di zirconio|ossido di zirconio|oxyde de zirconium", "ZrO2 99", { group: "zircon" });
col("vanadium-pentoxide", "Vanadium pentoxide", "vanadium pentoxide|vanadium|ammonium metavanadate|pentossido di vanadio|pentoxyde de vanadium", "", { note: "Toxic - handle with great care." });
col("cerium-oxide", "Cerium oxide", "cerium oxide|ossido di cerio|oxyde de cérium", "");
col("neodymium-oxide", "Neodymium oxide", "neodymium oxide|ossido di neodimio|oxyde de néodyme", "");
col("praseodymium-oxide", "Praseodymium oxide", "praseodymium oxide|ossido di praseodimio|oxyde de praséodyme", "");
col("erbium-oxide", "Erbium oxide", "erbium oxide|ossido di erbio|oxyde d'erbium", "");
col("holmium-oxide", "Holmium oxide", "holmium oxide|ossido di olmio", "");
col("samarium-oxide", "Samarium oxide", "samarium oxide|ossido di samario", "");
col("lanthanum-oxide", "Lanthanum oxide", "lanthanum oxide|ossido di lantanio", "");
col("silver-nitrate", "Silver nitrate", "silver nitrate|nitrato d'argento|nitrate d'argent", "", { note: "Luster/reduction special - corrosive." });
col("bismuth-subnitrate", "Bismuth subnitrate", "bismuth subnitrate|subnitrato di bismuto|sous-nitrate de bismuth", "", { note: "Luster flux." });
col("silicon-carbide", "Silicon carbide", "silicon carbide|carborundum|carburo di silicio|carbure de silicium|carburo de silicio", "SiO2 150", { note: "Local reduction / crater agent - releases gas; 0.2-0.5% is typical." });
col("antimony-oxide", "Antimony oxide", "antimony oxide|ossido di antimonio|oxyde d'antimoine", "", { note: "Toxic." });

// ---------------------------------------------------------------- stains
const stain = (id, name, syn) => m(id, name, "stain", syn, "", { group: id });
stain("stain", "Commercial stain (unspecified)", "stain|mason stain|ceramic stain|colorante ceramico|colorante|pigmento|pigmento ceramico|colorant céramique|corante|blue heron stain|us pigment stain|spectrum stain");
stain("stain-black", "Black stain", "black stain|mason 6600 black stain|mason 6600|mason stain 6600|stain black");
stain("stain-yellow", "Yellow stain", "yellow stain|mason stain #6450 praseodymium|mason 6450|praseodymium yellow stain|corante amarelo 700|corante amarelo|giallo praseodimio");
stain("stain-red", "Red stain", "red stain|mason stain #6021 dark red|mason 6021|mason 6006|deep crimson stain|corante vermelho 105|corante vermelho|us pigment inclusion stain|inclusion stain|rosso inclusione|red inclusion stain");
stain("stain-blue", "Blue stain", "blue stain|mason 6300|mazerine blue|corante azul royal|corante azul|corante celeste 130|corante celeste|turquoise stain");
stain("stain-green", "Green stain", "green stain|mason stain 6202 florentine green|mason 6202|florentine green|victoria green|mason 6242 bermuda");
stain("stain-pink", "Pink stain", "pink stain|mason 6000 shell pink|chrome-tin pink stain|crimson stain");
stain("stain-purple", "Purple stain", "purple stain|mason 6385 pansy purple|pansy purple");
stain("stain-brown", "Brown stain", "brown stain|mason 6109|mason 6126|chocolate stain");
stain("stain-orange", "Orange stain", "orange stain|mason 6027|tangerine stain");

// ---------------------------------------------------------------- local ashes (variable)
m("wood-ash", "Wood ash (mixed)", "local", "wood ash|mixed wood ash|p50 mixed wood ash|ash|wood ashes|cenere|cenere di legna|cenere di legno|cendre|cendre de bois|cendres de bois|ceniza|ceniza de madera|holzasche|glaze ash|木灰|土灰|ash (washed)|washed wood ash", "CaO 33 K2O 9 MgO 4 SiO2 12 Al2O3 3 P2O5 3 Na2O 1 Fe2O3 1.5 MnO 1 LOI 32", V("wood-ash", "Variable: test tile first. Ash chemistry depends on the tree, the bark and how it was washed; unwashed ash is caustic (wear gloves)."));
m("hardwood-ash", "Hardwood ash (oak, beech, olive)", "local", "hardwood ash|oak ash|beech ash|olive wood ash|cenere di quercia|cenere di faggio|cenere di ulivo|cendre de chêne|cendre de hêtre|apple wood ash", "CaO 40 K2O 8 MgO 4.5 SiO2 8 Al2O3 2 P2O5 3 Na2O 0.8 Fe2O3 1 MnO 1 LOI 31", V("wood-ash"));
m("softwood-ash", "Softwood ash (pine, fir)", "local", "soft wood ash|softwood ash|pine ash|fir ash|cenere di pino|cendre de pin", "CaO 28 K2O 7 MgO 4 SiO2 22 Al2O3 6 P2O5 2 Fe2O3 2.5 MnO 1.5 Na2O 1 LOI 26", V("wood-ash"));
m("vine-ash", "Vine-cutting ash", "local", "vine ash|grapevine ash|cenere di vite|cenere di sarmenti|cendre de sarments|cendre de vigne", "CaO 35 K2O 14 MgO 5 SiO2 7 P2O5 5 Al2O3 1.5 Fe2O3 0.8 LOI 31", V("wood-ash"));
m("straw-ash", "Straw / grass ash", "local", "straw ash|grass ash|rice straw ash|reed ash|cenere di paglia|cendre de paille|稲藁灰|藁灰", "SiO2 70 K2O 12 CaO 5 MgO 2 P2O5 2 Na2O 1 Al2O3 1.5 Fe2O3 1 LOI 5", V("straw-ash"));
m("bone-ash-local", "Bone ash (home-made)", "local", "home-made bone ash|homemade bone ash|calcined bones", "CaO 52 P2O5 39 MgO 1 Na2O 1 LOI 7", V("bone-ash"));
m("glass-cullet", "Glass (ground cullet)", "local", "glass|cullet|ground glass|bottle glass|vetro|vetro macinato|rottame di vetro|verre|verre pilé|calcin|vidrio molido", "SiO2 72 Na2O 13.5 CaO 9 MgO 3.5 Al2O3 1.5 K2O 0.4", V("glass"));

// ---------------------------------------------------------------- additives (never block a recipe)
const add = (id, name, syn, extra = {}) => m(id, name, "additive", syn, "", { optional: true, ...extra });
add("cmc-gum", "CMC gum", "cmc|cmc gum|cmc 7l|carboxymethyl cellulose|carbossimetilcellulosa|gomma cmc|gomme cmc|carboxyméthylcellulose|gum|glaze binder");
add("gum-arabic", "Gum arabic", "gum arabic|gomma arabica|gomme arabique");
add("epsom-salts", "Epsom salts", "epsom salts|epsom salt|magnesium sulfate|sale inglese|solfato di magnesio|sel d'epsom|sulfate de magnésium|sal de epsom");
add("darvan", "Darvan (deflocculant)", "darvan|darvan 7|darvan 811|dolapix|deflocculant|deflocculante");
add("vinegar", "Vinegar", "vinegar|aceto|vinaigre|vinagre");
add("water", "Water", "water|acqua|eau|agua");
add("calcium-chloride", "Calcium chloride", "calcium chloride|cloruro di calcio|chlorure de calcium");

// ---------------------------------------------------------------- more named clays & kaolins
m("tile6-kaolin", "Tile #6 kaolin", "clay", "tile #6 kaolin|tile 6|tile #6", "SiO2 46.3 Al2O3 38.3 Fe2O3 0.4 TiO2 1.4 CaO 0.2 K2O 0.2 Na2O 0.2 LOI 13.5", { group: "kaolin" });
m("helmer-kaolin", "Helmer kaolin", "clay", "helmer kaolin (idaho)", "SiO2 46.4 Al2O3 37.5 Fe2O3 0.6 TiO2 0.5 K2O 0.9 LOI 13.7", { group: "kaolin" });
m("ssp-kaolin", "Super Standard Porcelain kaolin", "clay", "super standard porcelain|ssp", "SiO2 46.2 Al2O3 38.6 Fe2O3 0.3 TiO2 1.3 LOI 13.8", { group: "kaolin" });
m("kaolin-6tile", "Kaolin (Italian, e.g. Caolino di Vicenza)", "clay", "caolino di vicenza|caolino italiano|terra di vicenza", "SiO2 48 Al2O3 36 Fe2O3 0.8 K2O 1 TiO2 0.4 LOI 13", { group: "kaolin" });
m("hawthorne-bond", "Hawthorne bond fireclay", "clay", "hawthorne bond fireclay|hawthorne fireclay", "SiO2 55.6 Al2O3 28.5 Fe2O3 1.5 TiO2 1.8 K2O 0.8 Na2O 0.1 LOI 10.5", { group: "stoneware-clay" });
m("lincoln-fireclay", "Lincoln fireclay", "clay", "lincoln 60|lincoln fire clay", "SiO2 54 Al2O3 30.5 Fe2O3 1.4 TiO2 1.6 K2O 0.6 LOI 11", { group: "stoneware-clay" });
m("jordan-clay", "Jordan clay", "clay", "jordan clay|jordan stoneware clay", "SiO2 66 Al2O3 21 Fe2O3 1.5 TiO2 1.4 K2O 0.9 LOI 8", { group: "stoneware-clay" });
m("ocmulgee-red", "Ocmulgee red clay", "clay", "ocmulgee red|ocmulgee", "SiO2 52 Al2O3 24 Fe2O3 8 TiO2 1.2 K2O 1 LOI 12", { group: "red-clay" });
m("shale", "Shale (local)", "local", "shale|scisto argilloso|schiste|argillite", "SiO2 60 Al2O3 17 Fe2O3 6 CaO 2 MgO 2.5 K2O 3.2 Na2O 1 TiO2 0.8 LOI 7", V("wild-clay"));
m("laterite", "Laterite / iron-rich earth", "local", "laterite|terra ferruginosa|latérite|iron earth", "SiO2 30 Al2O3 25 Fe2O3 30 TiO2 1.5 LOI 13", V());
m("mica", "Mica (muscovite)", "feldspar", "mica|muscovite|sericite|セリサイト|mica muscovite", "SiO2 45.2 Al2O3 38.4 K2O 11.8 LOI 4.5");
m("kyanite", "Kyanite", "refractory", "kyanite|cianite|disthène", "SiO2 37 Al2O3 62 Fe2O3 0.5");
m("mullite", "Mullite", "refractory", "mullite", "SiO2 28 Al2O3 72");
m("perlite", "Perlite", "local", "perlite|perlite espansa", "SiO2 74 Al2O3 13 K2O 4.5 Na2O 3.5 CaO 1 Fe2O3 1 LOI 3", V("volcanic-ash"));
m("obsidian", "Obsidian", "local", "obsidian|ossidiana|obsidienne", "SiO2 75 Al2O3 13 K2O 4.5 Na2O 4 CaO 0.8 Fe2O3 1.5", V("volcanic-ash"));
m("rhyolite", "Rhyolite", "local", "rhyolite|riolite|rhyolite dust", "SiO2 73 Al2O3 13.5 K2O 4.5 Na2O 3.5 CaO 1.2 Fe2O3 2 LOI 1", V("volcanic-ash"));
m("trachyte", "Trachyte", "local", "trachyte|trachite", "SiO2 62 Al2O3 17.5 K2O 5.5 Na2O 5.5 CaO 2.5 Fe2O3 4 MgO 0.8 LOI 1.5", V("volcanic-ash"));
m("andesite", "Andesite", "local", "andesite|andesite dust", "SiO2 58 Al2O3 17 CaO 7 Na2O 3.5 K2O 1.5 Fe2O3 7 MgO 3.5 TiO2 0.8 LOI 1", V("basalt"));
m("diatomaceous-earth", "Diatomaceous earth", "local", "diatomaceous earth|rotten stone|rottenstone|tripoli|diatomite|farina fossile|terre de diatomée|kieselguhr", "SiO2 86 Al2O3 3.5 Fe2O3 1.5 CaO 0.5 LOI 7", V("silica"));
m("fly-ash", "Fly ash / coal ash", "local", "fly ash|coal ash|cenere volante|cendre volante", "SiO2 52 Al2O3 25 Fe2O3 9 CaO 5 MgO 1.5 K2O 2 Na2O 0.8 TiO2 1 LOI 3", V());
m("seaweed-ash", "Seaweed ash", "local", "seaweed ash|kelp ash|cenere di alghe|cendre de varech", "Na2O 18 K2O 18 CaO 12 MgO 7 SiO2 5 P2O5 2 LOI 38", V());
m("bamboo-ash", "Bamboo ash", "local", "bamboo ash|cenere di bambù", "SiO2 55 K2O 18 CaO 6 MgO 3 P2O5 4 LOI 14", V("straw-ash"));
m("chestnut-ash", "Chestnut wood ash", "local", "chestnut ash|cenere di castagno|cendre de châtaignier", "CaO 38 K2O 12 MgO 4 SiO2 6 P2O5 3 MnO 2 LOI 35", V("wood-ash"));
m("fern-ash", "Fern / bracken ash", "local", "fern ash|bracken ash|cenere di felce|cendre de fougère", "K2O 25 SiO2 30 CaO 10 MgO 4 P2O5 4 LOI 27", V("straw-ash"));
m("horsetail-ash", "Horsetail ash", "local", "horsetail ash|equisetum ash|cenere di equiseto", "SiO2 75 K2O 8 CaO 7 MgO 2 LOI 8", V("straw-ash"));
m("gypsum", "Gypsum / plaster", "flux", "gypsum|plaster|plaster of paris|gesso|scagliola|plâtre|yeso|calcium sulfate", "CaO 32.6 LOI 67.4");
m("niter", "Potassium nitrate (niter)", "flux", "potassium nitrate|niter|nitre|saltpeter|nitrato di potassio|salnitro|nitrate de potassium", "K2O 46.6 LOI 53.4");
m("sodium-nitrate", "Sodium nitrate", "flux", "sodium nitrate|nitrato di sodio|nitrate de sodium", "Na2O 36.5 LOI 63.5");
m("zinc-carbonate", "Zinc carbonate", "flux", "zinc carbonate|carbonato di zinco|carbonate de zinc", "ZnO 64.9 LOI 35.1", { group: "zinc-oxide" });
m("lithium-fluoride", "Lithium fluoride", "flux", "lithium fluoride|fluoruro di litio", "Li2O 57.6 F 73.2");
m("strontium-sulfate", "Strontium sulfate (celestite)", "flux", "strontium sulfate|celestite|celestina", "SrO 56.4 LOI 43.6");
m("calcium-borate-natural", "Probertite", "flux", "probertite", "Na2O 9 CaO 15 B2O3 49 LOI 27", { group: "ulexite" });
m("nepheline-a400", "Nepheline syenite A400", "feldspar", "nepheline syenite a400|a400|neph sye a400", "SiO2 60.4 Al2O3 23.5 Na2O 10.4 K2O 4.9 CaO 0.4 LOI 0.5", { group: "nepheline" });
m("nepheline-a200", "Nepheline syenite A200", "feldspar", "nepheline syenite a200|a200", "SiO2 60.2 Al2O3 23.6 Na2O 10.6 K2O 4.8 CaO 0.4 LOI 0.5", { group: "nepheline" });
m("italian-feldspar-k", "Italian potash feldspar (e.g. Maffei)", "feldspar", "feldspato potassico maffei|feldspato sardo|feldspato potassico sardo|feldspato di sardegna", "SiO2 68 Al2O3 17.5 K2O 10.5 Na2O 2.8 CaO 0.5 Fe2O3 0.1 LOI 0.5", { group: "potash-feldspar" });
m("italian-feldspar-na", "Italian soda feldspar (e.g. FS 60)", "feldspar", "feldspato sodico italiano|feldspato sodico fs|albite italiana|feldspato sodico fs 60", "SiO2 69 Al2O3 18.5 Na2O 10 K2O 0.8 CaO 0.8 Fe2O3 0.1 LOI 0.5", { group: "soda-feldspar" });
m("spanish-feldspar", "Spanish feldspar", "feldspar", "feldespato español|spanish feldspar", "SiO2 68 Al2O3 18 K2O 7 Na2O 5.5 CaO 0.5 LOI 0.5", { group: "potash-feldspar" });
m("aplite", "Aplite", "feldspar", "aplite|aplita", "SiO2 63 Al2O3 22 Na2O 5.7 K2O 2.8 CaO 5.4 LOI 0.5", { group: "soda-feldspar" });
m("syenite", "Syenite (local rock)", "local", "syenite|sienite|syénite", "SiO2 60 Al2O3 18 K2O 6 Na2O 5 CaO 3 Fe2O3 4 MgO 1.5 LOI 1", V("granite"));
m("feldspathic-sand", "Feldspathic sand", "local", "feldspathic sand|sabbia feldspatica|sable feldspathique", "SiO2 80 Al2O3 10 K2O 4 Na2O 2 CaO 0.8 Fe2O3 0.5 LOI 1", V("silica"));

// ---------------------------------------------------------------- more frits (incl. Italian generic names)
frit("frit-3225", "Ferro Frit 3225", "ferro frit 3225|frit 3225", "");
frit("frit-3227", "Ferro Frit 3227", "ferro frit 3227|frit 3227", "");
frit("frit-3230", "Ferro Frit 3230", "ferro frit 3230|frit 3230", "");
frit("frit-3255", "Ferro Frit 3255", "ferro frit 3255|frit 3255", "");
frit("frit-3270", "Ferro Frit 3270", "ferro frit 3270|frit 3270", "");
frit("frit-3293", "Ferro Frit 3293", "ferro frit 3293|frit 3293", "");
frit("frit-3396", "Ferro Frit 3396", "ferro frit 3396|frit 3396", "");
frit("frit-3467", "Ferro Frit 3467", "ferro frit 3467|frit 3467", "");
frit("frit-3521", "Ferro Frit 3521", "ferro frit 3521|frit 3521", "");
frit("frit-3611", "Ferro Frit 3611", "ferro frit 3611|frit 3611", "");
frit("fusion-f19", "Fusion Frit F-19", "fusion frit f-19|f-19", "");
frit("fusion-f493", "Fusion Frit F-493", "fusion frit f-493|f-493", "");
frit("pemco-p283", "Pemco Frit P-283", "pemco frit p-283|p-283", "");
frit("fritta-borica", "Fritta borica (boron frit, Italian)", "fritta borica|fritta boro-calcica|fritta calcio-borica|fritte borique|fritte calco-borique|frita borica", "CaO 15 Na2O 6 B2O3 22 Al2O3 7 SiO2 50", { group: "frit-3134", note: "Generic Italian supplier frit - use the maker's analysis if given." });
frit("fritta-alcalina", "Fritta alcalina (alkaline frit, Italian)", "fritta alcalina|fritta sodica|fritte alcaline|frita alcalina", "Na2O 14 K2O 2 CaO 5 B2O3 5 Al2O3 4 SiO2 70", { group: "alkaline-frit", note: "Generic Italian supplier frit - use the maker's analysis if given." });
frit("fritta-trasparente", "Fritta trasparente (clear frit, Italian)", "fritta trasparente|fritta cristallina|fritte transparente|cristallina", "", { note: "Supplier clear frit - check the analysis sheet." });
frit("fritta-piombo", "Fritta al piombo (lead frit)", "fritta al piombo|fritta piombica|fritte au plomb", "PbO 60 SiO2 35 Al2O3 3 B2O3 2", { note: "Contains lead. Not for functional ware unless lab tested." });
frit("raku-frit-it", "Fritta raku", "fritta raku|fritte raku", "");

// ---------------------------------------------------------------- more colourants & specials
col("cobalt-aluminate", "Cobalt aluminate (blue stain)", "cobalt aluminate|alluminato di cobalto", "", { group: "stain-blue" });
col("chrome-tin-pink", "Chrome-tin pink stain", "chrome tin pink|rosa cromo-stagno", "", { group: "stain-pink" });
col("iron-phosphate", "Iron phosphate", "iron phosphate|fosfato di ferro", "Fe2O3 53 P2O5 47");
col("copper-chloride", "Copper chloride", "copper chloride|cloruro di rame", "CuO 46.7 LOI 53.3");
col("tin-chloride", "Tin chloride (stannous)", "stannous chloride|tin chloride|cloruro di stagno", "SnO2 66.4 LOI 33.6", { note: "Fuming/luster use - corrosive." });
col("bismuth-oxide", "Bismuth oxide", "bismuth oxide|ossido di bismuto", "");
col("silver-carbonate", "Silver carbonate", "silver carbonate|carbonato d'argento", "");
col("chrome-oxide-hydrated", "Hydrated chrome oxide", "hydrated chrome oxide|chromium hydroxide", "Cr2O3 85 LOI 15", { group: "chrome" });
col("copper-oxide-green", "Green copper (verdigris)", "verdigris|verderame|vert-de-gris", "CuO 44 LOI 56", { group: "copper" });
col("manganese-ore", "Manganese ore (local)", "manganese ore|pirolusite naturale|wad", "MnO 60 Fe2O3 8 SiO2 10 Al2O3 4 LOI 18", V("manganese"));
col("underglaze", "Underglaze colour", "underglaze|sottocristallo|engobe colour", "", { group: "stain" });
m("engobe", "Engobe / slip (prepared)", "slip-clay", "engobe|ingobbio|engobe blanc|slip", "SiO2 60 Al2O3 25 K2O 2 Na2O 1 LOI 10", { note: "Prepared slip - composition varies." });
m("grog", "Grog (chamotte)", "refractory", "grog|grog, fine|chamotte|chamotte fine|sabbia refrattaria", "SiO2 55 Al2O3 40 Fe2O3 1.5 TiO2 1.5 K2O 1");

writeFileSync(
  path.join(process.cwd(), "data/materials/glossary.json"),
  JSON.stringify(
    {
      version: 1,
      note: "Canonical glaze materials. Analyses are typical oxide weight % (LOI = loss on ignition). 'variable' materials change from source to source: test tile first.",
      count: out.length,
      materials: out,
    },
    null,
    1
  ) + "\n"
);
const ids = new Set();
for (const x of out) {
  if (ids.has(x.id)) throw new Error("duplicate id " + x.id);
  ids.add(x.id);
}
console.log(`glossary: ${out.length} materials written to data/materials/glossary.json`);
