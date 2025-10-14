// ...existing code...
function register() {
  const form = document.getElementById('regForm');
  if (!form) return;

  const first = document.getElementById('firstName');
  const last = document.getElementById('lastName');
  const maiden = document.getElementById('maidenName');
  const pass = document.getElementById('password');
  const storageEl = document.getElementById('new_USER');
  const confirmEl = document.getElementById('confirmation');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const f = first?.value.trim() || '';
    const l = last?.value.trim() || '';
    const m = maiden?.value.trim() || '';
    const p = pass?.value || '';

     const username = (f + ' ' + l).trim();

    // if username or password is empty -> output "missing"
    if (username === '' || p === '') {
      if (confirmEl) confirmEl.textContent = 'missing username or password';
      return;
    }

    const user = {
      firstName: f,
      lastName: l,
      maidenName: m,
      created: new Date().toISOString()
    };

    // Save each user under a numeric key to avoid JSON.parse and try/catch
    const rawCount = localStorage.getItem('users_count');
    const currentCount = rawCount !== null && rawCount !== '' ? Number(rawCount) : 0;
    const safeCount = Number.isFinite(currentCount) && !Number.isNaN(currentCount) ? currentCount : 0;
    const nextIndex = safeCount + 1;

    localStorage.setItem('user_' + nextIndex, JSON.stringify(user));
    localStorage.setItem('users_count', String(nextIndex));

    if (storageEl) storageEl.textContent = JSON.stringify(user);
    if (confirmEl) confirmEl.textContent = `Saved: ${f} ${l}${m ? ' (maiden: ' + m + ')' : ''}`;

   
    if (pass) pass.value = '';
  });
}

document.addEventListener('DOMContentLoaded', register);
