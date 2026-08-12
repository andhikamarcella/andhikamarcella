import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const biasDir = path.join(root, "assets", "bias");
const output = path.join(root, "assets", "my-bias.svg");

fs.mkdirSync(biasDir, { recursive: true });

const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const photos = fs
  .readdirSync(biasDir)
  .filter((file) => allowed.has(path.extname(file).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .slice(0, 5);

const slots = [
  { x: 585, y: 178, r: 88, label: "JUUN 01" },
  { x: 434, y: 100, r: 45, label: "02" },
  { x: 739, y: 102, r: 47, label: "03" },
  { x: 445, y: 274, r: 50, label: "04" },
  { x: 738, y: 273, r: 52, label: "05" },
];

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

function dataUri(file) {
  const base64 = fs.readFileSync(path.join(biasDir, file)).toString("base64");
  return `data:${mime(file)};base64,${base64}`;
}

const clips = slots
  .map(
    (slot, i) => `
    <clipPath id="clip-${i}">
      <circle cx="${slot.x}" cy="${slot.y}" r="${slot.r}" />
    </clipPath>`,
  )
  .join("");

const avatars = slots
  .map((slot, i) => {
    const image = photos[i]
      ? `<image href="${dataUri(photos[i])}" x="${slot.x - slot.r}" y="${slot.y - slot.r}" width="${slot.r * 2}" height="${slot.r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${i})" />`
      : `<circle cx="${slot.x}" cy="${slot.y}" r="${slot.r}" fill="#111318" />
         <text x="${slot.x}" y="${slot.y + 4}" text-anchor="middle" fill="#737983" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${i === 0 ? 12 : 10}">${slot.label}</text>`;

    return `
      <g>
        <circle cx="${slot.x}" cy="${slot.y}" r="${slot.r + 5}" fill="#171a20" stroke="${i === 0 ? "#8b5cf6" : "#30343b"}" stroke-width="1" />
        ${image}
        <circle cx="${slot.x}" cy="${slot.y}" r="${slot.r}" fill="none" stroke="#ffffff" stroke-opacity="0.08" />
      </g>`;
  })
  .join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="840" height="360" viewBox="0 0 840 360" role="img" aria-labelledby="title desc">
  <title id="title">my bias &lt;3 — Juun</title>
  <desc id="desc">A Fragments UI-inspired profile card for Juun from Hearts2Hearts.</desc>

  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#a78bfa" />
    </linearGradient>
    ${clips}
  </defs>

  <!-- Fragments-style surface -->
  <rect x="1" y="1" width="838" height="358" rx="18" fill="#0d0f12" stroke="#282c33" stroke-width="1.2" />

  <!-- left content card -->
  <rect x="22" y="22" width="330" height="316" rx="14" fill="#111318" stroke="#24282f" />

  <g font-family="Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="44" y="54" fill="#747b86" font-size="10" font-weight="600" letter-spacing="1.8">MY BIAS</text>

    <circle cx="321" cy="48" r="4" fill="#8b5cf6" />

    <text x="42" y="105" fill="#f5f5f6" font-size="36" font-weight="700">Juun &lt;3</text>
    <text x="43" y="132" fill="#979da7" font-size="13">Hearts2Hearts · 03 Dec 2008</text>

    <!-- badge row -->
    <rect x="42" y="157" width="110" height="25" rx="7" fill="#171a20" stroke="#2c3038" />
    <text x="97" y="173.5" text-anchor="middle" fill="#c9cbd0" font-size="10" font-weight="600">HEARTS2HEARTS</text>

    <rect x="160" y="157" width="58" height="25" rx="7" fill="#1a1626" stroke="#4c3970" />
    <text x="189" y="173.5" text-anchor="middle" fill="#c4b5fd" font-size="10" font-weight="600">JUUN</text>

    <rect x="226" y="157" width="77" height="25" rx="7" fill="#171a20" stroke="#2c3038" />
    <text x="264.5" y="173.5" text-anchor="middle" fill="#c9cbd0" font-size="10" font-weight="600">MY BIAS</text>

    <!-- human note -->
    <text x="42" y="222" fill="#e4e5e7" font-size="14" font-weight="500">my favorite in Hearts2Hearts.</text>
    <text x="42" y="247" fill="#a4a9b2" font-size="13">i always end up watching her first —</text>
    <text x="42" y="268" fill="#a4a9b2" font-size="13">her dancing is so clean, and she has</text>
    <text x="42" y="289" fill="#a4a9b2" font-size="13">this cool-but-playful vibe i really like.</text>

    <line x1="42" y1="310" x2="311" y2="310" stroke="#24282f" />
    <text x="42" y="327" fill="#666d77" font-size="10">just a tiny juun corner on my github ♡</text>
  </g>

  <!-- gallery surface -->
  <rect x="370" y="22" width="448" height="316" rx="14" fill="#0f1115" stroke="#24282f" />

  <g font-family="Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
    <text x="392" y="53" fill="#e5e7eb" font-size="12" font-weight="600">favorite frames</text>
    <text x="796" y="53" text-anchor="end" fill="#666d77" font-size="10">01 — 05</text>

    <line x1="392" y1="68" x2="796" y2="68" stroke="#24282f" />
  </g>

  ${avatars}

  <!-- small component-like labels -->
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9">
    <rect x="390" y="314" width="74" height="18" rx="6" fill="#15181d" stroke="#292d34" />
    <text x="427" y="326.5" text-anchor="middle" fill="#777e88">FRAGMENT 01</text>

    <rect x="704" y="314" width="94" height="18" rx="6" fill="#15181d" stroke="#292d34" />
    <text x="751" y="326.5" text-anchor="middle" fill="#777e88">JUUN GALLERY</text>
  </g>

  <rect x="370" y="337" width="448" height="1" fill="url(#accent)" opacity="0.72" />
</svg>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, svg.trimStart(), "utf8");

console.log(`generated assets/my-bias.svg using ${photos.length} Juun photo(s)`);
