const USERS_KEY = 'users';

    // Ensure the key exists so JSON.parse is safe if your game hasn't run yet
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, '[]');
    }

    // Load users (expects valid JSON written by the game)
    function loadUsers() {
      const raw = localStorage.getItem(USERS_KEY) || '[]';
      const arr = JSON.parse(raw);              // no try/catch per your request
      return Array.isArray(arr) ? arr : [];
    }

    // Prefer username; fall back to "firstName lastName" if present
    function nameOf(u) {
      const uname = (u && u.username) ? String(u.username).trim() : '';
      if (uname) return uname;
      const first = (u && u.firstName) ? String(u.firstName).trim() : '';
      const last  = (u && u.lastName)  ? String(u.lastName).trim()  : '';
      const combo = (first + ' ' + last).trim();
      return combo || 'Player';
    }

    // Map to {username, cash} and sort by cash desc, then name asc
    function getRanked() {
      const cleaned = loadUsers()
        .map(u => ({ username: nameOf(u), cash: Number(u && u.cash) }))
        .filter(u => u.username && Number.isFinite(u.cash));

      const sorted = cleaned.sort((a, b) => (b.cash - a.cash) || a.username.localeCompare(b.username));

      // competition ranking: 1,2,2,4...
      let lastCash = null, lastRank = 0;
      return sorted.map((u, i) => {
        if (u.cash !== lastCash) { lastRank = i + 1; lastCash = u.cash; }
        return { ...u, rank: lastRank };
      });
    }

    const currencyFmt = new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    });

    function render() {
      const tbody = document.getElementById('leaderboard-body');
      const empty = document.getElementById('leaderboard-empty');
      const count = document.getElementById('playerCount');
      if (!tbody) return;

      const ranked = getRanked();

      tbody.innerHTML = '';
      const frag = document.createDocumentFragment();

      for (let i = 0; i < ranked.length; i++) {
        const u = ranked[i];
        const tr = document.createElement('tr');

        const tdRank = document.createElement('td');
        tdRank.className = 'rank';
        tdRank.textContent = u.rank;

        const tdName = document.createElement('td');
        tdName.textContent = u.username;

        const tdCash = document.createElement('td');
        tdCash.className = 'cash';
        tdCash.textContent = currencyFmt.format(u.cash);

        tr.append(tdRank, tdName, tdCash);
        frag.appendChild(tr);
      }

      tbody.appendChild(frag);
      empty.style.display = ranked.length ? 'none' : 'block';
      count.textContent = `${ranked.length} ${ranked.length === 1 ? 'player' : 'players'}`;
    }

    // Re-render when users change (this tab or other tabs)
    const _setItem = localStorage.setItem;
    localStorage.setItem = function(k, v) {
      _setItem.apply(this, arguments);
      if (k === USERS_KEY) render();
    };
    window.addEventListener('storage', (e) => {
      if (e.key === USERS_KEY) render();
    });

    document.addEventListener('DOMContentLoaded', render);
 