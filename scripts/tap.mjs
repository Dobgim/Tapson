import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await p.addInitScript(() => { try { sessionStorage.setItem("repossessed-rides:intro-played", "1"); } catch {} });
await p.goto("http://localhost:3200/", { waitUntil: "networkidle" });
await p.waitForTimeout(600);

const btn = p.locator('button[aria-label="Open menu"]');
console.log("hamburger visible:", await btn.isVisible());
const box = await btn.boundingBox();
console.log("hamburger box:", box && { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) });

await btn.tap();
await p.waitForTimeout(800);
const panel = p.locator('[role="dialog"], nav').first();
console.log("menu opened:", await p.locator("text=Apply for Financing").first().isVisible());
await p.screenshot({ path: out + "/menu-open-390.png" });

await b.close();
