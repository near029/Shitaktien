// Hilfsfunktionen wie bisher: generateCodeVerifier, generateCodeChallenge

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem('pkce_verifier', verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: window.location.origin + window.location.pathname,
    scope: 'user-top-read user-read-private',
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem('pkce_verifier');
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: window.location.origin + window.location.pathname,
    client_id: clientId,
    code_verifier: verifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  if (!res.ok) throw new Error(`Token-Request failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}
(async () => {
  const clientId = '5db2bd0986654ef98bff31892d4f818f'; // hier eintragen
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    const accessToken = await getAccessToken(clientId, code);
    console.log('Access Token:', accessToken);
    fetchTopArtists(accessToken);
  }
})();
async function fetchTopArtists(token) {
  const res = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('API‑Request failed: ' + res.status);
  const data = await res.json();

  console.log('Deine Top-Künstler:', data.items.map(a => a.name));
}
