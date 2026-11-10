// Modular Procedural Avatar Canvas Renderer for Terrible Little Lives
// Designed based on the TLL Character Creator Design System:
// 1. Face Shapes & Features | 2. Eyes | 3. Hair | 4. Facial Hair | 5. Accessories | 6. Body & Build | 7. Clothing | 8. Age-Specific Options
// Completely re-architected with strict depth ordering, non-colliding facial anchors,
// and high-fidelity BitLife-meets-gothic portrait aesthetics.

(function() {
  'use strict';

  // --- COMPREHENSIVE PALETTES ---
  const AVATAR_PALETTES = {
    // 13 Diverse Skin Complexions (Porcelain to Deep Melanin + Gothic Undersaturated)
    skin: {
      porcelain: { base: '#f6eee5', shadow: '#d5c4b1', highlight: '#fdfbf7', blush: 'rgba(230, 155, 155, 0.24)' },
      ivory: { base: '#ebd7c5', shadow: '#c7a38a', highlight: '#f8ece1', blush: 'rgba(225, 140, 140, 0.22)' },
      warm_beige: { base: '#d8b598', shadow: '#af8666', highlight: '#edd2bb', blush: 'rgba(205, 120, 120, 0.22)' },
      golden_peach: { base: '#e4b68e', shadow: '#ba8254', highlight: '#f6d3b3', blush: 'rgba(215, 115, 105, 0.25)' },
      olive: { base: '#bba789', shadow: '#8f7b5d', highlight: '#d7c7af', blush: 'rgba(175, 115, 105, 0.20)' },
      warm_bronze: { base: '#a77953', shadow: '#774c2b', highlight: '#c89d77', blush: 'rgba(160, 85, 75, 0.22)' },
      chestnut: { base: '#7f4f2c', shadow: '#51290e', highlight: '#a36d46', blush: 'rgba(135, 55, 55, 0.22)' },
      rich_espresso: { base: '#553420', shadow: '#31170a', highlight: '#784d33', blush: 'rgba(105, 40, 40, 0.22)' },
      deep_ebony: { base: '#362218', shadow: '#1b0e07', highlight: '#52372a', blush: 'rgba(85, 30, 30, 0.22)' },
      // Gothic / Uncanny Undertones
      ash: { base: '#b8b6af', shadow: '#8a8880', highlight: '#d3d1cb', blush: 'rgba(135, 125, 140, 0.18)' },
      sallow: { base: '#cfc69f', shadow: '#a1976d', highlight: '#e4dcb8', blush: 'rgba(160, 140, 105, 0.18)' },
      bruised: { base: '#a89db2', shadow: '#7c6f88', highlight: '#c8bfd1', blush: 'rgba(130, 75, 135, 0.25)' },
      mortuary: { base: '#cdd3d4', shadow: '#969ea0', highlight: '#e6ebec', blush: 'rgba(115, 130, 145, 0.18)' }
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

    // Hair Colors: 12 Natural + 11 Dyed / Alternative
    hair: {
      raven: { base: '#171719', shadow: '#0b0b0d', highlight: '#3a3a42' },
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
    const eyeExtra = options.eyeExtra || 'none';
    const heterochromia = options.heterochromia || null;

    const hairColorKey = options.hairColor || 'raven';
    const hair = AVATAR_PALETTES.hair[hairColorKey] || AVATAR_PALETTES.hair.raven;
    const hairStyle = options.hairStyle || 'parted';
    const hairTexture = options.hairTexture || 'straight';
    const bangs = options.bangs || 'none';

    const faceShape = options.faceShape || 'oval';
    const noseStyle = options.noseStyle || 'straight';
    const lipsStyle = options.lipsStyle || 'medium';
    const eyebrow = options.eyebrow || 'soft_arch';
    const facialHair = options.facialHair || 'clean';
    const mark = options.mark || 'none';
    const glasses = options.glasses || 'none';
    const headwear = options.headwear || 'none';
    const clothing = options.clothing || 'casual';
    const clothingColor = options.clothingColor || 'charcoal';
    const piercing = options.piercing || 'none';
    const necklace = options.necklace || 'none';

    const age = options.age !== undefined ? options.age : 16;

    // Reset Canvas
    ctx.clearRect(0, 0, w, h);

    // 1. Daguerreotype Vignette Backdrop
    drawBackdrop(ctx, w, h);

    // 2. Infant Lifecycle Mode (Age 0-2)
    if (age <= 2) {
      drawInfantStage(ctx, w, h, skin, eyeColor, eyeShape, hair);
      drawDaguerreotypeBorder(ctx, w, h);
      return;
    }

    // 3. Back Hair Layer (Behind shoulders and neck)
    drawBackHairLayer(ctx, w, h, hairStyle, hairTexture, hair, headwear, age);

    // 4. Torso & Clothing Layer
    drawClothingLayer(ctx, w, h, clothing, clothingColor, age, options.gender);

    // 5. Neck & Necklaces
    drawNeckLayer(ctx, w, h, skin, necklace, age);

    // 6. Ears & Earrings (Placed before face so hair/face frame them)
    drawEarsLayer(ctx, w, h, skin, piercing);

    // 7. Head & Face Shape (With clean jawline, blush, zero mouth-mud)
    drawFaceShapeLayer(ctx, w, h, faceShape, skin, age);

    // 8. Facial Markings (Freckles, Moles, Vitiligo, Scars, Acne, Cleft Chin)
    drawFacialMarkings(ctx, w, h, mark, skin, age);

    // 9. Age Progression Lines (Wisdom lines, subtle smile lines)
    drawAgeProgressionLines(ctx, w, h, age, skin);

    // 10. Jaw Facial Hair (Beards, stubble, goatees - rendered BEFORE mouth so lips are never erased)
    if (age >= 13 && facialHair !== 'clean') {
      drawJawBeardsLayer(ctx, w, h, facialHair, hair, age);
    }

    // 11. Nose Layer (Bridge, tip, nostril studs & septum rings)
    drawNoseLayer(ctx, w, h, noseStyle, skin, age, piercing);

    // 12. Mouth & Lips Layer (Crisp, expressive, with lower lip highlights & labret)
    drawLipsLayer(ctx, w, h, lipsStyle, skin, age, piercing);

    // 13. Mustache Layer (Nestled in philtrum, hugs top of upper lip without occluding mouth seam)
    if (age >= 13 && (facialHair === 'mustache' || facialHair === 'chevron_mustache' || facialHair === 'handlebar' || facialHair === 'full_beard' || facialHair === 'wizard')) {
      drawMustacheLayer(ctx, w, h, facialHair, hair, age);
    }

    // 14. Eyes Layer (Sclera, iris, pupil, dual specular highlights, lash/liner, eyelid crease)
    drawEyesLayer(ctx, w, h, eyeShape, eyeColor, eyelid, eyeExtra, heterochromia, skin, age);

    // 15. Eyebrows Layer (Clear clearance above eyes, eyebrow barbell piercings)
    drawEyebrowsLayer(ctx, w, h, eyebrow, hair, age, piercing);

    // 16. Front Hair, Bangs & Framing Locks (Frames forehead without smothering brows)
    drawFrontHairLayer(ctx, w, h, hairStyle, hairTexture, bangs, hair, headwear, age);

    // 17. Glasses (Clear lens sheen, sitting naturally over eyes with generous brow clearance)
    if (glasses !== 'none') {
      drawGlassesLayer(ctx, w, h, glasses, age);
    }

    // 18. Headwear (Beanie, beret, cap)
    if (headwear !== 'none') {
      drawHeadwearLayer(ctx, w, h, headwear, hair);
    }

    // 19. Antique Daguerreotype Brass Rim & Corner Rosettes
    drawDaguerreotypeBorder(ctx, w, h);
  }

  // --- SUB-RENDERERS ---

  // 1. Backdrop
  function drawBackdrop(ctx, w, h) {
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.46, w * 0.10, w * 0.5, h * 0.5, w * 0.72);
    bgGrad.addColorStop(0, '#2c2e37');
    bgGrad.addColorStop(0.58, '#171920');
    bgGrad.addColorStop(1, '#0c0d11');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Antique plate scratch textures & atmospheric dust
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.032)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.04); ctx.lineTo(w * 0.17, h * 0.92);
    ctx.moveTo(w * 0.83, h * 0.10); ctx.lineTo(w * 0.88, h * 0.88);
    ctx.moveTo(w * 0.08, h * 0.76); ctx.lineTo(w * 0.36, h * 0.82);
    ctx.stroke();

    // Subtle dark vignette edge
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = w * 0.04;
    ctx.strokeRect(0, 0, w, h);
  }

  // 2. Infant Stage (Age 0-2)
  function drawInfantStage(ctx, w, h, skin, eyeColor, eyeShape, hair) {
    // Swaddling blanket with soft wrap folds
    ctx.fillStyle = '#e8e4db';
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h);
    ctx.bezierCurveTo(w * 0.14, h * 0.64, w * 0.86, h * 0.64, w * 0.84, h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#d2cbbf';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.30, h * 0.76);
    ctx.quadraticCurveTo(w * 0.50, h * 0.82, w * 0.70, h * 0.76);
    ctx.stroke();

    // Baby bonnet rim
    ctx.fillStyle = '#d9d2c5';
    ctx.beginPath();
    ctx.ellipse(w * 0.50, h * 0.45, w * 0.32, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chubby baby head
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(w * 0.50, h * 0.47, w * 0.25, h * 0.27, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rosy baby cheeks
    ctx.fillStyle = skin.blush || 'rgba(235, 150, 150, 0.30)';
    ctx.beginPath();
    ctx.ellipse(w * 0.36, h * 0.52, w * 0.08, h * 0.06, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.64, h * 0.52, w * 0.08, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Large sparkling baby eyes
    const eyeY = h * 0.45;
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
      ctx.arc(x, eyeY, w * 0.020, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - w * 0.012, eyeY - w * 0.012, w * 0.012, 0, Math.PI * 2);
      ctx.arc(x + w * 0.010, eyeY + w * 0.010, w * 0.006, 0, Math.PI * 2);
      ctx.fill();
    });

    // Baby brows
    ctx.strokeStyle = hair.base || '#554433';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.40); ctx.lineTo(w * 0.44, h * 0.40);
    ctx.moveTo(w * 0.56, h * 0.40); ctx.lineTo(w * 0.66, h * 0.40);
    ctx.stroke();

    // Button nose
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.arc(w * 0.50, h * 0.51, w * 0.020, 0, Math.PI * 2);
    ctx.fill();

    // Cute baby mouth
    ctx.fillStyle = '#d0707a';
    ctx.beginPath();
    ctx.arc(w * 0.50, h * 0.57, w * 0.028, 0, Math.PI);
    ctx.fill();

    // Tuft of hair peeking out
    ctx.fillStyle = hair.base;
    ctx.beginPath();
    ctx.ellipse(w * 0.50, h * 0.26, w * 0.06, w * 0.08, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Back Hair Layer (Flowing behind shoulders and neck)
  function drawBackHairLayer(ctx, w, h, style, texture, hair, headwear, age) {
    const centerX = w * 0.50;
    const baseColor = (age >= 51 && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') ? '#9e9ea3' : hair.base;
    const shadowColor = hair.shadow || '#121214';

    ctx.fillStyle = baseColor;
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1.5;

    if (style === 'long' || style === 'straight_long' || style === 'loose_waves') {
      // Flowing background hair fanning out past shoulders
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.28, h * 0.88);
      ctx.bezierCurveTo(centerX - w * 0.34, h * 0.50, centerX - w * 0.28, h * 0.16, centerX, h * 0.15);
      ctx.bezierCurveTo(centerX + w * 0.28, h * 0.16, centerX + w * 0.34, h * 0.50, centerX + w * 0.28, h * 0.88);
      ctx.lineTo(centerX + w * 0.18, h * 0.88);
      ctx.bezierCurveTo(centerX + w * 0.16, h * 0.55, centerX - w * 0.16, h * 0.55, centerX - w * 0.18, h * 0.88);
      ctx.closePath();
      ctx.fill();

      // Texture waves / flow lines
      if (texture === 'wavy' || style === 'loose_waves') {
        ctx.strokeStyle = hair.highlight || '#ffffff40';
        ctx.beginPath();
        ctx.moveTo(centerX - w * 0.26, h * 0.40);
        ctx.bezierCurveTo(centerX - w * 0.30, h * 0.55, centerX - w * 0.22, h * 0.70, centerX - w * 0.25, h * 0.85);
        ctx.moveTo(centerX + w * 0.26, h * 0.40);
        ctx.bezierCurveTo(centerX + w * 0.30, h * 0.55, centerX + w * 0.22, h * 0.70, centerX + w * 0.25, h * 0.85);
        ctx.stroke();
      }
    } else if (style === 'braids' || style === 'box_braids' || style === 'dreadlocks') {
      // Background crown & falling braids
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.32, w * 0.26, h * 0.20, 0, Math.PI, 0);
      ctx.fill();

      const braidPositions = [centerX - w * 0.24, centerX - w * 0.19, centerX + w * 0.19, centerX + w * 0.24];
      braidPositions.forEach(bx => {
        for (let by = h * 0.45; by <= h * 0.88; by += h * 0.045) {
          ctx.beginPath();
          ctx.ellipse(bx, by, w * 0.026, h * 0.026, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    } else if (style === 'bob' || style === 'short_bob') {
      // Bell-shaped bob back silhouette
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.27, h * 0.58);
      ctx.bezierCurveTo(centerX - w * 0.28, h * 0.20, centerX + w * 0.28, h * 0.20, centerX + w * 0.27, h * 0.58);
      ctx.lineTo(centerX - w * 0.27, h * 0.58);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'wolf_cut' || style === 'shag' || style === 'mullet') {
      // Shaggy back layers peaking behind neck
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.27, h * 0.68);
      ctx.lineTo(centerX - w * 0.22, h * 0.45);
      ctx.bezierCurveTo(centerX - w * 0.25, h * 0.18, centerX + w * 0.25, h * 0.18, centerX + w * 0.22, h * 0.45);
      ctx.lineTo(centerX + w * 0.27, h * 0.68);
      ctx.lineTo(centerX + w * 0.18, h * 0.62);
      ctx.lineTo(centerX - w * 0.18, h * 0.62);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'space_buns') {
      // Two symmetrical high buns perched on crown
      ctx.beginPath();
      ctx.arc(centerX - w * 0.20, h * 0.18, w * 0.085, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.20, h * 0.18, w * 0.085, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (style === 'top_knot' || style === 'messy_bun') {
      // High top bun on crown
      ctx.beginPath();
      ctx.arc(centerX, h * 0.14, w * 0.10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Stray tendrils
      ctx.beginPath();
      ctx.arc(centerX + w * 0.08, h * 0.12, w * 0.02, 0, Math.PI);
      ctx.stroke();
    } else if (style === 'hijab') {
      // Graceful hijab mantle covering back and draped over shoulders
      ctx.fillStyle = hair.base || '#2a2c35';
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.36, h);
      ctx.bezierCurveTo(centerX - w * 0.38, h * 0.30, centerX - w * 0.28, h * 0.14, centerX, h * 0.14);
      ctx.bezierCurveTo(centerX + w * 0.28, h * 0.14, centerX + w * 0.38, h * 0.30, centerX + w * 0.36, h);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 4. Torso & Clothing Layer
  function drawClothingLayer(ctx, w, h, style, colorKey, age, gender) {
    const col = AVATAR_PALETTES.clothing[colorKey] || AVATAR_PALETTES.clothing.charcoal;
    const isChild = age < 13;
    const shoulderLeftX = isChild ? w * 0.20 : w * 0.11;
    const shoulderRightX = isChild ? w * 0.80 : w * 0.89;
    const shoulderY = isChild ? h * 0.74 : h * 0.70;

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(shoulderLeftX, h);
    ctx.bezierCurveTo(shoulderLeftX, shoulderY, w * 0.35, shoulderY - h * 0.03, w * 0.38, shoulderY - h * 0.03);
    ctx.lineTo(w * 0.62, shoulderY - h * 0.03);
    ctx.bezierCurveTo(w * 0.65, shoulderY - h * 0.03, shoulderRightX, shoulderY, shoulderRightX, h);
    ctx.closePath();
    ctx.fill();

    // Clothing styling details
    if (style === 'prep_blazer' || style === 'elite_uniform') {
      // Inner shirt
      ctx.fillStyle = '#f5f3ec';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.50, h * 0.81);
      ctx.lineTo(w * 0.56, shoulderY - h * 0.03);
      ctx.fill();

      // Blazer lapels
      ctx.fillStyle = '#1c1c24';
      ctx.beginPath();
      ctx.moveTo(w * 0.40, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.50, h * 0.84);
      ctx.lineTo(w * 0.60, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.56, shoulderY - h * 0.03);
      ctx.lineTo(w * 0.50, h * 0.81);
      ctx.lineTo(w * 0.44, shoulderY - h * 0.03);
      ctx.closePath();
      ctx.fill();

      // Tie
      ctx.fillStyle = style === 'elite_uniform' ? '#8a1d2e' : '#2e4372';
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.70);
      ctx.lineTo(w * 0.52, h * 0.70);
      ctx.lineTo(w * 0.53, h * 0.88);
      ctx.lineTo(w * 0.50, h * 0.92);
      ctx.lineTo(w * 0.47, h * 0.88);
      ctx.closePath();
      ctx.fill();

      // Golden crest badge for Elite
      if (style === 'elite_uniform') {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(w * 0.33, h * 0.78, w * 0.026, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8a6d1b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (style === 'hoodie') {
      // Hoodie collar band
      ctx.strokeStyle = '#202127';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(w * 0.50, h * 0.69, w * 0.14, h * 0.05, 0, 0, Math.PI);
      ctx.stroke();

      // Drawstrings
      ctx.strokeStyle = '#dedad0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.46, h * 0.71); ctx.lineTo(w * 0.46, h * 0.82);
      ctx.moveTo(w * 0.54, h * 0.71); ctx.lineTo(w * 0.54, h * 0.80);
      ctx.stroke();
    } else if (style === 'turtleneck' || style === 'goth') {
      // High rolled neck
      ctx.fillStyle = '#101014';
      ctx.fillRect(w * 0.40, h * 0.61, w * 0.20, h * 0.10);
      // Ribbed stitch lines
      ctx.strokeStyle = '#272730';
      ctx.lineWidth = 1;
      for (let rx = w * 0.42; rx <= w * 0.58; rx += w * 0.03) {
        ctx.beginPath();
        ctx.moveTo(rx, h * 0.61); ctx.lineTo(rx, h * 0.71);
        ctx.stroke();
      }
    } else if (style === 'suit') {
      // Formal black jacket with white shirt & silk tie
      ctx.fillStyle = '#0e0f12';
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.67);
      ctx.lineTo(w * 0.50, h * 0.85);
      ctx.lineTo(w * 0.62, h * 0.67);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, h * 0.67);
      ctx.lineTo(w * 0.50, h * 0.80);
      ctx.lineTo(w * 0.56, h * 0.67);
      ctx.fill();

      ctx.fillStyle = '#5c1724';
      ctx.beginPath();
      ctx.moveTo(w * 0.485, h * 0.69);
      ctx.lineTo(w * 0.515, h * 0.69);
      ctx.lineTo(w * 0.525, h * 0.88);
      ctx.lineTo(w * 0.500, h * 0.91);
      ctx.lineTo(w * 0.475, h * 0.88);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'lab_coat' || style === 'scrubs') {
      ctx.fillStyle = style === 'lab_coat' ? '#f5f5f7' : '#28696b';
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.67);
      ctx.lineTo(w * 0.50, h * 0.79);
      ctx.lineTo(w * 0.58, h * 0.67);
      ctx.lineTo(w * 0.65, h);
      ctx.lineTo(w * 0.35, h);
      ctx.closePath();
      ctx.fill();
    } else {
      // Casual crewneck / sweater
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(w * 0.50, h * 0.69, w * 0.12, h * 0.04, 0, 0, Math.PI);
      ctx.stroke();
    }
  }

  // 5. Neck Layer & Necklaces
  function drawNeckLayer(ctx, w, h, skin, necklace, age) {
    const isChild = age < 13;
    const neckW = isChild ? w * 0.11 : w * 0.13;
    const neckH = h * 0.14;

    ctx.fillStyle = skin.shadow;
    ctx.fillRect(w * 0.50 - neckW / 2, h * 0.54, neckW, neckH);

    // Subtle throat / clavicle contour
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h * 0.58);
    ctx.lineTo(w * 0.50, h * 0.62);
    ctx.lineTo(w * 0.52, h * 0.58);
    ctx.stroke();

    // Necklaces
    if (necklace === 'choker') {
      ctx.fillStyle = '#141417';
      ctx.fillRect(w * 0.43, h * 0.61, w * 0.14, h * 0.022);
      ctx.fillStyle = '#d6d6df';
      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.632, w * 0.014, 0, Math.PI * 2);
      ctx.fill();
    } else if (necklace === 'pearls') {
      ctx.fillStyle = '#f0eef5';
      for (let px = w * 0.43; px <= w * 0.57; px += w * 0.018) {
        ctx.beginPath();
        const py = h * 0.64 + Math.sin((px - w * 0.43) / (w * 0.14) * Math.PI) * (h * 0.03);
        ctx.arc(px, py, w * 0.009, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (necklace === 'chain' || necklace === 'pendant') {
      ctx.strokeStyle = '#c5a046';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.58, w * 0.08, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
      if (necklace === 'pendant') {
        ctx.fillStyle = '#9e2235';
        ctx.beginPath();
        ctx.arc(w * 0.50, h * 0.66, w * 0.016, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c5a046';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // 6. Ears Layer (Attached to sides of head)
  function drawEarsLayer(ctx, w, h, skin, piercing) {
    const centerX = w * 0.50;
    const earY = h * 0.42;

    [centerX - w * 0.22, centerX + w * 0.22].forEach((ex, idx) => {
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(ex, earY, w * 0.035, h * 0.065, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner ear fold
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(ex + (idx === 0 ? w * 0.006 : -w * 0.006), earY, w * 0.016, 0, Math.PI * 2);
      ctx.stroke();

      // Earrings piercing
      if (piercing === 'earrings') {
        ctx.strokeStyle = '#d8d7e0';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ex, earY + h * 0.045, w * 0.016, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  // 7. Head & Face Shape (10 Distinct Silhouettes with Clean Proportions)
  function drawFaceShapeLayer(ctx, w, h, faceShape, skin, age) {
    const isChild = age < 13;
    const centerX = w * 0.50;
    const centerY = isChild ? h * 0.43 : h * 0.415;

    ctx.fillStyle = skin.base;
    ctx.beginPath();

    // 10 Face Shape Silhouettes
    if (faceShape === 'round' || isChild) {
      const radX = isChild ? w * 0.23 : w * 0.235;
      const radY = isChild ? h * 0.24 : h * 0.245;
      ctx.ellipse(centerX, centerY, radX, radY, 0, 0, Math.PI * 2);
    } else if (faceShape === 'square') {
      ctx.moveTo(centerX - w * 0.21, centerY - h * 0.24);
      ctx.bezierCurveTo(centerX - w * 0.23, centerY, centerX - w * 0.22, centerY + h * 0.16, centerX - w * 0.16, centerY + h * 0.24);
      ctx.lineTo(centerX + w * 0.16, centerY + h * 0.24);
      ctx.bezierCurveTo(centerX + w * 0.22, centerY + h * 0.16, centerX + w * 0.23, centerY, centerX + w * 0.21, centerY - h * 0.24);
      ctx.closePath();
    } else if (faceShape === 'rectangle') {
      ctx.moveTo(centerX - w * 0.19, centerY - h * 0.26);
      ctx.bezierCurveTo(centerX - w * 0.21, centerY - h * 0.05, centerX - w * 0.20, centerY + h * 0.16, centerX - w * 0.15, centerY + h * 0.26);
      ctx.lineTo(centerX + w * 0.15, centerY + h * 0.26);
      ctx.bezierCurveTo(centerX + w * 0.20, centerY + h * 0.16, centerX + w * 0.21, centerY - h * 0.05, centerX + w * 0.19, centerY - h * 0.26);
      ctx.closePath();
    } else if (faceShape === 'heart') {
      ctx.moveTo(centerX - w * 0.22, centerY - h * 0.22);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.08, centerX - w * 0.18, centerY + h * 0.12, centerX, centerY + h * 0.25);
      ctx.bezierCurveTo(centerX + w * 0.18, centerY + h * 0.12, centerX + w * 0.24, centerY - h * 0.08, centerX + w * 0.22, centerY - h * 0.22);
      ctx.closePath();
    } else if (faceShape === 'diamond') {
      ctx.moveTo(centerX, centerY - h * 0.25);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.12, centerX - w * 0.24, centerY + h * 0.04, centerX, centerY + h * 0.25);
      ctx.bezierCurveTo(centerX + w * 0.24, centerY + h * 0.04, centerX + w * 0.24, centerY - h * 0.12, centerX, centerY - h * 0.25);
      ctx.closePath();
    } else if (faceShape === 'triangle') {
      ctx.moveTo(centerX - w * 0.17, centerY - h * 0.25);
      ctx.bezierCurveTo(centerX - w * 0.18, centerY - h * 0.08, centerX - w * 0.23, centerY + h * 0.14, centerX - w * 0.17, centerY + h * 0.25);
      ctx.lineTo(centerX + w * 0.17, centerY + h * 0.25);
      ctx.bezierCurveTo(centerX + w * 0.23, centerY + h * 0.14, centerX + w * 0.18, centerY - h * 0.08, centerX + w * 0.17, centerY - h * 0.25);
      ctx.closePath();
    } else if (faceShape === 'inverted_triangle') {
      ctx.moveTo(centerX - w * 0.23, centerY - h * 0.24);
      ctx.bezierCurveTo(centerX - w * 0.24, centerY - h * 0.08, centerX - w * 0.16, centerY + h * 0.14, centerX, centerY + h * 0.24);
      ctx.bezierCurveTo(centerX + w * 0.16, centerY + h * 0.14, centerX + w * 0.24, centerY - h * 0.08, centerX + w * 0.23, centerY - h * 0.24);
      ctx.closePath();
    } else if (faceShape === 'oblong') {
      ctx.ellipse(centerX, centerY, w * 0.19, h * 0.27, 0, 0, Math.PI * 2);
    } else if (faceShape === 'wide') {
      ctx.ellipse(centerX, centerY, w * 0.245, h * 0.23, 0, 0, Math.PI * 2);
    } else {
      // Classic Oval (Default)
      ctx.ellipse(centerX, centerY, w * 0.21, h * 0.255, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Clean Jaw Perimeter Shading (Strictly hugs bottom chin rim at 0.64-0.67, NEVER muddying mouth at 0.54!)
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(centerX, h * 0.655, w * 0.11, h * 0.024, 0, 0, Math.PI);
    ctx.fill();

    // Cheek Blush (Placed laterally away from mouth and nose)
    ctx.fillStyle = skin.blush || 'rgba(215, 135, 135, 0.20)';
    ctx.beginPath();
    ctx.ellipse(centerX - w * 0.14, centerY + h * 0.04, w * 0.055, h * 0.035, -0.1, 0, Math.PI * 2);
    ctx.ellipse(centerX + w * 0.14, centerY + h * 0.04, w * 0.055, h * 0.035, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. Facial Markings (Freckles, Moles, Vitiligo, Scars, Acne, Cleft Chin)
  function drawFacialMarkings(ctx, w, h, mark, skin, age) {
    const centerX = w * 0.50;

    if (mark === 'freckles' || mark === 'light_freckles') {
      ctx.fillStyle = 'rgba(140, 85, 55, 0.60)';
      const spots = [
        [-0.07, 0.44], [-0.04, 0.45], [-0.02, 0.445], [0, 0.455], [0.02, 0.445], [0.05, 0.45], [0.08, 0.44],
        [-0.09, 0.455], [-0.05, 0.465], [0.04, 0.465], [0.07, 0.455], [-0.02, 0.46], [0.01, 0.465]
      ];
      spots.forEach(([ox, oy]) => {
        ctx.beginPath();
        ctx.arc(centerX + ox * w, oy * h, w * 0.006, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mark === 'moles') {
      ctx.fillStyle = '#3a2012';
      ctx.beginPath();
      ctx.arc(centerX - w * 0.11, h * 0.47, w * 0.009, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.13, h * 0.36, w * 0.008, 0, Math.PI * 2);
      ctx.fill();
    } else if (mark === 'vitiligo') {
      ctx.fillStyle = 'rgba(255, 252, 245, 0.55)';
      ctx.beginPath();
      ctx.ellipse(centerX - w * 0.11, h * 0.36, w * 0.06, h * 0.04, 0.3, 0, Math.PI * 2);
      ctx.ellipse(centerX + w * 0.13, h * 0.52, w * 0.05, h * 0.035, -0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (mark === 'scar') {
      // Healed cheek dueling scar
      ctx.strokeStyle = '#a44747';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.09, h * 0.43);
      ctx.lineTo(centerX + w * 0.14, h * 0.51);
      ctx.stroke();

      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.10, h * 0.45); ctx.lineTo(centerX + w * 0.12, h * 0.44);
      ctx.moveTo(centerX + w * 0.115, h * 0.48); ctx.lineTo(centerX + w * 0.135, h * 0.47);
      ctx.stroke();
    } else if (mark === 'acne' || (age >= 13 && age <= 18 && mark === 'acne_teen')) {
      ctx.fillStyle = '#c75656';
      const blemishes = [[-0.08, 0.48], [0.09, 0.49], [-0.03, 0.61], [0.04, 0.28], [-0.06, 0.29]];
      blemishes.forEach(([ox, oy]) => {
        ctx.beginPath();
        ctx.arc(centerX + ox * w, oy * h, w * 0.008, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (mark === 'cleft_chin') {
      ctx.strokeStyle = skin.shadow;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX, h * 0.630);
      ctx.lineTo(centerX, h * 0.650);
      ctx.stroke();
    }
  }

  // 9. Age Progression Lines (Wisdom lines, subtle smile lines framing mouth)
  function drawAgeProgressionLines(ctx, w, h, age, skin) {
    const centerX = w * 0.50;

    if (age <= 12) {
      // Child: Soft baby fat contours under eyes
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX - w * 0.10, h * 0.44, w * 0.04, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(centerX + w * 0.10, h * 0.44, w * 0.04, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else if (age >= 31 && age <= 50) {
      // Adult: Nasolabial smile lines neatly flanking mouth
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.08, h * 0.48); ctx.lineTo(centerX - w * 0.10, h * 0.55);
      ctx.moveTo(centerX + w * 0.08, h * 0.48); ctx.lineTo(centerX + w * 0.10, h * 0.55);
      // Crow's feet
      ctx.moveTo(centerX - w * 0.17, h * 0.395); ctx.lineTo(centerX - w * 0.19, h * 0.405);
      ctx.moveTo(centerX + w * 0.17, h * 0.395); ctx.lineTo(centerX + w * 0.19, h * 0.405);
      ctx.stroke();
    } else if (age >= 51) {
      // Elder: Forehead lines, under-eye bags, marionette lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      // Forehead
      ctx.moveTo(centerX - w * 0.11, h * 0.26); ctx.lineTo(centerX + w * 0.11, h * 0.26);
      ctx.moveTo(centerX - w * 0.09, h * 0.29); ctx.lineTo(centerX + w * 0.09, h * 0.29);
      // Nasolabial & Marionette lines
      ctx.moveTo(centerX - w * 0.08, h * 0.48); ctx.lineTo(centerX - w * 0.11, h * 0.55); ctx.lineTo(centerX - w * 0.09, h * 0.61);
      ctx.moveTo(centerX + w * 0.08, h * 0.48); ctx.lineTo(centerX + w * 0.11, h * 0.55); ctx.lineTo(centerX + w * 0.09, h * 0.61);
      // Under eye bags
      ctx.arc(centerX - w * 0.12, h * 0.43, w * 0.05, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(centerX + w * 0.12, h * 0.43, w * 0.05, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }
  }

  // 10. Jaw Facial Hair Layer (Stubble, short beard, full beard, goatee, mutton chops)
  // RENDERED BEFORE LIPS so beards never occlude or wipe out the mouth!
  function drawJawBeardsLayer(ctx, w, h, style, hair, age) {
    const centerX = w * 0.50;
    const hairColor = (age >= 51 && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') ? '#a0a0a5' : (hair.base || '#2a2220');

    if (style === 'stubble') {
      // Soft jaw & chin shadow hugging jaw perimeter
      ctx.fillStyle = 'rgba(25, 20, 20, 0.22)';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.61, w * 0.15, h * 0.065, 0, 0, Math.PI);
      ctx.fill();
    } else if (style === 'short_beard') {
      // Neatly trimmed beard hugging jawline and chin, leaving mouth area clear
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.19, h * 0.46);
      ctx.bezierCurveTo(centerX - w * 0.20, h * 0.60, centerX - w * 0.14, h * 0.68, centerX, h * 0.68);
      ctx.bezierCurveTo(centerX + w * 0.14, h * 0.68, centerX + w * 0.20, h * 0.60, centerX + w * 0.19, h * 0.46);
      ctx.lineTo(centerX + w * 0.15, h * 0.50);
      ctx.bezierCurveTo(centerX + w * 0.13, h * 0.60, centerX + w * 0.08, h * 0.60, centerX, h * 0.60);
      ctx.bezierCurveTo(centerX - w * 0.08, h * 0.60, centerX - w * 0.13, h * 0.50, centerX - w * 0.15, h * 0.50);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'full_beard' || style === 'wizard') {
      // Full beard cascading past chin with an open sculpted mouth aperture
      ctx.fillStyle = hairColor;
      const beardLen = (style === 'wizard') ? h * 0.32 : h * 0.16;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.20, h * 0.46);
      ctx.bezierCurveTo(centerX - w * 0.22, h * 0.62, centerX - w * 0.12, h * 0.60 + beardLen, centerX, h * 0.60 + beardLen);
      ctx.bezierCurveTo(centerX + w * 0.12, h * 0.60 + beardLen, centerX + w * 0.22, h * 0.62, centerX + w * 0.20, h * 0.46);
      ctx.lineTo(centerX + w * 0.14, h * 0.50);
      // Cutout for mouth so mouth is never covered
      ctx.bezierCurveTo(centerX + w * 0.12, h * 0.59, centerX - w * 0.12, h * 0.59, centerX - w * 0.14, h * 0.50);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'goatee') {
      // Neat chin goatee tuft strictly below lower lip (0.585 - 0.645)
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.615, w * 0.038, h * 0.032, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'mutton_chops') {
      // Victorian sideburns flaring down to jaw corners
      ctx.fillStyle = hairColor;
      ctx.beginPath();
      ctx.ellipse(centerX - w * 0.19, h * 0.48, w * 0.035, h * 0.075, 0.15, 0, Math.PI * 2);
      ctx.ellipse(centerX + w * 0.19, h * 0.48, w * 0.035, h * 0.075, -0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 11. Nose Layer (Bridge, Tip, Nostril Studs & Septum Rings)
  function drawNoseLayer(ctx, w, h, style, skin, age, piercing) {
    const centerX = w * 0.50;
    const isChild = age < 13;
    const noseY = isChild ? h * 0.48 : h * 0.465;

    ctx.strokeStyle = skin.shadow;
    ctx.fillStyle = skin.shadow;
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    if (style === 'button' || isChild) {
      // Soft button nose tip & nostril dots
      ctx.arc(centerX, noseY + h * 0.012, w * 0.022, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX - w * 0.020, noseY + h * 0.014, w * 0.007, 0, Math.PI * 2);
      ctx.arc(centerX + w * 0.020, noseY + h * 0.014, w * 0.007, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'roman') {
      // Bridge with distinctive aristocratic bump
      ctx.moveTo(centerX - w * 0.005, noseY - h * 0.055);
      ctx.lineTo(centerX - w * 0.016, noseY - h * 0.012);
      ctx.lineTo(centerX - w * 0.003, noseY + h * 0.015);
      ctx.lineTo(centerX + w * 0.022, noseY + h * 0.015);
      ctx.stroke();
    } else if (style === 'aquiline') {
      // Hooked noble eagle curve
      ctx.moveTo(centerX - w * 0.004, noseY - h * 0.055);
      ctx.quadraticCurveTo(centerX + w * 0.020, noseY - h * 0.005, centerX - w * 0.006, noseY + h * 0.018);
      ctx.lineTo(centerX + w * 0.020, noseY + h * 0.018);
      ctx.stroke();
    } else if (style === 'broad') {
      // Wider bridge & sculpted wings
      ctx.moveTo(centerX - w * 0.012, noseY - h * 0.04);
      ctx.lineTo(centerX - w * 0.012, noseY + h * 0.005);
      ctx.arc(centerX, noseY + h * 0.012, w * 0.032, 0, Math.PI);
      ctx.stroke();
    } else if (style === 'snub') {
      // Short upturned tip
      ctx.moveTo(centerX, noseY - h * 0.025);
      ctx.lineTo(centerX, noseY + h * 0.008);
      ctx.bezierCurveTo(centerX - w * 0.022, noseY + h * 0.008, centerX + w * 0.022, noseY + h * 0.008, centerX, noseY + h * 0.008);
      ctx.stroke();
    } else {
      // Straight classic nose
      ctx.moveTo(centerX - w * 0.004, noseY - h * 0.055);
      ctx.lineTo(centerX - w * 0.012, noseY + h * 0.015);
      ctx.lineTo(centerX + w * 0.016, noseY + h * 0.015);
      ctx.stroke();
    }

    // Piercings on nose
    if (piercing === 'nose_stud') {
      ctx.fillStyle = '#dedde6';
      ctx.strokeStyle = '#252528';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(centerX + w * 0.028, noseY + h * 0.012, w * 0.008, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (piercing === 'septum') {
      ctx.strokeStyle = '#d8d7e0';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(centerX, noseY + h * 0.026, w * 0.012, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    }
  }

  // 12. Mouth & Lips Layer (Expressive, Crisp, Non-Muddy)
  function drawLipsLayer(ctx, w, h, style, skin, age, piercing) {
    const centerX = w * 0.50;
    const mouthY = h * 0.540;

    const lipColor = '#8a4b52';
    const lipHighlight = '#b0656e';
    const mouthLineColor = '#462428';

    let lipHalfW = w * 0.060;
    let lipH = h * 0.016;

    if (style === 'thin') {
      lipHalfW = w * 0.052;
      lipH = h * 0.009;
    } else if (style === 'full') {
      lipHalfW = w * 0.072;
      lipH = h * 0.024;
    } else if (style === 'wide') {
      lipHalfW = w * 0.082;
      lipH = h * 0.015;
    } else if (style === 'heart') {
      lipHalfW = w * 0.054;
      lipH = h * 0.022;
    }

    // Upper lip with cupid's bow
    ctx.fillStyle = lipColor;
    ctx.beginPath();
    ctx.moveTo(centerX - lipHalfW, mouthY);
    ctx.quadraticCurveTo(centerX - lipHalfW * 0.4, mouthY - lipH * 0.9, centerX, mouthY - lipH * 0.4);
    ctx.quadraticCurveTo(centerX + lipHalfW * 0.4, mouthY - lipH * 0.9, centerX + lipHalfW, mouthY);
    ctx.closePath();
    ctx.fill();

    // Lower lip with plump highlight
    ctx.fillStyle = lipHighlight;
    ctx.beginPath();
    ctx.moveTo(centerX - lipHalfW * 0.85, mouthY);
    ctx.quadraticCurveTo(centerX, mouthY + lipH * 1.25, centerX + lipHalfW * 0.85, mouthY);
    ctx.closePath();
    ctx.fill();

    // Subtle lower lip specular gleam
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.ellipse(centerX, mouthY + lipH * 0.55, lipHalfW * 0.35, lipH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth seam line
    ctx.strokeStyle = mouthLineColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (style === 'upturned') {
      ctx.moveTo(centerX - lipHalfW, mouthY - h * 0.004);
      ctx.quadraticCurveTo(centerX, mouthY + h * 0.003, centerX + lipHalfW, mouthY - h * 0.004);
    } else if (style === 'downturned') {
      ctx.moveTo(centerX - lipHalfW, mouthY + h * 0.004);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.003, centerX + lipHalfW, mouthY + h * 0.004);
    } else {
      ctx.moveTo(centerX - lipHalfW, mouthY);
      ctx.lineTo(centerX + lipHalfW, mouthY);
    }
    ctx.stroke();

    // Labret piercing
    if (piercing === 'labret') {
      ctx.fillStyle = '#dedde6';
      ctx.strokeStyle = '#252528';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, mouthY + lipH * 1.6, w * 0.008, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 13. Mustache Layer (Philtrum area - hugs top of upper lip WITHOUT covering mouth line)
  function drawMustacheLayer(ctx, w, h, style, hair, age) {
    const centerX = w * 0.50;
    const mouthY = h * 0.540;
    const hairColor = (age >= 51 && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') ? '#a0a0a5' : (hair.base || '#2a2220');

    ctx.fillStyle = hairColor;
    ctx.strokeStyle = hair.shadow || '#121214';
    ctx.lineWidth = 1.2;

    if (style === 'mustache' || style === 'full_beard' || style === 'wizard') {
      // Classic neat mustache sitting just above upper lip
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.060, mouthY - h * 0.004);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.026, centerX + w * 0.060, mouthY - h * 0.004);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.008, centerX - w * 0.060, mouthY - h * 0.004);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'chevron_mustache') {
      // Thick vintage walrus / chevron mustache
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.070, mouthY - h * 0.002);
      ctx.quadraticCurveTo(centerX, mouthY - h * 0.034, centerX + w * 0.070, mouthY - h * 0.002);
      ctx.lineTo(centerX + w * 0.055, mouthY);
      ctx.lineTo(centerX - w * 0.055, mouthY);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'handlebar') {
      // Curled handlebar mustache swooping up at tips
      ctx.strokeStyle = hairColor;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.085, mouthY - h * 0.016);
      ctx.quadraticCurveTo(centerX - w * 0.04, mouthY - h * 0.004, centerX, mouthY - h * 0.014);
      ctx.quadraticCurveTo(centerX + w * 0.04, mouthY - h * 0.004, centerX + w * 0.085, mouthY - h * 0.016);
      ctx.stroke();
    }
  }

  // 14. Eyes Layer (10 Shapes, Limbal Ring, Sclera Shadow, Multi-Sparkle Speculars)
  function drawEyesLayer(ctx, w, h, eyeShape, eyeColor, eyelid, eyeExtra, heterochromia, skin, age) {
    const eyeY = h * 0.395;
    const isChild = age < 13;
    const leftX = isChild ? w * 0.390 : w * 0.380;
    const rightX = isChild ? w * 0.610 : w * 0.620;
    const radiusX = isChild ? w * 0.065 : w * 0.062;
    const radiusY = isChild ? h * 0.044 : h * 0.038;

    // Soft eye socket ambient shading
    ctx.fillStyle = 'rgba(25, 20, 25, 0.16)';
    ctx.beginPath();
    ctx.ellipse(leftX, eyeY, radiusX * 1.25, radiusY * 1.35, 0, 0, Math.PI * 2);
    ctx.ellipse(rightX, eyeY, radiusX * 1.25, radiusY * 1.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tired eyes / Eye bags extra
    if (eyeExtra === 'tired_eyes' || eyeExtra === 'eye_bags') {
      ctx.strokeStyle = 'rgba(75, 45, 65, 0.38)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(leftX, eyeY + radiusY * 0.85, radiusX * 0.85, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.arc(rightX, eyeY + radiusY * 0.85, radiusX * 0.85, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }

    const eyeConfigs = [
      { x: leftX, col: eyeColor, isLeft: true },
      { x: rightX, col: (heterochromia && AVATAR_PALETTES.eyes[heterochromia]) ? AVATAR_PALETTES.eyes[heterochromia] : eyeColor, isLeft: false }
    ];

    eyeConfigs.forEach(eye => {
      ctx.save();
      // Clip eye boundary based on eyeShape
      ctx.beginPath();
      if (eyeShape === 'round') {
        ctx.ellipse(eye.x, eyeY, radiusX * 0.95, radiusY * 1.15, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'hooded') {
        ctx.ellipse(eye.x, eyeY + radiusY * 0.1, radiusX, radiusY * 0.76, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'monolid') {
        ctx.ellipse(eye.x, eyeY, radiusX * 1.05, radiusY * 0.70, 0, 0, Math.PI * 2);
      } else if (eyeShape === 'upturned') {
        const tilt = eye.isLeft ? -0.14 : 0.14;
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.86, tilt, 0, Math.PI * 2);
      } else if (eyeShape === 'downturned') {
        const tilt = eye.isLeft ? 0.14 : -0.14;
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.86, tilt, 0, Math.PI * 2);
      } else if (eyeShape === 'deep_set') {
        ctx.ellipse(eye.x, eyeY, radiusX * 0.90, radiusY * 0.75, 0, 0, Math.PI * 2);
      } else {
        // Classic Almond (Default)
        ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.88, 0, 0, Math.PI * 2);
      }
      ctx.clip();

      // Sclera (Eyeball white)
      ctx.fillStyle = '#f5f3ec';
      ctx.fillRect(eye.x - radiusX * 1.5, eyeY - radiusY * 1.5, radiusX * 3, radiusY * 3);

      // Sclera top shadow (eyelid shadow cast onto cornea)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(eye.x - radiusX * 1.5, eyeY - radiusY * 1.5, radiusX * 3, radiusY * 0.90);

      // Iris
      const irisRadius = radiusY * 0.85;
      ctx.fillStyle = eye.col;
      ctx.beginPath();
      ctx.arc(eye.x, eyeY, irisRadius, 0, Math.PI * 2);
      ctx.fill();

      // Limbal Ring (outer dark ring)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#0a0a0d';
      ctx.beginPath();
      ctx.arc(eye.x, eyeY, irisRadius * 0.46, 0, Math.PI * 2);
      ctx.fill();

      // Multi-Sparkle Specular Highlights (Life sparkle)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eye.x - irisRadius * 0.35, eyeY - irisRadius * 0.35, irisRadius * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(eye.x + irisRadius * 0.28, eyeY + irisRadius * 0.28, irisRadius * 0.11, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Upper Eyelash / Eyeliner line
      ctx.strokeStyle = '#181519';
      ctx.lineWidth = (eyeExtra === 'eyeliner') ? 3.0 : 1.9;
      ctx.beginPath();
      ctx.ellipse(eye.x, eyeY, radiusX, radiusY * 0.88, 0, Math.PI, 0);
      ctx.stroke();

      // Eyelid crease line (Double / Hooded)
      if (eyelid === 'double' && eyeShape !== 'monolid') {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.24)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(eye.x, eyeY - radiusY * 0.35, radiusX * 0.9, radiusY * 0.70, 0, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.stroke();
      }
    });
  }

  // 15. Eyebrows Layer (Clear clearance above eyes, eyebrow piercings)
  function drawEyebrowsLayer(ctx, w, h, eyebrow, hair, age, piercing) {
    const browY = h * 0.330;
    const browColor = (age >= 51 && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') ? '#a0a0a5' : (hair.base || '#2a2220');
    const leftCenterX = w * 0.380;
    const rightCenterX = w * 0.620;
    const browHalfW = w * 0.055;

    ctx.strokeStyle = browColor;
    ctx.lineWidth = (eyebrow === 'thick') ? 3.6 : (eyebrow === 'thin' ? 1.4 : 2.4);
    ctx.lineCap = 'round';

    // Left Brow
    ctx.beginPath();
    if (eyebrow === 'straight') {
      ctx.moveTo(leftCenterX - browHalfW, browY);
      ctx.lineTo(leftCenterX + browHalfW, browY);
    } else if (eyebrow === 'arched' || eyebrow === 'angled') {
      ctx.moveTo(leftCenterX - browHalfW, browY + h * 0.008);
      ctx.lineTo(leftCenterX, browY - h * 0.010);
      ctx.lineTo(leftCenterX + browHalfW, browY + h * 0.006);
    } else if (eyebrow === 'rounded') {
      ctx.arc(leftCenterX, browY + h * 0.018, browHalfW, 1.2 * Math.PI, 1.8 * Math.PI);
    } else {
      // Soft arch (Default)
      ctx.moveTo(leftCenterX - browHalfW, browY + h * 0.004);
      ctx.quadraticCurveTo(leftCenterX, browY - h * 0.008, leftCenterX + browHalfW, browY + h * 0.004);
    }
    ctx.stroke();

    // Right Brow
    ctx.beginPath();
    if (eyebrow === 'straight') {
      ctx.moveTo(rightCenterX - browHalfW, browY);
      ctx.lineTo(rightCenterX + browHalfW, browY);
    } else if (eyebrow === 'arched' || eyebrow === 'angled') {
      ctx.moveTo(rightCenterX - browHalfW, browY + h * 0.006);
      ctx.lineTo(rightCenterX, browY - h * 0.010);
      ctx.lineTo(rightCenterX + browHalfW, browY + h * 0.008);
    } else if (eyebrow === 'rounded') {
      ctx.arc(rightCenterX, browY + h * 0.018, browHalfW, 1.2 * Math.PI, 1.8 * Math.PI);
    } else {
      // Soft arch (Default)
      ctx.moveTo(rightCenterX - browHalfW, browY + h * 0.004);
      ctx.quadraticCurveTo(rightCenterX, browY - h * 0.008, rightCenterX + browHalfW, browY + h * 0.004);
    }
    ctx.stroke();

    // Eyebrow piercing (outer arch of right eyebrow)
    if (piercing === 'eyebrow') {
      ctx.fillStyle = '#dedde6';
      ctx.strokeStyle = '#252528';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(rightCenterX + browHalfW * 0.8, browY - h * 0.006, w * 0.007, 0, Math.PI * 2);
      ctx.arc(rightCenterX + browHalfW * 0.8, browY + h * 0.012, w * 0.007, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 16. Front Hair, Bangs & Framing Locks (Frames forehead WITHOUT smothering brows)
  function drawFrontHairLayer(ctx, w, h, style, texture, bangs, hair, headwear, age) {
    if (style === 'bald') return;

    const centerX = w * 0.50;
    const baseColor = (age >= 51 && hair.base !== '#dedbd2' && hair.base !== '#f0eff2') ? '#9e9ea3' : hair.base;
    const shadowColor = hair.shadow || '#121214';

    ctx.fillStyle = baseColor;
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1.5;

    if (style === 'buzz_cut') {
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.28, w * 0.22, h * 0.14, 0, Math.PI, 0);
      ctx.fill();
      return;
    }

    // Front Hair Framing (Temples & Crown)
    if (style === 'pixie' || style === 'crop') {
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.22, h * 0.38);
      ctx.bezierCurveTo(centerX - w * 0.24, h * 0.16, centerX + w * 0.24, h * 0.16, centerX + w * 0.22, h * 0.38);
      ctx.lineTo(centerX + w * 0.18, h * 0.28);
      ctx.bezierCurveTo(centerX + w * 0.10, h * 0.22, centerX - w * 0.10, h * 0.22, centerX - w * 0.18, h * 0.28);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'hijab') {
      // Front inner cap of hijab framing face cleanly
      ctx.fillStyle = '#1c1d22';
      ctx.beginPath();
      ctx.arc(centerX, h * 0.28, w * 0.17, Math.PI, 0);
      ctx.fill();
    } else {
      // Crown & Temple Framing Locks for Parted, Long, Waves, Braids, Buns, Bobs, etc.
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.23, h * 0.44);
      ctx.bezierCurveTo(centerX - w * 0.24, h * 0.16, centerX + w * 0.24, h * 0.16, centerX + w * 0.23, h * 0.44);
      ctx.lineTo(centerX + w * 0.18, h * 0.32);
      ctx.bezierCurveTo(centerX + w * 0.08, h * 0.22, centerX - w * 0.08, h * 0.22, centerX - w * 0.18, h * 0.32);
      ctx.closePath();
      ctx.fill();
    }

    // Bangs / Fringes (Engineered with strict clearance above brow line at 0.330!)
    if (bangs === 'straight') {
      // Trimmed straight bangs stopping cleanly at h * 0.300 (above eyebrows at 0.330!)
      ctx.beginPath();
      ctx.rect(centerX - w * 0.16, h * 0.22, w * 0.32, h * 0.080);
      ctx.fill();
      // Strand feathering
      ctx.strokeStyle = shadowColor;
      for (let bx = centerX - w * 0.14; bx <= centerX + w * 0.14; bx += w * 0.04) {
        ctx.beginPath();
        ctx.moveTo(bx, h * 0.27); ctx.lineTo(bx, h * 0.300);
        ctx.stroke();
      }
    } else if (bangs === 'curtain') {
      // Parted curtain bangs sweeping outward to temples, keeping brow and eye centers open
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.18, h * 0.34);
      ctx.lineTo(centerX - w * 0.03, h * 0.25);
      ctx.lineTo(centerX - w * 0.18, h * 0.23);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + w * 0.18, h * 0.34);
      ctx.lineTo(centerX + w * 0.03, h * 0.25);
      ctx.lineTo(centerX + w * 0.18, h * 0.23);
      ctx.closePath();
      ctx.fill();
    } else if (bangs === 'wispy') {
      // Light airy strands leaving forehead mostly open
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(centerX - w * 0.08, h * 0.24); ctx.lineTo(centerX - w * 0.05, h * 0.305);
      ctx.moveTo(centerX, h * 0.23); ctx.lineTo(centerX + w * 0.01, h * 0.295);
      ctx.moveTo(centerX + w * 0.08, h * 0.24); ctx.lineTo(centerX + w * 0.05, h * 0.305);
      ctx.stroke();
    } else if (bangs === 'micro') {
      // High trendy micro fringe at h * 0.260
      ctx.fillRect(centerX - w * 0.13, h * 0.22, w * 0.26, h * 0.045);
    }
  }

  // 17. Glasses Layer (Clear lens sheen, sitting naturally over eyes with generous brow clearance)
  function drawGlassesLayer(ctx, w, h, style, age) {
    const eyeY = h * 0.395;
    const leftX = w * 0.380;
    const rightX = w * 0.620;
    const glassRadius = w * 0.062;

    const frameColor = (style === 'sunglasses') ? '#141417' : ((style === 'cat_eye') ? '#7d2432' : ((style === 'thick_frame') ? '#1b1b1e' : '#8d784a'));
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = (style === 'thick_frame' || style === 'sunglasses') ? 3.0 : 1.8;

    [leftX, rightX].forEach(x => {
      ctx.beginPath();
      if (style === 'square' || style === 'thick_frame') {
        // Square frames centered at 0.395, top rim at 0.395 - 0.042 = 0.353 (well under brow 0.330)
        ctx.rect(x - glassRadius, eyeY - glassRadius * 0.68, glassRadius * 2, glassRadius * 1.36);
      } else {
        // Round wire / Cat-eye / Sunglasses
        ctx.ellipse(x, eyeY, glassRadius, glassRadius * 0.78, 0, 0, Math.PI * 2);
      }

      if (style === 'sunglasses') {
        ctx.fillStyle = 'rgba(15, 15, 18, 0.88)';
        ctx.fill();
        // Diagonal highlight glare
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.30)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - glassRadius * 0.5, eyeY - glassRadius * 0.5);
        ctx.lineTo(x + glassRadius * 0.5, eyeY + glassRadius * 0.5);
        ctx.stroke();
      } else {
        // Anti-reflective clear glass sheen
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
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

  // 18. Headwear (Beanie, Beret, Baseball Cap)
  function drawHeadwearLayer(ctx, w, h, headwear, hair) {
    const centerX = w * 0.50;

    if (headwear === 'beanie') {
      ctx.fillStyle = '#22232a';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.22, w * 0.23, h * 0.14, 0, Math.PI, 0);
      ctx.rect(centerX - w * 0.21, h * 0.20, w * 0.42, h * 0.055);
      ctx.fill();
      ctx.strokeStyle = '#121217';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else if (headwear === 'beret') {
      ctx.fillStyle = '#651c27';
      ctx.beginPath();
      ctx.ellipse(centerX + w * 0.03, h * 0.21, w * 0.25, h * 0.075, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3e0e16';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else if (headwear === 'baseball_cap') {
      ctx.fillStyle = '#1c2842';
      ctx.beginPath();
      ctx.ellipse(centerX, h * 0.22, w * 0.21, h * 0.11, 0, Math.PI, 0);
      ctx.fill();
      // Visor
      ctx.fillRect(centerX - w * 0.23, h * 0.22, w * 0.46, h * 0.032);
    }
  }

  // 19. Antique Daguerreotype Brass Rim & Corner Rosettes
  function drawDaguerreotypeBorder(ctx, w, h) {
    ctx.strokeStyle = '#7c6d48';
    ctx.lineWidth = Math.max(2, Math.floor(w * 0.024));
    ctx.strokeRect(w * 0.02, h * 0.02, w * 0.96, h * 0.96);

    ctx.strokeStyle = '#423b28';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.038, h * 0.038, w * 0.924, h * 0.924);

    // Ornate brass corner rosettes
    const rosetteSize = w * 0.042;
    ctx.fillStyle = '#9e8d5e';
    [
      [w * 0.048, h * 0.048],
      [w * 0.952, h * 0.048],
      [w * 0.048, h * 0.952],
      [w * 0.952, h * 0.952]
    ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rosetteSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5a4c28';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
  }

  // Expose Globally
  window.drawGothicAvatar = drawGothicAvatar;
  window.AVATAR_PALETTES = AVATAR_PALETTES;
})();
