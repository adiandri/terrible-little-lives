// Persistent consequence ledger: conditions survive the popup and alter later play.
(function () {
  const clamp = value => Math.max(0, Math.min(100, value));
  const DEFINITIONS = {
    injury: { icon: 'bandage', color: 'text-rose-400', recoveryActivity: 'doctor_general_checkup', recoveryNeeded: 2 },
    trauma: { icon: 'brain', color: 'text-purple-400', recoveryActivity: 'psychoanalysis_therapy', recoveryNeeded: 3 },
    suspension: { icon: 'school', color: 'text-amber-400', recoveryNeeded: 0 },
    criminal_record: { icon: 'file-warning', color: 'text-red-400', recoveryActivity: 'retain_attorney', recoveryNeeded: 3 },
    rumor: { icon: 'messages-square', color: 'text-orange-400', recoveryActivity: 'group_hangout', recoveryNeeded: 2 },
    debt: { icon: 'landmark', color: 'text-amber-300', recoveryActivity: 'side_gig_oddjobs', recoveryNeeded: 1 },
    social_stigma: { icon: 'users-round', color: 'text-slate-400', recoveryActivity: 'heart_to_heart_talk', recoveryNeeded: 3 }
  };

  function ensureConsequences(character) {
    if (!Array.isArray(character.consequences)) character.consequences = [];
    if (Array.isArray(character.injuries)) {
      character.injuries.filter(injury => injury.active && !injury.consequenceId).forEach(injury => {
        const migrated = {
          id: `consequence_migrated_${injury.id || Date.now()}`,
          type: 'injury', label: injury.name || 'Physical Injury', detail: `Sustained during an attack by ${injury.source || 'an unknown person'}.`,
          source: injury.source || 'Earlier confrontation', acquiredAge: injury.acquiredAge ?? null,
          severity: injury.severity || 2, yearsRemaining: injury.yearsRemaining ?? 1,
          recoveryProgress: 0, recoveryNeeded: 2, amount: 0, active: true
        };
        character.consequences.push(migrated);
        injury.consequenceId = migrated.id;
      });
    }
    return character.consequences;
  }

  function addConsequence(character, data) {
    const consequences = ensureConsequences(character);
    const type = data.type;
    const existing = consequences.find(item => item.active && item.type === type && item.label === data.label);
    if (existing) {
      existing.severity = Math.min(5, Math.max(existing.severity, data.severity || 1) + 1);
      existing.yearsRemaining = Math.max(existing.yearsRemaining || 0, data.yearsRemaining || 0);
      if (type === 'debt') existing.amount = (existing.amount || 0) + (data.amount || 0);
      existing.recoveryNeeded = Math.max(existing.recoveryNeeded || 0, data.recoveryNeeded || 0);
      return existing;
    }
    const definition = DEFINITIONS[type] || {};
    const consequence = {
      id: `consequence_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      type,
      label: data.label || type.replaceAll('_', ' '),
      detail: data.detail || '',
      source: data.source || 'Unknown incident',
      acquiredAge: Number.isFinite(character.age) ? character.age : null,
      severity: data.severity || 1,
      yearsRemaining: data.yearsRemaining ?? null,
      recoveryProgress: 0,
      recoveryNeeded: data.recoveryNeeded ?? definition.recoveryNeeded ?? 0,
      amount: data.amount || 0,
      active: true
    };
    consequences.unshift(consequence);
    return consequence;
  }

  function activeConsequences(character, type = null) {
    return ensureConsequences(character).filter(item => item.active && (!type || item.type === type));
  }

  function getActivityRestriction(character, activity) {
    const active = activeConsequences(character);
    if (active.some(item => item.type === 'suspension') && ['education', 'social'].includes(activity.category)) {
      return 'Suspension bars you from school and organized peer activities.';
    }
    if (active.some(item => item.type === 'injury' && item.severity >= 2) && ['exercise_gym', 'visit_ancient_graveyard', 'graveyard_moth_hunt', 'neighborhood_park'].includes(activity.id)) {
      return 'Your active injury makes this physical activity unsafe.';
    }
    if (active.some(item => item.type === 'trauma' && item.severity >= 3) && ['midnight_seance', 'ouija_board_communion', 'sneak_basement'].includes(activity.id)) {
      return 'The unresolved trauma makes deliberately entering another threatening setting impossible right now.';
    }
    if (active.some(item => item.type === 'social_stigma' && item.severity >= 3) && ['group_hangout', 'find_friend', 'flirt_romantic_interest'].includes(activity.id)) {
      return 'The current social stigma has closed this invitation network to you.';
    }
    return null;
  }

  function applyRecoveryFromActivity(character, activityId) {
    const notes = [];
    activeConsequences(character).forEach(item => {
      const definition = DEFINITIONS[item.type] || {};
      if (definition.recoveryActivity !== activityId) return;
      if (item.type === 'debt') {
        const payment = Math.min(item.amount || 0, Math.max(10, Math.floor((character.money || 0) * 0.2)));
        if (payment <= 0) return;
        character.money -= payment;
        item.amount -= payment;
        notes.push(`You put $${payment} toward ${item.label}; $${item.amount} remains.`);
        if (item.amount <= 0) item.active = false;
        return;
      }
      item.recoveryProgress = Math.min(item.recoveryNeeded, (item.recoveryProgress || 0) + 1);
      notes.push(`${item.label}: recovery ${item.recoveryProgress}/${item.recoveryNeeded}.`);
      if (item.recoveryNeeded > 0 && item.recoveryProgress >= item.recoveryNeeded) item.active = false;
    });
    return notes;
  }

  function tickConsequences(character) {
    const logs = [];
    activeConsequences(character).forEach(item => {
      if (Number.isFinite(item.yearsRemaining)) {
        item.yearsRemaining = Math.max(0, item.yearsRemaining - 1);
        if (item.yearsRemaining === 0 && item.type !== 'criminal_record') item.active = false;
      }
      if (item.type === 'debt' && item.active) {
        const interest = Math.max(1, Math.ceil((item.amount || 0) * 0.08));
        item.amount += interest;
        logs.push(`${item.label} accrued $${interest} interest; $${item.amount} remains unpaid.`);
      } else if (item.active) {
        logs.push(`${item.label} remains active${item.recoveryNeeded ? ` (recovery ${item.recoveryProgress}/${item.recoveryNeeded})` : ''}.`);
      } else {
        logs.push(`${item.label} is no longer active, though it remains part of your history.`);
      }
    });
    if (Array.isArray(character.injuries)) {
      character.injuries.forEach(injury => {
        const linked = ensureConsequences(character).find(item => item.id === injury.consequenceId);
        if (linked && !linked.active) injury.active = false;
      });
    }
    return logs;
  }

  function recordOutcomeConsequences(character, title, outcome, effects = {}) {
    const text = `${title || ''} ${outcome || ''}`.toLowerCase();
    const added = [];
    if (/suspend/.test(text)) added.push(addConsequence(character, { type: 'suspension', label: 'School Suspension', detail: outcome, source: title, severity: 2, yearsRemaining: 1 }));
    if (/bruis|sprain|bloody|injur|split lip/.test(text)) added.push(addConsequence(character, { type: 'injury', label: 'Physical Injury', detail: outcome, source: title, severity: Math.abs(effects.vitality || 0) >= 6 ? 3 : 2, yearsRemaining: 2 }));
    if ((effects.sanity || 0) <= -5 || /trauma|terrified|panic/.test(text)) added.push(addConsequence(character, { type: 'trauma', label: 'Unresolved Trauma', detail: outcome, source: title, severity: 2, yearsRemaining: null }));
    if (/arrest|convict|criminal record|police custody/.test(text)) added.push(addConsequence(character, { type: 'criminal_record', label: 'Criminal Record', detail: outcome, source: title, severity: 2, yearsRemaining: null }));
    if (/rumor|gossip|publicly humiliat/.test(text)) added.push(addConsequence(character, { type: 'rumor', label: 'Circulating Rumor', detail: outcome, source: title, severity: 2, yearsRemaining: 3 }));
    return added;
  }

  function addDebt(character, amount, source) {
    if (amount <= 0) return null;
    return addConsequence(character, { type: 'debt', label: 'Outstanding Debt', detail: `Unpaid costs from ${source}.`, source, severity: amount >= 500 ? 3 : 1, amount, yearsRemaining: null });
  }

  function chooseWeightedDilemma(character, pool) {
    if (!pool.length) return null;
    const active = activeConsequences(character);
    const weighted = pool.map(dilemma => {
      const text = `${dilemma.title} ${dilemma.prompt}`.toLowerCase();
      let weight = 1;
      if (active.some(item => item.type === 'trauma') && /fear|shadow|attack|night|panic|bully/.test(text)) weight += 1.4;
      if (active.some(item => ['rumor', 'social_stigma'].includes(item.type)) && /school|friend|class|crowd|social/.test(text)) weight += 1.2;
      if (active.some(item => item.type === 'criminal_record') && /police|crime|law|theft/.test(text)) weight += 1.5;
      if (active.some(item => item.type === 'debt') && /money|cash|job|rent|cost/.test(text)) weight += 1.2;
      return { dilemma, weight };
    });
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    return weighted.find(item => (roll -= item.weight) <= 0)?.dilemma || weighted[weighted.length - 1].dilemma;
  }

  function consequencesHtml(character) {
    const all = ensureConsequences(character);
    if (!all.length) return '<p class="text-xs text-dust/70 italic">No lasting conditions recorded.</p>';
    return all.slice(0, 10).map(item => {
      const definition = DEFINITIONS[item.type] || { icon: 'circle-alert', color: 'text-dust' };
      const status = item.active ? 'ACTIVE' : 'HISTORY';
      const progress = item.type === 'debt' ? `$${item.amount} owed` : (item.recoveryNeeded ? `Recovery ${item.recoveryProgress}/${item.recoveryNeeded}` : (Number.isFinite(item.yearsRemaining) ? `${item.yearsRemaining} year(s)` : 'Persistent'));
      return `<div class="rounded-xl border border-leadborder bg-inputbg p-3 flex gap-3"><i data-lucide="${definition.icon}" class="w-4 h-4 mt-0.5 ${definition.color}"></i><div class="min-w-0 flex-1"><div class="flex justify-between gap-2"><strong class="text-xs text-parchment">${item.label}</strong><span class="text-[8px] font-mono ${item.active ? 'text-crimson' : 'text-dust'}">${status}</span></div><p class="text-[10px] text-dust mt-1">${progress} · Since age ${item.acquiredAge ?? '?'}</p></div></div>`;
    }).join('');
  }

  window.ensureConsequences = ensureConsequences;
  window.addConsequence = addConsequence;
  window.getActiveConsequences = activeConsequences;
  window.getActivityRestriction = getActivityRestriction;
  window.applyRecoveryFromActivity = applyRecoveryFromActivity;
  window.tickConsequences = tickConsequences;
  window.recordOutcomeConsequences = recordOutcomeConsequences;
  window.addDebtConsequence = addDebt;
  window.chooseWeightedDilemma = chooseWeightedDilemma;
  window.consequencesHtml = consequencesHtml;
})();
