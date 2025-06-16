 const CLIENT_ID = '5db2bd0986654ef98bff31892d4f818f'; // <--- HIER DEINE CLIENT ID EINFÜGEN
    const REDIRECT_URI = window.location.href;
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPES = 'user-top-read';

    function loginWithSpotify() {
      const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
      window.location = authUrl;
    }

    // Wenn ein Token in der URL ist (nach Login)
    window.onload = () => {
      const hash = window.location.hash;
      if (hash) {
        const token = new URLSearchParams(hash.substring(1)).get('access_token');
        fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          const output = document.getElementById('output');
          output.innerHTML = '<h2>Deine Top 5 Künstler:</h2>';
          data.items.forEach((artist, index) => {
            output.innerHTML += `<p>${index + 1}. ${artist.name}</p>`;
          });
        });
      }
    }
