let score = 0;
let gameInterval;
let snake;
let food;
let direction;
const canvasSize = 600;
const tileSize = 20;

document.addEventListener('keyup', changeDirection);

function startGame() {
    document.querySelector('.landingPage').style.display = 'none';
    document.querySelector('.StartedGame').style.display = '';

    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    resetGame();
    startGameLoop(context);
}

function resetGame() {
    score = 0;
    updateScore(); //updates the score on the canvas 
    direction = 'right';
    snake = [{ x: tileSize * 5, y: tileSize * 5 }];
    food = { x: tileSize * 5, y: tileSize * 5 };
    placeFood();
    
}
function startGameLoop(context) {
    gameInterval = setInterval(() => {
        updateGame(context);
    }, 150)
}
function updateGame(context) {
    moveSnake();
    if(checkCollision()){
        stopGame(context);
    }else{
        if(checkFoodCollision()){
            score++;
            updateScore();
            placeFood();
        }
        clearCanvas(context);
        renderSnake(context);
        renderFood(context);
    }

}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= tileSize;
            break;
        case 'down':
            head.y += tileSize;
            break;
        case 'left':
            head.x -= tileSize;
            break;
        case 'right':
            head.x += tileSize;
            break;

        default:
            break;
    }
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}


function updateScore() {
    document.getElementById('addScore').innerText = score;
}

function changeDirection(event) {
    const key = event.keyCode;
    switch (key) {
        case 37: //left
            if (direction != 'right') direction = 'left';
            break;

        case 38: //up
            if (direction != 'down') direction = 'up';
            break;

        case 39: //right
            if (direction != 'left') direction = 'right';
            break;

        case 40: //down
            if (direction != 'up') direction = 'down';
            break;
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }
    for(let i = 1 ; i<snake.length ; i++){
        if(snake[i].x  === head.x && snake[i].y === head.y){
            return true;
        }
    }
    return false;
}

function checkFoodCollision(){
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}
function placeFood(){
    food.x = Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize;
}

function clearCanvas(context) {
    context.clearRect(0, 0, canvasSize, canvasSize);
}

function renderSnake(context) {
    context.fillStyle = '#00FF00';
    snake.forEach(segment => {
        context.fillRect(segment.x, segment.y, tileSize, tileSize);
    });
}

function renderFood(context) {
    context.fillStyle = '#FF0000';
    drawRoundedRect(context, food.x, food.y, tileSize, tileSize, 12); // Adjust the last parameter to change the radius
    
}

function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.fill();
}


function stopGame(context){
    clearInterval(gameInterval);
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvasSize, canvasSize);
    context.fillStyle = 'white';
    context.font = '50px Poppins';
    context.textAlign = 'center';
    context.fillText('Game Over', canvasSize / 2, canvasSize / 2);
    context.font = '30px Poppins';
    context.fillText('Your score: ' + score, canvasSize / 2, canvasSize / 2 + 50);

}