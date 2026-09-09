// Activities & Agency Engine for Terrible Little Lives
// Governs annual energy pool, childhood recreation, exploration & occult encounters

const ACTIVITIES_LIST = [
  // ==========================================
  // INFANCY & TODDLERHOOD (AGES 0 - 5)
  // ==========================================
  {
    id: "cuddle_parents",
    name: "Cuddle with Parents",
    category: "leisure",
    icon: "heart",
    minAge: 0,
    maxAge: 4,
    maxPerYear: 10,
    desc: "Rest your small head against your mother or father's chest, listening to the rhythmic comfort of their breathing.",
    run: (character, attemptIndex = 0) => {
      const relGain = attemptIndex === 0 ? 8 : (attemptIndex === 1 ? 4 : 2);
      const hapGain = attemptIndex === 0 ? 8 : (attemptIndex === 1 ? 4 : 2);
      character.stats.happiness = Math.min(100, character.stats.happiness + hapGain);
      character.stats.vitality = Math.min(100, character.stats.vitality + 2);
      if (character.kin && character.kin.parents) {
        character.kin.parents.forEach(p => {
          if (p.alive) p.relationship = Math.min(100, p.relationship + relGain);
        });
      }
      const vignettes = [
        "Your mother rocked you gently in the wooden armchair while humming a soft melody.",
        "Your father cradled you against his shoulder, gently patting your back until you burped softly.",
        "You curled into a warm flannel blanket between your parents, safe from the cold drafts of the house."
      ];
      return {
        success: true,
        title: "Loving Embrace",
        message: `${window.getRandomElement(vignettes)} (+Happiness, +Vitality, +Parent Closeness).`,
        effects: { happiness: hapGain, vitality: 2, relationship: relGain }
      };
    }
  },
  {
    id: "drink_milk",
    name: "Drink Warm Milk Bottle",
    category: "leisure",
    icon: "cup-soda",
    minAge: 0,
    maxAge: 3,
    maxPerYear: 10,
    desc: "Drink sweet warm formula from a glass bottle until your eyelids grow pleasantly heavy.",
    run: (character, attemptIndex = 0) => {
      const vitGain = attemptIndex === 0 ? 5 : (attemptIndex === 1 ? 3 : 1);
      const sanGain = attemptIndex === 0 ? 3 : 1;
      character.stats.vitality = Math.min(100, character.stats.vitality + vitGain);
      character.stats.sanity = Math.min(100, character.stats.sanity + sanGain);
      const vignettes = [
        "You drank the whole bottle greedily, kicking your little booties in satisfaction.",
        "The warm formula settled in your stomach; you let out a drowsy sigh and drifted toward sleep.",
        "You gripped the warm glass bottle with both hands, watching dust motes spin in the yellow lamp light."
      ];
      return {
        success: true,
        title: "Warm Feeding",
        message: `${window.getRandomElement(vignettes)} (+Vitality, +Sanity).`,
        effects: { vitality: vitGain, sanity: sanGain }
      };
    }
  },
  {
    id: "learn_walk",
    name: "Learn to Crawl & Walk",
    category: "leisure",
    icon: "footprints",
    minAge: 0,
    maxAge: 3,
    maxPerYear: 10,
    desc: "Pull yourself up against the radiator and take clumsy, wobbling steps across the rug.",
    run: (character, attemptIndex = 0) => {
      const vitGain = attemptIndex === 0 ? 6 : (attemptIndex === 1 ? 3 : 1);
      const smartsGain = attemptIndex === 0 ? 3 : 1;
      character.stats.vitality = Math.min(100, character.stats.vitality + vitGain);
      character.stats.smarts = Math.min(100, character.stats.smarts + smartsGain);
      const vignettes = [
        "You pushed off the low coffee table, balancing for three glorious seconds before tumbling safely onto pillows.",
        "You crawled furiously across the hardwood corridor, chasing after a wandering moth.",
        "You took four wobbly steps toward your mother's outstretched arms, clapping your tiny hands in glee."
      ];
      return {
        success: true,
        title: "Motor Milestones",
        message: `${window.getRandomElement(vignettes)} (+Vitality, +Smarts).`,
        effects: { vitality: vitGain, smarts: smartsGain }
      };
    }
  },
  {
    id: "learn_talk",
    name: "Babble & Learn to Talk",
    category: "academics",
    icon: "message-square",
    minAge: 1,
    maxAge: 4,
    maxPerYear: 10,
    desc: "Practice vocal syllables, mimic words you overhear, and try to speak your thoughts.",
    run: (character, attemptIndex = 0) => {
      const smartsGain = attemptIndex === 0 ? 5 : (attemptIndex === 1 ? 3 : 1);
      const hapGain = attemptIndex === 0 ? 4 : 2;
      character.stats.smarts = Math.min(100, character.stats.smarts + smartsGain);
      character.stats.happiness = Math.min(100, character.stats.happiness + hapGain);
      const vignettes = [
        "You pointed at the window and proudly articulated: 'Doggie!' Your parents cheered with delight.",
        "You babbled a long, impassioned speech made entirely of clicks, whistles, and vowels.",
        "You repeated the phrase 'No, mine!' with remarkable clarity, giggling at your parents' amused sighs."
      ];
      return {
        success: true,
        title: "Early Speech",
        message: `${window.getRandomElement(vignettes)} (+Smarts, +Happiness).`,
        effects: { smarts: smartsGain, happiness: hapGain }
      };
    }
  },
  {
    id: "peekaboo_teething",
    name: "Play Peek-a-Boo & Teethe",
    category: "leisure",
    icon: "smile",
    minAge: 0,
    maxAge: 3,
    maxPerYear: 10,
    desc: "Chew on a wooden teething ring to soothe your gums, or giggle when hands hide familiar faces.",
    run: (character, attemptIndex = 0) => {
      const hapGain = attemptIndex === 0 ? 7 : (attemptIndex === 1 ? 4 : 2);
      character.stats.happiness = Math.min(100, character.stats.happiness + hapGain);
      character.stats.vitality = Math.min(100, character.stats.vitality + 2);
      const vignettes = [
        "Your sibling hid behind a pillow and shouted 'PEEK-A-BOO!' You burst into uncontrollable toddler giggles.",
        "You gnawed determinedly on a cold rubber teething ring, easing the throbbing pressure in your tender gums.",
        "You pulled a tea towel over your face and waited until your father pulled it down with theatrical surprise."
      ];
      return {
        success: true,
        title: "Childhood Joy",
        message: `${window.getRandomElement(vignettes)} (+Happiness, +Vitality).`,
        effects: { happiness: hapGain, vitality: 2 }
      };
    }
  },
  {
    id: "nursery_lullaby",
    name: "Listen to Nursery Lullabies & Static",
    category: "occult",
    icon: "music",
    minAge: 0,
    maxAge: 5,
    maxPerYear: 10,
    desc: "Listen to a wind-up music box, a faint lullaby, or strange rhythmic static over the baby monitor.",
    run: (character, attemptIndex = 0) => {
      const occGain = attemptIndex === 0 ? 5 : 2;
      const sanGain = attemptIndex === 0 ? 3 : 1;
      character.stats.occult = Math.min(100, character.stats.occult + occGain);
      character.stats.sanity = Math.min(100, character.stats.sanity + sanGain);
      const vignettes = [
        "The tinny melody of the nursery music box played in minor thirds, casting soothing crystalline notes into the dim room.",
        "Through the speaker of the baby monitor, you listened to a soft, rhythmic breathing that didn't match anyone in the house.",
        "Your mother hummed an ancient folklore ballad about mountain wolves and black water, rocking you into a deep trance."
      ];
      return {
        success: true,
        title: "Nocturnal Melody",
        message: `${window.getRandomElement(vignettes)} (+Occult, +Sanity).`,
        effects: { occult: occGain, sanity: sanGain }
      };
    }
  },

  // --- Category: Play & Leisure ---
  {
    id: "play_toys",
    name: "Play with Toys & Games",
    category: "leisure",
    icon: "gamepad-2",
    minAge: 1,
    maxAge: 10,
    maxPerYear: 10,
    desc: "Build wooden block towers or dress porcelain dolls in your bedroom.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else if (attemptIndex === 1) {
        character.stats.happiness = Math.min(100, character.stats.happiness + Math.floor(Math.random() * 4) + 4);
        character.stats.sanity = Math.min(100, character.stats.sanity + 1);
        return {
          success: true,
          title: "More Playtime",
          message: "You continued tinkering with your toy collection, inventing quiet stories in the corner (+Happiness, +Sanity)."
        };
      } else {
        character.stats.happiness = Math.min(100, character.stats.happiness + 2);
        return {
          success: true,
          title: "Diminishing Play",
          message: "Your imagination grew slightly weary; the wooden soldiers stood still under the ceiling lamp (+2% Happiness)."
        };
      }
    }
  },
  {
    id: "neighborhood_park",
    name: "Play in Neighborhood Park",
    category: "leisure",
    icon: "trees",
    minAge: 4,
    maxAge: 16,
    maxPerYear: 10,
    desc: "Climb rusty jungle gyms, ride swings, and explore the drainage culvert.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else if (attemptIndex === 1) {
        character.stats.vitality = Math.min(100, character.stats.vitality + 2);
        character.stats.happiness = Math.min(100, character.stats.happiness + 3);
        return {
          success: true,
          title: "Park Stroll",
          message: "You walked along the muddy gravel paths of the park, watching the dusk gather over the birch trees (+2% Vitality, +3% Happiness)."
        };
      } else {
        character.stats.vitality = Math.min(100, character.stats.vitality + 1);
        character.stats.happiness = Math.min(100, character.stats.happiness + 1);
        return {
          success: true,
          title: "Lingering in the Cold",
          message: "The streetlights flickered to life; you lingered by the empty swings in the freezing wind (+1% Vitality, +1% Happiness)."
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
    maxPerYear: 10,
    desc: "Play pixelated roleplaying games and retro survival horrors on your console.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else if (attemptIndex === 1) {
        character.stats.happiness = Math.min(100, character.stats.happiness + 4);
        character.stats.smarts = Math.min(100, character.stats.smarts + 1);
        return {
          success: true,
          title: "Late Session",
          message: "You grinded through extra side-quests and dungeon levels late into the night (+4% Happiness, +1% Smarts)."
        };
      } else {
        character.stats.happiness = Math.min(100, character.stats.happiness + 2);
        return {
          success: true,
          title: "Screen Fatigue",
          message: "Your thumbs ached and pixel static flickered behind your eyelids (+2% Happiness)."
        };
      }
    }
  },
  {
    id: "exercise_gym",
    name: "Exercise & Physical Training",
    category: "leisure",
    icon: "dumbbell",
    minAge: 11,
    maxAge: 99,
    maxPerYear: 10,
    desc: "Jog along rainy asphalt, lift iron weights, or do calisthenics.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
        character.stats.vitality = Math.min(100, character.stats.vitality + 6);
        character.stats.looks = Math.min(100, character.stats.looks + 3);
        character.stats.happiness = Math.max(0, character.stats.happiness - 2);
        return {
          success: true,
          title: "Grueling Workout",
          message: "You pushed through rigorous physical sets until your muscles ached and your posture sharpened (+6% Vitality, +3% Looks)."
        };
      } else if (attemptIndex === 1) {
        character.stats.vitality = Math.min(100, character.stats.vitality + 3);
        character.stats.looks = Math.min(100, character.stats.looks + 1);
        character.stats.happiness = Math.max(0, character.stats.happiness - 3);
        return {
          success: true,
          title: "Additional Training",
          message: "You pushed through extra cardio repetitions; your muscles burned with lactic acid (+3% Vitality, +1% Looks, -3% Happiness)."
        };
      } else {
        character.stats.vitality = Math.min(100, character.stats.vitality + 1);
        character.stats.happiness = Math.max(0, character.stats.happiness - 4);
        return {
          success: true,
          title: "Physical Exhaustion",
          message: "Overexertion strained your joints; you barely managed to finish your sets (+1% Vitality, -4% Happiness)."
        };
      }
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
    maxPerYear: 10,
    desc: "Browse dusty bookshelves, encyclopedias, and regional municipal archives.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else if (attemptIndex === 1) {
        character.stats.smarts = Math.min(100, character.stats.smarts + Math.floor(Math.random() * 2) + 2);
        character.stats.sanity = Math.min(100, character.stats.sanity + 1);
        return {
          success: true,
          title: "Extended Reading",
          message: "You digested historical chronicles of forgotten local architecture (+Smarts, +Sanity)."
        };
      } else {
        character.stats.smarts = Math.min(100, character.stats.smarts + 1);
        return {
          success: true,
          title: "Bleary-Eyed Reading",
          message: "Your eyes strained against the dim lamp light, absorbing a few remaining pages of regional geography (+1% Smarts)."
        };
      }
    }
  },
  {
    id: "study_harder",
    name: "Study Diligently for School",
    category: "academics",
    icon: "graduation-cap",
    minAge: 6,
    maxAge: 22,
    maxPerYear: 10,
    desc: "Cram textbooks and complete extra credit problem sets late into the night.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
        character.stats.smarts = Math.min(100, character.stats.smarts + 5);
        character.stats.happiness = Math.max(0, character.stats.happiness - 4);
        return {
          success: true,
          title: "Academic Devotion",
          message: "You reviewed formulas and history dates until 1:00 AM under a buzzing desk lamp. Your teachers will note your sharp academic rigor (+5% Smarts, -4% Happiness)."
        };
      } else if (attemptIndex === 1) {
        character.stats.smarts = Math.min(100, character.stats.smarts + 3);
        character.stats.happiness = Math.max(0, character.stats.happiness - 5);
        return {
          success: true,
          title: "Cramming Through Exhaustion",
          message: "You forced yourself through supplementary math workbooks; mental fatigue weighed on you (+3% Smarts, -5% Happiness)."
        };
      } else {
        character.stats.smarts = Math.min(100, character.stats.smarts + 1);
        character.stats.happiness = Math.max(0, character.stats.happiness - 6);
        return {
          success: true,
          title: "Severe Burnout",
          message: "You stared at the same page of formulas for an hour, your mind exhausted and numb (+1% Smarts, -6% Happiness)."
        };
      }
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
    maxPerYear: 5,
    desc: "Slip past the padlock on the crawlspace door with a sputtering flashlight.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else {
        character.stats.occult = Math.min(100, character.stats.occult + 4);
        character.stats.sanity = Math.max(0, character.stats.sanity - 4);
        character.shillings += 1;
        return {
          success: true,
          title: "Thorough Search",
          message: "You returned to the crawlspace with a hand mirror, uncovering +1 Paranormal Shilling lodged under a brick (+4% Occult, -4% Sanity, +1 Shilling)."
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
    maxPerYear: 5,
    desc: "Dial into the unassigned emergency frequencies while the household sleeps.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else {
        character.stats.occult = Math.min(100, character.stats.occult + 3);
        character.stats.sanity = Math.max(0, character.stats.sanity - 3);
        character.shillings += 1;
        return {
          success: true,
          title: "Fading Frequency",
          message: "The unassigned frequency degraded into a repetitive Morse tone before cutting to dead air (+3% Occult, -3% Sanity, +1 Shilling)."
        };
      }
    }
  },
  {
    id: "urban_exploration",
    name: "Urban Exploration (Subway Tunnels)",
    category: "occult",
    icon: "flashlight",
    minAge: 13,
    maxAge: 99,
    maxPerYear: 5,
    desc: "Crawl through drainage conduits and bypass fences into forbidden transit tunnels.",
    run: (character, attemptIndex = 0) => {
      if (attemptIndex === 0) {
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
      } else {
        character.stats.occult = Math.min(100, character.stats.occult + 6);
        character.stats.sanity = Math.max(0, character.stats.sanity - 5);
        character.stats.humanity = Math.max(0, character.stats.humanity - 2);
        const shillings = Math.floor(Math.random() * 4) + 2;
        character.shillings += shillings;
        return {
          success: true,
          title: "Deep Tunnel Return",
          message: `You retraced the damp subway catacombs. Municipal patrols were inspecting the third rail, forcing a hasty escape (+6% Occult, -5% Sanity, -2% Humanity, +${shillings} Shillings).`
        };
      }
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
    maxPerYear: 5,
    desc: "Spend the afternoon socializing at the community center, skate park, or schoolyard.",
    run: (character, attemptIndex = 0) => {
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

      const contexts = ["Public Park Bleachers", "Arcade Hall", "Schoolyard Steps", "Bicycle Trail", "Comic Shop"];
      const newFriend = window.generateNewFriend(character, window.getRandomElement(contexts));
      character.kin.friends.push(newFriend);
      character.stats.happiness = Math.min(100, character.stats.happiness + (attemptIndex === 0 ? 6 : 4));

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
    maxPerYear: 5,
    desc: "Gather your companions for pizza, bike rides, and nighttime campfire talks.",
    run: (character, attemptIndex = 0) => {
      if (!character.kin || character.kin.friends.length === 0) {
        return {
          success: false,
          title: "No Friends Yet",
          message: "You don't have any companions yet. Go to the park or schoolyard to meet someone!"
        };
      }

      const relGain = attemptIndex === 0 ? 8 : 4;
      const hapGain = attemptIndex === 0 ? 8 : 4;

      character.kin.friends.forEach(f => {
        if (f.alive) f.relationship = Math.min(100, f.relationship + relGain);
      });
      character.stats.happiness = Math.min(100, character.stats.happiness + hapGain);

      return {
        success: true,
        title: "Group Gathering",
        message: `You gathered your companions together. Shared stories and late-night laughter warmed the evening (+${relGain}% Relationship with all friends, +${hapGain}% Happiness).`
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
  const maxLimit = activity.maxPerYear || 3;

  if (currentUses >= maxLimit) {
    return {
      success: false,
      title: "Annual Limit Reached",
      message: `You have already pursued this activity ${currentUses}/${maxLimit} times this year. Advance the year to pursue it again.`
    };
  }

  // Pre-check for activities that cannot be fulfilled so they don't waste energy
  if (activityId === 'find_friend') {
    if (!character.kin) character.kin = window.generateFamily(character);
    if (character.kin.friends && character.kin.friends.length >= 6) {
      return {
        success: false,
        title: "Social Circle Full",
        message: "You already have a full circle of close companions to keep track of this year."
      };
    }
  }
  if (activityId === 'group_hangout') {
    if (!character.kin || !character.kin.friends || character.kin.friends.length === 0) {
      return {
        success: false,
        title: "No Friends Yet",
        message: "You don't have any companions yet. Go to the park or schoolyard to meet someone!"
      };
    }
  }

  // Run activity logic with attempt index for diminishing returns
  const result = activity.run(character, currentUses);

  if (result && result.success !== false) {
    character.actionsLeft -= 1;
    character.activityUses[activityId] = currentUses + 1;
  }

  return result;
}

window.ACTIVITIES_LIST = ACTIVITIES_LIST;
window.performActivity = performActivity;
