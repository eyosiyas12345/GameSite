//board

let tileSize = 32;
let rows = 16;
let columns = 16;

let board ;
let context;
let boardWidth = tileSize*columns;
let boardHeight = tileSize*rows;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize*(columns/2)-tileSize;
let shipY = tileSize*rows - (2*tileSize);  

let ship={
  x : shipX,
  y : shipY,
  width : shipWidth,
  height: shipHeight
}

let shipImg;
let shipVelocityX = tileSize;


//Aliens
let aliensArray = [];
let alienCount=0    ;
let alienX = tileSize;
let alienY = tileSize;
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienColumns = 3;
let alienRows = 2;

let alienImg;
let alienVelocityX = 1;

//Bullets
let bulletsArray = [];
let bulletVelocityY = -10; //speed of the bullet     negative because the movement is up.

let alienBulletsArray = [];
let alienBulletVelocityY = 0.5; // slower

let score =0;
let gameover =false;

let restartBtn;


window.onload = function (){
  board = document.getElementById("board");
  resizeBoard();
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); //used for drawing on the board;

  // ensure transparent canvas and no border
  board.style.background = "transparent";
  board.style.border = "none";

  restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", resetGame);

  //load the ship
  shipImg = new Image();
  shipImg.src = "./images/ship.png";

  //load the aliens
  alienImg = new Image();
  alienImg.src = "./images/white-alien.png";

  //create aliens
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown",moveShip);
  document.addEventListener("keyup", shoot);

  // touch controls
  document.querySelectorAll('.touch-btn').forEach(btn => {
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      const action = btn.dataset.action;
      if (action === 'left') {
        shipX = Math.max(0, shipX - shipVelocityX);
        ship.x = shipX;
      }
      if (action === 'right') {
        shipX = Math.min(boardWidth - ship.width, shipX + shipVelocityX);
        ship.x = shipX;
      }
      if (action === 'shoot') doShoot();
    });
    btn.addEventListener('click', e => {
      e.preventDefault();
      const action = btn.dataset.action;
      if (action === 'left') {
        shipX = Math.max(0, shipX - shipVelocityX);
        ship.x = shipX;
      }
      if (action === 'right') {
        shipX = Math.min(boardWidth - ship.width, shipX + shipVelocityX);
        ship.x = shipX;
      }
      if (action === 'shoot') doShoot();
    });
  });
};

function update (){
  requestAnimationFrame(update);
if(gameover){
  return;
}
  context.clearRect(0,0,board.width,board.height);
//draw the ship in the canvas/board
  context.drawImage(shipImg,shipX,shipY,shipWidth,shipHeight);

//draw the aliens in the canvas
for(let a=0;a<aliensArray.length;a++){
  let alien = aliensArray[a];

  if(alien.alive===true){
      alien.x +=alienVelocityX;

     if(alien.x + alien.width >=board.width || alien.x <=0){
      alienVelocityX *=-1;
      alien.x += alienVelocityX*2;
      for(let j=0;j<aliensArray.length;j++){
        aliensArray[j].y +=alienHeight;
        if(aliensArray[j].alive === true && aliensArray[j].y === shipY){
          gameover = true;
          context.fillStyle = "red";
          context.font = "bold 48px courier";
          context.fillText("Game Over", boardWidth/4, boardHeight/2);
          restartBtn.style.display = "block";
        }
      }
     }
    context.drawImage(alienImg,alien.x,alien.y,alien.width,alien.height); 
     
    }
}

// Alien shooting
if (Math.random() < 0.005 && aliensArray.length > 0) { // back to original frequency
  let shootingAlien = aliensArray[Math.floor(Math.random() * aliensArray.length)];
  if (shootingAlien && shootingAlien.alive) {
    let alienBullet = {
      x: shootingAlien.x + shootingAlien.width / 2 - tileSize / 32, // center
      y: shootingAlien.y + shootingAlien.height,
      width: tileSize / 4, // bolder
      height: tileSize / 4,
      used: false
    };
    alienBulletsArray.push(alienBullet);
  }
}

// Draw alien bullets
for(let i=0; i<alienBulletsArray.length; i++){
  let bullet = alienBulletsArray[i];
  bullet.y += alienBulletVelocityY;
  context.fillStyle = "white";
  context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

  // check collision with ship
  if (!bullet.used && detectCollision(bullet, ship)) {
    bullet.used = true;
    gameover = true;
    context.fillStyle = "red";
    context.font = "bold 48px courier";
    context.fillText("Game Over", boardWidth/4, boardHeight/2);
    restartBtn.style.display = "block";
    return;
  }

  // remove if off screen or used
  if (bullet.y > boardHeight || bullet.used) {
    alienBulletsArray.splice(i, 1);
    i--;
  }
}

//Draw the   bullets
for(let i=0;i<bulletsArray.length;i++){
  let bullet = bulletsArray[i];
  bullet.y+=bulletVelocityY;
context.fillStyle ="green";
context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

  for(let j=0;j<aliensArray.length;j++){
    let alien = aliensArray[j];
    if(alien.alive && !bullet.used && detectCollision(alien,bullet)){
      bullet.used = true;
      alien.alive = false;
      alienCount--;
      score++;
    }
    }
    //remove used bullet from the bullet array
    while((bulletsArray.length>=0 && (bulletsArray.used)||(bulletsArray.y<0))){
      bulletsArray.shift();
    }   
    if(alienCount==0){
      alienColumns =Math.min(alienColumns+1,columns/2-2);//maximum is (16/2)-2=6
      alienRows = Math.min(alienRows+1,rows-4);//maximum number o rows are 12
      aliensArray = [];
      bulletsArray = [];
      alienBulletsArray = [];
      createAliens();
    }
}
context.fillStyle = "white";
context.font = "16px courier";
context.fillText("Score:",2,20)
context.fillText(score, 60,20);

}

