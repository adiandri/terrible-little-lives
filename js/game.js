// Game Engine with Screen Router, Modular Avatar Customizer, God Mode, and Crypt System

class TerribleGame {
  constructor() {
    this.character = null;
    this.logs = [];
    this.activeDilemma = null;
    this.usedDilemmaIds = new Set();
    this.crypt = this.loadCrypt();
    
    // Creator draft state
    this.creatorState = {
      avatar: window.generateRandomAvatar(),
      name: { first: "Silas", surname: "Marrow" },
      gender: "Male",
      birthplace: window.GOTHIC_DATA.birthplaces[0],
      trait: window.GOTHIC_DATA.traits[0],
      isGodMode: true,
      stats: {
        happiness: 75,
        smarts: 80,
        looks: 65,
        vitality: 90,
        sanity: 85,
        occult: 25,
        humanity: 90
      },
      coin: 150
    };

    this.initElements();
    this.bindEvents();
    this.populateCreatorDropdowns();
    this.syncCreatorUI();
    this.checkResumeAvailability();
    this.showScreen('screen-landing');
  }

  initElements() {
    this.dom = {
      phoneScreen: document.getElementById('phone-screen'),

      // Screens
      screenLanding: document.getElementById('screen-landing'),
      screenCreator: document.getElementById('screen-creator'),
      screenGame: document.getElementById('screen-game'),
      screenCrypt: document.getElementById('screen-crypt'),

      // Landing UI
      btnLandingResume: document.getElementById('btn-landing-resume'),
      labelResumeLife: document.getElementById('label-resume-life'),
      btnToCreator: document.getElementById('btn-to-creator'),
      btnQuickLife: document.getElementById('btn-quick-life'),
      btnToCrypt: document.getElementById('btn-to-crypt'),
      btnLandingMute: document.getElementById('btn-landing-mute'),
      landingMuteIcon: document.getElementById('landing-mute-icon'),

      // Creator UI
      creatorAvatarCanvas: document.getElementById('creator-avatar-canvas'),
      btnRandomAvatar: document.getElementById('btn-random-avatar'),
      btnCreatorRandomizeAll: document.getElementById('btn-creator-randomize-all'),
      btnCreatorBack: document.getElementById('btn-creator-back'),
      tabAppearance: document.getElementById('tab-appearance'),
      tabIdentity: document.getElementById('tab-identity'),
      tabGodmode: document.getElementById('tab-godmode'),
      panelAppearance: document.getElementById('panel-appearance'),
      panelIdentity: document.getElementById('panel-identity'),
      panelGodmode: document.getElementById('panel-godmode'),

      // Appearance Selectors
      selSkin: document.getElementById('sel-skin'),
      selEyeShape: document.getElementById('sel-eye-shape'),
      selEyeColor: document.getElementById('sel-eye-color'),
      selHairStyle: document.getElementById('sel-hair-style'),
      selHairColor: document.getElementById('sel-hair-color'),
      selMark: document.getElementById('sel-mark'),

      // Identity Selectors
      inputFirstName: document.getElementById('input-first-name'),
      inputSurname: document.getElementById('input-surname'),
      btnRandomName: document.getElementById('btn-random-name'),
      selGender: document.getElementById('sel-gender'),
      selBirthplace: document.getElementById('sel-birthplace'),
      selTrait: document.getElementById('sel-trait'),
      traitDesc: document.getElementById('trait-desc'),

      // God Mode Controls
      chkGodmode: document.getElementById('chk-godmode'),
      godmodeSliders: document.getElementById('godmode-sliders'),
      sliderHappiness: document.getElementById('slider-god-happiness'),
      labelHappiness: document.getElementById('label-god-happiness'),
      sliderSmarts: document.getElementById('slider-god-smarts'),
      labelSmarts: document.getElementById('label-god-smarts'),
      sliderLooks: document.getElementById('slider-god-looks'),
      labelLooks: document.getElementById('label-god-looks'),
      sliderVitality: document.getElementById('slider-god-vitality'),
      labelVitality: document.getElementById('label-god-vitality'),
      sliderSanity: document.getElementById('slider-god-sanity'),
      labelSanity: document.getElementById('label-god-sanity'),
      sliderOccult: document.getElementById('slider-god-occult'),
      labelOccult: document.getElementById('label-god-occult'),
      sliderHumanity: document.getElementById('slider-god-humanity'),
      labelHumanity: document.getElementById('label-god-humanity'),
      sliderCoin: document.getElementById('slider-god-coin'),
      labelCoin: document.getElementById('label-god-coin'),
      btnEmbark: document.getElementById('btn-embark'),

      // Main Game Header
      gameHeaderAvatar: document.getElementById('game-header-avatar'),
      charName: document.getElementById('char-name'),
      charTitle: document.getElementById('char-title'),
      charAgeYear: document.getElementById('char-age-year'),
      charCoin: document.getElementById('char-coin'),
      btnGameGodmode: document.getElementById('btn-game-godmode'),
      btnMute: document.getElementById('btn-mute'),
      muteIcon: document.getElementById('mute-icon'),
      btnToMenu: document.getElementById('btn-to-menu'),

      // Stat bars
      barVitality: document.getElementById('bar-vitality'),
      valVitality: document.getElementById('val-vitality'),
      barSanity: document.getElementById('bar-sanity'),
      valSanity: document.getElementById('val-sanity'),
      barOccult: document.getElementById('bar-occult'),
      valOccult: document.getElementById('val-occult'),
      barHappiness: document.getElementById('bar-happiness'),
      valHappiness: document.getElementById('val-happiness'),
      barSmarts: document.getElementById('bar-smarts'),
      valSmarts: document.getElementById('val-smarts'),
      barHumanity: document.getElementById('bar-humanity'),
      valHumanity: document.getElementById('val-humanity'),

      // Log feed & Endure button
      logFeed: document.getElementById('log-feed'),
      btnEndure: document.getElementById('btn-endure'),

      // Crypt Screen
      cryptList: document.getElementById('crypt-list'),
      btnCryptBack: document.getElementById('btn-crypt-back'),
      btnClearCrypt: document.getElementById('btn-clear-crypt'),

      // Dilemma Sheet
      dilemmaModal: document.getElementById('dilemma-modal'),
      dilemmaBackdrop: document.getElementById('dilemma-backdrop'),
      dilemmaTitle: document.getElementById('dilemma-title'),
      dilemmaPrompt: document.getElementById('dilemma-prompt'),
      dilemmaChoices: document.getElementById('dilemma-choices'),

      // Post-Mortem Modal
      deathModal: document.getElementById('death-modal'),
      deathAvatarCanvas: document.getElementById('death-avatar-canvas'),
      deathName: document.getElementById('death-name'),
      deathAge: document.getElementById('death-age'),
      deathCause: document.getElementById('death-cause'),
      deathEpitaph: document.getElementById('death-epitaph'),
      btnNewLife: document.getElementById('btn-new-life'),
      btnDeathToCrypt: document.getElementById('btn-death-to-crypt'),

      // Live Mid-Game God Mode Inspector
      godmodeModal: document.getElementById('godmode-modal'),
      btnCloseGodmodeModal: document.getElementById('btn-close-godmode-modal'),
      btnApplyLiveGodmode: document.getElementById('btn-apply-live-godmode'),
      slideLiveVitality: document.getElementById('slide-live-vitality'),
      lblLiveVitality: document.getElementById('lbl-live-vitality'),
      slideLiveSanity: document.getElementById('slide-live-sanity'),
      lblLiveSanity: document.getElementById('lbl-live-sanity'),
      slideLiveHappiness: document.getElementById('slide-live-happiness'),
      lblLiveHappiness: document.getElementById('lbl-live-happiness'),
      slideLiveSmarts: document.getElementById('slide-live-smarts'),
      lblLiveSmarts: document.getElementById('lbl-live-smarts'),
      slideLiveOccult: document.getElementById('slide-live-occult'),
      lblLiveOccult: document.getElementById('lbl-live-occult'),
      slideLiveHumanity: document.getElementById('slide-live-humanity'),
      lblLiveHumanity: document.getElementById('lbl-live-humanity'),
      slideLiveCoin: document.getElementById('slide-live-coin'),
      lblLiveCoin: document.getElementById('lbl-live-coin')
    };
  }

