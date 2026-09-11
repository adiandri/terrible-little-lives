// Education, Schools, Faculty & Staff Engine for Terrible Little Lives
// Implements BitLife-style educational lifecycle with atmospheric cosmic horror themes.

(function() {
  'use strict';

  // --- School Name Tables by Region ---
  const SCHOOL_NAMES = {
    USA: {
      daycare: ["Little Sprouts Nursery", "Sunny Days Infant Center", "St. Jude's Parish Creche", "Pinewood Early Care"],
      kindergarten: ["West District Kindergarten", "Maple Valley Primary Academy", "Arkham Heights Kindergarten", "Blackwood Kinder"],
      elementary: ["Blackwood Municipal Elementary", "Providence Public Elementary", "Willow Creek Primary", "Hawthorne Grammar School", "St. Jude Elementary"],
      middle: ["Blackwood Middle School", "Arkham Central Junior High", "Dunwich Valley Middle", "Providence Middle School"],
      high: ["Blackwood High School", "Arkham Heights High", "Providence Central High", "Kingsport Regional High"],
      university: ["Miskatonic Metropolitan University", "Providence State University", "Arkham Technical Institute", "Blackwood College of Fine Arts"],
      private: {
        kindergarten: ["St. Jude Early Preparatory", "Providence Day School", "Montessori of the Red Valley"],
        elementary: ["St. Jude Preparatory School", "Providence Latin Grammar", "Briarwood Hall Elementary", "Arkham Country Day School"],
        middle: ["Briarwood Hall Preparatory", "Providence Collegiate Middle", "St. Jude Classical Academy"],
        high: ["Briarwood Hall Preparatory", "Kingsport Latin School", "St. Jude Senior Academy", "Arkham Country Day High"]
      },
      elite: {
        kindergarten: ["Vanguard Infant Foundation", "Kingsport Aristocratic Early Academy"],
        elementary: ["Kingsport Aristocratic Academy", "Vanguard Primary Collegiate", "Founders Hall Preparatory"],
        middle: ["Kingsport Aristocratic Junior College", "Arkham Vanguard Institute", "The Gilded Spire Academy"],
        high: ["Kingsport Aristocratic Academy", "Arkham Vanguard Institute", "Miskatonic Fellows Senior Collegiate", "The Gilded Spire Upper School"]
      }
    },
    IDN: {
      daycare: ["PAUD Kasih Bunda", "Penitipan Anak Bintang Kecil", "Daycare Melati Suci"],
      kindergarten: ["TK Pertiwi Nusantara", "TK Bintang Timur", "TK Harapan Bangsa"],
      elementary: ["SD Negeri 01 Menteng", "SD Swasta Bhakti Pertiwi", "SD Kristen Kasih Mulia", "SD Negeri 04 Pagi"],
      middle: ["SMP Negeri 02 Nusantara", "SMP Swasta Taruna Bakti", "SMP Negeri 15 Pagi"],
      high: ["SMA Negeri 01 Jakarta", "SMA Swasta Tunas Bangsa", "SMK Karya Utama"],
      university: ["Universitas Negeri Nusantara", "Institut Teknologi Harapan", "Universitas Merdeka Persada"],
      private: {
        kindergarten: ["TK Islam Al-Azhar", "TK Santo Bellarminus", "TK Kristen Pelita", "Montessori Bintang Cemerlang"],
        elementary: ["SD Santa Ursula", "SD Islam Terpadu Nurul Fikri", "SD Pelita Harapan", "SD Kanisius"],
        middle: ["SMP Santa Ursula", "SMP Tarakanita", "SMP Islam Al-Azhar", "SMP Pelita Harapan"],
        high: ["SMA Kolese Kanisius", "SMA Santa Ursula", "SMA Tarakanita 1", "SMA Labschool"]
      },
      elite: {
        kindergarten: ["Jakarta Intercultural Early Years", "British School Infant Campus", "Menteng Elite Kindergarten"],
        elementary: ["Jakarta Intercultural Primary", "British School Jakarta Elementary", "Menteng Heritage Academy"],
        middle: ["Jakarta Intercultural Middle School", "British International Middle", "The Dynasty Academy"],
        high: ["Jakarta Intercultural Upper School", "British School Jakarta High", "Menteng Aristocratic Institute"]
      }
    },
    GBR: {
      daycare: ["St. Bartholomew's Creche", "Little Lambs Nursery", "Briarwood Early Years"],
      kindergarten: ["Eldritch Green Infant Academy", "St. Dunstan's Church Kindergarten", "Kensington Nursery"],
      elementary: ["Blackfriars Primary School", "St. Jude Church of England School", "Eldritch Green Grammar"],
      middle: ["Wormwood Scrubs Preparatory", "Blackfriars Lower Collegiate", "St. Jude Middle Academy"],
      high: ["Blackfriars Senior Collegiate", "Miskatonic Overseas Academy", "Dunwich Grammar School"],
      university: ["London Metropolitan Collegiate", "Blackwood Crown University", "St. Jude Medical Institute"],
      private: {
        kindergarten: ["St. Dunstan's Preparatory Nursery", "Kensington Day Foundation"],
        elementary: ["St. Jude Preparatory School", "Kensington Court Grammar", "Westminster Hall Primary"],
        middle: ["Kensington Preparatory College", "Briarwood Hall Junior Collegiate", "St. Jude Classical School"],
        high: ["Briarwood Hall Senior Collegiate", "Kensington Grammar College", "St. Dunstan's Senior Hall"]
      },
      elite: {
        kindergarten: ["Eton Heritage Nursery", "The Crown Early Foundation"],
        elementary: ["Eton Court Primary", "Harrow Heritage Academy", "The Royal Vanguard Preparatory"],
        middle: ["Harrow Heritage Junior College", "The Royal Vanguard Collegiate", "Eton Crown Academy"],
        high: ["Eton Crown College", "Harrow Heritage Senior Academy", "The Royal Vanguard Collegiate"]
      }
    },
    DEFAULT: {
      daycare: ["Little Blossoms Daycare", "St. Jude's Nursery", "Morning Mist Infant Care"],
      kindergarten: ["West District Kindergarten", "St. Jude's Kindergarten", "Cloverleaf Academy"],
      elementary: ["Municipal Primary School", "St. Jude Elementary", "Blackwood Public School"],
      middle: ["District Central Middle School", "Miskatonic Junior Academy"],
      high: ["Metropolitan Senior High", "Blackwood High School", "Arkham Regional High"],
      university: ["Metropolitan State University", "Miskatonic University", "Central Institute of Arts & Sciences"],
      private: {
        kindergarten: ["St. Jude Preparatory Nursery", "Cloverleaf Day Academy"],
        elementary: ["St. Jude Preparatory School", "Providence Latin School", "Briarwood Academy"],
        middle: ["Briarwood Junior Collegiate", "Providence Latin Middle School"],
        high: ["Briarwood Preparatory High", "Providence Latin Academy", "St. Jude Senior Collegiate"]
      },
      elite: {
        kindergarten: ["The Vanguard Foundation", "Aristocratic Early Academy"],
        elementary: ["The Gilded Spire Primary", "Vanguard Aristocratic Academy"],
        middle: ["The Gilded Spire Junior College", "Arkham Vanguard Institute"],
        high: ["The Gilded Spire Senior Academy", "Arkham Vanguard Institute", "Miskatonic Fellows Collegiate"]
      }
    }
  };

  const SCHOOL_TRACKS = {
    homeschool: {
      id: 'homeschool',
      name: 'Homeschooling',
      icon: 'home',
      baseCost: 0,
      badgeClass: 'badge-track-homeschool',
      badgeColor: 'text-amber-300 bg-amber-950/40 border border-amber-600/30',
      desc: 'Domestic tutelage and independent study. Sheltered from peer cruelty, preserving sanity and fostering focused esoteric contemplation.',
      statsBonus: { sanity: 1, occult: 1 },
      allowedLevels: ['kindergarten', 'elementary', 'middle', 'high']
    },
    public: {
      id: 'public',
      name: 'Public School',
      icon: 'school',
      baseCost: 0,
      badgeClass: 'badge-track-public',
      badgeColor: 'text-sky-300 bg-sky-950/40 border border-sky-600/30',
      desc: 'Free taxpayer-funded municipal education. Diverse student cliques, sports clubs, bustling hallways, and ambient town mysteries.',
      statsBonus: {},
      allowedLevels: ['kindergarten', 'elementary', 'middle', 'high']
    },
    private: {
      id: 'private',
      name: 'Private Preparatory Academy',
      icon: 'landmark',
      baseCost: 5000,
      badgeClass: 'badge-track-private',
      badgeColor: 'text-emerald-300 bg-emerald-950/40 border border-emerald-600/30',
      desc: 'Exclusive tuition-funded institution with strict uniforms, disciplined faculty, and high academic expectations.',
      statsBonus: { smarts: 2 },
      allowedLevels: ['kindergarten', 'elementary', 'middle', 'high']
    },
    elite: {
      id: 'elite',
      name: 'Elite Aristocratic Academy',
      icon: 'castle',
      baseCost: 25000,
      badgeClass: 'badge-track-elite',
      badgeColor: 'text-purple-300 bg-purple-950/40 border border-purple-600/30',
      desc: 'Prestigious boarding institute populated by high society dynasties and secret esoteric societies.',
      statsBonus: { smarts: 3, looks: 1, occult: 2 },
      allowedLevels: ['kindergarten', 'elementary', 'middle', 'high']
    }
  };

  const UNIVERSITY_MAJORS = [
    { id: 'folklore', name: 'Paranormal Folklore & Antiquities', tuition: 9500, smartsBonus: 6, occultBonus: 10 },
    { id: 'biology', name: 'Biological Sciences & Pathology', tuition: 12000, smartsBonus: 8, occultBonus: 2 },
    { id: 'medicine', name: 'Pre-Medicine & Anatomical Surgery', tuition: 18000, smartsBonus: 10, occultBonus: 4 },
    { id: 'computers', name: 'Computer Engineering & Cryptography', tuition: 11000, smartsBonus: 9, occultBonus: 3 },
    { id: 'arts', name: 'Fine Arts & Historical Lithography', tuition: 8500, smartsBonus: 4, occultBonus: 6 },
    { id: 'law', name: 'Constitutional & Criminal Jurisprudence', tuition: 14000, smartsBonus: 9, occultBonus: 1 }
  ];

  const SCHOOL_CLUBS = [
    { id: 'newspaper', name: 'School Newspaper & Journalism', icon: 'newspaper', desc: 'Investigate student rumors and print the monthly gazette.', stat: 'smarts', reqLevel: ['middle', 'high', 'university'] },
    { id: 'occult', name: 'Occult Research Society', icon: 'flame', desc: 'Hold secret meetings in the library cellar to study obscure town grimoires.', stat: 'occult', reqLevel: ['elementary', 'middle', 'high', 'university'] },
    { id: 'track', name: 'Track & Cross-Country Team', icon: 'zap', desc: 'Morning sprints through dense mist surrounding the athletic perimeter.', stat: 'vitality', reqLevel: ['middle', 'high', 'university'] },
    { id: 'chess', name: 'Chess & Logic Society', icon: 'cpu', desc: 'Compete in silent tournaments under flickering gymnasium lights.', stat: 'smarts', reqLevel: ['elementary', 'middle', 'high', 'university'] },
    { id: 'drama', name: 'Drama & Stagecraft Troupe', icon: 'sparkles', desc: 'Rehearse century-old tragedy plays in the dust-coated auditorium.', stat: 'looks', reqLevel: ['middle', 'high', 'university'] },
    { id: 'av_tech', name: 'A/V & Broadcast Syndicate', icon: 'radio', desc: 'Manage the analog cathode monitors, tape recorders, and static-laced PA system.', stat: 'smarts', reqLevel: ['middle', 'high'] }
  ];

  // Safe helper to read character stats (supporting character.stats.smarts and character.smarts)
  function getStat(character, stat, defaultVal = 50) {
    if (!character) return defaultVal;
    if (character.stats && character.stats[stat] !== undefined) return character.stats[stat];
    if (character[stat] !== undefined) return character[stat];
    return defaultVal;
  }

  // Safe helper to mutate character stats and clamp between 0-100
  function modStat(character, stat, delta) {
    if (!character) return 50;
    if (!character.stats) character.stats = {};
    // Never decrease scores by 7% or more; max decrease is capped at 2-3 points (especially for sanity and mortality stats)
    const effectiveDelta = delta < 0 ? Math.max(-3, delta) : delta;
    const curr = character.stats[stat] !== undefined ? character.stats[stat] : (character[stat] !== undefined ? character[stat] : 50);
    const updated = Math.max(0, Math.min(100, Math.round(curr + effectiveDelta)));
    character.stats[stat] = updated;
    character[stat] = updated;
    return updated;
  }

  const SCHOOL_MYSTERIES = [
    {
      id: 'drained_pool',
      title: 'The Drained Tiled Pool',
      icon: 'droplets',
      desc: 'The old subterranean swimming pool has sat drained and locked behind chainlink fence since the 1980s. Strange scratching echoes from the dry deep-end drain.',
      reqLevel: ['middle', 'high', 'university']
    },
    {
      id: 'boiler_crawlspace',
      title: 'Boiler Room Crawlspace',
      icon: 'flame',
      desc: 'Behind the iron water heaters in the basement lies a narrow crawlspace sealed with red hazard tape. A faint smell of ozone and sulfur seeps through.',
      reqLevel: ['elementary', 'middle', 'high']
    },
    {
      id: 'sealed_stairwell',
      title: 'Sealed Fire Stairwell',
      icon: 'shield-alert',
      desc: 'The fire door on the top floor has heavy padlocks. Peeking through the keyhole reveals stairs descending into an impenetrable brick wall.',
      reqLevel: ['elementary', 'middle', 'high', 'university']
    },
    {
      id: 'pa_broadcast',
      title: 'The Dusk Intercom Chant',
      icon: 'radio',
      desc: 'At exactly 5:45 PM after the final bell, the ceiling speakers click on. Beneath the crackle of static, a low voice recites names that do not match current enrollment.',
      reqLevel: ['daycare', 'kindergarten', 'elementary', 'middle', 'high', 'university']
    }
  ];

  // --- Helper: Pick Random from Array ---
  function getRandomItem(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomFirstName(countryCode, gender = 'Male') {
    const data = window.COUNTRIES_DATA || {};
    const country = data[countryCode] || data.USA || { firstNamesMale: ["James", "John", "Thomas"], firstNamesFemale: ["Mary", "Sarah", "Clara"] };
    const list = gender === 'Male' ? country.firstNamesMale : country.firstNamesFemale;
    return getRandomItem(list) || (gender === 'Male' ? "James" : "Mary");
  }

  function getRandomLastName(countryCode) {
    const data = window.COUNTRIES_DATA || {};
    const country = data[countryCode] || data.USA || { surnames: ["Smith", "Blackwood", "Henderson", "Albright", "Vance"] };
    return getRandomItem(country.surnames) || "Blackwood";
  }

  window.getRandomFirstName = getRandomFirstName;
  window.getRandomLastName = getRandomLastName;

  // --- School Generation ---
  function getInstitutionName(level, countryCode, schoolType = 'public', character = null) {
    if (schoolType === 'homeschool') {
      const familyName = (character && (character.lastName || character.surname)) || "Family";
      const homeschoolNames = [
        `${familyName} Home Academy`,
        `${familyName} Household Tutelage`,
        `${familyName} Domestic Study Studio`,
        `Autonomous Classical Home Study`
      ];
      return getRandomItem(homeschoolNames);
    }

    const countryData = SCHOOL_NAMES[countryCode] || SCHOOL_NAMES.USA || SCHOOL_NAMES.DEFAULT;
    if (schoolType === 'private' && countryData.private) {
      const privList = countryData.private[level] || countryData.private.elementary || ["St. Jude Preparatory Academy"];
      return getRandomItem(privList);
    }
    if (schoolType === 'elite' && countryData.elite) {
      const eliteList = countryData.elite[level] || countryData.elite.high || ["Kingsport Aristocratic Academy"];
      return getRandomItem(eliteList);
    }

    const list = countryData[level] || SCHOOL_NAMES.DEFAULT[level] || ["St. Jude Academy"];
    return getRandomItem(list);
  }

  function generateClassmates(character, count = 6, schoolType = 'public') {
    const classmates = [];
    let cliques = ['Nerds', 'Jocks', 'Goths', 'Loners', 'Populars', 'Oddballs', 'Artists'];
    if (schoolType === 'homeschool') {
      cliques = ['Homeschool Co-Op', 'Neighborhood Friends', 'Bookworms', 'Astronomy Hobbyists', 'Solitary Thinkers'];
    } else if (schoolType === 'private') {
      cliques = ['Prep Scions', 'Honor Society', 'Debate Troupe', 'Equestrians', 'Prefects', 'Academic Overachievers'];
    } else if (schoolType === 'elite') {
      cliques = ['Old Money Dynasties', 'Secret Fraternities', 'Equestrian Elites', 'Occult Cabalists', 'Aristocrats'];
    }

    for (let i = 0; i < count; i++) {
      const isMale = Math.random() < 0.5;
      const first = isMale ? window.getRandomFirstName(character.countryCode, 'Male') : window.getRandomFirstName(character.countryCode, 'Female');
      const surname = window.getRandomLastName(character.countryCode);
      
      const roll = Math.random();
      let entityType = 'human';
      if (roll < 0.03) entityType = 'blatant_entity';
      else if (roll < 0.10) entityType = 'disguised_mimic';
      else if (roll < 0.22) entityType = 'anomaly';

      classmates.push({
        id: 'peer_' + Date.now() + '_' + i + '_' + Math.floor(Math.random() * 1000),
        category: 'classmate',
        name: `${first} ${surname}`,
        gender: isMale ? 'Male' : 'Female',
        age: character.age,
        popularity: Math.floor(Math.random() * 60) + 20, // 20 - 80%
        smarts: Math.floor(Math.random() * 60) + 20,
        relationship: Math.floor(Math.random() * 30) + 35, // 35 - 65% initial
        clique: getRandomItem(cliques),
        entityType,
        isRevealed: entityType === 'human',
        isBefriended: false,
        actionsDone: { chat: 0, study: 0, gossip: 0, dare: 0, prank: 0, befriend: 0 }
      });
    }
    return classmates;
  }

  function generateTeachers(character, level, schoolType = 'public') {
    const teachers = [];
    const country = character.countryCode;

    if (schoolType === 'homeschool') {
      const parentList = (character.kin && character.kin.parents) ? character.kin.parents.filter(p => p.alive !== false) : [];
      let parentName = "Parent-Educator";
      let parentRel = 75;
      let parentStrict = 35;
      if (parentList.length > 0) {
        const p = parentList[0];
        parentName = p.name ? `${p.name} (${p.role || 'Parent'})` : "Primary Parent-Tutor";
        parentRel = p.relationship || 75;
        parentStrict = p.strictness || 35;
      }
      teachers.push({
        id: 'teach_home_parent',
        category: 'teacher',
        role: 'Primary Home Educator',
        name: parentName,
        gender: 'Female',
        strictness: parentStrict,
        relationship: parentRel,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_home_tutor',
        category: 'teacher',
        role: 'Visiting Subject Tutor',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 25) + 20,
        relationship: 55,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      return teachers;
    }

    if (schoolType === 'private') {
      teachers.push({
        id: 'teach_priv_head',
        category: 'teacher',
        role: 'Head of Classical Studies',
        name: `Dr. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 30) + 55,
        relationship: 50,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_priv_latin',
        category: 'teacher',
        role: 'Latin & Rhetoric Faculty',
        name: `Prof. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 30) + 50,
        relationship: 48,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      return teachers;
    }

    if (schoolType === 'elite') {
      teachers.push({
        id: 'teach_elite_rector',
        category: 'teacher',
        role: 'Senior Academic Proctor',
        name: `Arch-Preceptor ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 25) + 65,
        relationship: 45,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_elite_antiquities',
        category: 'teacher',
        role: 'Master of Antiquities & Arcana',
        name: `Lady ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 30) + 50,
        relationship: 45,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      return teachers;
    }

    if (level === 'daycare') {
      teachers.push({
        id: 'teach_caretaker_1',
        category: 'teacher',
        role: 'Head Caregiver',
        name: `${window.getRandomFirstName(country, 'Female')} ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 30) + 20,
        relationship: 60,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_caretaker_2',
        category: 'teacher',
        role: 'Nursery Assistant',
        name: `${window.getRandomFirstName(country, 'Male')} ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 20) + 15,
        relationship: 55,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    } else if (level === 'kindergarten') {
      teachers.push({
        id: 'teach_kg_lead',
        category: 'teacher',
        role: 'Kindergarten Lead Teacher',
        name: `Mrs. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 40) + 25,
        relationship: 55,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_kg_aide',
        category: 'teacher',
        role: 'Playground Aide',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 30) + 20,
        relationship: 50,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    } else if (level === 'elementary') {
      teachers.push({
        id: 'teach_elem_homeroom',
        category: 'teacher',
        role: 'Homeroom Teacher',
        name: `Mrs. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 50) + 30,
        relationship: 50,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_elem_art',
        category: 'teacher',
        role: 'Art & Music Teacher',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 30) + 20,
        relationship: 55,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    } else if (level === 'middle' || level === 'high') {
      teachers.push({
        id: 'teach_sec_homeroom',
        category: 'teacher',
        role: 'Homeroom & Literature Faculty',
        name: `Dr. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 50) + 40,
        relationship: 50,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_sec_science',
        category: 'teacher',
        role: 'Natural Sciences Teacher',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 50) + 40,
        relationship: 45,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_sec_history',
        category: 'teacher',
        role: 'History & Civic Studies Teacher',
        name: `Mrs. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 60) + 30,
        relationship: 48,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    } else if (level === 'university') {
      teachers.push({
        id: 'teach_univ_dean',
        category: 'teacher',
        role: 'Department Professor & Thesis Advisor',
        name: `Prof. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        strictness: Math.floor(Math.random() * 60) + 40,
        relationship: 45,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_univ_lecturer',
        category: 'teacher',
        role: 'Senior Departmental Lecturer',
        name: `Dr. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: Math.floor(Math.random() * 40) + 35,
        relationship: 50,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    }

    return teachers;
  }

  function generateStaff(character, level, schoolType = 'public') {
    const staff = [];
    const country = character.countryCode;

    if (schoolType === 'homeschool') {
      staff.push({
        id: 'staff_home_courier',
        category: 'staff',
        role: 'Curriculum Mail Courier',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        quirk: 'Delivers heavy packages of classical textbooks and chemistry kits right to your door.',
        relationship: 55,
        actionsDone: { help_clean: 0, ask_boiler_room: 0, search_lost_found: 0 }
      });
      staff.push({
        id: 'staff_home_inspector',
        category: 'staff',
        role: 'County Education Inspector',
        name: `Inspector ${window.getRandomLastName(country)}`,
        gender: 'Female',
        quirk: 'Inspects your home study portfolio annually with a stern expression and brass clipboard.',
        relationship: 45,
        actionsDone: { reorganize_shelves: 0, catalog_archives: 0, restricted_tomes: 0 }
      });
      staff.push({
        id: 'staff_home_librarian',
        category: 'staff',
        role: 'Municipal Reference Librarian',
        name: `Ms. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        quirk: 'Reserves rare history encyclopedias and ancient folklore books for your home essays.',
        relationship: 60,
        actionsDone: { rest_cot: 0, report_anomaly: 0 }
      });
      staff.push({
        id: 'staff_home_doctor',
        category: 'staff',
        role: 'Visiting Family Doctor',
        name: `Dr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        quirk: 'Conducts routine medical examinations and prescribes restorative botanical elixirs.',
        relationship: 55,
        actionsDone: { appeal_discipline: 0, school_pride: 0 }
      });
      return staff;
    }

    if (schoolType === 'private' || schoolType === 'elite') {
      const isElite = schoolType === 'elite';
      staff.push({
        id: 'staff_priv_grounds',
        category: 'staff',
        role: isElite ? 'Grand Estate Groundskeeper' : 'Academy Groundskeeper',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        quirk: isElite 
          ? 'Quietly prunes ancestral labyrinth hedges and patrols the wrought-iron cemetery gates.'
          : 'Manicures the expansive stone courtyard and cleans the antique bronze statues.',
        relationship: 50,
        actionsDone: { help_clean: 0, ask_boiler_room: 0, search_lost_found: 0 }
      });
      staff.push({
        id: 'staff_priv_archivist',
        category: 'staff',
        role: isElite ? 'Grand Antiquarian & Archivist' : 'Chief Academy Librarian',
        name: `Ms. ${window.getRandomLastName(country)}`,
        gender: 'Female',
        quirk: isElite
          ? 'Guards first-edition centuries-old genealogies and velvet-bound institutional charters.'
          : 'Enforces pin-drop silence in the vaulted library and preserves rare academic monographs.',
        relationship: 50,
        actionsDone: { reorganize_shelves: 0, catalog_archives: 0, restricted_tomes: 0 }
      });
      staff.push({
        id: 'staff_priv_matron',
        category: 'staff',
        role: isElite ? 'Academy High Physician' : 'Infirmary Matron',
        name: `Matron ${window.getRandomLastName(country)}`,
        gender: 'Female',
        quirk: 'Attends to student fainting spells with cold silver compresses and lavender tonics.',
        relationship: 55,
        actionsDone: { rest_cot: 0, report_anomaly: 0 }
      });
      staff.push({
        id: 'staff_priv_chancellor',
        category: 'staff',
        role: isElite ? 'High Chancellor' : 'Headmaster',
        name: `${isElite ? 'Chancellor' : 'Headmaster'} ${window.getRandomLastName(country)}`,
        gender: Math.random() < 0.5 ? 'Male' : 'Female',
        quirk: isElite
          ? 'Oversees the student body from a mahogany dais adorned with heraldic tapestries.'
          : 'Walks the halls with an ebony cane and enforces institutional perfection.',
        relationship: 40,
        actionsDone: { appeal_discipline: 0, school_pride: 0 }
      });
      return staff;
    }

    if (level === 'daycare' || level === 'kindergarten') {
      staff.push({
        id: 'staff_daycare_matron',
        category: 'staff',
        role: 'Nursery Matron',
        name: `Sister ${window.getRandomFirstName(country, 'Female')}`,
        gender: 'Female',
        quirk: 'Dispenses warm chamomile tea and soft biscuits during tantrums.',
        relationship: 60,
        actionsDone: { nurture: 0, ask_snack: 0 }
      });
      staff.push({
        id: 'staff_daycare_custodian',
        category: 'staff',
        role: 'Facility Caretaker',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        quirk: 'Quietly mops spilled fruit juice with smelling salts.',
        relationship: 50,
        actionsDone: { help_clean: 0 }
      });
      return staff;
    }

    // Elementary, Middle, High, and University have the standard 4 staff roles:
    // 1. Janitor / Custodian
    staff.push({
      id: 'staff_janitor',
      category: 'staff',
      role: 'Janitor',
      name: `Mr. ${window.getRandomLastName(country)}`,
      gender: 'Male',
      quirk: 'Carries a heavy iron ring of unmarked skeleton keys and smells faintly of damp sawdust.',
      relationship: 50,
      actionsDone: { help_clean: 0, ask_boiler_room: 0, search_lost_found: 0 }
    });

    // 2. Librarian / Archivist
    staff.push({
      id: 'staff_librarian',
      category: 'staff',
      role: 'Librarian',
      name: `Ms. ${window.getRandomLastName(country)}`,
      gender: 'Female',
      quirk: 'Wears vintage bifocals on a silver cord; strictly catalogs the county historical archives.',
      relationship: 50,
      actionsDone: { reorganize_shelves: 0, catalog_archives: 0, restricted_tomes: 0 }
    });

    // 3. School Nurse
    staff.push({
      id: 'staff_nurse',
      category: 'staff',
      role: 'School Nurse',
      name: `Nurse ${window.getRandomLastName(country)}`,
      gender: 'Female',
      quirk: 'Keeps an icy glass thermometer and a steady supply of peppermint drops.',
      relationship: 55,
      actionsDone: { rest_cot: 0, report_anomaly: 0 }
    });

    // 4. Principal / Headmaster / Dean
    const headTitle = level === 'university' ? 'University Dean' : (level === 'high' ? 'Headmaster' : 'Principal');
    staff.push({
      id: 'staff_principal',
      category: 'staff',
      role: headTitle,
      name: `${level === 'university' ? 'Dean' : 'Principal'} ${window.getRandomLastName(country)}`,
      gender: Math.random() < 0.5 ? 'Male' : 'Female',
      quirk: 'Sits behind a polished dark mahogany desk draped in institutional banners.',
      relationship: 40,
      actionsDone: { appeal_discipline: 0, school_pride: 0 }
    });

    return staff;
  }

  // --- Tuition & Funding Mechanics ---
  function getTuitionCost(character, schoolType = 'public', level = 'elementary') {
    const track = SCHOOL_TRACKS[schoolType] || SCHOOL_TRACKS.public;
    if (!track || track.baseCost === 0) return 0;
    const country = (window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode]) || (window.COUNTRIES_DATA && window.COUNTRIES_DATA.USA) || { wageMultiplier: 1.0 };
    const mult = country.wageMultiplier || 1.0;
    const levelFactor = (level === 'kindergarten') ? 0.6 : (level === 'elementary' ? 0.8 : 1.0);
    return Math.round(track.baseCost * mult * levelFactor);
  }

  function askParentsForTuition(character, schoolType, level) {
    if (schoolType === 'homeschool' || schoolType === 'public') {
      return {
        granted: true,
        message: "No tuition is required for this track. Education is completely cost-free."
      };
    }

    const parents = (character.kin && character.kin.parents) ? character.kin.parents.filter(p => p.alive !== false) : [];
    if (parents.length === 0) {
      return {
        granted: false,
        reason: "You have no living parents or legal guardians to cover your tuition fees."
      };
    }

    let totalRel = 0;
    let totalGen = 0;
    parents.forEach(p => {
      totalRel += (p.relationship !== undefined ? p.relationship : 50);
      totalGen += (p.generosity !== undefined ? p.generosity : 50);
    });
    const avgRel = totalRel / parents.length;
    const avgGen = totalGen / parents.length;

    let economicScore = 50;
    if (character.kin && character.kin.wealthTier === 'affluent') {
      economicScore = 90;
    } else if (character.kin && character.kin.wealthTier === 'comfortable') {
      economicScore = 65;
    } else if (character.kin && character.kin.wealthTier === 'modest') {
      economicScore = 25;
    } else {
      const highIncomeKeywords = ["Doctor", "Surgeon", "Attorney", "Lawyer", "Executive", "Director", "Professor", "Architect", "Specialist", "Engineer"];
      const lowIncomeKeywords = ["Forklift", "Cleaner", "Courier", "Morgue", "Meat Processing", "Clerk", "Technician"];

      parents.forEach(p => {
        const occ = p.occupation || "";
        if (p.salaryUSD && p.salaryUSD >= 100000) {
          economicScore += 30;
        } else if (p.salaryUSD && p.salaryUSD <= 35000) {
          economicScore -= 20;
        } else if (highIncomeKeywords.some(kw => occ.includes(kw))) {
          economicScore += 25;
        } else if (lowIncomeKeywords.some(kw => occ.includes(kw))) {
          economicScore -= 15;
        }
      });
    }

    const smarts = getStat(character, 'smarts');
    let smartsBonus = 0;
    if (smarts >= 80) smartsBonus = 25;
    else if (smarts >= 65) smartsBonus = 12;
    else if (smarts < 40) smartsBonus = -15;

    const totalScore = (avgRel * 0.35) + (avgGen * 0.35) + (economicScore * 0.3) + smartsBonus;

    if (schoolType === 'private') {
      if (totalScore >= 45) {
        parents.forEach(p => {
          if (p.relationship !== undefined) p.relationship = Math.min(100, p.relationship + 4);
        });
        return {
          granted: true,
          message: smarts >= 70
            ? "Your parents were overjoyed by your intellectual aptitude and proudly agreed to fund your private preparatory tuition!"
            : "After carefully reviewing household savings, your parents agreed to finance your private preparatory tuition."
        };
      } else {
        return {
          granted: false,
          reason: economicScore < 40
            ? "Your parents explained with heavy hearts that the household budget cannot stretch to cover private school tuition on their current wages."
            : "Your parents declined: they feel private academy tuition is an unnecessary extravagance and insist you attend public school."
        };
      }
    } else if (schoolType === 'elite') {
      if (totalScore >= 75) {
        parents.forEach(p => {
          if (p.relationship !== undefined) p.relationship = Math.min(100, p.relationship + 5);
        });
        return {
          granted: true,
          message: economicScore >= 70
            ? "Your aristocratic family beamed with pride and immediately wired the extensive tuition deposit to the Elite Academy bursar."
            : "Astonished by your intellectual gifts, your parents took out a secondary loan on the house to fund your Elite Academy enrollment!"
        };
      } else {
        return {
          granted: false,
          reason: economicScore < 60
            ? "Your parents gasped at the exorbitant tuition figure: 'Twenty-five thousand dollars a year?! That is more than half our annual take-home pay!'"
            : "Your parents firmly refused to pay for the elite academy, citing the institution's haughty reputation and astronomical costs."
        };
      }
    }

    return { granted: false, reason: "Admissions inquiry could not be completed." };
  }

  function applyForScholarship(character, schoolType, level) {
    if (schoolType === 'homeschool' || schoolType === 'public') {
      return { granted: true, message: "No scholarship needed; education is already cost-free." };
    }

    const smarts = getStat(character, 'smarts');
    const occult = getStat(character, 'occult');

    if (schoolType === 'private') {
      if (smarts >= 80) {
        return {
          granted: true,
          type: "Merit Academic Honors Scholarship",
          message: `You placed in the 98th percentile on the preparatory admissions examination (${smarts}% Smarts). The admissions board awarded you a 100% full-tuition merit scholarship!`
        };
      } else if (smarts >= 65) {
        const roll = Math.random() * 100;
        const passChance = (smarts - 60) * 4;
        if (roll < passChance) {
          return {
            granted: true,
            type: "Academic Tuition Waiver",
            message: `Following a rigorous standardized testing session, you secured the final available academic tuition scholarship for this term!`
          };
        } else {
          return {
            granted: false,
            reason: `Your test score (${smarts}% Smarts) fell just short of the competitive scholarship quota. All scholarship allocations were awarded to higher-scoring candidates.`
          };
        }
      } else {
        return {
          granted: false,
          reason: `Your entrance examination score (${smarts}% Smarts) was below the minimum 65% threshold required for academic scholarship consideration.`
        };
      }
    } else if (schoolType === 'elite') {
      if (occult >= 60) {
        return {
          granted: true,
          type: "Founder's Esoteric Fellowship",
          message: `During the cryptic admissions interview, you effortlessly deciphered the antique sigils engraved on the academy's founder charter. The cloaked committee inducted you under the secret Founder's Fellowship with full tuition coverage!`
        };
      }
      if (smarts >= 85) {
        return {
          granted: true,
          type: "Aristocratic Academic Prodigy Scholarship",
          message: `Your flawless score on the classical Latin and analytical mathematics exam set a multi-year academy record (${smarts}% Smarts). The Board granted you the prestigious Aristocratic Honors Scholarship with all tuition waived!`
        };
      } else if (smarts >= 75) {
        const roll = Math.random() * 100;
        if (roll < 35) {
          return {
            granted: true,
            type: "Civic Endowment Fellowship",
            message: `A prominent alumnus endowment selected your application for full tuition sponsorship based on your exceptional aptitude (${smarts}% Smarts)!`
          };
        } else {
          return {
            granted: false,
            reason: `Elite Academy scholarship competition was ruthless. Despite strong marks (${smarts}% Smarts), the remaining endowed seats went to candidates with dynastic legacy connections.`
          };
        }
      } else {
        return {
          granted: false,
          reason: `The Elite Academy admissions board rejected your scholarship petition. Candidates must demonstrate prodigy-level intellect (85+ Smarts) or rare esoteric credentials.`
        };
      }
    }

    return { granted: false, reason: "Admissions board did not accept application." };
  }

  // --- Initial Enrollment Factory ---
  function enrollInSchool(character, targetLevel = null, major = null, schoolType = null, tuitionPayer = null) {
    let level = targetLevel;
    if (!level) {
      if (character.age >= 0 && character.age <= 3) level = 'daycare';
      else if (character.age >= 4 && character.age <= 5) level = 'kindergarten';
      else if (character.age >= 6 && character.age <= 10) level = 'elementary';
      else if (character.age >= 11 && character.age <= 13) level = 'middle';
      else if (character.age >= 14 && character.age <= 17) level = 'high';
      else level = null;
    }

    if (!level) return null;

    const chosenTrack = schoolType || (character.education && character.education.schoolType) || 'public';
    const chosenPayer = tuitionPayer || (chosenTrack === 'homeschool' || chosenTrack === 'public' ? 'free' : ((character.education && character.education.tuitionPayer) || 'parents'));

    let gradeYear = 1;
    let maxGradeYears = 5;
    if (level === 'daycare') {
      gradeYear = Math.max(1, character.age);
      maxGradeYears = 3;
    } else if (level === 'kindergarten') {
      gradeYear = character.age === 5 ? 2 : 1;
      maxGradeYears = 2;
    } else if (level === 'elementary') {
      gradeYear = Math.max(1, Math.min(5, character.age - 5));
      maxGradeYears = 5;
    } else if (level === 'middle') {
      gradeYear = Math.max(1, Math.min(3, character.age - 10));
      maxGradeYears = 3;
    } else if (level === 'high') {
      gradeYear = Math.max(1, Math.min(4, character.age - 13));
      maxGradeYears = 4;
    } else if (level === 'university') {
      gradeYear = 1;
      maxGradeYears = 4;
    }

    const schoolObj = {
      enrolled: true,
      level,
      schoolType: chosenTrack,
      tuitionPayer: chosenPayer,
      tuitionCost: getTuitionCost(character, chosenTrack, level),
      name: getInstitutionName(level, character.countryCode, chosenTrack, character),
      major: major || (level === 'university' ? UNIVERSITY_MAJORS[0].name : null),
      gradeYear,
      maxGradeYears,
      grades: Math.floor(Math.random() * 30) + 60, // 60 - 90%
      popularity: chosenTrack === 'homeschool' ? 50 : Math.floor(Math.random() * 30) + 40, // 40 - 70%
      disciplinaryRecord: 0,
      clubs: [],
      classmates: generateClassmates(character, 6, chosenTrack),
      teachers: generateTeachers(character, level, chosenTrack),
      staff: generateStaff(character, level, chosenTrack),
      graduationStatus: 'enrolled'
    };

    character.education = schoolObj;
    return schoolObj;
  }

  // --- Yearly Progression Tick ---
  function tickEducationYear(character) {
    if (!character.education || !character.education.enrolled) {
      if (character.education && (character.education.graduationStatus === 'expelled' || character.education.graduationStatus === 'dropped_out')) {
        return [];
      }
      // If at any school age (0 - 17) and not enrolled, automatically enroll them!
      if (character.age >= 0 && character.age <= 17) {
        enrollInSchool(character);
        const levelLabels = {
          daycare: 'Toddler Daycare & Nursery',
          kindergarten: 'Kindergarten',
          elementary: 'Elementary School',
          middle: 'Middle School',
          high: 'High School'
        };
        const lvl = levelLabels[character.education.level] || 'School';
        return [`Enrolled in ${character.education.name} (${lvl}).`];
      }
      return [];
    }

    const edu = character.education;
    const logs = [];

    // Reset interaction action quotas for peers/teachers/staff each year
    if (edu.classmates) {
      edu.classmates.forEach(c => { c.actionsDone = { chat: 0, study: 0, gossip: 0, dare: 0, prank: 0, befriend: 0 }; });
    }
    if (edu.teachers) {
      edu.teachers.forEach(t => { t.actionsDone = { praise: 0, ask_help: 0, complain: 0, bribe: 0 }; });
    }
    if (edu.staff) {
      edu.staff.forEach(s => { s.actionsDone = { help_clean: 0, ask_boiler_room: 0, search_lost_found: 0, reorganize_shelves: 0, catalog_archives: 0, restricted_tomes: 0, rest_cot: 0, report_anomaly: 0, appeal_discipline: 0, school_pride: 0, nurture: 0, ask_snack: 0 }; });
    }

    // Process annual tuition payment
    const cost = edu.tuitionCost !== undefined ? edu.tuitionCost : getTuitionCost(character, edu.schoolType, edu.level);
    if (cost > 0) {
      if (edu.tuitionPayer === 'self') {
        if (character.money >= cost) {
          character.money -= cost;
          logs.push(`Paid annual tuition fee of ${window.formatMoney ? window.formatMoney(cost, character.countryCode) : '$' + cost} for ${edu.name}.`);
        } else {
          logs.push(`TUITION ARREARS: You were unable to cover ${window.formatMoney ? window.formatMoney(cost, character.countryCode) : '$' + cost} tuition at ${edu.name}. Forced to transfer to a public municipal school.`);
          enrollInSchool(character, edu.level, edu.major, 'public', 'free');
          return logs;
        }
      } else if (edu.tuitionPayer === 'parents') {
        logs.push(`Your parents paid the annual tuition of ${window.formatMoney ? window.formatMoney(cost, character.countryCode) : '$' + cost} for ${edu.name}.`);
      } else if (edu.tuitionPayer === 'scholarship') {
        if (edu.grades < 60) {
          logs.push(`SCHOLARSHIP PROBATION: Your grades dropped below 60% at ${edu.name}. The board issued a strict academic probation warning!`);
        } else {
          logs.push(`Your full scholarship at ${edu.name} was successfully renewed for your academic standing.`);
        }
      }
    }

    // Natural grade fluctuation influenced by character smarts
    const charSmarts = getStat(character, 'smarts');
    const smartsDelta = Math.floor((charSmarts - 50) / 10);
    const naturalVariance = Math.floor(Math.random() * 9) - 4; // -4 to +4
    edu.grades = Math.max(5, Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + smartsDelta + naturalVariance));

    // Report card entry
    let gradeLetter = 'C';
    if (edu.grades >= 90) gradeLetter = 'A+';
    else if (edu.grades >= 80) gradeLetter = 'A';
    else if (edu.grades >= 70) gradeLetter = 'B';
    else if (edu.grades >= 60) gradeLetter = 'C';
    else if (edu.grades >= 50) gradeLetter = 'D';
    else gradeLetter = 'F';

    let reportVignette = `Received report card from ${edu.name}: Grade mark ${gradeLetter} (${edu.grades}%).`;
    if (edu.grades >= 85) {
      reportVignette += " Your teachers commended your academic dedication.";
    } else if (edu.grades < 50) {
      reportVignette += " Your instructors expressed grave concern regarding your lack of attentiveness.";
    }
    logs.push(reportVignette);

    // Track atmosphere and bonuses
    if (edu.schoolType === 'homeschool') {
      modStat(character, 'sanity', 1);
      modStat(character, 'happiness', 1);
      const homeLogs = [
        "Completed independent astronomy and history modules at the kitchen table, undisturbed by classroom chaos.",
        "Your home educator guided you through classical botany specimens in the quiet backyard garden.",
        "Studied literature curled in the living room armchair while rain tapped against the windowpanes."
      ];
      logs.push(getRandomItem(homeLogs));
    } else if (edu.schoolType === 'private') {
      modStat(character, 'smarts', 1);
      const privLogs = [
        "Wore your crisp academy blazer and completed extensive preparatory coursework under strict faculty oversight.",
        "Competed in the preparatory inter-school forensics and debate symposium; your analytical skills sharpened.",
        "Faculty inspected your student uniform and commended your disciplined academic demeanor."
      ];
      logs.push(getRandomItem(privLogs));
    } else if (edu.schoolType === 'elite') {
      modStat(character, 'smarts', 2);
      modStat(character, 'looks', 1);
      if (Math.random() < 0.5) modStat(character, 'occult', 1);
      const eliteLogs = [
        "Dined in the high-ceilinged Great Hall beneath portraits of the academy's 18th-century founders.",
        "Attended a candlelight symposium in the cloisters with fellow scions of prominent families.",
        "Overheard seniors whispering secretive passwords before an iron gate leading beneath the chapel."
      ];
      logs.push(getRandomItem(eliteLogs));
    }

    // Club activities log
    if (edu.clubs && edu.clubs.length > 0) {
      const clubId = getRandomItem(edu.clubs);
      const clubDef = SCHOOL_CLUBS.find(c => c.id === clubId);
      if (clubDef) {
        logs.push(`Participated actively in the ${clubDef.name}. ${clubDef.desc}`);
        if (clubDef.stat === 'smarts') modStat(character, 'smarts', 1);
        if (clubDef.stat === 'vitality') modStat(character, 'vitality', 1);
        if (clubDef.stat === 'occult') modStat(character, 'occult', 2);
      }
    }

    // Advance grade year
    edu.gradeYear += 1;

    // Check level graduations & transitions
    if (edu.level === 'daycare' && character.age >= 4) {
      logs.push(`Graduated from Daycare at ${edu.name}! You are now ready to choose your Kindergarten education pathway.`);
      character.pendingSchoolChoice = { targetLevel: 'kindergarten', reason: 'graduation' };
      enrollInSchool(character, 'kindergarten', null, edu.schoolType === 'homeschool' ? 'homeschool' : 'public', 'free');
    } else if (edu.level === 'kindergarten' && character.age >= 6) {
      logs.push(`Graduated from Kindergarten at ${edu.name}! You completed early childhood education and are ready for Elementary School.`);
      character.pendingSchoolChoice = { targetLevel: 'elementary', reason: 'graduation' };
      enrollInSchool(character, 'elementary', null, edu.schoolType || 'public', edu.tuitionPayer || 'free');
    } else if (edu.level === 'elementary' && character.age >= 11) {
      logs.push(`Graduated from Elementary School at ${edu.name}! You completed Grade 5 and are eligible for Middle School.`);
      character.pendingSchoolChoice = { targetLevel: 'middle', reason: 'graduation' };
      enrollInSchool(character, 'middle', null, edu.schoolType || 'public', edu.tuitionPayer || 'free');
    } else if (edu.level === 'middle' && character.age >= 14) {
      logs.push(`Graduated from Middle School at ${edu.name}! You survived early adolescence and are ready to enter High School.`);
      character.pendingSchoolChoice = { targetLevel: 'high', reason: 'graduation' };
      enrollInSchool(character, 'high', null, edu.schoolType || 'public', edu.tuitionPayer || 'free');
    } else if (edu.level === 'high' && character.age >= 18) {
      edu.enrolled = false;
      edu.graduationStatus = 'graduated';
      character.hasHighSchoolDiploma = true;
      logs.push(`HIGH SCHOOL COMMENCEMENT: You walked the stage at ${edu.name} and received your High School Diploma! You are now eligible for University or full-time employment.`);
    } else if (edu.level === 'university' && edu.gradeYear > edu.maxGradeYears) {
      edu.enrolled = false;
      edu.graduationStatus = 'graduated';
      character.hasDegree = true;
      character.degreeMajor = edu.major;
      logs.push(`UNIVERSITY COMMENCEMENT: You earned your Bachelor's Degree in ${edu.major} from ${edu.name}! The academic faculty saluted your perseverance.`);
    }

    return logs;
  }

  // --- School Actions Handlers ---
  function studyHarder(character) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    const edu = character.education;
    edu.grades = Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + Math.floor(Math.random() * 5) + 6); // +6 to +10%
    modStat(character, 'smarts', 2);
    modStat(character, 'happiness', -2);

    return {
      success: true,
      title: "Diligent Study",
      body: `You spent hours in the school library poreing over textbooks and lecture notes. Your academic understanding deepened.`,
      effects: { smarts: 2, happiness: -2, grades: 8 }
    };
  }

  function skipClass(character) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    const edu = character.education;
    const gradeLoss = Math.floor(Math.random() * 2) + 2; // -2 to -3%
    edu.grades = Math.max(0, (edu.grades !== undefined ? edu.grades : 75) - gradeLoss);
    modStat(character, 'happiness', 3);
    
    // Disciplinary risk
    const caught = Math.random() < 0.4;
    let body = `You hopped the perimeter fence and spent third period listening to distant radio music behind the grandstands.`;
    const effects = { happiness: 3, grades: -gradeLoss };

    if (caught) {
      edu.disciplinaryRecord = (edu.disciplinaryRecord || 0) + 1;
      body += ` However, the hall monitor spotted you and issued an official detention warning! (Disciplinary Marks: ${edu.disciplinaryRecord})`;
      modStat(character, 'sanity', -2);
      effects.sanity = -2;
    }

    // Check expulsion
    if (edu.disciplinaryRecord >= 5) {
      edu.enrolled = false;
      edu.graduationStatus = 'expelled';
      body += `\n\n[EXPULSION]: Due to repeated truancy and contempt of school authority, the headmaster officially expelled you!`;
    }

    return {
      success: true,
      title: caught ? "Caught Skipping Class!" : "Skipped Class",
      body,
      effects
    };
  }

  function investigateMystery(character, mysteryId) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    const mystery = SCHOOL_MYSTERIES.find(m => m.id === mysteryId) || SCHOOL_MYSTERIES[0];
    let title = mystery.title;
    let body = "";
    const effects = {};

    if (mystery.id === 'boiler_crawlspace') {
      modStat(character, 'occult', 6);
      modStat(character, 'sanity', -2);
      effects.occult = 6;
      effects.sanity = -2;
      body = "You slipped behind the furnace pipes. Amidst spiderwebs and hot asbestos pipes, you discovered charcoal sigils drawn onto the floorboards and a child's silver locket that still ticks faintly.";
      if (Math.random() < 0.3) {
        character.shillings = (character.shillings || 0) + 2;
        effects.shillings = 2;
        body += " Inside the locket, you found 2 antique shillings.";
      }
    } else if (mystery.id === 'drained_pool') {
      modStat(character, 'occult', 5);
      modStat(character, 'sanity', -2);
      effects.occult = 5;
      effects.sanity = -2;
      body = "You climbed down the rusted brass ladder into the dry deep end. In the center drain, a wet handprint was visible that evaporated under your flashlight beam.";
    } else if (mystery.id === 'sealed_stairwell') {
      modStat(character, 'smarts', 2);
      modStat(character, 'occult', 4);
      modStat(character, 'sanity', -2);
      effects.smarts = 2;
      effects.occult = 4;
      effects.sanity = -2;
      body = "You managed to slip a brass wire into the padlock. Behind the door lay an architectural blueprint from 1922 indicating an entire subterranean annex erased from modern maps.";
    } else if (mystery.id === 'pa_broadcast') {
      modStat(character, 'occult', 7);
      modStat(character, 'sanity', -3);
      effects.occult = 7;
      effects.sanity = -3;
      body = "You waited alone until 5:45 PM. The speakers hissed with white noise, followed by rhythmic whispering in an unearthly cadence that made your teeth hum. When you looked out the window, all the crows on the power lines were facing the transmitter tower.";
    }

    return {
      success: true,
      title: `Investigated: ${title}`,
      body,
      effects
    };
  }

  // --- School Classmate Interactions ---
  function interactWithClassmate(classmate, character, actionType) {
    if (!classmate) return { success: false, reason: "No classmate specified." };
    classmate.actionsDone = classmate.actionsDone || {};
    const count = classmate.actionsDone[actionType] || 0;

    if (count >= 5 && actionType !== 'befriend') {
      return { success: false, reason: `You have interacted with ${classmate.name} enough times this year.` };
    }

    classmate.actionsDone[actionType] = count + 1;
    const effects = {};
    let title = "";
    let body = "";

    if (actionType === 'chat') {
      const relGain = Math.floor(Math.random() * 6) + 6;
      classmate.relationship = Math.min(100, classmate.relationship + relGain);
      modStat(character, 'happiness', 3);
      effects.relationship = relGain;
      effects.happiness = 3;
      title = `Chatted with ${classmate.name}`;
      body = `You and ${classmate.name} shared gossip about teachers and whispered through fifth period. They seemed to appreciate your company.`;
    } else if (actionType === 'study_together') {
      const relGain = Math.floor(Math.random() * 5) + 4;
      classmate.relationship = Math.min(100, classmate.relationship + relGain);
      modStat(character, 'smarts', 2);
      if (character.education) {
        character.education.grades = Math.min(100, (character.education.grades !== undefined ? character.education.grades : 75) + 4);
      }
      effects.relationship = relGain;
      effects.smarts = 2;
      effects.grades = 4;
      title = `Studied with ${classmate.name}`;
      body = `You met at the cafeteria tables to review biology notes and solve problem sets. Both of your study notes improved.`;
    } else if (actionType === 'gossip') {
      const success = Math.random() < 0.65;
      if (success) {
        if (character.education) character.education.popularity = Math.min(100, (character.education.popularity || 50) + 4);
        modStat(character, 'happiness', 4);
        effects.popularity = 4;
        effects.happiness = 4;
        title = "Juicy Rumors";
        body = `You exchanged wild stories with ${classmate.name} about what really goes on in the faculty lounge after 4 PM. Your school clout went up.`;
      } else {
        classmate.relationship = Math.max(0, classmate.relationship - 8);
        effects.relationship = -8;
        title = "Gossip Backfired";
        body = `${classmate.name} took offense to the rumors and called you untrustworthy.`;
      }
    } else if (actionType === 'dare') {
      const success = Math.random() < 0.7;
      if (success) {
        if (character.education) character.education.popularity = Math.min(100, (character.education.popularity || 50) + 7);
        modStat(character, 'happiness', 5);
        effects.popularity = 7;
        effects.happiness = 5;
        title = "Playground Dare Completed!";
        body = `You dared ${classmate.name} to eat a strange dried mushroom found beneath the gymnasium bleachers. A crowd gathered and cheered!`;
      } else {
        modStat(character, 'vitality', -2);
        effects.vitality = -2;
        title = "Dare Gone Wrong";
        body = `The dare resulted in a minor scuffle behind the bicycle shed. You scraped your knee on broken gravel.`;
      }
    } else if (actionType === 'prank') {
      const success = Math.random() < 0.55;
      if (success) {
        modStat(character, 'happiness', 6);
        effects.happiness = 6;
        title = "Prank Successful!";
        body = `You slipped a spring-loaded toy spider inside ${classmate.name}'s locker. Their startled shriek echoed down the entire hall!`;
      } else {
        classmate.relationship = Math.max(0, classmate.relationship - 15);
        if (character.education) character.education.disciplinaryRecord = (character.education.disciplinaryRecord || 0) + 1;
        effects.relationship = -15;
        title = "Prank Caught!";
        body = `${classmate.name} was furious and reported you to the homeroom teacher. You received a disciplinary mark.`;
      }
    } else if (actionType === 'befriend') {
      if (classmate.isBefriended) {
        return { success: false, reason: `${classmate.name} is already one of your close friends!` };
      }
      if (classmate.relationship < 50) {
        return {
          success: false,
          reason: `${classmate.name} does not know you well enough yet (Requires Closeness 50%+). Spend more time together first!`
        };
      }

      // Convert classmate into permanent friend in character.kin.friends
      classmate.isBefriended = true;
      if (!character.kin) character.kin = window.generateFamily ? window.generateFamily(character) : { friends: [] };
      if (!character.kin.friends) character.kin.friends = [];

      const newFriend = {
        id: 'friend_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        category: 'friend',
        role: 'Friend (Classmate)',
        name: classmate.name,
        gender: classmate.gender,
        age: character.age,
        origin: character.education ? `${character.education.name} (${classmate.clique})` : 'School Classmate',
        alive: true,
        deathYear: null,
        deathCause: null,
        relationship: classmate.relationship,
        entityType: classmate.entityType || 'human',
        suspicion: 0,
        isRevealed: classmate.entityType === 'human',
        loyalty: 'neutral',
        actionsDone: window.createEmptyActionsDone ? window.createEmptyActionsDone() : {}
      };

      character.kin.friends.push(newFriend);
      modStat(character, 'happiness', 10);
      effects.relationship = 15;
      effects.happiness = 10;
      title = "New Best Friend!";
      body = `${classmate.name} smiled and accepted your friendship! You exchanged phone numbers and promises to look out for each other. They are now in your permanent Kin & Friends roster.`;
    }

    return {
      success: true,
      title,
      body,
      effects
    };
  }

  // --- Teacher Interactions ---
  function interactWithTeacher(teacher, character, actionType) {
    if (!teacher) return { success: false, reason: "No teacher specified." };
    teacher.actionsDone = teacher.actionsDone || {};
    const count = teacher.actionsDone[actionType] || 0;

    if (count >= 4) {
      return { success: false, reason: `You have already performed this action with ${teacher.name} this year.` };
    }

    teacher.actionsDone[actionType] = count + 1;
    const effects = {};
    let title = "";
    let body = "";

    if (actionType === 'praise') {
      const relGain = Math.floor(Math.random() * 6) + 5;
      teacher.relationship = Math.min(100, teacher.relationship + relGain);
      effects.relationship = relGain;
      title = `Praised ${teacher.name}`;
      body = `You stayed behind after class to compliment ${teacher.name}'s lesson plan. They seemed genuinely flattered by your attentiveness.`;
    } else if (actionType === 'ask_help') {
      const relGain = Math.floor(Math.random() * 4) + 3;
      teacher.relationship = Math.min(100, teacher.relationship + relGain);
      modStat(character, 'smarts', 2);
      if (character.education) character.education.grades = Math.min(100, (character.education.grades !== undefined ? character.education.grades : 75) + 5);
      effects.relationship = relGain;
      effects.smarts = 2;
      effects.grades = 5;
      title = `Academic Tutoring`;
      body = `${teacher.name} sat down with you to review challenging curriculum problems. Your comprehension significantly improved.`;
    } else if (actionType === 'complain') {
      const backfire = Math.random() * 100 < teacher.strictness;
      if (backfire) {
        teacher.relationship = Math.max(0, teacher.relationship - 12);
        if (character.education) character.education.disciplinaryRecord = (character.education.disciplinaryRecord || 0) + 1;
        effects.relationship = -12;
        title = "Disciplinary Reprimand";
        body = `${teacher.name} took strong offense to your complaint and cited you for insubordination in the classroom.`;
      } else {
        teacher.relationship = Math.max(0, teacher.relationship - 4);
        if (character.education) character.education.grades = Math.min(100, character.education.grades + 3);
        effects.relationship = -4;
        effects.grades = 3;
        title = "Grade Adjustment";
        body = `${teacher.name} sighed, admitted the assignment had typos, and awarded you 3 extra credit points.`;
      }
    } else if (actionType === 'bribe') {
      const bribeAmount = 50;
      if (character.money < bribeAmount) {
        return { success: false, reason: `You don't have enough pocket money ($${bribeAmount}) to offer an academic bribe.` };
      }
      character.money -= bribeAmount;
      effects.money = -bribeAmount;

      if (teacher.strictness > 60) {
        teacher.relationship = Math.max(0, teacher.relationship - 25);
        if (character.education) character.education.disciplinaryRecord = (character.education.disciplinaryRecord || 0) + 2;
        effects.relationship = -25;
        title = "Bribe Vehemently Rejected!";
        body = `${teacher.name} slammed their desk in outrage! "Are you attempting to bribe faculty?!" You were escorted straight to the headmaster's office.`;
      } else {
        teacher.relationship = Math.min(100, teacher.relationship + 10);
        if (character.education) character.education.grades = Math.min(100, character.education.grades + 12);
        effects.relationship = 10;
        effects.grades = 12;
        title = "Bribe Quietly Accepted";
        body = `${teacher.name} slid the envelope into their desk drawer with a subtle nod. Your semester grade miraculously ticked upward.`;
      }
    }

    return {
      success: true,
      title,
      body,
      effects
    };
  }

  // --- Role-Specific Staff Interactions ---
  function interactWithStaff(staffMember, character, actionType) {
    if (!staffMember) return { success: false, reason: "No staff member specified." };
    staffMember.actionsDone = staffMember.actionsDone || {};
    const count = staffMember.actionsDone[actionType] || 0;

    if (count >= 4) {
      return { success: false, reason: `You have already interacted with ${staffMember.name} in this way this year.` };
    }

    staffMember.actionsDone[actionType] = count + 1;
    const effects = {};
    let title = "";
    let body = "";

    // 1. JANITOR ACTIONS
    if (actionType === 'help_clean') {
      const relGain = Math.floor(Math.random() * 6) + 8;
      staffMember.relationship = Math.min(100, staffMember.relationship + relGain);
      if (character.education) character.education.popularity = Math.min(100, (character.education.popularity || 50) + 3);
      modStat(character, 'vitality', 1);
      effects.relationship = relGain;
      effects.popularity = 3;
      effects.vitality = 1;
      title = `Helped Clean the Corridors`;
      body = `You grabbed a heavy push-broom and helped ${staffMember.name} sweep the dusty south corridors and empty chalkboard dustbins. He gave you an approving grin.`;

      // Chance to find loose coins or odd relics
      if (Math.random() < 0.35) {
        const foundMoney = Math.floor(Math.random() * 15) + 5;
        character.money = (character.money || 0) + foundMoney;
        effects.money = foundMoney;
        body += ` Under a radiator, you found $${foundMoney} in dropped pocket change!`;
      }
    } else if (actionType === 'ask_boiler_room') {
      modStat(character, 'occult', 5);
      modStat(character, 'sanity', -2);
      effects.occult = 5;
      effects.sanity = -2;
      title = `Inquired About the Boiler Room`;
      body = `${staffMember.name}'s eyes narrowed. He looked both ways before whispering: "The foundation was poured over an old quarry shaft in 1894. If you hear rhythmic metallic banging down there when the coal stoves are off... don't go looking."`;
    } else if (actionType === 'search_lost_found') {
      const roll = Math.random();
      title = `Searched the Lost & Found Bin`;
      if (roll < 0.4) {
        const found = Math.floor(Math.random() * 20) + 10;
        character.money = (character.money || 0) + found;
        effects.money = found;
        body = `${staffMember.name} let you rummage through the wooden crate. At the bottom of an abandoned winter coat, you found $${found}!`;
      } else if (roll < 0.7) {
        modStat(character, 'occult', 4);
        modStat(character, 'sanity', -2);
        effects.occult = 4;
        effects.sanity = -2;
        body = `You pulled out an old silver signet ring with an engraving of an unblinking eye. It felt strangely warm against your skin. (+4% Occult)`;
      } else {
        body = `You dug through stacks of moth-eaten woolen scarves and mismatched rain boots, finding nothing of real note.`;
      }
    }

    // 2. LIBRARIAN ACTIONS
    else if (actionType === 'reorganize_shelves') {
      const relGain = Math.floor(Math.random() * 6) + 8;
      staffMember.relationship = Math.min(100, staffMember.relationship + relGain);
      modStat(character, 'smarts', 2);
      if (character.education) character.education.grades = Math.min(100, (character.education.grades !== undefined ? character.education.grades : 75) + 3);
      effects.relationship = relGain;
      effects.smarts = 2;
      effects.grades = 3;
      title = `Reorganized Library Stacks`;
      body = `You climbed the rolling wooden ladder and helped ${staffMember.name} reshelve hundreds of municipal encyclopedias and leather-bound periodicals. She praised your quiet precision.`;
    } else if (actionType === 'catalog_archives') {
      modStat(character, 'smarts', 3);
      modStat(character, 'occult', 4);
      effects.smarts = 3;
      effects.occult = 4;
      title = `Cataloged Historical Archives`;
      body = `Working through damp microfiche reels, you cataloged town tax registers from the 1930s. Several entire family lineages abruptly vanished from records in 1937 without explanation.`;
    } else if (actionType === 'restricted_tomes') {
      const charSmarts = getStat(character, 'smarts');
      if (staffMember.relationship < 55 && charSmarts < 70) {
        return {
          success: false,
          reason: `${staffMember.name} adjusted her glasses and firmly locked the glass cabinet. "The restricted reserve collection is strictly forbidden to general students." (Requires Closeness 55%+ or Smarts 70%+)`
        };
      }
      modStat(character, 'occult', 10);
      modStat(character, 'sanity', -3);
      effects.occult = 10;
      effects.sanity = -3;
      title = `The Locked Glass Cabinet`;
      body = `${staffMember.name} quietly turned a brass key in the oak cabinet and allowed you to inspect a hand-bound volume with vellum leaves. The illustrations depicted stars arranged in geometries that made your eyes water.`;
    }

    // 3. SCHOOL NURSE ACTIONS
    else if (actionType === 'rest_cot') {
      modStat(character, 'vitality', 6);
      modStat(character, 'sanity', 3);
      effects.vitality = 6;
      effects.sanity = 3;
      title = `Rested in the Clinic`;
      body = `You told ${staffMember.name} you had a debilitating migraine. She placed a cool lavender compress on your forehead and let you sleep on the cot behind white privacy curtains for two uninterrupted hours.`;
    } else if (actionType === 'report_anomaly') {
      modStat(character, 'sanity', 4);
      effects.sanity = 4;
      title = `Consulted the School Nurse`;
      body = `You described the cold static in your ears and lingering shadow illusions. ${staffMember.name} checked your pulse calmly, gave you warm chamomile infusion, and reassured you that adolescent exhaustion plays cruel tricks on perception.`;
    }

    // 4. PRINCIPAL ACTIONS
    else if (actionType === 'appeal_discipline') {
      const rec = character.education ? (character.education.disciplinaryRecord || 0) : 0;
      if (rec <= 0) {
        return { success: false, reason: "You have a clean disciplinary record with nothing to appeal!" };
      }
      const success = Math.random() < 0.6;
      if (success) {
        character.education.disciplinaryRecord = Math.max(0, rec - 1);
        staffMember.relationship = Math.min(100, staffMember.relationship + 6);
        effects.relationship = 6;
        title = `Disciplinary Appeal Granted`;
        body = `You presented a formal written letter of remorse. ${staffMember.name} cleared 1 infraction mark from your permanent file and commended your maturity.`;
      } else {
        staffMember.relationship = Math.max(0, staffMember.relationship - 5);
        effects.relationship = -5;
        title = `Appeal Denied`;
        body = `${staffMember.name} remained impassive: "Consequences exist for a reason in this institution. Your record stands."`;
      }
    } else if (actionType === 'school_pride') {
      staffMember.relationship = Math.min(100, staffMember.relationship + 8);
      if (character.education) character.education.popularity = Math.min(100, (character.education.popularity || 50) + 4);
      effects.relationship = 8;
      effects.popularity = 4;
      title = `Displayed Institutional Pride`;
      body = `You praised the school's historical traditions and academic rigor. ${staffMember.name} beamed with institutional pride and shook your hand.`;
    }

    // 5. DAYCARE / KINDERGARTEN NURTURE ACTIONS
    else if (actionType === 'nurture') {
      const relGain = Math.floor(Math.random() * 6) + 8;
      staffMember.relationship = Math.min(100, staffMember.relationship + relGain);
      modStat(character, 'happiness', 5);
      effects.relationship = relGain;
      effects.happiness = 5;
      title = `Nurtured by Caregiver`;
      body = `${staffMember.name} gave you a reassuring hug and read you an illustrated nursery tale. You felt secure and peaceful.`;
    } else if (actionType === 'ask_snack') {
      modStat(character, 'vitality', 3);
      modStat(character, 'happiness', 3);
      effects.vitality = 3;
      effects.happiness = 3;
      title = `Warm Nursery Snack`;
      body = `${staffMember.name} handed you a cup of warm apple cider and animal crackers.`;
    }

    return {
      success: true,
      title,
      body,
      effects
    };
  }

  // --- University Application Handler ---
  function applyToUniversity(character, majorId) {
    if (character.age < 18) {
      return { success: false, reason: "You must be at least 18 years old to apply to University." };
    }
    if (!character.hasHighSchoolDiploma) {
      return { success: false, reason: "You require a valid High School Diploma to enroll in University." };
    }
    const major = UNIVERSITY_MAJORS.find(m => m.id === majorId) || UNIVERSITY_MAJORS[0];
    
    // Check acceptance roll based on smarts
    const charSmarts = getStat(character, 'smarts');
    const accepted = charSmarts >= 40 || Math.random() < 0.75;
    if (!accepted) {
      return {
        success: false,
        reason: `Your application to study ${major.name} was rejected due to competitive admissions. Improve your smarts or reapply next year!`
      };
    }

    // Enroll
    enrollInSchool(character, 'university', major.name);
    return {
      success: true,
      title: "Accepted into University!",
      body: `Congratulations! You have been formally matriculated into the Department of ${major.name} at ${character.education.name}!`,
      effects: { smarts: 4, happiness: 10 }
    };
  }

  // --- Drop Out Handler ---
  function dropOutOfSchool(character) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not enrolled in any school." };
    }
    if (character.education.level !== 'high' && character.education.level !== 'university') {
      return { success: false, reason: "You cannot legally drop out before High School!" };
    }

    character.education.enrolled = false;
    character.education.graduationStatus = 'dropped_out';
    modStat(character, 'happiness', 5);

    return {
      success: true,
      title: "Dropped Out",
      body: `You packed your locker, turned in your books, and walked out of ${character.education.name} for the last time. Your formal education has ceased.`,
      effects: { happiness: 5 }
    };
  }

  // --- Export to Global Scope ---
  window.SCHOOL_CLUBS = SCHOOL_CLUBS;
  window.SCHOOL_MYSTERIES = SCHOOL_MYSTERIES;
  window.SCHOOL_TRACKS = SCHOOL_TRACKS;
  window.UNIVERSITY_MAJORS = UNIVERSITY_MAJORS;
  window.getTuitionCost = getTuitionCost;
  window.askParentsForTuition = askParentsForTuition;
  window.applyForScholarship = applyForScholarship;
  window.enrollInSchool = enrollInSchool;
  window.tickEducationYear = tickEducationYear;
  window.studyHarder = studyHarder;
  window.skipClass = skipClass;
  window.investigateMystery = investigateMystery;
  window.interactWithClassmate = interactWithClassmate;
  window.interactWithTeacher = interactWithTeacher;
  window.interactWithStaff = interactWithStaff;
  window.applyToUniversity = applyToUniversity;
  window.dropOutOfSchool = dropOutOfSchool;

})();
