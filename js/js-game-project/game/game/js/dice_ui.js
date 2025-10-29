// dice_ui.js
// Dice rendering + animation + page UI binding (no game rules here)

export class DiceUI {
    static setFace(el, value) {
        if (!el) return;
        el.innerHTML = '';
        const positions = {
            1: [5], 2: [1, 9], 3: [1, 5, 9],
            4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9],
            6: [1, 3, 4, 6, 7, 9]
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

    static roll1to6() { return Math.floor(Math.random() * 6) + 1; }

    static animate(d1, d2, onDone, { steps = 8, intervalMs = 70 } = {}) {
        if (!d1 || !d2) return;
        d1.classList.add('rolling');
        d2.classList.add('rolling');

        let count = 0;
        const tick = setInterval(() => {
            DiceUI.setFace(d1, DiceUI.roll1to6());
            DiceUI.setFace(d2, DiceUI.roll1to6());
            count++;
            if (count >= steps) {
                clearInterval(tick);
                d1.classList.remove('rolling');
                d2.classList.remove('rolling');
                const a = DiceUI.roll1to6();
                const b = DiceUI.roll1to6();
                DiceUI.setFace(d1, a);
                DiceUI.setFace(d2, b);
                if (onDone) onDone(a, b);
            }
        }, intervalMs);
    }
}

/**
 * Bind UI elements to a game instance.
 * Expects the `game` to implement: { wins, losses, cash, score, gameOver, applyRoll(sum) }
 */
export function bindUI(game) {
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const scoreEl = document.getElementById('score');
    const resultEl = document.getElementById('resultText');
    const rollBtn = document.getElementById('rollBtn');
    const die1El = document.getElementById('die1');
    const die2El = document.getElementById('die2');

    // cash pill (create if missing)
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

    // initial dice
    if (die1El) DiceUI.setFace(die1El, 1);
    if (die2El) DiceUI.setFace(die2El, 1);

    const renderCounters = () => {
        if (winsEl) winsEl.textContent = String(game.wins);
        if (lossesEl) lossesEl.textContent = String(game.losses);
        if (cashValEl) cashValEl.textContent = String(game.cash);
    };
    const renderResult = (text, good) => {
        if (!resultEl) return;
        resultEl.textContent = text;
        resultEl.className = 'result ' + (good ? 'ok' : 'bad');
    };
    const syncScore = () => { if (scoreEl) scoreEl.textContent = String(game.score); };

    renderCounters();
    syncScore();

    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            if (game.gameOver) {
                renderResult('No cash left. Game over.', false);
                return;
            }

            rollBtn.disabled = true;
            if (resultEl) resultEl.textContent = '';

            DiceUI.animate(die1El, die2El, (a, b) => {
                const sum = a + b;
                const res = game.applyRoll(sum);

                if (res.kind === 'error') {
                    renderResult(res.message, false);
                } else if (res.kind === 'continue') {
                    renderResult(`You rolled ${sum}. ${res.message}`, true);
                } else if (res.kind === 'resolve') {
                    const good = res.outcome === 'win';
                    renderResult(`You rolled ${sum}. ${res.reason}`, good);
                    syncScore();
                    if (game.gameOver) {
                        renderResult(`You rolled ${sum}. ${res.reason} | Cash: $0 — Game Over.`, false);
                    }
                }

                renderCounters();
                rollBtn.disabled = false;
            });
        });
    }
}
