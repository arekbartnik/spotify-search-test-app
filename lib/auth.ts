import NextAuth, { type Account, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Spotify from "next-auth/providers/spotify";

export type AuthUser = {
	name: string;
	email: string;
	image: string;
	access_token: string;
	id: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Spotify({
			authorization: `https://accounts.spotify.com/authorize?${new URLSearchParams(
				{
					scope: "user-read-email user-follow-modify user-follow-read user-library-read user-library-modify",
				},
			).toString()}`,
			checks: ["state"],
		}),
	],
	session: {
		maxAge: 60 * 60, // 1hr
	},
	callbacks: {
		async jwt({ token, account }: { token: JWT; account: Account | null }) {
			if (!account) {
				return token;
			}

			const updatedToken = {
				...token,
				access_token: account?.access_token,
				id: account?.providerAccountId,
			};

			// TODO: get refresh token and update access token before it expires

			return updatedToken;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const user = {
				...session.user,
				access_token: token.access_token as string,
				id: token.id as string,
			};
			session.user = user;
			return session;
		},
	},
});

export async function getAccessToken() {
	const session = await auth();
	const user = session?.user as AuthUser | undefined;

	return user?.access_token;
}
