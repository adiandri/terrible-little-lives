// Family, Kin, Friends & Entities Engine for Terrible Little Lives
// BitLife-style relationships with modern gothic & paranormal horror dynamics

const PARENT_OCCUPATIONS = [
  "Municipal Water Inspector",
  "Night Shift ER Nurse",
  "Subway Electrical Technician",
  "Middle School Biology Teacher",
  "High-Rise Window Cleaner",
  "Postal Delivery Courier",
  "City Morgue Assistant",
  "Commercial HVAC Repairman",
  "Warehouse Forklift Operator",
  "Antique Book Restorer",
  "Emergency Dispatch Operator",
  "Railroad Signal Operator",
  "Dental Hygienist",
  "Meat Processing Plant Worker",
  "Surveillance Camera Monitor",
  "Local Pharmacy Clerk"
];

const ANOMALY_QUOTES = [
  "\"Do you ever feel your skull humming when the streetlights buzz at twilight?\"",
  "\"I looked in the bathroom mirror this morning. My reflection blinked three seconds after I did.\"",
  "\"Why do grown-ups pretend the people under the storm drains are just stray dogs?\"",
  "\"Hold my wrist. Feel that? No rhythm at all. Isn't that neat?\"",
  "\"If you say your own name backwards forty times, the ceiling fan stops spinning.\""
];

const MIMIC_QUOTES = [
  "\"I brought fresh chicken livers from the butcher's dumpster behind the garage. Want half? They're still warm.\"",
  "\"That boy from third grade was mean to you yesterday. Don't worry. He won't be at school tomorrow.\"",
  "\"My jaw unhinges when nobody is watching. Do you want to see?\"",
  "\"Humans make so much noise with their water and salt when they cry.\"",
  "\"Don't tell your mom about the scratching behind my wallpaper. She wouldn't understand our friendship.\""
];

const ENTITY_QUOTES = [
  "\"The floorboards breathe slower in winter, little mortal.\"",
  "\"Bring me something with iron on it, and I will show you where the coins fell in 1928.\"",
  "\"They think you're alone in this bedroom. We know better.\"",
  "\"A tooth for an omen. That is the fair exchange between the flesh and the hollow.\""
];

const NORMAL_FRIEND_QUOTES = [
  "\"Did you finish the math worksheet? The teacher said she'll call our parents if we fail.\"",
  "\"Let's ride our bikes down to the old railroad trestle before it gets pitch dark.\"",
  "\"My older brother said he heard screaming near the abandoned quarry last weekend.\"",
  "\"Do you want to come over and play video games after the final bell?\""
];

function createEmptyActionsDone() {
  return {
    talked: 0,
    complimented: 0,
    gifted: 0,
    spentTime: 0,
    askedMoney: 0,
    argued: 0,
    investigated: 0,
    tribute: 0
  };
}

function getActionCount(person, key) {
  if (!person.actionsDone) person.actionsDone = createEmptyActionsDone();
  const val = person.actionsDone[key];
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return 0;
}

