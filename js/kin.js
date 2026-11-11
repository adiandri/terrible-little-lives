// Family, Kin, Friends & Entities Engine for Terrible Little Lives
// BitLife-style relationships with modern gothic & paranormal horror dynamics

// Detailed Parent Careers with Baseline Salaries (USD) and Socioeconomic Classes
const PARENT_OCCUPATIONS_DATA = [
  // Working Class / Modest ($24,000 - $45,000)
  { title: "City Morgue Assistant", salaryUSD: 28000, tier: "modest" },
  { title: "Warehouse Forklift Operator", salaryUSD: 34000, tier: "modest" },
  { title: "Postal Delivery Courier", salaryUSD: 36000, tier: "modest" },
  { title: "Meat Processing Plant Worker", salaryUSD: 30000, tier: "modest" },
  { title: "Local Pharmacy Clerk", salaryUSD: 25000, tier: "modest" },
  { title: "High-Rise Window Cleaner", salaryUSD: 42000, tier: "modest" },
  { title: "Subway Electrical Technician", salaryUSD: 48000, tier: "comfortable" },
  
  // Comfortable / Middle Class ($50,000 - $85,000)
  { title: "Municipal Water Inspector", salaryUSD: 56000, tier: "comfortable" },
  { title: "Night Shift ER Nurse", salaryUSD: 72000, tier: "comfortable" },
  { title: "Middle School Biology Teacher", salaryUSD: 54000, tier: "comfortable" },
  { title: "Commercial HVAC Repairman", salaryUSD: 62000, tier: "comfortable" },
  { title: "Antique Book Restorer", salaryUSD: 50000, tier: "comfortable" },
  { title: "Emergency Dispatch Operator", salaryUSD: 49000, tier: "comfortable" },
  { title: "Railroad Signal Operator", salaryUSD: 58000, tier: "comfortable" },
  { title: "Dental Hygienist", salaryUSD: 74000, tier: "comfortable" },
  { title: "Surveillance Camera Monitor", salaryUSD: 38000, tier: "modest" },

  // Affluent / Upper Professional ($110,000 - $210,000)
  { title: "Cardiothoracic Surgeon", salaryUSD: 210000, tier: "affluent" },
  { title: "Corporate Patent Attorney", salaryUSD: 165000, tier: "affluent" },
  { title: "University Department Chair", salaryUSD: 125000, tier: "affluent" },
  { title: "Chief Architectural Engineer", salaryUSD: 140000, tier: "affluent" }
];

const PARENT_OCCUPATIONS = PARENT_OCCUPATIONS_DATA.map(p => p.title);

// Household Living Residences Catalog
const HOUSEHOLD_RESIDENCES = {
  modest: [
    { name: "3rd-Floor Walk-up Flat", type: "apartment", desc: "A cramped brick tenement with whistling copper steam radiators and narrow stairwells." },
    { name: "Basement Garden Apartment", type: "apartment", desc: "A cool semi-subterranean flat where you hear street shoes passing on the sidewalk above." },
    { name: "Rented Rowhouse Duplex", type: "house", desc: "A narrow weathered clapboard home with a small patch of crabgrass out back." }
  ],
  comfortable: [
    { name: "Two-Story Suburban Craftsman", type: "house", desc: "A cozy timber home with an attic dormer window overlooking foggy pine yards." },
    { name: "Split-Level Family Bungalow", type: "house", desc: "A sturdy home with a brick fireplace and a sunporch filled with potted ferns." },
    { name: "Downtown Brick Brownstone", type: "townhouse", desc: "A four-story brownstone with high plaster ceilings and creaking parquet floors." }
  ],
  affluent: [
    { name: "Ancestral Victorian Gothic Manor", type: "manor", desc: "A towering stone residence with wrought iron widow's walks, gables, and extensive cellars." },
    { name: "Gilded Penthouse Suite", type: "penthouse", desc: "A sweeping high-rise redoubt above the municipal haze with brass elevators." },
    { name: "Lakeside Gated Estate", type: "estate", desc: "A secluded estate with tall iron gates, weeping willows, and quiet gravel carriage paths." }
  ],
  grandparents: [
    { name: "Grandparents' Heritage Rowhouse", type: "heritage", desc: "A warm multi-generational home smelling of lavender, cedar chests, and antique rugs." },
    { name: "Grandparents' Country Farmhouse", type: "farmhouse", desc: "An old farmhouse on the edge of town bordering ancient timberlands." }
  ]
};

function createEmptyActionsDone() {
  return {
    talked: 0,
    complimented: 0,
    gifted: 0,
    spentTime: 0,
    askedMoney: 0,
    argued: 0,
    insulted: 0,
    investigated: 0,
    tribute: 0,
    cuddled: 0,
    babbled: 0,
    fedMilk: 0,
    peekaboo: 0,
    askedAdvice: 0,
    bickered: 0,
    sharedSecret: 0,
    pranked: 0,
    listenedFolktale: 0,
    askedGrandMoney: 0,
    inheritedKeepsake: 0,
    // Phase 1: Extended Family Actions
    helpedChores: 0,
    beggedPet: 0,
    askedDriving: 0,
    discussedCollege: 0,
    requestedLoan: 0,
    caredElder: 0,
    siblingAlibi: 0,
    siblingBrawl: 0,
    siblingDrinks: 0,
    exploredAttic: 0,
    visitedNursing: 0,
    // Phase 2: Romance & Lover Actions
    datedLover: 0,
    flirtedKissed: 0,
    confessedFeelings: 0,
    movedInTogether: 0,
    proposedMarriage: 0,
    plannedWedding: 0,
    conceivedChild: 0,
    brokenUp: 0
  };
}

function getActionCount(person, key) {
  if (!person.actionsDone) person.actionsDone = createEmptyActionsDone();
  const val = person.actionsDone[key];
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return 0;
}

function generateKinAvatar(role, gender, age, occupationTier, parentA = null, parentB = null) {
  if (parentA && parentB) {
    // Sibling / Child Genetic Inheritance Blend
    const pickGene = (prop) => (Math.random() < 0.5 ? parentA[prop] : parentB[prop]);
    const skin = Math.random() < 0.85 ? pickGene('skin') : 'golden_peach';
    const eyeShape = pickGene('eyeShape');
    const eyeColor = Math.random() < 0.90 ? pickGene('eyeColor') : 'hazel';
    const faceShape = pickGene('faceShape');
    const hairTexture = pickGene('hairTexture');
    const hairColor = Math.random() < 0.85 ? pickGene('hairColor') : (gender === 'Male' ? parentA.hairColor : parentB.hairColor);

    return window.generateRandomAvatar({
      gender,
      age,
      skin,
      eyeShape,
      eyeColor,
      faceShape,
      hairTexture,
      hairColor
    });
  }

  // Adult or Elder Generation
  let clothing = 'casual';
  if (age >= 55) {
    clothing = Math.random() < 0.6 ? 'cardigan' : 'sweater';
  } else if (occupationTier === 'affluent') {
    clothing = Math.random() < 0.7 ? 'suit' : 'prep_blazer';
  } else if (occupationTier === 'comfortable') {
    clothing = Math.random() < 0.5 ? 'sweater' : 'casual';
  }

  return window.generateRandomAvatar({
    gender,
    age,
    clothing
  });
}
window.generateKinAvatar = generateKinAvatar;

