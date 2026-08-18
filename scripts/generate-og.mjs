/**
 * Rasterises the social card to public/og.png.
 *
 * This runs offline rather than through next/og at request time: the card is
 * static, so there's no reason to pay for a runtime image render (or to depend
 * on the satori/resvg WASM bundle) on every crawl.
 *
 * Run with:  node scripts/generate-og.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06080b"/>
      <stop offset="55%" stop-color="#14181f"/>
      <stop offset="100%" stop-color="#4a100d"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.22" r="0.55">
      <stop offset="0%" stop-color="#ec2f24" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ec2f24" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g transform="rotate(-16 600 315)" opacity="0.07">
    <rect x="-200" y="90" width="1600" height="14" fill="#ffffff"/>
    <rect x="-200" y="200" width="1600" height="24" fill="#ffffff"/>
    <rect x="-200" y="330" width="1600" height="14" fill="#ffffff"/>
    <rect x="-200" y="450" width="1600" height="22" fill="#ffffff"/>
  </g>

  <rect x="72" y="66" width="76" height="76" rx="19" fill="#d81f18"/>
  <path d="M96 128V80h25.4a13.3 13.3 0 0 1 2.7 26.3L136 128h-13.9l-12-20.1H108V128H96Zm12-29.2h10.9a5 5 0 0 0 0-10H108v10Z"
        fill="#ffffff" transform="translate(0 0)"/>

  <text x="170" y="102" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="bold"
        letter-spacing="-1" fill="#ffffff">REPOSSESSED RIDES</text>
  <text x="172" y="130" font-family="Arial, Helvetica, sans-serif" font-size="15"
        letter-spacing="7.5" fill="#ffffff" opacity="0.5">MOTORSPORTS</text>

  <text x="72" y="360" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="92"
        font-weight="bold" letter-spacing="-2" fill="#ffffff">FIND YOUR NEXT</text>
  <text x="72" y="452" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="92"
        font-weight="bold" letter-spacing="-2" fill="#ec2f24">ADVENTURE</text>

  <text x="72" y="508" font-family="Arial, Helvetica, sans-serif" font-size="23"
        fill="#ffffff" opacity="0.6">Motorcycles · ATVs · Side-by-Sides · Watercraft · Boats · Golf Carts</text>

  <rect x="72" y="548" width="1056" height="1" fill="#ffffff" opacity="0.12"/>
  <text x="72" y="588" font-family="Arial, Helvetica, sans-serif" font-size="21"
        fill="#ffffff" opacity="0.45">Miami   ·   Key Largo   ·   Pompano Beach</text>
</svg>`;

const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(join(outDir, "og.png"), png);

// Square variant for messaging apps that crop to 1:1.
const square = await sharp(Buffer.from(svg))
  .resize(630, 630, { fit: "cover", position: "left" })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(join(outDir, "og-square.png"), square);

console.log(`Wrote public/og.png (${W}x${H}) and public/og-square.png (630x630)`);
