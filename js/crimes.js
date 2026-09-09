// Paranormal Crimes & Dark Deeds Engine for Terrible Little Lives
// Manages targeted hexes against Kin, Faculty, Staff & Classmates, alongside untargeted dark crimes.

(function() {
  'use strict';

  const PARANORMAL_CRIMES_DATA = [
    {
      id: "hex_nightmare",
      name: "Nightmare Infiltration",
      tag: "Psychic Intrusion",
      icon: "moon",
      minAge: 6,
      minOccult: 10,
      requiresTarget: true,
      costShillings: 1,
      energyCost: 1,
      desc: "Slip into the target's slumber through the static of ungrounded wires, whispering dread into their dreams.",
      successChance: (char, target) => {
        const base = 0.65;
        const occultBonus = (char.stats.occult || 0) * 0.003;
        const targetResist = (target.strictness || 50) * 0.002;
        return Math.min(0.92, Math.max(0.40, base + occultBonus - targetResist));
      },
      onSuccess: (char, target) => {
        target.relationship = Math.max(0, target.relationship - 5);
        target.curse = {
          type: "haunted",
          name: "Nightmare Haunted",
          inflictedYear: char.age,
          severity: 1
        };
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 7);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 2);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 2);

        const messages = [
          `You projected your consciousness through cold drafts into ${target.name}'s bedroom. They awoke choking on shadow, terrified of your gaze (+7% Occult, -2% Humanity).`,
          `Night after night, you wove pale spiders and low chanting into ${target.name}'s REM sleep. They now look pale, exhausted, and strangely submissive (+7% Occult, -2% Sanity).`,
          `Through the chimney flue, you whispered ${target.name}'s secret fears. They are visibly shaken and dread your presence (+7% Occult, -2% Humanity).`
        ];
        return {
          title: "Slumber Infiltrated",
          message: window.getRandomElement ? window.getRandomElement(messages) : messages[0],
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 3);
        char.stats.vitality = Math.max(0, (char.stats.vitality || 0) - 2);
        return {
          title: "Dream Reflection",
          message: `As you tried to breach ${target.name}'s dream, an entity residing in their childhood trauma turned around and bit your astral fingers (-3% Sanity, -2% Vitality).`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        target.relationship = Math.max(0, target.relationship - 25);
        return {
          title: "Caught Lurking",
          message: `${target.name} woke up suddenly and caught you standing at the foot of their bed with dilated pupils (-25% Relationship).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "hex_wither_fortune",
      name: "Hex of Withered Fortune",
      tag: "Blight & Ruin",
      icon: "zap-off",
      minAge: 8,
      minOccult: 20,
      requiresTarget: true,
      costShillings: 2,
      energyCost: 1,
      desc: "Bury target's nail trimmings, hair, or handwriting under a leaden cornerstone to rot their earthly luck.",
      successChance: (char, target) => {
        const base = 0.60;
        const occultBonus = (char.stats.occult || 0) * 0.0035;
        const targetResist = (target.strictness || target.popularity || 50) * 0.002;
        return Math.min(0.90, Math.max(0.35, base + occultBonus - targetResist));
      },
      onSuccess: (char, target) => {
        target.curse = {
          type: "withered",
          name: "Withered Fortune",
          inflictedYear: char.age,
          severity: 2
        };
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 10);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 3);

        const messages = [
          `You buried ${target.name}'s personal effects wrapped in cemetery ivy. A shroud of foul luck settled over their household (+10% Occult, -3% Humanity).`,
          `The lead seal took hold. Within days, ${target.name} suffered financial and personal embarrassments (+10% Occult, -3% Humanity).`,
          `A rotten aura now follows ${target.name}. Glass cracks when they touch it, and their superiors look upon them with distaste (+10% Occult).`
        ];
        return {
          title: "Blight Established",
          message: window.getRandomElement ? window.getRandomElement(messages) : messages[0],
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        char.stats.happiness = Math.max(0, (char.stats.happiness || 0) - 5);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 2);
        return {
          title: "Curse Inversion",
          message: `The lead binding fractured. The misfortunate energy recoiled onto you, shattering your own belongings (-5% Happiness, -2% Sanity).`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        target.relationship = Math.max(0, target.relationship - 35);
        return {
          title: "Ritual Exposed",
          message: `${target.name} found their stolen hair clippings and black tallow buried outside their door. They know it was you (-35% Relationship).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "hex_blood_poppet",
      name: "Blood Poppet Binding",
      tag: "Sympathetic Effigy",
      icon: "heart-crack",
      minAge: 12,
      minOccult: 35,
      requiresTarget: true,
      costShillings: 3,
      energyCost: 1,
      desc: "Fashion a wax and cloth doll stitched with their clothing. You command their vitality and physical compliance.",
      successChance: (char, target) => {
        const base = 0.58;
        const occultBonus = (char.stats.occult || 0) * 0.004;
        const smartsBonus = (char.stats.smarts || 0) * 0.001;
        return Math.min(0.88, Math.max(0.30, base + occultBonus + smartsBonus));
      },
      onSuccess: (char, target) => {
        target.curse = {
          type: "bound",
          name: "Blood-Bound",
          inflictedYear: char.age,
          severity: 3
        };
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 12);
        char.stats.vitality = Math.min(100, (char.stats.vitality || 0) + 4);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 4);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 2);

        return {
          title: "Sympathetic Link Bound",
          message: `You pierced the poppet's shoulder with a rusted brass pin. A mile away, ${target.name} clutched their chest in pain. Their vital energy gently feeds your own (+12% Occult, +4% Vitality, -4% Humanity).`,
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        char.stats.vitality = Math.max(0, (char.stats.vitality || 0) - 3);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 3);
        return {
          title: "Tether Snap",
          message: `The sympathetic thread tore backwards, searing a blistered burn into your palm (-3% Vitality, -3% Sanity).`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        target.relationship = Math.max(0, target.relationship - 40);
        return {
          title: "Abomination Discovered",
          message: `Someone discovered the effigy hidden in your drawer with ${target.name}'s name carved on the chest. An uproar ensued (-40% Relationship).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "hex_whisper_madness",
      name: "Whisper of Madness",
      tag: "Sanity Siphon",
      icon: "skull",
      minAge: 14,
      minOccult: 50,
      requiresTarget: true,
      costShillings: 4,
      energyCost: 1,
      desc: "Plant an unrenderable cosmic syllable in the target's auditory canal. They begin seeing the things behind the wallpaper.",
      successChance: (char, target) => {
        const base = 0.55;
        const occultBonus = (char.stats.occult || 0) * 0.0045;
        return Math.min(0.85, Math.max(0.30, base + occultBonus));
      },
      onSuccess: (char, target) => {
        target.curse = {
          type: "madness",
          name: "Deranged Mind",
          inflictedYear: char.age,
          severity: 3
        };
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 14);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 5);
        char.shillings = (char.shillings || 0) + 3;

        return {
          title: "Madness Rooted",
          message: `The phoneme took seed in ${target.name}'s subconscious. They began scratching at their ears, weeping over colors that don't exist (+14% Occult, -5% Humanity, +3 Paranormal Shillings).`,
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 3);
        return {
          title: "Echoing Syllable",
          message: `You spoke the unholy syllable too loudly; the ceiling rafters echoed it back into your own ears (-3% Sanity).`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        target.relationship = Math.max(0, target.relationship - 50);
        return {
          title: "Screaming Accusation",
          message: `${target.name} pointed a trembling finger at you in public, shrieking that your voice is poisoning their thoughts (-50% Relationship).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "hex_fatal_malice",
      name: "Fatal Malice / Death Hex",
      tag: "Terminal Curse",
      icon: "flame",
      minAge: 16,
      minOccult: 70,
      requiresTarget: true,
      costShillings: 8,
      energyCost: 2,
      desc: "A lethal black rite invoking the Grave Harvester. Intended to bring about the target's untimely and inexplicable demise.",
      successChance: (char, target) => {
        const base = 0.45;
        const occultBonus = (char.stats.occult || 0) * 0.005;
        return Math.min(0.80, Math.max(0.25, base + occultBonus));
      },
      onSuccess: (char, target) => {
        target.curse = {
          type: "doomed",
          name: "Death Marked",
          inflictedYear: char.age,
          severity: 4
        };
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 20);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 10);
        char.shillings = (char.shillings || 0) + 6;

        return {
          title: "Shroud of the Reaper",
          message: `The shadow entity accepted your blood sacrifice and Shillings. An oily black frost settled over ${target.name}'s name (+20% Occult, -10% Humanity, +6 Paranormal Shillings).`,
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        char.stats.vitality = Math.max(0, (char.stats.vitality || 0) - 3);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 3);
        return {
          title: "Curse Reflection!",
          message: `The Death Hex violently bounced off ${target.name}'s innate aura! Black ichor erupted from your throat (-3% Vitality, -3% Sanity).`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        target.relationship = 0;
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 5);
        return {
          title: "Altar Unveiled",
          message: `Authorities and ${target.name} broke into your sanctum mid-chant, witnessing the bone circle and photographs (-100% Relationship, -5% Humanity).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "hex_cleanse",
      name: "Atonement & Hex Cleansing",
      tag: "Curse Lifting",
      icon: "sparkles",
      minAge: 6,
      minOccult: 10,
      requiresTarget: true,
      costShillings: 2,
      energyCost: 1,
      desc: "Bathe the target's effigy in salt and holy water to lift their active affliction and restore your humanity.",
      isCleanse: true,
      successChance: () => 0.95,
      onSuccess: (char, target) => {
        target.curse = null;
        char.stats.humanity = Math.min(100, (char.stats.humanity || 0) + 8);
        char.stats.sanity = Math.min(100, (char.stats.sanity || 0) + 3);
        target.relationship = Math.min(100, (target.relationship || 50) + 15);

        return {
          title: "Hex Dissolved",
          message: `You burned the black bindings in rock salt and sage. The oppressive shadow lifted from ${target.name} (+8% Humanity, +3% Sanity, +15% Relationship).`,
          outcome: "success"
        };
      },
      onBackfire: (char, target) => {
        return {
          title: "Stubborn Binding",
          message: `The curse residue lingered stubbornly, refusing to dissolve completely.`,
          outcome: "backfire"
        };
      },
      onCaught: (char, target) => {
        return {
          title: "Puzzled Reaction",
          message: `${target.name} gave you a strange look as you threw salt over their shoulder.`,
          outcome: "caught"
        };
      }
    },
    // --- General / Untargeted Dark Crimes ---
    {
      id: "crime_grave_robbery",
      name: "Exhume Cemetery Plot",
      tag: "Grave Robbery",
      icon: "shovel",
      minAge: 13,
      minOccult: 15,
      requiresTarget: false,
      costShillings: 0,
      energyCost: 1,
      desc: "Slip into the municipal cemetery at 2:00 AM with a spade and crowbar to open a fresh grave.",
      successChance: (char) => {
        const base = 0.62;
        const smartsBonus = (char.stats.smarts || 0) * 0.002;
        const occultBonus = (char.stats.occult || 0) * 0.002;
        return Math.min(0.90, base + smartsBonus + occultBonus);
      },
      onSuccess: (char) => {
        const shillingsFound = Math.floor(Math.random() * 8) + 5; // 5-12 Shillings
        const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[char.countryCode]) || { wageMultiplier: 1 };
        const cashFound = Math.round((Math.floor(Math.random() * 80) + 40) * (country.wageMultiplier || 1));

        char.shillings = (char.shillings || 0) + shillingsFound;
        char.money = (char.money || 0) + cashFound;
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 8);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 2);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 3);

        return {
          title: "Coffin Pried Open",
          message: `Beneath three feet of wet clay, you forced the zinc casket latch. You extracted antique heirloom rings, ${window.formatMoney ? window.formatMoney(cashFound, char.countryCode) : '$' + cashFound}, and +${shillingsFound} Paranormal Shillings (+8% Occult, -2% Sanity, -3% Humanity).`,
          outcome: "success"
        };
      },
      onBackfire: (char) => {
        char.stats.vitality = Math.max(0, (char.stats.vitality || 0) - 3);
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 2);
        return {
          title: "The Dead Grasp Back",
          message: `A desiccated hand shot upward from the broken lid, tearing into your forearm before turning to brittle ash (-3% Vitality, -2% Sanity).`,
          outcome: "backfire"
        };
      },
      onCaught: (char) => {
        char.stats.happiness = Math.max(0, (char.stats.happiness || 0) - 10);
        return {
          title: "Cemetery Watchman Patrol",
          message: `Twin flashlight beams caught you knee-deep in soil! You barely scrambled over the spiked iron gate, abandoning your coat and spade (-10% Happiness).`,
          outcome: "caught"
        };
      }
    },
    {
      id: "crime_blood_theft",
      name: "Infirmary Blood Bank Heist",
      tag: "Blood Theft",
      icon: "droplet",
      minAge: 15,
      minOccult: 25,
      requiresTarget: false,
      costShillings: 0,
      energyCost: 1,
      desc: "Bypass magnetic door card-readers in the hospital basement to steal refrigerated human blood units.",
      successChance: (char) => {
        const base = 0.58;
        const smartsBonus = (char.stats.smarts || 0) * 0.003;
        return Math.min(0.85, base + smartsBonus);
      },
      onSuccess: (char) => {
        const shillingsFound = Math.floor(Math.random() * 6) + 4;
        char.shillings = (char.shillings || 0) + shillingsFound;
        char.stats.occult = Math.min(100, (char.stats.occult || 0) + 10);
        char.stats.humanity = Math.max(0, (char.stats.humanity || 0) - 4);

        return {
          title: "Refrigerated Haul",
          message: `You packed four sealed plasma bags into an insulated lunchbox. The local occult underground paid you handsomely in +${shillingsFound} Paranormal Shillings (+10% Occult, -4% Humanity).`,
          outcome: "success"
        };
      },
      onBackfire: (char) => {
        char.stats.vitality = Math.max(0, (char.stats.vitality || 0) - 2);
        return {
          title: "Biohazard Exposure",
          message: `A syringe vial shattered across your knuckles. You spent the night sanitizing the puncture in agonizing terror (-2% Vitality).`,
          outcome: "backfire"
        };
      },
      onCaught: (char) => {
        char.stats.sanity = Math.max(0, (char.stats.sanity || 0) - 3);
        char.stats.happiness = Math.max(0, (char.stats.happiness || 0) - 8);
        return {
          title: "Hospital Security Intercept",
          message: `The night ER orderly cornered you in the corridor. You set off a fire alarm to flee into the rainy night (-3% Sanity, -8% Happiness).`,
          outcome: "caught"
        };
      }
    }
  ];

  // Helper: Aggregate all potential living targets across Kin and School
  function getAllPotentialTargets(character) {
    if (!character) return [];
    const targets = [];

    // 1. Kin (Family, Friends, Entities)
    if (character.kin) {
      const groups = [
        { list: character.kin.parents, category: 'Family' },
        { list: character.kin.siblings, category: 'Family' },
        { list: character.kin.grandparents, category: 'Family' },
        { list: character.kin.friends, category: 'Friends' },
        { list: character.kin.entities, category: 'Supernatural' }
      ];

      groups.forEach(g => {
        if (Array.isArray(g.list)) {
          g.list.forEach(person => {
            if (person && person.alive !== false) {
              targets.push({
                raw: person,
                id: person.id,
                name: person.name,
                role: person.role || 'Relative',
                group: g.category,
                relationship: person.relationship !== undefined ? person.relationship : 50,
                curse: person.curse || null,
                isKin: true
              });
            }
          });
        }
      });
    }

    // 2. Education (Faculty, Staff & Classmates)
    if (character.education && character.education.enrolled) {
      const edu = character.education;
      if (!edu.teachers && window.generateTeachers) edu.teachers = window.generateTeachers(character, edu.level);
      if (!edu.staff && window.generateStaff) edu.staff = window.generateStaff(character, edu.level);
      if (!edu.classmates && window.generateClassmates) edu.classmates = window.generateClassmates(character, 6);

      if (Array.isArray(edu.teachers)) {
        edu.teachers.forEach(teacher => {
          if (teacher && teacher.alive !== false) {
            targets.push({
              raw: teacher,
              id: teacher.id,
              name: teacher.name,
              role: teacher.role || 'Teacher',
              group: 'School Staff',
              relationship: teacher.relationship !== undefined ? teacher.relationship : 50,
              curse: teacher.curse || null,
              isSchool: true
            });
          }
        });
      }

      if (Array.isArray(edu.staff)) {
        edu.staff.forEach(staffMember => {
          if (staffMember && staffMember.alive !== false) {
            targets.push({
              raw: staffMember,
              id: staffMember.id,
              name: staffMember.name,
              role: staffMember.role || 'Staff',
              group: 'School Staff',
              relationship: staffMember.relationship !== undefined ? staffMember.relationship : 50,
              curse: staffMember.curse || null,
              isSchool: true
            });
          }
        });
      }

      if (Array.isArray(edu.classmates)) {
        edu.classmates.forEach(mate => {
          if (mate && mate.alive !== false) {
            targets.push({
              raw: mate,
              id: mate.id,
              name: mate.name,
              role: 'Classmate' + (mate.clique ? ` (${mate.clique})` : ''),
              group: 'Classmates',
              relationship: mate.relationship !== undefined ? mate.relationship : 50,
              curse: mate.curse || null,
              isSchool: true
            });
          }
        });
      }
    }

    return targets;
  }

  // Execute a crime or hex
  function executeParanormalCrime(crimeId, character, targetRaw) {
    const crime = PARANORMAL_CRIMES_DATA.find(c => c.id === crimeId);
    if (!crime) return { success: false, reason: "Dark rite not recognized." };

    if (character.age < crime.minAge) {
      return { success: false, reason: `You must be at least Age ${crime.minAge} to perform this rite.` };
    }
    if ((character.stats.occult || 0) < crime.minOccult) {
      return { success: false, reason: `Requires at least ${crime.minOccult}% Occult knowledge.` };
    }
    if (crime.costShillings > 0 && (character.shillings || 0) < crime.costShillings) {
      return { success: false, reason: `Requires ${crime.costShillings} Paranormal Shillings.` };
    }
    if (character.actionsLeft < crime.energyCost) {
      return { success: false, reason: `You lack the energy for this rite (costs ${crime.energyCost} Energy).` };
    }
    if (crime.requiresTarget && !targetRaw) {
      return { success: false, reason: "A living target is required for this hex." };
    }

    // Deduct cost and energy
    if (crime.costShillings > 0) {
      character.shillings -= crime.costShillings;
    }
    character.actionsLeft -= crime.energyCost;

    // Special Cleanse Branch
    if (crime.isCleanse) {
      const res = crime.onSuccess(character, targetRaw);
      return { success: true, ...res };
    }

    // Roll for resolution
    const roll = Math.random();
    const chance = crime.successChance(character, targetRaw);

    if (roll < chance) {
      const res = crime.onSuccess(character, targetRaw);
      return { success: true, ...res };
    } else if (roll < chance + 0.20) {
      const res = crime.onCaught(character, targetRaw);
      return { success: true, ...res };
    } else {
      const res = crime.onBackfire(character, targetRaw);
      return { success: true, ...res };
    }
  }

  // Annual Curse Tick: runs during endureYear() to progress curses on living targets
  function tickAnnualCurses(character) {
    if (!character) return [];
    const logs = [];
    const targets = getAllPotentialTargets(character);

    targets.forEach(t => {
      const person = t.raw;
      if (!person || !person.curse) return;

      const curse = person.curse;
      const yearsActive = character.age - (curse.inflictedYear || character.age);

      switch (curse.type) {
        case "haunted":
          person.relationship = Math.max(0, person.relationship - 2);
          if (yearsActive === 1) {
            logs.push(`${person.name} is visibly hollow-eyed, murmuring about shadows moving across their bed.`);
          } else if (yearsActive >= 3 && Math.random() < 0.3) {
            logs.push(`${person.name} was prescribed heavy sedative drops for persistent night terrors.`);
          }
          break;

        case "withered":
          if (yearsActive === 1) {
            logs.push(`The Hex of Withered Fortune bore fruit: ${person.name} suffered an inexplicable financial collapse.`);
          } else if (yearsActive >= 2 && Math.random() < 0.4) {
            logs.push(`${person.name} fractured their wrist in a freak kitchen accident. Their rotten luck continues.`);
          }
          break;

        case "bound":
          // Siphon vitality
          character.stats.vitality = Math.min(100, (character.stats.vitality || 0) + 1);
          if (yearsActive === 1) {
            logs.push(`Through the Blood Poppet, you felt ${person.name}'s pulse weaken as yours grew faintly stronger (+1% Vitality).`);
          }
          break;

        case "madness":
          if (yearsActive === 1) {
            logs.push(`${person.name} took an emergency leave of absence after screaming at an empty wall for an hour.`);
          } else if (yearsActive >= 2 && Math.random() < 0.35) {
            logs.push(`${person.name} was officially transferred to the municipal psychiatric ward.`);
          }
          break;

        case "doomed":
          if (yearsActive >= 1 && Math.random() < 0.5) {
            person.alive = false;
            person.deathYear = character.age;
            person.deathCause = "Mysterious Respiratory Arrest";
            logs.push(`💀 OMINOUS REPORT: ${person.name} was found dead in their bed at dawn with no signs of struggle. The Death Hex concluded.`);
          } else {
            logs.push(`${person.name}'s skin has turned greyish-white; physicians are baffled by their rapid organ failure.`);
          }
          break;
      }
    });

    return logs;
  }

  // Export to window
  window.PARANORMAL_CRIMES_DATA = PARANORMAL_CRIMES_DATA;
  window.getAllPotentialTargets = getAllPotentialTargets;
  window.executeParanormalCrime = executeParanormalCrime;
  window.tickAnnualCurses = tickAnnualCurses;

})();