function generateFamily(character) {
  const countryCode = character.countryCode || "USA";
  const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  // Extract surname or determine for family
  const parts = character.name.split(' ');
  let surname = "";
  if (parts.length > 1) {
    surname = parts.slice(1).join(' ');
  } else if (countryCode !== 'IDN') {
    surname = window.getRandomElement(country.surnames);
  }

  const dadFirst = window.generateCharacterName 
    ? window.generateCharacterName({ countryCode, gender: 'Male' }).first
    : window.getRandomElement(country.firstNamesMale);
  const momFirst = window.generateCharacterName 
    ? window.generateCharacterName({ countryCode, gender: 'Female' }).first
    : window.getRandomElement(country.firstNamesFemale);

  const dadAge = Math.floor(Math.random() * 12) + 26; // 26-37
  const momAge = Math.floor(Math.random() * 10) + 24; // 24-33

  const dadJobObj = window.getRandomElement(PARENT_OCCUPATIONS_DATA);
  const momJobObj = window.getRandomElement(PARENT_OCCUPATIONS_DATA);

  const dadSalary = Math.round(dadJobObj.salaryUSD * mult);
  const momSalary = Math.round(momJobObj.salaryUSD * mult);

  const dadAvatar = generateKinAvatar('Father', 'Male', dadAge, dadJobObj.tier);
  const momAvatar = generateKinAvatar('Mother', 'Female', momAge, momJobObj.tier);

  const dadFullName = surname ? `${dadFirst} ${surname}` : dadFirst;
  const momFullName = surname ? `${momFirst} ${surname}` : momFirst;

  const parents = [
    {
      id: 'father_' + Date.now() + '_1',
      category: 'family',
      role: 'Father',
      name: dadFullName,
      gender: 'Male',
      age: dadAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      occupation: dadJobObj.title,
      salary: dadSalary,
      salaryUSD: dadJobObj.salaryUSD,
      incomeTier: dadJobObj.tier,
      relationship: Math.floor(Math.random() * 25) + 70, // 70-95%
      generosity: Math.floor(Math.random() * 50) + 40,   // 40-90%
      strictness: Math.floor(Math.random() * 50) + 30,
      sanity: Math.floor(Math.random() * 30) + 65,
      entityType: 'human',
      suspicion: 0,
      isRevealed: true,
      avatar: dadAvatar,
      actionsDone: createEmptyActionsDone()
    },
    {
      id: 'mother_' + Date.now() + '_2',
      category: 'family',
      role: 'Mother',
      name: momFullName,
      gender: 'Female',
      age: momAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      occupation: momJobObj.title,
      salary: momSalary,
      salaryUSD: momJobObj.salaryUSD,
      incomeTier: momJobObj.tier,
      relationship: Math.floor(Math.random() * 25) + 75, // 75-100%
      generosity: Math.floor(Math.random() * 40) + 50,   // 50-90%
      strictness: Math.floor(Math.random() * 50) + 25,
      sanity: Math.floor(Math.random() * 30) + 70,
      entityType: 'human',
      suspicion: 0,
      isRevealed: true,
      avatar: momAvatar,
      actionsDone: createEmptyActionsDone()
    }
  ];

  // Sibling generation (0 to 2 siblings) with Genetic Inheritance
  const siblings = [];
  const siblingCount = Math.floor(Math.random() * 3); // 0, 1, or 2
  for (let i = 0; i < siblingCount; i++) {
    const isMale = Math.random() > 0.5;
    const sibGender = isMale ? 'Male' : 'Female';
    const sFirst = window.generateCharacterName 
      ? window.generateCharacterName({ countryCode, gender: sibGender }).first
      : (isMale ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale));
    const ageDiff = Math.floor(Math.random() * 6) + 1; // 1 to 6 years older
    const role = isMale ? (ageDiff > 0 ? 'Older Brother' : 'Younger Brother') : (ageDiff > 0 ? 'Older Sister' : 'Younger Sister');
    const sFullName = surname ? `${sFirst} ${surname}` : sFirst;

    siblings.push({
      id: 'sibling_' + Date.now() + '_' + i,
      category: 'family',
      role,
      name: sFullName,
      gender: sibGender,
      age: ageDiff,
      alive: true,
      deathYear: null,
      deathCause: null,
      relationship: Math.floor(Math.random() * 40) + 55, // 55-95%
      entityType: Math.random() < 0.04 ? 'anomaly' : 'human',
      suspicion: 0,
      isRevealed: false,
      avatar: generateKinAvatar(role, sibGender, ageDiff, 'comfortable', dadAvatar, momAvatar),
      actionsDone: createEmptyActionsDone()
    });
  }

  // Grandparents generation (1 living grandparent with 75% probability)
  const grandparents = [];
  const hasGrandparent = Math.random() < 0.75;
  if (hasGrandparent) {
    const isMaternal = Math.random() > 0.5;
    const isGrandpa = Math.random() > 0.5;
    const gGender = isGrandpa ? 'Male' : 'Female';
    const gFirst = window.generateCharacterName 
      ? window.generateCharacterName({ countryCode, gender: gGender }).first
      : (isGrandpa ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale));
    
    let gSurname = surname;
    if (isMaternal) {
      gSurname = countryCode === 'IDN' ? '' : window.getRandomElement(country.surnames);
    }
    const gFullName = gSurname ? `${gFirst} ${gSurname}` : gFirst;

    const gAge = Math.floor(Math.random() * 12) + 63; // 63-75
    const gRole = isGrandpa ? (isMaternal ? 'Maternal Grandfather' : 'Paternal Grandfather') : (isMaternal ? 'Maternal Grandmother' : 'Paternal Grandmother');

    grandparents.push({
      id: 'grandparent_' + Date.now(),
      category: 'family',
      role: gRole,
      name: gFullName,
      gender: gGender,
      age: gAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      relationship: Math.floor(Math.random() * 20) + 75,
      generosity: Math.floor(Math.random() * 30) + 65,
      pensionUSD: Math.floor(Math.random() * 15000) + 20000,
      salaryUSD: 0,
      incomeTier: 'comfortable',
      strictness: Math.floor(Math.random() * 35) + 15,
      sanity: Math.floor(Math.random() * 30) + 60,
      entityType: Math.random() < 0.05 ? 'anomaly' : 'human',
      suspicion: 0,
      isRevealed: false,
      avatar: generateKinAvatar(gRole, gGender, gAge, 'comfortable'),
      actionsDone: createEmptyActionsDone()
    });
  }

  // Calculate Combined Household Income & Wealth Tier
  const totalCombinedIncomeUSD = (dadJobObj.salaryUSD || 0) + (momJobObj.salaryUSD || 0);
  const totalCombinedIncome = Math.round(totalCombinedIncomeUSD * mult);
  
  let wealthTier = "modest";
  if (totalCombinedIncomeUSD >= 160000) {
    wealthTier = "affluent";
  } else if (totalCombinedIncomeUSD >= 75000) {
    wealthTier = "comfortable";
  }

  // Living Residence Selection
  let residence = null;
  const livesWithGrandparents = hasGrandparent && Math.random() < 0.35;
  if (livesWithGrandparents) {
    residence = window.getRandomElement(HOUSEHOLD_RESIDENCES.grandparents);
    residence.livesWithGrandparents = true;
  } else {
    const list = HOUSEHOLD_RESIDENCES[wealthTier] || HOUSEHOLD_RESIDENCES.comfortable;
    residence = { ...window.getRandomElement(list), livesWithGrandparents: false };
  }

  return {
    parents,
    siblings,
    grandparents,
    friends: [], // Starts empty at age 0
    lovers: [],  // Starts empty at age 0
    children: [], // Starts empty
    householdIncome: totalCombinedIncome,
    householdIncomeUSD: totalCombinedIncomeUSD,
    wealthTier,
    residence
  };
}



function generateNewFriend(character, context = 'Neighborhood') {
  const countryCode = character.countryCode || "USA";
  const isMale = Math.random() > 0.5;
  const friendGender = isMale ? 'Male' : 'Female';

  let friendName = "";
  if (window.generateCharacterName) {
    friendName = window.generateCharacterName({ countryCode, gender: friendGender }).fullName;
  } else {
    const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
    const first = isMale ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale);
    const surname = window.getRandomElement(country.surnames);
    friendName = surname ? `${first} ${surname}` : first;
  }

  // Entity roll: 76% Human, 14% Anomaly, 7% Disguised Mimic, 3% Blatant Entity
  const roll = Math.random();
  let entityType = 'human';
  if (roll < 0.03) {
    entityType = 'blatant_entity';
  } else if (roll < 0.10) {
    entityType = 'disguised_mimic';
  } else if (roll < 0.24) {
    entityType = 'anomaly';
  }

  return {
    id: 'friend_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    category: 'friend',
    role: 'Friend',
    name: friendName,
    gender: isMale ? 'Male' : 'Female',
    age: character.age + (Math.floor(Math.random() * 3) - 1), // age +/- 1
    origin: context,
    alive: true,
    deathYear: null,
    deathCause: null,
    relationship: Math.floor(Math.random() * 30) + 50, // 50-80%
    entityType,
    suspicion: 0,
    isRevealed: entityType === 'human', // Humans are already "revealed" as humans
    loyalty: 'neutral', // 'neutral' | 'loyal' | 'reported'
    actionsDone: createEmptyActionsDone()
  };
}

function generateLoverCandidate(character, context = 'Encounter') {
  const countryCode = character.countryCode || "USA";
  // Preference: opposite gender of character (or random)
  const isMale = character.gender === 'Female' ? true : (character.gender === 'Male' ? false : Math.random() > 0.5);
  const loverGender = isMale ? 'Male' : 'Female';

  let loverName = "";
  if (window.generateCharacterName) {
    loverName = window.generateCharacterName({ countryCode, gender: loverGender }).fullName;
  } else {
    const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
    const first = isMale ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale);
    const surname = window.getRandomElement(country.surnames);
    loverName = surname ? `${first} ${surname}` : first;
  }

  const ageDiff = Math.floor(Math.random() * 5) - 2; // -2 to +2 years
  const age = Math.max(14, character.age + ageDiff);
  const isTeen = age < 18;

  let occupation = "High School Student";
  let salaryUSD = 0;
  let incomeTier = "modest";

  if (!isTeen) {
    const job = window.getRandomElement(PARENT_OCCUPATIONS_DATA);
    occupation = job.title;
    salaryUSD = job.salaryUSD;
    incomeTier = job.tier;
  }

  // Entity probability: 82% human, 11% anomaly, 5% disguised mimic, 2% blatant entity
  const roll = Math.random();
  let entityType = 'human';
  if (roll < 0.02) entityType = 'blatant_entity';
  else if (roll < 0.07) entityType = 'disguised_mimic';
  else if (roll < 0.18) entityType = 'anomaly';

  const role = isMale ? 'Boyfriend' : 'Girlfriend';

  return {
    id: 'lover_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    category: 'lover',
    role,
    name: loverName,
    gender: loverGender,
    age,
    origin: context,
    alive: true,
    deathYear: null,
    deathCause: null,
    occupation,
    salaryUSD,
    incomeTier,
    relationship: Math.floor(Math.random() * 25) + 65, // 65-90%
    fidelity: Math.floor(Math.random() * 40) + 60,
    generosity: Math.floor(Math.random() * 50) + 40,
    sanity: Math.floor(Math.random() * 35) + 60,
    entityType,
    suspicion: 0,
    isRevealed: entityType === 'human',
    cohabitating: false,
    engaged: false,
    married: false,
    anniversaryYear: character.year,
    avatar: generateKinAvatar(role, loverGender, age, incomeTier),
    actionsDone: createEmptyActionsDone()
  };
}
// --- Kin Interaction Functions ---

function spendTimeToKin(person, character) {
  const count = getActionCount(person, 'spentTime');
  if (count >= 6) {
    return { success: false, reason: "You have spent plenty of time together this year." };
  }

  person.actionsDone.spentTime = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 6) + 10) : (count <= 2 ? (Math.floor(Math.random() * 4) + 5) : 3);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = "";
  const effects = { happiness: +5, relationship: +relGain };

  if (person.role === 'Father' || person.role === 'Mother') {
    const activities = [
      `went to a roadside diner for pancakes with ${person.name}.`,
      `helped ${person.name} fix the weather-stripping on the drafty front door.`,
      `sat together listening to rain drum against the living room window while ${person.name} read the paper.`,
      `drove to the municipal supermarket and picked out sweet pastries together.`
    ];
    message = `You ${window.getRandomElement(activities)} (+${relGain}% Closeness, +5% Happiness).`;
  } else if (person.role.includes('Brother') || person.role.includes('Sister')) {
    const activities = [
      `played a marathon session of split-screen arcade games with your ${person.role.toLowerCase()} ${person.name}.`,
      `built a fort out of heavy wool blankets in the hallway with ${person.name}.`,
      `shared secret snacks after midnight while whispering about school rumors with ${person.name}.`
    ];
    message = `You ${window.getRandomElement(activities)} (+${relGain}% Closeness, +5% Happiness).`;
  } else if (person.role.includes('Grand')) {
    message = `You spent the afternoon having warm tea and ginger biscuits with ${person.name}. They showed you faded black-and-white family portraits (+${relGain}% Closeness).`;
  } else {
    // Friend
    if (person.entityType === 'disguised_mimic' && person.loyalty === 'loyal') {
      message = `You sat behind the abandoned bleachers with ${person.name}. You kept watch while they ate cold marrow bones in peace (+${relGain}% Closeness, +5% Occult).`;
      effects.occult = +5;
    } else if (person.entityType === 'anomaly') {
      message = `You and ${person.name} explored the damp drainage canal. Their breath didn't fog up once in the chilly wind (+${relGain}% Closeness, +3% Smarts).`;
      effects.smarts = +3;
    } else {
      message = `You and ${person.name} shared a basket of hot french fries under the flickering neon sign of the corner bowling alley (+${relGain}% Closeness, +5% Happiness).`;
    }
  }

  return { success: true, message, effects };
}

