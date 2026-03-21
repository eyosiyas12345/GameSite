import {gameCards} from './data.js';

//variables
const textToWrite = "Games";
const targetElement = document.querySelector("#text-type");
const typingSpeed = 500;
let index = 0;

function typeWriter(){
   if(index < textToWrite.length){
     targetElement.innerHTML += textToWrite.charAt(index);    
    index ++;
   }
   setInterval(typeWriter, typingSpeed);
}
typeWriter();
//
function render (data){
 console.log("to render a page");
 let container = document.querySelector(".cards-container");
 data.forEach((item)=>{
  const card = `
<div class="card">
<div class="card-flipper">

    <div class="card-front">
        <img class="img" src="${item.thumbnail}" alt="${item.title}">
    </div>

    <div class="card-back">
    <a href="${item.link}">
        <span> Play ${item.title}</span>
    </a>
    </div>
   
</div>
</div>
      `;
  container.innerHTML += card;
 });
 
}

    //   <div class="title-container">
    //       ${item.title}
    //   </div>
//  <a href="${item.link}"></a>
render(gameCards);

// active page link accessing 
document.addEventListener('DOMContentLoaded' ,() =>{
   const currentPathName = window.location.pathname.split('/').pop()|| 'index.html';
   const navLinks = document.querySelectorAll("header a");
   navLinks.forEach(link => {
    const linkPathName = link.getAttribute('href').split('/').pop();

    if(linkPathName === currentPathName ){
        link.classList.add('active');
        
    }
   });
});
