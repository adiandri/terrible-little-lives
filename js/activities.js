// Activities & Agency Engine for Terrible Little Lives
// Governs annual energy pool, City of Buttons categories, recreation, exploration & occult encounters

const ACTIVITY_CATEGORIES_DATA = {
  work: {
    id: "work",
    name: "Work & Careers",
    desc: "Employment, shifts, overtime, and mundane livelihoods.",
    icon: "briefcase",
    iconColor: "text-amber-400",
    shortcut: "careers"
  },
  education: {
    id: "education",
    name: "Education & Academics",
    desc: "Academic institutions, lectures, library archives, and faculty consultations.",
    icon: "graduation-cap",
    iconColor: "text-edu-sky",
    shortcut: "education"
  },
  money: {
    id: "money",
    name: "Money & Finances",
    desc: "Allowances, lottery scratchcards, savings, and speculative financial ventures.",
    icon: "coins",
    iconColor: "text-amber-300"
  },
  home: {
    id: "home",
    name: "Home & Quarters",
    desc: "Domestic routines, chores, deep rest, and forbidden basement exploration.",
    icon: "home",
    iconColor: "text-emerald-400"
  },
  relationships: {
    id: "relationships",
    name: "Relationships & Romance",
    desc: "Courtship, secret admirers, candlelit dates, and bitter heartbreaks.",
    icon: "heart",
    iconColor: "text-rose-400"
  },
  family: {
    id: "family",
    name: "Family & Kin",
    desc: "Parental affection, sibling rivalries, family dinners, and ancestral heritage.",
    icon: "users",
    iconColor: "text-purple-400",
    shortcut: "kin"
  },
  social: {
    id: "social",
    name: "Social & Companions",
    desc: "Friendship circles, neighborhood gossip, soirees, and peer group gatherings.",
    icon: "user-plus",
    iconColor: "text-sky-400"
  },
  media: {
    id: "media",
    name: "Media & Broadcasts",
    desc: "Television broadcasts, creature features, dark wave radio, and classic novels.",
    icon: "tv",
    iconColor: "text-sky-300"
  },
  hobbies: {
    id: "hobbies",
    name: "Hobbies & Crafts",
    desc: "Painting, mournful instruments, creative writing, and dark botany.",
    icon: "palette",
    iconColor: "text-amber-400"
  },
  games: {
    id: "games",
    name: "Games & Amusements",
    desc: "Consoles, playground games, tactical chess, and cemetery hide-and-seek.",
    icon: "gamepad-2",
    iconColor: "text-emerald-400"
  },
  travel: {
    id: "travel",
    name: "Travel & Excursions",
    desc: "Road trips through fog, seaside retreats, and expeditions to distant towns.",
    icon: "car",
    iconColor: "text-rose-400"
  },
  places: {
    id: "places",
    name: "Places & Landmarks",
    desc: "Ancient cemeteries, echoing catacombs, public parks, and historic archives.",
    icon: "map-pin",
    iconColor: "text-purple-400"
  },
  medical: {
    id: "medical",
    name: "Medical & Clinical Care",
    desc: "Physicians, emergency treatments, bitter tonics, and aesthetic procedures.",
    icon: "stethoscope",
    iconColor: "text-rose-400"
  },
  mental: {
    id: "mental",
    name: "Mental Health & Mind",
    desc: "Psychoanalysis, introspective journaling, meditation, and sanitarium retreats.",
    icon: "brain",
    iconColor: "text-purple-300"
  },
  crime: {
    id: "crime",
    name: "Crime & Underworld",
    desc: "Petty theft, grave desecration, vandalism, and the Dark Altar.",
    icon: "shield-alert",
    iconColor: "text-crimson",
    shortcut: "dark_altar"
  },
  legal: {
    id: "legal",
    name: "Legal & Judiciary",
    desc: "Attorneys, civil lawsuits, municipal petitions, and courtroom battles.",
    icon: "scale",
    iconColor: "text-amber-400"
  },
  phone: {
    id: "phone",
    name: "Phone & Communications",
    desc: "Cryptic text messages, phone calls to kin, and social media doomscrolling.",
    icon: "smartphone",
    iconColor: "text-sky-400"
  },
  internet: {
    id: "internet",
    name: "Internet & Cyberspace",
    desc: "Encrypted onion forums, occult search engines, and illicit auctions.",
    icon: "globe",
    iconColor: "text-teal-400"
  },
  pets: {
    id: "pets",
    name: "Pets & Familiars",
    desc: "Adopting companions, caring for familiars, and bonding with supernatural beasts.",
    icon: "cat",
    iconColor: "text-amber-400",
    shortcut: "pets"
  },
  wildlife: {
    id: "wildlife",
    name: "Wildlife & Nature",
    desc: "Raven feeding, twilight bat colonies, stray felines, and haunted woods.",
    icon: "trees",
    iconColor: "text-emerald-400"
  },
  horror: {
    id: "horror",
    name: "Horror & The Unseen",
    desc: "Séances, Ouija boards, crypt visits, and communion with shadowy presences.",
    icon: "flame",
    iconColor: "text-purple-400"
  },
  random: {
    id: "random",
    name: "The Wheel of Fate",
    desc: "Roll the cosmic dice of destiny for bizarre serendipity, strange boons, or perils.",
    icon: "dices",
    iconColor: "text-amber-400"
  }
};

