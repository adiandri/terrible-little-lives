const AVATAR_V2_OPTIONS = {
  skin: {
    warm: { label: 'Warm Umber', colors: ['#d99a75', '#b9694e', '#713b35'] },
    ivory: { label: 'Muted Ivory', colors: ['#f2d3bd', '#d2a386', '#8c5d52'] },
    deep: { label: 'Deep Mahogany', colors: ['#9b654f', '#704235', '#3a2425'] }
  },
  face: {
    heart: { label: 'Heart', path: 'M166 124c22-45 67-68 116-60 51 8 83 51 78 110l-8 89c-4 44-29 84-69 107-17 10-37 10-54 0-42-24-66-64-70-108l-7-83c-2-20 3-39 14-55Z' },
    oval: { label: 'Oval', path: 'M166 125c21-45 66-68 115-61 52 8 84 50 80 108l-7 91c-4 50-34 94-72 110-17 7-35 7-52 0-39-17-67-61-71-111l-7-82c-2-20 3-40 14-55Z' }
  },
  eyes: {
    almond: { label: 'Almond', scaleY: .84 },
    hooded: { label: 'Hooded', scaleY: .68 }
  },
  hair: {
    sidePart: {
      label: 'Sculpted Side Part',
      colors: ['#3b3038', '#17141a', '#07070a'],
      svg: `<path d="M151 210c-14-55-2-111 40-144 42-34 111-31 151 5 32 29 39 79 20 135-4-48-19-76-49-98-26 22-71 40-132 46-8 16-13 35-15 57Z" fill="url(#hair)"/><path d="M177 158c13-74 71-103 137-59-47 15-77 39-137 59Z" fill="#5a4552" opacity=".28"/><path d="M154 186c-8 68 0 130 42 171-16-10-34-25-47-47-19-33-22-85 5-124Zm204-8c15 64 9 135-37 180 21-10 43-28 55-53 17-36 11-92-18-127Z" fill="#0a090d"/><path d="M183 106c32-25 77-35 118-14" fill="none" stroke="#806070" stroke-opacity=".33" stroke-width="10" stroke-linecap="round"/>`
    },
    bob: {
      label: 'Velvet Bob',
      colors: ['#4a2932', '#241119', '#0c070a'],
      svg: `<path d="M154 215c-17-57-2-118 43-148 44-29 109-25 148 13 31 30 35 81 16 136-8-44-23-78-50-101-32 22-75 35-132 39-8 18-11 38-12 61Z" fill="url(#hair)"/><path d="M154 187c-17 69-9 145 35 184l45-27c-37-39-48-94-45-192Zm203-3c17 70 8 148-37 187l-43-29c37-38 48-94 44-193Z" fill="#10090d"/><path d="M181 117c39-41 94-48 139-13" fill="none" stroke="#8c5060" stroke-opacity=".28" stroke-width="12" stroke-linecap="round"/>`
    },
    crown: {
      label: 'Coiled Crown',
      colors: ['#443429', '#211812', '#090705'],
      svg: `<path d="M154 211c-22-57-4-119 36-149 44-33 116-34 158 8 33 33 38 86 13 143-6-49-23-81-51-103-35 23-78 37-130 42-9 17-13 37-14 59Z" fill="url(#hair)"/><g fill="none" stroke="#614b3b" stroke-width="13" stroke-linecap="round" opacity=".72"><path d="M174 120c5-34 37-51 63-30"/><path d="M221 86c15-25 55-27 73 0"/><path d="M282 89c27-16 55 8 52 37"/><path d="M162 153c-11-27 13-50 39-45"/><path d="M319 116c30-4 47 24 34 50"/></g><path d="M157 180c-12 67-3 137 39 176-19-8-38-27-49-54-14-35-14-80 10-122Zm199-3c15 64 8 136-35 180 22-10 41-29 51-55 14-37 8-84-16-125Z" fill="#0b0806"/>`
    }
  },
  outfit: {
    uniform: { label: 'Mourning Uniform', coat: ['#272b36', '#11131a', '#07080c'], accent: '#781b2b' },
    plum: { label: 'Plum Formalwear', coat: ['#4b293e', '#261420', '#10090e'], accent: '#c4914c' }
  },
  marking: {
    freckles: { label: 'Freckles', display: true, opacity: 1 },
    scar: { label: 'Cheek Scar', display: true, opacity: .82 },
    none: { label: 'Clear', display: false, opacity: 0 }
  },
  accessory: {
    cameo: { label: 'Cameo', display: true, color: '#7d1c30' },
    amber: { label: 'Amber Cameo', display: true, color: '#a65c20' },
    none: { label: 'None', display: false, color: '#7d1c30' }
  }
};

