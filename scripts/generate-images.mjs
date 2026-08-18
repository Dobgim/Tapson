/**
 * Generates the site's image library as original SVG artwork.
 *
 * Nothing here is traced from or derived from third-party photography or logo
 * artwork. Each image is a duotone "poster": layered sky, sun, speed bands, a
 * horizon and a hand-authored vehicle silhouette.
 *
 * Run with:  node scripts/generate-images.mjs
 *
 * To swap in real photography later, drop files with the same names into the
 * same folders (any extension) and update the paths in src/data/*.ts.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "public", "images");

/* ------------------------------------------------------------------ colour */

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

/** amount > 0 lightens toward white, < 0 darkens toward black. */
function shade(hex, amount) {
  const rgb = hexToRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return rgbToHex(rgb.map((c) => c + (target - c) * t));
}

function mix(a, b, t) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  return rgbToHex(ra.map((c, i) => c + (rb[i] - c) * t));
}

const INK = "#06080b";

/* -------------------------------------------------------------- silhouettes
 * Every silhouette is authored in a 1000 x 500 box with the ground/water line
 * at y = 460, so they can be dropped into any scene with one transform.
 * `fill` is the silhouette colour, `knock` is the colour punched through
 * wheel centres and windows so the sky reads through.
 */

const wheel = (cx, cy, r, fill, knock) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="${knock}"/>`;

const silhouettes = {
  /* A sportbike is mostly air: keep the frame thin and leave a clear gap
     above each wheel, or the profile reads as a buggy. */
  motorcycle: (fill, knock) => `
    <path d="M262 202 L276 164 L452 156 L470 184 L520 178 L546 156 L636 150
             L690 174 L700 202 L660 214 L560 218 L470 220 L380 214 L320 214 Z"
          fill="${fill}"/>
    <path d="M690 160 L754 144 L782 180 L756 214 L694 204 Z" fill="${fill}"/>
    <path d="M712 144 L722 104 L754 110 L744 150 Z" fill="${fill}"/>
    <path d="M462 218 L626 214 L646 296 L478 306 Z" fill="${fill}"/>
    <path d="M742 186 L778 176 L830 322 L796 336 Z" fill="${fill}"/>
    <path d="M474 282 L240 336 L248 362 L482 308 Z" fill="${fill}"/>
    <path d="M306 250 L424 258 L420 286 L302 278 Z" fill="${fill}"/>
    ${wheel(215, 348, 112, fill, knock)}
    ${wheel(800, 348, 112, fill, knock)}`,

  dirtbike: (fill, knock) => `
    <path d="M700 150 L806 130 L820 166 L712 186 Z" fill="${fill}"/>
    <path d="M210 190 L350 168 L372 200 L232 224 Z" fill="${fill}"/>
    <path d="M340 190 L452 182 L448 212 L344 218 Z" fill="${fill}"/>
    <path d="M430 176 L560 160 L600 196 L590 228 L440 234 Z" fill="${fill}"/>
    <path d="M668 172 L678 120 L712 126 L702 180 Z" fill="${fill}"/>
    <path d="M448 232 L590 228 L606 300 L462 310 Z" fill="${fill}"/>
    <path d="M706 186 L742 176 L812 318 L776 332 Z" fill="${fill}"/>
    <path d="M460 288 L228 330 L236 358 L468 314 Z" fill="${fill}"/>
    ${wheel(210, 340, 120, fill, knock)}
    ${wheel(800, 340, 120, fill, knock)}`,

  scooter: (fill, knock) => `
    <path d="M180 250 L210 196 L400 186 L452 240 L432 300 L200 306 Z" fill="${fill}"/>
    <path d="M210 196 L382 184 L386 208 L214 220 Z" fill="${fill}"/>
    <path d="M430 276 L600 272 L604 304 L434 308 Z" fill="${fill}"/>
    <path d="M600 210 L662 176 L702 192 L708 302 L606 302 Z" fill="${fill}"/>
    <path d="M644 180 L658 132 L742 142 L736 178 Z" fill="${fill}"/>
    <path d="M700 210 L736 202 L796 322 L762 334 Z" fill="${fill}"/>
    ${wheel(215, 372, 88, fill, knock)}
    ${wheel(790, 372, 88, fill, knock)}`,

  atv: (fill, knock) => `
    <path d="M120 300 L150 226 L318 214 L360 250 L620 244 L664 200 L866 208
             L900 296 L840 322 L676 330 L470 336 L268 332 L146 322 Z" fill="${fill}"/>
    <path d="M330 214 L392 148 L560 142 L622 200 L560 220 L400 226 Z" fill="${fill}"/>
    <path d="M604 158 L676 90 L716 108 L662 176 Z" fill="${fill}"/>
    <path d="M640 96 L780 78 L788 110 L648 128 Z" fill="${fill}"/>
    <rect x="140" y="196" width="180" height="26" rx="10" fill="${fill}"/>
    <rect x="700" y="188" width="180" height="26" rx="10" fill="${fill}"/>
    ${wheel(250, 356, 118, fill, knock)}
    ${wheel(792, 356, 118, fill, knock)}`,

  utv: (fill, knock) => `
    <path d="M110 316 L142 250 L300 240 L360 200 L660 194 L744 240 L890 250
             L920 316 L860 340 L640 348 L380 348 L160 340 Z" fill="${fill}"/>
    <path d="M300 196 L352 92 L706 88 L760 196 Z" fill="${fill}"/>
    <path d="M372 176 L410 118 L664 116 L698 176 Z" fill="${knock}"/>
    <rect x="290" y="70" width="486" height="30" rx="14" fill="${fill}"/>
    <path d="M300 200 L330 70 L364 78 L340 200 Z" fill="${fill}"/>
    <path d="M714 200 L742 78 L776 70 L750 200 Z" fill="${fill}"/>
    ${wheel(246, 372, 122, fill, knock)}
    ${wheel(802, 372, 122, fill, knock)}`,

  pwc: (fill, knock) => `
    <path d="M96 386 L188 300 L392 276 L520 208 L700 196 L836 236 L900 300
             L906 372 L700 404 L360 410 L150 400 Z" fill="${fill}"/>
    <path d="M420 272 L470 202 L642 194 L688 262 Z" fill="${fill}"/>
    <path d="M636 214 L742 158 L780 190 L690 244 Z" fill="${fill}"/>
    <path d="M716 150 L824 138 L830 172 L722 184 Z" fill="${fill}"/>
    <path d="M198 318 L392 300 L380 342 L206 350 Z" fill="${knock}"/>`,

  boat: (fill, knock) => `
    <path d="M70 380 L150 306 L900 288 L936 348 L900 402 L200 412 L104 400 Z" fill="${fill}"/>
    <path d="M400 290 L420 176 L586 172 L604 290 Z" fill="${fill}"/>
    <path d="M436 262 L448 206 L566 204 L576 262 Z" fill="${knock}"/>
    <rect x="336" y="96" width="340" height="26" rx="12" fill="${fill}"/>
    <path d="M356 180 L370 100 L396 104 L382 180 Z" fill="${fill}"/>
    <path d="M614 180 L628 104 L654 100 L640 180 Z" fill="${fill}"/>
    <path d="M842 200 L906 196 L916 300 L846 306 Z" fill="${fill}"/>
    <path d="M120 344 L340 330 L336 372 L128 380 Z" fill="${knock}"/>`,

  golfcart: (fill, knock) => `
    <path d="M170 300 L196 236 L392 228 L440 190 L716 186 L760 300 L700 322
             L420 328 L216 320 Z" fill="${fill}"/>
    <rect x="238" y="92" width="520" height="26" rx="12" fill="${fill}"/>
    <path d="M262 232 L286 108 L318 112 L300 232 Z" fill="${fill}"/>
    <path d="M690 232 L712 112 L744 108 L726 232 Z" fill="${fill}"/>
    <path d="M446 190 L462 118 L616 116 L636 190 Z" fill="${knock}"/>
    ${wheel(268, 372, 92, fill, knock)}
    ${wheel(700, 372, 92, fill, knock)}`,

  generator: (fill, knock) => `
    <rect x="230" y="196" width="540" height="230" rx="26" fill="${fill}"/>
    <rect x="286" y="150" width="428" height="34" rx="17" fill="${fill}"/>
    <path d="M300 184 L318 150 L346 158 L330 196 Z" fill="${fill}"/>
    <path d="M700 184 L682 150 L654 158 L670 196 Z" fill="${fill}"/>
    <circle cx="380" cy="308" r="62" fill="${knock}"/>
    <circle cx="380" cy="308" r="24" fill="${fill}"/>
    <rect x="500" y="252" width="216" height="20" rx="10" fill="${knock}"/>
    <rect x="500" y="292" width="216" height="20" rx="10" fill="${knock}"/>
    <rect x="500" y="332" width="140" height="20" rx="10" fill="${knock}"/>
    <rect x="264" y="426" width="80" height="34" rx="12" fill="${fill}"/>
    <rect x="656" y="426" width="80" height="34" rx="12" fill="${fill}"/>`,
};

/* ------------------------------------------------------------------ scenes */

/**
 * Builds one poster.
 * @param {object} o
 * @param {number} o.w  viewBox width
 * @param {number} o.h  viewBox height
 * @param {string} o.hue  duotone accent
 * @param {keyof silhouettes} o.subject
 * @param {number} o.variant  0..2 — shifts band angle, crop and horizon
 * @param {boolean} o.water  draw a water horizon instead of land
 * @param {string} [o.label]  ghosted display word
 */
function poster({ w, h, hue, subject, variant = 0, water = false, label = "" }) {
  const uid = Math.random().toString(36).slice(2, 8);
  const skyTop = mix(INK, hue, 0.12);
  const skyMid = mix(INK, hue, 0.42);
  const skyLow = mix(hue, "#ffffff", 0.18);
  const sunColor = mix(hue, "#ffd9a8", 0.55);
  // The land must stay clearly lighter than the silhouette or the subject
  // disappears into the horizon.
  const ground = shade(hue, -0.52);
  const fill = shade(hue, -0.86);
  const horizon = h * (water ? 0.72 : 0.7) + variant * h * 0.015;

  // Silhouette sizing: variant 1 crops in tighter, variant 2 pulls back.
  const scale = (w / 1150) * (variant === 1 ? 1.16 : variant === 2 ? 0.92 : 1);
  const boxW = 1000 * scale;
  const tx = (w - boxW) / 2 + (variant === 2 ? w * 0.04 : 0);
  const ty = horizon - 452 * scale + (water ? 34 * scale : 0);
  const flip = variant === 2 ? `translate(${boxW} 0) scale(-1 1)` : "";

  const sunX = variant === 1 ? w * 0.28 : w * 0.68;
  const sunR = Math.min(w, h) * (variant === 1 ? 0.3 : 0.24);
  const bandAngle = [-18, -12, -24][variant];

  const bands = Array.from({ length: 5 }, (_, i) => {
    const y = h * (0.1 + i * 0.13);
    const thickness = h * (0.012 + (i % 3) * 0.008);
    const opacity = 0.05 + (i % 2) * 0.05;
    // Over-wide so the rotation never exposes an end.
    return `<rect x="${-w * 0.4}" y="${y}" width="${w * 1.8}" height="${thickness}" fill="#ffffff" opacity="${opacity}"/>`;
  }).join("");

  const waves = water
    ? Array.from({ length: 7 }, (_, i) => {
        const y = horizon + 18 + i * (h - horizon) * 0.13;
        const len = w * (0.1 + ((i * 37) % 20) / 100);
        const x = ((i * 173) % 100) / 100 * w * 0.8;
        return `<rect x="${x}" y="${y}" width="${len}" height="${Math.max(3, h * 0.006)}" rx="${h * 0.003}" fill="#ffffff" opacity="${0.1 - i * 0.008}"/>`;
      }).join("")
    : "";

  const land = water
    ? `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#sea-${uid})"/>`
    : `<path d="M0 ${horizon + h * 0.05} L${w * 0.18} ${horizon - h * 0.03}
            L${w * 0.34} ${horizon + h * 0.02} L${w * 0.52} ${horizon - h * 0.05}
            L${w * 0.71} ${horizon + h * 0.01} L${w * 0.88} ${horizon - h * 0.02}
            L${w} ${horizon + h * 0.04} L${w} ${h} L0 ${h} Z"
          fill="${shade(ground, -0.2)}" opacity="0.9"/>
       <rect x="0" y="${horizon + h * 0.12}" width="${w}" height="${h}" fill="${ground}"/>`;

  // Cap the ghosted word by width so long labels never run off the canvas.
  const ghostSize = Math.min(h * 0.34, (w * 0.92) / (label.length * 0.62 || 1));
  const ghost = label
    ? `<text x="${w / 2}" y="${horizon - h * 0.24}" text-anchor="middle"
             font-family="Arial Narrow, Arial, Helvetica, sans-serif"
             font-size="${ghostSize.toFixed(1)}" font-weight="700"
             letter-spacing="${(ghostSize * 0.04).toFixed(1)}"
             fill="#ffffff" opacity="0.055">${escapeXml(label.toUpperCase())}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}"/>
      <stop offset="55%" stop-color="${skyMid}"/>
      <stop offset="100%" stop-color="${skyLow}"/>
    </linearGradient>
    <linearGradient id="sea-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${mix(hue, INK, 0.45)}"/>
      <stop offset="100%" stop-color="${shade(hue, -0.78)}"/>
    </linearGradient>
    <radialGradient id="sun-${uid}">
      <stop offset="0%" stop-color="${sunColor}" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="${sunColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${sunColor}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${uid}" cx="0.5" cy="0.45" r="0.78">
      <stop offset="55%" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.62"/>
    </radialGradient>
    <pattern id="dots-${uid}" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="#ffffff" opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#sky-${uid})"/>
  <circle cx="${sunX}" cy="${horizon - h * 0.16}" r="${sunR}" fill="url(#sun-${uid})"/>
  <circle cx="${sunX}" cy="${horizon - h * 0.16}" r="${sunR * 0.42}" fill="${sunColor}" opacity="0.55"/>
  <g transform="rotate(${bandAngle} ${w / 2} ${h / 2})">${bands}</g>
  ${land}
  ${waves}
  ${ghost}
  <g transform="translate(${tx} ${ty}) scale(${scale})">
    <g transform="${flip}">${silhouettes[subject](fill, water ? mix(hue, INK, 0.45) : skyLow)}</g>
  </g>
  <rect width="${w}" height="${h}" fill="url(#dots-${uid})" opacity="0.05"/>
  <rect width="${w}" height="${h}" fill="url(#vig-${uid})"/>
</svg>
`;
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

