// Persistent NPC memory, trust, fear, and grudge foundation.
(function () {
  const POSITIVE_ACTIONS = new Set([
    'spend_time', 'converse', 'compliment', 'cuddle', 'babble', 'feed_milk', 'peekaboo',
    'parent_advice', 'sibling_secret', 'grandparent_folktale', 'gift', 'tribute',
    'chat', 'study_together', 'befriend', 'praise', 'ask_help', 'greet_staff', 'nurture',
    'ask_snack', 'help_clean', 'school_pride'
  ]);
  const HARMFUL_ACTIONS = new Set(['argue', 'insult', 'prank', 'gossip', 'complain', 'bribe']);
  const ACTION_LABELS = {
    spend_time: 'Spent meaningful time together', converse: 'Had a conversation', compliment: 'Offered a compliment',
    cuddle: 'Shared a comforting cuddle', babble: 'Babbled together', feed_milk: 'Was fed and cared for',
    peekaboo: 'Played peek-a-boo', parent_advice: 'Asked for advice', sibling_secret: 'Shared a private secret',
    sibling_bicker: 'Bickered with each other', grandparent_folktale: 'Listened to an old folktale', gift: 'Gave a gift',
    tribute: 'Offered a dark tribute', argue: 'Had a bitter argument', insult: 'Delivered a deliberate insult', chat: 'Spent time talking',
    study_together: 'Studied together', gossip: 'Traded harmful gossip', dare: 'Shared a reckless dare',
    prank: 'Pulled a prank', befriend: 'Asked for lasting friendship', praise: 'Offered sincere praise',
    ask_help: 'Asked for help', complain: 'Disputed their decision', bribe: 'Attempted a bribe',
    greet_staff: 'Exchanged a friendly greeting', nurture: 'Sought comfort', ask_snack: 'Asked for a snack',
    help_clean: 'Helped with their work', school_pride: 'Showed school pride', apology: 'Offered an apology'
  };

  function ensureNpcMemory(person) {
    if (!person) return null;
    if (!Array.isArray(person.memories)) person.memories = [];
    if (!person.relationshipMind || typeof person.relationshipMind !== 'object') {
      const closeness = Number.isFinite(person.relationship) ? person.relationship : 50;
      person.relationshipMind = {
        trust: Math.max(10, Math.min(85, Math.round(closeness * 0.8))),
        resentment: 0,
        fear: 0,
        harmfulIncidents: 0,
        apologies: 0
      };
    }
    return person.relationshipMind;
  }

  function getRelationshipState(person) {
    const mind = ensureNpcMemory(person);
    const closeness = Number.isFinite(person.relationship) ? person.relationship : 50;
    if (closeness <= 8 || (mind.resentment >= 70 && mind.trust <= 12)) return 'estranged';
    if (mind.fear >= 45) return 'afraid';
    if (mind.resentment >= 48 || (closeness < 25 && mind.resentment >= 25)) return 'hostile';
    if (mind.resentment >= 20) return 'resentful';
    if (mind.trust >= 60 && closeness >= 65 && mind.resentment < 12) return 'trusting';
    return 'wary';
  }

  function addNpcMemory(person, character, action, tone, severity, summary) {
    ensureNpcMemory(person);
    const memory = {
      id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      action,
      tone,
      severity,
      summary: summary || ACTION_LABELS[action] || 'Shared an important moment',
      age: character && Number.isFinite(character.age) ? character.age : null,
      year: character && Number.isFinite(character.year) ? character.year : null,
      softened: false
    };
    person.memories.unshift(memory);
    if (person.memories.length > 10) {
      const oldestNonHarmful = person.memories.map((item, index) => ({ item, index })).reverse()
        .find(entry => entry.item.tone !== 'harmful');
      person.memories.splice(oldestNonHarmful ? oldestNonHarmful.index : person.memories.length - 1, 1);
    }
    person.relationshipState = getRelationshipState(person);
    return memory;
  }

  function finalizeNpcInteraction(person, character, action, result) {
    if (!person || !result || !result.success || action === 'apology') return result;
    const mind = ensureNpcMemory(person);
    const relDelta = result.effects && Number(result.effects.relationship || 0);
    let tone = POSITIVE_ACTIONS.has(action) ? 'positive' : (HARMFUL_ACTIONS.has(action) ? 'harmful' : 'neutral');
    if (relDelta < 0) tone = 'harmful';
    if (relDelta > 0 && !HARMFUL_ACTIONS.has(action)) tone = 'positive';

    if (tone === 'harmful') {
      const previous = mind.harmfulIncidents || 0;
      const severity = Math.max(1, Math.min(4, Math.ceil(Math.abs(relDelta) / 8) || 1));
      const escalation = Math.min(12, previous * 2);
      mind.harmfulIncidents = previous + 1;
      mind.resentment = Math.min(100, mind.resentment + severity * 9 + escalation);
      mind.trust = Math.max(0, mind.trust - severity * 8 - Math.floor(escalation / 2));
      if (action === 'prank' || action === 'argue' || action === 'bribe') mind.fear = Math.min(100, mind.fear + severity * 2);
      if (escalation > 0) {
        person.relationship = Math.max(0, (person.relationship || 0) - escalation);
        result.effects = result.effects || {};
        result.effects.relationship = (result.effects.relationship || 0) - escalation;
        const warning = `${person.name} remembers the earlier incidents; the repeated behavior deepened the grudge (-${escalation}% additional Closeness).`;
        if (result.body) result.body += `\n\n${warning}`;
        else result.message = `${result.message || ''}\n\n${warning}`.trim();
      }
      addNpcMemory(person, character, action, tone, severity, ACTION_LABELS[action]);
      if (window.resolveNpcReaction) {
        const reaction = window.resolveNpcReaction(person, character, action, severity);
        if (reaction) {
          result.reaction = reaction;
          const reactionText = `RETALIATION — ${reaction.text}`;
          if (result.body) result.body += `\n\n${reactionText}`;
          if (result.message) result.message += `\n\n${reactionText}`;
        }
      }
    } else if (tone === 'positive') {
      const unresolved = mind.resentment > 0;
      mind.trust = Math.min(100, mind.trust + (unresolved ? 2 : 5));
      mind.positiveInteractions = (mind.positiveInteractions || 0) + 1;
      // Kindness can rebuild trust, but it cannot silently erase a grudge.
      addNpcMemory(person, character, action, tone, 1, ACTION_LABELS[action]);
      if (window.considerLoyaltyStory) window.considerLoyaltyStory(character, person);
    } else if (relDelta !== 0) {
      addNpcMemory(person, character, action, relDelta > 0 ? 'positive' : 'harmful', 1, ACTION_LABELS[action]);
    }

    if (window.recordNpcInteractionReputation) window.recordNpcInteractionReputation(character, person, tone, Math.max(1, Math.ceil(Math.abs(relDelta) / 8) || 1), action);
    if (window.processLifeOutcome) window.processLifeOutcome(character, { person, action, result });

    person.relationshipState = getRelationshipState(person);
    return result;
  }

  function apologizeToNpc(person, character) {
    const mind = ensureNpcMemory(person);
    if (mind.resentment <= 0 && !person.memories.some(memory => memory.tone === 'harmful' && !memory.softened)) {
      return { success: false, reason: `${person.name} is not holding a grievance that needs an apology.` };
    }
    const previousApologies = mind.apologies || 0;
    const relief = Math.max(3, 9 - Math.min(6, previousApologies * 2));
    const closenessGain = Math.max(1, 4 - Math.min(3, previousApologies));
    mind.apologies = previousApologies + 1;
    mind.resentment = Math.max(0, mind.resentment - relief);
    mind.trust = Math.min(100, mind.trust + 2);
    person.relationship = Math.min(100, (person.relationship || 0) + closenessGain);
    const unresolved = person.memories.find(memory => memory.tone === 'harmful' && !memory.softened);
    if (unresolved) unresolved.softened = true;
    if (mind.resentment < 15) person.friendshipEnded = false;
    addNpcMemory(person, character, 'apology', 'repair', 1, `Apologized, but the history remained`);
    person.relationshipState = getRelationshipState(person);
    return {
      success: true,
      title: `Apologized to ${person.name}`,
      message: `${person.name} heard your apology. Their resentment eased, but what happened was not erased.`,
      body: `${person.name} heard your apology. Their resentment eased, but what happened was not erased.`,
      effects: { relationship: closenessGain, resentment: -relief }
    };
  }

  function ageNpcMemories(person) {
    const mind = ensureNpcMemory(person);
    // Ordinary irritation cools slowly. Serious memories and the incident count persist.
    mind.resentment = Math.max(0, mind.resentment - 2);
    mind.fear = Math.max(0, mind.fear - 1);
    mind.apologies = 0;
    person.relationshipState = getRelationshipState(person);
  }

  function relationshipDossierHtml(person) {
    const mind = ensureNpcMemory(person);
    const state = getRelationshipState(person);
    const stateStyles = {
      trusting: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/25',
      wary: 'text-amber-300 border-amber-500/30 bg-amber-950/25',
      resentful: 'text-orange-300 border-orange-500/30 bg-orange-950/25',
      hostile: 'text-rose-300 border-rose-500/30 bg-rose-950/25',
      afraid: 'text-purple-300 border-purple-500/30 bg-purple-950/25',
      estranged: 'text-dust border-leadborder bg-ebon/30'
    };
    const memories = person.memories.slice(0, 4);
    const rows = memories.length ? memories.map(memory => {
      const marker = memory.tone === 'harmful' ? 'text-rose-400' : (memory.tone === 'repair' ? 'text-sky-400' : 'text-emerald-400');
      const when = memory.age !== null ? `Age ${memory.age}` : (memory.year !== null ? `${memory.year}` : 'Earlier');
      return `<li class="flex gap-2 text-[10px] leading-snug"><span class="${marker}">●</span><span class="text-dust"><span class="text-parchment">${memory.summary}</span> · ${when}${memory.softened ? ' · acknowledged' : ''}</span></li>`;
    }).join('') : '<li class="text-[10px] text-dust/70 italic">No important history recorded yet.</li>';
    const entityCondition = person.entityCondition
      ? `<div class="rounded-lg border border-purple-500/30 bg-purple-950/25 p-2 text-[10px] text-purple-200"><span class="font-mono uppercase tracking-wider">Unnatural change:</span> ${person.entityCondition.type} since age ${person.entityCondition.sinceAge}</div>`
      : '';
    return `
      <div class="rounded-lg border ${stateStyles[state]} p-2.5 space-y-2">
        ${entityCondition}
        <div class="flex items-center justify-between gap-2">
          <span class="text-[9px] font-mono uppercase tracking-wider text-dust">Relationship state</span>
          <span class="text-[10px] font-mono font-bold uppercase">${state}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center font-mono">
          <div><div class="text-[8px] uppercase text-dust">Trust</div><div class="text-[10px] text-parchment font-bold">${mind.trust}%</div></div>
          <div><div class="text-[8px] uppercase text-dust">Resentment</div><div class="text-[10px] text-parchment font-bold">${mind.resentment}%</div></div>
          <div><div class="text-[8px] uppercase text-dust">Fear</div><div class="text-[10px] text-parchment font-bold">${mind.fear}%</div></div>
        </div>
        <div class="border-t border-current/15 pt-2">
          <div class="text-[9px] font-mono uppercase tracking-wider text-dust mb-1.5">Recent history</div>
          <ul class="space-y-1.5">${rows}</ul>
        </div>
      </div>`;
  }

  window.ensureNpcMemory = ensureNpcMemory;
  window.getRelationshipState = getRelationshipState;
  window.finalizeNpcInteraction = finalizeNpcInteraction;
  window.apologizeToNpc = apologizeToNpc;
  window.ageNpcMemories = ageNpcMemories;
  window.relationshipDossierHtml = relationshipDossierHtml;
})();
