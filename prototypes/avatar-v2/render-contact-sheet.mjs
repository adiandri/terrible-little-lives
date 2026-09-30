import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = new URL('./', import.meta.url);
const canonical = await fs.readFile(new URL('canonical-portrait.svg', root), 'utf8');
const engineSource = await fs.readFile(new URL('avatar-v2-engine.js', root), 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(`${engineSource}\nwindow.__contactSheetOptions = AVATAR_V2_OPTIONS;`, sandbox);
const options = sandbox.window.__contactSheetOptions;

function replaceGradient(svg, name, colors) {
  const keys = name === 'skin' ? ['skin-light', 'skin-mid', 'skin-dark']
    : name === 'hair' ? ['hair-light', 'hair-mid', 'hair-dark']
    : ['coat-light', 'coat-mid', 'coat-dark'];
  keys.forEach((key, index) => {
    svg = svg.replace(new RegExp(`(data-color="${key}"[^>]*stop-color=")[^"]+`), `$1${colors[index]}`);
  });
  return svg;
}

function replaceLayer(svg, id, nextId, inner) {
  const pattern = new RegExp(`  <g id="${id}"[\\s\\S]*?(?=\\n  <g id="${nextId}")`);
  return svg.replace(pattern, `  <g id="${id}">\n    ${inner}\n  </g>`);
}

function makePortrait(config) {
  const skin = options.skin[config.skin];
  const face = options.face[config.face];
  const eyes = options.eyes[config.eyes];
  const hair = options.hair[config.hair];
  const outfit = options.outfit[config.outfit];
  const marking = options.marking[config.marking];
  const accessory = options.accessory[config.accessory];
  let svg = canonical;

  svg = replaceGradient(svg, 'skin', skin.colors);
  svg = svg.replace(/(<linearGradient id="neck"[\s\S]*?<stop[^>]*stop-color=")[^"]+/, `$1${skin.colors[1]}`);
  svg = svg.replace(/(<linearGradient id="neck"[\s\S]*?<stop[^>]*offset="1"[^>]*stop-color=")[^"]+/, `$1${skin.colors[2]}`);
  svg = replaceGradient(svg, 'hair', hair.colors);
  svg = replaceGradient(svg, 'coat', outfit.coat);
  svg = svg.replace(/(data-color="ear-light"[^>]*fill=")[^"]+/, `$1${skin.colors[1]}`);
  svg = svg.replace(/(data-color="ear-dark"[^>]*fill=")[^"]+/, `$1${skin.colors[2]}`);
  svg = svg.replaceAll(/(data-color="ear-line"[^>]*stroke=")[^"]+/g, `$1${skin.colors[2]}`);
  svg = svg.replace(/(<g id="layer-face">\s*<path d=")[^"]+/, `$1${face.path}`);
  svg = svg.replace(/(<g id="layer-eyes" transform=")[^"]+/, `$1translate(256 218) scale(.78 ${eyes.scaleY}) translate(-256 -218)`);
  svg = replaceLayer(svg, 'layer-hair', 'layer-markings', hair.svg);

  if (!marking.kind) {
    svg = svg.replace('<g id="layer-markings">', '<g id="layer-markings" style="display:none">');
  } else if (marking.kind === 'freckles') {
    svg = svg.replace('<path data-marking="scar"', '<path data-marking="scar" style="display:none"');
  } else {
    svg = svg.replace('<g data-marking="freckles">', '<g data-marking="freckles" style="display:none">');
  }

  if (!accessory.display) {
    svg = svg.replace('<g id="layer-neckwear">', '<g id="layer-neckwear" style="display:none">');
  } else {
    svg = svg.replace(/(<ellipse cx="256" cy="383" rx="8" ry="11" fill=")[^"]+/, `$1${accessory.color}`);
  }
  svg = svg.replaceAll('fill="#781b2b"', `fill="${outfit.accent}"`);
  return svg;
}

const skin = Object.keys(options.skin);
const face = Object.keys(options.face);
const eyes = Object.keys(options.eyes);
const hair = Object.keys(options.hair);
const outfit = Object.keys(options.outfit);
const marking = Object.keys(options.marking);
const accessory = Object.keys(options.accessory);

const configs = Array.from({ length: 24 }, (_, index) => ({
  skin: skin[index % skin.length],
  face: face[Math.floor(index / 3) % face.length],
  eyes: eyes[Math.floor(index / 6) % eyes.length],
  hair: hair[(index * 2 + Math.floor(index / 3)) % hair.length],
  outfit: outfit[Math.floor(index / 4) % outfit.length],
  marking: marking[(index + Math.floor(index / 4)) % marking.length],
  accessory: accessory[(index * 2 + Math.floor(index / 5)) % accessory.length]
}));

const columns = 4;
const cellWidth = 300;
const cellHeight = 342;
const rows = Math.ceil(configs.length / columns);
const composites = [];

for (let index = 0; index < configs.length; index += 1) {
  const config = configs[index];
  const image = await sharp(Buffer.from(makePortrait(config))).resize(280, 280).png().toBuffer();
  const label = `${index + 1}. ${options.skin[config.skin].label} · ${options.face[config.face].label}\n${options.hair[config.hair].label} · ${options.outfit[config.outfit].label}\n${options.marking[config.marking].label} · ${options.accessory[config.accessory].label}`;
  const [lineOne, lineTwo, lineThree] = label.split('\n');
  const text = Buffer.from(`<svg width="280" height="62" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:Arial,sans-serif;fill:#d7d1c8;font-size:12px}.sub{fill:#918d96;font-size:11px}</style><text x="8" y="16">${lineOne}</text><text class="sub" x="8" y="34">${lineTwo}</text><text class="sub" x="8" y="51">${lineThree}</text></svg>`);
  const left = (index % columns) * cellWidth + 10;
  const top = Math.floor(index / columns) * cellHeight + 10;
  composites.push({ input: image, left, top }, { input: text, left, top: top + 280 });
}

await sharp({
  create: { width: columns * cellWidth, height: rows * cellHeight, channels: 4, background: '#0b0c10' }
}).composite(composites).png().toFile(fileURLToPath(new URL('contact-sheet.png', root)));

console.log(`Rendered ${configs.length} portraits to prototypes/avatar-v2/contact-sheet.png`);
