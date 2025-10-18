document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('logForm');
  const userEl = document.getElementById('username');
  const passEl = document.getElementById('password');
  const msgEl  = document.getElementById('confirmation'); // optional note area

  const storageKey = 'users';
  const sessionKey = 'currentUser';

  // Seed so JSON.parse is safe without try/catch
  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, '[]');
  }

  const loadUsers = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
  const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const uname = norm(userEl?.value);
    const pwd   = passEl?.value || '';

    if (!uname || !pwd) {
      alert('Please enter username and password.');
      return;
    }

    const users = loadUsers();

    if (!Array.isArray(users) || users.length === 0) {
      alert('No users registered yet. Please register first.');
      return;
    }

    const user = users.find(u => norm(u.username) === uname);

    if (!user) {
      alert('User not registered. Please register first.');
      return;
    }

    if ((user.password || '') !== pwd) {
      alert('Incorrect password.');
      return;
    }

    // Success: remember who logged in, then go to game.html
    localStorage.setItem(sessionKey, JSON.stringify({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      loggedInAt: new Date().toISOString()
    }));

    msgEl && (msgEl.textContent = `Welcome, ${user.firstName || user.username}!`);
    window.location.href = 'game.html';
  });
});