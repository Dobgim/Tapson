/**
 * Build a numbered contact sheet per bucket so candidates can be reviewed by
 * eye before anything is promoted into public/.
 *
 * Usage: node scripts/contact-sheet.mjs <outDir> [bucket ...]
 */
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CACHE = ".photo-cache";
const CELL_W = 300;
const CELL_H = 190;
const COLS = 5;
const PAD = 6;

const outDir = process.argv[2];
if (!outDir) {
  console.error("usage: node scripts/contact-sheet.mjs <outDir> [bucket ...]");
  process.exit(1);
}
const wanted = process.argv.slice(3);

const manifest = JSON.parse(await readFile(path.join(CACHE, "candidates.json"), "utf8"));
await mkdir(outDir, { recursive: true });

for (const [bucket, items] of Object.entries(manifest)) {
  if (wanted.length && !wanted.includes(bucket)) continue;

  const dir = path.join(CACHE, bucket);
  let files;
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).sort();
  } catch {
    continue;
  }
  if (!files.length) continue;

  const rows = Math.ceil(files.length / COLS);
  const width = COLS * (CELL_W + PAD) + PAD;
  const height = rows * (CELL_H + PAD) + PAD;

  const composites = [];
  for (const [i, file] of files.entries()) {
    const x = PAD + (i % COLS) * (CELL_W + PAD);
    const y = PAD + Math.floor(i / COLS) * (CELL_H + PAD);
    try {
      const buf = await sharp(path.join(dir, file))
        .resize(CELL_W, CELL_H, { fit: "cover" })
        .toBuffer();
      composites.push({ input: buf, left: x, top: y });
    } catch {
      continue;
    }
    // Index badge, so a chosen cell can be named unambiguously.
    const label = files[i].replace(".jpg", "");
    const badge = Buffer.from(
      `<svg width="${CELL_W}" height="30" xmlns="http://www.w3.org/2000/svg">
         <rect width="46" height="24" rx="4" fill="#000" fill-opacity="0.82"/>
         <text x="23" y="17" font-family="monospace" font-size="15" font-weight="bold"
               fill="#fff" text-anchor="middle">${label}</text>
       </svg>`,
    );
    composites.push({ input: badge, left: x + 4, top: y + 4 });
  }

  const sheet = path.join(outDir, `sheet-${bucket}.png`);
  await sharp({
    create: { width, height, channels: 3, background: { r: 24, g: 27, b: 33 } },
  })
    .composite(composites)
    .png()
    .toFile(sheet);

  console.log(`${bucket.padEnd(12)} ${files.length} imgs -> ${sheet}`);
}
