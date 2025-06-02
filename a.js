const client_id = '5db2bd0986654ef98bff31892d4f818f';
const redirect_uri = 'https://near029.github.io/Shitaktien/bwo.html';
const scope = 'playlist-read-private playlist-read-collaborative';

const authUrl =
  'https://accounts.spotify.com/authorize' +
  '?response_type=token' +
  '&client_id=' + encodeURIComponent(client_id) +
  '&scope=' + encodeURIComponent(scope) +
  '&redirect_uri=' + encodeURIComponent(redirect_uri);

window.location = authUrl;
