import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true });
await p.addInitScript(() => { try { sessionStorage.setItem("repossessed-rides:intro-played", "1"); } catch {} });
await p.goto("http://localhost:3200" + (process.argv[2] ?? "/"), { waitUntil: "networkidle" });
await p.waitForTimeout(700);
const r = await p.evaluate(() => {
  const de = document.documentElement;
  const rows = [];
  for (const el of document.querySelectorAll("*")) {
    const rc = el.getBoundingClientRect();
    if (rc.width > de.clientWidth + 1) {
      rows.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.toString?.() ?? "").slice(0, 60),
        w: Math.round(rc.width),
        sw: el.scrollWidth,
        txt: (el.textContent ?? "").trim().slice(0, 28),
      });
    }
  }
  return { client: de.clientWidth, scroll: de.scrollWidth, rows: rows.slice(0, 12) };
});
console.log("client", r.client, "scroll", r.scroll);
for (const x of r.rows) console.log(`${String(x.w).padStart(5)} sw=${String(x.sw).padStart(5)}  ${x.tag}.${x.cls}  "${x.txt}"`);
await b.close();
