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
    brokenUp: 0,
    // Phase 4: Family Dynamic Actions
    prayedTogether: 0,
    walkedEggshells: 0,
    presentedReport: 0,
    visitedGrandHaven: 0
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

// Household Atmosphere & Family Dynamics Catalog
const FAMILY_ATMOSPHERES = {
  loving: {
    id: 'loving',
    name: 'Loving & Nurturing',
    emoji: '🏡',
    desc: 'A warm sanctuary of patient laughter, hearty soups, and bedtime stories under thick wool blankets.',
    statEffects: { happiness: 12, sanity: 6, humanity: 6 },
    dadTrait: 'Devoted Father',
    momTrait: 'Gentle Caring Mother',
    siblingRoles: ['Devoted Companion', 'Playful Ally', 'Gentle Teammate'],
    grandRole: 'The Warm Hearthkeeper',
    parentMod: { strictness: 25, generosity: 75, relationshipBonus: 15, sobriety: 'sober', temperament: 'warm' },
    relRanges: { dad: [78, 92], mom: [82, 96], sib: [65, 90], grand: [80, 95] }
  },
  religious: {
    id: 'religious',
    name: 'Devout & Pious',
    emoji: '⛪',
    desc: 'Morning scriptures and bowed heads over plain porridge. The shadow of divine judgment watches every deed.',
    statEffects: { humanity: 10, smarts: 4, sanity: 2, happiness: -5 },
    dadTrait: 'Pious Churchwarden Father',
    momTrait: 'Devout Hymn-Singing Mother',
    siblingRoles: ['Pious Choir Singer', 'Secret Doubter', 'Tattling Moralist'],
    grandRole: 'The Scripture Patriarch',
    parentMod: { strictness: 65, generosity: 45, relationshipBonus: 0, sobriety: 'sober', temperament: 'pious', devotion: 85 },
    relRanges: { dad: [55, 72], mom: [60, 78], sib: [48, 70], grand: [70, 88] }
  },
  deeply_religious: {
    id: 'deeply_religious',
    name: 'Deeply Religious & Zealot',
    emoji: '🕯️',
    desc: 'Candlelit vigils before heavy iron crucifixes, weeping confessions, and an unyielding terror of eternal damnation.',
    statEffects: { humanity: 14, sanity: -6, happiness: -12, occult: -10 },
    dadTrait: 'Fanatical Preacher Father',
    momTrait: 'Strict Penitent Mother',
    siblingRoles: ['Zealous Devotee', 'Terrified Penitent', 'Secret Blasphemer'],
    grandRole: 'The Holy Inquisitor Grandparent',
    parentMod: { strictness: 88, generosity: 30, relationshipBonus: -10, sobriety: 'sober', temperament: 'fanatical', devotion: 98 },
    relRanges: { dad: [35, 55], mom: [45, 62], sib: [38, 60], grand: [60, 78] }
  },
  extremely_strict: {
    id: 'extremely_strict',
    name: 'Extremely Strict & Authoritarian',
    emoji: '📏',
    desc: 'Spotless floors, rigid curfews, razor-sharp discipline, and severe reprimands for the slightest imperfection.',
    statEffects: { smarts: 12, happiness: -14, sanity: -6 },
    dadTrait: 'Strict Disciplinarian Father',
    momTrait: 'Demanding Perfectionist Mother',
    siblingRoles: ['The Golden Child', 'The Sneaky Rebel', 'The Exhausted Scapegoat'],
    grandRole: 'The Unbending Traditionalist',
    parentMod: { strictness: 92, generosity: 35, relationshipBonus: -8, sobriety: 'sober', temperament: 'stern' },
    relRanges: { dad: [38, 58], mom: [50, 65], sib: [40, 62], grand: [55, 72] }
  },
  alcoholic: {
    id: 'alcoholic',
    name: 'Volatile & Alcoholic',
    emoji: '🍾',
    desc: 'Slammed corridor doors, slurred late-night shouts, shattered amber bottles, and walking on nervous eggshells.',
    statEffects: { happiness: -16, sanity: -12, occult: 6 },
    dadTrait: 'Volatile Alcoholic Father',
    momTrait: 'Weary Resigned Mother',
    siblingRoles: ['Trauma-Bonded Protector', 'Quiet Hider', 'Bitter Brawler'],
    grandRole: 'The Weary Relieved Haven',
    parentMod: { strictness: 35, generosity: 25, relationshipBonus: -15, sobriety: 'alcoholic', temperament: 'volatile' },
    relRanges: { dad: [22, 44], mom: [50, 68], sib: [50, 75], grand: [70, 88] }
  },
  eccentric_occult: {
    id: 'eccentric_occult',
    name: 'Occult & Peculiar',
    emoji: '🔮',
    desc: 'Dried belladonna wreaths, whispering floorboards, blackened grimoria, and ancestors who never truly left.',
    statEffects: { occult: 18, sanity: -10, humanity: -4 },
    dadTrait: 'Esoteric Relic Hunter Father',
    momTrait: 'Cryptic Herbalist Mother',
    siblingRoles: ['Shadow Whisperer', 'Effigy Carver', 'Bone Collector'],
    grandRole: 'The Cryptic Keeper of Old Bones',
    parentMod: { strictness: 50, generosity: 50, relationshipBonus: 5, sobriety: 'sober', temperament: 'esoteric', occultKnowledge: 85 },
    relRanges: { dad: [55, 72], mom: [58, 76], sib: [55, 74], grand: [68, 82] }
  },
  cold_detached: {
    id: 'cold_detached',
    name: 'Cold & Detached',
    emoji: '🧊',
    desc: 'Polite aristocratic silence, formal handshakes, and an unbridgeable emotional distance across empty banquet tables.',
    statEffects: { humanity: -8, smarts: 6, happiness: -10 },
    dadTrait: 'Aloof Aristocratic Father',
    momTrait: 'Distant Formal Mother',
    siblingRoles: ['Rival Heir', 'Silent Shadow', 'Estranged Sibling'],
    grandRole: 'The Stern Dynasty Matriarch',
    parentMod: { strictness: 60, generosity: 40, relationshipBonus: -20, sobriety: 'sober', temperament: 'aloof' },
    relRanges: { dad: [28, 45], mom: [32, 50], sib: [35, 55], grand: [60, 78] }
  },
  working_class: {
    id: 'working_class',
    name: 'Overburdened Working-Class',
    emoji: '🛠️',
    desc: 'Exhausted parents working midnight shifts, shared boots, scraped knuckles, and fierce family solidarity.',
    statEffects: { vitality: 6, smarts: 4, happiness: -4 },
    dadTrait: 'Exhausted Foundry Worker Father',
    momTrait: 'Hardworking Seamstress Mother',
    siblingRoles: ['Protective Older Sibling', 'Resourceful Scavenger', 'Shared-Bunk Sibling'],
    grandRole: 'The Tenement Storyteller',
    parentMod: { strictness: 45, generosity: 50, relationshipBonus: 8, sobriety: 'sober', temperament: 'tired_loving' },
    relRanges: { dad: [60, 78], mom: [65, 82], sib: [58, 76], grand: [72, 88] }
  }
};

