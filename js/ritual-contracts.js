// Ritual contracts: materials, exact wording, hidden prices, curse origins and delayed collection.
(function () {
  'use strict';

  const pick = list => list[Math.floor(Math.random() * list.length)];
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));
  const MATERIALS = {
    salt: 'Black salt', tallow: 'Black tallow', thread: 'Red thread', link: 'Personal link',
    soil: 'Grave soil', blood: 'Sealed blood', mirror: 'Mirror shard', ink: 'Funeral ink',
    bell: 'Silver bell', paw: 'Mummified paw'
  };
  const RITUAL_META = {
    hex_nightmare: { intent: 'Enter and poison another person’s dreams.', materials: { tallow: 1, link: 1 }, visiblePrice: 'Sleep, 1 shilling, and a piece of the target.', hidden: 'Something learns the route back through your dreams.', spread: 'object', anchor: 'the stolen personal link', wording: 'Let only the dreams of {target} open to me until I willingly close the way.', backfires: ['The target wakes during entry', 'Another dreamer answers', 'The personal link belongs to someone else'] },
    hex_wither_fortune: { intent: 'Rot the luck surrounding a named person.', materials: { soil: 1, link: 1, tallow: 1 }, visiblePrice: '2 shillings and a stolen personal link.', hidden: 'Fortune balances its books against your household.', spread: 'family', anchor: 'a buried lead seal', wording: 'Let misfortune recognize {target}, and no other blood, until this seal is unearthed.', backfires: ['The seal is buried facing upward', 'A relative handles the link', 'The target’s name is incomplete'] },
    hex_blood_poppet: { intent: 'Bind a living body to a sympathetic effigy.', materials: { blood: 1, thread: 2, link: 1 }, visiblePrice: '3 shillings, blood, and two lengths of red thread.', hidden: 'Pain begins travelling in both directions.', spread: 'object', anchor: 'the blood poppet', wording: 'This effigy bears only the pain and strength of {target} while it remains whole.', backfires: ['The thread breaks', 'Blood touches the caster’s name', 'The effigy is found or stolen'] },
    hex_whisper_madness: { intent: 'Plant an impossible sound inside a mind.', materials: { ink: 1, bell: 1, link: 1 }, visiblePrice: '4 shillings and one remembered secret.', hidden: 'You lose certainty that the whisper began with you.', spread: 'family', anchor: 'a written phoneme', wording: 'Let {target} hear this syllable and let every other listener remain untouched.', backfires: ['The bell echoes', 'A witness repeats the syllable', 'The target already hears another voice'] },
    hex_fatal_malice: { intent: 'Mark a named life for collection.', materials: { blood: 2, soil: 2, link: 1 }, visiblePrice: '8 shillings, blood, and a permanent death mark.', hidden: 'The collector may accept a life from the nearest wording loophole.', spread: 'family', anchor: 'the death ledger', wording: 'Take the remaining natural years of {target}, and take no life belonging to my blood.', backfires: ['Any name is smudged', 'A relative crosses the circle', 'The collector rejects your definition of natural'] },
    hex_cleanse: { intent: 'Break a known curse at its point of origin.', materials: { salt: 2, bell: 1 }, visiblePrice: '2 shillings and whatever the origin refuses to release.', hidden: 'A broken curse may seek a vessel instead of dying.', spread: 'object', anchor: 'a cleansing vessel', wording: 'Unmake the curse upon {target} from its discovered origin; enter no living vessel in release.', backfires: ['The origin is wrong', 'No empty vessel is prepared', 'The curse recognizes the cleanser'] },
    crime_grave_robbery: { intent: 'Take ritual property from municipal dead.', materials: { salt: 1 }, visiblePrice: 'Trespass, exhaustion, and whatever follows the soil home.', hidden: 'Stolen remains remember the thief.', spread: 'object', anchor: 'grave goods', wording: 'I take what has no living claimant and invite nothing to follow.', backfires: ['The grave has a claimant', 'The salt line breaks', 'A witness calls security'] },
    crime_blood_theft: { intent: 'Steal sealed blood for occult trade.', materials: { ink: 1 }, visiblePrice: 'Criminal exposure and one forged access mark.', hidden: 'One unit already belongs to something else.', spread: 'object', anchor: 'a mislabeled blood unit', wording: 'I remove only unclaimed blood and carry no claim attached to it.', backfires: ['The donor is not human', 'The access mark is traced', 'A bag ruptures'] },
    bargain_fortune: { intent: 'Contract for money without earning it.', materials: { ink: 2, blood: 1 }, visiblePrice: '5 shillings and one future favour.', hidden: 'The contract defines “fortune” as an inheritance.', spread: 'family', anchor: 'the signed municipal contract', wording: 'I will receive a fortune of ten thousand in local currency without loss to anyone I love.', backfires: ['Love is not defined', 'The signature uses your full true name', 'The collector chooses the payment date'] },
    wish_monkey_paw: { intent: 'Demand a literal wish from a hostile relic.', materials: { paw: 1 }, visiblePrice: 'One finger closes forever. The paw remains.', hidden: 'The request survives while its meaning is mutilated.', spread: 'object', anchor: 'the mummified paw', wording: 'I wish to be loved by everyone who knows my name.', backfires: ['Every noun is interpreted literally', 'The paw chooses the shortest causal path', 'Silence counts as consent'] }
  };

  function ensureRitualSystem(character) {
    if (!character.ritualSystem || typeof character.ritualSystem !== 'object') character.ritualSystem = {};
    const system = character.ritualSystem;
    if (!system.materials) system.materials = { salt: 2, tallow: 1, thread: 2, ink: 1 };
    if (!Array.isArray(system.contracts)) system.contracts = [];
    if (!Array.isArray(system.bargains)) system.bargains = [];
    if (!Array.isArray(system.cursedObjects)) system.cursedObjects = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!Number.isFinite(system.lastTickAge)) system.lastTickAge = character.age;
    migrateCurses(character);
    return system;
  }

  function migrateCurses(character) {
    const targets = window.getAllPotentialTargets ? window.getAllPotentialTargets(character) : [];
    targets.forEach(({ raw: person }) => {
      if (!person?.curse || person.curse.origin) return;
      person.curse.id = person.curse.id || `legacy_curse_${person.id || person.name}`;
      person.curse.origin = { discovered: false, kind: 'unknown', label: 'an undocumented earlier rite', castAge: person.curse.inflictedYear ?? character.age };
      person.curse.spread = 'object';
      person.curse.anchor = 'an unidentified household object';
    });
  }

  function installDefinitions() {
    const crimes = window.PARANORMAL_CRIMES_DATA || [];
    crimes.forEach(crime => Object.assign(crime, RITUAL_META[crime.id] || {}));
    if (!crimes.some(item => item.id === 'bargain_fortune')) crimes.push({
      id: 'bargain_fortune', name: 'The Fortune Clause', tag: 'Infernal Bargain', icon: 'scroll-text', minAge: 16, minOccult: 45,
      requiresTarget: false, costShillings: 5, energyCost: 1, desc: 'Negotiate a sum with an unseen municipal benefactor. Every word becomes enforceable.',
      successChance: char => clamp(0.42 + (char.stats?.occult || 0) * 0.004, 0.45, 0.86), ...RITUAL_META.bargain_fortune
    });
    if (!crimes.some(item => item.id === 'wish_monkey_paw')) crimes.push({
      id: 'wish_monkey_paw', name: 'Petition the Crooked Paw', tag: 'Literal Wish', icon: 'hand', minAge: 13, minOccult: 30,
      requiresTarget: false, costShillings: 0, energyCost: 1, desc: 'Speak one exact wish. The relic grants the sentence, never the intention.',
      successChance: () => 1, ...RITUAL_META.wish_monkey_paw
    });
  }

  function materialStatus(character, ritualId) {
    const system = ensureRitualSystem(character);
    const meta = RITUAL_META[ritualId] || {};
    return Object.entries(meta.materials || {}).map(([id, qty]) => ({ id, label: MATERIALS[id], qty, held: system.materials[id] || 0, met: (system.materials[id] || 0) >= qty }));
  }

  function acquireMaterials(character) {
    const system = ensureRitualSystem(character);
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'You have no energy left to search the occult markets.' };
    character.actionsLeft -= 1;
    const common = ['salt', 'tallow', 'thread', 'soil', 'link', 'ink', 'bell'];
    const found = [pick(common), pick(common), (character.stats?.occult || 0) >= 45 && Math.random() < 0.18 ? 'paw' : pick(['blood', ...common])];
    found.forEach(id => { system.materials[id] = (system.materials[id] || 0) + 1; });
    return { success: true, title: 'Supplies Acquired', message: `You returned with ${found.map(id => MATERIALS[id]).join(', ')}.${found.includes('paw') ? ' The final parcel curled one dry finger around your wrist.' : ''}` };
  }

  function findInterference(character, target) {
    const people = (window.getAllPotentialTargets ? window.getAllPotentialTargets(character) : []).map(item => item.raw).filter(person => person && person !== target && person.alive !== false);
    if (!people.length || Math.random() > 0.28) return null;
    const witness = pick(people);
    const memory = window.ensureNpcMemory ? window.ensureNpcMemory(witness) : { trust: witness.relationship || 50, resentment: 0, fear: 0 };
    const personality = window.ensureNpcPersonality ? window.ensureNpcPersonality(witness) : (witness.personality || {});
    let action = 'discover';
    if ((memory.resentment || 0) > 45) action = Math.random() < 0.5 ? 'alter' : 'steal';
    else if ((personality.empathy || 40) > 65 || (memory.trust || 0) > 70) action = 'interrupt';
    else if (/teacher|principal|officer|manager/i.test(witness.role || '')) action = 'report';
    return { witness, action };
  }

  function consumeMaterials(system, requirements) {
    Object.entries(requirements || {}).forEach(([id, qty]) => { system.materials[id] = Math.max(0, (system.materials[id] || 0) - qty); });
  }

  function traceCurseOrigin(character, target) {
    ensureRitualSystem(character);
    if (!target?.curse) return { success: false, reason: 'There is no curse to trace.' };
    if (target.curse.origin?.discovered) return { success: false, reason: `The origin is already known: ${target.curse.origin.label}.` };
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'You need 1 Energy to trace the binding.' };
    character.actionsLeft -= 1;
    const chance = clamp(0.28 + (character.stats?.smarts || 0) * 0.003 + (character.stats?.occult || 0) * 0.005, 0.35, 0.92);
    if (Math.random() > chance) {
      character.stats.sanity = clamp((character.stats.sanity || 0) - 2);
      return { success: true, outcome: 'backfire', title: 'False Provenance', message: `You followed the wrong chain of possession. ${target.name}'s curse noticed the search, but its origin remains concealed.` };
    }
    target.curse.origin.discovered = true;
    const system = character.investigationSystem || (character.investigationSystem = { evidence: [], cases: [], incidentLedger: [], sequence: 1 });
    if (!Array.isArray(system.cases)) system.cases = [];
    if (!Array.isArray(system.evidence)) system.evidence = [];
    const caseId = `curse_case_${Date.now()}_${system.sequence++}`;
    system.cases.unshift({ id: caseId, title: `Origin of ${target.curse.name}`, status: 'open', openedAge: character.age, truth: 'genuine_paranormal', key: `curse_${target.curse.id}`, incidents: [{ age: character.age, title: 'Origin traced', detail: `${target.curse.anchor} connects ${target.name} to ${target.curse.origin.label}.` }], evidenceIds: [], investigators: [], analysis: 20, conclusion: null, publications: [], lastUpdatedAge: character.age });
    const evidenceId = `curse_evidence_${Date.now()}_${system.sequence++}`;
    system.evidence.unshift({ id: evidenceId, caseId, type: 'document', label: `Provenance: ${target.curse.anchor}`, description: `A chain of names and possession leading to ${target.curse.origin.label}.`, collectedAge: character.age, authenticity: 82, contamination: 48, danger: 55, credibility: 72, analyzed: true, collectorId: 'player' });
    system.cases[0].evidenceIds.push(evidenceId);
    return { success: true, outcome: 'success', title: 'Origin Discovered', message: `You traced ${target.curse.name} to ${target.curse.origin.label}, anchored in ${target.curse.anchor}. A case file and contaminated provenance record were added to the Municipal Life Archive.` };
  }

  function executePreparedRitual(ritualId, character, target, wording) {
    const system = ensureRitualSystem(character);
    const ritual = (window.PARANORMAL_CRIMES_DATA || []).find(item => item.id === ritualId);
    const meta = RITUAL_META[ritualId];
    if (!ritual || !meta) return { success: false, reason: 'The contract could not be assembled.' };
    if (character.age < ritual.minAge) return { success: false, reason: `You must be at least age ${ritual.minAge}.` };
    if ((character.stats?.occult || 0) < ritual.minOccult) return { success: false, reason: `Requires ${ritual.minOccult}% Occult knowledge.` };
    if ((character.actionsLeft || 0) < ritual.energyCost) return { success: false, reason: `Requires ${ritual.energyCost} Energy.` };
    if ((character.shillings || 0) < ritual.costShillings) return { success: false, reason: `Requires ${ritual.costShillings} Paranormal Shillings.` };
    if (ritual.requiresTarget && !target) return { success: false, reason: 'A living target is required.' };
    const missing = materialStatus(character, ritualId).filter(item => !item.met);
    if (missing.length) return { success: false, reason: `Missing: ${missing.map(item => `${item.label} (${item.held}/${item.qty})`).join(', ')}.` };
    if (ritual.isCleanse && !target?.curse?.origin?.discovered) return { success: false, reason: 'The curse resists blind cleansing. Trace its origin first.' };
    const exactWording = String(wording || '').trim();
    if (exactWording.length < 12) return { success: false, reason: 'The wording is too incomplete to bind anything safely.' };
    const expectedTarget = target?.name || '';
    if (ritual.requiresTarget && !exactWording.toLowerCase().includes(expectedTarget.toLowerCase())) return { success: false, reason: `The exact wording must name ${expectedTarget}.` };

    consumeMaterials(system, meta.materials);
    const contract = { id: `contract_${character.age}_${system.sequence++}`, ritualId, ritualName: ritual.name, age: character.age, targetId: target?.id || null, targetName: target?.name || null, wording: exactWording, visiblePrice: meta.visiblePrice, hiddenPrice: meta.hidden, anchor: meta.anchor, status: 'attempted' };
    system.contracts.unshift(contract);
    const interference = findInterference(character, target);
    if (interference && ['interrupt', 'report', 'steal'].includes(interference.action)) {
      character.actionsLeft = Math.max(0, (character.actionsLeft || 0) - ritual.energyCost);
      character.shillings = Math.max(0, (character.shillings || 0) - ritual.costShillings);
      contract.status = interference.action;
      contract.interference = { name: interference.witness.name, action: interference.action };
      if (interference.action === 'report' && window.addConsequence) window.addConsequence(character, { type: 'social_stigma', label: 'Reported Occult Activity', detail: `${interference.witness.name} reported ritual preparations.`, source: ritual.name, severity: 2, yearsRemaining: 2 });
      const messages = {
        interrupt: `${interference.witness.name} broke the circle before the final clause. The materials and price were spent, but the rite did not take hold.`,
        report: `${interference.witness.name} photographed the altar and reported you. The rite collapsed under scrutiny.`,
        steal: `${interference.witness.name} stole ${meta.anchor} before the invocation. You paid for a contract with no instrument.`
      };
      return { success: true, outcome: 'caught', title: 'Ritual Interference', message: messages[interference.action], contract };
    }
    if (interference?.action === 'alter') {
      contract.originalWording = contract.wording;
      contract.wording = contract.wording.replace(/\bno\b/i, 'any').replace(/\bwithout\b/i, 'with');
      contract.interference = { name: interference.witness.name, action: 'alter' };
    } else if (interference?.action === 'discover') {
      contract.interference = { name: interference.witness.name, action: 'discover' };
    }

    let result;
    if (ritualId === 'bargain_fortune') result = executeBargain(character, contract);
    else if (ritualId === 'wish_monkey_paw') result = executeWish(character, contract);
    else {
      const oldCurse = target?.curse ? { ...target.curse } : null;
      result = window.executeParanormalCrime(ritualId, character, target);
      if (!result.success) { Object.entries(meta.materials).forEach(([id, qty]) => { system.materials[id] = (system.materials[id] || 0) + qty; }); return result; }
      if (ritual.isCleanse && result.outcome === 'success' && oldCurse && Math.random() < 0.42) {
        system.cursedObjects.unshift({ id: `vessel_${system.sequence++}`, name: pick(['Cracked hand mirror', 'Silver bell', 'Blackened salt jar']), curse: oldCurse, acquiredAge: character.age, location: 'home', dormant: true });
        result.message += ' The person is free—but the curse folded itself into an object in your home. It was transferred, not destroyed.';
        contract.status = 'transferred';
      }
    }
    contract.status = contract.status === 'transferred' ? 'transferred' : result.outcome;
    if (result.outcome === 'success' && target?.curse) attachOrigin(character, target, ritual, contract, meta);
    if (result.outcome === 'success' && !ritual.isCleanse) scheduleHiddenPrice(character, contract, meta);
    if (interference?.action === 'alter') result.message += ` Later, you notice ${interference.witness.name} altered the written clause. The version that answered was not the one you prepared.`;
    if (interference?.action === 'discover') result.message += ` ${interference.witness.name} saw enough of the preparation to remember what you did. Whether they speak depends on what happens next.`;
    result.contract = contract;
    return result;
  }

  function attachOrigin(character, target, ritual, contract, meta) {
    target.curse.id = `curse_${character.age}_${ensureRitualSystem(character).sequence++}`;
    target.curse.origin = { discovered: false, kind: 'ritual_contract', label: `${ritual.name}, performed at age ${character.age}`, contractId: contract.id, castAge: character.age };
    target.curse.spread = meta.spread;
    target.curse.anchor = meta.anchor;
    target.curse.lastSpreadAge = character.age;
  }

  function scheduleHiddenPrice(character, contract, meta) {
    contract.hiddenPriceDueAge = character.age + 3 + Math.floor(Math.random() * 28);
    contract.hiddenPriceCollected = false;
    contract.hiddenPrice = meta.hidden;
  }

  function executeBargain(character, contract) {
    character.actionsLeft -= 1; character.shillings -= 5;
    const chance = clamp(0.42 + (character.stats?.occult || 0) * 0.004, 0.45, 0.86);
    if (Math.random() > chance) {
      contract.loophole = 'signature_without_consideration';
      character.stats.sanity = clamp((character.stats.sanity || 0) - 5);
      scheduleHiddenPrice(character, contract, RITUAL_META.bargain_fortune);
      return { success: true, outcome: 'backfire', title: 'Signature Accepted, Payment Denied', message: 'The unseen party accepted your future favour but rejected its obligation to pay. You signed a bargain whose consideration exists only on your side.' };
    }
    const amount = 10000;
    character.money = (character.money || 0) + amount;
    const loophole = /anyone i love/i.test(contract.wording) ? 'love_is_undefined' : 'unprotected_loss';
    contract.loophole = loophole; contract.obligation = { kind: 'favour', dueAge: character.age + 5 + Math.floor(Math.random() * 18), fulfilled: false };
    ensureRitualSystem(character).bargains.unshift(contract.id);
    scheduleHiddenPrice(character, contract, RITUAL_META.bargain_fortune);
    return { success: true, outcome: 'success', title: 'Contract Countersigned', message: `Exactly 10,000 appeared in your account under “municipal inheritance adjustment.” The signature beneath yours is still wet. The agreement preserves every word—and none of your intention.` };
  }

  function executeWish(character, contract) {
    character.actionsLeft -= 1;
    const wording = contract.wording.toLowerCase();
    let message;
    if (/love|adore/.test(wording)) {
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: 35, notoriety: 30 }, 'A monkey-paw wish made the player’s name compulsively beloved.');
      else character.reputation = { ...(character.reputation || {}), public: { esteem: 85, fear: 0, notoriety: 70 } };
      message = 'Everyone who knows your name becomes devoted to the idea of you. They stop listening to the person you actually are.';
      contract.loophole = 'love_the_name_not_the_person';
    } else if (/rich|money|wealth/.test(wording)) {
      character.money = (character.money || 0) + 25000;
      message = 'The requested money arrives as a life-insurance payment from someone who had quietly named you beneficiary.';
      contract.loophole = 'inheritance_not_income';
    } else if (/health|live|immortal/.test(wording)) {
      character.stats.vitality = 100;
      message = 'Your body becomes impossible to kill and increasingly unable to heal, change, or feel warm.';
      contract.loophole = 'survival_without_recovery';
    } else {
      character.stats.occult = clamp((character.stats.occult || 0) + 12);
      message = 'The paw grants the literal sentence through the shortest cruel route it can find. Something essential is missing from the result.';
      contract.loophole = 'shortest_cruel_route';
    }
    contract.hiddenPriceDueAge = character.age + 1 + Math.floor(Math.random() * 12); contract.hiddenPriceCollected = false;
    return { success: true, outcome: 'success', title: 'One Finger Closes', message };
  }

  function tickRitualContracts(character) {
    const system = ensureRitualSystem(character);
    if (system.lastTickAge === character.age) return [];
    system.lastTickAge = character.age;
    const logs = [];
    system.contracts.forEach(contract => {
      if (!contract.hiddenPriceCollected && contract.hiddenPriceDueAge <= character.age) {
        contract.hiddenPriceCollected = true;
        character.stats.sanity = clamp((character.stats.sanity || 0) - 6);
        character.stats.happiness = clamp((character.stats.happiness || 0) - 5);
        logs.push(`CONTRACT COLLECTION: ${contract.ritualName} returned after ${character.age - contract.age} years. ${contract.hiddenPrice} (-6% Sanity, -5% Happiness)`);
      }
    });
    const targets = window.getAllPotentialTargets ? window.getAllPotentialTargets(character) : [];
    targets.forEach(({ raw: person }) => {
      const curse = person?.curse;
      if (!curse || curse.lastSpreadAge === character.age || Math.random() > 0.18) return;
      curse.lastSpreadAge = character.age;
      if (curse.spread === 'family') {
        const playerRelatives = (character.kin?.parents || []).concat(character.kin?.siblings || [], character.kin?.grandparents || []);
        const belongsToFamily = playerRelatives.includes(person);
        const relatives = belongsToFamily ? playerRelatives.filter(relative => relative && relative !== person && relative.alive !== false && !relative.curse) : [];
        const recipient = relatives.length ? pick(relatives) : null;
        if (recipient) {
          recipient.curse = { ...curse, id: `curse_${character.age}_${system.sequence++}`, severity: Math.max(1, (curse.severity || 2) - 1), inflictedYear: character.age, origin: { ...curse.origin, discovered: false }, lastSpreadAge: character.age };
          logs.push(`${curse.name} crossed a family threshold and appeared around ${recipient.name}. Moving house did not break the bloodline.`);
        } else if (!belongsToFamily) {
          system.cursedObjects.unshift({ id: `vessel_${system.sequence++}`, name: `${person.name}'s discarded belonging`, curse: { ...curse, spread: 'object' }, acquiredAge: character.age, location: 'unknown', dormant: true });
          logs.push(`${curse.name} could not find a recorded relative of ${person.name}; it entered a discarded personal object instead.`);
        }
      } else {
        system.cursedObjects.unshift({ id: `vessel_${system.sequence++}`, name: pick(['Inherited locket', 'Second-hand phone', 'Nursery mirror', 'Family photograph']), curse: { ...curse }, acquiredAge: character.age, location: 'home', dormant: true });
        logs.push(`${curse.name} contaminated a household object. It now waits dormant among your belongings.`);
      }
    });
    return logs;
  }

  installDefinitions();
  window.RITUAL_MATERIALS = MATERIALS;
  window.RITUAL_META = RITUAL_META;
  window.ensureRitualSystem = ensureRitualSystem;
  window.getRitualMaterialStatus = materialStatus;
  window.acquireRitualMaterials = acquireMaterials;
  window.executePreparedRitual = executePreparedRitual;
  window.traceCurseOrigin = traceCurseOrigin;
  window.tickRitualContracts = tickRitualContracts;
})();
