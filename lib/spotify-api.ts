import "server-only";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "./env";

export const privateSpotifyApi = (accessToken: string | undefined) =>
	SpotifyApi.withAccessToken(env.AUTH_SPOTIFY_ID, {
		access_token: accessToken as string,
		token_type: "Bearer",
		expires_in: 3600,
		refresh_token: "",
	});

export const publicSpotifyApi = SpotifyApi.withClientCredentials(
	env.AUTH_SPOTIFY_ID,
	env.AUTH_SPOTIFY_SECRET,
);
