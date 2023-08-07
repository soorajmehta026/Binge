 
const playlistContainer = document.getElementById('playlistContainer');
const header= document.getElementById('playlistName');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const playlistName = decodeURIComponent(urlParams.get('playlist'));
const username=decodeURIComponent(urlParams.get('username'));
const authToken = localStorage.getItem('authToken');

header.innerHTML=`Movies of playlist ${playlistName}`
const url=`https://binge-gamma.vercel.app`;
fetch(`${url}/playlist/${playlistName}`,{
    method: 'GET',
    headers: {
      'authorization': `Bearer ${authToken}`
    },
})
    .then(response => response.json())
    .then(data => {
        data.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const moviePoster = document.createElement('img');
            moviePoster.classList.add('movie-poster');
            moviePoster.src = movie.poster; 
            moviePoster.alt = movie.name;

            const movieTitle = document.createElement('div');
            movieTitle.classList.add('movie-title');
            movieTitle.textContent = movie.name;

            movieCard.appendChild(moviePoster);
            movieCard.appendChild(movieTitle);

            playlistContainer.appendChild(movieCard);
        });
    })
    .catch(error => {
        console.error('Error fetching movies:', error);
    });