  showScreen(screenId) {
    const screens = [
      this.dom.screenLanding,
      this.dom.screenCreator,
      this.dom.screenGame,
      this.dom.screenCrypt
    ];

    screens.forEach(s => {
      if (s) {
        s.classList.add('hidden');
        s.style.display = 'none';
      }
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      target.style.display = 'flex';
    }

    if (screenId === 'screen-creator') {
      this.renderCreatorAvatar();
    } else if (screenId === 'screen-game' && this.character) {
      this.renderAll();
    } else if (screenId === 'screen-crypt') {
      this.renderCrypt();
    } else if (screenId === 'screen-landing') {
      this.checkResumeAvailability();
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  bindEvents() {
    // Navigation from Landing
    this.dom.btnToCreator.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.showScreen('screen-creator');
    });

    this.dom.btnQuickLife.addEventListener('click', () => {
      window.soundEngine.playTick();
      this.startNewLife(null);
    });

    this.dom.btnToCrypt.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.showScreen('screen-crypt');
    });

    this.dom.btnCreatorBack.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.showScreen('screen-landing');
    });

    this.dom.btnCryptBack.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.showScreen('screen-landing');
    });

    this.dom.btnToMenu.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.saveGame();
      this.showScreen('screen-landing');
    });

    this.dom.btnLandingResume.addEventListener('click', () => {
      window.soundEngine.playTick();
      this.showScreen('screen-game');
    });

    // Audio Toggles
    const toggleAudio = () => {
      const isMuted = window.soundEngine.toggleMute();
      const iconName = isMuted ? 'volume-x' : 'volume-2';
      this.dom.muteIcon.setAttribute('data-lucide', iconName);
      this.dom.landingMuteIcon.setAttribute('data-lucide', iconName);
      if (window.lucide) window.lucide.createIcons();
    };
    this.dom.btnMute.addEventListener('click', toggleAudio);
    this.dom.btnLandingMute.addEventListener('click', toggleAudio);

    // Creator Tabs
    this.dom.tabAppearance.addEventListener('click', () => this.switchCreatorTab('appearance'));
    this.dom.tabIdentity.addEventListener('click', () => this.switchCreatorTab('identity'));
    this.dom.tabGodmode.addEventListener('click', () => this.switchCreatorTab('godmode'));

    // Modular Appearance Selectors Change
    const updateAvatarFromSelects = () => {
      this.creatorState.avatar = {
        skin: this.dom.selSkin.value,
        eyeShape: this.dom.selEyeShape.value,
        eyeColor: this.dom.selEyeColor.value,
        hairStyle: this.dom.selHairStyle.value,
        hairColor: this.dom.selHairColor.value,
        mark: this.dom.selMark.value
      };
      this.renderCreatorAvatar();
    };

    [this.dom.selSkin, this.dom.selEyeShape, this.dom.selEyeColor,
     this.dom.selHairStyle, this.dom.selHairColor, this.dom.selMark].forEach(sel => {
      sel.addEventListener('change', updateAvatarFromSelects);
    });

    // Randomize appearance button
    this.dom.btnRandomAvatar.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.creatorState.avatar = window.generateRandomAvatar();
      this.syncCreatorUI();
      this.renderCreatorAvatar();
    });

    // Randomize name
    this.dom.btnRandomName.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.randomizeName();
    });

    // Randomize entire soul
    this.dom.btnCreatorRandomizeAll.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.creatorState.avatar = window.generateRandomAvatar();
      this.randomizeName();
      this.syncCreatorUI();
      this.renderCreatorAvatar();
    });

    // God Mode Toggle
    this.dom.chkGodmode.addEventListener('change', (e) => {
      this.creatorState.isGodMode = e.target.checked;
      this.dom.godmodeSliders.style.opacity = e.target.checked ? '1' : '0.4';
      this.dom.godmodeSliders.style.pointerEvents = e.target.checked ? 'auto' : 'none';
    });

    // Sliders Live Number Updates
    const bindSlider = (slider, label, key, suffix = '%') => {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        label.textContent = `${val}${suffix}`;
        if (key === 'coin') {
          this.creatorState.coin = val;
        } else {
          this.creatorState.stats[key] = val;
        }
      });
    };

    bindSlider(this.dom.sliderHappiness, this.dom.labelHappiness, 'happiness');
    bindSlider(this.dom.sliderSmarts, this.dom.labelSmarts, 'smarts');
    bindSlider(this.dom.sliderLooks, this.dom.labelLooks, 'looks');
    bindSlider(this.dom.sliderVitality, this.dom.labelVitality, 'vitality');
    bindSlider(this.dom.sliderSanity, this.dom.labelSanity, 'sanity');
    bindSlider(this.dom.sliderOccult, this.dom.labelOccult, 'occult');
    bindSlider(this.dom.sliderHumanity, this.dom.labelHumanity, 'humanity');
    bindSlider(this.dom.sliderCoin, this.dom.labelCoin, 'coin', ' s.');

    // Trait change description
    this.dom.selTrait.addEventListener('change', (e) => {
      const trait = window.GOTHIC_DATA.traits.find(t => t.id === e.target.value);
      if (trait) {
        this.creatorState.trait = trait;
        this.dom.traitDesc.textContent = trait.desc;
      }
    });

    // Embark Button
    this.dom.btnEmbark.addEventListener('click', () => {
      window.soundEngine.playTick();
      const first = this.dom.inputFirstName.value.trim() || "Silas";
      const last = this.dom.inputSurname.value.trim() || "Marrow";
      const config = {
        name: `${first} ${last}`,
        gender: this.dom.selGender.value,
        birthplace: this.dom.selBirthplace.value,
        trait: this.creatorState.trait,
        avatar: this.creatorState.avatar,
        isGodMode: this.creatorState.isGodMode,
        stats: { ...this.creatorState.stats },
        coin: this.creatorState.coin
      };
      this.startNewLife(config);
    });

    // Gameplay Controls
    this.dom.btnEndure.addEventListener('click', () => this.endureYear());

    // Live God Mode Inspector In-Game
    this.dom.btnGameGodmode.addEventListener('click', () => this.openLiveGodmodeInspector());
    this.dom.btnCloseGodmodeModal.addEventListener('click', () => {
      this.dom.godmodeModal.classList.add('hidden');
    });
    this.dom.btnApplyLiveGodmode.addEventListener('click', () => this.applyLiveGodmodeTweaks());

    // Death Modal actions
    this.dom.btnNewLife.addEventListener('click', () => {
      this.hideModals();
      this.showScreen('screen-creator');
    });
    this.dom.btnDeathToCrypt.addEventListener('click', () => {
      this.hideModals();
      this.showScreen('screen-crypt');
    });

    // Crypt clear
    this.dom.btnClearCrypt.addEventListener('click', () => {
      if (confirm("Scatter the ashes of all deceased souls in the Crypt?")) {
        this.crypt = [];
        localStorage.removeItem('TLL_CRYPT');
        this.renderCrypt();
      }
    });
  }

  populateCreatorDropdowns() {
    this.dom.selBirthplace.innerHTML = '';
    window.GOTHIC_DATA.birthplaces.forEach(bp => {
      const opt = document.createElement('option');
      opt.value = bp;
      opt.textContent = bp;
      this.dom.selBirthplace.appendChild(opt);
    });

    this.dom.selTrait.innerHTML = '';
    window.GOTHIC_DATA.traits.forEach(tr => {
      const opt = document.createElement('option');
      opt.value = tr.id;
      opt.textContent = tr.name;
      this.dom.selTrait.appendChild(opt);
    });
    this.dom.traitDesc.textContent = window.GOTHIC_DATA.traits[0].desc;
  }

  randomizeName() {
    const isMale = this.dom.selGender.value === 'Male';
    const first = isMale 
      ? window.getRandomElement(window.GOTHIC_DATA.firstNamesMale)
      : window.getRandomElement(window.GOTHIC_DATA.firstNamesFemale);
    const surname = window.getRandomElement(window.GOTHIC_DATA.surnames);
    this.dom.inputFirstName.value = first;
    this.dom.inputSurname.value = surname;
    this.creatorState.name = { first, surname };
  }

  syncCreatorUI() {
    this.dom.selSkin.value = this.creatorState.avatar.skin;
    this.dom.selEyeShape.value = this.creatorState.avatar.eyeShape;
    this.dom.selEyeColor.value = this.creatorState.avatar.eyeColor;
    this.dom.selHairStyle.value = this.creatorState.avatar.hairStyle;
    this.dom.selHairColor.value = this.creatorState.avatar.hairColor;
    this.dom.selMark.value = this.creatorState.avatar.mark;

    if (!this.dom.inputFirstName.value) {
      this.randomizeName();
    }
  }

  switchCreatorTab(tab) {
    const tabs = [this.dom.tabAppearance, this.dom.tabIdentity, this.dom.tabGodmode];
    const panels = [this.dom.panelAppearance, this.dom.panelIdentity, this.dom.panelGodmode];

    tabs.forEach(t => {
      t.classList.remove('bg-slatecard', 'text-parchment', 'text-amber-300');
      t.classList.add('text-dust');
    });
    panels.forEach(p => {
      p.classList.add('hidden');
      p.style.display = 'none';
    });

    if (tab === 'appearance') {
      this.dom.tabAppearance.classList.add('bg-slatecard', 'text-parchment');
      this.dom.tabAppearance.classList.remove('text-dust');
      this.dom.panelAppearance.classList.remove('hidden');
      this.dom.panelAppearance.style.display = 'block';
    } else if (tab === 'identity') {
      this.dom.tabIdentity.classList.add('bg-slatecard', 'text-parchment');
      this.dom.tabIdentity.classList.remove('text-dust');
      this.dom.panelIdentity.classList.remove('hidden');
      this.dom.panelIdentity.style.display = 'block';
    } else if (tab === 'godmode') {
      this.dom.tabGodmode.classList.add('bg-slatecard', 'text-amber-300');
      this.dom.tabGodmode.classList.remove('text-dust');
      this.dom.panelGodmode.classList.remove('hidden');
      this.dom.panelGodmode.style.display = 'block';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderCreatorAvatar() {
    window.drawGothicAvatar(this.dom.creatorAvatarCanvas, {
      ...this.creatorState.avatar,
      age: 18
    });
  }

  checkResumeAvailability() {
    const saved = localStorage.getItem('TLL_SAVE');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.character && data.character.isAlive) {
          this.character = data.character;
          this.logs = data.logs || [];
          this.usedDilemmaIds = new Set(data.usedDilemmaIds || []);
          this.dom.labelResumeLife.textContent = `RESUME LIFE: ${this.character.name.toUpperCase()} (AGE ${this.character.age})`;
          this.dom.btnLandingResume.classList.remove('hidden');
          this.dom.btnLandingResume.style.display = 'flex';
          return;
        }
      } catch (e) {}
    }
    this.dom.btnLandingResume.classList.add('hidden');
    this.dom.btnLandingResume.style.display = 'none';
  }

  startNewLife(customConfig = null) {
    this.character = window.generateCharacter(customConfig);
    this.usedDilemmaIds.clear();
    this.logs = [
      {
        age: 0,
        year: this.character.year,
        entries: [
          `Born at ${this.character.birthplace}.`,
          this.character.origin,
          `Omen Trait: ${this.character.trait.name} - ${this.character.trait.desc}`
        ]
      }
    ];

    this.activeDilemma = null;
    this.hideModals();
    this.saveGame();
    this.showScreen('screen-game');
  }

  endureYear() {
    if (!this.character.isAlive || this.activeDilemma) return;

    window.soundEngine.playTick();
    if (navigator.vibrate) navigator.vibrate(35);

    this.character.age += 1;
    this.character.year += 1;

    if (this.character.age <= 2) this.character.statusTitle = "Infant";
    else if (this.character.age <= 6) this.character.statusTitle = "Toddler";
    else if (this.character.age <= 12) this.character.statusTitle = "Child";
    else if (this.character.age <= 17) this.character.statusTitle = "Adolescent";
    else this.character.statusTitle = "Young Adult";

    this.modifyStat('vitality', (Math.random() > 0.65 ? -1 : 0));

    const currentYearLog = {
      age: this.character.age,
      year: this.character.year,
      entries: []
    };

    const availableDilemmas = window.GAME_DATA.INTERACTIVE_DILEMMAS.filter(d => 
      this.character.age >= d.minAge && 
      this.character.age <= d.maxAge && 
      !this.usedDilemmaIds.has(d.id)
    );

    if (availableDilemmas.length > 0 && Math.random() < 0.55) {
      const chosen = availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)];
      this.usedDilemmaIds.add(chosen.id);
      this.activeDilemma = chosen;

      this.logs.push(currentYearLog);
      this.renderAll();
      this.triggerDilemma(chosen);
      this.saveGame();
      return;
    }

    const ambientPool = window.GAME_DATA.AMBIENT_YEAR_EVENTS.filter(e =>
      this.character.age >= e.minAge && this.character.age <= e.maxAge
    );

    if (ambientPool.length > 0 && Math.random() < 0.7) {
      const ambient = ambientPool[Math.floor(Math.random() * ambientPool.length)];
      currentYearLog.entries.push(ambient.text);
    } else {
      currentYearLog.entries.push("Another cold winter passed in uneventful stillness. The house settled deeper into the damp earth.");
    }

    if (this.character.stats.sanity < 30 && Math.random() < 0.6) {
      const whispers = [
        "You woke up with dry mud under your fingernails and the cellar padlock broken from the inside.",
        "You heard a woman singing backwards hymns from inside the chimney flue at 4 AM.",
        "Your shadow detached from your feet for three seconds when you crossed the vestibule."
      ];
      currentYearLog.entries.push(whispers[Math.floor(Math.random() * whispers.length)]);
      this.modifyStat('sanity', -3);
    }

    this.logs.push(currentYearLog);
    this.checkMortality();
    this.renderAll();
    this.saveGame();
  }

  triggerDilemma(dilemma) {
    window.soundEngine.playDread();
    if (navigator.vibrate) navigator.vibrate([50, 40, 80]);

    this.dom.dilemmaTitle.textContent = dilemma.title;
    this.dom.dilemmaPrompt.textContent = dilemma.prompt;
    this.dom.dilemmaChoices.innerHTML = '';

    dilemma.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = "w-full text-left p-3.5 rounded-lg bg-[#20232a] hover:bg-[#282c35] active:scale-[0.98] border border-[#2d313b] text-[#e2ded4] text-xs transition-all flex items-start space-x-3";
      
      const badge = document.createElement('span');
      badge.className = "px-2 py-0.5 rounded text-[10px] bg-[#121316] text-[#8c8f9a] font-mono shrink-0";
      badge.textContent = `${idx + 1}`;

      const textSpan = document.createElement('span');
      textSpan.className = "leading-relaxed";
      textSpan.textContent = choice.text;

      btn.appendChild(badge);
      btn.appendChild(textSpan);

      btn.addEventListener('click', () => this.selectChoice(idx));
      this.dom.dilemmaChoices.appendChild(btn);
    });

    this.dom.dilemmaModal.classList.remove('hidden');
    this.dom.dilemmaModal.style.display = 'flex';
    this.dom.dilemmaBackdrop.classList.remove('hidden');
    this.dom.dilemmaBackdrop.style.display = 'block';
  }

  selectChoice(choiceIdx) {
    if (!this.activeDilemma) return;

    window.soundEngine.playClick();
    if (navigator.vibrate) navigator.vibrate(30);

    const choice = this.activeDilemma.choices[choiceIdx];
    const latestLog = this.logs[this.logs.length - 1];

    if (latestLog) {
      latestLog.entries.push(`[${this.activeDilemma.title}] You chose to: ${choice.text}`);
      latestLog.entries.push(choice.outcome);
    }

    if (choice.effects) {
      for (const [stat, delta] of Object.entries(choice.effects)) {
        if (stat === 'coin') {
          this.character.coin = Math.max(0, this.character.coin + delta);
        } else {
          this.modifyStat(stat, delta);
        }
      }
    }

    this.activeDilemma = null;
    this.hideModals();
    this.checkMortality();
    this.renderAll();
    this.saveGame();
  }

  modifyStat(stat, delta) {
    if (this.character.stats[stat] !== undefined) {
      this.character.stats[stat] = Math.max(0, Math.min(100, this.character.stats[stat] + delta));
      if (delta < -10) {
        window.soundEngine.playWhisper();
      }
    }
  }

  checkMortality() {
    if (this.character.stats.vitality <= 0) {
      this.die("Physical Collapse", "Succumbed to fever, bodily injury, and the biting cold. Laid to rest in an unmarked plot behind the stone chapel.");
    } else if (this.character.stats.sanity <= 0) {
      this.die("Mind Shattered", "Lost all tether to waking reality. Committed to the subterranean wards of Coldwater Sanitarium, murmuring backwards prayers until the end of your days.");
    } else if (this.character.stats.humanity <= 0) {
      this.die("Transcendence Beyond Flesh", "Your human soul withered away completely. One dusk, you walked into the black mire and took your place among the unnamable things.");
    }
  }

  die(cause, epitaph) {
    this.character.isAlive = false;
    this.character.deathCause = cause;
    this.character.epitaph = epitaph;

    this.addToCrypt(this.character);

    window.soundEngine.playDeath();
    if (navigator.vibrate) navigator.vibrate([150, 100, 350]);

    this.showDeathModal();
    this.saveGame();
  }

  showDeathModal() {
    this.dom.deathName.textContent = this.character.name;
    this.dom.deathAge.textContent = `Age ${this.character.age} (${this.character.year})`;
    this.dom.deathCause.textContent = this.character.deathCause;
    this.dom.deathEpitaph.textContent = this.character.epitaph;

    window.drawGothicAvatar(this.dom.deathAvatarCanvas, {
      ...this.character.avatar,
      age: this.character.age
    });

    this.dom.deathModal.classList.remove('hidden');
    this.dom.deathModal.style.display = 'flex';
  }

  hideModals() {
    this.dom.dilemmaModal.classList.add('hidden');
    this.dom.dilemmaModal.style.display = 'none';
    this.dom.dilemmaBackdrop.classList.add('hidden');
    this.dom.dilemmaBackdrop.style.display = 'none';
    this.dom.deathModal.classList.add('hidden');
    this.dom.deathModal.style.display = 'none';
    this.dom.godmodeModal.classList.add('hidden');
    this.dom.godmodeModal.style.display = 'none';
  }

  renderAll() {
    if (!this.character) return;

    window.drawGothicAvatar(this.dom.gameHeaderAvatar, {
      ...this.character.avatar,
      age: this.character.age
    });

    this.dom.charName.textContent = this.character.name;
    this.dom.charTitle.textContent = this.character.statusTitle;
    this.dom.charAgeYear.textContent = `Age: ${this.character.age} | ${this.character.year}`;
    this.dom.charCoin.textContent = `${this.character.coin} s.`;

    if (this.character.isGodMode) {
      this.dom.btnGameGodmode.classList.remove('hidden');
      this.dom.btnGameGodmode.style.display = 'inline-flex';
    } else {
      this.dom.btnGameGodmode.classList.add('hidden');
      this.dom.btnGameGodmode.style.display = 'none';
    }

    this.updateStatBar(this.dom.barVitality, this.dom.valVitality, this.character.stats.vitality);
    this.updateStatBar(this.dom.barSanity, this.dom.valSanity, this.character.stats.sanity);
    this.updateStatBar(this.dom.barOccult, this.dom.valOccult, this.character.stats.occult);
    this.updateStatBar(this.dom.barHappiness, this.dom.valHappiness, this.character.stats.happiness);
    this.updateStatBar(this.dom.barSmarts, this.dom.valSmarts, this.character.stats.smarts);
    this.updateStatBar(this.dom.barHumanity, this.dom.valHumanity, this.character.stats.humanity);

    if (this.character.stats.sanity < 25) {
      this.dom.phoneScreen.classList.add('low-sanity-jitter');
    } else {
      this.dom.phoneScreen.classList.remove('low-sanity-jitter');
    }

    if (!this.character.isAlive) {
      this.dom.btnEndure.disabled = true;
      this.dom.btnEndure.classList.add('opacity-40', 'cursor-not-allowed');
      this.dom.btnEndure.innerHTML = `<span>DECEASED</span>`;
    } else {
      this.dom.btnEndure.disabled = false;
      this.dom.btnEndure.classList.remove('opacity-40', 'cursor-not-allowed');
      this.dom.btnEndure.innerHTML = `
        <span class="font-serif tracking-widest text-sm font-bold group-hover:text-red-300">ENDURE YEAR</span>
        <span class="text-[10px] text-dust font-sans block tracking-wider">[ +1 Year ]</span>
      `;
    }

    this.renderLogs();
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  updateStatBar(barEl, valEl, value) {
    const clamped = Math.max(0, Math.min(100, Math.round(value || 0)));
    barEl.style.width = `${clamped}%`;
    valEl.textContent = `${clamped}%`;
  }

  renderLogs() {
    this.dom.logFeed.innerHTML = '';

    this.logs.forEach(yearLog => {
      const card = document.createElement('div');
      card.className = "bg-slatecard border border-leadborder rounded-xl p-3 shadow-sm";

      const header = document.createElement('div');
      header.className = "flex items-center justify-between border-b border-leadborder/70 pb-1.5 mb-2";

      const badge = document.createElement('span');
      badge.className = "text-[10px] font-serif font-bold text-parchment tracking-wider uppercase bg-[#0f1013] px-2 py-0.5 rounded border border-leadborder";
      badge.textContent = `AGE ${yearLog.age}`;

      const yearText = document.createElement('span');
      yearText.className = "text-[10px] text-dust font-mono";
      yearText.textContent = `A.D. ${yearLog.year}`;

      header.appendChild(badge);
      header.appendChild(yearText);
      card.appendChild(header);

      const list = document.createElement('div');
      list.className = "space-y-1.5 text-xs text-[#d3cec4] leading-relaxed";

      yearLog.entries.forEach(entry => {
        const p = document.createElement('p');
        p.className = "relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-[#7c6396]";
        
        if (entry.startsWith('[')) {
          p.className = "relative pl-3 text-red-400 font-medium before:content-['✦'] before:absolute before:left-0 before:text-red-400";
        }
        
        p.textContent = entry;
        list.appendChild(p);
      });

      card.appendChild(list);
      this.dom.logFeed.appendChild(card);
    });

    setTimeout(() => {
      this.dom.logFeed.scrollTop = this.dom.logFeed.scrollHeight;
    }, 50);
  }

  openLiveGodmodeInspector() {
    if (!this.character) return;
    const stats = this.character.stats;

    this.dom.slideLiveVitality.value = stats.vitality;
    this.dom.lblLiveVitality.textContent = `${stats.vitality}%`;
    this.dom.slideLiveVitality.oninput = (e) => this.dom.lblLiveVitality.textContent = `${e.target.value}%`;

    this.dom.slideLiveSanity.value = stats.sanity;
    this.dom.lblLiveSanity.textContent = `${stats.sanity}%`;
    this.dom.slideLiveSanity.oninput = (e) => this.dom.lblLiveSanity.textContent = `${e.target.value}%`;

    this.dom.slideLiveHappiness.value = stats.happiness;
    this.dom.lblLiveHappiness.textContent = `${stats.happiness}%`;
    this.dom.slideLiveHappiness.oninput = (e) => this.dom.lblLiveHappiness.textContent = `${e.target.value}%`;

    this.dom.slideLiveSmarts.value = stats.smarts;
    this.dom.lblLiveSmarts.textContent = `${stats.smarts}%`;
    this.dom.slideLiveSmarts.oninput = (e) => this.dom.lblLiveSmarts.textContent = `${e.target.value}%`;

    this.dom.slideLiveOccult.value = stats.occult;
    this.dom.lblLiveOccult.textContent = `${stats.occult}%`;
    this.dom.slideLiveOccult.oninput = (e) => this.dom.lblLiveOccult.textContent = `${e.target.value}%`;

    this.dom.slideLiveHumanity.value = stats.humanity;
    this.dom.lblLiveHumanity.textContent = `${stats.humanity}%`;
    this.dom.slideLiveHumanity.oninput = (e) => this.dom.lblLiveHumanity.textContent = `${e.target.value}%`;

    this.dom.slideLiveCoin.value = this.character.coin;
    this.dom.lblLiveCoin.textContent = `${this.character.coin} s.`;
    this.dom.slideLiveCoin.oninput = (e) => this.dom.lblLiveCoin.textContent = `${e.target.value} s.`;

    this.dom.godmodeModal.classList.remove('hidden');
    this.dom.godmodeModal.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  }

  applyLiveGodmodeTweaks() {
    this.character.stats.vitality = parseInt(this.dom.slideLiveVitality.value);
    this.character.stats.sanity = parseInt(this.dom.slideLiveSanity.value);
    this.character.stats.happiness = parseInt(this.dom.slideLiveHappiness.value);
    this.character.stats.smarts = parseInt(this.dom.slideLiveSmarts.value);
    this.character.stats.occult = parseInt(this.dom.slideLiveOccult.value);
    this.character.stats.humanity = parseInt(this.dom.slideLiveHumanity.value);
    this.character.coin = parseInt(this.dom.slideLiveCoin.value);

    this.dom.godmodeModal.classList.add('hidden');
    this.dom.godmodeModal.style.display = 'none';
    this.renderAll();
    this.saveGame();
    window.soundEngine.playClick();
  }

  loadCrypt() {
    try {
      return JSON.parse(localStorage.getItem('TLL_CRYPT') || '[]');
    } catch (e) {
      return [];
    }
  }

  addToCrypt(character) {
    const record = {
      name: character.name,
      age: character.age,
      year: character.year,
      cause: character.deathCause,
      epitaph: character.epitaph,
      avatar: character.avatar,
      timestamp: Date.now()
    };
    this.crypt.unshift(record);
    if (this.crypt.length > 20) this.crypt.pop();
    localStorage.setItem('TLL_CRYPT', JSON.stringify(this.crypt));
  }

  renderCrypt() {
    this.dom.cryptList.innerHTML = '';
    if (this.crypt.length === 0) {
      this.dom.cryptList.innerHTML = `
        <div class="text-center py-12 text-dust">
          <i data-lucide="cross" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
          <p class="font-serif text-sm">The crypt is quiet.</p>
          <p class="text-[11px] text-dust/70 mt-1">No souls have met their demise in this lineage yet.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.crypt.forEach((item) => {
      const card = document.createElement('div');
      card.className = "bg-slatecard border border-leadborder rounded-xl p-3 flex items-start space-x-3";

      const canvasBox = document.createElement('div');
      canvasBox.className = "w-12 h-12 rounded-lg overflow-hidden border border-[#85754e] shrink-0 bg-[#0f1013]";
      const canvas = document.createElement('canvas');
      canvas.width = 72;
      canvas.height = 72;
      canvas.className = "w-full h-full";
      canvasBox.appendChild(canvas);
      card.appendChild(canvasBox);

      const info = document.createElement('div');
      info.className = "flex-1 min-w-0";
      info.innerHTML = `
        <div class="flex justify-between items-baseline">
          <h4 class="font-serif font-bold text-xs text-parchment truncate">${item.name}</h4>
          <span class="text-[10px] text-crimson font-mono font-bold">Age ${item.age}</span>
        </div>
        <p class="text-[11px] text-red-400/90 font-medium mt-0.5">${item.cause}</p>
        <p class="text-[10px] text-dust italic line-clamp-2 mt-1 leading-snug">"${item.epitaph}"</p>
      `;
      card.appendChild(info);

      this.dom.cryptList.appendChild(card);

      window.drawGothicAvatar(canvas, {
        ...item.avatar,
        age: item.age
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  saveGame() {
    const data = {
      character: this.character,
      logs: this.logs,
      usedDilemmaIds: Array.from(this.usedDilemmaIds)
    };
    localStorage.setItem('TLL_SAVE', JSON.stringify(data));
  }
}

function initGame() {
  if (!window.game) {
    try {
      window.game = new TerribleGame();
      console.log('TerribleGame initialized successfully!');
    } catch (e) {
      console.error('TerribleGame initialization failed:', e);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
