// Immediate NPC reactions and retaliation. Persistent aftermath is stored on both parties.
(function () {
  const pick = items => items[Math.floor(Math.random() * items.length)];
  const clamp = value => Math.max(0, Math.min(100, value));

  function ensureNpcPersonality(person) {
    if (!person.personality || typeof person.personality !== 'object') {
      const role = String(person.role || '');
      const authority = /Teacher|Principal|Headmaster|Dean|Mother|Father|Nurse|Matron/.test(role);
      person.personality = {
        aggression: clamp(Math.floor(Math.random() * 46) + (person.clique === 'Jocks' ? 25 : 10)),
        composure: clamp(Math.floor(Math.random() * 46) + (authority ? 45 : 25)),
        vindictiveness: clamp(Math.floor(Math.random() * 56) + 15),
        empathy: clamp(Math.floor(Math.random() * 61) + 20),
        socialPower: clamp((person.popularity || 35) + (authority ? 35 : 0))
      };
    }
    return person.personality;
  }

  function addInjury(character, attacker, severity) {
    if (!Array.isArray(character.injuries)) character.injuries = [];
    const injury = {
      id: `injury_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: pick(severity >= 3
        ? ['a split lip and bruised ribs', 'a badly sprained wrist', 'a deep facial bruise']
        : ['a bloody nose', 'a bruised shoulder', 'scraped palms and a swollen cheek']),
      severity,
      source: attacker.name,
      acquiredAge: character.age,
      yearsRemaining: severity >= 3 ? 2 : 1,
      active: true
    };
    if (window.addConsequence) {
      const consequence = window.addConsequence(character, {
        type: 'injury', label: injury.name, detail: `Sustained during an attack by ${attacker.name}.`,
        source: attacker.name, severity, yearsRemaining: injury.yearsRemaining
      });
      injury.consequenceId = consequence.id;
    }
    character.injuries.unshift(injury);
    return injury;
  }

  function getWitnesses(person, character) {
    if (person.category === 'coworker') {
      const colleagues = character && character.workplace && character.workplace.colleagues;
      return Array.isArray(colleagues) ? colleagues.filter(candidate => candidate !== person && candidate.alive !== false) : [];
    }
    if (!['classmate', 'teacher', 'staff'].includes(person.category)) return [];
    const education = character && character.education;
    return education ? [...(education.classmates || []), ...(education.teachers || []), ...(education.staff || [])]
      .filter(candidate => candidate !== person && candidate.alive !== false) : [];
  }

  function resolveBystander(person, character, reactionType) {
    const witnesses = getWitnesses(person, character);
    if (!witnesses.length || Math.random() > 0.62) return null;
    const witness = pick(witnesses);
    const personality = ensureNpcPersonality(witness);
    const relationship = witness.relationship || 50;
    const side = window.witnessDecision ? window.witnessDecision(character, witness, person) : 'uncertain';
    if (reactionType === 'attack' && (side === 'player' || personality.empathy + relationship > 105)) {
      if (character.stats) character.stats.sanity = clamp((character.stats.sanity || 50) + 2);
      return { witness, side: 'player', text: `${witness.name} sided with you and stepped between you and ${person.name}, stopping the fight before it became worse.` };
    }
    if (side === 'instigator' || (personality.aggression > 62 && (person.relationship || 50) > relationship)) {
      if (character.stats) character.stats.happiness = clamp((character.stats.happiness || 50) - 3);
      return { witness, side: 'instigator', text: `${witness.name} took ${person.name}'s side and joined the confrontation.` };
    }
    if (character.education) character.education.popularity = clamp((character.education.popularity || 50) - 4);
    return { witness, side: 'uncertain', text: `${witness.name} repeated the story without choosing a side. By lunch, other people were debating whom to believe (-4% Popularity).` };
  }

  function endFriendship(person, character) {
    person.friendshipEnded = true;
    person.isBefriended = false;
    person.relationship = Math.min(person.relationship || 0, 8);
    const friends = character.kin && character.kin.friends;
    if (!Array.isArray(friends)) return;
    const linked = friends.find(friend => friend === person || friend.name === person.name);
    if (!linked) return;
    linked.friendshipEnded = true;
    linked.relationship = Math.min(linked.relationship || 0, 8);
    if (window.ensureNpcMemory) {
      const mind = window.ensureNpcMemory(linked);
      mind.resentment = Math.max(mind.resentment, 70);
      mind.trust = Math.min(mind.trust, 10);
      linked.relationshipState = 'estranged';
    }
  }

  function resolveNpcReaction(person, character, action, severity) {
    const personality = ensureNpcPersonality(person);
    const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { resentment: 0, harmfulIncidents: 1 };
    const state = window.getRelationshipState ? window.getRelationshipState(person) : 'wary';
    const playerAge = Number(character.age || 0);
    const attackerAge = Number.isFinite(person.age) ? person.age : playerAge;
    const peerLike = person.category === 'classmate' || person.category === 'friend' || /Brother|Sister|Friend/.test(person.role || '');
    const schoolAuthority = person.category === 'teacher' || person.category === 'staff';
    const escalation = (mind.harmfulIncidents || 1) * 8 + mind.resentment * 0.35;
    if (action !== 'insult' && Math.random() > Math.min(0.96, 0.42 + escalation / 150 + severity * 0.06)) return null;

    let type = 'insult_back';
    const attackScore = personality.aggression + escalation + (state === 'hostile' ? 25 : 0) - personality.composure;
    const socialScore = personality.socialPower + personality.vindictiveness + escalation;
    if ((mind.harmfulIncidents || 1) <= 1 && personality.empathy > 74) type = pick(['warning', 'forgive', 'mediation']);
    else if (peerLike && playerAge >= 8 && attackerAge >= 7 && attackScore > 68 && (!window.canNpcAttack || window.canNpcAttack(character, person))) type = 'attack';
    else if (schoolAuthority && personality.composure > 55) type = 'reported';
    else if ((person.category === 'friend' || person.isBefriended) && (state === 'hostile' || mind.harmfulIncidents >= 3)) type = 'friendship_loss';
    else if (socialScore > 135) type = pick(['humiliation', 'exclusion', 'sabotage']);
    else if (personality.composure < 40) type = 'confrontation';
    else if (personality.vindictiveness > 62) type = 'blocked';

    let text = '';
    const effects = {};
    if (type === 'attack') {
      const protection = window.consumeProtection ? window.consumeProtection(character, person) : null;
      if (protection) {
        type = 'protected';
        text = protection;
      } else {
      const damage = Math.floor(Math.random() * 7) + 5;
      const injury = addInjury(character, person, damage >= 9 ? 3 : 2);
      if (damage >= 9 && window.addConsequence) window.addConsequence(character, { type: 'trauma', label: 'Post-Attack Trauma', detail: `The attack by ${person.name} left a lasting psychological wound.`, source: person.name, severity: 2, yearsRemaining: null });
      if (character.stats) character.stats.vitality = clamp((character.stats.vitality || 50) - damage);
      const schoolFight = person.category === 'classmate' && character.education;
      if (schoolFight) character.education.disciplinaryRecord = (character.education.disciplinaryRecord || 0) + 1;
      effects.vitality = -damage;
      if (schoolFight) effects.discipline = 1;
      text = `${person.name} attacked you during the confrontation. You were left with ${injury.name} (-${damage}% Vitality).${schoolFight ? ' The school recorded your part in the fight (+1 Disciplinary Mark).' : ''}`;
      if (window.registerNpcAttack) window.registerNpcAttack(character, person);
      }
    } else if (type === 'reported') {
      if (character.education) character.education.disciplinaryRecord = (character.education.disciplinaryRecord || 0) + 1;
      effects.discipline = 1;
      text = pick([`${person.name} documented the incident and reported you to school administration (+1 Disciplinary Mark).`, `${person.name} filed a formal account with dates, witnesses, and your exact words (+1 Disciplinary Mark).`]);
    } else if (type === 'friendship_loss') {
      endFriendship(person, character);
      text = `${person.name} ended the friendship. Another pleasant conversation will not undo what happened.`;
    } else if (type === 'humiliation') {
      if (character.education) character.education.popularity = clamp((character.education.popularity || 50) - 8);
      if (character.stats) character.stats.happiness = clamp((character.stats.happiness || 50) - 4);
      effects.popularity = -8;
      effects.happiness = -4;
      text = pick([`${person.name} publicly humiliated you by repeating your words to a laughing crowd (-8% Popularity, -4% Happiness).`, `${person.name} circulated a cruelly edited version of the confrontation until it became a running joke (-8% Popularity, -4% Happiness).`]);
      if (window.addConsequence) {
        window.addConsequence(character, { type: 'rumor', label: `Rumor spread by ${person.name}`, source: person.name, severity: 2, yearsRemaining: 3 });
        window.addConsequence(character, { type: 'social_stigma', label: 'Publicly Humiliated', source: person.name, severity: 2, yearsRemaining: 3 });
      }
    } else if (type === 'exclusion') {
      person.excludedPlayerUntilAge = playerAge + 1;
      if (character.stats) character.stats.happiness = clamp((character.stats.happiness || 50) - 4);
      effects.happiness = -4;
      text = `${person.name} shut you out of their circle and warned others not to include you until things cool down.`;
      if (window.addConsequence) window.addConsequence(character, { type: 'social_stigma', label: 'Excluded from a Social Circle', source: person.name, severity: 2, yearsRemaining: 2 });
    } else if (type === 'sabotage') {
      if (character.education) character.education.grades = clamp((character.education.grades || 75) - 6);
      effects.grades = -6;
      text = `${person.name} retaliated by ruining shared coursework and leaving your name attached to the mess (-6% Grades).`;
      if (window.addConsequence) window.addConsequence(character, { type: 'rumor', label: 'Blamed for Ruined Coursework', source: person.name, severity: 2, yearsRemaining: 2 });
    } else if (type === 'blocked') {
      person.blockedPlayerUntilAge = playerAge + 1;
      text = pick([`${person.name} blocked your calls and messages. Friendly contact is closed until at least next year.`, `${person.name} removed you from every shared channel and instructed friends not to relay messages.`]);
    } else if (type === 'confrontation') {
      if (character.stats) character.stats.sanity = clamp((character.stats.sanity || 50) - 3);
      effects.sanity = -3;
      text = pick([`${person.name} cornered you and demanded you repeat the insult to their face (-3% Sanity).`, `${person.name} confronted you in front of witnesses and refused to let you change the subject (-3% Sanity).`, `${person.name} demanded a direct explanation while everyone nearby went silent (-3% Sanity).`]);
    } else if (type === 'warning') {
      text = pick([`${person.name} firmly warned you that another incident would end all ordinary contact.`, `${person.name} named the behavior plainly and set a hard boundary without retaliating.`]);
    } else if (type === 'forgive') {
      text = `${person.name} chose not to retaliate this time, but made clear that forgiveness would not survive repetition.`;
      mind.resentment = Math.max(0, mind.resentment - 3);
    } else if (type === 'mediation') {
      text = `${person.name} asked a neutral third person to mediate instead of escalating the conflict.`;
      if (character.stats) character.stats.humanity = clamp((character.stats.humanity || 50) + 1);
    } else {
      if (character.stats) character.stats.happiness = clamp((character.stats.happiness || 50) - 3);
      effects.happiness = -3;
      text = pick([`${person.name} answered with a vicious insult of their own (-3% Happiness).`, `${person.name} found the insecurity you hide best and aimed directly at it (-3% Happiness).`, `${person.name} replied quietly enough that only you heard—and made every word count (-3% Happiness).`]);
    }
    const bystander = resolveBystander(person, character, type);
    if (bystander && bystander.side === 'player' && window.grantProtection) window.grantProtection(character, bystander.witness, 'school');
    const reaction = { type, text: bystander ? `${text}\n\n${bystander.text}` : text, effects };
    if (window.recordReactionReputation) window.recordReactionReputation(character, person, reaction, bystander ? [bystander.witness] : []);
    if (window.scheduleNpcAftermath) window.scheduleNpcAftermath(character, person, reaction, action, severity);
    return reaction;
  }

  function insultNpc(person) {
    if (!person) return { success: false, reason: 'No one was selected.' };
    person.relationship = Math.max(0, (person.relationship || 50) - 10);
    const body = `You delivered a cutting insult to ${person.name}, making sure they understood the contempt behind it.`;
    return { success: true, title: `Insulted ${person.name}`, message: body, body, effects: { relationship: -10, happiness: -1 } };
  }

  function canInteractWithNpc(person, character, action) {
    const age = Number(character.age || 0);
    if (action !== 'apology' && person.blockedPlayerUntilAge > age) return `${person.name} has blocked you. An apology is the only message they might accept.`;
    if (action !== 'apology' && person.excludedPlayerUntilAge > age && ['spend_time', 'chat', 'study_together', 'converse'].includes(action)) return `${person.name} has excluded you from their circle for now.`;
    if (action !== 'apology' && person.friendshipEnded && ['spend_time', 'converse', 'compliment', 'gift', 'chat', 'study_together'].includes(action)) return `${person.name} ended this friendship. Repair the grievance before expecting ordinary closeness.`;
    return null;
  }

  function tickReactionYear(character) {
    if (window.tickConsequences) return [];
    if (!Array.isArray(character.injuries)) return [];
    const logs = [];
    character.injuries.forEach(injury => {
      if (!injury.active) return;
      injury.yearsRemaining = Math.max(0, (injury.yearsRemaining || 1) - 1);
      if (injury.yearsRemaining === 0) {
        injury.active = false;
        logs.push(`Recovered from ${injury.name}, sustained during the confrontation with ${injury.source}.`);
      } else {
        logs.push(`Still recovering from ${injury.name} after the attack by ${injury.source}.`);
      }
    });
    return logs;
  }

  window.ensureNpcPersonality = ensureNpcPersonality;
  window.resolveNpcReaction = resolveNpcReaction;
  window.insultNpc = insultNpc;
  window.canInteractWithNpc = canInteractWithNpc;
  window.tickReactionYear = tickReactionYear;
})();