function talkToKin(person, character) {
  const count = getActionCount(person, 'talked');
  if (count >= 10) {
    return { success: false, reason: "You have talked so much with them this year. Give them some space." };
  }

  person.actionsDone.talked = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 4) + 5) : 
                  (count === 1 ? (Math.floor(Math.random() * 3) + 3) : 
                  (count < 5 ? 2 : 1));
  person.relationship = Math.min(100, person.relationship + relGain);

  let quote = "";
  const effects = { relationship: +relGain };

  if (count >= 2) {
    // 3rd+ talk of the year is lighter conversation
    const lightChats = [
      `You and ${person.name} chatted idly about the changing autumn weather and distant sirens.`,
      `You exchanged casual neighborhood rumors about the strange tenant on the third floor.`,
      `You shared a brief, comfortable silence watching rain pool on the asphalt outside.`,
      `You discussed recent radio broadcasts and municipal road construction near the harbor.`,
      `You talked about funny childhood memories and old family recipes.`
    ];
    return {
      success: true,
      message: `${window.getRandomElement(lightChats)} (+${relGain}% Closeness).`,
      quote: "",
      effects
    };
  }

  if (person.entityType === 'anomaly') {
    quote = window.getRandomElement(ANOMALY_QUOTES);
    effects.occult = +3;
    effects.sanity = -2;
  } else if (person.entityType === 'disguised_mimic') {
    quote = window.getRandomElement(MIMIC_QUOTES);
    effects.occult = +4;
    effects.sanity = -3;
  } else if (person.entityType === 'blatant_entity') {
    quote = window.getRandomElement(ENTITY_QUOTES);
    effects.occult = +6;
    effects.sanity = -2;
  } else if (person.role === 'Father' || person.role === 'Mother') {
    const parentQuotes = [
      `"${person.name} told you: 'Make sure your bedroom lock is fastened tonight. The neighborhood watch reported another stray dog pack near the culvert.'"`,
      `"${person.name} said: 'Study hard and save your money. When you grow up, this city doesn't give second chances.'"`,
      `"${person.name} looked tired and said: 'Did you hear that low frequency humming in the pipes again? The city water department claims everything is normal.'"`,
      `"${person.name} smiled gently and said: 'I'm proud of how resilient you are, even when the house feels cold.'"`
    ];
    quote = window.getRandomElement(parentQuotes);
    effects.sanity = +3;
  } else if (person.role.includes('Grand')) {
    quote = `"${person.name} told you: 'Our lineage survived the black floods of '74. Don't trust anyone who knocks on your window twice without a lantern.'"`;
    effects.occult = +4;
  } else {
    quote = window.getRandomElement(NORMAL_FRIEND_QUOTES);
    effects.happiness = +4;
  }

  const message = `You had an earnest conversation with ${person.name} (+${relGain}% Closeness).\n${quote}`;
  return { success: true, message, quote, effects };
}

