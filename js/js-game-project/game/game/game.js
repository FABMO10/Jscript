// ===============================
// Simple Craps Game + Cash System
// ===============================

// --- Keys shared across pages ---
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// Seed users storage so JSON.parse is always safe (no try/catch needed)
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, '[]');
}

// --- Small storage helpers ---
const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));
const getCurrentUser = () => JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');

// --- Persist helpers (used after each resolved hand) ---
function persistCashToUser(newCash) {
  const me = getCurrentUser();
  if (!me) return;
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === me.id);
  if (idx >= 0) {
    users[idx].cash = Number(newCash);
    saveUsers(users);
  }
}

function updateTopWinsIfNeeded(winsNow) {
  const me = getCurrentUser();
  if (!me) return;
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === me.id);
  if (idx >= 0) {
    const prev = Number(users[idx].topScore || 0);
    if (winsNow > prev) {
      users[idx].topScore = winsNow;
      saveUsers(users);
    }
  }
}

// --- Dice UI helpers ---
function setDieFace(el, value) {
  el.innerHTML = '';
  const positions = {
    1: [5],
    2: [1,9],
    3: [1,5,9],
    4: [1,3,7,9],
    5: [1,3,5,7,9],
    6: [1,3,4,6,7,9]
  };
  const grid = {
    1: '1 / 1', 2: '1 / 2', 3: '1 / 3',
    4: '2 / 1', 5: '2 / 2', 6: '2 / 3',
    7: '3 / 1', 8: '3 / 2', 9: '3 / 3'
  };
  const spots = positions[value] || [];
  for (let i = 0; i < spots.length; i++) {
    const pip = document.createElement('div');
    pip.className = 'pip';
    pip.style.gridArea = grid[spots[i]];
    el.appendChild(pip);
  }
}

function rDie() { return Math.floor(Math.random() * 6) + 1; }

function animateRoll(d1, d2, onDone) {
  d1.classList.add('rolling');
  d2.classList.add('rolling');

  const steps = 8;
  let count = 0;
  const tick = setInterval(() => {
    setDieFace(d1, rDie());
    setDieFace(d2, rDie());
    count++;
    if (count >= steps) {
      clearInterval(tick);
      d1.classList.remove('rolling');
      d2.classList.remove('rolling');
      const a = rDie();
      const b = rDie();
      setDieFace(d1, a);
      setDieFace(d2, b);
      onDone(a, b);
    }
  }, 70);
}

// --- Craps rules helpers ---
function isNatural(sum) { return sum === 7 || sum === 11; }
function isCraps(sum)   { return sum === 2 || sum === 3 || sum === 12; }

// --- Step-based craps engine with bankroll ---
class CrapsGame {
  constructor({ initialCash = 100, bet = 50 } = {}) {
    this.cash = initialCash;
    this.bet  = bet;
    this.point = null;       // null = come-out roll
    this.wins = 0;
    this.losses = 0;
    this.gameOver = this.cash <= 0;
  }

  /**
   * Apply one roll (sum = a+b) to the game state.
   * Returns an object describing what happened for the UI.
   */
  applyRoll(sum) {
    if (this.gameOver) {
      return { kind: 'error', message: 'No cash left. Game over.' };
    }

    // --- Come-out roll ---
    if (this.point === null) {
      if (isNatural(sum)) {
        this.wins++;
        this.cash += this.bet;
        persistCashToUser(this.cash);
        updateTopWinsIfNeeded(this.wins);
        const info = { kind: 'resolve', phase: 'come-out', outcome: 'win', reason: 'Natural (7 or 11).' };
        this._resetHand(); this._checkBankrupt(); return info;
      }
      if (isCraps(sum)) {
        this.losses++;
        this.cash -= this.bet;
        persistCashToUser(this.cash);
        const info = { kind: 'resolve', phase: 'come-out', outcome: 'loss', reason: 'Craps (2, 3, or 12).' };
        this._resetHand(); this._checkBankrupt(); return info;
      }
      this.point = sum;
      return { kind: 'continue', phase: 'point', point: this.point, message: `Point is ${this.point}. Roll again.` };
    }

    // --- Point phase ---
    if (sum === 7) {
      const p = this.point;
      this.losses++;
      this.cash -= this.bet;
      persistCashToUser(this.cash);
      const info = { kind: 'resolve', phase: 'point', outcome: 'loss', reason: `Seven-out before making ${p}.`, point: p };
      this._resetHand(); this._checkBankrupt(); return info;
    }

    if (sum === this.point) {
      const p = this.point;
      this.wins++;
      this.cash += this.bet;
      persistCashToUser(this.cash);
      updateTopWinsIfNeeded(this.wins);
      const info = { kind: 'resolve', phase: 'point', outcome: 'win', reason: `Made the point ${p}!`, point: p };
      this._resetHand(); this._checkBankrupt(); return info;
    }

    return { kind: 'continue', phase: 'point', point: this.point, message: `Still aiming for ${this.point}.` };
  }

