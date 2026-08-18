import { chromium } from "playwright";
const b = await chromium.launch();
for (const w of [320, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true });
  await p.addInitScript(() => { try { sessionStorage.setItem("repossessed-rides:intro-played","1"); } catch {} });
  await p.goto("http://localhost:3200/", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    window.scrollTo(9999, 0);
    const x = window.scrollX;
    const bodyClip = getComputedStyle(document.body).overflowX;
    const htmlClip = getComputedStyle(document.documentElement).overflowX;
    return { x, bodyClip, htmlClip, de: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
  });
  console.log(`${w}px -> after scrollTo(9999): scrollX=${r.x}  body.overflow-x=${r.bodyClip}  html.overflow-x=${r.htmlClip}  (scrollW=${r.de}/${r.cw})`);
  await p.close();
}
await b.close();
