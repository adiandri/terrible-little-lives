(function exposeAvatarV2Compatibility(root) {
  'use strict';

  const VALID_AVATAR_V2_KEYS = Object.freeze({
    skin: Object.freeze(['warm', 'ivory', 'deep']),
    face: Object.freeze(['heart', 'oval']),
    eyes: Object.freeze(['almond', 'hooded']),
    hair: Object.freeze(['sidePart', 'bob', 'crown']),
    outfit: Object.freeze(['uniform', 'plum']),
    marking: Object.freeze(['none', 'freckles', 'scar']),
    accessory: Object.freeze(['none', 'cameo', 'amber'])
  });

  const inSet = (value, values) => values.includes(value);

  function mapSkin(value) {
    if (inSet(value, ['chestnut', 'rich_espresso', 'deep_ebony'])) return 'deep';
    if (inSet(value, ['porcelain', 'ivory', 'ash', 'sallow', 'mortuary'])) return 'ivory';
    return 'warm';
  }

  function mapFace(value) {
    return inSet(value, ['heart', 'diamond', 'inverted_triangle']) ? 'heart' : 'oval';
  }

  function mapEyes(value, eyelid) {
    return inSet(value, ['hooded', 'monolid', 'deep_set']) || eyelid === 'hooded' ? 'hooded' : 'almond';
  }

  function mapHair(value, texture) {
    if (inSet(value, ['short_bob', 'bob', 'long', 'loose_waves', 'straight_long', 'hijab'])) return 'bob';
    if (inSet(value, ['braids', 'box_braids', 'dreadlocks', 'space_buns', 'messy_bun']) || texture === 'coily') return 'crown';
    return 'sidePart';
  }

  function mapOutfit(clothing, color) {
    if (inSet(clothing, ['goth', 'turtleneck']) || inSet(color, ['burgundy', 'school_maroon'])) return 'plum';
    return 'uniform';
  }

  function mapMarking(value) {
    if (inSet(value, ['freckles', 'light_freckles'])) return 'freckles';
    if (value === 'scar') return 'scar';
    return 'none';
  }

  function mapAccessory(avatar) {
    if (avatar.necklace === 'pendant') return 'amber';
    if (inSet(avatar.necklace, ['choker', 'chain', 'pearls'])) return 'cameo';
    return 'none';
  }

  function mapLegacyAvatarToV2(legacy = {}) {
    legacy = legacy || {};
    return {
      skin: mapSkin(legacy.skin),
      face: mapFace(legacy.faceShape),
      eyes: mapEyes(legacy.eyeShape, legacy.eyelid),
      hair: mapHair(legacy.hairStyle, legacy.hairTexture),
      outfit: mapOutfit(legacy.clothing, legacy.clothingColor),
      marking: mapMarking(legacy.mark),
      accessory: mapAccessory(legacy)
    };
  }

  function isAvatarV2Config(config) {
    return Boolean(config) && Object.entries(VALID_AVATAR_V2_KEYS)
      .every(([key, values]) => inSet(config[key], values));
  }

  root.AVATAR_V2_COMPAT_KEYS = VALID_AVATAR_V2_KEYS;
  root.mapLegacyAvatarToV2 = mapLegacyAvatarToV2;
  root.isAvatarV2Config = isAvatarV2Config;
})(typeof window === 'undefined' ? globalThis : window);
