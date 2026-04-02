export const credentials = {
    accessToken: null,
    refreshToken: null
} as {
    accessToken: string | null,
    refreshToken: string | null
};

export async function retrieveTokens(code: string): Promise<void> {
    const accessTokenURI = new URL(`https://accounts.spotify.com/api/token`);
    const accessTokenResponse = await fetch(accessTokenURI, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ` + btoa(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET)
        },
        body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.REDIRECT_URI as string
        })
    });

    if (!accessTokenResponse.ok) {
        console.log(await accessTokenResponse.text());
        throw new Error("Failed to retrieve Spotify API access token");
    }

    const { access_token, refresh_token } = await accessTokenResponse.json();
    credentials.accessToken = access_token;
    credentials.refreshToken = refresh_token;
}

export async function refreshToken() {
    if (!credentials.refreshToken) throw new Error("refresh_token is missing");

    const refreshResponse = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: credentials.refreshToken
        })
    });

    if (!refreshResponse.ok) throw new Error(`failed to retrieve a refresh token`);

    const { access_token } = await refreshResponse.json();
    credentials.accessToken = access_token;
}

export async function getCurrentSong() {
    if (!credentials.accessToken) throw new Error("access_token is missing");

    const songResponse = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${credentials.accessToken}` }
    });
    console.log(songResponse)
    if (songResponse.status === 204) return null;
    return await songResponse.json();
}