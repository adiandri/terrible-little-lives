// Game Engine for Terrible Little Lives

class TerribleGame {
  constructor() {
    this.character = null;
    this.logs = [];
    this.activeDilemma = null;
    this.usedDilemmaIds = new Set();
    this.initElements();
    this.bindEvents();
    this.loadOrNewGame();
  }

  initElements() {
    this.dom = {
      phoneScreen: document.getElementById('phone-screen'),
      charName: document.getElementById('char-name'),
      charTitle: document.getElementById('char-title'),
      charAgeYear: document.getElementById('char-age-year'),
      charCoin: document.getElementById('char-coin'),
      logFeed: document.getElementById('log-feed'),
      btnEndure: document.getElementById('btn-endure'),
      btnRestart: document.getElementById('btn-restart'),
      btnMute: document.getElementById('btn-mute'),
      muteIcon: document.getElementById('mute-icon'),
      
      // Stat bars
      barVitality: document.getElementById('bar-vitality'),
      valVitality: document.getElementById('val-vitality'),
      barSanity: document.getElementById('bar-sanity'),
      valSanity: document.getElementById('val-sanity'),
      barOccult: document.getElementById('bar-occult'),
      valOccult: document.getElementById('val-occult'),
      barHumanity: document.getElementById('bar-humanity'),
      valHumanity: document.getElementById('val-humanity'),

      // Dilemma Sheet
      dilemmaModal: document.getElementById('dilemma-modal'),
      dilemmaBackdrop: document.getElementById('dilemma-backdrop'),
      dilemmaTitle: document.getElementById('dilemma-title'),
      dilemmaPrompt: document.getElementById('dilemma-prompt'),
      dilemmaChoices: document.getElementById('dilemma-choices'),

      // Post-Mortem Modal
      deathModal: document.getElementById('death-modal'),
      deathName: document.getElementById('death-name'),
      deathAge: document.getElementById('death-age'),
      deathCause: document.getElementById('death-cause'),
      deathEpitaph: document.getElementById('death-epitaph'),
      btnNewLife: document.getElementById('btn-new-life')
    };
  }

  bindEvents() {
    this.dom.btnEndure.addEventListener('click', () => this.endureYear());
    this.dom.btnRestart.addEventListener('click', () => {
      if (confirm("Abandon this cursed life and begin anew?")) {
        this.newGame();
      }
    });
    this.dom.btnNewLife.addEventListener('click', () => this.newGame());
    this.dom.btnMute.addEventListener('click', () => this.toggleMute());
  }

  toggleMute() {
    const isMuted = window.soundEngine.toggleMute();
    this.dom.muteIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
    if (window.lucide) window.lucide.createIcons();
  }

