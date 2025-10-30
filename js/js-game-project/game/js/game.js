// game.js // file name/context
// Craps rules + leaderboard + bootstrapping // describes module purpose

import {
    persistCashToUser, readStoredScore, writeStoredScore,
    loadBoard, saveBoard, getCurrentUser
} from './data.js'; // import storage helpers from data.js (users, scores, leaderboard)
import { bindUI } from './dice_ui.js'; // import function that wires game state to the DOM

// ---- Craps rules ----
const isNatural = (sum) => sum === 7 || sum === 11; // helper: true if come-out roll wins (7 or 11)
const isCraps = (sum) => sum === 2 || sum === 3 || sum === 12; // helper: true if come-out roll loses (2, 3, 12)

class CrapsGame { // class encapsulating game state and rules
    constructor({ initialCash = 100, bet = 50 } = {}) { // constructor with defaults for cash and bet
        this.cash = initialCash; // player's current cash
        this.bet = bet; // fixed bet amount per resolved roll
        this.point = null;     // null => come-out roll // current point (null means no point set)
        this.wins = 0; // number of wins
        this.losses = 0; // number of losses

        const s = readStoredScore(); // try to read previously stored score from localStorage
        this.score = Number.isFinite(s) ? s : 0; // initialize score to stored value or 0

        this.gameOver = this.cash <= 0; // flag indicating if player is bankrupt
    }

    bumpScore(by = 5) { // increase score by a given amount (default 5)
        const next = (Number(this.score) || 0) + by; // compute next score safely
        writeStoredScore(next); // persist updated score
        this.score = next; // update in-memory score
        return this.score; // return new score
    }

    applyRoll(sum) { // core state machine: apply the result of rolling two dice (sum)
        if (this.gameOver) return { kind: 'error', message: 'No cash left. Game over.' }; // stop if bankrupt

        // Come-out
        if (this.point === null) { // if no point established yet (come-out phase)
            if (isNatural(sum)) { // natural 7 or 11 => immediate win
                this.wins++; this.cash += this.bet; persistCashToUser(this.cash); // tally win, add cash, persist
                this.bumpScore(5); // add to score for win
                const info = { kind: 'resolve', phase: 'come-out', outcome: 'win', reason: 'Natural (7 or 11).' }; // result payload
                this._reset(); this._checkBankrupt(); return info; // reset point, check cash, return resolution
            }
            if (isCraps(sum)) { // craps 2/3/12 => immediate loss
                this.losses++; this.cash -= this.bet; persistCashToUser(this.cash); // tally loss, subtract cash, persist
                const info = { kind: 'resolve', phase: 'come-out', outcome: 'loss', reason: 'Craps (2, 3, or 12).' }; // result payload
                this._reset(); this._checkBankrupt(); return info; // reset and check, then return
            }
            this.point = sum; // otherwise establish point to chase
            return { kind: 'continue', phase: 'point', point: this.point, message: `Point is ${this.point}. Roll again.` }; // inform UI to continue
        }

        // Point phase
        if (sum === 7) { // rolling a 7 before making the point => seven-out (lose)
            const p = this.point; // capture current point for message
            this.losses++; this.cash -= this.bet; persistCashToUser(this.cash); // tally loss and update cash
            const info = { kind: 'resolve', phase: 'point', outcome: 'loss', reason: `Seven-out before making ${p}.`, point: p }; // loss payload
            this._reset(); this._checkBankrupt(); return info; // clear point, check cash, return
        }

        if (sum === this.point) { // hitting the point => win
            const p = this.point; // capture point for message
            this.wins++; this.cash += this.bet; persistCashToUser(this.cash); // tally win and add cash
            this.bumpScore(5); // add to score for win
            const info = { kind: 'resolve', phase: 'point', outcome: 'win', reason: `Made the point ${p}!`, point: p }; // win payload
            this._reset(); this._checkBankrupt(); return info; // clear point, check cash, return
        }

        return { kind: 'continue', phase: 'point', point: this.point, message: `Still aiming for ${this.point}.` }; // any other sum: continue rolling
    }

    _reset() { this.point = null; } // internal: clear point to return to come-out phase
    _checkBankrupt() { if (this.cash <= 0) this.gameOver = true; } // internal: set gameOver if out of cash
}

// ---- Leaderboard + exit ----
function setupExitButton(game, exitBtnId = 'exitBtn') { // wire the "Exit" button to update leaderboard and leave page
    const btn = document.getElementById(exitBtnId); // find exit button by id
    if (!btn) return; // if not present, do nothing

    btn.addEventListener('click', () => { // on clicking exit
        const me = getCurrentUser(); // get current user (may be null)
        const displayName =
            (me && (me.username || [me.firstName, me.lastName].filter(Boolean).join(' '))) || 'Guest'; // prefer username; else "First Last"; else 'Guest'
        const nameNorm = (displayName || '').replace(/\s+/g, ' ').trim(); // normalize whitespace for comparisons

        const board = loadBoard(); // load current leaderboard array
        const idx = board.findIndex(r => // try to find existing record for this user (case-insensitive)
            String(r.username || '').replace(/\s+/g, ' ').trim().toLowerCase() === nameNorm.toLowerCase()
        );

        const currentScore = Number.isFinite(+game.score) ? +game.score : 0; // ensure numeric score

        if (idx === -1) board.push({ username: nameNorm, score: currentScore }); // no record: add new entry
        else board[idx].score = Math.max(Number(board[idx].score || 0), currentScore); // existing: keep best/highest score

        saveBoard(board); // persist updated leaderboard
        window.location.href = './index.html'; // navigate back to home/index page
    }); // end click handler
}

function greet() { // update greeting text based on login status
    const helloEl = document.getElementById('helloUser'); // find greeting element
    if (!helloEl) return; // if not present, bail
    const me = getCurrentUser(); // read current user
    if (me) { // if logged in
        const name = me.firstName ? (me.firstName + (me.lastName ? ' ' + me.lastName : '')) : me.username; // build display name
        helloEl.textContent = 'Logged in as ' + name; // show logged-in message
    } else {
        helloEl.textContent = 'Not logged in.'; // show guest message
    }
}

document.addEventListener('DOMContentLoaded', () => { // when DOM is ready, boot the game
    const game = new CrapsGame({ initialCash: 100, bet: 50 }); // create a new game instance with defaults
    bindUI(game); // bind UI controls and counters to this game
    setupExitButton(game, 'exitBtn'); // hook up the exit button behavior
    greet(); // set greeting text
}); // end DOMContentLoaded handler
