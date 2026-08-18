/**
 * Repair UTF-8 text that was read as CP1252 and re-encoded as UTF-8
 * (e.g. "—" -> "â€”", "Ö" -> "Ã–").
 *
 * The corruption is reversible: map each character back to the single CP1252
 * byte it came from, then decode that byte sequence as UTF-8. Only files whose
 * round-trip both succeeds and changes something are rewritten.
 */
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

// CP1252 code points for bytes 0x80-0x9F, which differ from Latin-1.
const CP1252 = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

function repair(text) {
  const bytes = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp <= 0xff) bytes.push(cp);
    else if (CP1252[cp] !== undefined) bytes.push(CP1252[cp]);
    else return null; // Not representable in CP1252 — not this corruption.
  }
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(
    new Uint8Array(bytes),
  );
  return decoded;
}

let fixed = 0;
for await (const file of glob("src/**/*.{ts,tsx}")) {
  const original = await readFile(file, "utf8");
  if (!/[À-ÿ][-ÿ–—’€]/.test(original)) continue;

  let repaired;
  try {
    repaired = repair(original);
  } catch {
    continue; // Invalid UTF-8 after mapping — leave the file alone.
  }
  if (!repaired || repaired === original) continue;

  await writeFile(file, repaired, "utf8");
  console.log(`repaired ${file}`);
  fixed += 1;
}
console.log(fixed ? `\n${fixed} file(s) repaired` : "nothing to repair");
