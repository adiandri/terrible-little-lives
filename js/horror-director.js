// Hidden horror escalation, truth classification, contamination, and pacing.
(function () {
  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const HORROR_WORDS = /shadow|occult|entity|curse|haunt|ghost|whisper|sigil|blood|mirror|static|unnatural|impossible|demon|ritual|séance|ouija|frost|black water|six fingers|under the porch/i;
  const DECEPTION_WORDS = /hoax|fake|scam|staged|edited|impersonat|fraud|prank/i;
  const DEVICE_WORDS = /phone|camera|monitor|screen|discord|server|internet|digital|radio|television|browser/i;
  const HOME_WORDS = /home|house|apartment|bedroom|nursery|basement|cellar|window|radiator|wall/i;
  const WORK_WORDS = /work|office|cowork|supervisor|job|shift|career/i;
  const RELATIONSHIP_WORDS = /mother|father|parent|friend|partner|date|classmate|teacher|family/i;

  function ensureHorrorDirector(character) {
    if (!character.horrorDirector || typeof character.horrorDirector !== 'object') {
      character.horrorDirector = {
        exposure: 0, attention: 0, knowledge: 0, denial: 70, contamination: 0,
        tier: 0, ageMarker: character.age, ambientCount: 0, lastGenuineAge: null,
        cooldownUntilAge: character.age, recentSignatures: [], history: [],
        contaminationMap: { relationships: 0, devices: 0, work: 0, home: 0 }
      };
    }
    const state = character.horrorDirector;
    ['exposure', 'attention', 'knowledge', 'denial', 'contamination'].forEach(key => state[key] = clamp(state[key]));
    if (!state.contaminationMap) state.contaminationMap = { relationships: 0, devices: 0, work: 0, home: 0 };
    ['relationships', 'devices', 'work', 'home'].forEach(key => state.contaminationMap[key] = clamp(state.contaminationMap[key]));
    if (!Array.isArray(state.recentSignatures)) state.recentSignatures = [];
    if (!Array.isArray(state.history)) state.history = [];
    if (!Number.isFinite(state.ageMarker)) state.ageMarker = character.age;
    if (!Number.isFinite(state.ambientCount)) state.ambientCount = 0;
    if (!Number.isFinite(state.cooldownUntilAge)) state.cooldownUntilAge = character.age;
    if (state.ageMarker !== character.age) {
      const previousAmbientCount = state.ambientCount || 0;
      state.ageMarker = character.age;
      state.ambientCount = 0;
      state.recentSignatures = state.recentSignatures.filter(item => character.age - item.age <= 4);
      state.attention = clamp(state.attention - (state.contamination >= 40 ? 0 : 2));
      state.denial = clamp(state.denial + (previousAmbientCount === 0 ? 1 : 0));
      Object.keys(state.contaminationMap).forEach(key => state.contaminationMap[key] = clamp(state.contaminationMap[key] - (previousAmbientCount === 0 ? 2 : 0)));
      state.contamination = clamp(Object.values(state.contaminationMap).reduce((sum, value) => sum + value, 0) / 4);
    }
    state.tier = calculateTier(character, state);
    return state;
  }

  function calculateTier(character, state) {
    const pressure = state.exposure * 0.32 + state.attention * 0.36 + state.contamination * 0.22 + state.knowledge * 0.1 - state.denial * 0.12;
    let tier = pressure >= 62 ? 4 : pressure >= 43 ? 3 : pressure >= 26 ? 2 : pressure >= 11 ? 1 : 0;
    if (character.age <= 3) tier = Math.min(tier, 1);
    else if (character.age <= 7) tier = Math.min(tier, 2);
    return tier;
  }

  function signatureOf(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 8).join('_');
  }

  function inferClassification(character, context = {}) {
    if (context.classification) return context.classification;
    const text = `${context.title || ''} ${context.text || ''}`;
    if (context.source === 'dark_rite' || context.genuine === true) return 'genuine_paranormal';
    if (DECEPTION_WORDS.test(text)) return 'human_deception';
    if (context.source === 'sanity' || ((character.stats?.sanity || 50) < 25 && !context.confirmed)) return 'mental_strain';
    if (!HORROR_WORDS.test(text)) return 'coincidence';
    const occultSignal = Number(context.effects?.occult || 0) + Number(context.effects?.shillings || 0) * 2;
    if (occultSignal >= 8 || /entity|ritual|curse|six fingers|impossible/i.test(text)) return 'genuine_paranormal';
    return 'coincidence';
  }

  function contaminationTargets(text) {
    const targets = [];
    if (DEVICE_WORDS.test(text)) targets.push('devices');
    if (HOME_WORDS.test(text)) targets.push('home');
    if (WORK_WORDS.test(text)) targets.push('work');
    if (RELATIONSHIP_WORDS.test(text)) targets.push('relationships');
    return targets;
  }

  function observeHorror(character, context = {}) {
    const state = ensureHorrorDirector(character);
    const text = `${context.title || ''} ${context.text || context.message || ''}`.trim();
    const classification = inferClassification(character, { ...context, text });
    const intensity = Math.max(1, Math.min(5, context.intensity || Math.ceil(Math.abs(Number(context.effects?.occult || context.effects?.sanity || 1)) / 4)));
    const engaged = context.engaged !== false;
    if (classification === 'genuine_paranormal') {
      state.exposure = clamp(state.exposure + intensity * 4);
      state.attention = clamp(state.attention + (engaged ? intensity * 4 : intensity));
      state.knowledge = clamp(state.knowledge + (context.investigated ? intensity * 3 : intensity));
      state.denial = clamp(state.denial - intensity * 3);
      if (engaged) {
        const targets = contaminationTargets(text);
        targets.forEach(target => state.contaminationMap[target] = clamp(state.contaminationMap[target] + intensity * 5));
        if (targets.length) state.contamination = clamp(state.contamination + intensity * 3);
      }
      state.lastGenuineAge = character.age;
    } else if (classification === 'mental_strain') {
      state.exposure = clamp(state.exposure + intensity);
      state.denial = clamp(state.denial - intensity);
    } else if (classification === 'human_deception') {
      state.exposure = clamp(state.exposure + 1);
      state.knowledge = clamp(state.knowledge + intensity * 2);
      state.denial = clamp(state.denial + intensity);
    } else {
      state.exposure = clamp(state.exposure + (HORROR_WORDS.test(text) ? 1 : 0));
      state.denial = clamp(state.denial + (engaged ? 0 : 2));
    }
    const signature = signatureOf(text);
    state.recentSignatures.push({ signature, age: character.age, classification });
    state.history.unshift({ age: character.age, source: context.source || 'event', classification, intensity, signature });
    if (state.history.length > 30) state.history.length = 30;
    if (state.recentSignatures.length > 18) state.recentSignatures.shift();
    state.tier = calculateTier(character, state);
    if (text && context.recordCase !== false && window.recordInvestigativeIncident) window.recordInvestigativeIncident(character, { source: context.source || 'event', title: context.title, text }, classification);
    return classification;
  }

  function isHorrorEvent(event) {
    return !!event && (event.horror === true || HORROR_WORDS.test(`${event.id || ''} ${event.title || ''} ${event.prompt || ''} ${event.text || ''}`));
  }

  function canPresentAmbient(character, event, classification = null) {
    const state = ensureHorrorDirector(character);
    if (!isHorrorEvent(event)) return true;
    const signature = signatureOf(event.id || event.text || event.prompt);
    if (state.recentSignatures.some(item => item.signature === signature && character.age - item.age <= 3)) return false;
    if (state.ambientCount >= (state.tier >= 3 ? 2 : 1)) return false;
    if (character.age < state.cooldownUntilAge) return false;
    const kind = classification || inferClassification(character, { text: event.text || event.prompt, effects: event.effects });
    if (kind === 'genuine_paranormal' && state.tier === 0 && Math.random() > 0.28) return false;
    return true;
  }

  function commitAmbient(character, event, context = {}) {
    const state = ensureHorrorDirector(character);
    const classification = observeHorror(character, { source: context.source || 'ambient', title: event.title, text: event.text || event.prompt, classification: context.classification, intensity: context.intensity || 1, engaged: false });
    state.ambientCount += 1;
    const cooldown = state.tier === 0 ? 2 : state.tier <= 2 ? 1 : 0;
    state.cooldownUntilAge = Math.max(state.cooldownUntilAge, character.age + cooldown);
    return classification;
  }

  function selectAnnualAmbient(character, pool) {
    const eligible = pool.filter(event => canPresentAmbient(character, event));
    if (!eligible.length) return null;
    const state = ensureHorrorDirector(character);
    if (state.tier === 0 && Math.random() > 0.45) return null;
    const event = eligible[Math.floor(Math.random() * eligible.length)];
    commitAmbient(character, event, { source: 'annual_ambient' });
    return event;
  }

  function filterDilemmas(character, pool) {
    const state = ensureHorrorDirector(character);
    return pool.filter(event => !isHorrorEvent(event) || canPresentAmbient(character, event) || state.tier >= 3);
  }

  function chooseDilemma(character, pool, fallbackChooser) {
    const filtered = filterDilemmas(character, pool);
    if (!filtered.length) return null;
    const state = ensureHorrorDirector(character);
    const mundane = filtered.filter(event => !isHorrorEvent(event));
    const candidates = state.tier <= 1 && mundane.length && Math.random() < 0.65 ? mundane : filtered;
    return fallbackChooser ? fallbackChooser(character, candidates) : candidates[Math.floor(Math.random() * candidates.length)];
  }

  function notePresentedDilemma(character, dilemma) {
    if (isHorrorEvent(dilemma)) commitAmbient(character, dilemma, { source: 'dilemma', intensity: 2 });
  }

  function recordOutcome(character, data = {}) {
    const text = `${data.title || ''} ${data.outcome || data.message || ''}`;
    if (!HORROR_WORDS.test(text) && !data.effects?.occult && !data.effects?.shillings) {
      if (String(data.source || '').startsWith('activity_')) {
        const state = ensureHorrorDirector(character);
        state.denial = clamp(state.denial + 1);
        state.attention = clamp(state.attention - 1);
        state.tier = calculateTier(character, state);
        return 'ordinary_life';
      }
      return null;
    }
    return observeHorror(character, {
      source: data.source || 'choice', title: data.title, text,
      effects: data.effects, genuine: data.genuine,
      engaged: data.engaged !== false, investigated: data.investigated || /investigat|study|examine|record|research/i.test(text)
    });
  }

  function directorActivityGate(character, activity) {
    if (!activity || !['paranormal', 'dark_web'].includes(activity.category)) return null;
    const state = ensureHorrorDirector(character);
    if (state.tier === 0 && /midnight_seance|ouija_board_communion/.test(activity.id) && (character.stats?.occult || 0) < 15) {
      return 'You lack enough occult knowledge to deliberately reach beyond the veil.';
    }
    return null;
  }

  // A score-free contract for future horror systems. UI should react to the
  // permitted intensity and contaminated domains, never expose the meters.
  function getDirection(character) {
    const state = ensureHorrorDirector(character);
    return {
      tier: state.tier,
      maximumIntensity: character.age <= 3 ? 1 : character.age <= 7 ? Math.min(2, state.tier + 1) : Math.min(5, state.tier + 1),
      permitsGenuineParanormal: state.tier > 0 || Math.random() < 0.28,
      availableThisYear: state.ambientCount < (state.tier >= 3 ? 2 : 1) && character.age >= state.cooldownUntilAge,
      contaminatedDomains: Object.entries(state.contaminationMap).filter(([, value]) => value >= 10).map(([key]) => key)
    };
  }

  window.ensureHorrorDirector = ensureHorrorDirector;
  window.observeHorror = observeHorror;
  window.selectAnnualAmbient = selectAnnualAmbient;
  window.filterDirectedDilemmas = filterDilemmas;
  window.chooseDirectedDilemma = chooseDilemma;
  window.notePresentedDilemma = notePresentedDilemma;
  window.recordHorrorOutcome = recordOutcome;
  window.getHorrorActivityGate = directorActivityGate;
  window.getHorrorDirection = getDirection;
})();
