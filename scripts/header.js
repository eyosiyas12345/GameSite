
//Add a header to all sections.
fetch('/components/header.html').then(response =>{
 if(!response.ok)  throw new Error ("Header file is not found");
  return response.text();
} ).then(headerString => {
    const headerContainer = document.getElementById("header");
    headerContainer.innerHTML = headerString;

    // active page link accessing & showing current page
    const navLinks = headerContainer.querySelectorAll('.nav-link');
    const currentPathName = window.location.pathname.split('/').pop();
    if(!currentPathName) currentPathName = 'index.html';
    console.log("succeed");
    console.log(navLinks);
    console.log(currentPathName);
    
    navLinks.forEach(link =>{
        const linkPathName = link.getAttribute('href').split('/').pop(); //snake.html
        console.log(linkPathName);
        if(linkPathName === currentPathName){
            link.classList.add('active');
            console.log("succeed");
        }
    });
    // humburger
    const humberger = document.getElementById("humberger");
    const navLinksContainer = document.querySelector(".nav-links");
    
    if(humberger && navLinksContainer){
        humberger.addEventListener("click",()=>{
            humberger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }
}).catch(error => console.log('The Error:', error));
