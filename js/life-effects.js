// Cross-domain consequence balancing and persistent positive advantages.
(function () {
  const BENEFITS = {
    mentorship: { icon: 'book-open-check', color: 'text-sky-300', duration: 4 },
    loyalty: { icon: 'heart-handshake', color: 'text-rose-300', duration: 5 },
    protection: { icon: 'shield-check', color: 'text-emerald-300', duration: 3 },
    recommendation: { icon: 'badge-check', color: 'text-amber-300', duration: 3 }
  };
  const DOMAIN_LABELS = { school: 'School', work: 'Work', romance: 'Romance', family: 'Family', crime: 'Crime', supernatural: 'Supernatural', adulthood: 'Adulthood', social: 'Social Life' };
  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

  function ensureLifeEffects(character) {
    if (!Array.isArray(character.benefits)) character.benefits = [];
    if (!character.consequenceBalance || typeof character.consequenceBalance !== 'object') {
      character.consequenceBalance = { age: character.age, majorEvents: 0, attacks: 0, domainEvents: {}, recentSignatures: [] };
    }
    const balance = character.consequenceBalance;
    if (balance.age !== character.age) {
      balance.age = character.age;
      balance.majorEvents = 0;
      balance.attacks = 0;
      balance.domainEvents = {};
      balance.recentSignatures = (balance.recentSignatures || []).filter(item => character.age - item.age <= 2);
    }
    if (!balance.domainEvents) balance.domainEvents = {};
    if (!Array.isArray(balance.recentSignatures)) balance.recentSignatures = [];
    return balance;
  }

  function activeBenefits(character, type = null) {
    ensureLifeEffects(character);
    return character.benefits.filter(item => item.active && (!type || item.type === type));
  }

  function addBenefit(character, data) {
    const definition = BENEFITS[data.type] || {};
    ensureLifeEffects(character);
    const existing = character.benefits.find(item => item.active && item.type === data.type && item.source === data.source);
    if (existing) {
      existing.yearsRemaining = Math.min(6, Math.max(existing.yearsRemaining, data.yearsRemaining || definition.duration || 3) + 1);
      existing.charges = Math.min(3, (existing.charges || 0) + (data.charges || 0));
      return existing;
    }
    const benefit = {
      id: `benefit_${Date.now()}_${Math.floor(Math.random() * 10000)}`, type: data.type,
      label: data.label || data.type, detail: data.detail || '', source: data.source || 'Life event',
      domain: data.domain || 'social', acquiredAge: character.age,
      yearsRemaining: data.yearsRemaining || definition.duration || 3,
      charges: data.charges || (data.type === 'protection' ? 1 : 0), active: true
    };
    character.benefits.unshift(benefit);
    return benefit;
  }

  function domainFrom(context) {
    if (context.domain) return context.domain;
    const category = context.activity?.category || context.person?.category || '';
    if (['education', 'classmate', 'teacher', 'staff'].includes(category)) return 'school';
    if (['work', 'coworker'].includes(category)) return 'work';
    if (['relationships', 'romance'].includes(category)) return 'romance';
    if (['crime', 'illegal'].includes(category)) return 'crime';
    if (['occult', 'paranormal'].includes(category)) return 'supernatural';
    if (/Mother|Father|Brother|Sister|Grand/.test(context.person?.role || '')) return 'family';
    return Number(context.character?.age || 0) >= 18 ? 'adulthood' : 'social';
  }

  function benefitCandidate(character, context, domain, positive) {
    if (!positive || !context.person) return null;
    const person = context.person;
    const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { trust: 0, resentment: 0, positiveInteractions: 0 };
    if (mind.resentment >= 12) return null;
    if (domain === 'school' && person.category === 'teacher' && mind.trust >= 60 && (mind.positiveInteractions || 0) >= 3) {
      return { type: 'mentorship', label: `Mentored by ${person.name}`, detail: 'Guidance improves learning and academic recovery each year.', source: person.name, domain };
    }
    if (['family', 'romance', 'social'].includes(domain) && mind.trust >= 70 && (person.relationship || 0) >= 70) {
      return { type: 'loyalty', label: `${person.name}'s Loyalty`, detail: 'A trusted person will resist rumors and stand beside you during conflict.', source: person.name, domain, charges: 1 };
    }
    if (domain === 'work' && mind.trust >= 62) {
      return { type: 'recommendation', label: `Recommendation from ${person.name}`, detail: 'A credible professional endorsement improves access to prestigious work.', source: person.name, domain };
    }
    return null;
  }

  function processLifeOutcome(character, context = {}) {
    if (!character || !context.result) return [];
    context.character = character;
    const balance = ensureLifeEffects(character);
    const result = context.result;
    const domain = domainFrom(context);
    const text = `${result.title || ''} ${result.body || result.message || ''}`.toLowerCase();
    const effects = result.effects || {};
    const positive = Object.values(effects).some(value => Number(value) >= 4) || /helped|protected|recommend|mentor|loyal|accepted|successful|praised/.test(text);
    const negative = Object.values(effects).some(value => Number(value) <= -4) || /attack|caught|failed|reported|humiliat|injur|betray|arrest/.test(text);
    const notes = [];
    const signature = `${domain}:${result.title || text.slice(0, 30)}`;
    const repeated = balance.recentSignatures.some(item => item.signature === signature && character.age - item.age <= 1);

    const candidate = benefitCandidate(character, context, domain, positive);
    if (candidate && !repeated && Math.random() < 0.38) {
      const benefit = addBenefit(character, candidate);
      notes.push(`Positive consequence: ${benefit.label}.`);
    }

    const domainCount = balance.domainEvents[domain] || 0;
    const activeSevere = window.getActiveConsequences ? window.getActiveConsequences(character).filter(item => item.severity >= 3).length : 0;
    const fragile = (character.stats?.vitality || 50) < 22 || (character.stats?.sanity || 50) < 22;
    if (negative && !repeated && balance.majorEvents < 2 && domainCount < 2 && activeSevere < 4 && Math.random() < (fragile ? 0.18 : 0.42)) {
      balance.majorEvents += 1;
      balance.domainEvents[domain] = domainCount + 1;
      if (window.addConsequence && /fired|dismissed|lost your job/.test(text)) {
        window.addConsequence(character, { type: 'social_stigma', label: 'Damaged Professional Standing', detail: result.body || result.message, source: result.title, severity: fragile ? 1 : 2, yearsRemaining: 2 });
        notes.push('A professional consequence will outlast the immediate event.');
      } else if (window.addConsequence && domain === 'romance' && /betray|breakup|rejected/.test(text)) {
        window.addConsequence(character, { type: 'trauma', label: 'Relationship Wound', detail: result.body || result.message, source: result.title, severity: 1, yearsRemaining: null, recoveryNeeded: 2 });
        notes.push('The relationship left an emotional wound requiring recovery.');
      } else if (window.addConsequence && domain === 'supernatural' && /curse|haunt|backfire|possession/.test(text)) {
        window.addConsequence(character, { type: 'trauma', label: 'Supernatural Aftershock', detail: result.body || result.message, source: result.title, severity: fragile ? 1 : 2, yearsRemaining: null, recoveryNeeded: 3 });
        notes.push('The supernatural encounter left a persistent aftershock.');
      }
    }
    balance.recentSignatures.push({ signature, age: character.age });
    if (balance.recentSignatures.length > 18) balance.recentSignatures.shift();
    return notes;
  }

  function canNpcAttack(character, person) {
    const balance = ensureLifeEffects(character);
    if (balance.attacks >= 1) return false;
    if (Number.isFinite(person.lastAttackAge) && character.age - person.lastAttackAge < 2) return false;
    if ((character.stats?.vitality || 50) < 18 || (character.stats?.sanity || 50) < 15) return false;
    return true;
  }

  function registerNpcAttack(character, person) {
    const balance = ensureLifeEffects(character);
    balance.attacks += 1;
    balance.majorEvents = Math.min(2, balance.majorEvents + 1);
    person.lastAttackAge = character.age;
  }

  function consumeProtection(character, attacker) {
    const shield = activeBenefits(character, 'protection')[0] || activeBenefits(character, 'loyalty').find(item => (item.charges || 0) > 0);
    if (!shield) return null;
    if ((shield.charges || 0) <= 0 && shield.type !== 'protection') return null;
    shield.charges = Math.max(0, (shield.charges || 1) - 1);
    if (shield.type === 'protection' && shield.charges === 0) shield.active = false;
    return `${shield.source} intervened because of ${shield.label}, preventing ${attacker.name}'s attack from becoming physical.`;
  }

  function grantProtection(character, source, domain = 'social') {
    return addBenefit(character, { type: 'protection', label: `${source.name}'s Protection`, detail: 'Blocks one physical retaliation.', source: source.name, domain, charges: 1, yearsRemaining: 3 });
  }

  function tickLifeEffects(character) {
    ensureLifeEffects(character);
    const logs = [];
    activeBenefits(character).forEach(benefit => {
      benefit.yearsRemaining -= 1;
      if (benefit.type === 'mentorship') {
        character.stats.smarts = clamp((character.stats.smarts || 50) + 2);
        if (character.education?.enrolled) character.education.grades = clamp((character.education.grades || 50) + 2);
        logs.push(`${benefit.label} continued to strengthen your learning (+2% Smarts${character.education?.enrolled ? ', +2% Grades' : ''}).`);
      }
      if (benefit.yearsRemaining <= 0) {
        benefit.active = false;
        logs.push(`${benefit.label} ended, but remains part of your life history.`);
      }
    });
    return logs;
  }

  function hasRecommendation(character) {
    return activeBenefits(character, 'recommendation').length > 0;
  }

  function benefitsHtml(character) {
    ensureLifeEffects(character);
    if (!character.benefits.length) return '<p class="text-xs text-dust/70 italic">No lasting advantages earned yet.</p>';
    return character.benefits.slice(0, 10).map(item => {
      const definition = BENEFITS[item.type] || { icon: 'sparkles', color: 'text-emerald-300' };
      return `<div class="rounded-xl border border-emerald-500/25 bg-emerald-950/10 p-3 flex gap-3"><i data-lucide="${definition.icon}" class="w-4 h-4 mt-0.5 ${definition.color}"></i><div class="min-w-0 flex-1"><div class="flex justify-between gap-2"><strong class="text-xs text-parchment">${item.label}</strong><span class="text-[8px] font-mono ${item.active ? 'text-emerald-300' : 'text-dust'}">${item.active ? 'ACTIVE' : 'HISTORY'}</span></div><p class="text-[10px] text-dust mt-1">${DOMAIN_LABELS[item.domain] || 'Life'} · ${item.active ? `${item.yearsRemaining} year(s)` : `earned age ${item.acquiredAge}`}${item.charges ? ` · ${item.charges} protection` : ''}</p></div></div>`;
    }).join('');
  }

  window.ensureLifeEffects = ensureLifeEffects;
  window.addBenefit = addBenefit;
  window.getActiveBenefits = activeBenefits;
  window.processLifeOutcome = processLifeOutcome;
  window.canNpcAttack = canNpcAttack;
  window.registerNpcAttack = registerNpcAttack;
  window.consumeProtection = consumeProtection;
  window.grantProtection = grantProtection;
  window.tickLifeEffects = tickLifeEffects;
  window.hasRecommendation = hasRecommendation;
  window.benefitsHtml = benefitsHtml;
})();
