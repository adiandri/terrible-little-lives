// Comprehensive Career & Employment Registry for Terrible Little Lives
// Features 27+ Mundane Jobs and 26+ Paranormal Gigs with Multi-Stat Prerequisite Checks

const MUNDANE_CAREERS = [
  // --- Entry Level & Teen Jobs (Age 15 - 17) ---
  {
    id: "fast_food",
    title: "Fast Food Crew / Fry Cook",
    track: "hospitality",
    tier: 1,
    nextTierId: "barista",
    minAge: 16,
    baseSalary: 24000,
    stress: 15,
    reqs: {},
    desc: "Long shifts over boiling grease and harsh drive-thru headsets. It's minimum wage, but it buys groceries."
  },
  {
    id: "barista",
    title: "Artisan Coffee Barista",
    track: "hospitality",
    tier: 2,
    nextTierId: "lounge_bartender",
    minAge: 17,
    baseSalary: 28000,
    stress: 10,
    reqs: { minLooks: 40 },
    desc: "Pouring oat milk lattes and sketching rosettas while rain strews city glass. Regulars like your smile."
  },
  {
    id: "lifestyle_vlogger",
    title: "Social Media Micro-Influencer",
    track: "media",
    tier: 1,
    nextTierId: "runway_model",
    minAge: 16,
    baseSalary: 32000,
    stress: 20,
    reqs: { minLooks: 70 },
    desc: "Posting aesthetic room tours and skincare routines under ring lights. The audience demands perfection."
  },
  {
    id: "runway_model",
    title: "High-Fashion Editorial Model",
    track: "media",
    tier: 2,
    nextTierId: "news_anchor",
    minAge: 17,
    baseSalary: 62000,
    stress: 30,
    reqs: { minLooks: 85, minVitality: 50 },
    desc: "Walking catwalks under blinding strobe flashes and ruthless agency critique. Looks are your entire livelihood."
  },
  {
    id: "app_delivery",
    title: "On-Demand Scooter Courier",
    track: "industrial",
    tier: 1,
    nextTierId: "warehouse_stocker",
    minAge: 18,
    baseSalary: 34000,
    stress: 20,
    reqs: { minVitality: 45 },
    desc: "Dodging city traffic in downpours with thermal food bags. Night deliveries down unlit alleys are common."
  },

  // --- Physical Stamina & High-Risk Trades (Vitality Heavy) ---
  {
    id: "warehouse_stocker",
    title: "Industrial Logistics Night Stocker",
    track: "industrial",
    tier: 2,
    nextTierId: "subway_track_worker",
    minAge: 18,
    baseSalary: 38000,
    stress: 20,
    reqs: { minVitality: 60 },
    desc: "Hauling 50-pound crates under yellow sodium lamps until 5 AM. Your back aches, but the pay is dependable."
  },
  {
    id: "nightclub_bouncer",
    title: "Underground Nightclub Bouncer",
    track: "investigation",
    tier: 1,
    nextTierId: "debt_collector",
    minAge: 20,
    baseSalary: 42000,
    stress: 25,
    reqs: { minVitality: 70, minSanity: 45 },
    desc: "Guarding heavy velvet ropes, checking fake IDs, and tossing violent drunks into wet alleyways."
  },
  {
    id: "high_rise_scaffolder",
    title: "High-Rise Scaffolder & Rigger",
    track: "industrial",
    tier: 4,
    nextTierId: "deep_sea_welder",
    minAge: 19,
    baseSalary: 58000,
    stress: 35,
    reqs: { minVitality: 75, minSanity: 55 },
    desc: "Erecting steel pipe frameworks 50 stories above pavement in howling winds. One loose clamp is fatal."
  },
  {
    id: "forestry_logger",
    title: "Deep Woods Commercial Logger",
    minAge: 18,
    baseSalary: 52000,
    stress: 30,
    reqs: { minVitality: 65 },
    desc: "Wielding heavy chainsaws in mist-drenched pine reserves where trees groan and GPS signals vanish."
  },
  {
    id: "subway_track_worker",
    title: "Subterranean Track Maintenance",
    track: "industrial",
    tier: 3,
    nextTierId: "high_rise_scaffolder",
    minAge: 20,
    baseSalary: 54000,
    stress: 25,
    reqs: { minVitality: 60, minSanity: 50 },
    desc: "Inspecting electrified third rails between 2 AM and 4:30 AM while sewer rats scurry past your steel-toe boots."
  },
  {
    id: "deep_sea_welder",
    title: "Offshore Underwater Welder",
    track: "industrial",
    tier: 5,
    minAge: 22,
    baseSalary: 95000,
    stress: 45,
    reqs: { minVitality: 80, minSmarts: 55, minSanity: 60 },
    desc: "Diving into cold ocean abysses with torch arcs to repair subsea pipelines. Immense pressure and risk."
  },
  {
    id: "oil_rig_roughneck",
    title: "Offshore Platform Roughneck",
    minAge: 21,
    baseSalary: 82000,
    stress: 40,
    reqs: { minVitality: 75 },
    desc: "Two weeks on, two weeks off in rough gale-swept seas handling hydraulic drilling tongs on the wet deck."
  },

  // --- Charisma, Presentation & Hospitality (Looks & Smarts) ---
  {
    id: "hotel_concierge",
    title: "Five-Star Hotel Head Concierge",
    track: "hospitality",
    tier: 4,
    minAge: 21,
    baseSalary: 56000,
    stress: 20,
    reqs: { minLooks: 70, minSmarts: 50 },
    desc: "Arranging black cars, private opera boxes, and discreet requests for billionaire guests in marble lobbies."
  },
  {
    id: "lounge_bartender",
    title: "Speakeasy Mixologist",
    track: "hospitality",
    tier: 3,
    nextTierId: "hotel_concierge",
    minAge: 19,
    baseSalary: 44000,
    stress: 15,
    reqs: { minLooks: 60 },
    desc: "Stirring negronis in candlelit subterranean lounges. Patrons whisper their deepest confessions across your bar."
  },
  {
    id: "news_anchor",
    title: "Late-Night Broadcast TV Anchor",
    track: "media",
    tier: 3,
    nextTierId: "luxury_realtor",
    minAge: 23,
    baseSalary: 78000,
    stress: 25,
    reqs: { minLooks: 75, minSmarts: 60 },
    desc: "Looking polished and authoritative on national teleprompter feeds during midnight emergency bulletins."
  },
  {
    id: "luxury_realtor",
    title: "Luxury Penthouse Real Estate Broker",
    track: "media",
    tier: 4,
    minAge: 21,
    baseSalary: 88000,
    stress: 30,
    reqs: { minLooks: 65, minSmarts: 55 },
    desc: "Touring multi-million dollar glass condos with foreign investors. Commission checks are massive."
  },

  // --- High Composure & Stress Resistance (Sanity Heavy) ---
  {
    id: "biohazard_cleaner",
    title: "Forensic Crime Scene Biohazard Tech",
    track: "medical",
    tier: 3,
    nextTierId: "forensic_pathologist",
    minAge: 20,
    baseSalary: 64000,
    stress: 35,
    reqs: { minSanity: 70, minVitality: 50 },
    desc: "Scrubbing decomposed matter and chemical residue from apartments after gruesome incidents. Strong stomach mandatory."
  },
  {
    id: "air_traffic_controller",
    title: "Metropolitan Air Traffic Controller",
    track: "investigation",
    tier: 4,
    minAge: 23,
    baseSalary: 115000,
    stress: 45,
    reqs: { minSanity: 80, minSmarts: 75 },
    desc: "Directing 40 descending jetliners through fog storms with zero margin for error. Grueling psychological tension."
  },
  {
    id: "psychiatric_orderly",
    title: "Psychiatric Intensive Ward Orderly",
    track: "medical",
    tier: 1,
    nextTierId: "er_nurse",
    minAge: 21,
    baseSalary: 48000,
    stress: 30,
    reqs: { minSanity: 70, minVitality: 65 },
    desc: "Subduing manic episodes and monitoring padded solitary rooms during 12-hour graveyard shifts."
  },
  {
    id: "cargo_pilot",
    title: "Commercial Long-Haul Cargo Pilot",
    minAge: 24,
    baseSalary: 105000,
    stress: 35,
    reqs: { minSanity: 70, minSmarts: 70, minVitality: 60 },
    desc: "Flying freight widebodies across the Arctic night at 38,000 feet while cockpit cockpit radar flickers."
  },

  // --- Callous & Ruthless Careers (Low Humanity Tolerant) ---
  {
    id: "debt_collector",
    title: "Predatory Subprime Debt Collector",
    track: "investigation",
    tier: 2,
    nextTierId: "private_investigator",
    minAge: 20,
    baseSalary: 52000,
    stress: 25,
    reqs: { maxHumanity: 60, minVitality: 55 },
    desc: "Repossessing family sedans and making harassment calls to broke tenants. Conscience is a liability."
  },
  {
    id: "slaughterhouse_foreman",
    title: "Industrial Abattoir Supervisor",
    minAge: 19,
    baseSalary: 50000,
    stress: 25,
    reqs: { maxHumanity: 65, minVitality: 65 },
    desc: "Overseeing automated processing lines smelling of blood and wet hides. Empathy withers fast."
  },
  {
    id: "corporate_layoff_lead",
    title: "Corporate Restructuring 'Hatchet Man'",
    track: "corporate",
    tier: 3,
    nextTierId: "financial_analyst",
    minAge: 25,
    baseSalary: 120000,
    stress: 35,
    reqs: { maxHumanity: 45, minSmarts: 70 },
    desc: "Hired by hedge funds to terminate 400 workers before Friday's earnings report without blinking."
  },
  {
    id: "private_investigator",
    title: "Infidelity & Surveillance Investigator",
    track: "investigation",
    tier: 3,
    nextTierId: "air_traffic_controller",
    minAge: 22,
    baseSalary: 60000,
    stress: 25,
    reqs: { maxHumanity: 70, minSmarts: 60 },
    desc: "Taking telephoto snapshots of cheating spouses from parked sedans with coffee breath and no remorse."
  },

  // --- Academic, Technical & Specialized (Smarts Heavy) ---
  {
    id: "office_clerk",
    title: "Corporate Data Entry Clerk",
    track: "corporate",
    tier: 1,
    nextTierId: "software_qa",
    minAge: 19,
    baseSalary: 45000,
    stress: 15,
    reqs: { minSmarts: 45 },
    desc: "Typing invoices into enterprise accounting spreadsheets. Safe from physical danger, but mind-numbing."
  },
  {
    id: "software_qa",
    title: "Enterprise Software QA Tester",
    track: "corporate",
    tier: 2,
    nextTierId: "corporate_layoff_lead",
    minAge: 20,
    baseSalary: 68000,
    stress: 20,
    reqs: { minSmarts: 65 },
    desc: "Writing automated regression scripts for cloud microservices. Good salary, reliable remote hours."
  },
  {
    id: "er_nurse",
    title: "Hospital ER Trauma Nurse",
    track: "medical",
    tier: 2,
    nextTierId: "biohazard_cleaner",
    minAge: 22,
    baseSalary: 82000,
    stress: 40,
    reqs: { minSmarts: 70, minVitality: 55 },
    desc: "Stabilizing gunshot wounds and overdose victims during torrential Friday night triage rotations."
  },
  {
    id: "high_school_teacher",
    title: "Secondary School Literature Teacher",
    minAge: 22,
    baseSalary: 54000,
    stress: 20,
    reqs: { minSmarts: 65, minHumanity: 60 },
    desc: "Grading essays on Gothic novels and guiding troubled students through modern adolescent struggles."
  },
  {
    id: "financial_analyst",
    title: "Senior Quantitative Financial Analyst",
    track: "corporate",
    tier: 4,
    minAge: 24,
    baseSalary: 130000,
    stress: 35,
    reqs: { minSmarts: 80 },
    desc: "Building algorithmic volatility models that harvest basis points from international exchange panics."
  },
  {
    id: "forensic_pathologist",
    title: "Chief County Medical Examiner (MD)",
    track: "medical",
    tier: 4,
    minAge: 27,
    baseSalary: 185000,
    stress: 30,
    reqs: { minSmarts: 85, minSanity: 65 },
    desc: "Dissecting cadavers to pinpoint exact toxicology and blunt trauma causes on stainless mortuary tables."
  }
];

