/**
 * Dev-only QA helper: rasterises a few generated SVGs to PNG so the artwork can
 * be eyeballed without opening a browser. Not part of the build.
 *
 *   node scripts/preview-art.mjs <output-directory>
 */

import { mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const outDir = process.argv[2];
if (!outDir) {
  console.error("Usage: node scripts/preview-art.mjs <output-directory>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const targets = [
  "public/images/categories/motorcycles.svg",
  "public/images/categories/dirt-bikes.svg",
  "public/images/categories/scooters.svg",
  "public/images/categories/golf-carts.svg",
  "public/images/categories/atvs.svg",
  "public/images/categories/generators.svg",
];

for (const file of targets) {
  const name = basename(file, ".svg");
  await sharp(file, { density: 120 })
    .resize(560)
    .png()
    .toFile(join(outDir, `${name}.png`));
}

console.log(`Wrote ${targets.length} previews to ${outDir}`);
