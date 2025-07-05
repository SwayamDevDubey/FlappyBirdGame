let canvas, ctx;
let bird;
let pipes = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let gravity = 0.6;
let flapStrength = -10;
let gameSpeed = 3;

// Game setup
function setup() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resetGame();
    document.addEventListener('touchstart', flap);
    document.addEventListener('mousedown', flap);
}

// Game reset
function resetGame() {
    bird = {
        x: 50,
        y: canvas.height / 2,
        size: 20,
        dy: 0
    };
    pipes = [];
    score = 0;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

// Game loop
function gameLoop() {
    clearCanvas();
    moveBird();
    drawBird();
    handlePipes();
    checkCollision();
    updateScore();
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Bird movement
function moveBird() {
    bird.dy += gravity;
    bird.y += bird.dy;
}

// Draw bird
function drawBird() {
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
}

// Flap
function flap() {
    bird.dy = flapStrength;
}

// Pipe handling
function handlePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width / 2) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= gameSpeed;

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
        }

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Create new pipe
function createPipe() {
    const gap = 120;
    const top = Math.random() * (canvas.height / 2);
    pipes.push({
        x: canvas.width,
        top: top,
        bottom: canvas.height - top - gap,
        width: 40,
        passed: false
    });
}

// Check for collision
function checkCollision() {
    if (bird.y + bird.size > canvas.height || bird.y < 0) {
        endGame();
    }

    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.size > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.size > canvas.height - pipe.bottom)) {
            endGame();
        }
    });
}

// End game
function endGame() {
    clearInterval(gameInterval);
    document.removeEventListener('touchstart', flap);
    document.removeEventListener('mousedown', flap);

    highScore = Math.max(score, highScore);
    localStorage.setItem('highScore', highScore);

    document.getElementById('score').textContent = score;
    document.getElementById('finalScore').textContent = 'Score: ' + score;
    document.getElementById('highScore').textContent = 'High Score: ' + highScore;

    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Start game
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    setup();
}

// Restart game
function restartGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    setup();
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Go to start screen
function goToStart() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}
