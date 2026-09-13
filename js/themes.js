// Visual identity system for Terrible Little Lives
// One authored dark theme, one authored light theme, and two typography modes.

const THEMES_DATA = [
  {
    id: 'morgue-ledger', name: 'Morgue Ledger', mode: 'dark', tag: 'Dark',
    desc: 'Charcoal rooms, dried-blood accents, and tarnished brass.',
    themeColor: '#111014', swatches: ['#0b0b0d', '#1a171d', '#a52a3a'],
    cssVars: {
      '--bg-app': '#0b0b0d', '--bg-chassis': '#111014', '--bg-header': '#151318',
      '--bg-card': '#1a171d', '--bg-card-hover': '#242029', '--bg-input': '#131116',
      '--bg-track': '#29242d', '--border-main': '#3a333e', '--border-subtle': '#29242d',
      '--text-primary': '#eee7dc', '--text-muted': '#a59aa8', '--accent-primary': '#a52a3a',
      '--accent-fiat': '#65a981', '--accent-fiat-bg': '#101a15',
      '--accent-shilling': '#c69b4b', '--accent-shilling-bg': '#1c170e', '--color-scheme': 'dark'
    }
  },
  {
    id: 'ashen-archive', name: 'Ashen Archive', mode: 'light', tag: 'Light',
    desc: 'Bone paper, funeral ink, and restrained old burgundy.',
    themeColor: '#eee9df', swatches: ['#d8d1c5', '#f8f4ec', '#8f2434'],
    cssVars: {
      '--bg-app': '#d8d1c5', '--bg-chassis': '#eee9df', '--bg-header': '#e5ded2',
      '--bg-card': '#f8f4ec', '--bg-card-hover': '#eee6da', '--bg-input': '#fffaf0',
      '--bg-track': '#d8cec0', '--border-main': '#c9bcaa', '--border-subtle': '#ded4c6',
      '--text-primary': '#292326', '--text-muted': '#6f6668', '--accent-primary': '#8f2434',
      '--accent-fiat': '#2f7d5b', '--accent-fiat-bg': '#e2eee7',
      '--accent-shilling': '#956820', '--accent-shilling-bg': '#f3e8cf', '--color-scheme': 'light'
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
