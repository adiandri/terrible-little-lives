// Pets & Familiars Engine for Terrible Little Lives
// BitLife-style companions with atmospheric gothic & cosmic horror dynamics

(function() {
  'use strict';

  // --- Pet Definitions Catalog ---
  const MUNDANE_PET_TEMPLATES = [
    {
      species: "Domestic Shorthair Cat",
      icon: "cat",
      category: "mundane",
      costUSD: 40,
      annualCostUSD: 120,
      lifespan: 16,
      desc: "A sleek municipal cat with quiet paws that loves sleeping near hot floorboards.",
      quirks: [
        "Tracks invisible flying dust with unblinking golden eyes.",
        "Sleeps curled across the bedroom threshold.",
        "Brings small clockwork scraps instead of mice."
      ]
    },
    {
      species: "Loyal Mutt Hound",
      icon: "dog",
      category: "mundane",
      costUSD: 60,
      annualCostUSD: 200,
      lifespan: 13,
      desc: "A scruffy street mix dog with boundless loyalty and a deep, protective bark.",
      quirks: [
        "Growls softly at the closed basement door when it rains.",
        "Rests its heavy snout gently on your lap during nightmares.",
        "Leaps enthusiastically whenever you rattle a leash."
      ]
    },
    {
      species: "Tamed Black Crow",
      icon: "feather",
      category: "mundane",
      costUSD: 25,
      annualCostUSD: 60,
      lifespan: 20,
      desc: "An intelligent corvid rescued with a splinted wing that mimics clicking sounds.",
      quirks: [
        "Collects tarnished copper thimbles and rusted bottle caps on the windowsill.",
        "Croaks three sharp notes when visitors approach the front gate.",
        "Taps on the bedroom windowpane precisely at twilight."
      ]
    },
    {
      species: "Corn Snake",
      icon: "disc",
      category: "mundane",
      costUSD: 50,
      annualCostUSD: 70,
      lifespan: 18,
      desc: "A calm, copper-patterned serpent that wraps peacefully around warm forearms.",
      quirks: [
        "Flicks its tongue against old parchment as if tasting written words.",
        "Coils patiently around your neck like living silk jewelry.",
        "Hisses in harmonic rhythm with humming radio tubes."
      ]
    },
    {
      species: "Albino Ferret",
      icon: "squirrel",
      category: "mundane",
      costUSD: 45,
      annualCostUSD: 100,
      lifespan: 9,
      desc: "A hyperactive white ferret that stashes shiny coins inside sofa cushions.",
      quirks: [
        "Darts through radiator pipes with uncanny speed.",
        "Falls asleep instantly in your jacket pocket while you study.",
        "Hides shiny silver coins inside shoe heels."
      ]
    }
  ];

  const SUPERNATURAL_PET_TEMPLATES = [
    {
      species: "Shadow Familiar",
      icon: "moon",
      category: "supernatural",
      costShillings: 6,
      annualCostUSD: 0,
      lifespan: 99,
      desc: "A formless velvet feline that casts no shadow of its own and drinks cold tea.",
      quirks: [
        "Slips effortlessly beneath locked oak doors like spilled black water.",
        "Purrs with a faint electrostatic static that muffles room noise.",
        "Curling around your neck wards off nightmares and restores sanity."
      ],
      omen: "The streetlights outside flickered in morse code when it yawned."
    },
    {
      species: "Black Goat of the Mire",
      icon: "flame",
      category: "supernatural",
      costShillings: 12,
      annualCostUSD: 40,
      lifespan: 40,
      desc: "A small horned caprine with uncanny amber horizontal pupils and cloven brass hooves.",
      quirks: [
        "Chews quietly on hemlock and pages torn from old hymnals.",
        "Stands entirely motionless on hind legs facing the cemetery at dusk.",
        "Can whisper dark nursery rhymes if offered fresh clover."
      ],
      omen: "Crows in the neighborhood fell silent whenever its hooves clicked on flagstones."
    },
    {
      species: "Pale Phantom Hound",
      icon: "ghost",
      category: "supernatural",
      costShillings: 10,
      annualCostUSD: 0,
      lifespan: 60,
      desc: "A translucent mist-colored hound whose low growl drops the room temperature by ten degrees.",
      quirks: [
        "Leaves faint frost on wooden floorboards where it rests its paws.",
        "Snarls viciously at invisible entities lingering in closet corners.",
        "Its coat is completely weightless and smells of winter rain."
      ],
      omen: "Your mirror reflection was flanked by a second, silent hound head."
    },
    {
      species: "Whispering Two-Tailed Albino",
      icon: "eye",
      category: "supernatural",
      costShillings: 8,
      annualCostUSD: 30,
      lifespan: 25,
      desc: "A twin-tailed snow-white ferret with obsidian eyes that occasionally clicks in human cadence.",
      quirks: [
        "Scratches ancient glyphs into dust motes under the bed.",
        "Twitches its twin tails when bad fortune or malice approaches.",
        "Occasionally fetches antique coins or forgotten trinkets from the floorboards."
      ],
      omen: "It coughed up a damp, antique silver dime minted in 1913."
    },
    {
      species: "Gloom Moth Swarm in a Jar",
      icon: "sparkles",
      category: "supernatural",
      costShillings: 5,
      annualCostUSD: 10,
      lifespan: 30,
      desc: "A cluster of seven iridescent violet moths trapped within an antique apothecary jar.",
      quirks: [
        "Flutter their wings in unison to produce a faint, hypnotic lullaby.",
        "Glow with soft violet luminescence when someone lies in the room.",
        "Feed exclusively on moonlight and dried lavender blossoms."
      ],
      omen: "The moths arranged themselves into an eye silhouette against the curved glass."
    }
  ];

  const PET_NAMES = [
    "Barnaby", "Ophelia", "Salem", "Mortimer", "Spindle", "Corvus", 
    "Grimm", "Bramble", "Lucian", "Pebble", "Cinder", "Hesper", 
    "Wednesday", "Balthazar", "Thistle", "Nyx", "Obsidian", "Soot",
    "Gargoyle", "Echo", "Moth", "Bones", "Whisper", "Gulliver"
  ];

  function generateRandomPet(category = 'mundane', character = null) {
    const list = category === 'supernatural' ? SUPERNATURAL_PET_TEMPLATES : MUNDANE_PET_TEMPLATES;
    const template = window.getRandomElement ? window.getRandomElement(list) : list[0];
    const name = window.getRandomElement ? window.getRandomElement(PET_NAMES) : "Barnaby";
    const country = (character && window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || (window.COUNTRIES_DATA && window.COUNTRIES_DATA.USA) || { wageMultiplier: 1.0 };
    const mult = country.wageMultiplier || 1.0;

    return {
      id: 'pet_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name,
      species: template.species,
      type: template.category,
      category: template.category,
      icon: template.icon,
      age: 0,
      maxAge: template.lifespan + Math.floor(Math.random() * 5) - 2,
      alive: true,
      deathCause: null,
      health: Math.floor(Math.random() * 20) + 80, // 80-100%
      affection: Math.floor(Math.random() * 25) + 65, // 65-90%
      hunger: Math.floor(Math.random() * 20) + 10, // 10-30%
      supernaturalBond: template.category === 'supernatural' ? Math.floor(Math.random() * 30) + 50 : 0,
      costLocal: Math.round((template.costUSD || 0) * mult),
      costShillings: template.costShillings || 0,
      annualCostLocal: Math.round((template.annualCostUSD || 0) * mult),
      desc: template.desc,
      quirk: window.getRandomElement ? window.getRandomElement(template.quirks) : template.quirks[0],
      omen: template.omen || null,
      actionsDone: {
        fed: 0,
        petted: 0,
        walked: 0,
        communed: 0,
        vet: 0
      }
    };
  }

  function applyPetStatEffect(character, stat, amount) {
    if (!character) return;
    if (character.stats) {
      character.stats[stat] = Math.max(0, Math.min(100, (character.stats[stat] || 50) + amount));
    }
    if (typeof character[stat] === 'number') {
      character[stat] = Math.max(0, Math.min(100, character[stat] + amount));
    }
  }

  // --- Pet Interaction Methods ---

  function feedPet(pet, character, foodChoice = 'regular') {
    if (!pet || !pet.alive) return { success: false, reason: "Your pet has already crossed the veil." };
    pet.actionsDone = pet.actionsDone || {};
    const count = pet.actionsDone.fed || 0;
    if (count >= 5) {
      return { success: false, reason: `${pet.name} is completely stuffed for now!` };
    }

    pet.actionsDone.fed = count + 1;
    pet.hunger = Math.max(0, pet.hunger - 35);
    pet.health = Math.min(100, pet.health + 4);
    pet.affection = Math.min(100, pet.affection + 6);

    let message = "";
    const effects = { happiness: 3 };

    if (foodChoice === 'gourmet') {
      pet.affection = Math.min(100, pet.affection + 10);
      pet.health = Math.min(100, pet.health + 8);
      const mult = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode] && window.COUNTRIES_DATA[character.countryCode].wageMultiplier) || 1.0;
      const cost = Math.max(5, Math.round(15 * mult));
      character.money = Math.max(0, (character.money || 0) - cost);
      effects.money = -cost;
      effects.happiness = 5;
      message = `You served ${pet.name} warm roasted marrow and sweet broth. They devoured every morsel and purred in deep contentment.`;
    } else if (foodChoice === 'occult_tallow') {
      if (pet.category === 'supernatural') {
        pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 0) + 12);
        applyPetStatEffect(character, 'occult', 4);
        effects.occult = 4;
        message = `You offered ${pet.name} tallow shavings harvested beneath an eclipse. Its eyes flashed with eerie luminescence as it absorbed the essence.`;
      } else {
        applyPetStatEffect(character, 'sanity', -2);
        effects.sanity = -2;
        message = `${pet.name} sniffed the blackened wax dubiously and sneezed, refusing to touch it.`;
      }
    } else {
      // Regular feeding
      message = `You poured fresh water and nutritious kibble into ${pet.name}'s bowl. They ate with gusto and rubbed their head against your shins.`;
    }

    return {
      success: true,
      title: `Fed ${pet.name}`,
      message,
      effects
    };
  }

  function cuddlePet(pet, character) {
    if (!pet || !pet.alive) return { success: false, reason: "Your pet is no longer in this mortal realm." };
    pet.actionsDone = pet.actionsDone || {};
    const count = pet.actionsDone.petted || 0;
    if (count >= 6) {
      return { success: false, reason: `${pet.name} has curled up to nap and wants some quiet space.` };
    }

    pet.actionsDone.petted = count + 1;
    const affGain = Math.floor(Math.random() * 5) + 6;
    pet.affection = Math.min(100, pet.affection + affGain);
    applyPetStatEffect(character, 'happiness', 5);
    applyPetStatEffect(character, 'sanity', 3);

    const effects = { happiness: 5, sanity: 3 };
    let message = "";

    if (pet.category === 'supernatural') {
      pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 0) + 8);
      effects.occult = 2;
      applyPetStatEffect(character, 'occult', 2);
      message = `You cradled ${pet.name}. Its body was weightless and cool as winter mist. A strange sense of profound otherworldly peace washed over your mind (+${affGain}% Affection, +Sanity, +Occult).`;
    } else {
      message = `You stroked ${pet.name}'s soft fur. They leaned into your gentle touch, closing their eyes in pure bliss (+${affGain}% Affection, +Happiness, +Sanity).`;
    }

    return {
      success: true,
      title: `Cuddled ${pet.name}`,
      message,
      effects
    };
  }

  function strollPet(pet, character) {
    if (!pet || !pet.alive) return { success: false, reason: "Your pet has departed this life." };
    pet.actionsDone = pet.actionsDone || {};
    const count = pet.actionsDone.walked || 0;
    if (count >= 4) {
      return { success: false, reason: `${pet.name} is too tuckered out from previous walks today.` };
    }

    pet.actionsDone.walked = count + 1;
    applyPetStatEffect(character, 'vitality', 2);
    applyPetStatEffect(character, 'happiness', 4);
    pet.health = Math.min(100, pet.health + 4);
    pet.affection = Math.min(100, pet.affection + 5);

    const effects = { vitality: 2, happiness: 4 };
    let body = "";

    // Chance to discover curios or shillings
    const roll = Math.random();
    if (roll < 0.25) {
      const foundCash = Math.floor(Math.random() * 18) + 8;
      character.money = (character.money || 0) + foundCash;
      effects.money = foundCash;
      body = `While trotting past an abandoned alley near the water tower, ${pet.name} unearthed an old rusted tin containing $${foundCash} in preserved bills!`;
    } else if (roll < 0.45 && pet.category === 'supernatural') {
      character.shillings = (character.shillings || 0) + 2;
      effects.shillings = 2;
      body = `${pet.name} stopped near an ancient tombstone and began digging furiously. In the black loam, you uncovered 2 antique Paranormal Shillings!`;
    } else {
      body = `You and ${pet.name} took a brisk stroll through the autumn fog. The crisp air invigorated you both.`;
    }

    return {
      success: true,
      title: `Walked ${pet.name}`,
      message: body,
      effects
    };
  }

  function communeWithPet(pet, character) {
    if (!pet || !pet.alive) return { success: false, reason: "Your pet is not present." };
    if (pet.category !== 'supernatural') {
      return {
        success: false,
        reason: `${pet.name} is an ordinary animal. It tilts its head and looks at you quizzically as you utter strange syllables.`
      };
    }

    pet.actionsDone = pet.actionsDone || {};
    const count = pet.actionsDone.communed || 0;
    if (count >= 4) {
      return { success: false, reason: `Your mind buzzes painfully. You cannot commune through the veil again this year.` };
    }

    pet.actionsDone.communed = count + 1;
    pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 50) + 12);
    applyPetStatEffect(character, 'occult', 6);
    applyPetStatEffect(character, 'sanity', -2);

    const omens = [
      `You locked eyes with ${pet.name} and whispered in low phonemes. A chorus of faint radio voices crackled in your head, whispering that dark omens will bypass your house this year.`,
      `${pet.name}'s eyes refracted like broken prism mirrors. You saw a vision of a submerged stone city under dark skies (+6% Occult, -2% Sanity).`,
      `A cold breeze spun the curtains around you both. ${pet.name} rested its forehead against yours, transferring a tingling surge of ancient awareness.`
    ];

    return {
      success: true,
      title: `Communed with ${pet.name}`,
      message: window.getRandomElement ? window.getRandomElement(omens) : omens[0],
      effects: { occult: 6, sanity: -2 }
    };
  }

  function takePetToVet(pet, character) {
    if (!pet || !pet.alive) return { success: false, reason: "Your pet has passed on." };
    const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || (window.COUNTRIES_DATA && window.COUNTRIES_DATA.USA) || { wageMultiplier: 1.0 };
    const mult = country.wageMultiplier || 1.0;
    const cost = Math.round(120 * mult);

    if ((character.money || 0) < cost) {
      return { success: false, reason: `You need ${window.formatMoney ? window.formatMoney(cost, character.countryCode) : '$' + cost} to afford the veterinary clinic visit.` };
    }

    character.money -= cost;
    pet.health = 100;
    pet.affection = Math.min(100, pet.affection + 10);

    let message = "";
    if (pet.category === 'supernatural') {
      message = `The municipal veterinarian looked terrified as the heart monitor emitted static instead of regular beats. Nonetheless, an antiseptic tincture restored ${pet.name} to peak vigor.`;
    } else {
      message = `The veterinarian administered annual vaccinations and cleaned ${pet.name}'s ears. Your companion is in immaculate physical condition!`;
    }

    return {
      success: true,
      title: `Veterinary Checkup`,
      message,
      effects: { money: -cost, happiness: 4 }
    };
  }

  // --- Annual Tick Simulation for Pets ---
  function tickPetsYear(character) {
    if (!character || !character.pets || !Array.isArray(character.pets)) return [];
    const logs = [];

    character.pets.forEach(pet => {
      if (!pet.alive) return;
      pet.age += 1;
      pet.actionsDone = { fed: 0, petted: 0, walked: 0, communed: 0, vet: 0 };
      pet.hunger = Math.min(100, (pet.hunger || 0) + 30);

      // Annual maintenance cost if character has income/allowance
      if (character.age >= 10 && pet.annualCostLocal > 0 && character.money >= pet.annualCostLocal) {
        character.money -= pet.annualCostLocal;
      }

      // Natural health & affection drift
      if (pet.hunger > 70) {
        pet.health = Math.max(10, pet.health - 15);
        pet.affection = Math.max(10, pet.affection - 10);
      }

      // Old age or mortality roll
      let deathRisk = 0.02;
      if (pet.age >= pet.maxAge) {
        deathRisk = 0.35 + (pet.age - pet.maxAge) * 0.15;
      }

      if (pet.health < 25) deathRisk += 0.3;

      if (Math.random() < deathRisk) {
        pet.alive = false;
        if (pet.category === 'supernatural') {
          pet.deathCause = "Dissolved back into the shadow veil leaving behind cold stardust.";
          logs.push(`[PET DEPARTURE] Your supernatural companion ${pet.name} (${pet.species}) dissolved quietly into midnight mist, returning to the void.`);
        } else {
          pet.deathCause = "Passed away peacefully from old age.";
          logs.push(`[PET LOSS] Your beloved ${pet.species}, ${pet.name}, passed away at age ${pet.age}. You buried them tenderly in the garden (-15% Happiness).`);
        }
        applyPetStatEffect(character, 'happiness', -15);
      } else {
        // Flavor log every year for living pets
        if (pet.category === 'supernatural' && pet.omen && Math.random() < 0.5) {
          logs.push(`[COMPANION OMEN] ${pet.name} (${pet.species}): ${pet.omen}`);
        } else if (pet.category === 'supernatural') {
          logs.push(`[FAMILIAR] ${pet.name} (${pet.species}, Age ${pet.age}) hovered silently near your shadow.`);
        } else {
          logs.push(`[COMPANION] ${pet.name} (${pet.species}, Age ${pet.age}) kept you faithful company throughout the year.`);
        }
      }
    });

    return logs;
  }

  // Export to window scope
  window.MUNDANE_PET_TEMPLATES = MUNDANE_PET_TEMPLATES;
  window.SUPERNATURAL_PET_TEMPLATES = SUPERNATURAL_PET_TEMPLATES;
  window.generateRandomPet = generateRandomPet;
  window.feedPet = feedPet;
  window.cuddlePet = cuddlePet;
  window.strollPet = strollPet;
  window.communeWithPet = communeWithPet;
  window.takePetToVet = takePetToVet;
  window.tickPetsYear = tickPetsYear;

})();