  loadOrNewGame() {
    const saved = localStorage.getItem('TLL_SAVE');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.character = data.character;
        this.logs = data.logs || [];
        this.usedDilemmaIds = new Set(data.usedDilemmaIds || []);
        this.renderAll();
        if (!this.character.isAlive) {
          this.showDeathModal();
        }
        return;
      } catch (e) {
        console.error("Failed to parse save game", e);
      }
    }
    this.newGame();
  }

  saveGame() {
    const data = {
      character: this.character,
      logs: this.logs,
      usedDilemmaIds: Array.from(this.usedDilemmaIds)
    };
    localStorage.setItem('TLL_SAVE', JSON.stringify(data));
  }

  newGame() {
    this.character = window.generateCharacter();
    this.usedDilemmaIds.clear();
    this.logs = [
      {
        age: 0,
        year: this.character.year,
        entries: [
          `Born at ${this.character.birthplace}.`,
          this.character.origin
        ]
      }
    ];

    this.activeDilemma = null;
    this.hideModals();
    this.renderAll();
    this.saveGame();
    window.soundEngine.playTick();
  }

  hideModals() {
    this.dom.dilemmaModal.classList.add('hidden');
    this.dom.dilemmaBackdrop.classList.add('hidden');
    this.dom.deathModal.classList.add('hidden');
  }

  endureYear() {
    if (!this.character.isAlive || this.activeDilemma) return;

    window.soundEngine.playTick();
    if (navigator.vibrate) navigator.vibrate(35);

    this.character.age += 1;
    this.character.year += 1;

    // Update life stage title
    if (this.character.age <= 3) this.character.statusTitle = "Infant";
    else if (this.character.age <= 6) this.character.statusTitle = "Toddler";
    else if (this.character.age <= 12) this.character.statusTitle = "Child";
    else if (this.character.age <= 17) this.character.statusTitle = "Adolescent";
    else this.character.statusTitle = "Young Adult";

    // Minor baseline metabolic drift
    this.modifyStat('vitality', (Math.random() > 0.65 ? -1 : 0));

    // Annual log bucket
    const currentYearLog = {
      age: this.character.age,
      year: this.character.year,
      entries: []
    };

    // Check for random interactive dilemma
    const availableDilemmas = window.GAME_DATA.INTERACTIVE_DILEMMAS.filter(d => 
      this.character.age >= d.minAge && 
      this.character.age <= d.maxAge && 
      !this.usedDilemmaIds.has(d.id)
    );

    // 50% chance of dilemma if available
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

    // Otherwise, check for ambient flavor entry
    const ambientPool = window.GAME_DATA.AMBIENT_YEAR_EVENTS.filter(e =>
      this.character.age >= e.minAge && this.character.age <= e.maxAge
    );

    if (ambientPool.length > 0 && Math.random() < 0.7) {
      const ambient = ambientPool[Math.floor(Math.random() * ambientPool.length)];
      currentYearLog.entries.push(ambient.text);
    } else {
      currentYearLog.entries.push("Another cold winter passed in uneventful stillness. The house settled deeper into the damp earth.");
    }

    // Low sanity hallucinations in the log
    if (this.character.stats.sanity < 30 && Math.random() < 0.6) {
      const whispers = [
        "You woke up with dry mud under your fingernails and the front gate unlocked.",
        "You heard a woman singing hymns from inside the chimney flue at 4 AM.",
        "Your shadow detached from your feet for a few seconds when you crossed the vestibule.",
        "A pale hand tapped against the frosted glass of your bedroom window."
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
      btn.className = "w-full text-left p-3.5 rounded-lg bg-[#20232a] hover:bg-[#282c35] active:scale-[0.98] border border-[#2d313b] text-[#e2ded4] text-sm transition-all duration-150 flex items-start space-x-3";
      
      const badge = document.createElement('span');
      badge.className = "px-2 py-0.5 rounded text-xs bg-[#121316] text-[#8c8f9a] font-mono shrink-0";
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
    this.dom.dilemmaBackdrop.classList.remove('hidden');
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

    // Apply stat effects
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
    if (!this.character.stats[stat] !== undefined) {
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
    this.dom.deathModal.classList.remove('hidden');
  }

  renderAll() {
    if (!this.character) return;

    // Header info
    this.dom.charName.textContent = this.character.name;
    this.dom.charTitle.textContent = this.character.statusTitle;
    this.dom.charAgeYear.textContent = `Age: ${this.character.age} | Year: ${this.character.year}`;
    this.dom.charCoin.textContent = `${this.character.coin} s.`;

    // Stats
    this.updateStatBar(this.dom.barVitality, this.dom.valVitality, this.character.stats.vitality);
    this.updateStatBar(this.dom.barSanity, this.dom.valSanity, this.character.stats.sanity);
    this.updateStatBar(this.dom.barOccult, this.dom.valOccult, this.character.stats.occult);
    this.updateStatBar(this.dom.barHumanity, this.dom.valHumanity, this.character.stats.humanity);

    // Sanity visual jitter
    if (this.character.stats.sanity < 25) {
      this.dom.phoneScreen.classList.add('low-sanity-jitter');
    } else {
      this.dom.phoneScreen.classList.remove('low-sanity-jitter');
    }

    // Button states
    if (!this.character.isAlive) {
      this.dom.btnEndure.disabled = true;
      this.dom.btnEndure.classList.add('opacity-40', 'cursor-not-allowed');
      this.dom.btnEndure.innerHTML = `<span>DECEASED</span>`;
    } else {
      this.dom.btnEndure.disabled = false;
      this.dom.btnEndure.classList.remove('opacity-40', 'cursor-not-allowed');
      this.dom.btnEndure.innerHTML = `
        <span class="font-serif tracking-widest text-sm">ENDURE YEAR</span>
        <span class="text-xs text-[#8c8f9a] font-sans block mt-0.5">[ +1 Year ]</span>
      `;
    }

    // Render Log Feed
    this.renderLogs();

    // Recreate lucide icons if present
    if (window.lucide) window.lucide.createIcons();
  }

  updateStatBar(barEl, valEl, value) {
    barEl.style.width = `${value}%`;
    valEl.textContent = `${Math.round(value)}%`;
  }

  renderLogs() {
    this.dom.logFeed.innerHTML = '';

    this.logs.forEach(yearLog => {
      const card = document.createElement('div');
      card.className = "bg-[#181a1f] border border-[#262930] rounded-xl p-3.5 mb-3 shadow-sm transition-all";

      const header = document.createElement('div');
      header.className = "flex items-center justify-between border-b border-[#262930]/80 pb-1.5 mb-2";

      const badge = document.createElement('span');
      badge.className = "text-[11px] font-serif font-bold text-[#e2ded4] tracking-wider uppercase bg-[#0f1013] px-2 py-0.5 rounded border border-[#262930]";
      badge.textContent = `AGE ${yearLog.age}`;

      const yearText = document.createElement('span');
      yearText.className = "text-[11px] text-[#8c8f9a] font-mono";
      yearText.textContent = `A.D. ${yearLog.year}`;

      header.appendChild(badge);
      header.appendChild(yearText);
      card.appendChild(header);

      const list = document.createElement('div');
      list.className = "space-y-1.5 text-xs text-[#d3cec4] leading-relaxed";

      yearLog.entries.forEach(entry => {
        const p = document.createElement('p');
        p.className = "relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-[#7c6396]";
        
        // Minor highlight for decisions
        if (entry.startsWith('[')) {
          p.className = "relative pl-3 text-[#991b1b] font-medium before:content-['✦'] before:absolute before:left-0 before:text-[#991b1b]";
        }
        
        p.textContent = entry;
        list.appendChild(p);
      });

      card.appendChild(list);
      this.dom.logFeed.appendChild(card);
    });

    // Auto-scroll to bottom of feed
    setTimeout(() => {
      this.dom.logFeed.scrollTop = this.dom.logFeed.scrollHeight;
    }, 50);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new TerribleGame();
});