const ACTIVITIES_LIST = [
  // ==========================================
  // 1. LIFE: WORK
  // ==========================================
  {
    id: "work_overtime",
    name: "Work Overtime Shift",
    category: "work",
    icon: "clock",
    minAge: 18,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Clock in for a grueling night shift to boost your bank account at the expense of sanity.",
    run: (character, attemptIndex = 0) => {
      const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || { wageMultiplier: 1.0 };
      const basePay = Math.round((Math.floor(Math.random() * 150) + 120) * (country.wageMultiplier || 1.0));
      character.money = (character.money || 0) + basePay;
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 3);
      character.stats.vitality = Math.max(0, (character.stats.vitality || 50) - 2);
      return {
        success: true,
        title: "Overtime Completed",
        message: `You endured a relentless evening shift under flickering fluorescent tubes. Earned ${window.formatMoney ? window.formatMoney(basePay, character.countryCode) : '$' + basePay} (+Money, -Sanity, -Vitality).`,
        effects: { money: basePay, sanity: -3, vitality: -2 }
      };
    }
  },
  {
    id: "side_gig_oddjobs",
    name: "Neighborhood Odd Jobs",
    category: "work",
    icon: "hammer",
    minAge: 12,
    maxAge: 18,
    maxPerYear: 6,
    desc: "Rake dead autumn leaves, shovel snow, or deliver town circulars for pocket money.",
    run: (character, attemptIndex = 0) => {
      const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || { wageMultiplier: 1.0 };
      const earned = Math.round((Math.floor(Math.random() * 40) + 25) * (country.wageMultiplier || 1.0));
      character.money = (character.money || 0) + earned;
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 2);
      return {
        success: true,
        title: "Odd Jobs Done",
        message: `You spent the afternoon helping an elderly neighbor clear damp pine needles. Earned ${window.formatMoney ? window.formatMoney(earned, character.countryCode) : '$' + earned} (+Money, +Vitality).`,
        effects: { money: earned, vitality: 2 }
      };
    }
  },
  {
    id: "work_socialize_colleagues",
    name: "Socialize with Coworkers",
    category: "work",
    icon: "coffee",
    minAge: 18,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Join colleagues for black coffee or cheap drinks after hours to trade office politics.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 2);
      return {
        success: true,
        title: "Office Banter",
        message: "You traded cynical jokes and office gossip in a booth at the greasy diner down the street (+Happiness, +Smarts).",
        effects: { happiness: 5, smarts: 2 }
      };
    }
  },

  // ==========================================
  // 1. LIFE: EDUCATION
  // ==========================================
  {
    id: "study_harder",
    name: "Study Diligently for School",
    category: "education",
    icon: "graduation-cap",
    minAge: 5,
    maxAge: 25,
    maxPerYear: 8,
    desc: "Cram textbooks and complete problem sets late into the night.",
    run: (character, attemptIndex = 0) => {
      const smartsGain = attemptIndex === 0 ? 5 : (attemptIndex === 1 ? 3 : 1);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + smartsGain);
      character.stats.happiness = Math.max(0, (character.stats.happiness || 50) - 2);
      if (character.education && character.education.enrolled) {
        character.education.grades = Math.min(100, (character.education.grades || 60) + 4);
      }
      return {
        success: true,
        title: "Academic Devotion",
        message: `You reviewed formulas and history dates until 1:00 AM under a buzzing desk lamp (+${smartsGain}% Smarts, -2% Happiness, +Grades).`,
        effects: { smarts: smartsGain, happiness: -2 }
      };
    }
  },
  {
    id: "read_library",
    name: "Read at the Public Library",
    category: "education",
    icon: "book-open",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 8,
    desc: "Browse dusty bookshelves, encyclopedias, and regional municipal archives.",
    run: (character, attemptIndex = 0) => {
      const smartsGain = attemptIndex === 0 ? 5 : 2;
      const sanGain = attemptIndex === 0 ? 3 : 1;
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + smartsGain);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + sanGain);
      return {
        success: true,
        title: "Quiet Study",
        message: `In the silent basement stacks, you read through illustrated encyclopedias of architecture and human biology (+${smartsGain}% Smarts, +${sanGain}% Sanity).`,
        effects: { smarts: smartsGain, sanity: sanGain }
      };
    }
  },

  // ==========================================
  // 1. LIFE: MONEY
  // ==========================================
  {
    id: "ask_parents_allowance",
    name: "Ask Parents for Allowance",
    category: "money",
    icon: "coins",
    minAge: 4,
    maxAge: 18,
    maxPerYear: 3,
    desc: "Put on your most innocent expression and petition your parents for some spending money.",
    run: (character) => {
      const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || { wageMultiplier: 1.0 };
      const parents = (character.kin && character.kin.parents) ? character.kin.parents.filter(p => p.alive) : [];
      let parentCloseness = 50;
      let parentSalaryTier = 1.0;
      if (parents.length > 0) {
        parentCloseness = parents[0].relationship || 50;
        if (parents[0].salary && parents[0].salary > 50000) parentSalaryTier = 2.0;
      }
      if (parentCloseness < 30) {
        return {
          success: false,
          title: "Request Denied",
          message: "Your parents scoffed at your request. 'Money does not grow on dead trees!' (-Happiness)."
        };
      }
      const allowance = Math.round((Math.floor(Math.random() * 20) + 15) * parentSalaryTier * (country.wageMultiplier || 1.0));
      character.money = (character.money || 0) + allowance;
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      return {
        success: true,
        title: "Allowance Granted",
        message: `Your parents handed you crisp bills totaling ${window.formatMoney ? window.formatMoney(allowance, character.countryCode) : '$' + allowance} (+Money, +Happiness).`,
        effects: { money: allowance, happiness: 4 }
      };
    }
  },
  {
    id: "buy_lottery_scratch",
    name: "Buy Lottery Scratchcard ($10)",
    category: "money",
    icon: "ticket",
    minAge: 18,
    maxAge: 99,
    maxPerYear: 10,
    desc: "Spend $10 at the corner kiosk to scratch off silver foil and test your fortunes.",
    run: (character) => {
      if ((character.money || 0) < 10) {
        return { success: false, title: "Insufficient Funds", message: "You need at least $10 to purchase a scratchcard." };
      }
      character.money -= 10;
      const roll = Math.random();
      if (roll < 0.05) {
        // Big win
        character.money += 250;
        character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 20);
        return {
          success: true,
          title: "Winning Scratchcard!",
          message: "Three matching skull sigils lined up! You cashed in a $250 prize (+Money, +Happiness).",
          effects: { money: 240, happiness: 20 }
        };
      } else if (roll < 0.25) {
        // Small win
        character.money += 30;
        character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
        return {
          success: true,
          title: "Modest Win",
          message: "You won $30 on the silver foil card (+Money).",
          effects: { money: 20, happiness: 5 }
        };
      } else {
        character.stats.happiness = Math.max(0, (character.stats.happiness || 50) - 2);
        return {
          success: true,
          title: "Losing Ticket",
          message: "All numbers were mismatched. You threw the silver shavings into the trash bin (-$10).",
          effects: { money: -10, happiness: -2 }
        };
      }
    }
  },

  // ==========================================
  // 1. LIFE: HOME
  // ==========================================
  {
    id: "drink_milk",
    name: "Drink Warm Milk Bottle",
    category: "home",
    icon: "cup-soda",
    minAge: 0,
    maxAge: 3,
    maxPerYear: 10,
    desc: "Drink sweet warm formula from a glass bottle until your eyelids grow pleasantly heavy.",
    run: (character, attemptIndex = 0) => {
      const vitGain = attemptIndex === 0 ? 5 : 2;
      const sanGain = attemptIndex === 0 ? 3 : 1;
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + vitGain);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + sanGain);
      return {
        success: true,
        title: "Warm Feeding",
        message: "You drank the sweet warm milk greedily, letting out a drowsy sigh (+Vitality, +Sanity).",
        effects: { vitality: vitGain, sanity: sanGain }
      };
    }
  },
  {
    id: "learn_walk",
    name: "Learn to Crawl & Walk",
    category: "home",
    icon: "footprints",
    minAge: 0,
    maxAge: 3,
    maxPerYear: 10,
    desc: "Pull yourself up against the furniture and take clumsy, wobbling steps across the rug.",
    run: (character, attemptIndex = 0) => {
      const vitGain = attemptIndex === 0 ? 6 : 2;
      const smartsGain = attemptIndex === 0 ? 3 : 1;
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + vitGain);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + smartsGain);
      return {
        success: true,
        title: "Motor Milestones",
        message: "You took four wobbly steps toward the doorway, clapping your tiny hands in glee (+Vitality, +Smarts).",
        effects: { vitality: vitGain, smarts: smartsGain }
      };
    }
  },
  {
    id: "learn_talk",
    name: "Babble & Learn to Talk",
    category: "home",
    icon: "message-square",
    minAge: 1,
    maxAge: 4,
    maxPerYear: 10,
    desc: "Practice vocal syllables, mimic words you overhear, and try to speak your thoughts.",
    run: (character, attemptIndex = 0) => {
      const smartsGain = attemptIndex === 0 ? 5 : 2;
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + smartsGain);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      return {
        success: true,
        title: "Early Speech",
        message: "You articulated new words clearly, pointing at objects with pride (+Smarts, +Happiness).",
        effects: { smarts: smartsGain, happiness: 4 }
      };
    }
  },
  {
    id: "tidy_room_chores",
    name: "Do Household Chores",
    category: "home",
    icon: "brush",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Sweep the dusty floorboards, wash dishes in warm soapy water, and organize your room.",
    run: (character) => {
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 2);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 1);
      if (character.kin && character.kin.parents) {
        character.kin.parents.forEach(p => {
          if (p.alive) p.relationship = Math.min(100, (p.relationship || 50) + 3);
        });
      }
      return {
        success: true,
        title: "Chores Complete",
        message: "The corridor floorboards shone with fresh linseed oil; your parents commended your diligence (+Vitality, +Parent Closeness).",
        effects: { vitality: 2, smarts: 1 }
      };
    }
  },
  {
    id: "rest_nap",
    name: "Take a Deep Restorative Nap",
    category: "home",
    icon: "bed",
    minAge: 0,
    maxAge: 99,
    maxPerYear: 8,
    desc: "Curl beneath heavy wool blankets and let the world drift away in peaceful slumber.",
    run: (character) => {
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 5);
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 4);
      return {
        success: true,
        title: "Peaceful Slumber",
        message: "You slept for three uninterrupted hours listening to rain tap against the glass (+Sanity, +Vitality).",
        effects: { sanity: 5, vitality: 4 }
      };
    }
  },
  {
    id: "sneak_basement",
    name: "Sneak into the Cellar / Attic",
    category: "home",
    icon: "key",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Slip past the padlock on the crawlspace door with a sputtering flashlight.",
    run: (character, attemptIndex = 0) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 6);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 2);
      const shillings = Math.floor(Math.random() * 3) + 1;
      character.shillings = (character.shillings || 0) + shillings;
      return {
        success: true,
        title: "Hidden Casket",
        message: `Behind an old furnace baffle, you found an antique tin with +${shillings} Paranormal Shillings and cryptic notes (+Occult, -Sanity).`,
        effects: { occult: 6, sanity: -2, shillings }
      };
    }
  },

  // ==========================================
  // 2. PEOPLE: RELATIONSHIPS
  // ==========================================
  {
    id: "go_on_blind_date",
    name: "Go on a Blind Date",
    category: "relationships",
    icon: "heart",
    minAge: 16,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Meet an acquaintance arranged through mutual connections for coffee and conversation.",
    run: (character) => {
      const looks = character.stats.looks || 50;
      const successChance = looks / 100 * 0.7 + 0.3;
      if (Math.random() < successChance) {
        character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 10);
        return {
          success: true,
          title: "Charming Date",
          message: "You shared quiet laughter over tea. Sparks flew across the candlelit table (+10% Happiness).",
          effects: { happiness: 10 }
        };
      } else {
        character.stats.happiness = Math.max(0, (character.stats.happiness || 50) - 4);
        return {
          success: true,
          title: "Awkward Silence",
          message: "The conversation stagnated into agonizing pauses. You excused yourself early (-Happiness).",
          effects: { happiness: -4 }
        };
      }
    }
  },
  {
    id: "flirt_romantic_interest",
    name: "Practice Romantic Charm",
    category: "relationships",
    icon: "sparkles",
    minAge: 14,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Polish your demeanor, practice flirtatious banter, and enhance your charisma.",
    run: (character) => {
      character.stats.looks = Math.min(100, (character.stats.looks || 50) + 2);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 3);
      return {
        success: true,
        title: "Polished Allure",
        message: "You studied your expressions in the mirror, mastering an enigmatic and intriguing gaze (+Looks, +Happiness).",
        effects: { looks: 2, happiness: 3 }
      };
    }
  },

  // ==========================================
  // 2. PEOPLE: FAMILY
  // ==========================================
  {
    id: "cuddle_parents",
    name: "Cuddle with Parents",
    category: "family",
    icon: "heart",
    minAge: 0,
    maxAge: 4,
    maxPerYear: 10,
    desc: "Rest your small head against your mother or father's chest, listening to their rhythmic breathing.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 6);
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 2);
      if (character.kin && character.kin.parents) {
        character.kin.parents.forEach(p => {
          if (p.alive) p.relationship = Math.min(100, (p.relationship || 50) + 6);
        });
      }
      return {
        success: true,
        title: "Loving Embrace",
        message: "Your mother rocked you gently in the wooden armchair while humming a soft melody (+Happiness, +Parent Closeness).",
        effects: { happiness: 6, vitality: 2 }
      };
    }
  },
  {
    id: "family_hearth_dinner",
    name: "Gather for Family Supper",
    category: "family",
    icon: "soup",
    minAge: 4,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Sit around the dinner table with your kin to share warm stew, freshly baked bread, and family news.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 3);
      if (character.kin) {
        ['parents', 'siblings', 'grandparents'].forEach(group => {
          if (character.kin[group]) {
            character.kin[group].forEach(person => {
              if (person.alive) person.relationship = Math.min(100, (person.relationship || 50) + 4);
            });
          }
        });
      }
      return {
        success: true,
        title: "Family Supper",
        message: "The dining table was filled with laughter and nostalgic stories. Warmth spread through the household (+Kin Closeness, +Happiness, +Sanity).",
        effects: { happiness: 5, sanity: 3 }
      };
    }
  },
  {
    id: "heart_to_heart_talk",
    name: "Heart-to-Heart Conversation",
    category: "family",
    icon: "message-circle",
    minAge: 6,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Confide your deepest worries and hopes to a family elder or sibling.",
    run: (character) => {
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 6);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      if (character.kin && character.kin.parents && character.kin.parents.length > 0) {
        character.kin.parents[0].relationship = Math.min(100, (character.kin.parents[0].relationship || 50) + 8);
      }
      return {
        success: true,
        title: "Deep Connection",
        message: "Sitting by the parlor window at twilight, you shared a comforting conversation about life and mortality (+Sanity, +Parent Closeness).",
        effects: { sanity: 6, happiness: 4 }
      };
    }
  },

  // ==========================================
  // 2. PEOPLE: SOCIAL
  // ==========================================
  {
    id: "find_friend",
    name: "Search for Companions",
    category: "social",
    icon: "user-plus",
    minAge: 4,
    maxAge: 25,
    maxPerYear: 5,
    desc: "Spend the afternoon socializing at the community center, skate park, or schoolyard.",
    run: (character) => {
      if (!character.kin) character.kin = window.generateFamily(character);
      character.kin.friends = character.kin.friends || [];
      if (character.kin.friends.length >= 6) {
        return { success: false, title: "Circle Full", message: "You already have a full circle of companions to keep up with!" };
      }
      const contexts = ["Public Park Bleachers", "Arcade Hall", "Schoolyard Steps", "Bicycle Trail", "Comic Shop"];
      const newFriend = window.generateNewFriend ? window.generateNewFriend(character, window.getRandomElement(contexts)) : { name: "Julian Gray", age: character.age, relationship: 60 };
      character.kin.friends.push(newFriend);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 6);
      return {
        success: true,
        title: "Made a New Friend",
        message: `You struck up a conversation with ${newFriend.name} (Age ${newFriend.age}). You traded phone numbers and agreed to hang out (+Happiness).`,
        effects: { happiness: 6 }
      };
    }
  },
  {
    id: "group_hangout",
    name: "Group Hangout with Friends",
    category: "social",
    icon: "users",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Gather your companions for pizza, bike rides, and nighttime campfire talks.",
    run: (character) => {
      if (!character.kin || !character.kin.friends || character.kin.friends.length === 0) {
        return { success: false, title: "No Friends Yet", message: "You don't have any companions yet. Go to the park or school to meet someone!" };
      }
      character.kin.friends.forEach(f => {
        if (f.alive) f.relationship = Math.min(100, (f.relationship || 50) + 6);
      });
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 7);
      return {
        success: true,
        title: "Group Gathering",
        message: "You gathered your companions together. Shared stories and late-night laughter warmed the evening (+Friendship, +Happiness).",
        effects: { happiness: 7 }
      };
    }
  },

  // ==========================================
  // 3. FUN: MEDIA
  // ==========================================
  {
    id: "watch_tv_cartoons",
    name: "Watch Saturday Morning Cartoons",
    category: "media",
    icon: "tv",
    minAge: 2,
    maxAge: 14,
    maxPerYear: 8,
    desc: "Sit cross-legged on the rug with a bowl of sugary cereal, engrossed in animated adventures.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 6);
      return {
        success: true,
        title: "Animated Fun",
        message: "You watched colorful talking animals outwit bumbling villains for three blissful hours (+Happiness).",
        effects: { happiness: 6 }
      };
    }
  },
  {
    id: "late_night_horror_movie",
    name: "Late-Night Creature Feature",
    category: "media",
    icon: "film",
    minAge: 12,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Watch a grainy VHS tape of a 1970s occult thriller in the dark with the volume turned low.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 4);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 2);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      return {
        success: true,
        title: "Midnight Shivers",
        message: "The eerie synthesizer soundtrack and shadow puppets left you with goosebumps (+Occult, +Happiness, -Sanity).",
        effects: { occult: 4, happiness: 4, sanity: -2 }
      };
    }
  },
  {
    id: "radio_static",
    name: "Listen to Shortwave Radio Static",
    category: "media",
    icon: "radio",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Dial between frequencies at 3:14 AM, listening for mysterious number stations.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 6);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 2);
      const shillings = 2;
      character.shillings = (character.shillings || 0) + shillings;
      return {
        success: true,
        title: "Number Station Broadcast",
        message: "Through crackling static, a cold voice recited coordinates matching your municipal cemetery (+Occult, +2 Shillings, -Sanity).",
        effects: { occult: 6, shillings, sanity: -2 }
      };
    }
  },
  {
    id: "read_gothic_novel",
    name: "Read Gothic Romance & Horror Novel",
    category: "media",
    icon: "book",
    minAge: 9,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Immerse yourself in tales of lonely moors, ancestral curses, and brooding aristocrats.",
    run: (character) => {
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 3);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 2);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      return {
        success: true,
        title: "Literary Escapism",
        message: "You devoured chapters of haunted manors and tragic love beneath the amber glow of a reading lamp (+Smarts, +Sanity, +Happiness).",
        effects: { smarts: 3, sanity: 2, happiness: 4 }
      };
    }
  },

  // ==========================================
  // 3. FUN: HOBBIES
  // ==========================================
  {
    id: "play_toys",
    name: "Play with Toys & Games",
    category: "hobbies",
    icon: "box",
    minAge: 1,
    maxAge: 10,
    maxPerYear: 8,
    desc: "Build wooden block towers or dress porcelain dolls in your bedroom.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 6);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 2);
      return {
        success: true,
        title: "Playtime",
        message: "You spent hours lining up toy lead soldiers along the radiator pipes (+Happiness, +Sanity).",
        effects: { happiness: 6, sanity: 2 }
      };
    }
  },
  {
    id: "sketch_and_paint",
    name: "Charcoal Sketching & Painting",
    category: "hobbies",
    icon: "palette",
    minAge: 5,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Smudge charcoal across rough paper or mix gloomy watercolors of overcast skies.",
    run: (character) => {
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 3);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      return {
        success: true,
        title: "Artistic Expression",
        message: "Your charcoal drawing of a skeletal weeping willow turned out remarkably striking (+Smarts, +Happiness).",
        effects: { smarts: 3, happiness: 5 }
      };
    }
  },
  {
    id: "play_instrument",
    name: "Practice Violin / Piano",
    category: "hobbies",
    icon: "music",
    minAge: 6,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Practice melancholic scales and baroque sonatas until calluses form on your fingertips.",
    run: (character) => {
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 4);
      character.stats.looks = Math.min(100, (character.stats.looks || 50) + 2);
      return {
        success: true,
        title: "Mournful Chords",
        message: "The rich, resonant tones echoed off the hallway plaster, mesmerizing everyone within earshot (+Smarts, +Looks).",
        effects: { smarts: 4, looks: 2 }
      };
    }
  },

  // ==========================================
  // 3. FUN: GAMES
  // ==========================================
  {
    id: "video_games",
    name: "Play Video Games",
    category: "games",
    icon: "gamepad-2",
    minAge: 6,
    maxAge: 99,
    maxPerYear: 8,
    desc: "Play pixelated roleplaying games and survival horrors on your console.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 7);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 2);
      return {
        success: true,
        title: "Gaming Marathon",
        message: "You solved intricate labyrinth puzzles and cleared retro pixel dungeons (+Happiness, +Smarts).",
        effects: { happiness: 7, smarts: 2 }
      };
    }
  },
  {
    id: "chess_tournament",
    name: "Play Chess Matches",
    category: "games",
    icon: "shield",
    minAge: 7,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Calculate fifteen moves ahead in intense games of strategic chess.",
    run: (character) => {
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 6);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 2);
      return {
        success: true,
        title: "Grandmaster Tactics",
        message: "You trapped your opponent's king with a brilliant knight sacrifice (+Smarts, +Sanity).",
        effects: { smarts: 6, sanity: 2 }
      };
    }
  },

  // ==========================================
  // 4. OUTSIDE: TRAVEL
  // ==========================================
  {
    id: "road_trip_countryside",
    name: "Road Trip to the Countryside",
    category: "travel",
    icon: "car",
    minAge: 16,
    maxAge: 99,
    maxPerYear: 3,
    desc: "Drive through autumn fog past crumbling barns and covered bridges.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 8);
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 4);
      return {
        success: true,
        title: "Country Excursion",
        message: "The crisp smell of burning leaves and open horizon invigorated your spirit (+Happiness, +Vitality).",
        effects: { happiness: 8, vitality: 4 }
      };
    }
  },
  {
    id: "seaside_dusk_retreat",
    name: "Seaside Fog Retreat",
    category: "travel",
    icon: "compass",
    minAge: 12,
    maxAge: 99,
    maxPerYear: 3,
    desc: "Walk along grey pebble beaches watching tide pools beneath sheer chalk cliffs.",
    run: (character) => {
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 7);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      return {
        success: true,
        title: "Sea Salt & Solitude",
        message: "The rhythmic crash of grey breakers cleared all clutter from your mind (+Sanity, +Happiness).",
        effects: { sanity: 7, happiness: 5 }
      };
    }
  },

  // ==========================================
  // 4. OUTSIDE: PLACES
  // ==========================================
  {
    id: "neighborhood_park",
    name: "Stroll Through Public Park",
    category: "places",
    icon: "trees",
    minAge: 4,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Wander along gravel paths, feed ducks in the pond, and enjoy the greenery.",
    run: (character) => {
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 4);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      return {
        success: true,
        title: "Park Stroll",
        message: "You enjoyed the fresh air beneath towering oak trees (+Vitality, +Happiness).",
        effects: { vitality: 4, happiness: 4 }
      };
    }
  },
  {
    id: "visit_ancient_graveyard",
    name: "Explore Ancient Cemetery",
    category: "places",
    icon: "map-pin",
    minAge: 6,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Weave among moss-covered 18th-century headstones and iron crypt gates.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 5);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 2);
      const shillings = 1;
      character.shillings = (character.shillings || 0) + shillings;
      return {
        success: true,
        title: "Mausoleum Peace",
        message: "You copied unusual epitaphs into your notebook and found a silver coin near a vault (+Occult, +1 Shilling, +Sanity).",
        effects: { occult: 5, sanity: 2, shillings }
      };
    }
  },

  // ==========================================
  // 5. HEALTH: MEDICAL
  // ==========================================
  {
    id: "doctor_general_checkup",
    name: "Doctor Routine Checkup",
    category: "medical",
    icon: "stethoscope",
    minAge: 0,
    maxAge: 99,
    maxPerYear: 2,
    desc: "Undergo a routine examination by a physician to assess vital organs.",
    run: (character) => {
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 8);
      return {
        success: true,
        title: "Health Examination",
        message: "The doctor listened to your heartbeat and pronounced your constitution sound (+Vitality).",
        effects: { vitality: 8 }
      };
    }
  },
  {
    id: "take_vitamins_tonics",
    name: "Take Iron Tonic & Vitamins",
    category: "medical",
    icon: "pill",
    minAge: 3,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Swallow spoonfuls of bitter blackstrap molasses and iron multivitamins.",
    run: (character) => {
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 4);
      return {
        success: true,
        title: "Vigorous Supplement",
        message: "A healthy flush of color returned to your cheeks (+Vitality).",
        effects: { vitality: 4 }
      };
    }
  },
  {
    id: "exercise_gym",
    name: "Exercise & Physical Workout",
    category: "medical",
    icon: "dumbbell",
    minAge: 12,
    maxAge: 99,
    maxPerYear: 8,
    desc: "Lift weights, sprint intervals, and sharpen physical stamina.",
    run: (character) => {
      character.stats.vitality = Math.min(100, (character.stats.vitality || 50) + 6);
      character.stats.looks = Math.min(100, (character.stats.looks || 50) + 3);
      return {
        success: true,
        title: "Intense Workout",
        message: "You pushed through rigorous physical sets until your muscles burned (+Vitality, +Looks).",
        effects: { vitality: 6, looks: 3 }
      };
    }
  },

  // ==========================================
  // 5. HEALTH: MENTAL
  // ==========================================
  {
    id: "meditation_journaling",
    name: "Introspective Journaling & Meditation",
    category: "mental",
    icon: "brain",
    minAge: 8,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Write your innermost shadows and existential thoughts into a locked journal.",
    run: (character) => {
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 6);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 3);
      return {
        success: true,
        title: "Cathartic Reflection",
        message: "Documenting your anxieties dispelled the fog of despair (+Sanity, +Happiness).",
        effects: { sanity: 6, happiness: 3 }
      };
    }
  },
  {
    id: "psychoanalysis_therapy",
    name: "Consult Psychoanalyst ($50)",
    category: "mental",
    icon: "sparkles",
    minAge: 14,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Lie back on a leather divan and discuss recurring nightmares with an analyst.",
    run: (character) => {
      if ((character.money || 0) < 50) {
        return { success: false, title: "Cannot Afford", message: "You need $50 to pay the therapist's consultation fee." };
      }
      character.money -= 50;
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 12);
      return {
        success: true,
        title: "Therapeutic Insight",
        message: "The therapist unraveled your cognitive distress with soothing precision (-$50, +12% Sanity).",
        effects: { money: -50, sanity: 12 }
      };
    }
  },

  // ==========================================
  // 6. TROUBLE: CRIME
  // ==========================================
  {
    id: "petty_shoplifting",
    name: "Petty Shoplifting",
    category: "crime",
    icon: "shopping-bag",
    minAge: 10,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Slip silver pens, chocolate bars, or small tools into your coat lining.",
    run: (character) => {
      if (Math.random() < 0.25) {
        character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 5);
        character.stats.happiness = Math.max(0, (character.stats.happiness || 50) - 8);
        return {
          success: true,
          title: "Caught by Storekeeper!",
          message: "The bell above the door chimed and a firm hand grabbed your collar! You were scolded thoroughly (-Sanity, -Happiness).",
          effects: { sanity: -5, happiness: -8 }
        };
      } else {
        const loot = 25;
        character.money = (character.money || 0) + loot;
        character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
        return {
          success: true,
          title: "Smooth Theft",
          message: "You slipped the goods past the register without anyone noticing (+$25).",
          effects: { money: loot, happiness: 5 }
        };
      }
    }
  },
  {
    id: "vandalism_graffiti",
    name: "Graffiti & Vandalism",
    category: "crime",
    icon: "pen-tool",
    minAge: 12,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Spray-paint occult symbols and rebellious poetry onto abandoned railway bridges.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 3);
      return {
        success: true,
        title: "Nighttime Tagging",
        message: "Your silver glyphs dried under the moonlight, striking terror into passersby (+Occult, +Happiness).",
        effects: { occult: 3, happiness: 5 }
      };
    }
  },

  // ==========================================
  // 6. TROUBLE: LEGAL
  // ==========================================
  {
    id: "retain_attorney",
    name: "Consult Criminal Attorney ($100)",
    category: "legal",
    icon: "scale",
    minAge: 18,
    maxAge: 99,
    maxPerYear: 2,
    desc: "Review your civil status and municipal standings with an experienced barrister.",
    run: (character) => {
      if ((character.money || 0) < 100) {
        return { success: false, title: "Cannot Afford", message: "The attorney requires a $100 retainer fee." };
      }
      character.money -= 100;
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 8);
      return {
        success: true,
        title: "Legal Representation Secured",
        message: "Your attorney filed pre-emptive motions protecting your estate and reputation (-$100, +Sanity).",
        effects: { money: -100, sanity: 8 }
      };
    }
  },

  // ==========================================
  // 7. DIGITAL: PHONE
  // ==========================================
  {
    id: "text_classmates_friends",
    name: "Send Cryptic Texts to Friends",
    category: "phone",
    icon: "message-square",
    minAge: 10,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Text weird late-night memes, gothic poems, and school rumors to your contacts.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 4);
      if (character.kin && character.kin.friends) {
        character.kin.friends.forEach(f => {
          if (f.alive) f.relationship = Math.min(100, (f.relationship || 50) + 3);
        });
      }
      return {
        success: true,
        title: "Chat Thread Active",
        message: "Your friends replied with enthusiastic voice memos and inside jokes (+Happiness, +Friendship).",
        effects: { happiness: 4 }
      };
    }
  },
  {
    id: "browse_social_media",
    name: "Doomscroll Social Media",
    category: "phone",
    icon: "smartphone",
    minAge: 12,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Scroll endlessly through feeds of strangers boasting about their manufactured fortunes.",
    run: (character) => {
      if (Math.random() < 0.5) {
        character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 3);
        return {
          success: true,
          title: "Doomscroll Abyss",
          message: "Sensationalist headlines and filtered vanity left you feeling hollow and exhausted (-3% Sanity).",
          effects: { sanity: -3 }
        };
      } else {
        character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 2);
        return {
          success: true,
          title: "Curious rabbit hole",
          message: "You stumbled upon a fascinating video essay detailing ancient architectural mysteries (+2% Smarts).",
          effects: { smarts: 2 }
        };
      }
    }
  },

  // ==========================================
  // 7. DIGITAL: INTERNET
  // ==========================================
  {
    id: "dark_web_forum",
    name: "Browse Encrypted Onion Boards",
    category: "internet",
    icon: "globe",
    minAge: 14,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Route your connection through nine relays to inspect bizarre anonymous message boards.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 6);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 3);
      const shillings = 2;
      character.shillings = (character.shillings || 0) + shillings;
      return {
        success: true,
        title: "Hidden Network",
        message: "You downloaded an encrypted archive of municipal occult blueprints (+Occult, +2 Shillings, -Sanity).",
        effects: { occult: 6, sanity: -3, shillings }
      };
    }
  },
  {
    id: "occult_knowledge_search",
    name: "Occult Folklore Deep-Dive",
    category: "internet",
    icon: "search",
    minAge: 10,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Search obscure digital archives for forgotten local superstitions and curses.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 5);
      character.stats.smarts = Math.min(100, (character.stats.smarts || 50) + 2);
      return {
        success: true,
        title: "Esoteric Discovery",
        message: "You found digitized microfiches of 19th-century church records mentioning demonic pacts (+Occult, +Smarts).",
        effects: { occult: 5, smarts: 2 }
      };
    }
  },

  // ==========================================
  // 8. ANIMALS: PETS
  // ==========================================
  {
    id: "play_with_pets",
    name: "Bond & Play with Household Pets",
    category: "pets",
    icon: "cat",
    minAge: 4,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Toss rubber toys, stroke velvet fur, and enjoy the pure company of your animal companions.",
    run: (character) => {
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 7);
      character.stats.sanity = Math.min(100, (character.stats.sanity || 50) + 4);
      if (character.pets && character.pets.length > 0) {
        character.pets.forEach(p => {
          if (p.alive) p.affection = Math.min(100, (p.affection || 50) + 10);
        });
      }
      return {
        success: true,
        title: "Furry Comfort",
        message: "Warm purrs and wagging tails filled the parlor with comfort (+Happiness, +Sanity).",
        effects: { happiness: 7, sanity: 4 }
      };
    }
  },

  // ==========================================
  // 8. ANIMALS: WILDLIFE
  // ==========================================
  {
    id: "feed_flock_of_ravens",
    name: "Feed the Flock of Ravens",
    category: "wildlife",
    icon: "feather",
    minAge: 4,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Scatter breadcrumbs and roasted peanuts for the watchful black corvids in the cemetery boughs.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 3);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 5);
      if (Math.random() < 0.25) {
        character.shillings = (character.shillings || 0) + 1;
        return {
          success: true,
          title: "Raven's Trinket",
          message: "An enormous raven tilted its glossy head and dropped a tarnished silver coin at your feet (+1 Shilling, +Occult, +Happiness).",
          effects: { shillings: 1, occult: 3, happiness: 5 }
        };
      }
      return {
        success: true,
        title: "Corvid Companionship",
        message: "The ravens cawed warmly in unison, recognizing you as a peaceful patron (+Occult, +Happiness).",
        effects: { occult: 3, happiness: 5 }
      };
    }
  },
  {
    id: "graveyard_moth_hunt",
    name: "Hunt Crypt Moths at Cemetery Gates",
    category: "wildlife",
    icon: "sparkles",
    minAge: 6,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Creep to the iron gates of the municipal graveyard at dusk to capture glowing violet moths.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 5);
      character.stats.happiness = Math.min(100, (character.stats.happiness || 50) + 3);
      return {
        success: true,
        title: "Graveyard Catch",
        message: "You captured luminescent moths fluttering among damp gravestones in a glass mason jar (+Occult, +Happiness).",
        effects: { occult: 5, happiness: 3 }
      };
    }
  },

  // ==========================================
  // 9. HORROR: THE UNSEEN
  // ==========================================
  {
    id: "midnight_seance",
    name: "Hold a Midnight Candlelight Séance",
    category: "horror",
    icon: "flame",
    minAge: 8,
    maxAge: 99,
    maxPerYear: 3,
    desc: "Drape a table in dark velvet, light black tapers, and invoke the names of past residents.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 8);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 3);
      return {
        success: true,
        title: "Séance Manifestation",
        message: "The candle flames flattened into cold blue needles. The glass planchette spelled out a chilling warning (+8% Occult, -3% Sanity).",
        effects: { occult: 8, sanity: -3 }
      };
    }
  },
  {
    id: "ouija_board_communion",
    name: "Consult the Spirit Board",
    category: "horror",
    icon: "moon",
    minAge: 7,
    maxAge: 99,
    maxPerYear: 4,
    desc: "Place your fingertips lightly on the wooden planchette and ask questions to the darkness.",
    run: (character) => {
      character.stats.occult = Math.min(100, (character.stats.occult || 0) + 6);
      character.stats.sanity = Math.max(0, (character.stats.sanity || 50) - 2);
      return {
        success: true,
        title: "Spiritual Whisper",
        message: "The planchette dragged your fingers smoothly across letters: 'W-E-A-R-E-H-E-R-E' (+Occult, -Sanity).",
        effects: { occult: 6, sanity: -2 }
      };
    }
  },

  // ==========================================
  // 10. RANDOM: THE WHEEL OF FATE
  // ==========================================
  {
    id: "wheel_of_fate_spin",
    name: "Spin the Wheel of Cosmic Fate",
    category: "random",
    icon: "dices",
    minAge: 0,
    maxAge: 99,
    maxPerYear: 6,
    desc: "Surrender your agency to the cosmic lottery of fate and receive an unpredictable destiny roll.",
    run: (character) => {
      const outcomes = [
        {
          title: "Found Antique Locket",
          msg: "While walking down the gravel path, you spotted an antique silver locket half-buried in the soil (+$80).",
          effects: { money: 80, happiness: 5 }
        },
        {
          title: "Spectral Alley Cat",
          msg: "A smoky grey cat with translucent paws purred against your ankles before vanishing into mist (+5 Occult, +5 Sanity).",
          effects: { occult: 5, sanity: 5 }
        },
        {
          title: "Sudden Downpour",
          msg: "Freezing rain soaked your clothes within seconds, giving you a mild case of the shivers (-2 Vitality, +3 Happiness).",
          effects: { vitality: -2, happiness: 3 }
        },
        {
          title: "Forgotten Shillings",
          msg: "Inside a dry brick notch along an old garden wall, you found +3 Paranormal Shillings (+3 Shillings, +4 Occult).",
          effects: { shillings: 3, occult: 4 }
        },
        {
          title: "Existential Epiphany",
          msg: "A profound moment of clarity struck you like lightning; your purpose crystallizes (+6 Smarts, +4 Sanity).",
          effects: { smarts: 6, sanity: 4 }
        },
        {
          title: "Uncanny Doppelganger",
          msg: "You saw someone with your exact face standing across the street, staring back expressionlessly (-4 Sanity, +6 Occult).",
          effects: { sanity: -4, occult: 6 }
        },
        {
          title: "Stray Fortune Cookie",
          msg: "The paper slip inside read: 'The door in your attic was opened once. It will open again.' (+3 Occult, +2 Smarts).",
          effects: { occult: 3, smarts: 2 }
        },
        {
          title: "Unexpected Kindness",
          msg: "A passing baker handed you a warm pastry fresh from the oven, smiling warmly (+8 Happiness).",
          effects: { happiness: 8 }
        }
      ];

      const chosen = window.getRandomElement(outcomes);
      if (chosen.effects.money) character.money = (character.money || 0) + chosen.effects.money;
      if (chosen.effects.shillings) character.shillings = (character.shillings || 0) + chosen.effects.shillings;
      if (chosen.effects.happiness) character.stats.happiness = Math.max(0, Math.min(100, (character.stats.happiness || 50) + chosen.effects.happiness));
      if (chosen.effects.sanity) character.stats.sanity = Math.max(0, Math.min(100, (character.stats.sanity || 50) + chosen.effects.sanity));
      if (chosen.effects.vitality) character.stats.vitality = Math.max(0, Math.min(100, (character.stats.vitality || 50) + chosen.effects.vitality));
      if (chosen.effects.smarts) character.stats.smarts = Math.max(0, Math.min(100, (character.stats.smarts || 50) + chosen.effects.smarts));
      if (chosen.effects.occult) character.stats.occult = Math.max(0, Math.min(100, (character.stats.occult || 0) + chosen.effects.occult));

      return {
        success: true,
        title: chosen.title,
        message: chosen.msg,
        effects: chosen.effects
      };
    }
  }
];

