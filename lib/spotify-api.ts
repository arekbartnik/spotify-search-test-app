import "server-only";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { Session } from "next-auth";
import { type AuthUser, auth } from "./auth";
import { env } from "./env";

export const privateSpotifyApi = (session: Session | null) => {
	const user = session?.user as AuthUser;

	return SpotifyApi.withAccessToken(env.AUTH_SPOTIFY_ID, {
		access_token: user.accessToken,
		token_type: user.tokenType,
		expires_in: user.expiresIn,
		refresh_token: user.refreshToken,
	});
};

export const publicSpotifyApi = SpotifyApi.withClientCredentials(
	env.AUTH_SPOTIFY_ID,
	env.AUTH_SPOTIFY_SECRET,
);
