// game.js
// Craps rules + leaderboard + bootstrapping

import {
    persistCashToUser, readStoredScore, writeStoredScore,
    loadBoard, saveBoard, getCurrentUser
} from './data.js';
import { bindUI } from './dice_ui.js';

// ---- Craps rules ----
const isNatural = (sum) => sum === 7 || sum === 11;
const isCraps = (sum) => sum === 2 || sum === 3 || sum === 12;

class CrapsGame {
    constructor({ initialCash = 100, bet = 50 } = {}) {
        this.cash = initialCash;
        this.bet = bet;
        this.point = null;     // null => come-out roll
        this.wins = 0;
        this.losses = 0;

        const s = readStoredScore();
        this.score = Number.isFinite(s) ? s : 0;

        this.gameOver = this.cash <= 0;
    }

    bumpScore(by = 5) {
        const next = (Number(this.score) || 0) + by;
        writeStoredScore(next);
        this.score = next;
        return this.score;
    }

    applyRoll(sum) {
        if (this.gameOver) return { kind: 'error', message: 'No cash left. Game over.' };

        // Come-out
        if (this.point === null) {
            if (isNatural(sum)) {
                this.wins++; this.cash += this.bet; persistCashToUser(this.cash);
                this.bumpScore(5);
                const info = { kind: 'resolve', phase: 'come-out', outcome: 'win', reason: 'Natural (7 or 11).' };
                this._reset(); this._checkBankrupt(); return info;
            }
            if (isCraps(sum)) {
                this.losses++; this.cash -= this.bet; persistCashToUser(this.cash);
                const info = { kind: 'resolve', phase: 'come-out', outcome: 'loss', reason: 'Craps (2, 3, or 12).' };
                this._reset(); this._checkBankrupt(); return info;
            }
            this.point = sum;
            return { kind: 'continue', phase: 'point', point: this.point, message: `Point is ${this.point}. Roll again.` };
        }

        // Point phase
        if (sum === 7) {
            const p = this.point;
            this.losses++; this.cash -= this.bet; persistCashToUser(this.cash);
            const info = { kind: 'resolve', phase: 'point', outcome: 'loss', reason: `Seven-out before making ${p}.`, point: p };
            this._reset(); this._checkBankrupt(); return info;
        }

        if (sum === this.point) {
            const p = this.point;
            this.wins++; this.cash += this.bet; persistCashToUser(this.cash);
            this.bumpScore(5);
            const info = { kind: 'resolve', phase: 'point', outcome: 'win', reason: `Made the point ${p}!`, point: p };
            this._reset(); this._checkBankrupt(); return info;
        }

        return { kind: 'continue', phase: 'point', point: this.point, message: `Still aiming for ${this.point}.` };
    }

    _reset() { this.point = null; }
    _checkBankrupt() { if (this.cash <= 0) this.gameOver = true; }
}

// ---- Leaderboard + exit ----
function setupExitButton(game, exitBtnId = 'exitBtn') {
    const btn = document.getElementById(exitBtnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
        const me = getCurrentUser();
        const displayName =
            (me && (me.username || [me.firstName, me.lastName].filter(Boolean).join(' '))) || 'Guest';
        const nameNorm = (displayName || '').replace(/\s+/g, ' ').trim();

        const board = loadBoard();
        const idx = board.findIndex(r =>
            String(r.username || '').replace(/\s+/g, ' ').trim().toLowerCase() === nameNorm.toLowerCase()
        );

        const currentScore = Number.isFinite(+game.score) ? +game.score : 0;

        if (idx === -1) board.push({ username: nameNorm, score: currentScore });
        else board[idx].score = Math.max(Number(board[idx].score || 0), currentScore);

        saveBoard(board);
        window.location.href = '../Index/index.html';
    });
}

function greet() {
    const helloEl = document.getElementById('helloUser');
    if (!helloEl) return;
    const me = getCurrentUser();
    if (me) {
        const name = me.firstName ? (me.firstName + (me.lastName ? ' ' + me.lastName : '')) : me.username;
        helloEl.textContent = 'Logged in as ' + name;
    } else {
        helloEl.textContent = 'Not logged in.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new CrapsGame({ initialCash: 100, bet: 50 });
    bindUI(game);
    setupExitButton(game, 'exitBtn');
    greet();
});