/* ---------------------------------------------------------------- category
 * Keep this table in sync with src/data/categories.ts.
 */

const categoryMeta = {
  motorcycles: { hue: "#d81f18", subject: "motorcycle", water: false },
  atvs: { hue: "#c2570f", subject: "atv", water: false },
  "side-by-sides": { hue: "#8a5b12", subject: "utv", water: false },
  watercraft: { hue: "#0e7c8a", subject: "pwc", water: true },
  boats: { hue: "#15557f", subject: "boat", water: true },
  "golf-carts": { hue: "#2f6b3a", subject: "golfcart", water: false },
  scooters: { hue: "#6b3a86", subject: "scooter", water: false },
  "dirt-bikes": { hue: "#a3141f", subject: "dirtbike", water: false },
  generators: { hue: "#41505f", subject: "generator", water: false },
};

/* ------------------------------------------------------------------- write */

function write(relPath, contents) {
  const full = join(outRoot, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents, "utf8");
}

let count = 0;

// Hero slides
const heroSlides = [
  { hue: "#d81f18", subject: "motorcycle", water: false, label: "Ride" },
  { hue: "#0e7c8a", subject: "pwc", water: true, label: "Water" },
  { hue: "#8a5b12", subject: "utv", water: false, label: "Trail" },
  { hue: "#15557f", subject: "boat", water: true, label: "Offshore" },
];

