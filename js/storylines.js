// Delayed consequences and short NPC story chains.
(function () {
  const clamp = value => Math.max(0, Math.min(100, Number(value) || 0));
  const harmfulLabels = {
    insult: 'deliberately insulted them', argue: 'started a bitter argument', prank: 'made them the target of a prank',
    gossip: 'spread gossip about them', complain: 'publicly challenged them', bribe: 'attempted to bribe them'
  };

  function ensureStoryLedger(character) {
    if (!character.storyLedger || typeof character.storyLedger !== 'object') {
      character.storyLedger = { pending: [], history: [] };
    }
    if (!Array.isArray(character.storyLedger.pending)) character.storyLedger.pending = [];
    if (!Array.isArray(character.storyLedger.history)) character.storyLedger.history = [];
    return character.storyLedger;
  }

  function allPeople(character) {
    const kin = character.kin || {};
    const education = character.education || {};
    return [
      ...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || []),
      ...(education.classmates || []), ...(education.teachers || []), ...(education.staff || [])
    ];
  }

  function findPerson(character, incident) {
    return allPeople(character).find(person => person.storyPersonId === incident.personId) ||
      allPeople(character).find(person => person.name === incident.personName) || null;
  }

  function personId(person) {
    if (!person.storyPersonId) person.storyPersonId = `npc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    return person.storyPersonId;
  }

  function hasOpenStory(ledger, id, kind) {
    return ledger.pending.some(item => item.personId === id && item.kind === kind && item.status !== 'resolved');
  }

  function scheduleNpcAftermath(character, person, reaction, action, severity) {
    if (!character || !person || !reaction) return null;
    const odds = { attack: 1, reported: 1, friendship_loss: 1, humiliation: 1, exclusion: 0.9, sabotage: 1, blocked: 0.7, confrontation: 0.7, insult_back: 0.35 };
    if (Math.random() > (odds[reaction.type] || 0)) return null;
    const ledger = ensureStoryLedger(character);
    const id = personId(person);
    if (hasOpenStory(ledger, id, 'grudge')) return null;
    const incident = {
      id: `story_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      kind: 'grudge', status: 'pending', stage: 1,
      personId: id, personName: person.name, personRole: person.role || person.category || 'acquaintance',
      triggerAction: action, triggerReaction: reaction.type, severity: Math.max(1, severity || 1),
      originAge: character.age, originYear: character.year,
      originSummary: `At age ${character.age}, you ${harmfulLabels[action] || 'treated them badly'}, and ${reaction.text.split('\n')[0]}`,
      dueAge: character.age + (reaction.type === 'attack' || reaction.type === 'sabotage' ? 1 : 1 + Math.floor(Math.random() * 2))
    };
    ledger.pending.push(incident);
    if (ledger.pending.length > 12) ledger.pending.shift();
    return incident;
  }

  function considerLoyaltyStory(character, person) {
    if (!character || !person) return null;
    const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : null;
    if (!mind) return null;
    mind.positiveInteractions = (mind.positiveInteractions || 0) + 1;
    if (mind.positiveInteractions < 4 || mind.trust < 65 || mind.resentment >= 12 || (person.relationship || 0) < 60) return null;
    if (Number.isFinite(mind.lastLoyaltyStoryAge) && character.age - mind.lastLoyaltyStoryAge < 4) return null;
    const ledger = ensureStoryLedger(character);
    const id = personId(person);
    if (hasOpenStory(ledger, id, 'loyalty')) return null;
    mind.lastLoyaltyStoryAge = character.age;
    const incident = {
      id: `story_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      kind: 'loyalty', status: 'pending', stage: 1,
      personId: id, personName: person.name, personRole: person.role || person.category || 'friend',
      originAge: character.age, originYear: character.year,
      originSummary: `By age ${character.age}, repeated kindness had made ${person.name} genuinely trust you.`,
      dueAge: character.age + 1
    };
    ledger.pending.push(incident);
    return incident;
  }

  function grudgeOpening(incident) {
    const returns = {
      attack: `${incident.personName} has kept evidence from the fight and is now telling a version that makes you look like the sole aggressor.`,
      reported: `${incident.personName}'s old report has resurfaced during a new review of your record.`,
      friendship_loss: `${incident.personName} has begun telling mutual friends why the friendship ended.`,
      humiliation: `The humiliation ${incident.personName} started has returned as screenshots and recycled gossip.`,
      exclusion: `${incident.personName}'s old warning about you has reached a new social circle.`,
      sabotage: `Someone discovers that ${incident.personName}'s old sabotage was connected to your conflict—but the evidence could implicate you too.`,
      blocked: `${incident.personName} contacts you after years of silence, but only to demand an accounting.`,
      confrontation: `${incident.personName} approaches you again, still furious about the confrontation.`,
      insult_back: `${incident.personName} repeats the old insult in front of people whose opinion now matters.`
    };
    return `${incident.originSummary}\n\n${returns[incident.triggerReaction] || `${incident.personName} has found a way to make the old grievance matter again.`}`;
  }

  function buildGrudgeDilemma(incident) {
    if (incident.stage === 1) return {
      id: `${incident.id}_stage_1`, storyIncidentId: incident.id,
      title: `OLD GRUDGE — ${incident.personName}`,
      prompt: grudgeOpening(incident),
      choices: [
        { text: 'Own what happened and ask to repair the damage.', outcome: `You acknowledged the original incident instead of pretending it vanished. ${incident.personName} agreed to one difficult follow-up conversation.`, effects: { humanity: 2, happiness: -1 }, storyBranch: 'repair' },
        { text: 'Collect evidence and challenge their version publicly.', outcome: `You disputed ${incident.personName}'s account. The conflict is now public, and both versions will be examined.`, effects: { smarts: 2, sanity: -2 }, storyBranch: 'contest' },
        { text: 'Retaliate before they can hurt you again.', outcome: `You struck first against ${incident.personName}. The old grievance became an active feud.`, effects: { humanity: -4, sanity: -2 }, storyBranch: 'escalate' }
      ]
    };
    const branches = {
      repair: {
        prompt: `${incident.personName} arrives for the promised conversation carrying their own record of what happened. Repair now requires a real cost, not a pleasant sentence.`,
        choices: [
          { text: 'Accept their terms and make restitution.', outcome: `You made concrete restitution to ${incident.personName}. Trust did not return, but the revenge cycle ended.`, effects: { money: -120, humanity: 3 }, storyFinal: 'repaired' },
          { text: 'Refuse the cost and withdraw the apology.', outcome: `${incident.personName} recognized the apology as empty. The grudge hardened into permanent estrangement.`, effects: { humanity: -3, happiness: -2 }, storyFinal: 'estranged' }
        ]
      },
      contest: {
        prompt: `The evidence review begins. One witness supports you; another produces a message showing how the conflict originally started.`,
        choices: [
          { text: 'Release everything, including what makes you look guilty.', outcome: `The full record cleared the worst accusation but preserved your own wrongdoing in public history.`, effects: { humanity: 3, happiness: -2 }, storyFinal: 'truth' },
          { text: 'Hide the damaging evidence.', outcome: `You suppressed part of the record. ${incident.personName} cannot prove it yet, but now has a fresh reason to pursue you.`, effects: { humanity: -4, sanity: -3 }, storyFinal: 'covered_up' }
        ]
      },
      escalate: {
        prompt: `${incident.personName} answers your retaliation. People around you are being pressured to choose sides.`,
        choices: [
          { text: 'End the feud before someone is seriously harmed.', outcome: `You stopped escalating. The feud ended without forgiveness, leaving lasting social damage.`, effects: { humanity: 2, happiness: -3 }, storyFinal: 'cold_peace' },
          { text: 'Push until they are completely isolated.', outcome: `You won the feud by destroying ${incident.personName}'s standing. The victory followed you as a cruel reputation.`, effects: { humanity: -7, sanity: -2 }, storyFinal: 'ruin' }
        ]
      }
    };
    const branch = branches[incident.branch] || branches.escalate;
    return { id: `${incident.id}_stage_2`, storyIncidentId: incident.id, title: `RECKONING — ${incident.personName}`, prompt: `${incident.originSummary}\n\n${branch.prompt}`, choices: branch.choices };
  }

  function buildLoyaltyDilemma(incident) {
    if (incident.stage === 1) return {
      id: `${incident.id}_stage_1`, storyIncidentId: incident.id,
      title: `A DEBT OF LOYALTY — ${incident.personName}`,
      prompt: `${incident.originSummary}\n\n${incident.personName} learns that trouble is approaching and offers help before you ask. Accepting will place them inside the problem with you.`,
      choices: [
        { text: 'Trust them with the whole truth.', outcome: `${incident.personName} chose to stand beside you after hearing everything. Their loyalty will soon be tested.`, effects: { sanity: 3 }, storyBranch: 'accept' },
        { text: 'Protect them by refusing the help.', outcome: `You kept ${incident.personName} outside the danger. They respected the choice, though the distance hurt.`, effects: { humanity: 2, happiness: -1 }, storyFinal: 'protected' }
      ]
    };
    return {
      id: `${incident.id}_stage_2`, storyIncidentId: incident.id,
      title: `LOYALTY TESTED — ${incident.personName}`,
      prompt: `${incident.originSummary}\n\nThe danger arrives. ${incident.personName} can shield you from its worst consequence, but doing so will cost them money and reputation.`,
      choices: [
        { text: 'Let them help and promise to repay the debt.', outcome: `${incident.personName} used their standing to protect you. You escaped the worst outcome, and now owe a favor that cannot be paid with one compliment.`, effects: { happiness: 4, sanity: 3 }, storyFinal: 'rescued' },
        { text: 'Take the consequence yourself.', outcome: `You refused to spend ${incident.personName}'s future for your safety. Their trust in you deepened.`, effects: { humanity: 4, vitality: -2 }, storyFinal: 'self_sacrifice' }
      ]
    };
  }

  function popDueStory(character) {
    const ledger = ensureStoryLedger(character);
    const incident = ledger.pending.filter(item => ['pending', 'presenting'].includes(item.status) && item.dueAge <= character.age)
      .sort((a, b) => a.dueAge - b.dueAge || b.severity - a.severity)[0];
    if (!incident) return null;
    incident.status = 'presenting';
    return incident.kind === 'loyalty' ? buildLoyaltyDilemma(incident) : buildGrudgeDilemma(incident);
  }

  function resolveStoryChoice(character, dilemma, choice) {
    if (!dilemma || !dilemma.storyIncidentId) return null;
    const ledger = ensureStoryLedger(character);
    const incident = ledger.pending.find(item => item.id === dilemma.storyIncidentId);
    if (!incident) return null;
    const person = findPerson(character, incident);
    ledger.history.unshift({
      id: `${incident.id}_${incident.stage}`, incidentId: incident.id, kind: incident.kind,
      personName: incident.personName, originAge: incident.originAge, resolvedAge: character.age,
      stage: incident.stage, choice: choice.text, outcome: choice.outcome
    });
    if (ledger.history.length > 20) ledger.history.length = 20;

    if (choice.storyBranch) {
      incident.branch = choice.storyBranch;
      incident.stage += 1;
      incident.dueAge = character.age + 1;
      incident.status = 'pending';
    } else {
      incident.status = 'resolved';
      incident.resolution = choice.storyFinal || 'resolved';
      ledger.pending = ledger.pending.filter(item => item.id !== incident.id);
      if (person && window.ensureNpcMemory) {
        const mind = window.ensureNpcMemory(person);
        if (['repaired', 'truth', 'cold_peace'].includes(incident.resolution)) {
          mind.resentment = Math.max(0, mind.resentment - 15);
          mind.trust = Math.min(100, mind.trust + 4);
        } else if (['estranged', 'covered_up', 'ruin'].includes(incident.resolution)) {
          mind.resentment = Math.min(100, mind.resentment + 18);
          mind.trust = Math.max(0, mind.trust - 12);
          person.relationship = Math.max(0, (person.relationship || 0) - 12);
        } else if (incident.kind === 'loyalty') {
          mind.trust = Math.min(100, mind.trust + 10);
          person.relationship = Math.min(100, (person.relationship || 0) + 6);
        }
        person.relationshipState = window.getRelationshipState(person);
      }
      if (incident.resolution === 'ruin' && window.addConsequence) {
        window.addConsequence(character, { type: 'social_stigma', label: 'Reputation for Cruelty', detail: `The feud with ${incident.personName} became public history.`, source: incident.personName, severity: 3, yearsRemaining: 4 });
      }
      if (incident.resolution === 'covered_up' && window.addConsequence) {
        window.addConsequence(character, { type: 'rumor', label: 'Suspected Cover-Up', detail: `${incident.personName} continues searching for proof.`, source: incident.personName, severity: 3, yearsRemaining: 4 });
      }
    }
    return incident;
  }

  function storyLedgerHtml(character) {
    const ledger = ensureStoryLedger(character);
    const pending = ledger.pending.filter(item => item.status !== 'resolved');
    const pendingRows = pending.length ? pending.slice(0, 6).map(item => `<div class="rounded-xl border border-leadborder bg-inputbg p-3"><div class="flex justify-between gap-2"><strong class="text-xs text-parchment">${item.personName}</strong><span class="text-[8px] font-mono text-amber-400">${item.status === 'presenting' ? 'RETURNING NOW' : 'DORMANT'}</span></div><p class="text-[10px] text-dust mt-1">${item.kind === 'loyalty' ? 'A promise of loyalty is waiting to be tested.' : 'An unresolved incident may return.'} Origin: age ${item.originAge}.</p></div>`).join('') : '<p class="text-xs text-dust/70 italic">No unresolved story threads.</p>';
    const historyRows = ledger.history.slice(0, 5).map(item => `<li class="text-[10px] text-dust"><span class="text-parchment">${item.personName}</span> · ${item.outcome} <span class="font-mono">(age ${item.resolvedAge})</span></li>`).join('');
    return `${pendingRows}${historyRows ? `<div class="border-t border-leadborder mt-3 pt-3"><p class="text-[9px] font-mono uppercase tracking-wider text-dust mb-2">Returned choices</p><ul class="space-y-2">${historyRows}</ul></div>` : ''}`;
  }

  window.ensureStoryLedger = ensureStoryLedger;
  window.scheduleNpcAftermath = scheduleNpcAftermath;
  window.considerLoyaltyStory = considerLoyaltyStory;
  window.popDueStory = popDueStory;
  window.resolveStoryChoice = resolveStoryChoice;
  window.storyLedgerHtml = storyLedgerHtml;
})();
