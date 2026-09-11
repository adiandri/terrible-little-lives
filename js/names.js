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
    firstNamesMale: [
      "Adrian", "Aiden", "Alex", "Andrew", "Anthony", "Austin", "Avery", "Blake", "Brandon", "Caleb",
      "Cameron", "Carter", "Charles", "Connor", "Cooper", "Daniel", "David", "Dylan", "Elijah", "Ethan",
      "Evan", "Gavin", "Isaac", "Isaiah", "Jack", "Jackson", "James", "Jason", "Jayden", "Jordan",
      "Joseph", "Joshua", "Kevin", "Leo", "Liam", "Logan", "Lucas", "Luke", "Mason", "Michael",
      "Nathan", "Nicholas", "Nolan", "Owen", "Parker", "Peyton", "Riley", "Ryan", "Sean", "Taylor",
      "Tristan", "Tyler", "Wyatt", "Xavier"
    ],
    firstNamesFemale: [
      "Abigail", "Addison", "Alex", "Allison", "Amber", "Ariana", "Audrey", "Avery", "Bailey", "Blake",
      "Brooke", "Caroline", "Cassidy", "Claire", "Delilah", "Eden", "Emma", "Eva", "Faith", "Gabriella",
      "Hailey", "Hannah", "Harper", "Hazel", "Jade", "Jordan", "Julia", "Kaitlyn", "Kayla", "Kennedy",
      "Kylie", "Leah", "Madison", "Maya", "Megan", "Mia", "Natalie", "Nicole", "Olivia", "Paige",
      "Parker", "Peyton", "Riley", "Samantha", "Sarah", "Savannah", "Scarlett", "Serenity", "Sophia", "Stella",
      "Taylor", "Victoria", "Violet", "Zoe"
    ],
    surnames: [
      "Adams", "Allen", "Anderson", "Bailey", "Baker", "Bell", "Bennett", "Brooks", "Brown", "Butler",
      "Campbell", "Carter", "Clark", "Coleman", "Collins", "Cook", "Cooper", "Cox", "Crawford", "Davis",
      "Diaz", "Edwards", "Ellis", "Evans", "Fisher", "Flores", "Foster", "Garcia", "Gardner", "Graham",
      "Grant", "Gray", "Green", "Griffin", "Hall", "Harris", "Harrison", "Hayes", "Henderson", "Hernandez",
      "Hill", "Holmes", "Howard", "Hughes", "Jackson", "James", "Jenkins", "Johnson", "Johnston", "Jones",
      "Kelly", "Kennedy", "King", "Knight", "Lee", "Lewis", "Long", "Lopez", "Marshall", "Martin",
      "Martinez", "Mason", "Matthews", "Miller", "Mitchell", "Morgan", "Morris", "Murphy", "Murray", "Nelson",
      "Nguyen", "Nichols", "Parker", "Patterson", "Pearson", "Perry", "Peterson", "Phillips", "Powell", "Price",
      "Ramirez", "Reed", "Reynolds", "Richardson", "Rivera", "Roberts", "Robinson", "Rodriguez", "Rogers", "Ross",
      "Russell", "Sanchez", "Sanders", "Scott", "Shaw", "Simmons", "Smith", "Snyder", "Spencer", "Stanley",
      "Stewart", "Sullivan", "Taylor", "Thomas", "Thompson", "Torres", "Turner", "Walker", "Wallace", "Ward",
      "Warren", "Washington", "Watson", "Webb", "White", "Williams", "Wilson", "Wood", "Wright", "Young"
    ]
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
    firstNamesMale: [
      "Arthur", "Benjamin", "Daniel", "Elias", "George", "Harry", "Henry", "Isaac", "Jack", "Jacob",
      "James", "Joseph", "Nathan", "Noah", "Oliver", "Oscar", "Samuel", "Thomas", "William"
    ],
    firstNamesFemale: [
      "Amelia", "Ava", "Beatrice", "Bethany", "Charlotte", "Chloe", "Clara", "Daisy", "Eleanor", "Eliza",
      "Elizabeth", "Ella", "Ellie", "Emily", "Evelyn", "Florence", "Freya", "Grace", "Holly", "Imogen",
      "Isla", "Jasmine", "Jessica", "Lily", "Lola", "Lucy", "Maisie", "Matilda", "Molly", "Phoebe",
      "Poppy", "Rosie", "Ruby", "Sophie", "Zoe"
    ],
    surnames: [
      "Anderson", "Baker", "Barnes", "Bennett", "Brooks", "Brown", "Carter", "Chapman", "Clark", "Collins",
      "Cooper", "Davies", "Dawson", "Edwards", "Ellis", "Evans", "Fisher", "Fletcher", "Foster", "Gibson",
      "Graham", "Gray", "Green", "Griffin", "Hall", "Harris", "Harrison", "Hart", "Harvey", "Henderson",
      "Hill", "Holmes", "Hughes", "Hunt", "Jackson", "James", "Jenkins", "Johnson", "Jones", "Kelly",
      "King", "Knight", "Lewis", "Lloyd", "Marshall", "Martin", "Mason", "Matthews", "Miller", "Mitchell",
      "Moore", "Morgan", "Morris", "Murphy", "Murray", "Parker", "Pearson", "Perry", "Phillips", "Powell",
      "Price", "Reed", "Reynolds", "Richardson", "Roberts", "Robinson", "Rogers", "Ross", "Russell", "Scott",
      "Shaw", "Simpson", "Smith", "Spencer", "Stevens", "Stewart", "Stone", "Taylor", "Thomas", "Thompson",
      "Turner", "Walker", "Ward", "Watson", "Webb", "West", "White", "Wilkinson", "Williams", "Wilson",
      "Wood", "Wright", "Young"
    ]
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
    firstNamesMale: [
      "Akira", "Daichi", "Daisuke", "Haruki", "Haruto", "Hayato", "Hikaru", "Hiroki", "Hiroshi", "Issei",
      "Itsuki", "Jun", "Kaito", "Kazuki", "Kenji", "Kenta", "Koki", "Kota", "Makoto", "Masato",
      "Naoki", "Ren", "Riku", "Ryo", "Ryota", "Satoshi", "Shota", "Shun", "Souta", "Subaru",
      "Takumi", "Tatsuya", "Tomoya", "Yosuke", "Yuki", "Yuji", "Yuma", "Yuto"
    ],
    firstNamesFemale: [
      "Aiko", "Akari", "Akemi", "Ayaka", "Chihiro", "Ema", "Emi", "Hana", "Haruka", "Hina",
      "Hinata", "Honoka", "Kaede", "Kana", "Kanon", "Karin", "Keiko", "Kiko", "Koharu", "Kokoro",
      "Mai", "Maki", "Mana", "Manami", "Mariko", "Mei", "Miki", "Mina", "Minami", "Mio",
      "Misaki", "Momoka", "Nanami", "Nao", "Natsuki", "Nozomi", "Rika", "Rina", "Rin", "Sakura",
      "Sayaka", "Shiori", "Yui", "Yuka", "Yuki", "Yuna", "Yuriko"
    ],
    surnames: [
      "Abe", "Aoki", "Endo", "Fujii", "Fujimoto", "Fukuda", "Goto", "Hasegawa", "Hashimoto", "Hayashi",
      "Honda", "Ikeda", "Ishii", "Ishikawa", "Ito", "Iwai", "Kato", "Kimura", "Kobayashi", "Kondo",
      "Maeda", "Matsuda", "Matsui", "Matsumoto", "Miura", "Miyamoto", "Mori", "Murakami", "Nakagawa", "Nakamura",
      "Nakano", "Nishimura", "Ogawa", "Okada", "Saito", "Sakai", "Sakurai", "Sasaki", "Shibata", "Shimizu",
      "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Yamada", "Yamamoto", "Yamaguchi"
    ]
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
    firstNamesMale: [
      "Anton", "Ben", "Benjamin", "Bruno", "Emil", "Felix", "Finn", "Florian", "Franz", "Friedrich",
      "Heinrich", "Jakob", "Jan", "Jonas", "Julian", "Karl", "Leon", "Lukas", "Max", "Maximilian",
      "Moritz", "Nico", "Niklas", "Noah", "Paul", "Philipp", "Stefan", "Theo", "Theodor", "Tim",
      "Tobias", "Tom", "Valentin", "Wilhelm"
    ],
    firstNamesFemale: [
      "Anna", "Clara", "Emilia", "Emma", "Frieda", "Greta", "Hannah", "Hanna", "Helene", "Ida",
      "Jana", "Julia", "Karla", "Katharina", "Klara", "Lara", "Laura", "Lea", "Lena", "Lina",
      "Luisa", "Marie", "Maria", "Mia", "Mila", "Nina", "Paula", "Rosa", "Sophie", "Viktoria"
    ],
    surnames: [
      "Bauer", "Becker", "Berg", "Böhm", "Brandt", "Braun", "Busch", "Dietrich", "Engel", "Fischer",
      "Frank", "Friedrich", "Fuchs", "Graf", "Groß", "Günther", "Haas", "Hahn", "Hartmann", "Haug",
      "Heinrich", "Herrmann", "Hofmann", "Jäger", "Kaiser", "Keller", "Kern", "Klein", "Koch", "König",
      "Krause", "Krüger", "Kühn", "Lang", "Lange", "Lehmann", "Lorenz", "Ludwig", "Maier", "Mayer",
      "Meier", "Metzger", "Neumann", "Otto", "Peters", "Pfeiffer", "Richter", "Ritter", "Roth", "Schäfer",
      "Schmid", "Schmidt", "Schneider", "Scholz", "Schreiber", "Schulz", "Schwarz", "Seidel", "Simon", "Sommer",
      "Stein", "Thomas", "Vogel", "Vogt", "Wagner", "Walter", "Weber", "Weiss", "Werner", "Winkler",
      "Winter", "Wolf", "Wolff", "Zimmermann"
    ]
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
    firstNamesMale: [
      "Adrien", "Alexandre", "Antoine", "Arthur", "Camille", "Clément", "Étienne", "Félix", "Gabriel", "Hugo",
      "Julien", "Léon", "Lucas", "Maxime", "Nathan", "Nicolas", "Olivier", "Paul", "Pierre", "Raphaël",
      "Rémi", "Romain", "Simon", "Théo", "Thomas", "Valentin", "Victor"
    ],
    firstNamesFemale: [
      "Adèle", "Alice", "Amélie", "Anaïs", "Camille", "Chloé", "Clara", "Élodie", "Émilie", "Emma",
      "Eva", "Inès", "Jade", "Jeanne", "Léa", "Léonie", "Louise", "Lucie", "Manon", "Margaux",
      "Marie", "Mathilde", "Noémie", "Océane", "Pauline", "Rose", "Sarah", "Sophie", "Yasmine", "Zoé"
    ],
    surnames: [
      "Bernard", "Bertrand", "Blanc", "Bonnet", "Boyer", "Caron", "Chevalier", "Colin", "David", "Denis",
      "Dubois", "Dupont", "Durand", "Fontaine", "Fournier", "Garnier", "Girard", "Giraud", "Guérin", "Henry",
      "Lambert", "Laurent", "Lefebvre", "Legrand", "Leroy", "Marchand", "Martin", "Mathieu", "Mercier", "Michel",
      "Moreau", "Moulin", "Muller", "Nicolas", "Olivier", "Petit", "Philippe", "Picard", "Robin", "Robert",
      "Roger", "Rousseau", "Roy", "Schmitt", "Simon", "Thomas", "Vincent"
    ]
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
    firstNamesMale: [
      "Adam", "Alex", "André", "Andrew", "Antoine", "Benjamin", "Blake", "Cole", "Daniel", "Ethan",
      "Félix", "Gabriel", "Henry", "Jacob", "James", "Jean", "Julien", "Liam", "Logan", "Lucas",
      "Nathan", "Noah", "Olivier", "Owen", "Patrick", "Philippe", "Rémi", "Riley", "Samuel", "Simon",
      "Thomas", "William", "Xavier"
    ],
    firstNamesFemale: [
      "Aaliyah", "Alex", "Alice", "Amélie", "Audrey", "Blake", "Camille", "Charlotte", "Chloe", "Claire",
      "Élodie", "Emma", "Gabrielle", "Grace", "Hannah", "Isabelle", "Jade", "Lily", "Léa", "Marie",
      "Maya", "Mia", "Olivia", "Paige", "Rachel", "Riley", "Rose", "Sarah", "Sophie", "Victoria", "Zoé"
    ],
    surnames: [
      "Anderson", "Baker", "Bélanger", "Bennett", "Bouchard", "Brown", "Campbell", "Caron", "Carter", "Chen",
      "Clark", "Côté", "Davis", "Dubé", "Dubois", "Duncan", "Edwards", "Fortin", "Fraser", "Gagnon",
      "Gauthier", "Girard", "Graham", "Grant", "Green", "Hamilton", "Harris", "Henderson", "Johnson", "Jones",
      "Kennedy", "King", "Labelle", "Lambert", "Landry", "Laurent", "Leblanc", "Lefebvre", "Lévesque", "MacDonald",
      "Martin", "McDonald", "Miller", "Mitchell", "Moore", "Morin", "Morrison", "Pelletier", "Peterson", "Roy",
      "Simard", "Smith", "Tremblay", "Walker", "Walsh", "Watson", "Wilson", "Young"
    ]
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
    firstNamesMale: [
      "Aditya", "Agung", "Ahmad", "Aldi", "Alif", "Andika", "Angga", "Ardi", "Arif", "Arya",
      "Bagas", "Bima", "Daffa", "Damar", "Danu", "Dimas", "Eka", "Fajar", "Farhan", "Fikri",
      "Galih", "Hadi", "Hanif", "Joko", "Lukman", "Naufal", "Rama", "Rangga", "Reza", "Rizky",
      "Satria", "Surya", "Taufik", "Wahyu", "Yoga", "Yusuf"
    ],
    firstNamesFemale: [
      "Alya", "Amara", "Anisa", "Anita", "Ayu", "Citra", "Dewi", "Diah", "Dian", "Eka",
      "Farah", "Hana", "Indah", "Intan", "Kartika", "Laras", "Lestari", "Maya", "Melati", "Nadia",
      "Nanda", "Nia", "Putri", "Rani", "Rara", "Ratih", "Sari", "Sinta", "Tiara", "Vina",
      "Wulan", "Yani", "Zahra"
    ],
    surnames: [
      "Adinata", "Adiwijaya", "Anggraini", "Anwar", "Bakti", "Cahyadi", "Cahyono", "Dharmawan", "Firmansyah", "Gunawan",
      "Haryanto", "Hartono", "Hidayat", "Ibrahim", "Iskandar", "Kurniawan", "Kusuma", "Lesmana", "Maulana", "Nugraha",
      "Permana", "Prasetyo", "Purnama", "Putra", "Putri", "Ramadhan", "Santoso", "Saputra", "Sari", "Setiawan",
      "Siregar", "Susanto", "Sutanto", "Syahputra", "Wijaya", "Wibowo", "Widodo", "Wulandari"
    ]
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
    firstNamesMale: [
      "Archer", "Beau", "Benjamin", "Billy", "Charlie", "Connor", "Cooper", "Darcy", "Daniel", "Ethan",
      "Finn", "Flynn", "Harry", "Harrison", "Henry", "Jack", "Jackson", "James", "Jasper", "Lachlan",
      "Leo", "Liam", "Lucas", "Max", "Noah", "Oliver", "Oscar", "Riley", "Samuel", "Thomas",
      "William", "Xavier"
    ],
    firstNamesFemale: [
      "Amelia", "Audrey", "Ava", "Bonnie", "Charlotte", "Chloe", "Daisy", "Ella", "Ellie", "Elsie",
      "Evie", "Georgia", "Grace", "Harper", "Hazel", "Holly", "Isla", "Ivy", "Lily", "Lola",
      "Lucy", "Matilda", "Mia", "Millie", "Olivia", "Paige", "Poppy", "Riley", "Ruby", "Sophie",
      "Summer", "Violet", "Willow", "Zoe"
    ],
    surnames: [
      "Anderson", "Baker", "Barnes", "Bennett", "Brooks", "Brown", "Campbell", "Carter", "Collins", "Cooper",
      "Cox", "Davis", "Edwards", "Ellis", "Evans", "Fisher", "Fletcher", "Ford", "Foster", "Gibson",
      "Graham", "Grant", "Gray", "Green", "Hall", "Harris", "Harrison", "Hayes", "Henderson", "Hill",
      "Holmes", "Hughes", "Jackson", "James", "Jenkins", "Johnson", "Jones", "Kelly", "King", "Knight",
      "Lewis", "Martin", "Mason", "Matthews", "McKenzie", "Miller", "Mitchell", "Morgan", "Morris", "Murray",
      "Parker", "Pearson", "Phillips", "Reid", "Richardson", "Roberts", "Robinson", "Rogers", "Ross", "Russell",
      "Scott", "Shaw", "Smith", "Stewart", "Taylor", "Thomas", "Thompson", "Turner", "Walker", "Walsh",
      "Ward", "Watson", "Webb", "White", "Williams", "Wilson", "Wood", "Wright", "Young"
    ]
  }
};

