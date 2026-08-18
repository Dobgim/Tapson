/**
 * Harvest freely-licensed candidate photography from Wikimedia Commons.
 *
 * Writes candidates into .photo-cache/<bucket>/ together with a manifest that
 * records author + licence for every file, so attribution can be generated
 * later. Nothing here touches public/ — curation happens first via
 * contact-sheet.mjs, then build-photos.mjs promotes the chosen files.
 *
 * Usage: node scripts/harvest-photos.mjs [bucket ...]
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const CACHE = ".photo-cache";
const UA = "RivaNextGenDevBuild/1.0 (local portfolio build; contact dobgimajoshua52@gmail.com)";

/** Licences that permit commercial reuse. Everything else is discarded. */
const OK_LICENCE = /^(cc0|cc[ -]by([ -]sa)?([ -][0-9.]+)?|public domain|pd([ -]|$)|attribution)/i;
const BAD_LICENCE = /(non[- ]?commercial|\bnc\b|no[- ]?deriv|\bnd\b|fair use|copyright|gfdl only)/i;

/** Titles that are clearly not usable photography. */
const BAD_TITLE =
  /(logo|icon|map|diagram|chart|graph|schematic|patent|drawing|blueprint|sticker|stamp|coin|banknote|poster|screenshot|caricature|cartoon|\.svg|\.pdf|\.tif|crash|accident|wreck|burn|funeral|grave|memorial|protest|police|ambulance|military|war)/i;

const BUCKETS = {
  motorcycles: [
    "Yamaha MT-09 motorcycle",
    "sport motorcycle side view studio",
    "naked motorcycle parked",
    "cruiser motorcycle chrome",
    "Suzuki motorcycle sport",
    "motorcycle road touring",
  ],
  atvs: [
    "all-terrain vehicle quad",
    "ATV quad bike trail",
    "Polaris Sportsman ATV",
    "quad bike sand",
  ],
  utv: [
    "Polaris RZR",
    "Yamaha Viking utility vehicle",
    "Kawasaki Mule utility vehicle",
    "John Deere Gator utility vehicle",
    "Can-Am Maverick",
    "dune buggy offroad sand",
    "utility terrain vehicle four wheel drive",
  ],
  watercraft: [
    "personal watercraft jet ski",
    "Sea-Doo personal watercraft",
    "Yamaha WaveRunner",
    "jet ski riding water",
  ],
  boats: [
    "bowrider motorboat lake",
    "speedboat sea cruising wake",
    "powerboat ocean fast",
    "runabout boat water sunny",
    "sport fishing boat sea",
    "motorboat marina moored",
  ],
  "golf-carts": ["golf cart", "golf buggy course", "electric golf car"],
  scooters: ["motor scooter city", "Vespa scooter parked", "scooter 125cc"],
  "dirt-bikes": [
    "motocross motorcycle jump dirt",
    "enduro motorcycle trail",
    "dirt bike offroad rider",
  ],
  generators: ["portable generator petrol", "power generator machine", "inverter generator"],
  hero: [
    "motorcycle riding road curve mountain",
    "jet ski jumping wave spray",
    "speedboat wake ocean fast",
    "motocross rider jump sky",
    "motorcycle rider coast highway",
    "quad bike riding dust action",
  ],
  dealership: [
    "motorcycle exhibition stand show",
    "EICMA motorcycle show",
    "motorcycle show hall bikes display",
    "motorcycle dealership showroom new bikes",
    "boat show exhibition",
    "marina yachts moored sunny",
    "motorcycle mechanic workshop tools repair",
    "motorcycle service technician",
    "boat dealer marina dock",
  ],
};

async function api(params) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({ format: "json", origin: "*", ...params });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function search(query, limit = 25) {
  const data = await api({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "1800",
  });
  return Object.values(data?.query?.pages ?? {});
}

const strip = (s) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

function evaluate(page) {
  const ii = page?.imageinfo?.[0];
  if (!ii || !/^image\/(jpeg|png|webp)$/.test(ii.mime ?? "")) return null;
  if (BAD_TITLE.test(page.title)) return null;

  const licence = strip(ii.extmetadata?.LicenseShortName?.value);
  if (!licence || BAD_LICENCE.test(licence) || !OK_LICENCE.test(licence)) return null;

  // Landscape, reasonably high resolution — this is hero/card artwork.
  const ratio = ii.width / ii.height;
  if (ratio < 1.25 || ratio > 2.4) return null;
  if (ii.width < 1600) return null;

  return {
    title: page.title,
    author: strip(ii.extmetadata?.Artist?.value) || "Unknown",
    licence,
    licenceUrl: strip(ii.extmetadata?.LicenseUrl?.value) || "",
    descriptionUrl: ii.descriptionurl,
    credit: strip(ii.extmetadata?.Credit?.value),
    width: ii.width,
    height: ii.height,
    thumb: ii.thumburl,
  };
}

async function run() {
  const wanted = process.argv.slice(2);
  const buckets = Object.entries(BUCKETS).filter(
    ([name]) => wanted.length === 0 || wanted.includes(name),
  );

  const manifest = {};
  for (const [bucket, queries] of buckets) {
    const dir = path.join(CACHE, bucket);
    await mkdir(dir, { recursive: true });

    const seen = new Map();
    for (const q of queries) {
      let pages = [];
      try {
        pages = await search(q);
      } catch (err) {
        console.warn(`  ! search failed "${q}": ${err.message}`);
        continue;
      }
      for (const page of pages) {
        const ok = evaluate(page);
        if (ok && !seen.has(ok.title)) seen.set(ok.title, { ...ok, query: q });
      }
    }

    const items = [...seen.values()].slice(0, 28);
    const saved = [];
    for (const [i, item] of items.entries()) {
      const file = `${String(i).padStart(2, "0")}.jpg`;
      try {
        const res = await fetch(item.thumb, { headers: { "User-Agent": UA } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
        saved.push({ file, ...item });
      } catch (err) {
        console.warn(`  ! download failed ${item.title}: ${err.message}`);
      }
    }
    manifest[bucket] = saved;
    console.log(`${bucket.padEnd(12)} ${saved.length} candidates`);
  }

  const manifestPath = path.join(CACHE, "candidates.json");
  let existing = {};
  try {
    existing = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    /* first run */
  }
  await writeFile(manifestPath, JSON.stringify({ ...existing, ...manifest }, null, 2));
  console.log(`\nmanifest -> ${manifestPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
