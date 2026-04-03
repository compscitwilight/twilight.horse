import "dotenv/config";
import express from "express";
import cors from "cors";
import chalk from "chalk";
import { credentials, getCurrentSong, refreshToken, retrieveTokens } from "./spotify.ts";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// handle Spotify redirect
server.get("/callback", async (
    request: express.Request<{}, {}, {}, { code: string }>,
    response: express.Response
) => {
    const { code } = request.query;
    if (!code) {
        return response.status(400).send("Missing 'code' param");
    }

    try {
        await retrieveTokens(code);
        return response.status(200).send("Authenticated");
    } catch (e) {
        console.log(`failed to retrieve tokens: ${e}`);
        return response.status(500).send("Failed to retrieve Spotify API tokens");
    }
})

server.get("/current-track", async (request: express.Request, response: express.Response) => {
    try {
        if (!credentials.accessToken) {
            console.log("Access token is missing!");
            await refreshToken();
        }

        const songData = await getCurrentSong();
        return response.status(200).send(songData);
    } catch (e) {
        console.log(`failed to retrieve current track: ${e}`);
        return response.status(500).send("Failed to retrieve current track");
    }
})

server.listen(process.env.PORT, () => {
    console.log(`Spotify microservice is online at :${process.env.PORT}`);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.set("client_id", process.env.SPOTIFY_CLIENT_ID as string);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", process.env.REDIRECT_URI as string);

    const scopes = [
        "user-read-playback-state",
        "user-read-recently-played"
    ].join(" ");
    authUrl.searchParams.set("scope", encodeURIComponent(scopes));
    console.log(`Head to the following URL to begin the PKCE flow:`);
    console.log(chalk.green.underline(authUrl.toString()));
});