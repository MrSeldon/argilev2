"""Screenshot + overflow/tap-target audit for every route at 375x812 and 1280x800.

Usage: python3 scripts/mobile-audit.py <phase> [route,route]   (dev server on :3111)
Uses the locally installed Google Chrome via Playwright (channel="chrome").
"""
import sys, json, os
from playwright.sync_api import sync_playwright

phase = sys.argv[1]
only = sys.argv[2].split(',') if len(sys.argv) > 2 else None
routes = {
    'home': '/', 'opportunities': '/opportunities', 'map': '/opportunities/map',
    'opp-detail': '/opportunities/saic-ceramics', 'glazes': '/glazes',
    'glaze-detail': '/glazes/BORY1', 'my-materials': '/glazes/my-materials',
    'inspirations': '/inspirations', 'connections': '/inspirations/connections',
    'insp-detail': '/inspirations/traditions/jomon', 'mentor': '/mentor',
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'screenshots', 'mobile-pass')
os.makedirs(out, exist_ok=True)
AUDIT = """()=>{const W=innerWidth;const r={sw:document.documentElement.scrollWidth,W,over:[],small:[]};
for(const el of document.querySelectorAll('body *')){const b=el.getBoundingClientRect();if(b.width&&b.right>W+1&&getComputedStyle(el).position!=='fixed'&&!el.closest('.leaflet-container')){r.over.push(el.tagName+'.'+String(el.className).slice(0,50)+' r='+Math.round(b.right));if(r.over.length>6)break}}
for(const el of document.querySelectorAll('a,button,select,input,summary,[role=button]')){const b=el.getBoundingClientRect();if(b.width&&b.height&&(b.height<40||b.width<40)&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('.leaflet-control-attribution'))r.small.push((el.textContent||el.getAttribute('aria-label')||el.tagName).trim().slice(0,20)+' '+Math.round(b.width)+'x'+Math.round(b.height))}
r.small=r.small.slice(0,14);return r}"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for vw, vh, tag in [(375, 812, 'm'), (1280, 800, 'd')]:
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=1,
                            has_touch=(tag == 'm'), is_mobile=(tag == 'm'))
        pg = ctx.new_page()
        for name, url in routes.items():
            if only and name not in only:
                continue
            pg.goto('http://localhost:3111' + url, wait_until='load')
            pg.wait_for_timeout(3000 if 'map' in url else 1200)
            pg.screenshot(path=f'{out}/{phase}-{name}-{tag}.png')
            print(tag, name, json.dumps(pg.evaluate(AUDIT)))
        ctx.close()
    b.close()
