import NextAuth, { type Account, type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Spotify from "next-auth/providers/spotify";

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
	scope: "user-read-email user-follow-modify user-follow-read user-library-read user-library-modify",
}).toString()}`;

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Spotify({
			authorization: authURL,
			checks: ["state"],
		}),
	],
	session: {
		maxAge: 60 * 60, // 1hr
	},
	debug: process.env.NODE_ENV === "development",
	callbacks: {
		async jwt({ token, account }: { token: JWT; account: Account | null }) {
			if (!account) {
				return token;
			}

			const updatedToken = {
				...token,
				accessToken: account.access_token,
				tokenType: account.token_type,
				expiresAt: account.expires_at ?? Date.now() / 1000,
				expiresIn: (account.expires_at ?? 0) - Date.now() / 1000,
				refreshToken: account.refresh_token,
				scope: account.scope,
				id: account.providerAccountId,
			};

			if (Date.now() < updatedToken.expiresAt) {
				return refreshAccessToken(updatedToken);
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
	try {
		const response = await fetch(authURL, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			tokenType: refreshedTokens.token_type,
			expiresAt: refreshedTokens.expires_at,
			expiresIn: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
			scope: refreshedTokens.scope,
		};
	} catch (error) {
		console.error(error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
