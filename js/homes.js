// Homes, property history, and room-level hauntings for Terrible Little Lives.
(function () {
  'use strict';

  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const pick = list => list[Math.floor(Math.random() * list.length)];

  const PROPERTY_TYPES = {
    family_flat: { label: 'Family Flat', tenure: 'family', value: 0, annualCost: 0, rooms: ['Nursery', 'Kitchen', 'Hallway', 'Parents’ Room'], condition: 62, warding: 4 },
    rented_room: { label: 'Rented Room', tenure: 'rent', value: 0, annualCost: 3600, rooms: ['Bedroom', 'Shared Kitchen', 'Landing'], condition: 58, warding: 2 },
    studio: { label: 'Municipal Studio', tenure: 'rent', value: 0, annualCost: 7200, rooms: ['Main Room', 'Kitchenette', 'Bathroom', 'Utility Cupboard'], condition: 68, warding: 5 },
    terrace: { label: 'Narrow Terrace House', tenure: 'owned', value: 48000, annualCost: 1200, rooms: ['Front Room', 'Kitchen', 'Main Bedroom', 'Spare Bedroom', 'Cellar'], condition: 72, warding: 8 },
    inherited_house: { label: 'Inherited House', tenure: 'owned', value: 12000, annualCost: 1800, rooms: ['Parlor', 'Kitchen', 'Main Bedroom', 'Locked Bedroom', 'Attic', 'Cellar'], condition: 46, warding: 1 },
    country_house: { label: 'Remote Country House', tenure: 'owned', value: 125000, annualCost: 3600, rooms: ['Drawing Room', 'Kitchen', 'Main Bedroom', 'Guest Room', 'Attic', 'Cellar', 'Garden'], condition: 65, warding: 12 }
  };

  const MANIFESTATIONS = [
    'Footsteps cross the room after every living person has gone to bed.',
    'A patch of wall remains wet in every season and smells faintly of soil.',
    'Objects return to the same wrong position each morning.',
    'The room appears one pace longer when entered in darkness.',
    'A voice behind the door uses the name of whoever is listening.',
    'Photographs taken here include a doorway that the house does not possess.'
  ];

  function residenceFrom(type, character, overrides = {}) {
    const template = PROPERTY_TYPES[type] || PROPERTY_TYPES.rented_room;
    const sequence = character.housing?.sequence || 1;
    return {
      id: `residence_${sequence}`,
      type,
      label: template.label,
      tenure: template.tenure,
      city: character.city,
      acquiredAge: character.age,
      value: template.value,
      annualCost: template.annualCost,
      condition: template.condition,
      warding: template.warding,
      rooms: template.rooms.map((name, index) => ({ id: `room_${sequence}_${index}`, name, investigated: false, sealed: false })),
      hauntings: [],
      incidents: [],
      ...overrides
    };
  }

  function ensureHousing(character) {
    if (!character.housing || typeof character.housing !== 'object') {
      character.housing = { sequence: 1, residences: [], formerResidences: [], lastTickAge: character.age, offers: [] };
    }
    const system = character.housing;
    if (!Array.isArray(system.residences)) system.residences = [];
    if (!Array.isArray(system.formerResidences)) system.formerResidences = [];
    if (!Array.isArray(system.offers)) system.offers = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!system.current) {
      const type = character.age < 18 ? 'family_flat' : 'rented_room';
      system.current = residenceFrom(type, character);
      system.sequence += 1;
      system.residences.push(system.current);
    }
    if (!Array.isArray(system.current.rooms)) system.current.rooms = [];
    if (!Array.isArray(system.current.hauntings)) system.current.hauntings = [];
    if (!Array.isArray(system.current.incidents)) system.current.incidents = [];
    const template = PROPERTY_TYPES[system.current.type] || PROPERTY_TYPES.rented_room;
    if (!Number.isFinite(system.current.condition)) system.current.condition = template.condition;
    if (!Number.isFinite(system.current.warding)) system.current.warding = template.warding;
    if (!Number.isFinite(system.current.annualCost)) system.current.annualCost = template.annualCost;
    if (!system.current.label) system.current.label = template.label;
    if (!system.current.tenure) system.current.tenure = template.tenure;
    if (!system.current.rooms.length) system.current.rooms = template.rooms.map((name, index) => ({ id: `room_${system.sequence}_${index}`, name, investigated: false, sealed: false }));
    return system;
  }

  function hauntingScore(character, home) {
    const director = character.horrorDirector || {};
    const entities = character.entitySystem?.entities || [];
    const curseSource = character.activeCurses || character.curses || [];
    const curseCount = Array.isArray(curseSource) ? curseSource.length : Object.keys(curseSource || {}).length;
    return clamp((director.contamination || 0) * 0.45 + (director.exposure || 0) * 0.2 + entities.length * 7 + curseCount * 9 + (100 - home.condition) * 0.18 - home.warding * 0.35);
  }

  function createHaunting(character, roomId, intensity = 1) {
    const system = ensureHousing(character);
    const home = system.current;
    const room = home.rooms.find(item => item.id === roomId) || pick(home.rooms);
    const existing = home.hauntings.find(item => item.roomId === room.id && item.active);
    if (existing) {
      existing.severity = Math.min(5, existing.severity + 1);
      existing.manifestation = pick(MANIFESTATIONS);
      return existing;
    }
    const entities = (character.entitySystem?.entities || []).filter(item => item.active !== false);
    const entity = entities.length && Math.random() < 0.55 ? pick(entities) : null;
    const haunting = {
      id: `haunting_${system.sequence++}`,
      roomId: room.id,
      roomName: room.name,
      sinceAge: character.age,
      severity: Math.max(1, Math.min(5, intensity)),
      manifestation: pick(MANIFESTATIONS),
      entityId: entity?.id || null,
      entityName: entity?.name || null,
      known: false,
      active: true,
      suppressedUntil: -1
    };
    home.hauntings.push(haunting);
    return haunting;
  }

  function inspectRoom(character, roomId) {
    const home = ensureHousing(character).current;
    const room = home.rooms.find(item => item.id === roomId);
    if (!room) return { success: false, reason: 'That room is absent from the current floor plan.' };
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'Inspecting a room requires 1 Energy.' };
    character.actionsLeft -= 1;
    room.investigated = true;
    const haunting = home.hauntings.find(item => item.roomId === room.id && item.active && item.suppressedUntil < character.age);
    if (haunting) {
      haunting.known = true;
      character.stats.occult = clamp((character.stats.occult || 0) + Math.max(1, haunting.severity));
      character.stats.sanity = clamp((character.stats.sanity || 0) - Math.min(3, haunting.severity));
      if (window.observeHorror) window.observeHorror(character, { source: 'haunted_home', title: `${home.label}: ${room.name}`, text: haunting.manifestation, genuine: true, intensity: haunting.severity, investigated: true, engaged: true });
      if (window.recordInvestigativeIncident) window.recordInvestigativeIncident(character, { source: 'haunted_home', title: `${room.name} manifestation`, text: haunting.manifestation }, 'genuine_paranormal');
      return { success: true, title: 'The Room Answered', message: `${room.name}: ${haunting.manifestation}`, effects: { occult: haunting.severity, sanity: -Math.min(3, haunting.severity) } };
    }
    const found = Math.random() < hauntingScore(character, home) / 140;
    if (found) {
      const newHaunting = createHaunting(character, room.id, 1);
      newHaunting.known = true;
      if (window.observeHorror) window.observeHorror(character, { source: 'haunted_home', title: `${home.label}: ${room.name}`, text: newHaunting.manifestation, genuine: true, intensity: 1, investigated: true, engaged: true });
      return { success: true, title: 'A Domestic Irregularity', message: `${room.name}: ${newHaunting.manifestation}`, effects: { occult: 1, sanity: -1 } };
    }
    home.condition = clamp(home.condition + 1);
    return { success: true, title: 'Nothing Confessed', message: `You inspected ${room.name}. You found ordinary dust, aging fixtures, and no proof that the unease belongs to anything supernatural.`, effects: { condition: 1 } };
  }

  function repairHome(character) {
    const home = ensureHousing(character).current;
    const missing = 100 - home.condition;
    if (missing <= 0) return { success: false, reason: 'The residence is already in excellent repair.' };
    const cost = Math.max(40, Math.round(Math.min(25, missing) * 18));
    if ((character.money || 0) < cost) return { success: false, reason: `Repairs require ${money(cost, character)}.` };
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'Supervising repairs requires 1 Energy.' };
    character.money -= cost;
    character.actionsLeft -= 1;
    const restored = Math.min(25, missing);
    home.condition = clamp(home.condition + restored);
    return { success: true, title: 'Repairs Completed', message: `Contractors repaired damp, locks, wiring, and structural wear for ${money(cost, character)}. Some scratches were beneath the new plaster by morning.`, effects: { money: -cost, condition: restored } };
  }

  function wardRoom(character, roomId) {
    const home = ensureHousing(character).current;
    const room = home.rooms.find(item => item.id === roomId);
    if (!room) return { success: false, reason: 'That room no longer exists.' };
    if ((character.shillings || 0) < 6) return { success: false, reason: 'The ward requires 6 Paranormal Shillings.' };
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'Preparing the ward requires 1 Energy.' };
    character.shillings -= 6;
    character.actionsLeft -= 1;
    room.sealed = true;
    home.warding = clamp(home.warding + 14);
    const haunting = home.hauntings.find(item => item.roomId === roomId && item.active);
    if (haunting) haunting.suppressedUntil = character.age + 2;
    return { success: true, title: 'Threshold Sealed', message: `You marked ${room.name} with salt, iron, and a paid name. Whatever occupies it has been suppressed—not removed.`, effects: { shillings: -6, warding: 14 } };
  }

  function moveEligibility(character, type) {
    const template = PROPERTY_TYPES[type];
    if (!template || type === 'family_flat') return { allowed: false, reason: 'That residence is unavailable.', upfront: 0, balance: Number(character.money) || 0 };
    const upfront = template.tenure === 'owned' ? template.value : Math.round(template.annualCost / 3);
    const balance = Number(character.money);
    if (!Number.isFinite(balance)) return { allowed: false, reason: 'Your recorded balance is invalid. Save and resume the life to repair it.', upfront, balance: 0 };
    if (character.age < 18) return { allowed: false, reason: `Independent housing unlocks at age 18. You are currently age ${character.age}.`, upfront, balance };
    if (balance < upfront) return { allowed: false, reason: `Moving requires ${money(upfront, character)} upfront; your balance is ${money(balance, character)}.`, upfront, balance };
    return { allowed: true, reason: '', upfront, balance };
  }

  function moveHome(character, type) {
    const system = ensureHousing(character);
    const template = PROPERTY_TYPES[type];
    const eligibility = moveEligibility(character, type);
    if (!eligibility.allowed) return { success: false, reason: eligibility.reason };
    const upfront = eligibility.upfront;
    character.money = eligibility.balance - upfront;
    const old = system.current;
    old.leftAge = character.age;
    old.active = false;
    system.formerResidences.unshift(old);
    const next = residenceFrom(type, character);
    system.sequence += 1;
    system.current = next;
    system.residences.push(next);
    if (type === 'inherited_house') createHaunting(character, pick(next.rooms).id, 2);
    if (window.ensureEntitySystem) window.ensureEntitySystem(character);
    return { success: true, title: 'Address Changed', message: `You left ${old.label} and moved into ${next.label} in ${character.city}. The keys cost ${money(upfront, character)}. The property history did not come with them.`, effects: { money: -upfront } };
  }

  function tickHousing(character) {
    const system = ensureHousing(character);
    const home = system.current;
    if (system.lastTickAge === character.age) return [];
    system.lastTickAge = character.age;
    const logs = [];

    if (character.age === 18 && home.tenure === 'family') logs.push('You may now leave the family home and establish an independent household.');
    const deterioration = 1 + Math.floor(Math.random() * 3) + home.hauntings.filter(item => item.active).length;
    home.condition = clamp(home.condition - deterioration);

    if (home.annualCost > 0) {
      if ((character.money || 0) >= home.annualCost) {
        character.money -= home.annualCost;
        logs.push(`${money(home.annualCost, character)} paid in ${home.tenure === 'rent' ? 'rent' : 'property costs'} for ${home.label}.`);
      } else {
        home.condition = clamp(home.condition - 10);
        if (window.addConsequence) window.addConsequence(character, { type: 'financial', label: 'Housing Arrears', detail: `Unable to meet the annual costs of ${home.label}.`, source: home.label, severity: 2, yearsRemaining: 2 });
        logs.push(`Housing costs went unpaid. A final notice was pushed beneath the door of ${home.label}.`);
      }
    }

    const score = hauntingScore(character, home);
    if (home.rooms.length && Math.random() < score / 180) {
      const haunting = createHaunting(character, pick(home.rooms).id, score > 70 ? 3 : score > 40 ? 2 : 1);
      logs.push(`A new pattern settled into ${haunting.roomName}. Nobody agreed on when it began.`);
    }

    home.hauntings.filter(item => item.active && item.suppressedUntil < character.age).forEach(haunting => {
      if (Math.random() < 0.28 + haunting.severity * 0.08) {
        haunting.severity = Math.min(5, haunting.severity + (Math.random() < 0.35 ? 1 : 0));
        character.stats.sanity = clamp((character.stats.sanity || 0) - Math.min(3, haunting.severity));
        const incident = { age: character.age, roomName: haunting.roomName, detail: haunting.manifestation, severity: haunting.severity };
        home.incidents.unshift(incident);
        logs.push(`${haunting.roomName}: ${haunting.manifestation}`);
        if (window.observeHorror) window.observeHorror(character, { source: 'haunted_home_tick', title: home.label, text: haunting.manifestation, genuine: true, intensity: haunting.severity, engaged: false });
      }
    });

    if (home.condition < 25 && window.addConsequence) window.addConsequence(character, { type: 'injury', label: 'Unsafe Residence', detail: `${home.label} is structurally unsafe and harmful to its occupants.`, source: home.label, severity: 2, yearsRemaining: 1 });
    return logs;
  }

  function money(amount, character) { return window.formatMoney ? window.formatMoney(amount, character.countryCode) : `$${amount}`; }

  window.HOME_PROPERTY_TYPES = PROPERTY_TYPES;
  window.ensureHousing = ensureHousing;
  window.createHomeHaunting = createHaunting;
  window.inspectHomeRoom = inspectRoom;
  window.repairCurrentHome = repairHome;
  window.wardHomeRoom = wardRoom;
  window.getHomeMoveEligibility = moveEligibility;
  window.moveHome = moveHome;
  window.tickHousing = tickHousing;
  window.getHomeHauntingScore = hauntingScore;
})();
