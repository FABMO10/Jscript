// dice_ui.js // file name for context
// Dice rendering + animation + page UI binding (no game rules here) // describes responsibility of this module

export class DiceUI { // export a class that handles dice visuals and animation
    static setFace(el, value) { // static method: draw a die face inside element `el` for number `value` (1–6)
        if (!el) return; // guard: do nothing if no element was passed
        el.innerHTML = ''; // clear previous pips from the die
        const positions = { // mapping of die value to which 3x3 grid cells should contain pips
            1: [5], 2: [1, 9], 3: [1, 5, 9], // indexes into a 3x3 grid for 1–3
            4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], // grid positions for 4–5
            6: [1, 3, 4, 6, 7, 9] // grid positions for 6
        };
        const grid = { // maps cell index to CSS grid-area coordinates (row / column)
            1: '1 / 1', 2: '1 / 2', 3: '1 / 3', // top row
            4: '2 / 1', 5: '2 / 2', 6: '2 / 3', // middle row
            7: '3 / 1', 8: '3 / 2', 9: '3 / 3'  // bottom row
        };
        const spots = positions[value] || []; // pick the list of cells for this die value (or empty if invalid)
        for (let i = 0; i < spots.length; i++) { // loop through each target cell
            const pip = document.createElement('div'); // create a div to represent a pip (dot)
            pip.className = 'pip'; // set class for styling (size, shape, color)
            pip.style.gridArea = grid[spots[i]]; // position pip within 3x3 CSS grid
            el.appendChild(pip); // add pip to the die element
        }
    }

    static roll1to6() { return Math.floor(Math.random() * 6) + 1; } // utility: random integer 1–6 inclusive

    static animate(d1, d2, onDone, { steps = 8, intervalMs = 70 } = {}) { // animate two dice, then call onDone with final values; configurable steps/speed
        if (!d1 || !d2) return; // guard: need both dice elements to animate
        d1.classList.add('rolling'); // add rolling class to die 1 for CSS animation cues
        d2.classList.add('rolling'); // add rolling class to die 2 for CSS animation cues

        let count = 0; // frame counter for the animation
        const tick = setInterval(() => { // set up a timer that updates faces repeatedly
            DiceUI.setFace(d1, DiceUI.roll1to6()); // show a random face on die 1 each tick
            DiceUI.setFace(d2, DiceUI.roll1to6()); // show a random face on die 2 each tick
            count++; // increment frame count
            if (count >= steps) { // if we've reached the desired number of frames
                clearInterval(tick); // stop the interval timer
                d1.classList.remove('rolling'); // remove rolling class from die 1
                d2.classList.remove('rolling'); // remove rolling class from die 2
                const a = DiceUI.roll1to6(); // choose final value for die 1
                const b = DiceUI.roll1to6(); // choose final value for die 2
                DiceUI.setFace(d1, a); // render final face for die 1
                DiceUI.setFace(d2, b); // render final face for die 2
                if (onDone) onDone(a, b); // if callback provided, report final results
            }
        }, intervalMs); // delay (ms) between frames
    }
}

/**
 * Bind UI elements to a game instance.
 * Expects the `game` to implement: { wins, losses, cash, score, gameOver, applyRoll(sum) }
 */
export function bindUI(game) { // wire up DOM controls and counters to a provided game API
    const winsEl = document.getElementById('wins'); // span/div showing number of wins
    const lossesEl = document.getElementById('losses'); // span/div showing number of losses
    const scoreEl = document.getElementById('score'); // span/div showing current score
    const resultEl = document.getElementById('resultText'); // element to display textual outcomes
    const rollBtn = document.getElementById('rollBtn'); // button that triggers a roll
    const die1El = document.getElementById('die1'); // container element for die 1 pips
    const die2El = document.getElementById('die2'); // container element for die 2 pips

    // cash pill (create if missing)
    let cashPill = document.getElementById('cashPill'); // look for an existing cash display pill
    if (!cashPill) { // if not present, build one dynamically
        const statsBar = document.querySelector('.stats'); // find stats bar container
        if (statsBar) { // only proceed if the container exists
            cashPill = document.createElement('span'); // create a span to hold the cash UI
            cashPill.id = 'cashPill'; // set an ID for future lookups
            cashPill.className = 'pill'; // apply styling class
            cashPill.innerHTML = 'Cash: $<b id="cashVal">100</b>'; // initial markup with bold value holder
            statsBar.appendChild(cashPill); // attach the pill to the stats bar
        }
    }
    const cashValEl = document.getElementById('cashVal'); // reference to the numeric cash value element

    // initial dice
    if (die1El) DiceUI.setFace(die1El, 1); // render starting face (1) on die 1 if present
    if (die2El) DiceUI.setFace(die2El, 1); // render starting face (1) on die 2 if present

    const renderCounters = () => { // helper: sync wins/losses/cash to the UI
        if (winsEl) winsEl.textContent = String(game.wins); // show total wins
        if (lossesEl) lossesEl.textContent = String(game.losses); // show total losses
        if (cashValEl) cashValEl.textContent = String(game.cash); // show current cash
    };
    const renderResult = (text, good) => { // helper: show result text with success/failure style
        if (!resultEl) return; // if no result area, skip
        resultEl.textContent = text; // update message
        resultEl.className = 'result ' + (good ? 'ok' : 'bad'); // set CSS class based on outcome
    };
    const syncScore = () => { if (scoreEl) scoreEl.textContent = String(game.score); }; // helper: update score display

    renderCounters(); // initial paint of counters
    syncScore(); // initial paint of score

    if (rollBtn) { // only bind if the roll button exists
        rollBtn.addEventListener('click', () => { // on click, perform a roll sequence
            if (game.gameOver) { // if the game has ended (no cash etc.)
                renderResult('No cash left. Game over.', false); // show game-over message
                return; // stop handling click
            }

            rollBtn.disabled = true; // prevent repeated clicks during animation
            if (resultEl) resultEl.textContent = ''; // clear previous result text

            DiceUI.animate(die1El, die2El, (a, b) => { // animate dice, then handle final values in callback
                const sum = a + b; // compute total of two dice
                const res = game.applyRoll(sum); // ask game logic to process the roll

                if (res.kind === 'error') { // if game returned an error
                    renderResult(res.message, false); // display error as a bad result
                } else if (res.kind === 'continue') { // if round continues (e.g., point established)
                    renderResult(`You rolled ${sum}. ${res.message}`, true); // show info message as positive/neutral
                } else if (res.kind === 'resolve') { // if round resolved as win or loss
                    const good = res.outcome === 'win'; // determine if outcome was a win
                    renderResult(`You rolled ${sum}. ${res.reason}`, good); // show resolution message with styling
                    syncScore(); // update score after resolution
                    if (game.gameOver) { // if resolution caused game over (e.g., cash hit 0)
                        renderResult(`You rolled ${sum}. ${res.reason} | Cash: $0 — Game Over.`, false); // show final game-over message
                    }
                }

                renderCounters(); // refresh wins/losses/cash after the roll
                rollBtn.disabled = false; // re-enable button for next roll
            }); // end animate callback
        }); // end click handler
    } // end if(rollBtn)
} // end bindUI
