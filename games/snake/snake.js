// selection
const body = document.querySelector("body");
const canva = document.getElementById('canva');
const ctx = canva.getContext('2d');
const score = document.querySelector("#score");
const resetBtn = document.querySelector("#resetBtn")
const scale = 20;
const snakeColor = 'lightgreen';
const foodColor = 'red';
let maxWidth = Math.min((window.innerWidth || 400) * 0.9, 400);
let canvaWidth = Math.floor(maxWidth / scale) * scale;
let canvaHeight = canvaWidth; // square canvas
canva.width = canvaWidth;
canva.height = canvaHeight;
canva.style.width = canvaWidth + 'px';
canva.style.height = canvaHeight + 'px';
const canvaRow = canvaWidth / scale;
const canvaColumn = canvaHeight / scale;
let gameOver = false;

// css Styles
body.style.backgroundImage = 'url("bg.jpg")';
body.style.textAlign = 'center';
body.height = '100vh';
body.style.maxWidth = '100%';
canva.style.maxWidth = '100%';
canva.style.maxHeight = '100%';
canva.style.backgroundColor = 'black';

score.style.fontSize = '30px';
resetBtn.style.padding = '10px 20px';
resetBtn.style.cursor = 'pointer';


// Program
let snake = [{
  x: Math.floor(Math.random()*canvaRow)*scale,
  y: Math.floor(Math.random()*canvaColumn)*scale
}];

let food = {
  x: Math.floor(Math.random()*canvaRow)*scale,
  y: Math.floor(Math.random()*canvaColumn)*scale
};

let d ='right';
let playGame = setInterval(drawSnake, 200);
body.addEventListener("keydown", changeDirection);

// functions
function drawSnake(){
  ctx.clearRect(0,0,canvaWidth,canvaHeight);
for (let i = 0; i<snake.length; i++){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = 'red';
    ctx.fillRect(snake[i].x,snake[i].y, scale, scale);
    ctx.strokeRect(snake[i].x,snake[i].y, scale, scale);


    if(snake[i].x >canvaWidth) snake[i].x = 0;
    else if(snake[i].x < 0) snake[i].x = canvaWidth;
    else if(snake[i].y >canvaHeight) snake[i].y = 0;
    else if(snake[i].y < 0) snake[0].y = canvaHeight;

}

    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, scale, scale);

let snakeX = snake[0].x;
let snakeY = snake[0].y;

    if (d == 'right')  snakeX +=scale;
    if (d == 'left') snakeX -=scale;
    if (d == 'down')  snakeY +=scale;
    if (d == 'up') snakeY -=scale;

  let newHead = {
    x: snakeX,
    y: snakeY
  }

  // check collision with body (tail self-eat)
  const collided = snake.some((segment, index) => index > 0 && segment.x === newHead.x && segment.y === newHead.y);
  if (collided) {
    gameOver = true;
    clearInterval(playGame);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvaWidth, canvaHeight);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvaWidth / 2, canvaHeight / 2);
    return;
  }

  snake.pop();
  snake.unshift(newHead);

  if(snake[0].x === food.x && snake[0].y === food.y){
    score.innerHTML = parseInt(score.innerHTML) + 1;
    food.x = Math.floor(Math.random()*canvaRow)*scale;
    food.y = Math.floor(Math.random()*canvaColumn)*scale;
    snake.unshift(newHead);
  }
}

function changeDirection(event){
  if (gameOver) return;
  if(event.key === 'ArrowDown' && d != 'up') d= 'down';
  if(event.key === 'ArrowUp'&& d != 'down') d= 'up';
  if(event.key === 'ArrowLeft' && d!='right') d= 'left';
  if(event.key === 'ArrowRight' && d!='left') d= 'right';
}



resetBtn.addEventListener("click", function(){
  score.innerHTML = 0;
  snake = [{
    x: Math.floor(Math.random()*canvaRow)*scale,
    y: Math.floor(Math.random()*canvaColumn)*scale
  }]
});

// mobile play js
const controls = document.querySelectorAll('.ctrl-btn');
controls.forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up' && d !== 'down') d = 'up';
    if (dir === 'down' && d !== 'up') d = 'down';
    if (dir === 'left' && d !== 'right') d = 'left';
    if (dir === 'right' && d !== 'left') d = 'right';
  });
});