function complimentKin(person, character) {
  const count = getActionCount(person, 'complimented');
  if (count >= 6) {
    return { success: false, reason: "You have already complimented them plenty this year." };
  }

  person.actionsDone.complimented = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 5) + 8) : 
                  (count <= 2 ? (Math.floor(Math.random() * 3) + 4) : 2);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = "";
  const effects = { relationship: +relGain, happiness: +3 };

  if (person.isRevealed && person.entityType !== 'human') {
    const entityCompliments = [
      `You whispered that their true abyssal presence commands quiet awe. They let out a purr of electrostatic resonance (+${relGain}% Closeness, +3% Occult).`,
      `You admired how seamlessly their disguised joints moved. A flicker of cold satisfaction crossed their eyes (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(entityCompliments);
    effects.occult = +3;
  } else if (person.role === 'Father' || person.role === 'Mother') {
    const parentCompliments = [
      `You told ${person.name} you admire their unwavering resilience and how hard they work for the family. They looked touched and embraced you warmly (+${relGain}% Closeness, +3% Happiness).`,
      `You remarked that ${person.name} makes the drafty house feel like a real sanctuary. A gentle smile broke across their tired face (+${relGain}% Closeness).`,
      `You praised their practical wisdom. ${person.name} chuckled softly and thanked you (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(parentCompliments);
  } else if (person.role.includes('Brother') || person.role.includes('Sister')) {
    const siblingCompliments = [
      `You praised your ${person.role.toLowerCase()}'s quick wit and style. They puffed their chest with pride and smiled (+${relGain}% Closeness).`,
      `You told ${person.name} that nobody makes you laugh like they do. They grinned from ear to ear (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(siblingCompliments);
  } else if (person.role.includes('Grand')) {
    const grandCompliments = [
      `You told ${person.name} that their ancient stories and heritage mean the world to you. Their eyes misted with fond memories (+${relGain}% Closeness, +3% Happiness).`,
      `You complimented their timeless elegance. They laughed warmly and offered you an extra sweet (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(grandCompliments);
  } else {
    // Friend
    const friendCompliments = [
      `You told ${person.name} they are the most dependable friend in this entire city. They gave you a broad grin and bumped fists (+${relGain}% Closeness, +3% Happiness).`,
      `You complimented their fearless attitude. They laughed and promised they've always got your back (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(friendCompliments);
  }

  return { success: true, message, effects };
}

function giveGiftToKin(person, character, selectedGift = null) {
  const count = getActionCount(person, 'gifted');
  if (count >= 6) {
    return { success: false, reason: "You have already given them plenty of gifts this year." };
  }

  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  
  // If specific gift provided from 100-gift catalogue
  if (selectedGift) {
    // Check shilling or cash affordability
    const cost = selectedGift.localPrice || 0;
    const shillings = selectedGift.shillingsCost || 0;

    if (shillings > 0 && character.shillings < shillings) {
      return { success: false, reason: `You need ${shillings} Paranormal Shillings for this relic.` };
    }
    if (cost > 0 && character.money < cost) {
      return { success: false, reason: `You need ${window.formatMoney(cost, character.countryCode)} to buy this gift.` };
    }

    person.actionsDone.gifted = count + 1;
    const reaction = window.calculateGiftReaction(selectedGift, person, character);
    if (reaction && typeof reaction.relGain === 'number') {
      person.relationship = Math.min(100, Math.max(0, person.relationship + reaction.relGain));
    }
    
    // Add cost deductions to reaction effects
    reaction.effects = reaction.effects || {};
    if (cost > 0) reaction.effects.money = -cost;
    if (shillings > 0) reaction.effects.shillings = -shillings;

    return reaction;
  }

  // Fallback random gift
  person.actionsDone.gifted = count + 1;
  const gifts = window.getRandomGiftSelection ? window.getRandomGiftSelection(character, 1) : [];
  const gift = gifts[0] || { name: "Handmade Origami Crane", tier: "free", localPrice: 0 };
  const reaction = window.calculateGiftReaction ? window.calculateGiftReaction(gift, person, character) : {
    success: true,
    message: `You gave ${person.name} a gift.`,
    effects: { relationship: 15, happiness: 4 }
  };
  if (reaction && reaction.effects && typeof reaction.effects.relationship === 'number') {
    person.relationship = Math.min(100, Math.max(0, person.relationship + reaction.effects.relationship));
  }
  return reaction;
}

function askForMoney(person, character, requestedAmount = null) {
  if (!person.role.includes('Father') && !person.role.includes('Mother') && !person.role.includes('Grand')) {
    return { success: false, reason: "You can only ask parents or grandparents for pocket money." };
  }

  const count = getActionCount(person, 'askedMoney');
  if (count >= 5) {
    return { success: false, reason: "You have already asked them for pocket money enough times this year." };
  }

  person.actionsDone.askedMoney = count + 1;
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  // Determine requested amount
  let amount = requestedAmount;
  if (!amount || amount <= 0) {
    const baseUSD = Math.floor(Math.random() * 30) + 15; // $15 - $45
    amount = Math.round(baseUSD * mult);
  }

  const baseUSD = amount / mult;
  let penalty = 0;
  if (baseUSD > 300) penalty = 55;
  else if (baseUSD > 150) penalty = 35;
  else if (baseUSD > 75) penalty = 20;
  else if (baseUSD > 35) penalty = 10;

  // Each previous ask this year increases strictness
  const askPenalty = count * 14;

  // Grandparents are naturally much more generous
  const grandBonus = person.role.includes('Grand') ? 25 : 0;

  // Factor in Parent's Income / Socioeconomic Wealth
  let wealthBonus = 0;
  const kinWealth = (character.kin && character.kin.wealthTier) || 'comfortable';
  if (kinWealth === 'affluent' || (person.salaryUSD && person.salaryUSD >= 120000)) {
    wealthBonus = 25;
  } else if (kinWealth === 'modest' || (person.salaryUSD && person.salaryUSD <= 35000)) {
    wealthBonus = -20;
  }

  const score = (person.relationship * 0.45) + (person.generosity * 0.45) + grandBonus + wealthBonus - penalty - askPenalty;
  const success = score >= 35;

  if (success) {
    let relChange = -1;
    if (baseUSD > 150) relChange = -3;
    person.relationship = Math.max(0, person.relationship + relChange);

    let responses = [];
    if (wealthBonus >= 20) {
      responses = [
        `${person.name} pulled out a crisp leather billfold and gave you ${window.formatMoney(amount, character.countryCode)}. "Here, dear. Buy yourself something proper."`,
        `${person.name} nodded smoothly, writing out an immediate allowance of ${window.formatMoney(amount, character.countryCode)}. "Never let anyone see you without walking-around money."`
      ];
    } else if (person.role.includes('Grand')) {
      responses = [
        `${person.name} looked around conspiratorially, winking as they slipped ${window.formatMoney(amount, character.countryCode)} into your pocket: "Don't tell your parents I gave you this, sweet child."`,
        `${person.name} chuckled warmly, patting your hand and passing you ${window.formatMoney(amount, character.countryCode)}: "A grandchild of mine should never have empty pockets."`
      ];
    } else {
      responses = [
        `${person.name} counted out ${window.formatMoney(amount, character.countryCode)} from their weekly wage: "Here. Spend it carefully, money doesn't come easily."`,
        `${person.name} smiled gently, handing you ${window.formatMoney(amount, character.countryCode)}: "Make sure you save a little of it."`,
        `Seeing how polite you were, ${person.name} handed you ${window.formatMoney(amount, character.countryCode)} with a nod.`
      ];
    }

    const message = window.getRandomElement(responses);
    return {
      success: true,
      granted: true,
      amount,
      message,
      effects: { money: amount, happiness: +4, relationship: relChange }
    };
  } else {
    const relLoss = baseUSD > 150 ? 6 : 3;
    person.relationship = Math.max(0, person.relationship - relLoss);

    let refusals = [];
    if (kinWealth === 'modest' || (person.salaryUSD && person.salaryUSD <= 35000)) {
      refusals = [
        `"${person.name} showed you the envelope of unpaid rent: 'On my ${person.occupation} wage, we barely cover the heating oil this month. I don't have ${window.formatMoney(amount, character.countryCode)} to spare.'"`
      ];
    } else {
      refusals = [
        `"${person.name} frowned at the request for ${window.formatMoney(amount, character.countryCode)}: 'Money doesn't grow on copper pipes. Absolutely not.'"`,
        `"${person.name} shook their head: 'You need to learn financial restraint. I cannot give you that much.'"`,
        `"${person.name} crossed their arms: '${window.formatMoney(amount, character.countryCode)}?! Do you think I'm made of cash? Go find chores to do.'"`
      ];
    }

    const message = window.getRandomElement(refusals);
    return {
      success: true,
      granted: false,
      amount: 0,
      message,
      effects: { happiness: -2, relationship: -relLoss }
    };
  }
}

// --- Differentiated Relationship Actions ---

function applyKinStatEffect(character, stat, amount) {
  if (!character) return;
  if (character.stats) {
    character.stats[stat] = Math.max(0, Math.min(100, (character.stats[stat] || 50) + amount));
  }
  if (typeof character[stat] === 'number') {
    character[stat] = Math.max(0, Math.min(100, character[stat] + amount));
  }
}

// 1. PARENTS: Ask for Life Advice & Moral Guidance
function askAdviceFromParent(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only ask life advice from a parent." };
  }
  const count = getActionCount(person, 'askedAdvice');
  if (count >= 5) {
    return { success: false, reason: "Your parent has given you all the advice they can for this year!" };
  }
  person.actionsDone.askedAdvice = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 6;
  person.relationship = Math.min(100, person.relationship + relGain);

  const adviceList = [
    `"${person.name} took a sip of black coffee and advised: 'In this city, never sign a document you haven't read thrice by daylight. And stay clear of the old aqueducts after sundown.' (+Smarts, +Sanity)"`,
    `"${person.name} placed a comforting hand on your shoulder: 'People will test your boundaries. Keep your ledger balanced and your door bolted.' (+Smarts, +Closeness)"`,
    `"${person.name} looked into the dim street outside: 'Trust is hard-won and easily shattered. Stand tall, no matter what shadows whisper.' (+Sanity, +Closeness)"`
  ];

  applyKinStatEffect(character, 'smarts', 3);
  applyKinStatEffect(character, 'sanity', 3);

  return {
    success: true,
    title: `Parental Advice from ${person.name}`,
    message: window.getRandomElement(adviceList),
    effects: { relationship: relGain, smarts: 3, sanity: 3 }
  };
}

// 2. SIBLINGS: Play & Bicker / Friendly Rivalry
function bickerWithSibling(person, character) {
  if (!person.role.includes('Brother') && !person.role.includes('Sister')) {
    return { success: false, reason: "You can only roughhouse or bicker with your siblings." };
  }
  const count = getActionCount(person, 'bickered');
  if (count >= 5) {
    return { success: false, reason: "You've exhausted yourselves bickering for this year!" };
  }
  person.actionsDone.bickered = count + 1;

  const roll = Math.random();
  if (roll < 0.65) {
    // Playful tussle
    const relGain = Math.floor(Math.random() * 4) + 4;
    person.relationship = Math.min(100, person.relationship + relGain);
    applyKinStatEffect(character, 'vitality', 2);
    applyKinStatEffect(character, 'happiness', 4);
    return {
      success: true,
      title: `Wrestled with ${person.name}`,
      message: `You and your ${person.role.toLowerCase()} ${person.name} got into an energetic pillow fight in the hallway, laughing breathlessly (+${relGain}% Closeness, +Vitality, +Happiness).`,
      effects: { relationship: relGain, vitality: 2, happiness: 4 }
    };
  } else {
    // Minor argument
    const relLoss = Math.floor(Math.random() * 4) + 4;
    person.relationship = Math.max(0, person.relationship - relLoss);
    return {
      success: true,
      title: `Sibling Spat`,
      message: `You and ${person.name} fought over who got the bigger slice of pie, sulking in separate corners for an hour (-${relLoss}% Closeness).`,
      effects: { relationship: -relLoss, happiness: -2 }
    };
  }
}

// 2b. SIBLINGS: Share a Dark Secret
function shareSecretWithSibling(person, character) {
  if (!person.role.includes('Brother') && !person.role.includes('Sister')) {
    return { success: false, reason: "You can only share clandestine childhood secrets with siblings." };
  }
  const count = getActionCount(person, 'sharedSecret');
  if (count >= 4) {
    return { success: false, reason: "You've whispered all your darkest secrets to each other for now." };
  }
  person.actionsDone.sharedSecret = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = "";
  const effects = { relationship: relGain, happiness: 4 };

  if (person.entityType !== 'human') {
    applyKinStatEffect(character, 'occult', 5);
    effects.occult = 5;
    message = `Under the blankets with a flashlight, your ${person.role.toLowerCase()} ${person.name} whispered: 'Promise not to tell mom, but I can hear what the crows say when they roost on the chimney.' (+${relGain}% Closeness, +Occult).`;
  } else {
    message = `Under the covers with a flashlight, you and ${person.name} confessed your deepest childhood fears and swore a solemn pact of loyalty (+${relGain}% Closeness, +Happiness).`;
  }

  return {
    success: true,
    title: `Shared Secret with ${person.name}`,
    message,
    effects
  };
}

// 3. GRANDPARENTS: Listen to Grim Folktales & Family Lore
function listenGrandparentFolktale(person, character) {
  if (!person.role.includes('Grand')) {
    return { success: false, reason: "Only grandparents possess centuries of ancestral lore and grim folktales." };
  }
  const count = getActionCount(person, 'listenedFolktale');
  if (count >= 5) {
    return { success: false, reason: `${person.name} has grown drowsy by the fire and needs to rest.` };
  }
  person.actionsDone.listenedFolktale = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'occult', 5);
  applyKinStatEffect(character, 'sanity', 2);

  const tales = [
    `"${person.name} stoked the hearth and recounted the Great Fog of 1952: 'The street lamps went green, and those who answered the midnight knocks were never heard from again.' (+Occult, +Closeness)"`,
    `"${person.name} drew an ancient protective sigil in flour on the tabletop: 'Our ancestors carried this mark across the sea. It keeps the hollow entities from crossing the door frame.' (+Occult, +Sanity)"`,
    `"${person.name} unlatched an antique cedar music box: 'Listen closely to the third chime. That melody was taught to our great-grandmother by a woman who walked out of the lake.' (+Occult, +Closeness)"`
  ];

  return {
    success: true,
    title: `Ancient Lore from ${person.name}`,
    message: window.getRandomElement(tales),
    effects: { relationship: relGain, occult: 5, sanity: 2 }
  };
}

// ============================================================================
// PHASE 1: EXTENDED FAMILY ACTIONS (AGE-GATED & MEANINGFUL)
// ============================================================================

// PARENTS: Help With Household Chores (Age 6+)
function helpWithChores(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only help parents with household chores." };
  }
  const count = getActionCount(person, 'helpedChores');
  if (count >= 5) {
    return { success: false, reason: "You have helped with all the chores for this year!" };
  }
  person.actionsDone.helpedChores = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 6;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'humanity', 3);
  applyKinStatEffect(character, 'vitality', 2);

  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;
  let tip = 0;
  if (Math.random() < 0.65) {
    const baseTip = person.incomeTier === 'affluent' ? (Math.floor(Math.random() * 20) + 15) : (Math.floor(Math.random() * 10) + 5);
    tip = Math.round(baseTip * mult);
    character.money = (character.money || 0) + tip;
  }

  const choreList = [
    `You scrubbed the soot from the coal stove and washed the heavy iron skillets for ${person.name}. They gave you a proud smile${tip > 0 ? ` and slipped you ${window.formatMoney(tip, character.countryCode)} for your honest effort` : ''} (+${relGain}% Closeness, +Humanity).`,
    `You gathered the damp laundry and helped ${person.name} beat dust from the winter rugs in the courtyard. They thanked you warmly${tip > 0 ? ` and handed you ${window.formatMoney(tip, character.countryCode)} pocket money` : ''} (+${relGain}% Closeness).`,
    `You swept the creaking front hallway and shoveled frost from the front steps before ${person.name} returned from work${tip > 0 ? `, earning a ${window.formatMoney(tip, character.countryCode)} reward` : ''} (+${relGain}% Closeness).`
  ];

  return {
    success: true,
    title: `Helped ${person.name} with Chores`,
    message: window.getRandomElement(choreList),
    effects: { relationship: relGain, humanity: 3, vitality: 2, money: tip }
  };
}

// PARENTS: Beg For a Pet / Toy (Age 7+)
function begForPetOrToy(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only plead with parents for a companion or plaything." };
  }
  const count = getActionCount(person, 'beggedPet');
  if (count >= 2) {
    return { success: false, reason: "You have already pleaded your case enough this year." };
  }
  person.actionsDone.beggedPet = count + 1;
  const strict = person.strictness || 50;
  const generous = person.generosity || 50;
  const rel = person.relationship || 50;
  const roll = (rel * 0.4) + (generous * 0.4) - (strict * 0.3) + (Math.random() * 30);

  if (roll >= 45) {
    person.relationship = Math.min(100, person.relationship + 5);
    applyKinStatEffect(character, 'happiness', 12);
    if (window.generateStrayPet && (!character.pets || character.pets.length === 0) && Math.random() < 0.45) {
      const pet = window.generateStrayPet(character);
      character.pets = character.pets || [];
      character.pets.push(pet);
      return {
        success: true,
        title: `Plea Granted! A New Pet!`,
        message: `${person.name} sighed, looked into your pleading eyes, and brought home a stray ${pet.species}: ${pet.name}! (+Happiness, +Closeness)`,
        effects: { relationship: 5, happiness: 12 }
      };
    }
    return {
      success: true,
      title: `Plea Granted!`,
      message: `${person.name} gave in to your persistence and bought you a beautiful antique wooden puzzle toy and sweet treats (+12% Happiness, +5% Closeness).`,
      effects: { relationship: 5, happiness: 12 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 4);
    applyKinStatEffect(character, 'happiness', -4);
    return {
      success: true,
      title: `Plea Denied`,
      message: `${person.name} firmly crossed their arms: 'We cannot afford frivolous luxuries or extra mouths to feed in this house. Absolutely not.' (-4% Happiness, -4% Closeness).`,
      effects: { relationship: -4, happiness: -4 }
    };
  }
}

// PARENTS: Ask for Driving Lessons (Age 15+)
function askForDrivingLessons(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "Only parents can provide licensed behind-the-wheel instruction." };
  }
  const count = getActionCount(person, 'askedDriving');
  if (count >= 3) {
    return { success: false, reason: "You've practiced driving enough with them for this year!" };
  }
  person.actionsDone.askedDriving = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 5;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'smarts', 4);
  applyKinStatEffect(character, 'sanity', 2);
  character.drivingLessons = (character.drivingLessons || 0) + 1;

  const scenarios = [
    `You practiced parallel parking between municipal delivery trucks while ${person.name} nervously gripped the dashboard handle (+Smarts, +Closeness).`,
    `${person.name} guided you down fog-shrouded municipal avenues, teaching you how to feather the clutch on steep cobblestone hills (+Smarts, +Sanity).`,
    `You navigated the industrial bypass at night. ${person.name} praised your steady hands and spatial awareness (+Smarts, +Closeness).`
  ];

  return {
    success: true,
    title: `Driving Practice with ${person.name}`,
    message: window.getRandomElement(scenarios),
    effects: { relationship: relGain, smarts: 4, sanity: 2 }
  };
}

// PARENTS: Discuss College & Future Plans (Age 16+)
function discussCollegePlans(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only plan your higher education with parents." };
  }
  const count = getActionCount(person, 'discussedCollege');
  if (count >= 3) {
    return { success: false, reason: "You've discussed your future plans thoroughly for this year." };
  }
  person.actionsDone.discussedCollege = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 6;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'smarts', 4);
  applyKinStatEffect(character, 'sanity', 3);

  const canPromiseTuition = (person.incomeTier === 'comfortable' || person.incomeTier === 'affluent') && person.relationship >= 65;
  if (canPromiseTuition && !character.parentTuitionPromise) {
    character.parentTuitionPromise = true;
    return {
      success: true,
      title: `Tuition Pledge Secured!`,
      message: `"${person.name} reviewed your ambitions and nodded solemnly: 'You have worked hard. When you graduate, we will fund your university tuition.' (Parent Tuition Promise Active!) (+Smarts, +Closeness)"`,
      effects: { relationship: relGain, smarts: 4, sanity: 3 }
    };
  }

  const adviceQuotes = [
    `"${person.name} studied the university catalogues with you: 'Choose a vocation that withstands hard times. Society always needs medicine, law, and people who can read old blueprints.' (+Smarts, +Sanity)"`,
    `"${person.name} poured two mugs of tea: 'Whatever path you choose, make sure you can look at yourself in the mirror every morning.' (+Smarts, +Closeness)"`
  ];

  return {
    success: true,
    title: `Future Planning with ${person.name}`,
    message: window.getRandomElement(adviceQuotes),
    effects: { relationship: relGain, smarts: 4, sanity: 3 }
  };
}

// PARENTS & SIBLINGS: Request Family Loan (Age 18+)
function requestFamilyLoan(person, character, requestedAmount = 1000) {
  const isFamily = person.category === 'family' && (person.role.includes('Father') || person.role.includes('Mother') || person.role.includes('Brother') || person.role.includes('Sister'));
  if (!isFamily) {
    return { success: false, reason: "You can only request substantial financial loans from close family." };
  }
  const count = getActionCount(person, 'requestedLoan');
  if (count >= 2) {
    return { success: false, reason: "You have already requested a loan from them this year." };
  }
  person.actionsDone.requestedLoan = count + 1;

  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;
  const amount = Math.round(requestedAmount);

  const generous = person.generosity || 50;
  const rel = person.relationship || 50;
  const wealth = person.incomeTier === 'affluent' ? 30 : (person.incomeTier === 'comfortable' ? 10 : -25);
  const score = (rel * 0.4) + (generous * 0.3) + wealth - (amount / (500 * mult));

  if (score >= 25) {
    character.money = (character.money || 0) + amount;
    person.familyDebt = (person.familyDebt || 0) + amount;
    person.relationship = Math.max(0, person.relationship - 2);
    return {
      success: true,
      granted: true,
      title: `Family Loan Approved`,
      message: `${person.name} counted out ${window.formatMoney(amount, character.countryCode)}: "Take this to get yourself on your feet. Repay me when your harvest comes in." (Debt Recorded: ${window.formatMoney(person.familyDebt, character.countryCode)})`,
      effects: { money: amount, relationship: -2 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 6);
    return {
      success: true,
      granted: false,
      title: `Loan Request Denied`,
      message: `${person.name} shook their head: "I cannot risk ${window.formatMoney(amount, character.countryCode)}. Money lent to kin often burns the bridge between them." (-6% Closeness).`,
      effects: { relationship: -6 }
    };
  }
}

// PARENTS: Care For Aging Parent (Age 30+)
function careForAgingParent(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only provide elder care for aging parents." };
  }
  const count = getActionCount(person, 'caredElder');
  if (count >= 4) {
    return { success: false, reason: "You have already attended to their medical and living needs this year." };
  }
  person.actionsDone.caredElder = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'humanity', 5);
  applyKinStatEffect(character, 'sanity', 3);
  person.caredThisYear = true;

  const scenarios = [
    `You accompanied ${person.name} to the municipal clinic, reviewing their prescription tinctures and holding their frail hand (+${relGain}% Closeness, +Humanity).`,
    `You repaired the insulation around their bedroom sash windows and cooked three batches of nourishing broth for ${person.name} (+${relGain}% Closeness, +Sanity).`,
    `You spent the Sunday afternoon organizing their household ledgers and reading old correspondence aloud (+${relGain}% Closeness).`
  ];

  return {
    success: true,
    title: `Cared for Aging ${person.role}`,
    message: window.getRandomElement(scenarios),
    effects: { relationship: relGain, humanity: 5, sanity: 3 }
  };
}

// SIBLINGS: Cover Sibling Alibi (Age 8+)
function coverSiblingAlibi(person, character) {
  if (!person.role.includes('Brother') && !person.role.includes('Sister')) {
    return { success: false, reason: "You can only forge alibis and cover secrets with siblings." };
  }
  const count = getActionCount(person, 'siblingAlibi');
  if (count >= 3) {
    return { success: false, reason: "You've covered for them enough times this year!" };
  }
  person.actionsDone.siblingAlibi = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 12;
  person.relationship = Math.min(100, person.relationship + relGain);
  person.siblingLoyalty = 'unshakeable';
  applyKinStatEffect(character, 'humanity', 3);

  return {
    success: true,
    title: `Covered for ${person.name}`,
    message: `When parents investigated the broken latch and missing rations, you took the heat and fabricated an airtight alibi. Your ${person.role.toLowerCase()} squeezed your arm with tearful gratitude (+${relGain}% Closeness, Loyalty: Unshakeable).`,
    effects: { relationship: relGain, humanity: 3 }
  };
}

// SIBLINGS: Intense Sibling Brawl (Age 12+)
function siblingBrawl(person, character) {
  if (!person.role.includes('Brother') && !person.role.includes('Sister')) {
    return { success: false, reason: "You can only engage in sibling rivalry brawls." };
  }
  const count = getActionCount(person, 'siblingBrawl');
  if (count >= 3) {
    return { success: false, reason: "You've bruised each other enough for this year." };
  }
  person.actionsDone.siblingBrawl = count + 1;
  const relLoss = Math.floor(Math.random() * 8) + 10;
  person.relationship = Math.max(0, person.relationship - relLoss);
  applyKinStatEffect(character, 'happiness', -5);
  applyKinStatEffect(character, 'vitality', -3);

  return {
    success: true,
    title: `Heated Sibling Brawl`,
    message: `A vicious dispute over jealousy and past slights boiled over into a physical fight in the courtyard. You traded heavy blows before slamming doors in bitter fury (-${relLoss}% Closeness, -Vitality, -Happiness).`,
    effects: { relationship: -relLoss, happiness: -5, vitality: -3 }
  };
}

// SIBLINGS & FRIENDS: Adult Drinks & Dinner (Age 18+)
function siblingDrinks(person, character) {
  const count = getActionCount(person, 'siblingDrinks');
  if (count >= 5) {
    return { success: false, reason: "You've shared enough drinks together this year." };
  }
  person.actionsDone.siblingDrinks = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 7;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'happiness', 6);
  applyKinStatEffect(character, 'sanity', 3);

  const venues = [
    `You and ${person.name} sat at a dark mahogany booth in the neighborhood pub, sharing draft ales and laughing over ridiculous family history (+${relGain}% Closeness, +Happiness).`,
    `You split hot ramen and cold cider under glowing red paper lanterns with ${person.name}, catching up on work, heartaches, and city rumors (+${relGain}% Closeness, +Sanity).`
  ];

  return {
    success: true,
    title: `Drinks & Dinner with ${person.name}`,
    message: window.getRandomElement(venues),
    effects: { relationship: relGain, happiness: 6, sanity: 3 }
  };
}

// GRANDPARENTS: Explore Old Attic Trunks (Age 8+)
function exploreGrandparentAttic(person, character) {
  if (!person.role.includes('Grand')) {
    return { success: false, reason: "Only grandparents maintain dusty attics filled with centuries of relics." };
  }
  const count = getActionCount(person, 'exploredAttic');
  if (count >= 3) {
    return { success: false, reason: "You have rummaged through the attic trunks enough this year." };
  }
  person.actionsDone.exploredAttic = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 6;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'smarts', 3);
  applyKinStatEffect(character, 'occult', 4);

  const findings = [
    `Together with ${person.name}, you pried open a heavy brass steamer trunk and uncovered pre-war topographical maps showing vanished city streets (+Smarts, +Occult).`,
    `Beneath moth-eaten velvet coats, you found a tintype portrait from 1894. ${person.name} pointed out the figure in the background whose eyes were drawn with white ink (+Occult, +Closeness).`,
    `You uncovered a cedar box containing silver fountain pens and an uncashed promissory note from the old municipal foundry (+Smarts, +Closeness).`
  ];

  return {
    success: true,
    title: `Attic Expedition with ${person.name}`,
    message: window.getRandomElement(findings),
    effects: { relationship: relGain, smarts: 3, occult: 4 }
  };
}

// GRANDPARENTS: Inherit Ancestral Keepsake (Age 14+)
function inheritGrandparentKeepsake(person, character) {
  if (!person.role.includes('Grand')) {
    return { success: false, reason: "Only grandparents bestow ancestral keepsakes." };
  }
  if (person.inheritedKeepsake) {
    return { success: false, reason: `${person.name} has already gifted you their sacred family heirloom.` };
  }
  person.inheritedKeepsake = true;
  person.relationship = Math.min(100, person.relationship + 15);
  applyKinStatEffect(character, 'sanity', 6);
  applyKinStatEffect(character, 'occult', 8);

  const keepsakes = [
    { name: "Ancestral Obsidian Pocket Watch (1888)", buff: "Protects against Sanity erosion during night frights." },
    { name: "Tarnished Silver Signet Ring", buff: "Commanding presence when dealing with municipal magistrates." },
    { name: "Hand-Bound Grimoire of Household Wards", buff: "Contains ancient protective salt recipes." }
  ];
  const chosen = window.getRandomElement(keepsakes);
  character.keepsakes = character.keepsakes || [];
  character.keepsakes.push(chosen.name);

  return {
    success: true,
    title: `Heirloom Received: ${chosen.name}`,
    message: `${person.name} unlocked an iron safe beneath the floorboards and placed the ${chosen.name} into your trembling hands: "This kept me alive through the dark winter of '62. Wear it close, and never let a stranger touch it." (${chosen.buff}) (+15% Closeness, +8% Occult, +6% Sanity).`,
    effects: { relationship: 15, sanity: 6, occult: 8 }
  };
}

// GRANDPARENTS: Visit at Nursing Home / Sickbed (Age 16+)
function visitNursingHome(person, character) {
  if (!person.role.includes('Grand')) {
    return { success: false, reason: "You can only attend to grandparents in convalescence." };
  }
  const count = getActionCount(person, 'visitedNursing');
  if (count >= 4) {
    return { success: false, reason: "You have already spent quality time at their bedside this year." };
  }
  person.actionsDone.visitedNursing = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 10;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'humanity', 5);
  applyKinStatEffect(character, 'sanity', 3);

  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  let secretCash = 0;
  if (Math.random() < 0.5) {
    secretCash = Math.round((Math.floor(Math.random() * 50) + 40) * (country.wageMultiplier || 1));
    character.money = (character.money || 0) + secretCash;
  }

  return {
    success: true,
    title: `Bedside Visit with ${person.name}`,
    message: `You brought fresh tea and lavender biscuits to ${person.name}'s bedside. They smiled weakly through the window fog, holding your hand${secretCash > 0 ? ` and secretly pressing ${window.formatMoney(secretCash, character.countryCode)} into your palm` : ''} (+${relGain}% Closeness, +Humanity, +Sanity).`,
    effects: { relationship: relGain, humanity: 5, sanity: 3, money: secretCash }
  };
}

// ============================================================================
// PHASE 2: ROMANCE & LOVER ACTIONS
// ============================================================================

// 1. Romantic Date (Age 14+)
function dateLover(person, character, dateType = 'casual') {
  if (person.category !== 'lover' && person.category !== 'friend') {
    return { success: false, reason: "You can only go on romantic dates with partners or close friends." };
  }
  const count = getActionCount(person, 'datedLover');
  if (count >= 6) {
    return { success: false, reason: "You have already gone on plenty of romantic dates together this year!" };
  }
  person.actionsDone.datedLover = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'happiness', 7);
  applyKinStatEffect(character, 'sanity', 3);

  const dates = [
    `You and ${person.name} shared a booth at a neon-lit diner, sipping cherry milkshakes and laughing until the waitress turned off the sign (+${relGain}% Closeness, +Happiness).`,
    `You took a midnight stroll along the desolate canal pier with ${person.name}, watching distant foghorns sound across the water as they rested their head on your shoulder (+${relGain}% Closeness, +Sanity).`,
    `You caught a late-night double feature at the vintage cinema with ${person.name}, sharing buttery popcorn in the dim velvet balcony (+${relGain}% Closeness, +Happiness).`
  ];

  return {
    success: true,
    title: `Romantic Date with ${person.name}`,
    message: window.getRandomElement(dates),
    effects: { relationship: relGain, happiness: 7, sanity: 3 }
  };
}

// 2. Flirt & Kiss / Passion (Age 14+)
function flirtKissLover(person, character) {
  if (person.category !== 'lover') {
    return { success: false, reason: "You can only share intimate romance with a partner." };
  }
  const count = getActionCount(person, 'flirtedKissed');
  if (count >= 6) {
    return { success: false, reason: "You've shared plenty of intimate moments for this year!" };
  }
  person.actionsDone.flirtedKissed = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'happiness', 8);
  applyKinStatEffect(character, 'sanity', 4);

  const moments = [
    `Under the flickering streetlight, ${person.name} pulled you close and kissed you deeply in the autumn breeze (+${relGain}% Closeness, +Happiness).`,
    `You whispered sweet promises to ${person.name} in the dark, feeling their heartbeat sync with your own (+${relGain}% Closeness, +Sanity).`
  ];

  return {
    success: true,
    title: `Passion with ${person.name}`,
    message: window.getRandomElement(moments),
    effects: { relationship: relGain, happiness: 8, sanity: 4 }
  };
}

// 3. Confess Romantic Feelings to Friend (Age 14+)
function confessToFriend(person, character) {
  if (person.category !== 'friend') {
    return { success: false, reason: "You can only confess romantic feelings to a friend." };
  }
  const count = getActionCount(person, 'confessedFeelings');
  if (count >= 1) {
    return { success: false, reason: "You have already confessed your feelings to them this year." };
  }
  person.actionsDone.confessedFeelings = count + 1;

  const rel = person.relationship || 50;
  if (rel >= 65 && Math.random() < 0.75) {
    person.category = 'lover';
    person.role = person.gender === 'Female' ? 'Girlfriend' : 'Boyfriend';
    person.anniversaryYear = character.year;
    person.relationship = Math.min(100, person.relationship + 18);
    applyKinStatEffect(character, 'happiness', 15);
    character.kin.lovers = character.kin.lovers || [];
    if (!character.kin.lovers.some(l => l.id === person.id)) {
      character.kin.lovers.push(person);
    }
    character.kin.friends = (character.kin.friends || []).filter(f => f.id !== person.id);

    return {
      success: true,
      accepted: true,
      title: `Feelings Reciprocated!`,
      message: `With trembling hands, you confessed your love to ${person.name}. Their face flushed with joy as they threw their arms around your neck: "I've waited so long for you to say that!" (${person.name} is now your ${person.role}!) (+15% Happiness, +18% Closeness).`,
      effects: { relationship: 18, happiness: 15 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 12);
    applyKinStatEffect(character, 'happiness', -10);
    return {
      success: true,
      accepted: false,
      title: `Gentle Rejection`,
      message: `${person.name} looked down awkwardly and sighed: "You mean the world to me as a friend, but I don't see us that way. I'm sorry." The silence between you grew painfully heavy (-10% Happiness, -12% Closeness).`,
      effects: { relationship: -12, happiness: -10 }
    };
  }
}

// 4. Move In Together / Cohabitation (Age 18+)
function askMoveInTogether(person, character) {
  if (person.category !== 'lover') {
    return { success: false, reason: "You can only move in with your romantic partner." };
  }
  if (person.cohabitating) {
    return { success: false, reason: "You already live together!" };
  }
  const count = getActionCount(person, 'movedInTogether');
  if (count >= 1) {
    return { success: false, reason: "You have already asked them to move in this year." };
  }
  person.actionsDone.movedInTogether = count + 1;

  if (person.relationship >= 70) {
    person.cohabitating = true;
    person.relationship = Math.min(100, person.relationship + 12);
    applyKinStatEffect(character, 'happiness', 10);
    applyKinStatEffect(character, 'sanity', 5);
    return {
      success: true,
      agreed: true,
      title: `Moved in Together!`,
      message: `${person.name} excitedly packed their cardboard boxes and moved into your flat! Domestic bills will now be shared equally (+10% Happiness, +12% Closeness).`,
      effects: { relationship: 12, happiness: 10, sanity: 5 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 5);
    return {
      success: true,
      agreed: false,
      title: `Not Ready Yet`,
      message: `${person.name} hesitated: "I love you, but our relationship needs more time before taking such a serious leap." (-5% Closeness).`,
      effects: { relationship: -5 }
    };
  }
}

// 5. Propose Marriage (Age 18+)
function proposeMarriage(person, character, ringTier = 'silver') {
  if (person.category !== 'lover') {
    return { success: false, reason: "You can only propose marriage to your partner." };
  }
  if (person.engaged || person.married) {
    return { success: false, reason: "You are already engaged or married!" };
  }
  const count = getActionCount(person, 'proposedMarriage');
  if (count >= 1) {
    return { success: false, reason: "Give your partner time to reflect before proposing again." };
  }
  person.actionsDone.proposedMarriage = count + 1;

  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  const ringCosts = {
    cheap: Math.round(150 * mult),
    silver: Math.round(600 * mult),
    gold_diamond: Math.round(2800 * mult),
    antique_heirloom: 0
  };
  const cost = ringCosts[ringTier] || 0;
  if (character.money < cost) {
    return { success: false, reason: `You cannot afford this ring (${window.formatMoney(cost, character.countryCode)}).` };
  }
  character.money -= cost;

  const ringBonus = ringTier === 'gold_diamond' ? 25 : (ringTier === 'antique_heirloom' ? 20 : (ringTier === 'silver' ? 10 : 0));
  const roll = (person.relationship * 0.5) + ringBonus + (Math.random() * 25);

  if (roll >= 50) {
    person.engaged = true;
    person.role = person.gender === 'Female' ? 'Fiancée' : 'Fiancé';
    person.relationship = Math.min(100, person.relationship + 20);
    applyKinStatEffect(character, 'happiness', 20);
    applyKinStatEffect(character, 'sanity', 6);
    return {
      success: true,
      accepted: true,
      title: `SHE/HE SAID YES!`,
      message: `Down on one knee in the lamplight, you presented the ring. Tears filled ${person.name}'s eyes as they gasped: "YES! A thousand times, yes!" (${person.name} is now your ${person.role}!) (+20% Happiness, +20% Closeness).`,
      effects: { relationship: 20, happiness: 20, sanity: 6, money: -cost }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 15);
    applyKinStatEffect(character, 'happiness', -12);
    return {
      success: true,
      accepted: false,
      title: `Proposal Rejected`,
      message: `${person.name} stepped backward, looking pained: "I can't wear this. We aren't ready for marriage." The rejection cuts deep (-12% Happiness, -15% Closeness).`,
      effects: { relationship: -15, happiness: -12, money: -cost }
    };
  }
}

// 6. Plan Wedding Ceremony (Engaged Lovers)
function planWeddingCeremony(person, character, venueType = 'courthouse') {
  if (!person.engaged || person.married) {
    return { success: false, reason: "You must be engaged before holding a wedding ceremony." };
  }
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  const costs = {
    courthouse: Math.round(150 * mult),
    chapel: Math.round(2200 * mult),
    grand_estate: Math.round(9500 * mult)
  };
  const cost = costs[venueType] || costs.courthouse;
  if (character.money < cost) {
    return { success: false, reason: `You need ${window.formatMoney(cost, character.countryCode)} for this wedding venue.` };
  }
  character.money -= cost;

  person.married = true;
  person.engaged = false;
  person.role = person.gender === 'Female' ? 'Wife' : 'Husband';
  person.anniversaryYear = character.year;
  person.cohabitating = true;
  person.relationship = 100;
  applyKinStatEffect(character, 'happiness', 25);
  applyKinStatEffect(character, 'sanity', 8);

  const venues = {
    courthouse: `In a quiet municipal registry office with two witnesses, you and ${person.name} signed the marriage register and exchanged simple golden bands.`,
    chapel: `Beneath stained-glass archways smelling of incense and wax, you and ${person.name} took sacred vows before family and friends.`,
    grand_estate: `At a breathtaking private manor overlooking the lake, you celebrated an opulent wedding gala with orchestra and champagne.`
  };

  return {
    success: true,
    title: `Just Married!`,
    message: `${venues[venueType] || venues.courthouse} You are officially married to your ${person.role}, ${person.name}! (+25% Happiness, 100% Closeness).`,
    effects: { relationship: 25, happiness: 25, sanity: 8, money: -cost }
  };
}

// 7. Conceive a Child (Age 18+ Lovers / Spouses)
function conceiveChildWithLover(person, character) {
  if (person.category !== 'lover') {
    return { success: false, reason: "You can only conceive children with a romantic partner." };
  }
  const count = getActionCount(person, 'conceivedChild');
  if (count >= 2) {
    return { success: false, reason: "You have already tried to expand your family this year!" };
  }
  person.actionsDone.conceivedChild = count + 1;

  if (Math.random() < 0.65) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? 'Male' : 'Female';
    const countryCode = character.countryCode || 'USA';
    const babyName = window.generateCharacterName ? window.generateCharacterName({ countryCode, gender }).first : (isMale ? 'Alexander' : 'Eleanor');
    const surname = character.name.split(' ')[1] || '';
    const fullName = surname ? `${babyName} ${surname}` : babyName;

    const child = {
      id: 'child_' + Date.now(),
      category: 'family',
      role: isMale ? 'Son' : 'Daughter',
      name: fullName,
      gender,
      age: 0,
      alive: true,
      relationship: 100,
      avatar: window.generateKinAvatar ? window.generateKinAvatar('Child', gender, 0, 'comfortable', character.avatar, person.avatar) : null,
      actionsDone: createEmptyActionsDone()
    };

    character.kin.children = character.kin.children || [];
    character.kin.children.push(child);
    applyKinStatEffect(character, 'happiness', 20);
    applyKinStatEffect(character, 'humanity', 10);

    return {
      success: true,
      conceived: true,
      title: `A New Soul is Born!`,
      message: `A healthy baby ${child.role.toLowerCase()} was welcomed into the world: ${child.name}! You and ${person.name} wept with profound joy (+20% Happiness, +10% Humanity).`,
      effects: { happiness: 20, humanity: 10, relationship: 15 }
    };
  } else {
    return {
      success: true,
      conceived: false,
      title: `No News Yet`,
      message: `You and ${person.name} spent intimate evenings hoping to conceive, but this year brought no new addition. You held each other tenderly.`,
      effects: { relationship: 3 }
    };
  }
}

// 8. Break Up / Divorce (Lovers)
function breakupWithLover(person, character) {
  if (person.category !== 'lover') {
    return { success: false, reason: "You can only break up with an active partner." };
  }
  const wasMarried = !!person.married;
  person.married = false;
  person.engaged = false;
  person.cohabitating = false;
  person.role = wasMarried ? (person.gender === 'Female' ? 'Ex-Wife' : 'Ex-Husband') : 'Ex-Partner';
  person.relationship = Math.max(5, person.relationship - 45);
  applyKinStatEffect(character, 'happiness', -18);
  applyKinStatEffect(character, 'sanity', -5);

  let settlement = 0;
  if (wasMarried && character.money > 2000) {
    settlement = Math.round(character.money * 0.25);
    character.money -= settlement;
  }

  return {
    success: true,
    title: wasMarried ? `Divorce Finalized` : `Relationship Ended`,
    message: wasMarried
      ? `After bitter court arguments, the marriage was legally dissolved. Assets were split and ${person.name} walked out of your life${settlement > 0 ? ` (Settlement Paid: ${window.formatMoney(settlement, character.countryCode)})` : ''} (-18% Happiness, -5% Sanity).`
      : `You and ${person.name} had a tearful, heartbreaking conversation and packed your separate bags. You are no longer together (-18% Happiness).`,
    effects: { relationship: -45, happiness: -18, sanity: -5, money: -settlement }
  };
}


function argueWithKin(person, character) {
  const count = getActionCount(person, 'argued');
  if (count >= 5) {
    return { success: false, reason: "You have already quarreled with them enough this year." };
  }

  person.actionsDone.argued = count + 1;
  const relLoss = Math.floor(Math.random() * 10) + 8; // -8 to -18%
  person.relationship = Math.max(0, person.relationship - relLoss);

  const insults = [
    `You got into a bitter screaming match with ${person.name} over household chores and broken promises.`,
    `You snapped at ${person.name} and slammed your bedroom door in their face.`,
    `You accused ${person.name} of ignoring the strange noises in the walls, resulting in a cold, hostile silence.`
  ];
  const message = `${window.getRandomElement(insults)} (-${relLoss}% Relationship, -2% Happiness).`;

  return { success: true, message, effects: { relationship: -relLoss, happiness: -2, sanity: -1 } };
}

function investigateKin(person, character) {
  if (person.entityType === 'human' && person.isRevealed) {
    return { success: false, reason: `${person.name} is unquestionably an ordinary human.` };
  }

  const count = getActionCount(person, 'investigated');
  if (count >= 5) {
    return { success: false, reason: "You have already observed their habits thoroughly this year." };
  }

  person.actionsDone.investigated = count + 1;
  const suspicionGain = Math.floor(Math.random() * 25) + 30; // +30 to +55%
  person.suspicion = Math.min(100, person.suspicion + suspicionGain);

  let clue = "";
  let revealed = false;

  if (person.entityType === 'anomaly') {
    clue = `You watched ${person.name} drink boiling soup without flinching. When you touched their hand under the desk, their skin was as cold as a frozen copper pipe (Suspicion: ${person.suspicion}%).`;
  } else if (person.entityType === 'disguised_mimic') {
    clue = `You looked inside ${person.name}'s backpack during recess. Beneath school notebooks lay raw beef gristle and a small jar of unrendered animal teeth (Suspicion: ${person.suspicion}%).`;
  } else if (person.entityType === 'blatant_entity') {
    clue = `You observed ${person.name} standing in the hallway corner. Their shadow cast across the wall possessed six elongated jointed arms (Suspicion: ${person.suspicion}%).`;
  } else {
    // False alarm on human
    clue = `You followed ${person.name} home. They simply bought milk at the corner bodega and went inside to do homework. They seem entirely normal (Suspicion: ${person.suspicion}%).`;
  }

  if (person.suspicion >= 100 && !person.isRevealed && person.entityType !== 'human') {
    revealed = true;
    person.isRevealed = true;
  }

  return {
    success: true,
    message: clue,
    revealed,
    entityType: person.entityType,
    effects: { occult: +6, sanity: -2 }
  };
}

function offerTributeToEntity(person, character) {
  if (!person.isRevealed || person.entityType === 'human') {
    return { success: false, reason: "You can only offer tribute to a revealed anomaly or entity." };
  }

  const count = getActionCount(person, 'tribute');
  if (count >= 5) {
    return { success: false, reason: "You have already offered tribute to them enough this year." };
  }

  person.actionsDone.tribute = count + 1;
  const shillingsGained = Math.floor(Math.random() * 8) + 4; // +4 to +11 Shillings
  person.relationship = Math.min(100, person.relationship + 20);
  person.loyalty = 'loyal';

  const tributes = [
    `You slipped a packet of fresh marrow bones and silver shavings to ${person.name}. Their pupil dialated across their entire iris as they took it.`,
    `You cut a lock of your own hair and sealed it in wax for ${person.name}. They inhaled the smoke and smiled with too many teeth.`,
    `You offered an antique tarnished coin and three drops of your own blood to ${person.name} in the cellar.`
  ];

  const message = `${window.getRandomElement(tributes)}\nIn return, they bestowed +${shillingsGained} Paranormal Shillings upon you (+20% Relationship, +12% Occult, -2% Humanity).`;

  return {
    success: true,
    message,
    shillings: shillingsGained,
    effects: { shillings: shillingsGained, occult: +12, humanity: -2, sanity: -2 }
  };
}

function cuddleKin(person, character) {
  const count = getActionCount(person, 'cuddled');
  if (count >= 6) {
    return { success: false, reason: "You have already cuddled plenty this year." };
  }
  person.actionsDone.cuddled = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 4) + 10) : (count <= 2 ? 6 : 3);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = "";
  if (person.role.includes('Mother')) {
    message = `You curled into your mother's warm embrace. She stroked your hair and rocked you gently until your breathing steadied.`;
  } else if (person.role.includes('Father')) {
    message = `Your father hoisted you onto his shoulder, patting your back with his large, calloused hand until you relaxed.`;
  } else if (person.role.includes('Grand')) {
    message = `${person.name} held you close in their knitted cardigan, humming a faint antique tune that smelled of lavender and old wool.`;
  } else {
    message = `You leaned into ${person.name}'s side. They held your hand gently and let you rest against their arm.`;
  }

  return {
    success: true,
    message,
    effects: {
      relationship: relGain,
      happiness: +8,
      vitality: +3,
      sanity: +3
    }
  };
}

function babbleToKin(person, character) {
  const count = getActionCount(person, 'babbled');
  if (count >= 6) {
    return { success: false, reason: "You've babbled enough for now; your tiny voice needs rest." };
  }
  person.actionsDone.babbled = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 4) + 8) : (count <= 2 ? 5 : 2);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = "";
  if (person.entityType && person.entityType !== 'human' && person.isRevealed) {
    message = `You pointed your tiny finger at ${person.name} and let out rhythmic clicks. Its pupils dilated in cold, amused fascination.`;
  } else if (person.role.includes('Mother') || person.role.includes('Father')) {
    const words = ["'Ma-ma'", "'Da-da'", "'Mi-lk'", "'No-no'", "'Up-up'"];
    const chosen = window.getRandomElement(words);
    message = `You pointed at ${person.name} and tried to say ${chosen}. Their eyes lit up with pride as they gently coached your syllables.`;
  } else {
    message = `You babbled animatedly at ${person.name}, waving your arms. They smiled and repeated silly words back to you.`;
  }

  return {
    success: true,
    message,
    effects: {
      relationship: relGain,
      smarts: +5,
      happiness: +5
    }
  };
}

