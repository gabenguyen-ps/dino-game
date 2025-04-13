const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dinoWidth = 50;
const dinoHeight = 50;
let dinoX = 50;
let dinoY = canvas.height - dinoHeight - 10;
let isJumping = false;
let jumpVelocity = 0;
const initialJumpVelocity = 8;
const gravity = 0.3;
let dinoAnimationFrame = 0;

const groundY = canvas.height - 10;
let obstacles = [];

let obstacleSpeed = 2;
let gameDifficulty = 0;
let lastDifficultyIncrease = Date.now();

const difficultyIncreaseInterval = 10000;
const minObstacleGap = 150;
const hitboxPadding = 8;

const dinoFrames = [
    "dino_frame2.png", // Replace with your actual image paths
];

const dinoImage = new Image();
dinoImage.src = dinoFrames[0];

function drawDino() {
    ctx.drawImage(dinoImage, dinoX, dinoY, dinoWidth, dinoHeight);
    dinoAnimationFrame = (dinoAnimationFrame + 1) % dinoFrames.length;
    dinoImage.src = dinoFrames[dinoAnimationFrame];
}

function createObstacle() {
    const obstacleHeight = Math.random() * 20 + 10;
    const obstacleWidth = 20;
    const obstacleX = canvas.width;

    if (obstacles.length > 0) {
        const lastObstacle = obstacles[obstacles.length - 1];
        if (obstacleX - lastObstacle.x < minObstacleGap) {
            return;
        }
    }

    obstacles.push({ x: obstacleX, y: groundY - obstacleHeight, width: obstacleWidth, height: obstacleHeight });
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function moveObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.x -= obstacleSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function checkCollisions() {
    obstacles.forEach((obstacle) => {
        const dinoHitbox = {
            x: dinoX + hitboxPadding,
            y: dinoY + hitboxPadding,
            width: dinoWidth - hitboxPadding * 2,
            height: dinoHeight - hitboxPadding * 2
        };

        if (dinoHitbox.x + dinoHitbox.width > obstacle.x &&
            dinoHitbox.x < obstacle.x + obstacle.width &&
            dinoHitbox.y + dinoHitbox.height > obstacle.y) {
            alert("Game Over!");
            resetGame();
        }
    });
}

function jump() {
    if (isJumping) {
        dinoY -= jumpVelocity;
        jumpVelocity -= gravity;

        if (dinoY >= canvas.height - dinoHeight - 10) {
            dinoY = canvas.height - dinoHeight - 10;
            isJumping = false;
            jumpVelocity = 0;
        }
    }
}

function resetGame() {
    obstacles = [];
    dinoY = canvas.height - dinoHeight - 10;
    jumpVelocity = 0;
    isJumping = false;
    gameDifficulty = 0;
    obstacleSpeed = 2;
}

function increaseDifficulty() {
    const now = Date.now();
    if (now - lastDifficultyIncrease > difficultyIncreaseInterval) {
        gameDifficulty++;
        obstacleSpeed += 0.5;
        lastDifficultyIncrease = now;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDino();
    drawObstacles();
    moveObstacles();
    jump();
    checkCollisions();
    increaseDifficulty();

    if (Math.random() < 0.01) {
        createObstacle();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === " " && !isJumping) {
        isJumping = true;
        jumpVelocity = initialJumpVelocity;
    }
});

gameLoop();

// 🟢 Mobile: Tap anywhere on the screen to jump
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault(); // prevent scrolling
    if (!isJumping) {
        isJumping = true;
        jumpVelocity = initialJumpVelocity;
    }
}, { passive: false });
