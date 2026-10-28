// Screenshot every route at phone (375x812) and laptop (1440x900) sizes.
//
// Usage:
//   PW_DIR=/path/with/node_modules/playwright-core \
//   node scripts/screenshots.mjs <baseUrl> <outDir> <prefix> [routeFilter]
//
// playwright-core is not a project dependency; point PW_DIR at any folder where
// it is installed. It drives the locally installed Google Chrome (channel
// "chrome"), so no browser download is needed. Also reports horizontal overflow.
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(path.join(process.env.PW_DIR || process.cwd(), "index.js"));
const { chromium } = require("playwright-core");

const [base, out, prefix, filter] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

const routes = [
  ["home", "/"],
  ["opportunities", "/opportunities"],
  ["opportunities-map", "/opportunities/map"],
  ["opportunity-detail", "/opportunities/saic-ceramics"],
  ["opportunity-detail-bay", "/opportunities/sfbay-castro-clay"],
  ["opportunity-detail-legacy", "/opportunities/archie-bray"],
  ["opportunity-detail-unconfirmed", "/opportunities/co-bogota-ceramyst"],
  ["inspirations", "/inspirations"],
  ["inspiration-detail", "/inspirations/traditions/jomon"],
  ["connections", "/inspirations/connections"],
  ["glazes", "/glazes"],
  ["glaze-detail", "/glazes/GR10-E"],
  ["my-shelf", "/glazes/my-materials"],
  ["mentor", "/mentor"],
  ["clouds", "/argile-sky-complete.html"],
];

const sizes = [
  ["m", 375, 812],
  ["d", 1440, 900],
];

// Pages that are a fixed viewport (map, graph, video) get a viewport shot.
const VIEWPORT_ONLY = ["opportunities-map", "connections", "clouds"];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
for (const [sk, w, h] of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: sk === "m",
    hasTouch: sk === "m",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const [name, route] of routes) {
    if (filter && !filter.split(",").some((f) => name === f)) continue;
    try {
      const res = await page.goto(base + route, { waitUntil: "networkidle", timeout: 90000 });
      if (!res || res.status() >= 400) {
        report.push(`${name} ${sk}: HTTP ${res && res.status()}`);
        continue;
      }
      await page.waitForTimeout(name === "clouds" ? 2500 : 900);
      // walk the page so lazy images load, then return to the top
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
        window.scrollTo(0, 0);
      });
      await page
        .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 })
        .catch(() => {});
      await page.waitForTimeout(700);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) report.push(`${name} ${sk}: horizontal overflow ${overflow}px`);
      // Chrome paints very tall captures unreliably; cap long lists at 7000px.
      const full = !VIEWPORT_ONLY.includes(name);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.screenshot({
        path: `${out}/${prefix}-${name}-${sk}.png`,
        fullPage: full,
        ...(full && height > 7000 ? { clip: { x: 0, y: 0, width: w, height: 7000 } } : {}),
      });
    } catch (e) {
      report.push(`${name} ${sk}: ${e.message.split("\n")[0]}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(report.join("\n") || "ok");
