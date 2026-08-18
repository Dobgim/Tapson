import sharp from "sharp";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
const P = "public/images";

async function sheet(name, files, cols = 4, cw = 300, ch = 200) {
  if (!files.length) return;
  const rows = Math.ceil(files.length / cols);
  const canvas = sharp({
    create: { width: cols * cw, height: rows * ch, channels: 3, background: "#111" },
  });
  const comps = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i]).resize(cw - 6, ch - 6, { fit: "cover" }).png().toBuffer();
    comps.push({ input: buf, left: (i % cols) * cw + 3, top: Math.floor(i / cols) * ch + 3 });
  }
  await canvas.composite(comps).png().toFile(join(out, `final-${name}.png`));
  console.log(`final-${name}.png  (${files.length})`);
}

const hero = readdirSync(join(P, "hero")).map((f) => join(P, "hero", f));
const cats = readdirSync(join(P, "categories")).map((f) => join(P, "categories", f));
const deal = readdirSync(join(P, "dealership")).map((f) => join(P, "dealership", f));
const prod = readdirSync(join(P, "products")).filter((f) => f.endsWith("-1.webp")).map((f) => join(P, "products", f));

await sheet("hero", hero, 2, 420, 240);
await sheet("categories", cats, 3, 340, 220);
await sheet("dealership", deal, 2, 420, 240);
await sheet("products", prod, 5, 260, 180);
