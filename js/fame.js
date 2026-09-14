// Fame, infamy, public identities, exploitative contracts, and identity-specific danger.
(function () {
  'use strict';

  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const idOf = person => person && (person.id || person.storyPersonId || person.name);
  const IDENTITIES = {
    private_citizen: { label: 'Private Citizen', icon: 'user-round', tone: 'slate', danger: 'Limited public access to your life.' },
    beloved_celebrity: { label: 'Beloved Celebrity', icon: 'sparkles', tone: 'amber', danger: 'Adoration creates access, entitlement, and intimate strangers.' },
    respected_expert: { label: 'Respected Expert', icon: 'badge-check', tone: 'sky', danger: 'Institutions seek your judgment—and blame you when it fails.' },
    infamous_criminal: { label: 'Infamous Criminal', icon: 'siren', tone: 'rose', danger: 'Imitators, investigators, and opportunists approach openly.' },
    controversial_influencer: { label: 'Controversial Influencer', icon: 'flame', tone: 'orange', danger: 'Outrage keeps you visible to critics, sponsors, and coordinated mobs.' },
    feared_occultist: { label: 'Feared Occultist', icon: 'eye', tone: 'purple', danger: 'Desperate strangers bring impossible requests; hostile entities learn your name.' },
    ridiculed_conspiracy_theorist: { label: 'Ridiculed Conspiracy Theorist', icon: 'radio-tower', tone: 'violet', danger: 'Real evidence is dismissed while believers become more extreme.' },
    anonymous_cult_figure: { label: 'Anonymous Cult Figure', icon: 'venetian-mask', tone: 'purple', danger: 'Followers imitate doctrine without knowing who authored it.' },
    presumed_hoaxer: { label: 'Presumed Hoaxer', icon: 'scan-eye', tone: 'slate', danger: 'Debunkers monitor everything; genuine danger becomes harder to report.' },
    surviving_victim: { label: 'Surviving Victim', icon: 'heart-pulse', tone: 'teal', danger: 'Public sympathy invites invasive interviews and trauma tourism.' },
    missing_still_posting: { label: 'Missing Person Still Posting', icon: 'ghost', tone: 'rose', danger: 'Every new upload becomes evidence that something has your passwords.' },
    posthumous_icon: { label: 'Posthumous Icon', icon: 'flower-2', tone: 'amber', danger: 'Your image belongs to whoever controls the archive.' }
  };
  const DEMOGRAPHICS = {
    local: 'Local residents', youth: 'Teen and young-adult users', professional: 'Professional and institutional',
    occult: 'Occult seekers', truecrime: 'True-crime spectators', bereaved: 'Bereaved and survivors'
  };

  function allPeople(character) {
    const kin = character.kin || {}, school = character.education || {}, work = character.workplace || {};
    return [...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || []), ...(school.classmates || []), ...(school.teachers || []), ...(school.staff || []), ...(work.colleagues || [])].filter(person => person && person.alive !== false && !person.missing);
  }

  function ensureFameSystem(character) {
    if (!character.fameSystem || typeof character.fameSystem !== 'object') character.fameSystem = {};
    const system = character.fameSystem;
    if (!Array.isArray(system.identityHistory)) system.identityHistory = [];
    if (!Array.isArray(system.scandals)) system.scandals = [];
    if (!Array.isArray(system.offers)) system.offers = [];
    if (!Array.isArray(system.contracts)) system.contracts = [];
    if (!Array.isArray(system.appearances)) system.appearances = [];
    if (!Array.isArray(system.publicStatements)) system.publicStatements = [];
    if (!Array.isArray(system.fanIncidents)) system.fanIncidents = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!Number.isFinite(system.lastTickAge)) system.lastTickAge = character.age;
    if (!Number.isFinite(system.dangerCooldownUntil)) system.dangerCooldownUntil = -1;
    const snapshot = calculateSnapshot(character, system);
    if (!system.identity || system.identity.type !== snapshot.identity.type) {
      system.identity = { ...snapshot.identity, sinceAge: character.age };
      system.identityHistory.unshift({ ...system.identity });
      if (system.identityHistory.length > 12) system.identityHistory.length = 12;
    } else system.identity = { ...system.identity, ...snapshot.identity };
    system.audiences = snapshot.audiences;
    system.factions = snapshot.factions;
    system.publicReach = snapshot.publicReach;
    system.privacyLoss = snapshot.privacyLoss;
    system.documentedWrongdoing = snapshot.documentedWrongdoing;
    system.falseClaims = snapshot.falseClaims;
    return system;
  }

  function calculateSnapshot(character, existing = {}) {
    const net = character.terribleNet || { accounts: {}, posts: [], screenshots: [], messages: [], digitalIncidents: [] };
    const accounts = Object.values(net.accounts || {});
    const followers = accounts.reduce((sum, account) => sum + (account.followers || 0), 0);
    const rep = window.ensureReputation ? window.ensureReputation(character) : (character.reputation || {});
    const publicRep = rep.public || { esteem: 50, fear: 0, notoriety: 0 };
    const rumors = character.rumors || [];
    const believers = rumors.reduce((sum, rumor) => sum + (rumor.believers?.length || 0), 0);
    const publicCareer = /anchor|influencer|model|vlogger|investigator|teacher|examiner|translator|exorcist|medium|grand master|inquisitor/i.test(`${character.job?.title || ''} ${character.paranormalGig?.title || ''}`);
    const publicReach = Math.max(0, Math.round(followers + publicRep.notoriety * 7 + believers * 5 + (publicCareer ? 180 : 0)));
    const posts = net.posts || [];
    const activeConsequences = window.getActiveConsequences ? window.getActiveConsequences(character) : (character.consequences || []).filter(item => item.active);
    const criminal = activeConsequences.filter(item => item.type === 'criminal_record').reduce((sum, item) => sum + (item.severity || 1), 0);
    const documentedPosts = posts.filter(post => post.screenshotted && ['cruel', 'confession'].includes(post.tone));
    const documentedWrongdoing = criminal + documentedPosts.length + (net.purchases || []).filter(item => item.kind === 'service' || item.kind === 'records').length;
    const falseClaims = rumors.filter(rumor => rumor.active && rumor.valence !== 'positive' && (rumor.evidence || 0) < 45).length;
    const dismissed = posts.filter(post => ['dismissed_as_fake'].includes(post.paranormalVerdict)).length;
    const genuine = posts.filter(post => post.genuine && post.tone === 'paranormal').length;
    const cruel = posts.filter(post => post.tone === 'cruel').length;
    const occult = character.stats?.occult || 0;
    const trauma = activeConsequences.filter(item => ['trauma', 'injury'].includes(item.type)).reduce((sum, item) => sum + (item.severity || 1), 0);
    const underthread = net.accounts?.underthread;
    const missingPosts = posts.filter(post => post.postedWhileMissing || (character.presumedMissing && post.createdAge >= (character.missingSinceAge ?? Infinity))).length;
    const scores = {
      beloved_celebrity: publicRep.esteem * 0.7 + Math.log10(followers + 1) * 18 + (net.accounts?.vesper?.followers || 0) / 80,
      respected_expert: (character.stats?.smarts || 0) * 0.6 + publicRep.esteem * 0.35 + (publicCareer ? 28 : 0) + (character.job?.baseSalary || 0) / 6000,
      infamous_criminal: criminal * 22 + publicRep.fear * 0.55 + publicRep.notoriety * 0.45,
      controversial_influencer: cruel * 12 + publicRep.notoriety * 0.6 + accounts.reduce((sum, a) => sum + (a.notoriety || 0), 0) * 0.2 + followers / 100,
      feared_occultist: occult * 0.65 + publicRep.fear * 0.55 + genuine * 14 + (character.paranormalGig ? 18 : 0),
      ridiculed_conspiracy_theorist: dismissed * 24 + (100 - publicRep.esteem) * 0.35 + (net.accounts?.wakewatch?.followers || 0) / 100,
      anonymous_cult_figure: (underthread?.followers || 0) / 45 + occult * 0.45 + (underthread?.anonymous ? 35 : 0) + (net.accounts?.hush?.anonymous ? 15 : 0),
      presumed_hoaxer: dismissed * 28 + (net.accounts?.wakewatch ? 18 : 0) + Math.max(0, 50 - (net.accounts?.wakewatch?.credibility || 50)),
      surviving_victim: trauma * 18 + (character.horrorDirector?.exposure || 0) * 0.4 + genuine * 8,
      missing_still_posting: character.presumedMissing && missingPosts > 0 ? 150 + missingPosts * 20 : 0,
      posthumous_icon: character.isAlive === false ? publicReach / 8 + publicRep.esteem * 0.7 : 0
    };
    let identityType = 'private_citizen';
    let bestScore = publicReach >= 120 ? 45 : 70;
    Object.entries(scores).forEach(([type, score]) => { if (score > bestScore) { identityType = type; bestScore = score; } });
    if (character.presumedMissing && missingPosts > 0) { identityType = 'missing_still_posting'; bestScore = scores.missing_still_posting; }
    if (character.isAlive === false && publicReach >= 100) { identityType = 'posthumous_icon'; bestScore = scores.posthumous_icon; }
    if (publicReach < 80 && character.isAlive !== false && identityType !== 'missing_still_posting') { identityType = 'private_citizen'; bestScore = publicReach; }
    const identity = { type: identityType, label: IDENTITIES[identityType].label, score: Math.round(bestScore), danger: IDENTITIES[identityType].danger };
    const audiences = {
      local: demographic(publicRep.notoriety + (net.accounts?.chatterbox?.followers || 0) / 8, publicRep.esteem),
      youth: demographic((net.accounts?.vesper?.followers || 0) / 5 + (net.accounts?.hush?.followers || 0) / 6, publicRep.esteem - cruel * 3),
      professional: demographic(publicCareer ? 72 : publicRep.notoriety * 0.45, (rep.workplace?.esteem ?? publicRep.esteem)),
      occult: demographic(occult * 0.8 + (net.accounts?.wakewatch?.followers || 0) / 6 + (underthread?.followers || 0) / 4, genuine ? 68 : 42 - dismissed * 5),
      truecrime: demographic(criminal * 20 + documentedWrongdoing * 12 + publicRep.notoriety * 0.35, 30 + publicRep.fear * 0.4),
      bereaved: demographic(trauma * 12 + (character.isAlive === false ? 70 : 0), publicRep.esteem + trauma * 2)
    };
    const known = Math.max(0, Math.round(publicReach * 0.55));
    const factions = {
      fans: Math.round(known * clamp(publicRep.esteem) / 180), critics: Math.round(known * clamp(100 - publicRep.esteem + cruel * 5) / 230),
      stalkers: Math.round(known * (accounts.reduce((s, a) => s + (a.parasocial || 0), 0) + 5) / 7000),
      imitators: Math.round(known * (identityType.includes('criminal') || identityType.includes('occult') || identityType.includes('cult') ? 0.035 : 0.008)),
      opportunists: Math.round(known * (followers > 250 ? 0.026 : 0.006))
    };
    const doxxed = (net.digitalIncidents || []).some(item => item.type === 'doxxing');
    const privacyLoss = clamp(Math.log10(publicReach + 1) * 18 + factions.stalkers * 2 + (doxxed ? 30 : 0));
    return { identity, audiences, factions, publicReach, privacyLoss, documentedWrongdoing, falseClaims };
  }

  function demographic(exposure, affinity) { return { exposure: clamp(exposure), affinity: clamp(affinity) }; }

  function makeOffer(character, system) {
    const identity = system.identity.type;
    const sponsors = {
      beloved_celebrity: ['Lumen Household', 'Goodnight Tea Company'], respected_expert: ['Municipal Review Board', 'Harrow Academic Press'],
      infamous_criminal: ['Black Hour Documentary Unit', 'TrueDread+'], controversial_influencer: ['RiotHouse Apparel', 'Vesper Creator Network'],
      feared_occultist: ['Pale Lantern Society', 'Underthread Patron 7'], ridiculed_conspiracy_theorist: ['WakeWatch Unfiltered', 'SignalSalt Supplements'],
      anonymous_cult_figure: ['The Closed Hand', 'Subscriber 0'], presumed_hoaxer: ['DebunkLive', 'Practical Effects Warehouse'],
      surviving_victim: ['Aftercare Foundation', 'Nightline Human Stories'], missing_still_posting: ['Unknown Rights Agency'], posthumous_icon: ['Estate Image Partners']
    };
    const sponsor = pick(sponsors[identity] || ['Local Advertising Cooperative']);
    const exploitative = Math.random() < 0.62;
    const upfront = Math.max(150, Math.round(system.publicReach * (0.8 + Math.random() * 2)));
    const offer = {
      id: `fame_offer_${system.sequence++}`, sponsor, age: character.age, status: 'pending', upfront, duration: 2 + Math.floor(Math.random() * 4),
      exploitative, exclusivity: exploitative ? 'May not contradict the sponsor’s preferred version of your story.' : 'Limited category exclusivity.',
      rights: exploitative ? 'Perpetual rights to your name, archive, likeness, and disappearance.' : 'Campaign usage rights during the contract.',
      scandalClause: exploitative ? 'Sponsor may provoke or monetize a scandal without approval.' : 'Contract ends after documented serious wrongdoing.'
    };
    system.offers.unshift(offer);
    return offer;
  }

  function handleOffer(character, offerId, decision) {
    const system = ensureFameSystem(character);
    const offer = system.offers.find(item => item.id === offerId && item.status === 'pending');
    if (!offer) return { success: false, reason: 'That offer is no longer pending.' };
    offer.status = decision === 'accept' ? 'accepted' : 'rejected';
    if (decision !== 'accept') {
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: 1, notoriety: -1 }, `Rejected ${offer.sponsor} contract`);
      return { success: true, title: 'Contract Rejected', message: `${offer.sponsor} withdrew. An opportunist called you “difficult” in a private group chat.` };
    }
    character.money = (character.money || 0) + offer.upfront;
    const contract = { ...offer, id: `fame_contract_${system.sequence++}`, signedAge: character.age, yearsRemaining: offer.duration, active: true };
    system.contracts.unshift(contract);
    if (window.alterReputation) window.alterReputation(character, 'public', { notoriety: 5, esteem: offer.exploitative ? -2 : 2 }, `Signed with ${offer.sponsor}`);
    return { success: true, title: offer.exploitative ? 'Rights Surrendered' : 'Sponsorship Signed', message: `${offer.sponsor} paid ${money(offer.upfront, character)}. ${offer.rights} ${offer.exclusivity}`, effects: { money: offer.upfront } };
  }

  function publicAppearance(character, kind) {
    const system = ensureFameSystem(character);
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'A public appearance requires 1 Energy.' };
    if (system.publicReach < 80) return { success: false, reason: 'No outlet currently considers your identity newsworthy.' };
    character.actionsLeft -= 1;
    const activeScandal = system.scandals.find(item => item.active);
    const credibility = averageAccount(character, 'credibility');
    const options = {
      friendly: { title: 'Friendly Profile Interview', esteem: 4, notoriety: 3, text: 'The host emphasized charm and avoided the worst questions.' },
      investigative: { title: 'Investigative Interview', esteem: activeScandal?.documented ? -5 : 3, notoriety: 7, text: activeScandal?.documented ? 'The interviewer presented archived receipts while you were answering.' : 'You addressed the record carefully and corrected several false claims.' },
      sensational: { title: 'Sensational Live Interview', esteem: -3, notoriety: 12, text: 'Clips escaped the broadcast before the interview ended.' }
    };
    const outcome = options[kind] || options.friendly;
    const payout = Math.round(system.publicReach * (kind === 'sensational' ? 0.7 : 0.35));
    character.money = (character.money || 0) + payout;
    if (window.alterReputation) window.alterReputation(character, 'public', { esteem: outcome.esteem + (credibility >= 65 ? 2 : 0), notoriety: outcome.notoriety }, outcome.title);
    system.appearances.unshift({ kind, age: character.age, title: outcome.title, scandalId: activeScandal?.id || null, payout });
    system.privacyLoss = clamp(system.privacyLoss + (kind === 'sensational' ? 8 : 3));
    return { success: true, title: outcome.title, message: `${outcome.text} You received ${money(payout, character)}.`, effects: { money: payout } };
  }

  function makeStatement(character, stance) {
    const system = ensureFameSystem(character);
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'Preparing a public statement requires 1 Energy.' };
    const scandal = system.scandals.find(item => item.active);
    if (!scandal) return { success: false, reason: 'There is no active scandal requiring a public statement.' };
    character.actionsLeft -= 1;
    let esteem = 0, notoriety = 0, message = '';
    if (stance === 'apologize') {
      esteem = scandal.documented ? 5 : 1; notoriety = -2; scandal.heat = clamp(scandal.heat - (scandal.documented ? 18 : 8));
      message = scandal.documented ? 'You acknowledged the documented act without demanding instant forgiveness.' : 'You apologized for a claim that remains unproven, satisfying critics while confusing supporters.';
    } else if (stance === 'deny') {
      esteem = scandal.documented ? -8 : 4; notoriety = 5; scandal.heat = clamp(scandal.heat + (scandal.documented ? 15 : -8));
      message = scandal.documented ? 'Your denial was placed beside the surviving screenshot.' : 'You denied the unsupported claim and demanded evidence.';
    } else if (stance === 'double_down') {
      esteem = -5; notoriety = 12; scandal.heat = clamp(scandal.heat + 18); message = 'You repeated the choice more loudly. Critics multiplied; loyal fans became more defensive.';
    } else {
      notoriety = -3; scandal.heat = clamp(scandal.heat - 4); message = 'You refused comment. The silence reduced fresh material but surrendered the narrative to everyone else.';
    }
    if (window.alterReputation) window.alterReputation(character, 'public', { esteem, notoriety }, `Public statement: ${stance}`);
    system.publicStatements.unshift({ age: character.age, stance, scandalId: scandal.id, documented: scandal.documented });
    return { success: true, title: 'Statement Entered Into Record', message };
  }

  function averageAccount(character, field) {
    const accounts = Object.values(character.terribleNet?.accounts || {});
    return accounts.length ? accounts.reduce((sum, account) => sum + (account[field] || 0), 0) / accounts.length : 45;
  }

  function buildScandalSource(character) {
    const net = character.terribleNet || {};
    const posts = (net.posts || []).filter(post => ['cruel', 'confession', 'paranormal'].includes(post.tone));
    const criminal = (character.consequences || []).filter(item => item.type === 'criminal_record');
    const rituals = character.ritualSystem?.contracts || [];
    const rumors = (character.rumors || []).filter(item => item.active);
    const pool = [];
    posts.forEach(post => pool.push({ sourceType: 'post', sourceId: post.id, documented: !!post.screenshotted || !post.deleted, evidence: post.screenshotted ? 90 : post.deleted ? 25 : 65, claim: `A ${post.platformId} ${post.type} from age ${post.createdAge} resurfaced: “${post.text.slice(0, 90)}”` }));
    criminal.forEach(record => pool.push({ sourceType: 'criminal_record', sourceId: record.id, documented: true, evidence: 95, claim: `${record.label} became public: ${record.detail || record.source}` }));
    rituals.slice(0, 3).forEach(contract => pool.push({ sourceType: 'ritual', sourceId: contract.id, documented: true, evidence: 72, claim: `A ritual contract bearing your exact words was leaked: “${String(contract.wording).slice(0, 90)}”` }));
    rumors.forEach(rumor => pool.push({ sourceType: 'rumor', sourceId: rumor.id, documented: (rumor.evidence || 0) >= 60, evidence: rumor.evidence || 0, claim: rumor.claim }));
    if (!pool.length) pool.push({ sourceType: 'fabrication', sourceId: null, documented: false, evidence: 12, claim: 'An anonymous account claims you staged every hardship for attention.' });
    return pick(pool);
  }

  function createScandal(character, system) {
    const source = buildScandalSource(character);
    const scandal = { id: `scandal_${system.sequence++}`, age: character.age, active: true, heat: clamp(28 + source.evidence * 0.55 + Math.random() * 24), ...source, statements: [] };
    system.scandals.unshift(scandal);
    if (window.createRumor) window.createRumor(character, { source: null, witnesses: [], audience: 'public', severity: scandal.documented ? 4 : 2, evidence: scandal.evidence, claim: scandal.claim });
    return scandal;
  }

  function fameDanger(character, system) {
    const type = system.identity.type;
    const events = {
      beloved_celebrity: ['A fan arrived at your home carrying a birthday gift and knowledge of your childhood bedroom.', 'A stranger demanded comfort because your work “saved their life.”'],
      respected_expert: ['An institution quoted your advice after removing every qualification.', 'A frightened family demanded that you personally solve a case you only discussed publicly.'],
      infamous_criminal: ['An imitator committed an offense using your name as a signature.', 'A true-crime producer offered money to a former friend for private messages.'],
      controversial_influencer: ['A coordinated harassment group mapped your daily route.', 'An opportunist manufactured a feud and tagged every sponsor.'],
      feared_occultist: ['A desperate petitioner left a living offering outside your door.', 'An entity answered a stranger who invoked your public title as authority.'],
      ridiculed_conspiracy_theorist: ['A real witness contacted you, then vanished after commenters mocked their evidence.', 'An imitator staged a dangerous haunting to prove your theory.'],
      anonymous_cult_figure: ['Followers performed an altered version of your words and credited the anonymous account.', 'Someone claiming to know your identity demanded leadership of a group you never founded.'],
      presumed_hoaxer: ['Debunkers livestreamed outside your home and accidentally recorded something genuine.', 'Authorities dismissed a real emergency as another promotional stunt.'],
      surviving_victim: ['A documentary crew recreated your worst night without asking.', 'A fan accused you of healing “incorrectly” and published your address.'],
      missing_still_posting: ['Your account uploaded a photograph taken from wherever you are being held.', 'A scheduled post answered a question written after you disappeared.'],
      posthumous_icon: ['Your estate licensed your voice for an advertisement you would have hated.']
    };
    const detail = pick(events[type] || events.controversial_influencer);
    system.fanIncidents.unshift({ id: `fame_incident_${system.sequence++}`, age: character.age, identity: type, detail });
    const severity = Math.min(4, 1 + Math.floor(system.privacyLoss / 30));
    if (window.addConsequence && /home|route|address|held|offering/.test(detail)) window.addConsequence(character, { type: 'trauma', label: 'Public-Identity Exposure', detail, source: system.identity.label, severity, yearsRemaining: 2 + severity });
    if (window.observeHorror && ['feared_occultist', 'presumed_hoaxer', 'missing_still_posting'].includes(type)) window.observeHorror(character, { source: 'public_identity', text: detail, genuine: true, intensity: severity, engaged: true });
    return detail;
  }

  function tickNpcFame(character, system) {
    const people = allPeople(character);
    if (!people.length || system.publicReach < 100) return null;
    const person = pick(people);
    const personality = window.ensureNpcPersonality ? window.ensureNpcPersonality(person) : (person.personality || {});
    const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { trust: person.relationship || 50, resentment: 0 };
    if ((mind.trust || 0) + (person.relationship || 50) > 125 && (personality.empathy || 40) > 48) {
      if (window.addBenefit) window.addBenefit(character, { type: 'protection', label: `${person.name}'s Public Protection`, detail: 'They screen invasive requests and challenge one hostile approach.', source: person.name, domain: 'public', charges: 1, yearsRemaining: 2 });
      return `${person.name} began screening invasive messages and defending you publicly.`;
    }
    if ((personality.socialPower || 35) + (personality.vindictiveness || 35) + (mind.resentment || 0) > 125) {
      person.relationship = clamp((person.relationship || 50) - 5);
      if (window.createRumor) window.createRumor(character, { source: person, witnesses: [], audience: window.audienceForPerson ? window.audienceForPerson(person) : 'public', severity: 2, evidence: 28, claim: `${person.name} says fame changed you long before anyone noticed.` });
      return `${person.name}'s jealousy hardened into a public insinuation.`;
    }
    return null;
  }

  function tickFame(character) {
    const system = ensureFameSystem(character);
    if (system.lastTickAge === character.age) return [];
    system.lastTickAge = character.age;
    const logs = [];
    Object.values(character.terribleNet?.accounts || {}).forEach(account => {
      if (account.followers > 0 && (account.lastPostAge == null || character.age - account.lastPostAge >= 2)) {
        const lost = Math.max(1, Math.round(account.followers * (account.lastPostAge == null ? 0.08 : 0.04)));
        account.followers = Math.max(0, account.followers - lost);
        if (lost >= 10) logs.push(`${PLATFORM_NAME(account.platformId)} lost ${lost} followers during your public absence.`);
      }
    });
    system.scandals.filter(item => item.active).forEach(scandal => { scandal.heat = clamp(scandal.heat - (scandal.documented ? 6 : 13)); if (scandal.heat <= 5) scandal.active = false; });
    system.contracts.filter(item => item.active).forEach(contract => {
      contract.yearsRemaining -= 1;
      const annual = Math.round(contract.upfront * 0.28);
      character.money = (character.money || 0) + annual;
      logs.push(`${contract.sponsor} paid ${money(annual, character)} under your likeness contract.`);
      if (contract.exploitative && Math.random() < 0.32) {
        const scandal = createScandal(character, system); scandal.sponsorProvoked = contract.sponsor;
        logs.push(`${contract.sponsor} invoked its scandal clause and amplified: “${scandal.claim}”`);
      }
      if (contract.yearsRemaining <= 0) contract.active = false;
    });
    if (system.publicReach >= 100 && !system.offers.some(item => item.status === 'pending') && Math.random() < 0.34) {
      const offer = makeOffer(character, system); logs.push(`${offer.sponsor} offered ${money(offer.upfront, character)} for rights to your public identity.`);
    }
    if (system.publicReach >= 120 && !system.scandals.some(item => item.active) && Math.random() < Math.min(0.42, 0.08 + system.documentedWrongdoing * 0.07 + system.falseClaims * 0.04)) {
      const scandal = createScandal(character, system); logs.push(`${scandal.documented ? 'DOCUMENTED SCANDAL' : 'UNVERIFIED CLAIM'}: ${scandal.claim}`);
    }
    const npc = tickNpcFame(character, system); if (npc) logs.push(npc);
    const factionDanger = system.factions.stalkers + system.factions.imitators + system.factions.opportunists;
    if (character.age >= system.dangerCooldownUntil && system.publicReach >= 100 && Math.random() < Math.min(0.38, 0.06 + factionDanger / 90 + system.privacyLoss / 500)) {
      logs.push(fameDanger(character, system)); system.dangerCooldownUntil = character.age + 1 + Math.floor(Math.random() * 2);
    }
    if (character.presumedMissing && character.terribleNet && Math.random() < 0.45) {
      const account = Object.values(character.terribleNet.accounts || {})[0];
      if (account) character.terribleNet.posts.unshift({ id: `missing_post_${system.sequence++}`, platformId: account.platformId, type: 'image', tone: 'ordinary', text: pick(['I am fine. Stop looking.', 'The room has no doors in photographs.', 'This was scheduled before I disappeared.']), createdAge: character.age, reach: Math.max(200, system.publicReach), reactions: [], deleted: false, screenshotted: true, genuine: true, viral: true, moderation: 'visible', postedWhileMissing: true });
    }
    ensureFameSystem(character);
    return logs.slice(0, 7);
  }

  function recordPosthumousFame(character) {
    const identityBeforeDeath = character.fameSystem?.identity?.type || 'private_citizen';
    const system = ensureFameSystem(character);
    const snapshot = calculateSnapshot(character, system);
    system.posthumous = { age: character.age, identityBeforeDeath, publicReach: snapshot.publicReach, estateControlledBy: pick(['next of kin', 'a former sponsor', 'the Municipal Life Archive']), active: snapshot.publicReach >= 100 };
    if (system.posthumous.active) {
      system.identity = { type: 'posthumous_icon', label: IDENTITIES.posthumous_icon.label, danger: IDENTITIES.posthumous_icon.danger, sinceAge: character.age };
      const memorial = character.terribleNet?.memorials?.find(item => item.personId === 'player');
      if (!memorial && character.terribleNet) character.terribleNet.memorials.unshift({ id: `player_memorial_${system.sequence++}`, personId: 'player', name: character.name, createdAge: character.age, updates: [], followed: true, posthumousReach: snapshot.publicReach });
    }
    return system.posthumous;
  }

  function money(amount, character) { return window.formatMoney ? window.formatMoney(amount, character.countryCode) : `$${amount}`; }
  function PLATFORM_NAME(id) { return window.TERRIBLENET_PLATFORMS?.[id]?.name || id; }

  window.FAME_IDENTITIES = IDENTITIES;
  window.FAME_DEMOGRAPHICS = DEMOGRAPHICS;
  window.ensureFameSystem = ensureFameSystem;
  window.getFameSnapshot = character => ensureFameSystem(character);
  window.handleFameOffer = handleOffer;
  window.performPublicAppearance = publicAppearance;
  window.makeFameStatement = makeStatement;
  window.tickFame = tickFame;
  window.recordPosthumousFame = recordPosthumousFame;
})();
