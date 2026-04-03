import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN)
    throw new Error("Missing Redis environment variables");

const client = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN,
    retry: false
});

export async function getAccessToken(): Promise<string | null> {
    return await client.get<string>("access_token");
}

export async function getRefreshToken(): Promise<string | null> {
    return await client.get<string>("refresh_token");
}

export async function setAccessToken(val: string) {
    await client.set("access_token", val);
}

export async function setRefreshToken(val: string) {
    await client.set("refresh_token", val);
}
