// Modern Era Countries, Cities, Currencies, and Lore for Terrible Little Lives

const COUNTRIES_DATA = {
  USA: {
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    currency: { code: "USD", symbol: "$", rate: 1 },
    wageMultiplier: 1.0,
    annualLivingCost: 16000,
    startingMoney: 1500,
    maxGodMoney: 100000,
    godMoneyStep: 1000,
    cities: ["Seattle, WA", "New Orleans, LA", "Detroit, MI", "Salem, MA", "Chicago, IL", "Philadelphia, PA"],
    firstNamesMale: ["Ethan", "Lucas", "Noah", "Caleb", "Julian", "Damian", "Adrian", "Gabriel", "Silas", "Rowan"],
    firstNamesFemale: ["Chloe", "Maya", "Elena", "Sadie", "Vera", "Raven", "Iris", "Piper", "Harper", "Lilith"],
    surnames: ["Blackwood", "Mercer", "Holloway", "Cross", "Vance", "Knotts", "Rivers", "Winter", "Ward", "Drake"]
  },
  GBR: {
    name: "United Kingdom",
    code: "GBR",
    flag: "🇬🇧",
    currency: { code: "GBP", symbol: "£", rate: 0.88 },
    wageMultiplier: 0.88,
    annualLivingCost: 14000,
    startingMoney: 1200,
    maxGodMoney: 85000,
    godMoneyStep: 1000,
    cities: ["London", "Edinburgh", "York", "Whitby", "Manchester", "Bristol"],
    firstNamesMale: ["Oliver", "Arthur", "Felix", "Jasper", "Archie", "George", "Theo", "Callum", "Finley", "Harry"],
    firstNamesFemale: ["Eleanor", "Florence", "Freya", "Isla", "Imogen", "Phoebe", "Ophelia", "Beatrice", "Maeve", "Clara"],
    surnames: ["Ravenscroft", "Hastings", "Danvers", "Grimm", "Ashford", "Morcant", "Finch", "Lancaster", "Peck", "Neville"]
  },
  JPN: {
    name: "Japan",
    code: "JPN",
    flag: "🇯🇵",
    currency: { code: "JPY", symbol: "¥", rate: 100 },
    wageMultiplier: 100,
    annualLivingCost: 1800000,
    startingMoney: 180000,
    maxGodMoney: 15000000,
    godMoneyStep: 100000,
    cities: ["Tokyo (Shibuya)", "Kyoto (Gion)", "Aomori (Osorezan)", "Osaka", "Sapporo", "Yokohama"],
    firstNamesMale: ["Ren", "Haruto", "Kaito", "Sora", "Ryu", "Taiga", "Kazuki", "Yuto", "Shinji", "Hayato"],
    firstNamesFemale: ["Yuna", "Hina", "Koharu", "Rei", "Aoi", "Mei", "Mio", "Rin", "Kagura", "Sayuri"],
    surnames: ["Kurosawa", "Saeki", "Tsuchiya", "Mishima", "Inoue", "Moriyama", "Shirakawa", "Takahashi", "Nakamura", "Kondo"]
  },
  DEU: {
    name: "Germany",
    code: "DEU",
    flag: "🇩🇪",
    currency: { code: "EUR", symbol: "€", rate: 0.95 },
    wageMultiplier: 0.95,
    annualLivingCost: 14500,
    startingMoney: 1300,
    maxGodMoney: 90000,
    godMoneyStep: 1000,
    cities: ["Berlin", "Freiburg (Black Forest)", "Hamburg", "Munich", "Heidelberg"],
    firstNamesMale: ["Lukas", "Leon", "Jonas", "Niklas", "Felix", "Maximilian", "Finn", "Elias", "Moritz", "Anton"],
    firstNamesFemale: ["Hannah", "Emma", "Mia", "Sophie", "Clara", "Lina", "Laura", "Leonie", "Marie", "Greta"],
    surnames: ["Schmidt", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Koch", "Richter", "Wolf", "Krause"]
  },
  FRA: {
    name: "France",
    code: "FRA",
    flag: "🇫🇷",
    currency: { code: "EUR", symbol: "€", rate: 0.92 },
    wageMultiplier: 0.92,
    annualLivingCost: 14000,
    startingMoney: 1300,
    maxGodMoney: 90000,
    godMoneyStep: 1000,
    cities: ["Paris (14th Arr.)", "Lyon", "Marseille", "Bordeaux", "Rennes (Brittany)"],
    firstNamesMale: ["Gabriel", "Leo", "Raphael", "Louis", "Arthur", "Jules", "Adam", "Lucas", "Hugo", "Maxime"],
    firstNamesFemale: ["Jade", "Louise", "Ambre", "Alice", "Rose", "Anna", "Emma", "Mia", "Lea", "Chloe"],
    surnames: ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau"]
  },
  CAN: {
    name: "Canada",
    code: "CAN",
    flag: "🇨🇦",
    currency: { code: "CAD", symbol: "C$", rate: 1.25 },
    wageMultiplier: 1.25,
    annualLivingCost: 20000,
    startingMoney: 1800,
    maxGodMoney: 125000,
    godMoneyStep: 1000,
    cities: ["Vancouver, BC", "Toronto, ON", "Montreal, QC", "Calgary, AB", "Halifax, NS"],
    firstNamesMale: ["Liam", "Noah", "Jackson", "Lucas", "Benjamin", "Logan", "William", "James", "Oliver", "Jacob"],
    firstNamesFemale: ["Olivia", "Emma", "Charlotte", "Amelia", "Ava", "Sophia", "Chloe", "Ella", "Abigail", "Emily"],
    surnames: ["Tremblay", "Roy", "Gagnon", "Bouchard", "Gauthier", "Morin", "Lavoie", "Fortin", "Cote", "Belanger"]
  },
  IDN: {
    name: "Indonesia",
    code: "IDN",
    flag: "🇮🇩",
    currency: { code: "IDR", symbol: "Rp", rate: 2000 },
    wageMultiplier: 2000,
    annualLivingCost: 30000000,
    startingMoney: 4000000,
    maxGodMoney: 250000000,
    godMoneyStep: 2500000,
    cities: ["Jakarta (Kota Tua)", "Yogyakarta (Merapi slope)", "Bandung", "Surabaya", "Malang"],
    firstNamesMale: ["Arya", "Bima", "Dimas", "Fajar", "Galih", "Bayu", "Rian", "Aditya", "Rizky", "Satria"],
    firstNamesFemale: ["Kirana", "Laras", "Nadia", "Sari", "Tari", "Maya", "Dian", "Citra", "Anggun", "Sekar"],
    surnames: ["Pratama", "Wijaya", "Kusuma", "Saputra", "Santoso", "Suryono", "Hidayat", "Wibowo", "Permana", "Kurniawan"]
  },
  AUS: {
    name: "Australia",
    code: "AUS",
    flag: "🇦🇺",
    currency: { code: "AUD", symbol: "A$", rate: 1.55 },
    wageMultiplier: 1.55,
    annualLivingCost: 25000,
    startingMoney: 2200,
    maxGodMoney: 150000,
    godMoneyStep: 1000,
    cities: ["Melbourne", "Sydney", "Brisbane", "Perth", "Hobart (Tasmania)"],
    firstNamesMale: ["Jack", "William", "Noah", "Thomas", "James", "Lucas", "Henry", "Alexander", "Max", "Cooper"],
    firstNamesFemale: ["Charlotte", "Olivia", "Amelia", "Isla", "Mia", "Ava", "Grace", "Zoe", "Ruby", "Evelyn"],
    surnames: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Morton", "Anderson", "Kelly", "Dixon"]
  }
};

const MODERN_ORIGINS = [
  "You were born in an urban hospital delivery room during an unexplainable total grid blackout.",
  "Your parents' smart nursery monitor kept detecting a second heartbeat beside your crib at 3:14 AM.",
  "A hospital nurse quit her job the morning after you were born, claiming your reflection did not match your cradle.",
  "Your mother's 4D ultrasound scan showed a faint, translucent hand resting gently against your tiny shoulder.",
  "The smart doorbell camera at your family's apartment recorded a hooded figure standing silently outside for seven hours the night you arrived home.",
  "Born during an unseasonal geomagnetic solar storm that caused every analog radio in the maternity ward to tune into white noise."
];

const MODERN_TRAITS = [
  { id: "screen_static", name: "Analog Sensitivity", desc: "You hear high-frequency hums from CRT TVs, security cams, and electronic monitors." },
  { id: "chronic_insomnia", name: "Severe Insomnia", desc: "You function on 3 hours of sleep; you are acutely aware of what happens in the house between 2 and 4 AM." },
  { id: "second_sight", name: "Involuntary Second Sight", desc: "You occasionally catch glimpses of people who are not in the room when looking through smartphone camera lenses." },
  { id: "crypto_luck", name: "Shilling Affinity", desc: "You have an uncanny knack for finding blackened occult coins in thrift shops, riverbanks, and old floor cracks." },
  { id: "cold_pulse", name: "Cold-Blooded Demeanor", desc: "Your resting heart rate is unnervingly slow. Panic rarely overtakes you in the dark." },
  { id: "average_citizen", name: "Average Civilian", desc: "A normal modern person trying to survive rent and late-stage capitalism while things lurk in the dark." }
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomAvatar(options = {}) {
  const gender = options.gender || (Math.random() > 0.5 ? 'Male' : 'Female');
  const age = options.age !== undefined ? options.age : 16;
  const isElder = age >= 51;
  const isAdult = age >= 30;
  const isChild = age < 13;

  const skins = ['porcelain', 'ivory', 'warm_beige', 'golden_peach', 'olive', 'warm_bronze', 'chestnut', 'rich_espresso', 'deep_ebony', 'ash', 'sallow'];
  const faceShapes = ['oval', 'round', 'square', 'rectangle', 'heart', 'diamond', 'triangle', 'inverted_triangle', 'oblong', 'wide'];
  const eyeShapes = ['almond', 'round', 'hooded', 'monolid', 'upturned', 'downturned', 'deep_set'];
  const naturalEyeColors = ['black', 'dark_brown', 'brown', 'light_brown', 'hazel', 'amber', 'green', 'olive_green', 'blue', 'gray'];
  const rareEyeColors = ['golden', 'violet', 'albino_red', 'ice_blue', 'crimson', 'starburst'];
  const eyeColors = Math.random() < 0.12 ? rareEyeColors : naturalEyeColors;
  
  const naturalHairColors = ['raven', 'dark_brown', 'ash_brown', 'chestnut', 'auburn', 'ginger_red', 'strawberry_blonde', 'dark_blonde', 'golden_blonde', 'platinum', 'silver_gray', 'pure_white'];
  const dyedHairColors = ['pastel_pink', 'rose', 'peach', 'crimson_dye', 'neon_orange', 'moss_green', 'teal', 'deep_blue', 'royal_purple', 'lavender', 'split_black_white'];
  
  let chosenHairColor = getRandomElement(naturalHairColors);
  if (isElder) {
    chosenHairColor = Math.random() < 0.6 ? 'silver_gray' : 'pure_white';
  } else if (!isChild && Math.random() < 0.18) {
    chosenHairColor = getRandomElement(dyedHairColors);
  }

  const shortHairStyles = ['pixie', 'crop', 'short_bob', 'shag', 'buzz_cut', 'parted'];
  const mediumLongHairStyles = ['bob', 'wolf_cut', 'mullet', 'braids', 'box_braids', 'dreadlocks', 'space_buns', 'messy_bun', 'long', 'loose_waves', 'straight_long', 'hijab'];
  const hairStyles = (gender === 'Male' && Math.random() < 0.75) ? shortHairStyles : (gender === 'Female' && Math.random() < 0.75 ? mediumLongHairStyles : [...shortHairStyles, ...mediumLongHairStyles]);

  const hairTextures = ['straight', 'wavy', 'curly', 'coily'];
  const bangsOptions = ['none', 'none', 'curtain', 'straight', 'wispy', 'micro'];
  const noseStyles = ['straight', 'button', 'roman', 'aquiline', 'broad', 'snub'];
  const lipsStyles = ['thin', 'medium', 'full', 'heart', 'wide', 'upturned', 'downturned'];
  const eyebrows = ['straight', 'arched', 'soft_arch', 'rounded', 'angled', 'thick', 'thin', 'feathered'];
  
  // Facial hair for mature males
  let facialHair = 'clean';
  if (gender === 'Male' && age >= 18 && Math.random() < 0.55) {
    facialHair = getRandomElement(['stubble', 'mustache', 'chevron_mustache', 'handlebar', 'short_beard', 'full_beard', 'goatee', 'mutton_chops']);
    if (isElder && Math.random() < 0.3) facialHair = 'wizard';
  }

  // Markings
  const marks = ['none', 'none', 'none', 'freckles', 'moles', 'vitiligo', 'scar', 'cleft_chin'];
  if (age >= 13 && age <= 19 && Math.random() < 0.25) marks.push('acne_teen');

  // Clothing
  let clothing = 'casual';
  if (isChild) {
    clothing = getRandomElement(['casual', 'hoodie', 'sweater']);
  } else if (isElder) {
    clothing = getRandomElement(['sweater', 'cardigan', 'suit', 'casual']);
  } else {
    clothing = getRandomElement(['casual', 'hoodie', 'sweater', 'turtleneck', 'prep_blazer', 'elite_uniform', 'suit', 'goth']);
  }

  // Accessories
  const glasses = (Math.random() < (isElder ? 0.65 : 0.22)) 
    ? getRandomElement(['round_wire', 'square', 'thick_frame', 'cat_eye', 'sunglasses']) 
    : 'none';
  const piercing = (!isChild && Math.random() < 0.20)
    ? getRandomElement(['nose_stud', 'septum', 'eyebrow', 'labret', 'earrings'])
    : 'none';
  const headwear = (Math.random() < 0.15)
    ? getRandomElement(['beanie', 'beret', 'baseball_cap'])
    : 'none';
  const necklace = (!isChild && Math.random() < 0.18)
    ? getRandomElement(['choker', 'chain', 'pendant', 'pearls'])
    : 'none';

  return {
    skin: options.skin || getRandomElement(skins),
    faceShape: options.faceShape || getRandomElement(faceShapes),
    eyeShape: options.eyeShape || getRandomElement(eyeShapes),
    eyeColor: options.eyeColor || (chosenHairColor === 'raven' && Math.random() < 0.05 ? 'crimson' : getRandomElement(eyeColors)),
    eyelid: options.eyelid || getRandomElement(['double', 'single', 'hooded']),
    eyeExtra: options.eyeExtra || (Math.random() < 0.2 ? getRandomElement(['tired_eyes', 'eye_bags', 'eyeliner']) : 'none'),
    eyebrow: options.eyebrow || getRandomElement(eyebrows),
    noseStyle: options.noseStyle || getRandomElement(noseStyles),
    lipsStyle: options.lipsStyle || getRandomElement(lipsStyles),
    hairStyle: options.hairStyle || getRandomElement(hairStyles),
    hairTexture: options.hairTexture || getRandomElement(hairTextures),
    hairColor: options.hairColor || chosenHairColor,
    bangs: options.bangs || getRandomElement(bangsOptions),
    facialHair: options.facialHair || facialHair,
    mark: options.mark || getRandomElement(marks),
    clothing: options.clothing || clothing,
    clothingColor: options.clothingColor || getRandomElement(['black', 'charcoal', 'navy', 'burgundy', 'forest', 'tweed_brown', 'cream', 'denim', 'school_maroon']),
    glasses: options.glasses || glasses,
    piercing: options.piercing || piercing,
    headwear: options.headwear || headwear,
    necklace: options.necklace || necklace,
    age: age,
    gender: gender
  };
}

function formatMoney(amount, countryCode = "USA") {
  const country = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA.USA;
  const sym = country.currency.symbol;
  const val = Math.round(amount || 0);

  if (countryCode === "IDN") {
    return `${sym} ${val.toLocaleString('id-ID')}`;
  } else if (countryCode === "JPN") {
    return `${sym}${val.toLocaleString('ja-JP')}`;
  } else if (countryCode === "GBR") {
    return `${sym}${val.toLocaleString('en-GB')}`;
  } else if (countryCode === "DEU" || countryCode === "FRA") {
    return `${val.toLocaleString('de-DE')} ${sym}`;
  }
  return `${sym}${val.toLocaleString('en-US')}`;
}

function generateCharacter(customConfig = null) {
  const currentYear = 2024;

  if (customConfig) {
    const countryCode = customConfig.countryCode || "USA";
    const country = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA.USA;

    return {
      name: customConfig.name || "Alex Mercer",
      gender: customConfig.gender || "Enigmatic",
      countryCode,
      countryName: country.name,
      city: customConfig.city || country.cities[0],
      origin: customConfig.origin || MODERN_ORIGINS[0],
      trait: customConfig.trait || MODERN_TRAITS[0],
      age: 0,
      year: currentYear,
      
      // Dual Currencies
      money: customConfig.money !== undefined ? customConfig.money : country.startingMoney,
      shillings: customConfig.shillings !== undefined ? customConfig.shillings : 10,
      
      avatar: customConfig.avatar || generateRandomAvatar(),
      isGodMode: !!customConfig.isGodMode,
      job: null,
      paranormalGig: null,
      
      stats: {
        vitality: customConfig.stats?.vitality ?? 90,
        smarts: customConfig.stats?.smarts ?? 75,
        looks: customConfig.stats?.looks ?? 70,
        happiness: customConfig.stats?.happiness ?? 80,
        sanity: customConfig.stats?.sanity ?? 85,
        occult: customConfig.stats?.occult ?? 15,
        humanity: customConfig.stats?.humanity ?? 95
      },
      statusTitle: "Infant",
      isAlive: true,
      deathCause: null,
      epitaph: null
    };
  }

  const countryKeys = Object.keys(COUNTRIES_DATA);
  const countryCode = getRandomElement(countryKeys);
  const country = COUNTRIES_DATA[countryCode];
  const isMale = Math.random() > 0.5;
  const firstName = isMale ? getRandomElement(country.firstNamesMale) : getRandomElement(country.firstNamesFemale);
  const surname = getRandomElement(country.surnames);
  const city = getRandomElement(country.cities);
  const origin = getRandomElement(MODERN_ORIGINS);
  const trait = getRandomElement(MODERN_TRAITS);

  return {
    name: `${firstName} ${surname}`,
    gender: isMale ? "Male" : "Female",
    countryCode,
    countryName: country.name,
    city,
    origin,
    trait,
    age: 0,
    year: currentYear,
    money: country.startingMoney,
    shillings: Math.floor(Math.random() * 8) + 2,
    avatar: generateRandomAvatar(),
    isGodMode: false,
    job: null,
    paranormalGig: null,
    stats: {
      vitality: Math.floor(Math.random() * 15) + 80,
      smarts: Math.floor(Math.random() * 25) + 65,
      looks: Math.floor(Math.random() * 25) + 60,
      happiness: Math.floor(Math.random() * 20) + 75,
      sanity: Math.floor(Math.random() * 20) + 75,
      occult: Math.floor(Math.random() * 15) + 10,
      humanity: Math.floor(Math.random() * 10) + 85
    },
    statusTitle: "Infant",
    isAlive: true,
    deathCause: null,
    epitaph: null
  };
}

window.COUNTRIES_DATA = COUNTRIES_DATA;
window.MODERN_ORIGINS = MODERN_ORIGINS;
window.MODERN_TRAITS = MODERN_TRAITS;
window.generateCharacter = generateCharacter;
window.generateRandomAvatar = generateRandomAvatar;
window.getRandomElement = getRandomElement;
window.formatMoney = formatMoney;
