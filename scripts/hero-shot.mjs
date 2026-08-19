import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: w < 768 ? 844 : 900 }, isMobile: w < 768 });
  await p.addInitScript(() => { try { sessionStorage.setItem("repossessed-rides:intro-played","1"); } catch {} });
  await p.goto("http://localhost:3200/", { waitUntil: "networkidle" });
  // Wait for the entrance animation to actually finish.
  await p.waitForFunction(() => {
    const el = document.querySelector("h1.display-xl span span");
    return el && getComputedStyle(el).opacity === "1";
  }, { timeout: 15000 }).catch(() => console.log(`  (${w}px: animation did not settle)`));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/hero-${w}.png` });
  console.log("shot", w);
  await p.close();
}
await b.close();
