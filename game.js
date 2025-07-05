// Game variables - matching your Java code exactly
let canvas, ctx;
let boardWidth = 360;
let boardHeight = 640;

// Images
let backgroundImg, birdImg, topPipeImg, bottomPipeImg;

// Bird settings (from your Java code)
let birdX = boardWidth / 8;  // 45
let birdY = boardHeight / 2; // 320
let birdWidth = 34;
let birdHeight = 24;

// Pipe settings (from your Java code)
let pipeX = boardWidth;
let pipeY = 0;
let pipeWidth = 64;
let pipeHeight = 512;

// Game Logic (from your Java code)
let bird;
let velocityX = -4; // moves pipes to the left speed
let velocityY = 0;
let gravity = 1;

let pipes = [];
let gameLoop;
let placePipesTimer;
let gameOver = false;
let score = 0;

// Bird class
class Bird {
    constructor(img) {
        this.x = birdX;
        this.y = birdY;
        this.width = birdWidth;
        this.height = birdHeight;
        this.img = img;
    }
}

// Pipe class
class Pipe {
    constructor(img) {
        this.x = pipeX;
        this.y = pipeY;
        this.width = pipeWidth;
        this.height = pipeHeight;
        this.img = img;
        this.passed = false;
    }
}

// Game setup
function setup() {
    canvas = document.getElementById('gameCanvas');
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    ctx = canvas.getContext('2d');

    // Load images (exact paths as per your Java code)
    backgroundImg = new Image();
    backgroundImg.src = 'flappybirdbg.png';
    birdImg = new Image();
    birdImg.src = 'flappybird.png';
    topPipeImg = new Image();
    topPipeImg.src = 'toppipe.png';
    bottomPipeImg = new Image();
    bottomPipeImg.src = 'bottompipe.png';

    resetGame();
    document.addEventListener('touchstart', flap);
    document.addEventListener('mousedown', flap);

    // Place Pipes Timer
    placePipesTimer = setInterval(placePipes, 1500);

    // Game Loop
    gameLoop = setInterval(gameLogic, 1000 / 60);
}

// Game reset
function resetGame() {
    bird = new Bird(birdImg);
    pipes = [];
    score = 0;
    gameOver = false;
    clearInterval(gameLoop);
    // No need to restart intervals as setup starts them
}

// Game logic
function gameLogic() {
    move();
    draw();
    if (gameOver) {
        clearInterval(gameLoop);
        clearInterval(placePipesTimer);
    }
}

// Move game objects
function move() {
    // Bird
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y, 0);

    // Pipes
    pipes.forEach(pipe => {
        pipe.x += velocityX;

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
            score += 0.5;
        }

        if (collision(bird, pipe)) {
            gameOver = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    if (bird.y > boardHeight) {
        gameOver = true;
    }
}

// Detect collision
function collision(a, b) {
    return a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x && // a's top right corner doesn't reach b's left corner
           a.y < b.y + b.height && // a's top corner doesn't reach b's bottom corner
           a.y + a.height > b.y; // a's bottom corner doesn't reach b's top corner
}

// Place pipes function (matching your Java code)
function placePipes() {
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 3;

    let topPipe = new Pipe(topPipeImg);
    topPipe.y = randomPipeY;
    pipes.push(topPipe);

    let bottomPipe = new Pipe(bottomPipeImg);
    bottomPipe.y = topPipe.y + pipeHeight + openingSpace;
    pipes.push(bottomPipe);
}

// Draw function (matching your Java paintComponent)
function draw() {
    // Background
    ctx.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    // Bird
    ctx.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);

    // Pipes
    pipes.forEach(pipe => {
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    });

// Score
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    if (gameOver) {
        ctx.fillText('Game Over: ' + Math.floor(score), 10, 35);
    } else {
        ctx.fillText(Math.floor(score), 10, 35);
    }
}

// Flap function (matching your keyPressed space)
function flap(event) {
    event.preventDefault();
    velocityY = -9; // Same as your Java code
    
    if (gameOver) {
        // Restart the game by resetting conditions
        bird.y = birdY;
        velocityY = 0;
        pipes = [];
        score = 0;
        gameOver = false;
        placePipesTimer = setInterval(placePipes, 1500);
        gameLoop = setInterval(gameLogic, 1000 / 60);
    }
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

// Go to start screen
function goToStart() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}
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