const DEFAULT_AVATAR_V2 = {
  skin: 'warm', face: 'heart', eyes: 'almond', hair: 'sidePart',
  outfit: 'uniform', marking: 'freckles', accessory: 'cameo'
};

function setGradient(svg, id, colors) {
  const stops = svg.querySelectorAll(`#${id} stop`);
  stops.forEach((stop, index) => stop.setAttribute('stop-color', colors[index]));
}

function applyAvatarV2(svg, config = {}) {
  const value = { ...DEFAULT_AVATAR_V2, ...config };
  const skin = AVATAR_V2_OPTIONS.skin[value.skin];
  const face = AVATAR_V2_OPTIONS.face[value.face];
  const eyes = AVATAR_V2_OPTIONS.eyes[value.eyes];
  const hair = AVATAR_V2_OPTIONS.hair[value.hair];
  const outfit = AVATAR_V2_OPTIONS.outfit[value.outfit];
  const marking = AVATAR_V2_OPTIONS.marking[value.marking];
  const accessory = AVATAR_V2_OPTIONS.accessory[value.accessory];

  setGradient(svg, 'skin', skin.colors);
  setGradient(svg, 'neck', [skin.colors[1], skin.colors[2]]);
  setGradient(svg, 'hair', hair.colors);
  setGradient(svg, 'coat', outfit.coat);

  svg.querySelector('#layer-face > path').setAttribute('d', face.path);
  svg.querySelector('#layer-eyes').setAttribute('transform', `translate(256 218) scale(.78 ${eyes.scaleY}) translate(-256 -218)`);
  svg.querySelector('#layer-hair').innerHTML = hair.svg;
  svg.querySelector('#layer-markings').style.display = marking.display ? '' : 'none';
  svg.querySelector('#layer-markings').style.opacity = marking.opacity;
  svg.querySelector('#layer-neckwear').style.display = accessory.display ? '' : 'none';
  const cameo = svg.querySelector('#layer-neckwear ellipse:nth-of-type(2)');
  if (cameo) cameo.setAttribute('fill', accessory.color);
  svg.querySelectorAll('#layer-neckwear path').forEach(path => {
    if ((path.getAttribute('fill') || '').toLowerCase() === '#781b2b') path.setAttribute('fill', outfit.accent);
  });

  svg.dataset.avatarConfig = JSON.stringify(value);
  return svg;
}

async function loadAvatarV2(target, config = {}) {
  const response = await fetch('./canonical-portrait.svg');
  const source = await response.text();
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const svg = applyAvatarV2(doc.documentElement, config);
  target.replaceChildren(document.importNode(svg, true));
  return target.firstElementChild;
}

function randomAvatarV2Config() {
  const pick = key => {
    const values = Object.keys(AVATAR_V2_OPTIONS[key]);
    return values[Math.floor(Math.random() * values.length)];
  };
  return {
    skin: pick('skin'), face: pick('face'), eyes: pick('eyes'),
    hair: pick('hair'), outfit: pick('outfit'), marking: pick('marking'),
    accessory: pick('accessory')
  };
}

window.AVATAR_V2_OPTIONS = AVATAR_V2_OPTIONS;
window.DEFAULT_AVATAR_V2 = DEFAULT_AVATAR_V2;
window.loadAvatarV2 = loadAvatarV2;
window.randomAvatarV2Config = randomAvatarV2Config;
