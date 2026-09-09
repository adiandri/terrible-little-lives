// Activities & Agency Engine for Terrible Little Lives
// Governs annual energy pool, childhood recreation, exploration & occult encounters

const ACTIVITIES_LIST = [
  // --- Category: Play & Leisure ---
  {
    id: "play_toys",
    name: "Play with Toys & Games",
    category: "leisure",
    icon: "gamepad-2",
    minAge: 1,
    maxAge: 10,
    desc: "Build wooden block towers or dress porcelain dolls in your bedroom.",
    run: (character) => {
      character.stats.happiness = Math.min(100, character.stats.happiness + Math.floor(Math.random() * 6) + 8);
      character.stats.sanity = Math.min(100, character.stats.sanity + 2);
      const vignettes = [
        "You spent hours lining up toy lead soldiers along the radiator pipes.",
        "You built a sprawling fortress out of cardboard shoe boxes and duct tape.",
        "You drew charcoal pictures on the floor beneath your bed until your knuckles were blackened."
      ];
      return {
        success: true,
        title: "Playtime",
        message: `${window.getRandomElement(vignettes)} (+Happiness, +Sanity).`
      };
    }
  },
  {
    id: "neighborhood_park",
    name: "Play in Neighborhood Park",
    category: "leisure",
    icon: "trees",
    minAge: 4,
    maxAge: 16,
    desc: "Climb rusty jungle gyms, ride swings, and explore the drainage culvert.",
    run: (character) => {
      character.stats.vitality = Math.min(100, character.stats.vitality + 4);
      character.stats.happiness = Math.min(100, character.stats.happiness + 6);
      
      const roll = Math.random();
      if (roll < 0.35 && character.kin && character.kin.friends.length < 5) {
        const newFriend = window.generateNewFriend(character, "Municipal Playground");
        character.kin.friends.push(newFriend);
        return {
          success: true,
          title: "New Companion",
          message: `While playing on the rusted swings, you met ${newFriend.name} (Age ${newFriend.age}). You shared sweet candies and became friends (+Vitality, +Happiness).`
        };
      } else if (roll < 0.6) {
        character.shillings += 1;
        return {
          success: true,
          title: "Glitter in the Mud",
          message: "Beneath the merry-go-round gears, you found a blackened silver shilling stamped with a forgotten crest (+1 Shilling, +Vitality)."
        };
      } else {
        return {
          success: true,
          title: "Park Outing",
          message: "You ran through the foggy overgrown park until your lungs burned with cold autumn air (+Vitality, +Happiness)."
        };
      }
    }
  },
  {
    id: "video_games",
    name: "Play Video Games",
    category: "leisure",
    icon: "monitor",
    minAge: 7,
    maxAge: 99,
    desc: "Play pixelated roleplaying games and retro survival horrors on your console.",
    run: (character) => {
      character.stats.happiness = Math.min(100, character.stats.happiness + 8);
      character.stats.smarts = Math.min(100, character.stats.smarts + 2);

      // Rare Creepypasta cartridge event
      if (Math.random() < 0.15) {
        character.stats.sanity = Math.max(0, character.stats.sanity - 8);
        character.stats.occult = Math.min(100, character.stats.occult + 6);
        return {
          success: true,
          title: "Unlicensed Bootleg Cartridge",
          message: "You loaded an unmarked gray floppy disc. The game had no music, only low mechanical breathing, and all the NPC sprites had hollow red sockets (-8% Sanity, +6% Occult)."
        };
      }

      return {
        success: true,
        title: "Gaming Marathon",
        message: "You spent the evening solving labyrinth puzzles and clearing retro pixel dungeons (+8% Happiness, +2% Smarts)."
      };
    }
  },
  {
    id: "exercise_gym",
    name: "Exercise & Physical Training",
    category: "leisure",
    icon: "dumbbell",
    minAge: 11,
    maxAge: 99,
    desc: "Jog along rainy asphalt, lift iron weights, or do calisthenics.",
    run: (character) => {
      character.stats.vitality = Math.min(100, character.stats.vitality + 6);
      character.stats.looks = Math.min(100, character.stats.looks + 3);
      character.stats.happiness = Math.max(0, character.stats.happiness - 2);
      return {
        success: true,
        title: "Grueling Workout",
        message: "You pushed through rigorous physical sets until your muscles ached and your posture sharpened (+6% Vitality, +3% Looks)."
      };
    }
  },

  // --- Category: Mind & Academics ---
  {
    id: "read_library",
    name: "Read at the Public Library",
    category: "academics",
    icon: "book-open",
    minAge: 5,
    maxAge: 99,
    desc: "Browse dusty bookshelves, encyclopedias, and regional municipal archives.",
    run: (character) => {
      character.stats.smarts = Math.min(100, character.stats.smarts + Math.floor(Math.random() * 4) + 4); // +4 to +7%
      character.stats.sanity = Math.min(100, character.stats.sanity + 3);

      const subjects = [
        "studied historical blueprints of the city's 19th-century underground drainage reservoirs",
        "read through illustrated encyclopedias of comparative human and animal anatomy",
        "read archived microfilms of local newspaper obituaries from the great blizzard of 1938"
      ];
      return {
        success: true,
        title: "Quiet Study",
        message: `In the silent basement stacks, you ${window.getRandomElement(subjects)} (+Smarts, +Sanity).`
      };
    }
  },
  {
    id: "study_harder",
    name: "Study Diligently for School",
    category: "academics",
    icon: "graduation-cap",
    minAge: 6,
    maxAge: 22,
    desc: "Cram textbooks and complete extra credit problem sets late into the night.",
    run: (character) => {
      character.stats.smarts = Math.min(100, character.stats.smarts + 5);
      character.stats.happiness = Math.max(0, character.stats.happiness - 4);
      return {
        success: true,
        title: "Academic Devotion",
        message: "You reviewed formulas and history dates until 1:00 AM under a buzzing desk lamp. Your teachers will note your sharp academic rigor (+5% Smarts, -4% Happiness)."
      };
    }
  },

  // --- Category: Occult & Dark Exploration ---
  {
    id: "sneak_basement",
    name: "Sneak into the Cellar / Attic",
    category: "occult",
    icon: "key",
    minAge: 5,
    maxAge: 99,
    desc: "Slip past the padlock on the crawlspace door with a sputtering flashlight.",
    run: (character) => {
      character.stats.occult = Math.min(100, character.stats.occult + 8);
      character.stats.sanity = Math.max(0, character.stats.sanity - 6);

      const roll = Math.random();
      if (roll < 0.4) {
        const shillingsFound = Math.floor(Math.random() * 4) + 2; // 2-5 Shillings
        character.shillings += shillingsFound;
        return {
          success: true,
          title: "Hidden Casket",
          message: `Behind an old furnace baffle, you found an oilcloth parcel containing +${shillingsFound} Paranormal Shillings and a silver thimble (+Occult, -Sanity).`
        };
      } else if (roll < 0.7) {
        const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
        const cashFound = Math.round((Math.floor(Math.random() * 40) + 20) * country.wageMultiplier);
        character.money += cashFound;
        return {
          success: true,
          title: "Forgotten Stash",
          message: `Inside an old cigar tin stuffed between floor joists, you uncovered ${window.formatMoney(cashFound, character.countryCode)} in paper currency (+Money, +Occult).`
        };
      } else {
        return {
          success: true,
          title: "Whispers in the Insulation",
          message: "You sat in the pitch darkness beneath the joists. The galvanized pipes vibrated with low syllables you almost understood (+8% Occult, -6% Sanity)."
        };
      }
    }
  },
  {
    id: "radio_static",
    name: "Tune Shortwave Radio at 3:14 AM",
    category: "occult",
    icon: "radio",
    minAge: 8,
    maxAge: 99,
    desc: "Dial into the unassigned emergency frequencies while the household sleeps.",
    run: (character) => {
      character.stats.occult = Math.min(100, character.stats.occult + 7);
      character.stats.sanity = Math.max(0, character.stats.sanity - 5);
      const shillings = Math.floor(Math.random() * 3) + 2;
      character.shillings += shillings;

      const broadcast = [
        "A synthetic voice reading four-digit coordinates: '7-1-0-4. The hatch remains unsealed.'",
        "The sound of wet, rhythmic slapping followed by a child reciting your mother's maiden name.",
        "A church choir humming in dissonant minor sevenths through heavy rain static."
      ];
      return {
        success: true,
        title: "Number Station Broadcast",
        message: `Through the static speaker, you recorded: ${window.getRandomElement(broadcast)}\n(+7% Occult, -5% Sanity, +${shillings} Shillings).`
      };
    }
  },
  {
    id: "urban_exploration",
    name: "Urban Exploration (Subway Tunnels)",
    category: "occult",
    icon: "flashlight",
    minAge: 13,
    maxAge: 99,
    desc: "Crawl through drainage conduits and bypass fences into forbidden transit tunnels.",
    run: (character) => {
      character.stats.occult = Math.min(100, character.stats.occult + 12);
      character.stats.sanity = Math.max(0, character.stats.sanity - 8);
      character.stats.humanity = Math.max(0, character.stats.humanity - 4);
      
      const shillings = Math.floor(Math.random() * 8) + 6; // 6-13 Shillings
      character.shillings += shillings;

      return {
        success: true,
        title: "The Third Rail Labyrinth",
        message: `You crept two miles past the service barricades into flooded Victorian brick tunnels. On an abandoned maintenance altar, you gathered +${shillings} Paranormal Shillings (+12% Occult, -8% Sanity, -4% Humanity).`
      };
    }
  },

  // --- Category: Social ---
  {
    id: "find_friend",
    name: "Search for Companions",
    category: "social",
    icon: "user-plus",
    minAge: 5,
    maxAge: 18,
    desc: "Spend the afternoon socializing at the community center, skate park, or schoolyard.",
    run: (character) => {
      if (!character.kin) {
        character.kin = window.generateFamily(character);
      }
      if (character.kin.friends.length >= 6) {
        return {
          success: false,
          title: "Social Circle Full",
          message: "You already have a full circle of close companions to keep track of this year."
        };
      }

      const contexts = ["Public Park Bleachers", "Arcade Hall", "Schoolyard Steps", "Bicycle Trail"];
      const newFriend = window.generateNewFriend(character, window.getRandomElement(contexts));
      character.kin.friends.push(newFriend);

      return {
        success: true,
        title: "Made a New Friend",
        message: `You struck up a conversation at the ${newFriend.origin} with ${newFriend.name} (Age ${newFriend.age}). You traded phone numbers and agreed to hang out (+Happiness).`
      };
    }
  },
  {
    id: "group_hangout",
    name: "Group Hangout with All Friends",
    category: "social",
    icon: "users",
    minAge: 6,
    maxAge: 99,
    desc: "Gather your companions for pizza, bike rides, and nighttime campfire talks.",
    run: (character) => {
      if (!character.kin || character.kin.friends.length === 0) {
        return {
          success: false,
          title: "No Friends Yet",
          message: "You don't have any companions yet. Go to the park or schoolyard to meet someone!"
        };
      }

      character.kin.friends.forEach(f => {
        if (f.alive) f.relationship = Math.min(100, f.relationship + 8);
      });
      character.stats.happiness = Math.min(100, character.stats.happiness + 8);

      return {
        success: true,
        title: "Group Gathering",
        message: `You gathered your friends together. Laughter and secrets echoed through the evening fog (+8% Relationship with all friends, +8% Happiness).`
      };
    }
  }
];

function performActivity(activityId, character) {
  if (!character.actionsLeft || character.actionsLeft <= 0) {
    return {
      success: false,
      title: "Exhausted",
      message: "You are out of energy for this year! Click 'Endure Year' to rest and proceed to the next year."
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

  // Deduct 1 action point
  character.actionsLeft -= 1;

  // Run activity logic
  const result = activity.run(character);
  return result;
}

window.ACTIVITIES_LIST = ACTIVITIES_LIST;
window.performActivity = performActivity;