function performActivity(activityId, character) {
  if (!character.actionsLeft || character.actionsLeft <= 0) {
    return {
      success: false,
      title: "Exhausted",
      message: "You are physically and mentally exhausted for this year (0 Energy left). Endure the year to recover."
    };
  }

  const activity = ACTIVITIES_LIST.find(a => a.id === activityId);
  if (!activity) {
    return { success: false, title: "Error", message: "Activity not found." };
  }

  if (character.age < activity.minAge || character.age > activity.maxAge) {
    return {
      success: false,
      title: "Unavailable",
      message: `You must be between age ${activity.minAge} and ${activity.maxAge} for this activity.`
    };
  }

  character.activityUses = character.activityUses || {};
  const currentUses = character.activityUses[activityId] || 0;
  const maxLimit = activity.maxPerYear || 5;

  if (currentUses >= maxLimit) {
    return {
      success: false,
      title: "Annual Limit Reached",
      message: `You have already pursued this activity ${currentUses}/${maxLimit} times this year. Advance the year to pursue it again.`
    };
  }

  const result = activity.run(character, currentUses);

  if (result && result.success !== false) {
    character.actionsLeft -= 1;
    character.activityUses[activityId] = currentUses + 1;
  }

  return result;
}

window.ACTIVITY_CATEGORIES_DATA = ACTIVITY_CATEGORIES_DATA;
window.ACTIVITIES_LIST = ACTIVITIES_LIST;
window.performActivity = performActivity;
