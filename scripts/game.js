import {gameCards} from './data.js';

console.log(gameCards);

function render (data){
 console.log("to render a page");
 let container = document.querySelector(".cards-container");
 data.forEach((item)=>{
  const card = `
  <div class="card">
  
    <div class="img-container">
      <img src="${item.thumbnail}" alt="${item.title}">
    </div>

    <div class="title-container">
    <a href=".././Snake Game/index.html">
        ${item.title}
    </a>
    </div>

  </div>`;
  container.innerHTML += card;
 })
}

render(gameCards);