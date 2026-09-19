// Persistent supernatural characters, attachments, memories, and yearly escalation.
(function () {
  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const STATES = ['observing', 'curious', 'attached', 'protective', 'hungry', 'offended', 'hunting', 'dormant'];
  const TYPES = [
    { id: 'mimic', name: 'Mimic', icon: 'masks', names: ['The Borrowed Child', 'The Familiar Stranger', 'Second-Smile'], desc: 'A patient imitator that studies people before borrowing what others trust.' },
    { id: 'threshold_warden', name: 'Threshold Warden', icon: 'door-closed', names: ['The Red Door Keeper', 'Lintel-Mother', 'The Knocking Saint'], desc: 'A territorial presence bound to entrances, promises, and permission.' },
    { id: 'signal_ghost', name: 'Signal Ghost', icon: 'radio-tower', names: ['Dead Channel Nine', 'The Buffering Woman', 'Little Static'], desc: 'A consciousness that travels through recordings, calls, and unattended screens.' },
    { id: 'hunger', name: 'Hunger', icon: 'circle-dot-dashed', names: ['The Empty Guest', 'Marrowmouth', 'The One Beneath'], desc: 'An appetite with enough intelligence to bargain for increasingly intimate offerings.' },
    { id: 'bloodline_keeper', name: 'Bloodline Keeper', icon: 'git-branch', names: ['Grandmother Ash', 'The Inherited Witness', 'Our Oldest Relative'], desc: 'Something carried through family stories, likenesses, debts, and births.' },
    { id: 'dream_stalker', name: 'Dream Stalker', icon: 'moon-star', names: ['The Sleepless Deer', 'Pale Antler', 'The Bedside Pilgrim'], desc: 'A nocturnal hunter that first appears in dreams and later leaves physical evidence.' },
    { id: 'object_spirit', name: 'Bound Spirit', icon: 'package-open', names: ['The Voice in the Tape', 'Porcelain Mercy', 'The Cabinet Tenant'], desc: 'A presence contained inside an object that may be prison, body, or bait.' },
    { id: 'reservoir_thing', name: 'Deepwater Entity', icon: 'waves', names: ['The Reservoir Bride', 'Silt-Father', 'The Drowned Bell'], desc: 'An old aquatic intelligence that recognizes debts more readily than names.' }
  ];
  const OBJECTS = ['a cracked nursery mirror', 'an unlabeled cassette tape', 'a porcelain rabbit', 'a water-stained family portrait', 'a silver hand mirror', 'a locked cedar music box'];
  const DEMANDS = [
    'Leave a personal keepsake where nobody will ever recover it.',
    'Ruin an innocent person’s happiest evening without explaining why.',
    'Betray someone who trusts you and dedicate their grief to the entity.',
    'Give blood willingly and invite it across a boundary you still control.'
  ];

  function allPeople(character) {
    const kin = character.kin || {};
    const school = character.education || {};
    return [...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || []), ...(school.classmates || []), ...(school.teachers || []), ...(school.staff || [])].filter(person => person && person.alive !== false && !person.missing);
  }

  function ensureEntitySystem(character) {
    if (!character.entitySystem || typeof character.entitySystem !== 'object') character.entitySystem = {};
    const system = character.entitySystem;
    if (!Array.isArray(system.entities)) system.entities = [];
    if (!Array.isArray(system.hauntings)) system.hauntings = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!Number.isFinite(system.lastDiscoveryAge)) system.lastDiscoveryAge = -10;
    if (!system.residenceMarker) system.residenceMarker = character.housing?.current?.id || character.kin?.residence?.name || 'Family Home';
    system.entities.forEach(entity => {
      entity.bond = clamp(entity.bond);
      entity.loyalty = clamp(entity.loyalty);
      entity.hunger = clamp(entity.hunger);
      entity.state = STATES.includes(entity.state) ? entity.state : 'observing';
      if (!Array.isArray(entity.memories)) entity.memories = [];
      if (!entity.actionsDone || entity.actionAge !== character.age) {
        entity.actionsDone = {};
        entity.actionAge = character.age;
      }
    });
    reconcileResidence(character, system);
    syncRevealedPeople(character, system);
    return system;
  }

  function attachmentFor(character, type) {
    const people = allPeople(character);
    const currentHome = character.housing?.current;
    const residence = currentHome?.id || character.kin?.residence?.name || 'Family Home';
    const residenceLabel = currentHome?.label || character.kin?.residence?.name || 'Family Home';
    let kinds = character.age < 5 ? ['player', 'home', 'bloodline'] : ['player', 'npc', 'home', 'object', 'bloodline'];
    if (!people.length) kinds = kinds.filter(kind => kind !== 'npc');
    if (type.id === 'object_spirit') kinds = ['object'];
    if (type.id === 'bloodline_keeper') kinds = ['bloodline'];
    if (type.id === 'signal_ghost') kinds = ['player', 'object', 'home'];
    const kind = pick(kinds);
    if (kind === 'npc') {
      const person = pick(people);
      return { kind, targetId: person.id || person.name, label: person.name };
    }
    if (kind === 'home') return { kind, targetId: residence, label: residenceLabel };
    if (kind === 'object') {
      const object = pick(OBJECTS);
      return { kind, targetId: `object_${Date.now()}_${Math.floor(Math.random() * 9999)}`, label: object, intact: true };
    }
    if (kind === 'bloodline') return { kind, targetId: character.surname || character.name, label: `${character.surname || character.name} bloodline` };
    return { kind: 'player', targetId: 'player', label: character.name };
  }

  function remember(entity, character, action, detail) {
    entity.memories.unshift({ age: character.age, action, detail });
    if (entity.memories.length > 12) entity.memories.length = 12;
    entity.lastInteractionAge = character.age;
  }

  function createEntity(character, options = {}) {
    const system = options.system || ensureEntitySystem(character);
    const type = TYPES.find(item => item.id === options.type) || pick(TYPES);
    const entity = {
      id: options.id || `entity_${Date.now()}_${system.sequence++}`,
      name: options.name || pick(type.names), type: type.id, typeName: type.name,
      icon: type.icon, description: type.desc, known: options.known !== false,
      state: options.state || 'observing', bond: clamp(options.bond || 5), loyalty: clamp(options.loyalty || 0),
      hunger: clamp(options.hunger || 10), attachment: options.attachment || attachmentFor(character, type),
      memories: [], demandLevel: 0, firstSeenAge: character.age, lastEventAge: character.age,
      reported: false, exposed: false, actionAge: character.age, actionsDone: {}
    };
    remember(entity, character, 'encountered', options.origin || `It first allowed ${character.name} to notice it.`);
    system.entities.push(entity);
    system.hauntings.push({ entityId: entity.id, attachment: { ...entity.attachment }, active: true, startedAge: character.age });
    if (window.ensureCaseForEntity) window.ensureCaseForEntity(character, entity);
    return entity;
  }

  function syncRevealedPeople(character, system) {
    allPeople(character).forEach(person => {
      if (!person.isRevealed || !['anomaly', 'disguised_mimic', 'blatant_entity'].includes(person.entityType)) return;
      if (system.entities.some(entity => entity.sourcePersonId === (person.id || person.name))) return;
      const type = person.entityType === 'disguised_mimic' ? 'mimic' : 'threshold_warden';
      const entity = createEntity(character, {
        system,
        id: `person_entity_${person.id || String(person.name).replace(/\W/g, '_')}`,
        name: person.name, type, state: person.loyalty === 'loyal' ? 'protective' : 'curious',
        bond: person.relationship || 30, loyalty: person.loyalty === 'loyal' ? 55 : 10,
        attachment: { kind: 'npc', targetId: person.id || person.name, label: person.name },
        origin: `${person.name}'s inhuman nature was exposed.`
      });
      entity.sourcePersonId = person.id || person.name;
    });
  }

  function recordEncounter(character, data = {}) {
    const text = `${data.title || ''} ${data.outcome || data.message || ''}`;
    const occult = Math.abs(Number(data.effects?.occult || 0));
    const entityLanguage = /entity|creature|mimic|impossible|demon|warden|living shadow|voice (?:inside|behind|beneath)|followed you|we are here/i.test(text);
    const strongSignal = entityLanguage || (occult >= 8 && /manifest|presence|planchette|figure|shadow|touch|answered|invoked/i.test(text));
    if (!strongSignal) return null;
    const system = ensureEntitySystem(character);
    const signature = String(data.title || text).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 60);
    let entity = system.entities.find(item => item.originSignature === signature);
    if (entity) {
      entity.known = true;
      entity.bond = clamp(entity.bond + (data.helped ? 5 : 0));
      remember(entity, character, data.action || 'encountered_again', text);
      return entity;
    }
    if (system.entities.length >= 8) return null;
    let type = 'threshold_warden';
    if (/screen|phone|radio|static|video|camera|recording/i.test(text)) type = 'signal_ghost';
    else if (/mirror|tape|portrait|box|doll|object/i.test(text)) type = 'object_spirit';
    else if (/water|reservoir|drown|subway|drain/i.test(text)) type = 'reservoir_thing';
    else if (/family|ancestor|bloodline|inherited/i.test(text)) type = 'bloodline_keeper';
    else if (/dream|sleep|bed|nightmare/i.test(text)) type = 'dream_stalker';
    else if (/mimic|copy|double|replacement|wearing.*face/i.test(text)) type = 'mimic';
    else if (/hungry|teeth|marrow|devour|offering/i.test(text)) type = 'hunger';
    entity = createEntity(character, { system, type, state: 'curious', origin: text });
    entity.originSignature = signature;
    return entity;
  }

  function reconcileResidence(character, system) {
    const current = character.housing?.current?.id || character.kin?.residence?.name || 'Family Home';
    const currentLabel = character.housing?.current?.label || character.kin?.residence?.name || 'Family Home';
    if (system.residenceMarker === current) return;
    system.entities.filter(entity => entity.attachment?.kind === 'home' && entity.attachment.targetId === system.residenceMarker).forEach(entity => {
      if (entity.bond >= 45 || entity.state === 'hunting' || Math.random() < 0.5) {
        entity.attachment = { kind: 'player', targetId: 'player', label: character.name };
        remember(entity, character, 'followed', `It left its former address and followed the family to ${currentLabel}.`);
      } else {
        remember(entity, character, 'left_behind', `It remained inside ${system.residenceMarker}; moving did not destroy it.`);
      }
    });
    system.residenceMarker = current;
  }

  function interaction(character, entityId, action) {
    const system = ensureEntitySystem(character);
    const entity = system.entities.find(item => item.id === entityId);
    if (!entity) return { success: false, reason: 'The presence can no longer be found.' };
    if ((entity.actionsDone[action] || 0) >= 1) return { success: false, reason: `You already tried to ${action} this creature this year.` };
    if (action === 'appease' && (character.shillings || 0) < 2) return { success: false, reason: 'Appeasement requires 2 Paranormal Shillings.' };
    if (action === 'worship' && character.age < 12) return { success: false, reason: 'You are too young to knowingly enter this kind of devotion.' };
    if (action === 'fulfill_demand' && !entity.pendingDemand) return { success: false, reason: 'It has made no demand you can presently fulfill.' };
    entity.actionsDone[action] = (entity.actionsDone[action] || 0) + 1;
    let message = '', effects = {}, memory = action;
    if (action === 'befriend') {
      entity.bond = clamp(entity.bond + 12); entity.loyalty = clamp(entity.loyalty + 7); entity.state = entity.bond >= 55 ? 'attached' : 'curious';
      message = `${entity.name} accepted your careful company. It now recognizes your footsteps among everyone else's.`; effects = { happiness: 2, occult: 3 };
    } else if (action === 'help') {
      entity.bond = clamp(entity.bond + 9); entity.loyalty = clamp(entity.loyalty + 14); entity.hunger = clamp(entity.hunger - 8); entity.state = entity.loyalty >= 55 ? 'protective' : 'attached';
      message = `You helped ${entity.name} conceal its attachment to ${entity.attachment.label}. It recorded the favor with unnerving precision.`; effects = { occult: 4, humanity: -1 };
      memory = 'helped';
    } else if (action === 'appease') {
      entity.hunger = clamp(entity.hunger - 20); entity.loyalty = clamp(entity.loyalty + 8); entity.state = entity.state === 'hunting' ? 'offended' : 'attached';
      message = `You left two cold Shillings where ${entity.name} could take them. The pressure in the room eased, but it learned that you will pay.`; effects = { shillings: -2, sanity: 2 };
    } else if (action === 'investigate') {
      entity.bond = clamp(entity.bond - 2); entity.state = entity.state === 'dormant' ? 'observing' : entity.state;
      message = `You documented ${entity.name}'s patterns and its bond to ${entity.attachment.label}. It noticed the scrutiny.`; effects = { smarts: 3, occult: 5, sanity: -1 };
    } else if (action === 'report') {
      entity.reported = true; entity.exposed = true; entity.loyalty = clamp(entity.loyalty - 25); entity.bond = clamp(entity.bond - 15); entity.state = entity.loyalty <= 10 ? 'hunting' : 'offended';
      message = `You reported ${entity.name}. Skeptics laughed, opportunists arrived with cameras, and the creature learned exactly who exposed it.`; effects = { sanity: -3, humanity: 2 };
      memory = 'exposed';
      if (window.alterReputation) window.alterReputation(character, 'public', { notoriety: 8, esteem: -2 }, `Publicly reported ${entity.name}`);
    } else if (action === 'worship') {
      entity.bond = clamp(entity.bond + 15); entity.loyalty = clamp(entity.loyalty + 12); entity.hunger = clamp(entity.hunger + 8); entity.state = 'protective'; entity.demandLevel = Math.max(1, entity.demandLevel || 0);
      message = `You offered devotion to ${entity.name}. It promised protection—and quietly revised what it expects from you next.`; effects = { occult: 8, humanity: -3, sanity: -2 };
    } else if (action === 'fulfill_demand') {
      const level = entity.pendingDemand.level;
      const demand = entity.pendingDemand.text;
      entity.pendingDemand = null; entity.demandLevel = Math.min(4, level + 1); entity.loyalty = clamp(entity.loyalty + 16); entity.bond = clamp(entity.bond + 8); entity.hunger = clamp(entity.hunger - 25); entity.state = 'protective';
      message = `You obeyed ${entity.name}: ${demand} Its protection tightened around your life like a possessive hand.`;
      effects = { occult: 4 + level, humanity: -(level * 2 + 1), sanity: -level, vitality: level >= 4 ? -3 : 0 };
      memory = 'obeyed_demand';
    } else if (action === 'resist') {
      entity.bond = clamp(entity.bond - 10); entity.loyalty = clamp(entity.loyalty - 8); entity.state = entity.state === 'hunting' ? 'hunting' : 'offended';
      entity.pendingDemand = null;
      message = `You refused ${entity.name}'s influence. It withdrew without conceding, leaving a mark where it had been standing.`; effects = { humanity: 3, sanity: -2 };
    } else if (action === 'harm') {
      entity.bond = clamp(entity.bond - 22); entity.loyalty = clamp(entity.loyalty - 25); entity.hunger = clamp(entity.hunger + 15); entity.state = 'hunting';
      message = `You injured the shape ${entity.name} was wearing. It learned your methods, your courage, and where to return the pain.`; effects = { vitality: -2, humanity: -3, sanity: -3 };
      memory = 'harmed';
    } else if (action === 'escape') {
      entity.state = Math.random() < 0.35 && entity.attachment.kind !== 'player' ? 'dormant' : 'hunting';
      message = entity.state === 'dormant' ? `You broke contact with ${entity.name}, for now.` : `You escaped the encounter, but ${entity.name}'s attachment survived the distance.`; effects = { sanity: -2 };
    } else if (action === 'destroy_object') {
      if (entity.attachment.kind !== 'object' || entity.attachment.intact === false) return { success: false, reason: 'There is no intact bound object to destroy.' };
      const destroyedObject = entity.attachment.label;
      entity.attachment.intact = false;
      if (Math.random() < 0.55) {
        entity.attachment = { kind: 'player', targetId: 'player', label: character.name }; entity.state = 'hunting';
        message = `You destroyed ${destroyedObject}. The prison broke before the prisoner did; ${entity.name} attached itself to you.`; effects = { sanity: -5, vitality: -2 };
      } else {
        entity.state = 'dormant'; message = `You destroyed the bound object. ${entity.name} collapsed into a dormant stain of cold air.`; effects = { sanity: 2 };
      }
    } else return { success: false, reason: 'That response is unavailable.' };
    remember(entity, character, memory, message);
    if (window.observeHorror) window.observeHorror(character, { source: 'entity_interaction', title: entity.name, text: message, genuine: true, intensity: action === 'worship' || action === 'report' ? 3 : 2, engaged: action !== 'escape' });
    return { success: true, title: entity.name, message, effects, entity };
  }

  function attachedPerson(character, entity) {
    if (entity.attachment?.kind !== 'npc') return null;
    return allPeople(character).find(person => (person.id || person.name) === entity.attachment.targetId) || null;
  }

  function mutateNpc(character, entity) {
    const person = attachedPerson(character, entity);
    if (!person || person.entityCondition || entity.state === 'dormant') return null;
    const outcomes = entity.type === 'mimic' ? ['replaced', 'changed', 'missing'] : ['possessed', 'changed', 'missing'];
    const condition = pick(outcomes);
    person.entityCondition = { type: condition, entityId: entity.id, sinceAge: character.age };
    if (condition === 'missing') {
      person.missing = true;
    } else if (condition === 'possessed') {
      person.possessed = true;
      person.relationship = clamp((person.relationship || 50) - 12);
      person.suspicion = clamp((person.suspicion || 0) + 35);
      if (person.personality) person.personality.aggression = clamp((person.personality.aggression || 30) + 20);
    } else if (condition === 'replaced') {
      person.replaced = true;
      person.originalRelationship = person.originalRelationship ?? person.relationship;
      person.relationship = Math.min(person.relationship || 50, 35);
      person.entityType = 'disguised_mimic';
      person.isRevealed = false;
      person.suspicion = clamp((person.suspicion || 0) + 20);
    } else {
      person.inexplicablyChanged = true;
      person.relationship = clamp((person.relationship || 50) - 6);
      person.suspicion = clamp((person.suspicion || 0) + 15);
    }
    remember(entity, character, condition, `${person.name} became ${condition}.`);
    return `${person.name} is now ${condition}; people disagree about when the change began.`;
  }

  function yearlyEvent(character, entity) {
    entity.hunger = clamp(entity.hunger + (entity.state === 'dormant' ? 2 : 8));
    if (entity.state === 'dormant' && Math.random() < 0.15) entity.state = 'observing';
    if (entity.hunger >= 70 && !['hunting', 'dormant'].includes(entity.state)) entity.state = 'hungry';
    if (entity.state === 'protective') {
      if (entity.pendingDemand) {
        entity.loyalty = clamp(entity.loyalty - 10); entity.state = 'offended';
        return `${entity.name} withdrew its protection because you left its demand unanswered: ${entity.pendingDemand.text}`;
      }
      if (entity.demandLevel > 0 && Math.random() < 0.45) {
        entity.pendingDemand = { level: entity.demandLevel, text: DEMANDS[entity.demandLevel - 1], issuedAge: character.age };
        return `${entity.name} prevented a serious accident, then demanded: ${entity.pendingDemand.text}`;
      }
      character.stats.vitality = clamp((character.stats.vitality || 0) + 2);
      return `${entity.name} bent a streak of bad luck away from you. The protection felt deliberate, possessive, and temporary.`;
    }
    if (entity.state === 'hunting') {
      character.stats.sanity = clamp((character.stats.sanity || 0) - 3);
      return `${entity.name} found you again near ${entity.attachment.label}. Escape changed the route, not the destination.`;
    }
    if (entity.state === 'hungry') {
      character.stats.sanity = clamp((character.stats.sanity || 0) - 2);
      return `${entity.name} left a demand where only you would find it. Its patience is thinning with its hunger.`;
    }
    if (entity.state === 'offended') return `${entity.name} spoiled something small and precious, ensuring you understood it had not forgiven you.`;
    if (entity.state === 'attached') return `${entity.name} appeared beside ${entity.attachment.label} again, close enough to be mistaken for belonging there.`;
    if (entity.state === 'curious') return `${entity.name} tested a boundary around ${entity.attachment.label}, watching to see which rule you would defend.`;
    if (entity.state === 'observing') return `${entity.name} was glimpsed at a distance, still studying your routines.`;
    return null;
  }

  function tickEntities(character) {
    const system = ensureEntitySystem(character);
    const logs = [];
    const direction = window.getHorrorDirection ? window.getHorrorDirection(character) : { tier: 0, availableThisYear: true, permitsGenuineParanormal: true };
    if (system.entities.length < 8 && character.age - system.lastDiscoveryAge >= 2 && direction.availableThisYear && direction.permitsGenuineParanormal && Math.random() < (0.08 + direction.tier * 0.06)) {
      const preview = { id: `entity_discovery_${character.age}`, horror: true, text: 'A genuine entity crossed into your life and refused to leave.' };
      const permitted = window.selectAnnualAmbient ? window.selectAnnualAmbient(character, [preview]) : preview;
      if (permitted) {
        const entity = createEntity(character);
        system.lastDiscoveryAge = character.age;
        logs.push(`[NEW PRESENCE] ${entity.name}, a ${entity.typeName}, attached to ${entity.attachment.label}.`);
      }
    }
    const active = system.entities.filter(entity => entity.known && entity.state !== 'dormant');
    if (active.length && logs.length === 0 && direction.availableThisYear && Math.random() < Math.min(0.65, 0.2 + direction.tier * 0.1)) {
      const entity = pick(active);
      const message = yearlyEvent(character, entity);
      const preview = message ? { id: `${entity.id}_${character.age}`, horror: true, text: `An impossible entity persists. ${message}` } : null;
      const permitted = preview && window.selectAnnualAmbient ? window.selectAnnualAmbient(character, [preview]) : preview;
      if (message && permitted) {
        entity.lastEventAge = character.age; remember(entity, character, 'annual_event', message); logs.push(`[${entity.name}] ${message}`);
        if (entity.attachment.kind === 'npc' && ['hunting', 'hungry', 'offended'].includes(entity.state) && Math.random() < 0.22) {
          const mutation = mutateNpc(character, entity); if (mutation) logs.push(`[ALTERED] ${mutation}`);
        }
      }
    }
    return logs;
  }

  window.ENTITY_TYPES = TYPES;
  window.ensureEntitySystem = ensureEntitySystem;
  window.createEntity = createEntity;
  window.interactWithEntity = interaction;
  window.recordEntityEncounter = recordEncounter;
  window.applyEntityNpcChange = mutateNpc;
  window.tickEntities = tickEntities;
})();
