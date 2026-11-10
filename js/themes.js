// Visual identity system for Terrible Little Lives
// 7 Handcrafted modern themes inspired by BitLife clarity with gothic atmosphere

const THEMES_DATA = [
  {
    id: 'morgue-ledger',
    name: 'Morgue Ledger',
    mode: 'dark',
    tag: 'Gothic Dark',
    desc: 'Charcoal rooms, dried-blood accents, and tarnished brass.',
    themeColor: '#0b0b0d',
    swatches: ['#0b0b0d', '#1a171d', '#991b1b'],
    cssVars: {
      '--bg-app': '#0b0b0d',
      '--bg-chassis': '#111014',
      '--bg-header': '#151318',
      '--bg-card': '#1a171d',
      '--bg-card-hover': '#242029',
      '--bg-input': '#131116',
      '--bg-track': '#29242d',
      '--border-main': '#3a333e',
      '--border-subtle': '#29242d',
      '--text-primary': '#eee7dc',
      '--text-muted': '#a59aa8',
      '--accent-primary': '#991b1b',
      '--accent-fiat': '#10b981',
      '--accent-fiat-bg': '#101a15',
      '--accent-shilling': '#f59e0b',
      '--accent-shilling-bg': '#1c170e',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'obsidian-amoled',
    name: 'Obsidian AMOLED',
    mode: 'dark',
    tag: 'OLED Minimal',
    desc: 'Pure deep black, crisp white text, and vivid BitLife neon accents.',
    themeColor: '#000000',
    swatches: ['#000000', '#16161a', '#f43f5e'],
    cssVars: {
      '--bg-app': '#000000',
      '--bg-chassis': '#09090b',
      '--bg-header': '#0f0f12',
      '--bg-card': '#16161a',
      '--bg-card-hover': '#222228',
      '--bg-input': '#09090b',
      '--bg-track': '#27272a',
      '--border-main': '#27272a',
      '--border-subtle': '#18181b',
      '--text-primary': '#f8fafc',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#f43f5e',
      '--accent-fiat': '#34d399',
      '--accent-fiat-bg': '#062b1a',
      '--accent-shilling': '#fbbf24',
      '--accent-shilling-bg': '#2a1d04',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'ashen-archive',
    name: 'Ashen Parchment',
    mode: 'light',
    tag: 'Warm Sepia',
    desc: 'Antique bone paper, dark espresso ink, and soft aged burgundy.',
    themeColor: '#f4eee3',
    swatches: ['#e8e1d3', '#faf6ee', '#852233'],
    cssVars: {
      '--bg-app': '#e8e1d3',
      '--bg-chassis': '#f4eee3',
      '--bg-header': '#ede6d8',
      '--bg-card': '#faf6ee',
      '--bg-card-hover': '#eee6d6',
      '--bg-input': '#fffdf8',
      '--bg-track': '#dfd6c4',
      '--border-main': '#cfc3b0',
      '--border-subtle': '#ded4c2',
      '--text-primary': '#261e1b',
      '--text-muted': '#6e635f',
      '--accent-primary': '#852233',
      '--accent-fiat': '#047857',
      '--accent-fiat-bg': '#e3f2ec',
      '--accent-shilling': '#b45309',
      '--accent-shilling-bg': '#fef3c7',
      '--color-scheme': 'light'
    }
  },
  {
    id: 'abyssal-violet',
    name: 'Abyssal Violet',
    mode: 'dark',
    tag: 'Cosmic Occult',
    desc: 'Deep nocturnal purple, ethereal violet glows, and spectral cyan.',
    themeColor: '#0b0914',
    swatches: ['#0b0914', '#171226', '#8b5cf6'],
    cssVars: {
      '--bg-app': '#0b0914',
      '--bg-chassis': '#100d1c',
      '--bg-header': '#151124',
      '--bg-card': '#1a152e',
      '--bg-card-hover': '#261f42',
      '--bg-input': '#0f0b1a',
      '--bg-track': '#2d244d',
      '--border-main': '#3b2f63',
      '--border-subtle': '#261e40',
      '--text-primary': '#f3e8ff',
      '--text-muted': '#a89bc2',
      '--accent-primary': '#8b5cf6',
      '--accent-fiat': '#10b981',
      '--accent-fiat-bg': '#0d2019',
      '--accent-shilling': '#f59e0b',
      '--accent-shilling-bg': '#241808',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'verdant-crypt',
    name: 'Verdant Crypt',
    mode: 'dark',
    tag: 'Moss & Stone',
    desc: 'Subterranean crypt moss, spruce shadows, and weathered granite.',
    themeColor: '#07110e',
    swatches: ['#07110e', '#10221c', '#10b981'],
    cssVars: {
      '--bg-app': '#07110e',
      '--bg-chassis': '#0b1a15',
      '--bg-header': '#0f221c',
      '--bg-card': '#132b23',
      '--bg-card-hover': '#1c3d32',
      '--bg-input': '#0a1713',
      '--bg-track': '#204539',
      '--border-main': '#285446',
      '--border-subtle': '#19362d',
      '--text-primary': '#ecfdf5',
      '--text-muted': '#94a9a0',
      '--accent-primary': '#10b981',
      '--accent-fiat': '#34d399',
      '--accent-fiat-bg': '#062b1a',
      '--accent-shilling': '#eab308',
      '--accent-shilling-bg': '#241c06',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'vampiric-velvet',
    name: 'Vampiric Velvet',
    mode: 'dark',
    tag: 'Noir & Rose',
    desc: 'Blackberry salon velvet, dusty rose, and champagne gold.',
    themeColor: '#0f070b',
    swatches: ['#0f070b', '#200f18', '#fb7185'],
    cssVars: {
      '--bg-app': '#0f070b',
      '--bg-chassis': '#170b12',
      '--bg-header': '#1e0e17',
      '--bg-card': '#27121e',
      '--bg-card-hover': '#381a2b',
      '--bg-input': '#14090f',
      '--bg-track': '#3d1c30',
      '--border-main': '#50263f',
      '--border-subtle': '#331728',
      '--text-primary': '#fff1f2',
      '--text-muted': '#b99da9',
      '--accent-primary': '#fb7185',
      '--accent-fiat': '#2dd4bf',
      '--accent-fiat-bg': '#0c2622',
      '--accent-shilling': '#fde047',
      '--accent-shilling-bg': '#292408',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'clinical-monolith',
    name: 'Clinical Monolith',
    mode: 'dark',
    tag: 'Forensic Slate',
    desc: 'Cold institutional steel, sterile sky-blue, and precise documentation.',
    themeColor: '#0b101b',
    swatches: ['#0b101b', '#131c2e', '#38bdf8'],
    cssVars: {
      '--bg-app': '#0b101b',
      '--bg-chassis': '#0f172a',
      '--bg-header': '#141e34',
      '--bg-card': '#1e293b',
      '--bg-card-hover': '#2a394f',
      '--bg-input': '#0f172a',
      '--bg-track': '#334155',
      '--border-main': '#475569',
      '--border-subtle': '#2c3b4f',
      '--text-primary': '#f8fafc',
      '--text-muted': '#94a3b8',
      '--accent-primary': '#38bdf8',
      '--accent-fiat': '#34d399',
      '--accent-fiat-bg': '#062b1a',
      '--accent-shilling': '#fbbf24',
      '--accent-shilling-bg': '#2a1d04',
      '--color-scheme': 'dark'
    }
  }
];

const FONTS_DATA = [
  {
    id: 'game-gothic', name: 'Game Font', tag: 'Cinzel + Inter', category: 'signature',
    desc: 'Gothic serif headings with crisp reading text.',
    heading: "'Cinzel', serif", body: "'Inter', sans-serif"
  },
  {
    id: 'device-system', name: 'Device Font', tag: 'System Native', category: 'system',
    desc: 'Your device typeface throughout the game.',
    heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
];

const LEGACY_LIGHT_THEMES = new Set([
  'antique-grimoire', 'clinical-alabaster', 'victorian-fog', 'solar-relic',
  'blossom-haze', 'matcha-cream', 'celestial-cloud'
]);

function getActiveThemeId() {
  try {
    const saved = localStorage.getItem('TLL_THEME');
    if (THEMES_DATA.some(theme => theme.id === saved)) return saved;
    if (LEGACY_LIGHT_THEMES.has(saved)) return 'ashen-archive';
  } catch (e) {}
  return 'morgue-ledger';
}

function applyTheme(themeId) {
  const requested = THEMES_DATA.find(theme => theme.id === themeId);
  const theme = requested || THEMES_DATA.find(theme => theme.id === getActiveThemeId()) || THEMES_DATA[0];
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-mode', theme.mode);
  Object.entries(theme.cssVars).forEach(([property, value]) => root.style.setProperty(property, value));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.themeColor);
  try { localStorage.setItem('TLL_THEME', theme.id); } catch (e) {}
}

function initThemeSystem() { applyTheme(getActiveThemeId()); }

function getTextSize() {
  try {
    const saved = localStorage.getItem('TLL_TEXT_SIZE');
    if (['small', 'normal', 'large', 'huge'].includes(saved)) return saved;
  } catch (e) {}
  return 'normal';
}

function applyTextSize(size) {
  const nextSize = ['small', 'normal', 'large', 'huge'].includes(size) ? size : 'normal';
  document.documentElement.setAttribute('data-text-size', nextSize);
  try { localStorage.setItem('TLL_TEXT_SIZE', nextSize); } catch (e) {}
}

function getSavedFont() {
  try {
    const saved = localStorage.getItem('TLL_FONT_FAMILY');
    if (FONTS_DATA.some(font => font.id === saved)) return saved;
  } catch (e) {}
  return 'game-gothic';
}

function applyFont(fontId) {
  const font = FONTS_DATA.find(item => item.id === fontId) || FONTS_DATA[0];
  const root = document.documentElement;
  root.setAttribute('data-font', font.id);
  root.style.setProperty('--font-heading', font.heading);
  root.style.setProperty('--font-body', font.body);
  try { localStorage.setItem('TLL_FONT_FAMILY', font.id); } catch (e) {}
}

initThemeSystem();
applyTextSize(getTextSize());
applyFont(getSavedFont());

window.THEMES_DATA = THEMES_DATA;
window.getActiveThemeId = getActiveThemeId;
window.applyTheme = applyTheme;
window.initThemeSystem = initThemeSystem;
window.getTextSize = getTextSize;
window.applyTextSize = applyTextSize;
window.FONTS_DATA = FONTS_DATA;
window.getSavedFont = getSavedFont;
window.applyFont = applyFont;
