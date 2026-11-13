// Layered Gothic SVG Portrait Engine for Terrible Little Lives
// Renders crisp, scalable vector portraits (<svg viewBox="0 0 200 200">) with smooth
// Bezier contours, soft gradients, clipped irises, and strict trait-compatibility rules.

(function () {
  'use strict';

  const AVATAR_PALETTES = {
    skin: {
      porcelain:     { base: '#f3e8de', shadow: '#cfb9a5', deep: '#b39882', highlight: '#fbf6f1', blush: 'rgba(214, 128, 128, 0.22)', lip: '#c47b7b' },
      ivory:         { base: '#ead5c3', shadow: '#c4a086', deep: '#a67f64', highlight: '#f7ebe0', blush: 'rgba(208, 120, 120, 0.20)', lip: '#bf7373' },
      warm_beige:    { base: '#d8b497', shadow: '#ae8362', deep: '#8e6445', highlight: '#ecd1ba', blush: 'rgba(195, 108, 108, 0.20)', lip: '#ae6363' },
      golden_peach:  { base: '#e2b48b', shadow: '#b88052', deep: '#966136', highlight: '#f4d2b2', blush: 'rgba(205, 105, 95, 0.22)',  lip: '#b5655d' },
      olive:         { base: '#bca789', shadow: '#8e795b', deep: '#6f5b3f', highlight: '#d6c6ae', blush: 'rgba(165, 105, 98, 0.18)',  lip: '#965c58' },
      warm_bronze:   { base: '#a67852', shadow: '#764b2a', deep: '#593418', highlight: '#c69b75', blush: 'rgba(150, 75, 68, 0.20)',   lip: '#874843' },
      chestnut:      { base: '#7f4f2c', shadow: '#522a0f', deep: '#3b1b06', highlight: '#a16c45', blush: 'rgba(128, 50, 50, 0.20)',   lip: '#6b332f' },
      rich_espresso: { base: '#563521', shadow: '#32180b', deep: '#210e05', highlight: '#774c32', blush: 'rgba(98, 36, 36, 0.20)',    lip: '#4d2320' },
      deep_ebony:    { base: '#382319', shadow: '#1c0f08', deep: '#110804', highlight: '#52372a', blush: 'rgba(80, 28, 28, 0.20)',    lip: '#361816' },
      ash:           { base: '#b9b6af', shadow: '#8b8880', deep: '#6c6962', highlight: '#d4d2cc', blush: 'rgba(130, 118, 135, 0.16)', lip: '#8a727a' },
      sallow:        { base: '#cec59e', shadow: '#a0966c', deep: '#7e754f', highlight: '#e3dbb7', blush: 'rgba(152, 132, 98, 0.16)',  lip: '#997c6e' },
      bruised:       { base: '#a99eb3', shadow: '#7b6e87', deep: '#5c5068', highlight: '#c7bed0', blush: 'rgba(124, 70, 128, 0.22)',  lip: '#7d5675' },
      mortuary:      { base: '#ccd2d3', shadow: '#959d9f', deep: '#737c7e', highlight: '#e5eaeb', blush: 'rgba(110, 125, 140, 0.16)', lip: '#857d84' }
    },

    eyes: {
      black:        '#1a1819',
      dark_brown:   '#3b2417',
      brown:        '#5b3922',
      light_brown:  '#835330',
      hazel:        '#7d6837',
      amber:        '#b56e24',
      green:        '#3c7348',
      olive_green:  '#58693a',
      blue:         '#3b6c9b',
      gray:         '#65737e',
      golden:       '#cca029',
      violet:       '#69468a',
      albino_red:   '#b8323e',
      ice_blue:     '#78b5db',
      crimson:      '#8e1b24',
      milky_blind:  '#cfd6dc',
      emerald_glow: '#20a361',
      starburst:    '#9c4d93'
    },

    hair: {
      raven:             { base: '#18181b', shadow: '#0b0b0d', highlight: '#3c3c46' },
      dark_brown:        { base: '#322219', shadow: '#1c120c', highlight: '#523a2d' },
      ash_brown:         { base: '#4a3f37', shadow: '#2d241e', highlight: '#6c5d53' },
      chestnut:          { base: '#5c321d', shadow: '#3a1b0d', highlight: '#824e33' },
      auburn:            { base: '#6e2d1d', shadow: '#45170b', highlight: '#984531' },
      ginger_red:        { base: '#a84724', shadow: '#732a0f', highlight: '#cf6740' },
      strawberry_blonde: { base: '#b57956', shadow: '#865032', highlight: '#d69975' },
      dark_blonde:       { base: '#8f774e', shadow: '#624f30', highlight: '#b3996d' },
      golden_blonde:     { base: '#bf9e5a', shadow: '#8c7037', highlight: '#dfc180' },
      platinum:          { base: '#dedbd2', shadow: '#b0aca1', highlight: '#f7f5ee' },
      silver_gray:       { base: '#8c8c91', shadow: '#616165', highlight: '#b6b6bb' },
      pure_white:        { base: '#f0eff2', shadow: '#c3c2c7', highlight: '#ffffff' },
      pastel_pink:       { base: '#d8869c', shadow: '#a8596f', highlight: '#f2abc0' },
      rose:              { base: '#b84d69', shadow: '#852c44', highlight: '#dc738f' },
      peach:             { base: '#d48064', shadow: '#a4563c', highlight: '#efa289' },
      crimson_dye:       { base: '#99182c', shadow: '#640816', highlight: '#c8344c' },
      neon_orange:       { base: '#c9591e', shadow: '#8e3709', highlight: '#ea7c43' },
      moss_green:        { base: '#46673f', shadow: '#2a4324', highlight: '#678d5e' },
      teal:              { base: '#2b7875', shadow: '#164d4b', highlight: '#469d9a' },
      deep_blue:         { base: '#25447a', shadow: '#11254b', highlight: '#3f65aa' },
      royal_purple:      { base: '#562f7a', shadow: '#34184f', highlight: '#7a4ba4' },
      lavender:          { base: '#9a7cb8', shadow: '#6d508b', highlight: '#be9fda' },
      split_black_white: { base: '#18181b', alt: '#dedbd2', shadow: '#0b0b0d', highlight: '#3c3c46' }
    },

    clothing: {
      black:         '#18191c',
      charcoal:      '#2b2e34',
      navy:          '#1c2638',
      burgundy:      '#491a23',
      forest:        '#1a3222',
      tweed_brown:   '#4a3c31',
      cream:         '#dfd9cd',
      white:         '#ebe9e2',
      denim:         '#38526d',
      school_maroon: '#5b1d27',
      school_navy:   '#1a2946',
      scrubs_teal:   '#27686a',
      mustard:       '#9a752a'
    }
  };

  let uidCounter = 0;

  // Sanitizes contradictory or nonsensical combinations so portraits always look intentional
  function sanitizeAvatarOptions(raw = {}) {
    const o = { ...raw };
    const age = o.age !== undefined ? Number(o.age) : 18;
    const gender = o.gender || 'Male';

    o.age = age;
    o.gender = gender;
    o.skin = AVATAR_PALETTES.skin[o.skin] ? o.skin : 'porcelain';
    o.eyeColor = AVATAR_PALETTES.eyes[o.eyeColor] ? o.eyeColor : 'dark_brown';
    o.hairColor = AVATAR_PALETTES.hair[o.hairColor] ? o.hairColor : 'raven';
    o.clothingColor = AVATAR_PALETTES.clothing[o.clothingColor] ? o.clothingColor : 'charcoal';

    o.faceShape = o.faceShape || 'oval';
    o.eyeShape = o.eyeShape || 'almond';
    o.eyelid = o.eyelid || 'double';
    o.eyeExtra = o.eyeExtra || 'none';
    o.eyebrow = o.eyebrow || 'soft_arch';
    o.noseStyle = o.noseStyle || 'straight';
    o.lipsStyle = o.lipsStyle || 'medium';
    o.hairStyle = o.hairStyle || (gender === 'Female' ? 'long' : 'parted');
    o.hairTexture = o.hairTexture || 'straight';
    o.bangs = o.bangs || 'none';
    o.facialHair = o.facialHair || 'clean';
    o.mark = o.mark || 'none';
    o.clothing = o.clothing || 'casual';
    o.glasses = o.glasses || 'none';
    o.piercing = o.piercing || 'none';
    o.headwear = o.headwear || 'none';
    o.necklace = o.necklace || 'none';

    // Rule 1: Children (< 13) and Females don't have facial hair unless explicitly forced in creator
    if (age < 13 || gender === 'Female') {
      o.facialHair = 'clean';
    }

    // Rule 2: Hijab covers hair, ears, bangs, and conflicts with hats/beards
    if (o.hairStyle === 'hijab') {
      if (gender === 'Male') {
        o.hairStyle = 'parted';
      } else {
        o.bangs = 'none';
        o.headwear = 'none';
        o.facialHair = 'clean';
        if (o.piercing === 'earrings') o.piercing = 'none';
      }
    }

    // Rule 3: Buzz cut cannot have long overhanging bangs
    if (o.hairStyle === 'buzz_cut') {
      o.bangs = 'none';
    }

    // Rule 4: Hats tuck high buns down into a neat low silhouette
    if (o.headwear !== 'none' && (o.hairStyle === 'space_buns' || o.hairStyle === 'messy_bun')) {
      o.tuckBunsUnderHat = true;
    }

    return o;
  }

  // Face contour paths (centered at x=100, forehead top ~44, chin bottom ~146)
  function getFaceContourPath(faceShape, isChild) {
    if (isChild) {
      return 'M 64,86 C 64,54 136,54 136,86 C 136,118 122,140 100,142 C 78,140 64,118 64,86 Z';
    }
    switch (faceShape) {
      case 'round':
        return 'M 61,88 C 61,50 139,50 139,88 C 139,122 124,144 100,145 C 76,144 61,122 61,88 Z';
      case 'square':
        return 'M 62,84 C 62,48 138,48 138,84 L 136,124 C 135,137 120,145 100,145 C 80,145 65,137 64,124 Z';
      case 'rectangle':
      case 'oblong':
        return 'M 64,80 C 64,46 136,46 136,80 L 134,126 C 133,139 118,148 100,148 C 82,148 67,139 66,126 Z';
      case 'heart':
      case 'inverted_triangle':
        return 'M 61,84 C 61,48 139,48 139,84 C 138,112 119,138 100,147 C 81,138 62,112 61,84 Z';
      case 'diamond':
        return 'M 66,76 C 72,48 128,48 134,76 L 139,96 C 136,120 118,140 100,147 C 82,140 64,120 61,96 Z';
      case 'triangle':
        return 'M 67,82 C 67,50 133,50 133,82 L 138,120 C 138,136 122,146 100,146 C 78,146 62,136 62,120 Z';
      case 'wide':
        return 'M 59,86 C 59,49 141,49 141,86 C 140,120 124,144 100,145 C 76,144 60,120 59,86 Z';
      case 'oval':
      default:
        return 'M 63,85 C 63,48 137,48 137,85 C 137,118 121,144 100,146 C 79,144 63,118 63,85 Z';
    }
  }

  function buildInfantSVG(uid, o, skin, eyeColor, hair) {
    return `
      <!-- Swaddle / Blanket -->
      <path d="M 44,198 C 46,146 70,132 100,132 C 130,132 154,146 156,198 Z" fill="#dcd5c9" stroke="#8f8575" stroke-width="1.5"/>
      <path d="M 58,198 C 64,156 82,144 100,144 C 118,144 136,156 142,198" fill="none" stroke="#b8afa0" stroke-width="1.4"/>
      <path d="M 74,136 Q 100,152 126,136" fill="none" stroke="#9e9383" stroke-width="1.5"/>
      <!-- Baby Ears -->
      <ellipse cx="63" cy="96" rx="6" ry="8" fill="${skin.shadow}" stroke="${skin.deep}" stroke-width="1"/>
      <ellipse cx="137" cy="96" rx="6" ry="8" fill="${skin.shadow}" stroke="${skin.deep}" stroke-width="1"/>
      <!-- Baby Head -->
      <path d="M 64,92 C 64,54 136,54 136,92 C 136,122 121,138 100,138 C 79,138 64,122 64,92 Z" fill="url(#skinGrad-${uid})" stroke="${skin.deep}" stroke-width="1.2"/>
      <!-- Rosy Cheeks -->
      <ellipse cx="78" cy="108" rx="9" ry="5.5" fill="${skin.blush}"/>
      <ellipse cx="122" cy="108" rx="9" ry="5.5" fill="${skin.blush}"/>
      <!-- Soft Baby Hair Wisp -->
      <path d="M 92,58 C 96,46 108,48 105,60 C 110,52 116,56 111,64" fill="none" stroke="${hair.base}" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Baby Brows -->
      <path d="M 74,84 Q 82,80 89,84" fill="none" stroke="${hair.base}" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
      <path d="M 111,84 Q 118,80 126,84" fill="none" stroke="${hair.base}" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
      <!-- Big Innocent Eyes -->
      <ellipse cx="82" cy="95" rx="7.5" ry="6.5" fill="#f7f4ef" stroke="${skin.deep}" stroke-width="1"/>
      <circle cx="82" cy="95" r="4.8" fill="${eyeColor}"/>
      <circle cx="82" cy="95" r="2.3" fill="#101014"/>
      <circle cx="80.2" cy="93.2" r="1.5" fill="#ffffff" opacity="0.92"/>
      <ellipse cx="118" cy="95" rx="7.5" ry="6.5" fill="#f7f4ef" stroke="${skin.deep}" stroke-width="1"/>
      <circle cx="118" cy="95" r="4.8" fill="${eyeColor}"/>
      <circle cx="118" cy="95" r="2.3" fill="#101014"/>
      <circle cx="116.2" cy="93.2" r="1.5" fill="#ffffff" opacity="0.92"/>
      <!-- Button Nose -->
      <path d="M 97,106 Q 100,109 103,106" fill="none" stroke="${skin.deep}" stroke-width="1.4" stroke-linecap="round"/>
      <!-- Small Mouth -->
      <path d="M 93,119 Q 100,123 107,119" fill="none" stroke="${skin.lip}" stroke-width="2" stroke-linecap="round"/>
    `;
  }

  function buildBackHairSVG(uid, o, hair) {
    const s = o.hairStyle;
    const fill = `url(#hairGrad-${uid})`;

    if (s === 'buzz_cut' || s === 'crop' || s === 'pixie' || s === 'parted') {
      return '';
    }
    if (s === 'hijab') {
      return `<path d="M 52,88 C 50,130 46,162 42,198 L 158,198 C 154,162 150,130 148,88 Z" fill="#231f28" stroke="#121016" stroke-width="1.4"/>`;
    }
    if (s === 'space_buns' && !o.tuckBunsUnderHat) {
      return `
        <circle cx="62" cy="52" r="16" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.4"/>
        <circle cx="138" cy="52" r="16" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.4"/>
        <path d="M 57,86 C 55,116 58,138 66,148 L 134,148 C 142,138 145,116 143,86 Z" fill="${fill}"/>
      `;
    }
    if (s === 'messy_bun' && !o.tuckBunsUnderHat) {
      return `
        <ellipse cx="100" cy="36" rx="20" ry="14" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.4"/>
        <path d="M 86,33 Q 100,24 114,34" fill="none" stroke="${hair.highlight}" stroke-width="1.4" opacity="0.5"/>
      `;
    }
    if (s === 'short_bob' || s === 'bob') {
      return `<path d="M 54,82 C 48,112 50,138 62,148 L 138,148 C 150,138 152,112 146,82 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>`;
    }
    if (s === 'shag' || s === 'wolf_cut' || s === 'mullet') {
      return `
        <path d="M 54,82 C 48,114 46,148 54,174 L 66,166 L 62,180 L 138,180 L 134,166 L 146,174 C 154,148 152,114 146,82 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>
      `;
    }
    if (s === 'braids' || s === 'box_braids' || s === 'dreadlocks') {
      return `
        <path d="M 55,84 C 50,120 50,160 56,196 L 74,196 C 72,162 72,126 74,96 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.3"/>
        <path d="M 145,84 C 150,120 150,160 144,196 L 126,196 C 128,162 128,126 126,96 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.3"/>
        <path d="M 58,115 Q 65,122 72,115 M 57,135 Q 65,142 73,135 M 57,155 Q 65,162 73,155 M 57,175 Q 65,182 73,175" fill="none" stroke="${hair.shadow}" stroke-width="1.6"/>
        <path d="M 128,115 Q 135,122 142,115 M 127,135 Q 135,142 143,135 M 127,155 Q 135,162 143,155 M 127,175 Q 135,182 143,175" fill="none" stroke="${hair.shadow}" stroke-width="1.6"/>
      `;
    }
    // Default long / loose_waves / straight_long
    return `
      <path d="M 53,82 C 45,122 44,164 52,198 L 148,198 C 156,164 155,122 147,82 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>
      <path d="M 60,120 C 56,148 58,172 62,196 M 140,120 C 144,148 142,172 138,196" fill="none" stroke="${hair.highlight}" stroke-width="1.3" opacity="0.35"/>
    `;
  }

  function buildNeckAndClothingSVG(uid, o, skin, col) {
    const style = o.clothing;
    let collarSVG = '';

    if (style === 'turtleneck') {
      collarSVG = `
        <path d="M 80,144 L 120,144 L 123,168 Q 100,174 77,168 Z" fill="${col}" stroke="#101014" stroke-width="1.3"/>
        <path d="M 81,152 Q 100,157 119,152 M 80,160 Q 100,165 120,160" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      `;
    } else if (style === 'suit' || style === 'prep_blazer' || style === 'elite_uniform') {
      const tieCol = style === 'elite_uniform' ? '#7a1c24' : '#6e1920';
      collarSVG = `
        <!-- Crisp Shirt V -->
        <polygon points="82,152 100,188 118,152" fill="#ece8df" stroke="#b5ada0" stroke-width="1"/>
        <!-- Tie -->
        <polygon points="96,160 104,160 106,194 100,199 94,194" fill="${tieCol}"/>
        <!-- Tailored Lapels -->
        <polygon points="72,154 84,152 100,190 66,196" fill="${col}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <polygon points="128,154 116,152 100,190 134,196" fill="${col}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      `;
    } else if (style === 'hoodie') {
      collarSVG = `
        <path d="M 66,156 C 72,144 84,146 84,156 C 92,166 108,166 116,156 C 116,146 128,144 134,156" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>
        <path d="M 91,164 L 91,188 M 109,164 L 109,188" fill="none" stroke="#d8d2c7" stroke-width="1.6" stroke-linecap="round"/>
      `;
    } else if (style === 'goth') {
      collarSVG = `
        <path d="M 76,154 Q 100,174 124,154 L 128,198 L 72,198 Z" fill="#121216"/>
        <path d="M 78,155 Q 100,172 122,155" fill="none" stroke="#5a1822" stroke-width="2"/>
        <line x1="100" y1="164" x2="100" y2="198" stroke="#2c2c34" stroke-width="1.2"/>
      `;
    } else if (style === 'cardigan' || style === 'sweater') {
      collarSVG = `
        <path d="M 78,153 Q 100,172 122,153" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="3"/>
      `;
    } else {
      // Casual crew / V-neck
      collarSVG = `
        <path d="M 79,153 Q 100,169 121,153" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="3"/>
      `;
    }

    let necklaceSVG = '';
    if (o.necklace === 'choker') {
      necklaceSVG = `
        <path d="M 83,145 Q 100,150 117,145" fill="none" stroke="#16161a" stroke-width="3.6"/>
        <circle cx="100" cy="148" r="2.5" fill="#c8b072" stroke="#4a3c1a" stroke-width="0.8"/>
      `;
    } else if (o.necklace === 'chain') {
      necklaceSVG = `<path d="M 82,150 Q 100,168 118,150" fill="none" stroke="#c8b072" stroke-width="1.8" stroke-dasharray="2.5 1.5"/>`;
    } else if (o.necklace === 'pendant') {
      necklaceSVG = `
        <path d="M 83,149 Q 100,166 117,149" fill="none" stroke="#b89f65" stroke-width="1.3"/>
        <polygon points="100,161 96,168 100,174 104,168" fill="#8e1b24" stroke="#d4be84" stroke-width="0.9"/>
      `;
    } else if (o.necklace === 'pearls') {
      necklaceSVG = `
        <path d="M 81,150 Q 100,165 119,150" fill="none" stroke="#f2eee6" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.5 4.2"/>
      `;
    }

    return `
      <!-- Neck -->
      <path d="M 84,132 L 82,162 Q 100,170 118,162 L 116,132 Z" fill="url(#skinGrad-${uid})" stroke="${skin.deep}" stroke-width="1"/>
      <!-- Under-chin cast shadow -->
      <path d="M 84,134 Q 100,152 116,134 L 116,144 Q 100,156 84,144 Z" fill="${skin.shadow}" opacity="0.72"/>
      ${necklaceSVG}
      <!-- Torso / Shoulders -->
      <path d="M 28,200 C 32,164 56,152 80,151 Q 100,166 120,151 C 144,152 168,164 172,200 Z" fill="${col}" stroke="#111115" stroke-width="1.4"/>
      <!-- Subtle shoulder shading -->
      <path d="M 28,200 C 32,164 56,152 80,151 Q 100,166 120,151 C 144,152 168,164 172,200 Z" fill="url(#clothShade-${uid})"/>
      ${collarSVG}
    `;
  }

  function buildEarsSVG(o, skin) {
    if (o.hairStyle === 'hijab') return '';
    const earrings = o.piercing === 'earrings' ? `
      <circle cx="60" cy="107" r="2.3" fill="#d4b978" stroke="#5e4b22" stroke-width="0.7"/>
      <circle cx="140" cy="107" r="2.3" fill="#d4b978" stroke="#5e4b22" stroke-width="0.7"/>
    ` : '';
    return `
      <g>
        <ellipse cx="62" cy="95" rx="6.5" ry="10.5" transform="rotate(-6 62 95)" fill="${skin.base}" stroke="${skin.deep}" stroke-width="1.1"/>
        <path d="M 61,90 C 59,94 59,98 62,101" fill="none" stroke="${skin.deep}" stroke-width="1" opacity="0.7"/>
        <ellipse cx="138" cy="95" rx="6.5" ry="10.5" transform="rotate(6 138 95)" fill="${skin.base}" stroke="${skin.deep}" stroke-width="1.1"/>
        <path d="M 139,90 C 141,94 141,98 138,101" fill="none" stroke="${skin.deep}" stroke-width="1" opacity="0.7"/>
        ${earrings}
      </g>
    `;
  }

  function buildMarkingsAndAgeSVG(o, skin) {
    let out = '';
    const m = o.mark;
    if (m === 'freckles') {
      out += `
        <g fill="${skin.deep}" opacity="0.55">
          <circle cx="76" cy="104" r="1"/><circle cx="81" cy="106" r="0.9"/><circle cx="73" cy="107" r="0.8"/><circle cx="85" cy="104" r="0.8"/>
          <circle cx="124" cy="104" r="1"/><circle cx="119" cy="106" r="0.9"/><circle cx="127" cy="107" r="0.8"/><circle cx="115" cy="104" r="0.8"/>
          <circle cx="97" cy="103" r="0.7"/><circle cx="103" cy="104" r="0.7"/>
        </g>
      `;
    } else if (m === 'moles') {
      out += `<circle cx="116" cy="117" r="1.4" fill="#3a2318" opacity="0.85"/>`;
    } else if (m === 'scar') {
      out += `
        <path d="M 74,74 L 81,106" fill="none" stroke="#a85d5d" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
        <path d="M 75,82 L 79,81 M 76,98 L 80,97" fill="none" stroke="#a85d5d" stroke-width="1" opacity="0.55"/>
      `;
    } else if (m === 'cleft_chin') {
      out += `<path d="M 100,138 Q 100,142 100,144" fill="none" stroke="${skin.deep}" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>`;
    } else if (m === 'vitiligo') {
      out += `
        <path d="M 68,98 Q 78,94 82,104 Q 76,112 67,108 Z" fill="#f3e9df" opacity="0.48"/>
        <path d="M 118,122 Q 128,118 131,128 Q 124,136 116,130 Z" fill="#f3e9df" opacity="0.48"/>
      `;
    } else if (m === 'acne_teen') {
      out += `
        <g fill="#c25959" opacity="0.45">
          <circle cx="75" cy="110" r="1.2"/><circle cx="79" cy="114" r="1"/><circle cx="124" cy="109" r="1.2"/><circle cx="120" cy="115" r="0.9"/>
        </g>
      `;
    }

    if (o.age >= 38) {
      const op = o.age >= 55 ? 0.55 : 0.28;
      out += `
        <g fill="none" stroke="${skin.deep}" stroke-width="1" stroke-linecap="round" opacity="${op}">
          <path d="M 85,116 Q 81,123 83,130"/>
          <path d="M 115,116 Q 119,123 117,130"/>
          ${o.age >= 52 ? '<path d="M 84,68 Q 100,71 116,68"/><path d="M 87,63 Q 100,66 113,63"/>' : ''}
        </g>
      `;
    }
    return out;
  }

  function buildEyesSVG(uid, o, skin, eyeColor) {
    const leftX = 81;
    const rightX = 119;
    const eyeY = 91;
    const rightColor = (o.heterochromia && AVATAR_PALETTES.eyes[o.heterochromia]) ? AVATAR_PALETTES.eyes[o.heterochromia] : eyeColor;

    // Shape parameters
    let rx = 8.5, ry = 5.2, leftRot = 0, rightRot = 0;
    if (o.eyeShape === 'round') { rx = 8.2; ry = 6.4; }
    else if (o.eyeShape === 'hooded' || o.eyeShape === 'deep_set') { rx = 8.6; ry = 4.5; }
    else if (o.eyeShape === 'monolid') { rx = 8.5; ry = 4.0; }
    else if (o.eyeShape === 'upturned') { rx = 8.5; ry = 4.9; leftRot = -6; rightRot = 6; }
    else if (o.eyeShape === 'downturned') { rx = 8.5; ry = 4.9; leftRot = 6; rightRot = -6; }

    const renderSingleEye = (cx, side, col, rot) => {
      const clipId = `eyeClip-${side}-${uid}`;
      const dir = side === 'L' ? -1 : 1;
      const eyePath = `M ${cx - rx},${eyeY} Q ${cx},${eyeY - ry * 1.35} ${cx + rx},${eyeY} Q ${cx},${eyeY + ry * 1.15} ${cx - rx},${eyeY} Z`;

      let extraSVG = '';
      if (o.eyeExtra === 'tired_eyes' || o.eyeExtra === 'eye_bags') {
        extraSVG += `<path d="M ${cx - rx + 1},${eyeY + ry + 1.5} Q ${cx},${eyeY + ry + 4.8} ${cx + rx - 1},${eyeY + ry + 1.5}" fill="none" stroke="${skin.deep}" stroke-width="1.2" opacity="0.65"/>`;
      }
      const lashWidth = o.eyeExtra === 'eyeliner' ? 2.4 : 1.7;
      const wing = o.eyeExtra === 'eyeliner'
        ? `<path d="M ${cx + dir * (rx - 0.5)},${eyeY - 0.5} L ${cx + dir * (rx + 3.2)},${eyeY - 3.2}" fill="none" stroke="#141216" stroke-width="1.8" stroke-linecap="round"/>`
        : '';

      const crease = o.eyelid !== 'single'
        ? `<path d="M ${cx - rx + 1},${eyeY - ry - 1.2} Q ${cx},${eyeY - ry - 3.8} ${cx + rx - 1},${eyeY - ry - 1.2}" fill="none" stroke="${skin.deep}" stroke-width="1" opacity="0.65"/>`
        : '';

      return `
        <g transform="rotate(${rot} ${cx} ${eyeY})">
          <defs>
            <clipPath id="${clipId}">
              <path d="${eyePath}"/>
            </clipPath>
          </defs>
          ${extraSVG}
          <!-- Sclera -->
          <path d="${eyePath}" fill="#f5f1eb"/>
          <!-- Clipped Iris & Pupil -->
          <g clip-path="url(#${clipId})">
            <circle cx="${cx}" cy="${eyeY - 0.3}" r="${ry * 1.02}" fill="${col}"/>
            <circle cx="${cx}" cy="${eyeY - 0.3}" r="${ry * 0.48}" fill="#111014"/>
            <!-- Subtle upper eyelid shadow inside sclera -->
            <path d="M ${cx - rx - 2},${eyeY - ry - 2} L ${cx + rx + 2},${eyeY - ry - 2} L ${cx + rx + 2},${eyeY - ry * 0.25} L ${cx - rx - 2},${eyeY - ry * 0.25} Z" fill="rgba(0,0,0,0.16)"/>
            <!-- Dual Specular Catchlights -->
            <circle cx="${cx - 1.8}" cy="${eyeY - 1.8}" r="1.45" fill="#ffffff" opacity="0.92"/>
            <circle cx="${cx + 1.6}" cy="${eyeY + 1.1}" r="0.75" fill="#ffffff" opacity="0.65"/>
          </g>
          <!-- Upper & Lower Rim -->
          <path d="${eyePath}" fill="none" stroke="${skin.deep}" stroke-width="0.9"/>
          <path d="M ${cx - rx},${eyeY} Q ${cx},${eyeY - ry * 1.35} ${cx + rx},${eyeY}" fill="none" stroke="#18151a" stroke-width="${lashWidth}" stroke-linecap="round"/>
          ${wing}
          ${crease}
        </g>
      `;
    };

    return renderSingleEye(leftX, 'L', eyeColor, leftRot) + renderSingleEye(rightX, 'R', rightColor, rightRot);
  }

  function buildEyebrowsSVG(o, hair) {
    const browColor = hair.base;
    const sw = o.eyebrow === 'thick' ? 3.2 : (o.eyebrow === 'thin' ? 1.5 : 2.3);
    let leftPath = 'M 71,80 Q 81,76 90,79';
    let rightPath = 'M 110,79 Q 119,76 129,80';

    if (o.eyebrow === 'straight') {
      leftPath = 'M 71,79 L 90,78.5';
      rightPath = 'M 110,78.5 L 129,79';
    } else if (o.eyebrow === 'arched' || o.eyebrow === 'angled') {
      leftPath = 'M 71,81 Q 79,73.5 90,79';
      rightPath = 'M 110,79 Q 121,73.5 129,81';
    }

    const browPiercing = o.piercing === 'eyebrow' ? `
      <circle cx="127" cy="75.5" r="1.3" fill="#d8d4cc"/>
      <circle cx="128.5" cy="81.5" r="1.3" fill="#d8d4cc"/>
    ` : '';

    return `
      <g fill="none" stroke="${browColor}" stroke-width="${sw}" stroke-linecap="round">
        <path d="${leftPath}"/>
        <path d="${rightPath}"/>
      </g>
      ${browPiercing}
    `;
  }

  function buildNoseSVG(o, skin) {
    const s = o.noseStyle;
    let bridge = 'M 98.5,91 C 98,99 97,105 96.5,109';
    let tip = 'M 94.5,110.5 Q 100,114 105.5,110.5';

    if (s === 'button' || s === 'snub') {
      bridge = 'M 99,95 C 98.5,101 98,105 97.5,108';
      tip = 'M 95.5,109.5 Q 100,112.5 104.5,109.5';
    } else if (s === 'roman' || s === 'aquiline') {
      bridge = 'M 98.5,89 C 96.5,97 97,104 96.5,110';
      tip = 'M 94,111 Q 100,115 106,111';
    } else if (s === 'broad') {
      tip = 'M 92.5,110.5 Q 100,114.5 107.5,110.5';
    }

    let piercingSVG = '';
    if (o.piercing === 'nose_stud') {
      piercingSVG = `<circle cx="105.5" cy="108.5" r="1.3" fill="#e2c98a" stroke="#5e4b22" stroke-width="0.5"/>`;
    } else if (o.piercing === 'septum') {
      piercingSVG = `<path d="M 97.5,112.5 A 2.6,2.6 0 1,0 102.5,112.5" fill="none" stroke="#d8d4cc" stroke-width="1.3" stroke-linecap="round"/>`;
    }

    return `
      <g>
        <!-- Soft nose bridge shadow -->
        <path d="M 98,91 L 94,110 L 100,112 Z" fill="${skin.shadow}" opacity="0.42"/>
        <path d="${bridge}" fill="none" stroke="${skin.deep}" stroke-width="1.25" stroke-linecap="round" opacity="0.8"/>
        <path d="${tip}" fill="none" stroke="${skin.deep}" stroke-width="1.4" stroke-linecap="round"/>
        ${piercingSVG}
      </g>
    `;
  }

  function buildLipsSVG(o, skin) {
    const s = o.lipsStyle;
    const lipCol = skin.lip;
    const w = s === 'wide' ? 11.5 : 9.5;
    const topH = s === 'full' || s === 'heart' ? 3.8 : (s === 'thin' ? 1.8 : 2.8);
    const botH = s === 'full' ? 4.8 : (s === 'thin' ? 2.2 : 3.6);
    const cornerY = s === 'upturned' ? 124.2 : (s === 'downturned' ? 126.8 : 125.5);
    const midY = 125.5;

    const labret = o.piercing === 'labret'
      ? `<circle cx="100" cy="${midY + botH + 2.2}" r="1.35" fill="#d8d4cc" stroke="#333" stroke-width="0.5"/>`
      : '';

    return `
      <g>
        <!-- Upper Lip with Cupid's Bow -->
        <path d="M ${100 - w},${cornerY} Q ${100 - w * 0.45},${midY - topH} 98.2,${midY - topH * 0.65} Q 100,${midY - topH * 0.35} 101.8,${midY - topH * 0.65} Q ${100 + w * 0.45},${midY - topH} ${100 + w},${cornerY} Q 100,${midY + 0.6} ${100 - w},${cornerY} Z" fill="${lipCol}" opacity="0.88"/>
        <!-- Lower Lip -->
        <path d="M ${100 - w + 0.5},${cornerY} Q 100,${midY + botH * 1.45} ${100 + w - 0.5},${cornerY} Q 100,${midY + 0.6} ${100 - w + 0.5},${cornerY} Z" fill="${lipCol}" opacity="0.72"/>
        <!-- Lower Lip Highlight -->
        <path d="M 96,${midY + botH * 0.55} Q 100,${midY + botH * 0.75} 104,${midY + botH * 0.55}" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.32"/>
        <!-- Mouth Center Seam -->
        <path d="M ${100 - w},${cornerY} Q 100,${midY + 0.8} ${100 + w},${cornerY}" fill="none" stroke="${skin.deep}" stroke-width="1.3" stroke-linecap="round"/>
        ${labret}
      </g>
    `;
  }

  function buildFacialHairSVG(o, hair) {
    const fh = o.facialHair;
    if (!fh || fh === 'clean') return '';
    const col = hair.base;
    let out = '';

    if (fh === 'stubble') {
      out += `<path d="M 65,104 C 66,128 80,144 100,145 C 120,144 134,128 135,104 C 132,122 118,136 100,137 C 82,136 68,122 65,104 Z" fill="${col}" opacity="0.22"/>`;
    } else if (fh === 'short_beard' || fh === 'full_beard') {
      const drop = fh === 'full_beard' ? 154 : 147;
      out += `
        <path d="M 63,100 C 63,130 78,${drop} 100,${drop} C 122,${drop} 137,130 137,100 L 132,100 C 130,122 118,134 100,134 C 82,134 70,122 68,100 Z" fill="${col}" opacity="0.9"/>
      `;
    } else if (fh === 'wizard') {
      out += `
        <path d="M 63,100 C 62,138 78,176 100,186 C 122,176 138,138 137,100 L 131,100 C 129,122 118,134 100,134 C 82,134 71,122 69,100 Z" fill="${col}"/>
      `;
    } else if (fh === 'goatee') {
      out += `<path d="M 88,131 Q 100,149 112,131 Q 100,136 88,131 Z" fill="${col}" opacity="0.9"/>`;
    } else if (fh === 'mutton_chops') {
      out += `
        <path d="M 63,92 C 63,118 68,134 80,138 L 82,124 C 74,118 70,106 69,92 Z" fill="${col}" opacity="0.88"/>
        <path d="M 137,92 C 137,118 132,134 120,138 L 118,124 C 126,118 130,106 131,92 Z" fill="${col}" opacity="0.88"/>
      `;
    }

    if (fh === 'mustache' || fh === 'chevron_mustache' || fh === 'handlebar' || fh === 'full_beard' || fh === 'wizard') {
      if (fh === 'handlebar') {
        out += `<path d="M 84,121 C 88,116 96,117 100,120 C 104,117 112,116 116,121 C 119,123 122,120 121,118" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`;
      } else {
        out += `<path d="M 87,121 Q 100,115.5 113,121 Q 100,119.5 87,121 Z" fill="${col}" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`;
      }
    }
    return out;
  }

  function buildFrontHairSVG(uid, o, hair) {
    const s = o.hairStyle;
    const fill = `url(#hairGrad-${uid})`;

    if (s === 'hijab') {
      return `
        <!-- Under-scarf forehead band -->
        <path d="M 63,76 Q 100,62 137,76 C 134,52 66,52 63,76 Z" fill="#18151d"/>
        <!-- Draped outer hijab framing face cleanly -->
        <path d="M 52,88 C 52,40 148,40 148,88 C 148,126 136,154 100,162 C 64,154 52,126 52,88 Z M 65,88 C 65,118 80,143 100,145 C 120,143 135,118 135,88 C 135,62 65,62 65,88 Z" fill="#27222d" fill-rule="evenodd" stroke="#141118" stroke-width="1.3"/>
        <path d="M 62,138 Q 100,160 138,142" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.3"/>
      `;
    }

    if (s === 'buzz_cut') {
      return `
        <path d="M 63,82 C 63,46 137,46 137,82 C 133,64 118,58 100,58 C 82,58 67,64 63,82 Z" fill="${hair.base}" opacity="0.55"/>
      `;
    }

    let crownSVG = '';
    if (s === 'pixie' || s === 'crop') {
      crownSVG = `
        <path d="M 60,86 C 58,42 142,42 140,86 C 135,68 122,58 104,59 C 90,60 72,66 60,86 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>
        <path d="M 76,58 Q 96,49 118,57" fill="none" stroke="${hair.highlight}" stroke-width="1.4" opacity="0.45"/>
      `;
    } else if (s === 'parted') {
      crownSVG = `
        <path d="M 59,88 C 56,40 144,40 141,88 C 136,68 122,58 108,56 C 95,64 74,70 59,88 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>
        <path d="M 108,47 L 105,57" fill="none" stroke="${hair.shadow}" stroke-width="1.4"/>
      `;
    } else {
      // Soft framing crown + temple locks for medium/long styles
      crownSVG = `
        <path d="M 57,94 C 54,38 146,38 143,94 C 138,70 126,58 100,56 C 74,58 62,70 57,94 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1.2"/>
        <!-- Temple framing locks -->
        <path d="M 60,76 C 56,96 58,118 66,132 C 63,114 63,94 67,74 Z" fill="${fill}"/>
        <path d="M 140,76 C 144,96 142,118 134,132 C 137,114 137,94 133,74 Z" fill="${fill}"/>
      `;
    }

    // Organic Bezier Bangs (never boxy rectangles!)
    let bangsSVG = '';
    if (o.bangs === 'straight') {
      bangsSVG = `
        <path d="M 67,66 C 74,54 126,54 133,66 L 131,74 C 120,73 112,74 106,72 L 104,67 L 101,73 C 93,74 84,73 69,74 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1"/>
      `;
    } else if (o.bangs === 'curtain') {
      bangsSVG = `
        <path d="M 100,55 C 84,58 70,68 63,86 C 74,78 88,68 100,60 C 112,68 126,78 137,86 C 130,68 116,58 100,55 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1"/>
      `;
    } else if (o.bangs === 'wispy') {
      bangsSVG = `
        <g fill="none" stroke="${hair.base}" stroke-width="2.1" stroke-linecap="round">
          <path d="M 86,57 Q 82,66 84,74"/>
          <path d="M 99,56 Q 97,65 100,73"/>
          <path d="M 113,57 Q 117,66 115,74"/>
        </g>
      `;
    } else if (o.bangs === 'micro') {
      bangsSVG = `
        <path d="M 70,63 C 78,54 122,54 130,63 L 128,68 Q 100,66 72,68 Z" fill="${fill}" stroke="${hair.shadow}" stroke-width="1"/>
      `;
    }

    return crownSVG + bangsSVG;
  }

  function buildGlassesSVG(o) {
    const g = o.glasses;
    if (!g || g === 'none') return '';
    const isSun = g === 'sunglasses';
    const strokeCol = g === 'cat_eye' ? '#6e2230' : (g === 'round_wire' ? '#b39b64' : '#1e1d22');
    const sw = (g === 'thick_frame' || isSun) ? 2.4 : 1.5;
    const lensFill = isSun ? 'rgba(16, 16, 20, 0.82)' : 'rgba(255, 255, 255, 0.07)';

    let lenses = '';
    if (g === 'square' || g === 'thick_frame') {
      lenses = `
        <rect x="69" y="83" width="24" height="16" rx="3.5" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
        <rect x="107" y="83" width="24" height="16" rx="3.5" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
      `;
    } else if (g === 'cat_eye') {
      lenses = `
        <path d="M 67,84 Q 81,81 93,86 Q 92,98 80,98 Q 69,97 67,84 Z" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
        <path d="M 133,84 Q 119,81 107,86 Q 108,98 120,98 Q 131,97 133,84 Z" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
      `;
    } else {
      lenses = `
        <ellipse cx="81" cy="91" rx="11.5" ry="9.5" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
        <ellipse cx="119" cy="91" rx="11.5" ry="9.5" fill="${lensFill}" stroke="${strokeCol}" stroke-width="${sw}"/>
      `;
    }

    return `
      <g>
        ${lenses}
        <path d="M 93,89 Q 100,86.5 107,89" fill="none" stroke="${strokeCol}" stroke-width="${sw}"/>
        <line x1="63" y1="88" x2="69" y2="88" stroke="${strokeCol}" stroke-width="1.4"/>
        <line x1="131" y1="88" x2="137" y2="88" stroke="${strokeCol}" stroke-width="1.4"/>
        <!-- Subtle lens glare -->
        <line x1="74" y1="86" x2="79" y2="94" stroke="rgba(255,255,255,0.28)" stroke-width="1.3" stroke-linecap="round"/>
        <line x1="112" y1="86" x2="117" y2="94" stroke="rgba(255,255,255,0.28)" stroke-width="1.3" stroke-linecap="round"/>
      </g>
    `;
  }

  function buildHeadwearSVG(o) {
    const hw = o.headwear;
    if (!hw || hw === 'none') return '';
    if (hw === 'beanie') {
      return `
        <g>
          <path d="M 59,66 C 60,34 140,34 141,66 Z" fill="#24252d" stroke="#131419" stroke-width="1.3"/>
          <rect x="57" y="59" width="86" height="12" rx="4" fill="#2e303a" stroke="#131419" stroke-width="1.2"/>
          <path d="M 68,60 L 68,70 M 80,60 L 80,70 M 92,60 L 92,70 M 104,60 L 104,70 M 116,60 L 116,70 M 128,60 L 128,70" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        </g>
      `;
    }
    if (hw === 'beret') {
      return `
        <g>
          <path d="M 56,64 C 52,42 98,32 146,50 C 148,60 136,66 122,66 C 98,62 74,64 56,64 Z" fill="#5e1924" stroke="#360c13" stroke-width="1.3"/>
          <path d="M 100,39 L 104,34" stroke="#360c13" stroke-width="2" stroke-linecap="round"/>
        </g>
      `;
    }
    if (hw === 'baseball_cap') {
      return `
        <g>
          <path d="M 60,64 C 62,36 138,36 140,64 Z" fill="#1d273b" stroke="#0f1522" stroke-width="1.3"/>
          <path d="M 54,63 Q 100,54 146,63 Q 124,70 100,69 Q 76,70 54,63 Z" fill="#151d2d" stroke="#0f1522" stroke-width="1.2"/>
        </g>
      `;
    }
    return '';
  }

  function buildGothicAvatarSVG(rawOptions = {}) {
    const uid = ++uidCounter;
    const o = sanitizeAvatarOptions(rawOptions);
    const skin = AVATAR_PALETTES.skin[o.skin];
    const eyeColor = AVATAR_PALETTES.eyes[o.eyeColor];
    const hair = AVATAR_PALETTES.hair[o.hairColor];
    const clothCol = AVATAR_PALETTES.clothing[o.clothingColor];

    const isInfant = o.age <= 2;
    const isChild = o.age > 2 && o.age < 13;
    const facePath = getFaceContourPath(o.faceShape, isChild);
    const scaleGroup = isChild ? 'transform="translate(0, 10) scale(0.92)" transform-origin="100 110"' : '';

    const bodyContent = isInfant
      ? buildInfantSVG(uid, o, skin, eyeColor, hair)
      : `
        <g ${scaleGroup}>
          ${buildBackHairSVG(uid, o, hair)}
          ${buildNeckAndClothingSVG(uid, o, skin, clothCol)}
          ${buildEarsSVG(o, skin)}
          <!-- Sculpted Head Contour -->
          <path d="${facePath}" fill="url(#skinGrad-${uid})" stroke="${skin.deep}" stroke-width="1.25"/>
          <!-- Cheek Blush -->
          <ellipse cx="76" cy="106" rx="9" ry="5" fill="${skin.blush}"/>
          <ellipse cx="124" cy="106" rx="9" ry="5" fill="${skin.blush}"/>
          ${buildMarkingsAndAgeSVG(o, skin)}
          ${buildFacialHairSVG(o, hair)}
          ${buildNoseSVG(o, skin)}
          ${buildLipsSVG(o, skin)}
          ${buildEyesSVG(uid, o, skin, eyeColor)}
          ${buildEyebrowsSVG(o, hair)}
          ${buildFrontHairSVG(uid, o, hair)}
          ${buildGlassesSVG(o)}
          ${buildHeadwearSVG(o)}
        </g>
      `;

    return `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Character Portrait" style="display:block;width:100%;height:100%;">
      <defs>
        <radialGradient id="bgGrad-${uid}" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stop-color="#2c2933"/>
          <stop offset="62%" stop-color="#17151c"/>
          <stop offset="100%" stop-color="#0b0a0e"/>
        </radialGradient>
        <radialGradient id="skinGrad-${uid}" cx="48%" cy="38%" r="60%">
          <stop offset="0%" stop-color="${skin.highlight}"/>
          <stop offset="58%" stop-color="${skin.base}"/>
          <stop offset="100%" stop-color="${skin.shadow}"/>
        </radialGradient>
        <linearGradient id="hairGrad-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${hair.highlight}"/>
          <stop offset="35%" stop-color="${hair.base}"/>
          <stop offset="100%" stop-color="${hair.shadow}"/>
        </linearGradient>
        <linearGradient id="clothShade-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.05)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.38)"/>
        </linearGradient>
      </defs>

      <!-- Atmospheric Cameo Backdrop -->
      <rect width="200" height="200" fill="url(#bgGrad-${uid})"/>
      <circle cx="100" cy="96" r="76" fill="none" stroke="rgba(212, 185, 128, 0.10)" stroke-width="1"/>

      ${bodyContent}

      <!-- Subtle Vignette & Antique Hairline Frame -->
      <rect x="3" y="3" width="194" height="194" rx="6" fill="none" stroke="rgba(185, 160, 110, 0.32)" stroke-width="1.2"/>
    </svg>`;
  }

  function drawGothicAvatar(target, options = {}) {
    if (!target) return;
    const svgMarkup = buildGothicAvatarSVG(options);

    // If target is a <canvas>, mount/update a sibling SVG host inside its wrapper so
    // every existing canvas reference in game.js renders a true vector <svg>.
    if (target.tagName && target.tagName.toLowerCase() === 'canvas') {
      const parent = target.parentElement;
      if (parent) {
        target.style.display = 'none';
        let host = parent.querySelector('.gothic-svg-host');
        if (!host) {
          host = document.createElement('div');
          host.className = 'gothic-svg-host w-full h-full';
          host.style.cssText = 'width:100%;height:100%;display:block;line-height:0;';
          parent.appendChild(host);
        }
        host.innerHTML = svgMarkup;
        return;
      }
    }

    // Fallback if passed a container div directly
    target.innerHTML = svgMarkup;
  }

  window.drawGothicAvatar = drawGothicAvatar;
  window.buildGothicAvatarSVG = buildGothicAvatarSVG;
  window.sanitizeAvatarOptions = sanitizeAvatarOptions;
  window.AVATAR_PALETTES = AVATAR_PALETTES;
})();
