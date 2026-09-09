// Name, Lineage, and Lore Generator for Terrible Little Lives

const GOTHIC_DATA = {
  firstNamesMale: [
    "Alasdair", "Ambrose", "Bartholomew", "Caleb", "Enoch", 
    "Gideon", "Jasper", "Lucien", "Malachi", "Mortimer", 
    "Percival", "Silas", "Thaddeus", "Victor", "Vincent"
  ],
  firstNamesFemale: [
    "Agatha", "Beatrix", "Cordelia", "Dorothea", "Edith", 
    "Eleanor", "Gwendolyn", "Lavinia", "Mercy", "Ophelia", 
    "Prudence", "Rowena", "Sybil", "Tabitha", "Vespera"
  ],
  surnames: [
    "Blackwood", "Crowley", "Danvers", "Duskwood", "Grimm", 
    "Harrow", "Knotwood", "Locke", "Marrow", "Morcant", 
    "Nadir", "Oakhaven", "Ravenscroft", "Vane", "Wickham"
  ],
  birthplaces: [
    "Coldwater Sanitarium (Ward 4)",
    "Blackwood Vale, beside the sunken quarry",
    "Dunwich Quay under an amber fog",
    "St. Jude's Orphanage cellar attic",
    "An isolated salt marsh homestead",
    "The keeper's cottage at Hollow Lighthouse",
    "Gallows Hill tenements during a snowstorm"
  ],
  origins: [
    "You were born with teeth already cutting through your gums. The midwife crossed herself and fled.",
    "The house bells rang backwards for an hour when you drew your first breath.",
    "Your twin was born dead, yet the nurse swore she heard two distinct infant cries in the dark.",
    "A murder of crows roosted above your mother's window and refused to take flight for three days.",
    "You were born during an unmapped total eclipse. The tallow candles produced no heat that night.",
    "Found on the doorstep of the parish mortuary wrapped in yellowed salt-stained wool."
  ],
  traits: [
    { id: "caul", name: "Born with the Caul", desc: "Immune to ordinary drowning and able to discern unseen spirits." },
    { id: "night_terrors", name: "Chronic Night Terrors", desc: "Your sleep yields strange whispers and prophetic nightmares." },
    { id: "silver_spoon", name: "Tarnished Aristocrat", desc: "Born into wealth that carries an ancestral debt to the dark." },
    { id: "cold_blooded", name: "Pale & Cold-Blooded", desc: "Your pulse is slow; cold weather and fright touch you less." },
    { id: "none", name: "Ordinary Mortal", desc: "A fragile human soul walking through a dreadful world." }
  ]
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomAvatar() {
  const skins = ['porcelain', 'ash', 'sallow', 'olive', 'bruised', 'mortuary'];
  const eyeShapes = ['sunken', 'wide', 'narrow', 'blind', 'monstrous'];
  const eyeColors = ['coal', 'ice_blue', 'pale_hazel', 'crimson', 'violet', 'milky'];
  const hairStyles = ['parted', 'slicked', 'unkempt', 'braids', 'bob'];
  const hairColors = ['raven', 'ash_brown', 'auburn', 'ghost_white', 'pale_blonde'];
  const marks = ['hollow_circles', 'spectacles', 'scar', 'caul', 'none'];

  return {
    skin: getRandomElement(skins),
    eyeShape: getRandomElement(eyeShapes),
    eyeColor: getRandomElement(eyeColors),
    hairStyle: getRandomElement(hairStyles),
    hairColor: getRandomElement(hairColors),
    mark: getRandomElement(marks)
  };
}

function generateCharacter(customConfig = null) {
  if (customConfig) {
    return {
      name: customConfig.name || "Silas Marrow",
      gender: customConfig.gender || "Male",
      birthplace: customConfig.birthplace || GOTHIC_DATA.birthplaces[0],
      origin: customConfig.origin || GOTHIC_DATA.origins[0],
      trait: customConfig.trait || GOTHIC_DATA.traits[0],
      age: 0,
      year: 1888 + Math.floor(Math.random() * 20),
      coin: customConfig.coin !== undefined ? customConfig.coin : 20,
      avatar: customConfig.avatar || generateRandomAvatar(),
      isGodMode: !!customConfig.isGodMode,
      stats: {
        vitality: customConfig.stats?.vitality ?? 85,
        sanity: customConfig.stats?.sanity ?? 80,
        happiness: customConfig.stats?.happiness ?? 75,
        smarts: customConfig.stats?.smarts ?? 70,
        looks: customConfig.stats?.looks ?? 65,
        occult: customConfig.stats?.occult ?? 15,
        humanity: customConfig.stats?.humanity ?? 90
      },
      statusTitle: "Infant",
      isAlive: true,
      deathCause: null,
      epitaph: null
    };
  }

  const isMale = Math.random() > 0.5;
  const firstName = isMale
    ? getRandomElement(GOTHIC_DATA.firstNamesMale)
    : getRandomElement(GOTHIC_DATA.firstNamesFemale);
  const surname = getRandomElement(GOTHIC_DATA.surnames);
  const birthplace = getRandomElement(GOTHIC_DATA.birthplaces);
  const origin = getRandomElement(GOTHIC_DATA.origins);
  const trait = getRandomElement(GOTHIC_DATA.traits);

  return {
    name: `${firstName} ${surname}`,
    gender: isMale ? "Male" : "Female",
    birthplace,
    origin,
    trait,
    age: 0,
    year: 1888 + Math.floor(Math.random() * 20),
    coin: Math.floor(Math.random() * 15) + 8,
    avatar: generateRandomAvatar(),
    isGodMode: false,
    stats: {
      vitality: Math.floor(Math.random() * 20) + 75,
      sanity: Math.floor(Math.random() * 20) + 70,
      happiness: Math.floor(Math.random() * 25) + 65,
      smarts: Math.floor(Math.random() * 20) + 70,
      looks: Math.floor(Math.random() * 25) + 60,
      occult: Math.floor(Math.random() * 15) + 10,
      humanity: Math.floor(Math.random() * 10) + 85
    },
    statusTitle: "Infant",
    isAlive: true,
    deathCause: null,
    epitaph: null
  };
}

window.GOTHIC_DATA = GOTHIC_DATA;
window.generateCharacter = generateCharacter;
window.generateRandomAvatar = generateRandomAvatar;
window.getRandomElement = getRandomElement;