function generateFamily(character) {
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const surname = character.name.split(' ').slice(1).join(' ') || window.getRandomElement(country.surnames);

  const dadFirst = window.getRandomElement(country.firstNamesMale);
  const momFirst = window.getRandomElement(country.firstNamesFemale);

  const dadAge = Math.floor(Math.random() * 12) + 26; // 26-37
  const momAge = Math.floor(Math.random() * 10) + 24; // 24-33

  const parents = [
    {
      id: 'father_' + Date.now() + '_1',
      role: 'Father',
      name: `${dadFirst} ${surname}`,
      gender: 'Male',
      age: dadAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      occupation: window.getRandomElement(PARENT_OCCUPATIONS),
      relationship: Math.floor(Math.random() * 25) + 70, // 70-95%
      generosity: Math.floor(Math.random() * 50) + 40,   // 40-90%
      strictness: Math.floor(Math.random() * 50) + 30,
      sanity: Math.floor(Math.random() * 30) + 65,
      entityType: 'human',
      suspicion: 0,
      isRevealed: true,
      actionsDone: createEmptyActionsDone()
    },
    {
      id: 'mother_' + Date.now() + '_2',
      role: 'Mother',
      name: `${momFirst} ${surname}`,
      gender: 'Female',
      age: momAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      occupation: window.getRandomElement(PARENT_OCCUPATIONS),
      relationship: Math.floor(Math.random() * 20) + 75, // 75-95%
      generosity: Math.floor(Math.random() * 45) + 45,   // 45-90%
      strictness: Math.floor(Math.random() * 45) + 35,
      sanity: Math.floor(Math.random() * 30) + 65,
      entityType: 'human',
      suspicion: 0,
      isRevealed: true,
      actionsDone: createEmptyActionsDone()
    }
  ];

  // Sibling generation (0 to 2 siblings)
  const siblings = [];
  const siblingCount = Math.floor(Math.random() * 3); // 0, 1, or 2
  for (let i = 0; i < siblingCount; i++) {
    const isMale = Math.random() > 0.5;
    const sFirst = isMale ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale);
    // age difference relative to player (starts at birth, so older sibling)
    const ageDiff = Math.floor(Math.random() * 6) + 1; // 1 to 6 years older
    const role = isMale ? (ageDiff > 0 ? 'Older Brother' : 'Younger Brother') : (ageDiff > 0 ? 'Older Sister' : 'Younger Sister');

    siblings.push({
      id: 'sibling_' + Date.now() + '_' + i,
      role,
      name: `${sFirst} ${surname}`,
      gender: isMale ? 'Male' : 'Female',
      age: ageDiff,
      alive: true,
      deathYear: null,
      deathCause: null,
      relationship: Math.floor(Math.random() * 40) + 55, // 55-95%
      entityType: Math.random() < 0.04 ? 'anomaly' : 'human',
      suspicion: 0,
      isRevealed: false,
      actionsDone: createEmptyActionsDone()
    });
  }

  // Grandparents generation (1 living grandparent)
  const grandparents = [];
  if (Math.random() < 0.75) {
    const isMaternal = Math.random() > 0.5;
    const isGrandpa = Math.random() > 0.5;
    const gFirst = isGrandpa ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale);
    const gSurname = isMaternal ? window.getRandomElement(country.surnames) : surname;
    const gAge = Math.floor(Math.random() * 12) + 63; // 63-75

    grandparents.push({
      id: 'grandparent_' + Date.now(),
      role: isGrandpa ? (isMaternal ? 'Maternal Grandfather' : 'Paternal Grandfather') : (isMaternal ? 'Maternal Grandmother' : 'Paternal Grandmother'),
      name: `${gFirst} ${gSurname}`,
      gender: isGrandpa ? 'Male' : 'Female',
      age: gAge,
      alive: true,
      deathYear: null,
      deathCause: null,
      relationship: Math.floor(Math.random() * 20) + 75,
      generosity: Math.floor(Math.random() * 30) + 60,
      entityType: 'human',
      actionsDone: createEmptyActionsDone()
    });
  }

  return {
    parents,
    siblings,
    grandparents,
    friends: [] // Starts empty at age 0
  };
}

