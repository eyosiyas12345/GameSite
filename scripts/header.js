
//header section
fetch('/components/header.html')
.then(response =>{
 if(!response.ok){
  throw new Error ("Header file is not found");
 }
  return response.text()
} ).then(data => {
    document.getElementById("header").innerHTML = data;
}).catch(error => console.log('The Error:', error));