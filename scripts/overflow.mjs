import { chromium } from "playwright";
const path = process.argv[2] ?? "/";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await p.addInitScript(() => { try { sessionStorage.setItem("repossessed-rides:intro-played","1"); } catch {} });
await p.goto("http://localhost:3200" + path, { waitUntil: "networkidle" });
await p.waitForTimeout(700);

// Neutralise the clip so the REAL overflow becomes measurable, the way it
// behaves in browsers without overflow-x:clip support.
const r = await p.evaluate(() => {
  document.body.style.overflowX = "visible";
  document.documentElement.style.overflowX = "visible";
  const cw = document.documentElement.clientWidth;

  const clipped = (el) => {
    for (let a = el.parentElement; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflow !== "visible" || s.overflowX !== "visible") return true;
    }
    return false;
  };

  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const rc = el.getBoundingClientRect();
    if (rc.width === 0 || rc.height === 0) continue;
    if (rc.right > cw + 1 && !clipped(el)) {
      bad.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.toString?.() ?? "").slice(0, 65),
        l: Math.round(rc.left), r: Math.round(rc.right),
      });
    }
  }
  return { cw, sw: document.documentElement.scrollWidth, bad: bad.slice(0, 10) };
});
console.log(`${path}  client=${r.cw}  scrollW(unclipped)=${r.sw}`);
for (const x of r.bad) console.log(`   [${x.l}..${x.r}] ${x.tag}.${x.cls}`);
await b.close();
