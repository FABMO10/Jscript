const USERS_KEY = 'users'; // key used in localStorage to store the users array
if (localStorage.getItem(USERS_KEY) === null) { // if there is no "users" entry yet
    localStorage.setItem(USERS_KEY, '[]'); // seed an empty array so JSON.parse won't fail later
}
const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); // read users from storage (parse or default to [])
const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr)); // write (stringify) the users array back to storage

// ---- Helpers ----
const getId = () => // generate a user id
    (window.crypto && window.crypto.randomUUID) // if the secure UUID API exists
        ? window.crypto.randomUUID() // use a real RFC4122 UUID
        : (Date.now() + Math.random().toString(16).slice(2)); // otherwise, fall back to timestamp + random hex

// 1) Duplicate-username check (case-insensitive, trims)
function isUsernameTaken(users, candidate) { // returns true if candidate username already exists in users[]
    const norm = String(candidate || '').trim().toLowerCase(); // normalize: to string, trim spaces, lowercase
    if (!norm) return false; // empty names are treated as "not taken"
    return users.some(u => String(u?.username || '').trim().toLowerCase() === norm); // compare normalized usernames
}

// 2) Password validator: 6–12 chars, A–Z, a–z, digit, symbol, no spaces
function buildPasswordRegex() { // build and return a RegExp that enforces the password rules
    const parts = []; // collect lookahead fragments to join later

    // length + classes
    parts.push('(?=.{6,12}$)');       // length between 6 and 12 characters
    parts.push('(?=.*[A-Z])');          // must contain at least one uppercase letter
    parts.push('(?=.*[a-z])');          // must contain at least one lowercase letter
    parts.push('(?=.*\\d)');            // must contain at least one digit
    parts.push('(?=.*[^A-Za-z0-9])');   // must contain at least one symbol (non-alphanumeric)
    parts.push('(?!.*\\s)');            // must not contain whitespace

    return new RegExp('^' + parts.join('') + '.*$', 'i'); // assemble into one case-insensitive regex
}

const rx = buildPasswordRegex(); // prebuild the password regex once to reuse
function isPasswordValid(password) { // check a password string against the rules
    return rx.test(String(password)); // coerce to string and test with regex
}
function passwordRuleText() { // helper to keep the rule message in one place
    return 'Password must be 6–12 chars, include uppercase, lowercase, a digit, a symbol, and have no spaces.';
}

function toTitleCase(str) { // convert each word to Title Case (first letter upper, rest lower)
    return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

// Getting the inputs
document.getElementById('regForm')?.addEventListener('submit', (e) => { // if #regForm exists, listen for submit
    e.preventDefault(); // stop the default form submission/refresh

    // read and normalize form fields; fallback to empty strings if missing
    const firstName = toTitleCase(document.getElementById('firstName')?.value.trim() || ''.toTitleCase()); // Title Case first name (NOTE: calling ''.toTitleCase() will be undefined unless extended)
    const lastName = toTitleCase(document.getElementById('lastName')?.value.trim() || ''); // Title Case last name
    const userName = toTitleCase(document.getElementById('userName')?.value.trim() || ''); // Title Case username for display
    const password = toTitleCase(document.getElementById('password')?.value || ''); // Title Case password (this alters password characters)
    const msgEl = document.getElementById('confirmation'); // element to display status messages

    const users = loadUsers(); // load existing users array from storage

    if (isUsernameTaken(users, userName)) { // if the username already exists
        msgEl.textContent = 'That username already exists.'; // show duplicate message
        return; // stop processing
    }
    if (!isPasswordValid(password)) { // if password does not meet the regex rules
        msgEl.textContent = passwordRuleText(); // show the password requirements
        return; // stop processing
    }

    const user = { // build the new user object
        id: getId(), // generated unique id
        username: userName, // chosen username (title-cased above)
        firstName, // first name
        lastName, // last name
        password, // password as captured (note: has been title-cased)
        created: new Date().toISOString() // ISO timestamp of creation
    };

    users.push(user); // add the new user to the in-memory array
    saveUsers(users); // persist the updated users array to localStorage

    const userElement = document.getElementById('new_USER'); // optional output area to show the created user JSON
    if (userElement) { // if present
        userElement.textContent = JSON.stringify(user, null, 2); // pretty-print the user object into the element
    }
    msgEl.textContent = `Saved ${userName}`; // show success message
    e.target.reset(); // clear the form inputs

    setTimeout(function () { // after a short delay
       window.location.href = "./index.html" // redirect to the index page
    }, 2000); // delay for 2 seconds (2000 ms)
});
