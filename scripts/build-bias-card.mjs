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
  .slice(0, 6);

const positions = [
  { x: 470, y: 112, r: 64 },
  { x: 615, y: 102, r: 55 },
  { x: 735, y: 155, r: 49 },
  { x: 510, y: 245, r: 52 },
  { x: 640, y: 235, r: 61 },
  { x: 755, y: 265, r: 44 },
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

const clips = positions
  .map(
    (p, i) => `
    <clipPath id="clip-${i}">
      <circle cx="${p.x}" cy="${p.y}" r="${p.r}" />
    </clipPath>`,
  )
  .join("");

const circles = positions
  .map((p, i) => {
    const hasPhoto = Boolean(photos[i]);
    const image = hasPhoto
      ? `<image href="${dataUri(photos[i])}" x="${p.x - p.r}" y="${p.y - p.r}" width="${p.r * 2}" height="${p.r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${i})" />`
      : `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="#101722" />
         <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" fill="#8d99ad" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12">PHOTO ${String(i + 1).padStart(2, "0")}</text>`;

    return `
      <g>
        <circle cx="${p.x}" cy="${p.y}" r="${p.r + 7}" fill="url(#ring-${i % 3})" opacity="0.92" />
        <circle cx="${p.x}" cy="${p.y}" r="${p.r + 3}" fill="#0d1117" />
        ${image}
        <circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="none" stroke="#ffffff" stroke-opacity="0.16" />
      </g>`;
  })
  .join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="840" height="350" viewBox="0 0 840 350" role="img" aria-labelledby="title desc">
  <title id="title">my bias &lt;3</title>
  <desc id="desc">A dreamy Hearts2Hearts Style-inspired bias gallery for the andhikamarcella profile README.</desc>

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101722" />
      <stop offset="44%" stop-color="#101820" />
      <stop offset="72%" stop-color="#13241f" />
      <stop offset="100%" stop-color="#19172c" />
    </linearGradient>
    <linearGradient id="border" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#59a8ff" />
      <stop offset="38%" stop-color="#9f8dff" />
      <stop offset="70%" stop-color="#ff9fd2" />
      <stop offset="100%" stop-color="#79e4cf" />
    </linearGradient>
    <linearGradient id="ring-0"><stop stop-color="#7ec7ff"/><stop offset="1" stop-color="#d2a8ff"/></linearGradient>
    <linearGradient id="ring-1"><stop stop-color="#ffafd7"/><stop offset="1" stop-color="#9fc7ff"/></linearGradient>
    <linearGradient id="ring-2"><stop stop-color="#9be9dc"/><stop offset="1" stop-color="#d7abff"/></linearGradient>
    <radialGradient id="glow-blue"><stop stop-color="#4ea5ff" stop-opacity=".24"/><stop offset="1" stop-color="#4ea5ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow-pink"><stop stop-color="#ff8fcb" stop-opacity=".17"/><stop offset="1" stop-color="#ff8fcb" stop-opacity="0"/></radialGradient>
    ${clips}
  </defs>

  <rect x="1" y="1" width="838" height="348" rx="27" fill="url(#bg)" stroke="url(#border)" stroke-width="1.5" />
  <circle cx="120" cy="35" r="175" fill="url(#glow-blue)" />
  <circle cx="720" cy="320" r="180" fill="url(#glow-pink)" />

  <rect x="34" y="31" width="116" height="29" rx="14.5" fill="#ffffff" fill-opacity=".035" stroke="#a6bdff" stroke-opacity=".65" />
  <text x="92" y="50" text-anchor="middle" fill="#bac8e5" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" letter-spacing="2">BIAS.LOG</text>

  <text x="38" y="126" fill="#f7eaff" font-family="Georgia, serif" font-weight="700" font-size="49">my bias &lt;3</text>
  <text x="41" y="161" fill="#9acbff" font-family="Georgia, serif" font-style="italic" font-size="22">Style ♡</text>

  <text x="40" y="207" fill="#9ca7b8" font-family="Arial, sans-serif" font-size="14">you, me, and our</text>
  <text x="40" y="229" fill="#d5dbe5" font-family="Arial, sans-serif" font-size="14">perfect little style ♡</text>

  <g font-family="Arial, sans-serif" font-size="10">
    <rect x="39" y="266" width="66" height="26" rx="13" fill="#ffffff" fill-opacity=".035" stroke="#f39ccd" stroke-opacity=".76" />
    <text x="72" y="283" text-anchor="middle" fill="#f7b6db">H2H ♡</text>
    <rect x="114" y="266" width="63" height="26" rx="13" fill="#ffffff" fill-opacity=".035" stroke="#9dbaff" stroke-opacity=".76" />
    <text x="145" y="283" text-anchor="middle" fill="#b8caff">STYLE</text>
    <rect x="186" y="266" width="77" height="26" rx="13" fill="#ffffff" fill-opacity=".035" stroke="#cfa6ff" stroke-opacity=".76" />
    <text x="224" y="283" text-anchor="middle" fill="#d8bfff">DREAMY</text>
  </g>

  <g fill="#d7c5ff" font-family="Arial, sans-serif">
    <text x="337" y="72" font-size="18">✦</text>
    <text x="790" y="66" font-size="14">✧</text>
    <text x="384" y="188" font-size="11">✦</text>
    <text x="798" y="230" font-size="17">✦</text>
    <text x="325" y="319" font-size="14">✧</text>
  </g>
  <g fill="#f7afd5" font-family="Arial, sans-serif">
    <text x="402" y="43" font-size="13">♥</text>
    <text x="664" y="50" font-size="14">♡</text>
    <text x="810" y="158" font-size="14">♡</text>
  </g>

  ${circles}

  <text x="40" y="324" fill="#697586" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" letter-spacing="1.5">HEARTS / FAVORITES / MEMORY</text>
</svg>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, svg.trimStart(), "utf8");

console.log(`♡ generated assets/my-bias.svg using ${photos.length} photo(s)`);
