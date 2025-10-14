    
      function loadPlayers() {
        const container = document.querySelector('.ranking');
        
        container.querySelectorAll('.player').forEach(el => el.remove());

        const players = [];
        const countRaw = localStorage.getItem('users_count');
        const count = countRaw !== null && countRaw !== '' ? Number(countRaw) : 0;
        if (count > 0) {
          for (let i = 1; i <= count; i++) {
            const raw = localStorage.getItem('user_' + i);
            if (!raw) continue;
            
            if (raw[0] === '{' || raw[0] === '[') {
              const obj = JSON.parse(raw);
              players.push(obj);
            }
          }
        } else {
          
          const rawAll = localStorage.getItem('users');
          if (rawAll && (rawAll[0] === '[' || rawAll[0] === '{')) {
            const arr = JSON.parse(rawAll);
            if (Array.isArray(arr)) players.push(...arr);
            else if (arr && typeof arr === 'object') players.push(arr);
          }
        }

        
        if (players.length === 0) {
          const noOne = document.createElement('div');
          noOne.className = 'player';
          noOne.textContent = 'No registered players';
          container.appendChild(noOne);
          return;
        }

       
        players.forEach(p => {
          const nameParts = [];
          if (p.firstName) nameParts.push(p.firstName);
          if (p.lastName) nameParts.push(p.lastName);
          const displayName = nameParts.length ? nameParts.join(' ') : (p.name || 'Unknown');

          const div = document.createElement('div');
          div.className = 'player';
          div.textContent = `${displayName} — 0`;
          container.appendChild(div);
        });
      }

      document.addEventListener('DOMContentLoaded', loadPlayers);
    