const PARANORMAL_CAREERS = [
  // --- Low-Tier Occult & Modern Strange Work (Occult 10 - 25%) ---
  {
    id: "morgue_cleaner",
    title: "Nocturnal Mortuary Custodian",
    minAge: 18,
    payoutShillings: 45,
    sanityCost: 1,
    reqs: { minOccult: 10, minSanity: 45 },
    desc: "Mopping drainage troughs after autopsies. Sometimes the refrigerated drawers rattle from the inside."
  },
  {
    id: "tarot_medium",
    title: "Late-Night Cable Tarot Reader",
    track: "paranormal_scholar",
    tier: 1,
    nextTierId: "darkweb_transcriber",
    minAge: 18,
    payoutShillings: 50,
    sanityCost: 1,
    reqs: { minOccult: 15, minLooks: 55 },
    desc: "Reading cursed Major Arcana decks for desperate callers at 3 AM. A surprising number of cards draw themselves."
  },
  {
    id: "urban_streamer",
    title: "Condemned Sites Livestreamer",
    minAge: 16,
    payoutShillings: 60,
    sanityCost: 1,
    reqs: { minOccult: 15, minLooks: 60 },
    desc: "Exploring shuttered asylums with gimbal night-cams. Chat donates in black coins when shadows move on stream."
  },
  {
    id: "rf_monitor",
    title: "Ghost Frequency Radio Monitor",
    track: "dark_underworld",
    tier: 1,
    nextTierId: "grave_robber",
    minAge: 18,
    payoutShillings: 65,
    sanityCost: 1,
    reqs: { minOccult: 20, minSanity: 55 },
    desc: "Tuning software-defined radios to dead military frequencies between 1400 and 1420 MHz. The static breathes."
  },
  {
    id: "grave_robber",
    title: "Historical Vault Grave Robber",
    track: "dark_underworld",
    tier: 2,
    nextTierId: "relic_fence",
    minAge: 18,
    payoutShillings: 80,
    sanityCost: 2,
    reqs: { minOccult: 20, minVitality: 65, maxHumanity: 55 },
    desc: "Prying loose mausoleum flagstones with iron crowbars to harvest silver rings from 19th-century skeletons."
  },
  {
    id: "darkweb_transcriber",
    title: "Dark Web Occult Audio Archiver",
    track: "paranormal_scholar",
    tier: 2,
    nextTierId: "glyph_translator",
    minAge: 18,
    payoutShillings: 90,
    sanityCost: 2,
    reqs: { minOccult: 25, minSmarts: 55 },
    desc: "Transcribing tape recordings recovered from vanished speleologists. The recordings contain unpronounceable names."
  },
  {
    id: "dream_interpreter",
    title: "Sleep Lab Nightmare Cipherist",
    minAge: 19,
    payoutShillings: 85,
    sanityCost: 2,
    reqs: { minOccult: 25, minSanity: 60 },
    desc: "Analyzing EEG polysomnograms of patients suffering synchronized nightmares of a submerged obsidian city."
  },

  // --- Mid-Tier Contracts (Occult 30 - 45%) ---
  {
    id: "tunnel_spelunker",
    title: "Condemned Aqueduct Spelunker",
    minAge: 19,
    payoutShillings: 110,
    sanityCost: 2,
    reqs: { minOccult: 30, minVitality: 70 },
    desc: "Wading through waist-deep stagnant municipal sluices beneath the city to trace non-human claw marks on brickwork."
  },
  {
    id: "cult_ambassador",
    title: "Esoteric Society Cult Recruiter",
    minAge: 20,
    payoutShillings: 120,
    sanityCost: 2,
    reqs: { minOccult: 30, minLooks: 70 },
    desc: "Schmoozing tech founders and wealthy gallery owners into private basement ceremonies with silver masks."
  },
  {
    id: "estate_watchman",
    title: "Cursed Property Night Watchman",
    minAge: 20,
    payoutShillings: 130,
    sanityCost: 2,
    reqs: { minOccult: 35, minSanity: 50 },
    desc: "Guarding foreclosed homes where whole families vanished into the sheetrock. Salt the thresholds every two hours."
  },
  {
    id: "cryptid_tracker",
    title: "Pine Barrens Cryptid Tracker",
    minAge: 20,
    payoutShillings: 140,
    sanityCost: 2,
    reqs: { minOccult: 35, minVitality: 65 },
    desc: "Tracking deer carcasses hung thirty feet up in hemlock trees by things that don't cast shadows in moonlight."
  },
  {
    id: "relic_fence",
    title: "Cursed Antiquities Fence",
    track: "dark_underworld",
    tier: 3,
    nextTierId: "soul_pawnbroker",
    minAge: 21,
    payoutShillings: 150,
    sanityCost: 2,
    reqs: { minOccult: 35, maxHumanity: 60 },
    desc: "Brokering bone carvings and stolen brass censers out of a dingy pawnshop backroom to cloaked buyers."
  },
  {
    id: "glyph_translator",
    title: "Dead Language Glyph Translator",
    track: "paranormal_scholar",
    tier: 3,
    nextTierId: "cursed_librarian",
    minAge: 21,
    payoutShillings: 160,
    sanityCost: 2,
    reqs: { minOccult: 35, minSmarts: 75 },
    desc: "Deciphering fragments of Akkadian and pre-Sumerian clay shards that give you migraines and nosebleeds."
  },
  {
    id: "cursed_librarian",
    title: "Forbidden Archive Conservator",
    track: "paranormal_scholar",
    tier: 4,
    nextTierId: "high_inquisitor",
    minAge: 21,
    payoutShillings: 170,
    sanityCost: 2,
    reqs: { minOccult: 40, minSmarts: 65, minSanity: 65 },
    desc: "Binding decaying grimoires in lead-threaded pigskin. Some pages bite back if handled with bare skin."
  },
  {
    id: "relic_courier",
    title: "Black Market Relic Courier",
    minAge: 21,
    payoutShillings: 180,
    sanityCost: 3,
    reqs: { minOccult: 45, minVitality: 60 },
    desc: "Transporting sealed lead trunks across international rail lines without ever opening the wax seals."
  },
  {
    id: "bloodline_matchmaker",
    title: "Occult Lineage Genealogist",
    minAge: 23,
    payoutShillings: 190,
    sanityCost: 2,
    reqs: { minOccult: 45, minLooks: 65 },
    desc: "Arranging unions between families bearing dormant reptilian genes to ensure the lineage continues."
  },
  {
    id: "summoning_vessel",
    title: "Mediumistic Trance Vessel",
    minAge: 20,
    payoutShillings: 210,
    sanityCost: 3,
    reqs: { minOccult: 45, maxHumanity: 50, minVitality: 55 },
    desc: "Inhaling poisonous incense so dead patricians can speak through your larynx during midnight seances."
  },

  // --- High-Tier Dangerous Contracts (Occult 50 - 65%) ---
  {
    id: "soul_pawnbroker",
    title: "Black Market Soul Pawnbroker",
    track: "dark_underworld",
    tier: 4,
    nextTierId: "salon_host",
    minAge: 22,
    payoutShillings: 240,
    sanityCost: 3,
    reqs: { minOccult: 50, maxHumanity: 45 },
    desc: "Appraising glass jars containing the final exhaled breaths of dying debtors. You trade them for Shillings."
  },
  {
    id: "catacomb_diver",
    title: "Flooded Ossuary Free-Diver",
    minAge: 22,
    payoutShillings: 250,
    sanityCost: 3,
    reqs: { minOccult: 50, minVitality: 75, minSanity: 60 },
    desc: "Diving into submerged limestone catacombs beneath Paris without air tanks to retrieve gold talismans."
  },
  {
    id: "exorcist_assistant",
    title: "Independent Exorcist Apprentice",
    minAge: 22,
    payoutShillings: 260,
    sanityCost: 3,
    reqs: { minOccult: 60, minSanity: 60, minVitality: 55 },
    desc: "Pinning down possessed bodies while ancient Latin phrases blister your ears and furniture levitates."
  },
  {
    id: "salon_host",
    title: "Occult Salon Grand Master",
    track: "dark_underworld",
    tier: 5,
    minAge: 24,
    payoutShillings: 270,
    sanityCost: 3,
    reqs: { minOccult: 40, minLooks: 75 },
    desc: "Hosting decadent masquerade galas in secluded estates where sacrifices are performed behind velvet drapes."
  },
  {
    id: "containment_sentry",
    title: "Deep Bunkered Containment Sentry",
    minAge: 23,
    payoutShillings: 290,
    sanityCost: 3,
    reqs: { minOccult: 55, minSanity: 70, minVitality: 65 },
    desc: "Standing watch outside a concrete vault where something knocks in prime numbers from inside."
  },
  {
    id: "forensic_alchemist",
    title: "Black Ichor Toxicologist",
    minAge: 24,
    payoutShillings: 310,
    sanityCost: 3,
    reqs: { minOccult: 50, minSmarts: 80 },
    desc: "Distilling non-terrestrial bile found inside desecrated livestock carcasses in a lead-lined cleanroom."
  },
  {
    id: "ghoul_supplier",
    title: "Mortuary Syndicate Specimen Harvester",
    minAge: 24,
    payoutShillings: 350,
    sanityCost: 3,
    reqs: { minOccult: 60, maxHumanity: 35, minVitality: 60 },
    desc: "Supplying subterranean ghoul colonies with unclaimed autopsied limbs in exchange for ancient silver talers."
  },

  // --- Master & Archon Level Contracts (Occult 65%+) ---
  {
    id: "architect_sanctuary",
    title: "Architect of Non-Euclidean Sanctuaries",
    minAge: 26,
    payoutShillings: 420,
    sanityCost: 3,
    reqs: { minOccult: 65, minSmarts: 85 },
    desc: "Drafting building blueprints with impossible acoustic corridors that amplify resonance for eldritch arrival."
  },
  {
    id: "high_inquisitor",
    title: "Grand Inquisitor of the Silent Circle",
    track: "paranormal_scholar",
    tier: 5,
    minAge: 28,
    payoutShillings: 500,
    sanityCost: 3,
    reqs: { minOccult: 75, minSanity: 75, maxHumanity: 40 },
    desc: "The absolute pinnacle of the modern occult underworld. You pass lethal judgment on warlocks who breach the veil."
  }
];

