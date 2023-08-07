const playlistList = document.getElementById('playlist-list');
const newPlaylistName = document.getElementById('new-playlist-name');
const movieNameInput = document.getElementById('movie-name');
const addButton = document.getElementById('add-button');





const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieName = decodeURIComponent(urlParams.get('movie'));
const username=decodeURIComponent(urlParams.get('username'));
let picture;

const checkbox = document.getElementById('private-checkbox');

const authToken = localStorage.getItem('authToken');

const existing= async ()=>{
  console.log("triggered");
    let url = `http://www.omdbapi.com/?t=${movieName}&apikey=414c04de`;
    const resp = await fetch(url);
    
    const data = await resp.json();
  const object={
       poster:data.Poster,
       title:data.Title
  }
  picture=data.Poster;
  const header=document.getElementById('header');
  header.innerHTML=`Add ${data.Title} to Playlist`
    try{
        const resp=await fetch(`/playlists/${username}`, {
            method: 'GET',
            headers: {
              'authorization': `Bearer ${authToken}`
            },
           
          });
          const playlistNames = await resp.json();
          const data = playlistNames.map(playlist => playlist.name);

     console.log("this is data: ",data)
          data.forEach(playlist => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'playlists';
            checkbox.value = playlist;
            checkbox.id = playlist.replace(/\s+/g, '-'); 
          
            const label = document.createElement('label');
            label.textContent = playlist;
            label.setAttribute('for', checkbox.id);
          
            playlistList.appendChild(checkbox);
            playlistList.appendChild(label);
          });

    }
    catch(err)
    {
            console.log(err);
    }
}


addButton.addEventListener('click', async () => {
  const selectedPlaylists = Array.from(document.querySelectorAll('input[name="playlists"]:checked')).map(checkbox => checkbox.value);
  

  

  if (selectedPlaylists.length === 0 && !newPlaylistName.value) {
    alert('Please select an existing playlist or enter a new playlist name.');
    return;
  }
  else if(selectedPlaylists.length > 0 && newPlaylistName.value)
  {
    alert('Please only select an existing playlist or enter a new playlist name.');
    return;
  }
  else if(selectedPlaylists.length > 1)
  {
    alert('Please select only one playlist.');
    return;

  }

 else if(selectedPlaylists.length === 1)
 {
  try{

  
  const response = await fetch(`/playlist`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        playlist: selectedPlaylists[0],
        username:username,
        movie: movieName,
        poster: picture,
      })
    });
    alert(`Added ${movieName} to ${selectedPlaylists[0]} playlist(s).`);

    window.location.href=`index.html?username=${username}`
  }
  catch(err)
  {
   console.log(err);

  }
 }
 else{
try{
  const response = await fetch('/playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      name:newPlaylistName.value, 
      username:username,
      isPublic:!checkbox.checked,
      movies: [{
        name:movieName,
      poster: picture,
      }
      ]
    })
  });
  alert(`Added ${movieName} to ${newPlaylistName.value} playlist(s).`);
  window.location.href=`index.html?username=${username}`
}
catch(err)
{
console.log(err);
}

 }


});

window.addEventListener("load", existing);