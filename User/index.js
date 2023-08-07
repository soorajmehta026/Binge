// Initial References
let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
const playlistButton = document.getElementById("playlist-button");
const playlist=document.getElementById("play");
const logoutButton = document.getElementById('logout-button');

let storedMovieTitle;
const params = new URLSearchParams(window.location.search);
const username = localStorage.getItem('name');
console.log(username);

playlist.addEventListener("click",()=>{
 
  console.log(username);
  window.location.href=`createPlaylist.html?username=${username}&movie=${storedMovieTitle}`
})  

logoutButton.addEventListener("click",()=>{
  localStorage.removeItem("name");
  localStorage.removeItem("authToken")
  playlistButton.disabled = true; 
  window.location.href=`index.html`;
})

playlistButton.addEventListener("click",()=>{
  window.location.href=`playlist.html?username=${username}`
})

const reload =()=>{
  const loginButton = document.querySelector('.login-button');
 

    if (username) {
      loginButton.textContent = username;
      playlistButton.disabled = false; 
      logoutButton.disabled= false;
      playlistButton.classList.remove('hidden');
    }
}


let getMovie = async () => {
  let movieName = movieNameRef.value;
  let url = `https://www.omdbapi.com/?t=${movieName}&apikey=414c04de`;
  

  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Please Enter A Movie Name</h3>`;
    return; 
  }
  
  
  try {
    const resp = await fetch(url);
    
    const data = await resp.json();
    console.log(data);
    
    if (data.Response == "True") {
      storedMovieTitle=data.Title;
      result.innerHTML = `
        <div class="info">
          <img src=${data.Poster} class="poster">
          <div>
            <h2>${data.Title}</h2>
            <div class="rating">
              <img src="star.svg">
              <h4>${data.imdbRating}</h4>
            </div>
            <div class="details">
              <span>${data.Rated}</span>
              <span>${data.Year}</span>
              <span>${data.Runtime}</span>
            </div>
            <div class="genre">
              <div>${data.Genre.split(",").join("</div><div>")}</div>
            </div>
            
           

          </div>
        </div>
        <h3>Plot:</h3>
        <p>${data.Plot}</p>
        <h3>Cast:</h3>
        <p>${data.Actors}</p>
       
      `;
      movieNameRef.value="";
    
    }
    
    else {
      result.innerHTML = `<h3 class='msg'>${data.Error}</h3>`;
    }
  } catch (error) {
    result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
  }
};

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);
document.addEventListener('DOMContentLoaded',reload);