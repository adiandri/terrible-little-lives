// Game Engine for Terrible Little Lives (Modern Era, Dual Economy & Careers)

class TerribleGame {
  constructor() {
    this.character = null;
    this.logs = [];
    this.activeDilemma = null;
    this.usedDilemmaIds = new Set();
    this.crypt = this.loadCrypt();
    this.activeCareerTab = 'mundane';
    
    // Creator draft state
    this.creatorState = {
      avatar: window.generateRandomAvatar(),
      countryCode: "USA",
      city: "Seattle, WA",
      name: { first: "Alex", surname: "Mercer" },
      gender: "Male",
      trait: window.MODERN_TRAITS[0],
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
      money: 1500,
      shillings: 25
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
      selCountry: document.getElementById('sel-country'),
      selCity: document.getElementById('sel-city'),
      inputFirstName: document.getElementById('input-first-name'),
      inputSurname: document.getElementById('input-surname'),
      btnRandomName: document.getElementById('btn-random-name'),
      selGender: document.getElementById('sel-gender'),
      selTrait: document.getElementById('sel-trait'),
      traitDesc: document.getElementById('trait-desc'),

      // God Mode Controls (Creator)
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
      sliderMoney: document.getElementById('slider-god-money'),
      labelMoney: document.getElementById('label-god-money'),
      sliderShillings: document.getElementById('slider-god-shillings'),
      labelShillings: document.getElementById('label-god-shillings'),
      btnEmbark: document.getElementById('btn-embark'),

      // Main Game Header
      gameHeaderAvatar: document.getElementById('game-header-avatar'),
      charName: document.getElementById('char-name'),
      charJobTitle: document.getElementById('char-job-title'),
      charAgeYear: document.getElementById('char-age-year'),
      charMoney: document.getElementById('char-money'),
      charShillings: document.getElementById('char-shillings'),
      btnGameGodmode: document.getElementById('btn-game-godmode'),
      btnToMenu: document.getElementById('btn-to-menu'),

      // Stat bars
      barVitality: document.getElementById('bar-vitality'),
      valVitality: document.getElementById('val-vitality'),
      barSmarts: document.getElementById('bar-smarts'),
      valSmarts: document.getElementById('val-smarts'),
      barLooks: document.getElementById('bar-looks'),
      valLooks: document.getElementById('val-looks'),
      barHappiness: document.getElementById('bar-happiness'),
      valHappiness: document.getElementById('val-happiness'),
      barSanity: document.getElementById('bar-sanity'),
      valSanity: document.getElementById('val-sanity'),
      barOccult: document.getElementById('bar-occult'),
      valOccult: document.getElementById('val-occult'),
      barHumanity: document.getElementById('bar-humanity'),
      valHumanity: document.getElementById('val-humanity'),

      // Log feed & Endure button
      logFeed: document.getElementById('log-feed'),
      btnEndure: document.getElementById('btn-endure'),
      btnTabCareers: document.getElementById('btn-tab-careers'),

      // Careers Modal
      careersModal: document.getElementById('careers-modal'),
      btnCloseCareers: document.getElementById('btn-close-careers'),
      tabCareerMundane: document.getElementById('tab-career-mundane'),
      tabCareerParanormal: document.getElementById('tab-career-paranormal'),
      currentMundaneJob: document.getElementById('txt-current-mundane-job'),
      btnQuitMundane: document.getElementById('btn-quit-mundane'),
      careersList: document.getElementById('careers-list'),

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
      slideLiveLooks: document.getElementById('slide-live-looks'),
      lblLiveLooks: document.getElementById('lbl-live-looks'),
      slideLiveOccult: document.getElementById('slide-live-occult'),
      lblLiveOccult: document.getElementById('lbl-live-occult'),
      slideLiveHumanity: document.getElementById('slide-live-humanity'),
      lblLiveHumanity: document.getElementById('lbl-live-humanity'),
      slideLiveMoney: document.getElementById('slide-live-money'),
      lblLiveMoney: document.getElementById('lbl-live-money'),
      slideLiveShillings: document.getElementById('slide-live-shillings'),
      lblLiveShillings: document.getElementById('lbl-live-shillings')
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
    if (this.dom.btnLandingMute) {
      this.dom.btnLandingMute.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        const iconName = isMuted ? 'volume-x' : 'volume-2';
        if (this.dom.landingMuteIcon) this.dom.landingMuteIcon.setAttribute('data-lucide', iconName);
        if (window.lucide) window.lucide.createIcons();
      });
    }

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
      if (sel) sel.addEventListener('change', updateAvatarFromSelects);
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

