class Registration {
  constructor({
    formId = 'regForm',
    firstId = 'firstName',
    lastId = 'lastName',
    maidenId = 'maidenName',
    passId = 'password',
    outUserId = 'new_USER',
    confirmId = 'confirmation',
    storageKey = 'users'
  } = {}) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    // inputs / outputs
    this.first = document.getElementById(firstId);
    this.last  = document.getElementById(lastId);
    this.maiden= document.getElementById(maidenId);
    this.pass  = document.getElementById(passId);
    this.out   = document.getElementById(outUserId);
    this.msg   = document.getElementById(confirmId);

    // storage
    this.storageKey = storageKey;
    if (localStorage.getItem(this.storageKey) === null) {
  localStorage.setItem(this.storageKey, '[]');
}

    // events
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  loadUsers() {
    // safe because we seeded above
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveUsers(arr) {
    localStorage.setItem(this.storageKey, JSON.stringify(arr));
  }

  buildUser(f, l, m, p) {
    const username = (f + ' ' + l).trim();
    return {
      id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      username,
      password: p,     // plaintext for demo/offline only
      firstName: f,
      lastName: l,
      maidenName: m,
      created: new Date().toISOString()
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const f = this.first?.value.trim()  || '';
    const l = this.last?.value.trim()   || '';
    const m = this.maiden?.value.trim() || '';
    const p = this.pass?.value || '';

    const username = (f + ' ' + l).trim();
    if (!username || !p) {
      this.setMsg('Missing username or password.');
      return;
    }

    const users = this.loadUsers();

    // OPTIONAL: prevent duplicates (case-insensitive)
    if (users.some(u => (u.username || '').toLowerCase() === username.toLowerCase())) {
      this.setMsg('That username already exists.');
      return;
    }

    const newUser = this.buildUser(f, l, m, p);
    users.push(newUser);
    this.saveUsers(users);

    if (this.out) this.out.textContent = JSON.stringify(newUser, null, 2);
    this.setMsg(`Saved ${username}`);
    this.form.reset?.();
  }

  setMsg(text) {
    if (this.msg) this.msg.textContent = text;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Registration(); // uses default element IDs
});
