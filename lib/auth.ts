import NextAuth, { type Account, type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Spotify from "next-auth/providers/spotify";
import { env } from "./env";

declare module "next-auth" {
	interface Session {
		error?: string;
	}
}

export interface AuthUser extends User {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	expiresIn: number;
	refreshToken: string;
	scope: string;
	id: string;
}

const authURL = `https://accounts.spotify.com/authorize?${new URLSearchParams({
	scope: [
		"user-read-email",
		"user-follow-modify",
		"user-follow-read",
		"user-library-read",
		"user-library-modify",
		"user-read-playback-state",
		"user-modify-playback-state",
	].join(" "),
}).toString()}`;

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Spotify({
			authorization: authURL,
			checks: ["state"],
		}),
	],
	session: {
		maxAge: 60 * 60 * 24, // 1day
	},
	debug: process.env.NODE_ENV === "development",
	callbacks: {
		async jwt({ token, account }: { token: JWT; account: Account | null }) {
			const now = Math.floor(Date.now() / 1000);

			if (!account) {
				if (now > (token.expiresAt as number)) {
					return await refreshAccessToken(token);
				}
				return token;
			}

			const updatedToken = {
				...token,
				accessToken: account.access_token,
				tokenType: account.token_type,
				expiresAt: account.expires_at as number,
				expiresIn: account.expires_in as number,
				refreshToken: account.refresh_token,
				scope: account.scope,
				id: account.providerAccountId,
			};

			if (now > updatedToken.expiresAt) {
				return await refreshAccessToken(updatedToken);
			}

			return updatedToken;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const user: AuthUser = {
				...session.user,
				accessToken: token.accessToken as string,
				tokenType: token.tokenType as string,
				expiresAt: token.expiresAt as number,
				expiresIn: token.expiresIn as number,
				refreshToken: token.refreshToken as string,
				scope: token.scope as string,
				id: token.id as string,
			};
			session.user = user;
			session.error = token.error as string | undefined;
			return session;
		},
	},
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
	console.log("Refreshing access token");
	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(
						env.AUTH_SPOTIFY_ID + ":" + env.AUTH_SPOTIFY_SECRET,
					).toString("base64"),
			},
			method: "POST",
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: token.refreshToken as string,
			}),
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		const now = Math.floor(Date.now() / 1000);

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			expiresAt: now + refreshedTokens.expires_in,
			expiresIn: refreshedTokens.expires_in,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
			scope: refreshedTokens.scope,
		};
	} catch (error) {
		console.error("Error refreshing access token", error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
