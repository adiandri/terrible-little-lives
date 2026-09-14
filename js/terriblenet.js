// TerribleNet: persistent social media, rumor propagation, digital horror, and online consequences.
(function () {
  'use strict';

  const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const uid = (prefix, system) => `${prefix}_${Date.now()}_${system.sequence++}`;
  const PLATFORMS = {
    chatterbox: { name: 'Chatterbox', icon: 'messages-square', color: 'sky', minAge: 10, audience: 'public', formats: ['post', 'image', 'video', 'livestream', 'message'], desc: 'Public posts, relatives, classmates, employers, and arguments that refuse to die.' },
    vesper: { name: 'Vesper', icon: 'aperture', color: 'rose', minAge: 13, audience: 'public', formats: ['image', 'video', 'livestream', 'message'], desc: 'Images, livestreams, sponsorships, and carefully lit unreality.' },
    hush: { name: 'Hush', icon: 'venetian-mask', color: 'violet', minAge: 11, audience: 'school', formats: ['post', 'image', 'message'], desc: 'Anonymous local confessions, accusations, exclusions, and rumors.' },
    wakewatch: { name: 'WakeWatch', icon: 'video', color: 'amber', minAge: 15, audience: 'public', formats: ['post', 'video', 'livestream', 'message'], desc: 'Paranormal footage, debunkers, investigators, and things watching playback.' },
    underthread: { name: 'The Underthread', icon: 'network', color: 'purple', minAge: 15, audience: 'public', inviteOnly: true, formats: ['post', 'image', 'video', 'message'], desc: 'Invitation-only occult discussion. Members trade names, methods, and obligations.' },
    blackglass: { name: 'Blackglass', icon: 'shopping-bag', color: 'red', minAge: 16, audience: 'public', inviteOnly: true, market: true, desc: 'Dark-web auctions for objects, records, rituals, services, and dangerous information.' },
    morrow: { name: 'Morrow', icon: 'heart', color: 'pink', minAge: 18, audience: 'public', dating: true, formats: ['image', 'message'], desc: 'Dating profiles, private messages, catfish, romance, and fixation.' },
    archive: { name: 'LittleLives Archive', icon: 'book-heart', color: 'slate', minAge: 10, audience: 'family', memorial: true, desc: 'Municipal memorial profiles. The deceased occasionally revise their biographies.' }
  };
  const CONTENT_TYPES = ['post', 'image', 'video', 'livestream', 'message'];
  const TONES = {
    ordinary: { label: 'Ordinary update', esteem: 0, fear: 0, controversy: 4 },
    kind: { label: 'Supportive / kind', esteem: 3, fear: 0, controversy: 2 },
    promotional: { label: 'Promotional', esteem: -1, fear: 0, controversy: 8 },
    confession: { label: 'Personal confession', esteem: 1, fear: 0, controversy: 28 },
    cruel: { label: 'Mock or expose someone', esteem: -7, fear: 3, controversy: 68 },
    paranormal: { label: 'Paranormal claim', esteem: -2, fear: 3, controversy: 48 },
    warning: { label: 'Public warning', esteem: 2, fear: 1, controversy: 34 }
  };
  const BLACKGLASS_LISTINGS = [
    { id: 'cursed_mirror', name: 'Mirror With Previous Owner', kind: 'object', cost: 850, danger: 72, desc: 'Seller guarantees the previous owner remains visible.' },
    { id: 'stolen_records', name: 'Sealed Municipal Records', kind: 'records', cost: 420, danger: 38, desc: 'Births, deaths, admissions, and three pages that predate the city.' },
    { id: 'ritual_bundle', name: 'Unmarked Ritual Bundle', kind: 'materials', cost: 300, danger: 26, desc: 'Blood, grave soil, black tallow, and a personal link with no listed owner.' },
    { id: 'erase_service', name: 'Reputation Burial Service', kind: 'service', cost: 1200, danger: 55, desc: 'Suppresses search results by manufacturing a louder scandal about someone else.' },
    { id: 'name_of_thing', name: 'The Name Behind Your Screen', kind: 'information', cost: 666, danger: 91, desc: 'A text file that notices when it is understood.' }
  ];

  function allPeople(character) {
    if (window.getAllPotentialTargets) return window.getAllPotentialTargets(character).map(item => item.raw).filter(Boolean);
    const kin = character.kin || {};
    return [...(kin.parents || []), ...(kin.siblings || []), ...(kin.friends || [])].filter(Boolean);
  }

  function personId(person) { return person && (person.id || person.storyPersonId || person.name); }

  function ensureTerribleNet(character) {
    if (!character.terribleNet || typeof character.terribleNet !== 'object') character.terribleNet = {};
    const system = character.terribleNet;
    if (!system.accounts) system.accounts = {};
    if (!Array.isArray(system.posts)) system.posts = [];
    if (!Array.isArray(system.messages)) system.messages = [];
    if (!Array.isArray(system.screenshots)) system.screenshots = [];
    if (!Array.isArray(system.digitalIncidents)) system.digitalIncidents = [];
    if (!Array.isArray(system.purchases)) system.purchases = [];
    if (!Array.isArray(system.memorials)) system.memorials = [];
    if (!Number.isFinite(system.sequence)) system.sequence = 1;
    if (!Number.isFinite(system.lastTickAge)) system.lastTickAge = character.age;
    if (!Number.isFinite(system.threatCooldownUntil)) system.threatCooldownUntil = -1;
    refreshInvitations(character, system);
    refreshMemorials(character, system);
    Object.values(system.accounts).forEach(account => {
      account.followers = Math.max(0, Number(account.followers) || 0);
      account.credibility = clamp(account.credibility ?? 50);
      account.notoriety = clamp(account.notoriety || 0);
      account.parasocial = clamp(account.parasocial || 0);
    });
    return system;
  }

  function refreshInvitations(character, system) {
    const occult = character.stats?.occult || 0;
    const entityLoyalty = (character.entitySystem?.entities || []).some(entity => (entity.loyalty || 0) >= 45 || entity.state === 'protective');
    if (occult >= 25 || entityLoyalty) system.underthreadInvite = true;
    if (occult >= 38 || system.purchases.length || (character.shillings || 0) >= 12) system.blackglassInvite = true;
  }

  function refreshMemorials(character, system) {
    const kin = character.kin || {};
    const dead = [...(kin.parents || []), ...(kin.siblings || []), ...(kin.grandparents || []), ...(kin.friends || [])].filter(person => person && person.alive === false);
    dead.forEach(person => {
      if (!system.memorials.some(item => item.personId === personId(person))) {
        system.memorials.unshift({ id: uid('memorial', system), personId: personId(person), name: person.name, createdAge: character.age, updates: [], followed: true });
      }
    });
  }

  function platformAccess(character, platformId) {
    const system = ensureTerribleNet(character);
    const platform = PLATFORMS[platformId];
    if (!platform) return { allowed: false, reason: 'Unknown network.' };
    if (character.age < platform.minAge) return { allowed: false, reason: `Available at age ${platform.minAge}.` };
    if (platformId === 'underthread' && !system.underthreadInvite) return { allowed: false, reason: 'Invitation required. Occult contacts may eventually provide one.' };
    if (platformId === 'blackglass' && !system.blackglassInvite) return { allowed: false, reason: 'No valid invitation token has found your device.' };
    return { allowed: true };
  }

  function createAccount(character, platformId, anonymous = false) {
    const system = ensureTerribleNet(character);
    const access = platformAccess(character, platformId);
    if (!access.allowed) return { success: false, reason: access.reason };
    if (system.accounts[platformId]) return { success: true, title: 'Account Already Active', message: `Your ${PLATFORMS[platformId].name} identity is already connected.`, account: system.accounts[platformId] };
    const publicRep = window.ensureReputation ? window.ensureReputation(character).public : { esteem: 50, notoriety: 0 };
    const account = {
      platformId, handle: anonymous || platformId === 'hush' ? `mourner_${Math.floor(Math.random() * 9000 + 1000)}` : (String(character.name || 'resident').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18) || `resident_${Math.floor(Math.random() * 9000 + 1000)}`),
      anonymous: anonymous || platformId === 'hush', createdAge: character.age, followers: Math.max(0, Math.round((publicRep.notoriety || 0) * 3)),
      credibility: clamp(42 + (publicRep.esteem || 50) * 0.25), notoriety: clamp(publicRep.notoriety || 0), parasocial: 0,
      monetized: false, bannedUntil: null, lastPostAge: null
    };
    system.accounts[platformId] = account;
    return { success: true, title: `${PLATFORMS[platformId].name} Account Created`, message: `@${account.handle} is now active. Anonymous does not mean untraceable.`, account };
  }

  function createPost(character, data = {}) {
    const system = ensureTerribleNet(character);
    const platform = PLATFORMS[data.platformId];
    const account = system.accounts[data.platformId];
    if (!platform || !account) return { success: false, reason: 'Create an account on that platform first.' };
    if (platform.market || platform.memorial) return { success: false, reason: `${platform.name} does not accept ordinary user publishing.` };
    if (account.bannedUntil && account.bannedUntil > character.age) return { success: false, reason: `The account is suspended until age ${account.bannedUntil}.` };
    if ((character.actionsLeft || 0) < 1) return { success: false, reason: 'You need 1 Energy to publish.' };
    const type = CONTENT_TYPES.includes(data.type) ? data.type : 'post';
    if (platform.formats && !platform.formats.includes(type)) return { success: false, reason: `${platform.name} does not support ${type} publishing.` };
    const toneId = TONES[data.tone] ? data.tone : 'ordinary';
    const tone = TONES[toneId];
    const target = allPeople(character).find(person => personId(person) === data.targetId) || null;
    const text = String(data.text || '').trim().slice(0, 400);
    if (text.length < 3) return { success: false, reason: 'Write something before publishing.' };
    if (toneId === 'cruel' && !target) return { success: false, reason: 'Choose who the post targets.' };
    if (type === 'message' && !target) return { success: false, reason: 'Choose who receives the private message.' };
    character.actionsLeft -= 1;

    if (type === 'message') return sendDirectMessage(character, system, account, platform, target, toneId, text);

    const publicRep = window.ensureReputation ? window.ensureReputation(character).public : { esteem: 50, notoriety: 0 };
    const baseReach = 8 + account.followers * 0.12 + account.notoriety * 2 + (publicRep.notoriety || 0) * 2;
    const formatBoost = type === 'livestream' ? 1.8 : type === 'video' ? 1.5 : type === 'image' ? 1.25 : 1;
    let reach = Math.max(3, Math.round(baseReach * formatBoost * (0.55 + Math.random())));
    if (data.platformId === 'vesper' && ['image', 'video', 'livestream'].includes(type)) reach = Math.round(reach * 1.45);
    if (data.platformId === 'wakewatch' && toneId === 'paranormal') reach = Math.round(reach * 1.7);
    if (data.platformId === 'hush' && ['confession', 'cruel'].includes(toneId)) reach = Math.round(reach * 1.35);
    const viralChance = Math.min(0.24, 0.015 + tone.controversy / 700 + (type === 'video' || type === 'livestream' ? 0.035 : 0) + account.notoriety / 900);
    if (Math.random() < viralChance) reach *= 8 + Math.floor(Math.random() * 18);
    const genuine = toneId === 'paranormal' && determineGenuine(character);
    const evidenceStrength = toneId === 'paranormal' ? clamp((character.stats?.smarts || 40) * 0.35 + (character.stats?.occult || 0) * 0.35 + (type === 'video' || type === 'livestream' ? 24 : 5) + Math.random() * 20) : 0;
    const post = {
      id: uid('post', system), platformId: data.platformId, type, tone: toneId, text, targetId: personId(target), targetName: target?.name || null,
      createdAge: character.age, reach, reactions: [], deleted: false, screenshotted: false, genuine, evidenceStrength,
      viral: reach >= 250, moderation: 'visible', effectApplied: false
    };
    system.posts.unshift(post); account.lastPostAge = character.age;
    if (post.viral || tone.controversy >= 55) preserveScreenshot(system, post, tone.controversy);
    resolveAudience(character, post, account, target);
    if (toneId === 'paranormal') resolveParanormalPost(character, post, account);
    if (data.platformId === 'underthread' && toneId === 'paranormal') {
      const payment = post.evidenceStrength >= 60 ? 2 : 1;
      character.shillings = (character.shillings || 0) + payment;
      account.credibility = clamp(account.credibility + (post.genuine ? 4 : -3));
      system.blackglassInvite = system.blackglassInvite || post.evidenceStrength >= 70;
    }
    if (data.platformId === 'hush' && ['cruel', 'confession'].includes(toneId) && Math.random() < Math.min(0.65, 0.12 + reach / 700)) {
      post.identityExposed = true; account.anonymous = false;
      system.messages.unshift(systemMessage(character, 'hush', 'ANONYMITY FAILURE', `Several local users connected @${account.handle} to your real identity through posting times, contacts, and reused phrasing.`));
      if (window.alterReputation) window.alterReputation(character, 'school', { esteem: -5, notoriety: 8 }, 'Hush identity exposed');
    }
    const income = calculatePostIncome(character, post, account);
    if (income > 0) character.money = (character.money || 0) + income;
    if (system.posts.length > 80) system.posts.length = 80;
    const summary = `${platform.name} showed it to roughly ${reach} people. ${post.reactions.filter(item => item.believed).length} known contacts believed or supported it, ${post.reactions.filter(item => !item.believed).length} rejected it.${income ? ` It earned ${formatMoney(income, character)}.` : ''}${data.platformId === 'underthread' && toneId === 'paranormal' ? ' Occult readers paid in Shillings.' : ''}${post.identityExposed ? ' Hush users identified the anonymous author.' : ''}`;
    return { success: true, title: post.viral ? 'Post Escaped Containment' : `${platform.name} Post Published`, message: summary, post, effects: { money: income } };
  }

  function sendDirectMessage(character, system, account, platform, target, toneId, text) {
    const outgoing = { id: uid('message', system), platformId: account.platformId, senderId: 'player', senderName: `@${account.handle}`, recipientId: personId(target), recipientName: target.name, subject: `Private message to ${target.name}`, body: text, age: character.age, read: true, outgoing: true, resolved: true };
    system.messages.unshift(outgoing);
    const memory = window.ensureNpcMemory ? window.ensureNpcMemory(target) : { trust: target.relationship || 50, resentment: 0, fear: 0 };
    const tone = TONES[toneId];
    const welcomed = (memory.trust || 0) + (target.relationship || 50) + tone.esteem * 4 - (memory.resentment || 0) > 90;
    target.relationship = clamp((target.relationship || 50) + (welcomed ? Math.max(1, tone.esteem) : toneId === 'cruel' ? -8 : -2));
    let replyText = welcomed ? pick(['I’m glad you told me privately.', 'Thank you. I trust this stays between us.', 'I was hoping you would message.']) : pick(['Do not contact me like this again.', 'I screenshotted this.', 'I don’t believe you—and I’m showing someone else.']);
    if (toneId === 'paranormal') replyText = welcomed ? 'I have seen it too. Do not send the name in plain text.' : 'This is not funny. I forwarded it to someone who can check.';
    const reply = { id: uid('message', system), platformId: account.platformId, senderId: personId(target), senderName: target.name, subject: `Re: Private message`, body: replyText, age: character.age, read: false, resolved: false };
    system.messages.unshift(reply);
    if (!welcomed || toneId === 'cruel') {
      const fakePost = { id: uid('private_copy', system), platformId: account.platformId, type: 'message', tone: toneId, text, targetName: target.name, createdAge: character.age, deleted: true, screenshotted: true };
      system.screenshots.unshift({ id: uid('shot', system), postId: fakePost.id, platformId: account.platformId, text, targetName: target.name, capturedAge: character.age, circulating: Math.random() < 0.55 });
      if (toneId === 'cruel' && window.createRumor) window.createRumor(character, { source: target, witnesses: [], audience: platform.audience, severity: 2, evidence: 82, claim: `${target.name} shared a hostile private message sent by @${account.handle}.` });
    }
    if (account.platformId === 'morrow' && Math.random() < 0.12) addThreat(character, 'catfishing');
    return { success: true, title: `Message Sent to ${target.name}`, message: `${target.name} replied: “${replyText}” Private messages can become public evidence.`, messageRecord: outgoing };
  }

  function determineGenuine(character) {
    const director = character.horrorDirector || {};
    const supernaturalWeight = ((director.exposure || 0) + (director.attention || 0) + (director.contamination || 0)) / 300;
    return Math.random() < 0.18 + supernaturalWeight * 0.62;
  }

  function resolveAudience(character, post, account, target) {
    const platform = PLATFORMS[post.platformId];
    const tone = TONES[post.tone];
    const people = allPeople(character).filter(person => person.alive !== false && !person.missing);
    const count = Math.min(people.length, Math.max(1, Math.round(1 + post.reach / 100)));
    const viewers = people.sort(() => Math.random() - 0.5).slice(0, count);
    viewers.forEach(person => {
      const memory = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { trust: person.relationship || 50, resentment: 0, fear: 0 };
      const personality = window.ensureNpcPersonality ? window.ensureNpcPersonality(person) : (person.personality || {});
      let belief = account.credibility * 0.45 + (memory.trust || 0) * 0.32 + (person.credibility || 40) * 0.12;
      if (post.tone === 'paranormal') belief += (personality.openness || personality.curiosity || 35) * 0.25 - (personality.composure || 40) * 0.08;
      if (account.anonymous) belief -= 15;
      const believed = Math.random() * 100 < belief;
      let reaction = believed ? (tone.esteem >= 0 ? 'support' : 'believe') : 'dismiss';
      if (post.tone === 'cruel' && target) {
        const takesTargetSide = window.witnessDecision ? window.witnessDecision(character, person, target) === 'instigator' : (person.relationship || 50) < 45;
        reaction = takesTargetSide ? 'pile_on' : 'defend_target';
        person.relationship = clamp((person.relationship || 50) + (takesTargetSide ? -1 : -3));
      } else if (!account.anonymous) {
        person.relationship = clamp((person.relationship || 50) + (believed ? Math.sign(tone.esteem) : tone.esteem < 0 ? -2 : 0));
      }
      post.reactions.push({ personId: personId(person), name: person.name, believed, reaction });
    });
    account.followers = Math.max(0, account.followers + Math.round(post.reach * (tone.esteem >= 0 ? 0.035 : 0.018) + (post.viral ? 18 : 0)));
    account.credibility = clamp(account.credibility + (post.tone === 'kind' ? 2 : post.tone === 'cruel' ? -5 : 0));
    account.notoriety = clamp(account.notoriety + Math.min(12, Math.round(post.reach / 90)) + (post.viral ? 8 : 0));
    account.parasocial = clamp(account.parasocial + Math.round(post.reach / 160) + (post.type === 'livestream' ? 5 : 0));
    if (window.alterReputation) window.alterReputation(character, platform.audience, { esteem: tone.esteem, fear: tone.fear, notoriety: Math.max(1, Math.round(post.reach / 150)) }, `${platform.name}: ${tone.label}`);
    if (post.tone === 'cruel' && target && window.createRumor) window.createRumor(character, { source: target, witnesses: viewers, audience: platform.audience, severity: 3, evidence: post.screenshotted ? 85 : 65, claim: `${target.name} says @${account.handle} targeted them online.` });
  }

  function resolveParanormalPost(character, post, account) {
    const roll = Math.random() * 100;
    if (!post.genuine || post.evidenceStrength < 42) {
      post.paranormalVerdict = roll < 62 ? 'dismissed_as_fake' : 'believed_without_proof';
      account.credibility = clamp(account.credibility + (post.paranormalVerdict === 'dismissed_as_fake' ? -8 : 2));
    } else if (post.evidenceStrength >= 78 && roll < 26) {
      post.paranormalVerdict = 'removed_by_authorities'; post.moderation = 'removed';
      ensureTerribleNet(character).messages.unshift(systemMessage(character, 'wakewatch', 'CONTENT REMOVAL 7-C', 'Your upload was removed under a municipal emergency-media directive. No appeal form exists.'));
    } else if (roll < 58) {
      post.paranormalVerdict = 'investigated';
      if (window.recordInvestigativeIncident) window.recordInvestigativeIncident(character, { source: 'terriblenet', title: 'Viral paranormal footage', text: post.text }, 'genuine_paranormal');
    } else {
      post.paranormalVerdict = 'noticed_by_entity';
      if (window.observeHorror) window.observeHorror(character, { source: 'terriblenet_upload', text: `Something visible in a ${post.type} appeared to look back at each viewer separately.`, genuine: true, intensity: 3, engaged: true });
      character.horrorDirector = character.horrorDirector || {};
      character.horrorDirector.attention = clamp((character.horrorDirector.attention || 0) + 8);
      character.horrorDirector.contamination = clamp((character.horrorDirector.contamination || 0) + 6);
    }
    if (post.genuine && window.recordHorrorOutcome) window.recordHorrorOutcome(character, { source: 'terriblenet', title: 'Uploaded paranormal footage', outcome: post.paranormalVerdict, genuine: true, engaged: true });
  }

  function calculatePostIncome(character, post, account) {
    const eligible = ['vesper', 'wakewatch', 'chatterbox'].includes(post.platformId) && account.followers >= 250 && account.credibility >= 38;
    if (!eligible) return 0;
    account.monetized = true;
    const base = Math.floor(post.reach * (post.type === 'video' || post.type === 'livestream' ? 0.16 : 0.05));
    return Math.max(0, Math.min(2500, base));
  }

  function preserveScreenshot(system, post, probability) {
    if (post.screenshotted || Math.random() * 100 > probability) return null;
    post.screenshotted = true;
    const shot = { id: uid('shot', system), postId: post.id, platformId: post.platformId, text: post.text, targetName: post.targetName, capturedAge: post.createdAge, circulating: true };
    system.screenshots.unshift(shot);
    return shot;
  }

  function deletePost(character, postId) {
    const system = ensureTerribleNet(character);
    const post = system.posts.find(item => item.id === postId);
    if (!post || post.deleted) return { success: false, reason: 'That post is unavailable.' };
    post.deleted = true; post.moderation = 'deleted_by_user';
    const shot = preserveScreenshot(system, post, 35 + TONES[post.tone].controversy);
    return { success: true, title: shot ? 'Deleted, Not Gone' : 'Post Deleted', message: shot ? 'The original disappeared. A screenshot immediately began circulating without its context.' : 'The post is gone from your profile. No surviving copy is currently known.' };
  }

  function systemMessage(character, platformId, subject, body, threat = null) {
    const system = ensureTerribleNet(character);
    return { id: uid('message', system), platformId, senderId: 'system', senderName: PLATFORMS[platformId]?.name || 'Unknown', subject, body, age: character.age, read: false, threat, resolved: false };
  }

  function addThreat(character, type) {
    const system = ensureTerribleNet(character);
    const people = allPeople(character);
    const known = people.length ? pick(people) : null;
    const templates = {
      doxxing: ['HOME ADDRESS POSTED', 'A thread lists your address, relatives, workplace, and a photograph taken through a window.'],
      impersonation: ['ACCOUNT MIRROR DETECTED', 'A convincing copy of your profile is messaging people you know and asking for secrets.'],
      cancellation: ['COORDINATED CALL-OUT', 'Old posts have been assembled into a viral accusation thread. Context is losing faster than screenshots spread.'],
      stalking: ['REPEATED VIEWER', 'The same account attends every livestream. Their newest profile photograph was taken inside your home.'],
      blackmail: ['PRIVATE OFFER', `Someone possesses material that could damage your ${character.job ? 'employment' : 'relationships'}. They demand payment and silence.`],
      catfishing: ['IDENTITY CONFLICT', `${known ? known.name : 'A private contact'} appears in a dating profile that uses different memories and a different voice.`],
      exclusion: ['YOU WERE REMOVED', 'A coordinated block list has cut you out of a local social circle. Invitations vanish before reaching you.'],
      harassment: ['NOTIFICATION FLOOD', 'Hundreds of accounts repeat the same accusation with identical punctuation. Several are people you know.']
    };
    const [subject, body] = templates[type];
    const message = systemMessage(character, type === 'catfishing' ? 'morrow' : 'chatterbox', subject, body, { type, severity: 2 + Math.floor(Math.random() * 3), personId: personId(known) });
    system.messages.unshift(message);
    system.digitalIncidents.unshift({ id: uid('incident', system), type, age: character.age, status: 'active', messageId: message.id, severity: message.threat.severity });
    system.threatCooldownUntil = character.age + 1 + Math.floor(Math.random() * 2);
    if (window.addConsequence && ['doxxing', 'stalking', 'harassment'].includes(type)) window.addConsequence(character, { type: 'trauma', label: `Digital ${type}`, detail: body, source: 'TerribleNet', severity: message.threat.severity, yearsRemaining: 2 + message.threat.severity });
    return message;
  }

  function respondToMessage(character, messageId, response) {
    const system = ensureTerribleNet(character);
    const message = system.messages.find(item => item.id === messageId);
    if (!message || message.resolved) return { success: false, reason: 'That message no longer permits a response.' };
    const threat = message.threat;
    message.read = true; message.resolved = true; message.response = response;
    if (!threat) return { success: true, title: 'Message Archived', message: 'The message was marked read and filed.' };
    const incident = system.digitalIncidents.find(item => item.messageId === message.id);
    if (incident) incident.status = response;
    if (response === 'report') {
      const success = Math.random() < 0.42 + (character.stats?.smarts || 0) * 0.004;
      if (success) return { success: true, title: 'Evidence Preserved', message: 'The report was accepted. Accounts were removed, but screenshots were retained for the investigation.' };
      return { success: true, title: 'Report Closed Automatically', message: 'The platform found no violation. The sender posted your report confirmation publicly.' };
    }
    if (response === 'comply') {
      const payment = threat.type === 'blackmail' ? Math.min(character.money || 0, 800) : 0;
      character.money = Math.max(0, (character.money || 0) - payment);
      character.stats.sanity = clamp((character.stats.sanity || 50) - 4);
      return { success: true, title: 'Compliance Recorded', message: `You complied${payment ? ` and paid ${formatMoney(payment, character)}` : ''}. The demands stopped for now; the sender learned that pressure works.` };
    }
    if (response === 'confront') {
      const success = Math.random() < ((character.stats?.smarts || 0) + (character.stats?.confidence || 40)) / 220;
      if (success) { if (window.alterReputation) window.alterReputation(character, 'public', { esteem: 3, fear: 3, notoriety: 2 }, 'Publicly confronted digital harassment'); return { success: true, title: 'The Crowd Hesitated', message: 'You exposed contradictions and forced several instigators to retreat. The archive still remembers the accusation.' }; }
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: -5, notoriety: 6 }, 'A confrontation amplified digital harassment');
      return { success: true, title: 'Confrontation Amplified', message: 'Your response became the new headline. The harassment escaped its original audience.' };
    }
    return { success: true, title: 'Silence Chosen', message: 'You did not engage. The incident may cool down, though silence cannot delete existing copies.' };
  }

  function buyBlackglass(character, listingId) {
    const system = ensureTerribleNet(character);
    if (!system.accounts.blackglass) return { success: false, reason: 'A Blackglass account is required.' };
    const listing = BLACKGLASS_LISTINGS.find(item => item.id === listingId);
    if (!listing) return { success: false, reason: 'The listing vanished.' };
    if ((character.money || 0) < listing.cost) return { success: false, reason: `Requires ${formatMoney(listing.cost, character)}.` };
    character.money -= listing.cost;
    system.purchases.unshift({ ...listing, purchaseAge: character.age, active: true });
    let message = `Purchased ${listing.name}. No conventional receipt was issued.`;
    if (listing.kind === 'materials') {
      const ritual = window.ensureRitualSystem ? window.ensureRitualSystem(character) : null;
      if (ritual) ['blood', 'soil', 'tallow', 'link'].forEach(id => { ritual.materials[id] = (ritual.materials[id] || 0) + 1; });
      message += ' Four ritual materials were added to the Dark Altar cabinet.';
    } else if (listing.kind === 'object') {
      const ritual = window.ensureRitualSystem ? window.ensureRitualSystem(character) : null;
      if (ritual) ritual.cursedObjects.unshift({ id: uid('blackglass_object', system), name: listing.name, acquiredAge: character.age, location: 'home', dormant: false, curse: { name: 'Previous Owner', type: 'haunted', severity: 3, origin: { discovered: false, label: 'Blackglass seller' }, spread: 'object' } });
    } else if (listing.kind === 'records') {
      character.stats.smarts = clamp((character.stats.smarts || 0) + 5); character.stats.occult = clamp((character.stats.occult || 0) + 4);
    } else if (listing.kind === 'service') {
      if (window.alterReputation) window.alterReputation(character, 'public', { esteem: 8, notoriety: -12 }, 'Blackglass reputation burial');
      if (character.rumors) character.rumors.filter(item => item.active).slice(0, 2).forEach(item => { item.active = false; });
      message += ' Two active rumors were buried beneath a manufactured scandal involving an unnamed stranger.';
    } else if (listing.kind === 'information') {
      character.stats.occult = clamp((character.stats.occult || 0) + 12); character.stats.sanity = clamp((character.stats.sanity || 0) - 9);
      if (window.observeHorror) window.observeHorror(character, { source: 'blackglass_file', text: 'The purchased file addressed the reader by childhood nickname.', genuine: true, intensity: 4, engaged: true });
      message += ' The file knew which line you were reading. (+12% Occult, -9% Sanity)';
    }
    if (Math.random() * 100 < listing.danger) addThreat(character, pick(['doxxing', 'blackmail', 'stalking']));
    return { success: true, title: 'Blackglass Escrow Released', message, purchase: listing };
  }

  function tickTerribleNet(character) {
    const system = ensureTerribleNet(character);
    if (system.lastTickAge === character.age) return [];
    system.lastTickAge = character.age;
    const logs = [];
    refreshInvitations(character, system); refreshMemorials(character, system);
    Object.values(system.accounts).forEach(account => {
      account.notoriety = clamp(account.notoriety - 2);
      account.parasocial = clamp(account.parasocial - 1);
      if (account.monetized && account.followers >= 250) {
        const income = Math.min(8000, Math.round(account.followers * (0.18 + account.credibility / 500)));
        character.money = (character.money || 0) + income;
        logs.push(`${PLATFORMS[account.platformId].name} paid ${formatMoney(income, character)} in annual creator revenue.`);
      }
    });
    const oldRisky = system.posts.filter(post => !post.effectApplied && ['cruel', 'confession', 'paranormal'].includes(post.tone) && character.age - post.createdAge >= 1);
    oldRisky.forEach(post => {
      const screening = character.job ? 'employer' : character.education?.enrolled ? 'school admissions office' : Math.random() < 0.45 ? 'romantic contact' : 'municipal investigator';
      if ((post.screenshotted || !post.deleted) && Math.random() < 0.16 + TONES[post.tone].controversy / 220) {
        post.effectApplied = true;
        if (post.tone === 'cruel') {
          if (window.alterReputation) window.alterReputation(character, character.job ? 'workplace' : 'school', { esteem: -8, notoriety: 6 }, `Old ${PLATFORMS[post.platformId].name} post resurfaced`);
          if (window.addConsequence) window.addConsequence(character, { type: 'social_stigma', label: 'Archived Post Resurfaced', detail: `A ${screening} found an old targeted post.`, source: PLATFORMS[post.platformId].name, severity: 2, yearsRemaining: 3 });
          if (screening === 'school admissions office' && character.education) character.education.grades = clamp((character.education.grades || 60) - 6);
          if (screening === 'romantic contact') {
            const contacts = (character.kin?.friends || []).filter(person => person.alive !== false);
            if (contacts.length) contacts.sort((a, b) => (b.relationship || 0) - (a.relationship || 0))[0].relationship = clamp((contacts[0].relationship || 50) - 10);
          }
          if (screening === 'municipal investigator' && window.addConsequence && post.screenshotted) window.addConsequence(character, { type: 'criminal_record', label: 'Digital Harassment Investigation', detail: 'A preserved targeted post entered a municipal investigation.', source: PLATFORMS[post.platformId].name, severity: 1, yearsRemaining: 2 });
          if (screening === 'employer' && character.job && post.reach >= 350 && Math.random() < 0.18) {
            const lostJob = character.job.title || character.job.name || 'position';
            character.job = null;
            logs.push(`Your employer dismissed you from your ${lostJob} after the archived post spread internally.`);
          }
          logs.push(`An ${screening} found your old ${PLATFORMS[post.platformId].name} post. ${post.deleted ? 'A screenshot survived deletion.' : 'It was still public.'}`);
        } else if (post.tone === 'paranormal') {
          logs.push(`A ${screening} reopened your paranormal upload from age ${post.createdAge}; its credibility is being reconsidered.`);
          if (window.recordInvestigativeIncident) window.recordInvestigativeIncident(character, { source: 'terriblenet_archive', title: 'Archived paranormal upload', text: post.text }, post.genuine ? 'genuine_paranormal' : 'human_deception');
        }
      }
    });
    const totalNotoriety = Object.values(system.accounts).reduce((sum, account) => sum + account.notoriety + account.parasocial, 0);
    if (character.age >= system.threatCooldownUntil && system.messages.length < 30 && Math.random() < Math.min(0.48, 0.08 + totalNotoriety / 650)) {
      const risks = ['doxxing', 'impersonation', 'cancellation', 'stalking', 'blackmail', 'catfishing', 'exclusion', 'harassment'];
      const threat = addThreat(character, pick(risks)); logs.push(`${threat.subject}: ${threat.body}`);
    }
    system.memorials.forEach(memorial => {
      if (memorial.followed && Math.random() < 0.12) {
        const update = { age: character.age, text: pick([`${memorial.name}'s profile changed its last-known location to your current address.`, `A new photograph appeared on ${memorial.name}'s memorial. You are visible in the background, older than you are now.`, `${memorial.name}'s account marked your latest post with “I remember differently.”`]) };
        memorial.updates.unshift(update); logs.push(`LittleLives Archive: ${update.text}`);
        if (window.observeHorror) window.observeHorror(character, { source: 'memorial_profile', text: update.text, genuine: Math.random() < 0.65, intensity: 2, engaged: false });
      }
    });
    return logs.slice(0, 6);
  }

  function formatMoney(amount, character) { return window.formatMoney ? window.formatMoney(amount, character.countryCode) : `$${amount}`; }

  window.TERRIBLENET_PLATFORMS = PLATFORMS;
  window.TERRIBLENET_TONES = TONES;
  window.TERRIBLENET_CONTENT_TYPES = CONTENT_TYPES;
  window.BLACKGLASS_LISTINGS = BLACKGLASS_LISTINGS;
  window.ensureTerribleNet = ensureTerribleNet;
  window.getTerribleNetAccess = platformAccess;
  window.createTerribleNetAccount = createAccount;
  window.createTerribleNetPost = createPost;
  window.deleteTerribleNetPost = deletePost;
  window.respondTerribleNetMessage = respondToMessage;
  window.buyBlackglassListing = buyBlackglass;
  window.tickTerribleNet = tickTerribleNet;
})();