  _resetHand() { this.point = null; }
  _checkBankrupt() { if (this.cash <= 0) this.gameOver = true; }
}

// --- UI wiring ---
document.addEventListener('DOMContentLoaded', () => {
  // Grab elements
  const winsEl   = document.getElementById('wins');
  const lossesEl = document.getElementById('losses');
  const topEl    = document.getElementById('topScore');
  const helloEl  = document.getElementById('helloUser');
  const resultEl = document.getElementById('resultText');
  const rollBtn  = document.getElementById('rollBtn');
  const die1El   = document.getElementById('die1');
  const die2El   = document.getElementById('die2');

  // Add a "Cash" pill dynamically if not present in HTML
  let cashPill = document.getElementById('cashPill');
  if (!cashPill) {
    const statsBar = document.querySelector('.stats');
    if (statsBar) {
      cashPill = document.createElement('span');
      cashPill.id = 'cashPill';
      cashPill.className = 'pill';
      cashPill.innerHTML = 'Cash: $<b id="cashVal">100</b>';
      statsBar.appendChild(cashPill);
    }
  }
  const cashValEl = document.getElementById('cashVal');

  // Initialize dice faces
  setDieFace(die1El, 1);
  setDieFace(die2El, 1);

  // Game state
  const game = new CrapsGame({ initialCash: 100, bet: 50 });

  // Optional: greet logged-in user + show their stored topScore
  const me = getCurrentUser();
  if (helloEl) {
    if (me) {
      const name = me.firstName ? (me.firstName + (me.lastName ? ' ' + me.lastName : '')) : me.username;
      helloEl.textContent = 'Logged in as ' + name;
    } else {
      helloEl.textContent = 'Not logged in.';
    }
  }
  if (me && topEl) {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === me.id);
    const top = (idx >= 0 && Number.isFinite(Number(users[idx].topScore))) ? Number(users[idx].topScore) : 0;
    topEl.textContent = String(top);
  }

  // Render helpers
  function renderCounters() {
    if (winsEl) winsEl.textContent = String(game.wins);
    if (lossesEl) lossesEl.textContent = String(game.losses);
    if (cashValEl) cashValEl.textContent = String(game.cash);
  }
  function renderResult(text, good) {
    if (!resultEl) return;
    resultEl.textContent = text;
    resultEl.className = 'result ' + (good ? 'ok' : 'bad');
  }

  renderCounters();

  // Button handler: animate dice, apply roll, update UI
  if (rollBtn) {
    rollBtn.addEventListener('click', () => {
      if (game.gameOver) {
        renderResult('No cash left. Game over.', false);
        return;
      }

      rollBtn.disabled = true;
      resultEl && (resultEl.textContent = '');

      animateRoll(die1El, die2El, (a, b) => {
        const sum = a + b;
        const res = game.applyRoll(sum);

        if (res.kind === 'error') {
          renderResult(res.message, false);
        } else if (res.kind === 'continue') {
          renderResult(`You rolled ${sum}. ${res.message}`, true);
        } else if (res.kind === 'resolve') {
          const good = res.outcome === 'win';
          renderResult(`You rolled ${sum}. ${res.reason}`, good);
          if (topEl) updateTopWinsIfNeeded(game.wins);
          if (game.gameOver) {
            renderResult('You rolled ' + sum + '. ' + res.reason + ' | Cash: $0 — Game Over.', false);
          }
        }

        renderCounters();
        rollBtn.disabled = false;
      });
    });
  }
});
