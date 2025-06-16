export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("5db2bd0986654ef98bff31892d4f818f", clientId);  // Korrigierter Parametername
    params.append("response_type", "code");
    params.append("redirect_uri", window.location.origin + window.location.pathname);
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    // Debug-Ausgabe vor Redirect
    console.log("Redirecting to Spotify with params:", params.toString());
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");
    if (!verifier) throw new Error("No verifier found in localStorage");

    const params = new URLSearchParams();
    params.append("5db2bd0986654ef98bff31892d4f818f", clientId);  // Korrigierter Parametername
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", window.location.origin + window.location.pathname);
    params.append("code_verifier", verifier);

    try {
        console.log("Requesting token with params:", params.toString());
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params
        });

        // Verbesserte Fehlerbehandlung
        if (!result.ok) {
            const errorBody = await result.text();
            console.error("Token request failed:", {
                status: result.status,
                statusText: result.statusText,
                body: errorBody
            });
            throw new Error(`Token request failed: ${result.status} ${result.statusText}`);
        }

        const data = await result.json();
        console.log("Token response:", data);
        return data.access_token;
    } catch (error) {
        console.error("Error in getAccessToken:", error);
        throw error;
    }
}

// Helper functions bleiben gleich
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
