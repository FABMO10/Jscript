document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('logForm');
  const userEl = document.getElementById('username');
  const passEl = document.getElementById('password');
  const msgEl  = document.getElementById('confirmation'); 

  const storageKey = 'users';
  const sessionKey = 'currentUser';

  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, '[]');
  }

  const loadUsers = () => JSON.parse(localStorage.getItem(storageKey) || '[]');//function to load users from local storage converts data type.
  const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const uname = normalize(userEl?.value);//saves the username to uname 
    const pwd   = passEl?.value || '';//saves the password to pwd

    if (!uname || !pwd) {
      alert('Please enter username and password.');//checks if user has username or password 
      return;
    }

    const users = loadUsers();

    if (!Array.isArray(users) || users.length === 0) {//checks if there is any array of users also checks the length of the array if it exists.
      alert('No users registered yet. Please register first.');
      return;
    }
    const user = users.find(u => normalize(u.username) === uname);//matches the perfect registered user 
    if (!user) {
      alert('User not registered. Please register first.');//matches if the user credentials are registered
      return;
    }

    if ((user.password || '') !== pwd) {
      alert('Incorrect password.');//matches the password 
      return;
    }

    // remembers who logged in, then go to game.html
    localStorage.setItem(sessionKey, JSON.stringify({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      loggedInAt: new Date().toISOString()
    }));//creates a session for the logged in user under the key sessionKey.s

    msgEl && (msgEl.textContent = `Welcome, ${user.firstName || user.username}!`);
    window.location.href = '../game/game.html';
  });
});

// After verifying password (on success)
const users = JSON.parse(localStorage.getItem('users') || '[]');
const idx = users.findIndex(u => u.id === users.id);
if (idx >= 0) {
  // initialize cash if missing (start at 100 for new players)
  if (!(Number.isFinite(Number(users[idx].cash)))) users[idx].cash = 100;
  users[idx].lastLoggedInAt = new Date().toISOString();
  localStorage.setItem('users', JSON.stringify(users));
}
