document.addEventListener('DOMContentLoaded', () => { // run this code after the DOM has fully loaded
  const form = document.getElementById('logForm'); // login form element
  const userEl = document.getElementById('username'); // username input
  const passEl = document.getElementById('password'); // password input
  const msgEl = document.getElementById('confirmation'); // status/confirmation message area

  const startGameBtn = document.getElementById('startBtn'); // optional "Start Game" button
  const message = document.getElementById('message'); // message element shown when start is clicked

  if (startGameBtn && message) { // only bind if both elements exist
    startGameBtn.addEventListener('click', function () { // on click of start button
      message.style.display = 'block'; // show the message element
    });
  }

  const storageKey = 'users'; // localStorage key for users array
  const sessionKey = 'currentUser'; // localStorage key for currently logged-in user (session)

  if (!localStorage.getItem(storageKey)) { // seed users storage if missing
    localStorage.setItem(storageKey, '[]'); // initialize with empty array so JSON.parse is safe
  }

  function toTitleCase(str) { // helper: convert each word to Title Case
    return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
  }
  const loadUsers = () => JSON.parse(localStorage.getItem(storageKey) || '[]'); // load users array from storage
  const saveUsers = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr)); // save users array to storage
  const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase(); // normalize strings: trim, collapse spaces, lowercase

  form.addEventListener('submit', (e) => { // handle login form submission
    e.preventDefault(); // prevent page reload/navigation

    const uname = normalize(userEl?.value); // normalized username from input
    const pwd = passEl?.value || ''; // raw password from input (empty string fallback)

    if (!uname || !pwd) { // basic required-field check
      if (msgEl) msgEl.textContent = 'Please enter username and password.'; // prompt for missing fields
      return; // stop processing
    }

    const users = loadUsers(); // fetch current users from storage

    if (!Array.isArray(users) || users.length === 0) { // no users registered yet
      if (msgEl) msgEl.textContent = 'No users registered yet. Please register first.'; // instruct to register
      return; // stop processing
    }

    const user = users.find(u => normalize(u.username) === uname); // find user by normalized username
    if (!user) { // user not found
      if (msgEl) msgEl.textContent = 'User not registered. Please register first.'; // show not registered message
      return; // stop processing
    }

    if ((user.password || '') !== pwd) { // password mismatch
      if (msgEl) msgEl.textContent = 'Incorrect Password'; // show incorrect password message
      return; // stop processing
    }

    // ---- SUCCESSFUL LOGIN ----
    // Score resets to 0. Topscore remains same. // clarify login behavior
    if (!Number.isFinite(Number(user.cash))) user.cash = 100; // ensure cash exists; default to 100
    if (!Number.isFinite(Number(user.topScore))) user.topScore = 0; // ensure topScore exists; default to 0
    user.score = 0; // score resets on login
    user.lastLoggedInAt = new Date().toISOString(); // track login timestamp (ISO string)

    // Persist the updated user back into the array
    const idx = users.findIndex(u => u.id === user.id); // locate this user's record index
    if (idx >= 0) { // if found in the array
      users[idx] = user; // replace with updated user object
      saveUsers(users); // save updated array to storage
    }

    // Remember who is logged in (session)
    localStorage.setItem(sessionKey, JSON.stringify({ // write session info to storage
      id: user.id, // user id
      username: user.username, // username
      firstName: user.firstName, // first name
      lastName: user.lastName, // last name
      loggedInAt: new Date().toISOString() // session start timestamp
    }));

    if (msgEl) msgEl.textContent = `Welcome, ${toTitleCase(user.username)}!`; // greet the user

    // Redirect after 2 seconds
    setTimeout(() => { // delay navigation/closing for UX
      // If user logs in *from inside game.html*, just close the modal
      if (window.location.pathname.includes("game.html")) { // check current page path
        document.getElementById("loginModal").style.display = "none"; // hide login modal
        document.getElementById("rollBtn").disabled = false; // re-enable roll button
      } else {
        window.location.href = "./game.html"; // otherwise navigate to the game page
      }
    }, 2000); // 2-second delay
  });
});