    // Country selection change
    this.dom.selCountry.addEventListener('change', (e) => {
      const code = e.target.value;
      this.creatorState.countryCode = code;
      const country = window.COUNTRIES_DATA[code];
      
      this.updateCityOptions(code);
      this.updateMoneySliderLimits(code);
      this.randomizeName();
    });

    // City selection change
    this.dom.selCity.addEventListener('change', (e) => {
      this.creatorState.city = e.target.value;
    });

    // Randomize entire soul
    this.dom.btnCreatorRandomizeAll.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.creatorState.avatar = window.generateRandomAvatar();
      
      const countryKeys = Object.keys(window.COUNTRIES_DATA);
      const randomCode = window.getRandomElement(countryKeys);
      this.creatorState.countryCode = randomCode;
      this.dom.selCountry.value = randomCode;
      
      this.updateCityOptions(randomCode);
      this.updateMoneySliderLimits(randomCode);
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
      if (!slider || !label) return;
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        label.textContent = `${val}${suffix}`;
        this.creatorState.stats[key] = val;
      });
    };

    bindSlider(this.dom.sliderHappiness, this.dom.labelHappiness, 'happiness');
    bindSlider(this.dom.sliderSmarts, this.dom.labelSmarts, 'smarts');
    bindSlider(this.dom.sliderLooks, this.dom.labelLooks, 'looks');
    bindSlider(this.dom.sliderVitality, this.dom.labelVitality, 'vitality');
    bindSlider(this.dom.sliderSanity, this.dom.labelSanity, 'sanity');
    bindSlider(this.dom.sliderOccult, this.dom.labelOccult, 'occult');
    bindSlider(this.dom.sliderHumanity, this.dom.labelHumanity, 'humanity');

    // Dual Currency Sliders (Creator)
    this.dom.sliderMoney.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.creatorState.money = val;
      this.dom.labelMoney.textContent = window.formatMoney(val, this.creatorState.countryCode);
    });

    this.dom.sliderShillings.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.creatorState.shillings = val;
      this.dom.labelShillings.textContent = `${val} s.`;
    });

    // Trait change description
    this.dom.selTrait.addEventListener('change', (e) => {
      const trait = window.MODERN_TRAITS.find(t => t.id === e.target.value);
      if (trait) {
        this.creatorState.trait = trait;
        this.dom.traitDesc.textContent = trait.desc;
      }
    });

    // Embark Button
    this.dom.btnEmbark.addEventListener('click', () => {
      window.soundEngine.playTick();
      const first = this.dom.inputFirstName.value.trim() || "Alex";
      const last = this.dom.inputSurname.value.trim() || "Mercer";
      const config = {
        name: `${first} ${last}`,
        gender: this.dom.selGender.value,
        countryCode: this.creatorState.countryCode,
        city: this.dom.selCity.value || this.creatorState.city,
        trait: this.creatorState.trait,
        avatar: this.creatorState.avatar,
        isGodMode: this.creatorState.isGodMode,
        stats: { ...this.creatorState.stats },
        money: this.creatorState.money,
        shillings: this.creatorState.shillings
      };
      this.startNewLife(config);
    });

    // Gameplay Controls
    this.dom.btnEndure.addEventListener('click', () => this.endureYear());

    // Careers Modal Controls
    this.dom.btnTabCareers.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.openCareersModal();
    });

    this.dom.btnCloseCareers.addEventListener('click', () => {
      this.dom.careersModal.classList.add('hidden');
      this.dom.careersModal.style.display = 'none';
    });

    this.dom.tabCareerMundane.addEventListener('click', () => {
      this.activeCareerTab = 'mundane';
      this.renderCareersList();
    });

    this.dom.tabCareerParanormal.addEventListener('click', () => {
      this.activeCareerTab = 'paranormal';
      this.renderCareersList();
    });

    this.dom.btnQuitMundane.addEventListener('click', () => {
      this.quitMundaneJob();
    });

    // Live God Mode Inspector In-Game
    this.dom.btnGameGodmode.addEventListener('click', () => this.openLiveGodmodeInspector());
    this.dom.btnCloseGodmodeModal.addEventListener('click', () => {
      this.dom.godmodeModal.classList.add('hidden');
      this.dom.godmodeModal.style.display = 'none';
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
      if (confirm("Clear all deceased records from the City Morgue?")) {
        this.crypt = [];
        localStorage.removeItem('TLL_CRYPT');
        this.renderCrypt();
      }
    });
  }

  populateCreatorDropdowns() {
    // Populate Countries
    this.dom.selCountry.innerHTML = '';
    for (const [code, cData] of Object.entries(window.COUNTRIES_DATA)) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = `${cData.flag} ${cData.name} (${cData.currency.symbol} ${cData.currency.code})`;
      this.dom.selCountry.appendChild(opt);
    }
    this.dom.selCountry.value = this.creatorState.countryCode;

    // Populate Cities for initial country
    this.updateCityOptions(this.creatorState.countryCode);

    // Populate Traits
    this.dom.selTrait.innerHTML = '';
    window.MODERN_TRAITS.forEach(tr => {
      const opt = document.createElement('option');
      opt.value = tr.id;
      opt.textContent = tr.name;
      this.dom.selTrait.appendChild(opt);
    });
    this.dom.traitDesc.textContent = window.MODERN_TRAITS[0].desc;

    // Set Money Limits
    this.updateMoneySliderLimits(this.creatorState.countryCode);
  }

  updateCityOptions(countryCode) {
    const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
    this.dom.selCity.innerHTML = '';
    country.cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      this.dom.selCity.appendChild(opt);
    });
    this.creatorState.city = country.cities[0];
    this.dom.selCity.value = country.cities[0];
  }

  updateMoneySliderLimits(countryCode) {
    const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
    this.creatorState.money = country.startingMoney;

    this.dom.sliderMoney.min = "0";
    this.dom.sliderMoney.max = `${country.maxGodMoney}`;
    this.dom.sliderMoney.step = `${country.godMoneyStep}`;
    this.dom.sliderMoney.value = `${country.startingMoney}`;
    this.dom.labelMoney.textContent = window.formatMoney(country.startingMoney, countryCode);
  }

  randomizeName() {
    const country = window.COUNTRIES_DATA[this.creatorState.countryCode] || window.COUNTRIES_DATA.USA;
    const isMale = this.dom.selGender.value === 'Male';
    const first = isMale 
      ? window.getRandomElement(country.firstNamesMale)
      : window.getRandomElement(country.firstNamesFemale);
    const surname = window.getRandomElement(country.surnames);
    
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
          
          // Backwards compatibility for saves across updates
          if (this.character.money === undefined) {
            this.character.money = this.character.coin || 1500;
          }
          if (this.character.shillings === undefined) {
            this.character.shillings = 10;
          }
          if (!this.character.countryCode) {
            this.character.countryCode = "USA";
          }
          if (!this.character.city) {
            this.character.city = "Seattle, WA";
          }
          if (!this.character.statusTitle) {
            this.character.statusTitle = "Infant";
          }
          if (this.character.stats && this.character.stats.looks === undefined) {
            this.character.stats.looks = 70;
          }
          
          this.logs = data.logs || [];
          this.usedDilemmaIds = new Set(data.usedDilemmaIds || []);
          this.activeDilemma = null; // Clear any pending dilemma lock on resume
          
          this.dom.labelResumeLife.textContent = `RESUME: ${this.character.name.toUpperCase()} (AGE ${this.character.age})`;
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

    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;

    this.logs = [
      {
        age: 0,
        year: this.character.year,
        entries: [
          `Born in ${this.character.city}, ${country.name} (${country.flag}).`,
          this.character.origin,
          `Inherent Trait: ${this.character.trait.name} - ${this.character.trait.desc}`,
          `Starting Fiat Balance: ${window.formatMoney(this.character.money, this.character.countryCode)}.`,
          `Secret Paranormal Shillings: ${this.character.shillings} s.`
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

    // Status titles by age
    if (this.character.age <= 2) this.character.statusTitle = "Infant";
    else if (this.character.age <= 6) this.character.statusTitle = "Toddler";
    else if (this.character.age <= 12) this.character.statusTitle = "Child";
    else if (this.character.age <= 17) this.character.statusTitle = "Adolescent";
    else if (this.character.age <= 30) this.character.statusTitle = "Young Adult";
    else if (this.character.age <= 60) this.character.statusTitle = "Adult";
    else this.character.statusTitle = "Elder";

    const currentYearLog = {
      age: this.character.age,
      year: this.character.year,
      entries: []
    };

    // 1. Economic Updates (Mundane Salary)
    if (this.character.job) {
      const base = this.character.job.baseSalary || this.character.job.baseSalaryUSD || 24000;
      const salary = window.getAdjustedSalary(base, this.character.countryCode);
      this.character.money += salary;
      currentYearLog.entries.push(`Deposited salary: +${window.formatMoney(salary, this.character.countryCode)} working as a ${this.character.job.title}.`);
      
      if (this.character.job.stress > 25 && Math.random() < 0.4) {
        this.modifyStat('vitality', -1);
      }
    }

    // 2. Paranormal Gig Payout & Sanity Toll
    if (this.character.paranormalGig) {
      const gig = this.character.paranormalGig;
      this.character.shillings += gig.payoutShillings;
      this.modifyStat('sanity', -gig.sanityCost);
      currentYearLog.entries.push(`Collected +${gig.payoutShillings} s. from occult contract (${gig.title}). The ordeal drained -${gig.sanityCost}% Sanity.`);
    }

    // 3. Modern Living Expenses (Rent, Groceries, Utilities)
    if (this.character.age >= 18) {
      const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
      const annualRentCost = country.annualLivingCost || 16000;

      if (this.character.money >= annualRentCost) {
        this.character.money -= annualRentCost;
        if (this.character.age === 18) {
          currentYearLog.entries.push(`Paid first annual apartment rent and living expenses: -${window.formatMoney(annualRentCost, this.character.countryCode)}.`);
        }
      } else {
        // Poverty strain
        this.character.money = 0;
        this.modifyStat('happiness', -10);
        this.modifyStat('vitality', -2);
        currentYearLog.entries.push(`Struggled to afford rent and groceries in ${this.character.city}. Financial anxiety took a toll on health.`);
      }
    }

    // Natural vitality & looks age erosion
    this.modifyStat('vitality', (Math.random() > 0.7 ? -1 : 0));
    if (this.character.age > 35 && Math.random() < 0.35) {
      this.modifyStat('looks', -1);
    }

    // 4. Check for Interactive Dilemmas
    const dilemmaPool = window.INTERACTIVE_DILEMMAS || (window.GAME_DATA && window.GAME_DATA.INTERACTIVE_DILEMMAS) || [];
    const availableDilemmas = dilemmaPool.filter(d => 
      this.character.age >= d.minAge && 
      this.character.age <= d.maxAge && 
      !this.usedDilemmaIds.has(d.id)
    );

    if (availableDilemmas.length > 0 && Math.random() < 0.6) {
      const chosen = availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)];
      this.usedDilemmaIds.add(chosen.id);
      this.activeDilemma = chosen;

      this.logs.push(currentYearLog);
      this.renderAll();
      this.triggerDilemma(chosen);
      this.saveGame();
      return;
    }

    // 5. Ambient Atmospheric Events
    const ambientPool = (window.AMBIENT_YEAR_EVENTS || (window.GAME_DATA && window.GAME_DATA.AMBIENT_YEAR_EVENTS) || []).filter(e =>
      this.character.age >= e.minAge && this.character.age <= e.maxAge
    );

    if (ambientPool.length > 0 && Math.random() < 0.7) {
      const ambient = ambientPool[Math.floor(Math.random() * ambientPool.length)];
      currentYearLog.entries.push(ambient.text);
    } else {
      currentYearLog.entries.push("Another restless year went by under neon billboard glare and rain-slicked asphalt.");
    }

    // 6. Low Sanity Hallucinations
    if (this.character.stats.sanity < 30 && Math.random() < 0.65) {
      const modernWhispers = [
        "Your phone face-unlock triggered at 3:14 AM while the screen pointed at an empty closet.",
        "You woke up with black grit under your fingernails and your browser history opened to deleted surveillance footage.",
        "Your smart TV booted into a static test pattern transmitting the sound of wet footsteps approaching."
      ];
      currentYearLog.entries.push(modernWhispers[Math.floor(Math.random() * modernWhispers.length)]);
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
        if (stat === 'money') {
          this.character.money = Math.max(0, this.character.money + delta);
        } else if (stat === 'coin' || stat === 'shillings') {
          this.character.shillings = Math.max(0, this.character.shillings + delta);
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

  // Careers Modal Logic
  openCareersModal() {
    this.dom.careersModal.classList.remove('hidden');
    this.dom.careersModal.style.display = 'flex';
    this.renderCareersList();
  }

  renderCareersList() {
    // Tab active states
    if (this.activeCareerTab === 'mundane') {
      this.dom.tabCareerMundane.className = "py-1.5 rounded-lg bg-slatecard text-parchment font-serif font-bold transition-all text-center flex items-center justify-center gap-1.5";
      this.dom.tabCareerParanormal.className = "py-1.5 rounded-lg text-dust hover:text-amber-400 font-serif font-bold transition-all text-center flex items-center justify-center gap-1.5";
    } else {
      this.dom.tabCareerMundane.className = "py-1.5 rounded-lg text-dust hover:text-emerald-400 font-serif font-bold transition-all text-center flex items-center justify-center gap-1.5";
      this.dom.tabCareerParanormal.className = "py-1.5 rounded-lg bg-slatecard text-amber-300 font-serif font-bold transition-all text-center flex items-center justify-center gap-1.5";
    }

    // Update current employment banner
    if (this.character.job) {
      const sal = window.getAdjustedSalary(this.character.job.baseSalary || this.character.job.baseSalaryUSD, this.character.countryCode);
      this.dom.currentMundaneJob.textContent = `${this.character.job.title} (${window.formatMoney(sal, this.character.countryCode)}/yr)`;
      this.dom.btnQuitMundane.classList.remove('hidden');
      this.dom.btnQuitMundane.style.display = 'inline-block';
    } else {
      this.dom.currentMundaneJob.textContent = "Unemployed (No Income)";
      this.dom.btnQuitMundane.classList.add('hidden');
      this.dom.btnQuitMundane.style.display = 'none';
    }

    this.dom.careersList.innerHTML = '';

    if (this.activeCareerTab === 'mundane') {
      window.MUNDANE_CAREERS.forEach(job => {
        const isEmployed = this.character.job && this.character.job.id === job.id;
        const check = window.checkJobEligibility(this.character, job);
        const salary = window.getAdjustedSalary(job.baseSalary, this.character.countryCode);

        const card = document.createElement('div');
        card.className = `p-3 rounded-xl border ${isEmployed ? 'bg-emerald-950/25 border-emerald-600/70' : 'bg-[#121419] border-leadborder'} space-y-2`;

        const badgesHtml = check.badges.map(b => `
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border ${b.met ? 'bg-[#142018] border-emerald-800/60 text-emerald-300' : 'bg-[#221417] border-red-900/60 text-red-400'}">
            ${b.label}
          </span>
        `).join('');

        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="min-w-0 flex-1 pr-2">
              <h4 class="font-serif font-bold text-xs text-parchment">${job.title}</h4>
              <span class="text-[10px] font-mono text-emerald-400 font-bold">${window.formatMoney(salary, this.character.countryCode)} / year</span>
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${badgesHtml}
            </div>
          </div>
          <p class="text-[11px] text-dust leading-relaxed">${job.desc}</p>
          <div class="flex items-center justify-between pt-1 border-t border-leadborder/50 text-[10px]">
            <span class="text-dust/70 italic">${job.stress > 25 ? '⚠️ High Stress' : 'Standard Routine'}</span>
            ${isEmployed 
              ? `<span class="text-emerald-400 font-serif font-bold text-xs">Currently Employed</span>`
              : `<button class="btn-apply-job px-3 py-1 rounded ${check.eligible ? 'bg-slatecard hover:bg-emerald-900/60 border border-leadborder text-parchment font-serif font-bold active:scale-95' : 'bg-[#15171c] border border-leadborder/30 text-dust/50 cursor-not-allowed'}" ${!check.eligible ? 'disabled' : ''}>
                  ${check.eligible ? 'Apply' : check.reason}
                </button>`
            }
          </div>
        `;

        const applyBtn = card.querySelector('.btn-apply-job');
        if (applyBtn && check.eligible) {
          applyBtn.addEventListener('click', () => {
            this.applyMundaneJob(job);
          });
        }

        this.dom.careersList.appendChild(card);
      });
    } else {
      // Paranormal contracts
      window.PARANORMAL_CAREERS.forEach(gig => {
        const isContracted = this.character.paranormalGig && this.character.paranormalGig.id === gig.id;
        const check = window.checkJobEligibility(this.character, gig);

        const card = document.createElement('div');
        card.className = `p-3 rounded-xl border ${isContracted ? 'bg-amber-950/25 border-amber-600/70' : 'bg-[#121419] border-leadborder'} space-y-2`;

        const badgesHtml = check.badges.map(b => `
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border ${b.met ? 'bg-[#201c14] border-amber-800/60 text-amber-300' : 'bg-[#221417] border-red-900/60 text-red-400'}">
            ${b.label}
          </span>
        `).join('');

        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="min-w-0 flex-1 pr-2">
              <h4 class="font-serif font-bold text-xs text-parchment flex items-center gap-1.5">
                <i data-lucide="moon" class="w-3 h-3 text-amber-400 shrink-0"></i>
                <span class="truncate">${gig.title}</span>
              </h4>
              <span class="text-[10px] font-mono text-amber-400 font-bold">${gig.payoutShillings} s. / contract</span>
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${badgesHtml}
            </div>
          </div>
          <p class="text-[11px] text-dust leading-relaxed">${gig.desc}</p>
          <div class="flex items-center justify-between pt-1 border-t border-leadborder/50 text-[10px]">
            <span class="text-red-400/90 font-mono">-${gig.sanityCost}% Sanity/yr</span>
            ${isContracted
              ? `<button class="btn-quit-gig px-2.5 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono text-[10px]">Cut Ties</button>`
              : `<button class="btn-apply-gig px-3 py-1 rounded ${check.eligible ? 'bg-slatecard hover:bg-amber-950/60 border border-leadborder text-amber-300 font-serif font-bold active:scale-95' : 'bg-[#15171c] border border-leadborder/30 text-dust/50 cursor-not-allowed'}" ${!check.eligible ? 'disabled' : ''}>
                  ${check.eligible ? 'Accept Contract' : check.reason}
                </button>`
            }
          </div>
        `;

        const applyBtn = card.querySelector('.btn-apply-gig');
        if (applyBtn && check.eligible) {
          applyBtn.addEventListener('click', () => {
            this.applyParanormalGig(gig);
          });
        }

        const quitBtn = card.querySelector('.btn-quit-gig');
        if (quitBtn) {
          quitBtn.addEventListener('click', () => {
            this.quitParanormalGig();
          });
        }

        this.dom.careersList.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  applyMundaneJob(job) {
    this.character.job = job;
    window.soundEngine.playClick();
    const salary = window.getAdjustedSalary(job.baseSalary, this.character.countryCode);
    
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`Hired as ${job.title}. Annual salary: ${window.formatMoney(salary, this.character.countryCode)}.`);
    }

    this.renderCareersList();
    this.renderAll();
    this.saveGame();
  }

  quitMundaneJob() {
    if (!this.character.job) return;
    const oldTitle = this.character.job.title;
    this.character.job = null;
    window.soundEngine.playClick();

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`Resigned from position as ${oldTitle}.`);
    }

    this.renderCareersList();
    this.renderAll();
    this.saveGame();
  }

  applyParanormalGig(gig) {
    this.character.paranormalGig = gig;
    window.soundEngine.playDread();

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`Signed an occult contract: ${gig.title} (+${gig.payoutShillings} s. / yr).`);
    }

    this.renderCareersList();
    this.renderAll();
    this.saveGame();
  }

  quitParanormalGig() {
    if (!this.character.paranormalGig) return;
    const oldTitle = this.character.paranormalGig.title;
    this.character.paranormalGig = null;
    window.soundEngine.playClick();

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`Severed ties with occult handlers (${oldTitle}).`);
    }

    this.renderCareersList();
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
      this.die("Physical Collapse", `Succumbed to bodily injury and extreme hypothermia. Pronounced dead at ${this.character.city} General Hospital.`);
    } else if (this.character.stats.sanity <= 0) {
      this.die("Mind Shattered", "Total psychological dissolution. Found repeating unrendered unicode strings in a locked room; committed to the state psychiatric ward.");
    } else if (this.character.stats.humanity <= 0) {
      this.die("Transcendence Beyond Flesh", "Humanity expired completely. Walked into the underground subway tunnels at midnight and never returned to the physical world.");
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
    this.dom.deathEpitaph.textContent = `"${this.character.epitaph}"`;

    window.drawGothicAvatar(this.dom.deathAvatarCanvas, {
      ...this.character.avatar,
      age: this.character.age
    });

    this.dom.deathModal.classList.remove('hidden');
    this.dom.deathModal.style.display = 'flex';
  }

  hideModals() {
    const modals = [
      this.dom.dilemmaModal,
      this.dom.dilemmaBackdrop,
      this.dom.deathModal,
      this.dom.godmodeModal,
      this.dom.careersModal
    ];

    modals.forEach(m => {
      if (m) {
        m.classList.add('hidden');
        m.style.display = 'none';
      }
    });
  }

  renderAll() {
    if (!this.character) return;

    window.drawGothicAvatar(this.dom.gameHeaderAvatar, {
      ...this.character.avatar,
      age: this.character.age
    });

    this.dom.charName.textContent = this.character.name;
    
    // Header job or status title
    const activeTitle = this.character.job 
      ? this.character.job.title 
      : (this.character.paranormalGig ? this.character.paranormalGig.title : this.character.statusTitle);
    this.dom.charJobTitle.textContent = activeTitle;

    this.dom.charAgeYear.textContent = `Age: ${this.character.age} | ${this.character.year}`;
    
    // Dual currency display
    this.dom.charMoney.textContent = window.formatMoney(this.character.money, this.character.countryCode);
    this.dom.charShillings.textContent = `${this.character.shillings} s.`;

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
    this.updateStatBar(this.dom.barLooks, this.dom.valLooks, this.character.stats.looks);
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
    if (!barEl || !valEl) return;
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
      yearText.textContent = `${yearLog.year}`;

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
        } else if (entry.startsWith('Deposited salary') || entry.startsWith('Starting Fiat Balance')) {
          p.className = "relative pl-3 text-emerald-400 font-medium before:content-['$'] before:absolute before:left-0 before:text-emerald-400";
        } else if (entry.startsWith('Collected') || entry.startsWith('Secret Paranormal Shillings') || entry.startsWith('Signed an occult contract')) {
          p.className = "relative pl-3 text-amber-300 font-medium before:content-['🪙'] before:absolute before:left-0 before:text-amber-300";
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

    if (this.dom.slideLiveLooks && this.dom.lblLiveLooks) {
      const looksVal = stats.looks !== undefined ? stats.looks : 70;
      this.dom.slideLiveLooks.value = looksVal;
      this.dom.lblLiveLooks.textContent = `${looksVal}%`;
      this.dom.slideLiveLooks.oninput = (e) => this.dom.lblLiveLooks.textContent = `${e.target.value}%`;
    }

    this.dom.slideLiveOccult.value = stats.occult;
    this.dom.lblLiveOccult.textContent = `${stats.occult}%`;
    this.dom.slideLiveOccult.oninput = (e) => this.dom.lblLiveOccult.textContent = `${e.target.value}%`;

    this.dom.slideLiveHumanity.value = stats.humanity;
    this.dom.lblLiveHumanity.textContent = `${stats.humanity}%`;
    this.dom.slideLiveHumanity.oninput = (e) => this.dom.lblLiveHumanity.textContent = `${e.target.value}%`;

    // Dynamic scale for live money slider
    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
    const maxMoney = country.maxGodMoney || 1000000;
    const step = country.godMoneyStep || 5000;

    this.dom.slideLiveMoney.max = `${maxMoney}`;
    this.dom.slideLiveMoney.step = `${step}`;
    this.dom.slideLiveMoney.value = this.character.money;
    this.dom.lblLiveMoney.textContent = window.formatMoney(this.character.money, this.character.countryCode);
    this.dom.slideLiveMoney.oninput = (e) => {
      this.dom.lblLiveMoney.textContent = window.formatMoney(parseInt(e.target.value), this.character.countryCode);
    };

    this.dom.slideLiveShillings.value = this.character.shillings;
    this.dom.lblLiveShillings.textContent = `${this.character.shillings} s.`;
    this.dom.slideLiveShillings.oninput = (e) => {
      this.dom.lblLiveShillings.textContent = `${e.target.value} s.`;
    };

    this.dom.godmodeModal.classList.remove('hidden');
    this.dom.godmodeModal.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  }

  applyLiveGodmodeTweaks() {
    this.character.stats.vitality = parseInt(this.dom.slideLiveVitality.value);
    this.character.stats.sanity = parseInt(this.dom.slideLiveSanity.value);
    this.character.stats.happiness = parseInt(this.dom.slideLiveHappiness.value);
    this.character.stats.smarts = parseInt(this.dom.slideLiveSmarts.value);
    if (this.dom.slideLiveLooks) {
      this.character.stats.looks = parseInt(this.dom.slideLiveLooks.value);
    }
    this.character.stats.occult = parseInt(this.dom.slideLiveOccult.value);
    this.character.stats.humanity = parseInt(this.dom.slideLiveHumanity.value);
    this.character.money = parseInt(this.dom.slideLiveMoney.value);
    this.character.shillings = parseInt(this.dom.slideLiveShillings.value);

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
          <p class="font-serif text-sm">The morgue is quiet.</p>
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
      console.log('TerribleGame modern engine initialized successfully!');
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