// Household Atmosphere Milestones Catalog (Ages 1 to 17)
const FAMILY_MILESTONES = {
  loving: {
    age1: [
      "Turned 1 year old. You took your first wobbly steps across warm braided rugs, collapsing into your mother's laughing embrace.",
      "Turned 1 year old. You learned to pull yourself up by the armchair, babbling happily as your father clapped his hands in delight."
    ],
    toddler: [
      "Turned {age}. You spent peaceful afternoons building crooked block towers with your parents, rewarded with warm cups of milk and bedtime lullabies.",
      "Turned {age}. Learned to speak in eager, bright sentences, chattering endlessly while your mother baked fresh bread in the sunlit kitchen.",
      "Turned {age}. Tucked into bed under thick wool quilts while your father read stories of brave sailors until you drifted off."
    ],
    earlyChild: [
      "Turned {age}. Walked hand-in-hand to kindergarten, proudly carrying a painted lunch tin with little love notes tucked inside.",
      "Turned {age}. Came home with finger-paintings of your family; your parents proudly taped them to the center of the refrigerator.",
      "Turned {age}. Spent rainy autumn afternoons playing board games on the living room rug, wrapped in genuine warmth and comfort."
    ],
    elementary: [
      "Turned {age}. Attended municipal primary school in {city}. Your parents helped you with spelling words and celebrated every gold star on your papers.",
      "Turned {age}. Spent weekends riding a patched bicycle through the neighborhood park, knowing a warm family supper was waiting at dusk.",
      "Turned {age}. When you caught a nasty winter chest cold, your parents took turns sitting by your bed with hot herbal broth and soothing songs.",
      "Turned {age}. Your parents showed up to cheer for you at the school recital, their clapping loud and unmistakable in the auditorium."
    ],
    middleSchool: [
      "Turned {age}. Navigated middle school with steady encouragement at home; your parents listened patiently to your awkward worries over dinner.",
      "Turned {age}. Even as school hallways grew louder and rougher, home remained an unshakeable sanctuary of trust and kindness.",
      "Turned {age}. Your parents noticed your changing interests and surprised you with a thoughtful birthday gift from the town bookstore."
    ],
    adolescent: [
      "Turned {age}. High school brought new stresses, but honest talks around the evening table kept you grounded through teenage turbulence.",
      "Turned {age}. Your parents supported your emerging independence, treating your opinions with respect while leaving the porch light on for you.",
      "Turned {age}. Preparing for the threshold of adulthood with a deep sense of security, surrounded by steady parental affection."
    ]
  },
  religious: {
    age1: [
      "Turned 1 year old. You learned to fold your tiny hands before every meal while gentle church chorales played from the wooden radio console.",
      "Turned 1 year old. You took your first steps toward the mantelpiece, reaching toward the framed Sunday school print of the Good Shepherd."
    ],
    toddler: [
      "Turned {age}. Taught to bow your head and whisper grace before touching porridge, learning that angels record every good and bad deed.",
      "Turned {age}. Listened quietly on the hard church pew each Sunday, clutching a wooden sheep while the pastor preached about righteous living.",
      "Turned {age}. Recited your first simple bedtime prayer: 'If I should die before I wake, I pray the Lord my soul to take.'"
    ],
    earlyChild: [
      "Turned {age}. Attended church kindergarten; you practiced calligraphy by copying Bible verses onto ruled paper while rain tapped the stained glass.",
      "Turned {age}. Learned the catechism alongside other neighborhood children, wearing clean, modest clothes and polishing your Sunday shoes.",
      "Turned {age}. Sang along with the children's choir on choir practice evenings, the sweet harmonium music echoing through the cold chapel."
    ],
    elementary: [
      "Turned {age}. Attended municipal school in {city}, keeping scripture cards in your pencil box and trying to be an honest, quiet pupil.",
      "Turned {age}. Spent Saturdays sweeping church aisles and washing brass altar candleholders alongside your family.",
      "Turned {age}. Felt a quiet pang of unease whenever schoolmates swore or told vulgar jokes behind the gymnasium.",
      "Turned {age}. Endured seasonal fasts and meatless Fridays with quiet discipline, taught that sacrifice cleanses the mortal heart."
    ],
    middleSchool: [
      "Turned {age}. Reached confirmation age; spent long hours studying doctrinal texts under the rector's earnest supervision.",
      "Turned {age}. Felt increasingly torn between the modest piety of your household and the rebellious chatter of your public school peers.",
      "Turned {age}. Your parents gently confiscated a secular teen magazine you brought home, reminding you of the spiritual traps of vanity."
    ],
    adolescent: [
      "Turned {age}. High school tested your faith; you navigated peer pressure while carrying your family's quiet, pious expectations.",
      "Turned {age}. Volunteered at parish soup kitchens in {city}, observing the misery of the needy through the lens of duty and mercy.",
      "Turned {age}. Stood before the congregation at youth fellowship, quietly wondering how much of your faith was your own and how much was habit."
    ]
  },
  deeply_religious: {
    age1: [
      "Turned 1 year old. You crawled toward the heavy cast-iron crucifix by the hearth, tasting cold brass while evening penitence prayers droned overhead.",
      "Turned 1 year old. You took your first steps in the flickering glow of tallow votives, startled into crying by your father's booming prayers."
    ],
    toddler: [
      "Turned {age}. Taught to kneel on bare floorboards until your knees throbbed, warned that wicked children are carried off into eternal fire.",
      "Turned {age}. Terrified of the dark in your bedroom; your mother burned bitter holy sage and sprinkled salt across your windowsill to repel demons.",
      "Turned {age}. Cried from nightmares of horned shadows, only to be made to recite the Seven Penitential Psalms before being allowed back in bed."
    ],
    earlyChild: [
      "Turned {age}. Kept away from secular playmates; spent your days copying warnings of damnation and hearing graphic descriptions of purgatory.",
      "Turned {age}. Accused of bearing sinful pride when you smiled into a mirror; the glass was turned to the wall and your toys confiscated for a week.",
      "Turned {age}. Attended midnight vigils with your parents, kneeling in freezing chapel drafts while elders wept aloud for the sins of the city."
    ],
    elementary: [
      "Turned {age}. Sent to school in austere, buttoned-to-the-throat garments; classmates mocked you as 'the church creep' behind the bicycle shed.",
      "Turned {age}. Scrutinized every private thought for mortal sin, terrified that an unconfessed stray thought would damn you if you died in your sleep.",
      "Turned {age}. When you brought home a library fairy tale book, your father threw it into the woodstove, proclaiming it devil's deceit.",
      "Turned {age}. Endured strict disciplinary fasts on bread and water whenever your grades slipped below perfection or your eyes wandered during sermons."
    ],
    middleSchool: [
      "Turned {age}. The onset of puberty brought intense spiritual crisis; every natural impulse was treated as demonic temptation requiring vigils.",
      "Turned {age}. Forced to confess your minor infractions before the family elders every Sunday evening, sobbing into cold floorboards.",
      "Turned {age}. Concealed a battered walkman and secular cassettes under a loose floorboard beneath your bed, heart pounding at every floor creak."
    ],
    adolescent: [
      "Turned {age}. Suffocating under zealous surveillance; mail opened, room searched, and any sign of independent thought labeled apostasy.",
      "Turned {age}. High school became a battlefield between the modern world outside and the apocalyptic dread dominating your home.",
      "Turned {age}. Standing on the brink of adulthood, torn between genuine dread of eternal hellfire and a desperate hunger to break free."
    ]
  },
  extremely_strict: {
    age1: [
      "Turned 1 year old. You were placed on a rigid schedule for standing drills; your knees were dusted clean the moment you touched the rug.",
      "Turned 1 year old. Crying was met with stern, folded arms and silence; you quickly learned that tears yielded no comfort in this house."
    ],
    toddler: [
      "Turned {age}. Toys were limited to strictly fifteen minutes of educational play per day, after which each item had to be aligned in its exact drawer.",
      "Turned {age}. Subjected to daily posture checks at the dinner table; speaking without permission earned a sharp tap on the knuckles with a wooden ruler.",
      "Turned {age}. Trained to sit still in total silence for half-hour intervals, your small hands folded rigidly in your lap."
    ],
    earlyChild: [
      "Turned {age}. Drilled on arithmetic tables and cursive handwriting before breakfast; mistakes were erased and rewritten until the paper wore thin.",
      "Turned {age}. Kindergarten was treated as a competitive arena; receiving a 'satisfactory' rather than 'excellent' resulted in weekend confinement.",
      "Turned {age}. Your bedroom was inspected daily with white gloves; bed corners had to be folded with military hospital corners."
    ],
    elementary: [
      "Turned {age}. Attended municipal school in {city} under intense parental scrutiny; report cards with a 93% average brought stern lectures on complacency.",
      "Turned {age}. Scheduled every hour from 6:00 AM to 9:00 PM: chores, violin practice, advanced mathematics, and zero idle leisure.",
      "Turned {age}. Grounded for two weeks after a teacher noted you were 'daydreaming out the window' during geography class.",
      "Turned {age}. Learned to walk with silent, measured steps, hiding any sign of exhaustion or emotional weakness behind a disciplined mask."
    ],
    middleSchool: [
      "Turned {age}. Curfews were enforced down to the minute; arriving home at 5:04 instead of 5:00 meant losing door privileges for a month.",
      "Turned {age}. Your bedroom door had its lock removed for surprise inspections; diaries were forbidden and personal notes confiscated.",
      "Turned {age}. Constantly compared to superior peers, family cousins, and academic prodigies, reinforcing that your best was never enough."
    ],
    adolescent: [
      "Turned {age}. High school was an exhausting marathon of college entrance prep, private tutors, and cold parental demands for perfection.",
      "Turned {age}. Secretly rebelled in subtle ways—studying forbidden books under blankets with a penlight while maintaining a spotless facade.",
      "Turned {age}. Reached your senior year with high academic standing, but with nerves wound as tight as piano wire under parental pressure."
    ]
  },
  alcoholic: {
    age1: [
      "Turned 1 year old. You learned to crawl with cautious, silent instincts, instinctively steering clear of overturned boots and broken amber glass under the table.",
      "Turned 1 year old. You learned that loud crying caused angry shouting; you developed a quiet, wide-eyed stare from your wooden crib."
    ],
    toddler: [
      "Turned {age}. Learned to interpret the sound of keys rattling in the front door latch—heavy, fumbling footsteps meant run to the bedroom closet.",
      "Turned {age}. Huddled under sofa cushions with your siblings, whispering quiet nonsense to drown out violent shouting and crashing ceramics.",
      "Turned {age}. Wandered into the kitchen in the morning to find spilled whiskey, stale cigarette butts, and an empty breadbox."
    ],
    earlyChild: [
      "Turned {age}. Came to kindergarten in stained, mismatched clothes; you learned to lie smoothly to teachers about where your bruises came from.",
      "Turned {age}. Learned how to pour water into liquor bottles to dilute them, hoping the adults wouldn't notice and the screaming would end earlier.",
      "Turned {age}. Spent evenings watching shadows flicker on the ceiling while drunken arguments vibrated through the thin apartment drywall."
    ],
    elementary: [
      "Turned {age}. Attended municipal primary school in {city} with a rumbling stomach, hoarding cafeteria crackers in your jacket pockets.",
      "Turned {age}. Parent-teacher night came and went; you sat on the school steps until the custodian locked the doors, your parents passed out at home.",
      "Turned {age}. Stepped over an unconscious parent sprawled across the hallway carpet to make yourself a dinner of dry soda crackers and tap water.",
      "Turned {age}. Hid your small savings in the lining of a winter boot, knowing loose money on the dresser disappeared into the corner tavern."
    ],
    middleSchool: [
      "Turned {age}. The role reversal hardened: you managed utility bills, hid car keys from drunken hands, and kept younger siblings fed.",
      "Turned {age}. Neighbors called the police during a violent midnight brawl; you sat on the curb in the rain while patrol sirens flashed red and blue.",
      "Turned {age}. Developed an eerie sixth sense for slurred speech, predicting whether the night would end in weeping remorse or broken furniture."
    ],
    adolescent: [
      "Turned {age}. Worked odd after-school errands just to buy your own groceries and school clothes, avoiding the house until late at night.",
      "Turned {age}. Had to physically pull a drunken parent out of the street gutter behind the tavern, enduring slurred insults all the way home.",
      "Turned {age}. Spent your high school years counting the days until your eighteenth birthday, harboring deep scars and hypervigilant survival instincts."
    ]
  },
  eccentric_occult: {
    age1: [
      "Turned 1 year old. You pulled yourself up against a heavy claw-footed bookcase, fixated on dark silhouettes dancing across the ceiling that had no cast shadows.",
      "Turned 1 year old. Your nursery was draped with dried belladonna and rowan twigs; you learned to babble to empty corners that whispered back."
    ],
    toddler: [
      "Turned {age}. Played with carved bone runes and dried ravens' feet on the oriental rug, laughing when candle flames bent without any draft.",
      "Turned {age}. Sung strange, ancient nursery rhymes in dead tongues that made the house cats freeze and stare with dilated pupils.",
      "Turned {age}. Wandered into the parlor during an evening séance; watched pale vapor coil above the velvet table before your mother carried you away."
    ],
    earlyChild: [
      "Turned {age}. Drew intricate spiral sigils in kindergarten chalk that unsettled your teachers; they asked your parents about your 'unusual home life.'",
      "Turned {age}. Learned that certain family heirlooms in locked glass cabinets must never be touched, especially during the new moon.",
      "Turned {age}. Found dead starlings arranged in a geometric circle on your bedroom windowsill; your mother nodded approvingly at the omen."
    ],
    elementary: [
      "Turned {age}. Attended municipal school in {city}, wearing a talisman of blackened pewter beneath your shirt that grew warm during storms.",
      "Turned {age}. Classmates avoided your house on Halloween, whispering that strange violet lights flickered in your attic past midnight.",
      "Turned {age}. Helped your family harvest nightshade and wormwood from the overgrown garden by the light of the waning crescent.",
      "Turned {age}. Caught glimpses of figures standing in your hallway at night who matched the faded sepia portraits of ancestors who died in 1892."
    ],
    middleSchool: [
      "Turned {age}. Began formal instruction in family occult records; deciphering cursive notes on astrological alignments and spirit invocations.",
      "Turned {age}. The house seemed to breathe during autumn gales; you learned to recognize when the veil between realms was dangerously thin.",
      "Turned {age}. Accidentally spoke a word of power during a school argument; the classroom fluorescent bulb exploded in a shower of sparks."
    ],
    adolescent: [
      "Turned {age}. Permitted into the cellar sanctum for the winter solstice rites, smelling myrrh, sulfur, and ancient damp parchment.",
      "Turned {age}. High school peers thought you were brooding and gothic, completely unaware that the shadows in your bedroom truly had voices.",
      "Turned {age}. Approaching adulthood with deep occult sensitivity, realizing your lineage is bound to forces far older and darker than the city."
    ]
  },
  cold_detached: {
    age1: [
      "Turned 1 year old. You learned to crawl across vast, echoing parquet floorboards beneath towering ancestral portraits that never looked down.",
      "Turned 1 year old. You were cared for primarily by hired nursery maids; parental contact was limited to a polite nod before evening dinner."
    ],
    toddler: [
      "Turned {age}. Played in solitary silence in an immaculate nursery, arranging silver toy soldiers according to strict military protocol.",
      "Turned {age}. Learned that emotional displays—crying, shouting, hugging—were considered vulgar and caused adults to leave the room.",
      "Turned {age}. Meals were served on porcelain plates with linen napkins; you learned to use fish forks correctly before you could tie your shoes."
    ],
    earlyChild: [
      "Turned {age}. Driven to an elite preparatory academy in a polished town car; polite handshakes replaced hugs at the school gate.",
      "Turned {age}. Received expensive, mechanical imported toys for your birthday, accompanied by a typewritten card signed with your parents' initials.",
      "Turned {age}. Wandered through the echoing corridors of your large home, speaking to your own reflection in tall gilded pier glasses."
    ],
    elementary: [
      "Turned {age}. Attended prestigious academy classes in {city}. Peers kept their distance, viewing you as aristocratic, aloof, and untouchable.",
      "Turned {age}. Family dinners were eaten in ceremonial silence beneath crystal chandeliers; questions were answered in terse, measured sentences.",
      "Turned {age}. When you fell from a stone terrace and broke your arm, your parents sent for the private surgeon without ever embracing you.",
      "Turned {age}. Awarded academic medals at school; your father examined the certificate, nodded once without smiling, and filed it away."
    ],
    middleSchool: [
      "Turned {age}. Educated on family trust funds, lineage pedigrees, and social standing; taught that personal feelings are dangerous liabilities.",
      "Turned {age}. Communication with parents dwindled to weekly formal interviews and written itineraries left on the hall console table.",
      "Turned {age}. Felt a hollow chill in your chest watching common families laughing together on the municipal tram."
    ],
    adolescent: [
      "Turned {age}. Suffocating under aristocratic expectations; groomed for prestigious professions while your emotional life froze over.",
      "Turned {age}. High school debates and boarding school prep dominated your days; you learned to hide all vulnerability behind polished sarcasm.",
      "Turned {age}. Standing on the brink of adulthood with immense pedigree and refined composure, but utterly isolated from human warmth."
    ]
  },
  working_class: {
    age1: [
      "Turned 1 year old. You toddled around your father's soot-covered work boots by the hissing copper radiator, chewing on a clean wooden bobbin.",
      "Turned 1 year old. Carried on your mother's hip while she scrubbed laundry, lulled to sleep by the rhythm of the washboard and factory whistles."
    ],
    toddler: [
      "Turned {age}. Played with tin cans and wooden scrap blocks beneath the kitchen table while parents counted coins into rent envelopes.",
      "Turned {age}. Shared a narrow mattress with your siblings, kept warm by a heavy patchwork quilt stitched from old wool coats.",
      "Turned {age}. Your father made shadow puppets against the peeling wallpaper with his calloused, grease-stained hands to make you laugh."
    ],
    earlyChild: [
      "Turned {age}. Started municipal kindergarten in hand-me-down shoes with cardboard soles, proud of a pencil case your brother passed down.",
      "Turned {age}. Learned early that money doesn't grow on trees; you never asked for candy in shop windows, knowing how hard your parents worked.",
      "Turned {age}. Sat by the open oven door on freezing winter evenings to stay warm while parents worked overtime evening shifts."
    ],
    elementary: [
      "Turned {age}. Attended neighborhood primary school in {city}, walking through slush in leaky rubber boots with your older sibling holding your hand.",
      "Turned {age}. Defended your younger sibling from neighborhood bullies behind the tenement coal bins, earning bruised knuckles and pride.",
      "Turned {age}. Family meals were simple—potato soup, cabbage, and day-old bakery bread—eaten with loud chatter and fierce solidarity.",
      "Turned {age}. Collected discarded copper wire and glass soda bottles after school to turn in for deposit pennies to buy school notebooks."
    ],
    middleSchool: [
      "Turned {age}. Took on odd neighborhood jobs: delivering morning papers in freezing drizzle or sweeping sawdust in the local repair garage.",
      "Turned {age}. Watched your parents' backs bend and coughs deepen from decades of factory shifts, feeling a burning urge to help provide.",
      "Turned {age}. Even when the electricity was shut off for three days, your family gathered around tallow candles to share stories and laughs."
    ],
    adolescent: [
      "Turned {age}. Balanced high school classes with evening warehouse shifts; coming home exhausted to slip your pay into the family grocery jar.",
      "Turned {age}. Faced down class snobbery from wealthier students, holding your head high in patched coats and worn work boots.",
      "Turned {age}. Nearing graduation with grit, resilience, and calloused hands, ready to fight for every scrap of survival in {city}."
    ]
  }
};

// Household Living Dynamics Catalog (Under Age 18)
const FAMILY_HOME_DYNAMICS = {
  loving: [
    "A warm pot of chicken and vegetable stew simmered on the stove; your parents tucked you in with stories on stormy winter nights.",
    "Sunday mornings were filled with the aroma of freshly toasted bread and easy family laughter around the kitchen table.",
    "Chores were shared with good humor; your parents rewarded your help with hot cocoa and movie nights.",
    "Your home was a cozy sanctuary where your bedroom door could stay open and you always felt safe from the outside world.",
    "Quiet evenings spent together by the living room hearth, listening to music while rain tapped gently against the windows."
  ],
  religious: [
    "Modest, peaceful meals preceded by sincere blessings. Saturday evenings were reserved for polishing church shoes and pressing Sunday clothes.",
    "The wooden radio played sacred choir hymns each morning while your family ate plain oatmeal in reverent silence.",
    "Household chores were performed diligently as an offering of service; scripture cards hung framed in every hallway.",
    "Evenings concluded with quiet family prayer around the table, thanking Providence for daily bread and protection from wickedness.",
    "Fasting days and religious feast days dictated the kitchen pantry, keeping the household rhythm steady and disciplined."
  ],
  deeply_religious: [
    "Lenten fasts, hours of kneeling on bare floorboards, and austere broth marked the household routine. The television remained strictly locked away.",
    "The scent of bitter frankincense and burning wax permeated the hallway; mirrors remained covered on penitential Fridays.",
    "Dinners were accompanied by readings from apocalyptic scriptures, reminding everyone that judgment could fall at any hour.",
    "Any noise or laughter after 8:00 PM was reprimanded as idle folly; you learned to move in ghostly, penitent silence.",
    "Holy water fonts were replenished at every doorway; you crossed yourself before entering every room to ward off wandering spirits."
  ],
  extremely_strict: [
    "Spotless floorboards, white-glove dust inspections, and a daily study schedule pinned to your bedroom door. Any infraction cost weekend privileges.",
    "Meals were served promptly at 6:30 PM; tardiness by even thirty seconds meant going to bed without supper.",
    "Personal belongings had assigned positions on shelves; unmade beds or scuffed shoes resulted in demerit points and extra chores.",
    "A silent, regimented household where footsteps were monitored and leisure was considered a moral deficiency.",
    "Every household chore was graded like an exam; your mother re-scrubbed the floorboards if a single corner showed water streaks."
  ],
  alcoholic: [
    "You navigated the hallway on nervous tiptoes, tracking how many empty gin bottles accumulated in the bins and keeping spare bread hidden in your dresser.",
    "Evenings were a lottery of moods: some nights filled with weeping declarations of love, others with slammed doors and shattered glassware.",
    "The sour reek of stale beer and stale smoke clung to the curtains; you learned to cook simple meals alone when adults were incapacitated.",
    "Sudden late-night shouting jolted you awake; you stayed frozen beneath your blanket until the floorboards stopped creaking.",
    "You learned to recognize the rattle of the tavern ice bucket and stayed out of sight until the inevitable blackout settled over the apartment."
  ],
  eccentric_occult: [
    "Dried mugwort and yarrow hung from the kitchen beams. You learned to ignore the rhythmic tapping beneath the pantry floorboards after midnight.",
    "Odd visitors in dark overcoats arrived for late-night parlor consultations; the scent of sulfur and old leather lingered until dawn.",
    "Certain cabinets were sealed with wax seals and red cord; the household cats refused to enter the east corridor.",
    "Meals featured peculiar bitter herbs from the root cellar; you learned to check your salt circles whenever autumn gales blew.",
    "Ancestral brass bells jingled on doorframes when drafts blew through; your family treated shadows in the parlor as familiar guests."
  ],
  cold_detached: [
    "Catered dinners were eaten in ceremonial silence across the polished mahogany table; family updates were communicated through typed memos on the marble hall stand.",
    "The grand rooms were spotless, drafty, and devoid of clutter; emotional warmth was treated as an embarrassing lack of composure.",
    "Household staff attended to laundry and meals with polite efficiency, while your parents remained preoccupied with social calendars and investments.",
    "You spent hours in the library or music room in total solitude, the ticking of the antique grandfather clock the only company.",
    "A polite, chilling tranquility filled the high-ceilinged rooms; no voices were ever raised, and no hugs were ever given."
  ],
  working_class: [
    "Heavy sweaters worn indoors to save on heating oil; dinners of boiled potatoes and sausage shared around the humming radiator with genuine camaraderie.",
    "Factory whistles marked the changing of shifts; your mother mended worn socks by lamplight while your father rested swollen feet.",
    "The small kitchen was always bustling, crowded, and loud with jokes, shared gripes about landlords, and mutual loyalty.",
    "Money was tight and envelopes for rent and power sat on the mantel, but the family always found a way to share what little food was on the table.",
    "Washing hung drying across the living room lines, smelling of cheap lye soap and steam, while family stories filled the evening."
  ]
};