const RARE_NAMES_DATA = {
  feminine: [
    "Astrid", "Celeste", "Daphne", "Elara", "Esme", "Freya", "Iris", "Lilith", "Maeve", "Ophelia",
    "Raven", "Selene", "Vera"
  ],
  masculine: [
    "Adrian", "Cassian", "Dorian", "Elias", "Felix", "Gideon", "Julian", "Lucian", "Marcel", "Nikolai",
    "Silas", "Victor"
  ],
  neutral: [
    "Avery", "Blair", "Casey", "Eden", "Emery", "Jordan", "Morgan", "Quinn", "Reese", "Rowan",
    "Sage", "Taylor"
  ]
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
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}
window.getRandomElement = getRandomElement;

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

// Ring buffers to prevent excessive repetition
const RECENT_FULL_NAMES = [];
const RECENT_FIRST_NAMES = [];

/**
 * Generates a culturally authentic character name following the 7-step pipeline:
 * 1. Determine country.
 * 2. Select culturally appropriate name pool.
 * 3. Select first name using weighted randomization (including shared Rare Names with lower probability).
 * 4. Select surname where applicable (Indonesia supports mononyms, two-first names, or family components).
 * 5. Reject if exact full name appeared in the last 100 generated characters.
 * 6. Reject if first name appeared excessively recently (last 8 generated characters).
 * 7. Re-roll if rejected.
 */
