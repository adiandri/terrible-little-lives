import assert from 'node:assert/strict';
import test from 'node:test';

await import('./avatar-v2-compat.js');

const legacyOptions = {
  skin: ['porcelain', 'ivory', 'warm_beige', 'golden_peach', 'olive', 'warm_bronze', 'chestnut', 'rich_espresso', 'deep_ebony', 'ash', 'sallow', 'bruised', 'mortuary'],
  faceShape: ['oval', 'round', 'square', 'rectangle', 'heart', 'diamond', 'triangle', 'inverted_triangle', 'oblong', 'wide'],
  eyeShape: ['almond', 'round', 'hooded', 'monolid', 'upturned', 'downturned', 'deep_set'],
  hairStyle: ['pixie', 'crop', 'short_bob', 'shag', 'buzz_cut', 'parted', 'bob', 'wolf_cut', 'mullet', 'braids', 'box_braids', 'dreadlocks', 'space_buns', 'messy_bun', 'long', 'loose_waves', 'straight_long', 'hijab'],
  hairTexture: ['straight', 'wavy', 'curly', 'coily'],
  mark: ['none', 'freckles', 'light_freckles', 'moles', 'vitiligo', 'scar', 'acne', 'acne_teen', 'cleft_chin'],
  clothing: ['casual', 'hoodie', 'sweater', 'cardigan', 'turtleneck', 'prep_blazer', 'elite_uniform', 'suit', 'lab_coat', 'scrubs', 'goth'],
  clothingColor: ['black', 'charcoal', 'navy', 'burgundy', 'forest', 'tweed_brown', 'cream', 'denim', 'school_maroon'],
  necklace: ['none', 'choker', 'chain', 'pendant', 'pearls']
};

test('every legacy generator value maps to a complete valid V2 config', () => {
  for (const [field, values] of Object.entries(legacyOptions)) {
    for (const value of values) {
      const mapped = globalThis.mapLegacyAvatarToV2({ [field]: value });
      assert.equal(globalThis.isAvatarV2Config(mapped), true, `${field}=${value}`);
      assert.deepEqual(Object.keys(mapped), Object.keys(globalThis.AVATAR_V2_COMPAT_KEYS));
    }
  }
});

test('approved archetypes retain their strongest visual cue', () => {
  assert.deepEqual(globalThis.mapLegacyAvatarToV2({ skin: 'porcelain', faceShape: 'heart', hairStyle: 'wolf_cut', clothing: 'goth', necklace: 'choker' }), {
    skin: 'ivory', face: 'heart', eyes: 'almond', hair: 'sidePart', outfit: 'plum', marking: 'none', accessory: 'cameo'
  });
  assert.equal(globalThis.mapLegacyAvatarToV2({ hairStyle: 'dreadlocks' }).hair, 'crown');
  assert.equal(globalThis.mapLegacyAvatarToV2({ hairStyle: 'short_bob' }).hair, 'bob');
  assert.equal(globalThis.mapLegacyAvatarToV2({ necklace: 'pendant' }).accessory, 'amber');
});

test('missing, unknown, and malformed legacy values use safe defaults', () => {
  for (const legacy of [undefined, null, {}, { skin: 'eldritch', hairStyle: 404 }]) {
    const mapped = globalThis.mapLegacyAvatarToV2(legacy);
    assert.equal(globalThis.isAvatarV2Config(mapped), true);
  }
  assert.equal(globalThis.isAvatarV2Config({}), false);
});

test('secondary legacy traits inform the closest available V2 family', () => {
  assert.equal(globalThis.mapLegacyAvatarToV2({ hairStyle: 'crop', hairTexture: 'coily' }).hair, 'crown');
  assert.equal(globalThis.mapLegacyAvatarToV2({ eyeShape: 'round', eyelid: 'hooded' }).eyes, 'hooded');
  assert.equal(globalThis.mapLegacyAvatarToV2({ clothing: 'casual', clothingColor: 'burgundy' }).outfit, 'plum');
});
