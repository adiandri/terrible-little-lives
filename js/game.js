// Game Engine for Terrible Little Lives (Modern Era, Dual Economy & Careers)

class TerribleGame {
  constructor() {
    this.character = null;
    this.logs = [];
    this.activeDilemma = null;
    this.usedDilemmaIds = new Set();
    this.crypt = this.loadCrypt();
    this.activeCareerTab = 'mundane';
    this.selectedKin = null;
    this.activeKinFilter = 'all';
    this.activeActivityFilter = 'all';
    this.revelationTarget = null;
    
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

    this.activeThemeFilter = 'all';
    this.initElements();
    this.syncThemeLabel();
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
      btnLandingTheme: document.getElementById('btn-landing-theme'),
      txtCurrentThemeName: document.getElementById('txt-current-theme-name'),
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
      btnGameTheme: document.getElementById('btn-game-theme'),
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
      lblLiveShillings: document.getElementById('lbl-live-shillings'),

      // Theme Modal
      themeModal: document.getElementById('theme-modal'),
      btnCloseThemeModal: document.getElementById('btn-close-theme-modal'),
      tabThemeAll: document.getElementById('tab-theme-all'),
      tabThemeDark: document.getElementById('tab-theme-dark'),
      tabThemeLight: document.getElementById('tab-theme-light'),
      themeListContainer: document.getElementById('themes-list'),

      // Kin Modal
      btnTabKin: document.getElementById('btn-tab-kin'),
      kinModal: document.getElementById('kin-modal'),
      btnCloseKin: document.getElementById('btn-close-kin'),
      kinList: document.getElementById('kin-list'),
      kinFilterBtns: document.querySelectorAll('.kin-filter-btn'),

      // Kin Detail Modal
      kinDetailModal: document.getElementById('kin-detail-modal'),
      btnCloseKinDetail: document.getElementById('btn-close-kin-detail'),
      kinDetailTitle: document.getElementById('kin-detail-title'),
      kinDetailDossier: document.getElementById('kin-detail-dossier'),
      btnKinSpendTime: document.getElementById('btn-kin-spend-time'),
      btnKinConverse: document.getElementById('btn-kin-converse'),
      btnKinCompliment: document.getElementById('btn-kin-compliment'),
      btnKinGift: document.getElementById('btn-kin-gift'),
      btnKinAskMoney: document.getElementById('btn-kin-ask-money'),
      btnKinInvestigate: document.getElementById('btn-kin-investigate'),
      btnKinTribute: document.getElementById('btn-kin-tribute'),
      btnKinArgue: document.getElementById('btn-kin-argue'),

      // Activities Modal
      btnTabActivities: document.getElementById('btn-tab-activities'),
      activitiesModal: document.getElementById('activities-modal'),
      btnCloseActivities: document.getElementById('btn-close-activities'),
      activitiesList: document.getElementById('activities-list'),
      activitiesStaminaBadge: document.getElementById('activities-stamina-badge'),
      activityFilterBtns: document.querySelectorAll('.activity-filter-btn'),

      // Revelation Modal
      revelationModal: document.getElementById('revelation-modal'),
      revelationName: document.getElementById('revelation-name'),
      revelationText: document.getElementById('revelation-text'),
      btnRevelationLoyal: document.getElementById('btn-revelation-loyal'),
      btnRevelationReport: document.getElementById('btn-revelation-report'),
      btnRevelationIgnore: document.getElementById('btn-revelation-ignore'),

      // Ask Money Modal
      kinAskMoneyModal: document.getElementById('kin-ask-money-modal'),
      btnCloseAskMoney: document.getElementById('btn-close-ask-money'),
      askMoneyTargetName: document.getElementById('ask-money-target-name'),
      askMoneyTargetDesc: document.getElementById('ask-money-target-desc'),
      slideAskMoney: document.getElementById('slide-ask-money'),
      lblAskMoneyAmount: document.getElementById('lbl-ask-money-amount'),
      lblAskMoneyMin: document.getElementById('lbl-ask-money-min'),
      lblAskMoneyMax: document.getElementById('lbl-ask-money-max'),
      lblAskMoneyHint: document.getElementById('lbl-ask-money-hint'),
      btnSubmitAskMoney: document.getElementById('btn-submit-ask-money'),
      btnCancelAskMoney: document.getElementById('btn-cancel-ask-money'),

      // Gift Modal
      kinGiftModal: document.getElementById('kin-gift-modal'),
      btnCloseGiftModal: document.getElementById('btn-close-gift-modal'),
      giftModalTargetName: document.getElementById('gift-modal-target-name'),
      giftModalTargetHint: document.getElementById('gift-modal-target-hint'),
      btnShuffleGifts: document.getElementById('btn-shuffle-gifts'),
      giftCardsList: document.getElementById('gift-cards-list'),
      btnCancelGift: document.getElementById('btn-cancel-gift'),

      // Feedback Dialog Modal
      kinFeedbackModal: document.getElementById('kin-feedback-modal'),
      feedbackIconBox: document.getElementById('feedback-icon-box'),
      feedbackIcon: document.getElementById('feedback-icon'),
      feedbackTag: document.getElementById('feedback-tag'),
      feedbackTitle: document.getElementById('feedback-title'),
      feedbackBody: document.getElementById('feedback-body'),
      feedbackPills: document.getElementById('feedback-pills'),
      btnCloseFeedback: document.getElementById('btn-close-feedback')
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

    // Kin Modal Controls
    if (this.dom.btnTabKin) {
      this.dom.btnTabKin.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openKinModal();
      });
    }
    if (this.dom.btnCloseKin) {
      this.dom.btnCloseKin.addEventListener('click', () => this.closeKinModal());
    }
    if (this.dom.kinFilterBtns) {
      this.dom.kinFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          window.soundEngine.playClick();
          this.filterKin(e.currentTarget.dataset.filter);
        });
      });
    }

    // Kin Detail Modal Controls
    if (this.dom.btnCloseKinDetail) {
      this.dom.btnCloseKinDetail.addEventListener('click', () => this.closeKinDetailModal());
    }
    if (this.dom.btnKinSpendTime) {
      this.dom.btnKinSpendTime.addEventListener('click', () => this.handleKinAction('spend_time'));
    }
    if (this.dom.btnKinConverse) {
      this.dom.btnKinConverse.addEventListener('click', () => this.handleKinAction('converse'));
    }
    if (this.dom.btnKinCompliment) {
      this.dom.btnKinCompliment.addEventListener('click', () => this.handleKinAction('compliment'));
    }
    if (this.dom.btnKinGift) {
      this.dom.btnKinGift.addEventListener('click', () => this.handleKinAction('gift'));
    }
    if (this.dom.btnKinAskMoney) {
      this.dom.btnKinAskMoney.addEventListener('click', () => this.handleKinAction('ask_money'));
    }
    if (this.dom.btnKinInvestigate) {
      this.dom.btnKinInvestigate.addEventListener('click', () => this.handleKinAction('investigate'));
    }
    if (this.dom.btnKinTribute) {
      this.dom.btnKinTribute.addEventListener('click', () => this.handleKinAction('tribute'));
    }
    if (this.dom.btnKinArgue) {
      this.dom.btnKinArgue.addEventListener('click', () => this.handleKinAction('argue'));
    }

    // Ask Money Modal Controls
    if (this.dom.btnCloseAskMoney) {
      this.dom.btnCloseAskMoney.addEventListener('click', () => this.closeAskMoneyModal());
    }
    if (this.dom.btnCancelAskMoney) {
      this.dom.btnCancelAskMoney.addEventListener('click', () => this.closeAskMoneyModal());
    }
    if (this.dom.slideAskMoney) {
      this.dom.slideAskMoney.addEventListener('input', (e) => {
        this.updateAskMoneySliderUI(parseInt(e.target.value, 10));
      });
    }
    if (this.dom.btnSubmitAskMoney) {
      this.dom.btnSubmitAskMoney.addEventListener('click', () => this.submitAskMoney());
    }

    // Gift Modal Controls
    if (this.dom.btnCloseGiftModal) {
      this.dom.btnCloseGiftModal.addEventListener('click', () => this.closeGiftModal());
    }
    if (this.dom.btnCancelGift) {
      this.dom.btnCancelGift.addEventListener('click', () => this.closeGiftModal());
    }
    if (this.dom.btnShuffleGifts) {
      this.dom.btnShuffleGifts.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.renderGiftCardsList();
      });
    }

    // Feedback Dialog Modal Controls
    if (this.dom.btnCloseFeedback) {
      this.dom.btnCloseFeedback.addEventListener('click', () => this.closeFeedbackModal());
    }

    // Activities Modal Controls
    if (this.dom.btnTabActivities) {
      this.dom.btnTabActivities.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openActivitiesModal();
      });
    }
    if (this.dom.btnCloseActivities) {
      this.dom.btnCloseActivities.addEventListener('click', () => this.closeActivitiesModal());
    }
    if (this.dom.activityFilterBtns) {
      this.dom.activityFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          window.soundEngine.playClick();
          this.filterActivities(e.currentTarget.dataset.category);
        });
      });
    }

    // Revelation Modal Controls
    if (this.dom.btnRevelationLoyal) {
      this.dom.btnRevelationLoyal.addEventListener('click', () => this.handleRevelationChoice('loyal'));
    }
    if (this.dom.btnRevelationReport) {
      this.dom.btnRevelationReport.addEventListener('click', () => this.handleRevelationChoice('report'));
    }
    if (this.dom.btnRevelationIgnore) {
      this.dom.btnRevelationIgnore.addEventListener('click', () => this.handleRevelationChoice('ignore'));
    }

    // Death Modal actions
    this.dom.btnNewLife.addEventListener('click', () => {
      this.hideModals();
      this.showScreen('screen-creator');
    });
    this.dom.btnDeathToCrypt.addEventListener('click', () => {
      this.hideModals();
      this.showScreen('screen-crypt');
    });

    // Theme Switcher Controls
    if (this.dom.btnLandingTheme) {
      this.dom.btnLandingTheme.addEventListener('click', () => this.openThemeModal());
    }
    if (this.dom.btnGameTheme) {
      this.dom.btnGameTheme.addEventListener('click', () => this.openThemeModal());
    }
    if (this.dom.btnCloseThemeModal) {
      this.dom.btnCloseThemeModal.addEventListener('click', () => this.closeThemeModal());
    }
    if (this.dom.tabThemeAll) {
      this.dom.tabThemeAll.addEventListener('click', () => this.filterThemes('all'));
    }
    if (this.dom.tabThemeDark) {
      this.dom.tabThemeDark.addEventListener('click', () => this.filterThemes('dark'));
    }
    if (this.dom.tabThemeLight) {
      this.dom.tabThemeLight.addEventListener('click', () => this.filterThemes('light'));
    }

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
          if (!this.character.kin) {
            this.character.kin = window.generateFamily(this.character);
          }
          if (this.character.actionsLeft === undefined || this.character.maxActions < 40) {
            this.character.actionsLeft = 40;
            this.character.maxActions = 40;
          }
          if (!this.character.activityUses) {
            this.character.activityUses = {};
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
    this.character.kin = window.generateFamily(this.character);
    this.character.actionsLeft = 40;
    this.character.maxActions = 40;
    this.character.activityUses = {};
    this.usedDilemmaIds.clear();

    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;

    const familySummary = [];
    if (this.character.kin.parents && this.character.kin.parents.length > 0) {
      familySummary.push(`Parents: ${this.character.kin.parents.map(p => `${p.name} (${p.occupation})`).join(', ')}.`);
    }
    if (this.character.kin.siblings && this.character.kin.siblings.length > 0) {
      familySummary.push(`Siblings: ${this.character.kin.siblings.map(s => `${s.name} (Age ${s.age})`).join(', ')}.`);
    }
    if (this.character.kin.grandparents && this.character.kin.grandparents.length > 0) {
      familySummary.push(`Living Grandparents: ${this.character.kin.grandparents.map(g => `${g.name}`).join(', ')}.`);
    }

    this.logs = [
      {
        age: 0,
        year: this.character.year,
        entries: [
          `Born in ${this.character.city}, ${country.name} (${country.flag}).`,
          this.character.origin,
          ...familySummary,
          `Inherent Trait: ${this.character.trait.name} - ${this.character.trait.desc}`,
          `Starting Fiat Balance: ${window.formatMoney(this.character.money, this.character.countryCode)}.`,
          `Secret Paranormal Shillings: ${this.character.shillings} s.`
        ]
      }
    ];

    this.character.statusTitle = "Infant";
    this.activeDilemma = null;
    this.hideModals();
    this.saveGame();
    this.renderAll();
    this.showScreen('screen-game');
  }

  endureYear() {
    if (!this.character.isAlive || this.activeDilemma) return;

    window.soundEngine.playTick();
    if (navigator.vibrate) navigator.vibrate(35);

    this.character.age += 1;
    this.character.year += 1;

    // Replenish annual energy pool & reset activity quotas
    this.character.maxActions = 40;
    this.character.actionsLeft = 40;
    this.character.activityUses = {};

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

    // Ensure kin exists and tick their simulation (aging, allowances, mortality, friend discovery)
    if (!this.character.kin) {
      this.character.kin = window.generateFamily(this.character);
    }
    const kinLogs = window.tickKinYear(this.character) || [];

    // ==========================================
    // 5-7 MULTI-EVENT YEARLY CHRONICLE
    // ==========================================

    // 1. Life Stage & Developmental Milestone
    if (this.character.age === 1) {
      currentYearLog.entries.push(`Turned 1 year old. You learned to crawl across cold hardwood floorboards, watching dust motes spin in pale sunlight.`);
    } else if (this.character.age <= 4) {
      const toddlerMilestones = [
        `Turned ${this.character.age}. You learned to speak in fragmented sentences, pointing out shadows that lingered too long in the corners.`,
        `Turned ${this.character.age}. You spent hours stacking wooden blocks, knocking them over whenever footsteps passed the doorway.`,
        `Turned ${this.character.age}. Your nursery window stayed damp with winter frost; you learned to recognize passing siren wails.`
      ];
      currentYearLog.entries.push(window.getRandomElement(toddlerMilestones));
    } else if (this.character.age <= 11) {
      const elementaryMilestones = [
        `Turned ${this.character.age}. Attended municipal primary school in ${this.character.city}. Fluorescent bulbs hummed steadily over chalkboards.`,
        `Turned ${this.character.age}. Traded pencil erasers and horror comics with classmates beneath the playground stairwell.`,
        `Turned ${this.character.age}. Handed in school homework while rumors circulated about stray animals vanishing around the city reservoir.`
      ];
      currentYearLog.entries.push(window.getRandomElement(elementaryMilestones));
    } else if (this.character.age <= 17) {
      const adolescentMilestones = [
        `Turned ${this.character.age}. Navigated high school corridors, peer cliques, and the suffocating pressure of an uncertain future.`,
        `Turned ${this.character.age}. Late night study sessions in ${this.character.city} accompanied by distant freight trains and sirens.`,
        `Turned ${this.character.age}. High school rumors whispered about students slipping into the drainage tunnels after dark.`
      ];
      currentYearLog.entries.push(window.getRandomElement(adolescentMilestones));
    } else if (this.character.age <= 29) {
      currentYearLog.entries.push(`Turned ${this.character.age}. Confronting the harsh grind of young adulthood in ${this.character.city}.`);
    } else if (this.character.age <= 59) {
      currentYearLog.entries.push(`Turned ${this.character.age}. Navigating the relentless responsibilities and quiet isolation of adult life.`);
    } else {
      currentYearLog.entries.push(`Turned ${this.character.age}. Watching decades of memories blur together through the fog of ${this.character.city}.`);
    }

    // 2. Career / Vocation / School Performance
    if (this.character.job) {
      const base = this.character.job.baseSalary || this.character.job.baseSalaryUSD || 24000;
      const salary = window.getAdjustedSalary(base, this.character.countryCode);
      this.character.money += salary;
      currentYearLog.entries.push(`Deposited salary: +${window.formatMoney(salary, this.character.countryCode)} working as a ${this.character.job.title}.`);
      
      if (this.character.job.stress > 25 && Math.random() < 0.4) {
        this.modifyStat('vitality', -1);
      }
    } else if (this.character.age >= 18) {
      const unemploymentVignettes = [
        "Lacking full-time employment, you scraped together odd cash errands and gig deliveries.",
        "Submitted electronic resumes to indifferent corporate job portals without response.",
        "Struggled to secure steady work; spent afternoons browsing want-ads in the municipal library."
      ];
      currentYearLog.entries.push(window.getRandomElement(unemploymentVignettes));
    } else {
      // Minor school life
      const schoolReports = [
        "Received annual school report card. Teachers noted quiet behavior and an unusual fascination with local folklore.",
        "Passed annual academic examinations without issue; your teachers praised your steady focus.",
        "Sat through mandatory standardized testing under buzzing gymnasium halogen lamps."
      ];
      currentYearLog.entries.push(window.getRandomElement(schoolReports));
    }

    // 3. Living Expenses & Economy
    if (this.character.paranormalGig) {
      const gig = this.character.paranormalGig;
      this.character.shillings += gig.payoutShillings;
      this.modifyStat('sanity', -gig.sanityCost);
      currentYearLog.entries.push(`Collected +${gig.payoutShillings} s. from occult contract (${gig.title}). The ordeal drained -${gig.sanityCost}% Sanity.`);
    }

    if (this.character.age >= 18) {
      const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
      const annualRentCost = country.annualLivingCost || 16000;

      if (this.character.money >= annualRentCost) {
        this.character.money -= annualRentCost;
        currentYearLog.entries.push(`Paid annual apartment rent and living expenses: -${window.formatMoney(annualRentCost, this.character.countryCode)}.`);
      } else {
        this.character.money = 0;
        this.modifyStat('happiness', -10);
        this.modifyStat('vitality', -2);
        currentYearLog.entries.push(`Struggled to afford rent and groceries in ${this.character.city}. Financial anxiety severely strained your health.`);
      }
    } else {
      // Minor allowance / home dynamic
      const homeDynamics = [
        "Family household groceries were paid for by your parents; the refrigerator remained stocked with basic staples.",
        "Helped with chores around the house in exchange for dinner and a warm bed.",
        "Listened to parental discussions about the rising cost of municipal electricity and heating oil."
      ];
      currentYearLog.entries.push(window.getRandomElement(homeDynamics));
    }

    // 4. Kin Dynamics, Allowances & Family Mortality
    if (kinLogs.length > 0) {
      kinLogs.forEach(kl => currentYearLog.entries.push(kl));
    } else {
      const kinVignettes = [
        "Your family shared quiet evening meals beneath the yellow kitchen light.",
        "Your acquaintances and friends went about their normal routines across the district.",
        "A peaceful, uneventful year passed within your immediate family circle."
      ];
      currentYearLog.entries.push(window.getRandomElement(kinVignettes));
    }

    // 5. Urban Atmosphere & Ambient Lore
    const ambientPool = (window.AMBIENT_YEAR_EVENTS || (window.GAME_DATA && window.GAME_DATA.AMBIENT_YEAR_EVENTS) || []).filter(e =>
      this.character.age >= e.minAge && this.character.age <= e.maxAge
    );
    if (ambientPool.length > 0) {
      const ambient = ambientPool[Math.floor(Math.random() * ambientPool.length)];
      currentYearLog.entries.push(ambient.text);
    } else {
      currentYearLog.entries.push("Another restless year went by under neon billboard glare and rain-slicked asphalt.");
    }

    // 6. Psychological / Sensory Reality Distortion
    if (this.character.stats.sanity < 30) {
      const modernWhispers = [
        "Your phone face-unlock triggered at 3:14 AM while the screen was pointed at an empty closet.",
        "You woke up with black grit under your fingernails and your browser history opened to deleted surveillance footage.",
        "Your smart TV booted into a static test pattern transmitting the sound of wet footsteps approaching."
      ];
      currentYearLog.entries.push(window.getRandomElement(modernWhispers));
      this.modifyStat('sanity', -3);
    } else {
      const sensoryEvents = [
        "A late-night storm knocked out municipal transformers; the entire district plunged into dead silence for hours.",
        "You noticed several stray cats perched motionless on fire escapes, all staring toward the same locked sewer grate.",
        "A low-frequency hum resonated through your water pipes every Tuesday at dawn.",
        "You found an old cassette tape on the subway platform with your name written on the magnetic strip in dried marker."
      ];
      currentYearLog.entries.push(window.getRandomElement(sensoryEvents));
    }

    // Natural vitality & looks age erosion
    this.modifyStat('vitality', (Math.random() > 0.7 ? -1 : 0));
    if (this.character.age > 35 && Math.random() < 0.35) {
      this.modifyStat('looks', -1);
    }

    // 7. Interactive Dilemma or Ambient Encounter
    const dilemmaPool = window.INTERACTIVE_DILEMMAS || (window.GAME_DATA && window.GAME_DATA.INTERACTIVE_DILEMMAS) || [];
    const availableDilemmas = dilemmaPool.filter(d => 
      this.character.age >= d.minAge && 
      this.character.age <= d.maxAge && 
      !this.usedDilemmaIds.has(d.id)
    );

    const milestoneAges = [1, 2, 3, 4, 5, 7, 9, 11, 14, 16, 18];
    const isMilestone = milestoneAges.includes(this.character.age);
    const triggerChance = isMilestone ? 1.0 : 0.85;

    if (availableDilemmas.length > 0 && Math.random() < triggerChance) {
      const chosen = availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)];
      this.usedDilemmaIds.add(chosen.id);
      this.activeDilemma = chosen;

      this.logs.push(currentYearLog);
      this.renderAll();
      this.triggerDilemma(chosen);
      this.saveGame();
      return;
    } else {
      currentYearLog.entries.push("A rumor spread through town about a locked basement door found open near the city reservoir.");
    }

    this.logs.push(currentYearLog);
    this.checkMortality();
    this.renderAll();
    this.saveGame();
  }

  triggerDilemma(dilemma) {
    this.activeDilemma = dilemma;
    window.soundEngine.playDread();
    if (navigator.vibrate) navigator.vibrate([50, 40, 80]);

    this.dom.dilemmaTitle.textContent = dilemma.title;
    this.dom.dilemmaPrompt.textContent = dilemma.prompt;
    this.dom.dilemmaChoices.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    dilemma.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = "w-full text-left p-3.5 rounded-xl bg-inputbg hover:bg-cardhover active:scale-[0.98] border border-leadborder text-parchment text-xs transition-all flex items-start space-x-3 shadow-xs group";
      
      const badge = document.createElement('span');
      badge.className = "px-2.5 py-1 rounded-md text-xs bg-amber-950/40 border border-amber-800/60 text-amber-300 font-mono font-bold shrink-0 group-hover:bg-amber-900/60 transition-colors";
      badge.textContent = `${letters[idx] || (idx + 1)}`;

      const textSpan = document.createElement('span');
      textSpan.className = "leading-relaxed text-parchment pt-0.5";
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

    const dilemma = this.activeDilemma;
    const choice = dilemma.choices[choiceIdx];
    const latestLog = this.logs[this.logs.length - 1];

    if (latestLog) {
      latestLog.entries.push(`[${dilemma.title}] You chose: ${choice.text}`);
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

    const title = dilemma.title;
    const outcome = choice.outcome;
    const effects = choice.effects || {};

    this.activeDilemma = null;
    this.hideModals();
    this.checkMortality();
    this.renderAll();
    this.saveGame();

    // Show visual consequence feedback modal
    this.openFeedbackModal({
      tag: "CONSEQUENCE",
      title: title,
      icon: "alert-circle",
      iconColor: "text-amber-400",
      body: outcome,
      effects: effects
    });
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
        card.className = `p-3.5 rounded-xl border transition-all ${
          isEmployed 
            ? 'bg-fiatbg border-fiat/60 ring-1 ring-fiat/40 shadow-sm' 
            : 'bg-inputbg hover:bg-cardhover border-leadborder shadow-xs'
        } space-y-2.5`;

        const badgesHtml = check.badges.map(b => `
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${b.met ? 'badge-stat-met' : 'badge-stat-unmet'}">
            ${b.label}
          </span>
        `).join('');

        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="min-w-0 flex-1 pr-2">
              <h4 class="font-serif font-bold text-xs text-parchment">${job.title}</h4>
              <span class="text-[11px] font-mono text-fiat font-bold">${window.formatMoney(salary, this.character.countryCode)} / year</span>
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${badgesHtml}
            </div>
          </div>
          <p class="text-[11px] text-dust leading-relaxed">${job.desc}</p>
          <div class="flex items-center justify-between pt-2 border-t border-leadborder/60 text-[10px]">
            <span class="text-dust/80 font-mono italic">${job.stress > 25 ? '⚠️ High Stress' : 'Standard Routine'}</span>
            ${isEmployed 
              ? `<span class="text-fiat font-serif font-bold text-xs">✓ Currently Employed</span>`
              : `<button class="btn-apply-job px-3 py-1.5 rounded-lg text-xs font-serif font-bold active:scale-95 transition-all ${
                  check.eligible ? 'btn-apply-active shadow-xs' : 'btn-apply-locked cursor-not-allowed'
                }" ${!check.eligible ? 'disabled' : ''}>
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
        card.className = `p-3.5 rounded-xl border transition-all ${
          isContracted 
            ? 'bg-shillingbg border-shilling/60 ring-1 ring-shilling/40 shadow-sm' 
            : 'bg-inputbg hover:bg-cardhover border-leadborder shadow-xs'
        } space-y-2.5`;

        const badgesHtml = check.badges.map(b => `
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${b.met ? 'badge-occult-met' : 'badge-stat-unmet'}">
            ${b.label}
          </span>
        `).join('');

        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="min-w-0 flex-1 pr-2">
              <h4 class="font-serif font-bold text-xs text-parchment flex items-center gap-1.5">
                <i data-lucide="moon" class="w-3.5 h-3.5 text-shilling shrink-0"></i>
                <span class="truncate">${gig.title}</span>
              </h4>
              <span class="text-[11px] font-mono text-shilling font-bold">${gig.payoutShillings} s. / contract</span>
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${badgesHtml}
            </div>
          </div>
          <p class="text-[11px] text-dust leading-relaxed">${gig.desc}</p>
          <div class="flex items-center justify-between pt-2 border-t border-leadborder/60 text-[10px]">
            <span class="text-crimson font-mono font-medium">-${gig.sanityCost}% Sanity/yr</span>
            ${isContracted
              ? `<button class="btn-quit-gig px-2.5 py-1 rounded-md border border-red-500/40 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-300 font-mono text-[10px] transition-colors">Cut Ties</button>`
              : `<button class="btn-apply-gig px-3 py-1.5 rounded-lg text-xs font-serif font-bold active:scale-95 transition-all text-shilling ${
                  check.eligible ? 'btn-apply-active shadow-xs' : 'btn-apply-locked cursor-not-allowed'
                }" ${!check.eligible ? 'disabled' : ''}>
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

  // ==========================================
  // KIN & ACQUAINTANCES SYSTEM
  // ==========================================

  openKinModal() {
    if (!this.character.kin) {
      this.character.kin = window.generateFamily(this.character);
    }
    this.dom.kinModal.classList.remove('hidden');
    this.dom.kinModal.style.display = 'flex';
    this.renderKinList(this.activeKinFilter);
  }

  closeKinModal() {
    this.dom.kinModal.classList.add('hidden');
    this.dom.kinModal.style.display = 'none';
  }

  filterKin(filter) {
    this.activeKinFilter = filter;
    this.dom.kinFilterBtns.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.className = "kin-filter-btn flex-1 py-1 text-[11px] font-mono rounded-md bg-slatecard text-parchment font-bold shadow-sm transition-all";
      } else {
        btn.className = "kin-filter-btn flex-1 py-1 text-[11px] font-mono rounded-md text-dust hover:text-parchment transition-all";
      }
    });
    this.renderKinList(filter);
  }

  getAllKinList() {
    if (!this.character.kin) return [];
    const { parents = [], siblings = [], grandparents = [], friends = [] } = this.character.kin;
    return [
      ...parents.map(p => ({ ...p, category: 'family' })),
      ...siblings.map(s => ({ ...s, category: 'family' })),
      ...grandparents.map(g => ({ ...g, category: 'family' })),
      ...friends.map(f => ({ ...f, category: 'friend' }))
    ];
  }

  renderKinList(filter = 'all') {
    this.dom.kinList.innerHTML = '';
    const all = this.getAllKinList();
    const filtered = all.filter(p => {
      if (filter === 'family') return p.category === 'family';
      if (filter === 'friends') return p.category === 'friend';
      return true;
    });

    if (filtered.length === 0) {
      this.dom.kinList.innerHTML = `
        <div class="text-center py-8 text-dust/70 text-xs italic font-serif">
          No acquaintances found under this category.
        </div>
      `;
      return;
    }

    filtered.forEach(person => {
      const card = document.createElement('div');
      const isAlive = person.alive;

      card.className = `p-3 rounded-xl border transition-all ${
        isAlive 
          ? 'bg-inputbg hover:bg-cardhover border-leadborder cursor-pointer shadow-xs active:scale-[0.99]' 
          : 'bg-ebon/20 border-leadborder/40 opacity-60 cursor-default'
      }`;

      const relColor = person.relationship > 75 ? 'bg-emerald-500' : (person.relationship > 40 ? 'bg-amber-500' : 'bg-red-500');

      let statusBadge = '';
      if (!isAlive) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30">Deceased</span>`;
      } else if (person.isRevealed && person.entityType !== 'human') {
        const entityLabel = person.entityType === 'disguised_mimic' ? 'Disguised Mimic' : (person.entityType === 'blatant_entity' ? 'Abyssal Entity' : 'Anomaly');
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-500/40 animate-pulse">👁️ ${entityLabel}</span>`;
      } else if (person.suspicion > 30) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">Suspicion: ${person.suspicion}%</span>`;
      }

      const roleIcon = person.role.includes('Mother') || person.role.includes('Father') ? 'users' : (person.category === 'friend' ? 'user-plus' : 'user');

      card.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center space-x-2 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-leadborder/30 flex items-center justify-center text-parchment shrink-0">
              <i data-lucide="${roleIcon}" class="w-3.5 h-3.5 text-dust"></i>
            </div>
            <div class="truncate">
              <h4 class="font-serif font-bold text-xs text-parchment truncate">${person.name}</h4>
              <p class="text-[10px] text-dust font-mono">${person.role} • Age ${person.age} ${person.occupation ? `• ${person.occupation}` : ''}</p>
            </div>
          </div>
          <div class="shrink-0 flex items-center space-x-1.5">
            ${statusBadge}
            ${isAlive ? `<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-dust/60"></i>` : ''}
          </div>
        </div>

        ${isAlive ? `
          <div class="mt-2 space-y-1">
            <div class="flex justify-between items-center text-[9px] font-mono text-dust">
              <span>Closeness / Bond</span>
              <span class="font-bold text-parchment">${person.relationship}%</span>
            </div>
            <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
              <div class="h-full ${relColor} transition-all duration-300 rounded-full" style="width: ${person.relationship}%"></div>
            </div>
          </div>
        ` : `
          <p class="text-[10px] italic text-dust/80 mt-1">${person.deathCause || 'Passed away.'}</p>
        `}
      `;

      if (isAlive) {
        card.addEventListener('click', () => {
          window.soundEngine.playClick();
          this.openKinDetailModal(person);
        });
      }

      this.dom.kinList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  openKinDetailModal(person) {
    this.selectedKin = person;
    this.dom.kinDetailModal.classList.remove('hidden');
    this.dom.kinDetailModal.style.display = 'flex';
    this.renderKinDetail(person);
  }

  closeKinDetailModal() {
    this.dom.kinDetailModal.classList.add('hidden');
    this.dom.kinDetailModal.style.display = 'none';
    this.renderKinList(this.activeKinFilter);
  }

  renderKinDetail(person) {
    this.dom.kinDetailTitle.textContent = `${person.name} (${person.role})`;

    const relColor = person.relationship > 75 ? 'bg-emerald-500' : (person.relationship > 40 ? 'bg-amber-500' : 'bg-red-500');

    let entityInfo = '';
    if (person.isRevealed && person.entityType !== 'human') {
      entityInfo = `
        <div class="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[10px] space-y-1">
          <div class="font-bold text-purple-300 flex items-center gap-1">
            <i data-lucide="eye" class="w-3 h-3"></i>
            <span>Unmasked Entity: ${person.entityType.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div class="text-dust font-mono">Pact Status: <span class="text-parchment font-bold uppercase">${person.loyaltyStatus || person.loyalty || 'Unaligned'}</span></div>
        </div>
      `;
    } else if (person.category === 'friend' && person.suspicion > 0) {
      entityInfo = `
        <div class="space-y-1">
          <div class="flex justify-between items-center text-[9px] font-mono text-amber-300">
            <span>Occult Suspicion Meter</span>
            <span>${person.suspicion}%</span>
          </div>
          <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full" style="width: ${person.suspicion}%"></div>
          </div>
        </div>
      `;
    }

    this.dom.kinDetailDossier.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <h4 class="font-serif font-bold text-sm text-parchment">${person.name}</h4>
          <p class="text-[11px] text-dust font-mono">${person.role} • Age ${person.age}</p>
          ${person.occupation ? `<p class="text-[10px] text-dust/80 italic font-mono mt-0.5">Employed: ${person.occupation}</p>` : ''}
        </div>
        <div class="text-right">
          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slatecard border border-leadborder text-dust">
            Energy: ${this.character.actionsLeft || 0} / ${this.character.maxActions || 40}
          </span>
        </div>
      </div>

      <div class="space-y-1 pt-1">
        <div class="flex justify-between items-center text-[9px] font-mono text-dust">
          <span>Closeness / Relationship</span>
          <span class="font-bold text-parchment">${person.relationship}%</span>
        </div>
        <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
          <div class="h-full ${relColor} rounded-full" style="width: ${person.relationship}%"></div>
        </div>
      </div>

      ${entityInfo}
    `;

    // Button states & quota/diminishing returns display
    const getCount = (key) => window.getActionCount ? window.getActionCount(person, key) : (person.actionsDone && person.actionsDone[key] ? (typeof person.actionsDone[key] === 'number' ? person.actionsDone[key] : 1) : 0);
    const noEnergy = !this.character.actionsLeft || this.character.actionsLeft <= 0;

    const setupBtn = (btn, count, maxQuota, normalLabel, doneLabel) => {
      if (!btn) return;
      const isCapped = count >= maxQuota;
      const desc = btn.querySelector('.text-\\[10px\\]');
      const title = btn.querySelector('.text-xs');

      if (title) {
        if (!title.dataset.baseTitle) {
          title.dataset.baseTitle = title.textContent.replace(/\s*\(\d+\/\d+\)$/, '');
        }
        title.textContent = `${title.dataset.baseTitle} (${count}/${maxQuota})`;
      }

      if (noEnergy || isCapped) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        if (desc) {
          desc.textContent = isCapped ? doneLabel : "Exhausted for this year (0 Energy left).";
        }
      } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        if (desc) desc.textContent = normalLabel;
      }
    };

    setupBtn(this.dom.btnKinSpendTime, getCount('spentTime'), 6, "Bond through shared moments and build closeness. (1 Action)", "Already spent plenty of time together this year (6/6).");
    setupBtn(this.dom.btnKinConverse, getCount('talked'), 10, "Exchange thoughts, seek advice, or probe their worldview. (1 Action)", "Give them some space for now (10/10 talks reached).");
    setupBtn(this.dom.btnKinCompliment, getCount('complimented'), 6, "Praise their character, appearance, or resilience. (1 Action)", "Flattered enough for this year (6/6 compliments).");
    setupBtn(this.dom.btnKinGift, getCount('gifted'), 6, "Offer a thoughtful gift, treat, or dark relic. (1 Action)", "No more gifts needed for this year (6/6 given).");
    
    // Ask money only for parents / grandparents
    const canAskMoney = person.role.includes('Father') || person.role.includes('Mother') || person.role.includes('Grand');
    if (this.dom.btnKinAskMoney) {
      if (!canAskMoney) {
        this.dom.btnKinAskMoney.classList.add('hidden');
        this.dom.btnKinAskMoney.style.display = 'none';
      } else {
        this.dom.btnKinAskMoney.classList.remove('hidden');
        this.dom.btnKinAskMoney.style.display = 'flex';
        setupBtn(this.dom.btnKinAskMoney, getCount('askedMoney'), 5, "Request financial help based on their generosity and bond. (1 Action)", "Already asked for pocket money enough this year (5/5).");
      }
    }

    // Investigate button (for friends/unknowns)
    if (this.dom.btnKinInvestigate) {
      if (person.category !== 'friend' || (person.isRevealed && person.entityType === 'human')) {
        this.dom.btnKinInvestigate.classList.add('hidden');
        this.dom.btnKinInvestigate.style.display = 'none';
      } else {
        this.dom.btnKinInvestigate.classList.remove('hidden');
        this.dom.btnKinInvestigate.style.display = 'flex';
        setupBtn(this.dom.btnKinInvestigate, getCount('investigated'), 5, "Shadow their movements or inspect their strange quirks. (1 Action)", "Already observed their habits thoroughly this year (5/5).");
      }
    }

    // Tribute button (only if entity unmasked)
    if (this.dom.btnKinTribute) {
      if (person.isRevealed && person.entityType !== 'human') {
        this.dom.btnKinTribute.classList.remove('hidden');
        this.dom.btnKinTribute.style.display = 'flex';
        setupBtn(this.dom.btnKinTribute, getCount('tribute'), 5, "Pledge secrets, flesh, or devotion to an unmasked entity. (1 Action)", "Already offered occult tribute enough this year (5/5).");
      } else {
        this.dom.btnKinTribute.classList.add('hidden');
        this.dom.btnKinTribute.style.display = 'none';
      }
    }

    setupBtn(this.dom.btnKinArgue, getCount('argued'), 5, "Vent pent-up frustration or spark bitter disputes. (1 Action)", "Exhausted your arguments for this year (5/5).");

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  handleKinAction(actionType) {
    if (!this.selectedKin) return;
    const person = this.selectedKin;

    if (!this.character.actionsLeft || this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      return;
    }

    // Modal-based interactive flows
    if (actionType === 'ask_money') {
      this.openAskMoneyModal(person);
      return;
    }
    if (actionType === 'gift') {
      this.openGiftModal(person);
      return;
    }

    let result = null;

    if (actionType === 'spend_time') {
      result = window.spendTimeToKin(person, this.character);
    } else if (actionType === 'converse') {
      result = window.talkToKin(person, this.character);
    } else if (actionType === 'compliment') {
      result = window.complimentKin(person, this.character);
    } else if (actionType === 'investigate') {
      result = window.investigateKin(person, this.character);
    } else if (actionType === 'tribute') {
      result = window.offerTributeToEntity(person, this.character);
    } else if (actionType === 'argue') {
      result = window.argueWithKin(person, this.character);
    }

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Action could not be completed.");
      return;
    }

    // Deduct 1 action point
    this.character.actionsLeft -= 1;

    // Apply stat effects
    if (result.effects) {
      for (const [stat, val] of Object.entries(result.effects)) {
        if (stat === 'money') this.character.money = Math.max(0, this.character.money + val);
        else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + val);
        else if (stat !== 'relationship') this.modifyStat(stat, val);
      }
    }

    // Sound effect
    if (actionType === 'tribute' || (result.effects && result.effects.occult)) {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playClick();
    }

    // Append to latest year's log
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${person.name}] ${result.message}`);
    }

    this.renderAll();
    this.saveGame();

    // Check if an entity was unmasked!
    if (result.revealed) {
      this.closeKinDetailModal();
      this.closeKinModal();
      this.openRevelationModal(person);
      return;
    }

    this.renderKinDetail(person);

    // Show interactive feedback dialog modal
    const actionTitles = {
      spend_time: 'Quality Time',
      converse: 'Deep Conversation',
      compliment: 'Warm Flattery',
      investigate: 'Occult Observation',
      tribute: 'Dark Tribute Offered',
      argue: 'Heated Dispute'
    };
    const actionIcons = {
      spend_time: 'heart-handshake',
      converse: 'message-circle',
      compliment: 'sparkles',
      investigate: 'eye',
      tribute: 'skull',
      argue: 'flame'
    };
    const actionColors = {
      spend_time: 'text-rose-400',
      converse: 'text-blue-400',
      compliment: 'text-amber-400',
      investigate: 'text-purple-400',
      tribute: 'text-rose-500',
      argue: 'text-orange-500'
    };

    this.openFeedbackModal({
      tag: actionType.toUpperCase().replace('_', ' '),
      title: `${person.name}: ${actionTitles[actionType] || 'Interaction'}`,
      icon: actionIcons[actionType] || 'message-square',
      iconColor: actionColors[actionType] || 'text-amber-400',
      body: result.message,
      effects: result.effects
    });
  }

  openRevelationModal(person) {
    this.revelationTarget = person;
    window.soundEngine.playDread();
    this.dom.revelationModal.classList.remove('hidden');
    this.dom.revelationModal.style.display = 'flex';

    this.dom.revelationName.textContent = `Unmasked: ${person.name}`;
    
    if (person.entityType === 'disguised_mimic') {
      this.dom.revelationText.textContent = `You discovered that ${person.name} is a Flesh Mimic. Behind their casual clothes, their torso is lined with rows of human and canine incisors. They look at you pleadingly, tilting their head.`;
    } else if (person.entityType === 'blatant_entity') {
      this.dom.revelationText.textContent = `You cornered ${person.name} in an empty alley. Their skin unraveled like black parchment, revealing an ancient entity composed of static and hollow eyes.`;
    } else {
      this.dom.revelationText.textContent = `You uncovered undeniable proof that ${person.name} is an anomalous breach entity from the deep veil. They do not age or bleed normal blood.`;
    }
  }

  handleRevelationChoice(choice) {
    const person = this.revelationTarget;
    if (!person) {
      this.dom.revelationModal.classList.add('hidden');
      this.dom.revelationModal.style.display = 'none';
      return;
    }

    const latestLog = this.logs[this.logs.length - 1];

    if (choice === 'loyal') {
      person.loyaltyStatus = 'loyal';
      person.loyalty = 'loyal';
      person.relationship = 100;
      this.character.shillings += 15;
      this.modifyStat('occult', +10);
      this.modifyStat('sanity', -5);
      if (latestLog) {
        latestLog.entries.push(`[PACT FORGED] You swore secrecy to ${person.name}. They gifted you 15 Paranormal Shillings and promised protection (+10% Occult, -5% Sanity, +15 Shillings).`);
      }
      window.soundEngine.playCoin();
    } else if (choice === 'report') {
      person.alive = false;
      person.deathCause = "Reported to municipal authorities. Fled into the subterranean conduit network.";
      this.modifyStat('sanity', -10);
      this.modifyStat('happiness', -15);
      if (latestLog) {
        latestLog.entries.push(`[EXPULSION] You alerted authorities about ${person.name}. Squad cars and unmarked hazmat vans raided the neighborhood, but the entity dissolved into the storm sewers, leaving behind blackened ichor.`);
      }
      window.soundEngine.playDread();
    } else {
      person.loyaltyStatus = 'wary';
      this.modifyStat('sanity', -2);
      if (latestLog) {
        latestLog.entries.push(`You swallowed your panic and pretended you saw nothing. ${person.name} watches you carefully from the back of the classroom.`);
      }
      window.soundEngine.playTick();
    }

    this.revelationTarget = null;
    this.dom.revelationModal.classList.add('hidden');
    this.dom.revelationModal.style.display = 'none';
    this.renderAll();
    this.saveGame();
  }

  formatCurrency(amount) {
    return window.formatMoney(amount, this.character ? this.character.countryCode : 'USA');
  }

  // ==========================================
  // ASK FOR MONEY (ALLOWANCE) MODAL METHODS
  // ==========================================

  openAskMoneyModal(person) {
    this.askMoneyTarget = person;
    if (!this.dom.kinAskMoneyModal) return;

    if (this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      return;
    }

    const askCount = person.actionsDone ? (person.actionsDone.askedMoney || 0) : 0;
    if (askCount >= 5) {
      alert(`You have already asked ${person.name} for pocket money 5 times this year. Give them a break!`);
      return;
    }

    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
    const mult = country.wageMultiplier || 1.0;

    if (this.dom.askMoneyTargetName) {
      this.dom.askMoneyTargetName.textContent = `${person.name} (${person.role})`;
    }
    if (this.dom.askMoneyTargetDesc) {
      const genStr = person.generosity > 70 ? "Generous & Indulgent" : person.generosity < 30 ? "Frugal & Strict" : "Fair & Balanced";
      this.dom.askMoneyTargetDesc.textContent = `Generosity: ${genStr} • Closeness: ${person.relationship}%`;
    }

    // Slider bounds: min $5 USD, max $500 USD in step 5 USD
    const minUsd = 5;
    const maxUsd = 500;
    const defaultUsd = 25;

    if (this.dom.slideAskMoney) {
      this.dom.slideAskMoney.min = minUsd;
      this.dom.slideAskMoney.max = maxUsd;
      this.dom.slideAskMoney.step = 5;
      this.dom.slideAskMoney.value = defaultUsd;
    }

    if (this.dom.lblAskMoneyMin) {
      this.dom.lblAskMoneyMin.textContent = this.formatCurrency(minUsd * mult);
    }
    if (this.dom.lblAskMoneyMax) {
      this.dom.lblAskMoneyMax.textContent = this.formatCurrency(maxUsd * mult);
    }

    this.updateAskMoneySliderUI(defaultUsd);

    this.dom.kinAskMoneyModal.classList.remove('hidden');
    this.dom.kinAskMoneyModal.style.display = 'flex';
  }

  updateAskMoneySliderUI(usdAmount) {
    const country = window.COUNTRIES_DATA[this.character ? this.character.countryCode : 'USA'] || window.COUNTRIES_DATA.USA;
    const mult = country.wageMultiplier || 1.0;
    const localAmount = Math.round(usdAmount * mult);

    if (this.dom.lblAskMoneyAmount) {
      this.dom.lblAskMoneyAmount.textContent = this.formatCurrency(localAmount);
    }

    if (this.dom.lblAskMoneyHint) {
      if (usdAmount <= 25) {
        this.dom.lblAskMoneyHint.textContent = "Modest Request (High odds)";
        this.dom.lblAskMoneyHint.className = "text-emerald-400 font-semibold";
      } else if (usdAmount <= 100) {
        this.dom.lblAskMoneyHint.textContent = "Reasonable Ask (Fair odds)";
        this.dom.lblAskMoneyHint.className = "text-amber-400 font-semibold";
      } else if (usdAmount <= 250) {
        this.dom.lblAskMoneyHint.textContent = "Substantial Sum (Tough sell)";
        this.dom.lblAskMoneyHint.className = "text-orange-400 font-semibold";
      } else {
        this.dom.lblAskMoneyHint.textContent = "Greedy Request (Risky)";
        this.dom.lblAskMoneyHint.className = "text-rose-400 font-semibold";
      }
    }
  }

  closeAskMoneyModal() {
    if (this.dom.kinAskMoneyModal) {
      this.dom.kinAskMoneyModal.classList.add('hidden');
      this.dom.kinAskMoneyModal.style.display = 'none';
    }
    this.askMoneyTarget = null;
  }

  submitAskMoney() {
    const person = this.askMoneyTarget || this.selectedKin;
    if (!person) {
      this.closeAskMoneyModal();
      return;
    }

    if (this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      this.closeAskMoneyModal();
      return;
    }

    const usdVal = parseInt(this.dom.slideAskMoney ? this.dom.slideAskMoney.value : 25, 10);
    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
    const mult = country.wageMultiplier || 1.0;
    const localAmount = Math.round(usdVal * mult);

    const result = window.askForMoney(person, this.character, localAmount);
    this.closeAskMoneyModal();

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Could not ask for money.");
      return;
    }

    // Deduct 1 action
    this.character.actionsLeft -= 1;

    // Apply effects
    if (result.effects) {
      for (const [stat, val] of Object.entries(result.effects)) {
        if (stat === 'money') this.character.money = Math.max(0, this.character.money + val);
        else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + val);
        else if (stat !== 'relationship') this.modifyStat(stat, val);
      }
    }

    // Audio
    if (result.granted && result.amount > 0) {
      window.soundEngine.playCoin();
    } else {
      window.soundEngine.playClick();
    }

    // Append log
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${person.name}] ${result.message}`);
    }

    this.renderAll();
    this.saveGame();
    this.renderKinDetail(person);

    // Show interactive feedback dialog modal
    this.openFeedbackModal({
      tag: result.granted ? "ALLOWANCE GRANTED" : "REQUEST DENIED",
      title: `${person.name}'s Response`,
      icon: result.granted ? "hand-coins" : "ban",
      iconColor: result.granted ? "text-amber-400" : "text-rose-400",
      body: result.message,
      effects: result.effects
    });
  }

  // ==========================================
  // ROTATING GIFT CATALOG MODAL METHODS
  // ==========================================

  openGiftModal(person) {
    this.giftTarget = person;
    if (!this.dom.kinGiftModal) return;

    if (this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      return;
    }

    const giftCount = person.actionsDone ? (person.actionsDone.gifted || 0) : 0;
    if (giftCount >= 6) {
      alert(`You have already given ${person.name} 6 gifts this year. Save some for next year!`);
      return;
    }

    if (this.dom.giftModalTargetName) {
      this.dom.giftModalTargetName.textContent = `Gift for: ${person.name} (${person.role})`;
    }

    if (this.dom.giftModalTargetHint) {
      if (person.isRevealed && person.entityType !== 'human') {
        this.dom.giftModalTargetHint.textContent = `Entity Nature: Craves occult relics, dark curios, and shillings.`;
      } else if (person.role.includes('Friend')) {
        this.dom.giftModalTargetHint.textContent = `Preferences: Fun snacks, comics, small treats, or macabre tokens.`;
      } else if (person.role.includes('Mother') || person.role.includes('Father')) {
        this.dom.giftModalTargetHint.textContent = `Preferences: Handmade crafts, sincere keepsakes, and family treasures.`;
      } else {
        this.dom.giftModalTargetHint.textContent = `Preferences: Everyday delights, thoughtful gestures, and curios.`;
      }
    }

    this.renderGiftCardsList();

    this.dom.kinGiftModal.classList.remove('hidden');
    this.dom.kinGiftModal.style.display = 'flex';
  }

  renderGiftCardsList() {
    if (!this.dom.giftCardsList) return;
    this.dom.giftCardsList.innerHTML = '';

    if (!window.getRandomGiftSelection) return;
    const gifts = window.getRandomGiftSelection(this.character, 7);

    const giftIcons = {
      nature: "🌿", handmade: "🧶", found: "🪨", creative: "🎨", food: "🥐",
      media: "📼", leisure: "🎟️", apparel: "🧣", books: "📖", accessories: "💍",
      home: "🕯️", tech: "📻", jewelry: "💎", relic: "👁️", curio: "💀"
    };

    gifts.forEach(gift => {
      const card = document.createElement('div');
      card.className = "bg-slatecard/80 hover:bg-cardhover border border-leadborder rounded-xl p-3 flex items-center justify-between transition-all group";

      const iconEmoji = gift.icon || giftIcons[gift.category] || "🎁";

      let costStr = "FREE";
      let canAfford = true;
      if (gift.shillingsCost && gift.shillingsCost > 0) {
        costStr = `${gift.shillingsCost} Shillings`;
        canAfford = (this.character.shillings || 0) >= gift.shillingsCost;
      } else if (gift.localPrice > 0) {
        costStr = gift.priceFormatted || this.formatCurrency(gift.localPrice);
        canAfford = (this.character.money || 0) >= gift.localPrice;
      }

      const costColor = canAfford ? "text-amber-400" : "text-rose-400";
      const tierBadgeColor = {
        free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        treat: "bg-teal-500/10 text-teal-400 border-teal-500/30",
        thoughtful: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        luxury: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        occult: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }[gift.tier] || "bg-leadborder text-dust";

      card.innerHTML = `
        <div class="flex items-center space-x-3 min-w-0 pr-2">
          <div class="text-2xl w-9 h-9 flex items-center justify-center bg-inputbg rounded-lg border border-leadborder/60 shrink-0">
            ${iconEmoji}
          </div>
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <span class="font-serif font-bold text-xs text-parchment truncate">${gift.name}</span>
              <span class="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border shrink-0 ${tierBadgeColor}">${gift.tier}</span>
            </div>
            <p class="text-[10px] text-dust line-clamp-1 mt-0.5">${gift.desc}</p>
          </div>
        </div>
        <div class="text-right shrink-0 pl-1">
          <div class="text-[11px] font-mono font-bold ${costColor} mb-1">${costStr}</div>
          <button class="btn-buy-gift px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all ${canAfford ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer active:scale-95' : 'bg-inputbg text-dust/40 border border-leadborder cursor-not-allowed'}" ${canAfford ? '' : 'disabled'}>
            Give
          </button>
        </div>
      `;

      if (canAfford) {
        const btn = card.querySelector('.btn-buy-gift');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.submitGift(gift);
        });
      }

      this.dom.giftCardsList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closeGiftModal() {
    if (this.dom.kinGiftModal) {
      this.dom.kinGiftModal.classList.add('hidden');
      this.dom.kinGiftModal.style.display = 'none';
    }
    this.giftTarget = null;
  }

  submitGift(gift) {
    const person = this.giftTarget || this.selectedKin;
    if (!person) {
      this.closeGiftModal();
      return;
    }

    if (this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      this.closeGiftModal();
      return;
    }

    const result = window.giveGiftToKin(person, this.character, gift);
    this.closeGiftModal();

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Could not give gift.");
      return;
    }

    // Deduct 1 action
    this.character.actionsLeft -= 1;

    // Apply stat effects
    if (result.effects) {
      for (const [stat, val] of Object.entries(result.effects)) {
        if (stat === 'money') this.character.money = Math.max(0, this.character.money + val);
        else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + val);
        else if (stat !== 'relationship') this.modifyStat(stat, val);
      }
    }

    // Audio
    if (gift.tier === 'occult') {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playClick();
    }

    // Append log
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${person.name}] ${result.message}`);
    }

    this.renderAll();
    this.saveGame();
    this.renderKinDetail(person);

    const giftIcons = {
      nature: "🌿", handmade: "🧶", found: "🪨", creative: "🎨", food: "🥐",
      media: "📼", leisure: "🎟️", apparel: "🧣", books: "📖", accessories: "💍",
      home: "🕯️", tech: "📻", jewelry: "💎", relic: "👁️", curio: "💀"
    };
    const iconEmoji = gift.icon || giftIcons[gift.category] || "🎁";

    // Show feedback modal
    this.openFeedbackModal({
      tag: "GIFT DELIVERED",
      title: `${iconEmoji} ${gift.name}`,
      icon: "gift",
      iconColor: "text-teal-400",
      body: result.message,
      effects: result.effects
    });
  }

  // ==========================================
  // ACTION FEEDBACK DIALOG MODAL METHODS
  // ==========================================

  openFeedbackModal({ tag, title, icon, iconColor, body, effects }) {
    if (!this.dom.kinFeedbackModal) return;

    if (this.dom.feedbackTag) {
      this.dom.feedbackTag.textContent = tag || "INTERACTION OUTCOME";
    }
    if (this.dom.feedbackTitle) {
      this.dom.feedbackTitle.textContent = title || "Outcome";
    }
    if (this.dom.feedbackBody) {
      this.dom.feedbackBody.textContent = body || "";
    }
    if (this.dom.feedbackIconBox) {
      this.dom.feedbackIconBox.className = `w-12 h-12 rounded-full bg-slatecard border border-leadborder mx-auto flex items-center justify-center ${iconColor || 'text-amber-400'} shadow-md`;
    }
    if (this.dom.feedbackIcon) {
      this.dom.feedbackIcon.setAttribute('data-lucide', icon || 'message-square');
    }

    if (this.dom.feedbackPills) {
      this.dom.feedbackPills.innerHTML = '';
      if (effects) {
        for (const [key, val] of Object.entries(effects)) {
          if (val === 0) continue;
          let pillText = '';
          let colorClass = val > 0 
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
            : 'bg-rose-500/15 text-rose-400 border-rose-500/30';
          
          if (key === 'money') {
            const formatted = this.formatCurrency(Math.abs(val));
            pillText = val > 0 ? `+${formatted}` : `-${formatted}`;
          } else if (key === 'shillings') {
            pillText = val > 0 ? `+${val} Shillings` : `${val} Shillings`;
            colorClass = val > 0 ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30';
          } else if (key === 'relationship') {
            pillText = val > 0 ? `Closeness +${val}%` : `Closeness ${val}%`;
          } else {
            const statName = key.charAt(0).toUpperCase() + key.slice(1);
            pillText = val > 0 ? `${statName} +${val}%` : `${statName} ${val}%`;
          }

          const pill = document.createElement('span');
          pill.className = `px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${colorClass}`;
          pill.textContent = pillText;
          this.dom.feedbackPills.appendChild(pill);
        }
      }
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }

    this.dom.kinFeedbackModal.classList.remove('hidden');
    this.dom.kinFeedbackModal.style.display = 'flex';
  }

  closeFeedbackModal() {
    if (this.dom.kinFeedbackModal) {
      this.dom.kinFeedbackModal.classList.add('hidden');
      this.dom.kinFeedbackModal.style.display = 'none';
    }
  }

  // ==========================================
  // ACTIVITIES & PURSUITS SYSTEM
  // ==========================================

  openActivitiesModal() {
    this.dom.activitiesModal.classList.remove('hidden');
    this.dom.activitiesModal.style.display = 'flex';
    this.renderActivitiesList(this.activeActivityFilter);
  }

  closeActivitiesModal() {
    this.dom.activitiesModal.classList.add('hidden');
    this.dom.activitiesModal.style.display = 'none';
  }

  filterActivities(category) {
    this.activeActivityFilter = category;
    this.dom.activityFilterBtns.forEach(btn => {
      if (btn.dataset.category === category) {
        btn.className = "activity-filter-btn flex-1 min-w-[50px] py-1 text-[10px] font-mono rounded-md bg-slatecard text-parchment font-bold shadow-sm transition-all";
      } else {
        btn.className = "activity-filter-btn flex-1 min-w-[50px] py-1 text-[10px] font-mono rounded-md text-dust hover:text-parchment transition-all";
      }
    });
    this.renderActivitiesList(category);
  }

  renderActivitiesList(category = 'all') {
    this.dom.activitiesStaminaBadge.textContent = `${this.character.actionsLeft || 0} / ${this.character.maxActions || 40} Actions Left`;

    this.dom.activitiesList.innerHTML = '';
    const list = window.ACTIVITIES_LIST || [];
    const filtered = list.filter(act => {
      // If past maxAge (e.g. infant activity for adult character), omit completely
      if (this.character.age > act.maxAge) return false;
      // Category filter
      if (category !== 'all' && act.category !== category) return false;
      return true;
    });

    if (filtered.length === 0) {
      this.dom.activitiesList.innerHTML = `
        <div class="text-center py-8 text-dust/70 text-xs italic font-serif">
          No pursuits available for your current age (${this.character.age}) in this category.
        </div>
      `;
      return;
    }

    const noEnergy = !this.character.actionsLeft || this.character.actionsLeft <= 0;

    filtered.forEach(act => {
      const isLockedByAge = this.character.age < act.minAge;
      const card = document.createElement('div');
      card.dataset.actId = act.id;
      
      if (isLockedByAge) {
        card.className = "p-3.5 rounded-xl border bg-inputbg/30 border-leadborder/40 opacity-55 transition-all space-y-2 shadow-xs";
      } else {
        card.className = "p-3.5 rounded-xl border bg-inputbg hover:bg-cardhover border-leadborder transition-all space-y-2 shadow-xs";
      }

      const catBadgeColor = act.category === 'forbidden' ? 'text-crimson bg-crimson/10 border-crimson/30' :
        (act.category === 'academics' || act.category === 'mind' ? 'text-sky-400 bg-sky-500/10 border-sky-500/30' : 
        (act.category === 'social' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 
        (act.category === 'occult' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30')));

      const uses = (this.character.activityUses && this.character.activityUses[act.id]) || 0;
      const maxUses = act.maxPerYear || 10;
      const isCapped = uses >= maxUses;
      const isDisabled = isLockedByAge || noEnergy || isCapped;

      let btnLabel = 'Engage';
      if (isLockedByAge) {
        btnLabel = `Locked (Age ${act.minAge})`;
      } else if (isCapped) {
        btnLabel = 'Capped';
      }

      const ageBadge = isLockedByAge 
        ? `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold text-amber-400/80 bg-amber-500/10 border-amber-500/25 flex items-center gap-1"><i data-lucide="lock" class="w-2.5 h-2.5"></i>Unlocks Age ${act.minAge}</span>`
        : `<span class="text-[10px] font-mono text-dust">Age ${act.minAge}-${act.maxAge}</span>`;

      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg ${isLockedByAge ? 'bg-leadborder/15 text-dust/50' : 'bg-leadborder/30 text-parchment'} flex items-center justify-center shrink-0">
              <i data-lucide="${isLockedByAge ? 'lock' : (act.icon || 'compass')}" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-serif font-bold text-xs ${isLockedByAge ? 'text-parchment/60' : 'text-parchment'}">${act.name}</h4>
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${catBadgeColor}">${act.category}</span>
            </div>
          </div>
          ${ageBadge}
        </div>

        <p class="text-[11px] text-dust leading-relaxed">${act.desc}</p>

        <div class="flex justify-between items-center pt-2 border-t border-leadborder/60">
          <span class="text-[10px] font-mono text-dust/80">${isLockedByAge ? `Milestone: Requires Age ${act.minAge}` : `Cost: 1 Action · Quota: ${uses}/${maxUses}`}</span>
          <button class="btn-do-activity px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all ${
            isDisabled 
              ? 'opacity-50 cursor-not-allowed bg-leadborder/20 text-dust border border-leadborder/30' 
              : 'bg-slatecard hover:bg-cardhover text-parchment border border-leadborder active:scale-95 shadow-xs cursor-pointer'
          }" ${isDisabled ? 'disabled' : ''}>
            ${btnLabel}
          </button>
        </div>
      `;

      const btn = card.querySelector('.btn-do-activity');
      if (btn && !isDisabled) {
        btn.addEventListener('click', () => {
          this.handleActivityClick(act.id);
        });
      }

      this.dom.activitiesList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  handleActivityClick(activityId) {
    if (!this.character.actionsLeft || this.character.actionsLeft <= 0) {
      alert("You are out of energy for this year! Click 'Endure Year' to proceed and rest.");
      return;
    }

    const result = window.performActivity(activityId, this.character);
    if (!result || !result.success) {
      alert(result ? result.message : "Activity could not be performed.");
      return;
    }

    if (activityId === 'sneak_basement' || activityId === 'radio_static' || activityId === 'urban_exploration' || activityId === 'nursery_lullaby') {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playTick();
    }

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${result.title}] ${result.message}`);
    }

    this.renderAll();
    this.renderActivitiesList(this.activeActivityFilter);
    this.saveGame();

    // Show interactive feedback dialog modal
    this.openFeedbackModal({
      tag: "ACTIVITY PURSUED",
      title: result.title,
      icon: "sparkles",
      iconColor: "text-amber-400",
      body: result.message,
      effects: result.effects
    });
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
      this.dom.careersModal,
      this.dom.themeModal,
      this.dom.kinModal,
      this.dom.kinDetailModal,
      this.dom.kinAskMoneyModal,
      this.dom.kinGiftModal,
      this.dom.kinFeedbackModal,
      this.dom.activitiesModal,
      this.dom.revelationModal
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
      badge.className = "text-[10px] font-serif font-bold text-parchment tracking-wider uppercase bg-inputbg px-2 py-0.5 rounded-md border border-leadborder shadow-xs";
      badge.textContent = `AGE ${yearLog.age}`;

      const yearText = document.createElement('span');
      yearText.className = "text-[10px] text-dust font-mono";
      yearText.textContent = `${yearLog.year}`;

      header.appendChild(badge);
      header.appendChild(yearText);
      card.appendChild(header);

      const list = document.createElement('div');
      list.className = "space-y-1.5 text-xs text-parchment leading-relaxed";

      yearLog.entries.forEach(entry => {
        const p = document.createElement('p');
        p.className = "relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-dust/70";
        
        if (entry.startsWith('[')) {
          p.className = "relative pl-3 text-crimson font-medium before:content-['✦'] before:absolute before:left-0 before:text-crimson";
        } else if (entry.startsWith('Deposited salary') || entry.startsWith('Starting Fiat Balance')) {
          p.className = "relative pl-3 text-fiat font-semibold before:content-['$'] before:absolute before:left-0 before:text-fiat";
        } else if (entry.startsWith('Collected') || entry.startsWith('Secret Paranormal Shillings') || entry.startsWith('Signed an occult contract')) {
          p.className = "relative pl-3 text-shilling font-semibold before:content-['🪙'] before:absolute before:left-0 before:text-shilling";
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
      canvasBox.className = "w-12 h-12 rounded-lg overflow-hidden border border-[#85754e] shrink-0 bg-inputbg";
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
        <p class="text-[11px] text-crimson font-medium mt-0.5">${item.cause}</p>
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

  syncThemeLabel() {
    const cur = window.THEMES_DATA && window.THEMES_DATA.find(t => t.id === window.getActiveThemeId());
    if (cur && this.dom.txtCurrentThemeName) {
      this.dom.txtCurrentThemeName.textContent = cur.name.toUpperCase();
    }
  }

  openThemeModal() {
    if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
    this.activeThemeFilter = 'all';
    this.filterThemes('all');
    if (this.dom.themeModal) {
      this.dom.themeModal.classList.remove('hidden');
      this.dom.themeModal.style.display = 'flex';
    }
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closeThemeModal() {
    if (this.dom.themeModal) {
      this.dom.themeModal.classList.add('hidden');
      this.dom.themeModal.style.display = 'none';
    }
  }

  filterThemes(filter) {
    this.activeThemeFilter = filter;
    const tabs = [
      { el: this.dom.tabThemeAll, key: 'all' },
      { el: this.dom.tabThemeDark, key: 'dark' },
      { el: this.dom.tabThemeLight, key: 'light' }
    ];
    tabs.forEach(t => {
      if (!t.el) return;
      if (t.key === filter) {
        t.el.className = "py-1 rounded-lg bg-slatecard text-parchment font-serif font-bold text-[11px] transition-all text-center";
      } else {
        t.el.className = "py-1 rounded-lg text-dust hover:text-parchment font-serif font-bold text-[11px] transition-all text-center";
      }
    });
    this.renderThemesList();
  }

  renderThemesList() {
    if (!this.dom.themeListContainer || !window.THEMES_DATA) return;
    this.dom.themeListContainer.innerHTML = '';
    const activeId = window.getActiveThemeId ? window.getActiveThemeId() : 'void-noir';
    const filtered = window.THEMES_DATA.filter(t => {
      if (this.activeThemeFilter === 'dark') return t.mode === 'dark';
      if (this.activeThemeFilter === 'light') return t.mode === 'light';
      return true;
    });

    filtered.forEach(theme => {
      const isActive = theme.id === activeId;
      const card = document.createElement('div');
      card.className = `p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between space-x-3 ${isActive ? 'bg-cardhover border-crimson shadow-sm ring-1 ring-crimson/50' : 'bg-slatecard hover:bg-cardhover border-leadborder'}`;

      const swatchesHtml = `
        <div class="flex items-center -space-x-1 shrink-0 p-1 rounded-lg bg-inputbg border border-leadborder">
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[0]}"></span>
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[1]}"></span>
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[2]}"></span>
        </div>
      `;

      card.innerHTML = `
        <div class="flex items-center space-x-3 min-w-0">
          ${swatchesHtml}
          <div class="min-w-0">
            <div class="flex items-center space-x-1.5">
              <h4 class="font-serif font-bold text-xs text-parchment truncate">${theme.name}</h4>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border ${theme.mode === 'dark' ? 'bg-[#0f1118] text-sky-400 border-sky-900/50' : 'bg-[#fef9c3] text-amber-900 border-amber-300'}">${theme.mode === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
            <p class="text-[10px] text-dust truncate mt-0.5">${theme.desc}</p>
          </div>
        </div>
        <div class="shrink-0 pl-1">
          ${isActive 
            ? `<span class="p-1 rounded-full bg-emerald-500/20 border border-emerald-600/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center"><i data-lucide="check" class="w-3.5 h-3.5"></i></span>`
            : `<span class="text-[10px] font-mono text-dust/60">Select</span>`
          }
        </div>
      `;

      card.addEventListener('click', () => {
        window.applyTheme(theme.id);
        if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
        this.syncThemeLabel();
        this.renderThemesList();
        if (this.character) {
          this.renderAll();
        }
      });

      this.dom.themeListContainer.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
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