// Kin Inactive Fallback Vignettes (When no family tragedy occurs)
const FAMILY_KIN_VIGNETTES = {
  loving: [
    "Your family shared warm, peaceful evening meals beneath the kitchen light.",
    "A tranquil, comforting year passed within your close-knit family circle.",
    "Gentle household routines and shared laughter kept family bonds strong and reassuring."
  ],
  religious: [
    "The household observed church holy days and weekly services in quiet devotion, free from scandal.",
    "A quiet, devout year passed with regular Sunday sermons and modest home routines.",
    "Your family went about their parish duties and neighborhood devotions in peaceful harmony."
  ],
  deeply_religious: [
    "The household observed all fasts and holy days in somber devotion, guarding against the corruptions of the city.",
    "No demons breached the threshold this year; penitent prayers kept the home in stern spiritual order.",
    "A tense, prayerful year elapsed beneath the unblinking watch of the parlor crucifix."
  ],
  extremely_strict: [
    "Conduct ledgers remained clean; chores and inspections passed without red demerits.",
    "The year proceeded according to strict schedule with zero breaches of household discipline.",
    "A regimented, quiet year elapsed within your family home; rules were followed to the letter."
  ],
  alcoholic: [
    "A relatively quiet year at home—fewer slammed doors, though the sour tang of spirits still lingered in the hallway.",
    "Tensions simmered beneath the surface, but no major police visits disturbed the household this year.",
    "Muted arguments and uneasy truces passed through the apartment; everyone kept to their own corners."
  ],
  eccentric_occult: [
    "The floorboards creaked in cadence with the autumn winds, but no malevolent entities disturbed the household rites.",
    "Ancestral spirits remained calm in the shadows; the family grimoria remained undisturbed on their stands.",
    "A quiet year of occult study and herbal drying elapsed under pale moonlight."
  ],
  cold_detached: [
    "Punctual decorum and polite emotional distance governed the household without disruption.",
    "An uneventful year passed behind tall wrought-iron gates; social obligations were fulfilled with aristocratic precision.",
    "Polite silence prevailed through the high-ceilinged corridors of your family estate."
  ],
  working_class: [
    "Both shifts ran steadily without factory layoffs; your family pulled through the year with scraped elbows and stubborn grit.",
    "Bills were paid just in the nick of time; the household held together through honest labor.",
    "Tired but resilient, your family weathered the year together around the humming kitchen radiator."
  ]
};

function getFamilyMilestone(character) {
  if (!character) return null;
  const atmoId = (character.kin && character.kin.atmosphere && character.kin.atmosphere.id) || 'loving';
  const atmoPools = (FAMILY_MILESTONES && FAMILY_MILESTONES[atmoId]) || FAMILY_MILESTONES.loving;
  if (!atmoPools) return null;

  let pool = null;
  if (character.age === 1) {
    pool = atmoPools.age1;
  } else if (character.age <= 3) {
    pool = atmoPools.toddler;
  } else if (character.age <= 5) {
    pool = atmoPools.earlyChild;
  } else if (character.age <= 10) {
    pool = atmoPools.elementary;
  } else if (character.age <= 13) {
    pool = atmoPools.middleSchool;
  } else if (character.age <= 17) {
    pool = atmoPools.adolescent;
  }

  if (!pool || pool.length === 0) return null;
  const raw = window.getRandomElement(pool);
  const city = character.city || 'the city';
  return raw.replace(/\{age\}/g, character.age).replace(/\{city\}/g, city);
}

function getFamilyHomeDynamic(character) {
  if (!character) return null;
  const atmoId = (character.kin && character.kin.atmosphere && character.kin.atmosphere.id) || 'loving';
  const list = (FAMILY_HOME_DYNAMICS && FAMILY_HOME_DYNAMICS[atmoId]) || FAMILY_HOME_DYNAMICS.loving;
  if (!list || list.length === 0) return null;
  const raw = window.getRandomElement(list);
  const city = character.city || 'the city';
  return raw.replace(/\{city\}/g, city);
}

function getFamilyKinVignette(character) {
  if (!character) return null;
  const atmoId = (character.kin && character.kin.atmosphere && character.kin.atmosphere.id) || 'loving';
  const list = (FAMILY_KIN_VIGNETTES && FAMILY_KIN_VIGNETTES[atmoId]) || FAMILY_KIN_VIGNETTES.loving;
  if (!list || list.length === 0) return null;
  const raw = window.getRandomElement(list);
  const city = character.city || 'the city';
  return raw.replace(/\{city\}/g, city);
}

