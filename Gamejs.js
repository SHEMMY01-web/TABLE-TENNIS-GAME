// --- 1. Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 75;
const BALL_RADIUS = 8;
const PADDLE_SPEED = 5;

// --- 2. Game Objects ---

// Player 1 (Left Paddle)
let player1 = {
    x: 10,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    dy: 0 // velocity in y direction
};

// Player 2 (Right Paddle)
let player2 = {
    x: WIDTH - 10 - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    dy: 0
};

// Ball
let ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: 4, // Horizontal speed
    dy: 4  // Vertical speed
};

// --- 3. Drawing Functions ---

// Function to draw a rectangle (used for paddles and ball)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Function to draw the middle line and background
function drawCourt() {
    // Clear the canvas
    drawRect(0, 0, WIDTH, HEIGHT, 'black'); 
    
    // Draw the dotted center line
    ctx.strokeStyle = 'lightgrey';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashes are 5px long, separated by 5px
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line style
}

// Function to display the score
function drawScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Player 1: ${player1.score} - Player 2: ${player2.score}`;
    }
}

// --- 4. Game Logic Functions ---

// Resets the ball to the center and reverses its direction
function resetBall(servingPlayer) {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    // Serve the ball towards the player who was scored against
    ball.dx = (servingPlayer === 1 ? -4 : 4); 
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1); // Random up or down angle
}

// Updates the position of the paddles and ball
function update() {
    // 1. Update Paddle Positions
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Keep paddles within court boundaries
    player1.y = Math.max(0, Math.min(player1.y, HEIGHT - player1.height));
    player2.y = Math.max(0, Math.min(player2.y, HEIGHT - player2.height));

    // 2. Update Ball Position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 3. Wall Collision (Top/Bottom)
    if (ball.y + ball.radius > HEIGHT || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy; // Reverse vertical direction
    }

    // 4. Scoring (Left/Right Walls)
    if (ball.x - ball.radius < 0) { // Player 1 missed
        player2.score++;
        resetBall(1); // Player 1 serves
        drawScore();
    } else if (ball.x + ball.radius > WIDTH) { // Player 2 missed
        player1.score++;
        resetBall(2); // Player 2 serves
        drawScore();
    }

    // 5. Paddle Collision
    
    // Check collision with Player 1 (left paddle)
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height &&
        ball.dx < 0) // Ensure ball is moving left
    {
        ball.dx = -ball.dx; // Reverse horizontal direction
    }
    
    // Check collision with Player 2 (right paddle)
    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height &&
        ball.dx > 0) // Ensure ball is moving right
    {
        ball.dx = -ball.dx; // Reverse horizontal direction
    }
}

// --- 5. Game Loop & Initialization ---

// The main rendering function
function draw() {
    drawCourt();
    drawRect(player1.x, player1.y, player1.width, player1.height, 'white');
    drawRect(player2.x, player2.y, player2.width, player2.height, 'white');
    drawBall();
}

// The core game loop runs about 60 times per second
function gameLoop() {
    update();
    draw();
    // This function ensures smooth animation and is the standard for web games
    requestAnimationFrame(gameLoop);
}

// --- 6. Input Handling ---

document.addEventListener('keydown', (e) => {
    // Player 1 controls (W and S keys)
    if (e.key === 'w' || e.key === 'W') {
        player1.dy = -PADDLE_SPEED;
    } else if (e.key === 's' || e.key === 'S') {
        player1.dy = PADDLE_SPEED;
    }

    // Player 2 controls (Up and Down arrows)
    if (e.key === 'ArrowUp') {
        player2.dy = -PADDLE_SPEED;
    } else if (e.key === 'ArrowDown') {
        player2.dy = PADDLE_SPEED;
    }
});

document.addEventListener('keyup', (e) => {
    // Stop paddle movement when keys are released
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        player1.dy = 0;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        player2.dy = 0;
    }
});

// Start the game!
drawScore(); // Initialize score display
gameLoop();