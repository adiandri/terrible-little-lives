// Layered Gothic SVG Portrait Renderer for Terrible Little Lives
// Drop-in replacement for the procedural Canvas renderer:
// - Exposes window.buildGothicAvatarSvg(options) and window.drawGothicAvatar(target, options)
// - Preserves window.AVATAR_PALETTES and all 11+ call sites across game.js
// - Enforces trait-compatibility rules so hairstyles, bangs, headwear, age, and facial hair never clash

(function () {
  'use strict';

  const AVATAR_PALETTES = {
    skin: {
      porcelain: { base: '#f5ece3', shadow: '#d3c0ae', highlight: '#fdfaf6', blush: 'rgba(214, 136, 136, 0.24)' },
      ivory: { base: '#ebd6c3', shadow: '#c5a085', highlight: '#f8ece0', blush: 'rgba(210, 128, 124, 0.22)' },
      warm_beige: { base: '#d8b496', shadow: '#ad8262', highlight: '#edd1b9', blush: 'rgba(195, 112, 110, 0.22)' },
      golden_peach: { base: '#e2b48c', shadow: '#b87f51', highlight: '#f5d2b1', blush: 'rgba(205, 110, 100, 0.24)' },
      olive: { base: '#bba687', shadow: '#8d785a', highlight: '#d6c6ad', blush: 'rgba(168, 108, 98, 0.20)' },
      warm_bronze: { base: '#a67852', shadow: '#754a29', highlight: '#c69b75', blush: 'rgba(155, 82, 72, 0.22)' },
      chestnut: { base: '#7e4e2b', shadow: '#4f280d', highlight: '#a16b45', blush: 'rgba(130, 52, 52, 0.22)' },
      rich_espresso: { base: '#54331f', shadow: '#2f1609', highlight: '#764b31', blush: 'rgba(102, 38, 38, 0.22)' },
      deep_ebony: { base: '#362218', shadow: '#1a0d07', highlight: '#52372a', blush: 'rgba(84, 30, 30, 0.22)' },
      ash: { base: '#b6b4ad', shadow: '#87857d', highlight: '#d2d0ca', blush: 'rgba(132, 122, 138, 0.18)' },
      sallow: { base: '#cdc49d', shadow: '#9f956b', highlight: '#e3dbb6', blush: 'rgba(156, 136, 102, 0.18)' },
      bruised: { base: '#a79cb1', shadow: '#7a6d86', highlight: '#c7bed0', blush: 'rgba(128, 74, 132, 0.24)' },
      mortuary: { base: '#cbd1d2', shadow: '#939b9d', highlight: '#e5eaeb', blush: 'rgba(112, 128, 142, 0.18)' }
    },
    eyes: {
      black: '#191717',
      dark_brown: '#3b2518',
      brown: '#5a3821',
      light_brown: '#82522f',
      hazel: '#7d6836',
      amber: '#b36d22',
      green: '#3c7247',
      olive_green: '#576839',
      blue: '#3b6c9b',
      gray: '#64727d',
      golden: '#cca029',
      violet: '#684589',
      albino_red: '#b8323e',
      ice_blue: '#78b5db',
      crimson: '#8e1b24',
      milky_blind: '#cfd6dc',
      emerald_glow: '#20a361',
      starburst: '#9c4d93'
    },
    hair: {
      raven: { base: '#18181b', shadow: '#0b0b0e', highlight: '#383842' },
      dark_brown: { base: '#33231a', shadow: '#1d130d', highlight: '#4d372c' },
      ash_brown: { base: '#4a3f37', shadow: '#2d241e', highlight: '#695a51' },
      chestnut: { base: '#5c321d', shadow: '#3a1c0e', highlight: '#7d4b31' },
      auburn: { base: '#6e2d1d', shadow: '#45170c', highlight: '#95432f' },
      ginger_red: { base: '#a84724', shadow: '#732a10', highlight: '#ce653e' },
      strawberry_blonde: { base: '#b57956', shadow: '#865032', highlight: '#d59874' },
      dark_blonde: { base: '#8f774e', shadow: '#624f30', highlight: '#b2986c' },
      golden_blonde: { base: '#bf9e5a', shadow: '#8c7037', highlight: '#dec07f' },
      platinum: { base: '#dedbd2', shadow: '#b0aca1', highlight: '#f6f4ed' },
      silver_gray: { base: '#8c8c91', shadow: '#616165', highlight: '#b5b5ba' },
      pure_white: { base: '#f0eff2', shadow: '#c3c2c7', highlight: '#ffffff' },
      pastel_pink: { base: '#d8869c', shadow: '#a8596f', highlight: '#f2abc0' },
      rose: { base: '#b84d69', shadow: '#852c44', highlight: '#dc738f' },
      peach: { base: '#d48064', shadow: '#a4563c', highlight: '#efa289' },
      crimson_dye: { base: '#99182c', shadow: '#640917', highlight: '#c8344c' },
      neon_orange: { base: '#c9591e', shadow: '#8e370a', highlight: '#ea7c43' },
      moss_green: { base: '#46673f', shadow: '#2a4324', highlight: '#678d5e' },
      teal: { base: '#2b7875', shadow: '#174d4b', highlight: '#469d9a' },
      deep_blue: { base: '#25447a', shadow: '#12254b', highlight: '#3f65aa' },
      royal_purple: { base: '#562f7a', shadow: '#34184f', highlight: '#7a4ba4' },
      lavender: { base: '#9a7cb8', shadow: '#6d508b', highlight: '#be9fda' },
      split_black_white: { base: '#18181b', alt: '#dedbd2', shadow: '#0b0b0e', highlight: '#3a3a42' }
    },
    clothing: {
      black: '#191a1e',
      charcoal: '#2d3036',
      navy: '#1d273a',
      burgundy: '#4d1b25',
      forest: '#1b3324',
      tweed_brown: '#4b3d32',
      cream: '#ded7ca',
      white: '#eae7e0',
      denim: '#39536e',
      school_maroon: '#5c1e28',
      school_navy: '#1b2a47',
      scrubs_teal: '#28696b',
      mustard: '#9b762b'
    }
  };

  let svgUidCounter = 0;

  // Enforce coherent trait rules so portraits never produce nonsensical combinations
  function normalizeAvatarOptions(raw = {}) {
    const age = raw.age !== undefined ? Number(raw.age) : 16;
    const gender = raw.gender || 'Non-binary';
    let hairStyle = raw.hairStyle || 'parted';
    let bangs = raw.bangs || 'none';
    let headwear = raw.headwear || 'none';
    let facialHair = raw.facialHair || 'clean';
    let piercing = raw.piercing || 'none';
    let necklace = raw.necklace || 'none';

    if (age < 13) {
      facialHair = 'clean';
      piercing = 'none';
      necklace = 'none';
    }
    if (hairStyle === 'hijab') {
      bangs = 'none';
      headwear = 'none';
    }
    if (hairStyle === 'buzz_cut') {
      bangs = 'none';
    }
    if (headwear !== 'none' && (hairStyle === 'space_buns' || hairStyle === 'messy_bun')) {
      hairStyle = 'parted';
    }

    return {
      skinKey: raw.skin || 'porcelain',
      eyeColorKey: raw.eyeColor || 'black',
      eyeShape: raw.eyeShape || 'almond',
      eyelid: raw.eyelid || 'double',
      eyeExtra: raw.eyeExtra || 'none',
      heterochromia: raw.heterochromia || null,
      hairColorKey: raw.hairColor || 'raven',
      hairStyle,
      hairTexture: raw.hairTexture || 'straight',
      bangs,
      faceShape: raw.faceShape || 'oval',
      noseStyle: raw.noseStyle || 'straight',
      lipsStyle: raw.lipsStyle || 'medium',
      eyebrow: raw.eyebrow || 'soft_arch',
      facialHair,
      mark: raw.mark || 'none',
      glasses: raw.glasses || 'none',
      headwear,
      clothing: raw.clothing || 'casual',
      clothingColor: raw.clothingColor || 'charcoal',
      piercing,
      necklace,
      age,
      gender
    };
  }

  function hexToRgba(hex, alpha) {
    if (!hex || hex[0] !== '#' || (hex.length !== 7 && hex.length !== 4)) return `rgba(0,0,0,${alpha})`;
    let r, g, b;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getFacePath(faceShape) {
    switch (faceShape) {
      case 'round':
        return 'M 55 92 C 54 60, 72 44, 100 44 C 128 44, 146 60, 145 92 C 145 124, 126 142, 100 143 C 74 142, 55 124, 55 92 Z';
      case 'square':
        return 'M 58 88 C 57 58, 72 44, 100 44 C 128 44, 143 58, 142 88 L 140 124 C 138 136, 120 142, 100 142 C 80 142, 62 136, 60 124 Z';
      case 'rectangle':
        return 'M 59 86 C 58 55, 73 41, 100 41 C 127 41, 142 55, 141 86 L 139 126 C 137 139, 118 145, 100 145 C 82 145, 63 139, 61 126 Z';
      case 'heart':
        return 'M 56 84 C 55 56, 73 43, 100 43 C 127 43, 145 56, 144 84 C 143 111, 122 135, 100 143 C 78 135, 57 111, 56 84 Z';
      case 'diamond':
        return 'M 60 80 C 62 56, 76 44, 100 44 C 124 44, 138 56, 140 80 L 145 97 C 144 114, 122 138, 100 144 C 78 138, 56 114, 55 97 Z';
      case 'triangle':
        return 'M 62 84 C 62 57, 76 44, 100 44 C 124 44, 138 57, 138 84 C 143 112, 138 134, 100 142 C 62 134, 57 112, 62 84 Z';
      case 'inverted_triangle':
        return 'M 55 82 C 55 56, 72 44, 100 44 C 128 44, 145 56, 145 82 C 141 112, 118 138, 100 145 C 82 138, 59 112, 55 82 Z';
      case 'oblong':
        return 'M 60 88 C 60 55, 74 41, 100 41 C 126 41, 140 55, 140 88 C 140 123, 123 145, 100 146 C 77 145, 60 123, 60 88 Z';
      case 'wide':
        return 'M 52 90 C 52 59, 71 44, 100 44 C 129 44, 148 59, 148 90 C 148 122, 126 141, 100 142 C 74 141, 52 122, 52 90 Z';
      case 'oval':
      default:
        return 'M 58 88 C 57 57, 73 43, 100 43 C 127 43, 143 57, 142 88 C 142 120, 123 141, 100 143 C 77 141, 58 120, 58 88 Z';
    }
  }

  function renderClothing(opts, col, uid) {
    const darkCol = hexToRgba('#000000', 0.34);
    const lightCol = hexToRgba('#ffffff', 0.14);
    const style = opts.clothing;
    const isHoodie = style === 'hoodie';
    const isTurtleneck = style === 'turtleneck';
    const isGoth = style === 'goth';
    const isSuit = style === 'suit' || style === 'prep_blazer' || style === 'elite_uniform';

    let extra = '';
    if (isTurtleneck) {
      extra = `
        <path d="M 80 142 Q 100 148 120 142 L 122 162 Q 100 168 78 162 Z" fill="${col}" stroke="${darkCol}" stroke-width="1"/>
        <path d="M 80 148 Q 100 153 120 148" fill="none" stroke="${darkCol}" stroke-width="0.9"/>
      `;
    } else if (isHoodie) {
      extra = `
        <path d="M 60 156 Q 76 140 100 145 Q 124 140 140 156 L 128 172 Q 100 166 72 172 Z" fill="${col}" stroke="${darkCol}" stroke-width="1.1"/>
        <line x1="88" y1="164" x2="87" y2="188" stroke="#d5cfc5" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="112" y1="164" x2="113" y2="188" stroke="#d5cfc5" stroke-width="1.6" stroke-linecap="round"/>
      `;
    } else if (isSuit) {
      const shirtFill = style === 'elite_uniform' ? '#e7e2d8' : '#f1ede5';
      const tieFill = style === 'prep_blazer' ? '#6d1e2b' : (style === 'elite_uniform' ? '#1e2738' : '#23242b');
      extra = `
        <polygon points="81,154 100,192 119,154" fill="${shirtFill}"/>
        <polygon points="96,158 104,158 103,194 100,198 97,194" fill="${tieFill}"/>
        <path d="M 74 155 L 92 186 L 82 188 L 66 164 Z" fill="${col}" stroke="${darkCol}" stroke-width="1"/>
        <path d="M 126 155 L 108 186 L 118 188 L 134 164 Z" fill="${col}" stroke="${darkCol}" stroke-width="1"/>
      `;
    } else if (isGoth) {
      extra = `
        <path d="M 76 154 Q 100 168 124 154 L 116 176 Q 100 182 84 176 Z" fill="#121116" stroke="rgba(255,255,255,0.12)" stroke-width="0.9"/>
        <path d="M 80 158 Q 100 170 120 158" fill="none" stroke="rgba(220,210,200,0.32)" stroke-width="1" stroke-dasharray="2.5 2"/>
        <circle cx="100" cy="171" r="2.8" fill="#6b1d2b" stroke="#9e8d5e" stroke-width="0.9"/>
      `;
    } else {
      extra = `
        <path d="M 80 154 Q 100 166 120 154" fill="none" stroke="${darkCol}" stroke-width="1.4"/>
        <path d="M 82 155 Q 100 165 118 155" fill="none" stroke="${lightCol}" stroke-width="0.9"/>
      `;
    }

    return `
      <g id="clothing-${uid}">
        <path d="M 28 202 C 32 170, 54 156, 80 153 L 120 153 C 146 156, 168 170, 172 202 Z" fill="${col}" stroke="${darkCol}" stroke-width="1.2"/>
        <path d="M 38 198 C 44 173, 62 162, 82 159" fill="none" stroke="${lightCol}" stroke-width="1.4" stroke-linecap="round"/>
        ${extra}
      </g>
    `;
  }

  function renderBackHair(opts, hairFill, hairShadow) {
    const style = opts.hairStyle;
    if (style === 'hijab') {
      return `
        <path d="M 42 96 C 40 44, 68 28, 100 28 C 132 28, 160 44, 158 96 C 160 142, 152 178, 138 198 L 62 198 C 48 178, 40 142, 42 96 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.3"/>
      `;
    }
    if (style === 'buzz_cut' || style === 'crop' || style === 'pixie') {
      return '';
    }
    if (style === 'space_buns') {
      return `
        <circle cx="56" cy="48" r="19" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.2"/>
        <circle cx="144" cy="48" r="19" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.2"/>
        <path d="M 46 46 Q 56 36 66 46" fill="none" stroke="${hairShadow}" stroke-width="1.1"/>
        <path d="M 134 46 Q 144 36 154 46" fill="none" stroke="${hairShadow}" stroke-width="1.1"/>
      `;
    }
    if (style === 'messy_bun') {
      return `
        <ellipse cx="100" cy="30" rx="22" ry="16" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.2"/>
        <path d="M 84 28 Q 100 20 116 28" fill="none" stroke="${hairShadow}" stroke-width="1.1"/>
      `;
    }
    if (style === 'bob' || style === 'short_bob') {
      const len = style === 'short_bob' ? 136 : 150;
      return `
        <path d="M 48 86 C 46 42, 72 28, 100 28 C 128 28, 154 42, 152 86 C 154 114, 150 ${len}, 136 ${len} L 64 ${len} C 50 ${len}, 46 114, 48 86 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.2"/>
      `;
    }
    if (style === 'braids' || style === 'box_braids' || style === 'dreadlocks') {
      const strandX = [50, 58, 142, 150];
      return strandX.map(x => `
        <path d="M ${x} 76 Q ${x + (x < 100 ? -3 : 3)} 130 ${x} 192" fill="none" stroke="${hairFill}" stroke-width="7.5" stroke-linecap="round"/>
        <path d="M ${x} 76 Q ${x + (x < 100 ? -3 : 3)} 130 ${x} 192" fill="none" stroke="${hairShadow}" stroke-width="1.3" stroke-dasharray="5 5"/>
      `).join('');
    }
    if (style === 'long' || style === 'loose_waves' || style === 'straight_long' || style === 'wolf_cut' || style === 'mullet' || style === 'shag') {
      const waveOffset = (style === 'loose_waves' || opts.hairTexture === 'wavy' || opts.hairTexture === 'curly') ? 7 : 0;
      return `
        <path d="M 46 86 C 44 40, 72 26, 100 26 C 128 26, 156 40, 154 86 C ${160 + waveOffset} 125, ${156 - waveOffset} 165, 148 198 L 52 198 C ${44 + waveOffset} 165, ${40 - waveOffset} 125, 46 86 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.2"/>
      `;
    }
    // Parted / medium default back silhouette
    return `
      <path d="M 52 84 C 50 44, 73 30, 100 30 C 127 30, 150 44, 148 84 C 149 102, 145 116, 138 124 L 62 124 C 55 116, 51 102, 52 84 Z" fill="${hairFill}"/>
    `;
  }

  function renderFrontHair(opts, hairFill, hairShadow, hairHighlight) {
    const style = opts.hairStyle;
    const bangs = opts.bangs;

    if (style === 'hijab') {
      return `
        <g>
          <path d="M 46 92 C 46 44, 70 30, 100 30 C 130 30, 154 44, 154 92 C 154 126, 138 152, 100 158 C 62 152, 46 126, 46 92 Z M 57 90 C 57 122, 74 142, 100 144 C 126 142, 143 122, 143 90 C 143 58, 126 46, 100 46 C 74 46, 57 58, 57 90 Z" fill="${hairFill}" fill-rule="evenodd" stroke="${hairShadow}" stroke-width="1.1"/>
          <path d="M 60 142 Q 100 164 140 142 Q 130 166 100 172 Q 70 166 60 142 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1.1"/>
          <path d="M 66 56 Q 100 44 134 56" fill="none" stroke="${hairHighlight}" stroke-width="1.1" opacity="0.55"/>
        </g>
      `;
    }

    if (style === 'buzz_cut') {
      return `
        <path d="M 56 84 C 55 50, 74 37, 100 37 C 126 37, 145 50, 144 84 C 140 66, 125 53, 100 53 C 75 53, 60 66, 56 84 Z" fill="${hairFill}" opacity="0.92"/>
      `;
    }

    let crown = `
      <path d="M 52 90 C 50 45, 73 29, 100 29 C 127 29, 150 45, 148 90 C 144 68, 130 55, 106 52 C 102 52, 99 54, 96 56 C 75 56, 59 68, 52 90 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1"/>
      <path d="M 70 43 Q 100 33 130 43" fill="none" stroke="${hairHighlight}" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    `;

    if (style === 'crop' || style === 'pixie') {
      crown = `
        <path d="M 54 84 C 53 46, 73 31, 100 31 C 127 31, 147 46, 146 84 C 140 66, 127 56, 100 55 C 73 56, 60 66, 54 84 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="1"/>
        <path d="M 76 54 Q 90 48 102 56 Q 116 49 128 56" fill="none" stroke="${hairHighlight}" stroke-width="1.2" opacity="0.45"/>
      `;
    }

    // Organic, soft-curved bangs (never flat rectangles or sharp triangles)
    let bangsSvg = '';
    if (bangs === 'straight') {
      bangsSvg = `
        <path d="M 59 66 C 64 46, 80 40, 100 40 C 120 40, 136 46, 141 66 C 129 63, 118 65, 108 64 C 102 63, 98 65, 90 64 C 78 65, 68 63, 59 66 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="0.9"/>
        <path d="M 72 56 Q 74 61 73 64 M 88 55 Q 89 61 88 64 M 106 55 Q 107 61 106 64 M 124 56 Q 123 61 124 64" fill="none" stroke="${hairShadow}" stroke-width="0.9" stroke-linecap="round" opacity="0.6"/>
      `;
    } else if (bangs === 'curtain') {
      bangsSvg = `
        <path d="M 99 44 C 84 44, 65 56, 56 84 C 66 72, 82 62, 97 53 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="0.9"/>
        <path d="M 101 44 C 116 44, 135 56, 144 84 C 134 72, 118 62, 103 53 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="0.9"/>
      `;
    } else if (bangs === 'wispy') {
      bangsSvg = `
        <path d="M 80 48 Q 76 59 73 67 M 94 46 Q 93 58 91 66 M 108 46 Q 110 58 112 66 M 122 49 Q 126 59 128 67" fill="none" stroke="${hairFill}" stroke-width="2.4" stroke-linecap="round"/>
      `;
    } else if (bangs === 'micro') {
      bangsSvg = `
        <path d="M 64 58 C 72 44, 84 41, 100 41 C 116 41, 128 44, 136 58 C 122 55, 110 56, 100 55 C 90 56, 78 55, 64 58 Z" fill="${hairFill}" stroke="${hairShadow}" stroke-width="0.8"/>
      `;
    }

    return `<g>${crown}${bangsSvg}</g>`;
  }

  function renderEyes(opts, eyeColor, skin) {
    const leftX = 81;
    const rightX = 119;
    const eyeY = 91;
    const rightColor = (opts.heterochromia && AVATAR_PALETTES.eyes[opts.heterochromia]) ? AVATAR_PALETTES.eyes[opts.heterochromia] : eyeColor;

    const ry = opts.eyeShape === 'round' ? 6.0 : (opts.eyeShape === 'hooded' || opts.eyeShape === 'monolid' ? 4.4 : 5.0);
    const rx = opts.eyeShape === 'round' ? 7.8 : 8.8;
    const tilt = opts.eyeShape === 'upturned' ? -6 : (opts.eyeShape === 'downturned' ? 6 : 0);

    const drawSingleEye = (cx, col, sideSign) => {
      const t = tilt ? ` transform="rotate(${tilt * sideSign} ${cx} ${eyeY})"` : '';
      let extraSvg = '';
      if (opts.eyeExtra === 'tired_eyes' || opts.eyeExtra === 'eye_bags') {
        extraSvg += `<path d="M ${cx - 8} ${eyeY + 7.5} Q ${cx} ${eyeY + 10.5} ${cx + 8} ${eyeY + 7.5}" fill="none" stroke="${skin.shadow}" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>`;
      }
      if (opts.eyeExtra === 'eyeliner') {
        extraSvg += `<path d="M ${cx - rx - 1} ${eyeY - 0.5} Q ${cx} ${eyeY - ry - 2.2} ${cx + rx + (sideSign > 0 ? 3.2 : 1)} ${eyeY - (sideSign > 0 ? 2.5 : 0.5)}" fill="none" stroke="#111015" stroke-width="1.7" stroke-linecap="round"/>`;
      }
      const crease = opts.eyelid === 'double'
        ? `<path d="M ${cx - rx + 1} ${eyeY - ry - 1.5} Q ${cx} ${eyeY - ry - 3.6} ${cx + rx - 1} ${eyeY - ry - 1.5}" fill="none" stroke="${skin.shadow}" stroke-width="0.9" opacity="0.75"/>`
        : '';

      return `
        <g${t}>
          ${extraSvg}
          <ellipse cx="${cx}" cy="${eyeY}" rx="${rx}" ry="${ry}" fill="#f5f1ea"/>
          <ellipse cx="${cx}" cy="${eyeY - ry * 0.45}" rx="${rx * 0.92}" ry="${ry * 0.55}" fill="rgba(40,30,35,0.10)"/>
          <circle cx="${cx}" cy="${eyeY}" r="4.1" fill="${col}"/>
          <circle cx="${cx}" cy="${eyeY}" r="4.1" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="0.7"/>
          <circle cx="${cx}" cy="${eyeY}" r="2.0" fill="#0d0c10"/>
          <circle cx="${cx - 1.4}" cy="${eyeY - 1.4}" r="1.15" fill="#ffffff" opacity="0.92"/>
          <circle cx="${cx + 1.4}" cy="${eyeY + 1.2}" r="0.55" fill="#ffffff" opacity="0.65"/>
          <path d="M ${cx - rx} ${eyeY} Q ${cx} ${eyeY - ry - 1.6} ${cx + rx} ${eyeY}" fill="none" stroke="#1b181c" stroke-width="1.4" stroke-linecap="round"/>
          ${crease}
        </g>
      `;
    };

    return `<g>${drawSingleEye(leftX, eyeColor, -1)}${drawSingleEye(rightX, rightColor, 1)}</g>`;
  }

  function renderEyebrows(opts, browColor) {
    const style = opts.eyebrow;
    const strokeW = style === 'thick' ? 2.6 : (style === 'thin' ? 1.3 : 1.9);
    const drawSide = (cx, dir) => {
      if (style === 'arched' || style === 'angled') {
        return `<path d="M ${cx - 9 * dir} 79 Q ${cx + 1 * dir} 74 ${cx + 9 * dir} 78.5" fill="none" stroke="${browColor}" stroke-width="${strokeW}" stroke-linecap="round"/>`;
      }
      if (style === 'straight') {
        return `<path d="M ${cx - 9 * dir} 78.5 Q ${cx} 77.5 ${cx + 9 * dir} 78.5" fill="none" stroke="${browColor}" stroke-width="${strokeW}" stroke-linecap="round"/>`;
      }
      return `<path d="M ${cx - 9 * dir} 79 Q ${cx} 75.5 ${cx + 9 * dir} 78.5" fill="none" stroke="${browColor}" stroke-width="${strokeW}" stroke-linecap="round"/>`;
    };
    return `<g>${drawSide(81, 1)}${drawSide(119, -1)}</g>`;
  }

  function renderNose(opts, skin) {
    const s = skin.shadow;
    switch (opts.noseStyle) {
      case 'button':
      case 'snub':
        return `
          <path d="M 96 108 Q 100 112 104 108" fill="none" stroke="${s}" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="96.5" cy="108.5" r="0.9" fill="${s}" opacity="0.7"/>
          <circle cx="103.5" cy="108.5" r="0.9" fill="${s}" opacity="0.7"/>
        `;
      case 'roman':
      case 'aquiline':
        return `
          <path d="M 99 88 Q 102 99 101 108 Q 98 111 95 109" fill="none" stroke="${s}" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M 101 109 Q 104 111 106 108.5" fill="none" stroke="${s}" stroke-width="1.1" stroke-linecap="round"/>
        `;
      case 'broad':
        return `
          <path d="M 98 91 L 96 107" fill="none" stroke="${s}" stroke-width="1" opacity="0.6" stroke-linecap="round"/>
          <path d="M 93.5 108 Q 100 113 106.5 108" fill="none" stroke="${s}" stroke-width="1.4" stroke-linecap="round"/>
        `;
      case 'straight':
      default:
        return `
          <path d="M 99 90 L 98.5 107" fill="none" stroke="${s}" stroke-width="1.05" opacity="0.65" stroke-linecap="round"/>
          <path d="M 95.5 108.5 Q 100 111.5 104.5 108.5" fill="none" stroke="${s}" stroke-width="1.3" stroke-linecap="round"/>
        `;
    }
  }

  function renderLips(opts, skin) {
    const lipTone = hexToRgba('#8f454c', 0.65);
    const lipLine = hexToRgba('#4c2026', 0.65);
    const y = 124;
    const wHalf = opts.lipsStyle === 'wide' ? 12 : (opts.lipsStyle === 'thin' ? 8.5 : 10);
    const fullness = opts.lipsStyle === 'full' ? 4.4 : (opts.lipsStyle === 'thin' ? 2.2 : 3.2);
    const cornerDy = opts.lipsStyle === 'upturned' ? -1.4 : (opts.lipsStyle === 'downturned' ? 1.6 : 0);

    return `
      <g>
        <path d="M ${100 - wHalf} ${y + cornerDy} Q ${100 - wHalf * 0.45} ${y - 2.6} 100 ${y - 1.2} Q ${100 + wHalf * 0.45} ${y - 2.6} ${100 + wHalf} ${y + cornerDy} Q 100 ${y + fullness + 1.5} ${100 - wHalf} ${y + cornerDy} Z" fill="${lipTone}"/>
        <path d="M ${100 - wHalf} ${y + cornerDy} Q 100 ${y + 0.8} ${100 + wHalf} ${y + cornerDy}" fill="none" stroke="${lipLine}" stroke-width="1.15" stroke-linecap="round"/>
        <path d="M 96 ${y + fullness * 0.55} Q 100 ${y + fullness * 0.7} 104 ${y + fullness * 0.55}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="0.9" stroke-linecap="round"/>
      </g>
    `;
  }

  function renderFacialHair(opts, hairFill) {
    if (opts.age < 13 || opts.facialHair === 'clean') return '';
    const fh = opts.facialHair;
    let svg = '';
    if (fh === 'stubble') {
      svg += `<path d="M 63 112 C 66 131, 82 142, 100 143 C 118 142, 134 131, 137 112 C 132 126, 118 135, 100 135 C 82 135, 68 126, 63 112 Z" fill="${hairFill}" opacity="0.28"/>`;
    } else if (fh === 'short_beard' || fh === 'full_beard' || fh === 'wizard') {
      const bottomY = fh === 'wizard' ? 168 : (fh === 'full_beard' ? 150 : 145);
      svg += `<path d="M 60 105 C 61 132, 78 ${bottomY}, 100 ${bottomY} C 122 ${bottomY}, 139 132, 140 105 C 134 117, 124 123, 114 121 C 107 119, 104 117, 100 117 C 96 117, 93 119, 86 121 C 76 123, 66 117, 60 105 Z" fill="${hairFill}" opacity="0.92"/>`;
    } else if (fh === 'goatee') {
      svg += `<path d="M 90 129 Q 100 145 110 129 Q 100 134 90 129 Z" fill="${hairFill}" opacity="0.9"/>`;
    } else if (fh === 'mutton_chops') {
      svg += `
        <path d="M 60 96 C 59 116, 65 130, 78 134 L 74 115 Z" fill="${hairFill}" opacity="0.88"/>
        <path d="M 140 96 C 141 116, 135 130, 122 134 L 126 115 Z" fill="${hairFill}" opacity="0.88"/>
      `;
    }

    if (fh === 'mustache' || fh === 'chevron_mustache' || fh === 'handlebar' || fh === 'full_beard' || fh === 'wizard') {
      if (fh === 'handlebar') {
        svg += `<path d="M 84 117 Q 92 114 100 118 Q 108 114 116 117 Q 121 119 122 114" fill="none" stroke="${hairFill}" stroke-width="2.6" stroke-linecap="round"/>`;
      } else {
        svg += `<path d="M 86 118 Q 93 114 100 117 Q 107 114 114 118 Q 107 121 100 119 Q 93 121 86 118 Z" fill="${hairFill}"/>`;
      }
    }
    return `<g>${svg}</g>`;
  }

  function renderGlasses(opts) {
    if (opts.glasses === 'none') return '';
    const style = opts.glasses;
    const stroke = style === 'sunglasses' ? '#141418' : (style === 'cat_eye' ? '#7a2534' : (style === 'thick_frame' ? '#1d1d22' : '#8d784a'));
    const sw = (style === 'thick_frame' || style === 'sunglasses') ? 2.4 : 1.5;
    const fill = style === 'sunglasses' ? 'rgba(14,14,18,0.88)' : 'rgba(255,255,255,0.08)';
    const drawLens = (cx) => {
      if (style === 'square' || style === 'thick_frame') {
        return `<rect x="${cx - 12}" y="83" width="24" height="16" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
      }
      return `<ellipse cx="${cx}" cy="91" rx="11.5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    };
    return `
      <g>
        ${drawLens(81)}
        ${drawLens(119)}
        <path d="M 93 90 Q 100 88 107 90" fill="none" stroke="${stroke}" stroke-width="${sw}"/>
      </g>
    `;
  }

  function renderHeadwear(opts) {
    const hw = opts.headwear;
    if (hw === 'none') return '';
    if (hw === 'beanie') {
      return `
        <g>
          <path d="M 54 58 C 56 26, 76 18, 100 18 C 124 18, 144 26, 146 58 Z" fill="#23242b" stroke="#111216" stroke-width="1.1"/>
          <rect x="52" y="50" width="96" height="12" rx="6" fill="#2c2e37" stroke="#111216" stroke-width="1.1"/>
        </g>
      `;
    }
    if (hw === 'beret') {
      return `
        <g>
          <ellipse cx="105" cy="42" rx="44" ry="15" transform="rotate(-10 105 42)" fill="#641d28" stroke="#3b0d14" stroke-width="1.2"/>
          <path d="M 103 26 L 106 21" stroke="#3b0d14" stroke-width="2" stroke-linecap="round"/>
        </g>
      `;
    }
    if (hw === 'baseball_cap') {
      return `
        <g>
          <path d="M 56 56 C 58 28, 76 20, 100 20 C 124 20, 142 28, 144 56 Z" fill="#1d2942" stroke="#101829" stroke-width="1.1"/>
          <path d="M 53 54 Q 100 44 147 54 Q 124 61 100 60 Q 76 61 53 54 Z" fill="#152036" stroke="#0c1220" stroke-width="1"/>
        </g>
      `;
    }
    return '';
  }

  function renderInfantSvg(opts, skin, eyeColor, hair, uid) {
    const bgId = `bg-${uid}`;
    const skinId = `skin-${uid}`;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full block" role="img" aria-label="Infant portrait">
        <defs>
          <radialGradient id="${bgId}" cx="50%" cy="46%" r="68%">
            <stop offset="0%" stop-color="#2a2730"/>
            <stop offset="65%" stop-color="#15141a"/>
            <stop offset="100%" stop-color="#0b0a0e"/>
          </radialGradient>
          <radialGradient id="${skinId}" cx="45%" cy="38%" r="62%">
            <stop offset="0%" stop-color="${skin.highlight}"/>
            <stop offset="62%" stop-color="${skin.base}"/>
            <stop offset="100%" stop-color="${skin.shadow}"/>
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(#${bgId})"/>
        <ellipse cx="100" cy="100" rx="88" ry="88" fill="none" stroke="rgba(165,142,96,0.28)" stroke-width="1"/>
        <!-- Swaddle -->
        <path d="M 46 200 C 50 156, 72 142, 100 142 C 128 142, 150 156, 154 200 Z" fill="#d9d2c5" stroke="rgba(0,0,0,0.22)" stroke-width="1.2"/>
        <path d="M 58 164 Q 100 182 142 158" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1.2"/>
        <!-- Round Infant Head -->
        <ellipse cx="100" cy="100" rx="42" ry="43" fill="url(#${skinId})" stroke="${skin.shadow}" stroke-width="1"/>
        <ellipse cx="75" cy="108" rx="9" ry="5" fill="${skin.blush}"/>
        <ellipse cx="125" cy="108" rx="9" ry="5" fill="${skin.blush}"/>
        <!-- Hair Tuft -->
        <path d="M 92 58 Q 100 46 108 58 Q 103 55 98 58 Z" fill="${hair.base}"/>
        <!-- Large Infant Eyes -->
        <ellipse cx="83" cy="96" rx="7.5" ry="6" fill="#f7f3ec"/>
        <ellipse cx="117" cy="96" rx="7.5" ry="6" fill="#f7f3ec"/>
        <circle cx="83" cy="96" r="4.2" fill="${eyeColor}"/>
        <circle cx="117" cy="96" r="4.2" fill="${eyeColor}"/>
        <circle cx="83" cy="96" r="2" fill="#0d0c10"/>
        <circle cx="117" cy="96" r="2" fill="#0d0c10"/>
        <circle cx="81.5" cy="94.5" r="1.3" fill="#ffffff"/>
        <circle cx="115.5" cy="94.5" r="1.3" fill="#ffffff"/>
        <!-- Tiny Nose & Mouth -->
        <path d="M 97 107 Q 100 110 103 107" fill="none" stroke="${skin.shadow}" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 94 120 Q 100 123 106 120" fill="none" stroke="#8a4d52" stroke-width="1.4" stroke-linecap="round"/>
        <rect x="4" y="4" width="192" height="192" rx="8" fill="none" stroke="rgba(138,118,76,0.48)" stroke-width="1.4"/>
      </svg>
    `;
  }

  function buildGothicAvatarSvg(options = {}) {
    const opts = normalizeAvatarOptions(options);
    const uid = ++svgUidCounter;
    const skin = AVATAR_PALETTES.skin[opts.skinKey] || AVATAR_PALETTES.skin.porcelain;
    const eyeColor = AVATAR_PALETTES.eyes[opts.eyeColorKey] || AVATAR_PALETTES.eyes.black;
    const hair = AVATAR_PALETTES.hair[opts.hairColorKey] || AVATAR_PALETTES.hair.raven;
    const col = AVATAR_PALETTES.clothing[opts.clothingColor] || AVATAR_PALETTES.clothing.charcoal;

    if (opts.age <= 2) {
      return renderInfantSvg(opts, skin, eyeColor, hair, uid);
    }

    const bgId = `bg-${uid}`;
    const skinId = `skin-${uid}`;
    const hairId = `hair-${uid}`;
    const isSplit = opts.hairColorKey === 'split_black_white';
    const hairFill = isSplit ? `url(#${hairId})` : hair.base;
    const facePath = getFacePath(opts.faceShape);

    let markSvg = '';
    if (opts.mark === 'freckles') {
      markSvg = `<g fill="${skin.shadow}" opacity="0.65"><circle cx="76" cy="105" r="1"/><circle cx="81" cy="107" r="0.9"/><circle cx="78" cy="110" r="0.9"/><circle cx="124" cy="105" r="1"/><circle cx="119" cy="107" r="0.9"/><circle cx="122" cy="110" r="0.9"/></g>`;
    } else if (opts.mark === 'moles') {
      markSvg = `<circle cx="122" cy="113" r="1.5" fill="#3a2a24"/>`;
    } else if (opts.mark === 'scar') {
      markSvg = `<path d="M 113 82 L 126 105" stroke="rgba(160,92,96,0.65)" stroke-width="1.4" stroke-linecap="round"/>`;
    } else if (opts.mark === 'cleft_chin') {
      markSvg = `<path d="M 100 135 L 100 139" stroke="${skin.shadow}" stroke-width="1.2" stroke-linecap="round"/>`;
    }

    let ageLinesSvg = '';
    if (opts.age >= 40) {
      const op = opts.age >= 60 ? 0.55 : 0.3;
      ageLinesSvg = `
        <g stroke="${skin.shadow}" stroke-width="0.9" fill="none" opacity="${op}" stroke-linecap="round">
          <path d="M 82 62 Q 100 59 118 62"/>
          <path d="M 85 113 Q 81 122 83 129"/>
          <path d="M 115 113 Q 119 122 117 129"/>
        </g>
      `;
    }

    let necklaceSvg = '';
    if (opts.necklace === 'choker') {
      necklaceSvg = `<path d="M 85 144 Q 100 149 115 144" fill="none" stroke="#15141a" stroke-width="3.2" stroke-linecap="round"/><circle cx="100" cy="147" r="2" fill="#9e8d5e"/>`;
    } else if (opts.necklace === 'pearls') {
      necklaceSvg = `<path d="M 82 149 Q 100 158 118 149" fill="none" stroke="#efe9dc" stroke-width="2.5" stroke-dasharray="0.5 3.6" stroke-linecap="round"/>`;
    } else if (opts.necklace === 'chain' || opts.necklace === 'pendant') {
      necklaceSvg = `<path d="M 82 148 Q 100 162 118 148" fill="none" stroke="#b9a16b" stroke-width="1.3"/>` +
        (opts.necklace === 'pendant' ? `<circle cx="100" cy="157" r="2.6" fill="#7c1d2b" stroke="#b9a16b" stroke-width="0.9"/>` : '');
    }

    let piercingSvg = '';
    if (opts.piercing === 'nose_stud') {
      piercingSvg = `<circle cx="104.5" cy="107" r="1.2" fill="#dcd7c8"/>`;
    } else if (opts.piercing === 'septum') {
      piercingSvg = `<path d="M 97.5 110.5 A 2.5 2.5 0 1 0 102.5 110.5" fill="none" stroke="#c7b27c" stroke-width="1.2"/>`;
    } else if (opts.piercing === 'eyebrow') {
      piercingSvg = `<circle cx="71" cy="77" r="1.1" fill="#dcd7c8"/><circle cx="72" cy="81" r="1.1" fill="#dcd7c8"/>`;
    } else if (opts.piercing === 'labret') {
      piercingSvg = `<circle cx="100" cy="130" r="1.2" fill="#dcd7c8"/>`;
    } else if (opts.piercing === 'earrings') {
      piercingSvg = `<circle cx="55" cy="108" r="2" fill="#c7b27c"/><circle cx="145" cy="108" r="2" fill="#c7b27c"/>`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full block" role="img" aria-label="Character portrait">
        <defs>
          <radialGradient id="${bgId}" cx="50%" cy="44%" r="68%">
            <stop offset="0%" stop-color="#2a2730"/>
            <stop offset="65%" stop-color="#15141a"/>
            <stop offset="100%" stop-color="#0b0a0e"/>
          </radialGradient>
          <radialGradient id="${skinId}" cx="44%" cy="36%" r="66%">
            <stop offset="0%" stop-color="${skin.highlight}"/>
            <stop offset="62%" stop-color="${skin.base}"/>
            <stop offset="100%" stop-color="${skin.shadow}"/>
          </radialGradient>
          ${isSplit ? `
          <linearGradient id="${hairId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="49.5%" stop-color="${hair.base}"/>
            <stop offset="50.5%" stop-color="${hair.alt}"/>
          </linearGradient>` : ''}
        </defs>
        <rect width="200" height="200" fill="url(#${bgId})"/>
        <ellipse cx="100" cy="100" rx="88" ry="88" fill="none" stroke="rgba(165,142,96,0.22)" stroke-width="1"/>
        ${renderBackHair(opts, hairFill, hair.shadow)}
        ${renderClothing(opts, col, uid)}
        <!-- Neck & Under-chin Shadow -->
        <path d="M 86 126 L 86 156 Q 100 164 114 156 L 114 126 Z" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="0.9"/>
        <ellipse cx="100" cy="139" rx="14" ry="7" fill="rgba(0,0,0,0.22)"/>
        ${necklaceSvg}
        <!-- Ears -->
        <ellipse cx="56" cy="96" rx="5.5" ry="11" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="0.9"/>
        <ellipse cx="144" cy="96" rx="5.5" ry="11" fill="${skin.base}" stroke="${skin.shadow}" stroke-width="0.9"/>
        <!-- Head / Face -->
        <path d="${facePath}" fill="url(#${skinId})" stroke="${skin.shadow}" stroke-width="1.1"/>
        <ellipse cx="74" cy="106" rx="9" ry="5" fill="${skin.blush}"/>
        <ellipse cx="126" cy="106" rx="9" ry="5" fill="${skin.blush}"/>
        ${markSvg}
        ${ageLinesSvg}
        ${renderFacialHair(opts, hairFill)}
        ${renderNose(opts, skin)}
        ${renderLips(opts, skin)}
        ${renderEyes(opts, eyeColor, skin)}
        ${renderEyebrows(opts, isSplit ? '#2c2b30' : hair.shadow)}
        ${piercingSvg}
        ${renderFrontHair(opts, hairFill, hair.shadow, hair.highlight)}
        ${renderGlasses(opts)}
        ${renderHeadwear(opts)}
        <!-- Subtle Cameo Frame -->
        <rect x="4" y="4" width="192" height="192" rx="8" fill="none" stroke="rgba(138,118,76,0.45)" stroke-width="1.3"/>
      </svg>
    `;
  }

  function drawGothicAvatar(target, options = {}) {
    if (!target) return;
    const svgMarkup = buildGothicAvatarSvg(options);

    // If caller passed a <canvas> inside a DOM wrapper, mount/update a crisp inline <svg> sibling
    if (target.tagName === 'CANVAS' && target.parentNode) {
      target.style.display = 'none';
      const parent = target.parentNode;
      let holder = parent.querySelector(':scope > [data-gothic-svg-holder]');
      if (!holder) {
        holder = document.createElement('div');
        holder.setAttribute('data-gothic-svg-holder', '1');
        holder.className = 'w-full h-full block';
        parent.insertBefore(holder, target.nextSibling);
      }
      holder.innerHTML = svgMarkup;
      return;
    }

    // Fallback: if detached canvas, rasterize SVG onto canvas
    if (target.tagName === 'CANVAS') {
      const ctx = target.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, target.width, target.height);
        ctx.drawImage(img, 0, 0, target.width, target.height);
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup);
      return;
    }

    // Direct container element
    target.innerHTML = svgMarkup;
  }

  window.buildGothicAvatarSvg = buildGothicAvatarSvg;
  window.drawGothicAvatar = drawGothicAvatar;
  window.AVATAR_PALETTES = AVATAR_PALETTES;
})();
