function loginWithSpotify() {
  const client_id = '5db2bd0986654ef98bff31892d4f818f';
  const redirect_uri = 'https://near029.github.io/Shitaktien/bwo.html';
  const scope = 'playlist-read-private playlist-read-collaborative';

  const authUrl = 'https://accounts.spotify.com/authorize' +
    '?response_type=token' +
    '&client_id=' + encodeURIComponent(client_id) +
    '&scope=' + encodeURIComponent(scope) +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);

  window.location = authUrl;
}

// Run this only on bwo.html
if (window.location.pathname.endsWith('bwo.html')) {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const access_token = params.get('access_token');

  if (access_token) {
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('playlist-container');
      container.innerHTML = '';
      data.items.forEach(playlist => {
        const div = document.createElement('div');
        div.textContent = `${playlist.name} (by ${playlist.owner.display_name})`;
        container.appendChild(div);
      });
    });
  } else {
    document.getElementById('playlist-container').innerText = 'Access token not found.';
  }
}
