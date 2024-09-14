import "server-only";

import type { ItemTypes } from "@spotify/web-api-ts-sdk";
import { cache } from "react";
import { auth } from "./auth";
import { privateSpotifyApi, publicSpotifyApi } from "./spotify-api";

export async function checkSavedTracks(trackId: string) {
	const session = await auth();
	const api = privateSpotifyApi(session);

	const savedTracks = await api.currentUser.tracks.hasSavedTracks([trackId]);
	return savedTracks[0];
}

export async function searchSpotify(query: string, type: ItemTypes[]) {
	const session = await auth();
	const isLoggedIn = !!session;

	if (!query) return null;

	const data = await publicSpotifyApi.search(query, type);

	return {
		...data,
		tracks: {
			...data.tracks,
			items: await Promise.all(
				data.tracks?.items.map(async (track) => ({
					...track,
					isSaved: isLoggedIn
						? await checkSavedTracks(track.id)
						: false,
				})) ?? [],
			),
		},
	};
}

export const getArtist = cache(async (id: string) => {
	const session = await auth();
	const artist = await publicSpotifyApi.artists.get(id);
	const albums = await publicSpotifyApi.artists.albums(id, "album,single");

	if (!session) {
		return { artist, albums, isFollowing: false };
	}

	const followedArtists = await privateSpotifyApi(
		session,
	).currentUser.followedArtists("", 50);
	const isFollowing = followedArtists.artists.items.some(
		(artist) => artist.id === id,
	);
	return { artist, albums, isFollowing };
});

export const getAlbum = cache(async (id: string) => {
	const session = await auth();
	const album = await publicSpotifyApi.albums.get(id);

	if (!session) {
		return { album, isSaved: false };
	}

	const savedAlbums = await privateSpotifyApi(
		session,
	).currentUser.albums.hasSavedAlbums([id]);
	const isSaved = savedAlbums[0];
	return { album, isSaved };
});
