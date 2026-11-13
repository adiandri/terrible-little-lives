// Education, Schools, Faculty & Staff Engine for Terrible Little Lives
// Implements BitLife-style educational lifecycle with atmospheric cosmic horror themes.

(function() {
  'use strict';

  // --- School Name Tables by Region ---
  const SCHOOL_NAMES = {
    USA: {
      nursery: ["Home Nursery & Cedar Crib", "Domestic Infant Parlor", "Quiet Hearth Nursery"],
      daycare: ["Little Sprouts Toddler Creche", "Sunny Days Playgroup", "St. Jude's Parish Creche", "Pinewood Early Care"],
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
      nursery: ["Kamar Bayi Keluarga", "Ayunan Kayu Rumah", "Ruang Asuh Keluarga"],
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
      nursery: ["The Upstairs Nursery Parlor", "Hearthside Wicker Cradle", "Domestic Infant Nursery"],
      daycare: ["St. Bartholomew's Creche", "Little Lambs Toddler Nursery", "Briarwood Early Years"],
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
      nursery: ["Home Nursery & Crib", "Domestic Infant Parlor", "Quiet Hearth Cradle"],
      daycare: ["Little Blossoms Toddler Creche", "St. Jude's Playgroup", "Morning Mist Early Care"],
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
    if (window.generateCharacterName) {
      const res = window.generateCharacterName({ countryCode, gender });
      return res.first;
    }
    const data = window.COUNTRIES_DATA || {};
    const country = data[countryCode] || data.USA || { firstNamesMale: ["James", "John", "Thomas"], firstNamesFemale: ["Mary", "Sarah", "Clara"] };
    const list = gender === 'Male' ? country.firstNamesMale : country.firstNamesFemale;
    return getRandomItem(list) || (gender === 'Male' ? "James" : "Mary");
  }

  function getRandomLastName(countryCode) {
    const data = window.COUNTRIES_DATA || {};
    const country = data[countryCode] || data.USA || { surnames: ["Smith", "Blackwood", "Henderson", "Albright", "Vance"] };
    return getRandomItem(country.surnames) || "Smith";
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

  function generateSchoolAvatar(categoryOrPerson, roleOrCategory, genderOrLevel, age, clique = null, schoolType = 'public', isAnomaly = false) {
    let category, role, gender, personAge, peerClique, sType, anomaly;
    if (typeof categoryOrPerson === 'object' && categoryOrPerson !== null) {
      const p = categoryOrPerson;
      category = roleOrCategory || p.category || 'classmate';
      role = p.role || (category === 'classmate' ? 'Classmate' : 'Faculty');
      gender = p.gender || (Math.random() < 0.5 ? 'Male' : 'Female');
      personAge = p.age || age || 16;
      peerClique = p.clique || null;
      sType = genderOrLevel || 'public';
      anomaly = !!(p.isAnomaly || p.curse);
    } else {
      category = categoryOrPerson || 'classmate';
      role = roleOrCategory || 'Classmate';
      gender = genderOrLevel || (Math.random() < 0.5 ? 'Male' : 'Female');
      personAge = age || 16;
      peerClique = clique;
      sType = schoolType || 'public';
      anomaly = isAnomaly;
    }

    let clothing = 'casual';
    let clothingColor = 'charcoal';
    let hairColor = undefined;
    let glasses = 'none';
    let headwear = 'none';
    let necklace = 'none';
    let eyeExtra = 'none';
    let eyeColor = undefined;

    if (category === 'classmate') {
      if (sType === 'private') {
        clothing = 'prep_blazer';
        clothingColor = 'school_navy';
      } else if (sType === 'elite') {
        clothing = 'elite_uniform';
        clothingColor = 'school_maroon';
      }

      if (peerClique === 'Goths' || peerClique === 'Occult Cabalists') {
        clothing = (sType === 'public') ? 'goth' : clothing;
        hairColor = 'raven';
        necklace = 'choker';
        eyeExtra = 'eyeliner';
      } else if (peerClique === 'Nerds' || peerClique === 'Honor Society' || peerClique === 'Academic Overachievers') {
        clothing = (sType === 'public') ? 'sweater' : clothing;
        glasses = Math.random() < 0.75 ? 'round_wire' : 'square';
      } else if (peerClique === 'Jocks') {
        clothing = 'casual';
        clothingColor = 'navy';
        headwear = Math.random() < 0.5 ? 'baseball_cap' : 'none';
      } else if (peerClique === 'Artists') {
        clothing = (sType === 'public') ? 'turtleneck' : clothing;
        headwear = Math.random() < 0.4 ? 'beret' : 'none';
        necklace = 'pendant';
        if (Math.random() < 0.4) hairColor = 'rose';
      }

      if (anomaly) {
        eyeColor = Math.random() < 0.5 ? 'violet' : (Math.random() < 0.5 ? 'golden' : 'crimson');
        eyeExtra = 'tired_eyes';
      }
    } else if (category === 'teacher') {
      const r = role || '';
      if (r.includes('Science') || r.includes('Chemistry') || r.includes('Biology')) {
        clothing = 'lab_coat';
        glasses = Math.random() < 0.6 ? 'round_wire' : 'none';
      } else if (r.includes('Math') || r.includes('Latin') || r.includes('Head') || r.includes('Dean')) {
        clothing = 'suit';
        clothingColor = 'black';
        glasses = Math.random() < 0.5 ? 'thick_frame' : 'none';
      } else if (r.includes('Art') || r.includes('Drama') || r.includes('Music')) {
        clothing = 'sweater';
        clothingColor = 'mustard';
        headwear = Math.random() < 0.35 ? 'beret' : 'none';
      } else {
        clothing = (sType === 'elite' || sType === 'private') ? 'suit' : 'sweater';
        clothingColor = 'tweed_brown';
      }
    } else if (category === 'staff') {
      const r = role || '';
      if (r.includes('Janitor') || r.includes('Caretaker') || r.includes('Grounds')) {
        clothing = 'casual';
        clothingColor = 'denim';
        headwear = 'baseball_cap';
      } else if (r.includes('Nurse') || r.includes('Doctor') || r.includes('Matron')) {
        clothing = 'scrubs';
        clothingColor = 'scrubs_teal';
      } else if (r.includes('Librarian')) {
        clothing = 'sweater';
        clothingColor = 'forest';
        glasses = 'round_wire';
      } else if (r.includes('Principal') || r.includes('Inspector') || r.includes('Dean') || r.includes('Chancellor')) {
        clothing = 'suit';
        clothingColor = 'navy';
      }
    }

    return window.generateRandomAvatar({
      gender,
      age: personAge || 16,
      clothing,
      clothingColor,
      hairColor,
      glasses,
      headwear,
      necklace,
      eyeExtra,
      eyeColor
    });
  }
  window.generateSchoolAvatar = generateSchoolAvatar;

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
      const peerGender = isMale ? 'Male' : 'Female';
      
      let peerFullName = "";
      if (window.generateCharacterName) {
        peerFullName = window.generateCharacterName({ countryCode: character.countryCode, gender: peerGender }).fullName;
      } else {
        const first = isMale ? window.getRandomFirstName(character.countryCode, 'Male') : window.getRandomFirstName(character.countryCode, 'Female');
        const surname = window.getRandomLastName(character.countryCode);
        peerFullName = surname ? `${first} ${surname}` : first;
      }
      
      const roll = Math.random();
      let entityType = 'human';
      if (roll < 0.03) entityType = 'blatant_entity';
      else if (roll < 0.10) entityType = 'disguised_mimic';
      else if (roll < 0.22) entityType = 'anomaly';

      const peerClique = getRandomItem(cliques);
      const isAnomaly = entityType !== 'human';
      const peerAvatar = generateSchoolAvatar('classmate', 'Classmate', peerGender, character.age, peerClique, schoolType, isAnomaly);

      classmates.push({
        id: 'peer_' + Date.now() + '_' + i + '_' + Math.floor(Math.random() * 1000),
        category: 'classmate',
        name: peerFullName,
        gender: peerGender,
        age: character.age,
        popularity: Math.floor(Math.random() * 60) + 20, // 20 - 80%
        smarts: Math.floor(Math.random() * 60) + 20,
        relationship: Math.floor(Math.random() * 30) + 35, // 35 - 65% initial
        clique: peerClique,
        entityType,
        isRevealed: entityType === 'human',
        isBefriended: false,
        avatar: peerAvatar,
        actionsDone: { chat: 0, study: 0, gossip: 0, dare: 0, prank: 0, befriend: 0 }
      });
    }
    return classmates;
  }

  function finalizeTeachers(teachers, schoolType) {
    teachers.forEach(t => {
      if (!t.avatar) {
        const tAge = Math.floor(Math.random() * 25) + 32;
        t.avatar = generateSchoolAvatar('teacher', t.role, t.gender, tAge, null, schoolType);
      }
    });
    return teachers;
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
      return finalizeTeachers(teachers, schoolType);
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
      return finalizeTeachers(teachers, schoolType);
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
      return finalizeTeachers(teachers, schoolType);
    }

    if (level === 'nursery') {
      const parentList = (character.kin && character.kin.parents) ? character.kin.parents.filter(p => p.alive !== false) : [];
      const primaryParent = parentList[0];
      teachers.push({
        id: 'teach_nursery_parent',
        category: 'teacher',
        role: 'Primary Parent Caregiver',
        name: primaryParent ? `${primaryParent.name} (${primaryParent.role || 'Parent'})` : `Matron ${window.getRandomLastName(country)}`,
        gender: primaryParent && primaryParent.gender ? primaryParent.gender : 'Female',
        strictness: primaryParent && primaryParent.strictness !== undefined ? primaryParent.strictness : 25,
        relationship: primaryParent && primaryParent.relationship !== undefined ? primaryParent.relationship : 75,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
      teachers.push({
        id: 'teach_nursery_nursemaid',
        category: 'teacher',
        role: 'Visiting Parish Nursemaid',
        name: `Nurse ${window.getRandomLastName(country)}`,
        gender: 'Female',
        strictness: 20,
        relationship: 60,
        actionsDone: { praise: 0, ask_help: 0, complain: 0, bribe: 0 }
      });
    } else if (level === 'daycare') {
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

    return finalizeTeachers(teachers, schoolType);
  }

  function finalizeStaff(staff, schoolType) {
    staff.forEach(s => {
      if (!s.avatar) {
        const sAge = Math.floor(Math.random() * 25) + 35;
        s.avatar = generateSchoolAvatar('staff', s.role, s.gender, sAge, null, schoolType);
      }
    });
    return staff;
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
      return finalizeStaff(staff, schoolType);
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
      return finalizeStaff(staff, schoolType);
    }

    if (level === 'nursery' || level === 'daycare' || level === 'kindergarten') {
      staff.push({
        id: 'staff_daycare_matron',
        category: 'staff',
        role: level === 'nursery' ? 'Household Nursemaid' : 'Nursery Matron',
        name: `Sister ${window.getRandomFirstName(country, 'Female')}`,
        gender: 'Female',
        quirk: level === 'nursery'
          ? 'Hums old minor-key lullabies while adjusting the crib blankets and checking for drafts.'
          : 'Dispenses warm chamomile tea and soft biscuits during tantrums.',
        relationship: 60,
        actionsDone: { nurture: 0, ask_snack: 0 }
      });
      staff.push({
        id: 'staff_daycare_custodian',
        category: 'staff',
        role: level === 'nursery' ? 'House Caretaker' : 'Facility Caretaker',
        name: `Mr. ${window.getRandomLastName(country)}`,
        gender: 'Male',
        quirk: level === 'nursery'
          ? 'Keeps the coal stove banked and checks the nursery window latches before dusk.'
          : 'Quietly mops spilled fruit juice with smelling salts.',
        relationship: 50,
        actionsDone: { help_clean: 0 }
      });
      return finalizeStaff(staff, schoolType);
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

    return finalizeStaff(staff, schoolType);
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

    const edu = character.education || {};
    const currGrades = edu.grades !== undefined ? edu.grades : 75;
    const currDisc = edu.disciplinaryRecord || 0;

    // Strict Institutional Admission Gates (applies before parents can even wire tuition)
    if (schoolType === 'private') {
      if (currGrades < 75 || currDisc > 1) {
        return {
          granted: false,
          reason: `ADMISSIONS REJECTED: Private Preparatory Academies require a minimum 75% Academic Standing (Current: ${currGrades}%) and at most 1 Disciplinary Mark (Current: ${currDisc}).`
        };
      }
    } else if (schoolType === 'elite') {
      if (character.age < 6 || level === 'nursery' || level === 'daycare' || level === 'kindergarten') {
        return {
          granted: false,
          reason: "ADMISSIONS REJECTED: The Elite Aristocratic Academy does not matriculate students prior to Elementary School (Age 6+)."
        };
      }
      if (currGrades < 90 || currDisc > 0) {
        return {
          granted: false,
          reason: `ADMISSIONS REJECTED: The Elite Aristocratic Academy demands a spotless transcript of 90%+ Academic Grades (Current: ${currGrades}%) and 0 Disciplinary Marks (Current: ${currDisc}).`
        };
      }
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

    const wealthTier = (character.kin && character.kin.wealthTier) || 'modest';
    const householdType = (character.upbringing && character.upbringing.householdType) || (character.kin && character.kin.householdAtmosphere) || 'ordinary';

    if (schoolType === 'private') {
      if (wealthTier !== 'comfortable' && wealthTier !== 'affluent') {
        return {
          granted: false,
          reason: `Your parents explained that Private Preparatory tuition is beyond a ${wealthTier} household budget. Only Comfortable or Affluent families can finance private tuition directly (or you must earn a Merit Scholarship).`
        };
      }
      if ((householdType === 'neglectful' || householdType === 'alcoholic' || householdType === 'volatile') && avgRel < 85) {
        return {
          granted: false,
          reason: "Given the strained, volatile atmosphere at home, your parents flatly refused to sign a private preparatory tuition contract for you."
        };
      }
      if (avgRel < 55 && avgGen < 60) {
        return {
          granted: false,
          reason: "Your parents declined to fund private preparatory tuition due to your strained relationship with them."
        };
      }
      parents.forEach(p => {
        if (p.relationship !== undefined) p.relationship = Math.min(100, p.relationship + 3);
      });
      return {
        granted: true,
        message: "After verifying your strong academic transcript and reviewing family accounts, your parents agreed to finance your Private Preparatory Academy tuition."
      };
    } else if (schoolType === 'elite') {
      if (wealthTier !== 'affluent') {
        return {
          granted: false,
          reason: "Your parents gasped at the $25,000/yr aristocratic endowment fee: 'Only dynastic Affluent families can pay Elite Academy tuition outright! You will need to qualify for the Founder's or Prodigy Scholarship.'"
        };
      }
      if (avgRel < 65) {
        return {
          granted: false,
          reason: "Despite your family's wealth, your parents refused to pledge the Elite Academy endowment until you show greater filial respect (Requires 65%+ Parental Closeness)."
        };
      }
      parents.forEach(p => {
        if (p.relationship !== undefined) p.relationship = Math.min(100, p.relationship + 4);
      });
      return {
        granted: true,
        message: "Your aristocratic family beamed at your spotless academic dossier and wired the full tuition endowment to the Elite Academy bursar."
      };
    }

    return { granted: false, reason: "Admissions inquiry could not be completed." };
  }

  function applyForScholarship(character, schoolType, level) {
    if (schoolType === 'homeschool' || schoolType === 'public') {
      return { granted: true, message: "No scholarship needed; education is already cost-free." };
    }

    const edu = character.education || {};
    const currGrades = edu.grades !== undefined ? edu.grades : 75;
    const currDisc = edu.disciplinaryRecord || 0;
    const smarts = getStat(character, 'smarts');
    const occult = getStat(character, 'occult');
    const hasRibbon = !!(edu.academicRibbon || character.hasAcademicRibbon);

    if (schoolType === 'private') {
      if (currDisc > 1) {
        return {
          granted: false,
          reason: `SCHOLARSHIP DENIED: Private Preparatory scholarship candidates cannot have more than 1 Disciplinary Mark on their record (Current: ${currDisc}).`
        };
      }
      if (currGrades < 85 || smarts < 80) {
        return {
          granted: false,
          reason: `SCHOLARSHIP DENIED: The Preparatory Merit Committee requires at least 85% Academic Grades (Current: ${currGrades}%) and 80% Smarts (Current: ${smarts}%) to qualify for a full tuition waiver.`
        };
      }
      return {
        granted: true,
        type: "Preparatory Merit Honors Scholarship",
        message: `You passed the rigorous classical entrance examination (${smarts}% Smarts, ${currGrades}% Grades). The Preparatory Board awarded you a 100% Merit Honors Scholarship!`
      };
    } else if (schoolType === 'elite') {
      if (character.age < 6 || level === 'nursery' || level === 'daycare' || level === 'kindergarten') {
        return {
          granted: false,
          reason: "SCHOLARSHIP DENIED: The Elite Aristocratic Academy does not admit students before Elementary School (Age 6+)."
        };
      }
      if (currDisc > 0) {
        return {
          granted: false,
          reason: `SCHOLARSHIP DENIED: The Elite Academy Board immediately disqualifies any scholarship petitioner with a disciplinary blemish (Current Marks: ${currDisc}).`
        };
      }
      if (currGrades < 94) {
        return {
          granted: false,
          reason: `SCHOLARSHIP DENIED: Elite Academy Fellowship seats require a near-flawless 94%+ Academic Grade average (Current: ${currGrades}%).`
        };
      }
      if (occult >= 75) {
        return {
          granted: true,
          type: "Founder's Esoteric Fellowship",
          message: `During the candlelit Admissions Inquest, you translated the Latin and Enochian sigils carved beneath the Chancellor's lectern (${occult}% Occult, ${currGrades}% Grades). The Order of the Gilded Bell quietly underwrote 100% of your tuition!`
        };
      }
      if (smarts >= 92 || (smarts >= 88 && hasRibbon)) {
        return {
          granted: true,
          type: "Aristocratic Prodigy Fellowship",
          message: `Your extraordinary examination defense (${smarts}% Smarts, ${currGrades}% Grades${hasRibbon ? ', Academic Ribbon Laureate' : ''}) stunned the High Chancellor's inquest panel. You were awarded the rare Aristocratic Prodigy Fellowship!`
        };
      }
      return {
        granted: false,
        reason: `SCHOLARSHIP DENIED: Despite your 94%+ grades, the Elite Academy Inquest requires either Prodigy Intellect (92%+ Smarts, or 88%+ with an Academic Ribbon) or Deep Esoteric Resonance (75%+ Occult).`
      };
    }

    return { granted: false, reason: "Admissions board did not accept application." };
  }

  // --- Initial Enrollment Factory ---
  function enrollInSchool(character, targetLevel = null, major = null, schoolType = null, tuitionPayer = null) {
    let level = targetLevel;
    if (!level) {
      if (character.age >= 0 && character.age <= 1) level = 'nursery';
      else if (character.age >= 2 && character.age <= 3) level = 'daycare';
      else if (character.age >= 4 && character.age <= 5) level = 'kindergarten';
      else if (character.age >= 6 && character.age <= 10) level = 'elementary';
      else if (character.age >= 11 && character.age <= 13) level = 'middle';
      else if (character.age >= 14 && character.age <= 17) level = 'high';
      else level = null;
    }

    if (!level) return null;

    const chosenTrack = (level === 'nursery' || level === 'daycare') ? 'public' : (schoolType || (character.education && character.education.schoolType) || 'public');
    const chosenPayer = tuitionPayer || (chosenTrack === 'homeschool' || chosenTrack === 'public' ? 'free' : ((character.education && character.education.tuitionPayer) || 'parents'));

    let gradeYear = 1;
    let maxGradeYears = 5;
    if (level === 'nursery') {
      gradeYear = Math.max(1, character.age + 1);
      maxGradeYears = 2;
    } else if (level === 'daycare') {
      gradeYear = Math.max(1, character.age - 1);
      maxGradeYears = 2;
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

    const prevEdu = character.education || {};
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
      grades: prevEdu.grades !== undefined && prevEdu.level === level ? prevEdu.grades : (Math.floor(Math.random() * 25) + 62),
      popularity: chosenTrack === 'homeschool' ? 50 : (prevEdu.popularity !== undefined && prevEdu.level === level ? prevEdu.popularity : (Math.floor(Math.random() * 30) + 40)),
      disciplinaryRecord: prevEdu.level === level ? (prevEdu.disciplinaryRecord || 0) : 0,
      clubs: [],
      clubRanks: prevEdu.clubRanks || {},
      clubActionsThisYear: {},
      mysteryChapters: prevEdu.mysteryChapters || {},
      stageActionsThisYear: {},
      socialClique: prevEdu.socialClique || null,
      academicRibbon: prevEdu.academicRibbon || false,
      studentCouncilRank: prevEdu.studentCouncilRank || null,
      gildedBellMember: prevEdu.gildedBellMember || false,
      classmates: generateClassmates(character, level === 'nursery' ? 3 : 6, chosenTrack),
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
          nursery: 'Home Nursery & Crib',
          daycare: 'Toddler Creche & Playgroup',
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

    // Reset annual stage & club action quotas
    edu.stageActionsThisYear = {};
    edu.clubActionsThisYear = {};

    // Reset interaction action quotas for peers/teachers/staff each year
    if (edu.classmates) {
      edu.classmates.forEach(c => { c.actionsDone = { chat: 0, study: 0, gossip: 0, dare: 0, prank: 0, insult: 0, befriend: 0 }; if (window.ageNpcMemories) window.ageNpcMemories(c); });
    }
    if (edu.teachers) {
      edu.teachers.forEach(t => { t.actionsDone = { praise: 0, ask_help: 0, complain: 0, bribe: 0 }; if (window.ageNpcMemories) window.ageNpcMemories(t); });
    }
    if (edu.staff) {
      edu.staff.forEach(s => { s.actionsDone = { help_clean: 0, ask_boiler_room: 0, search_lost_found: 0, reorganize_shelves: 0, catalog_archives: 0, restricted_tomes: 0, rest_cot: 0, report_anomaly: 0, appeal_discipline: 0, school_pride: 0, nurture: 0, ask_snack: 0 }; if (window.ageNpcMemories) window.ageNpcMemories(s); });
    }

    // Process annual tuition payment & strict scholarship retention
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
        if (edu.schoolType === 'elite' && (edu.grades < 80 || (edu.disciplinaryRecord || 0) >= 2)) {
          logs.push(`FELLOWSHIP REVOKED: Your academic standing (${edu.grades}% Grades, ${edu.disciplinaryRecord || 0} Disciplinary Marks) fell below the Elite Academy's strict retention standard. Your scholarship was revoked and you were transferred to Public School.`);
          enrollInSchool(character, edu.level, edu.major, 'public', 'free');
          return logs;
        } else if (edu.schoolType === 'private' && (edu.grades < 70 || (edu.disciplinaryRecord || 0) >= 3)) {
          logs.push(`SCHOLARSHIP REVOKED: Due to low marks (${edu.grades}%) or conduct violations, your Preparatory Merit Scholarship at ${edu.name} was terminated. You were transferred to Public School.`);
          enrollInSchool(character, edu.level, edu.major, 'public', 'free');
          return logs;
        } else if (edu.grades < 85 && edu.schoolType === 'elite') {
          logs.push(`SCHOLARSHIP WARNING: The Elite Academy Board warned that your ${edu.grades}% average is dangerously close to the 80% revocation threshold.`);
        } else {
          logs.push(`Your full scholarship at ${edu.name} was renewed after transcript inspection.`);
        }
      }
    }

    // Natural grade fluctuation influenced by character smarts & Early Reader buff
    const charSmarts = getStat(character, 'smarts');
    const earlyReaderBonus = character.hasEarlyReaderBuff ? 2 : 0;
    const smartsDelta = Math.floor((charSmarts - 50) / 10) + earlyReaderBonus;
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

    let reportVignette;
    if (edu.level === 'nursery') {
      reportVignette = `Infant Nursery Observation (${edu.name}): ${edu.grades}% sensory milestones, crib attachment, and early vocalization.`;
    } else if (edu.level === 'daycare') {
      reportVignette = `Received a toddler creche note from ${edu.name}: ${edu.grades}% progress in play, early phonetics, and temperament.`;
    } else if (edu.level === 'kindergarten') {
      reportVignette = `Received a kindergarten progress note from ${edu.name}: ${edu.grades}% school readiness in letters, numbers, and classroom routines.`;
    } else {
      reportVignette = `Received report card from ${edu.name}: Grade mark ${gradeLetter} (${edu.grades}%).`;
      if (edu.grades >= 85) {
        reportVignette += " Your teachers commended your academic dedication.";
      } else if (edu.grades < 50) {
        reportVignette += " Your instructors expressed grave concern regarding your lack of attentiveness.";
      }
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

    // Club activities log (scaled by Club Rank)
    if (edu.clubs && edu.clubs.length > 0) {
      const clubId = getRandomItem(edu.clubs);
      const clubDef = SCHOOL_CLUBS.find(c => c.id === clubId);
      if (clubDef) {
        const rank = (edu.clubRanks && edu.clubRanks[clubId]) || 'Member';
        const rankMult = rank === 'President' ? 2 : (rank === 'Officer' ? 1.5 : 1);
        logs.push(`Participated in ${clubDef.name} as ${rank}. ${clubDef.desc}`);
        if (clubDef.stat === 'smarts') modStat(character, 'smarts', Math.round(1 * rankMult));
        if (clubDef.stat === 'vitality') modStat(character, 'vitality', Math.round(1 * rankMult));
        if (clubDef.stat === 'occult') modStat(character, 'occult', Math.round(2 * rankMult));
      }
    }

    // Advance grade year
    edu.gradeYear += 1;

    // Check level graduations & transitions
    if (edu.level === 'nursery' && character.age >= 2) {
      logs.push(`Outgrew the infant crib at ${edu.name}! You took your first steady steps into Toddler Creche & Playgroup.`);
      enrollInSchool(character, 'daycare', null, 'public', 'free');
    } else if (edu.level === 'daycare' && character.age >= 4) {
      logs.push(`Graduated from Toddler Creche at ${edu.name}! You are now ready to choose your Kindergarten education pathway.`);
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
      if (edu.schoolType === 'private') {
        character.isPrepAlumni = true;
        logs.push(`PREPARATORY HONORS: Graduated with Private Preparatory Alumni credentials (+University & Career prestige).`);
      } else if (edu.schoolType === 'elite') {
        character.isEliteAlumni = true;
        character.shillings = (character.shillings || 0) + 12;
        logs.push(`ARISTOCRATIC FELLOWSHIP: Graduated as an Elite Academy Alumnus! The Order of the Gilded Bell presented you with a signet ring and 12 Antique Shillings (s.).`);
      }
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
    if (edu.level === 'nursery') {
      edu.grades = Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + 4);
      modStat(character, 'smarts', 1);
      modStat(character, 'happiness', 2);
      return {
        success: true,
        title: "Focused on Crib Mobile & Sounds",
        body: "You tracked the slow rotation of the carved nursery mobile above your crib and mimicked the cadence of household voices.",
        effects: { smarts: 1, happiness: 2, development: 4 }
      };
    }
    if (edu.level === 'daycare') {
      edu.grades = Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + 4);
      modStat(character, 'smarts', 1);
      modStat(character, 'happiness', 2);
      return {
        success: true,
        title: "Practiced a New Skill",
        body: `You stacked blocks, matched painted shapes, and proudly repeated a new word for your caregiver.`,
        effects: { smarts: 1, happiness: 2, development: 4 }
      };
    }
    if (edu.level === 'kindergarten') {
      edu.grades = Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + 5);
      modStat(character, 'smarts', 1);
      return {
        success: true,
        title: "Practiced Letters and Numbers",
        body: `You traced letters, counted wooden shapes, and finished a picture-book exercise with your teacher.`,
        effects: { smarts: 1, readiness: 5 }
      };
    }
    edu.grades = Math.min(100, (edu.grades !== undefined ? edu.grades : 75) + Math.floor(Math.random() * 5) + 6); // +6 to +10%
    modStat(character, 'smarts', 2);
    modStat(character, 'happiness', -2);

    return {
      success: true,
      title: "Diligent Study",
      body: `You spent hours in the school library poring over textbooks and lecture notes. Your academic understanding deepened.`,
      effects: { smarts: 2, happiness: -2, grades: 8 }
    };
  }

  function skipClass(character) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    const edu = character.education;
    if (edu.level === 'nursery') {
      edu.grades = Math.max(0, (edu.grades !== undefined ? edu.grades : 75) - 1);
      modStat(character, 'happiness', 2);
      return {
        success: true,
        title: "Fussed Through Crib Rest",
        body: "You kicked off your knitted blanket and babbled at the wallpaper shadows instead of sleeping.",
        effects: { happiness: 2, development: -1 }
      };
    }
    if (edu.level === 'daycare') {
      edu.grades = Math.max(0, (edu.grades !== undefined ? edu.grades : 75) - 1);
      modStat(character, 'happiness', 2);
      return {
        success: true,
        title: "Refused Nap Time",
        body: `You stayed stubbornly awake on your mat, whispering to yourself until a caregiver came to settle you.`,
        effects: { happiness: 2, development: -1 }
      };
    }
    if (edu.level === 'kindergarten') {
      edu.grades = Math.max(0, (edu.grades !== undefined ? edu.grades : 75) - 2);
      modStat(character, 'happiness', 2);
      return {
        success: true,
        title: "Avoided Circle Time",
        body: `You hid in the reading corner instead of joining circle time. Your teacher eventually found you behind an oversized picture book.`,
        effects: { happiness: 2, readiness: -2 }
      };
    }
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
      if (edu.disciplinaryRecord >= 3 && edu.disciplinaryRecord < 5 && window.addConsequence) {
        window.addConsequence(character, { type: 'suspension', label: 'School Suspension', detail: 'Repeated disciplinary incidents temporarily revoked school access.', source: edu.name, severity: 2, yearsRemaining: 1 });
        body += ` You were suspended from school activities until the next year.`;
      }
    }

    // Check expulsion
    if (edu.disciplinaryRecord >= 5) {
      edu.enrolled = false;
      edu.graduationStatus = 'expelled';
      if (window.addConsequence) window.addConsequence(character, { type: 'social_stigma', label: 'Expelled Student', detail: `Expelled from ${edu.name}.`, source: edu.name, severity: 3, yearsRemaining: 4 });
      body += `\n\n[EXPULSION]: Due to repeated truancy and contempt of school authority, the headmaster officially expelled you!`;
    }

    return {
      success: true,
      title: caught ? "Caught Skipping Class!" : "Skipped Class",
      body,
      effects
    };
  }

  // --- 3-Chapter School Supernatural Mysteries ---
  function investigateMystery(character, mysteryId) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    if (character.age < 6) {
      return { success: false, reason: "You are too young to deliberately investigate school grounds without an adult." };
    }
    const edu = character.education;
    edu.mysteryChapters = edu.mysteryChapters || {};
    edu.stageActionsThisYear = edu.stageActionsThisYear || {};

    const actionKey = 'mystery_' + mysteryId;
    if (edu.stageActionsThisYear[actionKey]) {
      return { success: false, reason: "You have already pushed as far into this school mystery as you safely can this year. Wait until next year for the trail to cool." };
    }

    const mystery = SCHOOL_MYSTERIES.find(m => m.id === mysteryId) || SCHOOL_MYSTERIES[0];
    const currentChap = edu.mysteryChapters[mystery.id] || 0;
    if (currentChap >= 3) {
      return { success: false, reason: `You have already resolved all 3 chapters of "${mystery.title}". Its truth is etched into your memory.` };
    }

    const nextChap = currentChap + 1;
    edu.mysteryChapters[mystery.id] = nextChap;
    edu.stageActionsThisYear[actionKey] = 1;

    let title = `${mystery.title} — Chapter ${nextChap}/3`;
    let body = "";
    const effects = {};

    if (mystery.id === 'boiler_crawlspace') {
      if (nextChap === 1) {
        modStat(character, 'occult', 4);
        modStat(character, 'sanity', -2);
        effects.occult = 4; effects.sanity = -2;
        body = "Chapter I (Gather Clues): You slipped behind the hissing iron boilers during lunch. Scratched into the soot-blackened brick beside the hazard tape were tally marks and the initials of three students from 1954.";
      } else if (nextChap === 2) {
        modStat(character, 'occult', 6);
        modStat(character, 'smarts', 2);
        modStat(character, 'sanity', -2);
        effects.occult = 6; effects.smarts = 2; effects.sanity = -2;
        body = "Chapter II (The Janitor's Ash-Key): Using a wax impression of the custodian's iron ring, you unlatched the crawlspace grate. Inside lay a circle of melted tallow candles and a brass ledger recording subterranean furnace offerings.";
      } else {
        modStat(character, 'occult', 10);
        modStat(character, 'sanity', -3);
        character.shillings = (character.shillings || 0) + 8;
        effects.occult = 10; effects.sanity = -3; effects.shillings = 8;
        body = "Chapter III (Confront the Flue Entity): At the dead end of the crawlspace, a pair of ember-bright eyes blinked from the coal chute. Instead of fleeing, you held your ground until it dropped a velvet pouch containing 8 antique Shillings (s.) and receded into the foundation.";
      }
    } else if (mystery.id === 'drained_pool') {
      if (nextChap === 1) {
        modStat(character, 'occult', 4);
        modStat(character, 'sanity', -2);
        effects.occult = 4; effects.sanity = -2;
        body = "Chapter I (Gather Clues): Peering through the rusted chainlink fence around the 1980s natatorium, you noticed wet footprints circling the diving board despite the pool being bone-dry for decades.";
      } else if (nextChap === 2) {
        modStat(character, 'occult', 6);
        modStat(character, 'smarts', 2);
        modStat(character, 'sanity', -2);
        effects.occult = 6; effects.smarts = 2; effects.sanity = -2;
        body = "Chapter II (Locker 00 Cipher): In the mildewed changing rooms, you pried open Locker 00 and recovered a waterlogged whistle and a maintenance log warning never to unscrew the deep-end bronze drain cover.";
      } else {
        modStat(character, 'occult', 10);
        modStat(character, 'sanity', -4);
        character.shillings = (character.shillings || 0) + 9;
        effects.occult = 10; effects.sanity = -4; effects.shillings = 9;
        body = "Chapter III (The Deep-End Drain): You descended the rusted ladder at dusk. A translucent hand rose from the dry iron grate, pressing 9 barnacle-encrusted Shillings (s.) into your palm before the tiles echoed with a phantom splash.";
      }
    } else if (mystery.id === 'sealed_stairwell') {
      if (nextChap === 1) {
        modStat(character, 'smarts', 2);
        modStat(character, 'occult', 4);
        effects.smarts = 2; effects.occult = 4;
        body = "Chapter I (Architectural Discrepancy): Measuring the third-floor corridor paces against the exterior windows, you proved an entire 14-foot stairwell shaft was bricked over behind the fire door.";
      } else if (nextChap === 2) {
        modStat(character, 'smarts', 3);
        modStat(character, 'occult', 5);
        modStat(character, 'sanity', -2);
        effects.smarts = 3; effects.occult = 5; effects.sanity = -2;
        body = "Chapter II (Pick the Brass Padlock): You picked the tarnished 1922 padlock. Behind the iron door, dust-choked marble steps spiraled *upward* into a bell tower that cannot be seen from outside the school.";
      } else {
        modStat(character, 'occult', 9);
        modStat(character, 'smarts', 4);
        modStat(character, 'sanity', -3);
        character.shillings = (character.shillings || 0) + 10;
        effects.occult = 9; effects.smarts = 4; effects.sanity = -3; effects.shillings = 10;
        body = "Chapter III (The Unmapped Annex): At the top of the impossible staircase, you found a desk with your own surname carved into the oak a century ago, alongside a wax-sealed envelope holding 10 antique Shillings (s.).";
      }
    } else {
      if (nextChap === 1) {
        modStat(character, 'occult', 4);
        modStat(character, 'sanity', -2);
        effects.occult = 4; effects.sanity = -2;
        body = "Chapter I (Record the 5:45 PM Static): You stayed late and recorded the PA speaker crackle on a cassette tape. Played backward, the static resolved into Latin roll-call numbers.";
      } else if (nextChap === 2) {
        modStat(character, 'occult', 6);
        modStat(character, 'smarts', 2);
        modStat(character, 'sanity', -2);
        effects.occult = 6; effects.smarts = 2; effects.sanity = -2;
        body = "Chapter II (Trace the Copper Conduit): Following the speaker wire behind the acoustic ceiling tiles, you discovered the intercom wasn't wired to the principal's office—it ran straight down into the earth beneath the flagpole.";
      } else {
        modStat(character, 'occult', 11);
        modStat(character, 'sanity', -4);
        character.shillings = (character.shillings || 0) + 9;
        effects.occult = 11; effects.sanity = -4; effects.shillings = 9;
        body = "Chapter III (Answer the Roll Call): At 5:45 PM, you pressed the wall talk-back switch and spoke your name into the static. The voice on the intercom paused, whispered 'Excused,' and 9 silver Shillings (s.) clattered out of the speaker grille.";
      }
    }

    return {
      success: true,
      title,
      body,
      effects
    };
  }

  // --- Interactive Club Sub-Actions & Rank Progression ---
  function performClubSubAction(character, clubId, subAction) {
    if (!character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled in school." };
    }
    const edu = character.education;
    if (!edu.clubs || !edu.clubs.includes(clubId)) {
      return { success: false, reason: "You must join this club first before participating in its activities." };
    }
    const club = SCHOOL_CLUBS.find(c => c.id === clubId);
    if (!club) return { success: false, reason: "Club not found." };

    edu.clubRanks = edu.clubRanks || {};
    edu.clubActionsThisYear = edu.clubActionsThisYear || {};
    const key = `${clubId}_${subAction}`;
    if ((edu.clubActionsThisYear[key] || 0) >= 1) {
      return { success: false, reason: `You have already completed "${subAction.replace('_', ' ')}" for ${club.name} this school year.` };
    }
    edu.clubActionsThisYear[key] = 1;

    const currentRank = edu.clubRanks[clubId] || 'Member';
    const effects = {};
    let title = `${club.name}`;
    let body = "";

    if (subAction === 'session') {
      modStat(character, club.stat || 'smarts', 3);
      modStat(character, 'happiness', 3);
      edu.popularity = Math.min(100, (edu.popularity || 50) + 2);
      effects[club.stat || 'smarts'] = 3;
      effects.happiness = 3;
      effects.popularity = 2;
      title = `${club.name}: Weekly Session`;
      body = `You attended an intensive after-school session with the ${club.name} as a ${currentRank}, sharpening your ${club.stat || 'academic'} skills and bonding with fellow members.`;
    } else if (subAction === 'project') {
      modStat(character, club.stat || 'smarts', 4);
      edu.grades = Math.min(100, (edu.grades || 75) + 4);
      effects[club.stat || 'smarts'] = 4;
      effects.grades = 4;
      if (club.id === 'occult_lit') {
        character.shillings = (character.shillings || 0) + 3;
        effects.shillings = 3;
        title = `${club.name}: Candlelight Translation`;
        body = `You led a special translation of a water-damaged grimoire for the ${club.name}, uncovering 3 antique Shillings (s.) tucked inside the spine!`;
      } else {
        title = `${club.name}: Showcase Project`;
        body = `You spearheaded a special exhibition project for the ${club.name}. Faculty advisors praised your initiative and awarded extra credit!`;
      }
    } else if (subAction === 'compete') {
      if (currentRank === 'Member') {
        edu.clubRanks[clubId] = 'Officer';
        edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
        modStat(character, club.stat || 'smarts', 3);
        effects.popularity = 5;
        effects[club.stat || 'smarts'] = 3;
        title = `Promoted to Club Officer!`;
        body = `Your standout performance in the regional ${club.name} tournament earned unanimous applause. You have been elected **Club Officer**!`;
      } else if (currentRank === 'Officer') {
        edu.clubRanks[clubId] = 'President';
        edu.popularity = Math.min(100, (edu.popularity || 50) + 8);
        modStat(character, club.stat || 'smarts', 5);
        modStat(character, 'happiness', 5);
        effects.popularity = 8;
        effects[club.stat || 'smarts'] = 5;
        effects.happiness = 5;
        title = `Elected ${club.name} President!`;
        body = `You led the ${club.name} to a regional championship victory! The faculty advisor officially named you **Club President / Captain**—a prestigious credential on your academic transcript.`;
      } else {
        edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
        modStat(character, club.stat || 'smarts', 4);
        effects.popularity = 5;
        effects[club.stat || 'smarts'] = 4;
        title = `${club.name}: Championship Defense`;
        body = `As President of the ${club.name}, you presided over the annual inter-school invitational and defended the institution's trophy!`;
      }
    }

    return { success: true, title, body, effects };
  }

  // --- 7-Stage Developmental & Academic Submenu System ---
  function getStageSchoolActions(character) {
    if (!character || !character.education || !character.education.enrolled) return [];
    const edu = character.education;
    const lvl = edu.level;

    if (lvl === 'nursery') {
      return [
        { id: 'nursery_mobile', label: 'Observe Shadows & Crib Mobile', desc: 'Track the slow rotation of carved wooden figures above your crib (+Smarts, +Development).', icon: 'sparkles', badge: 'Sensory' },
        { id: 'nursery_cry', label: 'Cry for Comfort vs. Self-Soothe', desc: 'Call out for your caregiver’s embrace to build early parental attachment (+Happiness, +Comfort).', icon: 'heart', badge: 'Attachment' },
        { id: 'nursery_crawl', label: 'Crawl & Explore Floorboards', desc: 'Venture across the nursery rug to inspect loose floorboards and dust motes (+Vitality, +Development).', icon: 'footprints', badge: 'Motor' },
        { id: 'nursery_mimic', label: 'Mimic Household Words & Sounds', desc: 'Repeat syllables overheard from the hallway (+Smarts, +Comfort).', icon: 'message-circle', badge: 'Speech' },
        { id: 'nursery_corner', label: 'Stare at the Unlit Nursery Corner', desc: 'Gaze silently at the tall shadow standing behind the rocking chair (+Occult, -Sanity).', icon: 'eye', badge: 'Eerie' }
      ];
    }
    if (lvl === 'daycare') {
      return [
        { id: 'toddler_blocks', label: 'Imaginative Block Architecture', desc: 'Construct tall, crooked towers on the playgroup rug (+Smarts, +Development).', icon: 'blocks', badge: 'Cognitive' },
        { id: 'toddler_phonetics', label: 'Picture-Book Phonetics', desc: 'Sound out illustrated letters with the caregiver (Unlocks Early Reader Buff at 65%+ Smarts).', icon: 'book-open', badge: character.hasEarlyReaderBuff ? 'Early Reader ★' : 'Literacy' },
        { id: 'toddler_share', label: 'Share vs. Hoard Playgroup Toys', desc: 'Negotiate wooden train sets with other toddlers (+Comfort & Trust, +Peer Closeness).', icon: 'gift', badge: 'Social' },
        { id: 'toddler_hide', label: 'Hide Behind Coats During Naptime', desc: 'Slip into the cloakroom while the matron dims the lights (+Happiness, +Occult).', icon: 'moon', badge: 'Stealth' },
        { id: 'toddler_tantrum', label: 'Throw a Defiant Tantrum', desc: 'Hurl your cup across the linoleum to test adult boundaries (+Vitality, -Development).', icon: 'Flame', badge: 'Temperament' }
      ];
    }
    if (lvl === 'kindergarten') {
      return [
        { id: 'kg_painting', label: 'Alphabet & Finger-Painting Studio', desc: 'Practice letter strokes and paint vivid scenes on newsprint (+Smarts, +School Readiness).', icon: 'palette', badge: 'Readiness' },
        { id: 'kg_recess', label: 'Recess Playground Games', desc: 'Lead hopscotch and tag by the iron fence (+Vitality, +Classroom Confidence).', icon: 'sun', badge: 'Playground' },
        { id: 'kg_show_tell', label: 'Classroom Show-and-Tell', desc: 'Present a prized item from home—or something unearthed in the garden (+Popularity, +Occult/Smarts).', icon: 'award', badge: 'Presentation' },
        { id: 'kg_imaginary', label: 'Commune with Imaginary Playmate', desc: 'Whisper at the empty chair during snack time (+Occult, +Happiness, -Sanity).', icon: 'ghost', badge: 'Uncanny' }
      ];
    }
    if (lvl === 'elementary') {
      return [
        { id: 'elem_homework', label: 'Complete Homework & Extra Credit', desc: 'Finish arithmetic sets and spelling worksheets before dinner (+Grades, +Smarts).', icon: 'book-check', badge: 'Academics' },
        { id: 'elem_competition', label: 'Annual Spelling Bee / Science Fair', desc: 'Compete for the Elementary Academic Ribbon (Boosts Private/Elite Scholarship odds!).', icon: 'trophy', badge: edu.academicRibbon ? 'Ribbon Winner ★' : 'Competition' },
        { id: 'elem_playground', label: 'Playground Politics & Recess Court', desc: 'Stand up to the schoolyard bully or trade lunchbox treats (+Popularity, +Vitality).', icon: 'shield', badge: 'Social' },
        { id: 'elem_prank', label: 'Chalkboard & Cloakroom Mischief', desc: 'Swap the teacher’s chalk with wax crayons (Risk of Detention vs. +Popularity).', icon: 'zap', badge: 'Mischief' }
      ];
    }
    if (lvl === 'middle') {
      return [
        { id: 'mid_exam_prep', label: 'Preparatory Placement Exam Prep', desc: 'Drill algebra and Latin roots to qualify for Private/Elite Academy scholarships (+Grades, +Smarts).', icon: 'file-check-2', badge: 'Admissions Prep' },
        { id: 'mid_clique', label: `Align with Adolescent Clique${edu.socialClique ? ' (' + edu.socialClique + ')' : ''}`, desc: 'Join or rise within Honors Society, Varsity Jocks, Goth Outcasts, or Hallway Rebels.', icon: 'users', badge: edu.socialClique || 'Choose Clique' },
        { id: 'mid_locker_note', label: 'Pass Folded Note in Corridor', desc: 'Slip a secret note through a classmate’s locker louvers (+Popularity, +Happiness).', icon: 'mail', badge: 'Social' },
        { id: 'mid_trophy_heist', label: 'Pick the Trophy Case Lock After Hours', desc: 'Steal an antique silver medal from the 1960s display (+Shillings, risk of Detention).', icon: 'key', badge: 'Risk' }
      ];
    }
    if (lvl === 'high') {
      return [
        { id: 'high_sat_prep', label: 'Matriculation & SAT Honors Seminar', desc: 'Intensive exam prep for University admissions and scholarship retention (+Grades, +Smarts).', icon: 'graduation-cap', badge: 'Honors' },
        { id: 'high_council', label: 'Campaign for Student Council', desc: 'Deliver auditorium speeches to win Student Body Office (+Popularity, +Transcript Prestige).', icon: 'megaphone', badge: edu.studentCouncilRank || 'Leadership' },
        { id: 'high_prom', label: 'Attend Annual Prom / Formal Gala', desc: 'Dress in formal attire for an unforgettable night in the gymnasium (+Happiness, +Popularity).', icon: 'sparkles', badge: 'Milestone' },
        {
          id: 'high_secret_society',
          label: edu.schoolType === 'elite' ? 'Convene with The Order of the Gilded Bell' : 'Print Underground Midnight Zine',
          desc: edu.schoolType === 'elite'
            ? 'Attend a masked sub-chapel conclave with aristocratic seniors (+Shillings s., +Occult, +Elite Network).'
            : 'Distribute forbidden student pamphlets exposing town and faculty secrets (+Popularity, +Occult).',
          icon: 'eye',
          badge: edu.schoolType === 'elite' ? 'Gilded Bell' : 'Underground'
        }
      ];
    }
    if (lvl === 'university') {
      return [
        { id: 'uni_thesis', label: 'Honors Thesis & Archival Seminar', desc: 'Defend your departmental research chapter before faculty (+Grades, +Smarts).', icon: 'scroll-text', badge: 'Research' },
        { id: 'uni_ra_shift', label: 'Professor’s Research Assistantship', desc: 'Grade papers and catalog restricted specimens for a faculty stipend (+$280 & +Shillings s.).', icon: 'briefcase', badge: 'Paid Stipend' },
        { id: 'uni_symposium', label: 'Present at Undergraduate Symposium', desc: 'Publish a monograph in the collegiate journal (+Popularity, +Smarts, +Career Prestige).', icon: 'award', badge: 'Publication' },
        { id: 'uni_shortcut', label: 'Forbidden Archive / Plagiarism Gamble', desc: 'Copy from a sealed 19th-century dissertation (High Grade boost vs. Dean’s Tribunal risk).', icon: 'alert-triangle', badge: 'Gamble' }
      ];
    }
    return [];
  }

  function performStageSchoolAction(character, actionId) {
    if (!character || !character.education || !character.education.enrolled) {
      return { success: false, reason: "You are not currently enrolled." };
    }
    const edu = character.education;
    edu.stageActionsThisYear = edu.stageActionsThisYear || {};
    if ((edu.stageActionsThisYear[actionId] || 0) >= 1) {
      return { success: false, reason: "You have already completed this milestone activity during the current year." };
    }
    edu.stageActionsThisYear[actionId] = 1;

    const effects = {};
    let title = "School Milestone";
    let body = "";

    switch (actionId) {
      // STAGE 1: INFANT NURSERY (0-1)
      case 'nursery_mobile':
        edu.grades = Math.min(100, (edu.grades || 75) + 5);
        modStat(character, 'smarts', 2);
        effects.smarts = 2; effects.development = 5;
        title = "Observed Shadows & Crib Mobile";
        body = "Lying on your back in the cedar crib, you studied the brass mobile and the shifting geometry of afternoon shadows across the ceiling plaster.";
        break;
      case 'nursery_cry':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
        modStat(character, 'happiness', 4);
        effects.happiness = 4; effects.comfort = 5;
        title = "Sought Warmth & Reassurance";
        body = "Your cries brought footsteps hurrying up the stairs. You were lifted from the crib, rocked gently by the window, and wrapped in a warm shawl.";
        break;
      case 'nursery_crawl':
        edu.grades = Math.min(100, (edu.grades || 75) + 4);
        modStat(character, 'vitality', 3);
        effects.vitality = 3; effects.development = 4;
        title = "Crawled Across the Nursery Floorboards";
        body = "You pushed yourself onto hands and knees, exploring the braided rug and discovering a cold draft whistling from a knot in the oak floorboards.";
        break;
      case 'nursery_mimic':
        edu.grades = Math.min(100, (edu.grades || 75) + 5);
        modStat(character, 'smarts', 2);
        modStat(character, 'happiness', 2);
        effects.smarts = 2; effects.happiness = 2; effects.development = 5;
        title = "Mimicked Early Words";
        body = "You babbled and formed your first distinct syllables in response to household voices, earning delighted gasps from your caregivers.";
        break;
      case 'nursery_corner':
        modStat(character, 'occult', 5);
        modStat(character, 'sanity', -2);
        effects.occult = 5; effects.sanity = -2;
        title = "Stared at the Unlit Nursery Corner";
        body = "While the house slept, you stood holding the crib rails and stared silently into the dark corner by the wardrobe. Something tall tilted its head back at you.";
        break;

      // STAGE 2: TODDLER CRECHE (2-3)
      case 'toddler_blocks':
        edu.grades = Math.min(100, (edu.grades || 75) + 5);
        modStat(character, 'smarts', 3);
        effects.smarts = 3; effects.development = 5;
        title = "Imaginative Block Architecture";
        body = "You arranged painted wooden blocks into an eerily symmetrical cathedral spire on the playgroup mat. The head caregiver took notes in her ledger.";
        break;
      case 'toddler_phonetics':
        edu.grades = Math.min(100, (edu.grades || 75) + 6);
        modStat(character, 'smarts', 3);
        effects.smarts = 3; effects.development = 6;
        if (getStat(character, 'smarts') >= 65 && !character.hasEarlyReaderBuff) {
          character.hasEarlyReaderBuff = true;
          title = "Unlocked: Early Reader Prodigy!";
          body = "You sounded out entire sentences from the illustrated primer all by yourself! You gained the permanent **Early Reader** buff (+2% automatic grade growth every school year).";
        } else {
          title = "Picture-Book Phonetics";
          body = "You traced woodcut illustrations of owls, bells, and keys while sounding out letters with the caregiver.";
        }
        break;
      case 'toddler_share':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
        modStat(character, 'happiness', 3);
        effects.happiness = 3; effects.comfort = 6;
        title = "Playgroup Toy Diplomacy";
        body = "You shared the painted tin train with your playmates during free play, earning gold star stickers and warm approval.";
        break;
      case 'toddler_hide':
        modStat(character, 'happiness', 3);
        modStat(character, 'occult', 3);
        effects.happiness = 3; effects.occult = 3;
        title = "Hid in the Cloakroom";
        body = "While the other toddlers napped on their cots, you slipped behind a row of heavy wool raincoats and listened to the pipes knocking inside the wall.";
        break;
      case 'toddler_tantrum':
        edu.grades = Math.max(0, (edu.grades || 75) - 3);
        modStat(character, 'vitality', 2);
        modStat(character, 'happiness', 2);
        effects.vitality = 2; effects.happiness = 2; effects.development = -3;
        title = "Defiant Creche Tantrum";
        body = "You overturned a basket of wooden blocks and refused to sit on the circle rug until the matron brought chamomile tea.";
        break;

      // STAGE 3: KINDERGARTEN (4-5)
      case 'kg_painting':
        edu.grades = Math.min(100, (edu.grades || 75) + 6);
        modStat(character, 'smarts', 2);
        modStat(character, 'happiness', 3);
        effects.smarts = 2; effects.happiness = 3; effects.readiness = 6;
        title = "Alphabet & Finger-Painting";
        body = "You practiced uppercase cursive strokes and painted a striking crimson-and-indigo landscape that the teacher pinned to the hallway bulletin board.";
        break;
      case 'kg_recess':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
        modStat(character, 'vitality', 3);
        modStat(character, 'happiness', 3);
        effects.vitality = 3; effects.happiness = 3; effects.popularity = 6;
        title = "Recess Playground Champion";
        body = "You led a spirited game of tag around the rusted merry-go-round, winning the admiration of your kindergarten peers.";
        break;
      case 'kg_show_tell':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
        edu.grades = Math.min(100, (edu.grades || 75) + 4);
        modStat(character, 'occult', 3);
        modStat(character, 'smarts', 2);
        effects.popularity = 5; effects.readiness = 4; effects.occult = 3; effects.smarts = 2;
        title = "Unforgettable Show-and-Tell";
        body = "You brought a tarnished brass pocket-compass and a curiously carved stone from the garden. The entire class leaned forward in hushed fascination.";
        break;
      case 'kg_imaginary':
        modStat(character, 'occult', 5);
        modStat(character, 'happiness', 2);
        modStat(character, 'sanity', -2);
        effects.occult = 5; effects.happiness = 2; effects.sanity = -2;
        title = "Communed with Imaginary Playmate";
        body = "You set an extra paper cup at the snack table for your unseen friend. Curiously, when the bell rang, the apple slices on that plate were gone.";
        break;

      // STAGE 4: ELEMENTARY SCHOOL (6-10)
      case 'elem_homework':
        edu.grades = Math.min(100, (edu.grades || 75) + 7);
        modStat(character, 'smarts', 3);
        effects.grades = 7; effects.smarts = 3;
        title = "Completed Extra-Credit Worksheets";
        body = "You completed every long-division and grammar exercise neatly in fountain ink, earning a gold star on the homeroom honour roll.";
        break;
      case 'elem_competition': {
        const score = getStat(character, 'smarts') + (edu.grades || 75) * 0.5 + (character.hasEarlyReaderBuff ? 10 : 0);
        if (score >= 105) {
          edu.academicRibbon = true;
          character.hasAcademicRibbon = true;
          edu.grades = Math.min(100, (edu.grades || 75) + 6);
          modStat(character, 'smarts', 4);
          modStat(character, 'happiness', 5);
          effects.grades = 6; effects.smarts = 4; effects.happiness = 5;
          title = "Won First-Place Academic Ribbon!";
          body = "You outlasted every competitor in the district Spelling Bee & Science Exhibition! The Principal pinned the **First-Place Academic Ribbon** to your lapel—unlocking favourable consideration from Elite Academy scholarship boards.";
        } else {
          edu.grades = Math.min(100, (edu.grades || 75) + 4);
          modStat(character, 'smarts', 2);
          effects.grades = 4; effects.smarts = 2;
          title = "Competed in Academic Fair";
          body = "You presented a baking-soda volcano and competed through four rounds of the Spelling Bee. Though you missed the first-place ribbon, your teachers praised your effort.";
        }
        break;
      }
      case 'elem_playground':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 7);
        modStat(character, 'vitality', 2);
        modStat(character, 'happiness', 3);
        effects.popularity = 7; effects.vitality = 2; effects.happiness = 3;
        title = "Ruled the Recess Blacktop";
        body = "You stood your ground during a heated four-square match and brokered a legendary lunchbox trade by the swings.";
        break;
      case 'elem_prank':
        if (Math.random() < 0.35) {
          edu.disciplinaryRecord = (edu.disciplinaryRecord || 0) + 1;
          edu.popularity = Math.min(100, (edu.popularity || 50) + 4);
          effects.popularity = 4;
          title = "Caught in Cloakroom Prank!";
          body = `Your frog-in-the-desk prank sent the classroom into uproarious laughter, but the homeroom teacher marched you to the office (+1 Disciplinary Mark, Total: ${edu.disciplinaryRecord}).`;
        } else {
          edu.popularity = Math.min(100, (edu.popularity || 50) + 8);
          modStat(character, 'happiness', 4);
          effects.popularity = 8; effects.happiness = 4;
          title = "Masterful Classroom Prank";
          body = "You rigged the pull-down world map to roll up with a loud snap right in the middle of geography lecture. The class cheered and the teacher never suspected you!";
        }
        break;

      // STAGE 5: MIDDLE SCHOOL (11-13)
      case 'mid_exam_prep':
        edu.grades = Math.min(100, (edu.grades || 75) + 8);
        modStat(character, 'smarts', 4);
        effects.grades = 8; effects.smarts = 4;
        title = "Preparatory Placement Exam Drill";
        body = "You worked through past Private and Elite Academy entrance examination booklets, mastering geometry proofs and classical vocabulary.";
        break;
      case 'mid_clique': {
        const cliques = ['Honors Society', 'Varsity Athletes', 'Goth & Art Outcasts', 'Hallway Rebels'];
        const idx = cliques.indexOf(edu.socialClique);
        const chosen = cliques[(idx + 1) % cliques.length];
        edu.socialClique = chosen;
        edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
        effects.popularity = 6;
        if (chosen === 'Honors Society') { modStat(character, 'smarts', 3); effects.smarts = 3; }
        else if (chosen === 'Varsity Athletes') { modStat(character, 'vitality', 3); effects.vitality = 3; }
        else if (chosen === 'Goth & Art Outcasts') { modStat(character, 'occult', 4); effects.occult = 4; }
        else { modStat(character, 'happiness', 4); effects.happiness = 4; }
        title = `Clique Alignment: ${chosen}`;
        body = `You claimed a regular table in the cafeteria with the **${chosen}**, shaping your middle-school reputation and peer circle.`;
        break;
      }
      case 'mid_locker_note':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
        modStat(character, 'happiness', 4);
        effects.popularity = 6; effects.happiness = 4;
        title = "Folded Corridor Note";
        body = "You slipped an origami note through the vents of a locker between bells. By afternoon recess, half the hallway was whispering about your charm.";
        break;
      case 'mid_trophy_heist':
        if (Math.random() < 0.4) {
          edu.disciplinaryRecord = (edu.disciplinaryRecord || 0) + 1;
          modStat(character, 'sanity', -2);
          effects.sanity = -2;
          title = "Caught by the Hall Monitor!";
          body = `A flashlight beam caught you picking the 1962 trophy cabinet lock! You were written up for tampering with school property (+1 Disciplinary Mark, Total: ${edu.disciplinaryRecord}).`;
        } else {
          character.shillings = (character.shillings || 0) + 4;
          modStat(character, 'occult', 3);
          edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
          effects.shillings = 4; effects.occult = 3; effects.popularity = 5;
          title = "The Trophy Case Relic";
          body = "You jimmied the brass showcase and recovered a tarnished 1928 Debate Medal and 4 antique Shillings (s.) hidden beneath the velvet lining.";
        }
        break;

      // STAGE 6: HIGH SCHOOL (14-17)
      case 'high_sat_prep':
        edu.grades = Math.min(100, (edu.grades || 75) + 8);
        modStat(character, 'smarts', 4);
        effects.grades = 8; effects.smarts = 4;
        title = "Matriculation & SAT Honors Seminar";
        body = "You completed timed analytical essays and advanced calculus problem sets, solidifying your transcript for University admissions.";
        break;
      case 'high_council':
        if ((edu.popularity || 50) >= 65 || (edu.grades || 75) >= 85) {
          edu.studentCouncilRank = edu.studentCouncilRank === 'Class Representative' ? 'Student Body President' : 'Class Representative';
          character.wasStudentCouncil = true;
          edu.popularity = Math.min(100, (edu.popularity || 50) + 8);
          modStat(character, 'smarts', 2);
          modStat(character, 'happiness', 4);
          effects.popularity = 8; effects.smarts = 2; effects.happiness = 4;
          title = `Elected ${edu.studentCouncilRank}!`;
          body = `Your campaign posters and sharp auditorium speech won over the student body! Serving as **${edu.studentCouncilRank}** adds major distinction to your permanent dossier.`;
        } else {
          edu.popularity = Math.min(100, (edu.popularity || 50) + 4);
          effects.popularity = 4;
          title = "Student Council Campaign";
          body = "You handed out campaign buttons and debated in the auditorium. Though you fell short of a majority vote this term, your name recognition grew (Requires 65%+ Popularity or 85%+ Grades to win).";
        }
        break;
      case 'high_prom':
        edu.popularity = Math.min(100, (edu.popularity || 50) + 7);
        modStat(character, 'happiness', 6);
        modStat(character, 'looks', 2);
        effects.popularity = 7; effects.happiness = 6; effects.looks = 2;
        title = "Midnight Velvet Prom";
        body = "Under paper lanterns and a slow-turning mirror ball, you danced through the formal gala while punch bowls gleamed and flashbulbs popped.";
        break;
      case 'high_secret_society':
        if (edu.schoolType === 'elite') {
          edu.gildedBellMember = true;
          character.isGildedBellInitiate = true;
          character.shillings = (character.shillings || 0) + 7;
          modStat(character, 'occult', 6);
          edu.popularity = Math.min(100, (edu.popularity || 50) + 5);
          effects.shillings = 7; effects.occult = 6; effects.popularity = 5;
          title = "Conclave of the Gilded Bell";
          body = "Wearing a velvet half-mask beneath the academy chapel, you recited the Founder's catechism with fellow aristocratic seniors and received a stipend of 7 antique Shillings (s.).";
        } else {
          character.shillings = (character.shillings || 0) + 3;
          modStat(character, 'occult', 4);
          edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
          effects.shillings = 3; effects.occult = 4; effects.popularity = 6;
          title = "Printed Underground Midnight Zine";
          body = "Using the mimeograph machine after hours, you printed copies of 'The Blackwood Bellwether' detailing local anomalies and slipped them into every locker (+3 Shillings s. from anonymous subscribers).";
        }
        break;

      // STAGE 7: UNIVERSITY (18+)
      case 'uni_thesis':
        edu.grades = Math.min(100, (edu.grades || 75) + 8);
        modStat(character, 'smarts', 4);
        effects.grades = 8; effects.smarts = 4;
        title = "Defended Honours Thesis Chapter";
        body = `You presented primary-source findings for your ${edu.major || 'Undergraduate'} thesis before the departmental committee, earning high distinction.`;
        break;
      case 'uni_ra_shift': {
        const stipend = 280;
        character.money = (character.money || 0) + stipend;
        character.shillings = (character.shillings || 0) + 3;
        modStat(character, 'smarts', 2);
        effects.money = stipend; effects.shillings = 3; effects.smarts = 2;
        title = "Professor's Research Assistantship";
        body = `You spent late nights indexing departmental monographs and locked archive crates. The chair paid your $${stipend} research stipend—plus 3 antique Shillings (s.) found in an uncatalogued folio.`;
        break;
      }
      case 'uni_symposium':
        edu.grades = Math.min(100, (edu.grades || 75) + 5);
        edu.popularity = Math.min(100, (edu.popularity || 50) + 6);
        modStat(character, 'smarts', 3);
        character.hasPublishedPaper = true;
        effects.grades = 5; effects.popularity = 6; effects.smarts = 3;
        title = "Published in Collegiate Journal";
        body = "Your undergraduate paper was selected for the annual University Symposium proceedings, impressing faculty and future employers alike.";
        break;
      case 'uni_shortcut':
        if (Math.random() < 0.42) {
          edu.disciplinaryRecord = (edu.disciplinaryRecord || 0) + 2;
          edu.grades = Math.max(0, (edu.grades || 75) - 12);
          modStat(character, 'sanity', -4);
          effects.grades = -12; effects.sanity = -4;
          title = "Dean's Academic Integrity Tribunal!";
          body = `Your advisor recognized passages lifted from an 1899 dissertation in the restricted stacks! Your paper was voided and the Dean recorded 2 Disciplinary Marks (Total: ${edu.disciplinaryRecord}).`;
        } else {
          edu.grades = Math.min(100, (edu.grades || 75) + 12);
          modStat(character, 'occult', 4);
          effects.grades = 12; effects.occult = 4;
          title = "Unsealed the 1899 Dissertation";
          body = "You adapted forgotten theorems from an unindexed 19th-century manuscript in the basement stacks. The faculty hailed your paper as uncannily original!";
        }
        break;
    }

    return { success: true, title, body, effects };
  }

  // --- School Classmate Interactions ---
  function interactWithClassmate(classmate, character, actionType) {
    if (!classmate) return { success: false, reason: "No classmate specified." };
    if (character.age < 6 && ['gossip', 'prank', 'befriend'].includes(actionType)) {
      return { success: false, reason: "That interaction is not available during early childhood." };
    }
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
      title = character.age < 6 ? `Played with ${classmate.name}` : `Chatted with ${classmate.name}`;
      body = character.age < 6
        ? `You and ${classmate.name} built a crooked block tower and laughed when it tumbled across the play mat.`
        : `You and ${classmate.name} shared gossip about teachers and whispered through fifth period. They seemed to appreciate your company.`;
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
      title = character.age < 6 ? `Practiced with ${classmate.name}` : `Studied with ${classmate.name}`;
      body = character.age < 6
        ? `You and ${classmate.name} matched picture cards and practiced shapes together while a caregiver watched nearby.`
        : `You met at the cafeteria tables to review biology notes and solve problem sets. Both of your study notes improved.`;
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
      if (character.age < 6) {
        const relGain = Math.floor(Math.random() * 5) + 5;
        classmate.relationship = Math.min(100, classmate.relationship + relGain);
        modStat(character, 'happiness', 4);
        effects.relationship = relGain;
        effects.happiness = 4;
        title = `Shared with ${classmate.name}`;
        body = `You offered ${classmate.name} your favorite toy. They played carefully and handed it back when the bell chimed.`;
        return { success: true, title, body, effects };
      }
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
        memories: Array.isArray(classmate.memories) ? classmate.memories : [],
        relationshipMind: classmate.relationshipMind ? { ...classmate.relationshipMind } : undefined,
        relationshipState: classmate.relationshipState,
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
    if (character.age < 6 && ['complain', 'bribe'].includes(actionType)) {
      return { success: false, reason: "That interaction is not available during early childhood." };
    }
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
      title = character.age < 6 ? `Gave ${teacher.name} a Drawing` : `Praised ${teacher.name}`;
      body = character.age < 6
        ? `You handed ${teacher.name} a wax-crayon drawing. They displayed it near the classroom door and thanked you warmly.`
        : `You stayed behind after class to compliment ${teacher.name}'s lesson plan. They seemed genuinely flattered by your attentiveness.`;
    } else if (actionType === 'ask_help') {
      const relGain = Math.floor(Math.random() * 4) + 3;
      teacher.relationship = Math.min(100, teacher.relationship + relGain);
      modStat(character, 'smarts', 2);
      if (character.education) character.education.grades = Math.min(100, (character.education.grades !== undefined ? character.education.grades : 75) + 5);
      effects.relationship = relGain;
      effects.smarts = 2;
      effects.grades = 5;
      title = character.age < 6 ? `Help with Classwork` : `Academic Tutoring`;
      body = character.age < 6
        ? `${teacher.name} sat beside you and patiently helped you finish a difficult matching exercise.`
        : `${teacher.name} sat down with you to review challenging curriculum problems. Your comprehension significantly improved.`;
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
    const earlyYearsActions = ['greet_staff', 'nurture', 'ask_snack'];
    if (character.age < 6 && !earlyYearsActions.includes(actionType)) {
      return { success: false, reason: "That interaction is not available during early childhood." };
    }
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
    if (actionType === 'greet_staff') {
      const relGain = 4;
      staffMember.relationship = Math.min(100, staffMember.relationship + relGain);
      effects.relationship = relGain;
      effects.happiness = 1;
      modStat(character, 'happiness', 1);
      title = `Waved to ${staffMember.name}`;
      body = `You waved from the classroom doorway. ${staffMember.name} smiled and waved back before continuing their rounds.`;
    } else if (actionType === 'help_clean') {
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
    
    // Check acceptance roll based on smarts + Prep/Elite Alumni credentials
    const charSmarts = getStat(character, 'smarts');
    const alumniBonus = character.isEliteAlumni ? 25 : (character.isPrepAlumni ? 12 : 0);
    const councilBonus = character.wasStudentCouncil ? 8 : 0;
    const effectiveSmarts = charSmarts + alumniBonus + councilBonus;
    const accepted = character.isEliteAlumni || effectiveSmarts >= 55 || Math.random() < 0.72;
    if (!accepted) {
      return {
        success: false,
        reason: `Your application to study ${major.name} was rejected due to competitive admissions. Improve your smarts or reapply next year!`
      };
    }

    // Enroll
    enrollInSchool(character, 'university', major.name);
    const alumniNote = character.isEliteAlumni
      ? " As an Elite Academy Alumnus, the University Board granted you priority fellowship seating!"
      : (character.isPrepAlumni ? " Your Private Preparatory Alumni transcript earned commendation from the admissions dean." : "");
    return {
      success: true,
      title: "Accepted into University!",
      body: `Congratulations! You have been formally matriculated into the Department of ${major.name} at ${character.education.name}!${alumniNote}`,
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
  window.performClubSubAction = performClubSubAction;
  window.getStageSchoolActions = getStageSchoolActions;
  window.performStageSchoolAction = performStageSchoolAction;
  window.interactWithClassmate = interactWithClassmate;
  window.interactWithTeacher = interactWithTeacher;
  window.interactWithStaff = interactWithStaff;
  window.applyToUniversity = applyToUniversity;
  window.dropOutOfSchool = dropOutOfSchool;
  window.generateClassmates = generateClassmates;
  window.generateTeachers = generateTeachers;
  window.generateStaff = generateStaff;

})();
