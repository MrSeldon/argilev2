"""Exercise the opportunities map: Bay default, pin -> sheet, list view, World toggle, chip filter.
Usage: python3 scripts/map-flow.py   (dev server on :3111)
"""
import os, json
from playwright.sync_api import sync_playwright

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'screenshots', 'mobile-pass')
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for vw, vh, tag in [(375, 812, 'm'), (1280, 800, 'd')]:
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, has_touch=(tag == 'm'), is_mobile=(tag == 'm'))
        pg = ctx.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text[:150]))
        pg.goto('http://localhost:3111/opportunities/map', wait_until='load')
        pg.wait_for_timeout(3500)
        pg.screenshot(path=f'{out}/after-map-bay-{tag}.png')
        print(tag, 'pins', pg.locator('.argile-pin').count(), 'sw', pg.evaluate('document.documentElement.scrollWidth'))
        pins = pg.locator('.argile-pin')
        if pins.count():
            pg.locator('[title^="City College"]').click(force=True)
            pg.wait_for_timeout(1000)
            pg.screenshot(path=f'{out}/after-map-sheet-{tag}.png')
            print(tag, 'sheet', pg.locator('aside[role=dialog]').count())
            pg.keyboard.press('Escape')
        pg.get_by_role('button', name='List').first.click()
        pg.wait_for_timeout(500)
        pg.screenshot(path=f'{out}/after-map-list-{tag}.png')
        pg.get_by_role('button', name='Map', exact=True).first.click()
        pg.get_by_role('button', name='World').click()
        pg.wait_for_timeout(2500)
        pg.screenshot(path=f'{out}/after-map-world-{tag}.png')
        print(tag, 'world pins', pg.locator('.argile-pin').count())
        print(tag, 'errors', errs[:3])
        ctx.close()
    b.close()
