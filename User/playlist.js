
const toggleElements = document.querySelectorAll('.toggle');
const contentElements = document.querySelectorAll('.content');


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username=decodeURIComponent(urlParams.get('username'));
const authToken = localStorage.getItem('authToken');
const url=`https://binge-chi.vercel.app`;
const url1="http://localhost:5000";
fetch(`${url}/public/playlists`,{
    method: 'GET',
    headers: {
      'authorization': `Bearer ${authToken}`
    },
})
    .then(response => response.json())
    .then(data => {
        const publicContentDiv = document.querySelector('.content.public');
        
        data.forEach(playlist => {

            const playlistLink = document.createElement('a');
            playlistLink.href = `movie.html?username=${username}&playlist=${playlist.name}`; 
            playlistLink.textContent = playlist.name;
            playlistLink.style.display = 'block';
            playlistLink.style.borderBottom = '1px solid black'; 
            playlistLink.style.textDecoration='none';
            playlistLink.style.fontSize='20px';
            playlistLink.style.color='white';
            playlistLink.style.padding='5px'



            playlistLink.addEventListener('mouseover', () => {
                playlistLink.style.backgroundColor = 'gold';
                playlistLink.style.color = 'black';
            });
            
            playlistLink.addEventListener('mouseout', () => {
                playlistLink.style.backgroundColor = 'transparent';
                playlistLink.style.color = 'white';
            });


            
            publicContentDiv.appendChild(playlistLink);
        });
    })
    .catch(error => {
        console.error('Error fetching public playlists:', error);
    });


fetch(`${url}/playlists/${username}`, {
    method: 'GET',
    headers: {
        'authorization': `Bearer ${authToken}`
    }
})
    .then(response => response.json())
    .then(data => {
        const privateContentDiv = document.querySelector('.content.private');
        
        data.forEach(playlist => {
            const playlistLink = document.createElement('a');
            playlistLink.href = `movie.html?username=${data.username}&playlist=${playlist.name}`; 
            playlistLink.textContent = playlist.name;
            playlistLink.style.display = 'block';
            playlistLink.style.borderBottom = '1px solid #000'; 
            playlistLink.style.textDecoration='none';
            playlistLink.style.fontSize='20px';
            playlistLink.style.color='white'
            playlistLink.style.padding='5px'

            playlistLink.addEventListener('mouseover', () => {
                playlistLink.style.backgroundColor = 'gold';
                playlistLink.style.color = 'black';
            });
            
            playlistLink.addEventListener('mouseout', () => {
                playlistLink.style.backgroundColor = 'transparent';
                playlistLink.style.color = 'white';
            });

            privateContentDiv.appendChild(playlistLink);
        });
    })
    .catch(error => {
        console.error('Error fetching private playlists:', error);
    });

    toggleElements.forEach((toggleElement) => {
        toggleElement.addEventListener('click', () => {
            const target = toggleElement.getAttribute('data-target');
    
           
            toggleElements.forEach((element) => {
                element.classList.remove('active');
            });
    
           
            toggleElement.classList.add('active');
    
           
            contentElements.forEach((contentElement) => {
                contentElement.classList.remove('active');
            });
            document.querySelector(`.content.${target}`).classList.add('active');
        });
    });
    document.querySelector('.content.public').classList.add('active');