function generateCharacterName(options = {}) {
  const countryKeys = Object.keys(COUNTRIES_DATA);
  const countryCode = options.countryCode || getRandomElement(countryKeys);
  const country = COUNTRIES_DATA[countryCode] || COUNTRIES_DATA.USA;
  const gender = options.gender || (Math.random() > 0.5 ? 'Male' : 'Female');

  let attempts = 0;
  while (attempts < 60) {
    attempts++;

    // Step 2 & 3: Select first name using weighted randomization
    // 7% chance for a rare name, otherwise country-specific pool
    let firstName = "";
    const useRare = Math.random() < 0.07;
    if (useRare) {
      if (gender === 'Male') {
        firstName = Math.random() < 0.75 
          ? getRandomElement(RARE_NAMES_DATA.masculine) 
          : getRandomElement(RARE_NAMES_DATA.neutral);
      } else if (gender === 'Female') {
        firstName = Math.random() < 0.75 
          ? getRandomElement(RARE_NAMES_DATA.feminine) 
          : getRandomElement(RARE_NAMES_DATA.neutral);
      } else {
        firstName = getRandomElement(RARE_NAMES_DATA.neutral);
      }
    } else {
      if (gender === 'Male') {
        firstName = getRandomElement(country.firstNamesMale);
      } else if (gender === 'Female') {
        firstName = getRandomElement(country.firstNamesFemale);
      } else {
        const union = [...country.firstNamesMale, ...country.firstNamesFemale];
        firstName = getRandomElement(union);
      }
    }

    // Step 4: Select surname where applicable
    let surname = "";
    if (countryCode === 'IDN') {
      // Indonesia specific formatting:
      // ~20% mononym (e.g. "Dewi")
      // ~30% two given names (e.g. "Putri Ayu")
      // ~50% given name + family component (e.g. "Bagas Prasetyo", "Rizky Maulana")
      const idnRoll = Math.random();
      if (idnRoll < 0.20) {
        surname = ""; // Mononym
      } else if (idnRoll < 0.50) {
        // Two given names
        const pool = gender === 'Male' ? country.firstNamesMale : country.firstNamesFemale;
        let secondGiven = getRandomElement(pool);
        if (secondGiven === firstName) {
          secondGiven = getRandomElement(pool);
        }
        surname = secondGiven;
      } else {
        surname = getRandomElement(country.surnames);
      }
    } else {
      surname = getRandomElement(country.surnames);
    }

    const fullName = surname ? `${firstName} ${surname}`.trim() : firstName.trim();

    // Step 5: Reject if exact full name appeared in last 100 generated characters
    if (RECENT_FULL_NAMES.includes(fullName)) {
      continue;
    }

    // Step 6: Reject if first name appeared excessively recently (last 8 characters)
    if (RECENT_FIRST_NAMES.includes(firstName)) {
      continue;
    }

    // Step 7: Approved! Register in recent history
    RECENT_FULL_NAMES.push(fullName);
    if (RECENT_FULL_NAMES.length > 100) {
      RECENT_FULL_NAMES.shift();
    }

    RECENT_FIRST_NAMES.push(firstName);
    if (RECENT_FIRST_NAMES.length > 8) {
      RECENT_FIRST_NAMES.shift();
    }

    return {
      first: firstName,
      surname: surname,
      fullName: fullName,
      countryCode: countryCode,
      gender: gender
    };
  }

  // Fallback if max attempts exceeded
  const fallbackFirst = gender === 'Male' ? getRandomElement(country.firstNamesMale) : getRandomElement(country.firstNamesFemale);
  const fallbackLast = countryCode === 'IDN' ? '' : getRandomElement(country.surnames);
  const fallbackFull = fallbackLast ? `${fallbackFirst} ${fallbackLast}` : fallbackFirst;
  return {
    first: fallbackFirst,
    surname: fallbackLast,
    fullName: fallbackFull,
    countryCode: countryCode,
    gender: gender
  };
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
  const gender = isMale ? "Male" : "Female";
  const nameObj = generateCharacterName({ countryCode, gender });
  const city = getRandomElement(country.cities);
  const origin = getRandomElement(MODERN_ORIGINS);
  const trait = getRandomElement(MODERN_TRAITS);

  return {
    name: nameObj.fullName,
    gender: gender,
    countryCode,
    countryName: country.name,
    city,
    origin,
    trait,
    age: 0,
    year: currentYear,
    money: country.startingMoney,
    shillings: Math.floor(Math.random() * 8) + 2,
    avatar: generateRandomAvatar({ gender, age: 0 }),
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
window.RARE_NAMES_DATA = RARE_NAMES_DATA;
window.MODERN_ORIGINS = MODERN_ORIGINS;
window.MODERN_TRAITS = MODERN_TRAITS;
window.generateCharacterName = generateCharacterName;
window.generateCharacter = generateCharacter;
window.generateRandomAvatar = generateRandomAvatar;
window.getRandomElement = getRandomElement;
window.formatMoney = formatMoney;