function generateNewFriend(character, context = 'Neighborhood') {
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const isMale = Math.random() > 0.5;
  const first = isMale ? window.getRandomElement(country.firstNamesMale) : window.getRandomElement(country.firstNamesFemale);
  const surname = window.getRandomElement(country.surnames);

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
    role: 'Friend',
    name: `${first} ${surname}`,
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
    effects.sanity = -5;
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

  // Grandparents are more generous
  const grandBonus = person.role.includes('Grand') ? 20 : 0;

  const score = (person.relationship * 0.5) + (person.generosity * 0.5) + grandBonus - penalty - askPenalty;
  const success = score >= 35;

  if (success) {
    let relChange = -1;
    if (baseUSD > 150) relChange = -3;
    person.relationship = Math.max(0, person.relationship + relChange);

    const responses = [
      `${person.name} reached into their wallet and handed you ${window.formatMoney(amount, character.countryCode)}. "Here. Spend it wisely."`,
      `${person.name} smiled warmly, slipping ${window.formatMoney(amount, character.countryCode)} into your hands. "Make sure you put some in your savings."`,
      `Seeing how polite you were, ${person.name} counted out ${window.formatMoney(amount, character.countryCode)} and gave it to you with a gentle nod.`
    ];

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

    const refusals = [
      `"${person.name} frowned at the request for ${window.formatMoney(amount, character.countryCode)}: 'Money doesn't grow on copper pipes. Absolutely not.'"`,
      `"${person.name} shook their head: 'You need to learn financial restraint. I cannot give you that much.'"`,
      `"${person.name} sighed, showing you an unpaid utility bill: 'Times are tight right now. You'll have to manage without.'"`,
      `"${person.name} crossed their arms: '${window.formatMoney(amount, character.countryCode)}?! Do you think I'm made of cash? Go find chores to do.'"`
    ];

    const message = window.getRandomElement(refusals);
    return {
      success: true,
      granted: false,
      amount: 0,
      message,
      effects: { happiness: -4, relationship: -relLoss }
    };
  }
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
  const message = `${window.getRandomElement(insults)} (-${relLoss}% Relationship, -8% Happiness).`;

  return { success: true, message, effects: { relationship: -relLoss, happiness: -8, sanity: -3 } };
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
    effects: { occult: +6, sanity: -6 }
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

  const message = `${window.getRandomElement(tributes)}\nIn return, they bestowed +${shillingsGained} Paranormal Shillings upon you (+20% Relationship, +12% Occult, -6% Humanity).`;

  return {
    success: true,
    message,
    shillings: shillingsGained,
    effects: { shillings: shillingsGained, occult: +12, humanity: -6, sanity: -4 }
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
      character.stats.happiness = Math.max(0, character.stats.happiness - 35);
      character.stats.sanity = Math.max(0, character.stats.sanity - 20);
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
    s.relationship = Math.max(10, s.relationship - Math.floor(Math.random() * 2));

    // Rare sibling tragedy (0.4%)
    if (Math.random() < 0.004) {
      s.alive = false;
      s.deathYear = character.year;
      s.deathCause = "Drowned in the frozen canal after walking onto thin ice on a dare.";
      logs.push(`[TRAGEDY] Your ${s.role.toLowerCase()}, ${s.name}, died at age ${s.age}. ${s.deathCause}`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 25);
      character.stats.sanity = Math.max(0, character.stats.sanity - 15);
    }
  });

  // 3. Tick Grandparents
  kin.grandparents.forEach(g => {
    if (!g.alive) return;
    g.age += 1;
    g.actionsDone = createEmptyActionsDone();
    
    // Grandparent mortality (high after age 72)
    const deathChance = g.age > 78 ? 0.12 : (g.age > 70 ? 0.06 : 0.02);
    if (Math.random() < deathChance) {
      g.alive = false;
      g.deathYear = character.year;
      g.deathCause = "Passed away peacefully in their sleep after a long life.";
      const inheritance = Math.round(500 * country.wageMultiplier);
      character.money += inheritance;
      logs.push(`[OBITUARY] Your ${g.role.toLowerCase()}, ${g.name}, passed away at age ${g.age}. Left you an inheritance of ${window.formatMoney(inheritance, character.countryCode)}.`);
      character.stats.happiness = Math.max(0, character.stats.happiness - 15);
    }
  });

  // 4. Tick Friends
  kin.friends.forEach(f => {
    if (!f.alive) return;
    f.age += 1;
    f.actionsDone = createEmptyActionsDone();
    f.relationship = Math.max(5, f.relationship - Math.floor(Math.random() * 4)); // friends drift faster
  });

  // 5. Automatic Friend Discovery Chance (Ages 5 to 17)
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
window.spendTimeToKin = spendTimeToKin;
window.talkToKin = talkToKin;
window.complimentKin = complimentKin;
window.giveGiftToKin = giveGiftToKin;
window.askForMoney = askForMoney;
window.argueWithKin = argueWithKin;
window.investigateKin = investigateKin;
window.offerTributeToEntity = offerTributeToEntity;
window.tickKinYear = tickKinYear;
