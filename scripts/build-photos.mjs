/**
 * Promote curated candidates from .photo-cache into optimised WebP in public/,
 * and emit the attribution data that the licences require.
 *
 * The SELECTION map below is a hand-curated list of cache indices — every entry
 * was reviewed on a contact sheet before being listed here.
 */
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CACHE = ".photo-cache";
const OUT = "public/images";

/** bucket -> cache indices, best first. Curated by eye. */
const SELECTION = {
  motorcycles: [2, 4, 8, 12, 13, 14, 16, 10, 20, 24, 9, 1],
  atvs: [4, 5, 6, 7, 9, 11, 15, 16, 19, 22, 24, 2],
  utv: [17, 16, 3, 4, 7, 14, 1, 2, 9, 22, 23, 24],
  watercraft: [14, 11, 22, 27, 24, 23, 3, 4, 19, 25],
  boats: [0, 3, 4, 13, 20, 5, 14, 16, 19],
  "golf-carts": [2, 0, 9, 10, 11, 14, 17, 18, 19, 15],
  scooters: [0, 1, 8, 12, 18, 19, 27, 3, 4],
  "dirt-bikes": [4, 0, 1, 2, 3, 12, 17, 18, 19, 22, 23],
  generators: [13, 14, 15, 16, 20, 0, 11],
  dealership: [16, 26, 23, 13, 12, 9, 20],
};

/** Category page artwork: <category slug> -> [bucket, rank]. */
const CATEGORY_ART = {
  motorcycles: ["motorcycles", 0],
  atvs: ["atvs", 0],
  "side-by-sides": ["utv", 0],
  watercraft: ["watercraft", 0],
  boats: ["boats", 0],
  "golf-carts": ["golf-carts", 0],
  scooters: ["scooters", 0],
  "dirt-bikes": ["dirt-bikes", 0],
  generators: ["generators", 0],
};

/** Hero slides — the strongest action frames in the whole pool. */
const HERO = [
  ["watercraft", 0],
  ["dirt-bikes", 0],
  ["atvs", 10],
  ["motorcycles", 3],
];

/**
 * Brand tile artwork: <brand slug> -> [bucket, rank]. Each brand is paired with
 * a photograph of the line it is best known for at our stores.
 */
const BRAND_ART = {
  yamaha: ["motorcycles", 3],
  suzuki: ["motorcycles", 8],
  polaris: ["utv", 0],
  "can-am": ["atvs", 1],
  "sea-doo": ["watercraft", 0],
  cfmoto: ["utv", 1],
  kawasaki: ["dirt-bikes", 3],
  indian: ["dirt-bikes", 6],
  "ez-go": ["golf-carts", 0],
  honda: ["motorcycles", 7],
  "all-inventory": ["utv", 5],
};

const DEALERSHIP = {
  // 0 powersports stand (quads + side-by-sides), 1 technician inspecting a bike,
  // 2 indoor boat showroom, 3 customer sizing up an adventure bike.
  showroom: ["dealership", 0],
  service: ["dealership", 1],
  marine: ["dealership", 2],
  finance: ["dealership", 3],
};

/** Product category -> photo bucket. */
const CATEGORY_TO_BUCKET = {
  motorcycles: "motorcycles",
  atvs: "atvs",
  "side-by-sides": "utv",
  watercraft: "watercraft",
  boats: "boats",
  "golf-carts": "golf-carts",
  scooters: "scooters",
  "dirt-bikes": "dirt-bikes",
  generators: "generators",
};

const manifest = JSON.parse(await readFile(path.join(CACHE, "candidates.json"), "utf8"));

/** Resolve (bucket, rank) -> cache file + metadata. */
function pick(bucket, rank) {
  const picks = SELECTION[bucket];
  if (!picks?.length) throw new Error(`no selection for bucket ${bucket}`);
  const idx = picks[rank % picks.length];
  const file = `${String(idx).padStart(2, "0")}.jpg`;
  const meta = manifest[bucket]?.find((m) => m.file === file);
  if (!meta) throw new Error(`missing manifest entry ${bucket}/${file}`);
  return { src: path.join(CACHE, bucket, file), meta, key: `${bucket}/${file}` };
}

