"""Shared helpers: polite curl-based fetch (system CA store) and WebP conversion."""
import subprocess, time, json, urllib.parse, os, io

UA = "LeFourArgile/1.0 (devin.maloney@gmail.com)"
SCR = "/private/tmp/claude-501/-/da4b410e-1974-4af6-a4d4-bf135dee5b8f/scratchpad/"
_last = {}


def curl(url, out=None, min_gap=1.0, timeout=40, ua=UA):
    host = urllib.parse.urlparse(url).netloc
    wait = min_gap - (time.time() - _last.get(host, 0))
    if wait > 0:
        time.sleep(wait)
    cmd = ["curl", "-sL", "--max-time", str(timeout), "-A", ua, "-w", "%{http_code}"]
    if out:
        cmd += ["-o", out]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True)
    _last[host] = time.time()
    code = r.stdout[-3:].decode() if out else r.stdout[-3:].decode()
    if out:
        return int(code or 0)
    return int(code or 0), r.stdout[:-3]


def api(**p):
    p['format'] = 'json'
    u = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    for _ in range(8):
        code, body = curl(u)
        if code == 200:
            return json.loads(body)
        time.sleep(20)
    raise RuntimeError("api failed %s" % code)


def to_webp(src, dst, maxside=1400, target_kb=180):
    from PIL import Image
    from PIL import ImageOps
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert("RGB") if im.mode not in ("RGB",) else im
    w, h = im.size
    s = min(1.0, maxside / max(w, h))
    if s < 1:
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    q = 78
    while True:
        im.save(dst, "WEBP", quality=q, method=6)
        if os.path.getsize(dst) <= target_kb * 1024 or q <= 55:
            break
        q -= 6
    return im.size, os.path.getsize(dst)
