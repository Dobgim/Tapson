/**
 * Responsive screenshot sweep. Captures each page at a set of real device
 * widths and reports any horizontal overflow it finds.
 *
 * Usage: node scripts/shots.mjs <outDir> [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
const base = process.argv[3] ?? "http://localhost:3200";
mkdirSync(out, { recursive: true });

const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440];
const PAGES = process.env.PAGES
  ? process.env.PAGES.split(",")
  : ["/", "/inventory", "/inventory/yz-mt09-2025", "/financing", "/contact"];

const browser = await chromium.launch();

for (const path of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      isMobile: width < 768,
      hasTouch: width < 768,
    });

    // Skip the once-per-session intro so shots show the real page.
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("repossessed-rides:intro-played", "1");
      } catch {}
    });
    await page.goto(base + path, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(900);

    // Anything wider than the viewport means a horizontal scrollbar.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const bad = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          bad.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString?.() ?? "").slice(0, 70),
            left: Math.round(r.left),
            right: Math.round(r.right),
          });
        }
      }
      return {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        offenders: bad.slice(0, 4),
      };
    });

    const flag = overflow.scrollW > overflow.clientW + 1 ? "  << OVERFLOW" : "";
    console.log(
      `${path.padEnd(28)} ${String(width).padStart(4)}px  scroll=${overflow.scrollW} client=${overflow.clientW}${flag}`,
    );
    for (const o of overflow.offenders) {
      console.log(`      ${o.tag}.${o.cls} [${o.left}..${o.right}]`);
    }

    const name = (path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "")) + `-${width}.png`;
    await page.screenshot({ path: join(out, name), fullPage: false });
    await page.close();
  }
}

await browser.close();
console.log("\nscreenshots ->", out);