function moveShip(e){
  if(gameover){
    return;
  }
  if(e.code =="ArrowLeft" && shipX-shipVelocityX >=0){
      shipX -= shipVelocityX;
      ship.x = shipX;
  }
  else if(e.code =="ArrowRight" && shipX +shipVelocityX +ship.width <=board.width){
    shipX += shipVelocityX;
    ship.x = shipX;
  }
}

function createAliens(){
  if(gameover){
    return ;
  }
  for(let c = 0 ;c<alienColumns;c++){
    for(let r =0; r<alienRows;r++){
      let alien={
        img: alienImg,
        width: alienWidth,
        height: alienHeight,
        x: alienX + c*alienWidth,
        y: alienY + r*alienHeight,
        alive: true
      }
        aliensArray.push(alien);
        alienCount++;
    }
  }
}

function shoot (e){
  if(gameover){
    return;
  }
  if(e.code=="Space"){
    //shoot
    let bullet ={
      x: shipX + shipWidth / 2,
      y:shipY,
      width: tileSize/4, // bolder
      height:tileSize/2,
      used: false
    }
    bulletsArray.push(bullet);
  }
}
function detectCollision(a,b){
  return a.x<b.x+b.width&&
         a.x+a.width>b.x&&
         a.y<b.y+b.height&&
         a.y+a.height>b.y
}

function resetGame() {
  gameover = false;
  score = 0;
  shipX = tileSize*(columns/2)-tileSize;
  ship.x = shipX;
  aliensArray = [];
  bulletsArray = [];
  alienBulletsArray = [];
  alienCount = 0;
  alienColumns = 3;
  alienRows = 2;
  alienX = tileSize;
  alienY = tileSize;
  createAliens();
  restartBtn.style.display = "none";
  requestAnimationFrame(update);
}


///For Mobile and Tablets
// existing code...

function resizeBoard() {
  const max = Math.min(window.innerWidth * 0.9, 512);
  const size = Math.round(max / tileSize) * tileSize;
  board.style.width = `${size}px`;
  board.style.height = `${size}px`;
}
window.addEventListener('resize', resizeBoard);

// no duplicate window.onload: already handled above with one initialization


function doShoot() {
  if (gameover) return;
  let bullet = {
    x: shipX + shipWidth / 2,
    y: shipY,
    width: tileSize / 4, // bolder
    height: tileSize / 2,
    used: false
  };
  bulletsArray.push(bullet);
}

// replace `shoot` function body with:
function shoot(e) {
  if (gameover) return;
  if (e.code === "Space") doShoot();
}