function feedMilkFromKin(person, character) {
  const count = getActionCount(person, 'fedMilk');
  if (count >= 6) {
    return { success: false, reason: "Your tummy is completely full of warm milk for now." };
  }
  person.actionsDone.fedMilk = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 3) + 7) : (count <= 2 ? 5 : 2);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = `${person.name} prepared a warm bottle and gently supported your head while you drank, rocking you until you were full and sleepy.`;
  return {
    success: true,
    message,
    effects: {
      relationship: relGain,
      vitality: +6,
      sanity: +4
    }
  };
}

function peekabooWithKin(person, character) {
  const count = getActionCount(person, 'peekaboo');
  if (count >= 6) {
    return { success: false, reason: "You've giggled yourself tired playing peek-a-boo for now." };
  }
  person.actionsDone.peekaboo = count + 1;
  const relGain = count === 0 ? (Math.floor(Math.random() * 4) + 8) : (count <= 2 ? 5 : 2);
  person.relationship = Math.min(100, person.relationship + relGain);

  let message = `${person.name} covered their face with both hands, waited two seconds, and shouted 'PEEK-A-BOO!' with a funny grin, sending you into fits of giggles.`;
  return {
    success: true,
    message,
    effects: {
      relationship: relGain,
      happiness: +8,
      vitality: +2
    }
  };
}

