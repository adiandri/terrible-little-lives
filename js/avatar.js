// Modular Gothic Avatar Canvas Renderer for Terrible Little Lives

const AVATAR_PALETTES = {
  skin: {
    porcelain: { base: '#e5ded1', shadow: '#c4bbaa', highlight: '#f3ede2' },
    ash: { base: '#b5b3aa', shadow: '#939188', highlight: '#c8c6bc' },
    sallow: { base: '#d6cba0', shadow: '#b3a87f', highlight: '#e4d9b4' },
    olive: { base: '#8f947e', shadow: '#717562', highlight: '#a4a993' },
    bruised: { base: '#9c8fa3', shadow: '#7d7085', highlight: '#b1a4b8' },
    mortuary: { base: '#cdd3d4', shadow: '#a7afb0', highlight: '#e0e7e8' }
  },
  hair: {
    raven: { base: '#151517', shadow: '#09090a', highlight: '#2e2e34' },
    ash_brown: { base: '#42372d', shadow: '#2c241c', highlight: '#5e5043' },
    auburn: { base: '#642e20', shadow: '#421d14', highlight: '#8a4230' },
    ghost_white: { base: '#dcd9cf', shadow: '#b5b2a6', highlight: '#f5f3ec' },
    pale_blonde: { base: '#baa878', shadow: '#96865c', highlight: '#d6c492' }
  },
  eyes: {
    coal: '#17171a',
    ice_blue: '#5aa3cf',
    pale_hazel: '#8a7751',
    crimson: '#9e1b1b',
    violet: '#724b94',
    milky: '#d6d6de'
  }
};

function drawGothicAvatar(canvas, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Defaults
  const skinKey = options.skin || 'porcelain';
  const skin = AVATAR_PALETTES.skin[skinKey] || AVATAR_PALETTES.skin.porcelain;
  const hairColorKey = options.hairColor || 'raven';
  const hair = AVATAR_PALETTES.hair[hairColorKey] || AVATAR_PALETTES.hair.raven;
  const hairStyle = options.hairStyle || 'parted';
  const eyeShape = options.eyeShape || 'sunken';
  const eyeColorKey = options.eyeColor || 'coal';
  const eyeColor = AVATAR_PALETTES.eyes[eyeColorKey] || AVATAR_PALETTES.eyes.coal;
  const mark = options.mark || 'hollow_circles';
  const age = options.age !== undefined ? options.age : 16;

  ctx.clearRect(0, 0, w, h);

  // 1. Background: Dark Daguerreotype Vignette
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, w * 0.7);
  bgGrad.addColorStop(0, '#262930');
  bgGrad.addColorStop(0.6, '#14161a');
  bgGrad.addColorStop(1, '#090a0c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle plate texture scratches
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.05); ctx.lineTo(w * 0.22, h * 0.9);
  ctx.moveTo(w * 0.75, h * 0.15); ctx.lineTo(w * 0.85, h * 0.85);
  ctx.moveTo(w * 0.05, h * 0.7); ctx.lineTo(w * 0.4, h * 0.8);
  ctx.stroke();

  // Infant Mode (Swaddling cloth & bonnet)
  if (age <= 2) {
    drawInfant(ctx, w, h, skin, eyeColor, eyeShape, mark);
    drawDaguerreotypeBorder(ctx, w, h);
    return;
  }

  // 2. Body / Attire (Victorian High Collar & Coat)
  ctx.fillStyle = '#0e0f12';
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h);
  ctx.bezierCurveTo(w * 0.15, h * 0.72, w * 0.35, h * 0.68, w * 0.38, h * 0.68);
  ctx.lineTo(w * 0.62, h * 0.68);
  ctx.bezierCurveTo(w * 0.65, h * 0.68, w * 0.85, h * 0.72, w * 0.85, h);
  ctx.closePath();
  ctx.fill();

  // White Victorian Stiff Collar
  ctx.fillStyle = '#dcd7ca';
  ctx.beginPath();
  ctx.moveTo(w * 0.4, h * 0.69);
  ctx.lineTo(w * 0.44, h * 0.61);
  ctx.lineTo(w * 0.5, h * 0.67);
  ctx.lineTo(w * 0.56, h * 0.61);
  ctx.lineTo(w * 0.6, h * 0.69);
  ctx.closePath();
  ctx.fill();

  // Dark Tie / Brooch
  ctx.fillStyle = '#1c1c20';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.67, w * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a554a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Neck
  ctx.fillStyle = skin.shadow;
  ctx.fillRect(w * 0.44, h * 0.52, w * 0.12, h * 0.12);

  // 4. Head / Jaw
  ctx.fillStyle = skin.base;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.42, w * 0.22, h * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheekbone / Chin Shading
  ctx.fillStyle = skin.shadow;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.56, w * 0.12, h * 0.08, 0, 0, Math.PI);
  ctx.fill();

  // 5. Ears
  ctx.fillStyle = skin.shadow;
  ctx.beginPath();
  ctx.ellipse(w * 0.28, h * 0.43, w * 0.04, h * 0.07, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.72, h * 0.43, w * 0.04, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Eyes & Eyebrows
  drawEyes(ctx, w, h, eyeShape, eyeColor, skin);

  // 7. Nose
  ctx.strokeStyle = skin.shadow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.38);
  ctx.lineTo(w * 0.48, h * 0.47);
  ctx.lineTo(w * 0.52, h * 0.47);
  ctx.stroke();

  // 8. Mouth (Victorian Somber Line)
  ctx.strokeStyle = '#524346';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.44, h * 0.54);
  ctx.lineTo(w * 0.56, h * 0.54);
  ctx.stroke();

  // 9. Horror Marks
  drawHorrorMark(ctx, w, h, mark, skin);

  // 10. Hairstyle (Rendered over forehead and sides)
  drawHair(ctx, w, h, hairStyle, hair);

  // 11. Antique Brass Daguerreotype Frame Overlay
  drawDaguerreotypeBorder(ctx, w, h);
}

