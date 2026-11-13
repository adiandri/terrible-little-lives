// Interactive Activity Subsystems & Workplace Engine for Terrible Little Lives
// Implements:
// - Custom Gothic Vector SVG Emblems (replacing emojis across hubs, cards, and submenus)
// - Phase 1A: Mundane Full-Time & Part-Time (Age 14+) Workplace Dashboard, Performance/Stress, Coworkers & Supervisor
// - Phase 1B: Unique Gothic/Horror Nocturnal Syndicate Workplace (Paid in Shillings s., Covenant Favor, Veil Exposure, Occult Handler)
// - Phase 2: Underworld & Crime Operations Submenu (Police Heat, Target Casing, Approach Selector, Fence/Bribe)
// - Phase 3: Daily Life Quarters/Ledger, Wellbeing Infirmary/Sanitarium, Leisure Mastery (0-100%), and Explore Expeditions

(function () {
  'use strict';

  function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(val)));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ============================================================================
  // 1. CUSTOM GOTHIC VECTOR SVG EMBLEMS (Replaces Emojis)
  // ============================================================================
  function getCategorySVGEmblem(categoryKey) {
    const emblems = {
      occupation: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="11" width="26" height="18" rx="3" fill="currentColor" fill-opacity="0.10"/>
        <path d="M13 11V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/>
        <path d="M5 18h26"/>
        <circle cx="18" cy="18" r="2.2" fill="currentColor"/>
      </svg>`,
      daily_life: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 17L18 7l12 10"/>
        <path d="M9 15v14h18V15" fill="currentColor" fill-opacity="0.10"/>
        <path d="M15 29v-8h6v8"/>
        <circle cx="18" cy="12.5" r="1.5" fill="currentColor"/>
      </svg>`,
      leisure: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6C11.4 6 6 11 6 17.2c0 6.2 5.4 11.2 12 11.2 2 0 3.4-1.5 3.4-3.2 0-.8-.3-1.5-.8-2.1-.5-.5-.7-1.2-.7-1.9 0-1.7 1.4-3 3.1-3H25c3.3 0 5-2.2 5-5C30 9.4 24.6 6 18 6z" fill="currentColor" fill-opacity="0.10"/>
        <circle cx="12.5" cy="14.5" r="1.4" fill="currentColor"/>
        <circle cx="17.5" cy="11.5" r="1.4" fill="currentColor"/>
        <circle cx="22.5" cy="13.5" r="1.4" fill="currentColor"/>
      </svg>`,
      explore: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="18" r="12" fill="currentColor" fill-opacity="0.10"/>
        <polygon points="15.5,15.5 23,13 20.5,20.5 13,23" fill="currentColor" fill-opacity="0.25"/>
        <path d="M18 6v2M18 28v2M6 18h2M28 18h2"/>
      </svg>`,
      wellbeing: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 29s-10-6.2-10-13.5C8 11.4 11.2 8.5 14.8 8.5c2.1 0 3.2 1.2 3.2 2.5 0-1.3 1.1-2.5 3.2-2.5 3.6 0 6.8 2.9 6.8 7C28 22.8 18 29 18 29z" fill="currentColor" fill-opacity="0.10"/>
        <path d="M11 18h4l2-3.5 2.5 7 2-3.5H25"/>
      </svg>`,
      trouble: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6l10 4.5v7.5c0 6.8-4.3 11.2-10 13-5.7-1.8-10-6.2-10-13v-7.5L18 6z" fill="currentColor" fill-opacity="0.10"/>
        <path d="M18 12v7"/>
        <circle cx="18" cy="23" r="1.2" fill="currentColor"/>
      </svg>`,
      digital_life: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <rect x="11" y="6" width="14" height="24" rx="2.5" fill="currentColor" fill-opacity="0.10"/>
        <path d="M15 9.5h6"/>
        <circle cx="18" cy="26.5" r="1" fill="currentColor"/>
        <path d="M7 13a11 11 0 0 1 0 10M29 13a11 11 0 0 0 0 10" opacity="0.6"/>
      </svg>`,
      paranormal: `<svg viewBox="0 0 36 36" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 18s5-8 13-8 13 8 13 8-5 8-13 8-13-8-13-8z" fill="currentColor" fill-opacity="0.12"/>
        <circle cx="18" cy="18" r="4.2"/>
        <circle cx="18" cy="18" r="1.6" fill="currentColor"/>
        <path d="M18 6v2.5M18 27.5V30M9 9.5l1.8 1.8M27 9.5l-1.8 1.8"/>
      </svg>`
    };
    return emblems[categoryKey] || emblems.explore;
  }

  function getActivitySVGIcon(act, isLocked) {
    if (isLocked) {
      return `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
    }
    const cat = act ? act.category : '';
    const map = {
      work: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>`,
      education: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12.5v5c3 2 9 2 12 0v-5"/></svg>`,
      money: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.8 2.5 2.2 2.5 1 2.5 2.3-1 2-2.5 2c-1.2 0-2.2-.5-2.7-1.5M12 6.5v11"/></svg>`,
      home: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9v11h14V9"/><path d="M9.5 20v-6h5v6"/></svg>`,
      media: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 3l4 3 4-3"/></svg>`,
      hobbies: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2.5-1 2.5-2.2 0-.6-.2-1.1-.6-1.5-.4-.4-.6-.9-.6-1.5 0-1.2 1-2.2 2.2-2.2H17a4 4 0 0 0 4-4c0-3.8-4-6.6-9-6.6z"/></svg>`,
      games: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>`,
      travel: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polygon points="10,10 16,8 14,14 8,16"/></svg>`,
      places: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
      wildlife: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 4c2 0 4 1.5 4 4 0 3.5-3 6-7 7l-3 5H7l1.5-4.5C6 15 4 13 4 10c0-2 1.5-3.5 3.5-3.5 1.2 0 2.2.6 2.8 1.5C11.5 5.5 13.5 4 16 4z"/></svg>`,
      medical: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.5-7-9.5A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.5C19 15.5 12 20 12 20z"/><path d="M12 10v5M9.5 12.5h5"/></svg>`,
      mental: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.5 4A4.5 4.5 0 0 0 5 8.5c0 1.4.6 2.6 1.5 3.4A4.5 4.5 0 0 0 8 19h1.5V4z"/><path d="M14.5 4A4.5 4.5 0 0 1 19 8.5c0 1.4-.6 2.6-1.5 3.4A4.5 4.5 0 0 1 16 19h-1.5V4z"/></svg>`,
      crime: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 3.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6L12 3z"/><path d="M12 8v5"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`,
      legal: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18M5 7h14M5 7l-3 6h6l-3-6zM19 7l-3 6h6l-3-6z"/><path d="M8 21h8"/></svg>`,
      phone: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>`,
      internet: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
      horror: `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`
    };
    return map[cat] || `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12,2 15,9 22,9.5 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.5 9,9"/></svg>`;
  }

  // ============================================================================
  // 2. PHASE 1A: MUNDANE & PART-TIME WORKPLACE SUBSYSTEM
  // ============================================================================
  const COWORKER_ARCHETYPES = [
    { trait: "Strict Micromanager", desc: "Watches the clock and keeps a leather ledger of tardiness." },
    { trait: "Office Gossiper", desc: "Whispers beside the water cooler and knows everyone's secrets." },
    { trait: "Paranoid Veteran", desc: "Has worked here twelve years and refuses to enter the supply room." },
    { trait: "Exhausted Intern", desc: "Survives on cold espresso and trembles when the phone rings." },
    { trait: "Uncanny Night-Shifter", desc: "Never blinks under the fluorescent lights and hums tunelessly." }
  ];

  function ensureMundaneWorkplace(character) {
    const activeJob = character.job || character.partTimeJob;
    if (!activeJob) return null;

    if (!character.workplace || character.workplace.jobId !== activeJob.id) {
      const poolNames = [
        { name: "Morgan Pike", gender: "Male" },
        { name: "Iris Bell", gender: "Female" },
        { name: "Jonah Voss", gender: "Male" },
        { name: "Clara Finch", gender: "Female" },
        { name: "Rowan Hale", gender: "Male" },
        { name: "Evelyn Cross", gender: "Female" },
        { name: "Arthur Pendelton", gender: "Male" }
      ];
      const shuffled = [...poolNames].sort(() => Math.random() - 0.5).slice(0, 3);
      character.workplace = {
        jobId: activeJob.id,
        isPartTime: !!activeJob.isPartTime,
        performance: 62,
        stress: activeJob.stress || 15,
        hoursPerWeek: activeJob.isPartTime ? (activeJob.defaultHours || 15) : 40,
        tenureYears: 0,
        raisesCount: 0,
        anomalyStage: 0,
        colleagues: shuffled.map((entry, idx) => {
          const arch = COWORKER_ARCHETYPES[idx % COWORKER_ARCHETYPES.length];
          const age = idx === 0 ? Math.max(28, character.age + 9) : Math.max(16, character.age + (idx * 3 - 2));
          return {
            id: `coworker_${activeJob.id}_${idx}`,
            category: 'coworker',
            role: idx === 0 ? (activeJob.isPartTime ? 'Shift Manager' : 'Supervisor') : 'Coworker',
            name: entry.name,
            gender: entry.gender,
            age,
            alive: true,
            trait: arch.trait,
            traitDesc: arch.desc,
            relationship: 45 + Math.floor(Math.random() * 20),
            credibility: 50 + Math.floor(Math.random() * 30),
            avatar: window.generateRandomAvatar
              ? window.generateRandomAvatar({ age, gender: entry.gender })
              : { skin: 'ivory', hairStyle: 'parted', hairColor: 'dark_brown', eyeColor: 'brown', clothing: 'suit' }
          };
        })
      };
    }
    return character.workplace;
  }

  function getActiveMundaneAnnualPay(character) {
    if (character.job) {
      const base = character.job.baseSalary || 24000;
      const bonusMult = 1 + ((character.workplace && character.workplace.raisesCount) ? character.workplace.raisesCount * 0.08 : 0);
      return window.getAdjustedSalary(Math.round(base * bonusMult), character.countryCode);
    }
    if (character.partTimeJob) {
      const wp = ensureMundaneWorkplace(character);
      const hrs = wp ? wp.hoursPerWeek : (character.partTimeJob.defaultHours || 15);
      const rate = (character.partTimeJob.hourlyRate || 13) * (1 + ((wp && wp.raisesCount) ? wp.raisesCount * 0.08 : 0));
      const rawAnnual = Math.round(rate * hrs * 52);
      return window.getAdjustedSalary(rawAnnual, character.countryCode);
    }
    return 0;
  }

  function renderMundaneWorkplaceHTML(character, selectedColleagueId) {
    const activeJob = character.job || character.partTimeJob;
    if (!activeJob) return '';
    const wp = ensureMundaneWorkplace(character);
    const annualPay = getActiveMundaneAnnualPay(character);
    const formattedPay = window.formatMoney ? window.formatMoney(annualPay, character.countryCode) : `$${annualPay.toLocaleString()}`;

    const hoursControls = activeJob.isPartTime ? `
      <div class="pt-2 border-t border-leadborder/60 flex items-center justify-between gap-2">
        <span class="text-[10px] font-mono text-dust uppercase tracking-wider">Weekly Shift Hours:</span>
        <div class="flex items-center gap-1">
          ${[10, 15, 20, 30].map(h => `
            <button data-wp-hours="${h}" class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all ${
              wp.hoursPerWeek === h
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slatecard text-dust border-leadborder hover:text-parchment'
            }">${h}h/wk</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    const colleaguesHTML = wp.colleagues.map(col => {
      const svgAvatar = window.buildGothicAvatarSVG ? window.buildGothicAvatarSVG({ ...col.avatar, age: col.age, gender: col.gender }) : '';
      const isSelected = selectedColleagueId === col.id;
      const relColor = col.relationship >= 65 ? 'bg-emerald-500' : (col.relationship >= 35 ? 'bg-amber-400' : 'bg-rose-500');
      return `
        <div class="rounded-xl border ${isSelected ? 'border-emerald-500/60 bg-slatecard' : 'border-leadborder/80 bg-inputbg'} p-2.5 transition-all space-y-2">
          <div class="flex items-center justify-between gap-2.5">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-leadborder shrink-0">${svgAvatar}</div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <strong class="font-serif text-xs text-parchment truncate">${col.name}</strong>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slatecard border border-leadborder text-amber-300 shrink-0">${col.role}</span>
                </div>
                <p class="text-[10px] text-dust truncate">${col.trait} · Age ${col.age}</p>
                <div class="w-full h-1.5 bg-slatecard rounded-full overflow-hidden mt-1 border border-leadborder/50">
                  <div class="h-full ${relColor}" style="width:${clamp(col.relationship)}%"></div>
                </div>
              </div>
            </div>
            <button data-wp-colleague="${col.id}" class="px-2.5 py-1.5 rounded-lg bg-slatecard hover:bg-cardhover border border-leadborder text-[10px] font-serif font-bold text-parchment shrink-0 active:scale-95 transition-all">
              ${isSelected ? 'Close' : 'Interact'}
            </button>
          </div>
          ${isSelected ? `
            <div class="pt-2 border-t border-leadborder/60 space-y-1.5">
              <p class="text-[10px] text-dust italic">"${col.traitDesc}" (Rapport: ${col.relationship}%)</p>
              <div class="grid grid-cols-2 gap-1.5">
                <button data-wp-col-act="chat" data-col-id="${col.id}" class="p-2 rounded-lg bg-inputbg hover:bg-cardhover border border-leadborder text-left text-[10px] font-serif font-bold text-parchment">Converse & Bond</button>
                <button data-wp-col-act="cover" data-col-id="${col.id}" class="p-2 rounded-lg bg-inputbg hover:bg-cardhover border border-leadborder text-left text-[10px] font-serif font-bold text-emerald-300">Cover Shift / Coffee</button>
                <button data-wp-col-act="sabotage" data-col-id="${col.id}" class="p-2 rounded-lg bg-inputbg hover:bg-cardhover border border-leadborder text-left text-[10px] font-serif font-bold text-amber-300">Sabotage / Rumor</button>
                <button data-wp-col-act="hr" data-col-id="${col.id}" class="p-2 rounded-lg bg-inputbg hover:bg-cardhover border border-leadborder text-left text-[10px] font-serif font-bold text-sky-300">Report to HR</button>
                <button data-wp-col-act="hex" data-col-id="${col.id}" class="col-span-2 p-2 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-700/50 text-left text-[10px] font-serif font-bold text-purple-200">Whisper Workplace Hex (1 s. / Occult)</button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="rounded-2xl border border-emerald-500/40 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[9px] font-mono uppercase tracking-widest text-emerald-400 block">${activeJob.isPartTime ? 'Active Part-Time Shift' : 'Active Workplace Dossier'}</span>
            <h4 class="font-serif font-bold text-sm text-parchment truncate">${activeJob.title}</h4>
            <span class="text-[11px] font-mono font-bold text-fiat">${formattedPay} / yr · ${wp.hoursPerWeek}h/wk</span>
          </div>
          <button data-wp-act="resign" class="px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono text-red-300 shrink-0">Resign</button>
        </div>

        <!-- Performance & Stress Meters -->
        <div class="grid grid-cols-2 gap-2.5 bg-inputbg p-2.5 rounded-xl border border-leadborder">
          <div>
            <div class="flex justify-between text-[10px] font-mono mb-1">
              <span class="text-emerald-400 font-semibold">Performance</span>
              <span class="text-parchment">${wp.performance}%</span>
            </div>
            <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style="width:${wp.performance}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] font-mono mb-1">
              <span class="text-rose-400 font-semibold">Shift Stress</span>
              <span class="text-parchment">${wp.stress}%</span>
            </div>
            <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-500 to-rose-500" style="width:${wp.stress}%"></div>
            </div>
          </div>
        </div>

        ${hoursControls}

        <!-- Workplace Submenu Actions -->
        <div class="space-y-1.5">
          <span class="text-[9px] font-mono uppercase tracking-wider text-dust block">Workplace Actions</span>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-wp-act="work_harder" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Work Harder</strong>
              <span class="text-[10px] text-emerald-400 font-mono">+Perf · +Overtime $</span>
            </button>
            <button data-wp-act="slack_off" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Slack Off</strong>
              <span class="text-[10px] text-sky-400 font-mono">-Stress · +Happy</span>
            </button>
            <button data-wp-act="ask_raise" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Request Raise / Promo</strong>
              <span class="text-[10px] text-amber-300 font-mono">Needs 70%+ Perf</span>
            </button>
            <button data-wp-act="pilfer" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Skim Register</strong>
              <span class="text-[10px] text-rose-400 font-mono">+Fast Cash · Firing Risk</span>
            </button>
            <button data-wp-act="anomaly" class="col-span-2 p-2.5 rounded-xl bg-purple-950/25 hover:bg-purple-900/35 border border-purple-700/50 text-left transition-all active:scale-95 flex items-center justify-between">
              <div>
                <strong class="block font-serif text-xs text-purple-200">Investigate Back-Room Anomaly</strong>
                <span class="text-[10px] text-purple-300/80 font-mono">Uncanny shift occurrence · Yields Shillings (s.)</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/50 text-amber-300 border border-amber-500/30">+s.</span>
            </button>
          </div>
        </div>

        <!-- Supervisor & Coworkers -->
        <div class="space-y-1.5">
          <span class="text-[9px] font-mono uppercase tracking-wider text-dust block">Supervisor & Coworkers</span>
          <div class="space-y-2">${colleaguesHTML}</div>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 3. PHASE 1B: UNIQUE GOTHIC HORROR WORKPLACE (PAID IN SHILLINGS s.)
  // ============================================================================
  const OCCULT_RANKS = ["Candlesworn Initiate", "Veil Acolyte", "Reliquary Keeper", "Nocturnal Arch-Operative"];

  function ensureOccultWorkplace(character) {
    const gig = character.paranormalGig;
    if (!gig) return null;
    if (!character.occultWorkplace || character.occultWorkplace.gigId !== gig.id) {
      const handlers = [
        { name: "Notary Vane", role: "Arch-Handler", skin: "mortuary", eyeColor: "milky_blind", hairColor: "silver_gray", trait: "Speaks in dry rustles; counts teeth instead of coins." },
        { name: "Sister Vespera", role: "Covenant Auditor", skin: "porcelain", eyeColor: "crimson", hairColor: "raven", trait: "Wears mourning crepe that smells of rain and myrrh." },
        { name: "Curator Malakor", role: "Reliquary Overseer", skin: "ash", eyeColor: "golden", hairColor: "pure_white", trait: "Never casts a shadow toward the east wall." }
      ];
      const initiates = [
        { name: "Gideon Sallow", role: "Lantern-Bearer", gender: "Male", skin: "sallow", eyeColor: "amber", hairColor: "dark_brown", trait: "Carries a brass oil lamp that burns green near lies." },
        { name: "Ligeia Morel", role: "Bone-Scribe", gender: "Female", skin: "bruised", eyeColor: "violet", hairColor: "raven", trait: "Transcribes cellar echoes onto vellum strips." }
      ];
      const chosenHandler = pick(handlers);
      character.occultWorkplace = {
        gigId: gig.id,
        covenantFavor: 55,
        veilExposure: 22,
        rankIndex: 0,
        bonusShillings: 0,
        operants: [
          {
            id: `occult_handler_${gig.id}`,
            role: chosenHandler.role,
            name: chosenHandler.name,
            gender: chosenHandler.name.startsWith("Sister") ? "Female" : "Male",
            age: 58,
            trait: chosenHandler.trait,
            relationship: 50,
            avatar: {
              skin: chosenHandler.skin,
              eyeColor: chosenHandler.eyeColor,
              hairColor: chosenHandler.hairColor,
              hairStyle: chosenHandler.name.startsWith("Sister") ? "straight_long" : "parted",
              clothing: "goth",
              clothingColor: "black"
            }
          },
          ...initiates.map((init, i) => ({
            id: `occult_init_${gig.id}_${i}`,
            role: init.role,
            name: init.name,
            gender: init.gender,
            age: Math.max(19, character.age + (i === 0 ? 2 : -1)),
            trait: init.trait,
            relationship: 48 + i * 7,
            avatar: {
              skin: init.skin,
              eyeColor: init.eyeColor,
              hairColor: init.hairColor,
              hairStyle: init.gender === "Female" ? "loose_waves" : "wolf_cut",
              clothing: "turtleneck",
              clothingColor: "burgundy"
            }
          }))
        ]
      };
    }
    return character.occultWorkplace;
  }

  function renderOccultWorkplaceHTML(character, selectedOperantId) {
    const gig = character.paranormalGig;
    if (!gig) return '';
    const ow = ensureOccultWorkplace(character);
    const rankTitle = OCCULT_RANKS[ow.rankIndex] || OCCULT_RANKS[0];
    const totalStipend = (gig.payoutShillings || 5) + (ow.bonusShillings || 0);

    const operantsHTML = ow.operants.map(op => {
      const svgAvatar = window.buildGothicAvatarSVG ? window.buildGothicAvatarSVG({ ...op.avatar, age: op.age, gender: op.gender }) : '';
      const isSelected = selectedOperantId === op.id;
      return `
        <div class="rounded-xl border ${isSelected ? 'border-amber-500/60 bg-purple-950/35' : 'border-purple-800/50 bg-inputbg'} p-2.5 transition-all space-y-2">
          <div class="flex items-center justify-between gap-2.5">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-purple-600/50 shrink-0">${svgAvatar}</div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <strong class="font-serif text-xs text-parchment truncate">${op.name}</strong>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-shilling shrink-0">${op.role}</span>
                </div>
                <p class="text-[10px] text-purple-200/75 truncate">${op.trait}</p>
                <div class="w-full h-1.5 bg-slatecard rounded-full overflow-hidden mt-1 border border-purple-900/60">
                  <div class="h-full bg-gradient-to-r from-purple-500 to-amber-400" style="width:${clamp(op.relationship)}%"></div>
                </div>
              </div>
            </div>
            <button data-ow-operant="${op.id}" class="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-[10px] font-serif font-bold text-amber-300 shrink-0 active:scale-95 transition-all">
              ${isSelected ? 'Close' : 'Commune'}
            </button>
          </div>
          ${isSelected ? `
            <div class="pt-2 border-t border-purple-800/50 space-y-1.5">
              <p class="text-[10px] text-purple-200/80 italic">"${op.trait}" (Covenant Bond: ${op.relationship}%)</p>
              <div class="grid grid-cols-2 gap-1.5">
                <button data-ow-op-act="ledger" data-op-id="${op.id}" class="p-2 rounded-lg bg-inputbg hover:bg-purple-950/50 border border-purple-800/50 text-left text-[10px] font-serif font-bold text-parchment">Study Forbidden Ledger</button>
                <button data-ow-op-act="tribute" data-op-id="${op.id}" class="p-2 rounded-lg bg-inputbg hover:bg-purple-950/50 border border-purple-800/50 text-left text-[10px] font-serif font-bold text-shilling">Offer Tribute (1 s.)</button>
                <button data-ow-op-act="ward" data-op-id="${op.id}" class="p-2 rounded-lg bg-inputbg hover:bg-purple-950/50 border border-purple-800/50 text-left text-[10px] font-serif font-bold text-emerald-300">Bind Mutual Ward</button>
                <button data-ow-op-act="pilfer_relic" data-op-id="${op.id}" class="p-2 rounded-lg bg-inputbg hover:bg-purple-950/50 border border-purple-800/50 text-left text-[10px] font-serif font-bold text-rose-300">Steal Reliquary (+s.)</button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="rounded-2xl border border-amber-500/45 bg-gradient-to-b from-purple-950/35 to-slatecard p-3.5 space-y-3 shadow-md">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[9px] font-mono uppercase tracking-widest text-shilling block">Nocturnal Syndicate · ${rankTitle}</span>
            <h4 class="font-serif font-bold text-sm text-parchment truncate">${gig.title}</h4>
            <span class="text-[11px] font-mono font-bold text-shilling">${totalStipend} Shillings (s.) / yr · Paid in Occult Coin</span>
          </div>
          <button data-ow-act="sever" class="px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono text-red-300 shrink-0">Sever Pact</button>
        </div>

        <!-- Covenant Favor & Veil Exposure Meters -->
        <div class="grid grid-cols-2 gap-2.5 bg-inputbg/90 p-2.5 rounded-xl border border-purple-800/50">
          <div>
            <div class="flex justify-between text-[10px] font-mono mb-1">
              <span class="text-shilling font-semibold">Covenant Favor</span>
              <span class="text-parchment">${ow.covenantFavor}%</span>
            </div>
            <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-600 to-amber-300" style="width:${ow.covenantFavor}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[10px] font-mono mb-1">
              <span class="text-purple-300 font-semibold">Veil Exposure</span>
              <span class="text-parchment">${ow.veilExposure}%</span>
            </div>
            <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-600 to-rose-500" style="width:${ow.veilExposure}%"></div>
            </div>
          </div>
        </div>

        <!-- Unique Gothic Workplace Actions (Paid in Shillings) -->
        <div class="space-y-1.5">
          <span class="text-[9px] font-mono uppercase tracking-wider text-purple-300/80 block">Sanctum & Field Operations (Shillings)</span>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-ow-act="field_assignment" class="p-2.5 rounded-xl bg-inputbg hover:bg-purple-950/40 border border-purple-800/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Nocturnal Field Duty</strong>
              <span class="text-[10px] text-shilling font-mono">+3–6 s. · +Favor · +Exposure</span>
            </button>
            <button data-ow-act="catalog_relics" class="p-2.5 rounded-xl bg-inputbg hover:bg-purple-950/40 border border-purple-800/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Catalog Cursed Relics</strong>
              <span class="text-[10px] text-purple-300 font-mono">+2–3 s. · +Occult · +Smarts</span>
            </button>
            <button data-ow-act="fortify_wards" class="p-2.5 rounded-xl bg-inputbg hover:bg-purple-950/40 border border-purple-800/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Burn Salt & Ward Self</strong>
              <span class="text-[10px] text-emerald-400 font-mono">Costs 1 s. · -28% Exposure</span>
            </button>
            <button data-ow-act="petition_rank" class="p-2.5 rounded-xl bg-inputbg hover:bg-purple-950/40 border border-purple-800/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Petition Higher Stipend</strong>
              <span class="text-[10px] text-amber-300 font-mono">Needs 65%+ Favor (+s./yr)</span>
            </button>
            <button data-ow-act="siphon_vault" class="col-span-2 p-2.5 rounded-xl bg-amber-950/25 hover:bg-amber-900/35 border border-amber-600/40 text-left transition-all active:scale-95 flex items-center justify-between">
              <div>
                <strong class="block font-serif text-xs text-amber-200">Siphon Shillings from the Black Reliquary</strong>
                <span class="text-[10px] text-amber-300/80 font-mono">High Shilling theft (+6–11 s.) · Severe curse if caught</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-900/50 text-shilling border border-amber-500/40">+6–11 s.</span>
            </button>
          </div>
        </div>

        <!-- Handler & Initiates Roster -->
        <div class="space-y-1.5">
          <span class="text-[9px] font-mono uppercase tracking-wider text-purple-300/80 block">Handler & Fellow Initiates</span>
          <div class="space-y-2">${operantsHTML}</div>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 4. PHASE 2 & 3: SECTOR SUBMENU DASHBOARDS (Trouble, Daily Life, Wellbeing, Leisure, Explore)
  // ============================================================================
  function ensureSectorState(character) {
    if (!character.subsystems) {
      character.subsystems = {
        crime: {
          heat: 0,
          notoriety: 5,
          selectedOp: 'burglary',
          selectedTarget: 'alderman_manor',
          selectedApproach: 'stealth',
          cased: false,
          stolenLootValue: 0
        },
        home: {
          tierIndex: 0,
          condition: 74,
          cellarExplored: 0,
          loanDebt: 0
        },
        wellbeing: {
          regimenStreak: 0
        },
        leisure: {
          activeCraft: 'violin',
          mastery: {
            violin: 18,
            painting: 12,
            lockpicking: 10,
            occult_sketch: 15,
            literature: 20
          }
        },
        explore: {
          selectedSite: 'sanatorium',
          discoveries: 0
        }
      };
    }
    return character.subsystems;
  }

  const CRIME_OPS = {
    pickpocket: { name: "Pickpocket & Cutpurse", minAge: 10, baseSuccess: 0.72, basePayout: 140, heatGain: 8 },
    shoplift:   { name: "Boutique Shoplifting", minAge: 10, baseSuccess: 0.70, basePayout: 260, heatGain: 12 },
    burglary:   { name: "Midnight Burglary", minAge: 14, baseSuccess: 0.58, basePayout: 1450, heatGain: 22 },
    gta:        { name: "Grand Theft Auto", minAge: 15, baseSuccess: 0.52, basePayout: 3400, heatGain: 30 },
    embezzle:   { name: "Ledger Embezzlement", minAge: 16, baseSuccess: 0.60, basePayout: 4800, heatGain: 25 },
    arson:      { name: "Insurance Arson", minAge: 16, baseSuccess: 0.50, basePayout: 5500, heatGain: 38 }
  };

  const CRIME_TARGETS = {
    corner_shop:    { name: "Foggy Corner Bodega", mult: 0.6, riskMod: 0.12 },
    alderman_manor: { name: "Alderman's Gaslit Townhouse", mult: 1.3, riskMod: -0.04 },
    pawn_vault:     { name: "24-Hour Pawn & Reliquary Vault", mult: 1.7, riskMod: -0.10, bonusShillings: 3 },
    precinct_lock:  { name: "Municipal Evidence Locker", mult: 2.2, riskMod: -0.18, bonusShillings: 5 }
  };

  const HOME_TIERS = [
    { name: "Drafty Childhood / Shared Room", upgradeCost: 0 },
    { name: "Cramped Garret Studio", upgradeCost: 2500 },
    { name: "Gaslit Victorian Flat", upgradeCost: 9500 },
    { name: "Wrought-Iron Townhouse", upgradeCost: 35000 }
  ];

  const CRAFTS = {
    violin:        { name: "Nocturne Violin & Strings", stat: "happiness" },
    painting:      { name: "Chiaroscuro Oil Painting", stat: "smarts" },
    lockpicking:   { name: "Lockpicking & Sleight", stat: "smarts" },
    occult_sketch: { name: "Automatic & Occult Sketching", stat: "occult" },
    literature:    { name: "Gothic Poetry & Manuscripts", stat: "sanity" }
  };

  const EXPLORE_SITES = {
    sanatorium: { name: "St. Jude's Abandoned Sanatorium", danger: "High", shillingYield: 3 },
    blackwood:  { name: "Blackwood Pines & Hollow", danger: "Moderate", shillingYield: 2 },
    catacombs:  { name: "Sub-Municipal Brick Catacombs", danger: "Extreme", shillingYield: 5 },
    harbor_pier:{ name: "Fogbound Whaling Pier", danger: "Low", shillingYield: 2 }
  };

  function renderSectorSubmenuHTML(character, categoryKey, selectedColleagueId) {
    const sub = ensureSectorState(character);

    // 1. OCCUPATION / WORK
    if (categoryKey === 'occupation' || categoryKey === 'work') {
      const mundaneHTML = (character.job || character.partTimeJob)
        ? renderMundaneWorkplaceHTML(character, selectedColleagueId)
        : `
          <div class="rounded-2xl border border-leadborder bg-inputbg p-3.5 flex items-center justify-between gap-3">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-wider text-emerald-400 block">Daytime Livelihood</span>
              <h4 class="font-serif font-bold text-xs text-parchment">${character.age < 14 ? `Part-Time Shifts Unlock at Age 14` : `Unemployed · Full-Time & Part-Time Open`}</h4>
              <p class="text-[10px] text-dust mt-0.5">Open the Employment Dossier to apply for full-time careers, teen part-time shifts (14+), or nocturnal shilling contracts.</p>
            </div>
            <button data-sub-open-careers="true" class="px-3 py-2 rounded-xl bg-slatecard hover:bg-cardhover border border-leadborder text-xs font-serif font-bold text-parchment shrink-0">Job Board</button>
          </div>
        `;
      const occultHTML = character.paranormalGig ? renderOccultWorkplaceHTML(character, selectedColleagueId) : '';
      return `<div class="space-y-3">${mundaneHTML}${occultHTML}</div>`;
    }

    // 2. TROUBLE / CRIME / LEGAL
    if (categoryKey === 'trouble' || categoryKey === 'crime' || categoryKey === 'legal') {
      const c = sub.crime;
      return `
        <div class="rounded-2xl border border-crimson/40 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-crimson block">Underworld Operations Submenu</span>
              <h4 class="font-serif font-bold text-sm text-parchment">Casing, Heists & Police Heat</h4>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-inputbg border border-leadborder text-amber-300">Unfenced Loot: $${c.stolenLootValue}</span>
          </div>

          <div class="grid grid-cols-2 gap-2.5 bg-inputbg p-2.5 rounded-xl border border-leadborder">
            <div>
              <div class="flex justify-between text-[10px] font-mono mb-1">
                <span class="text-rose-400 font-semibold">Police Heat</span>
                <span class="text-parchment">${c.heat}%</span>
              </div>
              <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 to-red-600" style="width:${c.heat}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-[10px] font-mono mb-1">
                <span class="text-purple-300 font-semibold">Street Notoriety</span>
                <span class="text-parchment">${c.notoriety}%</span>
              </div>
              <div class="h-1.5 w-full bg-slatecard rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-600 to-indigo-400" style="width:${c.notoriety}%"></div>
              </div>
            </div>
          </div>

          <!-- Operation & Target Selectors -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="text-[9px] font-mono uppercase text-dust block mb-1">1. Crime Operation</label>
              <select data-crime-sel="op" class="w-full rounded-lg bg-inputbg border border-leadborder px-2.5 py-1.5 text-xs text-parchment font-serif">
                ${Object.entries(CRIME_OPS).map(([k, v]) => `<option value="${k}" ${c.selectedOp === k ? 'selected' : ''}>${v.name} (Age ${v.minAge}+)</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-[9px] font-mono uppercase text-dust block mb-1">2. Target Mark</label>
              <select data-crime-sel="target" class="w-full rounded-lg bg-inputbg border border-leadborder px-2.5 py-1.5 text-xs text-parchment font-serif">
                ${Object.entries(CRIME_TARGETS).map(([k, v]) => `<option value="${k}" ${c.selectedTarget === k ? 'selected' : ''}>${v.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Approach Selector -->
          <div class="flex items-center justify-between gap-1.5 bg-inputbg p-1.5 rounded-xl border border-leadborder">
            ${[
              ['stealth', 'Shadow Stealth (Low Heat)'],
              ['brazen', 'Brazen Sweep (+35% Loot)'],
              ['accomplice', 'With Accomplice (Safer)']
            ].map(([k, label]) => `
              <button data-crime-approach="${k}" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-serif font-bold transition-all ${
                c.selectedApproach === k ? 'bg-slatecard text-parchment border border-leadborder' : 'text-dust hover:text-parchment'
              }">${label}</button>
            `).join('')}
          </div>

          <!-- Crime Execution & Underworld Actions -->
          <div class="grid grid-cols-2 gap-1.5">
            <button data-crime-act="case_target" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">${c.cased ? '✓ Target Cased' : 'Case Target First'}</strong>
              <span class="text-[10px] text-emerald-400 font-mono">+18% Success Chance</span>
            </button>
            <button data-crime-act="execute" class="p-2.5 rounded-xl bg-crimson/25 hover:bg-crimson/35 border border-crimson/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Execute Heist</strong>
              <span class="text-[10px] text-rose-300 font-mono">Run planned operation</span>
            </button>
            <button data-crime-act="fence" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Fence Stolen Goods</strong>
              <span class="text-[10px] text-fiat font-mono">Convert loot to $ & s.</span>
            </button>
            <button data-crime-act="lay_low" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Lay Low & Burn Traces</strong>
              <span class="text-[10px] text-sky-400 font-mono">-25% Police Heat</span>
            </button>
          </div>
        </div>
      `;
    }

    // 3. DAILY LIFE / HOME / MONEY
    if (categoryKey === 'daily_life' || categoryKey === 'home' || categoryKey === 'money') {
      const h = sub.home;
      const tier = HOME_TIERS[h.tierIndex] || HOME_TIERS[0];
      const nextTier = HOME_TIERS[h.tierIndex + 1];
      return `
        <div class="rounded-2xl border border-emerald-500/35 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-emerald-400 block">Quarters & Financial Ledger</span>
              <h4 class="font-serif font-bold text-sm text-parchment">${tier.name}</h4>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-inputbg border border-leadborder text-parchment">Upkeep: ${h.condition}%</span>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-home-act="maintain" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Scrub & Seal Quarters</strong>
              <span class="text-[10px] text-emerald-400 font-mono">+Upkeep · +Sanity</span>
            </button>
            <button data-home-act="upgrade" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">${nextTier ? `Lease Better Quarters` : `Estate Maxed`}</strong>
              <span class="text-[10px] text-amber-300 font-mono">${nextTier ? `Costs $${nextTier.upgradeCost.toLocaleString()}` : `Prestigious`}</span>
            </button>
            <button data-home-act="cellar" class="p-2.5 rounded-xl bg-purple-950/25 hover:bg-purple-900/35 border border-purple-700/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-purple-200">Inspect Hollow Wall</strong>
              <span class="text-[10px] text-shilling font-mono">Cellar lore · +Shillings</span>
            </button>
            <button data-home-act="loan_shark" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">${h.loanDebt > 0 ? `Repay Shark ($${h.loanDebt})` : `Borrow $1,000 (Shark)`}</strong>
              <span class="text-[10px] text-rose-400 font-mono">${h.loanDebt > 0 ? `Clear underworld debt` : `Instant cash · High risk`}</span>
            </button>
          </div>
        </div>
      `;
    }

    // 4. WELLBEING / MEDICAL / MENTAL
    if (categoryKey === 'wellbeing' || categoryKey === 'medical' || categoryKey === 'mental') {
      return `
        <div class="rounded-2xl border border-sky-500/35 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
          <div>
            <span class="text-[9px] font-mono uppercase tracking-widest text-sky-400 block">Infirmary & Sanitarium Submenu</span>
            <h4 class="font-serif font-bold text-sm text-parchment">Clinical & Nocturnal Remedies</h4>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-well-act="clinic" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Municipal Ward ($80)</strong>
              <span class="text-[10px] text-emerald-400 font-mono">+6% Vitality</span>
            </button>
            <button data-well-act="specialist" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Private Physician ($450)</strong>
              <span class="text-[10px] text-emerald-300 font-mono">+14% Vitality · +Happy</span>
            </button>
            <button data-well-act="psychoanalysis" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Dream Regression ($220)</strong>
              <span class="text-[10px] text-sky-300 font-mono">+10% Sanity · +Humanity</span>
            </button>
            <button data-well-act="apothecary" class="p-2.5 rounded-xl bg-purple-950/25 hover:bg-purple-900/35 border border-purple-700/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-purple-200">Night Apothecary (2 s.)</strong>
              <span class="text-[10px] text-shilling font-mono">+16% Vitality · +Occult</span>
            </button>
          </div>
        </div>
      `;
    }

    // 5. LEISURE / HOBBIES
    if (categoryKey === 'leisure' || categoryKey === 'hobbies' || categoryKey === 'media' || categoryKey === 'games') {
      const l = sub.leisure;
      const craftKey = l.activeCraft || 'violin';
      const craft = CRAFTS[craftKey] || CRAFTS.violin;
      const masteryVal = clamp(l.mastery[craftKey] || 15);
      return `
        <div class="rounded-2xl border border-amber-500/35 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-amber-400 block">Craft & Hobby Mastery</span>
              <h4 class="font-serif font-bold text-sm text-parchment">${craft.name}</h4>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-inputbg border border-leadborder text-amber-300">Mastery: ${masteryVal}%</span>
          </div>
          <div class="h-2 w-full bg-inputbg rounded-full overflow-hidden border border-leadborder">
            <div class="h-full bg-gradient-to-r from-amber-600 to-yellow-300" style="width:${masteryVal}%"></div>
          </div>
          <div>
            <select data-leisure-sel="craft" class="w-full rounded-lg bg-inputbg border border-leadborder px-2.5 py-1.5 text-xs text-parchment font-serif">
              ${Object.entries(CRAFTS).map(([k, v]) => `<option value="${k}" ${craftKey === k ? 'selected' : ''}>${v.name} (Mastery ${clamp(l.mastery[k] || 10)}%)</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-leisure-act="practice" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Deliberate Practice</strong>
              <span class="text-[10px] text-amber-300 font-mono">+12% Mastery · +Happy</span>
            </button>
            <button data-leisure-act="monetize" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Perform / Sell Work</strong>
              <span class="text-[10px] text-fiat font-mono">Earn $ or s. from Mastery</span>
            </button>
          </div>
        </div>
      `;
    }

    // 6. EXPLORE / PLACES / TRAVEL / PARANORMAL
    if (categoryKey === 'explore' || categoryKey === 'places' || categoryKey === 'travel' || categoryKey === 'wildlife' || categoryKey === 'paranormal' || categoryKey === 'horror') {
      const ex = sub.explore;
      const siteKey = ex.selectedSite || 'sanatorium';
      const site = EXPLORE_SITES[siteKey] || EXPLORE_SITES.sanatorium;
      return `
        <div class="rounded-2xl border border-rose-500/35 bg-slatecard/95 p-3.5 space-y-3 shadow-md">
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-mono uppercase tracking-widest text-rose-400 block">Field Expedition Submenu</span>
              <h4 class="font-serif font-bold text-sm text-parchment">${site.name}</h4>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-inputbg border border-leadborder text-shilling">Yield: +${site.shillingYield} s.</span>
          </div>
          <select data-explore-sel="site" class="w-full rounded-lg bg-inputbg border border-leadborder px-2.5 py-1.5 text-xs text-parchment font-serif">
            ${Object.entries(EXPLORE_SITES).map(([k, v]) => `<option value="${k}" ${siteKey === k ? 'selected' : ''}>${v.name} (Risk: ${v.danger})</option>`).join('')}
          </select>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-explore-act="survey" class="p-2.5 rounded-xl bg-inputbg hover:bg-cardhover border border-leadborder text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-parchment">Cautious Perimeter Survey</strong>
              <span class="text-[10px] text-emerald-400 font-mono">Safe recon · +Smarts</span>
            </button>
            <button data-explore-act="harvest" class="p-2.5 rounded-xl bg-purple-950/25 hover:bg-purple-900/35 border border-purple-700/50 text-left transition-all active:scale-95">
              <strong class="block font-serif text-xs text-purple-200">Breach & Harvest Relics</strong>
              <span class="text-[10px] text-shilling font-mono">+${site.shillingYield} Shillings (s.) · +Occult</span>
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  // ============================================================================
  // 5. ACTION EXECUTION HANDLERS FOR WORKPLACES & SUBSYSTEMS
  // ============================================================================
  function handleWorkplaceAction(game, actType, colId) {
    const char = game.character;
    const activeJob = char.job || char.partTimeJob;
    if (!activeJob) return;
    const wp = ensureMundaneWorkplace(char);

    if (actType === 'resign') {
      if (char.job) game.quitMundaneJob();
      else if (char.partTimeJob) {
        const oldTitle = char.partTimeJob.title;
        char.partTimeJob = null;
        char.workplace = null;
        const latestLog = game.logs[game.logs.length - 1];
        if (latestLog) latestLog.entries.push(`Quit part-time position as ${oldTitle}.`);
        game.renderCareersList();
        game.renderAll();
        game.saveGame();
      }
      return;
    }

    let title = "Workplace Action";
    let body = "";
    const effects = {};

    if (actType === 'work_harder') {
      const bonus = Math.max(45, Math.round(getActiveMundaneAnnualPay(char) * 0.06));
      wp.performance = clamp(wp.performance + 10);
      wp.stress = clamp(wp.stress + 8);
      char.money = (char.money || 0) + bonus;
      game.modifyStat('vitality', -2);
      effects.Vitality = -2;
      title = "Pulled Double Shift";
      body = pick([
        `You stayed past closing under humming fluorescent tubes, scrubbing stations and balancing the ledger. Management slipped ${window.formatMoney(bonus, char.countryCode)} into your pay packet (+10% Performance, +8% Stress).`,
        `You took on the shifts nobody else wanted. Your hands ache, but your supervisor marked your file with a rare nod of approval (+10% Performance, +${window.formatMoney(bonus, char.countryCode)}).`,
        `Through rain-streaked windows you worked until the streetlamps flickered out, earning ${window.formatMoney(bonus, char.countryCode)} in overtime and a reputation for relentless diligence (+10% Performance).`
      ]);
    } else if (actType === 'slack_off') {
      wp.stress = clamp(wp.stress - 14);
      wp.performance = clamp(wp.performance - 7);
      game.modifyStat('happiness', 5);
      effects.Happiness = 5;
      title = "Hid in the Breakroom";
      body = pick([
        `You locked yourself in the dim supply room with a lukewarm mug of tea while the rush hour storm raged outside (-14% Stress, -7% Performance).`,
        `You spent half your shift staring at dust motes in the stairwell and letting calls go to voicemail. Your nerves feel steadier (-14% Stress, +5% Happiness).`
      ]);
    } else if (actType === 'ask_raise') {
      const sup = wp.colleagues[0];
      if (wp.performance >= 70 && (!sup || sup.relationship >= 45)) {
        wp.raisesCount = (wp.raisesCount || 0) + 1;
        wp.performance = clamp(wp.performance - 10);
        const promo = (!activeJob.isPartTime && window.getPromotionForJob) ? window.getPromotionForJob(activeJob) : null;
        if (promo && wp.raisesCount >= 2) {
          char.job = promo;
          title = "Promoted!";
          body = `Impressed by your 70%+ performance record, ${sup ? sup.name : 'management'} promoted you to ${promo.title}!`;
        } else {
          title = "Raise Granted";
          body = `${sup ? sup.name : 'Management'} reviewed your spotless shift log and approved an 8% permanent pay raise!`;
        }
        game.modifyStat('happiness', 6);
        effects.Happiness = 6;
      } else {
        title = "Request Denied";
        body = `${sup ? sup.name : 'Management'} tapped the ledger coldly. "Bring your performance above 70% and stay on good terms with supervision before asking for more coin."`;
      }
    } else if (actType === 'pilfer') {
      if (Math.random() < 0.62) {
        const stolen = Math.max(80, Math.round(getActiveMundaneAnnualPay(char) * 0.09));
        char.money = (char.money || 0) + stolen;
        game.modifyStat('humanity', -2);
        effects.Humanity = -2;
        title = "Skimmed the Till";
        body = `While the cameras flickered during a voltage drop, you palmed ${window.formatMoney(stolen, char.countryCode)} from the petty cash tin without a soul noticing.`;
      } else {
        wp.performance = clamp(wp.performance - 25);
        game.modifyStat('happiness', -3);
        effects.Happiness = -3;
        title = "Caught Near the Safe";
        body = `${wp.colleagues[0].name} caught your hand near the unlocked drawer. You talked your way out of arrest, but your workplace standing plummeted (-25% Performance).`;
      }
    } else if (actType === 'anomaly') {
      const gainedShillings = 2 + Math.floor(Math.random() * 3);
      char.shillings = (char.shillings || 0) + gainedShillings;
      game.modifyStat('occult', 5);
      game.modifyStat('sanity', -2);
      effects.Occult = 5;
      effects.Sanity = -2;
      title = "Back-Room Anomaly";
      body = pick([
        `Behind the rusted lockers at ${activeJob.title}, you pried open a floorboards cache containing ${gainedShillings} tarnished Paranormal Shillings and a ledger of workers who vanished in 1928 (+${gainedShillings} s., +5% Occult).`,
        `At 3:14 AM, the intercom buzzed from an unplugged room. Inside, a veiled courier paid you ${gainedShillings} Shillings to forget what you saw in the service corridor (+${gainedShillings} s., -2% Sanity).`
      ]);
    } else if (colId) {
      const col = wp.colleagues.find(c => c.id === colId);
      if (!col) return;
      if (actType === 'chat') {
        col.relationship = clamp(col.relationship + 12);
        game.modifyStat('happiness', 3);
        effects.Happiness = 3;
        title = `Spoke with ${col.name}`;
        body = `You shared quiet conversation with ${col.name} (${col.role}) during a slow hour, trading dry humor about the workplace (+12% Rapport).`;
      } else if (actType === 'cover') {
        col.relationship = clamp(col.relationship + 18);
        wp.performance = clamp(wp.performance + 5);
        wp.stress = clamp(wp.stress + 5);
        title = `Covered ${col.name}'s Shift`;
        body = `You brought ${col.name} a hot cup of coffee and covered their late rotation. They owe you a genuine favor (+18% Rapport, +5% Performance).`;
      } else if (actType === 'sabotage') {
        col.relationship = clamp(col.relationship - 20);
        wp.performance = clamp(wp.performance + 8);
        game.modifyStat('humanity', -2);
        effects.Humanity = -2;
        title = `Sabotaged ${col.name}`;
        body = `You quietly altered ${col.name}'s shift logs so the blame for a missing shipment fell on their desk (+8% Your Performance, -20% Rapport).`;
      } else if (actType === 'hr') {
        wp.stress = clamp(wp.stress - 10);
        col.relationship = clamp(col.relationship - 15);
        title = `Filed HR Dossier on ${col.name}`;
        body = `Management reprimanded ${col.name} after reviewing your anonymous complaint, easing pressure on your station (-10% Stress).`;
      } else if (actType === 'hex') {
        if ((char.shillings || 0) < 1 && (char.stats.occult || 0) < 10) {
          title = "Insufficient Occult Means";
          body = "You need at least 1 Shilling (s.) or 10% Occult to weave a workplace hex.";
        } else {
          if ((char.shillings || 0) >= 1) char.shillings -= 1;
          col.relationship = clamp(col.relationship + 15);
          wp.performance = clamp(wp.performance + 9);
          game.modifyStat('occult', 4);
          effects.Occult = 4;
          title = `Bound ${col.name}'s Tongue`;
          body = `You slipped a folded sigil beneath ${col.name}'s keyboard. Their eyes glazed over, and they praised your work mechanically all week (+9% Performance, +4% Occult).`;
        }
      }
    }

    const latestLog = game.logs[game.logs.length - 1];
    if (latestLog && body) latestLog.entries.push(`[Workplace] ${body}`);
    game.renderAll();
    if (!game.dom.careersModal.classList.contains('hidden')) game.renderCareersList();
    if (!game.dom.activitiesModal.classList.contains('hidden')) game.renderActivitiesList(game.activeActivityCategory);
    game.saveGame();
    if (body) {
      game.openFeedbackModal({ tag: "WORKPLACE DOSSIER", title, icon: "briefcase", iconColor: "text-emerald-400", body, effects });
    }
  }

  function handleOccultWorkplaceAction(game, actType, opId) {
    const char = game.character;
    const gig = char.paranormalGig;
    if (!gig) return;
    const ow = ensureOccultWorkplace(char);

    if (actType === 'sever') {
      game.quitParanormalGig();
      return;
    }

    let title = "Nocturnal Syndicate";
    let body = "";
    const effects = {};

    if (actType === 'field_assignment') {
      const earned = 3 + Math.floor(Math.random() * 4) + ow.rankIndex;
      char.shillings = (char.shillings || 0) + earned;
      ow.covenantFavor = clamp(ow.covenantFavor + 11);
      ow.veilExposure = clamp(ow.veilExposure + 14);
      game.modifyStat('occult', 4);
      game.modifyStat('sanity', -2);
      effects.Occult = 4;
      effects.Sanity = -2;
      title = "Nocturnal Field Assignment";
      body = pick([
        `Dispatched as a ${gig.title}, you sealed a weeping cellar mirror in black wax before dawn. ${ow.operants[0].name} pressed ${earned} cold Shillings into your palm (+${earned} s., +11% Favor).`,
        `You stood watch at an unmarked graveside with a brass bell and a lead ledger. Whatever scratched from below quieted at 4 AM, earning you ${earned} Shillings (+${earned} s., +14% Exposure).`,
        `You retrieved a waterlogged reliquary from the canal locks and delivered it to the Directorate for ${earned} Shillings (+${earned} s., +4% Occult).`
      ]);
    } else if (actType === 'catalog_relics') {
      const earned = 2 + Math.floor(Math.random() * 2);
      char.shillings = (char.shillings || 0) + earned;
      ow.covenantFavor = clamp(ow.covenantFavor + 7);
      game.modifyStat('smarts', 3);
      game.modifyStat('occult', 3);
      effects.Smarts = 3;
      effects.Occult = 3;
      title = "Cataloged Cursed Relics";
      body = `By tallow candlelight you indexed glass vials of grave-salt and stopped pocket watches, receiving a ${earned} Shilling archivist stipend (+${earned} s., +7% Favor).`;
    } else if (actType === 'fortify_wards') {
      if ((char.shillings || 0) < 1) {
        title = "Requires 1 Shilling";
        body = "You need at least 1 Paranormal Shilling (s.) to purchase consecrated iron salt for your wards.";
      } else {
        char.shillings -= 1;
        ow.veilExposure = clamp(ow.veilExposure - 28);
        game.modifyStat('sanity', 5);
        effects.Sanity = 5;
        title = "Wards Fortified";
        body = `You burned 1 Shilling's worth of black salt and rosemary around your threshold. The whispering behind your wallpaper receded (-28% Veil Exposure, +5% Sanity).`;
      }
    } else if (actType === 'petition_rank') {
      if (ow.covenantFavor >= 65) {
        ow.covenantFavor = clamp(ow.covenantFavor - 20);
        ow.bonusShillings = (ow.bonusShillings || 0) + 3;
        if (ow.rankIndex < OCCULT_RANKS.length - 1) ow.rankIndex += 1;
        title = "Elevated in the Covenant!";
        body = `${ow.operants[0].name} stamped your file in vermilion wax. You are now a ${OCCULT_RANKS[ow.rankIndex]} with a permanent +3 s./yr stipend increase!`;
      } else {
        title = "Petition Refused";
        body = `${ow.operants[0].name} did not look up from the ledger. "Raise your Covenant Favor to at least 65% before requesting higher Shilling stipends."`;
      }
    } else if (actType === 'siphon_vault') {
      if (Math.random() < 0.55 + (char.stats.occult || 0) * 0.002) {
        const stolen = 6 + Math.floor(Math.random() * 6);
        char.shillings = (char.shillings || 0) + stolen;
        ow.veilExposure = clamp(ow.veilExposure + 18);
        title = "Vault Siphoned";
        body = `Using a forged wax seal, you drew ${stolen} ancient Shillings from the Directorate's reliquary coffer without waking the sentinel (+${stolen} s.).`;
      } else {
        ow.covenantFavor = clamp(ow.covenantFavor - 30);
        ow.veilExposure = clamp(ow.veilExposure + 25);
        game.modifyStat('vitality', -3);
        game.modifyStat('sanity', -3);
        effects.Vitality = -3;
        effects.Sanity = -3;
        title = "The Coffer Bit Back";
        body = `The iron lock snapped shut on your wrist and ${ow.operants[0].name} docked your Covenant Favor severely (-30% Favor, +25% Exposure).`;
      }
    } else if (opId) {
      const op = ow.operants.find(item => item.id === opId);
      if (!op) return;
      if (actType === 'ledger') {
        op.relationship = clamp(op.relationship + 12);
        ow.covenantFavor = clamp(ow.covenantFavor + 6);
        game.modifyStat('occult', 4);
        effects.Occult = 4;
        title = `Consulted ${op.name}`;
        body = `You deciphered water-stained parish mortality tables alongside ${op.name} (+12% Bond, +6% Favor, +4% Occult).`;
      } else if (actType === 'tribute') {
        if ((char.shillings || 0) < 1) {
          title = "No Shillings for Tribute";
          body = "You need at least 1 Shilling (s.) to offer a formal covenant tribute.";
        } else {
          char.shillings -= 1;
          op.relationship = clamp(op.relationship + 20);
          ow.covenantFavor = clamp(ow.covenantFavor + 12);
          title = `Tribute Accepted by ${op.name}`;
          body = `You slid a heavy silver Shilling across the desk to ${op.name}. They inclined their head in solemn alliance (+20% Bond, +12% Favor).`;
        }
      } else if (actType === 'ward') {
        op.relationship = clamp(op.relationship + 10);
        ow.veilExposure = clamp(ow.veilExposure - 16);
        title = `Bound Mutual Ward`;
        body = `${op.name} traced a protective sigil in chalk across your coat lapel, shielding you from nocturnal entities (-16% Exposure, +10% Bond).`;
      } else if (actType === 'pilfer_relic') {
        const gain = 2 + Math.floor(Math.random() * 3);
        char.shillings = (char.shillings || 0) + gain;
        op.relationship = clamp(op.relationship - 22);
        title = `Pilfered ${op.name}'s Reliquary`;
        body = `You lifted a silver locket from ${op.name}'s coat and pawned it to a night-broker for ${gain} Shillings (+${gain} s., -22% Bond).`;
      }
    }

    const latestLog = game.logs[game.logs.length - 1];
    if (latestLog && body) latestLog.entries.push(`[Nocturnal Syndicate] ${body}`);
    game.renderAll();
    if (!game.dom.careersModal.classList.contains('hidden')) game.renderCareersList();
    if (!game.dom.activitiesModal.classList.contains('hidden')) game.renderActivitiesList(game.activeActivityCategory);
    game.saveGame();
    if (body) {
      game.openFeedbackModal({ tag: "NOCTURNAL SYNDICATE", title, icon: "moon", iconColor: "text-shilling", body, effects });
    }
  }

  function handleSectorSubAction(game, domain, actType) {
    const char = game.character;
    const sub = ensureSectorState(char);
    let title = "Pursuit Outcome";
    let body = "";
    const effects = {};

    if (domain === 'crime') {
      const c = sub.crime;
      const op = CRIME_OPS[c.selectedOp] || CRIME_OPS.burglary;
      const target = CRIME_TARGETS[c.selectedTarget] || CRIME_TARGETS.corner_shop;

      if (actType === 'case_target') {
        c.cased = true;
        game.modifyStat('smarts', 2);
        effects.Smarts = 2;
        title = "Target Cased";
        body = `You spent two rainy evenings watching patrol rotations and blind spots around ${target.name}. Your next heist carries a +18% success bonus.`;
      } else if (actType === 'execute') {
        if (char.age < op.minAge) {
          title = "Too Young for Operation";
          body = `${op.name} requires Age ${op.minAge}+.`;
        } else {
          const casedBonus = c.cased ? 0.18 : 0;
          const approachBonus = c.selectedApproach === 'accomplice' ? 0.12 : (c.selectedApproach === 'stealth' ? 0.06 : -0.05);
          const heatPenalty = c.heat * 0.0025;
          const chance = Math.min(0.92, Math.max(0.20, op.baseSuccess + target.riskMod + casedBonus + approachBonus - heatPenalty));
          c.cased = false;

          if (Math.random() < chance) {
            const mult = c.selectedApproach === 'brazen' ? 1.35 : (c.selectedApproach === 'accomplice' ? 0.72 : 1.0);
            const payout = Math.round(op.basePayout * target.mult * mult);
            c.stolenLootValue += payout;
            c.heat = clamp(c.heat + (c.selectedApproach === 'stealth' ? Math.round(op.heatGain * 0.6) : op.heatGain));
            c.notoriety = clamp(c.notoriety + 8);
            if (target.bonusShillings) char.shillings = (char.shillings || 0) + target.bonusShillings;
            game.modifyStat('humanity', -2);
            effects.Humanity = -2;
            title = `${op.name} Succeeded!`;
            body = `Under cover of mist, you pulled off ${op.name} at ${target.name}, stashing $${payout.toLocaleString()} in unfenced loot${target.bonusShillings ? ` and +${target.bonusShillings} Shillings` : ''}! Fence your loot to cash out.`;
          } else {
            const fine = Math.min(char.money || 0, Math.round(op.basePayout * 0.4));
            char.money = Math.max(0, (char.money || 0) - fine);
            c.heat = clamp(c.heat + 20);
            game.modifyStat('happiness', -3);
            game.modifyStat('vitality', -2);
            effects.Happiness = -3;
            effects.Vitality = -2;
            title = "Operation Botched!";
            body = `Sirens wailed down the wet cobblestones as an alarm tripped at ${target.name}. You barely escaped over a spiked fence, losing $${fine.toLocaleString()} in bail/bribes (+20% Police Heat).`;
          }
        }
      } else if (actType === 'fence') {
        if (c.stolenLootValue <= 0) {
          title = "No Loot to Fence";
          body = "Execute a heist first to acquire stolen goods for the night-fence.";
        } else {
          const cashOut = Math.round(c.stolenLootValue * 0.85);
          const bonusS = c.stolenLootValue >= 1500 ? 2 : 1;
          char.money = (char.money || 0) + cashOut;
          char.shillings = (char.shillings || 0) + bonusS;
          c.stolenLootValue = 0;
          title = "Goods Fenced";
          body = `A pawn-broker behind a velvet curtain bought your contrabands for ${window.formatMoney(cashOut, char.countryCode)} and slipped you +${bonusS} Shilling(s) for the curiosities.`;
        }
      } else if (actType === 'lay_low') {
        c.heat = clamp(c.heat - 28);
        title = "Burned Evidence & Laid Low";
        body = `You burned your dark coat in an alley barrel and stayed off the streets until precinct patrols lost your trail (-28% Police Heat).`;
      }
    } else if (domain === 'home') {
      const h = sub.home;
      if (actType === 'maintain') {
        h.condition = clamp(h.condition + 18);
        game.modifyStat('sanity', 4);
        game.modifyStat('happiness', 3);
        effects.Sanity = 4;
        effects.Happiness = 3;
        title = "Quarters Scrubbed & Sealed";
        body = `You scrubbed the floorboards with carbolic soap, caulked the drafty window frames, and hung fresh herbs (+18% Upkeep, +4% Sanity).`;
      } else if (actType === 'upgrade') {
        const nextTier = HOME_TIERS[h.tierIndex + 1];
        if (!nextTier) {
          title = "Highest Estate Reached";
          body = "You already reside in a Wrought-Iron Townhouse.";
        } else if ((char.money || 0) < nextTier.upgradeCost) {
          title = "Insufficient Funds";
          body = `You need $${nextTier.upgradeCost.toLocaleString()} to lease the ${nextTier.name}.`;
        } else {
          char.money -= nextTier.upgradeCost;
          h.tierIndex += 1;
          h.condition = 95;
          game.modifyStat('happiness', 8);
          effects.Happiness = 8;
          title = `Moved into ${nextTier.name}`;
          body = `You signed the lease and moved your belongings into a ${nextTier.name} (+8% Happiness).`;
        }
      } else if (actType === 'cellar') {
        const sGain = 2 + Math.floor(Math.random() * 3);
        char.shillings = (char.shillings || 0) + sGain;
        game.modifyStat('occult', 5);
        game.modifyStat('sanity', -2);
        effects.Occult = 5;
        effects.Sanity = -2;
        title = "Behind the Lath & Plaster";
        body = `Prying loose a hollow baseboard in your quarters, you uncovered a tin velvet box holding ${sGain} Paranormal Shillings and a daguerreotype of your own room taken a century ago (+${sGain} s., +5% Occult).`;
      } else if (actType === 'loan_shark') {
        if (h.loanDebt > 0) {
          if ((char.money || 0) < h.loanDebt) {
            title = "Cannot Repay Debt Yet";
            body = `You need $${h.loanDebt.toLocaleString()} to clear your ledger with the loan shark.`;
          } else {
            char.money -= h.loanDebt;
            h.loanDebt = 0;
            game.modifyStat('sanity', 5);
            effects.Sanity = 5;
            title = "Debt Cleared";
            body = "You paid off the collector in full. The heavy footsteps outside your door at midnight have finally stopped.";
          }
        } else {
          char.money = (char.money || 0) + 1000;
          h.loanDebt = 1350;
          title = "Borrowed $1,000";
          body = "A man in a damp wool overcoat counted $1,000 into your hand. You owe $1,350 on the ledger.";
        }
      }
    } else if (domain === 'wellbeing') {
      if (actType === 'clinic') {
        if ((char.money || 0) < 80) { title = "Insufficient Funds"; body = "Municipal clinic admission costs $80."; }
        else { char.money -= 80; game.modifyStat('vitality', 6); effects.Vitality = 6; title = "Municipal Ward Care"; body = "A tired resident stitched and tonic-treated your ailments (+6% Vitality)."; }
      } else if (actType === 'specialist') {
        if ((char.money || 0) < 450) { title = "Insufficient Funds"; body = "Private physician consultation costs $450."; }
        else { char.money -= 450; game.modifyStat('vitality', 14); game.modifyStat('happiness', 4); effects.Vitality = 14; effects.Happiness = 4; title = "Private Specialist"; body = "In a mahogany-paneled suite, the specialist administered restorative infusions (+14% Vitality, +4% Happiness)."; }
      } else if (actType === 'psychoanalysis') {
        if ((char.money || 0) < 220) { title = "Insufficient Funds"; body = "Dream regression therapy costs $220."; }
        else { char.money -= 220; game.modifyStat('sanity', 10); game.modifyStat('humanity', 4); effects.Sanity = 10; effects.Humanity = 4; title = "Dream Regression Session"; body = "To the steady tick of a brass metronome, you untangled knots of childhood dread (+10% Sanity, +4% Humanity)."; }
      } else if (actType === 'apothecary') {
        if ((char.shillings || 0) < 2) { title = "Needs 2 Shillings"; body = "The night apothecary only accepts Paranormal Shillings (2 s.)."; }
        else { char.shillings -= 2; game.modifyStat('vitality', 16); game.modifyStat('occult', 4); effects.Vitality = 16; effects.Occult = 4; title = "Night Apothecary Draught"; body = "You drank a bitter silver tincture that knitted your strength immediately (+16% Vitality, +4% Occult)."; }
      }
    } else if (domain === 'leisure') {
      const l = sub.leisure;
      const craftKey = l.activeCraft || 'violin';
      const craft = CRAFTS[craftKey] || CRAFTS.violin;
      if (actType === 'practice') {
        l.mastery[craftKey] = clamp((l.mastery[craftKey] || 15) + 12);
        game.modifyStat('happiness', 5);
        game.modifyStat(craft.stat, 4);
        effects.Happiness = 5;
        title = `Practiced ${craft.name}`;
        body = `You devoted long candlelit hours to ${craft.name}, raising your mastery to ${l.mastery[craftKey]}% (+5% Happiness).`;
      } else if (actType === 'monetize') {
        const m = l.mastery[craftKey] || 15;
        const cash = Math.round(60 + m * 4.5);
        const sGain = (craftKey === 'occult_sketch' || m >= 75) ? 2 : 0;
        char.money = (char.money || 0) + cash;
        if (sGain) char.shillings = (char.shillings || 0) + sGain;
        title = `Showcased ${craft.name}`;
        body = `Collectors and passersby paid $${cash.toLocaleString()}${sGain ? ` and ${sGain} Shillings` : ''} for your work (Mastery ${m}%).`;
      }
    } else if (domain === 'explore') {
      const ex = sub.explore;
      const site = EXPLORE_SITES[ex.selectedSite] || EXPLORE_SITES.sanatorium;
      if (actType === 'survey') {
        game.modifyStat('smarts', 4);
        game.modifyStat('happiness', 3);
        effects.Smarts = 4;
        effects.Happiness = 3;
        title = `Surveyed ${site.name}`;
        body = `You mapped the overgrown perimeter of ${site.name}, sketching iron gates and architectural anomalies (+4% Smarts).`;
      } else if (actType === 'harvest') {
        char.shillings = (char.shillings || 0) + site.shillingYield;
        game.modifyStat('occult', 6);
        game.modifyStat('sanity', -2);
        effects.Occult = 6;
        effects.Sanity = -2;
        title = `Relics Harvested at ${site.name}`;
        body = `Venturing past the rusted chains of ${site.name}, you recovered nocturnal specimens and antiquities worth +${site.shillingYield} Shillings (s.) (+6% Occult).`;
      }
    }

    const latestLog = game.logs[game.logs.length - 1];
    if (latestLog && body) latestLog.entries.push(`[${title}] ${body}`);
    game.renderAll();
    if (!game.dom.activitiesModal.classList.contains('hidden')) game.renderActivitiesList(game.activeActivityCategory);
    game.saveGame();
    if (body) {
      game.openFeedbackModal({ tag: "SUBSYSTEM ACTION", title, icon: "sparkles", iconColor: "text-amber-400", body, effects });
    }
  }

  function bindSubsystemEvents(container, game, refreshCallback) {
    if (!container || !game) return;
    const sub = ensureSectorState(game.character);

    // Open Careers Shortcut
    container.querySelectorAll('[data-sub-open-careers]').forEach(btn => {
      btn.addEventListener('click', () => {
        game.closeActivitiesModal();
        game.openCareersModal();
      });
    });

    // Part-Time Weekly Hours
    container.querySelectorAll('[data-wp-hours]').forEach(btn => {
      btn.addEventListener('click', () => {
        const wp = ensureMundaneWorkplace(game.character);
        if (wp) {
          wp.hoursPerWeek = parseInt(btn.dataset.wpHours, 10) || 15;
          game.renderAll();
          if (refreshCallback) refreshCallback();
        }
      });
    });

    // Mundane Workplace Colleague Drawer Toggle
    container.querySelectorAll('[data-wp-colleague]').forEach(btn => {
      btn.addEventListener('click', () => {
        const colId = btn.dataset.wpColleague;
        game._selectedColleagueId = (game._selectedColleagueId === colId) ? null : colId;
        if (refreshCallback) refreshCallback();
      });
    });

    // Mundane Workplace Actions
    container.querySelectorAll('[data-wp-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleWorkplaceAction(game, btn.dataset.wpAct, null);
      });
    });

    // Mundane Colleague Specific Actions
    container.querySelectorAll('[data-wp-col-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleWorkplaceAction(game, btn.dataset.wpColAct, btn.dataset.colId);
      });
    });

    // Occult Workplace Operant Drawer Toggle
    container.querySelectorAll('[data-ow-operant]').forEach(btn => {
      btn.addEventListener('click', () => {
        const opId = btn.dataset.owOperant;
        game._selectedColleagueId = (game._selectedColleagueId === opId) ? null : opId;
        if (refreshCallback) refreshCallback();
      });
    });

    // Occult Workplace Actions
    container.querySelectorAll('[data-ow-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleOccultWorkplaceAction(game, btn.dataset.owAct, null);
      });
    });

    // Occult Operant Specific Actions
    container.querySelectorAll('[data-ow-op-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleOccultWorkplaceAction(game, btn.dataset.owOpAct, btn.dataset.opId);
      });
    });

    // Crime Selectors & Actions
    container.querySelectorAll('[data-crime-sel]').forEach(sel => {
      sel.addEventListener('change', () => {
        if (sel.dataset.crimeSel === 'op') sub.crime.selectedOp = sel.value;
        if (sel.dataset.crimeSel === 'target') { sub.crime.selectedTarget = sel.value; sub.crime.cased = false; }
        if (refreshCallback) refreshCallback();
      });
    });
    container.querySelectorAll('[data-crime-approach]').forEach(btn => {
      btn.addEventListener('click', () => {
        sub.crime.selectedApproach = btn.dataset.crimeApproach;
        if (refreshCallback) refreshCallback();
      });
    });
    container.querySelectorAll('[data-crime-act]').forEach(btn => {
      btn.addEventListener('click', () => handleSectorSubAction(game, 'crime', btn.dataset.crimeAct));
    });

    // Home, Wellbeing, Leisure, Explore Actions
    container.querySelectorAll('[data-home-act]').forEach(btn => {
      btn.addEventListener('click', () => handleSectorSubAction(game, 'home', btn.dataset.homeAct));
    });
    container.querySelectorAll('[data-well-act]').forEach(btn => {
      btn.addEventListener('click', () => handleSectorSubAction(game, 'wellbeing', btn.dataset.wellAct));
    });
    container.querySelectorAll('[data-leisure-sel="craft"]').forEach(sel => {
      sel.addEventListener('change', () => {
        sub.leisure.activeCraft = sel.value;
        if (refreshCallback) refreshCallback();
      });
    });
    container.querySelectorAll('[data-leisure-act]').forEach(btn => {
      btn.addEventListener('click', () => handleSectorSubAction(game, 'leisure', btn.dataset.leisureAct));
    });
    container.querySelectorAll('[data-explore-sel="site"]').forEach(sel => {
      sel.addEventListener('change', () => {
        sub.explore.selectedSite = sel.value;
        if (refreshCallback) refreshCallback();
      });
    });
    container.querySelectorAll('[data-explore-act]').forEach(btn => {
      btn.addEventListener('click', () => handleSectorSubAction(game, 'explore', btn.dataset.exploreAct));
    });
  }

  window.TLLSubsystems = {
    getCategorySVGEmblem,
    getActivitySVGIcon,
    ensureMundaneWorkplace,
    ensureOccultWorkplace,
    getActiveMundaneAnnualPay,
    renderMundaneWorkplaceHTML,
    renderOccultWorkplaceHTML,
    renderSectorSubmenuHTML,
    bindSubsystemEvents
  };
})();
