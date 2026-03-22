
//Add a header to all sections.
fetch('/components/header.html').then(response =>{
 if(!response.ok){
  throw new Error ("Header file is not found");
 }
  return response.text()
} ).then(headerString => {
    document.getElementById("header").innerHTML = headerString;

    // active page link accessing 
    let parser = new DOMParser();
    let headerDom = parser.parseFromString(headerString, 'text/html');
    const navLinks = headerDom.querySelectorAll('.nav-link');
    const currentPathName = window.location.pathname.split('/').pop();
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
    })

}).catch(error => console.log('The Error:', error));
