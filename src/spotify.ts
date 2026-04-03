import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "./redis.ts";

const AUTH = btoa(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET);

export async function retrieveTokens(code: string): Promise<void> {
    const accessTokenURI = new URL(`https://accounts.spotify.com/api/token`);
    const accessTokenResponse = await fetch(accessTokenURI, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${AUTH}`
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
    await setAccessToken(access_token);
    await setRefreshToken(refresh_token);
}

export async function refreshToken() {
    const token = await getRefreshToken();
    if (!token) throw new Error("refresh_token is missing");

    const refreshResponse = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${AUTH}`
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token
        })
    });

    console.log(refreshResponse.status);
    if (!refreshResponse.ok) throw new Error(`failed to retrieve a refresh token`);

    const { access_token } = await refreshResponse.json();
    await setAccessToken(access_token);
}

export async function getCurrentSong() {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("access_token is missing");

    const songResponse = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (songResponse.status === 204) return null;
    return await songResponse.json();
}