// --- Annual Tick Simulation for Kin ---

function tickKinYear(character) {
  if (!character || !character.kin) return [];
  const logs = [];
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const kin = character.kin;

  // 1. Tick Parents
  kin.parents.forEach(p => {
    if (!p.alive) return;
    p.age += 1;
    // Reset actions to clean counts
    p.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(p);
    
    // Natural drift if ignored
    p.relationship = Math.max(10, p.relationship - Math.floor(Math.random() * 3));

    // Mortality check for parents (older age = higher risk, base 0.8% rising with age)
    const deathChance = p.age > 65 ? 0.05 : (p.age > 50 ? 0.015 : 0.005);
    if (Math.random() < deathChance) {
      p.alive = false;
      p.deathYear = character.year;
      const causes = [
        "Suffered sudden cardiac arrest during an icy graveyard shift at the municipal substation.",
        "Contracted a rapid, untreatable black pulmonary infection after inspecting the flooded district basement.",
        "Slipped from the wet scaffolding of an industrial cooling tower at midnight.",
        "Vanished on the late-night commuter train. Search teams found only their briefcase and coat on an empty seat.",
        "Pronounced dead at the regional hospital following a severe highway collision in dense fog."
      ];
      p.deathCause = window.getRandomElement(causes);
      logs.push(`[TRAGEDY] Your ${p.role.toLowerCase()}, ${p.name}, passed away at age ${p.age}. ${p.deathCause}`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 3);
      character.stats.sanity = Math.max(0, character.stats.sanity - 3);
      return;
    }

    // Passive Allowance for minors (Ages 5-18)
    if (character.age >= 5 && character.age <= 18 && p.relationship > 55) {
      const baseUSD = Math.floor(Math.random() * 20) + 10; // $10-$30 weekly equivalent
      const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
      character.money += totalAllowance;
      logs.push(`Received ${window.formatMoney(totalAllowance, character.countryCode)} in yearly pocket allowance from your ${p.role.toLowerCase()}, ${p.name}.`);
    }
  });

  // 2. Tick Siblings
  kin.siblings.forEach(s => {
    if (!s.alive) return;
    s.age += 1;
    s.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(s);
    s.relationship = Math.max(10, s.relationship - Math.floor(Math.random() * 2));

    // Rare sibling tragedy (0.4%)
    if (Math.random() < 0.004) {
      s.alive = false;
      s.deathYear = character.year;
      s.deathCause = "Drowned in the frozen canal after walking onto thin ice on a dare.";
      logs.push(`[TRAGEDY] Your ${s.role.toLowerCase()}, ${s.name}, died at age ${s.age}. ${s.deathCause}`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 3);
      character.stats.sanity = Math.max(0, character.stats.sanity - 2);
    }
  });

  // 3. Tick Grandparents
  kin.grandparents.forEach(g => {
    if (!g.alive) return;
    g.age += 1;
    g.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(g);
    
    // Grandparent mortality (high after age 72)
    const deathChance = g.age > 78 ? 0.12 : (g.age > 70 ? 0.06 : 0.02);
    if (Math.random() < deathChance) {
      g.alive = false;
      g.deathYear = character.year;
      g.deathCause = "Passed away peacefully in their sleep after a long life.";
      const inheritance = Math.round(500 * country.wageMultiplier);
      character.money += inheritance;
      logs.push(`[OBITUARY] Your ${g.role.toLowerCase()}, ${g.name}, passed away at age ${g.age}. Left you an inheritance of ${window.formatMoney(inheritance, character.countryCode)}.`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 2);
    }
  });

  // 4. Tick Friends
  kin.friends.forEach(f => {
    if (!f.alive) return;
    f.age += 1;
    f.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(f);
    f.relationship = Math.max(5, f.relationship - Math.floor(Math.random() * 4)); // friends drift faster
  });

  // 5. Tick Lovers / Partners
  if (!kin.lovers) kin.lovers = [];
  kin.lovers.forEach(l => {
    if (!l.alive) return;
    l.age += 1;
    l.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(l);
    
    // Slight relationship drift
    l.relationship = Math.max(5, l.relationship - Math.floor(Math.random() * 2));

    // If cohabitating or married, partner contributes to household finances
    if ((l.cohabitating || l.married) && !l.role.includes('Ex')) {
      const baseSalary = l.salaryUSD || 25000;
      const annualShare = Math.round((baseSalary * 0.15) * country.wageMultiplier);
      if (annualShare > 0) {
        character.money += annualShare;
        logs.push(`💼 Your partner ${l.name} contributed ${window.formatMoney(annualShare, character.countryCode)} to the shared household.`);
      }
    }

    // Milestones / Anniversaries
    if (l.anniversaryYear && !l.role.includes('Ex')) {
      const yearsTogether = character.year - l.anniversaryYear;
      if (yearsTogether > 0 && yearsTogether % 5 === 0) {
        logs.push(`💖 You and ${l.name} celebrated your ${yearsTogether}-year anniversary together! (+10% Happiness)`);
        character.stats.happiness = Math.min(100, character.stats.happiness + 10);
      }
    }

    // Partner mortality (elderly)
    const deathChance = l.age > 80 ? 0.08 : (l.age > 70 ? 0.03 : (l.age > 60 ? 0.01 : 0.002));
    if (Math.random() < deathChance) {
      l.alive = false;
      l.deathYear = character.year;
      l.deathCause = "Passed away from complications of sudden illness.";
      logs.push(`[TRAGEDY] Your partner, ${l.name}, passed away at age ${l.age}. ${l.deathCause}`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 35);
      character.stats.sanity = Math.max(0, character.stats.sanity - 15);
    }
  });

  // 6. Tick Children
  if (!kin.children) kin.children = [];
  kin.children.forEach(c => {
    if (!c.alive) return;
    c.age += 1;
    c.actionsDone = createEmptyActionsDone();
    if (window.ageNpcMemories) window.ageNpcMemories(c);
    c.relationship = Math.max(10, c.relationship - Math.floor(Math.random() * 2));

    if (c.age === 6) {
      logs.push(`🎒 Your ${c.role.toLowerCase()} ${c.name} started elementary school! (+5% Happiness)`);
      character.stats.happiness = Math.min(100, character.stats.happiness + 5);
    } else if (c.age === 18) {
      logs.push(`🎓 Your ${c.role.toLowerCase()} ${c.name} turned 18 and stepped into adulthood! (+8% Happiness)`);
      character.stats.happiness = Math.min(100, character.stats.happiness + 8);
    }
  });

  // 7. Automatic Romance Discovery Chance (Ages 16 to 45)
  if (character.age >= 16 && character.age <= 45) {
    const activeLovers = kin.lovers.filter(l => l.alive && !l.role.includes('Ex'));
    if (activeLovers.length === 0 && Math.random() < 0.22) {
      const contexts = ["Workplace Breakroom", "Evening Coffeehouse", "Subway Platform", "Public Library", "Local Neighborhood Walk"];
      const candidate = generateLoverCandidate(character, window.getRandomElement(contexts));
      kin.lovers.push(candidate);
      logs.push(`💖 You crossed paths with ${candidate.name} (${candidate.role}, Age ${candidate.age}) at the ${candidate.origin}. Sparks flew and you started dating!`);
    }
  }

  // 8. Automatic Friend Discovery Chance (Ages 5 to 17)
  if (character.age >= 5 && character.age <= 17 && kin.friends.length < 5) {
    if (Math.random() < 0.35) {
      const contexts = ["Primary School Recess", "Neighborhood Alley", "Local Public Library", "Youth Soccer Pitch"];
      const newFriend = generateNewFriend(character, window.getRandomElement(contexts));
      kin.friends.push(newFriend);
      logs.push(`Made a new friend at ${newFriend.origin}: ${newFriend.name} (Age ${newFriend.age}).`);
    }
  }

  return logs;
}

