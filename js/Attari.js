let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let dino = { x: 50, y: 150, width: 40, height: 40, vy: 0, jumping: false, vx: 2 };
let obstacles = [];
let score = 0;
let gameOver = false;
let gameSpeed = 4;
let gravity = 0.7;
let obstacleInterval;
let animationFrame;

function setDifficulty(level) {
    if (level === 'easy') gameSpeed = 4;
    else if (level === 'medium') gameSpeed = 7;
    else if (level === 'hard') gameSpeed = 10;
}

function startGame() {
    // Reset game state
    dino.x = 50; // Reset x position
    dino.y = 150;
    dino.vy = 0;
    dino.jumping = false;
    obstacles = [];
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = "Score: 0";
    setDifficulty(document.getElementById('difficulty').value);
    clearInterval(obstacleInterval);
    cancelAnimationFrame(animationFrame);
    obstacleInterval = setInterval(spawnObstacle, 1500 - gameSpeed * 100);
    animationFrame = requestAnimationFrame(gameLoop);
}

function spawnObstacle() {
    let height = 30 + Math.random() * 30;
    obstacles.push({ x: canvas.width, y: 200 - height, width: 20, height: height });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move dino horizontally
    dino.x += dino.vx;
    if (dino.x > canvas.width) dino.x = -dino.width; // Wrap around

    // Draw dino
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Dino jump physics
    if (dino.jumping) {
        dino.vy += gravity;
        dino.y += dino.vy;
        if (dino.y >= 150) {
            dino.y = 150;
            dino.vy = 0;
            dino.jumping = false;
        }
    }

    // Draw and move obstacles
    ctx.fillStyle = "#FF5722";
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Collision detection
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ) {
            endGame();
            return;
        }
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    // Update score
    score++;
    document.getElementById('score').textContent = "Score: " + score;

    if (!gameOver) animationFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameOver = true;
    clearInterval(obstacleInterval);
    cancelAnimationFrame(animationFrame);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !dino.jumping && !gameOver) {
        dino.vy = -12;
        dino.jumping = true;
    }
});
// ...existing code...