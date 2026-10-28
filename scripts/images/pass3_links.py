"""Pass 2: summarise link health from the crawl cache: non-200 statuses, parked-domain text, cross-domain redirects.
Prints a table; the verdicts in docs/images-pass-2.md were then confirmed by hand (curl with a plain UA, then the Browser pane)."""
import glob, json, re, sys, urllib.parse
sys.path.insert(0, "scripts/images")
from pass3_crawl import S

PARK = re.compile(r"domain (is )?for sale|buy this domain|this domain may be for sale|hugedomains|sedo\.com|godaddy|"
                  r"domain.{0,30}(available|expired|parked)|parked (free|domain)|afternic|dan\.com|account suspended|"
                  r"coming soon|under construction|website is expired", re.I)
rows = []
for f in sorted(glob.glob(S + "pages/*.json")):
    r = json.load(open(f))
    u = r.get("url") or ""
    host = lambda s: urllib.parse.urlparse(s or "").netloc.lower().replace("www.", "")
    flags = []
    st = r.get("status")
    if st not in (200,):
        flags.append("status=%s" % st)
    t = (r.get("title") or "") + " " + (r.get("text") or "")
    if PARK.search(t):
        flags.append("PARKED?")
    fin = r.get("final") or ""
    if fin and host(fin) != host(u):
        flags.append("redirect->" + host(fin))
    if flags:
        rows.append((r["id"], u[:70], " ".join(flags), (r.get("title") or "")[:60]))
for r in rows:
    print(" | ".join(r))
