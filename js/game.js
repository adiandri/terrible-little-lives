// Game Engine for Terrible Little Lives (Modern Era, Dual Economy & Careers)

function commitToAsylum(character, years = 2, reason = "Severe psychological collapse") {
  if (!character) return;
  character.institution = {
    type: 'asylum',
    name: "St. Dymphna's State Asylum",
    yearsLeft: years,
    reason: reason,
    active: true
  };
  if (character.job) {
    character.previousJob = character.job;
    character.job = null;
    character.jobTenure = 0;
    character.jobPerformance = 50;
  }
  if (window.addConsequence) {
    window.addConsequence(character, 'social_stigma', { severity: 2, label: 'Asylum Record', note: reason });
  }
}

function sentenceToPrison(character, years = 2, reason = "Conviction in municipal court") {
  if (!character) return;
  character.institution = {
    type: 'prison',
    name: "Blackthorn Penitentiary",
    yearsLeft: years,
    reason: reason,
    active: true
  };
  if (character.job) {
    character.previousJob = character.job;
    character.job = null;
    character.jobTenure = 0;
    character.jobPerformance = 50;
  }
  if (window.addConsequence) {
    window.addConsequence(character, 'criminal_record', { severity: 3, label: 'Felony Conviction', note: reason });
  }
}

window.commitToAsylum = commitToAsylum;
window.sentenceToPrison = sentenceToPrison;

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
      avatar: window.generateRandomAvatar({ age: 18, gender: "Male" }),
      countryCode: "USA",
      city: "Seattle, WA",
      name: { first: "Alex", surname: "Mercer" },
      gender: "Male",
      trait: window.MODERN_TRAITS[0],
      isGodMode: false,
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

    this.vibrationEnabled = typeof localStorage !== 'undefined' && localStorage.getItem('TLL_VIBRATION') !== 'false';
    this.textSize = (window.getTextSize && window.getTextSize()) || 'normal';

    this.initElements();
    this.applyTextSize(this.textSize, false);
    this.syncThemeLabel();
    this.syncSettingsUI();
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
      btnLandingSettings: document.getElementById('btn-landing-settings'),
      btnLandingMute: document.getElementById('btn-landing-mute'),
      landingMuteIcon: document.getElementById('landing-mute-icon'),

      // Creator UI
      creatorAvatarCanvas: document.getElementById('creator-avatar-canvas'),
      btnRandomAvatar: document.getElementById('btn-random-avatar'),
      btnCreatorSettings: document.getElementById('btn-creator-settings'),
      btnCreatorRandomizeAll: document.getElementById('btn-creator-randomize-all'),
      btnCreatorBack: document.getElementById('btn-creator-back'),
      
      // Archetype Presets
      presetGothic: document.getElementById('preset-gothic'),
      presetPreppy: document.getElementById('preset-preppy'),
      presetStreet: document.getElementById('preset-street'),
      presetDreamer: document.getElementById('preset-dreamer'),
      presetElder: document.getElementById('preset-elder'),

      // Three-step creator and appearance tabs
      stepIdentity: document.getElementById('step-identity'),
      stepAppearance: document.getElementById('step-appearance'),
      stepReview: document.getElementById('step-review'),
      appearanceSubnav: document.getElementById('appearance-subnav'),
      tabFace: document.getElementById('tab-face'),
      tabEyes: document.getElementById('tab-eyes'),
      tabHair: document.getElementById('tab-hair'),
      tabAttire: document.getElementById('tab-attire'),

      // Drawer Panels
      panelFace: document.getElementById('panel-face'),
      panelEyes: document.getElementById('panel-eyes'),
      panelHair: document.getElementById('panel-hair'),
      panelAttire: document.getElementById('panel-attire'),
      panelIdentity: document.getElementById('panel-identity'),
      panelReview: document.getElementById('panel-review'),
      panelGodmode: document.getElementById('panel-godmode'),
      btnToggleAdvanced: document.getElementById('btn-toggle-advanced'),
      btnBackReview: document.getElementById('btn-back-review'),
      reviewName: document.getElementById('review-name'),
      reviewOrigin: document.getElementById('review-origin'),
      reviewGender: document.getElementById('review-gender'),
      reviewTrait: document.getElementById('review-trait'),
      reviewStyle: document.getElementById('review-style'),

      // Granular Feature Selectors (Sheet 1 - 8)
      selSkin: document.getElementById('sel-skin'),
      selFaceShape: document.getElementById('sel-face-shape'),
      selNose: document.getElementById('sel-nose'),
      selLips: document.getElementById('sel-lips'),
      selMark: document.getElementById('sel-mark'),
      selEyeShape: document.getElementById('sel-eye-shape'),
      selEyelid: document.getElementById('sel-eyelid'),
      selEyeColor: document.getElementById('sel-eye-color'),
      selEyebrow: document.getElementById('sel-eyebrow'),
      selEyeExtra: document.getElementById('sel-eye-extra'),
      selHairTexture: document.getElementById('sel-hair-texture'),
      selHairStyle: document.getElementById('sel-hair-style'),
      selHairColor: document.getElementById('sel-hair-color'),
      selBangs: document.getElementById('sel-bangs'),
      selFacialHair: document.getElementById('sel-facial-hair'),
      selClothing: document.getElementById('sel-clothing'),
      selClothingColor: document.getElementById('sel-clothing-color'),
      selGlasses: document.getElementById('sel-glasses'),
      selPiercing: document.getElementById('sel-piercing'),
      selHeadwear: document.getElementById('sel-headwear'),
      selNecklace: document.getElementById('sel-necklace'),

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
      btnGameSettings: document.getElementById('btn-game-settings'),
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
      btnTabLife: document.getElementById('btn-tab-life'),
      btnTabProfile: document.getElementById('btn-tab-profile'),

      // Character Profile
      profileModal: document.getElementById('profile-modal'),
      btnCloseProfile: document.getElementById('btn-close-profile'),
      btnProfileDone: document.getElementById('btn-profile-done'),
      profileAvatar: document.getElementById('profile-avatar'),
      profileName: document.getElementById('profile-name'),
      profileLifeSummary: document.getElementById('profile-life-summary'),
      profileLocation: document.getElementById('profile-location'),
      profileStats: document.getElementById('profile-stats'),
      profileReputation: document.getElementById('profile-reputation'),
      profileRumors: document.getElementById('profile-rumors'),
      profileStoryLedger: document.getElementById('profile-story-ledger'),
      profileBenefits: document.getElementById('profile-benefits'),
      profileOccupation: document.getElementById('profile-occupation'),
      profileTrait: document.getElementById('profile-trait'),
      profileMoney: document.getElementById('profile-money'),
      profileShillings: document.getElementById('profile-shillings'),
      profileHousing: document.getElementById('profile-housing'),
      profileConsequences: document.getElementById('profile-consequences'),

      // Careers Modal
      careersModal: document.getElementById('careers-modal'),
      btnCloseCareers: document.getElementById('btn-close-careers'),
      tabCareerMundane: document.getElementById('tab-career-mundane'),
      tabCareerParttime: document.getElementById('tab-career-parttime'),
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

      // Settings & Theme Modal
      settingsModal: document.getElementById('settings-modal'),
      btnCloseSettings: document.getElementById('btn-close-settings'),
      tabSettingsExperience: document.getElementById('tab-settings-experience'),
      tabSettingsReading: document.getElementById('tab-settings-reading'),
      tabSettingsTheme: document.getElementById('tab-settings-theme'),
      panelSettingsExperience: document.getElementById('panel-settings-experience'),
      panelSettingsReading: document.getElementById('panel-settings-reading'),
      panelSettingsTheme: document.getElementById('panel-settings-theme'),
      btnSoundOff: document.getElementById('btn-sound-off'),
      btnSoundOn: document.getElementById('btn-sound-on'),
      settingsSoundIcon: document.getElementById('settings-sound-icon'),
      btnVibeOff: document.getElementById('btn-vibe-off'),
      btnVibeOn: document.getElementById('btn-vibe-on'),
      settingsVibeIcon: document.getElementById('settings-vibe-icon'),
      btnTextSmall: document.getElementById('btn-text-small'),
      btnTextNormal: document.getElementById('btn-text-normal'),
      btnTextLarge: document.getElementById('btn-text-large'),
      btnTextHuge: document.getElementById('btn-text-huge'),
      settingsTextSizeLabel: document.getElementById('settings-text-size-label'),
      settingsTextPreview: document.getElementById('settings-text-preview'),
      btnFontGame: document.getElementById('btn-font-game'),
      btnFontDevice: document.getElementById('btn-font-device'),
      settingsFontActiveLabel: document.getElementById('settings-font-active-label'),
      themeModal: document.getElementById('settings-modal') || document.getElementById('theme-modal'),
      btnCloseThemeModal: document.getElementById('btn-close-settings') || document.getElementById('btn-close-theme-modal'),
      themeListContainer: document.getElementById('themes-list'),

      // Kin Modal
      btnTabKin: document.getElementById('btn-tab-kin'),
      btnTabCreatures: document.getElementById('btn-tab-creatures'),
      kinModal: document.getElementById('kin-modal'),
      btnCloseKin: document.getElementById('btn-close-kin'),
      kinList: document.getElementById('kin-list'),
      kinFilterBtns: document.querySelectorAll('.kin-filter-btn'),

      // Creature Registry
      creaturesModal: document.getElementById('creatures-modal'),
      btnCloseCreatures: document.getElementById('btn-close-creatures'),
      creaturesEmpty: document.getElementById('creatures-empty'),
      creaturesList: document.getElementById('creatures-list'),
      creatureDetailModal: document.getElementById('creature-detail-modal'),
      btnCloseCreatureDetail: document.getElementById('btn-close-creature-detail'),
      creatureDetailType: document.getElementById('creature-detail-type'),
      creatureDetailName: document.getElementById('creature-detail-name'),
      creatureDetailIcon: document.getElementById('creature-detail-icon'),
      creatureDetailDescription: document.getElementById('creature-detail-description'),
      creatureDetailState: document.getElementById('creature-detail-state'),
      creatureDetailAttachment: document.getElementById('creature-detail-attachment'),
      creatureDetailBond: document.getElementById('creature-detail-bond'),
      creatureDetailLoyalty: document.getElementById('creature-detail-loyalty'),
      creatureDetailHunger: document.getElementById('creature-detail-hunger'),
      creatureActions: document.getElementById('creature-actions'),
      creatureMemory: document.getElementById('creature-memory'),
      tabArchiveCreatures: document.getElementById('tab-archive-creatures'),
      tabArchiveCases: document.getElementById('tab-archive-cases'),
      archiveCreaturesPanel: document.getElementById('archive-creatures-panel'),
      archiveCasesPanel: document.getElementById('archive-cases-panel'),
      archiveCaseSummary: document.getElementById('archive-case-summary'),
      caseFilesList: document.getElementById('case-files-list'),
      evidenceInventory: document.getElementById('evidence-inventory'),
      caseDetailModal: document.getElementById('case-detail-modal'),
      btnCloseCaseDetail: document.getElementById('btn-close-case-detail'),
      caseDetailTitle: document.getElementById('case-detail-title'),
      caseDetailStatus: document.getElementById('case-detail-status'),
      btnInvestigateAlone: document.getElementById('btn-investigate-alone'),
      btnInvestigateTeam: document.getElementById('btn-investigate-team'),
      btnAnalyzeEvidence: document.getElementById('btn-analyze-evidence'),
      caseRecruitSelect: document.getElementById('case-recruit-select'),
      btnCaseRecruit: document.getElementById('btn-case-recruit'),
      caseInvestigators: document.getElementById('case-investigators'),
      caseEvidenceList: document.getElementById('case-evidence-list'),
      caseConclusionSelect: document.getElementById('case-conclusion-select'),
      caseSuspectRow: document.getElementById('case-suspect-row'),
      caseSuspectSelect: document.getElementById('case-suspect-select'),
      btnFileConclusion: document.getElementById('btn-file-conclusion'),
      btnPublishCase: document.getElementById('btn-publish-case'),
      btnSubmitCase: document.getElementById('btn-submit-case'),
      caseIncidents: document.getElementById('case-incidents'),

      // Kin Detail Modal
      kinDetailModal: document.getElementById('kin-detail-modal'),
      btnCloseKinDetail: document.getElementById('btn-close-kin-detail'),
      kinDetailTitle: document.getElementById('kin-detail-title'),
      kinDetailDossier: document.getElementById('kin-detail-dossier'),
      btnKinCuddle: document.getElementById('btn-kin-cuddle'),
      btnKinBabble: document.getElementById('btn-kin-babble'),
      btnKinFeed: document.getElementById('btn-kin-feed'),
      btnKinPeekaboo: document.getElementById('btn-kin-peekaboo'),
      btnKinSpendTime: document.getElementById('btn-kin-spend-time'),
      btnKinConverse: document.getElementById('btn-kin-converse'),
      btnKinCompliment: document.getElementById('btn-kin-compliment'),
      btnKinGift: document.getElementById('btn-kin-gift'),
      btnKinAskMoney: document.getElementById('btn-kin-ask-money'),
      btnKinInvestigate: document.getElementById('btn-kin-investigate'),
      btnKinTribute: document.getElementById('btn-kin-tribute'),
      btnKinArgue: document.getElementById('btn-kin-argue'),
      btnKinInsult: document.getElementById('btn-kin-insult'),
      btnKinApologize: document.getElementById('btn-kin-apologize'),
      btnKinHex: document.getElementById('btn-kin-hex'),
      btnKinAdvice: document.getElementById('btn-kin-advice'),
      btnKinBicker: document.getElementById('btn-kin-bicker'),
      btnKinSecret: document.getElementById('btn-kin-secret'),
      btnKinFolktale: document.getElementById('btn-kin-folktale'),
      btnKinChores: document.getElementById('btn-kin-chores'),
      btnKinBegPet: document.getElementById('btn-kin-beg-pet'),
      btnKinDriving: document.getElementById('btn-kin-driving'),
      btnKinCollege: document.getElementById('btn-kin-college'),
      btnKinLoan: document.getElementById('btn-kin-loan'),
      btnKinElderCare: document.getElementById('btn-kin-elder-care'),
      btnKinSiblingBrawl: document.getElementById('btn-kin-sibling-brawl'),
      btnKinAlibi: document.getElementById('btn-kin-alibi'),
      btnKinSiblingDrinks: document.getElementById('btn-kin-sibling-drinks'),
      btnKinAttic: document.getElementById('btn-kin-attic'),
      btnKinKeepsake: document.getElementById('btn-kin-keepsake'),
      btnKinNursing: document.getElementById('btn-kin-nursing'),
      btnKinConfess: document.getElementById('btn-kin-confess'),
      btnKinDate: document.getElementById('btn-kin-date'),
      btnKinFlirt: document.getElementById('btn-kin-flirt'),
      btnKinMoveIn: document.getElementById('btn-kin-move-in'),
      btnKinPropose: document.getElementById('btn-kin-propose'),
      btnKinWedding: document.getElementById('btn-kin-wedding'),
      btnKinConceive: document.getElementById('btn-kin-conceive'),
      btnKinBreakup: document.getElementById('btn-kin-breakup'),
      btnKinPray: document.getElementById('btn-kin-pray'),
      btnKinEggshells: document.getElementById('btn-kin-eggshells'),
      btnKinCommendation: document.getElementById('btn-kin-commendation'),
      btnKinGrandparentHaven: document.getElementById('btn-kin-grandparent-haven'),

      // Activities Modal ("City of Buttons")
      btnTabActivities: document.getElementById('btn-tab-activities'),
      activitiesModal: document.getElementById('activities-modal'),
      btnCloseActivities: document.getElementById('btn-close-activities'),
      btnBackActivitiesHub: document.getElementById('btn-back-activities-hub'),
      activitiesHeaderIcon: document.getElementById('activities-header-icon'),
      activitiesHeaderTitle: document.getElementById('activities-header-title'),
      activitiesHeaderSubtitle: document.getElementById('activities-header-subtitle'),
      activitiesStaminaBadge: document.getElementById('activities-stamina-badge'),
      activitiesStaminaText: document.getElementById('activities-stamina-text'),
      activitiesHubView: document.getElementById('activities-hub-view'),
      activitiesDetailView: document.getElementById('activities-detail-view'),
      activityDetailIcon: document.getElementById('activity-detail-icon'),
      activityDetailTitle: document.getElementById('activity-detail-title'),
      activityDetailDesc: document.getElementById('activity-detail-desc'),
      activityShortcuts: document.getElementById('activity-shortcuts'),
      activitiesList: document.getElementById('activities-list'),
      hubStatusWork: document.getElementById('hub-status-work'),
      hubStatusEducation: document.getElementById('hub-status-education'),
      hubStatusFamily: document.getElementById('hub-status-family'),
      hubStatusPets: document.getElementById('hub-status-pets'),

      // Revelation Modal
      revelationModal: document.getElementById('revelation-modal'),
      revelationName: document.getElementById('revelation-name'),
      revelationText: document.getElementById('revelation-text'),
      btnRevelationLoyal: document.getElementById('btn-revelation-loyal'),
      btnRevelationReport: document.getElementById('btn-revelation-report'),
      btnRevelationIgnore: document.getElementById('btn-revelation-ignore'),

      // Dark Altar / Paranormal Crimes Modal
      darkAltarModal: document.getElementById('dark-altar-modal'),
      btnCloseDarkAltar: document.getElementById('btn-close-dark-altar'),
      btnCancelDarkAltar: document.getElementById('btn-cancel-dark-altar'),
      darkAltarTargetSelect: document.getElementById('dark-altar-target-select'),
      darkAltarTargetStatus: document.getElementById('dark-altar-target-status'),
      darkAltarTargetDetails: document.getElementById('dark-altar-target-details'),
      darkAltarTargetRole: document.getElementById('dark-altar-target-role'),
      darkAltarTargetCurse: document.getElementById('dark-altar-target-curse'),
      darkAltarPlayerOccult: document.getElementById('dark-altar-player-occult'),
      darkAltarPlayerShillings: document.getElementById('dark-altar-player-shillings'),
      darkAltarPlayerEnergy: document.getElementById('dark-altar-player-energy'),
      darkAltarCrimesList: document.getElementById('dark-altar-crimes-list'),
      darkAltarMaterials: document.getElementById('dark-altar-materials'),
      darkAltarLedger: document.getElementById('dark-altar-ledger'),
      btnAcquireRitualMaterials: document.getElementById('btn-acquire-ritual-materials'),
      ritualPreparation: document.getElementById('ritual-preparation'),
      btnCloseRitualPrep: document.getElementById('btn-close-ritual-prep'),
      ritualPrepName: document.getElementById('ritual-prep-name'),
      ritualPrepIntent: document.getElementById('ritual-prep-intent'),
      ritualPrepChance: document.getElementById('ritual-prep-chance'),
      ritualPrepMaterials: document.getElementById('ritual-prep-materials'),
      ritualPrepPrice: document.getElementById('ritual-prep-price'),
      ritualPrepBackfires: document.getElementById('ritual-prep-backfires'),
      ritualPrepWording: document.getElementById('ritual-prep-wording'),
      btnSealRitual: document.getElementById('btn-seal-ritual'),

      // TerribleNet
      terribleNetModal: document.getElementById('terriblenet-modal'),
      btnCloseTerribleNet: document.getElementById('btn-close-terriblenet'),
      terribleNetSummary: document.getElementById('terriblenet-summary'),
      terribleNetTabs: document.getElementById('terriblenet-tabs'),
      terribleNetContent: document.getElementById('terriblenet-content'),

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
      btnCloseFeedback: document.getElementById('btn-close-feedback'),

      // Action Choice Modal
      actionChoiceModal: document.getElementById('action-choice-modal'),
      btnCancelActionChoice: document.getElementById('btn-cancel-action-choice'),

      // Pets Modals
      petsModal: document.getElementById('pets-modal'),
      btnClosePetsModal: document.getElementById('btn-close-pets-modal'),
      btnCancelPets: document.getElementById('btn-cancel-pets'),
      petDetailModal: document.getElementById('pet-detail-modal'),
      btnClosePetDetail: document.getElementById('btn-close-pet-detail'),
      btnBackPetDetail: document.getElementById('btn-back-pet-detail'),
      btnPetFeed: document.getElementById('btn-pet-feed'),
      btnPetCuddle: document.getElementById('btn-pet-cuddle'),
      btnPetStroll: document.getElementById('btn-pet-stroll'),
      btnPetCommune: document.getElementById('btn-pet-commune'),
      btnPetVet: document.getElementById('btn-pet-vet'),

      // Dynamic Occupation Tab
      occupationTabIcon: document.getElementById('occupation-tab-icon'),
      occupationTabLabel: document.getElementById('occupation-tab-label'),

      // Education Main Modal
      educationModal: document.getElementById('education-modal'),
      btnCloseEducation: document.getElementById('btn-close-education'),
      btnEduDone: document.getElementById('btn-edu-done'),
      eduSchoolName: document.getElementById('edu-school-name'),
      eduSchoolTrackBadge: document.getElementById('edu-school-track-badge'),
      eduTuitionStatusBadge: document.getElementById('edu-tuition-status-badge'),
      btnEduTransferTrack: document.getElementById('btn-edu-transfer-track'),
      eduSchoolLevelBadge: document.getElementById('edu-school-level-badge'),
      eduSchoolGradeLabel: document.getElementById('edu-school-grade-label'),
      eduValGrades: document.getElementById('edu-val-grades'),
      eduBarGrades: document.getElementById('edu-bar-grades'),
      eduLabelGrades: document.getElementById('edu-label-grades'),
      eduValPopularity: document.getElementById('edu-val-popularity'),
      eduBarPopularity: document.getElementById('edu-bar-popularity'),
      eduLabelPopularity: document.getElementById('edu-label-popularity'),
      eduDisciplinaryBanner: document.getElementById('edu-disciplinary-banner'),
      eduDisciplinaryCount: document.getElementById('edu-disciplinary-count'),
      btnEduStudyHarder: document.getElementById('btn-edu-study-harder'),
      btnEduSkipClass: document.getElementById('btn-edu-skip-class'),
      labelEduStudy: document.getElementById('label-edu-study'),
      labelEduSkip: document.getElementById('label-edu-skip'),
      tabEduOverview: document.getElementById('tab-edu-overview'),
      tabEduClassmates: document.getElementById('tab-edu-classmates'),
      tabEduTeachers: document.getElementById('tab-edu-teachers'),
      tabEduStaff: document.getElementById('tab-edu-staff'),
      eduPanelOverview: document.getElementById('edu-panel-overview'),
      eduPanelClassmates: document.getElementById('edu-panel-classmates'),
      eduPanelTeachers: document.getElementById('edu-panel-teachers'),
      eduPanelStaff: document.getElementById('edu-panel-staff'),
      eduClubsList: document.getElementById('edu-clubs-list'),
      eduClubsCount: document.getElementById('edu-clubs-count'),
      eduMysteriesList: document.getElementById('edu-mysteries-list'),
      eduMysteriesSection: document.getElementById('edu-mysteries-section'),
      eduUniversitySection: document.getElementById('edu-university-section'),
      eduMajorsList: document.getElementById('edu-majors-list'),
      eduDropoutContainer: document.getElementById('edu-dropout-container'),
      btnEduDropOut: document.getElementById('btn-edu-drop-out'),
      eduClassmatesList: document.getElementById('edu-classmates-list'),
      eduTeachersList: document.getElementById('edu-teachers-list'),
      eduStaffList: document.getElementById('edu-staff-list'),

      // School Choice & Track Selection Modal
      schoolChoiceModal: document.getElementById('school-choice-modal'),
      schoolChoiceTitle: document.getElementById('school-choice-title'),
      schoolChoiceSubtitle: document.getElementById('school-choice-subtitle'),
      btnCloseSchoolChoice: document.getElementById('btn-close-school-choice'),
      btnCancelSchoolChoice: document.getElementById('btn-cancel-school-choice'),
      schoolTrackCards: document.querySelectorAll('.school-track-card'),
      selectedTrackName: document.getElementById('selected-track-name'),
      selectedTrackCost: document.getElementById('selected-track-cost'),
      fundingActionsFree: document.getElementById('funding-actions-free'),
      fundingActionsPaid: document.getElementById('funding-actions-paid'),
      btnEnrollFree: document.getElementById('btn-enroll-free'),
      btnAskParentsTuition: document.getElementById('btn-ask-parents-tuition'),
      btnApplyScholarship: document.getElementById('btn-apply-scholarship'),
      btnPayTuitionSelf: document.getElementById('btn-pay-tuition-self'),
      labelPaySelfBtn: document.getElementById('label-pay-self-btn'),
      labelTuitionPrivate: document.getElementById('label-tuition-private'),
      labelTuitionElite: document.getElementById('label-tuition-elite'),
      schoolChoiceFeedback: document.getElementById('school-choice-feedback'),

      // School Person Dossier Modal
      schoolPersonModal: document.getElementById('school-person-modal'),
      btnCloseSchoolPerson: document.getElementById('btn-close-school-person'),
      btnCancelSchoolPerson: document.getElementById('btn-cancel-school-person'),
      schoolPersonAvatarBox: document.getElementById('school-person-avatar-box'),
      schoolPersonAvatarCanvas: document.getElementById('school-person-avatar-canvas'),
      schoolPersonIcon: document.getElementById('school-person-icon'),
      schoolPersonName: document.getElementById('school-person-name'),
      schoolPersonRoleBadge: document.getElementById('school-person-role-badge'),
      schoolPersonCliqueBadge: document.getElementById('school-person-clique-badge'),
      schoolPersonQuirk: document.getElementById('school-person-quirk'),
      schoolPersonRelVal: document.getElementById('school-person-rel-val'),
      schoolPersonRelBar: document.getElementById('school-person-rel-bar'),
      schoolPersonMemory: document.getElementById('school-person-memory'),
      schoolPersonActionsList: document.getElementById('school-person-actions-list')
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
      this.switchCreatorStep('identity');
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
      if (this.character && this.character.age <= 17 && (!this.character.education || !this.character.education.enrolled) && window.enrollInSchool) {
        window.enrollInSchool(this.character);
      }
      this.showScreen('screen-game');
    });

    // Audio Toggles
    if (this.dom.btnLandingMute) {
      this.dom.btnLandingMute.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.toggleMute();
          this.syncSettingsUI();
        }
      });
    }

    // Three-step creator flow
    if (this.dom.stepIdentity) this.dom.stepIdentity.addEventListener('click', () => this.switchCreatorStep('identity'));
    if (this.dom.stepAppearance) this.dom.stepAppearance.addEventListener('click', () => this.switchCreatorStep('appearance'));
    if (this.dom.stepReview) this.dom.stepReview.addEventListener('click', () => this.switchCreatorStep('review'));
    if (this.dom.tabFace) this.dom.tabFace.addEventListener('click', () => this.switchCreatorTab('face'));
    if (this.dom.tabEyes) this.dom.tabEyes.addEventListener('click', () => this.switchCreatorTab('eyes'));
    if (this.dom.tabHair) this.dom.tabHair.addEventListener('click', () => this.switchCreatorTab('hair'));
    if (this.dom.tabAttire) this.dom.tabAttire.addEventListener('click', () => this.switchCreatorTab('attire'));
    if (this.dom.btnToggleAdvanced) this.dom.btnToggleAdvanced.addEventListener('click', () => this.switchCreatorStep('advanced'));
    if (this.dom.btnBackReview) this.dom.btnBackReview.addEventListener('click', () => this.switchCreatorStep('review'));

    // Quick Archetype Presets
    if (this.dom.presetGothic) this.dom.presetGothic.addEventListener('click', () => this.applyArchetypePreset('goth'));
    if (this.dom.presetPreppy) this.dom.presetPreppy.addEventListener('click', () => this.applyArchetypePreset('preppy'));
    if (this.dom.presetStreet) this.dom.presetStreet.addEventListener('click', () => this.applyArchetypePreset('street'));
    if (this.dom.presetDreamer) this.dom.presetDreamer.addEventListener('click', () => this.applyArchetypePreset('dreamer'));
    if (this.dom.presetElder) this.dom.presetElder.addEventListener('click', () => this.applyArchetypePreset('elder'));

    // Modular Appearance Selectors Change
    const updateAvatarFromSelects = () => {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: this.dom.selSkin ? this.dom.selSkin.value : 'porcelain',
        faceShape: this.dom.selFaceShape ? this.dom.selFaceShape.value : 'oval',
        noseStyle: this.dom.selNose ? this.dom.selNose.value : 'straight',
        lipsStyle: this.dom.selLips ? this.dom.selLips.value : 'medium',
        mark: this.dom.selMark ? this.dom.selMark.value : 'none',
        eyeShape: this.dom.selEyeShape ? this.dom.selEyeShape.value : 'almond',
        eyelid: this.dom.selEyelid ? this.dom.selEyelid.value : 'double',
        eyeColor: this.dom.selEyeColor ? this.dom.selEyeColor.value : 'black',
        eyebrow: this.dom.selEyebrow ? this.dom.selEyebrow.value : 'soft_arch',
        eyeExtra: this.dom.selEyeExtra ? this.dom.selEyeExtra.value : 'none',
        hairTexture: this.dom.selHairTexture ? this.dom.selHairTexture.value : 'straight',
        hairStyle: this.dom.selHairStyle ? this.dom.selHairStyle.value : 'parted',
        hairColor: this.dom.selHairColor ? this.dom.selHairColor.value : 'raven',
        bangs: this.dom.selBangs ? this.dom.selBangs.value : 'none',
        facialHair: this.dom.selFacialHair ? this.dom.selFacialHair.value : 'clean',
        clothing: this.dom.selClothing ? this.dom.selClothing.value : 'casual',
        clothingColor: this.dom.selClothingColor ? this.dom.selClothingColor.value : 'charcoal',
        glasses: this.dom.selGlasses ? this.dom.selGlasses.value : 'none',
        piercing: this.dom.selPiercing ? this.dom.selPiercing.value : 'none',
        headwear: this.dom.selHeadwear ? this.dom.selHeadwear.value : 'none',
        necklace: this.dom.selNecklace ? this.dom.selNecklace.value : 'none'
      };
      this.renderCreatorAvatar();
    };

    [
      this.dom.selSkin, this.dom.selFaceShape, this.dom.selNose, this.dom.selLips, this.dom.selMark,
      this.dom.selEyeShape, this.dom.selEyelid, this.dom.selEyeColor, this.dom.selEyebrow, this.dom.selEyeExtra,
      this.dom.selHairTexture, this.dom.selHairStyle, this.dom.selHairColor, this.dom.selBangs, this.dom.selFacialHair,
      this.dom.selClothing, this.dom.selClothingColor, this.dom.selGlasses, this.dom.selPiercing, this.dom.selHeadwear, this.dom.selNecklace
    ].forEach(sel => {
      if (sel) sel.addEventListener('change', updateAvatarFromSelects);
    });

    // Gender selection change
    if (this.dom.selGender) {
      this.dom.selGender.addEventListener('change', () => {
        const g = this.dom.selGender.value || 'Male';
        this.creatorState.gender = g;
        this.creatorState.avatar = window.generateRandomAvatar({ age: 18, gender: g });
        this.randomizeName();
        this.syncCreatorUI();
        this.renderCreatorAvatar();
      });
    }

    // Randomize appearance button
    this.dom.btnRandomAvatar.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.creatorState.avatar = window.generateRandomAvatar({ age: 18, gender: this.dom.selGender ? this.dom.selGender.value : 'Male' });
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
      this.creatorState.avatar = window.generateRandomAvatar({ age: 18, gender: this.dom.selGender ? this.dom.selGender.value : 'Male' });
      
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
      const last = this.dom.inputSurname.value.trim();
      const fullName = last ? `${first} ${last}` : first;
      const config = {
        name: fullName,
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

    // Primary navigation. Occupation remains available from Activities.
    if (this.dom.btnTabLife) this.dom.btnTabLife.addEventListener('click', () => {
      window.soundEngine.playClick();
      const hadOpen = this.closeActivePrimaryModal();
      if (!hadOpen) {
        this.hideModals();
      }
      this.setPrimaryNav('life');
      if (this.dom.logFeed) this.dom.logFeed.scrollTo({ top: this.dom.logFeed.scrollHeight, behavior: 'smooth' });
    });

    if (this.dom.btnTabProfile) this.dom.btnTabProfile.addEventListener('click', () => this.openProfile());
    if (this.dom.btnTabCreatures) this.dom.btnTabCreatures.addEventListener('click', () => this.openCreaturesModal());
    if (this.dom.btnCloseCreatures) this.dom.btnCloseCreatures.addEventListener('click', () => this.closeCreaturesModal());
    if (this.dom.btnCloseCreatureDetail) this.dom.btnCloseCreatureDetail.addEventListener('click', () => this.closeCreatureDetail());
    if (this.dom.tabArchiveCreatures) this.dom.tabArchiveCreatures.addEventListener('click', () => this.switchArchiveTab('creatures'));
    if (this.dom.tabArchiveCases) this.dom.tabArchiveCases.addEventListener('click', () => this.switchArchiveTab('cases'));
    if (this.dom.btnCloseCaseDetail) this.dom.btnCloseCaseDetail.addEventListener('click', () => this.closeCaseDetail());
    if (this.dom.btnInvestigateAlone) this.dom.btnInvestigateAlone.addEventListener('click', () => this.handleCaseAction('investigate_alone'));
    if (this.dom.btnInvestigateTeam) this.dom.btnInvestigateTeam.addEventListener('click', () => this.handleCaseAction('investigate_team'));
    if (this.dom.btnAnalyzeEvidence) this.dom.btnAnalyzeEvidence.addEventListener('click', () => this.handleCaseAction('analyze'));
    if (this.dom.btnCaseRecruit) this.dom.btnCaseRecruit.addEventListener('click', () => this.handleCaseAction('recruit'));
    if (this.dom.caseConclusionSelect) this.dom.caseConclusionSelect.addEventListener('change', () => this.syncCaseConclusionUI());
    if (this.dom.btnFileConclusion) this.dom.btnFileConclusion.addEventListener('click', () => this.handleCaseAction('conclude'));
    if (this.dom.btnPublishCase) this.dom.btnPublishCase.addEventListener('click', () => this.handleCaseAction('publish'));
    if (this.dom.btnSubmitCase) this.dom.btnSubmitCase.addEventListener('click', () => this.handleCaseAction('submit'));
    if (this.dom.btnCloseProfile) this.dom.btnCloseProfile.addEventListener('click', () => this.closeProfile());
    if (this.dom.btnProfileDone) this.dom.btnProfileDone.addEventListener('click', () => this.closeProfile());

    // Education Modal Controls
    if (this.dom.btnCloseEducation) {
      this.dom.btnCloseEducation.addEventListener('click', () => this.closeEducationModal());
    }
    if (this.dom.btnEduDone) {
      this.dom.btnEduDone.addEventListener('click', () => this.closeEducationModal());
    }
    if (this.dom.tabEduOverview) {
      this.dom.tabEduOverview.addEventListener('click', () => this.renderEducationModal('overview'));
    }
    if (this.dom.tabEduClassmates) {
      this.dom.tabEduClassmates.addEventListener('click', () => this.renderEducationModal('classmates'));
    }
    if (this.dom.tabEduTeachers) {
      this.dom.tabEduTeachers.addEventListener('click', () => this.renderEducationModal('teachers'));
    }
    if (this.dom.tabEduStaff) {
      this.dom.tabEduStaff.addEventListener('click', () => this.renderEducationModal('staff'));
    }
    if (this.dom.btnEduStudyHarder) {
      this.dom.btnEduStudyHarder.addEventListener('click', () => this.handleSchoolAction('study_harder'));
    }
    if (this.dom.btnEduSkipClass) {
      this.dom.btnEduSkipClass.addEventListener('click', () => this.handleSchoolAction('skip_class'));
    }
    if (this.dom.btnEduDropOut) {
      this.dom.btnEduDropOut.addEventListener('click', () => this.handleSchoolAction('drop_out'));
    }
    if (this.dom.btnEduTransferTrack) {
      this.dom.btnEduTransferTrack.addEventListener('click', () => {
        window.soundEngine.playClick();
        const currLevel = (this.character && this.character.education && this.character.education.level) || 'elementary';
        this.openSchoolChoiceModal(currLevel, true);
      });
    }

    // School Choice & Track Selection Modal Controls
    if (this.dom.btnCloseSchoolChoice) {
      this.dom.btnCloseSchoolChoice.addEventListener('click', () => this.closeSchoolChoiceModal());
    }
    if (this.dom.btnCancelSchoolChoice) {
      this.dom.btnCancelSchoolChoice.addEventListener('click', () => this.closeSchoolChoiceModal());
    }
    if (this.dom.schoolTrackCards) {
      this.dom.schoolTrackCards.forEach(card => {
        card.addEventListener('click', () => {
          window.soundEngine.playClick();
          const trackId = card.dataset.track;
          if (trackId) this.selectSchoolChoiceTrack(trackId);
        });
      });
    }
    if (this.dom.btnEnrollFree) {
      this.dom.btnEnrollFree.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.handleEnrollInTrack('free');
      });
    }
    if (this.dom.btnAskParentsTuition) {
      this.dom.btnAskParentsTuition.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.handleAskParentsTuition();
      });
    }
    if (this.dom.btnApplyScholarship) {
      this.dom.btnApplyScholarship.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.handleApplyScholarship();
      });
    }
    if (this.dom.btnPayTuitionSelf) {
      this.dom.btnPayTuitionSelf.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.handleEnrollInTrack('self');
      });
    }

    // School Person Dossier Modal Controls
    if (this.dom.btnCloseSchoolPerson) {
      this.dom.btnCloseSchoolPerson.addEventListener('click', () => this.closeSchoolPersonModal());
    }
    if (this.dom.btnCancelSchoolPerson) {
      this.dom.btnCancelSchoolPerson.addEventListener('click', () => this.closeSchoolPersonModal());
    }

    if (this.dom.btnCloseCareers) {
      this.dom.btnCloseCareers.addEventListener('click', () => {
        this.closeCareersModal();
      });
    }

    this.dom.tabCareerMundane.addEventListener('click', () => {
      this.activeCareerTab = 'mundane';
      this.renderCareersList();
    });

    if (this.dom.tabCareerParttime) {
      this.dom.tabCareerParttime.addEventListener('click', () => {
        this.activeCareerTab = 'parttime';
        this.renderCareersList();
      });
    }

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
      this.animateCloseModal(this.dom.godmodeModal, null, true);
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
    if (this.dom.btnKinCuddle) {
      this.dom.btnKinCuddle.addEventListener('click', () => this.handleKinAction('cuddle'));
    }
    if (this.dom.btnKinBabble) {
      this.dom.btnKinBabble.addEventListener('click', () => this.handleKinAction('babble'));
    }
    if (this.dom.btnKinFeed) {
      this.dom.btnKinFeed.addEventListener('click', () => this.handleKinAction('feed_milk'));
    }
    if (this.dom.btnKinPeekaboo) {
      this.dom.btnKinPeekaboo.addEventListener('click', () => this.handleKinAction('peekaboo'));
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
    if (this.dom.btnKinInsult) {
      this.dom.btnKinInsult.addEventListener('click', () => this.handleKinAction('insult'));
    }
    if (this.dom.btnKinApologize) {
      this.dom.btnKinApologize.addEventListener('click', () => this.handleKinAction('apology'));
    }
    if (this.dom.btnKinHex) {
      this.dom.btnKinHex.addEventListener('click', () => {
        const target = this.selectedKin;
        this.closeKinDetailModal();
        this.closeKinModal();
        this.openDarkAltarModal(target);
      });
    }
    if (this.dom.btnKinAdvice) {
      this.dom.btnKinAdvice.addEventListener('click', () => this.handleKinAction('parent_advice'));
    }
    if (this.dom.btnKinBicker) {
      this.dom.btnKinBicker.addEventListener('click', () => this.handleKinAction('sibling_bicker'));
    }
    if (this.dom.btnKinSecret) {
      this.dom.btnKinSecret.addEventListener('click', () => this.handleKinAction('sibling_secret'));
    }
    if (this.dom.btnKinFolktale) {
      this.dom.btnKinFolktale.addEventListener('click', () => this.handleKinAction('grandparent_folktale'));
    }
    if (this.dom.btnKinChores) {
      this.dom.btnKinChores.addEventListener('click', () => this.handleKinAction('parent_chores'));
    }
    if (this.dom.btnKinBegPet) {
      this.dom.btnKinBegPet.addEventListener('click', () => this.handleKinAction('parent_beg_pet'));
    }
    if (this.dom.btnKinDriving) {
      this.dom.btnKinDriving.addEventListener('click', () => this.handleKinAction('parent_driving'));
    }
    if (this.dom.btnKinCollege) {
      this.dom.btnKinCollege.addEventListener('click', () => this.handleKinAction('parent_college'));
    }
    if (this.dom.btnKinLoan) {
      this.dom.btnKinLoan.addEventListener('click', () => this.handleKinAction('parent_loan'));
    }
    if (this.dom.btnKinElderCare) {
      this.dom.btnKinElderCare.addEventListener('click', () => this.handleKinAction('parent_elder_care'));
    }
    if (this.dom.btnKinSiblingBrawl) {
      this.dom.btnKinSiblingBrawl.addEventListener('click', () => this.handleKinAction('sibling_brawl'));
    }
    if (this.dom.btnKinAlibi) {
      this.dom.btnKinAlibi.addEventListener('click', () => this.handleKinAction('sibling_alibi'));
    }
    if (this.dom.btnKinSiblingDrinks) {
      this.dom.btnKinSiblingDrinks.addEventListener('click', () => this.handleKinAction('sibling_drinks'));
    }
    if (this.dom.btnKinAttic) {
      this.dom.btnKinAttic.addEventListener('click', () => this.handleKinAction('grandparent_attic'));
    }
    if (this.dom.btnKinKeepsake) {
      this.dom.btnKinKeepsake.addEventListener('click', () => this.handleKinAction('grandparent_keepsake'));
    }
    if (this.dom.btnKinNursing) {
      this.dom.btnKinNursing.addEventListener('click', () => this.handleKinAction('grandparent_nursing'));
    }
    if (this.dom.btnKinConfess) {
      this.dom.btnKinConfess.addEventListener('click', () => this.handleKinAction('friend_confess'));
    }
    if (this.dom.btnKinDate) {
      this.dom.btnKinDate.addEventListener('click', () => this.handleKinAction('lover_date'));
    }
    if (this.dom.btnKinFlirt) {
      this.dom.btnKinFlirt.addEventListener('click', () => this.handleKinAction('lover_flirt'));
    }
    if (this.dom.btnKinMoveIn) {
      this.dom.btnKinMoveIn.addEventListener('click', () => this.handleKinAction('lover_move_in'));
    }
    if (this.dom.btnKinPropose) {
      this.dom.btnKinPropose.addEventListener('click', () => this.handleKinAction('lover_propose'));
    }
    if (this.dom.btnKinWedding) {
      this.dom.btnKinWedding.addEventListener('click', () => this.handleKinAction('lover_wedding'));
    }
    if (this.dom.btnKinConceive) {
      this.dom.btnKinConceive.addEventListener('click', () => this.handleKinAction('lover_conceive'));
    }
    if (this.dom.btnKinBreakup) {
      this.dom.btnKinBreakup.addEventListener('click', () => this.handleKinAction('lover_breakup'));
    }
    if (this.dom.btnKinPray) {
      this.dom.btnKinPray.addEventListener('click', () => this.handleKinAction('family_pray'));
    }
    if (this.dom.btnKinEggshells) {
      this.dom.btnKinEggshells.addEventListener('click', () => this.handleKinAction('family_eggshells'));
    }
    if (this.dom.btnKinCommendation) {
      this.dom.btnKinCommendation.addEventListener('click', () => this.handleKinAction('family_commendation'));
    }
    if (this.dom.btnKinGrandparentHaven) {
      this.dom.btnKinGrandparentHaven.addEventListener('click', () => this.handleKinAction('grandparent_haven'));
    }

    // Action Choice Modal Controls
    if (this.dom.btnCancelActionChoice) {
      this.dom.btnCancelActionChoice.addEventListener('click', () => this.closeActionChoiceModal());
    }

    // Pet Modal & Pet Interaction Controls
    if (this.dom.btnClosePetsModal) {
      this.dom.btnClosePetsModal.addEventListener('click', () => this.closePetsModal());
    }
    if (this.dom.btnCancelPets) {
      this.dom.btnCancelPets.addEventListener('click', () => this.closePetsModal());
    }
    if (this.dom.btnClosePetDetail) {
      this.dom.btnClosePetDetail.addEventListener('click', () => this.closePetDetailModal());
    }
    if (this.dom.btnBackPetDetail) {
      this.dom.btnBackPetDetail.addEventListener('click', () => this.closePetDetailModal());
    }
    if (this.dom.btnPetFeed) {
      this.dom.btnPetFeed.addEventListener('click', () => this.handlePetAction('feed'));
    }
    if (this.dom.btnPetCuddle) {
      this.dom.btnPetCuddle.addEventListener('click', () => this.handlePetAction('cuddle'));
    }
    if (this.dom.btnPetStroll) {
      this.dom.btnPetStroll.addEventListener('click', () => this.handlePetAction('stroll'));
    }
    if (this.dom.btnPetCommune) {
      this.dom.btnPetCommune.addEventListener('click', () => this.handlePetAction('commune'));
    }
    if (this.dom.btnPetVet) {
      this.dom.btnPetVet.addEventListener('click', () => this.handlePetAction('vet'));
    }
    document.querySelectorAll('.pet-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab || 'mundane';
        this.filterPetAdoptions(tab);
      });
    });
    if (this.dom.btnCloseDarkAltar) {
      this.dom.btnCloseDarkAltar.addEventListener('click', () => this.closeDarkAltarModal());
    }
    if (this.dom.btnCancelDarkAltar) {
      this.dom.btnCancelDarkAltar.addEventListener('click', () => this.closeDarkAltarModal());
    }
    if (this.dom.darkAltarTargetSelect) {
      this.dom.darkAltarTargetSelect.addEventListener('change', () => {
        this.onDarkAltarTargetChanged();
      });
    }
    if (this.dom.btnAcquireRitualMaterials) {
      this.dom.btnAcquireRitualMaterials.addEventListener('click', () => this.acquireDarkAltarMaterials());
    }
    if (this.dom.btnCloseRitualPrep) {
      this.dom.btnCloseRitualPrep.addEventListener('click', () => this.closeRitualPreparation());
    }
    if (this.dom.btnSealRitual) {
      this.dom.btnSealRitual.addEventListener('click', () => this.sealPreparedRitual());
    }
    if (this.dom.btnCloseTerribleNet) {
      this.dom.btnCloseTerribleNet.addEventListener('click', () => this.closeTerribleNetModal());
    }
    if (this.dom.terribleNetTabs) {
      this.dom.terribleNetTabs.addEventListener('click', event => {
        const button = event.target.closest('[data-net-tab]');
        if (button) this.renderTerribleNet(button.dataset.netTab);
      });
    }
    if (this.dom.terribleNetContent) {
      this.dom.terribleNetContent.addEventListener('click', event => this.handleTerribleNetAction(event));
      this.dom.terribleNetContent.addEventListener('change', event => {
        if (event.target.id === 'net-compose-platform') this.syncTerribleNetComposer();
      });
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

    // Activities Modal Controls ("City of Buttons")
    if (this.dom.btnTabActivities) {
      this.dom.btnTabActivities.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openActivitiesModal();
      });
    }
    if (this.dom.btnCloseActivities) {
      this.dom.btnCloseActivities.addEventListener('click', () => this.closeActivitiesModal());
    }
    if (this.dom.btnBackActivitiesHub) {
      this.dom.btnBackActivitiesHub.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.closeActivityCategory();
      });
    }
    document.querySelectorAll('.btn-activity-category').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.soundEngine.playClick();
        const cat = e.currentTarget.dataset.category;
        this.openActivityCategory(cat);
      });
    });

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

    // Settings Switcher Controls
    const openSettings = () => this.openSettingsModal();
    if (this.dom.btnLandingSettings) this.dom.btnLandingSettings.addEventListener('click', openSettings);
    if (this.dom.btnCreatorSettings) this.dom.btnCreatorSettings.addEventListener('click', openSettings);
    if (this.dom.btnGameSettings) this.dom.btnGameSettings.addEventListener('click', openSettings);
    if (this.dom.btnCloseSettings) this.dom.btnCloseSettings.addEventListener('click', () => this.closeSettingsModal());
    if (this.dom.btnCloseThemeModal) this.dom.btnCloseThemeModal.addEventListener('click', () => this.closeSettingsModal());
    if (this.dom.tabSettingsExperience) this.dom.tabSettingsExperience.addEventListener('click', () => this.switchSettingsPanel('experience'));
    if (this.dom.tabSettingsReading) this.dom.tabSettingsReading.addEventListener('click', () => this.switchSettingsPanel('reading'));
    if (this.dom.tabSettingsTheme) this.dom.tabSettingsTheme.addEventListener('click', () => this.switchSettingsPanel('theme'));

    // Sound toggle buttons
    if (this.dom.btnSoundOff) this.dom.btnSoundOff.addEventListener('click', () => this.setSoundEnabled(false));
    if (this.dom.btnSoundOn) this.dom.btnSoundOn.addEventListener('click', () => this.setSoundEnabled(true));

    // Vibration toggle buttons
    if (this.dom.btnVibeOff) this.dom.btnVibeOff.addEventListener('click', () => this.setVibrationEnabled(false));
    if (this.dom.btnVibeOn) this.dom.btnVibeOn.addEventListener('click', () => this.setVibrationEnabled(true));

    // Text size buttons
    if (this.dom.btnTextSmall) this.dom.btnTextSmall.addEventListener('click', () => this.setTextSize('small'));
    if (this.dom.btnTextNormal) this.dom.btnTextNormal.addEventListener('click', () => this.setTextSize('normal'));
    if (this.dom.btnTextLarge) this.dom.btnTextLarge.addEventListener('click', () => this.setTextSize('large'));
    if (this.dom.btnTextHuge) this.dom.btnTextHuge.addEventListener('click', () => this.setTextSize('huge'));

    // Font / Typography buttons
    if (this.dom.btnFontGame) this.dom.btnFontGame.addEventListener('click', () => this.setFont('game-gothic'));
    if (this.dom.btnFontDevice) this.dom.btnFontDevice.addEventListener('click', () => this.setFont('device-system'));

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
    const genderVal = this.dom.selGender ? this.dom.selGender.value : 'Male';
    let gender = genderVal;
    if (genderVal === 'Enigmatic') {
      gender = Math.random() > 0.5 ? 'Male' : 'Female';
    }

    if (window.generateCharacterName) {
      const nameObj = window.generateCharacterName({
        countryCode: this.creatorState.countryCode,
        gender: gender
      });
      this.dom.inputFirstName.value = nameObj.first;
      this.dom.inputSurname.value = nameObj.surname || '';
      this.creatorState.name = { first: nameObj.first, surname: nameObj.surname || '' };
    } else {
      const country = window.COUNTRIES_DATA[this.creatorState.countryCode] || window.COUNTRIES_DATA.USA;
      const isMale = gender === 'Male';
      const first = isMale 
        ? window.getRandomElement(country.firstNamesMale)
        : window.getRandomElement(country.firstNamesFemale);
      const surname = window.getRandomElement(country.surnames);
      
      this.dom.inputFirstName.value = first;
      this.dom.inputSurname.value = surname;
      this.creatorState.name = { first, surname };
    }
  }

  syncCreatorUI() {
    const av = this.creatorState.avatar;
    if (!av) return;

    if (this.dom.selSkin && av.skin) this.dom.selSkin.value = av.skin;
    if (this.dom.selFaceShape && av.faceShape) this.dom.selFaceShape.value = av.faceShape;
    if (this.dom.selNose && av.noseStyle) this.dom.selNose.value = av.noseStyle;
    if (this.dom.selLips && av.lipsStyle) this.dom.selLips.value = av.lipsStyle;
    if (this.dom.selMark && av.mark) this.dom.selMark.value = av.mark;
    if (this.dom.selEyeShape && av.eyeShape) this.dom.selEyeShape.value = av.eyeShape;
    if (this.dom.selEyelid && av.eyelid) this.dom.selEyelid.value = av.eyelid;
    if (this.dom.selEyeColor && av.eyeColor) this.dom.selEyeColor.value = av.eyeColor;
    if (this.dom.selEyebrow && av.eyebrow) this.dom.selEyebrow.value = av.eyebrow;
    if (this.dom.selEyeExtra && av.eyeExtra) this.dom.selEyeExtra.value = av.eyeExtra;
    if (this.dom.selHairTexture && av.hairTexture) this.dom.selHairTexture.value = av.hairTexture;
    if (this.dom.selHairStyle && av.hairStyle) this.dom.selHairStyle.value = av.hairStyle;
    if (this.dom.selHairColor && av.hairColor) this.dom.selHairColor.value = av.hairColor;
    if (this.dom.selBangs && av.bangs) this.dom.selBangs.value = av.bangs;
    if (this.dom.selFacialHair && av.facialHair) this.dom.selFacialHair.value = av.facialHair;
    if (this.dom.selClothing && av.clothing) this.dom.selClothing.value = av.clothing;
    if (this.dom.selClothingColor && av.clothingColor) this.dom.selClothingColor.value = av.clothingColor;
    if (this.dom.selGlasses && av.glasses) this.dom.selGlasses.value = av.glasses;
    if (this.dom.selPiercing && av.piercing) this.dom.selPiercing.value = av.piercing;
    if (this.dom.selHeadwear && av.headwear) this.dom.selHeadwear.value = av.headwear;
    if (this.dom.selNecklace && av.necklace) this.dom.selNecklace.value = av.necklace;

    if (!this.dom.inputFirstName.value) {
      this.randomizeName();
    }
  }

  applyArchetypePreset(presetKey) {
    window.soundEngine.playClick();
    if (presetKey === 'goth') {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: 'porcelain',
        faceShape: 'heart',
        hairStyle: 'wolf_cut',
        hairColor: 'raven',
        eyeColor: 'crimson',
        eyeExtra: 'eyeliner',
        clothing: 'goth',
        clothingColor: 'burgundy',
        necklace: 'choker',
        piercing: 'nose_stud'
      };
    } else if (presetKey === 'preppy') {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: 'ivory',
        faceShape: 'oval',
        hairStyle: 'parted',
        hairColor: 'golden_blonde',
        eyeColor: 'blue',
        clothing: 'prep_blazer',
        clothingColor: 'school_navy',
        glasses: 'none',
        necklace: 'pearls'
      };
    } else if (presetKey === 'street') {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: 'warm_bronze',
        faceShape: 'square',
        hairStyle: 'dreadlocks',
        hairTexture: 'coily',
        hairColor: 'raven',
        clothing: 'hoodie',
        clothingColor: 'charcoal',
        headwear: 'beanie',
        piercing: 'eyebrow'
      };
    } else if (presetKey === 'dreamer') {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: 'golden_peach',
        faceShape: 'round',
        hairStyle: 'loose_waves',
        hairColor: 'pastel_pink',
        eyeColor: 'golden',
        mark: 'freckles',
        clothing: 'sweater',
        clothingColor: 'mustard',
        headwear: 'beret'
      };
    } else if (presetKey === 'elder') {
      this.creatorState.avatar = {
        ...this.creatorState.avatar,
        skin: 'ash',
        faceShape: 'oblong',
        hairStyle: 'short_bob',
        hairColor: 'silver_gray',
        clothing: 'sweater',
        clothingColor: 'tweed_brown',
        glasses: 'round_wire',
        age: 65
      };
    }
    this.syncCreatorUI();
    this.renderCreatorAvatar();
  }

  switchCreatorTab(tab) {
    const tabs = [
      this.dom.tabFace, this.dom.tabEyes, this.dom.tabHair, this.dom.tabAttire
    ].filter(Boolean);
    const panels = [
      this.dom.panelFace, this.dom.panelEyes, this.dom.panelHair, this.dom.panelAttire
    ].filter(Boolean);

    tabs.forEach(t => {
      t.classList.remove('bg-slatecard', 'text-parchment', 'text-amber-300');
      t.classList.add('text-dust');
    });
    panels.forEach(p => {
      p.classList.add('hidden');
      p.style.display = 'none';
    });

    const activeMap = {
      face: { tab: this.dom.tabFace, panel: this.dom.panelFace },
      eyes: { tab: this.dom.tabEyes, panel: this.dom.panelEyes },
      hair: { tab: this.dom.tabHair, panel: this.dom.panelHair },
      attire: { tab: this.dom.tabAttire, panel: this.dom.panelAttire }
    };

    const target = activeMap[tab] || activeMap.face;
    if (target && target.tab && target.panel) {
      target.tab.classList.add('bg-slatecard', 'text-parchment');
      target.tab.classList.remove('text-dust');
      target.panel.classList.remove('hidden');
      target.panel.style.display = 'block';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  switchCreatorStep(step) {
    const stepButtons = [this.dom.stepIdentity, this.dom.stepAppearance, this.dom.stepReview].filter(Boolean);
    stepButtons.forEach(button => {
      button.classList.remove('bg-slatecard', 'text-parchment', 'font-bold');
      button.classList.add('text-dust');
      button.removeAttribute('aria-current');
    });

    const allPanels = [
      this.dom.panelIdentity, this.dom.panelFace, this.dom.panelEyes,
      this.dom.panelHair, this.dom.panelAttire, this.dom.panelReview,
      this.dom.panelGodmode
    ].filter(Boolean);
    allPanels.forEach(panel => {
      panel.classList.add('hidden');
      panel.style.display = 'none';
    });
    if (this.dom.appearanceSubnav) this.dom.appearanceSubnav.classList.add('hidden');

    let activeButton = this.dom.stepIdentity;
    if (step === 'identity') {
      this.dom.panelIdentity.style.display = 'block';
      this.dom.panelIdentity.classList.remove('hidden');
    } else if (step === 'appearance') {
      activeButton = this.dom.stepAppearance;
      this.dom.appearanceSubnav.classList.remove('hidden');
      this.switchCreatorTab('face');
    } else if (step === 'review') {
      activeButton = this.dom.stepReview;
      this.renderCreatorReview();
      this.dom.panelReview.style.display = 'block';
      this.dom.panelReview.classList.remove('hidden');
    } else if (step === 'advanced') {
      activeButton = this.dom.stepReview;
      this.dom.panelGodmode.style.display = 'block';
      this.dom.panelGodmode.classList.remove('hidden');
    }

    if (activeButton) {
      activeButton.classList.add('bg-slatecard', 'text-parchment', 'font-bold');
      activeButton.classList.remove('text-dust');
      activeButton.setAttribute('aria-current', 'step');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderCreatorReview() {
    const first = this.dom.inputFirstName.value.trim();
    const last = this.dom.inputSurname.value.trim();
    this.dom.reviewName.textContent = [first, last].filter(Boolean).join(' ') || 'Unnamed Soul';
    const country = window.COUNTRIES_DATA[this.creatorState.countryCode] || window.COUNTRIES_DATA.USA;
    this.dom.reviewOrigin.textContent = [this.dom.selCity.value || this.creatorState.city, country.name].filter(Boolean).join(', ');
    this.dom.reviewGender.textContent = this.dom.selGender.value || '—';
    this.dom.reviewTrait.textContent = this.creatorState.trait?.name || '—';
    const avatar = this.creatorState.avatar || {};
    const styleParts = [avatar.hairStyle, avatar.clothing].filter(Boolean).map(value => value.replaceAll('_', ' '));
    this.dom.reviewStyle.textContent = styleParts.length ? styleParts.join(' · ') : 'Custom appearance';
  }

  renderCreatorAvatar() {
    if (!this.dom.creatorAvatarCanvas) return;
    window.drawGothicAvatar(this.dom.creatorAvatarCanvas, {
      ...this.creatorState.avatar,
      gender: this.dom.selGender ? this.dom.selGender.value : (this.creatorState.gender || 'Male'),
      age: (this.creatorState.avatar && this.creatorState.avatar.age !== undefined) ? this.creatorState.avatar.age : 18
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
          const calculatedMax = this.calculateMaxActions(this.character);
          if (this.character.actionsLeft === undefined || this.character.maxActions === undefined || this.character.maxActions > 8) {
            this.character.maxActions = calculatedMax;
            this.character.actionsLeft = Math.min(this.character.actionsLeft ?? calculatedMax, calculatedMax);
          }
          if (!this.character.activityUses) {
            this.character.activityUses = {};
          }
          if (this.character.age <= 17 && (!this.character.education || !this.character.education.enrolled) && window.enrollInSchool) {
            window.enrollInSchool(this.character);
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

  calculateMaxActions(char = null) {
    const c = char || this.character;
    if (!c) return 5;
    let base = 5;
    if (c.age <= 2) base = 2;
    else if (c.age <= 5) base = 3;
    else if (c.age <= 12) base = 4;
    else if (c.age <= 55) base = 5;
    else if (c.age <= 70) base = 4;
    else base = 3;

    const vit = c.stats ? (c.stats.vitality ?? 80) : 80;
    const san = c.stats ? (c.stats.sanity ?? 80) : 80;

    if (c.age >= 16 && c.age <= 45 && vit >= 85 && san >= 75) {
      base += 1;
    }
    if (vit < 30 || san < 25) {
      base -= 1;
    }
    if (vit < 15 && base > 2) {
      base -= 1;
    }
    if (c.housing === 'homeless') {
      base -= 1;
    }
    return Math.max(1, base);
  }

  notifyExhausted(customMessage = null) {
    this.openFeedbackModal({
      tag: "FOCUS EXHAUSTED",
      title: "Exhausted for this Year",
      icon: "battery-charging",
      iconColor: "text-amber-400",
      body: customMessage || "You have exhausted your focus and energy for this year! Tap 'Endure Year' to rest, reflect, and advance time.",
      effects: {}
    });
  }

  startNewLife(customConfig = null) {
    this.character = window.generateCharacter(customConfig);
    this.character.kin = window.generateFamily(this.character);

    // Apply family upbringing / atmosphere stat effects meaningfully
    if (this.character.kin && this.character.kin.atmosphere && this.character.kin.atmosphere.statEffects) {
      const se = this.character.kin.atmosphere.statEffects;
      Object.keys(se).forEach(statKey => {
        if (typeof this.character.stats[statKey] === 'number') {
          this.character.stats[statKey] = Math.max(0, Math.min(100, this.character.stats[statKey] + se[statKey]));
        }
      });
    }

    this.character.maxActions = this.calculateMaxActions();
    this.character.actionsLeft = this.character.maxActions;
    this.character.activityUses = {};
    this.usedDilemmaIds.clear();

    const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;

    const familySummary = [];
    if (this.character.kin && this.character.kin.atmosphere) {
      familySummary.push(`Household Upbringing: ${this.character.kin.atmosphere.emoji} ${this.character.kin.atmosphere.name} — ${this.character.kin.atmosphere.desc}`);
    }
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
    if (this.character.age <= 17 && window.enrollInSchool) {
      window.enrollInSchool(this.character);
    }
    this.activeDilemma = null;
    this.hideModals();
    this.saveGame();
    this.renderAll();
    this.showScreen('screen-game');
  }

  endureYear() {
    if (!this.character.isAlive || this.activeDilemma) return;

    window.soundEngine.playTick();
    this.vibrate(35);

    this.character.age += 1;
    this.character.year += 1;

    // Replenish annual focus pool & reset activity quotas
    this.character.maxActions = this.calculateMaxActions();
    this.character.actionsLeft = this.character.maxActions;
    this.character.activityUses = {};

    // Status titles by age
    if (this.character.age <= 1) this.character.statusTitle = "Infant";
    else if (this.character.age <= 3) this.character.statusTitle = "Toddler";
    else if (this.character.age <= 5) this.character.statusTitle = "Young Child";
    else if (this.character.age <= 10) this.character.statusTitle = "Child";
    else if (this.character.age <= 13) this.character.statusTitle = "Preteen";
    else if (this.character.age <= 17) this.character.statusTitle = "Teenager";
    else if (this.character.age <= 30) this.character.statusTitle = "Young Adult";
    else if (this.character.age <= 60) this.character.statusTitle = "Adult";
    else this.character.statusTitle = "Elder";

    const currentYearLog = {
      age: this.character.age,
      year: this.character.year,
      entries: []
    };

    if (window.tickConsequences) {
      window.tickConsequences(this.character).forEach(entry => currentYearLog.entries.push(entry));
    } else if (window.tickReactionYear) {
      window.tickReactionYear(this.character).forEach(entry => currentYearLog.entries.push(entry));
    }
    if (window.tickLifeEffects) window.tickLifeEffects(this.character).forEach(entry => currentYearLog.entries.push(`[LASTING ADVANTAGE] ${entry}`));
    if (window.tickInvestigations) window.tickInvestigations(this.character).forEach(entry => currentYearLog.entries.push(`[ARCHIVE] ${entry}`));

    // Ensure kin exists and tick their simulation (aging, allowances, mortality, friend discovery)
    if (!this.character.kin) {
      this.character.kin = window.generateFamily(this.character);
    }
    const kinLogs = window.tickKinYear(this.character) || [];
    if (window.tickEntities) window.tickEntities(this.character).forEach(entry => currentYearLog.entries.push(entry));
    if (window.tickSocialNetwork) {
      window.tickSocialNetwork(this.character).forEach(entry => currentYearLog.entries.push(`[SOCIAL NETWORK] ${entry}`));
    }
    if (window.tickTerribleNet) {
      window.tickTerribleNet(this.character).forEach(entry => currentYearLog.entries.push(`[TERRIBLENET] ${entry}`));
    }
    if (window.tickFame) {
      window.tickFame(this.character).forEach(entry => currentYearLog.entries.push(`[PUBLIC IDENTITY] ${entry}`));
    }

    // ==========================================
    // 5-7 MULTI-EVENT YEARLY CHRONICLE
    // ==========================================

    // 1. Life Stage & Developmental Milestone
    if (this.character.age <= 17 && window.getFamilyMilestone) {
      const milestone = window.getFamilyMilestone(this.character);
      if (milestone) {
        currentYearLog.entries.push(milestone);
      } else if (this.character.age === 1) {
        currentYearLog.entries.push(`Turned 1 year old. You learned to crawl across cold hardwood floorboards, watching dust motes spin in pale sunlight.`);
      } else if (this.character.age <= 3) {
        const toddlerMilestones = [
          `Turned ${this.character.age}. You learned to speak in fragmented sentences, pointing out shadows that lingered too long in the corners.`,
          `Turned ${this.character.age}. You spent hours stacking wooden blocks, knocking them over whenever footsteps passed the doorway.`,
          `Turned ${this.character.age}. Your nursery window stayed damp with winter frost; you learned to recognize passing siren wails.`
        ];
        currentYearLog.entries.push(window.getRandomElement(toddlerMilestones));
      } else if (this.character.age <= 5) {
        const kindergartenMilestones = [
          `Turned ${this.character.age}. Practiced letters and counting in kindergarten while rain tapped against the classroom windows.`,
          `Turned ${this.character.age}. Shared crayons and picture books during circle time, avoiding the chair nobody else seemed to notice.`,
          `Turned ${this.character.age}. Learned playground rules and carried home a finger-painting that looked different after sunset.`
        ];
        currentYearLog.entries.push(window.getRandomElement(kindergartenMilestones));
      } else if (this.character.age <= 10) {
        const elementaryMilestones = [
          `Turned ${this.character.age}. Attended municipal primary school in ${this.character.city}. Fluorescent bulbs hummed steadily over chalkboards.`,
          `Turned ${this.character.age}. Traded pencil erasers and horror comics with classmates beneath the playground stairwell.`,
          `Turned ${this.character.age}. Handed in school homework while rumors circulated about stray animals vanishing around the city reservoir.`
        ];
        currentYearLog.entries.push(window.getRandomElement(elementaryMilestones));
      } else if (this.character.age <= 13) {
        const middleSchoolMilestones = [
          `Turned ${this.character.age}. Navigated middle-school timetables, new teachers, and friendships that changed without warning.`,
          `Turned ${this.character.age}. Carried heavier textbooks through crowded corridors while lockers clicked open on their own.`,
          `Turned ${this.character.age}. Stayed late for a group assignment as footsteps paced the empty floor above.`
        ];
        currentYearLog.entries.push(window.getRandomElement(middleSchoolMilestones));
      } else {
        const adolescentMilestones = [
          `Turned ${this.character.age}. Navigated high school corridors, peer cliques, and the suffocating pressure of an uncertain future.`,
          `Turned ${this.character.age}. Late night study sessions in ${this.character.city} accompanied by distant freight trains and sirens.`,
          `Turned ${this.character.age}. High school rumors whispered about students slipping into the drainage tunnels after dark.`
        ];
        currentYearLog.entries.push(window.getRandomElement(adolescentMilestones));
      }
    } else if (this.character.age <= 29) {
      currentYearLog.entries.push(`Turned ${this.character.age}. Confronting the harsh grind of young adulthood in ${this.character.city}.`);
    } else if (this.character.age <= 59) {
      currentYearLog.entries.push(`Turned ${this.character.age}. Navigating the relentless responsibilities and quiet isolation of adult life.`);
    } else {
      currentYearLog.entries.push(`Turned ${this.character.age}. Watching decades of memories blur together through the fog of ${this.character.city}.`);
    }

    // 2. School / Education Simulation (Annual report cards, progression, graduations)
    if (window.tickEducationYear && (this.character.age <= 17 || (this.character.education && this.character.education.enrolled))) {
      const eduLogs = window.tickEducationYear(this.character) || [];
      eduLogs.forEach(entry => currentYearLog.entries.push(entry));
    }

    // Institutional Confinement Simulation
    if (this.character.institution && this.character.institution.active) {
      const inst = this.character.institution;
      inst.yearsLeft = Math.max(0, (inst.yearsLeft || 1) - 1);
      if (inst.type === 'asylum') {
        this.modifyStat('vitality', -2);
        this.modifyStat('sanity', 6);
        this.modifyStat('happiness', -5);
        currentYearLog.entries.push(`[ASYLUM CONFINEMENT] Another year behind the heavy oak doors of ${inst.name}. Daily sedatives, orderlies, and supervised ward walks (-2% Vitality, +6% Sanity, -5% Happiness). ${inst.yearsLeft} year(s) remaining.`);
        if (inst.yearsLeft <= 0) {
          inst.active = false;
          this.modifyStat('happiness', 15);
          currentYearLog.entries.push(`[DISCHARGED FROM ASYLUM] The clinical review board declared you stabilized! You were handed your civilian clothes and discharged through the front gate.`);
        }
      } else if (inst.type === 'prison') {
        this.modifyStat('vitality', 1);
        this.modifyStat('sanity', -3);
        this.modifyStat('happiness', -8);
        this.modifyStat('humanity', -2);
        currentYearLog.entries.push(`[PENITENTIARY INCARCERATION] Another year counted in cell wall tallies at ${inst.name}. Iron bars, roll calls, and coarse rations (+1% Vitality, -3% Sanity, -8% Happiness). ${inst.yearsLeft} year(s) remaining.`);
        if (inst.yearsLeft <= 0) {
          inst.active = false;
          this.modifyStat('happiness', 15);
          currentYearLog.entries.push(`[RELEASED FROM PRISON] Your prison term was served in full. The iron turnstiles unlocked and you stepped back into freedom.`);
        }
      }
    }

    // 3. Career / Vocation Performance
    if (this.character.job && (!this.character.institution || !this.character.institution.active)) {
      this.character.jobTenure = (this.character.jobTenure || 0) + 1;
      this.character.jobPerformance = this.character.jobPerformance !== undefined ? this.character.jobPerformance : 50;

      const performanceDrift = Math.floor(((this.character.stats.smarts || 50) - 50) * 0.1) + Math.floor(((this.character.stats.vitality || 50) - 50) * 0.05);
      this.character.jobPerformance = Math.max(0, Math.min(100, this.character.jobPerformance + performanceDrift));

      const base = this.character.job.baseSalary || this.character.job.baseSalaryUSD || 24000;
      const salary = window.getAdjustedSalary(base, this.character.countryCode);
      this.character.money += salary;
      currentYearLog.entries.push(`Deposited salary: +${window.formatMoney(salary, this.character.countryCode)} working as a ${this.character.job.title} (Performance: ${this.character.jobPerformance}%).`);

      // Promotion evaluation
      const nextPromotion = window.getPromotionForJob ? window.getPromotionForJob(this.character.job) : null;
      if (nextPromotion && this.character.jobPerformance >= 70 && this.character.jobTenure >= 2) {
        const oldTitle = this.character.job.title;
        this.character.job = nextPromotion;
        this.character.jobTenure = 0;
        this.character.jobPerformance = 55;
        this.modifyStat('happiness', 12);
        this.modifyStat('sanity', 5);
        currentYearLog.entries.push(`[CAREER PROMOTION] Promoted from ${oldTitle} to ${nextPromotion.title}! Base salary increased to ${window.formatMoney(window.getAdjustedSalary(nextPromotion.baseSalary, this.character.countryCode), this.character.countryCode)}.`);
      } else if (this.character.jobPerformance <= 20) {
        const firedTitle = this.character.job.title;
        this.character.job = null;
        this.character.jobTenure = 0;
        this.character.jobPerformance = 50;
        this.modifyStat('happiness', -12);
        this.modifyStat('sanity', -6);
        currentYearLog.entries.push(`[TERMINATED] Due to disastrous performance appraisals, you were formally dismissed from your position as ${firedTitle}.`);
      }

      if (this.character.job && this.character.job.stress > 25 && Math.random() < 0.4) {
        this.modifyStat('vitality', -1);
      }
    } else if (this.character.age >= 18 && (!this.character.education || !this.character.education.enrolled) && (!this.character.institution || !this.character.institution.active)) {
      const unemploymentVignettes = [
        "Lacking full-time employment, you scraped together odd cash errands and gig deliveries.",
        "Submitted electronic resumes to indifferent corporate job portals without response.",
        "Struggled to secure steady work; spent afternoons browsing want-ads in the municipal library."
      ];
      currentYearLog.entries.push(window.getRandomElement(unemploymentVignettes));
    }

    // 3. Living Expenses, Part-Time Wages & Occult Syndicate Stipend
    if (this.character.partTimeJob && window.TLLSubsystems) {
      const ptPay = window.TLLSubsystems.getActiveMundaneAnnualPay(this.character);
      this.character.money = (this.character.money || 0) + ptPay;
      currentYearLog.entries.push(`Earned +${window.formatMoney(ptPay, this.character.countryCode)} from part-time shifts as ${this.character.partTimeJob.title}.`);
    }

    if (this.character.paranormalGig) {
      const gig = this.character.paranormalGig;
      const bonusS = (this.character.occultWorkplace && this.character.occultWorkplace.bonusShillings) || 0;
      const totalS = (gig.payoutShillings || 0) + bonusS;
      this.character.shillings += totalS;
      this.modifyStat('sanity', -gig.sanityCost);
      currentYearLog.entries.push(`Collected +${totalS} s. from occult contract (${gig.title}). The ordeal drained -${gig.sanityCost}% Sanity.`);
    }

    if (this.character.age >= 18 && (!this.character.institution || !this.character.institution.active)) {
      const country = window.COUNTRIES_DATA[this.character.countryCode] || window.COUNTRIES_DATA.USA;
      const annualRentCost = country.annualLivingCost || 16000;

      // Initialize housing on reaching adulthood
      if (!this.character.housing || this.character.housing === 'family_home') {
        this.character.housing = 'tenement_apartment';
      }

      if (this.character.housing === 'tenement_apartment') {
        if (this.character.money >= annualRentCost) {
          this.character.money -= annualRentCost;
          this.character.consecutiveUnpaidRent = 0;
          currentYearLog.entries.push(`Paid annual apartment rent and living expenses: -${window.formatMoney(annualRentCost, this.character.countryCode)}.`);
        } else {
          const shortfall = annualRentCost - this.character.money;
          this.character.money = 0;
          if (window.addDebtConsequence) window.addDebtConsequence(this.character, shortfall, 'unpaid apartment rent');
          this.character.consecutiveUnpaidRent = (this.character.consecutiveUnpaidRent || 0) + 1;
          
          if (this.character.consecutiveUnpaidRent === 1) {
            this.modifyStat('happiness', -8);
            this.modifyStat('sanity', -5);
            this.modifyStat('vitality', -3);
            currentYearLog.entries.push(`[EVICTION WARNING] Fell short on rent. Your landlord posted a 12-month eviction notice and threatened legal bailiffs.`);
          } else {
            // Consecutive default -> EVICTED TO THE STREETS
            this.character.housing = 'homeless';
            this.character.consecutiveUnpaidRent = 0;
            this.modifyStat('happiness', -15);
            this.modifyStat('sanity', -10);
            this.modifyStat('vitality', -8);
            currentYearLog.entries.push(`[EVICTION EXECUTED] Unable to pay arrears, bailiffs padlocked your apartment and dumped your belongings into the rainy streets of ${this.character.city}. You are now homeless.`);
            if (window.observeHorror) window.observeHorror(this.character, { source: 'housing', text: 'Evicted into the streets', classification: 'urban_misery', intensity: 2, engaged: false });
          }
        }
      } else if (this.character.housing === 'squalor_room') {
        const squalorRent = Math.floor(annualRentCost * 0.3);
        if (this.character.money >= squalorRent) {
          this.character.money -= squalorRent;
          this.character.consecutiveUnpaidRent = 0;
          this.modifyStat('vitality', -2);
          this.modifyStat('sanity', -2);
          currentYearLog.entries.push(`Paid rent for a damp boarding room: -${window.formatMoney(squalorRent, this.character.countryCode)}. Cockroaches and drafts haunt the floorboards (-2% Vitality, -2% Sanity).`);
          
          // Automatic upgrade if wealthy enough
          if (this.character.money >= annualRentCost + 4000) {
            this.character.housing = 'tenement_apartment';
            this.modifyStat('happiness', 10);
            currentYearLog.entries.push(`[HOUSING UPGRADE] With steady savings accumulated, you moved out of the squalid flophouse and signed an apartment lease in ${this.character.city}.`);
          }
        } else {
          this.character.housing = 'homeless';
          this.character.money = 0;
          this.modifyStat('happiness', -10);
          this.modifyStat('vitality', -5);
          currentYearLog.entries.push(`[EVICTION] The boarding house landlord threw you out into the street for failing to pay the weekly cubicle charge.`);
        }
      } else if (this.character.housing === 'homeless') {
        // Scavenging sustenance costs
        const scavengeCost = Math.min(this.character.money, Math.floor(annualRentCost * 0.05));
        this.character.money -= scavengeCost;
        
        // Automatic escape if player saved enough
        if (this.character.money >= annualRentCost + 2000) {
          this.character.housing = 'tenement_apartment';
          this.modifyStat('happiness', 15);
          this.modifyStat('sanity', 10);
          currentYearLog.entries.push(`[SHELTER SECURED] You accumulated enough cash to sign a proper apartment lease and leave the brutal streets behind.`);
        } else if (this.character.money >= Math.floor(annualRentCost * 0.3) + 500) {
          this.character.housing = 'squalor_room';
          this.modifyStat('happiness', 8);
          currentYearLog.entries.push(`[SHELTER FOUND] Scraped together enough to secure a dry cubicle in a flophouse, escaping the winter elements.`);
        } else {
          // Severe street attrition
          this.modifyStat('vitality', -5);
          this.modifyStat('sanity', -5);
          this.modifyStat('happiness', -8);
          this.modifyStat('looks', -3);
          const streetHardships = [
            `Sleeping rough over subway vents in ${this.character.city}; freezing rain soaked through your second-hand overcoat (-5% Vitality, -5% Sanity).`,
            `Chased from station doorways by municipal transit officers; winter frost bit deeply into your fingers (-5% Vitality, -8% Happiness).`,
            `Survived on shelter soup and discarded bakery crusts; relentless cold chipped away at your dignity (-5% Vitality, -3% Looks).`
          ];
          currentYearLog.entries.push(`[HOMELESS ATTRITION] ${window.getRandomElement(streetHardships)}`);
          
          // Chance of contracting disease from the street
          if (Math.random() < 0.35 && window.contractAilment) {
            const ailmentChoice = Math.random() < 0.5 ? 'ailment_consumption' : 'ailment_damp_rot';
            const contracted = window.contractAilment(this.character, ailmentChoice, 'Exposure to freezing dampness and unsanitary alleyways', 'Homelessness');
            if (contracted) {
              currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Exposure to winter squalor resulted in ${contracted.label}!`);
            }
          }
        }
      }
    } else {
      // Minor allowance / home dynamic
      let homeDyn = null;
      if (this.character.age < 18 && window.getFamilyHomeDynamic) {
        homeDyn = window.getFamilyHomeDynamic(this.character);
      }
      if (homeDyn) {
        currentYearLog.entries.push(homeDyn);
      } else {
        const homeDynamics = [
          "Family household groceries were paid for by your parents; the refrigerator remained stocked with basic staples.",
          "Helped with chores around the house in exchange for dinner and a warm bed.",
          "Listened to parental discussions about the rising cost of municipal electricity and heating oil."
        ];
        currentYearLog.entries.push(window.getRandomElement(homeDynamics));
      }
    }

    // 4. Kin Dynamics, Allowances & Family Mortality
    if (kinLogs.length > 0) {
      kinLogs.forEach(kl => currentYearLog.entries.push(kl));
    } else {
      let atmoVignette = null;
      if (this.character.age < 18 && window.getFamilyKinVignette) {
        atmoVignette = window.getFamilyKinVignette(this.character);
      }
      if (atmoVignette) {
        currentYearLog.entries.push(atmoVignette);
      } else {
        const kinVignettes = [
          "Your family shared quiet evening meals beneath the yellow kitchen light.",
          "Your acquaintances and friends went about their normal routines across the district.",
          "A peaceful, uneventful year passed within your immediate family circle."
        ];
        currentYearLog.entries.push(window.getRandomElement(kinVignettes));
      }
    }

    // 4a. Pets & Companions Simulation (Aging, upkeep, hunger, illness, eerie omens)
    if (window.tickPetsYear) {
      const petLogs = window.tickPetsYear(this.character) || [];
      petLogs.forEach(pl => currentYearLog.entries.push(pl));
    }

    // 4b. Paranormal Curses & Hex Progressions
    if (window.tickAnnualCurses) {
      const curseLogs = window.tickAnnualCurses(this.character) || [];
      curseLogs.forEach(cl => currentYearLog.entries.push(cl));
    }
    if (window.tickRitualContracts) {
      const contractLogs = window.tickRitualContracts(this.character) || [];
      contractLogs.forEach(entry => currentYearLog.entries.push(entry));
    }

    // 5. Urban Atmosphere & Ambient Lore
    const ambientPool = (window.AMBIENT_YEAR_EVENTS || (window.GAME_DATA && window.GAME_DATA.AMBIENT_YEAR_EVENTS) || []).filter(e =>
      this.character.age >= e.minAge && this.character.age <= e.maxAge
    );
    const ambient = window.selectAnnualAmbient
      ? window.selectAnnualAmbient(this.character, ambientPool)
      : (ambientPool.length ? ambientPool[Math.floor(Math.random() * ambientPool.length)] : null);
    if (ambient) {
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
      const strainEvent = window.getRandomElement(modernWhispers);
      currentYearLog.entries.push(strainEvent);
      if (window.observeHorror) window.observeHorror(this.character, { source: 'sanity', text: strainEvent, classification: 'mental_strain', intensity: 1, engaged: false });
      this.modifyStat('sanity', -3);
    } else {
      const sensoryEvents = [
        "A late-night storm knocked out municipal transformers; the neighborhood spent an hour by candlelight.",
        "A delivery van blocked the road while several impatient drivers leaned on their horns.",
        "Rain tapped against the windows until the gutters finally overflowed.",
        "Someone left an old cassette tape on a subway bench, and a cleaner swept it into lost property."
      ];
      currentYearLog.entries.push(window.getRandomElement(sensoryEvents));
    }

    // Atmospheric Sickness & Affliction Contraction Checks
    if (window.contractAilment) {
      // Squalor room risks
      if (this.character.housing === 'squalor_room' && Math.random() < 0.18) {
        const ailment = Math.random() < 0.5 ? 'ailment_lead_poisoning' : 'ailment_consumption';
        const res = window.contractAilment(this.character, ailment, 'Toxic flophouse plumbing and moldy ventilation', 'Squalid Living Conditions');
        if (res) currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Unsanitary lodging caused ${res.label}!`);
      }
      // Low sanity breakdown -> Melancholia or Insomnia
      if (this.character.stats.sanity < 25 && Math.random() < 0.25) {
        const ailment = Math.random() < 0.5 ? 'ailment_melancholia' : 'ailment_insomnia';
        const res = window.contractAilment(this.character, ailment, 'Prolonged psychological unraveling and terror', 'Severe Mental Strain');
        if (res) currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Severe mental strain developed into ${res.label}!`);
      }
      // High occult strain -> Spectral Fever
      if (this.character.stats.occult >= 50 && this.character.stats.sanity < 40 && Math.random() < 0.22) {
        const res = window.contractAilment(this.character, 'ailment_spectral_fever', 'Deep paranormal exposure without protective wards', 'Spectral Contagion');
        if (res) currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Thinning of the veil infected you with ${res.label}!`);
      }
      // Low vitality collapse -> Consumption
      if (this.character.stats.vitality < 25 && Math.random() < 0.25) {
        const res = window.contractAilment(this.character, 'ailment_consumption', 'Compromised bodily constitution and lung inflammation', 'Physical Depletion');
        if (res) currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Exhaustion led to ${res.label}!`);
      }
      // Senior age wear (65+)
      if (this.character.age >= 65 && Math.random() < 0.15) {
        const seniorAilment = Math.random() < 0.5 ? 'ailment_consumption' : 'ailment_insomnia';
        const res = window.contractAilment(this.character, seniorAilment, 'Age-related bodily decline', 'Senescent Frailty');
        if (res) currentYearLog.entries.push(`[AFFLICTION CONTRACTED] Frailty of old age manifested as ${res.label}.`);
      }
    }

    // ==========================================
    // AGING ATTRITION CURVE & BIOLOGICAL WEAR
    // ==========================================
    const currentAge = this.character.age;
    if (currentAge <= 17) {
      if (Math.random() < 0.15) this.modifyStat('vitality', 1);
    } else if (currentAge <= 35) {
      if (Math.random() < 0.25) this.modifyStat('vitality', -1);
      if (Math.random() < 0.15) this.modifyStat('looks', -1);
    } else if (currentAge <= 50) {
      // Middle age (36-50): First steady biological erosion
      this.modifyStat('vitality', -1);
      if (Math.random() < 0.40) this.modifyStat('looks', -1);
      if (Math.random() < 0.20) this.modifyStat('sanity', -1);
    } else if (currentAge <= 64) {
      // Advanced Middle Age (51-64): Accelerated wear
      this.modifyStat('vitality', -2);
      this.modifyStat('looks', -1);
      if (Math.random() < 0.35) this.modifyStat('sanity', -1);
    } else if (currentAge <= 75) {
      // Senior Decline (65-75): Heavy biological decline
      const vitLoss = Math.floor(Math.random() * 2) + 2; // -2 to -3
      this.modifyStat('vitality', -vitLoss);
      this.modifyStat('looks', -2);
      if (Math.random() < 0.45) this.modifyStat('sanity', -2);
      currentYearLog.entries.push(`[SENIOR ATTRITION] The burden of passing years stiffens your limbs and clouds your vision (-${vitLoss}% Vitality, -2% Looks).`);
    } else {
      // Deep Elder Decline (76+): Steep decline; every year is a struggle
      const elderLoss = Math.floor(Math.random() * 3) + 3; // -3 to -5
      this.modifyStat('vitality', -elderLoss);
      this.modifyStat('looks', -2);
      this.modifyStat('sanity', -2);
      currentYearLog.entries.push(`[DEEP WINTER OF LIFE] Bodily stamina fades rapidly into the twilight of existence (-${elderLoss}% Vitality, -2% Sanity).`);
    }

    // Unfinished choices return before unrelated yearly dilemmas.
    const dueStory = window.popDueStory ? window.popDueStory(this.character) : null;
    if (dueStory) {
      currentYearLog.entries.push(`[OLD CHOICE RETURNS] ${dueStory.prompt.split('\n')[0]}`);
      this.logs.push(currentYearLog);
      this.renderAll();
      this.triggerDilemma(dueStory);
      this.saveGame();
      return;
    }

    // 7. Interactive Dilemma or Ambient Encounter
    const dilemmaPool = window.INTERACTIVE_DILEMMAS || (window.GAME_DATA && window.GAME_DATA.INTERACTIVE_DILEMMAS) || [];
    const availableDilemmas = dilemmaPool.filter(d => 
      this.character.age >= d.minAge && 
      this.character.age <= d.maxAge && 
      !this.usedDilemmaIds.has(d.id) &&
      (!d.condition || d.condition(this.character))
    );

    const milestoneAges = [1, 2, 3, 4, 5, 7, 9, 11, 14, 16, 18];
    const isMilestone = milestoneAges.includes(this.character.age);
    const triggerChance = isMilestone ? 1.0 : 0.85;

    if (availableDilemmas.length > 0 && Math.random() < triggerChance) {
      const chosen = window.chooseDirectedDilemma
        ? window.chooseDirectedDilemma(this.character, availableDilemmas, window.chooseWeightedDilemma)
        : (window.chooseWeightedDilemma ? window.chooseWeightedDilemma(this.character, availableDilemmas) : availableDilemmas[Math.floor(Math.random() * availableDilemmas.length)]);
      if (!chosen) {
        currentYearLog.entries.push("Ordinary obligations filled the year, leaving little room for anything stranger.");
      } else {
        this.usedDilemmaIds.add(chosen.id);
        this.activeDilemma = chosen;
        if (window.notePresentedDilemma) window.notePresentedDilemma(this.character, chosen);

        this.logs.push(currentYearLog);
        this.renderAll();
        this.triggerDilemma(chosen);
        this.saveGame();
        return;
      }
    } else {
      currentYearLog.entries.push("News and neighborhood gossip passed without drawing you into anything consequential.");
    }

    this.logs.push(currentYearLog);
    this.checkMortality();
    this.renderAll();
    this.saveGame();
    this.checkPendingSchoolChoice();
  }

  triggerDilemma(dilemma) {
    this.activeDilemma = dilemma;
    window.soundEngine.playDread();
    this.vibrate([50, 40, 80]);

    this.dom.dilemmaTitle.textContent = dilemma.title;
    this.dom.dilemmaPrompt.textContent = dilemma.prompt;
    this.dom.dilemmaChoices.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    const charOccult = (this.character.stats.occult || 0);
    const charSanity = (this.character.stats.sanity || 0);

    let displayIndex = 0;
    dilemma.choices.forEach((choice, idx) => {
      // Occult / The Veil Thinning choices
      if (choice.isOccult) {
        const minOccult = choice.minOccult || 20;
        const maxSanity = choice.maxSanity || 45;
        const qualifies = charOccult >= minOccult || charSanity <= maxSanity;
        if (!qualifies) {
          // The veil remains closed for mundane characters
          return;
        }
      }

      const isOccult = !!choice.isOccult;
      const btn = document.createElement('button');
      if (isOccult) {
        btn.className = "choice-occult w-full text-left p-3.5 rounded-xl border active:scale-[0.98] text-xs transition-all flex items-start space-x-3 shadow-md group";
      } else {
        btn.className = "w-full text-left p-3.5 rounded-xl bg-inputbg hover:bg-cardhover active:scale-[0.98] border border-leadborder text-parchment text-xs transition-all flex items-start space-x-3 shadow-xs group";
      }
      
      const badge = document.createElement('span');
      if (isOccult) {
        badge.className = "px-2.5 py-1 rounded-md text-xs bg-purple-900/60 border border-purple-500/70 text-purple-200 font-mono font-bold shrink-0 shadow-sm";
        badge.innerHTML = "👁️";
      } else {
        badge.className = "px-2.5 py-1 rounded-md text-xs bg-amber-950/40 border border-amber-800/60 text-amber-300 font-mono font-bold shrink-0 group-hover:bg-amber-900/60 transition-colors";
        badge.textContent = `${letters[displayIndex] || (displayIndex + 1)}`;
      }

      const textSpan = document.createElement('span');
      textSpan.className = isOccult 
        ? "leading-relaxed text-purple-100 font-medium pt-0.5" 
        : "leading-relaxed text-parchment pt-0.5";
      textSpan.textContent = choice.text;

      btn.appendChild(badge);
      btn.appendChild(textSpan);

      btn.addEventListener('click', () => this.selectChoice(idx));
      this.dom.dilemmaChoices.appendChild(btn);
      displayIndex++;
    });

    this.dom.dilemmaModal.classList.remove('modal-closing', 'hidden');
    this.dom.dilemmaModal.style.display = 'flex';
    this.dom.dilemmaBackdrop.classList.remove('hidden');
    this.dom.dilemmaBackdrop.style.display = 'block';
  }

  selectChoice(choiceIdx) {
    if (!this.activeDilemma) return;

    window.soundEngine.playClick();
    this.vibrate(30);

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
          if (this.character.money + delta < 0 && window.addDebtConsequence) {
            window.addDebtConsequence(this.character, Math.abs(this.character.money + delta), dilemma.title);
          }
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
    if (window.recordOutcomeConsequences) window.recordOutcomeConsequences(this.character, title, outcome, effects);
    if (window.processLifeOutcome) window.processLifeOutcome(this.character, { domain: dilemma.domain, result: { title, body: outcome, effects } });
    if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: 'dilemma_choice', title, outcome, effects, engaged: true });
    if (window.recordEntityEncounter) window.recordEntityEncounter(this.character, { source: 'dilemma_choice', title, outcome, effects, action: choice.text });
    if (window.resolveStoryChoice && dilemma.storyIncidentId) window.resolveStoryChoice(this.character, dilemma, choice);

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
    this.dom.careersModal.classList.remove('modal-closing', 'hidden');
    this.dom.careersModal.style.display = 'flex';
    this.renderCareersList();
  }

  closeCareersModal() {
    if (!this.dom.careersModal) return;
    this.animateCloseModal(this.dom.careersModal);
  }

  renderCareersList() {
    const activeClass = "py-2 rounded-lg bg-slatecard text-parchment font-serif font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs";
    const inactiveClass = "py-2 rounded-lg text-dust hover:text-parchment font-serif font-bold transition-all text-center flex items-center justify-center gap-1";

    if (this.dom.tabCareerMundane) this.dom.tabCareerMundane.className = this.activeCareerTab === 'mundane' ? activeClass : inactiveClass;
    if (this.dom.tabCareerParttime) this.dom.tabCareerParttime.className = this.activeCareerTab === 'parttime' ? activeClass : inactiveClass;
    if (this.dom.tabCareerParanormal) this.dom.tabCareerParanormal.className = this.activeCareerTab === 'paranormal' ? activeClass : inactiveClass;

    // Update current employment banner
    const activeDayJob = this.character.job || this.character.partTimeJob;
    if (activeDayJob) {
      const sal = window.TLLSubsystems
        ? window.TLLSubsystems.getActiveMundaneAnnualPay(this.character)
        : window.getAdjustedSalary(activeDayJob.baseSalary || activeDayJob.baseSalaryUSD || 10000, this.character.countryCode);
      this.dom.currentMundaneJob.textContent = `${activeDayJob.title} (${window.formatMoney(sal, this.character.countryCode)}/yr)`;
      this.dom.btnQuitMundane.classList.remove('hidden');
      this.dom.btnQuitMundane.style.display = 'inline-block';
    } else {
      this.dom.currentMundaneJob.textContent = this.character.age < 14 ? "Unemployed (Part-Time unlocks Age 14)" : "Unemployed (No Income)";
      this.dom.btnQuitMundane.classList.add('hidden');
      this.dom.btnQuitMundane.style.display = 'none';
    }

    this.dom.careersList.innerHTML = '';

    // Mount active Workplace Submenu Dashboard at the top of the list
    if (window.TLLSubsystems) {
      const wpHtml = (this.activeCareerTab === 'paranormal')
        ? window.TLLSubsystems.renderOccultWorkplaceHTML(this.character, this._selectedColleagueId)
        : window.TLLSubsystems.renderMundaneWorkplaceHTML(this.character, this._selectedColleagueId);
      if (wpHtml) {
        const wpWrap = document.createElement('div');
        wpWrap.innerHTML = wpHtml;
        this.dom.careersList.appendChild(wpWrap);
        window.TLLSubsystems.bindSubsystemEvents(wpWrap, this, () => this.renderCareersList());
      }
    }

    if (this.activeCareerTab === 'mundane' || this.activeCareerTab === 'parttime') {
      const pool = this.activeCareerTab === 'parttime' ? (window.PART_TIME_JOBS || []) : (window.MUNDANE_CAREERS || []);
      pool.forEach(job => {
        const isEmployed = (this.character.job && this.character.job.id === job.id) || (this.character.partTimeJob && this.character.partTimeJob.id === job.id);
        const check = window.checkJobEligibility(this.character, job);
        const salary = window.getAdjustedSalary(job.baseSalary, this.character.countryCode);

        const card = document.createElement('div');
        card.className = `career-item p-3.5 rounded-xl border transition-all ${
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
              <span class="text-[11px] font-mono text-fiat font-bold">${window.formatMoney(salary, this.character.countryCode)} / year${job.isPartTime ? ` · ~${job.defaultHours}h/wk` : ''}</span>
            </div>
            <div class="flex flex-wrap justify-end gap-1 shrink-0">
              ${badgesHtml}
            </div>
          </div>
          <p class="text-[11px] text-dust leading-relaxed">${job.desc}</p>
          <div class="flex items-center justify-between pt-2 border-t border-leadborder/60 text-[10px]">
            <span class="text-dust/80 font-mono italic">${job.isPartTime ? 'Part-Time Shift (Age 14+)' : (job.stress > 25 ? 'High Stress' : 'Full-Time Career')}</span>
            ${isEmployed 
              ? `<span class="text-fiat font-serif font-bold text-xs">✓ Active Position (See Workplace Above)</span>`
              : `<button class="btn-apply-job px-3 py-1.5 rounded-lg text-xs font-serif font-bold active:scale-95 transition-all ${
                  check.eligible ? 'btn-apply-active shadow-xs' : 'btn-apply-locked cursor-not-allowed'
                }" ${!check.eligible ? 'disabled' : ''}>
                  ${check.eligible ? (job.isPartTime ? 'Take Shift' : 'Apply') : check.reason}
                </button>`
            }
          </div>
        `;

        const applyBtn = card.querySelector('.btn-apply-job');
        if (applyBtn && check.eligible) {
          applyBtn.addEventListener('click', () => {
            if (job.isPartTime) {
              this.character.partTimeJob = job;
              this.character.job = null;
              if (window.TLLSubsystems) window.TLLSubsystems.ensureMundaneWorkplace(this.character);
              window.soundEngine.playClick();
              const latestLog = this.logs[this.logs.length - 1];
              if (latestLog) latestLog.entries.push(`Started part-time shifts as ${job.title} (${window.formatMoney(salary, this.character.countryCode)}/yr).`);
              this.renderCareersList();
              this.renderAll();
              this.saveGame();
            } else {
              this.character.partTimeJob = null;
              this.applyMundaneJob(job);
            }
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
        card.className = `career-item p-3.5 rounded-xl border transition-all ${
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
    if (window.ensureWorkplace) window.ensureWorkplace(this.character);
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
    const active = this.character.job || this.character.partTimeJob;
    if (!active) return;
    const oldTitle = active.title;
    this.character.job = null;
    this.character.partTimeJob = null;
    this.character.workplace = null;
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
    if (window.TLLSubsystems) window.TLLSubsystems.ensureOccultWorkplace(this.character);
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
    this.character.occultWorkplace = null;
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
    this.closeOtherPrimaryModals(this.dom.kinModal);
    this.updateFamilyResidenceUI();
    this.setPrimaryNav('people');
    this.dom.kinModal.classList.remove('modal-closing', 'hidden');
    this.dom.kinModal.style.display = 'flex';
    this.renderKinList(this.activeKinFilter);
  }

  updateFamilyResidenceUI() {
    const kin = this.character.kin;
    if (!kin) return;
    const res = kin.residence;
    const atmosBadge = document.getElementById('family-atmosphere-badge');
    const atmosDesc = document.getElementById('family-atmosphere-desc');
    const wealthBadge = document.getElementById('family-wealth-badge');
    const resName = document.getElementById('residence-name');
    const resDesc = document.getElementById('residence-desc');
    const famIncome = document.getElementById('family-income-val');
    
    if (kin.atmosphere) {
      if (atmosBadge) atmosBadge.textContent = `${kin.atmosphere.emoji} ${kin.atmosphere.name}`;
      if (atmosDesc) atmosDesc.textContent = kin.atmosphere.desc || '';
    }
    if (wealthBadge && kin.wealthTier) {
      wealthBadge.textContent = kin.wealthTier.replace('_', ' ').toUpperCase();
    }
    if (res && resName) {
      resName.textContent = res.name || 'Family Home';
    }
    if (res && resDesc) {
      resDesc.textContent = res.desc || '';
    }
    if (famIncome && kin.householdIncomeUSD !== undefined) {
      famIncome.textContent = `~$${kin.householdIncomeUSD.toLocaleString()} / yr`;
    }
  }

  closeKinModal() {
    if (!this.dom.kinModal) return;
    this.animateCloseModal(this.dom.kinModal, () => {
      this.setPrimaryNav('life');
    });
  }

  filterKin(filter) {
    this.activeKinFilter = filter;
    const residenceBanner = document.getElementById('family-residence-banner');
    if (residenceBanner) residenceBanner.classList.toggle('hidden', !['all', 'family'].includes(filter));
    this.dom.kinFilterBtns.forEach(btn => {
      const isSelected = btn.dataset.filter === filter;
      btn.className = `kin-filter-btn profile-filter-pill${isSelected ? ' is-active' : ''}`;
    });
    this.renderKinList(filter);
  }

  getAllKinList() {
    if (!this.character || !this.character.kin) return [];
    const { parents = [], siblings = [], grandparents = [], friends = [], lovers = [], children = [] } = this.character.kin;
    parents.forEach(p => { if (!p.category) p.category = 'family'; });
    siblings.forEach(s => { if (!s.category) s.category = 'family'; });
    grandparents.forEach(g => { if (!g.category) g.category = 'family'; });
    friends.forEach(f => { if (!f.category) f.category = 'friend'; });
    lovers.forEach(l => { if (!l.category) l.category = 'lover'; });
    children.forEach(c => { if (!c.category) c.category = 'family'; });
    return [
      ...parents,
      ...siblings,
      ...grandparents,
      ...lovers,
      ...children,
      ...friends
    ];
  }

  renderKinList(filter = 'all') {
    this.dom.kinList.innerHTML = '';
    if (filter === 'pets') {
      this.renderPetsList();
      return;
    }
    if (filter === 'connect') {
      this.renderPeopleActions();
      return;
    }
    if (filter === 'circles') {
      this.renderPeopleCircles();
      return;
    }
    const all = this.getAllKinList();
    const filtered = all.filter(p => {
      if (filter === 'family') return p.category === 'family';
      if (filter === 'friends') return p.category === 'friend';
      if (filter === 'lovers') return p.category === 'lover';
      return true;
    });

    if (filtered.length === 0) {
      if (filter === 'lovers') {
        this.dom.kinList.innerHTML = `
          <div class="text-center py-8 px-4 space-y-2.5 bg-inputbg/60 border border-leadborder/70 rounded-2xl">
            <div class="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-xs">
              <i data-lucide="heart-off" class="w-5 h-5"></i>
            </div>
            <div class="font-serif font-bold text-sm text-parchment">No Romantic Partner</div>
            <p class="text-dust text-xs leading-relaxed max-w-xs mx-auto">
              You are currently unattached. Seek courtship through blind dates in Activities, spontaneous encounters, or by confessing feelings to a close friend.
            </p>
          </div>
        `;
        if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
        return;
      }
      this.dom.kinList.innerHTML = `
        <div class="text-center py-8 text-dust/70 text-xs italic font-serif">
          No acquaintances recorded under this circle.
        </div>
      `;
      return;
    }

    const getGroupLabel = (person) => {
      if (person.category === 'lover') return 'Romantic Bonds';
      if (person.category === 'friend') return 'Companions & Friends';
      const role = String(person.role || '');
      if (role.includes('Mother') || role.includes('Father') || role.includes('Parent')) return 'Parents & Guardians';
      if (role.includes('Brother') || role.includes('Sister') || role.includes('Sibling')) return 'Siblings';
      if (role.includes('Son') || role.includes('Daughter') || role.includes('Child')) return 'Children';
      if (role.includes('Grand')) return 'Grandparents & Elders';
      return 'Family & Kin';
    };

    const showGroups = filter === 'all' || filter === 'family';
    const groupCounts = {};
    if (showGroups) {
      filtered.forEach(p => {
        const g = getGroupLabel(p);
        groupCounts[g] = (groupCounts[g] || 0) + 1;
      });
    }
    let lastGroup = null;

    filtered.forEach(person => {
      if (showGroups) {
        const currentGroup = getGroupLabel(person);
        if (currentGroup !== lastGroup) {
          lastGroup = currentGroup;
          const groupHeader = document.createElement('div');
          groupHeader.className = 'kin-group-header';
          groupHeader.innerHTML = `
            <span class="text-[9px] font-mono uppercase tracking-[0.18em] text-dust font-bold">${currentGroup}</span>
            <span class="text-[9px] font-mono text-dust/70">${groupCounts[currentGroup] || 1}</span>
          `;
          this.dom.kinList.appendChild(groupHeader);
        }
      }

      const card = document.createElement('div');
      const isAlive = person.alive;
      const rel = Math.max(0, Math.min(100, Math.round(person.relationship || 0)));

      card.className = `kin-card p-2.5 rounded-xl border transition-all ${
        isAlive 
          ? 'bg-inputbg hover:bg-cardhover border-leadborder cursor-pointer shadow-xs active:scale-[0.99]' 
          : 'bg-inputbg/40 border-leadborder/40 opacity-55 cursor-default'
      }`;

      const relColor = rel > 75 ? 'bg-emerald-500' : (rel > 40 ? 'bg-amber-500' : 'bg-red-500');

      let statusBadge = '';
      if (!isAlive) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">Deceased</span>`;
      } else if (person.missing) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/35">Missing</span>`;
      } else if (person.entityCondition) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/35">${person.entityCondition.type}</span>`;
      } else if (person.isRevealed && person.entityType !== 'human') {
        const entityLabel = person.entityType === 'disguised_mimic' ? 'Disguised Mimic' : (person.entityType === 'blatant_entity' ? 'Abyssal Entity' : 'Anomaly');
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/35 animate-pulse">${entityLabel}</span>`;
      } else if (person.category === 'lover') {
        if (person.married) {
          statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">Spouse</span>`;
        } else if (person.engaged) {
          statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30">Fiancé</span>`;
        } else if (person.cohabitating) {
          statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">Cohabitating</span>`;
        } else if (person.role.includes('Ex')) {
          statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slatecard text-dust border border-leadborder">Former</span>`;
        } else {
          statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">Partner</span>`;
        }
      } else if (person.suspicion > 30) {
        statusBadge = `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">Suspicion ${person.suspicion}%</span>`;
      }

      const subtitleParts = [
        person.role,
        `Age ${person.age}`,
        person.dynamicTrait ? `<span class="text-shilling font-semibold">${person.dynamicTrait}</span>` : (person.occupation || '')
      ].filter(Boolean);

      card.innerHTML = `
        <div class="flex items-center justify-between gap-2.5">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-10 h-10 rounded-xl border border-leadborder overflow-hidden bg-slatecard shrink-0 shadow-xs">
              <canvas class="kin-thumb-canvas w-full h-full" width="80" height="80"></canvas>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <h4 class="font-serif font-bold text-xs text-parchment truncate">${person.name}</h4>
                ${statusBadge}
              </div>
              <p class="text-[10px] text-dust font-mono truncate mt-0.5">${subtitleParts.join(' · ')}</p>
            </div>
          </div>
          <div class="shrink-0 flex items-center gap-2">
            ${isAlive ? `<span class="text-[10px] font-mono font-bold text-parchment">${rel}%</span><i data-lucide="chevron-right" class="w-3.5 h-3.5 text-dust/60"></i>` : ''}
          </div>
        </div>

        ${isAlive ? `
          <div class="mt-2 w-full h-1 bg-trackbg rounded-full overflow-hidden">
            <div class="h-full ${relColor} transition-all duration-300 rounded-full" style="width: ${rel}%"></div>
          </div>
        ` : `
          <p class="text-[10px] italic text-dust/80 mt-1.5 pt-1 border-t border-leadborder/40">${person.deathCause || 'Passed away.'}</p>
        `}
      `;

      const thumbCanvas = card.querySelector('.kin-thumb-canvas');
      if (thumbCanvas) {
        if (!person.avatar) {
          person.avatar = window.generateRandomAvatar({ gender: person.gender, age: person.age });
        }
        window.drawGothicAvatar(thumbCanvas, { ...person.avatar, age: person.age });
      }

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

  renderPeopleActions() {
    this.dom.kinList.innerHTML = `
      <button data-people-category="relationships" class="w-full min-h-[76px] p-4 rounded-2xl bg-inputbg hover:bg-cardhover border border-leadborder text-left flex items-center gap-3 transition-all active:scale-[0.99]">
        <span class="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0"><i data-lucide="heart" class="w-5 h-5"></i></span>
        <span><strong class="block font-serif text-sm text-parchment">Romance & Dating</strong><small class="block mt-1 text-xs text-dust">Courtship, dates and changing relationships</small></span>
      </button>
      <button data-people-category="social" class="w-full min-h-[76px] p-4 rounded-2xl bg-inputbg hover:bg-cardhover border border-leadborder text-left flex items-center gap-3 transition-all active:scale-[0.99]">
        <span class="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0"><i data-lucide="message-circle" class="w-5 h-5"></i></span>
        <span><strong class="block font-serif text-sm text-parchment">Social Life</strong><small class="block mt-1 text-xs text-dust">Meet companions, gather and trade gossip</small></span>
      </button>`;
    this.dom.kinList.querySelectorAll('[data-people-category]').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.peopleCategory;
        this.closeKinModal();
        this.openActivitiesModal();
        this.openActivityCategory(category);
      });
    });
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  renderPeopleCircles() {
    const enrolled = this.character.education && this.character.education.enrolled;
    const schoolStatus = this.character.education && this.character.education.graduationStatus;
    const schoolTerminated = schoolStatus === 'expelled' || schoolStatus === 'dropped_out';
    this.dom.kinList.innerHTML = `
      ${schoolTerminated ? '' : `<button data-people-circle="education" class="w-full min-h-[76px] p-4 rounded-2xl bg-inputbg hover:bg-cardhover border border-leadborder text-left flex items-center gap-3 transition-all active:scale-[0.99]">
        <span class="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 text-edu-sky flex items-center justify-center shrink-0"><i data-lucide="graduation-cap" class="w-5 h-5"></i></span>
        <span><strong class="block font-serif text-sm text-parchment">${enrolled ? 'School Community' : 'Education'}</strong><small class="block mt-1 text-xs text-dust">Classmates, teachers and school staff</small></span>
      </button>`}
      <button data-people-circle="careers" class="w-full min-h-[76px] p-4 rounded-2xl bg-inputbg hover:bg-cardhover border border-leadborder text-left flex items-center gap-3 transition-all active:scale-[0.99]">
        <span class="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0"><i data-lucide="briefcase" class="w-5 h-5"></i></span>
        <span><strong class="block font-serif text-sm text-parchment">Work Community</strong><small class="block mt-1 text-xs text-dust">Jobs, colleagues and professional life</small></span>
      </button>`;
    const educationCircle = this.dom.kinList.querySelector('[data-people-circle="education"]');
    if (educationCircle) educationCircle.addEventListener('click', () => { this.closeKinModal(); this.openEducationModal(); });
    this.dom.kinList.querySelector('[data-people-circle="careers"]').addEventListener('click', () => {
      this.closeKinModal();
      this.openCareersModal();
    });
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  openKinDetailModal(person) {
    const livePerson = this.getAllKinList().find(p => p.id === person.id) || person;
    this.selectedKin = livePerson;
    this.dom.kinDetailModal.classList.remove('modal-closing', 'hidden');
    this.dom.kinDetailModal.style.display = 'flex';
    this.renderKinDetail(livePerson);
  }

  closeKinDetailModal() {
    if (!this.dom.kinDetailModal) return;
    this.animateCloseModal(this.dom.kinDetailModal, () => {
      this.renderKinList(this.activeKinFilter);
    });
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

    let curseInfo = '';
    if (person.curse) {
      curseInfo = `
        <div class="mt-2 p-2 rounded-lg border flex items-center justify-between text-[11px] font-mono badge-curse-${person.curse.type || 'haunted'} shadow-xs">
          <span class="font-bold flex items-center gap-1.5">
            <i data-lucide="skull" class="w-3.5 h-3.5"></i>
            <span>Afflicted: ${person.curse.name || 'Paranormal Hex'}</span>
          </span>
          <span class="text-[9px] opacity-85 font-mono">Inflicted Age ${person.curse.inflictedYear || '?'}</span>
        </div>
      `;
    }

    this.dom.kinDetailDossier.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-12 h-12 rounded-xl border border-leadborder overflow-hidden bg-slatecard shadow-sm shrink-0">
            <canvas id="kin-detail-avatar-canvas" width="120" height="120" class="w-full h-full"></canvas>
          </div>
          <div class="min-w-0">
            <h4 class="font-serif font-bold text-sm text-parchment truncate">${person.name}</h4>
            <p class="text-[10px] text-dust font-mono truncate">${person.role} · Age ${person.age}${person.dynamicTrait ? ` · <span class="text-shilling font-semibold">${person.dynamicTrait}</span>` : ''}</p>
            ${person.occupation ? `<p class="text-[10px] text-dust/85 font-mono truncate">${person.occupation}${person.salaryUSD ? ` <span class="text-fiat font-bold">($${person.salaryUSD.toLocaleString()}/yr)</span>` : ''}</p>` : ''}
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="block text-[8px] font-mono uppercase tracking-wider text-dust">Bond</span>
          <strong class="font-mono text-sm text-parchment">${person.relationship}%</strong>
        </div>
      </div>

      <div class="w-full h-1.5 bg-trackbg rounded-full overflow-hidden">
        <div class="h-full ${relColor} rounded-full transition-all duration-300" style="width: ${person.relationship}%"></div>
      </div>

      ${entityInfo}
      ${curseInfo}
      ${window.relationshipDossierHtml ? window.relationshipDossierHtml(person) : ''}
    `;

    const kinCanvas = this.dom.kinDetailDossier.querySelector('#kin-detail-avatar-canvas');
    if (kinCanvas) {
      if (!person.avatar) {
        person.avatar = window.generateRandomAvatar({ gender: person.gender, age: person.age });
      }
      window.drawGothicAvatar(kinCanvas, { ...person.avatar, age: person.age });
    }

    // Button states & quota/diminishing returns display
    const getCount = (key) => window.getActionCount ? window.getActionCount(person, key) : (person.actionsDone && person.actionsDone[key] ? (typeof person.actionsDone[key] === 'number' ? person.actionsDone[key] : 1) : 0);
    const noEnergy = false;
    const relationshipMind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { resentment: 0 };

    const setupBtn = (btn, count, maxQuota, normalLabel, doneLabel) => {
      if (!btn) return;
      const isCapped = count >= maxQuota;
      const desc = btn.querySelector('.text-\\[10px\\]');
      const title = btn.querySelector('.text-xs');

      if (title) {
        if (!title.dataset.baseTitle) {
          title.dataset.baseTitle = title.textContent.replace(/\s*\(\d+\/\d+\)$/, '').replace(/🔒\s*/, '').trim();
        }
        title.textContent = `${title.dataset.baseTitle} (${count}/${maxQuota})`;
      }

      if (isCapped) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-cardhover');
        if (desc) {
          desc.textContent = doneLabel;
        }
      } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-cardhover');
        if (desc) desc.textContent = normalLabel;
      }
    };

    const setupLockedBtn = (btn, baseTitle, lockMsg, unlockAge) => {
      if (!btn) return;
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      btn.classList.remove('hover:bg-cardhover');
      
      const title = btn.querySelector('.text-xs');
      const desc = btn.querySelector('.text-\\[10px\\]');
      if (title) {
        title.dataset.baseTitle = baseTitle;
        title.innerHTML = `<span class="flex items-center gap-1.5"><i data-lucide="lock" class="w-3.5 h-3.5 text-amber-400"></i> ${baseTitle} <span class="text-[9px] font-mono font-normal text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Unlocks Age ${unlockAge}</span></span>`;
      }
      if (desc) {
        desc.textContent = lockMsg;
      }
    };

    const age = this.character.age;
    const isInfantToddler = age <= 4;
    const isFamily = person.category === 'family';
    const isParent = person.role.includes('Father') || person.role.includes('Mother');
    const isSibling = person.role.includes('Brother') || person.role.includes('Sister') || person.role.includes('Sibling');
    const isGrand = person.role.includes('Grand');
    const isParentOrGrand = isParent || isGrand;
    const familyAtmosphere = (this.character.kin && this.character.kin.atmosphere) ? this.character.kin.atmosphere.id : null;

    // 1. Cuddle & Be Held (Ages 0 - 4, Family)
    if (this.dom.btnKinCuddle) {
      if (isInfantToddler && isFamily) {
        this.dom.btnKinCuddle.classList.remove('hidden');
        this.dom.btnKinCuddle.style.display = 'flex';
        setupBtn(this.dom.btnKinCuddle, getCount('cuddled'), 6, "Nuzzle into their warm embrace for comfort and security. (1 Action)", "Already cuddled plenty this year (6/6).");
      } else {
        this.dom.btnKinCuddle.classList.add('hidden');
        this.dom.btnKinCuddle.style.display = 'none';
      }
    }

    // 2. Babble & First Words (Ages 0 - 4, All)
    if (this.dom.btnKinBabble) {
      if (isInfantToddler) {
        this.dom.btnKinBabble.classList.remove('hidden');
        this.dom.btnKinBabble.style.display = 'flex';
        setupBtn(this.dom.btnKinBabble, getCount('babbled'), 6, "Point tiny fingers and babble playful sounds, practicing speech. (1 Action)", "Voice needs rest for this year (6/6).");
      } else {
        this.dom.btnKinBabble.classList.add('hidden');
        this.dom.btnKinBabble.style.display = 'none';
      }
    }

    // 3. Drink Warm Milk / Bottle (Ages 0 - 3, Parents/Grandparents)
    if (this.dom.btnKinFeed) {
      if (age <= 3 && isParentOrGrand) {
        this.dom.btnKinFeed.classList.remove('hidden');
        this.dom.btnKinFeed.style.display = 'flex';
        setupBtn(this.dom.btnKinFeed, getCount('fedMilk'), 6, "Be gently cradle-fed warm milk or formula. (1 Action)", "Tummy full of milk for this year (6/6).");
      } else {
        this.dom.btnKinFeed.classList.add('hidden');
        this.dom.btnKinFeed.style.display = 'none';
      }
    }

    // 4. Play Peek-a-Boo & Giggle (Ages 0 - 4, All)
    if (this.dom.btnKinPeekaboo) {
      if (isInfantToddler) {
        this.dom.btnKinPeekaboo.classList.remove('hidden');
        this.dom.btnKinPeekaboo.style.display = 'flex';
        setupBtn(this.dom.btnKinPeekaboo, getCount('peekaboo'), 6, "Giggle and clap as they hide behind hands or blankets. (1 Action)", "Giggled enough at peek-a-boo for this year (6/6).");
      } else {
        this.dom.btnKinPeekaboo.classList.add('hidden');
        this.dom.btnKinPeekaboo.style.display = 'none';
      }
    }

    // Spend Time Together (Universal)
    setupBtn(this.dom.btnKinSpendTime, getCount('spentTime'), 6, isInfantToddler ? "Bond through quiet moments together. (1 Action)" : "Bond through shared moments and build closeness. (1 Action)", "Already spent plenty of time together this year (6/6).");

    // Deep Conversation (Requires Age 4)
    if (age < 4) {
      setupLockedBtn(this.dom.btnKinConverse, "Deep Conversation", "Too young for complex philosophical dialogue. Babble or play peek-a-boo instead.", 4);
    } else {
      setupBtn(this.dom.btnKinConverse, getCount('talked'), 10, "Exchange thoughts, seek advice, or probe their worldview. (1 Action)", "Give them some space for now (10/10 talks reached).");
    }

    // Pay Compliment (Requires Age 4)
    if (age < 4) {
      setupLockedBtn(this.dom.btnKinCompliment, "Pay Compliment", "Too young to formulate articulate compliments (Unlocks at Age 4).", 4);
    } else {
      setupBtn(this.dom.btnKinCompliment, getCount('complimented'), 6, "Praise their character, appearance, or resilience. (1 Action)", "Flattered enough for this year (6/6 compliments).");
    }

    // Give Present / Gift (Requires Age 5)
    if (age < 5) {
      setupLockedBtn(this.dom.btnKinGift, "Give Present / Gift", "Too young to purchase or offer gifts (Unlocks at Age 5).", 5);
    } else {
      setupBtn(this.dom.btnKinGift, getCount('gifted'), 6, "Offer a thoughtful gift, treat, or dark relic. (1 Action)", "No more gifts needed for this year (6/6 given).");
    }

    // Ask money only for parents / grandparents (Requires Age 5)
    if (this.dom.btnKinAskMoney) {
      if (!isParentOrGrand) {
        this.dom.btnKinAskMoney.classList.add('hidden');
        this.dom.btnKinAskMoney.style.display = 'none';
      } else if (age < 5) {
        this.dom.btnKinAskMoney.classList.remove('hidden');
        this.dom.btnKinAskMoney.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinAskMoney, "Ask For Money / Allowance", "Too young to understand or ask for pocket money (Unlocks at Age 5).", 5);
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

    // Argue (Requires Age 5)
    if (age < 5) {
      setupLockedBtn(this.dom.btnKinArgue, "Argue / Dispute", "Too young to engage in bitter domestic arguments (Unlocks at Age 5).", 5);
    } else {
      setupBtn(this.dom.btnKinArgue, getCount('argued'), 5, "Vent pent-up frustration or spark bitter disputes. (1 Action)", "Exhausted your arguments for this year (5/5).");
    }

    if (age < 6) setupLockedBtn(this.dom.btnKinInsult, "Deliver an Insult", "Too young to deliberately formulate a cutting insult (Unlocks at Age 6).", 6);
    else setupBtn(this.dom.btnKinInsult, getCount('insulted'), 5, "Say something deliberately cruel and risk retaliation. (1 Action)", "You have provoked them enough this year (5/5).");

    if (this.dom.btnKinApologize) {
      const canApologize = relationshipMind.resentment > 0;
      this.dom.btnKinApologize.classList.toggle('hidden', !canApologize);
      this.dom.btnKinApologize.style.display = canApologize ? 'flex' : 'none';
      this.dom.btnKinApologize.disabled = noEnergy;
      this.dom.btnKinApologize.classList.toggle('opacity-50', noEnergy);
    }

    // Differentiated Actions:
    // 1. Parent Only: Ask Life Advice
    if (this.dom.btnKinAdvice) {
      if (!isParent) {
        this.dom.btnKinAdvice.classList.add('hidden');
        this.dom.btnKinAdvice.style.display = 'none';
      } else if (age < 5) {
        this.dom.btnKinAdvice.classList.remove('hidden');
        this.dom.btnKinAdvice.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinAdvice, "Ask Life Advice", "Too young to seek worldly counsel (Unlocks at Age 5).", 5);
      } else {
        this.dom.btnKinAdvice.classList.remove('hidden');
        this.dom.btnKinAdvice.style.display = 'flex';
        setupBtn(this.dom.btnKinAdvice, getCount('askedAdvice'), 5, "Seek guidance on morals, careers, or strange household rules. (1 Action)", "Sufficient advice received for this year (5/5).");
      }
    }

    // 2. Sibling Only: Play & Bicker
    if (this.dom.btnKinBicker) {
      if (!isSibling) {
        this.dom.btnKinBicker.classList.add('hidden');
        this.dom.btnKinBicker.style.display = 'none';
      } else if (age < 3) {
        this.dom.btnKinBicker.classList.remove('hidden');
        this.dom.btnKinBicker.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinBicker, "Play Games & Bicker", "Too young to play competitive games (Unlocks at Age 3).", 3);
      } else {
        this.dom.btnKinBicker.classList.remove('hidden');
        this.dom.btnKinBicker.style.display = 'flex';
        setupBtn(this.dom.btnKinBicker, getCount('bickered'), 6, "Wrestle over toys, race in the corridor, or trade petty barbs. (1 Action)", "Tired of sibling bickering for this year (6/6).");
      }
    }

    // 3. Sibling Only: Share Dark Secret
    if (this.dom.btnKinSecret) {
      if (!isSibling) {
        this.dom.btnKinSecret.classList.add('hidden');
        this.dom.btnKinSecret.style.display = 'none';
      } else if (age < 5) {
        this.dom.btnKinSecret.classList.remove('hidden');
        this.dom.btnKinSecret.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinSecret, "Share Dark Secret", "Too young to harbor or whisper dark secrets (Unlocks at Age 5).", 5);
      } else {
        this.dom.btnKinSecret.classList.remove('hidden');
        this.dom.btnKinSecret.style.display = 'flex';
        setupBtn(this.dom.btnKinSecret, getCount('sharedSecret'), 4, "Whisper a forbidden confession or occult sighting under blankets. (1 Action)", "No more secrets left to share this year (4/4).");
      }
    }

    // 4. Grandparents Only: Listen to Grim Folktale
    if (this.dom.btnKinFolktale) {
      if (!isGrand) {
        this.dom.btnKinFolktale.classList.add('hidden');
        this.dom.btnKinFolktale.style.display = 'none';
      } else if (age < 4) {
        this.dom.btnKinFolktale.classList.remove('hidden');
        this.dom.btnKinFolktale.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinFolktale, "Listen to Grim Folktale", "Too young to comprehend ancient folk allegories (Unlocks at Age 4).", 4);
      } else {
        this.dom.btnKinFolktale.classList.remove('hidden');
        this.dom.btnKinFolktale.style.display = 'flex';
        setupBtn(this.dom.btnKinFolktale, getCount('folktale'), 5, "Huddle close as they recount unsettling ancestral warnings and lore. (1 Action)", "Listened to enough grim folktales for this year (5/5).");
      }
    }

    // 5. Parent Only: Help With Household Chores (Age 6+)
    if (this.dom.btnKinChores) {
      if (!isParent) {
        this.dom.btnKinChores.classList.add('hidden');
        this.dom.btnKinChores.style.display = 'none';
      } else if (age < 6) {
        this.dom.btnKinChores.classList.remove('hidden');
        this.dom.btnKinChores.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinChores, "Help with Chores", "Too young to safely handle household brooms, dishes, or stoves (Unlocks at Age 6).", 6);
      } else {
        this.dom.btnKinChores.classList.remove('hidden');
        this.dom.btnKinChores.style.display = 'flex';
        setupBtn(this.dom.btnKinChores, getCount('helpedChores'), 5, "Mop floors, wash dishes, or stack firewood to earn praise. (1 Action)", "Chores completed for this year (5/5).");
      }
    }

    // 6. Parent Only: Beg for Pet or Toy (Ages 5 - 14)
    if (this.dom.btnKinBegPet) {
      if (!isParent || age > 14) {
        this.dom.btnKinBegPet.classList.add('hidden');
        this.dom.btnKinBegPet.style.display = 'none';
      } else if (age < 5) {
        this.dom.btnKinBegPet.classList.remove('hidden');
        this.dom.btnKinBegPet.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinBegPet, "Beg for Pet / Toy", "Too young to plead articulately for a family companion (Unlocks at Age 5).", 5);
      } else {
        this.dom.btnKinBegPet.classList.remove('hidden');
        this.dom.btnKinBegPet.style.display = 'flex';
        setupBtn(this.dom.btnKinBegPet, getCount('beggedPet'), 3, "Plead for a cat, hound, or clockwork toy with puppy eyes. (1 Action)", "You've pleaded enough for this year (3/3).");
      }
    }

    // Dynamic: Pray & Recite Scripture (Devout / Deeply Religious, Parents / Grandparents, Age 5+)
    if (this.dom.btnKinPray) {
      const isReligiousHousehold = familyAtmosphere === 'deeply_religious' || familyAtmosphere === 'religious' || (person.dynamicTrait && (person.dynamicTrait.includes('Pious') || person.dynamicTrait.includes('Puritan') || person.dynamicTrait.includes('Religious')));
      if (!isParentOrGrand || !isReligiousHousehold) {
        this.dom.btnKinPray.classList.add('hidden');
        this.dom.btnKinPray.style.display = 'none';
      } else if (age < 5) {
        this.dom.btnKinPray.classList.remove('hidden');
        this.dom.btnKinPray.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinPray, "Pray & Recite Scripture", "Too young to read hymns or kneel in silence (Unlocks at Age 5).", 5);
      } else {
        this.dom.btnKinPray.classList.remove('hidden');
        this.dom.btnKinPray.style.display = 'flex';
        setupBtn(this.dom.btnKinPray, getCount('prayedTogether'), 4, "Kneel on cold floorboards, clasp hands, and recite solemn hymns. (1 Action)", "Prayer devotions concluded for this year (4/4).");
      }
    }

    // Dynamic: Walk on Eggshells / Quietly Tiptoe (Alcoholic / Volatile Parents, Age 6+)
    if (this.dom.btnKinEggshells) {
      const isAlcoholicHousehold = familyAtmosphere === 'alcoholic' || person.sobriety === 'volatile_alcoholic' || (person.dynamicTrait && person.dynamicTrait.includes('Alcoholic'));
      if (!isParent || !isAlcoholicHousehold) {
        this.dom.btnKinEggshells.classList.add('hidden');
        this.dom.btnKinEggshells.style.display = 'none';
      } else if (age < 6) {
        this.dom.btnKinEggshells.classList.remove('hidden');
        this.dom.btnKinEggshells.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinEggshells, "Walk on Eggshells / Tiptoe", "Too naive to recognize volatile domestic warning signs (Unlocks at Age 6).", 6);
      } else {
        this.dom.btnKinEggshells.classList.remove('hidden');
        this.dom.btnKinEggshells.style.display = 'flex';
        setupBtn(this.dom.btnKinEggshells, getCount('walkedEggshells'), 4, "Quietly stay unseen, clean up bottles, and prevent domestic fury. (1 Action)", "You have kept low profile enough this year (4/4).");
      }
    }

    // Dynamic: Present Report Card / Commendation (Extremely Strict Parents, Ages 6 - 18)
    if (this.dom.btnKinCommendation) {
      const isStrictHousehold = familyAtmosphere === 'extremely_strict' || person.strictness >= 70 || (person.dynamicTrait && person.dynamicTrait.includes('Strict'));
      if (!isParent || !isStrictHousehold || age > 18) {
        this.dom.btnKinCommendation.classList.add('hidden');
        this.dom.btnKinCommendation.style.display = 'none';
      } else if (age < 6) {
        this.dom.btnKinCommendation.classList.remove('hidden');
        this.dom.btnKinCommendation.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinCommendation, "Present Report Card", "Not yet enrolled in graded schooling (Unlocks at Age 6).", 6);
      } else {
        this.dom.btnKinCommendation.classList.remove('hidden');
        this.dom.btnKinCommendation.style.display = 'flex';
        setupBtn(this.dom.btnKinCommendation, getCount('presentedReport'), 3, "Hand over academic marks and conduct ledger for strict inspection. (1 Action)", "Report card evaluations finished for this year (3/3).");
      }
    }

    // 7. Parent Only: Ask for Driving Lessons (Ages 15 - 18)
    if (this.dom.btnKinDriving) {
      if (!isParent || age > 18) {
        this.dom.btnKinDriving.classList.add('hidden');
        this.dom.btnKinDriving.style.display = 'none';
      } else if (age < 15) {
        this.dom.btnKinDriving.classList.remove('hidden');
        this.dom.btnKinDriving.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinDriving, "Ask for Driving Lessons", "Cannot reach the pedals or hold a learner permit (Unlocks at Age 15).", 15);
      } else {
        this.dom.btnKinDriving.classList.remove('hidden');
        this.dom.btnKinDriving.style.display = 'flex';
        setupBtn(this.dom.btnKinDriving, getCount('askedDriving'), 4, "Practice clutch control, mirrors, and street navigation. (1 Action)", "Driving lessons finished for this year (4/4).");
      }
    }

    // 8. Parent Only: Discuss College / Career Plans (Ages 16 - 22)
    if (this.dom.btnKinCollege) {
      if (!isParent || age > 22) {
        this.dom.btnKinCollege.classList.add('hidden');
        this.dom.btnKinCollege.style.display = 'none';
      } else if (age < 16) {
        this.dom.btnKinCollege.classList.remove('hidden');
        this.dom.btnKinCollege.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinCollege, "Discuss College / Career Plans", "Too early to plan academic applications or trade apprenticeships (Unlocks at Age 16).", 16);
      } else {
        this.dom.btnKinCollege.classList.remove('hidden');
        this.dom.btnKinCollege.style.display = 'flex';
        setupBtn(this.dom.btnKinCollege, getCount('discussedCollege'), 4, "Seek tuition assistance, moral support, and career guidance. (1 Action)", "College plans reviewed for this year (4/4).");
      }
    }

    // 9. Parent Only: Request Family Loan (Age 18+)
    if (this.dom.btnKinLoan) {
      if (!isParent) {
        this.dom.btnKinLoan.classList.add('hidden');
        this.dom.btnKinLoan.style.display = 'none';
      } else if (age < 18) {
        this.dom.btnKinLoan.classList.remove('hidden');
        this.dom.btnKinLoan.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinLoan, "Request Family Loan", "Minors cannot negotiate adult financial loans (Unlocks at Age 18).", 18);
      } else {
        this.dom.btnKinLoan.classList.remove('hidden');
        this.dom.btnKinLoan.style.display = 'flex';
        setupBtn(this.dom.btnKinLoan, getCount('requestedLoan'), 2, "Ask for a substantial family loan based on trust and wealth. (1 Action)", "Family loans capped for this year (2/2).");
      }
    }

    // 10. Parent Only: Care for Aging Parent (Age 25+, Parent Age 55+)
    if (this.dom.btnKinElderCare) {
      if (!isParent || person.age < 55) {
        this.dom.btnKinElderCare.classList.add('hidden');
        this.dom.btnKinElderCare.style.display = 'none';
      } else if (age < 25) {
        this.dom.btnKinElderCare.classList.remove('hidden');
        this.dom.btnKinElderCare.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinElderCare, "Care for Aging Parent", "Available once you establish adult stability (Unlocks at Age 25).", 25);
      } else {
        this.dom.btnKinElderCare.classList.remove('hidden');
        this.dom.btnKinElderCare.style.display = 'flex';
        setupBtn(this.dom.btnKinElderCare, getCount('caredElder'), 4, "Help them with medications, groceries, and medical appointments. (1 Action)", "Elder care provided for this year (4/4).");
      }
    }

    // Sibling: Rivalry Brawl (Age 10+)
    if (this.dom.btnKinSiblingBrawl) {
      if (!isSibling) {
        this.dom.btnKinSiblingBrawl.classList.add('hidden');
        this.dom.btnKinSiblingBrawl.style.display = 'none';
      } else if (age < 10) {
        this.dom.btnKinSiblingBrawl.classList.remove('hidden');
        this.dom.btnKinSiblingBrawl.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinSiblingBrawl, "Sibling Rivalry Brawl", "Childish tussles are handled via Play Games & Bicker (Unlocks at Age 10).", 10);
      } else {
        this.dom.btnKinSiblingBrawl.classList.remove('hidden');
        this.dom.btnKinSiblingBrawl.style.display = 'flex';
        setupBtn(this.dom.btnKinSiblingBrawl, getCount('siblingBrawl'), 3, "Engage in an intense brawl over deep-seated rivalry. (1 Action)", "No more sibling brawling for this year (3/3).");
      }
    }

    // Sibling: Cover Sibling Alibi (Age 12+)
    if (this.dom.btnKinAlibi) {
      if (!isSibling) {
        this.dom.btnKinAlibi.classList.add('hidden');
        this.dom.btnKinAlibi.style.display = 'none';
      } else if (age < 12) {
        this.dom.btnKinAlibi.classList.remove('hidden');
        this.dom.btnKinAlibi.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinAlibi, "Cover Sibling's Alibi", "Too young to orchestrate coordinated cover stories (Unlocks at Age 12).", 12);
      } else {
        this.dom.btnKinAlibi.classList.remove('hidden');
        this.dom.btnKinAlibi.style.display = 'flex';
        setupBtn(this.dom.btnKinAlibi, getCount('siblingAlibi'), 3, "Lie to parents or authorities to protect your sibling's mischief. (1 Action)", "Cover stories maxed out for this year (3/3).");
      }
    }

    // Sibling: Adult Drinks & Reminisce (Age 18+)
    if (this.dom.btnKinSiblingDrinks) {
      if (!isSibling) {
        this.dom.btnKinSiblingDrinks.classList.add('hidden');
        this.dom.btnKinSiblingDrinks.style.display = 'none';
      } else if (age < 18) {
        this.dom.btnKinSiblingDrinks.classList.remove('hidden');
        this.dom.btnKinSiblingDrinks.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinSiblingDrinks, "Adult Drinks & Reminisce", "Must reach legal drinking age to hit the local tavern (Unlocks at Age 18).", 18);
      } else {
        this.dom.btnKinSiblingDrinks.classList.remove('hidden');
        this.dom.btnKinSiblingDrinks.style.display = 'flex';
        setupBtn(this.dom.btnKinSiblingDrinks, getCount('siblingDrinks'), 4, "Head to a dimly lit bar, clink glasses, and share old tales. (1 Action)", "Had plenty of drinks together this year (4/4).");
      }
    }

    // Grandparent: Explore Dusty Attic & Relics (Age 7+)
    if (this.dom.btnKinAttic) {
      if (!isGrand) {
        this.dom.btnKinAttic.classList.add('hidden');
        this.dom.btnKinAttic.style.display = 'none';
      } else if (age < 7) {
        this.dom.btnKinAttic.classList.remove('hidden');
        this.dom.btnKinAttic.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinAttic, "Explore Dusty Attic & Relics", "Too small and fragile to climb the rickety attic pull-down ladder (Unlocks at Age 7).", 7);
      } else {
        this.dom.btnKinAttic.classList.remove('hidden');
        this.dom.btnKinAttic.style.display = 'flex';
        setupBtn(this.dom.btnKinAttic, getCount('exploredAttic'), 3, "Rummage through trunks of old heirlooms and forgotten letters. (1 Action)", "Attic thoroughly explored for this year (3/3).");
      }
    }

    // Grandparent: Ask for Family Keepsake (Age 12+)
    if (this.dom.btnKinKeepsake) {
      if (!isGrand) {
        this.dom.btnKinKeepsake.classList.add('hidden');
        this.dom.btnKinKeepsake.style.display = 'none';
      } else if (age < 12) {
        this.dom.btnKinKeepsake.classList.remove('hidden');
        this.dom.btnKinKeepsake.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinKeepsake, "Ask for Family Keepsake", "Too young to be entrusted with fragile generational relics (Unlocks at Age 12).", 12);
      } else {
        this.dom.btnKinKeepsake.classList.remove('hidden');
        this.dom.btnKinKeepsake.style.display = 'flex';
        setupBtn(this.dom.btnKinKeepsake, getCount('inheritGrandparentKeepsake'), 2, "Inquire about inheriting an ancestral pocket watch or ring. (1 Action)", "No more heirlooms requested this year (2/2).");
      }
    }

    // Grandparent: Visit Bedside / Care Home (Age 14+)
    if (this.dom.btnKinNursing) {
      if (!isGrand || person.age < 70) {
        this.dom.btnKinNursing.classList.add('hidden');
        this.dom.btnKinNursing.style.display = 'none';
      } else if (age < 14) {
        this.dom.btnKinNursing.classList.remove('hidden');
        this.dom.btnKinNursing.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinNursing, "Visit Bedside / Care Home", "Must be mature enough for solemn geriatric visits (Unlocks at Age 14).", 14);
      } else {
        this.dom.btnKinNursing.classList.remove('hidden');
        this.dom.btnKinNursing.style.display = 'flex';
        setupBtn(this.dom.btnKinNursing, getCount('visitedNursing'), 4, "Sit by their bedside, hold their frail hands, and read aloud. (1 Action)", "Bedside visits concluded for this year (4/4).");
      }
    }

    // Dynamic: Seek Sanctuary at Grandparent's (All Living Grandparents, Age 4+)
    if (this.dom.btnKinGrandparentHaven) {
      if (!isGrand) {
        this.dom.btnKinGrandparentHaven.classList.add('hidden');
        this.dom.btnKinGrandparentHaven.style.display = 'none';
      } else if (age < 4) {
        this.dom.btnKinGrandparentHaven.classList.remove('hidden');
        this.dom.btnKinGrandparentHaven.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinGrandparentHaven, "Seek Sanctuary at Grandparent's", "Too small to wander over to your grandparent's sanctuary (Unlocks at Age 4).", 4);
      } else {
        this.dom.btnKinGrandparentHaven.classList.remove('hidden');
        this.dom.btnKinGrandparentHaven.style.display = 'flex';
        setupBtn(this.dom.btnKinGrandparentHaven, getCount('visitedGrandHaven'), 3, "Escape household tension for warm tea, fresh biscuits, and calm stories. (1 Action)", "Spent peaceful sanctuary visits here this year (3/3).");
      }
    }

    // Friend: Confess Romantic Feelings (Age 13+)
    if (this.dom.btnKinConfess) {
      if (person.category !== 'friend' || (person.isRevealed && person.entityType !== 'human')) {
        this.dom.btnKinConfess.classList.add('hidden');
        this.dom.btnKinConfess.style.display = 'none';
      } else if (age < 13) {
        this.dom.btnKinConfess.classList.remove('hidden');
        this.dom.btnKinConfess.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinConfess, "Confess Romantic Feelings", "Too young to navigate awkward romance (Unlocks at Age 13).", 13);
      } else {
        this.dom.btnKinConfess.classList.remove('hidden');
        this.dom.btnKinConfess.style.display = 'flex';
        setupBtn(this.dom.btnKinConfess, getCount('confessedFeelings'), 2, "Pour your heart out and ask to transition from friends to lovers. (1 Action)", "Already confessed feelings this year (2/2).");
      }
    }

    // LOVERS / PARTNERS ACTIONS
    const isLover = person.category === 'lover';
    const isEx = isLover && person.role && person.role.includes('Ex');

    // Lover: Romantic Date (Age 14+)
    if (this.dom.btnKinDate) {
      if (!isLover || isEx) {
        this.dom.btnKinDate.classList.add('hidden');
        this.dom.btnKinDate.style.display = 'none';
      } else if (age < 14) {
        this.dom.btnKinDate.classList.remove('hidden');
        this.dom.btnKinDate.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinDate, "Go on a Romantic Date", "Too young for dates (Unlocks at Age 14).", 14);
      } else {
        this.dom.btnKinDate.classList.remove('hidden');
        this.dom.btnKinDate.style.display = 'flex';
        setupBtn(this.dom.btnKinDate, getCount('datedLover'), 5, "Take your partner out for coffee, dinner, or a night in the city. (1 Action)", "Gone on enough dates this year (5/5).");
      }
    }

    // Lover: Passionate Flirt & Kiss (Age 14+)
    if (this.dom.btnKinFlirt) {
      if (!isLover || isEx) {
        this.dom.btnKinFlirt.classList.add('hidden');
        this.dom.btnKinFlirt.style.display = 'none';
      } else if (age < 14) {
        this.dom.btnKinFlirt.classList.remove('hidden');
        this.dom.btnKinFlirt.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinFlirt, "Passionate Flirt & Kiss", "Too young for passion (Unlocks at Age 14).", 14);
      } else {
        this.dom.btnKinFlirt.classList.remove('hidden');
        this.dom.btnKinFlirt.style.display = 'flex';
        setupBtn(this.dom.btnKinFlirt, getCount('flirtedKissed'), 6, "Whisper sweet things, hold hands, or share a passionate embrace. (1 Action)", "Plenty of affection shared for this year (6/6).");
      }
    }

    // Lover: Move In Together (Age 18+)
    if (this.dom.btnKinMoveIn) {
      if (!isLover || isEx || person.cohabitating || person.married) {
        this.dom.btnKinMoveIn.classList.add('hidden');
        this.dom.btnKinMoveIn.style.display = 'none';
      } else if (age < 18) {
        this.dom.btnKinMoveIn.classList.remove('hidden');
        this.dom.btnKinMoveIn.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinMoveIn, "Move In Together", "Must be an adult to sign a lease together (Unlocks at Age 18).", 18);
      } else {
        this.dom.btnKinMoveIn.classList.remove('hidden');
        this.dom.btnKinMoveIn.style.display = 'flex';
        setupBtn(this.dom.btnKinMoveIn, getCount('movedInTogether'), 2, "Propose moving into a shared apartment to split living costs. (1 Action)", "Already discussed moving in this year (2/2).");
      }
    }

    // Lover: Propose Marriage (Age 18+)
    if (this.dom.btnKinPropose) {
      if (!isLover || isEx || person.married) {
        this.dom.btnKinPropose.classList.add('hidden');
        this.dom.btnKinPropose.style.display = 'none';
      } else if (person.engaged) {
        this.dom.btnKinPropose.classList.remove('hidden');
        this.dom.btnKinPropose.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinPropose, "Already Engaged", "You are already happily engaged! Time to plan the wedding ceremony.", 18);
      } else if (age < 18) {
        this.dom.btnKinPropose.classList.remove('hidden');
        this.dom.btnKinPropose.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinPropose, "Propose Marriage", "Must be of legal marriage age to propose (Unlocks at Age 18).", 18);
      } else {
        this.dom.btnKinPropose.classList.remove('hidden');
        this.dom.btnKinPropose.style.display = 'flex';
        setupBtn(this.dom.btnKinPropose, getCount('proposedMarriage'), 2, "Get down on one knee with a ring and pop the question. (1 Action)", "Marriage proposal made this year (2/2).");
      }
    }

    // Lover: Plan Wedding Ceremony (Age 18+, Engaged only)
    if (this.dom.btnKinWedding) {
      if (!isLover || isEx || !person.engaged || person.married) {
        this.dom.btnKinWedding.classList.add('hidden');
        this.dom.btnKinWedding.style.display = 'none';
      } else {
        this.dom.btnKinWedding.classList.remove('hidden');
        this.dom.btnKinWedding.style.display = 'flex';
        setupBtn(this.dom.btnKinWedding, getCount('plannedWedding'), 1, "Exchange vows at the town hall or grand cathedral. (1 Action)", "Wedding ceremony concluded for this year (1/1).");
      }
    }

    // Lover: Conceive / Have a Baby (Age 18 - 50)
    if (this.dom.btnKinConceive) {
      if (!isLover || isEx || age > 50) {
        this.dom.btnKinConceive.classList.add('hidden');
        this.dom.btnKinConceive.style.display = 'none';
      } else if (age < 18) {
        this.dom.btnKinConceive.classList.remove('hidden');
        this.dom.btnKinConceive.style.display = 'flex';
        setupLockedBtn(this.dom.btnKinConceive, "Conceive / Have a Baby", "Adult responsibility begins at age 18 (Unlocks at Age 18).", 18);
      } else {
        this.dom.btnKinConceive.classList.remove('hidden');
        this.dom.btnKinConceive.style.display = 'flex';
        setupBtn(this.dom.btnKinConceive, getCount('conceivedChild'), 3, "Try to conceive a child and start growing your family. (1 Action)", "Conception attempts concluded for this year (3/3).");
      }
    }

    // Lover: Break Up / Divorce (Age 14+)
    if (this.dom.btnKinBreakup) {
      if (!isLover || isEx) {
        this.dom.btnKinBreakup.classList.add('hidden');
        this.dom.btnKinBreakup.style.display = 'none';
      } else {
        this.dom.btnKinBreakup.classList.remove('hidden');
        this.dom.btnKinBreakup.style.display = 'flex';
        const label = person.married ? "File for Divorce & Split Assets" : "Break Up / End Relationship";
        const desc = person.married ? "Dissolve marriage legally and separate shared belongings." : "End the relationship and go your separate ways.";
        setupBtn(this.dom.btnKinBreakup, 0, 1, desc, "");
        const titleEl = this.dom.btnKinBreakup.querySelector('.text-xs');
        if (titleEl) titleEl.textContent = label;
      }
    }

    // Paranormal Hex / Dark Deed Action (Available Age 6+)
    if (this.dom.btnKinHex) {
      if (age < 6) {
        this.dom.btnKinHex.classList.add('hidden');
        this.dom.btnKinHex.style.display = 'none';
      } else {
        this.dom.btnKinHex.classList.remove('hidden');
        this.dom.btnKinHex.style.display = 'flex';
      }
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  handleKinAction(actionType) {
    if (!this.selectedKin) return;
    const person = this.selectedKin;
    if (person.missing) {
      alert(`${person.name} is missing. There is nobody here to answer you.`);
      return;
    }

    const interactionBlock = window.canInteractWithNpc ? window.canInteractWithNpc(person, this.character, actionType) : null;
    if (interactionBlock) {
      alert(interactionBlock);
      return;
    }

    // Modal-based interactive flows
    if (actionType === 'ask_money') {
      if (this.character.age < 5) {
        alert("You are too young to ask for pocket money! Unlocks at Age 5.");
        return;
      }
      this.openAskMoneyModal(person);
      return;
    }
    if (actionType === 'gift') {
      if (this.character.age < 5) {
        alert("You are too young to give gifts! Unlocks at Age 5.");
        return;
      }
      this.openGiftModal(person);
      return;
    }

    let result = null;

    if (actionType === 'spend_time') {
      result = window.spendTimeToKin(person, this.character);
    } else if (actionType === 'converse') {
      if (this.character.age < 4) {
        alert("You are too young for complex conversations. Babble or play peek-a-boo instead!");
        return;
      }
      result = window.talkToKin(person, this.character);
    } else if (actionType === 'compliment') {
      if (this.character.age < 4) {
        alert("You are too young to give compliments! Unlocks at Age 4.");
        return;
      }
      result = window.complimentKin(person, this.character);
    } else if (actionType === 'investigate') {
      result = window.investigateKin(person, this.character);
    } else if (actionType === 'tribute') {
      result = window.offerTributeToEntity(person, this.character);
    } else if (actionType === 'argue') {
      if (this.character.age < 5) {
        alert("You are too young to argue! Unlocks at Age 5.");
        return;
      }
      result = window.argueWithKin(person, this.character);
    } else if (actionType === 'insult') {
      if (this.character.age < 6) return;
      person.actionsDone = person.actionsDone || {};
      person.actionsDone.insulted = (person.actionsDone.insulted || 0) + 1;
      result = window.insultNpc ? window.insultNpc(person, this.character) : null;
    } else if (actionType === 'apology') {
      result = window.apologizeToNpc ? window.apologizeToNpc(person, this.character) : null;
    } else if (actionType === 'cuddle') {
      result = window.cuddleKin(person, this.character);
    } else if (actionType === 'babble') {
      result = window.babbleToKin(person, this.character);
    } else if (actionType === 'feed_milk') {
      this.triggerFeedMilkChoice(person);
      return;
    } else if (actionType === 'peekaboo') {
      result = window.peekabooWithKin(person, this.character);
    } else if (actionType === 'parent_advice') {
      result = window.askAdviceFromParent ? window.askAdviceFromParent(person, this.character) : null;
    } else if (actionType === 'sibling_bicker') {
      result = window.bickerWithSibling ? window.bickerWithSibling(person, this.character) : null;
    } else if (actionType === 'sibling_secret') {
      result = window.shareSecretWithSibling ? window.shareSecretWithSibling(person, this.character) : null;
    } else if (actionType === 'grandparent_folktale') {
      result = window.listenGrandparentFolktale ? window.listenGrandparentFolktale(person, this.character) : null;
    } else if (actionType === 'parent_chores') {
      result = window.helpWithChores ? window.helpWithChores(person, this.character) : null;
    } else if (actionType === 'family_pray') {
      result = window.prayWithFamily ? window.prayWithFamily(person, this.character) : null;
    } else if (actionType === 'family_eggshells') {
      result = window.walkOnEggshells ? window.walkOnEggshells(person, this.character) : null;
    } else if (actionType === 'family_commendation') {
      result = window.presentReportCard ? window.presentReportCard(person, this.character) : null;
    } else if (actionType === 'grandparent_haven') {
      result = window.seekGrandparentHaven ? window.seekGrandparentHaven(person, this.character) : null;
    } else if (actionType === 'parent_beg_pet') {
      result = window.begForPetOrToy ? window.begForPetOrToy(person, this.character) : null;
    } else if (actionType === 'parent_driving') {
      result = window.askForDrivingLessons ? window.askForDrivingLessons(person, this.character) : null;
    } else if (actionType === 'parent_college') {
      result = window.discussCollegePlans ? window.discussCollegePlans(person, this.character) : null;
    } else if (actionType === 'parent_loan') {
      result = window.requestFamilyLoan ? window.requestFamilyLoan(person, this.character) : null;
    } else if (actionType === 'parent_elder_care') {
      result = window.careForAgingParent ? window.careForAgingParent(person, this.character) : null;
    } else if (actionType === 'sibling_brawl') {
      result = window.siblingBrawl ? window.siblingBrawl(person, this.character) : null;
    } else if (actionType === 'sibling_alibi') {
      result = window.coverSiblingAlibi ? window.coverSiblingAlibi(person, this.character) : null;
    } else if (actionType === 'sibling_drinks') {
      result = window.siblingDrinks ? window.siblingDrinks(person, this.character) : null;
    } else if (actionType === 'grandparent_attic') {
      result = window.exploreGrandparentAttic ? window.exploreGrandparentAttic(person, this.character) : null;
    } else if (actionType === 'grandparent_keepsake') {
      result = window.inheritGrandparentKeepsake ? window.inheritGrandparentKeepsake(person, this.character) : null;
    } else if (actionType === 'grandparent_nursing') {
      result = window.visitNursingHome ? window.visitNursingHome(person, this.character) : null;
    } else if (actionType === 'friend_confess') {
      result = window.confessToFriend ? window.confessToFriend(person, this.character) : null;
    } else if (actionType === 'lover_date') {
      result = window.dateLover ? window.dateLover(person, this.character) : null;
    } else if (actionType === 'lover_flirt') {
      result = window.flirtKissLover ? window.flirtKissLover(person, this.character) : null;
    } else if (actionType === 'lover_move_in') {
      result = window.askMoveInTogether ? window.askMoveInTogether(person, this.character) : null;
    } else if (actionType === 'lover_propose') {
      result = window.proposeMarriage ? window.proposeMarriage(person, this.character) : null;
    } else if (actionType === 'lover_wedding') {
      result = window.planWeddingCeremony ? window.planWeddingCeremony(person, this.character) : null;
    } else if (actionType === 'lover_conceive') {
      result = window.conceiveChildWithLover ? window.conceiveChildWithLover(person, this.character) : null;
    } else if (actionType === 'lover_breakup') {
      const confirmMsg = person.married 
        ? `Are you certain you wish to divorce ${person.name}? Assets may be split.`
        : `Are you sure you want to end your relationship with ${person.name}?`;
      if (confirm(confirmMsg)) {
        result = window.breakupWithLover ? window.breakupWithLover(person, this.character) : null;
      } else {
        return;
      }
    }

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Action could not be completed.");
      return;
    }

    if (window.finalizeNpcInteraction) {
      result = window.finalizeNpcInteraction(person, this.character, actionType, result);
    }
    if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: 'relationship', title: result.title || person.name, outcome: result.body || result.message, effects: result.effects, engaged: true });

    // Apply stat effects
    if (result.effects) {
      for (const [stat, val] of Object.entries(result.effects)) {
        if (stat === 'money') this.character.money = Math.max(0, this.character.money + val);
        else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + val);
        else if (!['relationship', 'resentment', 'trust', 'fear'].includes(stat)) this.modifyStat(stat, val);
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
    this.renderKinList(this.activeKinFilter);

    // Show interactive feedback dialog modal
    const actionTitles = {
      spend_time: 'Quality Time',
      converse: 'Deep Conversation',
      compliment: 'Warm Flattery',
      investigate: 'Occult Observation',
      tribute: 'Dark Tribute Offered',
      argue: 'Heated Dispute',
      insult: 'Cruel Insult',
      apology: 'An Apology Offered',
      cuddle: 'Nurturing Cuddle',
      babble: 'Baby First Words',
      feed_milk: 'Warm Bottle Feeding',
      peekaboo: 'Playful Peek-a-Boo',
      parent_advice: 'Parental Guidance',
      parent_chores: 'Household Chores',
      family_pray: 'Devout Prayer & Hymns',
      family_eggshells: 'Tiptoeing on Eggshells',
      family_commendation: 'Academic Commendation',
      grandparent_haven: 'Grandparent Sanctuary',
      parent_beg_pet: 'Beg for Pet / Toy',
      parent_driving: 'Driving Lessons',
      parent_college: 'College & Future Plans',
      parent_loan: 'Family Loan',
      parent_elder_care: 'Elder Care',
      sibling_bicker: 'Sibling Bickering',
      sibling_secret: 'Dark Secret Shared',
      sibling_brawl: 'Sibling Rivalry Brawl',
      sibling_alibi: 'Cover Sibling Alibi',
      sibling_drinks: 'Adult Drinks & Reminisce',
      grandparent_folktale: 'Grim Folktale',
      grandparent_attic: 'Attic Relic Search',
      grandparent_keepsake: 'Ancestral Keepsake',
      grandparent_nursing: 'Care Home Bedside Visit',
      friend_confess: 'Confession of Love',
      lover_date: 'Romantic Date',
      lover_flirt: 'Passion & Kiss',
      lover_move_in: 'Move In Together',
      lover_propose: 'Marriage Proposal',
      lover_wedding: 'Wedding Ceremony',
      lover_conceive: 'Family Planning',
      lover_breakup: 'Breakup / Divorce'
    };
    const actionIcons = {
      spend_time: 'heart-handshake',
      converse: 'message-circle',
      compliment: 'sparkles',
      investigate: 'eye',
      tribute: 'skull',
      argue: 'flame',
      insult: 'message-square-warning',
      apology: 'heart-handshake',
      cuddle: 'heart',
      babble: 'message-circle',
      feed_milk: 'cup-soda',
      peekaboo: 'smile',
      parent_advice: 'lightbulb',
      parent_chores: 'sparkles',
      family_pray: 'flame',
      family_eggshells: 'footprints',
      family_commendation: 'award',
      grandparent_haven: 'coffee',
      parent_beg_pet: 'dog',
      parent_driving: 'car',
      parent_college: 'graduation-cap',
      parent_loan: 'banknote',
      parent_elder_care: 'heart',
      sibling_bicker: 'swords',
      sibling_secret: 'key',
      sibling_brawl: 'swords',
      sibling_alibi: 'shield',
      sibling_drinks: 'wine',
      grandparent_folktale: 'scroll',
      grandparent_attic: 'box',
      grandparent_keepsake: 'gem',
      grandparent_nursing: 'stethoscope',
      friend_confess: 'heart',
      lover_date: 'utensils',
      lover_flirt: 'flame',
      lover_move_in: 'home',
      lover_propose: 'sparkles',
      lover_wedding: 'bell',
      lover_conceive: 'baby',
      lover_breakup: 'heart-crack'
    };
    const actionColors = {
      spend_time: 'text-rose-400',
      converse: 'text-blue-400',
      compliment: 'text-amber-400',
      investigate: 'text-purple-400',
      tribute: 'text-rose-500',
      argue: 'text-orange-500',
      insult: 'text-rose-400',
      apology: 'text-sky-400',
      cuddle: 'text-rose-400',
      babble: 'text-sky-400',
      feed_milk: 'text-amber-400',
      peekaboo: 'text-emerald-400',
      parent_advice: 'text-indigo-400',
      parent_chores: 'text-emerald-400',
      family_pray: 'text-indigo-400',
      family_eggshells: 'text-amber-400',
      family_commendation: 'text-sky-400',
      grandparent_haven: 'text-amber-300',
      parent_beg_pet: 'text-amber-400',
      parent_driving: 'text-sky-400',
      parent_college: 'text-blue-400',
      parent_loan: 'text-emerald-400',
      parent_elder_care: 'text-rose-400',
      sibling_bicker: 'text-orange-400',
      sibling_secret: 'text-violet-400',
      sibling_brawl: 'text-red-400',
      sibling_alibi: 'text-slate-400',
      sibling_drinks: 'text-amber-400',
      grandparent_folktale: 'text-amber-500',
      grandparent_attic: 'text-amber-400',
      grandparent_keepsake: 'text-yellow-400',
      grandparent_nursing: 'text-teal-400',
      friend_confess: 'text-rose-400',
      lover_date: 'text-rose-400',
      lover_flirt: 'text-pink-400',
      lover_move_in: 'text-emerald-400',
      lover_propose: 'text-amber-400',
      lover_wedding: 'text-rose-400',
      lover_conceive: 'text-sky-400',
      lover_breakup: 'text-red-400'
    };
    const actionTags = {
      spend_time: 'FAMILY BOND',
      converse: 'CONVERSATION',
      compliment: 'WARM FLATTERY',
      investigate: 'OBSERVATION',
      tribute: 'DARK TRIBUTE',
      argue: 'HEATED DISPUTE',
      insult: 'PROVOCATION',
      apology: 'REPAIR ATTEMPT',
      cuddle: 'NURTURING EMBRACE',
      babble: 'BABY FIRST WORDS',
      feed_milk: 'BOTTLE FEEDING',
      peekaboo: 'PLAYFUL GIGGLES',
      parent_advice: 'PARENTAL GUIDANCE',
      parent_chores: 'CHORES & RESPONSIBILITY',
      family_pray: 'SCRIPTURE & HYMNS',
      family_eggshells: 'DOMESTIC CAUTION',
      family_commendation: 'ACADEMIC INSPECTION',
      grandparent_haven: 'WARM SANCTUARY',
      parent_beg_pet: 'FAMILY PET PETITION',
      parent_driving: 'DRIVER TRAINING',
      parent_college: 'FUTURE ACADEMICS',
      parent_loan: 'FAMILY FINANCE',
      parent_elder_care: 'ELDER DUTY',
      sibling_bicker: 'SIBLING PLAY',
      sibling_secret: 'DARK CONFESSION',
      sibling_brawl: 'SIBLING BRAWL',
      sibling_alibi: 'COVER STORY',
      sibling_drinks: 'SIBLING BONDING',
      grandparent_folktale: 'ANCESTRAL FOLKLORE',
      grandparent_attic: 'ATTIC EXPEDITION',
      grandparent_keepsake: 'FAMILY HEIRLOOM',
      grandparent_nursing: 'BEDSIDE COMFORT',
      friend_confess: 'ROMANTIC CONFESSION',
      lover_date: 'ROMANTIC DATE',
      lover_flirt: 'INTIMACY & PASSION',
      lover_move_in: 'DOMESTIC PARTNERSHIP',
      lover_propose: 'MARRIAGE PROPOSAL',
      lover_wedding: 'HOLY MATRIMONY',
      lover_conceive: 'CHILD CONCEPTION',
      lover_breakup: 'RELATIONSHIP DISSOLVED'
    };

    this.openFeedbackModal({
      tag: actionTags[actionType] || actionType.toUpperCase().replace('_', ' '),
      title: `${person.name} (${actionTitles[actionType] || 'Interaction'})`,
      icon: actionIcons[actionType] || 'message-square',
      iconColor: actionColors[actionType] || 'text-amber-400',
      body: result.message,
      effects: result.effects
    });
  }

  openRevelationModal(person) {
    this.revelationTarget = person;
    window.soundEngine.playDread();
    this.dom.revelationModal.classList.remove('modal-closing', 'hidden');
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
      this.animateCloseModal(this.dom.revelationModal, null, true);
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
    this.animateCloseModal(this.dom.revelationModal, () => {
      this.renderAll();
      this.saveGame();
    }, true);
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

    const askCount = person.actionsDone ? (person.actionsDone.askedMoney || 0) : 0;
    if (askCount >= 2) {
      this.openFeedbackModal({
        tag: "LIMIT REACHED",
        title: "Request Denied",
        icon: "ban",
        iconColor: "text-rose-400",
        body: `You have already asked ${person.name} for pocket money twice this year. Give them a break!`,
        effects: {}
      });
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

    this.dom.kinAskMoneyModal.classList.remove('modal-closing', 'hidden');
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
      this.animateCloseModal(this.dom.kinAskMoneyModal, null, true);
    }
    this.askMoneyTarget = null;
  }

  submitAskMoney() {
    const person = this.askMoneyTarget || this.selectedKin;
    if (!person) {
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
    this.renderKinList(this.activeKinFilter);

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

    const giftCount = person.actionsDone ? (person.actionsDone.gifted || 0) : 0;
    if (giftCount >= 2) {
      this.openFeedbackModal({
        tag: "LIMIT REACHED",
        title: "Too Many Gifts",
        icon: "gift",
        iconColor: "text-amber-400",
        body: `You have already given ${person.name} 2 gifts this year. Save some for next year!`,
        effects: {}
      });
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

    this.dom.kinGiftModal.classList.remove('modal-closing', 'hidden');
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
      this.animateCloseModal(this.dom.kinGiftModal);
    }
    this.giftTarget = null;
  }

  submitGift(gift) {
    const person = this.giftTarget || this.selectedKin;
    if (!person) {
      this.closeGiftModal();
      return;
    }

    const result = window.giveGiftToKin(person, this.character, gift);
    this.closeGiftModal();

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Could not give gift.");
      return;
    }

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
    this.renderKinList(this.activeKinFilter);

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
            ? 'badge-stat-met' 
            : 'badge-stat-unmet';
          
          if (key === 'money') {
            const formatted = this.formatCurrency(Math.abs(val));
            pillText = val > 0 ? `+${formatted}` : `-${formatted}`;
          } else if (key === 'shillings') {
            pillText = val > 0 ? `+${val} Shillings` : `${val} Shillings`;
            colorClass = val > 0 ? 'badge-occult-met' : 'badge-stat-unmet';
          } else if (key === 'relationship') {
            pillText = val > 0 ? `Closeness +${val}%` : `Closeness ${val}%`;
          } else {
            const statName = key.charAt(0).toUpperCase() + key.slice(1);
            const displayVal = val < 0 ? Math.max(-3, val) : val;
            pillText = displayVal > 0 ? `${statName} +${displayVal}%` : `${statName} ${displayVal}%`;
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

    this.dom.kinFeedbackModal.classList.remove('modal-closing', 'hidden');
    this.dom.kinFeedbackModal.style.display = 'flex';
  }

  closeFeedbackModal() {
    if (this.dom.kinFeedbackModal) {
      this.animateCloseModal(this.dom.kinFeedbackModal, () => {
        this.checkPendingSchoolChoice();
      }, true);
    } else {
      this.checkPendingSchoolChoice();
    }
  }

  // ==========================================
  // ACTION CHOICE INTERACTIVE POPUP MODAL
  // ==========================================

  openActionChoiceModal(config) {
    const modal = this.dom.actionChoiceModal || document.getElementById('action-choice-modal');
    if (!modal) return;

    const iconEl = document.getElementById('action-choice-icon');
    const titleEl = document.getElementById('action-choice-title');
    const promptEl = document.getElementById('action-choice-prompt');
    const optionsContainer = document.getElementById('action-choice-options');

    if (iconEl && config.icon) {
      iconEl.setAttribute('data-lucide', config.icon);
    }
    if (titleEl) titleEl.textContent = config.title || 'Decision';
    if (promptEl) promptEl.textContent = config.prompt || '';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      (config.choices || []).forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder flex items-center justify-between group transition-all';
        btn.innerHTML = `
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-parchment group-hover:text-amber-300 transition-colors">${choice.label}</div>
            <div class="text-[10px] text-dust">${choice.desc || ''}</div>
          </div>
          <i data-lucide="chevron-right" class="w-4 h-4 text-dust/60 shrink-0"></i>
        `;
        btn.addEventListener('click', () => {
          this.closeActionChoiceModal();
          if (choice.action) choice.action();
        });
        optionsContainer.appendChild(btn);
      });
    }

    modal.classList.remove('modal-closing', 'hidden');
    modal.style.display = 'flex';
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closeActionChoiceModal() {
    const modal = this.dom.actionChoiceModal || document.getElementById('action-choice-modal');
    if (modal) {
      this.animateCloseModal(modal, null, true);
    }
  }

  triggerFeedMilkChoice(person) {
    const atmo = (this.character.kin && this.character.kin.atmosphere) ? this.character.kin.atmosphere.id : 'loving';
    let prompt = `${person.name} tilts a warm bottle toward your cradle with a quiet, watchful gaze. How do you feed?`;
    if (atmo === 'cold_detached') {
      prompt = `${person.name} holds the glass bottle at a rigid, sterile angle with immaculate posture, checking a gold pocket watch. How do you feed?`;
    } else if (atmo === 'deeply_religious') {
      prompt = `${person.name} whispers a solemn blessing over the bottle before leaning close, watching for any sign of sinful fussing. How do you feed?`;
    } else if (atmo === 'extremely_strict') {
      prompt = `${person.name} holds the measured bottle firmly, ensuring you drink every single ounce without spilling. How do you feed?`;
    } else if (atmo === 'alcoholic') {
      prompt = `${person.name} fumbles with the bottle, hands trembling slightly in the dim kitchen, reeking faintly of stale spirits. How do you feed?`;
    } else if (atmo === 'eccentric_occult') {
      prompt = `${person.name} cradles the dark glass bottle, murmuring strange protective nursery runes into the steam. How do you feed?`;
    } else if (atmo === 'working_class') {
      prompt = `${person.name} sits by the humming radiator in soot-stained work clothes, patiently holding the warm bottle for you. How do you feed?`;
    }

    this.openActionChoiceModal({
      icon: 'cup-soda',
      title: 'Warm Milk Formula',
      prompt,
      choices: [
        {
          label: 'Drink Sweet Honey Milk',
          desc: 'Drink contentedly and burp with satisfaction. (+Happiness, +Health, +Bond)',
          action: () => {
            this.handleDirectCustomAction(person, {
              name: 'Drank Sweet Milk',
              message: `You greedily suckled the warm sweet milk formula from ${person.name}. Comfort spreads through your small limbs.`,
              effects: { happiness: 10, health: 5, relationship: 8 }
            });
          }
        },
        {
          label: 'Sip Bitter Valerian Herb Blend',
          desc: 'A calming medicinal brew that quiets night terrors. (+Sanity, +Health)',
          action: () => {
            this.handleDirectCustomAction(person, {
              name: 'Drank Bitter Valerian',
              message: `You grimaced at the earthy valerian root tea, but the herbal draught stills your racing pulse and soothes bad dreams.`,
              effects: { sanity: 12, health: 6, relationship: 4 }
            });
          }
        },
        {
          label: 'Whisper Backwards into the Bottle',
          desc: 'Blow unholy bubbles and chant into the teat. (+Occult, -Sanity, -Bond)',
          action: () => {
            this.handleDirectCustomAction(person, {
              name: 'Occult Milk Bubbles',
              message: `You blew rhythmic air bubbles backward into the glass bottle, murmuring in reverse cadence. The milk turned faintly violet for a second.`,
              effects: { occult: 8, sanity: -6, relationship: -3 }
            });
          }
        }
      ]
    });
  }

  handleDirectCustomAction(person, actionDef) {
    if (!person.actionCounts) person.actionCounts = {};
    person.actionCounts.fedMilk = (person.actionCounts.fedMilk || 0) + 1;

    if (actionDef.effects) {
      for (const [stat, val] of Object.entries(actionDef.effects)) {
        if (stat === 'relationship') {
          person.relationship = Math.max(0, Math.min(100, person.relationship + val));
        } else if (stat === 'money') {
          this.character.money = Math.max(0, this.character.money + val);
        } else if (stat === 'shillings') {
          this.character.shillings = Math.max(0, this.character.shillings + val);
        } else {
          this.modifyStat(stat, val);
        }
      }
    }

    if (actionDef.effects && actionDef.effects.occult) {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playClick();
    }

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${person.name}] ${actionDef.message}`);
    }

    this.renderAll();
    this.saveGame();
    this.renderKinDetail(person);
    this.renderKinList(this.activeKinFilter);

    this.openFeedbackModal({
      tag: "FEEDING MOMENT",
      title: actionDef.name,
      icon: "cup-soda",
      iconColor: actionDef.effects && actionDef.effects.occult ? "text-purple-400" : "text-amber-400",
      body: actionDef.message,
      effects: actionDef.effects
    });
  }

  // ==========================================
  // PETS & FAMILIARS SYSTEM
  // ==========================================

  renderPetsList() {
    this.dom.kinList.innerHTML = '';
    const pets = this.character.pets || [];

    // Header Action to Adopt or Summon
    const adoptBanner = document.createElement('button');
    adoptBanner.className = 'w-full text-left p-3 rounded-xl bg-slatecard hover:bg-cardhover border border-leadborder flex items-center justify-between group transition-all mb-2';
    adoptBanner.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
          <i data-lucide="paw-print" class="w-4 h-4"></i>
        </div>
        <div>
          <div class="text-xs font-bold text-parchment group-hover:text-emerald-300 transition-colors">Adopt or Summon Companion</div>
          <div class="text-[10px] text-dust">Visit municipal shelter or bind an occult familiar entity.</div>
        </div>
      </div>
      <i data-lucide="chevron-right" class="w-4 h-4 text-dust/60"></i>
    `;
    adoptBanner.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.openPetsModal();
    });
    this.dom.kinList.appendChild(adoptBanner);

    if (pets.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'text-center py-8 text-dust/70 text-xs italic font-serif bg-inputbg rounded-xl border border-leadborder p-4';
      emptyCard.innerHTML = `
        <i data-lucide="ghost" class="w-8 h-8 mx-auto mb-2 text-dust/40"></i>
        <p>You have no domestic pets or supernatural familiars in your keeping.</p>
        <p class="text-[10px] text-dust/60 mt-1 font-mono">Click above to visit the shelter or summon a familiar.</p>
      `;
      this.dom.kinList.appendChild(emptyCard);
      if (window.lucide) {
        try { window.lucide.createIcons(); } catch (e) {}
      }
      return;
    }

    pets.forEach(pet => {
      const card = document.createElement('div');
      const isAlive = pet.alive !== false;
      card.className = `pet-card p-3 rounded-xl border transition-all ${
        isAlive 
          ? 'bg-inputbg hover:bg-cardhover border-leadborder cursor-pointer shadow-xs active:scale-[0.99]' 
          : 'bg-ebon/20 border-leadborder/40 opacity-60 cursor-default'
      }`;

      const typeBadge = pet.type === 'supernatural'
        ? `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-500/40">🔮 Familiar</span>`
        : `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slatecard text-dust border border-leadborder">Mundane</span>`;

      const healthColor = pet.health > 70 ? 'bg-emerald-500' : (pet.health > 35 ? 'bg-amber-500' : 'bg-red-500');
      const affColor = pet.affection > 70 ? 'bg-rose-500' : (pet.affection > 35 ? 'bg-amber-500' : 'bg-red-500');

      card.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg ${pet.type === 'supernatural' ? 'bg-purple-950/40 border border-purple-800/40 text-purple-300' : 'bg-leadborder/30 text-parchment'} flex items-center justify-center shrink-0">
              <i data-lucide="${pet.icon || 'paw-print'}" class="w-4 h-4"></i>
            </div>
            <div class="truncate">
              <h4 class="font-serif font-bold text-xs text-parchment truncate">${pet.name}</h4>
              <p class="text-[10px] text-dust font-mono">${pet.species} • Age ${pet.age}</p>
            </div>
          </div>
          <div class="shrink-0 flex items-center space-x-1.5">
            ${isAlive ? typeBadge : `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30">Deceased</span>`}
            ${isAlive ? `<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-dust/60"></i>` : ''}
          </div>
        </div>

        ${isAlive ? `
          <div class="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-leadborder/30">
            <div class="space-y-0.5">
              <div class="flex justify-between text-[8px] font-mono text-dust">
                <span>Health</span>
                <span class="font-bold text-parchment">${pet.health}%</span>
              </div>
              <div class="w-full h-1 bg-leadborder/40 rounded-full overflow-hidden">
                <div class="h-full ${healthColor} rounded-full" style="width: ${pet.health}%"></div>
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="flex justify-between text-[8px] font-mono text-dust">
                <span>Affection</span>
                <span class="font-bold text-parchment">${pet.affection}%</span>
              </div>
              <div class="w-full h-1 bg-leadborder/40 rounded-full overflow-hidden">
                <div class="h-full ${affColor} rounded-full" style="width: ${pet.affection}%"></div>
              </div>
            </div>
          </div>
        ` : `
          <p class="text-[10px] italic text-dust/80 mt-1">${pet.deathCause || 'Perished.'}</p>
        `}
      `;

      if (isAlive) {
        card.addEventListener('click', () => {
          window.soundEngine.playClick();
          this.openPetDetailModal(pet);
        });
      }

      this.dom.kinList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  openPetsModal() {
    if (!this.character.petsCandidates) {
      this.refreshPetCandidates();
    }
    this.filterPetAdoptions('mundane');
    this.dom.petsModal.classList.remove('modal-closing', 'hidden');
    this.dom.petsModal.style.display = 'flex';
  }

  closePetsModal() {
    if (!this.dom.petsModal) return;
    this.animateCloseModal(this.dom.petsModal);
  }

  refreshPetCandidates() {
    this.character.petsCandidates = {
      mundane: [
        window.generateRandomPet('mundane'),
        window.generateRandomPet('mundane'),
        window.generateRandomPet('mundane')
      ],
      supernatural: [
        window.generateRandomPet('supernatural'),
        window.generateRandomPet('supernatural'),
        window.generateRandomPet('supernatural')
      ]
    };
  }

  filterPetAdoptions(tab = 'mundane') {
    const tabs = document.querySelectorAll('.pet-tab-btn');
    tabs.forEach(btn => {
      if (btn.dataset.tab === tab) {
        btn.className = 'pet-tab-btn flex-1 py-1.5 text-xs font-mono rounded-lg bg-slatecard text-parchment font-bold shadow-xs transition-all';
      } else {
        btn.className = 'pet-tab-btn flex-1 py-1.5 text-xs font-mono rounded-lg text-dust hover:text-parchment transition-all';
      }
    });

    const listEl = document.getElementById('pets-available-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!this.character.petsCandidates) {
      this.refreshPetCandidates();
    }

    const candidates = this.character.petsCandidates[tab] || [];

    candidates.forEach((pet, idx) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 rounded-xl bg-inputbg border border-leadborder space-y-2';

      const isOccult = pet.type === 'supernatural';
      const costText = isOccult ? (pet.costShillings ? `${pet.costShillings} Shillings` : 'Blood Rite / Sanity Toll') : (pet.costUSD ? `$${pet.costUSD} Adoption Fee` : 'Free Adoption');

      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl ${isOccult ? 'bg-purple-950/40 border border-purple-800/40 text-purple-300' : 'bg-leadborder/30 text-parchment'} flex items-center justify-center shrink-0">
              <i data-lucide="${pet.icon || 'paw-print'}" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-serif font-bold text-xs text-parchment">${pet.name}</h4>
              <p class="text-[10px] text-dust font-mono">${pet.species} • Age ${pet.age}</p>
            </div>
          </div>
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full ${isOccult ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30' : 'bg-slatecard text-dust border border-leadborder'}">
            ${costText}
          </span>
        </div>

        <p class="text-[10px] text-dust/90 italic leading-snug">${pet.quirk || ''}</p>
        ${pet.omen ? `<div class="p-2 rounded bg-ebon/40 border border-leadborder/40 text-[9px] text-purple-300/90 font-mono">👁️ Omen: ${pet.omen}</div>` : ''}

        <button class="btn-adopt-candidate w-full py-2 px-3 rounded-lg ${isOccult ? 'bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-200' : 'bg-slatecard hover:bg-cardhover border border-leadborder text-parchment'} font-serif font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]">
          <i data-lucide="${isOccult ? 'flame' : 'heart'}" class="w-3.5 h-3.5"></i>
          <span>${isOccult ? 'Bind Familiar' : 'Adopt Companion'}</span>
        </button>
      `;

      const adoptBtn = card.querySelector('.btn-adopt-candidate');
      if (adoptBtn) {
        adoptBtn.addEventListener('click', () => {
          this.adoptPet(pet, tab, idx);
        });
      }

      listEl.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  adoptPet(pet, tab, idx) {
    if (pet.costUSD && this.character.money < pet.costUSD) {
      alert(`You do not have enough money ($${pet.costUSD}) to pay this adoption fee!`);
      return;
    }
    if (pet.costShillings && this.character.shillings < pet.costShillings) {
      alert(`You lack the ${pet.costShillings} Shillings required for this occult binding!`);
      return;
    }
    if (pet.type === 'supernatural' && this.character.occult < 12) {
      alert(`Your Occult affinity (${this.character.occult}%) is too weak to bind this familiar without losing your mind! (Requires 12% Occult)`);
      return;
    }

    if (pet.costUSD) this.character.money -= pet.costUSD;
    if (pet.costShillings) this.character.shillings -= pet.costShillings;

    if (!this.character.pets) this.character.pets = [];
    this.character.pets.push(pet);

    // Remove from candidates
    if (this.character.petsCandidates && this.character.petsCandidates[tab]) {
      this.character.petsCandidates[tab].splice(idx, 1);
    }

    if (pet.type === 'supernatural') {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playClick();
    }

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[Companion] Welcomed ${pet.name} (${pet.species}) into your household.`);
    }

    this.renderAll();
    this.saveGame();
    this.closePetsModal();
    this.renderPetsList();

    this.openFeedbackModal({
      tag: pet.type === 'supernatural' ? "FAMILIAR BOUND" : "PET ADOPTED",
      title: `Welcome, ${pet.name}`,
      icon: pet.icon || 'paw-print',
      iconColor: pet.type === 'supernatural' ? "text-purple-400" : "text-emerald-400",
      body: `You brought home ${pet.name} the ${pet.species}. ${pet.quirk || ''}`,
      effects: { happiness: 8, sanity: pet.type === 'supernatural' ? -3 : 5 }
    });
  }

  openPetDetailModal(pet) {
    this.selectedPet = pet;
    const modal = this.dom.petDetailModal;
    if (!modal) return;

    const titleEl = document.getElementById('pet-detail-title');
    const subtitleEl = document.getElementById('pet-detail-subtitle');
    const cardEl = document.getElementById('pet-detail-card');

    if (titleEl) titleEl.textContent = pet.name;
    if (subtitleEl) subtitleEl.textContent = `${pet.species} • Age ${pet.age} • ${pet.type === 'supernatural' ? '🔮 Occult Familiar' : 'Domestic Companion'}`;

    if (cardEl) {
      const isAlive = pet.alive !== false;
      const healthColor = pet.health > 70 ? 'bg-emerald-500' : (pet.health > 35 ? 'bg-amber-500' : 'bg-red-500');
      const affColor = pet.affection > 70 ? 'bg-rose-500' : (pet.affection > 35 ? 'bg-amber-500' : 'bg-red-500');
      const hungerColor = pet.hunger < 40 ? 'bg-emerald-500' : (pet.hunger < 75 ? 'bg-amber-500' : 'bg-red-500');

      cardEl.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-xl ${pet.type === 'supernatural' ? 'bg-purple-950/40 border border-purple-800/40 text-purple-300' : 'bg-leadborder/30 text-parchment'} flex items-center justify-center shrink-0">
            <i data-lucide="${pet.icon || 'paw-print'}" class="w-6 h-6"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-serif font-bold text-sm text-parchment truncate">${pet.name}</h4>
            <p class="text-[10px] text-dust font-mono">${pet.species} • ${isAlive ? 'Alive & In Service' : 'Deceased'}</p>
          </div>
        </div>

        <p class="text-[10px] text-dust/90 italic pt-1">${pet.quirk || ''}</p>
        ${pet.omen ? `<div class="p-2 rounded bg-ebon/40 border border-leadborder/40 text-[9px] text-purple-300/90 font-mono">👁️ Supernatural Omen: ${pet.omen}</div>` : ''}

        ${isAlive ? `
          <div class="space-y-2 pt-2 border-t border-leadborder/40">
            <div class="space-y-0.5">
              <div class="flex justify-between text-[9px] font-mono text-dust">
                <span>Vital Health</span>
                <span class="font-bold text-parchment">${pet.health}%</span>
              </div>
              <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
                <div class="h-full ${healthColor} rounded-full" style="width: ${pet.health}%"></div>
              </div>
            </div>

            <div class="space-y-0.5">
              <div class="flex justify-between text-[9px] font-mono text-dust">
                <span>Affection / Bond</span>
                <span class="font-bold text-parchment">${pet.affection}%</span>
              </div>
              <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
                <div class="h-full ${affColor} rounded-full" style="width: ${pet.affection}%"></div>
              </div>
            </div>

            <div class="space-y-0.5">
              <div class="flex justify-between text-[9px] font-mono text-dust">
                <span>Hunger (Lower is Fed)</span>
                <span class="font-bold text-parchment">${pet.hunger}%</span>
              </div>
              <div class="w-full h-1.5 bg-leadborder/40 rounded-full overflow-hidden">
                <div class="h-full ${hungerColor} rounded-full" style="width: ${pet.hunger}%"></div>
              </div>
            </div>

            ${pet.type === 'supernatural' ? `
              <div class="space-y-0.5">
                <div class="flex justify-between text-[9px] font-mono text-purple-300">
                  <span>Supernatural Resonance</span>
                  <span class="font-bold">${pet.supernaturalBond || 50}%</span>
                </div>
                <div class="w-full h-1.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-800/30">
                  <div class="h-full bg-purple-500 rounded-full" style="width: ${pet.supernaturalBond || 50}%"></div>
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      `;
    }

    // Toggle commune button if supernatural
    if (this.dom.btnPetCommune) {
      if (pet.type === 'supernatural') {
        this.dom.btnPetCommune.classList.remove('hidden');
        this.dom.btnPetCommune.style.display = 'flex';
      } else {
        this.dom.btnPetCommune.classList.add('hidden');
        this.dom.btnPetCommune.style.display = 'none';
      }
    }

    modal.classList.remove('modal-closing', 'hidden');
    modal.style.display = 'flex';
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closePetDetailModal() {
    if (!this.dom.petDetailModal) return;
    this.animateCloseModal(this.dom.petDetailModal, () => {
      this.renderPetsList();
    });
  }

  handlePetAction(actionType) {
    if (!this.selectedPet) return;
    const pet = this.selectedPet;

    let result = null;
    if (actionType === 'feed') {
      result = window.feedPet(pet, this.character);
    } else if (actionType === 'cuddle') {
      result = window.cuddlePet(pet, this.character);
    } else if (actionType === 'stroll') {
      result = window.strollPet(pet, this.character);
    } else if (actionType === 'commune') {
      result = window.communeWithPet(pet, this.character);
    } else if (actionType === 'vet') {
      result = window.takePetToVet(pet, this.character);
    }

    if (!result || !result.success) {
      alert(result ? (result.reason || result.message) : "Could not complete pet action.");
      return;
    }

    if (result.effects) {
      for (const [stat, val] of Object.entries(result.effects)) {
        if (stat === 'money') this.character.money = Math.max(0, this.character.money + val);
        else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + val);
        else this.modifyStat(stat, val);
      }
    }

    if (pet.type === 'supernatural' || actionType === 'commune') {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playClick();
    }

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[${pet.name}] ${result.message}`);
    }
    if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: 'relationship', title: `${pet.name}'s Response`, outcome: result.message, effects: result.effects, genuine: pet.category === 'supernatural', engaged: true, investigated: actionType === 'commune' });

    this.renderAll();
    this.saveGame();
    this.openPetDetailModal(pet);

    this.openFeedbackModal({
      tag: "PET CARE OUTCOME",
      title: `${pet.name}'s Response`,
      icon: pet.icon || 'paw-print',
      iconColor: pet.type === 'supernatural' ? 'text-purple-400' : 'text-amber-400',
      body: result.message,
      effects: result.effects
    });
  }

  // ==========================================
  // CREATURE REGISTRY & ENTITY RELATIONSHIPS
  // ==========================================

  openCreaturesModal() {
    if (!this.character || !this.dom.creaturesModal) return;
    window.soundEngine.playDread();
    if (window.ensureEntitySystem) window.ensureEntitySystem(this.character);
    this.closeOtherPrimaryModals(this.dom.creaturesModal);
    this.setPrimaryNav('creatures');
    this.switchArchiveTab('creatures');
    this.renderCreaturesList();
    this.dom.creaturesModal.classList.remove('modal-closing', 'hidden');
    this.dom.creaturesModal.style.display = 'flex';
  }

  closeCreaturesModal() {
    if (this.dom.creatureDetailModal) {
      this.dom.creatureDetailModal.classList.add('hidden');
      this.dom.creatureDetailModal.style.display = 'none';
    }
    if (this.dom.caseDetailModal) {
      this.dom.caseDetailModal.classList.add('hidden');
      this.dom.caseDetailModal.style.display = 'none';
    }
    this.selectedEntityId = null;
    this.selectedCaseId = null;
    if (this.dom.creaturesModal) {
      this.animateCloseModal(this.dom.creaturesModal, () => {
        this.setPrimaryNav('life');
      });
    }
  }

  renderCreaturesList() {
    if (!this.dom.creaturesList) return;
    const system = window.ensureEntitySystem ? window.ensureEntitySystem(this.character) : { entities: [] };
    const entities = system.entities.filter(entity => entity.known !== false);
    this.dom.creaturesList.innerHTML = '';
    if (this.dom.creaturesEmpty) {
      this.dom.creaturesEmpty.classList.toggle('hidden', entities.length > 0);
      this.dom.creaturesEmpty.classList.toggle('flex', entities.length === 0);
    }
    entities.forEach(entity => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'w-full rounded-2xl border border-purple-800/40 bg-purple-950/15 hover:bg-purple-950/30 p-3.5 text-left transition-all active:scale-[0.99]';
      const danger = ['hunting', 'hungry', 'offended'].includes(entity.state);
      card.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="w-10 h-10 rounded-xl border ${danger ? 'border-crimson/60 text-crimson' : 'border-purple-700/50 text-purple-300'} bg-inputbg flex items-center justify-center shrink-0"><i data-lucide="${entity.icon || 'eye'}" class="w-5 h-5"></i></span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center justify-between gap-2"><strong class="font-serif text-sm text-parchment truncate">${entity.name}</strong><span class="text-[9px] uppercase tracking-wider font-mono ${danger ? 'text-rose-400' : 'text-purple-400'}">${entity.state}</span></span>
            <span class="block text-[10px] font-mono text-dust mt-0.5">${entity.typeName} · Bound to ${entity.attachment?.label || 'an unknown place'}</span>
            <span class="block text-[10px] text-dust/80 mt-2">Bond ${entity.bond}% · Loyalty ${entity.loyalty}%</span>
          </span>
          <i data-lucide="chevron-right" class="w-4 h-4 text-dust shrink-0 mt-3"></i>
        </div>`;
      card.addEventListener('click', () => this.openCreatureDetail(entity.id));
      this.dom.creaturesList.appendChild(card);
    });
    if (window.lucide) try { window.lucide.createIcons(); } catch (e) {}
  }

  openCreatureDetail(entityId) {
    const system = window.ensureEntitySystem ? window.ensureEntitySystem(this.character) : { entities: [] };
    const entity = system.entities.find(item => item.id === entityId);
    if (!entity || !this.dom.creatureDetailModal) return;
    this.selectedEntityId = entity.id;
    this.dom.creatureDetailType.textContent = `${entity.typeName} · First seen at age ${entity.firstSeenAge}`;
    this.dom.creatureDetailName.textContent = entity.name;
    this.dom.creatureDetailIcon.innerHTML = `<i data-lucide="${entity.icon || 'eye'}" class="w-5 h-5"></i>`;
    this.dom.creatureDetailDescription.textContent = entity.description;
    this.dom.creatureDetailState.textContent = entity.state;
    this.dom.creatureDetailAttachment.textContent = `${entity.attachment?.kind || 'unknown'} · ${entity.attachment?.label || 'unknown'}`;
    this.dom.creatureDetailBond.textContent = `${entity.bond}%`;
    this.dom.creatureDetailLoyalty.textContent = `${entity.loyalty}%`;
    this.dom.creatureDetailHunger.textContent = `${entity.hunger}%${entity.demandLevel ? ` · Demands escalated ${entity.demandLevel} time${entity.demandLevel === 1 ? '' : 's'}` : ''}`;
    this.renderCreatureActions(entity);
    this.dom.creatureMemory.innerHTML = entity.memories.length ? entity.memories.map(memory => `
      <div class="rounded-xl border border-leadborder bg-inputbg p-3">
        <p class="text-[9px] font-mono uppercase tracking-wider text-purple-400">Age ${memory.age} · ${String(memory.action).replace(/_/g, ' ')}</p>
        <p class="text-xs text-dust mt-1 leading-relaxed">${memory.detail}</p>
      </div>`).join('') : '<p class="text-xs text-dust">It has revealed no readable history.</p>';
    this.dom.creatureDetailModal.classList.remove('modal-closing', 'hidden');
    this.dom.creatureDetailModal.style.display = 'flex';
    if (window.lucide) try { window.lucide.createIcons(); } catch (e) {}
  }

  closeCreatureDetail() {
    if (!this.dom.creatureDetailModal) return;
    this.animateCloseModal(this.dom.creatureDetailModal, () => {
      this.selectedEntityId = null;
      this.renderCreaturesList();
    });
  }

  renderCreatureActions(entity) {
    if (!this.dom.creatureActions) return;
    const actions = [
      ['befriend', 'Befriend', 'heart-handshake'], ['help', 'Help It', 'hand-heart'], ['appease', 'Appease (2 s.)', 'coins'],
      ['investigate', 'Investigate', 'search'], ['report', 'Report / Expose', 'megaphone'],
      ['worship', 'Worship', 'flame'], ['resist', 'Resist', 'shield'], ['harm', 'Harm It', 'swords'], ['escape', 'Try to Escape', 'door-open']
    ];
    if (entity.pendingDemand) actions.unshift(['fulfill_demand', 'Obey Its Demand', 'badge-check']);
    if (entity.attachment?.kind === 'object' && entity.attachment.intact !== false) actions.push(['destroy_object', 'Destroy Object', 'hammer']);
    this.dom.creatureActions.innerHTML = '';
    actions.forEach(([id, label, icon]) => {
      const used = (entity.actionsDone?.[id] || 0) >= 1;
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = used;
      button.className = 'rounded-xl border border-leadborder bg-inputbg hover:border-purple-600/60 px-3 py-2.5 text-xs text-parchment disabled:opacity-40 flex items-center justify-center gap-2 transition-all';
      button.innerHTML = `<i data-lucide="${icon}" class="w-3.5 h-3.5"></i><span>${used ? 'Done this year' : label}</span>`;
      button.addEventListener('click', () => this.handleCreatureAction(id));
      this.dom.creatureActions.appendChild(button);
    });
  }

  handleCreatureAction(action) {
    if (!this.selectedEntityId || !window.interactWithEntity) return;
    const result = window.interactWithEntity(this.character, this.selectedEntityId, action);
    if (!result.success) {
      alert(result.reason || 'The creature refused to respond.');
      return;
    }
    if (action === 'investigate' && window.ensureCaseForEntity && window.collectCaseEvidence) {
      const file = window.ensureCaseForEntity(this.character, result.entity);
      const finding = window.collectCaseEvidence(this.character, file.id, 'alone');
      if (finding.success) {
        result.message += ` ${finding.message}`;
        Object.entries(finding.effects || {}).forEach(([key, value]) => result.effects[key] = (result.effects[key] || 0) + value);
      }
    }
    Object.entries(result.effects || {}).forEach(([stat, value]) => {
      if (stat === 'money') this.character.money = Math.max(0, this.character.money + value);
      else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + value);
      else this.modifyStat(stat, value);
    });
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) latestLog.entries.push(`[CREATURE — ${result.entity.name}] ${result.message}`);
    this.saveGame();
    this.openCreatureDetail(result.entity.id);
    this.openFeedbackModal({ tag: 'ENTITY RESPONSE', title: result.entity.name, icon: result.entity.icon || 'eye', iconColor: 'text-purple-400', body: result.message, effects: result.effects || {} });
  }

  switchArchiveTab(tab) {
    const casesActive = tab === 'cases';
    this.dom.archiveCreaturesPanel?.classList.toggle('hidden', casesActive);
    this.dom.archiveCasesPanel?.classList.toggle('hidden', !casesActive);
    [
      [this.dom.tabArchiveCreatures, !casesActive],
      [this.dom.tabArchiveCases, casesActive]
    ].forEach(([button, active]) => {
      if (!button) return;
      button.classList.toggle('bg-slatecard', active);
      button.classList.toggle('border', active);
      button.classList.toggle('border-leadborder', active);
      button.classList.toggle('text-parchment', active);
      button.classList.toggle('text-dust', !active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    if (casesActive) this.renderCaseFiles();
    else this.renderCreaturesList();
  }

  evidenceCardHtml(evidence) {
    const meta = (window.EVIDENCE_TYPES && window.EVIDENCE_TYPES[evidence.type]) || { label: evidence.type, icon: 'file-question' };
    const dangerClass = evidence.danger >= 65 ? 'text-rose-400' : (evidence.danger >= 35 ? 'text-amber-300' : 'text-emerald-300');
    return `<div class="rounded-xl border border-leadborder bg-inputbg p-3">
      <div class="flex items-start gap-2.5"><i data-lucide="${meta.icon}" class="w-4 h-4 text-purple-400 shrink-0 mt-0.5"></i><div class="min-w-0 flex-1"><div class="flex justify-between gap-2"><strong class="text-xs text-parchment">${evidence.label}</strong><span class="text-[8px] font-mono uppercase ${evidence.analyzed ? 'text-emerald-300' : 'text-dust'}">${evidence.analyzed ? 'Analyzed' : 'Raw'}</span></div><p class="text-[10px] text-dust mt-1 leading-relaxed">${evidence.description}</p></div></div>
      <div class="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-leadborder/60 text-center font-mono"><div><span class="block text-[7px] uppercase text-dust">Authentic</span><b class="text-[9px] text-parchment">${evidence.analyzed ? `${evidence.authenticity}%` : 'Unverified'}</b></div><div><span class="block text-[7px] uppercase text-dust">Tainted</span><b class="text-[9px] text-purple-300">${evidence.contamination}%</b></div><div><span class="block text-[7px] uppercase text-dust">Danger</span><b class="text-[9px] ${dangerClass}">${evidence.danger}%</b></div><div><span class="block text-[7px] uppercase text-dust">Credible</span><b class="text-[9px] text-sky-300">${evidence.credibility}%</b></div></div>
    </div>`;
  }

  renderCaseFiles() {
    if (!window.ensureInvestigationSystem || !this.dom.caseFilesList) return;
    const system = window.ensureInvestigationSystem(this.character);
    const entities = window.ensureEntitySystem ? window.ensureEntitySystem(this.character).entities : [];
    if (window.ensureCaseForEntity) entities.filter(entity => entity.known !== false).forEach(entity => window.ensureCaseForEntity(this.character, entity));
    this.dom.archiveCaseSummary.textContent = `${system.cases.length} case file${system.cases.length === 1 ? '' : 's'} · ${system.evidence.length} evidence item${system.evidence.length === 1 ? '' : 's'} · Institutional attention ${system.institutionAttention}%`;
    this.dom.caseFilesList.innerHTML = system.cases.length ? system.cases.map(file => {
      const evidenceCount = file.evidenceIds.length;
      const conclusion = file.conclusion ? file.conclusion.label : 'Unresolved';
      return `<button type="button" class="case-file-card w-full rounded-xl border border-leadborder bg-inputbg hover:bg-cardhover p-3 text-left" data-case-id="${file.id}"><div class="flex justify-between gap-3"><div class="min-w-0"><strong class="block font-serif text-xs text-parchment truncate">${file.title}</strong><span class="block mt-1 text-[9px] font-mono text-dust">Opened age ${file.openedAge} · ${file.incidents.length} incident${file.incidents.length === 1 ? '' : 's'} · ${evidenceCount} evidence</span></div><span class="text-[8px] uppercase tracking-wider font-mono text-purple-300 shrink-0">${file.status}</span></div><p class="text-[10px] text-dust mt-2">Conclusion: ${conclusion} · Analysis ${Math.round(file.analysis)}%</p></button>`;
    }).join('') : '<div class="rounded-xl border border-dashed border-leadborder p-5 text-center text-xs text-dust">No case files yet. Investigate a creature or survive related incidents across multiple years.</div>';
    this.dom.caseFilesList.querySelectorAll('.case-file-card').forEach(card => card.addEventListener('click', () => this.openCaseDetail(card.dataset.caseId)));
    this.dom.evidenceInventory.innerHTML = system.evidence.length ? system.evidence.map(item => this.evidenceCardHtml(item)).join('') : '<p class="text-xs text-dust/70 italic">No evidence has been catalogued.</p>';
    if (window.lucide) try { window.lucide.createIcons(); } catch (e) {}
  }

  openCaseDetail(caseId) {
    this.selectedCaseId = caseId;
    this.renderCaseDetail();
    this.dom.caseDetailModal.classList.remove('modal-closing', 'hidden');
    this.dom.caseDetailModal.style.display = 'flex';
  }

  closeCaseDetail() {
    if (!this.dom.caseDetailModal) return;
    this.animateCloseModal(this.dom.caseDetailModal, () => {
      this.selectedCaseId = null;
      this.renderCaseFiles();
    });
  }

  renderCaseDetail() {
    const system = window.ensureInvestigationSystem ? window.ensureInvestigationSystem(this.character) : null;
    const file = system?.cases.find(item => item.id === this.selectedCaseId);
    if (!file) return;
    const evidence = window.getEvidenceForCase ? window.getEvidenceForCase(this.character, file.id) : [];
    const people = window.getInvestigationPeople ? window.getInvestigationPeople(this.character) : [];
    const activeIds = new Set(file.investigators.filter(item => item.active).map(item => item.personId));
    this.dom.caseDetailTitle.textContent = file.title;
    this.dom.caseDetailStatus.innerHTML = `<div class="flex justify-between gap-3"><div><p class="text-[9px] font-mono uppercase tracking-wider text-purple-400">${file.status}</p><p class="text-xs text-dust mt-1">Opened at age ${file.openedAge} · Updated age ${file.lastUpdatedAge}</p></div><strong class="text-sm text-parchment">${Math.round(file.analysis)}% analyzed</strong></div>${file.conclusion ? `<p class="mt-3 pt-3 border-t border-purple-800/30 text-xs text-dust">Filed conclusion: <span class="text-parchment">${file.conclusion.label}${file.conclusion.suspectName ? ` · ${file.conclusion.suspectName} implicated` : ''}</span></p>` : ''}`;
    this.dom.caseEvidenceList.innerHTML = evidence.length ? evidence.map(item => this.evidenceCardHtml(item)).join('') : '<p class="text-xs text-dust/70 italic">The evidence sleeves are empty.</p>';
    this.dom.caseInvestigators.innerHTML = file.investigators.length ? file.investigators.filter(item => item.active).map(item => `<div class="rounded-lg border border-leadborder bg-inputbg px-2.5 py-2 text-[10px] text-dust"><span class="text-parchment">${item.name}</span> · Contribution ${item.contribution}% · Joined age ${item.joinedAge}</div>`).join('') : '<p class="text-[10px] text-dust/70">You are currently working alone.</p>';
    const recruitable = people.filter(person => !activeIds.has(person.id || person.name));
    this.dom.caseRecruitSelect.innerHTML = recruitable.length ? recruitable.map(person => `<option value="${person.id || person.name}">${person.name} · ${person.role || person.category || 'Contact'}</option>`).join('') : '<option value="">No available contacts</option>';
    this.dom.caseSuspectSelect.innerHTML = people.length ? people.map(person => `<option value="${person.id || person.name}">${person.name}</option>`).join('') : '<option value="">Nobody available</option>';
    this.dom.caseConclusionSelect.value = file.conclusion?.type || 'genuine_paranormal';
    this.syncCaseConclusionUI();
    this.dom.caseIncidents.innerHTML = file.incidents.length ? [...file.incidents].reverse().map(incident => `<div class="rounded-xl border-l-2 border-purple-700 bg-inputbg p-3"><p class="text-[9px] font-mono uppercase text-purple-400">Age ${incident.age} · ${incident.title}</p><p class="text-[10px] text-dust mt-1 leading-relaxed">${incident.detail}</p></div>`).join('') : '<p class="text-xs text-dust/70">No incidents linked.</p>';
    if (window.lucide) try { window.lucide.createIcons(); } catch (e) {}
  }

  syncCaseConclusionUI() {
    if (!this.dom.caseConclusionSelect || !this.dom.caseSuspectRow) return;
    this.dom.caseSuspectRow.classList.toggle('hidden', this.dom.caseConclusionSelect.value !== 'human_deception');
  }

  applyCaseResult(result, actionCost = 1) {
    if (!result.success) {
      alert(result.reason || 'The archive rejected the request.');
      return false;
    }
    Object.entries(result.effects || {}).forEach(([stat, value]) => {
      if (!value) return;
      if (stat === 'money') this.character.money = Math.max(0, this.character.money + value);
      else if (stat === 'shillings') this.character.shillings = Math.max(0, this.character.shillings + value);
      else if (stat !== 'relationship') this.modifyStat(stat, value);
    });
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) latestLog.entries.push(`[ARCHIVE — ${result.title}] ${result.message}`);
    this.saveGame(); this.renderAll(); this.renderCaseDetail();
    this.openFeedbackModal({ tag: 'MUNICIPAL LIFE ARCHIVE', title: result.title, icon: 'folder-search-2', iconColor: 'text-purple-400', body: result.message, effects: result.effects || {} });
    return true;
  }

  handleCaseAction(action) {
    if (!this.selectedCaseId) return;
    let result;
    if (action === 'investigate_alone') result = window.collectCaseEvidence(this.character, this.selectedCaseId, 'alone');
    else if (action === 'investigate_team') result = window.collectCaseEvidence(this.character, this.selectedCaseId, 'team');
    else if (action === 'analyze') result = window.analyzeCaseEvidence(this.character, this.selectedCaseId);
    else if (action === 'recruit') result = window.recruitCaseInvestigator(this.character, this.selectedCaseId, this.dom.caseRecruitSelect.value);
    else if (action === 'conclude') result = window.fileCaseConclusion(this.character, this.selectedCaseId, this.dom.caseConclusionSelect.value, this.dom.caseSuspectSelect.value);
    else if (action === 'publish') result = window.publishCaseFile(this.character, this.selectedCaseId, 'public');
    else if (action === 'submit') result = window.publishCaseFile(this.character, this.selectedCaseId, 'institution');
    if (result) this.applyCaseResult(result, action === 'conclude' ? 0 : 1);
  }

  // ==========================================
  // ACTIVITIES & PURSUITS SYSTEM ("CITY OF BUTTONS")
  // ==========================================

  openActivitiesModal() {
    this.closeOtherPrimaryModals(this.dom.activitiesModal);
    this.setPrimaryNav('activities');
    this.dom.activitiesModal.classList.remove('modal-closing', 'hidden');
    this.dom.activitiesModal.style.display = 'flex';
    this.closeActivityCategory(); // Ensure we land on the City Hub
    this.renderActivitiesHub();
  }

  closeActivitiesModal() {
    if (!this.dom.activitiesModal) return;
    this.animateCloseModal(this.dom.activitiesModal, () => {
      this.setPrimaryNav('life');
    });
  }

  renderActivitiesHub() {
    if (this.dom.activitiesStaminaText) this.dom.activitiesStaminaText.textContent = `Year ${this.character.age} Activities`;
    const schoolStatus = this.character.education && this.character.education.graduationStatus;
    const educationCard = this.dom.activitiesModal && this.dom.activitiesModal.querySelector('[data-category="education"]');
    if (educationCard) educationCard.classList.toggle('hidden', schoolStatus === 'expelled' || schoolStatus === 'dropped_out');

    // Live status indicators on hub cards
    if (this.dom.hubStatusWork) {
      if (this.character.job && (this.character.job.title || this.character.job.name)) {
        this.dom.hubStatusWork.textContent = this.character.job.title || this.character.job.name;
      } else if (this.character.age < 18) {
        this.dom.hubStatusWork.textContent = "Odd jobs & shifts";
      } else {
        this.dom.hubStatusWork.textContent = "Unemployed · Gigs available";
      }
    }

    if (this.dom.hubStatusEducation) {
      if (this.character.education && this.character.education.enrolled) {
        this.dom.hubStatusEducation.textContent = this.character.education.name || "Enrolled in school";
      } else if (this.character.age <= 17) {
        this.dom.hubStatusEducation.textContent = "Schooling eligible";
      } else if (this.character.hasHighSchoolDiploma) {
        this.dom.hubStatusEducation.textContent = "High School Graduate";
      } else {
        this.dom.hubStatusEducation.textContent = "No active enrollment";
      }
    }

    if (this.dom.hubStatusFamily) {
      const parentCount = (this.character.kin && this.character.kin.parents) ? this.character.kin.parents.filter(p => p.alive).length : 0;
      const siblingCount = (this.character.kin && this.character.kin.siblings) ? this.character.kin.siblings.filter(s => s.alive).length : 0;
      this.dom.hubStatusFamily.textContent = `${parentCount} parent(s) · ${siblingCount} sibling(s)`;
    }

    if (this.dom.hubStatusPets) {
      const petCount = (this.character.pets) ? this.character.pets.filter(p => p.alive).length : 0;
      this.dom.hubStatusPets.textContent = petCount > 0 ? `${petCount} companion animal(s)` : "No pets · Adoption available";
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  openActivityCategory(categoryKey) {
    const catData = (window.ACTIVITY_CATEGORIES_DATA && window.ACTIVITY_CATEGORIES_DATA[categoryKey]) || {
      name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
      desc: "Available pursuits in this sector",
      icon: "compass"
    };

    // Direct modal shortcuts
    if (catData.shortcut === 'careers') {
      this.closeActivitiesModal();
      this.openCareersModal();
      return;
    }
    if (catData.shortcut === 'education') {
      this.closeActivitiesModal();
      this.openEducationModal();
      return;
    }
    if (catData.shortcut === 'kin') {
      this.closeActivitiesModal();
      this.openKinModal();
      return;
    }
    if (catData.shortcut === 'pets') {
      this.closeActivitiesModal();
      this.openPetsModal();
      return;
    }
    if (catData.shortcut === 'dark_altar') {
      this.closeActivitiesModal();
      this.openDarkAltarModal();
      return;
    }

    this.activeActivityCategory = categoryKey;

    // Drill down to detail view with BitLife slide animation
    if (this.dom.activitiesHubView) this.dom.activitiesHubView.classList.add('hidden');
    if (this.dom.activitiesDetailView) {
      this.dom.activitiesDetailView.classList.remove('hidden', 'bitlife-drill-backward');
      this.dom.activitiesDetailView.classList.add('bitlife-drill-forward');
    }
    if (this.dom.btnBackActivitiesHub) this.dom.btnBackActivitiesHub.classList.remove('hidden');

    if (this.dom.activitiesHeaderTitle) this.dom.activitiesHeaderTitle.textContent = catData.name;
    if (this.dom.activitiesHeaderSubtitle) this.dom.activitiesHeaderSubtitle.textContent = catData.desc;

    if (this.dom.activityDetailTitle) this.dom.activityDetailTitle.textContent = catData.name;
    if (this.dom.activityDetailDesc) this.dom.activityDetailDesc.textContent = catData.desc;
    if (this.dom.activityDetailIcon) {
      this.dom.activityDetailIcon.setAttribute('data-lucide', catData.icon || 'compass');
    }

    this.renderActivityShortcuts(catData.shortcuts || []);
    this.renderActivitiesList(categoryKey);
  }

  renderActivityShortcuts(shortcuts) {
    if (!this.dom.activityShortcuts) return;
    const schoolStatus = this.character.education && this.character.education.graduationStatus;
    if (schoolStatus === 'expelled' || schoolStatus === 'dropped_out') shortcuts = shortcuts.filter(key => key !== 'education');
    const labels = {
      education: ['graduation-cap', 'Education'],
      careers: ['briefcase', 'Careers'],
      dark_altar: ['flame', 'Dark Altar'],
      terriblenet: ['radio-tower', 'TerribleNet']
    };
    if (!shortcuts.length) {
      this.dom.activityShortcuts.classList.add('hidden');
      this.dom.activityShortcuts.innerHTML = '';
      return;
    }
    this.dom.activityShortcuts.classList.remove('hidden');
    this.dom.activityShortcuts.innerHTML = shortcuts.map(key => {
      const [icon, label] = labels[key];
      return `<button data-activity-shortcut="${key}" class="min-h-[48px] px-3 rounded-xl bg-slatecard hover:bg-cardhover border border-leadborder text-sm font-serif font-bold text-parchment flex items-center justify-center gap-2"><i data-lucide="${icon}" class="w-4 h-4 text-amber-400"></i>${label}</button>`;
    }).join('');
    this.dom.activityShortcuts.querySelectorAll('[data-activity-shortcut]').forEach(button => {
      button.addEventListener('click', () => {
        const shortcut = button.dataset.activityShortcut;
        this.closeActivitiesModal();
        if (shortcut === 'education') this.openEducationModal();
        else if (shortcut === 'careers') this.openCareersModal();
        else if (shortcut === 'dark_altar') this.openDarkAltarModal();
        else if (shortcut === 'terriblenet') this.openTerribleNetModal();
      });
    });
  }

  closeActivityCategory() {
    this.activeActivityCategory = null;
    if (this.dom.activitiesHubView) {
      this.dom.activitiesHubView.classList.remove('hidden', 'bitlife-drill-forward');
      this.dom.activitiesHubView.classList.add('bitlife-drill-backward');
    }
    if (this.dom.activitiesDetailView) this.dom.activitiesDetailView.classList.add('hidden');
    if (this.dom.btnBackActivitiesHub) this.dom.btnBackActivitiesHub.classList.add('hidden');

    if (this.dom.activitiesHeaderTitle) this.dom.activitiesHeaderTitle.textContent = "Activities";
    if (this.dom.activitiesHeaderSubtitle) this.dom.activitiesHeaderSubtitle.textContent = "Choose how to spend your year";
    this.renderActivityShortcuts([]);

    this.renderActivitiesHub();
  }

  renderActivitiesList(categoryKey) {
    if (this.dom.activitiesStaminaText) this.dom.activitiesStaminaText.textContent = `Year ${this.character.age} Activities`;

    if (!this.dom.activitiesList) return;
    this.dom.activitiesList.innerHTML = '';

    // 1. Mount Interactive Sector Submenu Dashboard at top of category view
    if (window.TLLSubsystems && categoryKey) {
      const subHtml = window.TLLSubsystems.renderSectorSubmenuHTML(this.character, categoryKey, this._selectedColleagueId);
      if (subHtml) {
        const subWrap = document.createElement('div');
        subWrap.innerHTML = subHtml;
        this.dom.activitiesList.appendChild(subWrap);
        window.TLLSubsystems.bindSubsystemEvents(subWrap, this, () => this.renderActivitiesList(categoryKey));
      }
    }

    const list = window.ACTIVITIES_LIST || [];
    const categoryData = window.ACTIVITY_CATEGORIES_DATA && window.ACTIVITY_CATEGORIES_DATA[categoryKey];
    const includedCategories = categoryData && categoryData.categories ? categoryData.categories : [categoryKey];
    const filtered = list.filter(act => {
      if (this.character.age > act.maxAge) return false;
      if (categoryKey && !includedCategories.includes(act.category)) return false;
      return true;
    });

    if (filtered.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = "text-center py-8 px-4 bg-inputbg rounded-2xl border border-leadborder space-y-2";
      emptyCard.innerHTML = `
        <div class="w-10 h-10 mx-auto rounded-full bg-slatecard border border-leadborder flex items-center justify-center text-dust">
          <i data-lucide="hourglass" class="w-4 h-4"></i>
        </div>
        <div class="font-serif font-bold text-sm text-parchment">No Additional Pursuits at Age ${this.character.age}</div>
        <p class="text-xs text-dust leading-relaxed font-sans max-w-xs mx-auto">
          Advance the year by tapping <span class="font-mono text-crimson font-bold">Endure</span> to unlock older milestones in this sector.
        </p>
      `;
      this.dom.activitiesList.appendChild(emptyCard);
      if (window.lucide) {
        try { window.lucide.createIcons(); } catch (e) {}
      }
      return;
    }

    filtered.forEach(act => {
      const isLockedByAge = this.character.age < act.minAge;
      const consequenceRestriction = window.getActivityRestriction ? window.getActivityRestriction(this.character, act) : null;
      const card = document.createElement('div');
      card.dataset.actId = act.id;
      
      if (isLockedByAge) {
        card.className = "activity-card p-3.5 rounded-2xl border bg-inputbg/40 border-leadborder/40 opacity-60 transition-all space-y-2.5 shadow-xs";
      } else {
        card.className = "activity-card p-3.5 rounded-2xl border bg-inputbg hover:bg-cardhover border-leadborder transition-all space-y-2.5 shadow-xs";
      }

      const uses = (this.character.activityUses && this.character.activityUses[act.id]) || 0;
      const maxUses = act.maxPerYear !== undefined ? act.maxPerYear : 1;
      const isCapped = uses >= maxUses;
      const isDisabled = isLockedByAge || isCapped || !!consequenceRestriction;
      const isExpanded = this._expandedActivityId === act.id && !isDisabled;

      let btnLabel = isExpanded ? 'Close Submenu' : 'Open Submenu';
      if (isLockedByAge) {
        btnLabel = `Locked (Age ${act.minAge})`;
      } else if (isCapped) {
        btnLabel = 'Completed';
      } else if (consequenceRestriction) {
        btnLabel = 'Restricted';
      }

      const ageBadge = isLockedByAge 
        ? `<span class="text-[9px] font-mono px-2 py-0.5 rounded-md border font-semibold text-amber-400 bg-amber-500/10 border-amber-500/30 flex items-center gap-1">Req Age ${act.minAge}</span>`
        : `<span class="text-[10px] font-mono text-dust/80">Age ${act.minAge}–${act.maxAge}</span>`;

      const svgIcon = window.TLLSubsystems
        ? window.TLLSubsystems.getActivitySVGIcon(act, isLockedByAge)
        : `<i data-lucide="compass" class="w-4 h-4"></i>`;

      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl ${isLockedByAge ? 'bg-leadborder/20 text-dust/50' : 'bg-slatecard text-amber-400 border border-leadborder'} flex items-center justify-center shrink-0">
              ${svgIcon}
            </div>
            <div class="min-w-0">
              <h4 class="font-serif font-bold text-xs ${isLockedByAge ? 'text-parchment/60' : 'text-parchment'} truncate">${act.name}</h4>
              <span class="text-[9px] font-mono text-dust">${isLockedByAge ? 'Milestone' : `Uses: ${maxUses - uses}/${maxUses} remaining`}</span>
            </div>
          </div>
          ${ageBadge}
        </div>

        <p class="text-[11px] text-dust font-sans leading-relaxed">${act.desc}</p>
        ${consequenceRestriction ? `<p class="text-[10px] text-crimson font-mono leading-relaxed">${consequenceRestriction}</p>` : ''}

        ${isExpanded ? `
          <div class="pt-2.5 border-t border-leadborder/70 space-y-1.5">
            <span class="text-[9px] font-mono uppercase tracking-wider text-amber-300/90 block">Choose Approach</span>
            <div class="grid grid-cols-1 gap-1.5">
              <button data-act-approach="methodical" class="p-2.5 rounded-xl bg-slatecard hover:bg-cardhover border border-leadborder text-left flex items-center justify-between transition-all active:scale-[0.99]">
                <div>
                  <strong class="block font-serif text-xs text-parchment">Methodical &amp; Careful</strong>
                  <span class="text-[10px] text-dust font-mono">Balanced outcome · Preserves Sanity &amp; Composure (+Smarts)</span>
                </div>
                <span class="text-[10px] font-mono text-emerald-400 font-bold shrink-0">Safe</span>
              </button>
              <button data-act-approach="intense" class="p-2.5 rounded-xl bg-slatecard hover:bg-cardhover border border-leadborder text-left flex items-center justify-between transition-all active:scale-[0.99]">
                <div>
                  <strong class="block font-serif text-xs text-parchment">Bold &amp; All-In</strong>
                  <span class="text-[10px] text-dust font-mono">Amplified rewards · Higher physical/emotional intensity (+Happy)</span>
                </div>
                <span class="text-[10px] font-mono text-amber-300 font-bold shrink-0">Bold</span>
              </button>
              <button data-act-approach="occult" class="p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-700/50 text-left flex items-center justify-between transition-all active:scale-[0.99]">
                <div>
                  <strong class="block font-serif text-xs text-purple-200">Uncanny / Nocturnal Focus</strong>
                  <span class="text-[10px] text-purple-300/80 font-mono">Watch the shadows while acting · Chance for +Shillings (s.) &amp; +Occult</span>
                </div>
                <span class="text-[10px] font-mono text-shilling font-bold shrink-0">+Occult / s.</span>
              </button>
            </div>
          </div>
        ` : ''}

        <div class="flex justify-between items-center pt-2 border-t border-leadborder/60">
          <span class="text-[10px] font-mono ${isCapped ? 'text-emerald-400 font-semibold' : 'text-dust/90'} flex items-center gap-1">
            ${isCapped ? 'Completed this year' : `Available (${maxUses - uses}/${maxUses})`}
          </span>
          <button class="btn-do-activity px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
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
          this._expandedActivityId = (this._expandedActivityId === act.id) ? null : act.id;
          this.renderActivitiesList(categoryKey);
        });
      }

      card.querySelectorAll('[data-act-approach]').forEach(appBtn => {
        appBtn.addEventListener('click', () => {
          const approach = appBtn.dataset.actApproach;
          this._expandedActivityId = null;
          this.handleActivityClick(act.id, approach);
        });
      });

      this.dom.activitiesList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  handleActivityClick(activityId, approach = 'methodical') {
    const activity = (window.ACTIVITIES_LIST || []).find(item => item.id === activityId);
    if (!activity) return;

    const uses = (this.character.activityUses && this.character.activityUses[activityId]) || 0;
    const maxUses = activity.maxPerYear !== undefined ? activity.maxPerYear : 1;
    if (uses >= maxUses) {
      this.openFeedbackModal({
        tag: "ANNUAL LIMIT",
        title: "Done For This Year",
        icon: "check",
        iconColor: "text-amber-400",
        body: `You have already pursued ${activity.name} this year (${uses}/${maxUses}). Advance the year by tapping Endure to engage again!`,
        effects: {}
      });
      return;
    }

    const consequenceRestriction = activity && window.getActivityRestriction ? window.getActivityRestriction(this.character, activity) : null;
    const socialRestriction = activity && window.getSocialOpportunityRestriction ? window.getSocialOpportunityRestriction(this.character, activity) : null;
    const horrorRestriction = activity && window.getHorrorActivityGate ? window.getHorrorActivityGate(this.character, activity) : null;
    const restriction = consequenceRestriction || socialRestriction || horrorRestriction;
    if (restriction) {
      this.openFeedbackModal({ tag: 'CONSEQUENCE', title: 'Activity Restricted', icon: 'lock', iconColor: 'text-crimson', body: restriction, effects: {} });
      return;
    }
    const result = window.performActivity(activityId, this.character);
    if (!result || !result.success) {
      this.openFeedbackModal({
        tag: "PURSUIT BLOCKED",
        title: result ? (result.title || "Cannot Proceed") : "Action Denied",
        icon: "alert-circle",
        iconColor: "text-amber-400",
        body: result ? result.message : "Activity could not be performed.",
        effects: {}
      });
      return;
    }

    // Apply tactical approach modifier from the Activity Submenu
    result.effects = result.effects || {};
    if (approach === 'methodical') {
      this.modifyStat('smarts', 2);
      result.effects.Smarts = (result.effects.Smarts || 0) + 2;
      result.message += " Your methodical caution kept your nerves steady (+2% Smarts).";
    } else if (approach === 'intense') {
      this.modifyStat('happiness', 3);
      result.effects.Happiness = (result.effects.Happiness || 0) + 3;
      result.message += " Throwing yourself wholeheartedly into the pursuit left you invigorated (+3% Happiness).";
    } else if (approach === 'occult') {
      this.modifyStat('occult', 3);
      result.effects.Occult = (result.effects.Occult || 0) + 3;
      if (Math.random() < 0.45) {
        this.character.shillings = (this.character.shillings || 0) + 1;
        result.message += " Keeping your eyes peeled to the margins yielded +1 Paranormal Shilling (s.) and uncanny insight (+3% Occult).";
      } else {
        result.message += " Watching the shadows as you acted deepened your sensitivity to the unseen (+3% Occult).";
      }
    }

    if (activityId === 'sneak_basement' || activityId === 'radio_static' || activityId === 'midnight_seance' || activityId === 'ouija_board_communion') {
      window.soundEngine.playDread();
    } else {
      window.soundEngine.playTick();
    }

    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) latestLog.entries.push(`[${result.title}] ${result.message}`);
    const recoveryNotes = window.applyRecoveryFromActivity ? window.applyRecoveryFromActivity(this.character, activityId) : [];
    if (latestLog) recoveryNotes.forEach(note => latestLog.entries.push(`[Recovery] ${note}`));
    const reputationNotes = window.recordActivityReputation ? window.recordActivityReputation(this.character, activity, result) : [];
    if (latestLog) reputationNotes.forEach(note => latestLog.entries.push(`[Reputation] ${note}`));
    const lifeEffectNotes = window.processLifeOutcome ? window.processLifeOutcome(this.character, { activity, result }) : [];
    if (latestLog) lifeEffectNotes.forEach(note => latestLog.entries.push(`[Life Effect] ${note}`));
    if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: `activity_${activity?.category || 'general'}`, title: result.title, outcome: result.message, effects: result.effects, engaged: true, investigated: /research|study|record|investigat|explore/i.test(`${activityId} ${result.title} ${result.message}`) });
    if (window.recordEntityEncounter) window.recordEntityEncounter(this.character, { source: 'activity', title: result.title, outcome: result.message, effects: result.effects });

    this.checkMortality();
    this.renderAll();
    this.renderActivitiesList(this.activeActivityCategory);
    this.saveGame();

    // Show interactive feedback dialog modal
    this.openFeedbackModal({
      tag: "PURSUIT COMPLETED",
      title: result.title,
      icon: "sparkles",
      iconColor: "text-amber-400",
      body: result.message,
      effects: result.effects
    });
  }

  modifyStat(stat, delta) {
    if (this.character.stats[stat] !== undefined) {
      // Never decrease scores by 7% or more; max decrease is capped at 2-3 points (especially for sanity and mortality stats)
      const effectiveDelta = delta < 0 ? Math.max(-3, delta) : delta;
      this.character.stats[stat] = Math.max(0, Math.min(100, this.character.stats[stat] + effectiveDelta));
      if (effectiveDelta < -2) {
        window.soundEngine.playWhisper();
      }
    }
  }

  checkMortality() {
    if (!this.character || !this.character.isAlive) return;

    if (this.character.stats.vitality <= 0) {
      this.die("Physical Collapse", `Succumbed to bodily injury and extreme physical exhaustion. Pronounced dead at ${this.character.city} General Hospital.`);
      return;
    }
    if (this.character.stats.sanity <= 0) {
      if (!this.character.institution || this.character.institution.type !== 'asylum' || !this.character.institution.active) {
        commitToAsylum(this.character, 3, "Acute psychological collapse and delirium");
        this.character.stats.sanity = 25;
        this.modifyStat('vitality', -5);
        const latestLog = this.logs[this.logs.length - 1];
        if (latestLog) {
          latestLog.entries.push(`[INVOLUNTARY COMMITMENT] Your sanity shattered into screaming hallucinations. Orderlies from St. Dymphna's Asylum strapped you into a canvas straitjacket and admitted you under emergency hold (Sanity stabilized at 25%, 3-year commitment).`);
        }
        this.openFeedbackModal({
          tag: 'INVOLUNTARY COMMITMENT',
          title: "Committed to St. Dymphna's Asylum",
          icon: 'brain',
          iconColor: 'text-purple-400',
          body: "Your mind collapsed under unbearable psychological trauma. Orderlies arrived, administered heavy tranquilizers, and transported you to the closed ward of St. Dymphna's State Asylum under emergency medical detention.",
          effects: { sanity: 25, vitality: -5 }
        });
        return;
      } else {
        this.die("Mind Shattered", "Total psychological dissolution within the asylum walls. Slipped into irreversible catatonic silence; physical existence faded away.");
        return;
      }
    }
    if (this.character.stats.humanity <= 0) {
      this.die("Transcendence Beyond Flesh", "Humanity expired completely. Walked into the underground subway tunnels at midnight and never returned to the physical world.");
      return;
    }

    // Natural Old Age Mortality Check
    const age = this.character.age;
    if (age >= 70) {
      const vit = this.character.stats.vitality || 0;
      let deathChance = 0;

      if (age < 76) {
        if (vit < 40) deathChance = (40 - vit) * 0.012;
      } else if (age < 85) {
        const baseRisk = (age - 75) * 0.035;
        const frailtyRisk = Math.max(0, (60 - vit) * 0.01);
        deathChance = baseRisk + frailtyRisk;
      } else if (age < 95) {
        const baseRisk = 0.35 + (age - 85) * 0.05;
        const frailtyRisk = Math.max(0, (70 - vit) * 0.008);
        deathChance = Math.min(0.85, baseRisk + frailtyRisk);
      } else {
        deathChance = 0.90;
      }

      // Dark occult preservation
      if (this.character.stats.occult > 75) {
        deathChance *= 0.65;
      }

      if (Math.random() < deathChance) {
        let cause = "Old Age";
        let epitaph = `Drew their final breath quietly at age ${age} in ${this.character.city}. Decades of memories slipped away like fog over cold water.`;

        if (this.character.stats.occult >= 65) {
          cause = "Withdrawn into Shadow";
          epitaph = `At age ${age}, their physical form dissolved into dusk mist. Neighbors reported seeing their silhouette pacing the cemetery perimeter.`;
        } else if (vit < 15) {
          cause = "Senile Heart Failure";
          epitaph = `Their exhausted heart ceased beating in their sleep at age ${age}. The physician recorded long-term bodily wear.`;
        } else if (this.character.stats.sanity < 25) {
          cause = "Quiet Dementia";
          epitaph = `Faded gently into twilight dementia at age ${age}, speaking only with voices that no one else could perceive.`;
        }
        this.die(cause, epitaph);
      }
    }
  }

  die(cause, epitaph) {
    this.character.isAlive = false;
    this.character.deathCause = cause;
    this.character.epitaph = epitaph;
    if (window.recordPosthumousFame) window.recordPosthumousFame(this.character);

    this.addToCrypt(this.character);

    window.soundEngine.playDeath();
    this.vibrate([150, 100, 350]);

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

  // ==========================================
  // BITLIFE-STYLE MODAL ANIMATION & NAVIGATION ENGINE
  // ==========================================

  animateCloseModal(modalEl, onClosed, isPopup = false) {
    if (!modalEl) {
      if (onClosed) onClosed();
      return;
    }
    // If already hidden, return immediately
    if (modalEl.classList.contains('hidden') || modalEl.style.display === 'none') {
      modalEl.classList.remove('modal-closing');
      if (onClosed) onClosed();
      return;
    }
    // Prevent double trigger if already closing
    if (modalEl.classList.contains('modal-closing')) {
      return;
    }

    modalEl.classList.add('modal-closing');
    const delay = isPopup ? 180 : 200;

    setTimeout(() => {
      modalEl.classList.remove('modal-closing');
      modalEl.classList.add('hidden');
      modalEl.style.display = 'none';
      if (onClosed) onClosed();
    }, delay);
  }

  closeOtherPrimaryModals(exceptModal) {
    const primaryModals = [
      this.dom.profileModal,
      this.dom.kinModal,
      this.dom.activitiesModal,
      this.dom.creaturesModal
    ];
    primaryModals.forEach(m => {
      if (m && m !== exceptModal && !m.classList.contains('hidden')) {
        m.classList.add('hidden');
        m.classList.remove('modal-closing');
        m.style.display = 'none';
      }
    });
  }

  closeActivePrimaryModal() {
    const primaryModals = [
      this.dom.profileModal,
      this.dom.kinModal,
      this.dom.activitiesModal,
      this.dom.creaturesModal
    ];
    let animated = false;
    primaryModals.forEach(m => {
      if (m && !m.classList.contains('hidden') && m.style.display !== 'none') {
        this.animateCloseModal(m);
        animated = true;
      }
    });
    return animated;
  }

  hideModals() {
    const modals = [
      this.dom.dilemmaModal,
      this.dom.dilemmaBackdrop,
      this.dom.deathModal,
      this.dom.godmodeModal,
      this.dom.careersModal,
      this.dom.settingsModal,
      this.dom.themeModal,
      this.dom.kinModal,
      this.dom.kinDetailModal,
      this.dom.kinAskMoneyModal,
      this.dom.kinGiftModal,
      this.dom.kinFeedbackModal,
      this.dom.activitiesModal,
      this.dom.terribleNetModal,
      this.dom.revelationModal,
      this.dom.educationModal,
      this.dom.schoolChoiceModal,
      this.dom.schoolPersonModal,
      this.dom.profileModal,
      this.dom.creaturesModal,
      this.dom.creatureDetailModal,
      this.dom.caseDetailModal
    ];

    modals.forEach(m => {
      if (m) {
        m.classList.remove('modal-closing');
        m.classList.add('hidden');
        m.style.display = 'none';
      }
    });
  }

  setPrimaryNav(active) {
    const buttons = {
      life: this.dom.btnTabLife,
      people: this.dom.btnTabKin,
      creatures: this.dom.btnTabCreatures,
      activities: this.dom.btnTabActivities,
      profile: this.dom.btnTabProfile
    };
    Object.entries(buttons).forEach(([key, button]) => {
      if (!button) return;
      const selected = key === active;
      button.classList.toggle('is-active', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  openProfile() {
    if (!this.character || !this.dom.profileModal) return;
    window.soundEngine.playClick();
    this.closeOtherPrimaryModals(this.dom.profileModal);
    this.renderProfile();
    this.setPrimaryNav('profile');
    this.dom.profileModal.classList.remove('modal-closing', 'hidden');
    this.dom.profileModal.style.display = 'flex';
  }

  closeProfile() {
    if (!this.dom.profileModal) return;
    this.animateCloseModal(this.dom.profileModal, () => {
      this.setPrimaryNav('life');
    });
  }

  renderProfile() {
    const character = this.character;
    if (!character) return;
    window.drawGothicAvatar(this.dom.profileAvatar, { ...character.avatar, age: character.age });
    this.dom.profileName.textContent = character.name;
    this.dom.profileLifeSummary.textContent = `Age ${character.age} · ${character.statusTitle}`;
    const country = window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode];
    this.dom.profileLocation.textContent = [character.city, country ? country.name : character.countryCode].filter(Boolean).join(', ');
    if (character.institution && character.institution.active) {
      this.dom.profileOccupation.textContent = character.institution.type === 'asylum' ? 'Involuntary Patient' : 'Penitentiary Inmate';
    } else {
      this.dom.profileOccupation.textContent = character.job?.title || character.paranormalGig?.title || character.statusTitle || 'Unoccupied';
    }
    this.dom.profileTrait.textContent = character.trait?.name || 'None';
    this.dom.profileMoney.textContent = window.formatMoney(character.money, character.countryCode);
    this.dom.profileShillings.textContent = `${character.shillings} s.`;
    if (this.dom.profileHousing) {
      if (character.institution && character.institution.active) {
        const instColor = character.institution.type === 'asylum' ? 'text-purple-400 font-bold' : 'text-amber-500 font-bold';
        this.dom.profileHousing.innerHTML = `<span class="${instColor}">${character.institution.name} (${character.institution.yearsLeft}y left)</span>`;
      } else {
        const housingLabels = {
          family_home: 'Family Household',
          tenement_apartment: 'Rented Tenement',
          squalor_room: 'Dilapidated Flophouse',
          homeless: 'Homeless (Rough Sleeper)'
        };
        const housingKey = character.housing || (character.age < 18 ? 'family_home' : 'tenement_apartment');
        const isHomeless = housingKey === 'homeless';
        const isSqualor = housingKey === 'squalor_room';
        const color = isHomeless ? 'text-crimson font-bold' : (isSqualor ? 'text-amber-400' : 'text-parchment');
        this.dom.profileHousing.innerHTML = `<span class="${color}">${housingLabels[housingKey] || housingKey}</span>`;
      }
    }
    if (this.dom.profileReputation && window.reputationHtml) this.dom.profileReputation.innerHTML = window.reputationHtml(character);
    if (this.dom.profileRumors && window.rumorHtml) this.dom.profileRumors.innerHTML = window.rumorHtml(character);
    if (this.dom.profileConsequences && window.consequencesHtml) this.dom.profileConsequences.innerHTML = window.consequencesHtml(character);
    if (this.dom.profileBenefits && window.benefitsHtml) this.dom.profileBenefits.innerHTML = window.benefitsHtml(character);
    if (this.dom.profileStoryLedger && window.storyLedgerHtml) this.dom.profileStoryLedger.innerHTML = window.storyLedgerHtml(character);

    const stats = [
      ['Vitality', 'heart-pulse', 'text-red-400', character.stats.vitality, false],
      ['Happiness', 'smile', 'text-amber-400', character.stats.happiness, false],
      ['Sanity', 'brain', 'text-sky-400', character.stats.sanity, false],
      ['Humanity', 'scale', 'text-amber-500', character.stats.humanity, false],
      ['Smarts', 'book-open', 'text-emerald-400', character.stats.smarts, false],
      ['Looks', 'sparkles', 'text-pink-400', character.stats.looks, false],
      ['Occult Attunement', 'eye', 'text-purple-400', character.stats.occult, true]
    ];
    this.dom.profileStats.innerHTML = stats.map(([label, iconName, color, rawValue, isWide]) => {
      const value = Math.max(0, Math.min(100, Math.round(rawValue || 0)));
      const tierLabel = isWide
        ? (value >= 75 ? 'Veil-Touched' : value >= 40 ? 'Initiated' : value >= 15 ? 'Sensitive' : 'Unawakened')
        : (value >= 80 ? 'High' : value >= 45 ? 'Steady' : value >= 25 ? 'Strained' : 'Critical');
      return `<div class="profile-stat-row${isWide ? ' profile-stat-wide' : ''}">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-xs font-serif font-bold ${color} truncate">
            <i data-lucide="${iconName}" class="w-3.5 h-3.5 shrink-0"></i>
            <span class="truncate">${label}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[9px] font-mono uppercase tracking-wider text-dust">${tierLabel}</span>
            <strong class="font-mono text-xs text-parchment">${value}%</strong>
          </div>
        </div>
        <div class="primary-stat-track"><div class="h-full rounded-full bg-current ${color}" style="width:${value}%"></div></div>
      </div>`;
    }).join('');

    const tabsContainer = document.getElementById('profile-dossier-tabs');
    if (tabsContainer && !tabsContainer.dataset.bound) {
      tabsContainer.dataset.bound = 'true';
      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-profile-tab]');
        if (!btn) return;
        const tab = btn.dataset.profileTab || 'all';
        tabsContainer.querySelectorAll('[data-profile-tab]').forEach(pill => {
          pill.classList.toggle('is-active', pill === btn);
        });
        this.dom.profileModal?.querySelectorAll('[data-profile-pane]').forEach(pane => {
          const match = tab === 'all' || pane.dataset.profilePane === tab;
          pane.classList.toggle('hidden', !match);
        });
      });
    }
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
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

    this.dom.charAgeYear.textContent = `Age ${this.character.age} · ${this.character.year}`;
    
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
        <span class="text-xs leading-none font-bold text-red-100 group-hover:scale-110 transition-transform shrink-0 select-none">➕</span>
        <span class="font-serif text-[8.5px] font-bold whitespace-nowrap leading-none tracking-normal">ENDURE</span>
      `;
    }

    this.setPrimaryNav('life');
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

    this.logs.forEach((yearLog, yearIndex) => {
      const yearSection = document.createElement('div');
      yearSection.className = "timeline-year-group space-y-1 mb-4";
      if (yearIndex === this.logs.length - 1) {
        yearSection.classList.add('timeline-entry-animate');
      }

      // Elegant Age Milestone Banner
      const header = document.createElement('div');
      header.className = "flex items-center gap-3 my-2.5";
      header.innerHTML = `
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-leadborder/70 to-leadborder/70"></div>
        <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-inputbg/80 border border-leadborder/80 text-[11px] font-serif font-bold text-parchment tracking-wider shadow-xs">
          <span>Age ${yearLog.age}</span>
          <span class="text-dust/40">•</span>
          <span class="text-[10px] font-mono font-normal text-dust">${yearLog.year}</span>
        </div>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent via-leadborder/70 to-leadborder/70"></div>
      `;
      yearSection.appendChild(header);

      const list = document.createElement('div');
      list.className = "space-y-1 text-xs text-parchment/90 leading-relaxed";

      yearLog.entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = "flex items-start gap-2 py-1 px-2 rounded-lg hover:bg-slatecard/50 transition-colors";

        let iconHtml = `<span class="mt-0.5 text-dust/60 shrink-0 text-[10px] select-none">🔹</span>`;
        let textClass = "text-parchment/90 flex-1";

        if (entry.startsWith('[')) {
          if (/PROMOTION|SHELTER SECURED|UPGRADE|STABILIZED|RELEASED|PAROLE APPROVED/i.test(entry)) {
            iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 text-xs select-none">🏆</span>`;
            textClass = "text-emerald-300 font-medium flex-1";
          } else if (/EVICTION|TERMINATED|COMMITMENT|ARREST|PENITENTIARY|ASYLUM|CAUGHT|CORNERED/i.test(entry)) {
            iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-crimson/15 border border-crimson/30 text-crimson flex items-center justify-center shrink-0 text-xs select-none">🚨</span>`;
            textClass = "text-crimson font-medium flex-1";
          } else if (/AFFLICTION|AILMENT|CONSUMPTION|FEVER|MELANCHOLIA/i.test(entry)) {
            iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 text-xs select-none">🩺</span>`;
            textClass = "text-amber-300 font-medium flex-1";
          } else {
            iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 text-xs select-none">🔮</span>`;
            textClass = "text-purple-300 font-medium flex-1";
          }
        } else if (entry.startsWith('Deposited salary') || entry.startsWith('Starting Fiat Balance')) {
          iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 text-xs select-none">💵</span>`;
          textClass = "text-emerald-400 font-medium flex-1";
        } else if (entry.startsWith('Collected') || entry.startsWith('Secret Paranormal Shillings') || entry.startsWith('Signed an occult contract')) {
          iconHtml = `<span class="mt-0.5 w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 text-xs select-none">🪙</span>`;
          textClass = "text-amber-400 font-medium flex-1";
        }

        item.innerHTML = `
          ${iconHtml}
          <p class="${textClass}">${entry}</p>
        `;
        list.appendChild(item);
      });

      yearSection.appendChild(list);
      this.dom.logFeed.appendChild(yearSection);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }

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
    this.dom.btnClearCrypt.classList.toggle('hidden', this.crypt.length === 0);
    if (this.crypt.length === 0) {
      this.dom.cryptList.innerHTML = `
        <div class="min-h-full flex items-center justify-center py-8">
          <div class="w-full text-center bg-slatecard border border-leadborder rounded-2xl p-6 text-dust shadow-sm">
            <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-inputbg border border-leadborder flex items-center justify-center">
              <i data-lucide="archive" class="w-6 h-6 text-crimson opacity-70"></i>
            </div>
            <p class="font-serif font-bold text-base text-parchment">No past lives yet</p>
            <p class="text-[11px] text-dust/80 mt-2 leading-relaxed">When a life ends, its name, fate, and epitaph will be kept here.</p>
            <button id="btn-crypt-begin-life" class="mt-5 w-full min-h-[44px] rounded-xl bg-crimson hover:opacity-90 text-parchment font-serif font-bold text-xs tracking-wider active:scale-[0.98] transition-all">CREATE YOUR FIRST LIFE</button>
          </div>
        </div>
      `;
      document.getElementById('btn-crypt-begin-life')?.addEventListener('click', () => this.showScreen('screen-creator'));
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

  vibrate(pattern) {
    if (!this.vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  switchSettingsPanel(panelName) {
    const panels = {
      experience: this.dom.panelSettingsExperience,
      reading: this.dom.panelSettingsReading,
      theme: this.dom.panelSettingsTheme
    };
    const tabs = {
      experience: this.dom.tabSettingsExperience,
      reading: this.dom.tabSettingsReading,
      theme: this.dom.tabSettingsTheme
    };

    Object.entries(panels).forEach(([name, panel]) => {
      if (panel) panel.classList.toggle('hidden', name !== panelName);
    });
    Object.entries(tabs).forEach(([name, tab]) => {
      if (!tab) return;
      const isActive = name === panelName;
      tab.classList.toggle('bg-slatecard', isActive);
      tab.classList.toggle('border', isActive);
      tab.classList.toggle('border-leadborder', isActive);
      tab.classList.toggle('text-parchment', isActive);
      tab.classList.toggle('text-dust', !isActive);
      if (isActive) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  }

  openSettingsModal() {
    if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
    this.syncSettingsUI();
    this.renderThemesList();
    const modal = this.dom.settingsModal || this.dom.themeModal;
    if (modal) {
      this.switchSettingsPanel('experience');
      modal.classList.remove('modal-closing', 'hidden');
      modal.style.display = 'flex';
    }
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closeSettingsModal() {
    if (this.dom.settingsModal) {
      this.animateCloseModal(this.dom.settingsModal, null, true);
    }
    if (this.dom.themeModal && this.dom.themeModal !== this.dom.settingsModal) {
      this.animateCloseModal(this.dom.themeModal, null, true);
    }
  }

  openThemeModal() {
    this.openSettingsModal();
  }

  closeThemeModal() {
    this.closeSettingsModal();
  }

  setSoundEnabled(enabled) {
    if (window.soundEngine) {
      window.soundEngine.setMuted(!enabled);
      if (enabled && window.soundEngine.playClick) {
        window.soundEngine.playClick();
      }
    }
    this.syncSettingsUI();
  }

  setVibrationEnabled(enabled) {
    this.vibrationEnabled = !!enabled;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('TLL_VIBRATION', this.vibrationEnabled ? 'true' : 'false');
      }
    } catch (e) {}
    if (this.vibrationEnabled) {
      this.vibrate(35);
    }
    if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
    this.syncSettingsUI();
  }

  applyTextSize(size, playSound = true) {
    this.textSize = ['small', 'normal', 'large', 'huge'].includes(size) ? size : 'normal';
    if (window.applyTextSize) {
      window.applyTextSize(this.textSize);
    } else {
      document.documentElement.setAttribute('data-text-size', this.textSize);
      try {
        localStorage.setItem('TLL_TEXT_SIZE', this.textSize);
      } catch (e) {}
    }
    if (playSound && window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
    this.syncSettingsUI();
  }

  setTextSize(size) {
    this.applyTextSize(size, true);
  }

  setFont(fontId, playSound = true) {
    if (window.applyFont) {
      window.applyFont(fontId);
    } else {
      document.documentElement.setAttribute('data-font', fontId);
      try {
        localStorage.setItem('TLL_FONT_FAMILY', fontId);
      } catch (e) {}
    }
    if (playSound && window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
    this.syncSettingsUI();
  }

  syncSettingsUI() {
    const isMuted = window.soundEngine ? window.soundEngine.isMuted : false;
    const isSoundOn = !isMuted;

    // Update sound toggle buttons
    if (this.dom.btnSoundOff && this.dom.btnSoundOn) {
      if (isSoundOn) {
        this.dom.btnSoundOn.className = "px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold transition-all";
        this.dom.btnSoundOff.className = "px-2.5 py-1 rounded-md text-dust hover:text-parchment transition-all";
      } else {
        this.dom.btnSoundOff.className = "px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 font-bold transition-all";
        this.dom.btnSoundOn.className = "px-2.5 py-1 rounded-md text-dust hover:text-parchment transition-all";
      }
    }

    // Update landing mute icon
    if (this.dom.landingMuteIcon) {
      this.dom.landingMuteIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
    }
    if (this.dom.settingsSoundIcon) {
      this.dom.settingsSoundIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
      this.dom.settingsSoundIcon.className = `w-4 h-4 ${isMuted ? 'text-red-400' : 'text-emerald-400'}`;
    }

    // Update vibration toggle buttons
    if (this.dom.btnVibeOff && this.dom.btnVibeOn) {
      if (this.vibrationEnabled) {
        this.dom.btnVibeOn.className = "px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold transition-all";
        this.dom.btnVibeOff.className = "px-2.5 py-1 rounded-md text-dust hover:text-parchment transition-all";
      } else {
        this.dom.btnVibeOff.className = "px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 font-bold transition-all";
        this.dom.btnVibeOn.className = "px-2.5 py-1 rounded-md text-dust hover:text-parchment transition-all";
      }
    }
    if (this.dom.settingsVibeIcon) {
      this.dom.settingsVibeIcon.className = `w-4 h-4 ${this.vibrationEnabled ? 'text-sky-400' : 'text-dust'}`;
    }

    // Update text size buttons
    const curSize = this.textSize || 'normal';
    const textBtns = [
      { el: this.dom.btnTextSmall, key: 'small', label: 'Small' },
      { el: this.dom.btnTextNormal, key: 'normal', label: 'Normal' },
      { el: this.dom.btnTextLarge, key: 'large', label: 'Large' },
      { el: this.dom.btnTextHuge, key: 'huge', label: 'Huge' }
    ];

    textBtns.forEach(b => {
      if (!b.el) return;
      if (b.key === curSize) {
        b.el.className = "py-1 rounded-md bg-slatecard text-amber-300 border border-amber-500/50 font-bold shadow-xs transition-all";
      } else {
        b.el.className = "py-1 rounded-md text-dust hover:text-parchment transition-all";
      }
    });

    if (this.dom.settingsTextSizeLabel) {
      this.dom.settingsTextSizeLabel.textContent = curSize.toUpperCase();
    }

    // Update font toggle buttons and active label
    const activeFont = window.getSavedFont ? window.getSavedFont() : 'game-gothic';
    if (this.dom.btnFontGame && this.dom.btnFontDevice) {
      if (activeFont === 'game-gothic') {
        this.dom.btnFontGame.className = "py-1.5 px-2 rounded-md bg-slatecard text-sky-300 border border-sky-500/50 font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5";
        this.dom.btnFontDevice.className = "py-1.5 px-2 rounded-md text-dust hover:text-parchment transition-all flex items-center justify-center space-x-1.5";
      } else if (activeFont === 'device-system') {
        this.dom.btnFontDevice.className = "py-1.5 px-2 rounded-md bg-slatecard text-sky-300 border border-sky-500/50 font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5";
        this.dom.btnFontGame.className = "py-1.5 px-2 rounded-md text-dust hover:text-parchment transition-all flex items-center justify-center space-x-1.5";
      } else {
        this.dom.btnFontGame.className = "py-1.5 px-2 rounded-md text-dust hover:text-parchment transition-all flex items-center justify-center space-x-1.5";
        this.dom.btnFontDevice.className = "py-1.5 px-2 rounded-md text-dust hover:text-parchment transition-all flex items-center justify-center space-x-1.5";
      }
    }
    if (this.dom.settingsFontActiveLabel && window.FONTS_DATA) {
      const curFontObj = window.FONTS_DATA.find(f => f.id === activeFont);
      this.dom.settingsFontActiveLabel.textContent = curFontObj ? curFontObj.name : 'Game Font';
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  renderThemesList() {
    if (!this.dom.themeListContainer || !window.THEMES_DATA) return;
    this.dom.themeListContainer.innerHTML = '';
    const activeId = window.getActiveThemeId ? window.getActiveThemeId() : 'morgue-ledger';

    window.THEMES_DATA.forEach(theme => {
      const isActive = theme.id === activeId;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `identity-theme-card w-full p-3 rounded-xl border transition-all cursor-pointer text-left active:scale-[0.98] ${isActive ? 'bg-cardhover border-crimson/50 ring-1 ring-crimson/30 shadow-md' : 'bg-slatecard hover:bg-cardhover border-leadborder'}`;
      card.setAttribute('aria-pressed', String(isActive));

      const swatchesHtml = `
        <div class="flex items-center -space-x-1 shrink-0 p-1 rounded-lg bg-inputbg border border-leadborder">
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[0]}"></span>
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[1]}"></span>
          <span class="w-4 h-4 rounded-full border border-leadborder shadow-xs" style="background-color: ${theme.swatches[2]}"></span>
        </div>
      `;

      const tagLabel = theme.tag || (theme.mode === 'dark' ? 'Dark' : 'Light');
      const tagStyle = theme.mode === 'dark' ? 'bg-inputbg text-sky-400 border-sky-900/50' : 'bg-[#fef9c3] text-amber-900 border-amber-300';

      card.innerHTML = `
        <div class="flex items-center space-x-3 min-w-0">
          ${swatchesHtml}
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-1.5">
              <h4 class="font-serif font-bold text-xs text-parchment truncate">${theme.name}</h4>
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border ${tagStyle}">${tagLabel}</span>
            </div>
            <p class="text-[10px] text-dust mt-1 leading-relaxed">${theme.desc}</p>
          </div>
          ${isActive 
            ? `<span class="p-1.5 rounded-full bg-crimson/15 border border-crimson/40 text-crimson flex items-center justify-center shrink-0"><i data-lucide="check" class="w-3.5 h-3.5"></i></span>`
            : `<span class="text-[10px] font-mono text-dust/60 px-2 py-0.5 rounded bg-inputbg border border-leadborder/60 shrink-0">Select</span>`
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

  // ==========================================
  // EDUCATION & SCHOOL SYSTEM
  // ==========================================

  updateOccupationTab() {
    if (!this.dom.occupationTabIcon || !this.dom.occupationTabLabel) return;

    if (this.character && this.character.age <= 17 && (!this.character.education || !this.character.education.enrolled)) {
      if (!this.character.education || (this.character.education.graduationStatus !== 'expelled' && this.character.education.graduationStatus !== 'dropped_out')) {
        if (window.enrollInSchool) window.enrollInSchool(this.character);
      }
    }

    const isEnrolled = this.character && this.character.education && this.character.education.enrolled;
    const isSchoolAge = this.character && this.character.age <= 17 && (!this.character.education || this.character.education.graduationStatus !== 'expelled');

    if (isEnrolled || isSchoolAge) {
      this.dom.occupationTabIcon.setAttribute('data-lucide', 'graduation-cap');
      let label = 'School';
      if (this.character.education && this.character.education.level === 'daycare') label = 'Daycare';
      else if (this.character.education && this.character.education.level === 'kindergarten') label = 'Kinder';
      else if (this.character.education && this.character.education.level === 'elementary') label = 'School';
      else if (this.character.education && this.character.education.level === 'middle') label = 'School';
      else if (this.character.education && this.character.education.level === 'high') label = 'School';
      else if (this.character.education && this.character.education.level === 'university') label = 'University';
      this.dom.occupationTabLabel.textContent = label;
    } else {
      this.dom.occupationTabIcon.setAttribute('data-lucide', 'briefcase');
      this.dom.occupationTabLabel.textContent = 'Careers';
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  // ==========================================
  // SCHOOL CHOICE & TRACK SYSTEM
  // ==========================================

  checkPendingSchoolChoice() {
    if (this.character && this.character.pendingSchoolChoice && !this.character.isDead) {
      const pending = this.character.pendingSchoolChoice;
      this.character.pendingSchoolChoice = null;
      this.openSchoolChoiceModal(pending.targetLevel || 'elementary', false);
      return true;
    }
    return false;
  }

  openSchoolChoiceModal(targetLevel = 'kindergarten', isTransfer = false) {
    if (!this.character || this.character.isDead) return;
    this.pendingSchoolChoiceTargetLevel = targetLevel;
    this.isSchoolTransfer = isTransfer;
    this.selectedSchoolTrack = (this.character.education && this.character.education.schoolType) || 'public';

    const levelLabels = {
      kindergarten: 'Kindergarten (Ages 4-5)',
      elementary: 'Elementary School (Ages 6-10)',
      middle: 'Middle School (Ages 11-13)',
      high: 'High School (Ages 14-17)'
    };

    if (this.dom.schoolChoiceTitle) {
      this.dom.schoolChoiceTitle.textContent = isTransfer
        ? `Transfer Educational Track`
        : `Educational Pathway (${levelLabels[targetLevel] || 'School'})`;
    }

    if (this.dom.schoolChoiceSubtitle) {
      this.dom.schoolChoiceSubtitle.textContent = isTransfer
        ? `Request mid-tier transfer to a different institutional environment or home study`
        : `Select your educational pathway and secure required tuition financing`;
    }

    // Update tuition display labels for paid tracks
    if (this.dom.labelTuitionPrivate && window.getTuitionCost) {
      const privCost = window.getTuitionCost(this.character, 'private', targetLevel);
      this.dom.labelTuitionPrivate.textContent = `${window.formatMoney ? window.formatMoney(privCost, this.character.countryCode) : '$' + privCost} / yr`;
    }
    if (this.dom.labelTuitionElite && window.getTuitionCost) {
      const eliteCost = window.getTuitionCost(this.character, 'elite', targetLevel);
      this.dom.labelTuitionElite.textContent = `${window.formatMoney ? window.formatMoney(eliteCost, this.character.countryCode) : '$' + eliteCost} / yr`;
    }

    if (this.dom.schoolChoiceFeedback) {
      this.dom.schoolChoiceFeedback.classList.add('hidden');
      this.dom.schoolChoiceFeedback.innerHTML = '';
    }

    this.selectSchoolChoiceTrack(this.selectedSchoolTrack);

    if (this.dom.schoolChoiceModal) {
      this.dom.schoolChoiceModal.classList.remove('modal-closing', 'hidden');
      this.dom.schoolChoiceModal.style.display = 'flex';
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  closeSchoolChoiceModal() {
    if (this.dom.schoolChoiceModal) {
      this.animateCloseModal(this.dom.schoolChoiceModal);
    }
  }

  selectSchoolChoiceTrack(trackId) {
    this.selectedSchoolTrack = trackId;
    const track = (window.SCHOOL_TRACKS && window.SCHOOL_TRACKS[trackId]) || (window.SCHOOL_TRACKS && window.SCHOOL_TRACKS.public) || { name: 'Public School', baseCost: 0 };

    if (this.dom.schoolTrackCards) {
      this.dom.schoolTrackCards.forEach(card => {
        if (card.dataset.track === trackId) {
          card.classList.add('active-track');
        } else {
          card.classList.remove('active-track');
        }
      });
    }

    const cost = window.getTuitionCost ? window.getTuitionCost(this.character, trackId, this.pendingSchoolChoiceTargetLevel || 'elementary') : 0;

    if (this.dom.selectedTrackName) {
      this.dom.selectedTrackName.textContent = track.name;
    }
    if (this.dom.selectedTrackCost) {
      this.dom.selectedTrackCost.textContent = cost > 0 
        ? `${window.formatMoney ? window.formatMoney(cost, this.character.countryCode) : '$' + cost} Annual Tuition`
        : 'Free / Zero Tuition';
    }

    if (cost === 0) {
      if (this.dom.fundingActionsFree) this.dom.fundingActionsFree.classList.remove('hidden');
      if (this.dom.fundingActionsPaid) this.dom.fundingActionsPaid.classList.add('hidden');
    } else {
      if (this.dom.fundingActionsFree) this.dom.fundingActionsFree.classList.add('hidden');
      if (this.dom.fundingActionsPaid) this.dom.fundingActionsPaid.classList.remove('hidden');

      if (this.dom.labelPaySelfBtn) {
        const canAfford = (this.character.money || 0) >= cost;
        this.dom.labelPaySelfBtn.textContent = `Pay Tuition Myself (${window.formatMoney ? window.formatMoney(this.character.money || 0, this.character.countryCode) : '$' + (this.character.money || 0)} available)${canAfford ? '' : ' - Insufficient'}`;
      }
    }

    if (this.dom.schoolChoiceFeedback) {
      this.dom.schoolChoiceFeedback.classList.add('hidden');
    }
  }

  handleEnrollInTrack(tuitionPayer) {
    const trackId = this.selectedSchoolTrack || 'public';
    const targetLevel = this.pendingSchoolChoiceTargetLevel || (this.character.education ? this.character.education.level : 'elementary');

    if (tuitionPayer === 'self') {
      const edu = this.character.education || {};
      const currGrades = edu.grades !== undefined ? edu.grades : 75;
      const currDisc = edu.disciplinaryRecord || 0;
      if (trackId === 'private' && (currGrades < 75 || currDisc > 1)) {
        this.showSchoolChoiceFeedback(`ADMISSIONS REJECTED: Private Preparatory Academies require 75%+ Grades (Current: ${currGrades}%) and at most 1 Disciplinary Mark (Current: ${currDisc}).`, "text-rose-400");
        window.soundEngine.playDread();
        return;
      }
      if (trackId === 'elite') {
        if (this.character.age < 6 || targetLevel === 'nursery' || targetLevel === 'daycare' || targetLevel === 'kindergarten') {
          this.showSchoolChoiceFeedback("ADMISSIONS REJECTED: The Elite Aristocratic Academy does not matriculate students before Elementary School (Age 6+).", "text-rose-400");
          window.soundEngine.playDread();
          return;
        }
        if (currGrades < 90 || currDisc > 0) {
          this.showSchoolChoiceFeedback(`ADMISSIONS REJECTED: The Elite Academy requires 90%+ Grades (Current: ${currGrades}%) and 0 Disciplinary Marks (Current: ${currDisc}).`, "text-rose-400");
          window.soundEngine.playDread();
          return;
        }
      }
      const cost = window.getTuitionCost ? window.getTuitionCost(this.character, trackId, targetLevel) : 0;
      if ((this.character.money || 0) < cost) {
        this.showSchoolChoiceFeedback("You do not have enough funds in your personal savings to pay the tuition fee.", "text-rose-400");
        return;
      }
      this.character.money -= cost;
    }

    const newSchool = window.enrollInSchool(this.character, targetLevel, null, trackId, tuitionPayer);

    const latestLog = this.logs[this.logs.length - 1];
    const payerLabels = {
      free: "cost-free",
      parents: "financed by parents",
      scholarship: "on 100% scholarship",
      self: "paid personally"
    };
    const desc = this.isSchoolTransfer
      ? `Transferred to ${newSchool.name} (${newSchool.schoolType}, ${payerLabels[tuitionPayer] || 'enrolled'}).`
      : `Enrolled in ${newSchool.name} (${newSchool.schoolType}, ${payerLabels[tuitionPayer] || 'enrolled'}).`;

    if (latestLog) {
      latestLog.entries.push(desc);
    }

    this.closeSchoolChoiceModal();
    this.renderAll();
    if (this.dom.educationModal && !this.dom.educationModal.classList.contains('hidden')) {
      this.renderEducationModal('overview');
    }
    this.saveGame();

    this.openFeedbackModal({
      tag: "ACADEMIC ADMISSIONS",
      title: this.isSchoolTransfer ? "Transfer Approved!" : "Enrolled Successfully!",
      icon: "graduation-cap",
      iconColor: "text-purple-400",
      body: `You are now officially matriculated at ${newSchool.name} (${newSchool.schoolType.toUpperCase()}) with tuition ${payerLabels[tuitionPayer] || 'settled'}.`,
      effects: {}
    });
  }

  handleAskParentsTuition() {
    const trackId = this.selectedSchoolTrack;
    const targetLevel = this.pendingSchoolChoiceTargetLevel || (this.character.education ? this.character.education.level : 'elementary');

    if (!window.askParentsForTuition) return;
    const res = window.askParentsForTuition(this.character, trackId, targetLevel);

    if (res.granted) {
      this.handleEnrollInTrack('parents');
    } else {
      this.showSchoolChoiceFeedback(res.reason || "Your parents refused to cover this school tuition.", "text-rose-400");
      window.soundEngine.playDread();
    }
  }

  handleApplyScholarship() {
    const trackId = this.selectedSchoolTrack;
    const targetLevel = this.pendingSchoolChoiceTargetLevel || (this.character.education ? this.character.education.level : 'elementary');

    if (!window.applyForScholarship) return;
    const res = window.applyForScholarship(this.character, trackId, targetLevel);

    if (res.granted) {
      this.handleEnrollInTrack('scholarship');
    } else {
      this.showSchoolChoiceFeedback(res.reason || "Admissions scholarship examination was unsuccessful.", "text-rose-400");
      window.soundEngine.playDread();
    }
  }

  showSchoolChoiceFeedback(msg, colorClass = "text-parchment") {
    if (this.dom.schoolChoiceFeedback) {
      this.dom.schoolChoiceFeedback.innerHTML = `<span class="${colorClass}">${msg}</span>`;
      this.dom.schoolChoiceFeedback.classList.remove('hidden');
    }
  }

  openEducationModal(activeTab = 'overview') {
    const schoolStatus = this.character.education && this.character.education.graduationStatus;
    if (schoolStatus === 'expelled' || schoolStatus === 'dropped_out') {
      this.openFeedbackModal({ tag: 'EDUCATION CLOSED', title: schoolStatus === 'expelled' ? 'Expelled' : 'No Longer Enrolled', icon: 'school', iconColor: 'text-crimson', body: schoolStatus === 'expelled' ? 'Your former school is no longer an active location. Its people and facilities cannot be accessed after expulsion.' : 'You are no longer enrolled at that institution.', effects: {} });
      return;
    }
    if (this.character && this.character.age <= 17 && (!this.character.education || !this.character.education.enrolled)) {
      if (!this.character.education || (this.character.education.graduationStatus !== 'expelled' && this.character.education.graduationStatus !== 'dropped_out')) {
        if (window.enrollInSchool) window.enrollInSchool(this.character);
      }
    }
    if (!this.character.education || !this.character.education.enrolled) {
      if (this.character.age >= 18 && this.character.hasHighSchoolDiploma) {
        // Can open higher education admissions
      } else if (this.character.age <= 17 && schoolStatus !== 'expelled' && schoolStatus !== 'dropped_out') {
        if (window.enrollInSchool) window.enrollInSchool(this.character);
      } else {
        this.openCareersModal();
        return;
      }
    }

    this.activeEducationTab = activeTab || 'overview';
    this.renderEducationModal(this.activeEducationTab);
    this.dom.educationModal.classList.remove('modal-closing', 'hidden');
    this.dom.educationModal.style.display = 'flex';
  }

  closeEducationModal() {
    if (this.dom.educationModal) {
      this.animateCloseModal(this.dom.educationModal);
    }
  }

  renderEducationModal(activeTab = 'overview') {
    const edu = this.character.education;
    if (!edu) return;

    this.activeEducationTab = activeTab;

    // Header labels
    if (this.dom.eduSchoolName) this.dom.eduSchoolName.textContent = edu.name;
    if (this.dom.eduSchoolTrackBadge) {
      const track = (window.SCHOOL_TRACKS && window.SCHOOL_TRACKS[edu.schoolType]) || (window.SCHOOL_TRACKS && window.SCHOOL_TRACKS.public) || { name: 'Public School', badgeClass: 'badge-track-public' };
      this.dom.eduSchoolTrackBadge.textContent = track.name;
      this.dom.eduSchoolTrackBadge.className = `text-[9px] font-mono px-1.5 py-0.5 rounded ${track.badgeClass} uppercase font-bold`;
    }
    if (this.dom.eduTuitionStatusBadge) {
      if (edu.schoolType === 'homeschool' || edu.schoolType === 'public') {
        this.dom.eduTuitionStatusBadge.textContent = 'Free';
        this.dom.eduTuitionStatusBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-inputbg border border-leadborder text-dust';
      } else if (edu.tuitionPayer === 'scholarship') {
        this.dom.eduTuitionStatusBadge.textContent = '100% Scholarship';
        this.dom.eduTuitionStatusBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300 font-bold';
      } else if (edu.tuitionPayer === 'parents') {
        this.dom.eduTuitionStatusBadge.textContent = 'Parent-Funded';
        this.dom.eduTuitionStatusBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold';
      } else if (edu.tuitionPayer === 'self') {
        this.dom.eduTuitionStatusBadge.textContent = 'Self-Funded';
        this.dom.eduTuitionStatusBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold';
      } else {
        this.dom.eduTuitionStatusBadge.textContent = 'Enrolled';
        this.dom.eduTuitionStatusBadge.className = 'text-[9px] font-mono px-1.5 py-0.5 rounded bg-inputbg border border-leadborder text-dust';
      }
    }
    if (this.dom.btnEduTransferTrack) {
      if (edu.level === 'nursery' || edu.level === 'daycare' || edu.level === 'university') {
        this.dom.btnEduTransferTrack.classList.add('hidden');
      } else {
        this.dom.btnEduTransferTrack.classList.remove('hidden');
      }
    }
    if (this.dom.eduSchoolLevelBadge) {
      const levelLabels = {
        nursery: 'Home Nursery & Crib',
        daycare: 'Toddler Creche & Playgroup',
        kindergarten: 'Kindergarten',
        elementary: 'Elementary School',
        middle: 'Middle School',
        high: 'High School',
        university: 'University'
      };
      this.dom.eduSchoolLevelBadge.textContent = levelLabels[edu.level] || 'School';
    }
    if (this.dom.eduSchoolGradeLabel) {
      if (edu.level === 'nursery') this.dom.eduSchoolGradeLabel.textContent = `Infant Year ${Math.max(1, this.character.age + 1)}`;
      else if (edu.level === 'daycare') this.dom.eduSchoolGradeLabel.textContent = `Toddler Room ${Math.max(1, this.character.age - 1)}`;
      else if (edu.level === 'kindergarten') this.dom.eduSchoolGradeLabel.textContent = `Kindergarten Year ${edu.gradeYear}`;
      else if (edu.level === 'university') this.dom.eduSchoolGradeLabel.textContent = `${edu.major || 'Undergraduate'} · Year ${edu.gradeYear}`;
      else this.dom.eduSchoolGradeLabel.textContent = `Grade ${edu.gradeYear}`;
    }

    // Performance Bars
    const grades = Math.max(0, Math.min(100, edu.grades || 75));
    const popularity = Math.max(0, Math.min(100, edu.popularity || 50));
    let letter = 'C';
    if (grades >= 90) letter = 'A+';
    else if (grades >= 80) letter = 'A';
    else if (grades >= 70) letter = 'B';
    else if (grades >= 60) letter = 'C';
    else if (grades >= 50) letter = 'D';
    else letter = 'F';

    const isNursery = edu.level === 'nursery';
    const isDaycare = edu.level === 'daycare' || isNursery;
    const isKindergarten = edu.level === 'kindergarten';
    const isEarlyYears = isDaycare || isKindergarten;
    if (this.dom.eduLabelGrades) {
      this.dom.eduLabelGrades.innerHTML = `<i data-lucide="${isEarlyYears ? 'shapes' : 'book-open'}" class="w-3 h-3"></i> ${isNursery ? 'Sensory Milestones' : (edu.level === 'daycare' ? 'Toddler Development' : (isKindergarten ? 'School Readiness' : 'Academic Grades'))}`;
    }
    if (this.dom.eduValGrades) this.dom.eduValGrades.textContent = isEarlyYears ? `${grades}%` : `${grades}% (${letter})`;
    if (this.dom.eduBarGrades) this.dom.eduBarGrades.style.width = `${grades}%`;
    if (this.dom.eduLabelPopularity) {
      this.dom.eduLabelPopularity.innerHTML = `<i data-lucide="${isDaycare ? 'heart-handshake' : 'award'}" class="w-3 h-3"></i> ${isNursery ? 'Crib Attachment' : (edu.level === 'daycare' ? 'Comfort & Trust' : (isKindergarten ? 'Classroom Confidence' : 'School Popularity'))}`;
    }
    if (this.dom.eduValPopularity) {
      this.dom.eduValPopularity.textContent = edu.schoolType === 'homeschool' && !isEarlyYears ? `Autonomy` : `${popularity}%`;
    }
    if (this.dom.eduBarPopularity) this.dom.eduBarPopularity.style.width = `${popularity}%`;

    // Disciplinary Banner
    if (!isEarlyYears && edu.disciplinaryRecord && edu.disciplinaryRecord > 0) {
      if (this.dom.eduDisciplinaryBanner) {
        this.dom.eduDisciplinaryBanner.classList.remove('hidden');
        this.dom.eduDisciplinaryBanner.style.display = 'flex';
      }
      if (this.dom.eduDisciplinaryCount) this.dom.eduDisciplinaryCount.textContent = edu.disciplinaryRecord;
    } else {
      if (this.dom.eduDisciplinaryBanner) {
        this.dom.eduDisciplinaryBanner.classList.add('hidden');
        this.dom.eduDisciplinaryBanner.style.display = 'none';
      }
    }

    if (this.dom.labelEduStudy) this.dom.labelEduStudy.textContent = isNursery ? 'Observe Crib Mobile' : (edu.level === 'daycare' ? 'Practice a Skill' : (isKindergarten ? 'Practice Letters' : 'Study Harder'));
    if (this.dom.labelEduSkip) this.dom.labelEduSkip.textContent = isNursery ? 'Fuss in Crib' : (edu.level === 'daycare' ? 'Refuse Nap' : (isKindergarten ? 'Avoid Circle Time' : 'Skip Class'));
    if (this.dom.tabEduClassmates) this.dom.tabEduClassmates.textContent = isNursery ? 'Cribmates' : (edu.level === 'daycare' ? 'Playmates' : 'Classmates');
    if (this.dom.tabEduTeachers) this.dom.tabEduTeachers.textContent = isDaycare ? 'Caregivers' : 'Teachers';

    // Drop out container (High school or University only)
    if (this.dom.eduDropoutContainer) {
      if (edu.level === 'high' || edu.level === 'university') {
        this.dom.eduDropoutContainer.classList.remove('hidden');
      } else {
        this.dom.eduDropoutContainer.classList.add('hidden');
      }
    }

    // Tab buttons active styling
    const tabs = ['overview', 'classmates', 'teachers', 'staff'];
    tabs.forEach(t => {
      const btn = this.dom['tabEdu' + t.charAt(0).toUpperCase() + t.slice(1)];
      const panel = this.dom['eduPanel' + t.charAt(0).toUpperCase() + t.slice(1)];
      if (btn) {
        if (t === activeTab) {
          btn.className = "py-1.5 rounded-lg bg-slatecard text-parchment font-serif font-bold transition-all text-center flex flex-col items-center justify-center border border-leadborder shadow-sm edu-tab-active";
        } else {
          btn.className = "py-1.5 rounded-lg text-dust hover:text-parchment font-serif font-semibold transition-all text-center flex flex-col items-center justify-center border border-transparent edu-tab-inactive";
        }
      }
      if (panel) {
        if (t === activeTab) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    });

    // Populate active tab panel
    if (activeTab === 'overview') {
      this.renderSchoolOverviewTab();
    } else if (activeTab === 'classmates') {
      this.renderSchoolClassmatesTab();
    } else if (activeTab === 'teachers') {
      this.renderSchoolTeachersTab();
    } else if (activeTab === 'staff') {
      this.renderSchoolStaffTab();
    }

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  renderSchoolOverviewTab() {
    const edu = this.character.education;
    if (!edu) return;

    // 0. Stage-Specific Developmental & Academic Submenu
    if (this.dom.eduPanelOverview) {
      let stageSection = document.getElementById('edu-stage-submenu-section');
      if (!stageSection) {
        stageSection = document.createElement('div');
        stageSection.id = 'edu-stage-submenu-section';
        stageSection.className = 'mb-3';
        this.dom.eduPanelOverview.insertBefore(stageSection, this.dom.eduPanelOverview.firstChild);
      }
      const stageActions = window.getStageSchoolActions ? window.getStageSchoolActions(this.character) : [];
      const stageTitleMap = {
        nursery: 'Infant Crib & Sensory Milestones (Ages 0–1)',
        daycare: 'Toddler Creche & Playgroup Submenu (Ages 2–3)',
        kindergarten: 'Kindergarten Readiness & Recess (Ages 4–5)',
        elementary: 'Elementary Classroom & Playground (Ages 6–10)',
        middle: 'Middle School Cliques & Placement Prep (Ages 11–13)',
        high: 'High School Honours, Council & Secret Orders (Ages 14–17)',
        university: 'University Department & Research Submenu (Ages 18+)'
      };
      const doneMap = edu.stageActionsThisYear || {};
      const credBadges = [];
      if (this.character.hasEarlyReaderBuff) credBadges.push('Early Reader ★');
      if (edu.academicRibbon || this.character.hasAcademicRibbon) credBadges.push('Academic Ribbon ★');
      if (edu.socialClique) credBadges.push(edu.socialClique);
      if (edu.studentCouncilRank) credBadges.push(edu.studentCouncilRank);
      if (this.character.isPrepAlumni) credBadges.push('Prep Alumni');
      if (this.character.isEliteAlumni) credBadges.push('Elite Alumni');

      stageSection.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <h4 class="text-[10px] font-mono uppercase tracking-wider text-edu-teal flex items-center gap-1.5 font-bold">
            <i data-lucide="compass" class="w-3.5 h-3.5"></i>
            <span>${stageTitleMap[edu.level] || 'Stage Activities & Pursuits'}</span>
          </h4>
          ${credBadges.length > 0 ? `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded badge-edu-amber font-bold">${credBadges.join(' · ')}</span>` : ''}
        </div>
        <div id="edu-stage-actions-list" class="space-y-1.5"></div>
      `;
      const listEl = stageSection.querySelector('#edu-stage-actions-list');
      stageActions.forEach(act => {
        const isDone = !!doneMap[act.id];
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-2.5 rounded-xl bg-inputbg border border-leadborder text-xs transition-all";
        row.innerHTML = `
          <div class="flex items-center space-x-2.5 min-w-0 pr-2">
            <div class="w-7 h-7 rounded-lg bg-slatecard border border-leadborder flex items-center justify-center text-edu-teal shrink-0">
              <i data-lucide="${(act.icon || 'sparkles').toLowerCase()}" class="w-3.5 h-3.5"></i>
            </div>
            <div class="min-w-0">
              <div class="font-serif font-bold text-parchment flex items-center gap-1.5 flex-wrap">
                <span>${act.label}</span>
                ${act.badge ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slatecard border border-leadborder text-dust">${act.badge}</span>` : ''}
              </div>
              <div class="text-[10px] text-dust leading-snug">${act.desc}</div>
            </div>
          </div>
          <button class="btn-stage-act shrink-0 ml-2 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            isDone
              ? 'bg-slatecard/50 text-dust border border-leadborder opacity-60 cursor-not-allowed'
              : 'bg-slatecard hover:bg-cardhover text-edu-teal border border-leadborder active:scale-95'
          }" ${isDone ? 'disabled' : ''}>
            ${isDone ? 'Done' : 'Pursue'}
          </button>
        `;
        const btn = row.querySelector('.btn-stage-act');
        if (btn && !isDone) {
          btn.addEventListener('click', () => {
            this.handleSchoolAction('stage_action', act.id);
          });
        }
        listEl.appendChild(row);
      });
    }

    // 1. Clubs (with Rank & Interactive Sub-Actions)
    if (this.dom.eduClubsList) {
      this.dom.eduClubsList.innerHTML = '';
      const availableClubs = (window.SCHOOL_CLUBS || []).filter(c => c.reqLevel.includes(edu.level));
      if (this.dom.eduClubsCount) {
        this.dom.eduClubsCount.textContent = `${(edu.clubs || []).length} Active`;
      }

      if (availableClubs.length === 0) {
        this.dom.eduClubsList.innerHTML = `<div class="text-[11px] text-dust italic p-2 bg-inputbg rounded-lg border border-leadborder">Extracurricular clubs unlock in Elementary School (Age 6+). Use your developmental stage activities above!</div>`;
      } else {
        availableClubs.forEach(club => {
          const isMember = (edu.clubs || []).includes(club.id);
          const rank = (edu.clubRanks && edu.clubRanks[club.id]) || 'Member';
          const clubActs = edu.clubActionsThisYear || {};
          const card = document.createElement('div');
          card.className = "p-2.5 rounded-xl bg-inputbg border border-leadborder text-xs space-y-2";
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2.5">
                <div class="w-7 h-7 rounded-lg bg-slatecard border border-leadborder flex items-center justify-center text-edu-amber shrink-0">
                  <i data-lucide="${club.icon || 'trophy'}" class="w-3.5 h-3.5"></i>
                </div>
                <div>
                  <div class="font-serif font-bold text-parchment flex items-center gap-1.5">
                    <span>${club.name}</span>
                    ${isMember ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-emerald font-bold uppercase">${rank}</span>` : ''}
                  </div>
                  <div class="text-[10px] text-dust leading-snug">${club.desc}</div>
                </div>
              </div>
              <button class="btn-club-toggle shrink-0 ml-2 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                isMember 
                  ? 'btn-edu-danger' 
                  : 'bg-slatecard hover:bg-cardhover text-edu-teal border border-leadborder'
              }">
                ${isMember ? 'Quit' : 'Join'}
              </button>
            </div>
            ${isMember ? `
              <div class="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-leadborder/60">
                <button data-club-sub="session" class="px-2 py-1 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-[9px] font-mono font-bold text-parchment transition-all ${clubActs[club.id + '_session'] ? 'opacity-50' : ''}">
                  ${clubActs[club.id + '_session'] ? '✓ Session' : 'Attend Session'}
                </button>
                <button data-club-sub="project" class="px-2 py-1 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-[9px] font-mono font-bold text-edu-teal transition-all ${clubActs[club.id + '_project'] ? 'opacity-50' : ''}">
                  ${clubActs[club.id + '_project'] ? '✓ Project' : 'Special Project'}
                </button>
                <button data-club-sub="compete" class="px-2 py-1 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-[9px] font-mono font-bold text-edu-amber transition-all ${clubActs[club.id + '_compete'] ? 'opacity-50' : ''}">
                  ${clubActs[club.id + '_compete'] ? '✓ Competed' : (rank === 'President' ? 'Defend Trophy' : 'Compete / Rank Up')}
                </button>
              </div>
            ` : ''}
          `;

          const toggleBtn = card.querySelector('.btn-club-toggle');
          toggleBtn.addEventListener('click', () => {
            const latestLog = this.logs[this.logs.length - 1];
            if (isMember) {
              edu.clubs = edu.clubs.filter(id => id !== club.id);
              if (latestLog) {
                latestLog.entries.push(`[Extracurricular] Left ${club.name}.`);
              }
              this.saveGame();
              this.openFeedbackModal({
                tag: "CLUB MEMBERSHIP",
                title: `Left ${club.name}`,
                icon: "log-out",
                iconColor: "text-dust",
                body: `You stepped down from the ${club.name} to free up your extracurricular schedule.`,
                effects: {}
              });
            } else {
              edu.clubs = edu.clubs || [];
              edu.clubs.push(club.id);
              edu.clubRanks = edu.clubRanks || {};
              if (!edu.clubRanks[club.id]) edu.clubRanks[club.id] = 'Member';
              if (latestLog) {
                latestLog.entries.push(`[Extracurricular] Joined ${club.name}!`);
              }
              this.saveGame();
              this.openFeedbackModal({
                tag: "CLUB MEMBERSHIP",
                title: `Joined ${club.name}!`,
                icon: club.icon || "trophy",
                iconColor: "text-amber-400",
                body: `You officially signed the registration sheet for ${club.name}! Use the club buttons to attend sessions, lead special projects, and rise from Member to President.`,
                effects: { happiness: 5 }
              });
            }
            this.renderAll();
            this.renderEducationModal('overview');
          });

          card.querySelectorAll('[data-club-sub]').forEach(subBtn => {
            subBtn.addEventListener('click', () => {
              this.handleSchoolAction('club_sub', { clubId: club.id, subAction: subBtn.dataset.clubSub });
            });
          });

          this.dom.eduClubsList.appendChild(card);
        });
      }
    }

    // 2. School Supernatural Mysteries (3-Chapter Progression)
    if (this.dom.eduMysteriesSection) this.dom.eduMysteriesSection.classList.toggle('hidden', this.character.age < 6);
    if (this.dom.eduMysteriesList && this.character.age >= 6) {
      this.dom.eduMysteriesList.innerHTML = '';
      const availableMysteries = (window.SCHOOL_MYSTERIES || []).filter(m => m.reqLevel.includes(edu.level));
      const chapMap = edu.mysteryChapters || {};

      if (availableMysteries.length === 0) {
        this.dom.eduMysteriesList.innerHTML = `<div class="text-[11px] text-dust italic p-2 bg-inputbg rounded-lg border border-leadborder">No unusual school anomalies documented at this institution yet.</div>`;
      } else {
        availableMysteries.forEach(mystery => {
          const chap = chapMap[mystery.id] || 0;
          const isSolved = chap >= 3;
          const chapLabels = ['Ch. 1: Gather Clues', 'Ch. 2: Unlock Cipher', 'Ch. 3: Confront Anomaly', 'Resolved (3/3)'];
          const card = document.createElement('div');
          card.className = "flex items-center justify-between p-2.5 rounded-xl edu-mystery-card text-xs transition-all";
          card.innerHTML = `
            <div class="flex items-center space-x-2.5">
              <div class="w-7 h-7 rounded-lg edu-mystery-icon flex items-center justify-center shrink-0">
                <i data-lucide="${mystery.icon || 'eye'}" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <div class="font-serif font-bold text-edu-purple-title flex items-center gap-1.5">
                  <span>${mystery.title}</span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-purple font-bold">${chap}/3</span>
                </div>
                <div class="text-[10px] text-dust leading-snug">${mystery.desc}</div>
              </div>
            </div>
            <button class="btn-investigate shrink-0 ml-2 px-2.5 py-1 rounded-lg btn-edu-mystery text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${isSolved ? 'opacity-60 cursor-not-allowed' : ''}" ${isSolved ? 'disabled' : ''}>
              <i data-lucide="compass" class="w-3 h-3"></i>
              <span>${chapLabels[chap] || 'Investigate'}</span>
            </button>
          `;

          const invBtn = card.querySelector('.btn-investigate');
          if (invBtn && !isSolved) {
            invBtn.addEventListener('click', () => {
              this.handleSchoolAction('mystery', mystery.id);
            });
          }

          this.dom.eduMysteriesList.appendChild(card);
        });
      }
    }

    // 3. University Applications (if adult and high school graduate)
    if (this.dom.eduUniversitySection) {
      if (this.character.age >= 18 && this.character.hasHighSchoolDiploma && (!edu || edu.level !== 'university')) {
        this.dom.eduUniversitySection.classList.remove('hidden');
        if (this.dom.eduMajorsList) {
          this.dom.eduMajorsList.innerHTML = '';
          (window.UNIVERSITY_MAJORS || []).forEach(major => {
            const card = document.createElement('div');
            card.className = "flex items-center justify-between p-2.5 rounded-xl bg-inputbg border border-leadborder text-xs";
            card.innerHTML = `
              <div>
                <div class="font-serif font-bold text-parchment">${major.name}</div>
                <div class="text-[10px] font-mono text-dust">Tuition: ${window.formatMoney(major.tuition, this.character.countryCode)}/yr · +${major.smartsBonus} Smarts</div>
              </div>
              <button class="btn-apply-major shrink-0 px-2.5 py-1 rounded-lg btn-edu-university text-[10px] font-mono font-bold transition-all">
                Apply
              </button>
            `;
            const applyBtn = card.querySelector('.btn-apply-major');
            applyBtn.addEventListener('click', () => {
              this.handleSchoolAction('apply_university', major.id);
            });
            this.dom.eduMajorsList.appendChild(card);
          });
        }
      } else {
        this.dom.eduUniversitySection.classList.add('hidden');
      }
    }
  }

  renderSchoolClassmatesTab() {
    const edu = this.character.education;
    if (!edu || !this.dom.eduClassmatesList) return;

    if (!edu.classmates || edu.classmates.length === 0) {
      if (window.generateClassmates) edu.classmates = window.generateClassmates(this.character, 6);
    }

    this.dom.eduClassmatesList.innerHTML = '';

    (edu.classmates || []).forEach(peer => {
      const card = document.createElement('div');
      card.className = "bg-inputbg border border-leadborder rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-leadborder/90 transition-all";
      
      const rel = Math.max(0, Math.min(100, peer.relationship || 50));
      const pop = Math.max(0, Math.min(100, peer.popularity || 50));

      card.innerHTML = `
        <div class="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          <div class="w-10 h-10 rounded-full border border-leadborder overflow-hidden bg-slatecard shrink-0 shadow-xs">
            <canvas class="peer-thumb-canvas w-full h-full" width="80" height="80"></canvas>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-1.5 truncate">
              <span class="font-serif font-bold text-xs text-parchment truncate">${peer.name}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-purple uppercase font-bold shrink-0">${peer.clique}</span>
              ${peer.isBefriended ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-amber font-bold shrink-0">★ Best Friend</span>` : ''}
            </div>
            <!-- Small Closeness & Popularity Bars -->
            <div class="grid grid-cols-2 gap-2 mt-1.5 text-[9px] font-mono text-dust">
              <div>
                <div class="flex justify-between items-center mb-0.5">
                  <span class="text-edu-purple font-semibold">Closeness</span>
                  <span>${rel}%</span>
                </div>
                <div class="w-full bg-trackbg rounded-full h-1.5 overflow-hidden">
                  <div class="bg-purple-500 bar-fill-purple h-full rounded-full" style="width: ${rel}%;"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between items-center mb-0.5">
                  <span class="text-edu-amber font-semibold">Popularity</span>
                  <span>${pop}%</span>
                </div>
                <div class="w-full bg-trackbg rounded-full h-1.5 overflow-hidden">
                  <div class="bg-amber-500 bar-fill-amber h-full rounded-full" style="width: ${pop}%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-peer-interact shrink-0 px-3 py-1.5 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-edu-teal hover:opacity-80 font-mono text-xs font-bold transition-all">
          Interact
        </button>
      `;

      const peerCanvas = card.querySelector('.peer-thumb-canvas');
      if (peerCanvas && window.drawGothicAvatar) {
        if (!peer.avatar && window.generateSchoolAvatar) {
          peer.avatar = window.generateSchoolAvatar(peer, 'classmate', edu.level || 'elementary');
        }
        window.drawGothicAvatar(peerCanvas, { ...peer.avatar, age: peer.age || this.character.age });
      }

      const interactBtn = card.querySelector('.btn-peer-interact');
      interactBtn.addEventListener('click', () => {
        this.openSchoolPersonModal(peer, 'classmate');
      });

      this.dom.eduClassmatesList.appendChild(card);
    });
  }

  renderSchoolTeachersTab() {
    const edu = this.character.education;
    if (!edu || !this.dom.eduTeachersList) return;

    if (!edu.teachers || edu.teachers.length === 0) {
      if (window.generateTeachers) edu.teachers = window.generateTeachers(this.character, edu.level);
    }

    this.dom.eduTeachersList.innerHTML = '';

    (edu.teachers || []).forEach(teacher => {
      const card = document.createElement('div');
      card.className = "bg-inputbg border border-leadborder rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-leadborder/90 transition-all";
      
      const rel = Math.max(0, Math.min(100, teacher.relationship || 50));
      const strict = teacher.strictness || 50;
      let strictBadge = strict > 60 
        ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-rose font-bold">Strict</span>`
        : (strict < 40 
          ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-emerald font-bold">Lenient</span>`
          : `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded badge-edu-amber font-bold">Moderate</span>`);

      card.innerHTML = `
        <div class="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          <div class="w-10 h-10 rounded-full border border-leadborder overflow-hidden bg-slatecard shrink-0 shadow-xs">
            <canvas class="teacher-thumb-canvas w-full h-full" width="80" height="80"></canvas>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-1.5 truncate">
              <span class="font-serif font-bold text-xs text-parchment truncate">${teacher.name}</span>
              ${strictBadge}
            </div>
            <div class="text-[10px] text-dust font-mono truncate mt-0.5">${teacher.role}</div>
            <div class="mt-1 text-[9px] font-mono text-dust">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-edu-purple font-semibold">Respect & Standing</span>
                <span>${rel}%</span>
              </div>
              <div class="w-full bg-trackbg rounded-full h-1.5 overflow-hidden">
                <div class="bg-purple-500 bar-fill-purple h-full rounded-full" style="width: ${rel}%;"></div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-teacher-consult shrink-0 px-3 py-1.5 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-edu-emerald hover:opacity-80 font-mono text-xs font-bold transition-all">
          Consult
        </button>
      `;

      const teachCanvas = card.querySelector('.teacher-thumb-canvas');
      if (teachCanvas && window.drawGothicAvatar) {
        if (!teacher.avatar && window.generateSchoolAvatar) {
          teacher.avatar = window.generateSchoolAvatar(teacher, 'teacher', edu.level || 'elementary');
        }
        window.drawGothicAvatar(teachCanvas, { ...teacher.avatar, age: teacher.age || 38 });
      }

      const consultBtn = card.querySelector('.btn-teacher-consult');
      consultBtn.addEventListener('click', () => {
        this.openSchoolPersonModal(teacher, 'teacher');
      });

      this.dom.eduTeachersList.appendChild(card);
    });
  }

  renderSchoolStaffTab() {
    const edu = this.character.education;
    if (!edu || !this.dom.eduStaffList) return;

    if (!edu.staff || edu.staff.length === 0) {
      if (window.generateStaff) edu.staff = window.generateStaff(this.character, edu.level);
    }

    this.dom.eduStaffList.innerHTML = '';

    (edu.staff || []).forEach(staffMember => {
      const card = document.createElement('div');
      card.className = "bg-inputbg border border-leadborder rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-leadborder/90 transition-all";
      
      const rel = Math.max(0, Math.min(100, staffMember.relationship || 50));

      card.innerHTML = `
        <div class="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          <div class="w-10 h-10 rounded-full border border-leadborder overflow-hidden bg-slatecard shrink-0 shadow-xs">
            <canvas class="staff-thumb-canvas w-full h-full" width="80" height="80"></canvas>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-1.5 truncate">
              <span class="font-serif font-bold text-xs text-parchment truncate">${staffMember.name}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slatecard border border-leadborder text-dust uppercase font-bold shrink-0">${staffMember.role}</span>
            </div>
            <div class="text-[10px] text-dust font-sans truncate mt-0.5">${staffMember.quirk || ''}</div>
            <div class="mt-1 text-[9px] font-mono text-dust">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-edu-purple font-semibold">Rapport</span>
                <span>${rel}%</span>
              </div>
              <div class="w-full bg-trackbg rounded-full h-1.5 overflow-hidden">
                <div class="bg-purple-500 bar-fill-purple h-full rounded-full" style="width: ${rel}%;"></div>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-staff-approach shrink-0 px-3 py-1.5 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-edu-amber hover:opacity-80 font-mono text-xs font-bold transition-all">
          Approach
        </button>
      `;

      const staffCanvas = card.querySelector('.staff-thumb-canvas');
      if (staffCanvas && window.drawGothicAvatar) {
        if (!staffMember.avatar && window.generateSchoolAvatar) {
          staffMember.avatar = window.generateSchoolAvatar(staffMember, 'staff', edu.level || 'elementary');
        }
        window.drawGothicAvatar(staffCanvas, { ...staffMember.avatar, age: staffMember.age || 45 });
      }

      const approachBtn = card.querySelector('.btn-staff-approach');
      approachBtn.addEventListener('click', () => {
        this.openSchoolPersonModal(staffMember, 'staff');
      });

      this.dom.eduStaffList.appendChild(card);
    });
  }

  // --- School Person Dossier Modal ---
  openSchoolPersonModal(person, category) {
    if (!person || !this.dom.schoolPersonModal) return;

    this.activeSchoolPerson = person;
    this.activeSchoolPersonCategory = category;

    if (this.dom.schoolPersonName) this.dom.schoolPersonName.textContent = person.name;
    if (this.dom.schoolPersonRoleBadge) this.dom.schoolPersonRoleBadge.textContent = person.role || (category === 'classmate' ? 'Classmate' : 'Faculty');
    
    if (this.dom.schoolPersonCliqueBadge) {
      if (person.clique) {
        this.dom.schoolPersonCliqueBadge.textContent = person.clique;
        this.dom.schoolPersonCliqueBadge.classList.remove('hidden');
      } else {
        this.dom.schoolPersonCliqueBadge.classList.add('hidden');
      }
    }

    if (this.dom.schoolPersonQuirk) {
      if (person.quirk) {
        this.dom.schoolPersonQuirk.textContent = person.quirk;
      } else if (category === 'classmate') {
        this.dom.schoolPersonQuirk.textContent = `A classmate in your year associated with the ${person.clique} clique. Popularity standing: ${person.popularity}%.`;
      } else if (category === 'teacher') {
        this.dom.schoolPersonQuirk.textContent = `Faculty member teaching ${person.role}. Strictness rating: ${person.strictness}%.`;
      } else {
        this.dom.schoolPersonQuirk.textContent = `Staff member at ${this.character.education ? this.character.education.name : 'the school'}.`;
      }

      if (person.curse) {
        this.dom.schoolPersonQuirk.innerHTML += `
          <div class="mt-2 p-1.5 rounded-lg border font-mono text-[10px] font-bold badge-curse-${person.curse.type || 'haunted'} flex items-center justify-between">
            <span class="flex items-center gap-1.5"><i data-lucide="skull" class="w-3.5 h-3.5"></i>Afflicted: ${person.curse.name}</span>
            <span class="opacity-80 font-normal">Since Age ${person.curse.inflictedYear || '?'}</span>
          </div>
        `;
      }
    }

    const rel = Math.max(0, Math.min(100, person.relationship || 50));
    if (this.dom.schoolPersonRelVal) this.dom.schoolPersonRelVal.textContent = `${rel}%`;
    if (this.dom.schoolPersonRelBar) this.dom.schoolPersonRelBar.style.width = `${rel}%`;
    if (this.dom.schoolPersonMemory && window.relationshipDossierHtml) {
      this.dom.schoolPersonMemory.innerHTML = window.relationshipDossierHtml(person);
    }

    // Render School Person Avatar Canvas
    if (this.dom.schoolPersonAvatarCanvas && window.drawGothicAvatar) {
      if (!person.avatar && window.generateSchoolAvatar) {
        person.avatar = window.generateSchoolAvatar(person, category, this.character.education ? this.character.education.level : 'elementary');
      }
      let personAge = person.age;
      if (!personAge) {
        if (category === 'classmate') personAge = this.character.age;
        else if (category === 'teacher') personAge = 38;
        else personAge = 45;
      }
      window.drawGothicAvatar(this.dom.schoolPersonAvatarCanvas, { ...person.avatar, age: personAge });
    }

    this.renderSchoolPersonActions(person, category);

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }

    this.dom.schoolPersonModal.classList.remove('modal-closing', 'hidden');
    this.dom.schoolPersonModal.style.display = 'flex';
  }

  closeSchoolPersonModal() {
    if (this.dom.schoolPersonModal) {
      this.animateCloseModal(this.dom.schoolPersonModal);
    }
  }

  renderSchoolPersonActions(person, category) {
    if (!this.dom.schoolPersonActionsList) return;
    this.dom.schoolPersonActionsList.innerHTML = '';

    const actions = [];
    const isEarlyYears = this.character.age < 6;
    const relationshipMind = window.ensureNpcMemory ? window.ensureNpcMemory(person) : { resentment: 0 };

    if (category === 'classmate') {
      if (isEarlyYears) {
        actions.push({ id: 'chat', label: 'Play Together', desc: 'Spend playtime building blocks and sharing stories.', icon: 'blocks', color: 'text-edu-sky' });
        actions.push({ id: 'study_together', label: 'Practice Together', desc: 'Match shapes, colors, letters, or picture cards together.', icon: 'shapes', color: 'text-edu-emerald' });
        actions.push({ id: 'dare', label: 'Share a Favorite Toy', desc: 'Offer them a toy during supervised playtime.', icon: 'gift', color: 'text-edu-purple' });
      } else {
        actions.push({ id: 'chat', label: 'Chat & Whisper', desc: 'Engage in friendly hallway banter.', icon: 'message-square', color: 'text-edu-sky' });
        actions.push({ id: 'study_together', label: 'Study Together', desc: 'Review homework sets and class notes.', icon: 'book-open', color: 'text-edu-emerald' });
        actions.push({ id: 'gossip', label: 'Trade School Gossip', desc: 'Share rumors regarding students and faculty.', icon: 'radio', color: 'text-edu-amber' });
        actions.push({ id: 'dare', label: 'Playground Dare', desc: 'Perform a reckless corridor dare.', icon: 'zap', color: 'text-edu-purple' });
        actions.push({ id: 'prank', label: 'Pull a Prank', desc: 'Slip a mischievous surprise in their locker.', icon: 'smile', color: 'text-edu-rose' });
        actions.push({ id: 'insult', label: 'Deliver an Insult', desc: 'Say something deliberately cruel and risk immediate retaliation.', icon: 'message-square-warning', color: 'text-rose-400' });
      }
      if (!isEarlyYears && !person.isBefriended) {
        actions.push({ id: 'befriend', label: 'Ask to be Best Friends', desc: 'Invite into your permanent Kin & Friends circle (Req 50%+ Closeness).', icon: 'user-plus', color: 'text-edu-amber' });
      }
    } else if (category === 'teacher') {
      actions.push({ id: 'praise', label: isEarlyYears ? 'Give a Drawing' : 'Praise Teaching', desc: isEarlyYears ? 'Offer them a drawing you made during class.' : 'Compliment their curriculum and lecture dedication.', icon: 'thumbs-up', color: 'text-edu-emerald' });
      actions.push({ id: 'ask_help', label: isEarlyYears ? 'Ask for Help' : 'Request Tutoring', desc: isEarlyYears ? 'Ask for help with a classroom activity.' : 'Ask for after-school academic assistance.', icon: 'help-circle', color: 'text-edu-sky' });
      if (!isEarlyYears) {
        actions.push({ id: 'complain', label: 'Dispute Homework Grade', desc: 'Object to an unfair assignment mark.', icon: 'alert-circle', color: 'text-edu-amber' });
        actions.push({ id: 'bribe', label: 'Offer Grade Bribe ($50)', desc: 'Slip cash into their desk for extra credit.', icon: 'dollar-sign', color: 'text-edu-rose' });
      }
    } else if (category === 'staff') {
      const role = person.role || '';
      if (isEarlyYears && (role.includes('Nurse') || role.includes('Matron'))) {
        actions.push({ id: 'nurture', label: 'Seek Comfort', desc: 'Ask for a warm hug, quiet story, and reassurance.', icon: 'heart', color: 'text-edu-rose' });
        actions.push({ id: 'ask_snack', label: 'Ask for a Snack', desc: 'Request juice and a small nursery snack.', icon: 'cookie', color: 'text-edu-amber' });
      } else if (isEarlyYears) {
        actions.push({ id: 'greet_staff', label: 'Wave Hello', desc: 'Greet the familiar adult who looks after the building.', icon: 'hand', color: 'text-edu-sky' });
      } else if (role.includes('Janitor') || role.includes('Custodian') || role.includes('Caretaker')) {
        actions.push({ id: 'help_clean', label: 'Help Sweep Corridors & Classrooms', desc: 'Grab a push-broom and assist with chores. (+Reputation, chance of lost money)', icon: 'sparkles', color: 'text-edu-amber' });
        actions.push({ id: 'ask_boiler_room', label: 'Ask About Locked Boiler Room', desc: 'Inquire regarding subterranean furnace rumors.', icon: 'flame', color: 'text-edu-purple' });
        actions.push({ id: 'search_lost_found', label: 'Search Lost & Found Crate', desc: 'Rummage through forgotten student relics.', icon: 'search', color: 'text-edu-teal' });
      } else if (role.includes('Librarian') || role.includes('Archivist')) {
        actions.push({ id: 'reorganize_shelves', label: 'Help Reorganize Bookshelves', desc: 'Dust, sort, and catalog the book stacks.', icon: 'book-open', color: 'text-edu-emerald' });
        actions.push({ id: 'catalog_archives', label: 'Catalog Historical Records', desc: 'Examine old municipal microfiche and town records.', icon: 'file-text', color: 'text-edu-sky' });
        actions.push({ id: 'restricted_tomes', label: 'Request Restricted Archive Access', desc: 'Ask to view the locked glass cabinet of occult tomes.', icon: 'lock', color: 'text-edu-purple' });
      } else if (role.includes('Nurse') || role.includes('Matron')) {
        actions.push({ id: 'rest_cot', label: 'Rest on Clinic Cot', desc: 'Fake a headache and sleep behind privacy curtains. (+Vitality)', icon: 'moon', color: 'text-edu-emerald' });
        actions.push({ id: 'report_anomaly', label: 'Report Strange Symptoms & Chills', desc: 'Consult regarding odd physical sensations and shadows.', icon: 'activity', color: 'text-edu-purple' });
        if (role.includes('Matron')) {
          actions.push({ id: 'nurture', label: 'Seek Nurture & Warm Hug', desc: 'Ask for comforting nursery story and attention.', icon: 'heart', color: 'text-edu-rose' });
          actions.push({ id: 'ask_snack', label: 'Ask for Nursery Snack', desc: 'Request sweet apple juice and animal crackers.', icon: 'coffee', color: 'text-edu-amber' });
        }
      } else if (role.includes('Principal') || role.includes('Headmaster') || role.includes('Dean')) {
        actions.push({ id: 'appeal_discipline', label: 'Appeal Disciplinary Record', desc: 'Submit a formal petition to clear detention marks.', icon: 'check-square', color: 'text-edu-emerald' });
        actions.push({ id: 'school_pride', label: 'Display Institutional Pride', desc: 'Praise the school heritage and display loyalty.', icon: 'award', color: 'text-edu-amber' });
      }
    }

    if (relationshipMind.resentment > 0) {
      actions.push({ id: 'apology', label: 'Offer an Apology', desc: 'Acknowledge the incident. Resentment eases slowly; history remains.', icon: 'heart-handshake', color: 'text-sky-400' });
    }

    actions.forEach(act => {
      const btn = document.createElement('button');
      btn.className = "w-full p-2.5 rounded-xl bg-inputbg hover:bg-slatecard border border-leadborder hover:border-leadborder/90 text-left flex items-center justify-between group transition-all";
      btn.innerHTML = `
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-slatecard border border-leadborder flex items-center justify-center ${act.color} group-hover:scale-105 transition-transform shrink-0">
            <i data-lucide="${act.icon}" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="font-serif font-bold text-xs text-parchment">${act.label}</div>
            <div class="text-[10px] text-dust font-sans leading-snug">${act.desc}</div>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-dust/60 group-hover:text-parchment transition-colors"></i>
      `;

      btn.addEventListener('click', () => {
        this.handleSchoolPersonAction(person, act.id);
      });

      this.dom.schoolPersonActionsList.appendChild(btn);
    });

    // Paranormal Hex / Dark Deed Action (Available for all living school personnel & peers age 6+)
    if (this.character.age >= 6) {
      const hexBtn = document.createElement('button');
      hexBtn.className = "w-full p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-left flex items-center justify-between group transition-all mt-2 shadow-xs";
      hexBtn.innerHTML = `
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/60 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
            <i data-lucide="moon" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="font-serif font-bold text-xs text-purple-300 group-hover:text-purple-200 transition-colors">🔮 Cast Hex / Dark Deed</div>
            <div class="text-[10px] text-purple-400/80 font-sans leading-snug">Perform a paranormal rite or curse targeting this individual.</div>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-purple-400/60 group-hover:text-purple-300 transition-colors"></i>
      `;
      hexBtn.addEventListener('click', () => {
        this.closeSchoolPersonModal();
        this.closeEducationModal();
        this.openDarkAltarModal(person);
      });
      this.dom.schoolPersonActionsList.appendChild(hexBtn);
    }
  }

  handleSchoolAction(actionType, param = null) {
    if (window.getActiveConsequences && window.getActiveConsequences(this.character, 'suspension').length) {
      this.openFeedbackModal({ tag: 'SUSPENDED', title: 'School Access Revoked', icon: 'school', iconColor: 'text-amber-400', body: 'Your suspension prevents school activities until it expires.', effects: {} });
      return;
    }

    let result = null;
    if ((actionType === 'study' || actionType === 'study_harder') && window.studyHarder) {
      result = window.studyHarder(this.character);
    } else if ((actionType === 'skip' || actionType === 'skip_class') && window.skipClass) {
      result = window.skipClass(this.character);
    } else if (actionType === 'mystery' && window.investigateMystery) {
      result = window.investigateMystery(this.character, param);
    } else if (actionType === 'stage_action' && window.performStageSchoolAction) {
      result = window.performStageSchoolAction(this.character, param);
    } else if (actionType === 'club_sub' && window.performClubSubAction && param) {
      result = window.performClubSubAction(this.character, param.clubId, param.subAction);
    } else if (actionType === 'apply_university' && window.applyToUniversity) {
      result = window.applyToUniversity(this.character, param);
    } else if (actionType === 'drop_out' && window.dropOutOfSchool) {
      result = window.dropOutOfSchool(this.character);
    }

    if (!result) return;

    if (result.success) {
      const latestLog = this.logs[this.logs.length - 1];
      if (latestLog) {
        latestLog.entries.push(`[${result.title}] ${result.body || result.message || ''}`);
      }
      this.saveGame();
      if (actionType === 'mystery') {
        window.soundEngine.playDread();
      } else {
        window.soundEngine.playClick();
      }
      this.openFeedbackModal({
        tag: "SCHOOL PURSUIT",
        title: result.title,
        icon: "graduation-cap",
        iconColor: "text-sky-400",
        body: result.body,
        effects: result.effects
      });
    } else {
      this.openFeedbackModal({
        tag: "NOTICE",
        title: "Action Denied",
        icon: "alert-circle",
        iconColor: "text-amber-400",
        body: result.reason || "Action could not be completed.",
        effects: {}
      });
    }

    this.renderAll();
    if (this.character.education && this.character.education.enrolled) this.renderEducationModal(this.activeEducationTab);
    else this.closeEducationModal();
  }

  handleSchoolPersonAction(person, actionType) {
    if (person.missing) {
      this.openFeedbackModal({ tag: 'MISSING', title: 'Nobody Answers', icon: 'user-x', iconColor: 'text-purple-400', body: `${person.name} has vanished and cannot be contacted.`, effects: {} });
      return;
    }
    if (window.getActiveConsequences && window.getActiveConsequences(this.character, 'suspension').length) {
      this.openFeedbackModal({ tag: 'SUSPENDED', title: 'School Access Revoked', icon: 'school', iconColor: 'text-amber-400', body: 'Your suspension prevents contact with classmates and school personnel until it expires.', effects: {} });
      return;
    }
    const interactionBlock = window.canInteractWithNpc ? window.canInteractWithNpc(person, this.character, actionType) : null;
    if (interactionBlock) {
      this.openFeedbackModal({ tag: 'CONTACT REFUSED', title: 'They Remember', icon: 'ban', iconColor: 'text-rose-400', body: interactionBlock, effects: {} });
      return;
    }

    let result = null;
    if (actionType === 'apology' && window.apologizeToNpc) {
      result = window.apologizeToNpc(person, this.character);
    } else if (actionType === 'insult' && window.insultNpc) {
      person.actionsDone = person.actionsDone || {};
      const insultCount = person.actionsDone.insult || 0;
      if (insultCount >= 5) result = { success: false, reason: `You have provoked ${person.name} enough times this year.` };
      else {
        person.actionsDone.insult = insultCount + 1;
        result = window.insultNpc(person, this.character);
      }
    } else if (person.category === 'classmate' && window.interactWithClassmate) {
      result = window.interactWithClassmate(person, this.character, actionType);
    } else if (person.category === 'teacher' && window.interactWithTeacher) {
      result = window.interactWithTeacher(person, this.character, actionType);
    } else if (person.category === 'staff' && window.interactWithStaff) {
      result = window.interactWithStaff(person, this.character, actionType);
    }

    if (!result) return;

    if (result.success) {
      if (window.finalizeNpcInteraction) {
        result = window.finalizeNpcInteraction(person, this.character, actionType, result);
      }
      if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: 'relationship', title: result.title || person.name, outcome: result.body || result.message, effects: result.effects, engaged: true });
      const latestLog = this.logs[this.logs.length - 1];
      if (latestLog) {
        latestLog.entries.push(`[${person.name}] ${result.body || result.message || ''}`);
      }
      this.saveGame();
      window.soundEngine.playClick();
      this.openFeedbackModal({
        tag: "INTERACTION OUTCOME",
        title: result.title,
        icon: "message-square",
        iconColor: "text-teal-400",
        body: result.body,
        effects: result.effects
      });

      // Update live closeness bar in open person modal immediately
      const rel = Math.max(0, Math.min(100, person.relationship || 50));
      if (this.dom.schoolPersonRelVal) this.dom.schoolPersonRelVal.textContent = `${rel}%`;
      if (this.dom.schoolPersonRelBar) this.dom.schoolPersonRelBar.style.width = `${rel}%`;
      if (this.dom.schoolPersonMemory && window.relationshipDossierHtml) {
        this.dom.schoolPersonMemory.innerHTML = window.relationshipDossierHtml(person);
      }
      this.renderSchoolPersonActions(person, person.category);
      
      // If action was befriend, re-render actions so "Ask to be Best Friends" disappears
      if (actionType === 'befriend') {
        this.renderSchoolPersonActions(person, person.category);
      }
    } else {
      this.openFeedbackModal({
        tag: "ACTION UNAVAILABLE",
        title: "Interaction Restricted",
        icon: "alert-circle",
        iconColor: "text-amber-400",
        body: result.reason || "Unable to interact right now.",
        effects: {}
      });
    }

    this.renderAll();
    this.renderEducationModal(this.activeEducationTab);
  }

  // ==========================================
  // TERRIBLENET: SOCIAL MEDIA & DIGITAL HORROR
  // ==========================================

  openTerribleNetModal() {
    if (!this.character?.isAlive || !this.dom.terribleNetModal || !window.ensureTerribleNet) return;
    this.closeActivitiesModal();
    window.ensureTerribleNet(this.character);
    this.dom.terribleNetModal.classList.remove('modal-closing', 'hidden');
    this.dom.terribleNetModal.style.display = 'flex';
    this.renderTerribleNet(this.activeTerribleNetTab || 'platforms');
  }

  closeTerribleNetModal() {
    if (!this.dom.terribleNetModal) return;
    this.animateCloseModal(this.dom.terribleNetModal);
  }

  escapeNet(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  renderTerribleNet(tab = 'platforms') {
    if (!this.dom.terribleNetContent || !window.ensureTerribleNet) return;
    const system = window.ensureTerribleNet(this.character);
    this.activeTerribleNetTab = tab;
    const accounts = Object.values(system.accounts);
    const followerTotal = accounts.reduce((sum, account) => sum + account.followers, 0);
    const unread = system.messages.filter(message => !message.read).length;
    if (this.dom.terribleNetSummary) this.dom.terribleNetSummary.textContent = `${accounts.length} identities · ${followerTotal} followers · ${unread} unread · ${system.screenshots.length} surviving screenshots`;
    this.dom.terribleNetTabs?.querySelectorAll('[data-net-tab]').forEach(button => {
      const active = button.dataset.netTab === tab;
      button.className = `net-tab px-3 py-1.5 rounded-full border text-[10px] font-mono whitespace-nowrap ${active ? 'bg-teal-500/15 border-teal-500/50 text-teal-300' : 'bg-inputbg border-leadborder text-dust'}`;
    });
    if (tab === 'feed') this.dom.terribleNetContent.innerHTML = this.terribleNetFeedHtml(system);
    else if (tab === 'compose') this.dom.terribleNetContent.innerHTML = this.terribleNetComposeHtml(system);
    else if (tab === 'inbox') this.dom.terribleNetContent.innerHTML = this.terribleNetInboxHtml(system);
    else if (tab === 'fame') this.dom.terribleNetContent.innerHTML = this.terribleNetFameHtml();
    else if (tab === 'blackglass') this.dom.terribleNetContent.innerHTML = this.terribleNetBlackglassHtml(system);
    else if (tab === 'archive') this.dom.terribleNetContent.innerHTML = this.terribleNetArchiveHtml(system);
    else this.dom.terribleNetContent.innerHTML = this.terribleNetPlatformsHtml(system);
    if (tab === 'compose') this.syncTerribleNetComposer();
    if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
  }

  terribleNetPlatformsHtml(system) {
    return Object.entries(window.TERRIBLENET_PLATFORMS || {}).map(([id, platform]) => {
      const access = window.getTerribleNetAccess(this.character, id);
      const account = system.accounts[id];
      return `<article class="rounded-2xl border ${account ? 'border-teal-500/30 bg-teal-500/5' : 'border-leadborder bg-inputbg'} p-4 space-y-3">
        <div class="flex items-start justify-between gap-3"><div class="flex gap-3 min-w-0"><div class="w-10 h-10 rounded-xl bg-slatecard border border-leadborder flex items-center justify-center text-teal-400 shrink-0"><i data-lucide="${platform.icon}" class="w-5 h-5"></i></div><div><h4 class="font-serif font-bold text-sm text-parchment">${platform.name}</h4><p class="text-[11px] text-dust leading-relaxed">${platform.desc}</p></div></div><span class="text-[8px] font-mono uppercase border border-leadborder rounded-full px-2 py-1 text-dust shrink-0">${platform.inviteOnly ? 'invite only' : `age ${platform.minAge}+`}</span></div>
        ${account ? `<div class="grid grid-cols-4 gap-1.5 text-center"><div class="rounded-lg bg-slatecard p-2"><strong class="text-xs text-parchment">${account.followers}</strong><p class="text-[8px] text-dust uppercase">Followers</p></div><div class="rounded-lg bg-slatecard p-2"><strong class="text-xs text-emerald-300">${account.credibility}%</strong><p class="text-[8px] text-dust uppercase">Credible</p></div><div class="rounded-lg bg-slatecard p-2"><strong class="text-xs text-amber-300">${account.notoriety}%</strong><p class="text-[8px] text-dust uppercase">Notoriety</p></div><div class="rounded-lg bg-slatecard p-2"><strong class="text-xs text-rose-300">${account.parasocial}%</strong><p class="text-[8px] text-dust uppercase">Attachment</p></div></div><p class="text-[9px] font-mono text-dust">@${this.escapeNet(account.handle)}${account.anonymous ? ' · anonymous identity' : ''}${account.monetized ? ' · monetized' : ''}</p>` : `<button data-net-action="create-account" data-platform="${id}" ${access.allowed ? '' : 'disabled'} class="w-full py-2 rounded-xl border text-xs font-serif font-bold ${access.allowed ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-leadborder bg-slatecard text-dust opacity-60'}">${access.allowed ? 'Create identity' : this.escapeNet(access.reason)}</button>`}
      </article>`;
    }).join('');
  }

  terribleNetFeedHtml(system) {
    const visible = system.posts.slice(0, 30);
    if (!visible.length) return '<div class="rounded-2xl border border-leadborder bg-inputbg p-6 text-center"><i data-lucide="signal-zero" class="w-7 h-7 text-dust mx-auto"></i><p class="text-sm text-parchment mt-3">Nothing published yet.</p><p class="text-xs text-dust mt-1">Create an identity, then leave something future employers can discover.</p></div>';
    return visible.map(post => {
      const platform = window.TERRIBLENET_PLATFORMS[post.platformId];
      return `<article class="rounded-2xl border ${post.deleted ? 'border-leadborder/50 opacity-70' : post.viral ? 'border-amber-500/40' : 'border-leadborder'} bg-inputbg p-4 space-y-3">
        <div class="flex justify-between gap-3"><span class="text-[9px] font-mono uppercase text-teal-300">${platform.name} · ${post.type}${post.viral ? ' · VIRAL' : ''}</span><span class="text-[9px] text-dust">Age ${post.createdAge}</span></div>
        <p class="text-xs text-parchment leading-relaxed">${this.escapeNet(post.text)}</p>
        ${post.targetName ? `<p class="text-[9px] font-mono text-rose-300">TARGET: ${this.escapeNet(post.targetName)}</p>` : ''}
        ${post.paranormalVerdict ? `<div class="rounded-lg border border-purple-500/30 bg-purple-500/5 p-2 text-[10px] text-purple-200">WakeWatch verdict: ${post.paranormalVerdict.replaceAll('_', ' ')}</div>` : ''}
        <div class="flex justify-between items-center text-[9px] font-mono text-dust"><span>${post.reach} reached · ${post.reactions.length} known reactions</span><span>${post.screenshotted ? 'Screenshot survives' : post.deleted ? 'Deleted' : 'Live'}</span></div>
        ${!post.deleted ? `<button data-net-action="delete-post" data-post-id="${post.id}" class="text-[10px] font-mono text-rose-300 hover:text-rose-200">Delete original</button>` : ''}
      </article>`;
    }).join('');
  }

  terribleNetComposeHtml(system) {
    const accounts = Object.values(system.accounts).filter(account => !['blackglass', 'archive'].includes(account.platformId));
    if (!accounts.length) return '<div class="rounded-2xl border border-leadborder bg-inputbg p-5 text-center text-xs text-dust">Create at least one social identity under Networks before publishing.</div>';
    const targets = window.getAllPotentialTargets ? window.getAllPotentialTargets(this.character) : [];
    const platformOptions = accounts.map(account => `<option value="${account.platformId}">${window.TERRIBLENET_PLATFORMS[account.platformId].name} · @${this.escapeNet(account.handle)}</option>`).join('');
    const toneOptions = Object.entries(window.TERRIBLENET_TONES || {}).map(([id, tone]) => `<option value="${id}">${tone.label}</option>`).join('');
    const targetOptions = targets.map(target => `<option value="${this.escapeNet(target.id)}">${this.escapeNet(target.name)} · ${this.escapeNet(target.group)}</option>`).join('');
    return `<div class="rounded-2xl border border-teal-500/30 bg-inputbg p-4 space-y-4">
      <div><h4 class="font-serif font-bold text-parchment">Publish to TerribleNet</h4><p class="text-[10px] text-dust">Costs 1 Energy. Reach comes from followers and Batch 10 notoriety; belief comes from trust and credibility.</p></div>
      <label class="block text-[9px] font-mono uppercase text-dust">Identity<select id="net-compose-platform" class="mt-1 w-full p-2.5 rounded-lg bg-slatecard border border-leadborder text-xs text-parchment">${platformOptions}</select></label>
      <div class="grid grid-cols-2 gap-2"><label class="block text-[9px] font-mono uppercase text-dust">Format<select id="net-compose-type" class="mt-1 w-full p-2.5 rounded-lg bg-slatecard border border-leadborder text-xs text-parchment">${(window.TERRIBLENET_CONTENT_TYPES || []).map(type => `<option value="${type}">${type}</option>`).join('')}</select></label><label class="block text-[9px] font-mono uppercase text-dust">Purpose<select id="net-compose-tone" class="mt-1 w-full p-2.5 rounded-lg bg-slatecard border border-leadborder text-xs text-parchment">${toneOptions}</select></label></div>
      <label class="block text-[9px] font-mono uppercase text-dust">Optional target<select id="net-compose-target" class="mt-1 w-full p-2.5 rounded-lg bg-slatecard border border-leadborder text-xs text-parchment"><option value="">No named target</option>${targetOptions}</select></label>
      <label class="block text-[9px] font-mono uppercase text-dust">Content<textarea id="net-compose-text" maxlength="400" rows="5" placeholder="Say something the Archive may preserve forever…" class="mt-1 w-full p-3 rounded-lg bg-slatecard border border-leadborder text-xs text-parchment focus:outline-none focus:border-teal-500"></textarea></label>
      <button data-net-action="publish" class="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white border border-teal-500 font-serif font-bold active:scale-[0.99]">Publish · 1 Energy</button>
    </div>`;
  }

  syncTerribleNetComposer() {
    const platformId = document.getElementById('net-compose-platform')?.value;
    const typeSelect = document.getElementById('net-compose-type');
    const allowed = window.TERRIBLENET_PLATFORMS?.[platformId]?.formats || [];
    if (!typeSelect) return;
    Array.from(typeSelect.options).forEach(option => { option.disabled = !allowed.includes(option.value); });
    if (!allowed.includes(typeSelect.value)) typeSelect.value = allowed[0] || 'post';
  }

  terribleNetInboxHtml(system) {
    if (!system.messages.length) return '<div class="rounded-2xl border border-leadborder bg-inputbg p-6 text-center text-xs text-dust">No private messages. Enjoy this historically temporary condition.</div>';
    return system.messages.map(message => `<article class="rounded-2xl border ${message.threat ? 'border-rose-500/40 bg-rose-500/5' : 'border-leadborder bg-inputbg'} p-4 space-y-2">
      <div class="flex justify-between gap-2"><strong class="text-xs text-parchment">${this.escapeNet(message.subject)}</strong><span class="text-[9px] font-mono ${message.read ? 'text-dust' : 'text-teal-300'}">${message.read ? 'READ' : 'NEW'}</span></div><p class="text-[10px] font-mono text-dust">${this.escapeNet(message.senderName)} · age ${message.age}</p><p class="text-[11px] text-parchment leading-relaxed">${this.escapeNet(message.body)}</p>
      ${message.threat && !message.resolved ? `<div class="grid grid-cols-4 gap-1 pt-2">${['ignore', 'report', 'confront', 'comply'].map(response => `<button data-net-action="respond" data-message-id="${message.id}" data-response="${response}" class="py-2 rounded-lg border border-leadborder bg-slatecard text-[9px] font-mono text-dust hover:text-parchment capitalize">${response}</button>`).join('')}</div>` : message.resolved ? `<p class="text-[9px] font-mono text-amber-300 uppercase">Resolved: ${message.response}</p>` : `<button data-net-action="respond" data-message-id="${message.id}" data-response="ignore" class="text-[10px] text-teal-300">Mark read</button>`}
    </article>`).join('');
  }

  terribleNetFameHtml() {
    if (!window.getFameSnapshot) return '<p class="text-xs text-dust">Public identity registry unavailable.</p>';
    const fame = window.getFameSnapshot(this.character);
    const identity = window.FAME_IDENTITIES?.[fame.identity.type] || window.FAME_IDENTITIES?.private_citizen;
    const activeScandal = fame.scandals.find(item => item.active);
    const pending = fame.offers.filter(item => item.status === 'pending');
    const activeContracts = fame.contracts.filter(item => item.active);
    return `<section class="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-purple-500/5 p-4 space-y-3">
      <div class="flex items-start gap-3"><div class="w-11 h-11 rounded-xl bg-slatecard border border-amber-500/30 flex items-center justify-center text-amber-300"><i data-lucide="${identity.icon}" class="w-5 h-5"></i></div><div class="min-w-0"><p class="text-[9px] font-mono uppercase tracking-widest text-amber-300">Current public identity</p><h4 class="font-serif font-bold text-lg text-parchment">${identity.label}</h4><p class="text-[11px] text-dust mt-1">${identity.danger}</p></div></div>
      <div class="grid grid-cols-3 gap-2 text-center"><div class="rounded-xl bg-slatecard/70 border border-leadborder p-2"><strong class="text-sm text-parchment">${fame.publicReach}</strong><p class="text-[8px] uppercase text-dust">Recognizable reach</p></div><div class="rounded-xl bg-slatecard/70 border border-leadborder p-2"><strong class="text-sm text-rose-300">${fame.privacyLoss}%</strong><p class="text-[8px] uppercase text-dust">Privacy lost</p></div><div class="rounded-xl bg-slatecard/70 border border-leadborder p-2"><strong class="text-sm text-amber-300">${fame.identityHistory.length}</strong><p class="text-[8px] uppercase text-dust">Identity eras</p></div></div>
    </section>
    <section><p class="text-[9px] font-mono uppercase text-dust mb-2">People gathered around your name</p><div class="grid grid-cols-5 gap-1">${Object.entries(fame.factions).map(([name, count]) => `<div class="rounded-lg bg-inputbg border border-leadborder p-2 text-center"><strong class="text-xs ${name === 'stalkers' ? 'text-rose-300' : 'text-parchment'}">${count}</strong><p class="text-[7px] text-dust uppercase truncate">${name}</p></div>`).join('')}</div></section>
    <section><p class="text-[9px] font-mono uppercase text-dust mb-2">Audience demographics</p><div class="space-y-2">${Object.entries(fame.audiences).map(([id, audience]) => `<div class="rounded-xl bg-inputbg border border-leadborder p-3"><div class="flex justify-between text-[10px]"><span class="text-parchment">${window.FAME_DEMOGRAPHICS[id]}</span><span class="font-mono text-dust">Exposure ${audience.exposure}% · Affinity ${audience.affinity}%</span></div><div class="h-1 bg-slatecard rounded-full mt-2 overflow-hidden"><div class="h-full bg-teal-500" style="width:${audience.exposure}%"></div></div></div>`).join('')}</div></section>
    ${activeScandal ? `<section class="rounded-2xl border ${activeScandal.documented ? 'border-rose-500/50' : 'border-amber-500/40'} bg-inputbg p-4"><div class="flex justify-between"><p class="text-[9px] font-mono uppercase ${activeScandal.documented ? 'text-rose-300' : 'text-amber-300'}">${activeScandal.documented ? 'Documented scandal' : 'Unverified claim'}</p><span class="text-[9px] text-dust">Heat ${activeScandal.heat}%</span></div><p class="text-xs text-parchment mt-2">${this.escapeNet(activeScandal.claim)}</p><div class="grid grid-cols-4 gap-1 mt-3">${[['apologize','Apologize'],['deny','Deny'],['double_down','Double down'],['silence','No comment']].map(([stance,label]) => `<button data-net-action="fame-statement" data-stance="${stance}" class="py-2 rounded-lg border border-leadborder bg-slatecard text-[8px] font-mono text-dust">${label}</button>`).join('')}</div></section>` : ''}
    ${pending.length ? `<section><p class="text-[9px] font-mono uppercase text-dust mb-2">Pending contracts</p>${pending.map(offer => `<article class="rounded-2xl border ${offer.exploitative ? 'border-rose-500/40' : 'border-emerald-500/30'} bg-inputbg p-4 mb-2"><div class="flex justify-between"><strong class="text-xs text-parchment">${this.escapeNet(offer.sponsor)}</strong><span class="text-xs text-amber-300">${this.escapeNet(window.formatMoney ? window.formatMoney(offer.upfront, this.character.countryCode) : '$'+offer.upfront)}</span></div><p class="text-[10px] text-dust mt-2">${offer.rights} ${offer.exclusivity}</p><p class="text-[9px] text-rose-300 mt-1">${offer.scandalClause}</p><div class="grid grid-cols-2 gap-2 mt-3"><button data-net-action="fame-offer" data-offer-id="${offer.id}" data-decision="reject" class="py-2 rounded-lg border border-leadborder text-xs text-dust">Reject</button><button data-net-action="fame-offer" data-offer-id="${offer.id}" data-decision="accept" class="py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs text-amber-200">Sign</button></div></article>`).join('')}</section>` : ''}
    ${activeContracts.length ? `<section class="rounded-2xl border border-leadborder bg-inputbg p-4"><p class="text-[9px] font-mono uppercase text-dust">Active likeness contracts</p>${activeContracts.map(contract => `<p class="text-[11px] text-parchment mt-2">${this.escapeNet(contract.sponsor)} · ${contract.yearsRemaining} year(s) · ${contract.exploitative ? 'Sponsor controls scandal rights' : 'Limited campaign rights'}</p>`).join('')}</section>` : ''}
    <section class="rounded-2xl border border-leadborder bg-inputbg p-4"><p class="text-[9px] font-mono uppercase text-dust">Public appearances · 1 Energy</p><div class="grid grid-cols-3 gap-2 mt-3">${[['friendly','Friendly profile'],['investigative','Investigative'],['sensational','Sensational live']].map(([kind,label]) => `<button data-net-action="fame-appearance" data-kind="${kind}" class="py-2.5 rounded-lg border border-teal-500/30 bg-teal-500/5 text-[9px] font-mono text-teal-200">${label}</button>`).join('')}</div></section>`;
  }

  terribleNetBlackglassHtml(system) {
    const access = window.getTerribleNetAccess(this.character, 'blackglass');
    if (!system.accounts.blackglass) return `<div class="rounded-2xl border border-rose-900/60 bg-black/30 p-6 text-center"><i data-lucide="scan-eye" class="w-8 h-8 text-rose-500 mx-auto"></i><h4 class="font-serif font-bold text-rose-200 mt-3">Blackglass Invitation Gate</h4><p class="text-xs text-dust mt-2">${this.escapeNet(access.reason || 'Your invitation has been verified.')}</p>${access.allowed ? '<button data-net-action="create-account" data-platform="blackglass" class="mt-4 px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs font-bold">Enter using invitation</button>' : ''}</div>`;
    return `<div class="rounded-xl border border-rose-900/50 bg-black/30 p-3 text-[10px] text-rose-200">Purchases may produce curses, investigations, blackmail, stalking, or information contamination. Escrow does not accept regret.</div>${(window.BLACKGLASS_LISTINGS || []).map(item => `<article class="rounded-2xl border border-rose-900/40 bg-inputbg p-4"><div class="flex justify-between gap-3"><div><h4 class="font-serif font-bold text-parchment">${item.name}</h4><p class="text-[11px] text-dust mt-1">${item.desc}</p></div><span class="text-xs font-mono text-amber-300">${this.escapeNet(window.formatMoney ? window.formatMoney(item.cost, this.character.countryCode) : '$' + item.cost)}</span></div><div class="flex justify-between items-center mt-3"><span class="text-[9px] font-mono text-rose-300 uppercase">Risk index ${item.danger}% · ${item.kind}</span><button data-net-action="blackglass-buy" data-listing-id="${item.id}" class="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-700/50 text-rose-200 text-[10px] font-bold">Purchase</button></div></article>`).join('')}`;
  }

  terribleNetArchiveHtml(system) {
    if (!system.memorials.length) return '<div class="rounded-2xl border border-leadborder bg-inputbg p-6 text-center"><i data-lucide="book-heart" class="w-7 h-7 text-dust mx-auto"></i><p class="text-xs text-dust mt-3">No memorial profiles are connected to your account.</p></div>';
    return system.memorials.map(memorial => `<article class="rounded-2xl border ${memorial.updates.length ? 'border-purple-500/40' : 'border-leadborder'} bg-inputbg p-4"><div class="flex justify-between"><div><h4 class="font-serif font-bold text-parchment">${this.escapeNet(memorial.name)}</h4><p class="text-[9px] font-mono text-dust">Memorialized · followed</p></div><i data-lucide="${memorial.updates.length ? 'refresh-cw' : 'flower-2'}" class="w-4 h-4 ${memorial.updates.length ? 'text-purple-300' : 'text-dust'}"></i></div>${memorial.updates.length ? memorial.updates.slice(0, 3).map(update => `<div class="mt-3 border-l-2 border-purple-500/30 pl-3"><p class="text-[11px] text-parchment">${this.escapeNet(update.text)}</p><span class="text-[8px] font-mono text-dust">Updated when you were age ${update.age}</span></div>`).join('') : '<p class="text-[11px] text-dust mt-3">No posthumous activity detected.</p>'}</article>`).join('');
  }

  handleTerribleNetAction(event) {
    const button = event.target.closest('[data-net-action]');
    if (!button) return;
    const action = button.dataset.netAction;
    let result = null;
    if (action === 'create-account') result = window.createTerribleNetAccount(this.character, button.dataset.platform, button.dataset.platform === 'hush');
    else if (action === 'delete-post') result = window.deleteTerribleNetPost(this.character, button.dataset.postId);
    else if (action === 'respond') result = window.respondTerribleNetMessage(this.character, button.dataset.messageId, button.dataset.response);
    else if (action === 'blackglass-buy') result = window.buyBlackglassListing(this.character, button.dataset.listingId);
    else if (action === 'fame-offer') result = window.handleFameOffer(this.character, button.dataset.offerId, button.dataset.decision);
    else if (action === 'fame-appearance') result = window.performPublicAppearance(this.character, button.dataset.kind);
    else if (action === 'fame-statement') result = window.makeFameStatement(this.character, button.dataset.stance);
    else if (action === 'publish') {
      result = window.createTerribleNetPost(this.character, { platformId: document.getElementById('net-compose-platform')?.value, type: document.getElementById('net-compose-type')?.value, tone: document.getElementById('net-compose-tone')?.value, targetId: document.getElementById('net-compose-target')?.value, text: document.getElementById('net-compose-text')?.value });
    }
    if (!result) return;
    if (result.success) {
      const latestLog = this.logs[this.logs.length - 1];
      if (latestLog) latestLog.entries.push(`[TerribleNet] ${result.title}: ${result.message}`);
      this.saveGame(); this.renderAll();
    }
    this.renderTerribleNet(action === 'publish' && result.success ? 'feed' : this.activeTerribleNetTab);
    this.openFeedbackModal({ tag: result.success ? 'TERRIBLENET' : 'NETWORK ACTION BLOCKED', title: result.title || 'Connection Refused', icon: result.success ? 'radio-tower' : 'wifi-off', iconColor: result.success ? 'text-teal-300' : 'text-amber-400', body: result.message || result.reason, effects: result.effects || {} });
  }

  // ==========================================
  // DARK ALTAR & PARANORMAL CRIMES SYSTEM
  // ==========================================

  openDarkAltarModal(preferredTarget = null) {
    if (!this.character.isAlive) return;
    if (!this.dom.darkAltarModal) return;

    this.updateDarkAltarPlayerStats();
    this.populateDarkAltarTargetSelect(preferredTarget);
    this.onDarkAltarTargetChanged();

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }

    this.dom.darkAltarModal.classList.remove('modal-closing', 'hidden');
    this.dom.darkAltarModal.style.display = 'flex';
  }

  closeDarkAltarModal() {
    if (this.dom.darkAltarModal) {
      this.animateCloseModal(this.dom.darkAltarModal);
    }
  }

  updateDarkAltarPlayerStats() {
    if (this.dom.darkAltarPlayerOccult) {
      this.dom.darkAltarPlayerOccult.textContent = `${this.character.stats.occult || 0}%`;
    }
    if (this.dom.darkAltarPlayerShillings) {
      this.dom.darkAltarPlayerShillings.textContent = `${this.character.shillings || 0} s.`;
    }
    if (this.dom.darkAltarPlayerEnergy) {
      this.dom.darkAltarPlayerEnergy.textContent = "Bound";
    }
    this.renderRitualCabinet();
  }

  renderRitualCabinet() {
    if (!window.ensureRitualSystem) return;
    const system = window.ensureRitualSystem(this.character);
    if (this.dom.darkAltarMaterials) {
      const labels = window.RITUAL_MATERIALS || {};
      const held = Object.entries(system.materials).filter(([, qty]) => qty > 0).map(([id, qty]) => `${labels[id] || id} ×${qty}`);
      this.dom.darkAltarMaterials.textContent = held.length ? held.join(' · ') : 'The cabinet is empty.';
    }
    if (this.dom.darkAltarLedger) {
      const unpaid = system.contracts.filter(item => item.hiddenPriceDueAge && !item.hiddenPriceCollected).length;
      const vessels = system.cursedObjects.length;
      this.dom.darkAltarLedger.textContent = `${system.contracts.length} contract${system.contracts.length === 1 ? '' : 's'} filed · ${unpaid} uncollected price${unpaid === 1 ? '' : 's'} · ${vessels} contaminated object${vessels === 1 ? '' : 's'}`;
    }
  }

  acquireDarkAltarMaterials() {
    if (!window.acquireRitualMaterials) return;
    const result = window.acquireRitualMaterials(this.character);
    this.updateDarkAltarPlayerStats();
    this.onDarkAltarTargetChanged();
    if (result.success) this.saveGame();
    this.openFeedbackModal({ tag: result.success ? 'OCCULT PROCUREMENT' : 'SEARCH BLOCKED', title: result.title || 'No Supplies Found', icon: result.success ? 'package-open' : 'alert-circle', iconColor: result.success ? 'text-purple-400' : 'text-amber-400', body: result.message || result.reason, effects: {} });
  }

  populateDarkAltarTargetSelect(preferredTarget = null) {
    if (!this.dom.darkAltarTargetSelect) return;
    const select = this.dom.darkAltarTargetSelect;
    select.innerHTML = '';

    // 1. None option (for untargeted crimes)
    const noneOpt = document.createElement('option');
    noneOpt.value = "__none__";
    noneOpt.textContent = "— No Individual Target (Untargeted Transgressions) —";
    select.appendChild(noneOpt);

    const allTargets = window.getAllPotentialTargets ? window.getAllPotentialTargets(this.character) : [];

    // Group targets
    const groups = {
      'Family': [],
      'Friends': [],
      'School Staff': [],
      'Classmates': [],
      'Supernatural': []
    };

    allTargets.forEach(t => {
      const g = groups[t.group] || groups['Friends'];
      g.push(t);
    });

    let preferredTargetId = null;
    if (preferredTarget) {
      preferredTargetId = preferredTarget.id || (preferredTarget.raw && preferredTarget.raw.id);
    }

    for (const [groupName, targets] of Object.entries(groups)) {
      if (targets.length === 0) continue;
      const optGroup = document.createElement('optgroup');
      optGroup.label = groupName;

      targets.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        const curseTag = t.curse ? ` [Afflicted: ${t.curse.name}]` : '';
        opt.textContent = `${t.name} (${t.role})${curseTag}`;
        if (preferredTargetId && t.id === preferredTargetId) {
          opt.selected = true;
        }
        optGroup.appendChild(opt);
      });

      select.appendChild(optGroup);
    }

    // If preferred target was set, make sure it is selected
    if (preferredTargetId) {
      select.value = preferredTargetId;
    }
  }

  onDarkAltarTargetChanged() {
    if (!this.dom.darkAltarTargetSelect) return;
    const targetId = this.dom.darkAltarTargetSelect.value;
    const allTargets = window.getAllPotentialTargets ? window.getAllPotentialTargets(this.character) : [];
    const selectedTarget = allTargets.find(t => t.id === targetId) || null;

    if (this.dom.darkAltarTargetStatus) {
      this.dom.darkAltarTargetStatus.textContent = selectedTarget ? selectedTarget.name : "Untargeted Transgressions";
    }

    if (this.dom.darkAltarTargetDetails) {
      if (selectedTarget) {
        this.dom.darkAltarTargetDetails.classList.remove('hidden');
        if (this.dom.darkAltarTargetRole) {
          this.dom.darkAltarTargetRole.textContent = `${selectedTarget.group} • ${selectedTarget.role} (Closeness: ${selectedTarget.relationship}%)`;
        }
        if (this.dom.darkAltarTargetCurse) {
          if (selectedTarget.curse) {
            this.dom.darkAltarTargetCurse.textContent = `Afflicted: ${selectedTarget.curse.name}`;
            this.dom.darkAltarTargetCurse.className = "text-rose-600 dark:text-rose-400 font-bold";
          } else {
            this.dom.darkAltarTargetCurse.textContent = "Uncursed";
            this.dom.darkAltarTargetCurse.className = "text-emerald-600 dark:text-emerald-400 font-bold";
          }
        }
      } else {
        this.dom.darkAltarTargetDetails.classList.add('hidden');
      }
    }

    this.renderDarkAltarRites(selectedTarget);
  }

  renderDarkAltarRites(selectedTarget = null) {
    if (!this.dom.darkAltarCrimesList) return;
    this.dom.darkAltarCrimesList.innerHTML = '';

    const crimes = window.PARANORMAL_CRIMES_DATA || [];
    const char = this.character;

    crimes.forEach(crime => {
      const card = document.createElement('div');
      
      const requiresTarget = crime.requiresTarget;
      const hasTarget = !!selectedTarget;
      const isCleanse = !!crime.isCleanse;
      const targetHasCurse = selectedTarget && selectedTarget.curse;
      const originKnown = !!targetHasCurse?.origin?.discovered;

      // Eligibility checks
      const meetsAge = char.age >= crime.minAge;
      const meetsOccult = (char.stats.occult || 0) >= crime.minOccult;
      const meetsShillings = (char.shillings || 0) >= crime.costShillings;
      const meetsEnergy = true;
      const targetCondition = requiresTarget ? (hasTarget && (!isCleanse || targetHasCurse)) : true;
      const canCast = meetsAge && meetsOccult && meetsShillings && meetsEnergy && targetCondition;

      card.className = `p-3 rounded-xl border transition-all space-y-2 ${
        canCast 
          ? 'bg-inputbg hover:bg-cardhover border-leadborder shadow-xs' 
          : 'bg-inputbg/40 border-leadborder/40 opacity-70'
      }`;

      // Success chance preview
      let chanceText = '';
      if (canCast) {
        const chance = crime.successChance(char, selectedTarget ? selectedTarget.raw : null);
        const pct = Math.round(chance * 100);
        chanceText = `<span class="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-semibold">Success Chance: ~${pct}%</span>`;
      }

      // Action button text and state
      let btnLabel = 'Prepare Contract';
      if (!meetsAge) {
        btnLabel = `Req. Age ${crime.minAge}`;
      } else if (!meetsOccult) {
        btnLabel = `Req. ${crime.minOccult}% Occult`;
      } else if (requiresTarget && !hasTarget) {
        btnLabel = 'Select Target';
      } else if (isCleanse && !targetHasCurse) {
        btnLabel = 'Target Not Cursed';
      } else if (isCleanse && !originKnown) {
        btnLabel = 'Trace Origin · 1 Energy';
      } else if (!meetsShillings) {
        btnLabel = `Req. ${crime.costShillings} s.`;
      } else if (!meetsEnergy) {
        btnLabel = 'No Energy';
      }

      const costDesc = [];
      if (crime.costShillings > 0) costDesc.push(`${crime.costShillings} Shillings`);
      costDesc.push(`${crime.energyCost} Energy`);

      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg ${canCast ? 'bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 dark:bg-purple-950/60 dark:border-purple-500/30' : 'bg-leadborder/20 text-dust'} flex items-center justify-center shrink-0">
              <i data-lucide="${crime.icon || 'moon'}" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="font-serif font-bold text-xs ${canCast ? 'text-purple-900 dark:text-purple-200' : 'text-parchment/70'}">${crime.name}</h4>
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold text-purple-700 bg-purple-500/10 border-purple-500/30 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-800/40">${crime.tag}</span>
            </div>
          </div>
          <div class="text-right text-[10px] font-mono text-dust">
            ${costDesc.join(' · ')}
          </div>
        </div>

        <p class="text-[11px] text-dust leading-relaxed">${crime.desc}</p>
        ${crime.intent ? `<div class="text-[10px] font-mono text-dust space-y-1"><p><span class="text-purple-700 dark:text-purple-300 font-bold">INTENT:</span> ${crime.intent}</p><p><span class="text-amber-700 dark:text-amber-300 font-bold">VISIBLE PRICE:</span> ${crime.visiblePrice}</p></div>` : ''}

        <div class="flex justify-between items-center pt-2 border-t border-leadborder/50">
          ${chanceText || `<span class="text-[10px] font-mono text-dust/70">Unlocks at ${crime.minOccult}% Occult</span>`}
          <button class="btn-execute-rite px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all ${
            canCast
              ? 'bg-purple-700 text-white hover:bg-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-800/70 dark:text-purple-200 border border-purple-600/60 active:scale-95 cursor-pointer shadow-md'
              : 'bg-leadborder/20 text-dust border border-leadborder/30 cursor-not-allowed opacity-60'
          }" ${canCast ? '' : 'disabled'}>
            ${btnLabel}
          </button>
        </div>
      `;

      if (canCast) {
        const btn = card.querySelector('.btn-execute-rite');
        btn.addEventListener('click', () => {
          if (crime.isCleanse && selectedTarget?.curse && !selectedTarget.curse.origin?.discovered) {
            this.traceDarkAltarCurse(selectedTarget.raw);
          } else {
            this.openRitualPreparation(crime.id, selectedTarget ? selectedTarget.raw : null);
          }
        });
      }

      this.dom.darkAltarCrimesList.appendChild(card);
    });

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  traceDarkAltarCurse(targetRaw) {
    const result = window.traceCurseOrigin ? window.traceCurseOrigin(this.character, targetRaw) : { success: false, reason: 'Origin tracing is unavailable.' };
    if (result.success) this.saveGame();
    this.onDarkAltarTargetChanged();
    this.updateDarkAltarPlayerStats();
    this.openFeedbackModal({ tag: result.outcome === 'success' ? 'ARCHIVE PROVENANCE' : 'TRACE FAILED', title: result.title || 'Origin Unknown', icon: result.outcome === 'success' ? 'folder-search-2' : 'scan-search', iconColor: result.outcome === 'success' ? 'text-purple-400' : 'text-rose-400', body: result.message || result.reason, effects: {} });
  }

  openRitualPreparation(crimeId, targetRaw) {
    const ritual = (window.PARANORMAL_CRIMES_DATA || []).find(item => item.id === crimeId);
    if (!ritual || !this.dom.ritualPreparation) return;
    const materials = window.getRitualMaterialStatus ? window.getRitualMaterialStatus(this.character, crimeId) : [];
    const chance = Math.round(ritual.successChance(this.character, targetRaw) * 100);
    this.preparedRitual = { crimeId, targetRaw };
    this.dom.ritualPrepName.textContent = ritual.name;
    this.dom.ritualPrepIntent.textContent = ritual.intent || ritual.desc;
    this.dom.ritualPrepChance.textContent = `~${chance}% before witnesses and wording`;
    this.dom.ritualPrepPrice.textContent = ritual.visiblePrice || `${ritual.costShillings} shillings and ${ritual.energyCost} Energy`;
    this.dom.ritualPrepMaterials.innerHTML = materials.map(item => `<div class="flex justify-between items-center rounded-lg border ${item.met ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'} px-3 py-2 text-[11px]"><span class="text-parchment">${item.label} ×${item.qty}</span><span class="font-mono ${item.met ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}">${item.held}/${item.qty} ${item.met ? 'READY' : 'MISSING'}</span></div>`).join('');
    this.dom.ritualPrepBackfires.innerHTML = (ritual.backfires || []).map(text => `<li>${text}</li>`).join('');
    this.dom.ritualPrepWording.value = String(ritual.wording || '').replaceAll('{target}', targetRaw?.name || 'the named target');
    this.dom.btnSealRitual.disabled = materials.some(item => !item.met);
    this.dom.btnSealRitual.classList.toggle('opacity-50', this.dom.btnSealRitual.disabled);
    this.dom.ritualPreparation.classList.remove('hidden');
    this.dom.ritualPreparation.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }

  closeRitualPreparation() {
    if (!this.dom.ritualPreparation) return;
    this.dom.ritualPreparation.classList.add('hidden');
    this.dom.ritualPreparation.classList.remove('flex');
    this.preparedRitual = null;
  }

  sealPreparedRitual() {
    if (!this.preparedRitual) return;
    const { crimeId, targetRaw } = this.preparedRitual;
    const wording = this.dom.ritualPrepWording?.value || '';
    this.closeRitualPreparation();
    this.executeDarkAltarCrime(crimeId, targetRaw, wording);
  }

  executeDarkAltarCrime(crimeId, targetRaw, wording = '') {
    if (!window.executeParanormalCrime) return;

    const result = window.executePreparedRitual
      ? window.executePreparedRitual(crimeId, this.character, targetRaw, wording)
      : window.executeParanormalCrime(crimeId, this.character, targetRaw);
    if (!result.success) {
      this.openFeedbackModal({
        tag: "RITE BLOCKED",
        title: "Invocation Failed",
        icon: "alert-circle",
        iconColor: "text-amber-400",
        body: result.reason || "The forces refused your rite.",
        effects: {}
      });
      return;
    }

    this.closeDarkAltarModal();

    if (result.outcome === 'backfire') {
      window.soundEngine.playDread();
      this.vibrate([100, 50, 100]);
    } else if (result.outcome === 'caught') {
      window.soundEngine.playClick();
      this.vibrate(60);
    } else {
      window.soundEngine.playDread();
      this.vibrate([40, 30, 70]);
    }

    if (result.outcome === 'caught' && crimeId.startsWith('crime_') && window.addConsequence) {
      window.addConsequence(this.character, { type: 'criminal_record', label: 'Occult Criminal Record', detail: result.message, source: result.title, severity: 2, yearsRemaining: null });
    }
    const altarNotes = window.processLifeOutcome ? window.processLifeOutcome(this.character, { domain: result.outcome === 'caught' ? 'crime' : 'supernatural', result: { title: result.title, body: result.message, effects: result.effects || (result.outcome === 'backfire' ? { sanity: -6 } : {}) } }) : [];
    if (window.recordHorrorOutcome) window.recordHorrorOutcome(this.character, { source: 'dark_rite', title: result.title, outcome: result.message, effects: result.effects, genuine: true, engaged: true });
    if (window.recordEntityEncounter) window.recordEntityEncounter(this.character, { source: 'dark_rite', title: result.title, outcome: result.message, effects: result.effects });

    // Chronicle logging
    const latestLog = this.logs[this.logs.length - 1];
    if (latestLog) {
      latestLog.entries.push(`[Dark Altar] ${result.title}: ${result.message}`);
      if (result.contract) latestLog.entries.push(`[Ritual Contract] “${result.contract.wording}” Visible price: ${result.contract.visiblePrice}`);
      altarNotes.forEach(note => latestLog.entries.push(`[Life Effect] ${note}`));
    }

    this.renderAll();
    this.saveGame();

    // Show feedback dialog
    const iconColor = result.outcome === 'success' 
      ? 'text-purple-400' 
      : (result.outcome === 'backfire' ? 'text-rose-400' : 'text-amber-400');

    this.openFeedbackModal({
      tag: result.outcome === 'success' ? "DARK RITE CONCLUDED" : (result.outcome === 'backfire' ? "HEX REFLECTION" : "DISCOVERED"),
      title: result.title,
      icon: result.outcome === 'success' ? "moon" : (result.outcome === 'backfire' ? "zap-off" : "alert-triangle"),
      iconColor: iconColor,
      body: result.message,
      effects: {}
    });
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
