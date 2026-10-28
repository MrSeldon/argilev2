"""Pass 2, step 1: crawl each image-less opportunity's website (plus up to 3 relevant subpages) and
record HTTP status, title, and candidate image URLs (og:image, <img>, srcset, CSS backgrounds, Wix/Squarespace CDNs).
Input: <SCR>/todo.json  [[file,id,name,website,status],...]   Output: <SCR>/p2/pages/<id>.json (scratch, not committed)."""
import json, os, re, subprocess, sys, html, urllib.parse
from concurrent.futures import ThreadPoolExecutor

SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
S = SCR + "p2/"
UA = "Mozilla/5.0"  # a full Chrome UA sent from curl is blocked by some WAFs (454/403); the short one passes
os.makedirs(S + "pages", exist_ok=True)


def get(url, timeout=25, maxsize=4000000):
    try:
        r = subprocess.run(["curl", "-sL", "--max-time", str(timeout), "--max-filesize", str(maxsize), "-A", UA,
                            "-H", "Accept-Language: en-US,en;q=0.9", "-w", "\n__CODE__%{http_code} %{url_effective}", url],
                           capture_output=True, timeout=timeout + 10)
    except Exception:
        return 0, url, ""
    b = r.stdout.decode("utf-8", "ignore")
    b, _, t = b.rpartition("\n__CODE__")
    code, _, fin = t.partition(" ")
    try:
        code = int(code)
    except ValueError:
        code = 0
    return code, fin.strip(), b


BAD = re.compile(r"logo|icon|favicon|sprite|avatar|badge|payment|pixel|spacer|blank|placeholder|loader|arrow|button|"
                 r"banner-ad|facebook|instagram|twitter|youtube|\.svg|\.gif|gravatar|emoji|captcha|qr[-_]?code|"
                 r"googleapis|doubleclick|analytics|tracking", re.I)


def norm(u):
    m = re.match(r"(https?://static\.wixstatic\.com/media/[^/]+\.(?:jpe?g|png|webp))/v1/", u, re.I)
    if m:
        return m.group(1)
    if "squarespace-cdn.com" in u:
        u = u.split("?")[0] + "?format=1500w"
    u = re.sub(r"(cdn\.shopify\.com/.*?)_(?:\d+x\d*|\d*x\d+|small|medium|large|grande|compact|pico|icon)(\.\w+)", r"\1\2", u)
    u = re.sub(r"(/wp-content/uploads/.*?)-\d{2,4}x\d{2,4}(\.\w+)", r"\1\2", u)
    return u


def cands(body, base):
    out = []

    def add(u):
        if not u:
            return
        u = html.unescape(u.strip().strip('"\''))
        if u.startswith("data:") or u.startswith("#"):
            return
        u = urllib.parse.urljoin(base, u)
        if u.startswith("http"):
            out.append(u)

    for k in ("og:image", "og:image:secure_url", "twitter:image"):
        for m in re.finditer(r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']+)' % k, body, re.I):
            add(m.group(1))
        for m in re.finditer(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']%s["\']' % k, body, re.I):
            add(m.group(1))
    for m in re.finditer(r'<(?:img|source|video)\b[^>]*>', body, re.I | re.S):
        tag = m.group(0)
        for a in ("data-src", "data-image", "data-lazy-src", "data-original", "src", "poster"):
            mm = re.search(r'\b%s=["\']([^"\']+)' % a, tag, re.I)
            if mm:
                add(mm.group(1))
        for a in ("srcset", "data-srcset"):
            mm = re.search(r'\b%s=["\']([^"\']+)' % a, tag, re.I)
            if mm:
                parts = [p.strip().split(" ")[0] for p in mm.group(1).split(",") if p.strip()]
                if parts:
                    add(parts[-1])
    for m in re.finditer(r'url\(([^)]+)\)', body):
        add(m.group(1))
    for m in re.finditer(r'https?:\\?/\\?/[^"\'\s<>()\\]+?\.(?:jpe?g|png|webp)(?:\?[^"\'\s<>()\\]*)?', body, re.I):
        add(m.group(0).replace("\\/", "/"))
    for m in re.finditer(r'static\.wixstatic\.com/media/[A-Za-z0-9_~.-]+\.(?:jpe?g|png|webp)', body):
        add("https://" + m.group(0))
    res, seen = [], set()
    for u in out:
        if not re.search(r"\.(jpe?g|png|webp)(\?|$|/)|/media/|format=|image|photo|upload|cdn|/files/", u, re.I):
            continue
        if BAD.search(urllib.parse.urlparse(u).path.rsplit("/", 1)[-1]):
            continue
        n = norm(u)
        if n in seen:
            continue
        seen.add(n)
        res.append(n)
    return res


KW = re.compile(r"about|gallery|studio|campus|facilit|ceramic|clay|residen|program|membership|classes|workshop|photos|space|kiln|visit|our-", re.I)


def sublinks(body, base, n=3):
    host = urllib.parse.urlparse(base).netloc
    ls = []
    for m in re.finditer(r'<a\b[^>]*href=["\']([^"\'#]+)["\']', body, re.I):
        u = urllib.parse.urljoin(base, html.unescape(m.group(1)))
        p = urllib.parse.urlparse(u)
        if p.netloc != host or re.search(r"\.(pdf|jpe?g|png|zip)$", p.path, re.I):
            continue
        if KW.search(p.path) and u.rstrip("/") != base.rstrip("/") and u not in ls:
            ls.append(u)
    return ls[:n]


def work(it):
    f, id_, name, url, status = it
    path = S + "pages/" + id_ + ".json"
    if os.path.exists(path):
        return
    rec = {"id": id_, "file": f, "url": url, "status": None, "cands": []}
    if url and url.startswith("http") and not url.lower().split("?")[0].endswith(".pdf"):
        code, fin, body = get(url)
        rec.update(status=code, final=fin, bodylen=len(body))
        t = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        rec["title"] = html.unescape(re.sub(r"\s+", " ", t.group(1)).strip())[:150] if t else None
        txt = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", body, flags=re.S | re.I)
        txt = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", txt))).strip()
        rec["text"] = txt[:600]
        c = cands(body, fin or url)
        if code == 200 and len(body) > 0:
            for sl in sublinks(body, fin or url):
                c2, f2, b2 = get(sl, timeout=20)
                if c2 == 200:
                    c += cands(b2, f2)
        seen = set()
        rec["cands"] = [x for x in c if not (x in seen or seen.add(x))][:40]
    json.dump(rec, open(path, "w"))


if __name__ == "__main__":
    todo = json.load(open(sys.argv[1] if len(sys.argv) > 1 else SCR + "todo.json"))
    with ThreadPoolExecutor(16) as ex:
        list(ex.map(work, todo))
    print("done")
