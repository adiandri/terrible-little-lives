// Audience reputation, NPC social ties, rumor credibility, and information spread.
(function () {
  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const AUDIENCES = ['family', 'school', 'workplace', 'public'];
  const AUDIENCE_LABELS = { family: 'Family', school: 'School', workplace: 'Workplace', public: 'Public' };
  const ICONS = { family: 'house', school: 'graduation-cap', workplace: 'briefcase', public: 'landmark' };

  function blankAudience() {
    return { esteem: 50, fear: 0, notoriety: 0 };
  }

  function ensureReputation(character) {
    if (!character.reputation || typeof character.reputation !== 'object') character.reputation = {};
    AUDIENCES.forEach(audience => {
      if (!character.reputation[audience]) character.reputation[audience] = blankAudience();
      const rep = character.reputation[audience];
      rep.esteem = clamp(rep.esteem ?? 50);
      rep.fear = clamp(rep.fear ?? 0);
      rep.notoriety = clamp(rep.notoriety ?? 0);
    });
    if (!Array.isArray(character.rumors)) character.rumors = [];
    if (!Array.isArray(character.reputationHistory)) character.reputationHistory = [];
    if (!character.socialNetwork || typeof character.socialNetwork !== 'object') character.socialNetwork = { ties: [] };
    if (!Array.isArray(character.socialNetwork.ties)) character.socialNetwork.ties = [];
    return character.reputation;
  }

  function audienceForPerson(person) {
    if (!person) return 'public';
    if (person.category === 'coworker') return 'workplace';
    if (['classmate', 'teacher', 'staff'].includes(person.category)) return 'school';
    if (person.category === 'friend') return person.origin && /school/i.test(person.origin) ? 'school' : 'public';
    if (/Mother|Father|Parent|Brother|Sister|Grand/.test(person.role || '')) return 'family';
    return 'public';
  }

  function allPeople(character) {
    const kin = character.kin || {};
    const education = character.education || {};
    const workplace = character.workplace || {};
    return [
      ...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || []),
      ...(education.classmates || []), ...(education.teachers || []), ...(education.staff || []),
      ...(workplace.colleagues || [])
    ].filter(person => person && person.alive !== false);
  }

  function nodeId(person) {
    if (!person.socialNodeId) person.socialNodeId = person.storyPersonId || person.id || `social_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    return person.socialNodeId;
  }

  function sameCircle(a, b) {
    if (audienceForPerson(a) === audienceForPerson(b)) return true;
    return a.category === 'friend' || b.category === 'friend';
  }

  function tieStrength(a, b) {
    let strength = sameCircle(a, b) ? 38 : 12;
    if (a.clique && a.clique === b.clique) strength += 28;
    if (a.category === b.category) strength += 12;
    if (/Mother|Father/.test(a.role || '') && /Mother|Father/.test(b.role || '')) strength += 30;
    if (/Brother|Sister/.test(a.role || '') && /Brother|Sister/.test(b.role || '')) strength += 22;
    return clamp(strength + Math.floor(Math.random() * 16));
  }

  function ensureSocialNetwork(character) {
    ensureReputation(character);
    const people = allPeople(character);
    const ties = character.socialNetwork.ties;
    people.forEach(nodeId);
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = people[i], b = people[j];
        if (!sameCircle(a, b) || Math.random() > 0.62) continue;
        const aId = nodeId(a), bId = nodeId(b);
        if (!ties.some(tie => (tie.a === aId && tie.b === bId) || (tie.a === bId && tie.b === aId))) {
          ties.push({ a: aId, b: bId, strength: tieStrength(a, b) });
        }
      }
    }
    if (ties.length > 160) ties.splice(0, ties.length - 160);
    return character.socialNetwork;
  }

  function getTie(character, first, second) {
    ensureSocialNetwork(character);
    const a = nodeId(first), b = nodeId(second);
    return character.socialNetwork.ties.find(tie => (tie.a === a && tie.b === b) || (tie.a === b && tie.b === a)) || { strength: 8 };
  }

  function credibilityOf(person) {
    const personality = window.ensureNpcPersonality ? window.ensureNpcPersonality(person) : (person.personality || {});
    return clamp((person.credibility ?? 40) * 0.35 + (personality.composure || 40) * 0.35 + (personality.socialPower || person.popularity || 35) * 0.2 + (person.smarts || 40) * 0.1);
  }

  function reputationState(rep) {
    if (rep.fear >= 60 && rep.esteem >= 45) return 'formidable';
    if (rep.fear >= 60) return 'feared';
    if (rep.esteem >= 72 && rep.notoriety < 55) return 'beloved';
    if (rep.esteem <= 25 && rep.notoriety >= 35) return 'disgraced';
    if (rep.notoriety >= 60) return 'notorious';
    if (rep.esteem >= 60) return 'respected';
    if (rep.esteem <= 35) return 'disliked';
    return 'ordinary';
  }

  function alterReputation(character, audience, changes, reason) {
    const reputations = ensureReputation(character);
    const targets = audience === 'all' ? AUDIENCES : [AUDIENCES.includes(audience) ? audience : 'public'];
    targets.forEach(target => {
      const rep = reputations[target];
      rep.esteem = clamp(rep.esteem + (changes.esteem || 0));
      rep.fear = clamp(rep.fear + (changes.fear || 0));
      rep.notoriety = clamp(rep.notoriety + (changes.notoriety || 0));
      character.reputationHistory.unshift({ audience: target, age: character.age, reason, changes: { ...changes }, state: reputationState(rep) });
    });
    if (character.reputationHistory.length > 30) character.reputationHistory.length = 30;
  }

  function witnessDecision(character, witness, instigator) {
    const tie = getTie(character, witness, instigator).strength;
    const witnessMind = window.ensureNpcMemory ? window.ensureNpcMemory(witness) : { trust: 40, resentment: 0, fear: 0 };
    const playerBond = (witness.relationship || 50) + witnessMind.trust * 0.35 - witnessMind.resentment * 0.45;
    const instigatorPull = tie + (instigator.popularity || 35) * 0.25 + (instigator.personality?.socialPower || 30) * 0.2;
    const empathy = witness.personality?.empathy || 40;
    if (playerBond + empathy * 0.3 > instigatorPull + 28) return 'player';
    if (instigatorPull > playerBond + 18) return 'instigator';
    return 'uncertain';
  }

  function createRumor(character, data) {
    ensureSocialNetwork(character);
    const source = data.source;
    const witnesses = (data.witnesses || []).filter(Boolean);
    const evidence = clamp(data.evidence || 0);
    const sourceCred = source ? credibilityOf(source) : 35;
    const witnessCred = witnesses.length ? witnesses.reduce((sum, person) => sum + credibilityOf(person), 0) / witnesses.length : 0;
    const loyalDefenders = window.getActiveBenefits ? window.getActiveBenefits(character, 'loyalty').length : 0;
    const credibility = clamp(sourceCred * 0.45 + witnessCred * 0.35 + evidence * 0.5 + witnesses.length * 5 - loyalDefenders * 8);
    const rumor = {
      id: `rumor_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      claim: data.claim, audience: data.audience || audienceForPerson(source), valence: data.valence || 'negative',
      severity: data.severity || 1, credibility, evidence, sourceId: source ? nodeId(source) : null,
      sourceName: source?.name || 'Unknown source', witnessIds: witnesses.map(nodeId),
      believers: [], doubters: [], heardBy: source ? [nodeId(source)] : [],
      originAge: character.age, yearsRemaining: Math.max(2, (data.severity || 1) + 1), active: true
    };
    witnesses.forEach(witness => {
      const side = source ? witnessDecision(character, witness, source) : 'uncertain';
      const id = nodeId(witness);
      rumor.heardBy.push(id);
      if (side === 'instigator' || (side === 'uncertain' && credibility >= 55)) rumor.believers.push(id);
      else rumor.doubters.push(id);
    });
    character.rumors.unshift(rumor);
    if (character.rumors.length > 16) character.rumors.length = 16;
    const beliefRatio = witnesses.length ? rumor.believers.length / witnesses.length : credibility / 100;
    if (beliefRatio >= 0.5 || credibility >= 65) {
      const scale = Math.max(1, Math.round(rumor.severity * (0.5 + credibility / 100)));
      alterReputation(character, rumor.audience, rumor.valence === 'positive'
        ? { esteem: scale * 3, notoriety: scale }
        : { esteem: -scale * 3, fear: data.fear || 0, notoriety: scale * 2 }, rumor.claim);
    }
    return rumor;
  }

  function recordReactionReputation(character, person, reaction, witnesses) {
    if (!character || !person || !reaction) return null;
    const audience = audienceForPerson(person);
    const severity = ['attack', 'sabotage', 'humiliation', 'reported'].includes(reaction.type) ? 3 : 2;
    if (reaction.type === 'attack') alterReputation(character, audience, { fear: 8, esteem: -4, notoriety: 6 }, `Violent conflict with ${person.name}`);
    const rumor = createRumor(character, {
      source: person, witnesses, audience, severity,
      evidence: reaction.type === 'reported' ? 75 : (reaction.type === 'attack' ? 60 : 30),
      fear: reaction.type === 'attack' ? 5 : 0,
      claim: `${person.name} says you provoked the ${reaction.type.replaceAll('_', ' ')} that followed your conflict.`
    });
    return rumor;
  }

  function recordNpcInteractionReputation(character, person, tone, severity, action) {
    if (!character || !person || tone === 'neutral' || tone === 'repair') return;
    const audience = audienceForPerson(person);
    if (tone === 'positive') {
      alterReputation(character, audience, { esteem: 1, notoriety: 0 }, `Treated ${person.name} well`);
    } else {
      const threatening = ['argue', 'insult', 'prank', 'bribe'].includes(action);
      alterReputation(character, audience, { esteem: -Math.max(1, severity), fear: threatening ? severity : 0, notoriety: severity > 1 ? 1 : 0 }, `Mistreated ${person.name}`);
    }
  }

  function spreadRumor(character, rumor) {
    const people = allPeople(character);
    const candidates = people.filter(person => !rumor.heardBy.includes(nodeId(person)));
    if (!candidates.length) return null;
    const informed = people.filter(person => rumor.heardBy.includes(nodeId(person)));
    let best = null;
    informed.forEach(sender => candidates.forEach(receiver => {
      const tie = getTie(character, sender, receiver).strength;
      if (!best || tie > best.tie) best = { sender, receiver, tie };
    }));
    if (!best || best.tie < 15 || Math.random() * 100 > best.tie + rumor.credibility * 0.35) return null;
    const receiverId = nodeId(best.receiver);
    rumor.heardBy.push(receiverId);
    const source = people.find(person => nodeId(person) === rumor.sourceId) || best.sender;
    const side = witnessDecision(character, best.receiver, source);
    const believes = side === 'instigator' || (side === 'uncertain' && Math.random() * 100 < rumor.credibility);
    (believes ? rumor.believers : rumor.doubters).push(receiverId);
    if (believes) {
      alterReputation(character, audienceForPerson(best.receiver), rumor.valence === 'positive'
        ? { esteem: rumor.severity, notoriety: 1 }
        : { esteem: -rumor.severity, fear: 0, notoriety: rumor.severity }, rumor.claim);
    }
    return `${best.sender.name} told ${best.receiver.name} about “${rumor.claim}” ${best.receiver.name} ${believes ? 'believed the account' : 'doubted the story'} because of their existing loyalties.`;
  }

  function ensureWorkplace(character) {
    if (!character.job) return;
    if (!character.workplace || character.workplace.jobId !== character.job.id) {
      const names = ['Morgan Pike', 'Iris Bell', 'Jonah Voss', 'Clara Finch', 'Rowan Hale'];
      character.workplace = {
        jobId: character.job.id,
        colleagues: names.slice(0, 3).map((name, index) => ({
          id: `coworker_${character.job.id}_${index}`, category: 'coworker', role: index === 0 ? 'Supervisor' : 'Coworker',
          name, age: Math.max(20, character.age + index * 4), alive: true,
          relationship: 42 + Math.floor(Math.random() * 20), credibility: 45 + Math.floor(Math.random() * 35)
        }))
      };
    }
    ensureSocialNetwork(character);
  }

  function tickSocialNetwork(character) {
    const logs = [];
    ensureWorkplace(character);
    ensureSocialNetwork(character);
    character.rumors.filter(rumor => rumor.active).forEach(rumor => {
      const spread = spreadRumor(character, rumor);
      if (spread) logs.push(spread);
      rumor.yearsRemaining -= 1;
      if (rumor.yearsRemaining <= 0) rumor.active = false;
    });
    AUDIENCES.forEach(audience => {
      const rep = character.reputation[audience];
      rep.notoriety = clamp(rep.notoriety - 1);
      rep.fear = clamp(rep.fear - 1);
    });
    const states = AUDIENCES.map(audience => ({ audience, rep: character.reputation[audience], state: reputationState(character.reputation[audience]) }));
    const opportunity = states.find(item => ['beloved', 'feared', 'disgraced', 'formidable'].includes(item.state));
    if (opportunity) {
      if (opportunity.state === 'beloved') {
        character.money = (character.money || 0) + 75;
        logs.push(`Your beloved standing among ${AUDIENCE_LABELS[opportunity.audience].toLowerCase()} contacts brought a trusted referral and $75 opportunity.`);
      } else if (opportunity.state === 'feared' || opportunity.state === 'formidable') {
        character.shillings = (character.shillings || 0) + 2;
        logs.push(`Your ${opportunity.state} reputation drew a discreet offer no respectable person would receive (+2 Shillings).`);
      } else {
        character.stats.happiness = clamp((character.stats.happiness || 50) - 2);
        logs.push(`Your disgraced ${AUDIENCE_LABELS[opportunity.audience].toLowerCase()} reputation closed an invitation before it reached you (-2% Happiness).`);
      }
    }
    return logs.slice(0, 4);
  }

  function recordActivityReputation(character, activity, result) {
    if (!activity || !result?.success) return [];
    const notes = [];
    if (activity.id === 'work_socialize_colleagues' && character.job) {
      ensureWorkplace(character);
      alterReputation(character, 'workplace', { esteem: 3, notoriety: 1 }, 'Built goodwill with coworkers');
      notes.push('Coworkers now regard you more warmly (+3 Workplace Esteem).');
      if (character.reputation.workplace.esteem >= 65 && window.addBenefit && !window.hasRecommendation?.(character)) {
        const supervisor = character.workplace.colleagues.find(person => person.role === 'Supervisor') || character.workplace.colleagues[0];
        window.addBenefit(character, { type: 'recommendation', label: `Recommendation from ${supervisor.name}`, detail: 'A professional endorsement can overcome damaged workplace standing.', source: supervisor.name, domain: 'work', yearsRemaining: 3 });
        notes.push(`${supervisor.name} offered a professional recommendation.`);
      }
    } else if (['heart_to_heart_talk', 'group_hangout'].includes(activity.id)) {
      alterReputation(character, 'public', { esteem: 2, notoriety: -1 }, 'Made a visible effort to repair social trust');
      notes.push('Visible repair improved your Public Esteem slightly.');
    } else if (activity.category === 'crime') {
      alterReputation(character, 'public', { fear: 3, esteem: -2, notoriety: 4 }, result.title);
    }
    return notes;
  }

  function getSocialOpportunityRestriction(character, activity) {
    if (!activity) return null;
    if (activity.id === 'work_socialize_colleagues' && !character.job) return 'You need a workplace before you can socialize with coworkers.';
    const publicState = getReputationState(character, 'public');
    if (publicState === 'disgraced' && ['find_friend', 'group_hangout'].includes(activity.id)) {
      return 'Your disgraced public reputation has closed this social opportunity until your standing improves.';
    }
    return null;
  }

  function reputationHtml(character) {
    const reputation = ensureReputation(character);
    return AUDIENCES.map(audience => {
      const rep = reputation[audience];
      const state = reputationState(rep);
      return `<div class="rounded-xl border border-leadborder bg-inputbg p-3"><div class="flex items-center justify-between gap-2"><span class="flex items-center gap-2 text-xs font-serif font-bold text-parchment"><i data-lucide="${ICONS[audience]}" class="w-3.5 h-3.5 text-amber-400"></i>${AUDIENCE_LABELS[audience]}</span><span class="text-[9px] font-mono uppercase text-amber-300">${state}</span></div><div class="grid grid-cols-3 gap-2 mt-2 text-center"><div><div class="text-[8px] font-mono text-dust uppercase">Esteem</div><strong class="text-[10px] text-emerald-300">${rep.esteem}%</strong></div><div><div class="text-[8px] font-mono text-dust uppercase">Fear</div><strong class="text-[10px] text-rose-300">${rep.fear}%</strong></div><div><div class="text-[8px] font-mono text-dust uppercase">Known</div><strong class="text-[10px] text-sky-300">${rep.notoriety}%</strong></div></div></div>`;
    }).join('');
  }

  function rumorHtml(character) {
    ensureReputation(character);
    const active = character.rumors.filter(rumor => rumor.active).slice(0, 5);
    if (!active.length) return '<p class="text-xs text-dust/70 italic">No active rumors are moving through your circles.</p>';
    return active.map(rumor => `<div class="rounded-xl border border-leadborder bg-inputbg p-3"><div class="flex justify-between gap-2"><strong class="text-[10px] text-parchment">${rumor.claim}</strong><span class="text-[8px] font-mono text-amber-400">${rumor.credibility}% credible</span></div><p class="text-[9px] text-dust mt-1">${rumor.believers.length} believed · ${rumor.doubters.length} doubted · reached ${rumor.heardBy.length} people</p></div>`).join('');
  }

  function getReputationState(character, audience) {
    return reputationState(ensureReputation(character)[audience] || blankAudience());
  }

  window.ensureReputation = ensureReputation;
  window.ensureSocialNetwork = ensureSocialNetwork;
  window.audienceForPerson = audienceForPerson;
  window.witnessDecision = witnessDecision;
  window.createRumor = createRumor;
  window.recordReactionReputation = recordReactionReputation;
  window.recordNpcInteractionReputation = recordNpcInteractionReputation;
  window.alterReputation = alterReputation;
  window.tickSocialNetwork = tickSocialNetwork;
  window.ensureWorkplace = ensureWorkplace;
  window.recordActivityReputation = recordActivityReputation;
  window.getSocialOpportunityRestriction = getSocialOpportunityRestriction;
  window.reputationHtml = reputationHtml;
  window.rumorHtml = rumorHtml;
  window.getReputationState = getReputationState;
})();
