const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Array of retro arcade background colors
const retroColors = [
    '#0D0D0D', // Deep Space Black
    '#2A0A47', // Neon Purple
    '#1A252F', // Midnight Blue
    '#1C4B27', // Retro Green
    // '#C71585', // Vivid Magenta
    '#8B0000', // Arcade Red
    // '#0A6F6A', // Cyber Teal
    '#3C3C3C'  // Pixel Gray
];

// Store the background colour
let backgroundColor = null;

// Function to pick a random colour and apply it to the canvas
function setBackground() {
    // Pick a random colour from the array.
   backgroundColor = retroColors[Math.floor(Math.random() * retroColors.length)];

    // Apply to the canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Load images
const princessImage = new Image();
princessImage.src = '/assets/princess.png';
const tieImage = new Image();
tieImage.src = '/assets/tie.png';

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height - 75,
    width: 75,
    height: 75,
    speed: 5,
    dx: 0
};

// Ball (tie) properties
const ball = {
    x: Math.random() * (canvas.width - 50), // Ensure tie stays inside within canvas
    y: 0,
    width: 50,
    height: 50,
    speed: 3
};

// Game variables
let score = 0;
let level = 1;
let gameOver = false;
let isPaused = false;

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === ' ') {
        e.preventDefault(); // Prevent spacebar from scrolling page
        isPaused = !isPaused; // Toggle pause state
        if (!isPaused) {
            gameLoop(); // Resume game loop when unpausing
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Restart game
restartButton.addEventListener('click', () => {
    score = 0;
    gameOver = false;
    isPaused = false;
    player.x = canvas.width / 2;
    player.y = canvas.height - 75;
    player.dx = 0;
    ball.x = Math.random() * (canvas.width - ball.width);
    ball.y = 0;
    ball.speed = 3;
    player.speed = 5;
    gameLoop(); // Restart the loop
});

// Update player position
function updatePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Update ball position
function updateBall() {
    ball.y += ball.speed;
    // TODO: Add "lives" - use first if statement below
    // if (ball.y > canvas.height) {
    //     ball.x = Math.random() * (canvas.width - ball.width);
    //     ball.y = 0;
    // }
    // Collision detection (using ball's center)
    const ballCenterX = ball.x + ball.width / 2;
    const ballCenterY = ball.y + ball.height / 2;
    if (
        ballCenterX > player.x &&
        ballCenterX < player.x + player.width &&
        ballCenterY > player.y &&
        ballCenterY < player.y + player.height
    ) {
        score += 10;
        ball.x = Math.random() * (canvas.width - ball.width);
        ball.y = 0;
        if (score % 100 === 0) {
            level++;
            ball.speed += 0.2;
            player.speed += 0.2;
            setBackground();
        }
    }

    // Game over condition
    if (ball.y + ball.height > canvas.height + 50) {
        gameOver = true;
    }
}

// Draw game elements
function draw() {    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw background
    if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    // Draw player
    if (princessImage.complete) {
        ctx.drawImage(princessImage, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw ball
    if (tieImage.complete) {
        ctx.drawImage(tieImage, ball.x, ball.y, ball.width, ball.height);
    } else {
        ctx.beginPath();
        ctx.arc(ball.x + 25, ball.y + 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 14, 55);

    // Draw pause state
    if (isPaused && !gameOver) {
        ctx.font = '40px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Paused', canvas.width / 2 - 60, canvas.height / 2);
    }

    // Draw game over
    if (gameOver) {
        ctx.font = '40px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 115, canvas.height / 2 + 50);
    }
}

// Game loop
function gameLoop() {
    if (!gameOver && !isPaused) {
        updatePlayer();
        updateBall();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        draw();
    }
}

// Start game only after images are loaded
let imagesLoaded = 0;
const totalImages = 2;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        setBackground();
        gameLoop();
    }
}

princessImage.onload = checkImagesLoaded;
tieImage.onload = checkImagesLoaded;
princessImage.onerror = () => {
    console.error('Failed to load princess image');
    checkImagesLoaded();
};
tieImage.onerror = () => {
    console.error('Failed to load tie image');
    checkImagesLoaded();
};