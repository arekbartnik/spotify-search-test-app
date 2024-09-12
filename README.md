# Spotify Search Test App

This is a test app for searching Spotify. It is built with Next.js 15 RC and uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api) through [TypeScript SDK](https://github.com/spotify/spotify-web-api-ts-sdk).

## Main tech stack

- [Next.js 15 App Router](https://nextjs.org/)
- [pnpm](https://pnpm.io/installation) (but `npm` should work just fine :))
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://https://vitest.dev/)

## Requirements

- Node 20.16.0+ (with corepack)
- pnpm (latest from corepack)

## Development

1. Create Spotify App and get client ID and client secret. You can find more information [here](https://developer.spotify.com/documentation/web-api/concepts/apps).
2. Set **Redirect URI** to `http://localhost:3000/api/auth/callback/spotify`.
3. Create a `.env.local` file in the root of the project (you can copy `.env.example`).
4. Fill client ID, client secret, redirect URI and `AUTH_SECRET` in `.env.local`.

   - `AUTH_CLIENT_ID` - Spotify app client ID
   - `AUTH_CLIENT_SECRET` - Spotify app client secret
   - `AUTH_SECRET` - Random string used to hash tokens, sign cookies and generate cryptographic keys. You can generate it using `npx auth secret`.

5. Run `pnpm install` to install the dependencies.
6. Run `pnpm run dev` to start the development server.

## Preview

You can preview the app [here](https://spotify-search-test.vercel.app/).

> **Warning**
> Before log in the app, the author have to add your Spotify account to the list of authorized users in the Spotify Developer Dashboard.
