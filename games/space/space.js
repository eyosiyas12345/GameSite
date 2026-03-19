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

let score =0;
let gameover =false;


window.onload = function (){
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); //used for drawing on the board;

  //draw the ship
  // context.fillStyle = "green";
  // context.fillRect(shipX,shipY,shipWidth,shipHeight);

  //load the ship
  shipImg = new Image();
  shipImg.src = "./Images/ship.png";

  //load the aliens
  alienImg = new Image();
  alienImg.src = "./Images/white-alien.png";
  //create aliens
  createAliens();
  
  shipImg.onload = function (){
    context.drawImage(shipImg,shipX,shipY,shipWidth,shipHeight);
  }

  requestAnimationFrame(update);
  document.addEventListener("keydown",moveShip);
  document.addEventListener("keyup",shoot);
}

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
        if(aliensArray[j].alive ===true && aliensArray[j].y === shipY){
          gameover = true;
          context.style = "red";
          context.font ="bold 48px courier";
          context.fillText("Game Over",boardWidth/4,boardHeight/2);
        }
      }
     }
    context.drawImage(alienImg,alien.x,alien.y,alien.width,alien.height); 
     
    }
}

//Draw the   bullets
for(let i=0;i<bulletsArray.length;i++){
  let bullet = bulletsArray[i];
  bullet.y+=bulletVelocityY;
context.fillStyle ="white";
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
  }
  else if(e.code =="ArrowRight" && shipX +shipVelocityX +ship.width <=board.width){
    shipX += shipVelocityX;
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
      x:shipX+ shipWidth*15/32,
      y:shipY,
      width:tileSize/8,
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