heroSlides.forEach((slide, i) => {
  write(
    `hero/hero-${i + 1}.svg`,
    poster({ w: 1920, h: 1080, variant: i % 3, ...slide }),
  );
  count++;
});

// Category tiles
for (const [slug, meta] of Object.entries(categoryMeta)) {
  write(
    `categories/${slug}.svg`,
    poster({ w: 1200, h: 900, variant: 0, label: slug.split("-")[0], ...meta }),
  );
  count++;
}

// Dealership / editorial imagery
write("dealership/showroom.svg", poster({ w: 1600, h: 1100, hue: "#d81f18", subject: "motorcycle", variant: 1, label: "Repossessed Rides" }));
write("dealership/service.svg", poster({ w: 1400, h: 1000, hue: "#41505f", subject: "atv", variant: 2, label: "Service" }));
write("dealership/marine.svg", poster({ w: 1400, h: 1000, hue: "#0e7c8a", subject: "boat", variant: 0, water: true, label: "Marine" }));
write("dealership/finance.svg", poster({ w: 1400, h: 1000, hue: "#15557f", subject: "utv", variant: 1, label: "Finance" }));
count += 4;

// Product galleries — three angles per unit. Ids are read straight out of the
// data file so the two can never drift apart.
const productSrc = readFileSync(join(root, "src", "data", "products.ts"), "utf8");
const productEntries = [
  ...productSrc.matchAll(
    /id:\s*"([^"]+)"[\s\S]{0,400}?make:\s*"([^"]+)"[\s\S]{0,400}?category:\s*"([^"]+)"/g,
  ),
].map(([, id, make, category]) => ({ id, make, category }));

if (productEntries.length === 0) {
  throw new Error("No products parsed from src/data/products.ts");
}

for (const p of productEntries) {
  const meta = categoryMeta[p.category];
  if (!meta) throw new Error(`Unknown category "${p.category}" on product ${p.id}`);
  for (let v = 0; v < 3; v++) {
    write(
      `products/${p.id}-${v + 1}.svg`,
      poster({ w: 1600, h: 1200, variant: v, label: p.make, ...meta }),
    );
    count++;
  }
}

console.log(`Generated ${count} SVG assets into public/images/`);