window.generateFamily = generateFamily;
window.generateNewFriend = generateNewFriend;
window.generateLoverCandidate = generateLoverCandidate;
window.spendTimeToKin = spendTimeToKin;
window.talkToKin = talkToKin;
window.complimentKin = complimentKin;
window.giveGiftToKin = giveGiftToKin;
window.askForMoney = askForMoney;
window.argueWithKin = argueWithKin;
window.investigateKin = investigateKin;
window.offerTributeToEntity = offerTributeToEntity;
window.tickKinYear = tickKinYear;
window.cuddleKin = cuddleKin;
window.babbleToKin = babbleToKin;
window.feedMilkFromKin = feedMilkFromKin;
window.peekabooWithKin = peekabooWithKin;
window.askAdviceFromParent = askAdviceFromParent;
window.bickerWithSibling = bickerWithSibling;
window.shareSecretWithSibling = shareSecretWithSibling;
window.listenGrandparentFolktale = listenGrandparentFolktale;
window.helpWithChores = helpWithChores;
window.begForPetOrToy = begForPetOrToy;
window.askForDrivingLessons = askForDrivingLessons;
window.discussCollegePlans = discussCollegePlans;
window.requestFamilyLoan = requestFamilyLoan;
window.careForAgingParent = careForAgingParent;
window.coverSiblingAlibi = coverSiblingAlibi;
window.siblingBrawl = siblingBrawl;
window.siblingDrinks = siblingDrinks;
window.exploreGrandparentAttic = exploreGrandparentAttic;
window.inheritGrandparentKeepsake = inheritGrandparentKeepsake;
window.visitNursingHome = visitNursingHome;
window.dateLover = dateLover;
window.flirtKissLover = flirtKissLover;
window.confessToFriend = confessToFriend;
window.askMoveInTogether = askMoveInTogether;
window.proposeMarriage = proposeMarriage;
window.planWeddingCeremony = planWeddingCeremony;
window.conceiveChildWithLover = conceiveChildWithLover;
window.breakupWithLover = breakupWithLover;
window.PARENT_OCCUPATIONS_DATA = PARENT_OCCUPATIONS_DATA;
window.HOUSEHOLD_RESIDENCES = HOUSEHOLD_RESIDENCES;
window.createEmptyActionsDone = createEmptyActionsDone;
