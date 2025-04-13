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

// Dynamic canvas sizing
function resizeCanvas() {
    // Use 80% of smaller viewport dimension
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.width = size;
    canvas.height = size;
    // Ensure pixel-perfect rendering
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    // Redraw background after resize
    setBackground();
}

// Initial resize and listen for window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


// Load images
const princessImage = new Image();
princessImage.src = '/assets/princess.png';
const tieImage = new Image();
tieImage.src = '/assets/tie.png';

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height - (canvas.height * 0.125),
    width: canvas.width * 0.125,
    height: canvas.height * 0.125,
    speed: canvas.width * 0.00833,
    dx: 0
};

// Ball (tie) properties
const ball = {
    x: Math.random() * (canvas.width - (canvas.width * 0.0833)), // Ensure tie stays inside within canvas
    y: 0,
    width: canvas.width * 0.0833,
    height: canvas.height * 0.0833,
    speed: canvas.width * 0.005
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
    player.y = canvas.height - (canvas.height * 0.125);
    player.dx = 0;
    ball.x = Math.random() * (canvas.width - ball.width);
    ball.y = 0;
    ball.speed = canvas.width * 0.005;
    player.speed = canvas.width * 0.00833;
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
            ball.speed += canvas.width * 0.00033;
            player.speed += canvas.width * 0.00033;
            setBackground();
        }
    }

    // Game over condition
    if (ball.y + ball.height > canvas.height + (canvas.height * 0.0167)) {
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
    ctx.font = `${canvas.width * 0.033}px Arial`;
    ctx.fillStyle = 'green';
    ctx.fillText(`Score: ${score}`, canvas.width * 0.0167, canvas.height * 0.05);
    ctx.fillText(`Level: ${level}`,  canvas.width * 0.0167, canvas.height * 0.1);

    // Draw pause state
    if (isPaused && !gameOver) {
        ctx.font = `${canvas.width * 0.0667}px Arial`;
        ctx.fillStyle = 'red';
        ctx.fillText('Paused', canvas.width / 2 - (canvas.width * 0.1), canvas.height / 2);
    }

    // Draw game over
    if (gameOver) {
        ctx.font = `${canvas.width * 0.0667}px Arial`;
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - (canvas.width * 0.1667), canvas.height / 2);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - (canvas.width * 0.1917), canvas.height / 2 + (canvas.height * 0.0833));
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