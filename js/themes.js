// Theme Management Engine for Terrible Little Lives
// Supports 8 curated themes (4 Dark, 4 Light) with instant switching and persistence

const THEMES_DATA = [
  // --- Dark Themes ---
  {
    id: 'void-noir',
    name: 'Void Noir',
    mode: 'dark',
    tag: 'Gothic Noir',
    desc: 'Obsidian rain, leaden stone, and cold crimson blood.',
    themeColor: '#0f1013',
    swatches: ['#08090b', '#181a1f', '#991b1b'],
    cssVars: {
      '--bg-app': '#08090b',
      '--bg-chassis': '#0f1013',
      '--bg-header': '#14161a',
      '--bg-card': '#181a1f',
      '--bg-card-hover': '#20232a',
      '--bg-input': '#121418',
      '--bg-track': '#1e2128',
      '--border-main': '#262930',
      '--border-subtle': '#1f2229',
      '--text-primary': '#e2ded4',
      '--text-muted': '#8c8f9a',
      '--accent-primary': '#991b1b',
      '--accent-fiat': '#10b981',
      '--accent-fiat-bg': '#101411',
      '--accent-shilling': '#f59e0b',
      '--accent-shilling-bg': '#16120d',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    mode: 'dark',
    tag: 'Midnight Sci-Fi',
    desc: 'Deep midnight navy, phosphor cyan, and electric magenta.',
    themeColor: '#0a0f1d',
    swatches: ['#050811', '#111a2e', '#06b6d4'],
    cssVars: {
      '--bg-app': '#050811',
      '--bg-chassis': '#0a0f1d',
      '--bg-header': '#0e1629',
      '--bg-card': '#111a2e',
      '--bg-card-hover': '#18243e',
      '--bg-input': '#0c1322',
      '--bg-track': '#1b2845',
      '--border-main': '#1e2c48',
      '--border-subtle': '#162238',
      '--text-primary': '#e0f2fe',
      '--text-muted': '#7dd3fc',
      '--accent-primary': '#06b6d4',
      '--accent-fiat': '#10b981',
      '--accent-fiat-bg': '#071714',
      '--accent-shilling': '#ec4899',
      '--accent-shilling-bg': '#1b0a17',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'abyssal-crypt',
    name: 'Abyssal Crypt',
    mode: 'dark',
    tag: 'Eldritch Tomb',
    desc: 'Deep oceanic trench, mossy stone, and bioluminescent glow.',
    themeColor: '#071712',
    swatches: ['#040d0a', '#0e241d', '#10b981'],
    cssVars: {
      '--bg-app': '#040d0a',
      '--bg-chassis': '#071712',
      '--bg-header': '#0a1e17',
      '--bg-card': '#0e241d',
      '--bg-card-hover': '#143128',
      '--bg-input': '#091813',
      '--bg-track': '#173b30',
      '--border-main': '#1a4738',
      '--border-subtle': '#123429',
      '--text-primary': '#d1fae5',
      '--text-muted': '#6ee7b7',
      '--accent-primary': '#10b981',
      '--accent-fiat': '#34d399',
      '--accent-fiat-bg': '#081c15',
      '--accent-shilling': '#fbbf24',
      '--accent-shilling-bg': '#191509',
      '--color-scheme': 'dark'
    }
  },
  {
    id: 'blood-manor',
    name: 'Blood Manor',
    mode: 'dark',
    tag: 'Vampiric Velvet',
    desc: 'Deep burgundy velvet, antique gold, and blackened rose.',
    themeColor: '#180a0f',
    swatches: ['#0d0507', '#261017', '#e11d48'],
    cssVars: {
      '--bg-app': '#0d0507',
      '--bg-chassis': '#180a0f',
      '--bg-header': '#200e14',
      '--bg-card': '#261017',
      '--bg-card-hover': '#33161f',
      '--bg-input': '#1b0b11',
      '--bg-track': '#3b1622',
      '--border-main': '#481926',
      '--border-subtle': '#36131c',
      '--text-primary': '#fce7f3',
      '--text-muted': '#f472b6',
      '--accent-primary': '#e11d48',
      '--accent-fiat': '#10b981',
      '--accent-fiat-bg': '#120d10',
      '--accent-shilling': '#f59e0b',
      '--accent-shilling-bg': '#1f1308',
      '--color-scheme': 'dark'
    }
  },

  // --- Light Themes ---
  {
    id: 'antique-grimoire',
    name: 'Antique Grimoire',
    mode: 'light',
    tag: 'Vellum & Ink',
    desc: 'Weathered linen, aged parchment, and dried iron gall ink.',
    themeColor: '#f4ede0',
    swatches: ['#eae3d2', '#fbf8f1', '#881337'],
    cssVars: {
      '--bg-app': '#eae3d2',
      '--bg-chassis': '#f4ede0',
      '--bg-header': '#ece4d5',
      '--bg-card': '#fbf8f1',
      '--bg-card-hover': '#f0ebd8',
      '--bg-input': '#ffffff',
      '--bg-track': '#ded5c2',
      '--border-main': '#d4c7b2',
      '--border-subtle': '#e2d7c5',
      '--text-primary': '#1c1917',
      '--text-muted': '#57534e',
      '--accent-primary': '#881337',
      '--accent-fiat': '#047857',
      '--accent-fiat-bg': '#e6f4ea',
      '--accent-shilling': '#b45309',
      '--accent-shilling-bg': '#fef3c7',
      '--color-scheme': 'light'
    }
  },
  {
    id: 'clinical-alabaster',
    name: 'Clinical Alabaster',
    mode: 'light',
    tag: 'Sterile Minimal',
    desc: 'Surgical white, cool concrete grey, and cobalt accents.',
    themeColor: '#f3f4f6',
    swatches: ['#e5e7eb', '#ffffff', '#2563eb'],
    cssVars: {
      '--bg-app': '#e5e7eb',
      '--bg-chassis': '#f3f4f6',
      '--bg-header': '#ebecee',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f9fafb',
      '--bg-input': '#ffffff',
      '--bg-track': '#e2e5e9',
      '--border-main': '#cbd2dc',
      '--border-subtle': '#dbe0e8',
      '--text-primary': '#0f172a',
      '--text-muted': '#475569',
      '--accent-primary': '#2563eb',
      '--accent-fiat': '#059669',
      '--accent-fiat-bg': '#ecfdf5',
      '--accent-shilling': '#d97706',
      '--accent-shilling-bg': '#fffbeb',
      '--color-scheme': 'light'
    }
  },
  {
    id: 'victorian-fog',
    name: 'Victorian Fog',
    mode: 'light',
    tag: 'Morning Mist',
    desc: 'Soft dawn pewter, cool cobblestone grey, and pale amethyst.',
    themeColor: '#eceef2',
    swatches: ['#d8dade', '#f8f9fc', '#7c3aed'],
    cssVars: {
      '--bg-app': '#d8dade',
      '--bg-chassis': '#eceef2',
      '--bg-header': '#e3e6ec',
      '--bg-card': '#f8f9fc',
      '--bg-card-hover': '#edf0f7',
      '--bg-input': '#ffffff',
      '--bg-track': '#d7dce5',
      '--border-main': '#c2c8d4',
      '--border-subtle': '#d0d5e0',
      '--text-primary': '#1e2229',
      '--text-muted': '#525866',
      '--accent-primary': '#7c3aed',
      '--accent-fiat': '#0d9488',
      '--accent-fiat-bg': '#f0fdfa',
      '--accent-shilling': '#ca8a04',
      '--accent-shilling-bg': '#fefce8',
      '--color-scheme': 'light'
    }
  },
  {
    id: 'solar-relic',
    name: 'Solar Relic',
    mode: 'light',
    tag: 'Gilded Dune',
    desc: 'Sun-warmed stucco, desert sands, and terracotta bronze.',
    themeColor: '#eee7dc',
    swatches: ['#e4dacb', '#faf6f0', '#b45309'],
    cssVars: {
      '--bg-app': '#e4dacb',
      '--bg-chassis': '#eee7dc',
      '--bg-header': '#e6ded1',
      '--bg-card': '#faf6f0',
      '--bg-card-hover': '#f2ebe0',
      '--bg-input': '#ffffff',
      '--bg-track': '#dfd3c1',
      '--border-main': '#cdc0ad',
      '--border-subtle': '#dbcfbe',
      '--text-primary': '#292119',
      '--text-muted': '#6b5b4e',
      '--accent-primary': '#b45309',
      '--accent-fiat': '#0f766e',
      '--accent-fiat-bg': '#f0fdf4',
      '--accent-shilling': '#c2410c',
      '--accent-shilling-bg': '#fff7ed',
      '--color-scheme': 'light'
    }
  }
];

// Helper Functions
function getActiveThemeId() {
  const saved = localStorage.getItem('TLL_THEME');
  if (saved && THEMES_DATA.some(t => t.id === saved)) {
    return saved;
  }
  return 'void-noir';
}

function applyTheme(themeId) {
  const theme = THEMES_DATA.find(t => t.id === themeId) || THEMES_DATA[0];
  const root = document.documentElement;

  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-mode', theme.mode);

  // Apply all CSS variables
  for (const [prop, val] of Object.entries(theme.cssVars)) {
    root.style.setProperty(prop, val);
  }

  // Update browser theme meta
  let meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme.themeColor);
  }

  localStorage.setItem('TLL_THEME', theme.id);
}

function initThemeSystem() {
  const activeId = getActiveThemeId();
  applyTheme(activeId);
}

function getTextSize() {
  try {
    const saved = localStorage.getItem('TLL_TEXT_SIZE');
    if (['small', 'normal', 'large', 'huge'].includes(saved)) return saved;
  } catch (e) {}
  return 'normal';
}

function applyTextSize(size) {
  const s = ['small', 'normal', 'large', 'huge'].includes(size) ? size : 'normal';
  document.documentElement.setAttribute('data-text-size', s);
  try {
    localStorage.setItem('TLL_TEXT_SIZE', s);
  } catch (e) {}
}

// Auto-run on script load to avoid FOUC & unstyled text scale
initThemeSystem();
applyTextSize(getTextSize());

window.THEMES_DATA = THEMES_DATA;
window.getActiveThemeId = getActiveThemeId;
window.applyTheme = applyTheme;
window.initThemeSystem = initThemeSystem;
window.getTextSize = getTextSize;
window.applyTextSize = applyTextSize;
