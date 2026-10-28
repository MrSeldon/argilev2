"""Open the phone menu and screenshot it. Usage: python3 scripts/nav-flow.py (dev server on :3111)"""
import os
from playwright.sync_api import sync_playwright

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'screenshots', 'mobile-pass')
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    ctx = b.new_context(viewport={'width': 375, 'height': 812}, has_touch=True, is_mobile=True)
    pg = ctx.new_page()
    pg.goto('http://localhost:3111/opportunities/map', wait_until='load')
    pg.wait_for_timeout(1500)
    pg.get_by_role('button', name='Open menu').click()
    pg.wait_for_timeout(400)
    pg.screenshot(path=f'{out}/after-nav-menu-m.png')
    pg.get_by_role('link', name='Glazes').click()
    pg.wait_for_timeout(1500)
    print('after nav click ->', pg.url, 'menu open:', pg.locator('#mobile-menu').count())
    b.close()