function drawEyes(ctx, w, h, shape, color, skin) {
  const eyeY = h * 0.41;
  const leftX = w * 0.41;
  const rightX = w * 0.59;
  const radius = w * 0.055;

  // Eye Sockets (Dark Victorian Hollows)
  ctx.fillStyle = 'rgba(30, 24, 28, 0.45)';
  ctx.beginPath();
  ctx.arc(leftX, eyeY, radius * 1.35, 0, Math.PI * 2);
  ctx.arc(rightX, eyeY, radius * 1.35, 0, Math.PI * 2);
  ctx.fill();

  // Sclera (Aged Off-white)
  ctx.fillStyle = '#dbd6cb';
  [leftX, rightX].forEach(x => {
    ctx.beginPath();
    if (shape === 'wide') {
      ctx.arc(x, eyeY, radius, 0, Math.PI * 2);
    } else if (shape === 'narrow') {
      ctx.ellipse(x, eyeY, radius, radius * 0.5, 0, 0, Math.PI * 2);
    } else { // sunken / default
      ctx.ellipse(x, eyeY, radius, radius * 0.7, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Iris
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, eyeY, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    if (shape === 'monstrous') {
      ctx.ellipse(x, eyeY, radius * 0.15, radius * 0.5, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(x, eyeY, radius * 0.28, 0, Math.PI * 2);
    }
    ctx.fill();

    // Specular Highlight (Pinprick of light)
    if (shape !== 'blind') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(x - radius * 0.2, eyeY - radius * 0.2, radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Eyebrows
  ctx.strokeStyle = '#262324';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(leftX - radius, eyeY - radius * 1.1);
  ctx.lineTo(leftX + radius, eyeY - radius * 1.25);
  ctx.moveTo(rightX - radius, eyeY - radius * 1.25);
  ctx.lineTo(rightX + radius, eyeY - radius * 1.1);
  ctx.stroke();
}

function drawHair(ctx, w, h, style, hair) {
  ctx.fillStyle = hair.base;
  ctx.strokeStyle = hair.shadow;
  ctx.lineWidth = 2;

  if (style === 'slicked') {
    // Slicked back high Victorian gentleman
    ctx.beginPath();
    ctx.moveTo(w * 0.26, h * 0.42);
    ctx.bezierCurveTo(w * 0.24, h * 0.16, w * 0.76, h * 0.16, w * 0.74, h * 0.42);
    ctx.lineTo(w * 0.68, h * 0.32);
    ctx.bezierCurveTo(w * 0.6, h * 0.24, w * 0.4, h * 0.24, w * 0.32, h * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'parted') {
    // Center part draped down sides
    ctx.beginPath();
    ctx.moveTo(w * 0.24, h * 0.46);
    ctx.bezierCurveTo(w * 0.22, h * 0.14, w * 0.78, h * 0.14, w * 0.76, h * 0.46);
    ctx.lineTo(w * 0.66, h * 0.36);
    ctx.bezierCurveTo(w * 0.58, h * 0.3, w * 0.52, h * 0.3, w * 0.5, h * 0.26);
    ctx.bezierCurveTo(w * 0.48, h * 0.3, w * 0.42, h * 0.3, w * 0.34, h * 0.36);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'unkempt') {
    // Wild gothic jagged locks
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.48);
    ctx.lineTo(w * 0.28, h * 0.24);
    ctx.lineTo(w * 0.34, h * 0.14);
    ctx.lineTo(w * 0.42, h * 0.22);
    ctx.lineTo(w * 0.5, h * 0.11);
    ctx.lineTo(w * 0.58, h * 0.22);
    ctx.lineTo(w * 0.66, h * 0.13);
    ctx.lineTo(w * 0.74, h * 0.26);
    ctx.lineTo(w * 0.78, h * 0.48);
    ctx.lineTo(w * 0.68, h * 0.34);
    ctx.lineTo(w * 0.54, h * 0.28);
    ctx.lineTo(w * 0.46, h * 0.32);
    ctx.lineTo(w * 0.32, h * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (style === 'braids') {
    // Top neat hair + two side mourning braids
    ctx.beginPath();
    ctx.moveTo(w * 0.26, h * 0.4);
    ctx.bezierCurveTo(w * 0.26, h * 0.18, w * 0.74, h * 0.18, w * 0.74, h * 0.4);
    ctx.lineTo(w * 0.68, h * 0.34);
    ctx.bezierCurveTo(w * 0.6, h * 0.28, w * 0.4, h * 0.28, w * 0.32, h * 0.34);
    ctx.closePath();
    ctx.fill();

    // Braids hanging down
    [w * 0.22, w * 0.72].forEach(bx => {
      ctx.beginPath();
      ctx.ellipse(bx, h * 0.55, w * 0.05, h * 0.12, 0, 0, Math.PI * 2);
      ctx.ellipse(bx, h * 0.72, w * 0.04, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (style === 'bob') {
    // Classic straight Victorian fringe with dark bob
    ctx.beginPath();
    ctx.moveTo(w * 0.23, h * 0.52);
    ctx.bezierCurveTo(w * 0.2, h * 0.16, w * 0.8, h * 0.16, w * 0.77, h * 0.52);
    ctx.lineTo(w * 0.7, h * 0.48);
    ctx.lineTo(w * 0.7, h * 0.34);
    ctx.lineTo(w * 0.3, h * 0.34);
    ctx.lineTo(w * 0.3, h * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function drawHorrorMark(ctx, w, h, mark, skin) {
  if (mark === 'hollow_circles') {
    // Heavy bruised exhaustion rings under eyes
    ctx.fillStyle = 'rgba(75, 45, 65, 0.4)';
    ctx.beginPath();
    ctx.arc(w * 0.41, h * 0.45, w * 0.055, 0, Math.PI);
    ctx.arc(w * 0.59, h * 0.45, w * 0.055, 0, Math.PI);
    ctx.fill();
  } else if (mark === 'spectacles') {
    // Round antique wire spectacles
    ctx.strokeStyle = '#8a7a50';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(w * 0.41, h * 0.41, w * 0.065, 0, Math.PI * 2);
    ctx.arc(w * 0.59, h * 0.41, w * 0.065, 0, Math.PI * 2);
    ctx.moveTo(w * 0.475, h * 0.41);
    ctx.lineTo(w * 0.525, h * 0.41);
    ctx.moveTo(w * 0.345, h * 0.41);
    ctx.lineTo(w * 0.28, h * 0.41);
    ctx.moveTo(w * 0.655, h * 0.41);
    ctx.lineTo(w * 0.72, h * 0.41);
    ctx.stroke();
  } else if (mark === 'scar') {
    // Jagged stitched scar across cheek
    ctx.strokeStyle = '#752424';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.44);
    ctx.lineTo(w * 0.42, h * 0.56);
    ctx.stroke();

    // Cross stitches
    ctx.strokeStyle = '#261a1a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const sx = w * (0.35 + i * 0.02);
      const sy = h * (0.46 + i * 0.03);
      ctx.beginPath();
      ctx.moveTo(sx - 4, sy - 4);
      ctx.lineTo(sx + 4, sy + 4);
      ctx.stroke();
    }
  } else if (mark === 'caul') {
    // Pale translucent birth caul over forehead
    ctx.fillStyle = 'rgba(230, 230, 240, 0.28)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.32, w * 0.18, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(210, 210, 225, 0.4)';
    ctx.stroke();
  }
}

function drawInfant(ctx, w, h, skin, eyeColor, eyeShape, mark) {
  // Infant wrapped in dark vintage swaddling cloth
  ctx.fillStyle = '#1c1e24';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.75, w * 0.32, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // White Bonnet
  ctx.fillStyle = '#dcd5c7';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, w * 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a39b8c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Baby Face
  ctx.fillStyle = skin.base;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.44, w * 0.19, 0, Math.PI * 2);
  ctx.fill();

  // Large haunted infant eyes
  drawEyes(ctx, w, h * 1.05, eyeShape, eyeColor, skin);

  // Tiny button nose and pale mouth
  ctx.fillStyle = skin.shadow;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.49, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#5a4649';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.54, 4, 0, Math.PI);
  ctx.stroke();
}

function drawDaguerreotypeBorder(ctx, w, h) {
  // Antique Tarnished Brass Frame
  const frameWidth = Math.max(3, w * 0.025);
  ctx.strokeStyle = '#85754e'; // Antique brass
  ctx.lineWidth = frameWidth;
  ctx.strokeRect(frameWidth / 2, frameWidth / 2, w - frameWidth, h - frameWidth);

  // Inner hairline black inset
  ctx.strokeStyle = '#101114';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(frameWidth + 1.5, frameWidth + 1.5, w - (frameWidth * 2) - 3, h - (frameWidth * 2) - 3);

  // Corner filigree marks
  ctx.fillStyle = '#9e8d64';
  const s = frameWidth * 2;
  ctx.fillRect(0, 0, s, s);
  ctx.fillRect(w - s, 0, s, s);
  ctx.fillRect(0, h - s, s, s);
  ctx.fillRect(w - s, h - s, s, s);
}

window.drawGothicAvatar = drawGothicAvatar;
window.AVATAR_PALETTES = AVATAR_PALETTES;