// Generalized eligibility evaluation
function checkJobEligibility(character, job) {
  if (!character) return { eligible: false, reason: "No character", badges: [] };

  const badges = [];
  let isEligible = true;
  let failedReason = null;

  // 1. Age Check
  const ageMet = character.age >= job.minAge;
  badges.push({
    label: `Age ${job.minAge}+`,
    met: ageMet,
    icon: "clock"
  });
  if (!ageMet) {
    isEligible = false;
    if (!failedReason) failedReason = `Too Young (Age ${job.minAge}+)`;
  }

  const reqs = job.reqs || {};

  const seriousRecord = window.getActiveConsequences && window.getActiveConsequences(character, 'criminal_record').some(record => record.severity >= 2);
  if (seriousRecord && (job.baseSalary || 0) >= 50000) {
    badges.push({ label: 'Background Check', met: false, icon: 'file-warning' });
    isEligible = false;
    if (!failedReason) failedReason = 'Criminal Record';
  }

  const workplaceStanding = window.getReputationState ? window.getReputationState(character, 'workplace') : 'ordinary';
  const recommended = window.hasRecommendation && window.hasRecommendation(character);
  if (recommended) badges.push({ label: 'Active Recommendation', met: true, icon: 'badge-check' });
  if (workplaceStanding === 'disgraced' && (job.baseSalary || 0) >= 50000 && !recommended) {
    badges.push({ label: 'Professional Standing', met: false, icon: 'users-round' });
    isEligible = false;
    if (!failedReason) failedReason = 'Disgraced at Work';
  } else if (workplaceStanding === 'beloved' || workplaceStanding === 'respected') {
    badges.push({ label: 'Trusted Referral', met: true, icon: 'badge-check' });
  } else if (['feared', 'formidable'].includes(workplaceStanding) && job.payoutShillings) {
    badges.push({ label: 'Notorious Network', met: true, icon: 'eye' });
  }

  // 2. Vitality
  if (reqs.minVitality !== undefined) {
    const met = character.stats.vitality >= reqs.minVitality;
    badges.push({
      label: `Vitality ${reqs.minVitality}%`,
      met,
      icon: "heart"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Needs Vitality ${reqs.minVitality}%`;
    }
  }

  // 3. Looks
  if (reqs.minLooks !== undefined) {
    const met = character.stats.looks >= reqs.minLooks;
    badges.push({
      label: `Looks ${reqs.minLooks}%`,
      met,
      icon: "sparkle"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Needs Looks ${reqs.minLooks}%`;
    }
  }

  // 4. Smarts
  if (reqs.minSmarts !== undefined) {
    const met = character.stats.smarts >= reqs.minSmarts;
    badges.push({
      label: `Smarts ${reqs.minSmarts}%`,
      met,
      icon: "brain"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Needs Smarts ${reqs.minSmarts}%`;
    }
  }

  // 5. Sanity
  if (reqs.minSanity !== undefined) {
    const met = character.stats.sanity >= reqs.minSanity;
    badges.push({
      label: `Sanity ${reqs.minSanity}%`,
      met,
      icon: "eye"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Needs Sanity ${reqs.minSanity}%`;
    }
  }

  // 6. Occult
  if (reqs.minOccult !== undefined) {
    const met = character.stats.occult >= reqs.minOccult;
    badges.push({
      label: `Occult ${reqs.minOccult}%`,
      met,
      icon: "flame"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Needs Occult ${reqs.minOccult}%`;
    }
  }

  // 7. Max Humanity (Requires hardness / lack of empathy)
  if (reqs.maxHumanity !== undefined) {
    const met = character.stats.humanity <= reqs.maxHumanity;
    badges.push({
      label: `Humanity ≤ ${reqs.maxHumanity}%`,
      met,
      icon: "skull"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Requires Cold Heart (Humanity ≤ ${reqs.maxHumanity}%)`;
    }
  }

  // 8. Min Humanity (Requires good heart / conscience)
  if (reqs.minHumanity !== undefined) {
    const met = character.stats.humanity >= reqs.minHumanity;
    badges.push({
      label: `Humanity ≥ ${reqs.minHumanity}%`,
      met,
      icon: "sparkles"
    });
    if (!met) {
      isEligible = false;
      if (!failedReason) failedReason = `Requires Conscience (Humanity ≥ ${reqs.minHumanity}%)`;
    }
  }

  return {
    eligible: isEligible,
    reason: failedReason || "Eligible",
    badges
  };
}

function getAdjustedSalary(baseSalary, countryCode) {
  const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;
  return Math.round(baseSalary * mult);
}

function getPromotionForJob(job) {
  if (!job || !job.nextTierId) return null;
  const all = (window.MUNDANE_CAREERS || []).concat(window.PARANORMAL_CAREERS || []).concat(window.PART_TIME_JOBS || []);
  return all.find(j => j.id === job.nextTierId) || null;
}

const PART_TIME_JOBS = [
  {
    id: "pt_paper_route",
    title: "Dawn Fog Paper Courier",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 11,
    defaultHours: 10,
    baseSalary: 5720,
    stress: 8,
    reqs: {},
    desc: "Pedaling through 5 AM mist before school, tossing bundled newsprint onto sagging porches while porch-lights flicker."
  },
  {
    id: "pt_diner_dish",
    title: "Late-Night Diner Dishwasher",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 13,
    defaultHours: 15,
    baseSalary: 10140,
    stress: 14,
    reqs: {},
    desc: "Scraping congealed gravy and lipstick off porcelain plates in a steam-choked back kitchen until midnight."
  },
  {
    id: "pt_cinema_usher",
    title: "Revival Cinema Ticket Usher",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 13.5,
    defaultHours: 15,
    baseSalary: 10530,
    stress: 9,
    reqs: {},
    desc: "Sweeping popcorn between velvet aisles while grainy black-and-white reels project flickering shadows across empty rows."
  },
  {
    id: "pt_laundromat",
    title: "24-Hour Laundromat Attendant",
    track: "part_time",
    isPartTime: true,
    minAge: 15,
    hourlyRate: 14,
    defaultHours: 15,
    baseSalary: 10920,
    stress: 11,
    reqs: {},
    desc: "Making change under buzzing fluorescent tubes and cleaning lint traps while insomniacs watch their clothes spin."
  },
  {
    id: "pt_gas_station",
    title: "Highway Gas Station Night Clerk",
    track: "part_time",
    isPartTime: true,
    minAge: 16,
    hourlyRate: 15.5,
    defaultHours: 20,
    baseSalary: 16120,
    stress: 18,
    reqs: { minSanity: 35 },
    desc: "Watching rain lash the fuel pumps behind bulletproof plexiglass. Long-haul truckers buy stale coffee and warn you not to look at the treeline."
  },
  {
    id: "pt_cemetery_grounds",
    title: "Parish Cemetery Grounds-Sweeper",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 15,
    defaultHours: 15,
    baseSalary: 11700,
    stress: 12,
    reqs: { minVitality: 35 },
    desc: "Raking wet autumn leaves off sunken headstones and righting toppled iron vases before dusk locks the gates."
  },
  {
    id: "pt_library_page",
    title: "Municipal Archive Sub-Basement Page",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 14,
    defaultHours: 12,
    baseSalary: 8736,
    stress: 7,
    reqs: { minSmarts: 45 },
    desc: "Reshelving brittle parish registries and microfiche reels in windowless stacks that smell of vanilla and mildew."
  },
  {
    id: "pt_florist_assistant",
    title: "Funeral Florist Wreath-Wrapper",
    track: "part_time",
    isPartTime: true,
    minAge: 14,
    hourlyRate: 14.5,
    defaultHours: 15,
    baseSalary: 11310,
    stress: 10,
    reqs: { minLooks: 35 },
    desc: "Trimming thorns from white lilies and wiring black satin ribbons inside a walk-in cooler."
  }
];

window.MUNDANE_CAREERS = MUNDANE_CAREERS;
window.PARANORMAL_CAREERS = PARANORMAL_CAREERS;
window.PART_TIME_JOBS = PART_TIME_JOBS;
window.checkJobEligibility = checkJobEligibility;
window.getAdjustedSalary = getAdjustedSalary;
window.getPromotionForJob = getPromotionForJob;
