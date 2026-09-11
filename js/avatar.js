// Modular Procedural Avatar Canvas Renderer for Terrible Little Lives
// Designed based on the TLL Character Creator Design System:
// 1. Face Shapes & Features | 2. Eyes | 3. Hair | 4. Facial Hair | 5. Accessories | 6. Body & Build | 7. Clothing | 8. Age-Specific Options

(function() {
  'use strict';

  // --- COMPREHENSIVE PALETTES ---
  const AVATAR_PALETTES = {
    // 12 Diverse Skin Complexions (Porcelain to Deep Melanin + Gothic Undersaturated)
    skin: {
      porcelain: { base: '#f4ede4', shadow: '#d6c8b7', highlight: '#fdfbf7', blush: 'rgba(230, 160, 160, 0.28)' },
      ivory: { base: '#ebd7c5', shadow: '#cca993', highlight: '#f7ebe0', blush: 'rgba(225, 145, 145, 0.26)' },
      warm_beige: { base: '#d8b598', shadow: '#b28b6d', highlight: '#edd2bb', blush: 'rgba(205, 125, 125, 0.24)' },
      golden_peach: { base: '#e4b68e', shadow: '#be885b', highlight: '#f6d3b3', blush: 'rgba(215, 120, 110, 0.28)' },
      olive: { base: '#bba789', shadow: '#937f62', highlight: '#d7c7af', blush: 'rgba(180, 120, 110, 0.22)' },
      warm_bronze: { base: '#a77953', shadow: '#7d5231', highlight: '#c89d77', blush: 'rgba(165, 90, 80, 0.25)' },
      chestnut: { base: '#7f4f2c', shadow: '#562f14', highlight: '#a36d46', blush: 'rgba(140, 60, 60, 0.25)' },
      rich_espresso: { base: '#553420', shadow: '#361d0f', highlight: '#784d33', blush: 'rgba(110, 45, 45, 0.25)' },
      deep_ebony: { base: '#362218', shadow: '#20130c', highlight: '#52372a', blush: 'rgba(90, 35, 35, 0.25)' },
      // Gothic / Uncanny Undertones
      ash: { base: '#b8b6af', shadow: '#8f8d85', highlight: '#d3d1cb', blush: 'rgba(140, 130, 145, 0.20)' },
      sallow: { base: '#cfc69f', shadow: '#a69d76', highlight: '#e4dcb8', blush: 'rgba(165, 145, 110, 0.20)' },
      bruised: { base: '#a89db2', shadow: '#81758c', highlight: '#c8bfd1', blush: 'rgba(135, 80, 140, 0.28)' },
      mortuary: { base: '#cdd3d4', shadow: '#9ea6a7', highlight: '#e6ebec', blush: 'rgba(120, 135, 150, 0.20)' }
    },

    // Eyes: 10 Natural + 8 Rare / Supernatural
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
      // Rare & Occult
      golden: '#cca029',
      violet: '#684589',
      albino_red: '#b8323e',
      ice_blue: '#78b5db',
      crimson: '#8e1b24',
      milky_blind: '#cfd6dc',
      emerald_glow: '#20a361',
      starburst: '#9c4d93'
    },

    // Hair Colors: 11 Natural + 12 Dyed / Alternative
    hair: {
      raven: { base: '#171719', shadow: '#0b0b0d', highlight: '#34343a' },
      dark_brown: { base: '#33231a', shadow: '#1e140d', highlight: '#4d372c' },
      ash_brown: { base: '#4a3f37', shadow: '#2e251f', highlight: '#695a51' },
      chestnut: { base: '#5c321d', shadow: '#3b1c0e', highlight: '#7d4b31' },
      auburn: { base: '#6e2d1d', shadow: '#46180c', highlight: '#95432f' },
      ginger_red: { base: '#a84724', shadow: '#742b10', highlight: '#ce653e' },
      strawberry_blonde: { base: '#b57956', shadow: '#875133', highlight: '#d59874' },
      dark_blonde: { base: '#8f774e', shadow: '#635031', highlight: '#b2986c' },
      golden_blonde: { base: '#bf9e5a', shadow: '#8d7138', highlight: '#dec07f' },
      platinum: { base: '#dedbd2', shadow: '#b1ada2', highlight: '#f6f4ed' },
      silver_gray: { base: '#8c8c91', shadow: '#626266', highlight: '#b5b5ba' },
      pure_white: { base: '#f0eff2', shadow: '#c4c3c8', highlight: '#ffffff' },
      // Dyed / Fashion / Alternative
      pastel_pink: { base: '#d8869c', shadow: '#a95a70', highlight: '#f2abc0' },
      rose: { base: '#b84d69', shadow: '#862d45', highlight: '#dc738f' },
      peach: { base: '#d48064', shadow: '#a5573d', highlight: '#efa289' },
      crimson_dye: { base: '#99182c', shadow: '#650917', highlight: '#c8344c' },
      neon_orange: { base: '#c9591e', shadow: '#8f380a', highlight: '#ea7c43' },
      moss_green: { base: '#46673f', shadow: '#2b4425', highlight: '#678d5e' },
      teal: { base: '#2b7875', shadow: '#174e4c', highlight: '#469d9a' },
      deep_blue: { base: '#25447a', shadow: '#12264c', highlight: '#3f65aa' },
      royal_purple: { base: '#562f7a', shadow: '#351950', highlight: '#7a4ba4' },
      lavender: { base: '#9a7cb8', shadow: '#6e518c', highlight: '#be9fda' },
      split_black_white: { base: '#171719', alt: '#dedbd2', shadow: '#0b0b0d', highlight: '#34343a' }
    },

    // Clothing Palettes
    clothing: {
      black: '#191a1d',
      charcoal: '#2d3036',
      navy: '#1d273a',
      burgundy: '#471a23',
      forest: '#1b3323',
      tweed_brown: '#4b3d32',
      cream: '#e3ddd1',
      white: '#eceae4',
      denim: '#39536e',
      school_maroon: '#5c1e28',
      school_navy: '#1b2a47',
      scrubs_teal: '#28696b',
      mustard: '#9b762b'
    }
  };

  // --- MAIN DRAWING PIPELINE ---
  function drawGothicAvatar(canvas, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Normalizing options
    const skinKey = options.skin || 'porcelain';
    const skin = AVATAR_PALETTES.skin[skinKey] || AVATAR_PALETTES.skin.porcelain;
    
    const eyeColorKey = options.eyeColor || 'black';
    const eyeColor = AVATAR_PALETTES.eyes[eyeColorKey] || AVATAR_PALETTES.eyes.black;
    const eyeShape = options.eyeShape || 'almond';
    const eyelid = options.eyelid || 'double';
    const eyeExtra = options.eyeExtra || 'none'; // 'tired_eyes', 'eye_bags', 'eyeliner', 'none'
    const heterochromia = options.heterochromia || null; // optional second eye color

    const hairColorKey = options.hairColor || 'raven';
    const hair = AVATAR_PALETTES.hair[hairColorKey] || AVATAR_PALETTES.hair.raven;
    const hairStyle = options.hairStyle || 'parted';
    const hairTexture = options.hairTexture || 'straight'; // 'straight', 'wavy', 'curly', 'coily'
    const bangs = options.bangs || 'none'; // 'curtain', 'straight', 'wispy', 'micro', 'none'

    const faceShape = options.faceShape || 'oval'; // oval, round, square, rectangle, heart, diamond, triangle, inverted_triangle, oblong, wide
    const noseStyle = options.noseStyle || 'straight'; // button, straight, roman, aquiline, broad, snub
    const lipsStyle = options.lipsStyle || 'medium'; // thin, medium, full, heart, wide
    const eyebrow = options.eyebrow || 'soft_arch'; // straight, arched, soft_arch, rounded, thick, thin, feathered
    const facialHair = options.facialHair || 'clean'; // clean, stubble, mustache, short_beard, full_beard, goatee, mutton_chops
    const mark = options.mark || 'none'; // freckles, moles, vitiligo, scar, acne, cleft_chin, none
    const glasses = options.glasses || 'none'; // round_wire, square, thick_frame, cat_eye, sunglasses, reading, none
    const headwear = options.headwear || 'none'; // beanie, beret, cap, sun_hat, knit_hood, hijab, none
    const clothing = options.clothing || 'casual'; // casual, hoodie, sweater, prep_blazer, elite_uniform, suit, lab_coat, scrubs, goth
    const clothingColor = options.clothingColor || 'charcoal';
    const piercing = options.piercing || 'none'; // nose_stud, septum, eyebrow, labret, earrings, none
    const necklace = options.necklace || 'none'; // choker, chain, pendant, pearls, none

    const age = options.age !== undefined ? options.age : 16;

    // Reset Canvas
    ctx.clearRect(0, 0, w, h);

    // 1. Daguerreotype Vignette Backdrop
    drawBackdrop(ctx, w, h);

    // 2. Infant Lifecycle Mode (0-2)
    if (age <= 2) {
      drawInfantStage(ctx, w, h, skin, eyeColor, eyeShape, hair);
      drawDaguerreotypeBorder(ctx, w, h);
      return;
    }

    // 3. Torso & Clothing Layer
    drawClothingLayer(ctx, w, h, clothing, clothingColor, age, options.gender);

    // 4. Neck & Neckwear
    drawNeckLayer(ctx, w, h, skin, necklace, age);

    // 5. Head & Face Shape (10 Variations)
    drawFaceShapeLayer(ctx, w, h, faceShape, skin, age);

    // 6. Age Lines & Mature Details (Child -> Teen -> Adult -> Elder)
    drawAgeProgressionLines(ctx, w, h, age, skin);

    // 7. Facial Markings (Freckles, Moles, Vitiligo, Scars, Acne)
    drawFacialMarkings(ctx, w, h, mark, skin, age);

    // 8. Nose
    drawNoseLayer(ctx, w, h, noseStyle, skin, age);

    // 9. Mouth & Lips
    drawLipsLayer(ctx, w, h, lipsStyle, skin, age);

    // 10. Eyes (10 Shapes, Eyelids, Iris, Lashes, Extras)
    drawEyesLayer(ctx, w, h, eyeShape, eyeColor, eyelid, eyeExtra, heterochromia, skin, age);

    // 11. Eyebrows
    drawEyebrowsLayer(ctx, w, h, eyebrow, hair, age);

    // 12. Facial Hair (Stubble, Mustaches, Beards - suppressed if child/infant)
    if (age >= 13 && facialHair !== 'clean') {
      drawFacialHairLayer(ctx, w, h, facialHair, hair, age);
    }

    // 13. Hairstyle & Bangs
    drawHairLayer(ctx, w, h, hairStyle, hairTexture, bangs, hair, headwear, age);

    // 14. Accessories & Piercings
    if (piercing !== 'none') {
      drawPiercings(ctx, w, h, piercing, skin);
    }
    if (glasses !== 'none') {
      drawGlassesLayer(ctx, w, h, glasses, age);
    }
    if (headwear !== 'none') {
      drawHeadwearLayer(ctx, w, h, headwear, hair);
    }

    // 15. Antique Daguerreotype Brass Rim
    drawDaguerreotypeBorder(ctx, w, h);
  }

  // --- SUB-RENDERERS ---

  // 1. Backdrop
  function drawBackdrop(ctx, w, h) {
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.08, w / 2, h / 2, w * 0.72);
    bgGrad.addColorStop(0, '#2b2d35');
    bgGrad.addColorStop(0.55, '#16181d');
    bgGrad.addColorStop(1, '#0b0c0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Antique plate scratch textures
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.04); ctx.lineTo(w * 0.18, h * 0.92);
    ctx.moveTo(w * 0.82, h * 0.12); ctx.lineTo(w * 0.88, h * 0.88);
    ctx.moveTo(w * 0.08, h * 0.76); ctx.lineTo(w * 0.38, h * 0.82);
    ctx.stroke();
  }

  // 2. Infant Stage (Age 0-2)
  function drawInfantStage(ctx, w, h, skin, eyeColor, eyeShape, hair) {
    // Swaddling blanket
    ctx.fillStyle = '#eae6dd';
    ctx.beginPath();
    ctx.moveTo(w * 0.18, h);
    ctx.bezierCurveTo(w * 0.15, h * 0.65, w * 0.85, h * 0.65, w * 0.82, h);
    ctx.closePath();
    ctx.fill();

    // Baby bonnet rim
    ctx.fillStyle = '#d8d2c4';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.46, w * 0.32, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chubby baby head
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.48, w * 0.25, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rosy baby cheeks
    ctx.fillStyle = skin.blush || 'rgba(230, 150, 150, 0.3)';
    ctx.beginPath();
    ctx.ellipse(w * 0.36, h * 0.53, w * 0.08, h * 0.06, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.64, h * 0.53, w * 0.08, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Large innocent baby eyes
    const eyeY = h * 0.46;
    [w * 0.39, w * 0.61].forEach(x => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, eyeY, w * 0.055, 0, Math.PI * 2);
      ctx.fill();

      // Iris
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(x, eyeY, w * 0.038, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0a0a0c';
      ctx.beginPath();
      ctx.arc(x, eyeY, w * 0.02, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - w * 0.012, eyeY - w * 0.012, w * 0.012, 0, Math.PI * 2);
      ctx.fill();
    });

    // Baby brows
    ctx.strokeStyle = hair.base || '#554433';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.41); ctx.lineTo(w * 0.44, h * 0.41);
    ctx.moveTo(w * 0.56, h * 0.41); ctx.lineTo(w * 0.66, h * 0.41);
    ctx.stroke();

    // Tiny button nose
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.52, w * 0.02, 0, Math.PI * 2);
    ctx.fill();

    // Cute baby mouth / pacifier
    ctx.fillStyle = '#d0707a';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.58, w * 0.03, 0, Math.PI);
    ctx.fill();

    // Tuft of hair peeking out
    ctx.fillStyle = hair.base;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.28, w * 0.06, w * 0.08, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Torso & Clothing Layer
  function drawClothingLayer(ctx, w, h, style, colorKey, age, gender) {
    const col = AVATAR_PALETTES.clothing[colorKey] || AVATAR_PALETTES.clothing.charcoal;
    const isChild = age < 13;

    ctx.fillStyle = col;
    ctx.beginPath();
    // Shoulder curves
    const shoulderLeftX = isChild ? w * 0.22 : w * 0.12;
    const shoulderRightX = isChild ? w * 0.78 : w * 0.88;
    const shoulderY = isChild ? h * 0.74 : h * 0.70;

    ctx.moveTo(shoulderLeftX, h);
    ctx.bezierCurveTo(shoulderLeftX, shoulderY, w * 0.35, shoulderY - h * 0.03, w * 0.38, shoulderY - h * 0.03);
    ctx.lineTo(w * 0.62, shoulderY - h * 0.03);
    ctx.bezierCurveTo(w * 0.65, shoulderY - h * 0.03, shoulderRightX, shoulderY, shoulderRightX, h);
    ctx.closePath();
    ctx.fill();

    // Outfit Style Specific Details
    if (style === 'prep_blazer' || style === 'elite_uniform') {
      // V-neck Lapels
      ctx.fillStyle = '#1c1c24';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.5, h * 0.82);
      ctx.lineTo(w * 0.58, shoulderY - h * 0.03);
      ctx.fill();

      // Shirt inside
      ctx.fillStyle = '#f2efe9';
      ctx.beginPath();
      ctx.moveTo(w * 0.45, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.lineTo(w * 0.55, shoulderY - h * 0.03);
      ctx.fill();

      // Tie
      ctx.fillStyle = style === 'elite_uniform' ? '#8a1d2e' : '#2e4372';
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.69);
      ctx.lineTo(w * 0.52, h * 0.69);
      ctx.lineTo(w * 0.53, h * 0.88);
      ctx.lineTo(w * 0.5, h * 0.92);
      ctx.lineTo(w * 0.47, h * 0.88);
      ctx.closePath();
      ctx.fill();

      // Golden School Crest Badge for Elite
      if (style === 'elite_uniform') {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(w * 0.34, h * 0.78, w * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'hoodie') {
      // Hoodie neckline with drawstrings
      ctx.strokeStyle = '#22232a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.68, w * 0.14, h * 0.05, 0, 0, Math.PI);
      ctx.stroke();

      // Strings
      ctx.strokeStyle = '#e0dbcd';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.46, h * 0.70); ctx.lineTo(w * 0.46, h * 0.82);
      ctx.moveTo(w * 0.54, h * 0.70); ctx.lineTo(w * 0.54, h * 0.80);
      ctx.stroke();
    } else if (style === 'turtleneck' || style === 'goth') {
      // High ribbed collar
      ctx.fillStyle = '#101014';
      ctx.fillRect(w * 0.40, h * 0.60, w * 0.20, h * 0.10);
      // Rib lines
      ctx.strokeStyle = '#272730';
      ctx.lineWidth = 1;
      for (let rx = w * 0.42; rx <= w * 0.58; rx += w * 0.03) {
        ctx.beginPath();
        ctx.moveTo(rx, h * 0.60);
        ctx.lineTo(rx, h * 0.70);
        ctx.stroke();
      }
    } else if (style === 'lab_coat' || style === 'scrubs') {
      // Medical / Science Collar
      ctx.fillStyle = style === 'lab_coat' ? '#f5f5f7' : '#28696b';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.66);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.lineTo(w * 0.58, h * 0.66);
      ctx.lineTo(w * 0.65, h);
      ctx.lineTo(w * 0.35, h);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'suit') {
      // Formal Suit Jacket & Tie
      ctx.fillStyle = '#0f1014';
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.66);
      ctx.lineTo(w * 0.5, h * 0.84);
      ctx.lineTo(w * 0.62, h * 0.66);
      ctx.fill();

      // White shirt triangle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, h * 0.66);
      ctx.lineTo(w * 0.5, h * 0.79);
      ctx.lineTo(w * 0.56, h * 0.66);
      ctx.fill();

      // Dark tie
      ctx.fillStyle = '#611624';
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.68);
      ctx.lineTo(w * 0.52, h * 0.68);
      ctx.lineTo(w * 0.53, h * 0.88);
      ctx.lineTo(w * 0.5, h * 0.91);
      ctx.lineTo(w * 0.47, h * 0.88);
      ctx.closePath();
      ctx.fill();
    } else {
      // Crewneck Casual T-shirt or Sweater
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.68, w * 0.12, h * 0.04, 0, 0, Math.PI);
      ctx.stroke();
    }
  }

  // 4. Neck Layer
  function drawNeckLayer(ctx, w, h, skin, necklace, age) {
    const isChild = age < 13;
    const neckW = isChild ? w * 0.10 : w * 0.13;
    const neckH = h * 0.14;

    ctx.fillStyle = skin.shadow;
    ctx.fillRect(w * 0.5 - neckW / 2, h * 0.52, neckW, neckH);

    // Subtle throat / clavicle contour
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h * 0.56);
    ctx.lineTo(w * 0.50, h * 0.61);
    ctx.lineTo(w * 0.52, h * 0.56);
    ctx.stroke();

    // Necklaces
    if (necklace === 'choker') {
      ctx.fillStyle = '#141416';
      ctx.fillRect(w * 0.43, h * 0.58, w * 0.14, h * 0.025);
      // Silver charm
      ctx.fillStyle = '#d6d6df';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.605, w * 0.015, 0, Math.PI * 2);
      ctx.fill();
    } else if (necklace === 'pearls') {
      ctx.fillStyle = '#f0eef5';
      for (let px = w * 0.43; px <= w * 0.57; px += w * 0.02) {
        ctx.beginPath();
        const py = h * 0.62 + Math.sin((px - w * 0.43) / (w * 0.14) * Math.PI) * (h * 0.03);
        ctx.arc(px, py, w * 0.01, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (necklace === 'chain' || necklace === 'pendant') {
      ctx.strokeStyle = '#c5a046';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.56, w * 0.08, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
      if (necklace === 'pendant') {
        ctx.fillStyle = '#9e2235';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.64, w * 0.018, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 5. Head & Face Shape (10 Face Shapes from Sheet 1)
  function drawFaceShapeLayer(ctx, w, h, faceShape, skin, age) {
    const isChild = age < 13;
    const isElder = age >= 51;
    const centerX = w * 0.5;
    const centerY = isChild ? h * 0.44 : h * 0.42;

    ctx.fillStyle = skin.base;
    ctx.beginPath();

    // 10 Face Shape Silhouettes
    if (faceShape === 'round' || isChild) {
      // 02 Round: soft, wide cheeks, gentle round chin
      const radX = isChild ? w * 0.23 : w * 0.24;
      const radY = isChild ? h * 0.24 : h * 0.25;
      ctx.ellipse(centerX, centerY, radX, radY, 0, 0, Math.PI * 2);
    } else if (faceShape === 'square') {
      // 03 Square: strong jawline, balanced width
      ctx.moveTo(centerX - w * 0.21, centerY - h * 0.24);
      ctx.bezierCurveTo(centerX - w * 0.23, centerY, centerX - w * 0.22, centerY + h * 0.16, centerX - w * 0.16, centerY + h * 0.24);
      ctx.lineTo(centerX + w * 0.16, centerY + h * 0.24);
      ctx.bezierCurveTo(centerX + w * 0.22, centerY + h * 0.16, centerX + w * 0.23, centerY, centerX + w * 0.21, centerY - h * 0.24);
      ctx.closePath();
    } else if (faceShape === 'rectangle') {
      // 04 Rectangle: tall, straight sides, broad chin
      ctx.moveTo(centerX - w * 0.19, centerY - h * 0.27);
      ctx.bezierCurveTo(centerX - w * 0.21, centerY - h * 0.05, centerX - w * 0.20, centerY + h * 0.16, centerX - w * 0.15, centerY + h * 0.27);
      ctx.lineTo(centerX + w * 0.15, centerY + h * 0.27);
      ctx.bezierCurveTo(centerX + w * 0.20, centerY + h * 0.16, centerX + w * 0.21, centerY - h * 0.05, centerX + w * 0.19, centerY - h * 0.27);
      ctx.closePath();
    } else if (faceShape === 'heart') {
      // 05 Heart: wide forehead, tapered pointed chin
      ctx.moveTo(centerX - w * 0.22, centerY - h * 0.22);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.08, centerX - w * 0.18, centerY + h * 0.12, centerX, centerY + h * 0.26);
      ctx.bezierCurveTo(centerX + w * 0.18, centerY + h * 0.12, centerX + w * 0.24, centerY - h * 0.08, centerX + w * 0.22, centerY - h * 0.22);
      ctx.closePath();
    } else if (faceShape === 'diamond') {
      // 06 Diamond: high narrow forehead, wide cheekbones, narrow chin
      ctx.moveTo(centerX, centerY - h * 0.26);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.12, centerX - w * 0.25, centerY + h * 0.04, centerX, centerY + h * 0.26);
      ctx.bezierCurveTo(centerX + w * 0.25, centerY + h * 0.04, centerX + w * 0.24, centerY - h * 0.12, centerX, centerY - h * 0.26);
      ctx.closePath();
    } else if (faceShape === 'triangle') {
      // 07 Triangle: narrow forehead, widening to prominent jaw
      ctx.moveTo(centerX - w * 0.17, centerY - h * 0.25);
      ctx.bezierCurveTo(centerX - w * 0.18, centerY - h * 0.08, centerX - w * 0.24, centerY + h * 0.14, centerX - w * 0.18, centerY + h * 0.25);
      ctx.lineTo(centerX + w * 0.18, centerY + h * 0.25);
      ctx.bezierCurveTo(centerX + w * 0.24, centerY + h * 0.14, centerX + w * 0.18, centerY - h * 0.08, centerX + w * 0.17, centerY - h * 0.25);
      ctx.closePath();
    } else if (faceShape === 'inverted_triangle') {
      // 08 Inverted Triangle: wide forehead, sharp taper
      ctx.moveTo(centerX - w * 0.23, centerY - h * 0.24);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.08, centerX - w * 0.16, centerY + h * 0.14, centerX, centerY + h * 0.25);
      ctx.bezierCurveTo(centerX + w * 0.16, centerY + h * 0.14, centerX + w * 0.24, centerY - h * 0.08, centerX + w * 0.23, centerY - h * 0.24);
      ctx.closePath();
    } else if (faceShape === 'oblong') {
      // 09 Oblong: longer than wide, rounded chin
      ctx.ellipse(centerX, centerY, w * 0.19, h * 0.28, 0, 0, Math.PI * 2);
    } else if (faceShape === 'wide') {
      // 10 Wide: fuller lateral presence
      ctx.ellipse(centerX, centerY, w * 0.25, h * 0.23, 0, 0, Math.PI * 2);
    } else {
      // 01 Oval (Default classic harmonious proportions)
      ctx.ellipse(centerX, centerY, w * 0.21, h * 0.26, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Chin / Cheekbone shading
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + (isChild ? h * 0.14 : h * 0.17), w * 0.12, h * 0.07, 0, 0, Math.PI);
    ctx.fill();

    // Cheek blush (youthful vitality or natural glow)
    ctx.fillStyle = skin.blush || 'rgba(215, 140, 140, 0.18)';
    ctx.beginPath();
    ctx.ellipse(centerX - w * 0.14, centerY + h * 0.05, w * 0.06, h * 0.04, -0.1, 0, Math.PI * 2);
    ctx.ellipse(centerX + w * 0.14, centerY + h * 0.05, w * 0.06, h * 0.04, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(centerX - w * 0.22, centerY + h * 0.02, w * 0.035, h * 0.07, 0, 0, Math.PI * 2);
    ctx.ellipse(centerX + w * 0.22, centerY + h * 0.02, w * 0.035, h * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Age Progression Lines (Sheet 8: Baby fat -> Acne -> Fine lines -> Wrinkles)
  function drawAgeProgressionLines(ctx, w, h, age, skin) {
    const centerX = w * 0.5;

    if (age <= 12) {
      // Child: Soft baby fat contours under eyes
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX - w * 0.10, h * 0.45, w * 0.04, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(centerX + w * 0.10, h * 0.45, w * 0.04, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else if (age >= 13 && age <= 17) {
      // Teen: Crisp skin, occasional subtle brow definition
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.04, h * 0.35); ctx.lineTo(centerX - w * 0.02, h * 0.37);
      ctx.stroke();
    } else if (age >= 31 && age <= 50) {
      // Adult: Nasolabial smile lines + light crow's feet
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.lineWidth = 1.2;
      // Nasolabial fold
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.09, h * 0.47); ctx.lineTo(centerX - w * 0.12, h * 0.54);
      ctx.moveTo(centerX + w * 0.09, h * 0.47); ctx.lineTo(centerX + w * 0.12, h * 0.54);
      // Crow's feet
      ctx.moveTo(centerX - w * 0.18, h * 0.40); ctx.lineTo(centerX - w * 0.20, h * 0.41);
      ctx.moveTo(centerX + w * 0.18, h * 0.40); ctx.lineTo(centerX + w * 0.20, h * 0.41);
      ctx.stroke();
    } else if (age >= 51) {
      // Elder: Forehead worry lines, deeper nasolabial folds, under-eye bags, marionette lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.24)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Forehead
      ctx.moveTo(centerX - w * 0.12, h * 0.28); ctx.lineTo(centerX + w * 0.12, h * 0.28);
      ctx.moveTo(centerX - w * 0.10, h * 0.31); ctx.lineTo(centerX + w * 0.10, h * 0.31);
      // Nasolabial & Marionette lines
      ctx.moveTo(centerX - w * 0.08, h * 0.47); ctx.lineTo(centerX - w * 0.13, h * 0.55); ctx.lineTo(centerX - w * 0.11, h * 0.60);
      ctx.moveTo(centerX + w * 0.08, h * 0.47); ctx.lineTo(centerX + w * 0.13, h * 0.55); ctx.lineTo(centerX + w * 0.11, h * 0.60);
      // Deep eye bags
      ctx.arc(centerX - w * 0.10, h * 0.43, w * 0.06, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(centerX + w * 0.10, h * 0.43, w * 0.06, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }
  }

  // 7. Facial Markings (Sheet 1: Freckles, Moles, Vitiligo, Scars, Acne, Cleft Chin)
  function drawFacialMarkings(ctx, w, h, mark, skin, age) {
    const centerX = w * 0.5;

    if (mark === 'freckles' || mark === 'light_freckles') {
      ctx.fillStyle = '#8f5938';
      const spots = [
        [-0.08, 0.44], [-0.05, 0.46], [-0.03, 0.45], [0, 0.46], [0.03, 0.45], [0.06, 0.46], [0.09, 0.44],
        [-0.10, 0.46], [-0.06, 0.48], [0.05, 0.48], [0.08, 0.47], [-0.02, 0.47], [0.01, 0.48]
      ];
      spots.forEach(([ox, oy]) => {
        ctx.beginPath();
        ctx.arc(centerX + ox * w, oy * h, w * 0.007, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mark === 'moles') {
      ctx.fillStyle = '#3a2012';
      // Beauty marks on cheek & near brow
      ctx.beginPath();
      ctx.arc(centerX - w * 0.11, h * 0.51, w * 0.012, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.13, h * 0.35, w * 0.01, 0, Math.PI * 2);
      ctx.fill();
    } else if (mark === 'vitiligo') {
      // Depigmented artistic skin patches
      ctx.fillStyle = '#f8f5ee';
      ctx.beginPath();
      ctx.ellipse(centerX - w * 0.08, h * 0.42, w * 0.07, h * 0.05, 0.3, 0, Math.PI * 2);
      ctx.ellipse(centerX + w * 0.12, h * 0.48, w * 0.06, h * 0.04, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (mark === 'scar') {
      // Diagonal healed cheek scar
      ctx.strokeStyle = '#a44747';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.08, h * 0.42);
      ctx.lineTo(centerX + w * 0.15, h * 0.53);
      ctx.stroke();
      // Stitch marks
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.09, h * 0.45); ctx.lineTo(centerX + w * 0.12, h * 0.44);
      ctx.moveTo(centerX + w * 0.11, h * 0.48); ctx.lineTo(centerX + w * 0.14, h * 0.47);
      ctx.stroke();
    } else if (mark === 'acne' || (age >= 13 && age <= 18 && mark === 'acne_teen')) {
      // Adolescent blemishes
      ctx.fillStyle = '#c75656';
      const blemish = [[-0.07, 0.48], [0.08, 0.52], [-0.02, 0.56], [0.04, 0.33], [-0.06, 0.34]];
      blemish.forEach(([ox, oy]) => {
        ctx.beginPath();
        ctx.arc(centerX + ox * w, oy * h, w * 0.01, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mark === 'cleft_chin') {
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(centerX, h * 0.58);
      ctx.lineTo(centerX, h * 0.61);
      ctx.stroke();
    }
  }

  // 8. Nose (Sheet 1: Straight, Button, Roman, Aquiline, Broad, Snub)
  function drawNoseLayer(ctx, w, h, style, skin, age) {
    const centerX = w * 0.5;
    const isChild = age < 13;
    const noseY = isChild ? h * 0.48 : h * 0.45;

    ctx.strokeStyle = skin.shadow;
    ctx.fillStyle = skin.shadow;
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    if (style === 'button' || isChild) {
      // Soft button nose
      ctx.arc(centerX, noseY + h * 0.02, w * 0.025, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      // Nostril dots
      ctx.beginPath();
      ctx.arc(centerX - w * 0.022, noseY + h * 0.022, w * 0.008, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.022, noseY + h * 0.022, w * 0.008, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'roman') {
      // Bridge with distinctive aristocratic bump
      ctx.moveTo(centerX, noseY - h * 0.06);
      ctx.lineTo(centerX - w * 0.018, noseY - h * 0.01);
      ctx.lineTo(centerX, noseY + h * 0.03);
      ctx.lineTo(centerX + w * 0.025, noseY + h * 0.03);
      ctx.stroke();
    } else if (style === 'aquiline') {
      // Hooked noble eagle curve
      ctx.moveTo(centerX, noseY - h * 0.06);
      ctx.quadraticCurveTo(centerX + w * 0.025, noseY, centerX - w * 0.008, noseY + h * 0.035);
      ctx.lineTo(centerX + w * 0.022, noseY + h * 0.035);
      ctx.stroke();
    } else if (style === 'broad') {
      // Wider bridge and wings
      ctx.moveTo(centerX - w * 0.012, noseY - h * 0.04);
      ctx.lineTo(centerX - w * 0.012, noseY + h * 0.01);
      ctx.arc(centerX, noseY + h * 0.02, w * 0.035, 0, Math.PI);
      ctx.stroke();
    } else if (style === 'snub') {
      // Short upturned tip
      ctx.moveTo(centerX, noseY - h * 0.03);
      ctx.lineTo(centerX, noseY + h * 0.015);
      ctx.bezierCurveTo(centerX - w * 0.025, noseY + h * 0.015, centerX + w * 0.025, noseY + h * 0.015, centerX, noseY + h * 0.015);
      ctx.stroke();
    } else {
      // Straight classic nose
      ctx.moveTo(centerX, noseY - h * 0.06);
      ctx.lineTo(centerX - w * 0.015, noseY + h * 0.025);
      ctx.lineTo(centerX + w * 0.015, noseY + h * 0.025);
      ctx.stroke();
    }
  }

  // 9. Mouth & Lips (Sheet 1: Thin, Medium, Full, Heart, Wide, Upturned, Downturned)
  function drawLipsLayer(ctx, w, h, style, skin, age) {
    const centerX = w * 0.5;
    const mouthY = h * 0.54;

    const lipColor = '#8a4b52';
    const lipHighlight = '#a46068';
    const mouthLineColor = '#462428';

    let lipHalfW = w * 0.06;
    let lipH = h * 0.018;

    if (style === 'thin') {
      lipHalfW = w * 0.055;
      lipH = h * 0.010;
    } else if (style === 'full') {
      lipHalfW = w * 0.075;
      lipH = h * 0.026;
    } else if (style === 'wide') {
      lipHalfW = w * 0.085;
      lipH = h * 0.016;
    } else if (style === 'heart') {
      lipHalfW = w * 0.055;
      lipH = h * 0.024;
    }

    // Upper lip
    ctx.fillStyle = lipColor;
    ctx.beginPath();
    ctx.moveTo(centerX - lipHalfW, mouthY);
    ctx.quadraticCurveTo(centerX - lipHalfW * 0.4, mouthY - lipH * 0.9, centerX, mouthY - lipH * 0.4);
    ctx.quadraticCurveTo(centerX + lipHalfW * 0.4, mouthY - lipH * 0.9, centerX + lipHalfW, mouthY);
    ctx.closePath();
    ctx.fill();

    // Lower lip
    ctx.fillStyle = lipHighlight;
    ctx.beginPath();
    ctx.moveTo(centerX - lipHalfW * 0.85, mouthY);
    ctx.quadraticCurveTo(centerX, mouthY + lipH * 1.3, centerX + lipHalfW * 0.85, mouthY);
    ctx.closePath();
    ctx.fill();

    // Separation line
    ctx.strokeStyle = mouthLineColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if (style === 'upturned') {
      ctx.moveTo(centerX - lipHalfW, mouthY - h * 0.005);
      ctx.quadraticCurveTo(centerX, mouthY + h * 0.003, centerX + lipHalfW, mouthY - h * 0.005);
    } else if (style === 'downturned') {
      ctx.moveTo(centerX - lipHalfW, mouthY + h * 0.005);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.003, centerX + lipHalfW, mouthY + h * 0.005);
    } else {
      ctx.moveTo(centerX - lipHalfW, mouthY);
      ctx.lineTo(centerX + lipHalfW, mouthY);
    }
    ctx.stroke();
  }

  // 10. Eyes Layer (Sheet 2: 10 Eye Shapes, Eyelid Types, Iris Patterns, Lashes, Extras)
  function drawEyesLayer(ctx, w, h, eyeShape, eyeColor, eyelid, eyeExtra, heterochromia, skin, age) {
    const eyeY = h * 0.40;
    const isChild = age < 13;
    const leftX = isChild ? w * 0.39 : w * 0.385;
    const rightX = isChild ? w * 0.61 : w * 0.615;
    const radiusX = isChild ? w * 0.065 : w * 0.062;
    const radiusY = isChild ? h * 0.048 : h * 0.040;

    // Eye sockets shadow
    ctx.fillStyle = 'rgba(25, 20, 25, 0.22)';
    ctx.beginPath();
    ctx.ellipse(leftX, eyeY, radiusX * 1.3, radiusY * 1.4, 0, 0, Math.PI * 2);
    ctx.ellipse(rightX, eyeY, radiusX * 1.3, radiusY * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tired eyes / Eye bags extra
    if (eyeExtra === 'tired_eyes' || eyeExtra === 'eye_bags') {
      ctx.strokeStyle = 'rgba(75, 45, 65, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(leftX, eyeY + radiusY * 0.8, radiusX * 0.9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(rightX, eyeY + radiusY * 0.8, radiusX * 0.9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }

    [ { x: leftX, col: eyeColor, isLeft: true }, { x: rightX, col: (heterochromia && AVATAR_PALETTES.eyes[heterochromia]) ? AVATAR_PALETTES.eyes[heterochromia] : eyeColor, isLeft: false } ].forEach(eye => {
      ctx.save();
      // Clip eye shape
      ctx.beginPath();
      if (eyeShape === 'round') {
        ctx.ellipse(eye.x, eyeY, radiusX * 0.95, radiusY * 1.15, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'hooded') {
        ctx.ellipse(eye.x, eyeY + radiusY * 0.1, radiusX, radiusY * 0.75, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'monolid') {
        ctx.ellipse(eye.x, eyeY, radiusX * 1.05, radiusY * 0.70, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'upturned') {
        const tilt = eye.isLeft ? -0.15 : 0.15;
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.85, tilt, 0, Math.PI * 2);
      } else if (eyeShape === 'downturned') {
        const tilt = eye.isLeft ? 0.15 : -0.15;
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.85, tilt, 0, Math.PI * 2);
      } else if (eyeShape === 'deep_set') {
        ctx.ellipse(eye.x, eyeY, radiusX * 0.9, radiusY * 0.75, 0, 0, Math.PI * 2);
      } else {
        // Almond / default
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.88, 0, 0, Math.PI * 2);
      }
      ctx.clip();

      // Sclera (eyeball white)
      ctx.fillStyle = '#f5f3ec';
      ctx.fillRect(eye.x - radiusX * 1.5, eyeY - radiusY * 1.5, radiusX * 3, radiusY * 3);

      // Sclera subtle top shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(eye.x - radiusX * 1.5, eyeY - radiusY * 1.5, radiusX * 3, radiusY * 0.9);

      // Iris
      const irisRadius = radiusY * 0.85;
      ctx.fillStyle = eye.col;
      ctx.beginPath();
      ctx.arc(eye.x, eyeY, irisRadius, 0, Math.PI * 2);
      ctx.fill();

      // Limbal Ring (dark outer circle)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#0a0a0d';
      ctx.beginPath();
      ctx.arc(eye.x, eyeY, irisRadius * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // Specular Highlight (alive gleam)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eye.x - irisRadius * 0.35, eyeY - irisRadius * 0.35, irisRadius * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eye.x + irisRadius * 0.25, eyeY + irisRadius * 0.25, irisRadius * 0.10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Upper Eyelash / Eyeliner line
      ctx.strokeStyle = '#181519';
      ctx.lineWidth = (eyeExtra === 'eyeliner') ? 3.2 : 2.0;
      ctx.beginPath();
      ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.88, 0, Math.PI, 0);
      ctx.stroke();

      // Eyelid crease line (Sheet 2: Double / Hooded)
      if (eyelid === 'double' && eyeShape !== 'monolid') {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(eye.x, eyeY - radiusY * 0.35, radiusX * 0.9, radiusY * 0.7, 0, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.stroke();
      }
    });
  }

  // 11. Eyebrows Layer (Sheet 1: 10 Eyebrow Shapes)
  function drawEyebrowsLayer(ctx, w, h, eyebrow, hair, age) {
    const browY = h * 0.345;
    const browColor = hair.base || '#2a2220';
    const leftCenterX = w * 0.385;
    const rightCenterX = w * 0.615;
    const browHalfW = w * 0.055;

    ctx.strokeStyle = browColor;
    ctx.lineWidth = (eyebrow === 'thick') ? 3.8 : (eyebrow === 'thin' ? 1.4 : 2.4);
    ctx.lineCap = 'round';

    // Left Brow
    ctx.beginPath();
    if (eyebrow === 'straight') {
      ctx.moveTo(leftCenterX - browHalfW, browY);
      ctx.lineTo(leftCenterX + browHalfW, browY);
    } else if (eyebrow === 'arched' || eyebrow === 'angled') {
      ctx.moveTo(leftCenterX - browHalfW, browY + h * 0.01);
      ctx.lineTo(leftCenterX, browY - h * 0.012);
      ctx.lineTo(leftCenterX + browHalfW, browY + h * 0.008);
    } else if (eyebrow === 'rounded') {
      ctx.arc(leftCenterX, browY + h * 0.02, browHalfW, 1.2 * Math.PI, 1.8 * Math.PI);
    } else {
      // Soft arch (Default)
      ctx.moveTo(leftCenterX - browHalfW, browY + h * 0.005);
      ctx.quadraticCurveTo(leftCenterX, browY - h * 0.008, leftCenterX + browHalfW, browY + h * 0.005);
    }
    ctx.stroke();

    // Right Brow
    ctx.beginPath();
    if (eyebrow === 'straight') {
      ctx.moveTo(rightCenterX - browHalfW, browY);
      ctx.lineTo(rightCenterX + browHalfW, browY);
    } else if (eyebrow === 'arched' || eyebrow === 'angled') {
      ctx.moveTo(rightCenterX - browHalfW, browY + h * 0.008);
      ctx.lineTo(rightCenterX, browY - h * 0.012);
      ctx.lineTo(rightCenterX + browHalfW, browY + h * 0.01);
    } else if (eyebrow === 'rounded') {
      ctx.arc(rightCenterX, browY + h * 0.02, browHalfW, 1.2 * Math.PI, 1.8 * Math.PI);
    } else {
      // Soft arch (Default)
      ctx.moveTo(rightCenterX - browHalfW, browY + h * 0.005);
      ctx.quadraticCurveTo(rightCenterX, browY - h * 0.008, rightCenterX + browHalfW, browY + h * 0.005);
    }
    ctx.stroke();
  }

  // 12. Facial Hair Layer (Sheet 4: Stubble, Mustaches, Beards, Goatees, Mutton Chops)
  function drawFacialHairLayer(ctx, w, h, style, hair, age) {
    const centerX = w * 0.5;
    const mouthY = h * 0.54;
    const hairColor = hair.base || '#2a2220';

    if (style === 'stubble') {
      // Light shadow over jaw & chin
      ctx.fillStyle = 'rgba(25, 20, 20, 0.28)';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.57, w * 0.16, h * 0.09, 0, 0, Math.PI);
      ctx.fill();
    } else if (style === 'mustache' || style === 'chevron_mustache') {
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.06, mouthY - h * 0.015);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.03, centerX + w * 0.06, mouthY - h * 0.015);
      ctx.lineTo(centerX + w * 0.05, mouthY);
      ctx.lineTo(centerX - w * 0.05, mouthY);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'handlebar') {
      ctx.strokeStyle = hairColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.08, mouthY - h * 0.02);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.01, centerX + w * 0.08, mouthY - h * 0.02);
      ctx.stroke();
    } else if (style === 'short_beard') {
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.59, w * 0.14, h * 0.08, 0, 0, Math.PI);
      ctx.fill();
    } else if (style === 'full_beard' || style === 'wizard') {
      ctx.fillStyle = hairColor;
      const beardLen = (style === 'wizard') ? h * 0.26 : h * 0.14;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.16, h * 0.50);
      ctx.bezierCurveTo(centerX - w * 0.18, h * 0.65, centerX - w * 0.10, h * 0.55 + beardLen, centerX, h * 0.55 + beardLen);
      ctx.bezierCurveTo(centerX + w * 0.10, h * 0.55 + beardLen, centerX + w * 0.18, h * 0.65, centerX + w * 0.16, h * 0.50);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'goatee') {
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.58, w * 0.04, h * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'mutton_chops') {
      ctx.fillStyle = hairColor;
      // Sideburns expanding into cheeks
      ctx.beginPath();
      ctx.ellipse(centerX - w * 0.18, h * 0.48, w * 0.04, h * 0.08, 0.2, 0, Math.PI * 2);
      ctx.ellipse(centerX + w * 0.18, h * 0.48, w * 0.04, h * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 13. Hairstyle & Bangs Layer (Sheet 3: Lengths, Textures, Bangs, Updos, Hijab)
  function drawHairLayer(ctx, w, h, style, texture, bangs, hair, headwear, age) {
    const centerX = w * 0.5;
    const isElder = age >= 51;
    // If elder and hair is natural, introduce salt-and-pepper / gray highlights
    let baseColor = hair.base;
    if (isElder && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') {
      baseColor = '#9e9ea3';
    }

    ctx.fillStyle = baseColor;
    ctx.strokeStyle = hair.shadow || '#121214';
    ctx.lineWidth = 2;

    if (style === 'bald') {
      // Nothing to render on top
      return;
    } else if (style === 'buzz_cut') {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.32, w * 0.22, h * 0.18, 0, Math.PI, 0);
      ctx.fill();
      return;
    } else if (style === 'pixie' || style === 'crop') {
      // Short modern cut
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.23, h * 0.42);
      ctx.bezierCurveTo(centerX - w * 0.25, h * 0.18, centerX + w * 0.25, h * 0.18, centerX + w * 0.23, h * 0.42);
      ctx.lineTo(centerX + w * 0.18, h * 0.30);
      ctx.bezierCurveTo(centerX + w * 0.10, h * 0.22, centerX - w * 0.10, h * 0.22, centerX - w * 0.18, h * 0.30);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'bob' || style === 'short_bob') {
      // Classic chin-length bob
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.25, h * 0.52);
      ctx.bezierCurveTo(centerX - w * 0.26, h * 0.16, centerX + w * 0.26, h * 0.16, centerX + w * 0.25, h * 0.52);
      ctx.lineTo(centerX + w * 0.18, h * 0.34);
      ctx.lineTo(centerX - w * 0.18, h * 0.34);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'wolf_cut' || style === 'shag' || style === 'mullet') {
      // Shaggy textured layers
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.25, h * 0.55);
      ctx.lineTo(centerX - w * 0.20, h * 0.35);
      ctx.lineTo(centerX - w * 0.28, h * 0.28);
      ctx.bezierCurveTo(centerX - w * 0.22, h * 0.14, centerX + w * 0.22, h * 0.14, centerX + w * 0.28, h * 0.28);
      ctx.lineTo(centerX + w * 0.20, h * 0.35);
      ctx.lineTo(centerX + w * 0.25, h * 0.55);
      ctx.lineTo(centerX + w * 0.16, h * 0.32);
      ctx.lineTo(centerX - w * 0.16, h * 0.32);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'braids' || style === 'box_braids' || style === 'dreadlocks') {
      // Crown hair + long textured braids hanging down shoulders
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.32, w * 0.22, h * 0.16, 0, Math.PI, 0);
      ctx.fill();

      // Braids hanging down both sides
      const braidCols = [centerX - w * 0.22, centerX - w * 0.17, centerX + w * 0.17, centerX + w * 0.22];
      braidCols.forEach(bx => {
        for (let by = h * 0.38; by <= h * 0.72; by += h * 0.05) {
          ctx.beginPath();
          ctx.ellipse(bx, by, w * 0.03, h * 0.03, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    } else if (style === 'space_buns' || style === 'top_knot' || style === 'messy_bun') {
      // Crown
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.34, w * 0.22, h * 0.16, 0, Math.PI, 0);
      ctx.fill();

      if (style === 'space_buns') {
        // Two buns on sides
        ctx.beginPath();
        ctx.arc(centerX - w * 0.20, h * 0.20, w * 0.08, 0, Math.PI * 2);
        ctx.arc(centerX + w * 0.20, h * 0.20, w * 0.08, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // High top bun
        ctx.beginPath();
        ctx.arc(centerX, h * 0.16, w * 0.10, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'long' || style === 'loose_waves' || style === 'straight_long') {
      // Flowing long hair past shoulders
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.26, h * 0.75);
      ctx.bezierCurveTo(centerX - w * 0.28, h * 0.14, centerX + w * 0.28, h * 0.14, centerX + w * 0.26, h * 0.75);
      ctx.lineTo(centerX + w * 0.18, h * 0.36);
      ctx.bezierCurveTo(centerX + w * 0.10, h * 0.28, centerX - w * 0.10, h * 0.28, centerX - w * 0.18, h * 0.36);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'hijab') {
      // Modest elegant headscarf framing face
      ctx.fillStyle = hair.base || '#2a2c35';
      ctx.beginPath();
      // Outer drape covering shoulders
      ctx.moveTo(centerX - w * 0.32, h);
      ctx.bezierCurveTo(centerX - w * 0.35, h * 0.20, centerX + w * 0.35, h * 0.20, centerX + w * 0.32, h);
      ctx.closePath();
      ctx.fill();

      // Face cutout window
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.44, w * 0.21, h * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Default: Parted / Curtain Classic
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.24, h * 0.48);
      ctx.bezierCurveTo(centerX - w * 0.24, h * 0.16, centerX + w * 0.24, h * 0.16, centerX + w * 0.24, h * 0.48);
      ctx.lineTo(centerX + w * 0.16, h * 0.36);
      ctx.bezierCurveTo(centerX + w * 0.08, h * 0.28, centerX - w * 0.08, h * 0.28, centerX - w * 0.16, h * 0.36);
      ctx.closePath();
      ctx.fill();
    }

    // Bangs / Fringes (Sheet 3: Straight, Curtain, Wispy, Micro)
    if (bangs === 'straight') {
      ctx.fillRect(centerX - w * 0.16, h * 0.26, w * 0.32, h * 0.08);
    } else if (bangs === 'curtain') {
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.18, h * 0.36);
      ctx.lineTo(centerX - w * 0.04, h * 0.28);
      ctx.lineTo(centerX - w * 0.18, h * 0.26);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.18, h * 0.36);
      ctx.lineTo(centerX + w * 0.04, h * 0.28);
      ctx.lineTo(centerX + w * 0.18, h * 0.26);
      ctx.fill();
    } else if (bangs === 'micro') {
      ctx.fillRect(centerX - w * 0.14, h * 0.24, w * 0.28, h * 0.04);
    }
  }

  // 14. Accessories (Sheet 5: Glasses, Piercings, Headwear)
  function drawGlassesLayer(ctx, w, h, style, age) {
    const eyeY = h * 0.40;
    const leftX = w * 0.385;
    const rightX = w * 0.615;
    const glassRadius = w * 0.07;

    const frameColor = (style === 'sunglasses') ? '#141417' : ((style === 'cat_eye') ? '#7d2432' : '#8d784a');
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = (style === 'thick_frame' || style === 'sunglasses') ? 3.5 : 1.8;

    [leftX, rightX].forEach(x => {
      ctx.beginPath();
      if (style === 'square' || style === 'thick_frame') {
        ctx.rect(x - glassRadius, eyeY - glassRadius * 0.75, glassRadius * 2, glassRadius * 1.5);
      } else {
        // Round wire / Cat-eye / Sunglasses
        ctx.ellipse(x, eyeY, glassRadius, glassRadius * 0.85, 0, 0, Math.PI * 2);
      }

      if (style === 'sunglasses') {
        ctx.fillStyle = 'rgba(15, 15, 18, 0.85)';
        ctx.fill();
      }
      ctx.stroke();
    });

    // Bridge connecting spectacles
    ctx.beginPath();
    ctx.moveTo(leftX + glassRadius, eyeY);
    ctx.lineTo(rightX - glassRadius, eyeY);
    ctx.stroke();
  }

  function drawPiercings(ctx, w, h, style, skin) {
    const centerX = w * 0.5;
    ctx.fillStyle = '#d8d7e0';
    ctx.strokeStyle = '#232226';
    ctx.lineWidth = 1;

    if (style === 'nose_stud') {
      ctx.beginPath();
      ctx.arc(centerX + w * 0.028, h * 0.47, w * 0.01, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'septum') {
      ctx.beginPath();
      ctx.arc(centerX, h * 0.485, w * 0.015, 0, Math.PI);
      ctx.stroke();
    } else if (style === 'eyebrow') {
      ctx.beginPath();
      ctx.arc(centerX + w * 0.16, h * 0.33, w * 0.009, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.17, h * 0.36, w * 0.009, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'labret') {
      ctx.beginPath();
      ctx.arc(centerX, h * 0.575, w * 0.01, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'earrings') {
      // Silver rings on ears
      ctx.beginPath();
      ctx.arc(centerX - w * 0.22, h * 0.46, w * 0.018, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.22, h * 0.46, w * 0.018, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawHeadwearLayer(ctx, w, h, headwear, hair) {
    const centerX = w * 0.5;

    if (headwear === 'beanie') {
      ctx.fillStyle = '#23242c';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.24, w * 0.24, h * 0.15, 0, Math.PI, 0);
      ctx.rect(centerX - w * 0.22, h * 0.22, w * 0.44, h * 0.06);
      ctx.fill();
    } else if (headwear === 'beret') {
      ctx.fillStyle = '#681c28';
      ctx.beginPath();
      ctx.ellipse(centerX + w * 0.04, h * 0.22, w * 0.26, h * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (headwear === 'baseball_cap') {
      ctx.fillStyle = '#1c2842';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.24, w * 0.22, h * 0.12, 0, Math.PI, 0);
      ctx.fill();
      // Visor
      ctx.fillRect(centerX - w * 0.24, h * 0.24, w * 0.48, h * 0.035);
    }
  }

  // 15. Daguerreotype Brass Rim
  function drawDaguerreotypeBorder(ctx, w, h) {
    ctx.strokeStyle = '#7c6d48';
    ctx.lineWidth = Math.max(2, Math.floor(w * 0.025));
    ctx.strokeRect(w * 0.02, h * 0.02, w * 0.96, h * 0.96);

    ctx.strokeStyle = '#423b28';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92);

    // Ornate brass corner rosettes
    const rosetteSize = w * 0.045;
    ctx.fillStyle = '#9e8d5e';
    [
      [w * 0.05, h * 0.05],
      [w * 0.95, h * 0.05],
      [w * 0.05, h * 0.95],
      [w * 0.95, h * 0.95]
    ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rosetteSize, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Expose Globally
  window.drawGothicAvatar = drawGothicAvatar;
  window.AVATAR_PALETTES = AVATAR_PALETTES;
})();