const used = new Map();

async function emit(src, meta, key, outPath, width, height) {
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(src)
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
  used.set(key, meta);
}

// ---------------------------------------------------------------- categories
for (const [slug, [bucket, rank]] of Object.entries(CATEGORY_ART)) {
  const { src, meta, key } = pick(bucket, rank);
  await emit(src, meta, key, `${OUT}/categories/${slug}.webp`, 1200, 900);
}

// --------------------------------------------------------------------- hero
for (const [i, [bucket, rank]] of HERO.entries()) {
  const { src, meta, key } = pick(bucket, rank);
  await emit(src, meta, key, `${OUT}/hero/hero-${i + 1}.webp`, 2400, 1350);
}

// --------------------------------------------------------------- dealership
for (const [name, [bucket, rank]] of Object.entries(DEALERSHIP)) {
  const { src, meta, key } = pick(bucket, rank);
  await emit(src, meta, key, `${OUT}/dealership/${name}.webp`, 1600, 1200);
}

// -------------------------------------------------------------------- brands
// Portrait crops, sized for the tall brand tiles on the homepage grid.
for (const [slug, [bucket, rank]] of Object.entries(BRAND_ART)) {
  const { src, meta, key } = pick(bucket, rank);
  await emit(src, meta, key, `${OUT}/brands/${slug}.webp`, 900, 1200);
}

// ------------------------------------------------------------------ products
const productsSrc = await readFile("src/data/products.ts", "utf8");
const seedRe = /id:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
const seeds = [];
for (const m of productsSrc.matchAll(seedRe)) seeds.push({ id: m[1], category: m[2] });
if (!seeds.length) throw new Error("could not parse product seeds");

// Spread choices across each bucket so neighbouring cards don't repeat a photo.
const cursor = {};
for (const { id, category } of seeds) {
  const bucket = CATEGORY_TO_BUCKET[category];
  if (!bucket) throw new Error(`no bucket for category ${category}`);
  const start = cursor[bucket] ?? 0;
  for (let n = 1; n <= 3; n += 1) {
    const { src, meta, key } = pick(bucket, start + n - 1);
    await emit(src, meta, key, `${OUT}/products/${id}-${n}.webp`, 1600, 1200);
  }
  cursor[bucket] = start + 3;
}

// ------------------------------------------------------------------- credits
const credits = [...used.entries()]
  .map(([key, m]) => ({
    key,
    title: m.title.replace(/^File:/, ""),
    author: m.author,
    licence: m.licence,
    licenceUrl: m.licenceUrl,
    sourceUrl: m.descriptionUrl,
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

const ts = `// GENERATED by scripts/build-photos.mjs — do not edit by hand.
//
// Every photograph in public/images is reused from Wikimedia Commons under a
// licence permitting commercial use. Several require attribution and, for
// ShareAlike terms, that derivatives carry the same licence — cropping and
// re-encoding makes these derivatives, so the credits below are published at
// /credits and linked from the footer.

export type PhotoCredit = {
  key: string;
  title: string;
  author: string;
  licence: string;
  licenceUrl: string;
  sourceUrl: string;
};

export const photoCredits: PhotoCredit[] = ${JSON.stringify(credits, null, 2)};
`;
await writeFile("src/data/credits.ts", ts, "utf8");

// Retire the SVG placeholders now that photography has replaced them.
for (const dir of ["categories", "hero", "dealership", "products", "brands"]) {
  const full = path.join(OUT, dir);
  for (const f of await readdir(full)) {
    if (f.endsWith(".svg")) await rm(path.join(full, f));
  }
}

console.log(
  `wrote ${Object.keys(CATEGORY_ART).length} category, ${HERO.length} hero, ` +
    `${Object.keys(DEALERSHIP).length} dealership, ${Object.keys(BRAND_ART).length} brand, ` +
    `${seeds.length * 3} product images`,
);
console.log(`credits: ${credits.length} distinct photographs -> src/data/credits.ts`);
