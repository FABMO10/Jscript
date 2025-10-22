// ranking.js — modern version using class + modules (no try/catch)

export class RankingSystem {
  constructor(storage = localStorage, session = sessionStorage) {
    this.storage = storage;
    this.session = session;
  }

  // ---------- Storage Helpers ----------

  getCurrentEmail() {
    const email = this.session.getItem('loggedInUser');
    if (email && email !== 'undefined' && email !== 'null' && email !== '') {
      return email;
    }
    const cu = this.storage.getItem('currentUser');
    if (cu) {
      const parsed = JSON.parse(cu);
      if (parsed && parsed.email) return parsed.email;
    }
    return null;
  }

  loadUser(email) {
    const data = this.storage.getItem(email);
    return data ? JSON.parse(data) : null;
  }

  saveUser(user) {
    if (!user || !user.email) return;
    this.storage.setItem(user.email, JSON.stringify(user));
  }

  loadAllUsers() {
    const users = [];
    const keys = Object.keys(this.storage);
    for (const key of keys) {
      if (key === 'currentUser') continue;
      const data = this.storage.getItem(key);
      if (data) {
        const obj = JSON.parse(data);
        if (obj && obj.email) {
          obj.topScore = Number(obj.topScore) || 0;
          users.push(obj);
        }
      }
    }
    return users;
  }

  // ---------- Leaderboard Logic ----------

  getLeaderboard() {
    const users = this.loadAllUsers();
    const leaderboard = users.map(u => ({
      username: u.username || u.name || u.email,
      email: u.email,
      topScore: Number(u.topScore) || 0
    }));
    // sort highest → lowest
    leaderboard.sort((a, b) => b.topScore - a.topScore);
    return leaderboard;
  }

  renderLeaderboard(containerId = 'RankingTable') {
    const el = document.getElementById(containerId);
    if (!el) return;

    const leaderboard = this.getLeaderboard();

    let html = `
      <div style="max-width:600px;margin:16px auto;">
        <div style="display:flex;justify-content:space-between;
                    padding:10px 12px;font-weight:700;border-bottom:1px solid #ddd;">
          <span>Name</span><span>Top Score</span>
        </div>
    `;

    leaderboard.forEach((entry, i) => {
      const highlight = i === 0 ? 'background:#fffbe6;' : '';
      html += `
        <div style="display:flex;justify-content:space-between;
                    padding:10px 12px;border-bottom:1px solid #eee;${highlight}">
          <span title="${entry.email}">${entry.username}</span>
          <span>${entry.topScore}</span>
        </div>
      `;
    });

    html += `</div>`;
    el.innerHTML = html;

    console.clear();
    console.log('Leaderboard (JSON):');
    console.log(JSON.stringify(leaderboard, null, 2));
    console.table(leaderboard);
  }

  // ---------- Updating Score ----------

  updateScore(inputId = 'NewScore') {
    const el = document.getElementById(inputId);
    if (!el) return;

    const newScore = Number(el.value);
    if (!Number.isFinite(newScore)) {
      alert('Please enter a valid number for score.');
      return;
    }

    const email = this.getCurrentEmail();
    if (!email) {
      alert('No logged-in user found.');
      return;
    }

    let user = this.loadUser(email);
    if (!user) {
      user = { email, username: email, topScore: 0 };
    }

    if (newScore > (user.topScore || 0)) {
      user.topScore = newScore;
      this.saveUser(user);
    }

    this.renderLeaderboard();
  }

  // ---------- Demo Seeding ----------

  seedDemoUsers() {
    const demo = [
      { email: 'alice@example.com', username: 'Alice', topScore: 42 },
      { email: 'bob@example.com', username: 'Bob', topScore: 17 },
      { email: 'zoe@example.com', username: 'Zoe', topScore: 63 },
    ];
    demo.forEach(u => this.saveUser(u));
  }
}
