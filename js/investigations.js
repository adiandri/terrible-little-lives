// Municipal Life Archive: evidence, investigators, conclusions, and persistent case files.
(function () {
  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const EVIDENCE_TYPES = {
    recording: { label: 'Recording', icon: 'audio-lines', baseCredibility: 48 },
    photograph: { label: 'Photograph', icon: 'camera', baseCredibility: 55 },
    symbol: { label: 'Symbol', icon: 'scan-line', baseCredibility: 35 },
    testimony: { label: 'Witness Testimony', icon: 'message-square-quote', baseCredibility: 42 },
    sample: { label: 'Physical Sample', icon: 'test-tube-diagonal', baseCredibility: 62 },
    document: { label: 'Document', icon: 'files', baseCredibility: 58 }
  };
  const TRUTHS = ['coincidence', 'human_deception', 'mental_strain', 'genuine_paranormal'];

  function allPeople(character) {
    const kin = character.kin || {};
    const school = character.education || {};
    const work = character.workplace || {};
    return [...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || []), ...(school.classmates || []), ...(school.teachers || []), ...(school.staff || []), ...(work.colleagues || [])]
      .filter(person => person && person.alive !== false && !person.missing);
  }

  function personId(person) {
    return person && (person.id || person.name);
  }

  function isKnownNonhuman(character, person) {
    if (!person) return false;
    if (person.replaced) return true;
    if (person.isRevealed && person.entityType && person.entityType !== 'human') return true;
    const id = personId(person);
    return !!character.entitySystem?.entities?.some(entity => entity.known !== false && entity.sourcePersonId === id);
  }

  function investigationPeople(character) {
    return allPeople(character).filter(person => !isKnownNonhuman(character, person));
  }

  function ensureInvestigationSystem(character) {
    if (!character.investigationSystem || typeof character.investigationSystem !== 'object') character.investigationSystem = {};
    const system = character.investigationSystem;
    if (!Array.isArray(system.evidence)) system.evidence = [];
    if (!Array.isArray(system.cases)) system.cases = [];
    if (!Array.isArray(system.incidentLedger)) system.incidentLedger = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!Number.isFinite(system.institutionAttention)) system.institutionAttention = 0;
    if (!Number.isFinite(system.lastTickAge)) system.lastTickAge = character.age;
    system.institutionAttention = clamp(system.institutionAttention);
    system.cases.forEach(file => {
      if (!Array.isArray(file.incidents)) file.incidents = [];
      if (!Array.isArray(file.evidenceIds)) file.evidenceIds = [];
      if (!Array.isArray(file.investigators)) file.investigators = [];
      if (!Array.isArray(file.publications)) file.publications = [];
      if (!Number.isFinite(file.analysis)) file.analysis = 0;
      file.investigators.forEach(investigator => {
        const person = allPeople(character).find(candidate => personId(candidate) === investigator.personId);
        if (investigator.active && person && isKnownNonhuman(character, person)) {
          investigator.active = false;
          investigator.removalReason = 'Identity confirmed as nonhuman';
        }
      });
    });
    return system;
  }

  function truthLabel(truth) {
    return String(truth || 'unresolved').replace(/_/g, ' ');
  }

  function ensureCaseForEntity(character, entity) {
    const system = ensureInvestigationSystem(character);
    let file = system.cases.find(item => item.entityId === entity.id);
    if (file) return file;
    file = {
      id: `case_${Date.now()}_${system.sequence++}`,
      title: `The ${entity.name} File`, status: 'open', openedAge: character.age,
      entityId: entity.id, entityName: entity.name, truth: 'genuine_paranormal',
      attachment: { ...entity.attachment }, incidents: [], evidenceIds: [], investigators: [],
      analysis: 0, conclusion: null, publications: [], lastUpdatedAge: character.age
    };
    file.incidents.push({ age: character.age, title: 'Entity identified', detail: `${entity.name}, a ${entity.typeName}, was linked to ${entity.attachment?.label || character.name}.` });
    system.cases.unshift(file);
    return file;
  }

  function incidentKey(data) {
    const text = `${data.title || ''} ${data.text || data.outcome || ''}`.toLowerCase();
    if (/phone|screen|camera|radio|recording|static/.test(text)) return 'signals_and_recordings';
    if (/home|house|bedroom|nursery|basement|door|window/.test(text)) return 'domestic_disturbances';
    if (/family|ancestor|bloodline|parent|sibling/.test(text)) return 'family_pattern';
    if (/school|teacher|classmate|student/.test(text)) return 'school_incidents';
    if (/work|office|cowork|job/.test(text)) return 'workplace_incidents';
    return String(data.title || 'unclassified_incident').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 48);
  }

  function recordIncident(character, data = {}, classification = 'coincidence') {
    if (!TRUTHS.includes(classification)) classification = 'coincidence';
    const system = ensureInvestigationSystem(character);
    const incident = {
      id: `incident_${Date.now()}_${system.sequence++}`, age: character.age,
      title: data.title || 'Unclassified Incident', detail: data.text || data.outcome || data.message || '',
      classification, key: incidentKey(data), source: data.source || 'unknown'
    };
    system.incidentLedger.unshift(incident);
    if (system.incidentLedger.length > 40) system.incidentLedger.length = 40;
    let file = system.cases.find(item => !item.entityId && item.key === incident.key && item.status !== 'closed');
    const relatedCount = system.incidentLedger.filter(item => item.key === incident.key).length;
    if (!file && (classification === 'genuine_paranormal' || relatedCount >= 2)) {
      const related = system.incidentLedger.filter(item => item.key === incident.key).reverse();
      const truth = related.some(item => item.classification === 'genuine_paranormal') ? 'genuine_paranormal'
        : related.some(item => item.classification === 'human_deception') ? 'human_deception'
          : related.some(item => item.classification === 'mental_strain') ? 'mental_strain' : 'coincidence';
      file = {
        id: `case_${Date.now()}_${system.sequence++}`, title: `${String(incident.key).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
        status: 'open', openedAge: related[0]?.age ?? character.age, key: incident.key, truth,
        incidents: related, evidenceIds: [], investigators: [], analysis: 0, conclusion: null,
        publications: [], lastUpdatedAge: character.age
      };
      if (truth === 'human_deception') {
        const possibleCulprits = investigationPeople(character);
        const culprit = possibleCulprits.length ? pick(possibleCulprits) : null;
        file.actualCulpritId = culprit ? (culprit.id || culprit.name) : null;
      }
      system.cases.unshift(file);
    }
    if (file && !file.incidents.some(item => item.id === incident.id)) {
      file.incidents.push(incident); file.lastUpdatedAge = character.age;
    }
    return file;
  }

  function createEvidence(character, file, options = {}) {
    const system = ensureInvestigationSystem(character);
    const type = EVIDENCE_TYPES[options.type] ? options.type : pick(Object.keys(EVIDENCE_TYPES));
    const meta = EVIDENCE_TYPES[type];
    const skill = ((character.stats?.smarts || 50) + (character.stats?.occult || 0)) / 2;
    const genuine = file.truth === 'genuine_paranormal';
    const authenticity = clamp(options.authenticity ?? (genuine ? 62 + Math.random() * 34 : 20 + Math.random() * 55));
    const contamination = clamp(options.contamination ?? (genuine ? 25 + Math.random() * 65 : Math.random() * 25));
    const danger = clamp(options.danger ?? (contamination * 0.55 + (genuine ? Math.random() * 30 : 0)));
    const credibility = clamp(options.credibility ?? (meta.baseCredibility * 0.55 + authenticity * 0.25 + skill * 0.2 - contamination * 0.12));
    const evidence = {
      id: `evidence_${Date.now()}_${system.sequence++}`, caseId: file.id, type,
      label: options.label || `${meta.label}: ${file.entityName || file.title}`,
      description: options.description || evidenceDescription(type, file), collectedAge: character.age,
      collectorId: options.collectorId || 'player', authenticity, contamination, danger, credibility,
      analyzed: false, sourceIncidentId: options.sourceIncidentId || file.incidents.at(-1)?.id || null
    };
    system.evidence.unshift(evidence);
    file.evidenceIds.push(evidence.id); file.lastUpdatedAge = character.age;
    if (file.status === 'published') file.status = 'reopened';
    return evidence;
  }

  function evidenceDescription(type, file) {
    const subject = file.entityName || file.title;
    const descriptions = {
      recording: `A recording containing irregular sound associated with ${subject}.`,
      photograph: `A photograph showing an inconsistency near ${subject}.`,
      symbol: `A copied symbol repeatedly found around the linked incidents.`,
      testimony: `A signed account from someone who claims to have witnessed the pattern.`,
      sample: `A sealed physical residue recovered from the affected location.`,
      document: `An archived document that appears to connect earlier incidents to the present case.`
    };
    return descriptions[type];
  }

  function investigate(character, caseId, mode = 'alone') {
    const system = ensureInvestigationSystem(character);
    const file = system.cases.find(item => item.id === caseId);
    if (!file) return { success: false, reason: 'The case file could not be found.' };
    const recruited = file.investigators.filter(item => item.active);
    const bonus = mode === 'team' ? recruited.reduce((sum, item) => sum + item.contribution, 0) / Math.max(1, recruited.length) : 0;
    if (mode === 'team' && !recruited.length) return { success: false, reason: 'Recruit at least one willing investigator first.' };
    const types = file.incidents.length >= 2 ? Object.keys(EVIDENCE_TYPES) : ['recording', 'photograph', 'symbol', 'sample'];
    if (mode === 'team' && !types.includes('testimony')) types.push('testimony');
    const evidence = createEvidence(character, file, { type: pick(types), credibility: undefined });
    evidence.credibility = clamp(evidence.credibility + bonus * 0.18);
    file.analysis = clamp(file.analysis + 3 + bonus * 0.08);
    if (window.observeHorror && file.truth === 'genuine_paranormal') window.observeHorror(character, { source: 'investigation', text: evidence.description, genuine: true, investigated: true, intensity: evidence.danger >= 65 ? 3 : 1, engaged: true, recordCase: false });
    return { success: true, title: mode === 'team' ? 'Team Investigation' : 'Solo Investigation', message: `Collected ${EVIDENCE_TYPES[evidence.type].label.toLowerCase()} evidence for “${file.title}.”`, effects: { smarts: 2, occult: file.truth === 'genuine_paranormal' ? 2 : 0, sanity: evidence.danger >= 55 ? -2 : 0 }, evidence, file };
  }

  function recruit(character, caseId, personId) {
    const system = ensureInvestigationSystem(character);
    const file = system.cases.find(item => item.id === caseId);
    const person = investigationPeople(character).find(item => (item.id || item.name) === personId);
    if (!file || !person) return { success: false, reason: 'That potential investigator is unavailable.' };
    if (file.investigators.some(item => item.personId === personId && item.active)) return { success: false, reason: `${person.name} is already helping with this case.` };
    const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { trust: Math.round((person.relationship || 50) * 0.8), resentment: 0, fear: 0 };
    const personality = window.ensureNpcPersonality ? window.ensureNpcPersonality(person) : (person.personality || { empathy: 40, composure: 40, aggression: 30 });
    const danger = averageEvidence(file, system, 'danger');
    const willingness = (person.relationship || 50) * 0.25 + mind.trust * 0.35 + (personality.empathy || 40) * 0.2 + (personality.composure || 40) * 0.15 - mind.resentment * 0.3 - danger * 0.18;
    if (Math.random() * 100 > willingness) {
      person.suspicion = clamp((person.suspicion || 0) + 4);
      return { success: false, reason: `${person.name} refused. They do not trust you enough to risk becoming part of this case.` };
    }
    const contribution = clamp((person.smarts || 40) * 0.45 + (person.credibility || 40) * 0.3 + (personality.composure || 40) * 0.25);
    file.investigators.push({ personId, name: person.name, joinedAge: character.age, contribution, active: true });
    person.relationship = clamp((person.relationship || 50) + 2);
    if (Array.isArray(person.memories)) person.memories.unshift({ action: 'joined_investigation', tone: 'neutral', severity: 2, summary: `Joined the investigation into ${file.title}`, age: character.age });
    return { success: true, title: 'Investigator Recruited', message: `${person.name} agreed to investigate “${file.title}.” Trust got them through the door; their temperament will determine how useful they are.`, effects: { relationship: 2 }, person, file };
  }

  function averageEvidence(file, system, field) {
    const evidence = system.evidence.filter(item => file.evidenceIds.includes(item.id));
    return evidence.length ? evidence.reduce((sum, item) => sum + (item[field] || 0), 0) / evidence.length : 0;
  }

  function analyze(character, caseId) {
    const system = ensureInvestigationSystem(character);
    const file = system.cases.find(item => item.id === caseId);
    if (!file || !file.evidenceIds.length) return { success: false, reason: 'Collect evidence before attempting analysis.' };
    const evidence = system.evidence.filter(item => file.evidenceIds.includes(item.id) && !item.analyzed);
    if (!evidence.length) return { success: false, reason: 'Every current item has already been analyzed.' };
    const skill = ((character.stats?.smarts || 50) * 0.65 + (character.stats?.occult || 0) * 0.35);
    evidence.forEach(item => {
      item.analyzed = true;
      item.credibility = clamp(item.credibility + skill * 0.12 - item.contamination * 0.05);
    });
    file.analysis = clamp(file.analysis + 8 + skill * 0.12);
    return { success: true, title: 'Evidence Analyzed', message: `Cross-referenced ${evidence.length} item${evidence.length === 1 ? '' : 's'}. The case is now ${Math.round(file.analysis)}% analyzed.`, effects: { smarts: 3 }, file };
  }

  function conclude(character, caseId, conclusion, suspectId = null) {
    const system = ensureInvestigationSystem(character);
    const file = system.cases.find(item => item.id === caseId);
    if (!file || !TRUTHS.includes(conclusion)) return { success: false, reason: 'That conclusion cannot be filed.' };
    let suspect = null;
    if (conclusion === 'human_deception') {
      suspect = investigationPeople(character).find(item => (item.id || item.name) === suspectId);
      if (!suspect) return { success: false, reason: 'Name the person you believe staged the incidents.' };
    }
    const suspectCorrect = conclusion !== 'human_deception' || !file.actualCulpritId || (suspect && (suspect.id || suspect.name) === file.actualCulpritId);
    file.conclusion = { type: conclusion, label: truthLabel(conclusion), filedAge: character.age, suspectId: suspect && (suspect.id || suspect.name), suspectName: suspect?.name || null, correct: conclusion === file.truth && suspectCorrect };
    file.status = 'concluded'; file.lastUpdatedAge = character.age;
    return { success: true, title: 'Conclusion Filed', message: `You filed ${truthLabel(conclusion)} as the explanation${suspect ? ` and named ${suspect.name}` : ''}. The archive accepted the form; truth will have to survive what happens next.`, effects: {}, file };
  }

  function publish(character, caseId, mode = 'public') {
    const system = ensureInvestigationSystem(character);
    const file = system.cases.find(item => item.id === caseId);
    if (!file || !file.conclusion) return { success: false, reason: 'File a conclusion before releasing the case.' };
    const evidence = system.evidence.filter(item => file.evidenceIds.includes(item.id));
    if (!evidence.length) return { success: false, reason: 'A conclusion without evidence cannot be released.' };
    if (file.publications.some(item => item.mode === mode && item.conclusion === file.conclusion.type && item.evidenceCount === evidence.length)) return { success: false, reason: `This version has already been released to the ${mode === 'institution' ? 'institution' : 'public'}. Collect new evidence or revise the conclusion first.` };
    const credibility = averageEvidence(file, system, 'credibility');
    const authenticity = averageEvidence(file, system, 'authenticity');
    const strength = clamp(credibility * 0.42 + authenticity * 0.28 + file.analysis * 0.2 + Math.min(10, evidence.length * 2));
    const falseAccusation = file.conclusion.type === 'human_deception' && !file.conclusion.correct;
    let message = '', effects = {};
    if (falseAccusation) {
      const person = allPeople(character).find(item => (item.id || item.name) === file.conclusion.suspectId);
      if (person) {
        person.relationship = clamp((person.relationship || 50) - 25);
        const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : null;
        if (mind) { mind.resentment = clamp(mind.resentment + 35); mind.trust = clamp(mind.trust - 30); }
      }
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: -14, notoriety: 16 }, `Falsely implicated ${file.conclusion.suspectName || 'an innocent person'}`);
      message = `Your release implicated ${file.conclusion.suspectName}. The evidence did not support the accusation, and the damage spread faster than the correction.`;
      effects = { happiness: -5, humanity: -4 };
    } else if (strength < 55) {
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: -8, notoriety: 10 }, `Published weak evidence in ${file.title}`);
      message = `The ${mode === 'institution' ? 'institution' : 'public'} dismissed your ${strength}% case as poorly supported. Screenshots of your weakest evidence circulated without context.`;
      effects = { happiness: -4 };
    } else {
      const attention = strength >= 75 ? 22 : 12;
      system.institutionAttention = clamp(system.institutionAttention + attention);
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: strength >= 75 ? 8 : 4, notoriety: attention }, `Released credible evidence in ${file.title}`);
      message = strength >= 75
        ? `The evidence survived hostile review. A restricted institution opened its own file and requested the originals.`
        : `The case earned cautious attention, though several gaps remain contested.`;
      effects = { smarts: 3, occult: file.truth === 'genuine_paranormal' ? 3 : 0 };
      if (file.entityId) {
        const entity = character.entitySystem?.entities?.find(item => item.id === file.entityId);
        if (entity) {
          entity.exposed = true; entity.loyalty = clamp(entity.loyalty - Math.ceil(attention / 2));
          if (strength >= 75) entity.state = entity.state === 'protective' ? 'offended' : 'hunting';
          entity.memories.unshift({ age: character.age, action: 'documented', detail: `You assembled a ${strength}% case and attracted institutional attention.` });
        }
        if (window.observeHorror) window.observeHorror(character, { source: 'published_evidence', text: `Strong evidence exposed an entity and attracted investigators.`, genuine: true, intensity: strength >= 75 ? 4 : 2, engaged: true, recordCase: false });
      }
    }
    file.publications.push({ age: character.age, mode, strength, conclusion: file.conclusion.type, falseAccusation, evidenceCount: evidence.length });
    file.status = 'published'; file.lastUpdatedAge = character.age;
    return { success: true, title: mode === 'institution' ? 'Archive Submission' : 'Public Release', message, effects, strength, file };
  }

  function evidenceForCase(character, caseId) {
    const system = ensureInvestigationSystem(character);
    return system.evidence.filter(item => item.caseId === caseId);
  }

  function tickInvestigations(character) {
    const system = ensureInvestigationSystem(character);
    if (system.lastTickAge === character.age) return [];
    system.lastTickAge = character.age;
    const logs = [];
    system.institutionAttention = clamp(system.institutionAttention - 2);
    const dangerous = system.evidence.filter(item => item.contamination >= 60 && item.danger >= 55);
    if (dangerous.length && Math.random() < Math.min(0.45, dangerous.length * 0.08)) {
      const item = pick(dangerous);
      character.stats.sanity = clamp((character.stats.sanity || 50) - 2);
      item.contamination = clamp(item.contamination + 4);
      logs.push(`Contaminated evidence from “${item.label}” changed inside its archive sleeve (-2% Sanity).`);
      if (window.observeHorror) window.observeHorror(character, { source: 'evidence_contamination', text: item.description, genuine: true, intensity: 2, engaged: false, recordCase: false });
    }
    if (system.institutionAttention >= 35 && Math.random() < 0.35) {
      logs.push(pick([
        'An unmarked institutional envelope requested chain-of-custody records you never publicly mentioned.',
        'Two municipal archivists photographed your residence, then denied knowing your case number.',
        'A restricted database assigned your evidence a clearance level you cannot access.'
      ]));
    }
    system.cases.forEach(file => {
      const danger = averageEvidence(file, system, 'danger');
      file.investigators.filter(item => item.active).forEach(investigator => {
        const person = investigationPeople(character).find(candidate => (candidate.id || candidate.name) === investigator.personId);
        if (!person) { investigator.active = false; return; }
        const mind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { trust: 40, fear: 0 };
        if (danger > 65 && (mind.trust || 0) + (person.relationship || 50) - (mind.fear || 0) < 70 && Math.random() < 0.3) {
          investigator.active = false;
          logs.push(`${person.name} withdrew from “${file.title}” after the evidence began affecting their sleep.`);
        }
      });
    });
    return logs;
  }

  window.EVIDENCE_TYPES = EVIDENCE_TYPES;
  window.ensureInvestigationSystem = ensureInvestigationSystem;
  window.ensureCaseForEntity = ensureCaseForEntity;
  window.recordInvestigativeIncident = recordIncident;
  window.collectCaseEvidence = investigate;
  window.recruitCaseInvestigator = recruit;
  window.analyzeCaseEvidence = analyze;
  window.fileCaseConclusion = conclude;
  window.publishCaseFile = publish;
  window.getEvidenceForCase = evidenceForCase;
  window.getInvestigationPeople = investigationPeople;
  window.tickInvestigations = tickInvestigations;
})();