function generateFamily(character) {
  const countryCode = character.countryCode || "USA";
  const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  // Weighted roll for family atmosphere
  const atmoKeys = [
    'loving', 'loving',
    'religious', 'religious',
    'deeply_religious',
    'extremely_strict', 'extremely_strict',
    'alcoholic',
    'eccentric_occult',
    'cold_detached',
    'working_class'
  ];
  const chosenAtmoKey = window.getRandomElement(atmoKeys);
  const atmosphere = { ...FAMILY_ATMOSPHERES[chosenAtmoKey] };

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

  const rollRelRange = (range, fallbackMin, fallbackMax) => {
    if (range && Array.isArray(range) && range.length >= 2) {
      return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }
    return Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) + fallbackMin;
  };

  const dadStrictness = Math.min(100, Math.max(10, Math.floor(Math.random() * 20) + atmosphere.parentMod.strictness));
  const momStrictness = Math.min(100, Math.max(10, Math.floor(Math.random() * 20) + Math.round(atmosphere.parentMod.strictness * 0.9)));
  const dadGenerosity = Math.min(100, Math.max(10, Math.floor(Math.random() * 20) + atmosphere.parentMod.generosity));
  const momGenerosity = Math.min(100, Math.max(10, Math.floor(Math.random() * 20) + Math.round(atmosphere.parentMod.generosity * 1.05)));
  const dadRel = atmosphere.relRanges ? rollRelRange(atmosphere.relRanges.dad, 60, 85) : Math.min(100, Math.max(25, Math.floor(Math.random() * 20) + 70 + atmosphere.parentMod.relationshipBonus));
  const momRel = atmosphere.relRanges ? rollRelRange(atmosphere.relRanges.mom, 65, 90) : Math.min(100, Math.max(25, Math.floor(Math.random() * 20) + 75 + atmosphere.parentMod.relationshipBonus));

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
      relationship: dadRel,
      generosity: dadGenerosity,
      strictness: dadStrictness,
      sanity: Math.floor(Math.random() * 30) + 65,
      temperament: atmosphere.parentMod.temperament,
      sobriety: atmosphere.parentMod.sobriety || 'sober',
      dynamicTrait: atmosphere.dadTrait,
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
      relationship: momRel,
      generosity: momGenerosity,
      strictness: momStrictness,
      sanity: Math.floor(Math.random() * 30) + 70,
      temperament: atmosphere.parentMod.temperament,
      sobriety: atmosphere.parentMod.sobriety || 'sober',
      dynamicTrait: atmosphere.momTrait,
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

    const sibRole = window.getRandomElement(atmosphere.siblingRoles);
    const baseSibRel = atmosphere.relRanges ? rollRelRange(atmosphere.relRanges.sib, 50, 75) : (Math.floor(Math.random() * 40) + 55);
    let sibRel = baseSibRel;
    if (sibRole === 'The Golden Child' || sibRole === 'Rival Heir') sibRel = Math.max(15, sibRel - 16);
    else if (sibRole === 'Trauma-Bonded Protector' || sibRole === 'Devoted Companion') sibRel = Math.min(100, sibRel + 14);

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
      relationship: sibRel,
      dynamicTrait: sibRole,
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
      relationship: atmosphere.relRanges ? rollRelRange(atmosphere.relRanges.grand, 70, 90) : (Math.floor(Math.random() * 20) + 75),
      generosity: Math.floor(Math.random() * 30) + 65,
      pensionUSD: Math.floor(Math.random() * 15000) + 20000,
      salaryUSD: 0,
      incomeTier: 'comfortable',
      strictness: Math.floor(Math.random() * 35) + 15,
      sanity: Math.floor(Math.random() * 30) + 60,
      dynamicTrait: atmosphere.grandRole,
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
    atmosphere,
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';
  const isParent = person.role === 'Father' || person.role === 'Mother';
  const isSibling = person.role.includes('Brother') || person.role.includes('Sister');
  const isGrand = person.role.includes('Grand');

  let message = "";
  let effects = { happiness: +5, relationship: +relGain };

  if (isFamily) {
    if (atmo === 'cold_detached') {
      if (isParent) {
        const coldActs = [
          `sat in complete silence in the drafty study while ${person.name} reviewed bond ledgers without uttering a single word.`,
          `accompanied ${person.name} on a stiff, formal promenade through the manicured city park, walking two paces behind.`,
          `ate a sterile, perfectly portioned dinner across the long mahogany table with ${person.name} in absolute quiet.`
        ];
        message = `You ${window.getRandomElement(coldActs)} (+${relGain}% Closeness, +Smarts, -3% Happiness).`;
        effects = { relationship: Math.max(1, Math.round(relGain * 0.6)), smarts: +4, happiness: -3 };
      } else if (isSibling) {
        message = `You studied side-by-side with ${person.name} at opposite ends of the cherrywood desk in immaculate, polite silence (+${relGain}% Closeness, +Smarts).`;
        effects = { relationship: Math.max(1, Math.round(relGain * 0.7)), smarts: +4, happiness: -2 };
      } else if (isGrand) {
        message = `You sat stiffly on velvet antique settees while ${person.name} lectured you on dynastic decorum and ancestral honor (+${relGain}% Closeness, +Smarts).`;
        effects = { relationship: relGain, smarts: +4, happiness: -1 };
      }
    } else if (atmo === 'deeply_religious') {
      if (isParent) {
        const piousActs = [
          `spent the afternoon kneeling on cold hardwood polishing church candelabras and reciting penitent psalms with ${person.name}.`,
          `accompanied ${person.name} to distribute austere charity bread at the parish mission in the freezing drizzle.`,
          `sat beside ${person.name} while they copied verses of divine judgment into the family ledger by candlelight.`
        ];
        message = `You ${window.getRandomElement(piousActs)} (+${relGain}% Closeness, +Humanity, -4% Happiness).`;
        effects = { relationship: relGain, humanity: +5, sanity: -2, happiness: -4 };
      } else if (isSibling) {
        message = `You whispered quiet catechism verses under the stairwell with ${person.name}, dreading evening inspection (+${relGain}% Closeness, +Humanity).`;
        effects = { relationship: relGain, humanity: +4, sanity: -1 };
      } else if (isGrand) {
        message = `You sat by the heavy iron stove while ${person.name} read terrifying sermons about brimstone and the unfaithful (+${relGain}% Closeness, -3% Sanity, +Humanity).`;
        effects = { relationship: relGain, humanity: +4, sanity: -3 };
      }
    } else if (atmo === 'extremely_strict') {
      if (isParent) {
        const strictActs = [
          `sat under a bright desk lamp while ${person.name} audited your homework ledgers with a red grease pencil.`,
          `drilled flashcards, mental arithmetic, and Latin grammar for two straight hours under ${person.name}'s watchful scowl.`,
          `stood at attention while ${person.name} inspected your bed corners, closet hangers, and polished shoes.`
        ];
        message = `You ${window.getRandomElement(strictActs)} (+${relGain}% Closeness, +Smarts, -5% Happiness).`;
        effects = { relationship: Math.round(relGain * 0.8), smarts: +6, happiness: -5 };
      } else if (isSibling) {
        message = `You raced through mandatory household inspections with ${person.name}, both terrified of failing room check (+${relGain}% Closeness, +Smarts).`;
        effects = { relationship: Math.round(relGain * 0.8), smarts: +4, happiness: -2 };
      } else if (isGrand) {
        message = `You stood at attention while ${person.name} inspected your posture, diction, and shoe polish (+${relGain}% Closeness, +Smarts).`;
        effects = { relationship: relGain, smarts: +4 };
      }
    } else if (atmo === 'alcoholic') {
      if (isParent) {
        const alcActs = [
          `walked to the corner grocery store with ${person.name} while they leaned heavily on your shoulder and slurred old regrets.`,
          `helped ${person.name} find their mislaid keys and shoes in the cluttered living room before they lost their temper.`,
          `sat in the dim kitchen boiling black coffee while ${person.name} stared out at the rainy alleyway in sullen silence.`
        ];
        message = `You ${window.getRandomElement(alcActs)} (+${relGain}% Closeness, -4% Happiness, +Smarts).`;
        effects = { relationship: relGain, smarts: +3, happiness: -4, sanity: -2 };
      } else if (isSibling) {
        message = `You built a pillow fort in the back of the bedroom closet with ${person.name}, hiding until the shouting downstairs quieted down (+${relGain}% Closeness, +Humanity, +Sanity).`;
        effects = { relationship: relGain, humanity: +5, sanity: +3 };
      } else if (isGrand) {
        message = `You sat on the front porch with ${person.name}, who gave you fresh peppermint candies and told you not to worry about home (+${relGain}% Closeness, +Happiness, +Sanity).`;
        effects = { relationship: relGain, happiness: +8, sanity: +4 };
      }
    } else if (atmo === 'eccentric_occult') {
      if (isParent) {
        const occActs = [
          `helped ${person.name} gather strange nocturnal fungi and dried belladonna leaves in the foggy woods.`,
          `sat cross-legged on the floorboards with ${person.name}, deciphering copper engravings in an uncataloged grimoire.`,
          `assisted ${person.name} in blending sweet smelling grave-dust with lavender oils over the gas stove.`
        ];
        message = `You ${window.getRandomElement(occActs)} (+${relGain}% Closeness, +Occult, +Smarts).`;
        effects = { relationship: relGain, occult: +5, smarts: +3, sanity: -1 };
      } else if (isSibling) {
        message = `You carved protective runes into chalk pebbles near the creek with ${person.name} (+${relGain}% Closeness, +Occult).`;
        effects = { relationship: relGain, occult: +4, happiness: +3 };
      } else if (isGrand) {
        message = `You drank bitter wormwood tea with ${person.name} while inspecting antique bone-handled cutlery (+${relGain}% Closeness, +Occult).`;
        effects = { relationship: relGain, occult: +4, sanity: +2 };
      }
    } else if (atmo === 'religious') {
      if (isParent) {
        message = `You helped ${person.name} prepare baked goods for the parish mission, humming peaceful hymns together (+${relGain}% Closeness, +Humanity, +Happiness).`;
        effects = { relationship: relGain, humanity: +4, happiness: +4 };
      } else if (isSibling) {
        message = `You practiced choir hymns under the porch with ${person.name}, sharing sweet butterscotch drops (+${relGain}% Closeness, +Happiness).`;
        effects = { relationship: relGain, happiness: +5, humanity: +2 };
      } else if (isGrand) {
        message = `You sat in the garden while ${person.name} told you stories of parish miracles and honest saints (+${relGain}% Closeness, +Sanity).`;
        effects = { relationship: relGain, sanity: +4, humanity: +3 };
      }
    } else if (atmo === 'working_class') {
      if (isParent) {
        message = `You helped ${person.name} mend worn boot soles and patch heavy canvas jackets by the warm radiator (+${relGain}% Closeness, +Vitality, +Happiness).`;
        effects = { relationship: relGain, vitality: +4, happiness: +4 };
      } else if (isSibling) {
        message = `You scavenged copper scrap and wire from the trainyard with ${person.name}, splitting a cold soda on the curb (+${relGain}% Closeness, +Smarts, +Happiness).`;
        effects = { relationship: relGain, smarts: +4, happiness: +5 };
      } else if (isGrand) {
        message = `You peeled potatoes at the chipped enamel kitchen table with ${person.name}, listening to tall tales of old strikes and harbor barges (+${relGain}% Closeness, +Happiness).`;
        effects = { relationship: relGain, happiness: +6, vitality: +2 };
      }
    } else {
      // Loving default
      if (isParent) {
        const activities = [
          `went to a roadside diner for pancakes with ${person.name}.`,
          `helped ${person.name} fix the weather-stripping on the drafty front door.`,
          `sat together listening to rain drum against the living room window while ${person.name} read the paper.`,
          `drove to the municipal supermarket and picked out sweet pastries together.`
        ];
        message = `You ${window.getRandomElement(activities)} (+${relGain}% Closeness, +5% Happiness).`;
      } else if (isSibling) {
        const activities = [
          `played a marathon session of split-screen arcade games with your ${person.role.toLowerCase()} ${person.name}.`,
          `built a fort out of heavy wool blankets in the hallway with ${person.name}.`,
          `shared secret snacks after midnight while whispering about school rumors with ${person.name}.`
        ];
        message = `You ${window.getRandomElement(activities)} (+${relGain}% Closeness, +5% Happiness).`;
      } else if (isGrand) {
        message = `You spent the afternoon having warm tea and ginger biscuits with ${person.name}. They showed you faded black-and-white family portraits (+${relGain}% Closeness, +5% Happiness).`;
      }
      effects = { relationship: relGain, happiness: +5 };
    }
  } else {
    // Non-family / Friend
    if (person.entityType === 'disguised_mimic' && person.loyalty === 'loyal') {
      message = `You sat behind the abandoned bleachers with ${person.name}. You kept watch while they ate cold marrow bones in peace (+${relGain}% Closeness, +5% Occult).`;
      effects = { relationship: relGain, occult: +5 };
    } else if (person.entityType === 'anomaly') {
      message = `You and ${person.name} explored the damp drainage canal. Their breath didn't fog up once in the chilly wind (+${relGain}% Closeness, +3% Smarts).`;
      effects = { relationship: relGain, smarts: +3 };
    } else {
      message = `You and ${person.name} shared a basket of hot french fries under the flickering neon sign of the corner bowling alley (+${relGain}% Closeness, +5% Happiness).`;
      effects = { relationship: relGain, happiness: +5 };
    }
  }

  if (window.getSpendTimeLine) {
    message = window.getSpendTimeLine(person, character, relGain);
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';

  let quote = "";
  let effects = { relationship: +relGain };

  if (count >= 2) {
    // 3rd+ talk of the year is lighter conversation
    let lightChats = [
      `You and ${person.name} chatted idly about the changing autumn weather and distant sirens.`,
      `You exchanged casual neighborhood rumors about the strange tenant on the third floor.`,
      `You shared a brief, comfortable silence watching rain pool on the asphalt outside.`,
      `You discussed recent radio broadcasts and municipal road construction near the harbor.`,
      `You talked about funny childhood memories and old family recipes.`
    ];
    if (isFamily && atmo === 'cold_detached') {
      lightChats = [
        `You and ${person.name} exchanged three formal sentences regarding municipal tax levies.`,
        `You shared an austere, unbroken silence while the mantel clock ticked rhythmically.`,
        `A brief, polite nod was exchanged over the morning newspaper.`
      ];
    } else if (isFamily && atmo === 'deeply_religious') {
      lightChats = [
        `You recited a minor vesper verse together in low, solemn tones.`,
        `You discussed the pastor's sermon and the impending winter freeze.`,
        `A brief murmur of mutual prayer ended the short exchange.`
      ];
    }
    let lightMsg = `${window.getRandomElement(lightChats)} (+${relGain}% Closeness).`;
    if (window.getTalkLightLine) {
      lightMsg = `${window.getTalkLightLine(person, character, relGain)} (+${relGain}% Closeness).`;
    }
    return {
      success: true,
      message: lightMsg,
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
    if (atmo === 'cold_detached') {
      const coldQuotes = [
        `"${person.name} adjusted their cuffs and said: 'In this world, sentimental attachments are liabilities. Cultivate poise, silence, and fiscal independence.'"`,
        `"${person.name} gave a cool, measured nod: 'Do not expect comfort from others. A person of breeding stands entirely alone.'"`,
        `"${person.name} looked over their ledger: 'Emotion is an indulgence for those who have nothing substantial to manage.'"`
      ];
      quote = window.getRandomElement(coldQuotes);
      effects.smarts = +3;
      effects.happiness = -2;
    } else if (atmo === 'deeply_religious') {
      const piousQuotes = [
        `"${person.name} gripped your shoulder with intense solemnity: 'Guard your thoughts day and night. A single unconfessed sin will invite the worm into this entire household.'"`,
        `"${person.name} whispered: 'Every misfortune is the Lord's rod against secret wickedness. Pray until your knees bleed, child.'"`,
        `"${person.name} warned: 'The worldly pleasures of this city are ashes and sulfur. Keep your eyes lowered and fear the pit.'"`
      ];
      quote = window.getRandomElement(piousQuotes);
      effects.humanity = +4;
      effects.sanity = -2;
    } else if (atmo === 'extremely_strict') {
      const strictQuotes = [
        `"${person.name} slammed a pen onto the desk: 'Excuses are the currency of failures. In this family, ninety-nine percent is an insult to our name.'"`,
        `"${person.name} stared hard: 'Discipline is the only bridge between survival and destruction in this city. Never let me catch you idling.'"`,
        `"${person.name} stated flatly: 'Punctuality, precision, and obedience. Master those three, or you will be swept into the gutter.'"`
      ];
      quote = window.getRandomElement(strictQuotes);
      effects.smarts = +4;
      effects.happiness = -3;
    } else if (atmo === 'alcoholic') {
      const alcQuotes = [
        `"${person.name} exhaled whiskey-sour breath: 'Look at me, kid... don't ever end up like this city made me. It grinds you down until you're hollow inside.'"`,
        `"${person.name} slurred with bitter cynicism: 'Everyone in this town is looking for an angle to cheat you. Keep your back to the wall and trust nobody.'"`,
        `"${person.name} blinked away dark tears: 'I was gonna be somebody once, before the night shifts crushed my spirit. Don't look at me like that.'"`
      ];
      quote = window.getRandomElement(alcQuotes);
      effects.smarts = +2;
      effects.sanity = -2;
    } else if (atmo === 'eccentric_occult') {
      const occQuotes = [
        `"${person.name} whispered: 'The shadows beneath the floorboards have ancient names. If you hear them calling, answer with numbers, never words.'"`,
        `"${person.name} murmured: 'The veil is thin as spider silk in this house. Never sweep away the salt ring around your bedstead.'"`,
        `"${person.name} touched your temple: 'Our blood has always carried the Sight. Do not fear the figure standing in the mirror's blind corner.'"`
      ];
      quote = window.getRandomElement(occQuotes);
      effects.occult = +4;
      effects.sanity = -1;
    } else if (atmo === 'religious') {
      const relQuotes = [
        `"${person.name} smiled gently: 'Walk in honesty, humility, and faith. The Lord will guide your path through the darkest valley.'"`,
        `"${person.name} reminded you: 'A clean conscience is the softest pillow. Always do right by your neighbors.'"`
      ];
      quote = window.getRandomElement(relQuotes);
      effects.humanity = +3;
      effects.sanity = +2;
    } else if (atmo === 'working_class') {
      const workQuotes = [
        `"${person.name} said firmly: 'Keep your knuckles greased and your boots dry. A person who knows an honest trade will never starve.'"`,
        `"${person.name} clapped your back: 'We don't have gold or fancy silver, but we've got our dignity. In this house, family comes before everything.'"`
      ];
      quote = window.getRandomElement(workQuotes);
      effects.vitality = +2;
      effects.happiness = +2;
    } else {
      // Loving default
      const parentQuotes = [
        `"${person.name} told you: 'Make sure your bedroom lock is fastened tonight. The neighborhood watch reported another stray dog pack near the culvert.'"`,
        `"${person.name} said: 'Study hard and save your money. When you grow up, this city doesn't give second chances.'"`,
        `"${person.name} looked tired and said: 'Did you hear that low frequency humming in the pipes again? The city water department claims everything is normal.'"`,
        `"${person.name} smiled gently and said: 'I'm proud of how resilient you are, even when the house feels cold.'"`
      ];
      quote = window.getRandomElement(parentQuotes);
      effects.sanity = +3;
    }
  } else if (person.role.includes('Grand')) {
    if (atmo === 'cold_detached') {
      quote = `"${person.name} told you: 'Remember your lineage. Never let the lower orders see you sweat or stumble.'"`;
      effects.smarts = +3;
    } else if (atmo === 'deeply_religious') {
      quote = `"${person.name} told you: 'The martyrs endured fire and irons without flinching. Cling to the cross when tempests howl.'"`;
      effects.humanity = +4;
    } else if (atmo === 'extremely_strict') {
      quote = `"${person.name} told you: 'Sloth is the poison of youth. Rise before dawn and earn your bread.'"`;
      effects.smarts = +3;
    } else if (atmo === 'alcoholic') {
      quote = `"${person.name} told you: 'Don't hold your parents' failings against them, child. The city's winter has broken stronger folk than them. You stay strong for all of us.'"`;
      effects.sanity = +3;
      effects.happiness = +3;
    } else if (atmo === 'eccentric_occult') {
      quote = `"${person.name} told you: 'Our lineage survived the black floods of '74. Don't trust anyone who knocks on your window twice without a lantern.'"`;
      effects.occult = +4;
    } else if (atmo === 'religious') {
      quote = `"${person.name} told you: 'A kind word turns away wrath, child. Keep your heart gentle.'"`;
      effects.sanity = +3;
    } else if (atmo === 'working_class') {
      quote = `"${person.name} told you: 'I worked forty years in the rail yards. Stand with your fellows and you'll never be broken.'"`;
      effects.vitality = +3;
    } else {
      quote = `"${person.name} told you: 'Always keep a kettle on and a warm heart. Hard times pass, but love endures.'"`;
      effects.happiness = +4;
    }
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';

  let message = "";
  let effects = { relationship: +relGain, happiness: +3 };

  if (person.isRevealed && person.entityType !== 'human') {
    const entityCompliments = [
      `You whispered that their true abyssal presence commands quiet awe. They let out a purr of electrostatic resonance (+${relGain}% Closeness, +3% Occult).`,
      `You admired how seamlessly their disguised joints moved. A flicker of cold satisfaction crossed their eyes (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(entityCompliments);
    effects.occult = +3;
  } else if (person.role === 'Father' || person.role === 'Mother') {
    if (atmo === 'cold_detached') {
      message = `You complimented ${person.name}'s immaculate decorum and dignified bearing. They adjusted a cufflink with a slight, measured inclination of the head: "Flattery is unnecessary, but an appreciation of proper standards is noted." (+${relGain}% Closeness, +3% Smarts)`;
      effects = { relationship: Math.max(1, Math.round(relGain * 0.7)), smarts: +3 };
    } else if (atmo === 'deeply_religious') {
      message = `You praised ${person.name}'s unwavering piety and devotion. They lowered their gaze in solemn chastisement: "Give all praise to the Almighty, child; we are merely dust and clay. Do not let pride tempt your tongue." (+${relGain}% Closeness, +3% Humanity)`;
      effects = { relationship: relGain, humanity: +3 };
    } else if (atmo === 'extremely_strict') {
      message = `You commended ${person.name}'s iron principles and high standards. A razor-thin smirk of approval touched their lips: "Good. You are beginning to understand why mediocrity is unacceptable." (+${relGain}% Closeness, +3% Smarts)`;
      effects = { relationship: Math.round(relGain * 0.8), smarts: +3 };
    } else if (atmo === 'alcoholic') {
      message = `You told ${person.name} that you believe in them and love them anyway. Their eyes welled with sudden, messy tears; they turned away toward the sink to wipe their face, deeply shaken: "You're too good for me, kid." (+${relGain}% Closeness, +4% Humanity, -2% Sanity)`;
      effects = { relationship: relGain, humanity: +4, sanity: -2 };
    } else if (atmo === 'eccentric_occult') {
      message = `You praised ${person.name}'s profound esoteric knowledge. A strange, knowing gleam sparked in their eyes: "The unseen currents hum around you, little seeker. You recognize the true architecture of things." (+${relGain}% Closeness, +3% Occult)`;
      effects = { relationship: relGain, occult: +3 };
    } else if (atmo === 'religious') {
      message = `You complimented ${person.name}'s gentle patience and faith. They beamed warmly and touched your shoulder: "Bless your sweet heart, child. You bring warmth to this home." (+${relGain}% Closeness, +4% Happiness)`;
      effects = { relationship: relGain, happiness: +4 };
    } else if (atmo === 'working_class') {
      message = `You told ${person.name} they are the toughest, hardest working person in the city. They let out a hearty belly laugh, ruffling your hair: "Someone's gotta keep the coal in the bin!" (+${relGain}% Closeness, +4% Happiness)`;
      effects = { relationship: relGain, happiness: +4 };
    } else {
      // Loving default
      const parentCompliments = [
        `You told ${person.name} you admire their unwavering resilience and how hard they work for the family. They looked touched and embraced you warmly (+${relGain}% Closeness, +3% Happiness).`,
        `You remarked that ${person.name} makes the drafty house feel like a real sanctuary. A gentle smile broke across their tired face (+${relGain}% Closeness).`,
        `You praised their practical wisdom. ${person.name} chuckled softly and thanked you (+${relGain}% Closeness).`
      ];
      message = window.getRandomElement(parentCompliments);
    }
  } else if (person.role.includes('Brother') || person.role.includes('Sister')) {
    if (atmo === 'cold_detached') {
      message = `You praised your ${person.role.toLowerCase()}'s flawless academic scores. They gave a cool, competitive smirk: "Naturally. Do try to keep up." (+${relGain}% Closeness, +2% Smarts)`;
      effects = { relationship: Math.max(1, Math.round(relGain * 0.7)), smarts: +2 };
    } else if (atmo === 'deeply_religious') {
      message = `You complimented your ${person.role.toLowerCase()}'s quiet conduct in chapel. They gave a relieved whisper: "Thanks... I was terrified father was going to yell at me." (+${relGain}% Closeness, +2% Humanity)`;
      effects = { relationship: relGain, humanity: +2 };
    } else if (atmo === 'extremely_strict') {
      message = `You praised your ${person.role.toLowerCase()}'s perfect inspection report. They sighed in relief: "We survived another week. Don't let your guard down." (+${relGain}% Closeness, +2% Smarts)`;
      effects = { relationship: Math.round(relGain * 0.8), smarts: +2 };
    } else if (atmo === 'alcoholic') {
      message = `You told your ${person.role.toLowerCase()} that you're proud to be their sibling. They squeezed your hand with fierce, protective loyalty: "We stick together, no matter what happens down there." (+${relGain}% Closeness, +3% Humanity)`;
      effects = { relationship: relGain, humanity: +3 };
    } else if (atmo === 'eccentric_occult') {
      message = `You praised your ${person.role.toLowerCase()}'s clever shadow puppets. They showed you a secret sigil drawn under their sleeve (+${relGain}% Closeness, +2% Occult)`;
      effects = { relationship: relGain, occult: +2 };
    } else {
      const siblingCompliments = [
        `You praised your ${person.role.toLowerCase()}'s quick wit and style. They puffed their chest with pride and smiled (+${relGain}% Closeness).`,
        `You told ${person.name} that nobody makes you laugh like they do. They grinned from ear to ear (+${relGain}% Closeness).`
      ];
      message = window.getRandomElement(siblingCompliments);
    }
  } else if (person.role.includes('Grand')) {
    if (atmo === 'cold_detached') {
      message = `You complimented ${person.name}'s timeless aristocratic pedigree. They offered a crisp nod: "Blood will tell. Always carry yourself as a rightful heir." (+${relGain}% Closeness, +3% Smarts)`;
      effects = { relationship: relGain, smarts: +3 };
    } else if (atmo === 'deeply_religious') {
      message = `You praised ${person.name}'s holy faith. They gripped their rosary and murmured: "May heaven count it toward our redemption, little lamb." (+${relGain}% Closeness, +3% Humanity)`;
      effects = { relationship: relGain, humanity: +3 };
    } else if (atmo === 'extremely_strict') {
      message = `You complimented ${person.name}'s uncompromising discipline. They nodded firmly: "A backbone of iron will serve you when softer youths collapse." (+${relGain}% Closeness, +3% Smarts)`;
      effects = { relationship: relGain, smarts: +3 };
    } else if (atmo === 'alcoholic') {
      message = `You told ${person.name} they are the sweetest haven in your whole world. Tears shone in their weathered eyes as they kissed your forehead and pressed a warm butterscotch into your hand (+${relGain}% Closeness, +5% Happiness).`;
      effects = { relationship: relGain, happiness: +5 };
    } else if (atmo === 'eccentric_occult') {
      message = `You complimented ${person.name}'s ancient collection of spirit jars and bone charms. They cackled softly with wicked delight (+${relGain}% Closeness, +3% Occult).`;
      effects = { relationship: relGain, occult: +3 };
    } else {
      const grandCompliments = [
        `You told ${person.name} that their ancient stories and heritage mean the world to you. Their eyes misted with fond memories (+${relGain}% Closeness, +3% Happiness).`,
        `You complimented their timeless elegance. They laughed warmly and offered you an extra sweet (+${relGain}% Closeness).`
      ];
      message = window.getRandomElement(grandCompliments);
    }
  } else {
    // Friend
    const friendCompliments = [
      `You told ${person.name} they are the most dependable friend in this entire city. They gave you a broad grin and bumped fists (+${relGain}% Closeness, +3% Happiness).`,
      `You complimented their fearless attitude. They laughed and promised they've always got your back (+${relGain}% Closeness).`
    ];
    message = window.getRandomElement(friendCompliments);
  }

  if (window.getComplimentLine) {
    message = window.getComplimentLine(person, character, relGain);
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

  const atmoId = character.kin?.atmosphere?.id;
  let adviceList = [];
  let smartsGain = 3;
  let sanityGain = 2;

  if (atmoId === 'religious' || atmoId === 'deeply_religious') {
    adviceList = [
      `"${person.name} touched the cold iron cross at their throat: 'Do not barter with midnight shadows, child. Sin leaves a stench that even cemetery soil cannot bury. Keep your thoughts chaste.' (+Humanity, +Sanity)"`,
      `"${person.name} stared sternly through candle smoke: 'The righteous are tested in fire. When wicked folk whisper in your ear, remember the pit that awaits them.' (+Humanity, -Happiness)"`,
      `"${person.name} held your hand in a firm, praying clasp: 'Guard your tongue, honor your elders, and kneel before sleeping. The Lord watches your every step.' (+Humanity, +Closeness)"`
    ];
    applyKinStatEffect(character, 'humanity', 4);
    applyKinStatEffect(character, 'sanity', 2);
  } else if (atmoId === 'extremely_strict') {
    adviceList = [
      `"${person.name} tapped their ledger firmly: 'Excuses are the currency of failures. In this town, weakness is punishable by ruin. Out-work them, out-study them, and never show fear.' (+Smarts, +Discipline)"`,
      `"${person.name} glared with flinty resolve: 'A spotless reputation is the only shield between you and the workhouse. Keep your posture rigid and your ledger clean.' (+Smarts, -Sanity)"`,
      `"${person.name} inspected your fingernails for grime: 'Tears will not buy bread. Stand straight, speak clearly, and never let them see you falter.' (+Smarts, -Humanity)"`
    ];
    applyKinStatEffect(character, 'smarts', 4);
    applyKinStatEffect(character, 'sanity', -1);
    smartsGain = 4;
    sanityGain = -1;
  } else if (atmoId === 'alcoholic') {
    adviceList = [
      `"${person.name} exhaled a harsh, alcohol-soaked sigh: 'Never let anyone see you bleed, kid. The world is a den of hungry dogs; the second you limp, they tear off your skin.' (+Street Smarts, -Sanity)"`,
      `"${person.name} stared into the half-empty amber tumbler: 'Run while you have youth left. This city drinks you down until you are nothing but marrow and ash.' (+Street Smarts, -Happiness)"`,
      `"${person.name} gripped your shoulder with trembling, bruised fingers: 'Promise me you won't turn out like me. Keep moving, don't look back, and trust no one.' (+Sanity, +Humanity)"`
    ];
    applyKinStatEffect(character, 'smarts', 3);
    applyKinStatEffect(character, 'sanity', -2);
    sanityGain = -2;
  } else if (atmoId === 'eccentric_occult') {
    adviceList = [
      `"${person.name} turned an antique silver mirror away from the door: 'Never answer a knock that comes in threes after midnight. And if your shadow moves before you do, bite your tongue.' (+Occult, -Sanity)"`,
      `"${person.name} tied a knot in black thread: 'The dead do not hate us, child; they simply envy the warmth of our blood. Keep salt in your left pocket.' (+Occult, +Smarts)"`,
      `"${person.name} pointed to the damp cellar floorboards: 'When the floorboards hum like a cello, do not light a lamp. Silence is your only true sanctuary.' (+Occult, -Sanity)"`
    ];
    applyKinStatEffect(character, 'occult', 5);
    applyKinStatEffect(character, 'sanity', -2);
    sanityGain = -2;
  } else if (atmoId === 'cold_detached') {
    adviceList = [
      `"${person.name} turned a page of the newspaper without glancing up: 'Sentimentality is an expensive liability. Rely only on contracts, leverage, and your own wit.' (+Smarts, -Humanity)"`,
      `"${person.name} adjusted their cufflink coldly: 'Never explain yourself to inferiors. Politeness is a weapon; wield it with distance.' (+Smarts, -Happiness)"`
    ];
    applyKinStatEffect(character, 'smarts', 3);
    applyKinStatEffect(character, 'humanity', -2);
  } else {
    // Loving / Standard
    adviceList = [
      `"${person.name} took a sip of hot tea and advised: 'In this city, never sign a document you haven't read thrice by daylight. And stay clear of the old aqueducts after sundown.' (+Smarts, +Sanity)"`,
      `"${person.name} placed a comforting hand on your shoulder: 'People will test your boundaries. Keep your ledger balanced and your door bolted.' (+Smarts, +Closeness)"`,
      `"${person.name} kissed your forehead gently: 'Whatever happens in the streets or at school, this house is your safe harbor. Be kind and stand tall.' (+Happiness, +Sanity)"`
    ];
    applyKinStatEffect(character, 'smarts', 3);
    applyKinStatEffect(character, 'sanity', 3);
    sanityGain = 3;
  }

  return {
    success: true,
    title: `Parental Advice from ${person.name}`,
    message: window.getRandomElement(adviceList),
    effects: { relationship: relGain, smarts: smartsGain, sanity: sanityGain }
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

  const role = person.dynamicTrait || '';
  const roll = Math.random();

  if (role === 'The Golden Child' || role === 'Tattling Moralist') {
    if (roll < 0.5) {
      const relLoss = Math.floor(Math.random() * 4) + 6;
      person.relationship = Math.max(0, person.relationship - relLoss);
      applyKinStatEffect(character, 'happiness', -5);
      let tattleMsg = `During a mild disagreement, ${person.name} immediately burst into theatrical tears and screamed for your parents, claiming you shoved them! You were harshly reprimanded (-${relLoss}% Closeness, -5% Happiness).`;
      if (window.getSiblingBickerLine) {
        tattleMsg = window.getSiblingBickerLine(person, character, role, 'tattle', relLoss);
      }
      return {
        success: true,
        title: `Tattled by ${person.name}!`,
        message: tattleMsg,
        effects: { relationship: -relLoss, happiness: -5 }
      };
    }
  } else if (role === 'The Sneaky Rebel') {
    const relGain = Math.floor(Math.random() * 4) + 6;
    person.relationship = Math.min(100, person.relationship + relGain);
    applyKinStatEffect(character, 'happiness', 5);
    applyKinStatEffect(character, 'smarts', 2);
    let rebelMsg = `You and ${person.name} wrestled in the hallway until the coats fell. They grinned with a split lip and slipped a contraband peppermint into your palm: "Don't let them hear us." (+${relGain}% Closeness, +Smarts).`;
    if (window.getSiblingBickerLine) {
      rebelMsg = window.getSiblingBickerLine(person, character, role, 'rebel', relGain);
    }
    return {
      success: true,
      title: `Secret Pact with ${person.name}`,
      message: rebelMsg,
      effects: { relationship: relGain, happiness: 5, smarts: 2 }
    };
  } else if (role === 'Trauma-Bonded Protector') {
    const relGain = Math.floor(Math.random() * 4) + 6;
    person.relationship = Math.min(100, person.relationship + relGain);
    applyKinStatEffect(character, 'sanity', 3);
    let protMsg = `A sudden petty squabble ended when an angry shout echoed from upstairs. You and ${person.name} instantly fell silent, huddling shoulder to shoulder in the dim corridor (+${relGain}% Closeness, +Sanity).`;
    if (window.getSiblingBickerLine) {
      protMsg = window.getSiblingBickerLine(person, character, role, 'protector', relGain);
    }
    return {
      success: true,
      title: `Quiet Truce with ${person.name}`,
      message: protMsg,
      effects: { relationship: relGain, sanity: 3 }
    };
  }

  if (roll < 0.65) {
    // Playful tussle
    const relGain = Math.floor(Math.random() * 4) + 4;
    person.relationship = Math.min(100, person.relationship + relGain);
    applyKinStatEffect(character, 'vitality', 2);
    applyKinStatEffect(character, 'happiness', 4);
    let playMsg = `You and your ${person.role.toLowerCase()} ${person.name} got into an energetic pillow fight in the hallway, laughing breathlessly (+${relGain}% Closeness, +Vitality, +Happiness).`;
    if (window.getSiblingBickerLine) {
      playMsg = window.getSiblingBickerLine(person, character, role, 'playful', relGain);
    }
    return {
      success: true,
      title: `Wrestled with ${person.name}`,
      message: playMsg,
      effects: { relationship: relGain, vitality: 2, happiness: 4 }
    };
  } else {
    // Minor argument
    const relLoss = Math.floor(Math.random() * 4) + 4;
    person.relationship = Math.max(0, person.relationship - relLoss);
    let argueMsg = `You and ${person.name} fought over who got the bigger slice of pie, sulking in separate corners for an hour (-${relLoss}% Closeness).`;
    if (window.getSiblingBickerLine) {
      argueMsg = window.getSiblingBickerLine(person, character, role, 'argument', relLoss);
    }
    return {
      success: true,
      title: `Sibling Spat`,
      message: argueMsg,
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
    if (window.getSiblingSecretLine) {
      message = window.getSiblingSecretLine(person, character, relGain);
    }
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

  let folktaleMsg = window.getRandomElement(tales);
  if (window.getGrandparentFolktaleLine) {
    folktaleMsg = window.getGrandparentFolktaleLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Ancient Lore from ${person.name}`,
    message: folktaleMsg,
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

  const atmoId = character.kin?.atmosphere?.id;
  let choreList = [];

  if (atmoId === 'religious' || atmoId === 'deeply_religious') {
    choreList = [
      `You scraped melted tallow from the prayer pews and polished the heavy iron crucifix for ${person.name}. They nodded solemnly: "The Lord sees quiet service"${tip > 0 ? ` and handed you ${window.formatMoney(tip, character.countryCode)} for the church collection` : ''} (+${relGain}% Closeness, +Humanity).`,
      `You scrubbed the communion linen in cold lye water and ironed black mourning vestments for ${person.name}. A quiet, austere peace settled over the house (+${relGain}% Closeness, +Humanity).`,
      `You swept snow from the chapel pathway and arranged prayer hymnals under ${person.name}'s strict supervision (+${relGain}% Closeness, +Vitality).`
    ];
  } else if (atmoId === 'extremely_strict') {
    choreList = [
      `You scrubbed the hallway parquet on your knees with carbolic soap. ${person.name} inspected every baseboard with a white handkerchief before offering a curt, stiff nod (+${relGain}% Closeness, +Discipline, -Happiness).`,
      `You sorted years of domestic receipts and wiped the mahogany study shelves in absolute silence for ${person.name}${tip > 0 ? `, receiving a strict ${window.formatMoney(tip, character.countryCode)} performance stipend` : ''} (+${relGain}% Closeness, +Smarts).`
    ];
    applyKinStatEffect(character, 'smarts', 2);
    applyKinStatEffect(character, 'happiness', -2);
  } else if (atmoId === 'alcoholic') {
    choreList = [
      `You quietly swept up shattered amber gin bottles from the linoleum and wiped sour spilled malt before ${person.name} awoke. They rubbed their bloodshot temples in weary relief${tip > 0 ? ` and guiltily pressed ${window.formatMoney(tip, character.countryCode)} into your coat pocket` : ''} (+${relGain}% Closeness, +Street Smarts, -Sanity).`,
      `You washed stained glasses and cleared heavy ashtrays while ${person.name} slept off a blackout on the sofa, keeping the morning peaceful (+${relGain}% Closeness, +Sanity preservation).`
    ];
    applyKinStatEffect(character, 'sanity', -2);
  } else if (atmoId === 'eccentric_occult') {
    choreList = [
      `You helped ${person.name} string dried belladonna and wormwood from the cellar rafters, sweeping bone meal into iron urns. Their eyes gleamed with strange pride (+${relGain}% Closeness, +Occult, -Sanity).`,
      `You scraped dried tallow and odd salt glyphs from the threshold stones for ${person.name}. They patted your cheek with cold, pale fingers (+${relGain}% Closeness, +Occult).`
    ];
    applyKinStatEffect(character, 'occult', 4);
    applyKinStatEffect(character, 'sanity', -2);
  } else {
    // Loving / Standard
    choreList = [
      `You scrubbed the soot from the coal stove and washed the heavy iron skillets for ${person.name}. They gave you a proud smile${tip > 0 ? ` and slipped you ${window.formatMoney(tip, character.countryCode)} for your honest effort` : ''} (+${relGain}% Closeness, +Humanity).`,
      `You gathered the damp laundry and helped ${person.name} beat dust from the winter rugs in the courtyard. They thanked you warmly${tip > 0 ? ` and handed you ${window.formatMoney(tip, character.countryCode)} pocket money` : ''} (+${relGain}% Closeness).`,
      `You swept the creaking front hallway and shoveled frost from the front steps before ${person.name} returned from work${tip > 0 ? `, earning a ${window.formatMoney(tip, character.countryCode)} reward` : ''} (+${relGain}% Closeness).`
    ];
  }

  let choreMsg = window.getRandomElement(choreList);
  if (window.getChoresLine) {
    choreMsg = window.getChoresLine(person, character, relGain);
    if (tip > 0) {
      choreMsg += ` They slipped you ${window.formatMoney(tip, character.countryCode)} for your honest effort.`;
    }
  }

  return {
    success: true,
    title: `Helped ${person.name} with Chores`,
    message: choreMsg,
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
      let petAdoptMsg = `${person.name} sighed, looked into your pleading eyes, and brought home a stray ${pet.species}: ${pet.name}! (+Happiness, +Closeness)`;
      if (window.getBegPetLine) {
        petAdoptMsg = window.getBegPetLine(person, character, true, pet);
      }
      return {
        success: true,
        title: `Plea Granted! A New Pet!`,
        message: petAdoptMsg,
        effects: { relationship: 5, happiness: 12 }
      };
    }
    let toyMsg = `${person.name} gave in to your persistence and bought you a beautiful antique wooden puzzle toy and sweet treats (+12% Happiness, +5% Closeness).`;
    if (window.getBegPetLine) {
      toyMsg = window.getBegPetLine(person, character, true, null);
    }
    return {
      success: true,
      title: `Plea Granted!`,
      message: toyMsg,
      effects: { relationship: 5, happiness: 12 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 4);
    applyKinStatEffect(character, 'happiness', -4);
    let denyMsg = `${person.name} firmly crossed their arms: 'We cannot afford frivolous luxuries or extra mouths to feed in this house. Absolutely not.' (-4% Happiness, -4% Closeness).`;
    if (window.getBegPetLine) {
      denyMsg = window.getBegPetLine(person, character, false, null);
    }
    return {
      success: true,
      title: `Plea Denied`,
      message: denyMsg,
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

  let driveMsg = window.getRandomElement(scenarios);
  if (window.getDrivingLessonLine) {
    driveMsg = window.getDrivingLessonLine(person, character, true);
  }

  return {
    success: true,
    title: `Driving Practice with ${person.name}`,
    message: driveMsg,
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

  let adviceMsg = window.getRandomElement(adviceQuotes);
  if (window.getDiscussCollegeLine) {
    adviceMsg = window.getDiscussCollegeLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Future Planning with ${person.name}`,
    message: adviceMsg,
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
    let loanMsg = `${person.name} counted out ${window.formatMoney(amount, character.countryCode)}: "Take this to get yourself on your feet. Repay me when your harvest comes in." (Debt Recorded: ${window.formatMoney(person.familyDebt, character.countryCode)})`;
    if (window.getRequestLoanLine) {
      loanMsg = `${window.getRequestLoanLine(person, character, true, window.formatMoney(amount, character.countryCode))} (Debt Recorded: ${window.formatMoney(person.familyDebt, character.countryCode)})`;
    }
    return {
      success: true,
      granted: true,
      title: `Family Loan Approved`,
      message: loanMsg,
      effects: { money: amount, relationship: -2 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 6);
    let denyLoanMsg = `${person.name} shook their head: "I cannot risk ${window.formatMoney(amount, character.countryCode)}. Money lent to kin often burns the bridge between them." (-6% Closeness).`;
    if (window.getRequestLoanLine) {
      denyLoanMsg = window.getRequestLoanLine(person, character, false, window.formatMoney(amount, character.countryCode));
    }
    return {
      success: true,
      granted: false,
      title: `Loan Request Denied`,
      message: denyLoanMsg,
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

  let elderMsg = window.getRandomElement(scenarios);
  if (window.getCareElderLine) {
    elderMsg = window.getCareElderLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Cared for Aging ${person.role}`,
    message: elderMsg,
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

  let alibiMsg = `When parents investigated the broken latch and missing rations, you took the heat and fabricated an airtight alibi. Your ${person.role.toLowerCase()} squeezed your arm with tearful gratitude (+${relGain}% Closeness, Loyalty: Unshakeable).`;
  if (window.getSiblingAlibiLine) {
    alibiMsg = window.getSiblingAlibiLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Covered for ${person.name}`,
    message: alibiMsg,
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

  let brawlMsg = `A vicious dispute over jealousy and past slights boiled over into a physical fight in the courtyard. You traded heavy blows before slamming doors in bitter fury (-${relLoss}% Closeness, -Vitality, -Happiness).`;
  if (window.getSiblingBrawlLine) {
    brawlMsg = window.getSiblingBrawlLine(person, character, relLoss);
  }

  return {
    success: true,
    title: `Heated Sibling Brawl`,
    message: brawlMsg,
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

  let drinkMsg = window.getRandomElement(venues);
  if (window.getSiblingDrinksLine) {
    drinkMsg = window.getSiblingDrinksLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Drinks & Dinner with ${person.name}`,
    message: drinkMsg,
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

  const atmoId = character.kin?.atmosphere?.id;
  let findings = [];

  if (atmoId === 'religious' || atmoId === 'deeply_religious') {
    findings = [
      `Beneath yellowed hymnals, you found a silver reliquary containing a splinter of petrified cedar and a Latin prayer against nocturnal specters (+Humanity, +Occult, +Smarts).`,
      `You and ${person.name} opened a cedar chest lined with black velvet, finding a heavy family Bible with dates of ancestors who died in plague winters (+Smarts, +Closeness).`
    ];
  } else if (atmoId === 'eccentric_occult') {
    findings = [
      `In a padlocked trunk behind dusty velvet drapes, you found a blackened bronze scrying mirror wrapped in sheepskin. When you touched it, your candle flame snuffed out (+Occult, -Sanity).`,
      `You uncovered an apothecary jar filled with unrendered animal incisors and yellowed parchment tags marked with your great-grandfather's glyphs (+Occult, +Shillings).`
    ];
  } else if (atmoId === 'extremely_strict') {
    findings = [
      `You uncovered leather-bound school ledgers from 1902 showing flawless marks from four generations of ancestors. ${person.name} tapped the parchment: "The standard was set long before you." (+Smarts, +Discipline).`,
      `Beneath brass drafting instruments, you found an antique iron seal stamped with the city's old guild insignia (+Smarts, +Closeness).`
    ];
  } else if (atmoId === 'alcoholic' || atmoId === 'working_class') {
    findings = [
      `You found an old cigar tin containing pawnshop receipts and strike badges from the harsh winter of '74. ${person.name} touched the faded ink with a wistful sigh (+Smarts, +Closeness).`,
      `Beneath canvas tarps, you uncovered an iron lockbox containing three uncashed coal scrip tokens and a hand-carved wooden sparrow (+Closeness, +Smarts).`
    ];
  } else {
    findings = [
      `Together with ${person.name}, you pried open a heavy brass steamer trunk and uncovered pre-war topographical maps showing vanished city streets (+Smarts, +Occult).`,
      `Beneath moth-eaten velvet coats, you found a tintype portrait from 1894. ${person.name} pointed out the figure in the background whose eyes were drawn with white ink (+Occult, +Closeness).`,
      `You uncovered a cedar box containing silver fountain pens and an uncashed promissory note from the old municipal foundry (+Smarts, +Closeness).`
    ];
  }

  let atticMsg = window.getRandomElement(findings);
  if (window.getGrandparentAtticLine) {
    atticMsg = window.getGrandparentAtticLine(person, character);
  }

  return {
    success: true,
    title: `Attic Expedition with ${person.name}`,
    message: atticMsg,
    effects: { relationship: relGain, smarts: 3, occult: 4 }
  };
}

// ============================================================================
// PHASE 4: FAMILY DYNAMICS & UPBRINGING ACTIONS
// ============================================================================

// 1. Devout / Deeply Religious: Pray & Recite Scripture Together (Age 5+)
function prayWithFamily(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother') && !person.role.includes('Grand')) {
    return { success: false, reason: "You can only pray together with parents or grandparents." };
  }
  const count = getActionCount(person, 'prayedTogether');
  if (count >= 5) {
    return { success: false, reason: "You have completed your daily devotions and prayers for this year." };
  }
  person.actionsDone.prayedTogether = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 8;
  person.relationship = Math.min(100, person.relationship + relGain);

  const charOccult = (character.stats.occult || 0);
  let sanityDelta = 3;
  let text = "";

  if (window.getPrayLine) {
    text = window.getPrayLine(person, character, relGain, charOccult);
    if (charOccult > 25) sanityDelta = -5;
  } else if (charOccult > 25) {
    sanityDelta = -5;
    text = `You knelt on the cold hardwood beside ${person.name}, bowing before the dark iron crucifix. As you murmured the holy verses, your occult senses burned like lye; shadows coiled along the baseboard, repelled by the prayer (+${relGain}% Closeness, +Humanity, -5% Sanity).`;
  } else {
    text = `You knelt in solemn silence beside ${person.name}, hands clasped as candlelight flickered against old scripture pages. A deep, tranquil stillness settled over the household (+${relGain}% Closeness, +Humanity, +Sanity).`;
  }

  applyKinStatEffect(character, 'humanity', 5);
  applyKinStatEffect(character, 'sanity', sanityDelta);

  return {
    success: true,
    title: `Solemn Prayer with ${person.name}`,
    message: text,
    effects: { relationship: relGain, humanity: 5, sanity: sanityDelta }
  };
}

// 2. Volatile / Alcoholic: Walk on Eggshells / Quietly Tiptoe (Age 6+)
function walkOnEggshells(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only tiptoe around volatile parents." };
  }
  const count = getActionCount(person, 'walkedEggshells');
  if (count >= 5) {
    return { success: false, reason: "You've stayed out of their way as much as humanly possible this year." };
  }
  person.actionsDone.walkedEggshells = count + 1;
  const relGain = Math.floor(Math.random() * 4) + 5;
  person.relationship = Math.min(100, person.relationship + relGain);

  applyKinStatEffect(character, 'smarts', 2);
  applyKinStatEffect(character, 'sanity', -3);
  applyKinStatEffect(character, 'happiness', -4);

  const scenarios = [
    `Hearing ${person.name}'s heavy, erratic boots outside the doorway, you held your breath, slid silently behind the sofa, and waited until they slumped into an armchair. Crisis averted, though your chest ached with anxiety (+${relGain}% Closeness, +Smarts, -3% Sanity).`,
    `You quietly cleared away shattered gin bottles and aired out the sour malt fumes before ${person.name} could wake into a raging hangover. The morning passed without a single shouted curse (+${relGain}% Closeness, -4% Happiness).`,
    `You spoke only in soft, gentle whispers and quickly served ${person.name} black coffee without making eye contact. Their volatile temper softened into exhausted silence (+${relGain}% Closeness, +Smarts, -3% Sanity).`
  ];

  let eggMsg = window.getRandomElement(scenarios);
  if (window.getEggshellsLine) {
    eggMsg = window.getEggshellsLine(person, character);
  }

  return {
    success: true,
    title: `Walked on Eggshells around ${person.name}`,
    message: eggMsg,
    effects: { relationship: relGain, smarts: 2, sanity: -3, happiness: -4 }
  };
}

// 3. Extremely Strict: Present Report Card / Commendation (Ages 6 - 18)
function presentReportCard(person, character) {
  if (!person.role.includes('Father') && !person.role.includes('Mother')) {
    return { success: false, reason: "You can only present your report card to parents." };
  }
  const count = getActionCount(person, 'presentedReport');
  if (count >= 3) {
    return { success: false, reason: "Your marks and conduct ledger have already been audited for this year." };
  }
  person.actionsDone.presentedReport = count + 1;

  const smarts = character.stats.smarts || 50;
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  if (smarts >= 60) {
    const relGain = Math.floor(Math.random() * 6) + 12;
    person.relationship = Math.min(100, person.relationship + relGain);
    const bonusUSD = Math.floor(Math.random() * 25) + 20;
    const bonus = Math.round(bonusUSD * mult);
    character.money = (character.money || 0) + bonus;
    applyKinStatEffect(character, 'happiness', 8);
    applyKinStatEffect(character, 'smarts', 3);

    let reportMsg = `${person.name} adjusted their spectacles and scrutinized your ledger line by line. A rare, crisp nod of genuine approval followed: "Exemplary. You are upholding our family standard." They handed you a ${window.formatMoney(bonus, character.countryCode)} academic commendation (+${relGain}% Closeness, +Happiness).`;
    if (window.getReportCardLine) {
      reportMsg = `${window.getReportCardLine(person, character, 'good', relGain)} They handed you a ${window.formatMoney(bonus, character.countryCode)} academic commendation.`;
    }

    return {
      success: true,
      title: `Academic Inspection: Approved`,
      message: reportMsg,
      effects: { relationship: relGain, happiness: 8, smarts: 3, money: bonus }
    };
  } else {
    const relLoss = Math.floor(Math.random() * 5) + 8;
    person.relationship = Math.max(0, person.relationship - relLoss);
    applyKinStatEffect(character, 'happiness', -12);
    applyKinStatEffect(character, 'sanity', -5);

    let failMsg = `${person.name} slammed your report card down onto the mahogany desk with a thunderous crack: "Mediocre! Shameful! In this city, weakness is ground to dust. No privileges until these numbers improve!" (-${relLoss}% Closeness, -12% Happiness, -5% Sanity).`;
    if (window.getReportCardLine) {
      failMsg = window.getReportCardLine(person, character, 'bad', relLoss);
    }

    return {
      success: true,
      title: `Academic Inspection: Severe Reprimand`,
      message: failMsg,
      effects: { relationship: -relLoss, happiness: -12, sanity: -5 }
    };
  }
}

// 4. All Families: Seek Sanctuary at Grandparent's (Age 4+)
function seekGrandparentHaven(person, character) {
  if (!person.role.includes('Grand')) {
    return { success: false, reason: "You can only seek safe sanctuary at a grandparent's home." };
  }
  const count = getActionCount(person, 'visitedGrandHaven');
  if (count >= 4) {
    return { success: false, reason: "You have already spent plenty of weekends at your grandparent's sanctuary this year." };
  }
  person.actionsDone.visitedGrandHaven = count + 1;
  const relGain = Math.floor(Math.random() * 5) + 10;
  person.relationship = Math.min(100, person.relationship + relGain);
  applyKinStatEffect(character, 'happiness', 14);
  applyKinStatEffect(character, 'sanity', 8);
  applyKinStatEffect(character, 'vitality', 4);

  const havMessages = [
    `You fled the bitter shouting and cold rules at home to ${person.name}'s parlor. They tucked you into a plush velvet armchair, wrapped a thick wool blanket around you, and gave you hot spiced tea with buttered biscuits (+14% Happiness, +8% Sanity).`,
    `${person.name} smiled with ancient warmth as you walked in. "Let the world howl outside, child; you are safe by this hearth." They hummed old gentle tunes until your heartbeat slowed (+14% Happiness, +8% Sanity).`,
    `You spent the weekend sleeping in ${person.name}'s lavender-scented guest room, far from household strife. You awoke refreshed and full of calm resolve (+14% Happiness, +Vitality).`
  ];

  let havenMsg = window.getRandomElement(havMessages);
  if (window.getGrandparentHavenLine) {
    havenMsg = window.getGrandparentHavenLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Sanctuary with ${person.name}`,
    message: havenMsg,
    effects: { relationship: relGain, happiness: 14, sanity: 8, vitality: 4 }
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

  let keepsakeMsg = `${person.name} unlocked an iron safe beneath the floorboards and placed the ${chosen.name} into your trembling hands: "This kept me alive through the dark winter of '62. Wear it close, and never let a stranger touch it." (${chosen.buff}) (+15% Closeness, +8% Occult, +6% Sanity).`;
  if (window.getGrandparentKeepsakeLine) {
    keepsakeMsg = `${window.getGrandparentKeepsakeLine(person, character)} (${chosen.buff}) (+15% Closeness, +8% Occult, +6% Sanity).`;
  }

  return {
    success: true,
    title: `Heirloom Received: ${chosen.name}`,
    message: keepsakeMsg,
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

  let nurseMsg = `You brought fresh tea and lavender biscuits to ${person.name}'s bedside. They smiled weakly through the window fog, holding your hand${secretCash > 0 ? ` and secretly pressing ${window.formatMoney(secretCash, character.countryCode)} into your palm` : ''} (+${relGain}% Closeness, +Humanity, +Sanity).`;
  if (window.getNursingHomeLine) {
    nurseMsg = window.getNursingHomeLine(person, character, relGain);
    if (secretCash > 0) {
      nurseMsg += ` Before you stepped away, they secretly pressed ${window.formatMoney(secretCash, character.countryCode)} into your palm.`;
    }
  }

  return {
    success: true,
    title: `Bedside Visit with ${person.name}`,
    message: nurseMsg,
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

  let dateMsg = window.getRandomElement(dates);
  if (window.getDateLoverLine) {
    dateMsg = window.getDateLoverLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Romantic Date with ${person.name}`,
    message: dateMsg,
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

  let kissMsg = window.getRandomElement(moments);
  if (window.getFlirtKissLine) {
    kissMsg = window.getFlirtKissLine(person, character, relGain);
  }

  return {
    success: true,
    title: `Passion with ${person.name}`,
    message: kissMsg,
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

    let confessMsg = `With trembling hands, you confessed your love to ${person.name}. Their face flushed with joy as they threw their arms around your neck: "I've waited so long for you to say that!" (${person.name} is now your ${person.role}!) (+15% Happiness, +18% Closeness).`;
    if (window.getFriendConfessLine) {
      confessMsg = `${window.getFriendConfessLine(person, character, true, 18)} (${person.name} is now your ${person.role}!) (+15% Happiness, +18% Closeness).`;
    }

    return {
      success: true,
      accepted: true,
      title: `Feelings Reciprocated!`,
      message: confessMsg,
      effects: { relationship: 18, happiness: 15 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 12);
    applyKinStatEffect(character, 'happiness', -10);

    let rejectMsg = `${person.name} looked down awkwardly and sighed: "You mean the world to me as a friend, but I don't see us that way. I'm sorry." The silence between you grew painfully heavy (-10% Happiness, -12% Closeness).`;
    if (window.getFriendConfessLine) {
      rejectMsg = window.getFriendConfessLine(person, character, false, 12);
    }

    return {
      success: true,
      accepted: false,
      title: `Gentle Rejection`,
      message: rejectMsg,
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

    let moveMsg = `${person.name} excitedly packed their cardboard boxes and moved into your flat! Domestic bills will now be shared equally (+10% Happiness, +12% Closeness).`;
    if (window.getMoveInLine) {
      moveMsg = `${window.getMoveInLine(person, character, true)} Domestic bills will now be shared equally (+10% Happiness, +12% Closeness).`;
    }

    return {
      success: true,
      agreed: true,
      title: `Moved in Together!`,
      message: moveMsg,
      effects: { relationship: 12, happiness: 10, sanity: 5 }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 5);

    let refuseMsg = `${person.name} hesitated: "I love you, but our relationship needs more time before taking such a serious leap." (-5% Closeness).`;
    if (window.getMoveInLine) {
      refuseMsg = window.getMoveInLine(person, character, false);
    }

    return {
      success: true,
      agreed: false,
      title: `Not Ready Yet`,
      message: refuseMsg,
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

    let propMsg = `Down on one knee in the lamplight, you presented the ring. Tears filled ${person.name}'s eyes as they gasped: "YES! A thousand times, yes!" (${person.name} is now your ${person.role}!) (+20% Happiness, +20% Closeness).`;
    if (window.getProposeMarriageLine) {
      propMsg = `${window.getProposeMarriageLine(person, character, true, ringTier)} (${person.name} is now your ${person.role}!) (+20% Happiness, +20% Closeness).`;
    }

    return {
      success: true,
      accepted: true,
      title: `SHE/HE SAID YES!`,
      message: propMsg,
      effects: { relationship: 20, happiness: 20, sanity: 6, money: -cost }
    };
  } else {
    person.relationship = Math.max(0, person.relationship - 15);
    applyKinStatEffect(character, 'happiness', -12);

    let rejMsg = `${person.name} stepped backward, looking pained: "I can't wear this. We aren't ready for marriage." The rejection cuts deep (-12% Happiness, -15% Closeness).`;
    if (window.getProposeMarriageLine) {
      rejMsg = window.getProposeMarriageLine(person, character, false, ringTier);
    }

    return {
      success: true,
      accepted: false,
      title: `Proposal Rejected`,
      message: rejMsg,
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

  let weddingMsg = `${venues[venueType] || venues.courthouse} You are officially married to your ${person.role}, ${person.name}! (+25% Happiness, 100% Closeness).`;
  if (window.getWeddingCeremonyLine) {
    weddingMsg = `${window.getWeddingCeremonyLine(person, character, venueType)} You are officially married to your ${person.role}, ${person.name}! (+25% Happiness, 100% Closeness).`;
  }

  return {
    success: true,
    title: `Just Married!`,
    message: weddingMsg,
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

    let babyMsg = `A healthy baby ${child.role.toLowerCase()} was welcomed into the world: ${child.name}! You and ${person.name} wept with profound joy (+20% Happiness, +10% Humanity).`;
    if (window.getConceiveChildLine) {
      babyMsg = `A healthy baby ${child.role.toLowerCase()} was welcomed into the world: ${child.name}! ${window.getConceiveChildLine(person, character)} (+20% Happiness, +10% Humanity).`;
    }

    return {
      success: true,
      conceived: true,
      title: `A New Soul is Born!`,
      message: babyMsg,
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

  let breakMsg = wasMarried
    ? `After bitter court arguments, the marriage was legally dissolved. Assets were split and ${person.name} walked out of your life${settlement > 0 ? ` (Settlement Paid: ${window.formatMoney(settlement, character.countryCode)})` : ''} (-18% Happiness, -5% Sanity).`
    : `You and ${person.name} had a tearful, heartbreaking conversation and packed your separate bags. You are no longer together (-18% Happiness).`;
  if (window.getBreakupLine) {
    breakMsg = window.getBreakupLine(person, character, wasMarried);
    if (wasMarried && settlement > 0) {
      breakMsg += ` (Settlement Paid: ${window.formatMoney(settlement, character.countryCode)})`;
    }
  }

  return {
    success: true,
    title: wasMarried ? `Divorce Finalized` : `Relationship Ended`,
    message: breakMsg,
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
  let message = `${window.getRandomElement(insults)} (-${relLoss}% Relationship, -2% Happiness).`;
  if (window.getArgueLine) {
    message = window.getArgueLine(person, character, relLoss);
  }

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

  if (window.getInvestigateLine) {
    clue = window.getInvestigateLine(person, character, revealed);
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

  let message = `${window.getRandomElement(tributes)}\nIn return, they bestowed +${shillingsGained} Paranormal Shillings upon you (+20% Relationship, +12% Occult, -2% Humanity).`;
  if (window.getTributeLine) {
    message = `${window.getTributeLine(person, character)}\nIn return, they bestowed +${shillingsGained} Paranormal Shillings upon you (+20% Relationship, +12% Occult, -2% Humanity).`;
  }

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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';
  const isMother = person.role.includes('Mother');
  const isFather = person.role.includes('Father');
  const isGrand = person.role.includes('Grand');
  const isSibling = person.role.includes('Brother') || person.role.includes('Sister') || person.role.includes('Sibling');

  let message = "";
  let effects = { relationship: relGain, happiness: +8, vitality: +3, sanity: +3 };

  if (person.isRevealed && person.entityType !== 'human') {
    message = `You curled near ${person.name}'s side. A strange, glacial chill radiated through their garments, but their disguised arm curled gently around you (+${relGain}% Closeness, +4% Occult, -2% Sanity).`;
    effects = { relationship: relGain, occult: +4, sanity: -2, vitality: +2 };
  } else if (!isFamily) {
    message = `You leaned into ${person.name}'s side. They held your hand gently and let you rest against their arm (+${relGain}% Closeness, +5% Happiness).`;
    effects = { relationship: relGain, happiness: +5, sanity: +2 };
  } else if (atmo === 'cold_detached') {
    if (isFather) {
      message = `You crawled close and leaned against your father's trouser leg. He sat motionless as an icy granite statue, glancing down with mild, formal detachment before tapping your forehead with his fountain pen: "Composure, child. Even in infancy, self-command is necessary."`;
    } else if (isMother) {
      message = `You reached up toward your mother's silk gown. She paused, stiff and unyielding, offering only two delicate fingers for you to hold so her pressed cuffs wouldn't wrinkle.`;
    } else if (isSibling) {
      message = `You tried leaning against ${person.name}'s shoulder. They carefully adjusted their immaculate collar and edged away on the sofa, offering only a brief, chilly nod.`;
    } else if (isGrand) {
      message = `${person.name} allowed you to sit beside their velvet armchair, resting a dry, liver-spotted hand atop your head for exactly ten measured seconds before returning to their genealogy ledger.`;
    } else {
      message = `${person.name} offered a polite, distant pat on your shoulder with immaculate posture.`;
    }
    effects = { relationship: Math.max(1, Math.round(relGain * 0.6)), smarts: +2, sanity: +1, happiness: -3 };
  } else if (atmo === 'deeply_religious') {
    if (isFather) {
      message = `Your father held you tightly against his coarse black wool jacket, but his brow was furrowed with solemn anxiety. He murmured urgent prayers against demonic contagion into your hair, clutching an iron cross against your ribs.`;
    } else if (isMother) {
      message = `Your mother held you to her chest, rocking in the flickering candlelight. Tears dripped onto your cheeks as she wept, whispering: "Lord, wash the stain of original sin from this frail vessel."`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} pulled you into a tight, trembling embrace under the heavy wool blanket, both of you listening fearfully to the chapel bell tolling through the dark.`;
    } else if (isGrand) {
      message = `${person.name} wrapped you in a coarse ceremonial shawl smelling of frankincense and beeswax, chanting solemn benedictions to keep night-fiends away.`;
    } else {
      message = `${person.name} held you while reciting a verse of divine judgment over your brow.`;
    }
    effects = { relationship: relGain, humanity: +4, sanity: -2, happiness: +2 };
  } else if (atmo === 'religious') {
    if (isFather) {
      message = `Your father hoisted you onto his shoulder, humming a quiet church hymn as rain drummed against the stained glass.`;
    } else if (isMother) {
      message = `Your mother embraced you warmly, stroking your forehead while reciting a peaceful psalm until your breathing slowed.`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} cuddled beside you on the pew bench, sharing body heat in the drafty hall.`;
    } else if (isGrand) {
      message = `${person.name} held you close, humming ancient liturgical chants that smelled of dried roses and beeswax.`;
    } else {
      message = `${person.name} embraced you peacefully with quiet prayers of thanksgiving.`;
    }
    effects = { relationship: relGain, humanity: +3, sanity: +3, happiness: +4 };
  } else if (atmo === 'extremely_strict') {
    if (isFather) {
      message = `Your father permitted you to lean against his knee for a few moments, posture rigid. He checked his pocket watch: "A momentary respite is permitted, but pampering breeds weakness. Stand tall now."`;
    } else if (isMother) {
      message = `Your mother gave you a firm, disciplined embrace, straightening your posture with practiced hands: "Affection must be earned through excellence, little one."`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} hugged you quickly and looked nervously at the door, making sure neither of you were caught slacking on chores.`;
    } else if (isGrand) {
      message = `${person.name} gave your shoulder three firm, precise pats before gesturing for you to sit properly on your stool.`;
    } else {
      message = `${person.name} patted your back rhythmically and reminded you that discipline precedes comfort.`;
    }
    effects = { relationship: Math.round(relGain * 0.8), smarts: +3, happiness: -2, sanity: +2 };
  } else if (atmo === 'alcoholic') {
    if (isFather) {
      const isHarsh = Math.random() < 0.5;
      if (isHarsh) {
        message = `You crawled toward your father's armchair, but his heavy arm swung out blindly, pushing you back onto the carpet: "Not now, kid... my head's throbbing. Leave me be."`;
        effects = { relationship: -2, happiness: -5, sanity: -3 };
      } else {
        message = `Your father scooped you into his lap with sudden, desperate remorse. His woolen sweater smelled pungently of cheap whiskey, but his tears wet your hair: "You're all that's pure in this rotten city, kiddo."`;
        effects = { relationship: relGain, happiness: +4, sanity: -1 };
      }
    } else if (isMother) {
      message = `Your mother pulled you into a tight, exhausted embrace, burying her face into your neck as if clinging to a life raft in a storm.`;
      effects = { relationship: relGain, happiness: +4, sanity: +1, humanity: +3 };
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} scooped you up and held you tight in the back of the bedroom closet, muffling your sobs while shouting echoed downstairs.`;
      effects = { relationship: relGain, humanity: +5, sanity: +2 };
    } else if (isGrand) {
      message = `${person.name} wrapped their trembling arms around you, kissing your forehead: "You're safe with grandma/grandpa now, darling. Pay no mind to the shouting."`;
      effects = { relationship: relGain, happiness: +10, sanity: +5, vitality: +3 };
    } else {
      message = `${person.name} hugged you quickly, casting an uneasy glance down the hallway.`;
      effects = { relationship: relGain, sanity: -1, happiness: +2 };
    }
  } else if (atmo === 'eccentric_occult') {
    if (isFather) {
      message = `Your father gathered you into his velvet robes, smelling of sage and dried nightshade. He gently pressed an obsidian amulet to your forehead, humming in strange harmonic intervals.`;
    } else if (isMother) {
      message = `Your mother rocked you by the black scrying basin, tracing protective sigils across your spine with cold, scented oils.`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} curled under the heavy black velvet tapestry with you, whispering secrets about the spirits nesting in the baseboards.`;
    } else if (isGrand) {
      message = `${person.name} held you against their frail chest, where an antique bone talisman clicked softly with every slow, deliberate heartbeat.`;
    } else {
      message = `${person.name} held you close while burning fragrant lavender incense.`;
    }
    effects = { relationship: relGain, occult: +4, sanity: +2, happiness: +3 };
  } else if (atmo === 'working_class') {
    if (isFather) {
      message = `Your father scooped you into his muscular, soot-stained arms. Despite aching muscles from a twelve-hour blast furnace shift, he grinned and let you rest your head on his broad shoulder.`;
    } else if (isMother) {
      message = `Your mother bundled you into her faded flannel apron, kissing your temple while humming a lively dockside labor tune.`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} wrapped an oversized hand-me-down coat around both of you, sharing warmth by the whistling radiator.`;
    } else if (isGrand) {
      message = `${person.name} tucked you under a thick patchwork quilt, rubbing your cold feet until warmth returned.`;
    } else {
      message = `${person.name} gave you a big, hearty squeeze and shared their woolen scarf with you.`;
    }
    effects = { relationship: relGain, happiness: +6, vitality: +4 };
  } else {
    // Loving default
    if (isMother) {
      message = `You curled into your mother's warm embrace. She stroked your hair and rocked you gently until your breathing steadied.`;
    } else if (isFather) {
      message = `Your father hoisted you onto his shoulder, patting your back with his large, calloused hand until you relaxed.`;
    } else if (isGrand) {
      message = `${person.name} held you close in their knitted cardigan, humming a faint antique tune that smelled of lavender and old wool.`;
    } else {
      message = `You leaned into ${person.name}'s side. They held your hand gently and let you rest against their arm.`;
    }
    effects = { relationship: relGain, happiness: +8, vitality: +3, sanity: +3 };
  }

  if (window.getCuddleLine) {
    message = window.getCuddleLine(person, character);
  }

  return {
    success: true,
    message,
    effects
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';
  const isMother = person.role.includes('Mother');
  const isFather = person.role.includes('Father');
  const isGrand = person.role.includes('Grand');
  const isSibling = person.role.includes('Brother') || person.role.includes('Sister') || person.role.includes('Sibling');

  const words = ["'Ma-ma'", "'Da-da'", "'Mi-lk'", "'No-no'", "'Up-up'"];
  const chosen = window.getRandomElement(words);

  let message = "";
  let effects = { relationship: relGain, smarts: +5, happiness: +5 };

  if (person.entityType && person.entityType !== 'human' && person.isRevealed) {
    message = `You pointed your tiny finger at ${person.name} and let out rhythmic clicks. Its pupils dilated in cold, amused fascination.`;
    effects = { relationship: relGain, occult: +5, sanity: -2 };
  } else if (!isFamily) {
    message = `You babbled animatedly at ${person.name}, waving your arms. They smiled and repeated silly words back to you.`;
    effects = { relationship: relGain, smarts: +4, happiness: +4 };
  } else if (atmo === 'cold_detached') {
    if (isFather) {
      message = `You pointed your tiny hand at your father and babbled ${chosen}. He lowered his financial broadsheet an inch, observed your mouth movements with detached clinical scrutiny, uttered an indifferent "Mm," and went back to reading without touching you.`;
    } else if (isMother) {
      message = `You reached toward your mother, cooing ${chosen}. She gave a dry, polite nod: "Articulate syllables are expected of our pedigree. Refrain from dribbling on the Persian rug."`;
    } else if (isSibling) {
      message = `You gurgled and waved at your ${person.role.toLowerCase()} ${person.name}. They gave you a stiff, formal glance across the drawing room, returning immediately to their private violin study.`;
    } else if (isGrand) {
      message = `${person.name} peered down their gold-rimmed pince-nez: "Adequate diction. The vocal cords appear free of vulgar defects."`;
    } else {
      message = `You babbled at ${person.name}. They observed your efforts with cool, impassive composure.`;
    }
    effects = { relationship: Math.max(1, Math.round(relGain * 0.5)), smarts: +5, happiness: -3 };
  } else if (atmo === 'deeply_religious') {
    if (isFather) {
      message = `You pointed at your father and babbled ${chosen}. He frowned and pressed a heavy index finger to your lips: "Quiet, child. The evening examination of conscience is at hand. Idle chatter invites wickedness into the throat."`;
    } else if (isMother) {
      message = `You cooed ${chosen} from your crib. Your mother bowed her head over a carved rosary: "May that young tongue learn holy scripture before the devil teaches it worldly vanity."`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} knelt beside your crib and nervously whispered: "Say 'A-men', say 'A-men'! If you make noise during prayer hour, father will fetch the ruler!"`;
    } else if (isGrand) {
      message = `${person.name} anointed your tongue with a drop of bitter holy water, murmuring prayers to seal your infant speech against blasphemies.`;
    } else {
      message = `You babbled holy sounds while ${person.name} whispered solemn prayers over your cradle.`;
    }
    effects = { relationship: relGain, smarts: +3, sanity: -2, humanity: +4 };
  } else if (atmo === 'religious') {
    if (isFather) {
      message = `You pointed at your father and babbled ${chosen}. A serene smile crossed his face: "God willing, those little lips will speak words of truth and peace."`;
    } else if (isMother) {
      message = `Your mother beamed and clapped her hands: "Praise heaven! Listen to those sweet first words!"`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} held up an illustrated catechism card, cheering as you mimicked the syllables.`;
    } else if (isGrand) {
      message = `${person.name} chuckled warmly, whispering proverbs as you made playful baby sounds.`;
    } else {
      message = `You babbled happily at ${person.name}, who thanked the heavens for your bright voice.`;
    }
    effects = { relationship: relGain, smarts: +4, humanity: +3, happiness: +3 };
  } else if (atmo === 'extremely_strict') {
    if (isFather) {
      message = `You stammered ${chosen} toward your father. His eyes narrowed critically: "Do not mumble. Enunciate the consonant clearly. In this world, lazy speech reflects a lazy mind."`;
    } else if (isMother) {
      message = `Your mother corrected your posture with a firm hand: "Repeat it properly. Precision and discipline begin before you can walk."`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} hissed in panic: "Shh! Keep your voice down! If mother hears you yelling, we'll both get extra math drills!"`;
    } else if (isGrand) {
      message = `${person.name} tapped the arm of their mahogany chair: "Standards must be upheld. No baby gibberish at this table."`;
    } else {
      message = `You babbled at ${person.name}, who strictly corrected your pronunciation.`;
    }
    effects = { relationship: Math.round(relGain * 0.7), smarts: +6, happiness: -3 };
  } else if (atmo === 'alcoholic') {
    if (isFather) {
      const isIrritable = Math.random() < 0.5;
      if (isIrritable) {
        message = `You squeaked ${chosen} and rattled your spoon. Your father flinched, clutching his throbbing temples, and snarled groggily: "Shut it! Can't a working man get five minutes without that shrieking?!"`;
        effects = { relationship: -2, happiness: -5, smarts: +2 };
      } else {
        message = `You babbled ${chosen} at your father. His bleary, bloodshot eyes softened with sudden, mournful wonder. He let out a ragged breath and patted your hair: "Look at you... you're smarter than your old man already."`;
        effects = { relationship: relGain, smarts: +4, happiness: +3 };
      }
    } else if (isMother) {
      message = `Your mother managed a faint, tired smile, wiping a stray tear as she whispered: "You're my only sunshine in this dark house, little one."`;
      effects = { relationship: relGain, happiness: +5, smarts: +3 };
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} rushed over and popped a pacifier into your mouth, whispering: "Quiet, quiet! They're still passed out on the rug!"`;
      effects = { relationship: relGain, smarts: +3, sanity: -1 };
    } else if (isGrand) {
      message = `${person.name} sighed with ancient sorrow, cradling you away from the doorway: "Don't you fret, angel. Babble all you like with grandfolk."`;
      effects = { relationship: relGain, happiness: +7, sanity: +3 };
    } else {
      message = `You babbled at ${person.name}, who gave a quick, anxious shush toward the living room.`;
      effects = { relationship: relGain, smarts: +2, sanity: -1 };
    }
  } else if (atmo === 'eccentric_occult') {
    if (isFather) {
      message = `You pointed your tiny finger at your father and let out rhythmic clicks and vowels. His eyes flared with fascination: "Fascinating... the cadence matches the third cipher in the Book of Eibon. Say it once more."`;
    } else if (isMother) {
      message = `Your mother leaned over your cradle, eyes wide with esoteric delight: "The child remembers the pre-human tongue of the well! Listen how it hums!"`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} shook a rattle of dried snake vertebrae, chanting weird syllables in harmony with your babble.`;
    } else if (isGrand) {
      message = `${person.name} closed their eyes, divining portents from the pitch of your baby squeals.`;
    } else {
      message = `You babbled strange syllables at ${person.name}, who listened with occult reverence.`;
    }
    effects = { relationship: relGain, smarts: +4, occult: +5, sanity: -2 };
  } else if (atmo === 'working_class') {
    if (isFather) {
      message = `You reached up from your crib toward your father, shouting ${chosen}. He let out a booming belly laugh, wiping grease from his nose: "That's my tough little scrapper! Tell the whole street about it!"`;
    } else if (isMother) {
      message = `Your mother laughed warmly over her sewing machine, kissing your forehead: "Such a loud, strong voice! You'll never be pushed around."`;
    } else if (isSibling) {
      message = `Your ${person.role.toLowerCase()} ${person.name} cheered and made funny faces, coaching you to say silly slang.`;
    } else if (isGrand) {
      message = `${person.name} clapped their weathered hands, humming along to your babbling by the warm stove.`;
    } else {
      message = `You babbled loudly with ${person.name}, who cheered your strong lungs.`;
    }
    effects = { relationship: relGain, smarts: +5, happiness: +6 };
  } else {
    // Loving default
    if (isMother || isFather) {
      message = `You pointed at ${person.name} and tried to say ${chosen}. Their eyes lit up with pride as they gently coached your syllables.`;
    } else {
      message = `You babbled animatedly at ${person.name}, waving your arms. They smiled and repeated silly words back to you.`;
    }
    effects = { relationship: relGain, smarts: +5, happiness: +5 };
  }

  if (window.getBabbleLine) {
    message = window.getBabbleLine(person, character, chosen);
  }

  return {
    success: true,
    message,
    effects
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';

  let message = "";
  let effects = { relationship: relGain, vitality: +6, sanity: +4 };

  if (!isFamily) {
    message = `${person.name} prepared a warm bottle and gently supported your head while you drank, rocking you until you were full and sleepy.`;
  } else if (atmo === 'cold_detached') {
    message = `${person.name} held the calibrated glass bottle at a rigid, sterile angle with immaculate posture, checking a pocket watch every few sips until you finished in solemn silence.`;
    effects = { relationship: Math.max(1, Math.round(relGain * 0.6)), vitality: +5, sanity: +2, happiness: -2 };
  } else if (atmo === 'deeply_religious') {
    message = `${person.name} whispered an earnest blessing over the formula, watching your face with intense, solemn vigilance as you drank, ensuring you gave thanks in your heart.`;
    effects = { relationship: relGain, vitality: +5, humanity: +3, sanity: +2 };
  } else if (atmo === 'religious') {
    message = `${person.name} blessed the warm ceramic bottle and gently cradled your head, singing peaceful hymns until your tummy was full and your eyelids grew heavy.`;
    effects = { relationship: relGain, vitality: +6, sanity: +4, humanity: +2 };
  } else if (atmo === 'extremely_strict') {
    message = `${person.name} supported the bottle firmly at a precise forty-five degree angle, watching the volume markings closely to ensure you drank every ounce without dribbling or pausing.`;
    effects = { relationship: Math.round(relGain * 0.8), vitality: +6, smarts: +3 };
  } else if (atmo === 'alcoholic') {
    message = `${person.name} held the lukewarm bottle with trembling hands, swaying slightly on the creaking floorboards while smelling of stale gin, relieved when you finally finished drinking.`;
    effects = { relationship: relGain, vitality: +4, sanity: -1 };
  } else if (atmo === 'eccentric_occult') {
    message = `${person.name} fed you warm goat's milk steeped with chamomile and nightshade honey, humming ancient nursery runes into the rising steam until your dreams were deep and strange.`;
    effects = { relationship: relGain, vitality: +6, occult: +3, sanity: +3 };
  } else if (atmo === 'working_class') {
    message = `${person.name} sat in tired overalls beside the humming radiator, patiently holding the warm bottle until you drank your fill and burped contentedly against their shoulder.`;
    effects = { relationship: relGain, vitality: +7, happiness: +5 };
  } else {
    // Loving default
    message = `${person.name} prepared a warm bottle and gently supported your head while you drank, rocking you until you were full and sleepy.`;
  }

  if (window.getFeedMilkLine) {
    message = window.getFeedMilkLine(person, character);
  }

  return {
    success: true,
    message,
    effects
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

  const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
  const isFamily = person.category === 'family';

  let message = "";
  let effects = { relationship: relGain, happiness: +8, vitality: +2 };

  if (!isFamily) {
    message = `${person.name} covered their face with both hands, waited two seconds, and shouted 'PEEK-A-BOO!' with a funny grin, sending you into fits of giggles.`;
  } else if (atmo === 'cold_detached') {
    message = `${person.name} raised a crisp linen napkin before their face, lowered it after two seconds with an utterly unblinking, impassive stare, and stated: "I have returned. Demonstrating object permanence is fundamental." You blinked back in quiet bafflement.`;
    effects = { relationship: Math.max(1, Math.round(relGain * 0.5)), smarts: +3, happiness: -2 };
  } else if (atmo === 'deeply_religious') {
    message = `${person.name} held an ornate leather hymnbook before their eyes, lowered it with a solemn, unsmiling gaze, and whispered: "The eyes of God never hide, child. Even when darkness covers the face, all secrets remain visible." A chill ran down your tiny spine.`;
    effects = { relationship: relGain, humanity: +3, sanity: -2 };
  } else if (atmo === 'religious') {
    message = `${person.name} hid behind an embroidered linen cloth and popped out with a bright, gentle smile, tickling your tummy and praising heaven for your happy laughter.`;
    effects = { relationship: relGain, happiness: +6, humanity: +2 };
  } else if (atmo === 'extremely_strict') {
    message = `${person.name} held a stiff cardboard folder before their eyes, lowered it after exactly three seconds by the kitchen clock, and noted: "Focus test passed. Target tracking: acceptable. No unseemly squirming."`;
    effects = { relationship: Math.round(relGain * 0.7), smarts: +4, happiness: -1 };
  } else if (atmo === 'alcoholic') {
    const isSlumped = Math.random() < 0.5;
    if (isSlumped) {
      message = `${person.name} slumped forward, burying their face in their hands... and stayed frozen like that for a long, alarming minute, groaning into their palms while you sat waiting in silence.`;
      effects = { relationship: -1, happiness: -4, sanity: -2 };
    } else {
      message = `${person.name} ducked behind a tattered cardigan and jumped out with an exaggerated, drunken wobble, making you burst into giggles before they stumbled against the radiator.`;
      effects = { relationship: relGain, happiness: +5, sanity: -1 };
    }
  } else if (atmo === 'eccentric_occult') {
    message = `${person.name} covered their face with pale, slender fingers. When they parted their hands, their eyes reflected an unearthly violet luminescence that wasn't in the room, making you clap your hands in eerie delight.`;
    effects = { relationship: relGain, occult: +4, happiness: +4 };
  } else if (atmo === 'working_class') {
    message = `${person.name} ducked behind the evening newspaper, sprang out with a ridiculous monster face, and blew a loud, ticklish raspberry on your tummy that sent you into roaring giggles.`;
    effects = { relationship: relGain, happiness: +8, vitality: +3 };
  } else {
    // Loving default
    message = `${person.name} covered their face with both hands, waited two seconds, and shouted 'PEEK-A-BOO!' with a funny grin, sending you into fits of giggles.`;
  }

  if (window.getPeekabooLine) {
    message = window.getPeekabooLine(person, character);
  }

  return {
    success: true,
    message,
    effects
  };
}

// --- Annual Tick Simulation for Kin ---

function tickKinYear(character) {
  if (!character || !character.kin) return [];
  const logs = [];
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const kin = character.kin;
  const atmoId = (kin.atmosphere && kin.atmosphere.id) || 'loving';
  let alcoholicEventFired = false;
  let strictStipendHandled = false;

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

    // Atmosphere-driven Allowance for minors (Ages 5-17)
    if (character.age >= 5 && character.age <= 17) {
      if (atmoId === 'alcoholic') {
        if (!alcoholicEventFired) {
          alcoholicEventFired = true;
          const roll = Math.random();
          if (roll < 0.15) {
            // Theft from minor's piggy bank
            if (character.money > 0) {
              const stolen = Math.min(character.money, Math.max(5, Math.round((Math.floor(Math.random() * 15) + 5) * country.wageMultiplier * 2)));
              character.money -= stolen;
              character.stats.happiness = Math.max(0, character.stats.happiness - 5);
              logs.push(`[PIGGY BANK RAID] Your ${p.role.toLowerCase()}, ${p.name}, snuck into your room while you were out and took ${window.formatMoney(stolen, character.countryCode)} from your savings for late-night liquor (-5% Happiness).`);
            } else {
              logs.push(`Your ${p.role.toLowerCase()}, ${p.name}, rummaged through your bedroom drawers hunting for spare coins to buy alcohol, cursing when they found nothing.`);
            }
          } else if (roll < 0.70) {
            // 55% chance: missed allowance
            logs.push(`No allowance this year from your ${p.role.toLowerCase()}, ${p.name}; grocery and pocket money was lost to tavern tabs and liquor runs.`);
          } else {
            // 30% chance: remorseful crumpled bill
            const baseUSD = Math.floor(Math.random() * 15) + 5;
            const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
            character.money += totalAllowance;
            logs.push(`Your ${p.role.toLowerCase()}, ${p.name}, tearfully pressed a crumpled, alcohol-scented ${window.formatMoney(totalAllowance, character.countryCode)} into your palm, slurring an apology for last week's shouting.`);
          }
        } else if (p.dynamicTrait && p.dynamicTrait.includes('Weary') && p.relationship > 50) {
          // Weary parent secretly slips a small bill
          const baseUSD = Math.floor(Math.random() * 8) + 4;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Your weary ${p.role.toLowerCase()}, ${p.name}, secretly slipped ${window.formatMoney(totalAllowance, character.countryCode)} into your coat pocket when no one was looking.`);
        }
      } else if (atmoId === 'extremely_strict') {
        if (!strictStipendHandled) {
          strictStipendHandled = true;
          if (character.stats.smarts >= 60) {
            const baseUSD = Math.floor(Math.random() * 20) + 10;
            const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
            character.money += totalAllowance;
            logs.push(`[ACADEMIC STIPEND] Your ${p.role.toLowerCase()}, ${p.name}, inspected your school marks and grudgingly released your ${window.formatMoney(totalAllowance, character.countryCode)} conduct stipend.`);
          } else {
            character.stats.happiness = Math.max(0, character.stats.happiness - 2);
            logs.push(`[STIPEND WITHHELD] Your ${p.role.toLowerCase()}, ${p.name}, withheld your yearly allowance due to unsatisfactory academic marks and discipline (-2% Happiness).`);
          }
        }
      } else if (atmoId === 'cold_detached') {
        if (p.relationship > 40) {
          const baseUSD = Math.floor(Math.random() * 25) + 15;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Received a quarterly ${window.formatMoney(totalAllowance, character.countryCode)} allowance from your ${p.role.toLowerCase()}, ${p.name}, accompanied by a formal bank deposit receipt.`);
        }
      } else if (atmoId === 'working_class') {
        if (p.relationship > 45) {
          const baseUSD = Math.floor(Math.random() * 10) + 5;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Your ${p.role.toLowerCase()}, ${p.name}, handed you ${window.formatMoney(totalAllowance, character.countryCode)} in carefully counted coins saved from overtime shifts, apologizing that it couldn't be more.`);
        }
      } else if (atmoId === 'deeply_religious') {
        if (p.relationship > 45) {
          const baseUSD = Math.floor(Math.random() * 15) + 8;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Received ${window.formatMoney(totalAllowance, character.countryCode)} in allowance from your ${p.role.toLowerCase()}, ${p.name}, with a stern reminder that at least ten percent belongs in the parish alms box.`);
        }
      } else if (atmoId === 'religious') {
        if (p.relationship > 50) {
          const baseUSD = Math.floor(Math.random() * 16) + 10;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Received ${window.formatMoney(totalAllowance, character.countryCode)} pocket allowance from your ${p.role.toLowerCase()}, ${p.name}, with a gentle reminder to spend it honestly and avoid vanity.`);
        }
      } else if (atmoId === 'eccentric_occult') {
        if (p.relationship > 50) {
          const baseUSD = Math.floor(Math.random() * 20) + 10;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Received ${window.formatMoney(totalAllowance, character.countryCode)} allowance from your ${p.role.toLowerCase()}, ${p.name}, slipped inside an envelope marked with curious astrological symbols.`);
        }
      } else {
        // loving and fallback
        if (p.relationship > 50) {
          const baseUSD = Math.floor(Math.random() * 22) + 12;
          const totalAllowance = Math.round(baseUSD * country.wageMultiplier * 10);
          character.money += totalAllowance;
          logs.push(`Received ${window.formatMoney(totalAllowance, character.countryCode)} in generous pocket allowance for sweets and books from your loving ${p.role.toLowerCase()}, ${p.name}.`);
        }
      }
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
window.prayWithFamily = prayWithFamily;
window.walkOnEggshells = walkOnEggshells;
window.presentReportCard = presentReportCard;
window.seekGrandparentHaven = seekGrandparentHaven;
window.FAMILY_ATMOSPHERES = FAMILY_ATMOSPHERES;
window.PARENT_OCCUPATIONS_DATA = PARENT_OCCUPATIONS_DATA;
window.HOUSEHOLD_RESIDENCES = HOUSEHOLD_RESIDENCES;
window.createEmptyActionsDone = createEmptyActionsDone;
window.FAMILY_MILESTONES = FAMILY_MILESTONES;
window.FAMILY_HOME_DYNAMICS = FAMILY_HOME_DYNAMICS;
window.FAMILY_KIN_VIGNETTES = FAMILY_KIN_VIGNETTES;
window.getFamilyMilestone = getFamilyMilestone;
window.getFamilyHomeDynamic = getFamilyHomeDynamic;
window.getFamilyKinVignette = getFamilyKinVignette;
