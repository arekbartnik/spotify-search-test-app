import "server-only";

import type { ItemTypes } from "@spotify/web-api-ts-sdk";
import { cache } from "react";
import { getAccessToken } from "./auth";
import { privateSpotifyApi, publicSpotifyApi } from "./spotify-api";

export async function checkSavedTracks(trackId: string) {
	const accessToken = await getAccessToken();
	const api = privateSpotifyApi(accessToken);

	const savedTracks = await api.currentUser.tracks.hasSavedTracks([trackId]);
	return savedTracks[0];
}

export async function searchSpotify(query: string, type: ItemTypes[]) {
	const accessToken = await getAccessToken();

	if (!query) return null;

	const data = await publicSpotifyApi.search(query, type);

	return {
		...data,
		tracks: {
			...data.tracks,
			items: await Promise.all(
				data.tracks?.items.map(async (track) => ({
					...track,
					isSaved: accessToken
						? await checkSavedTracks(track.id)
						: false,
				})) ?? [],
			),
		},
	};
}

export const getArtist = cache(async (id: string) => {
	const accessToken = await getAccessToken();
	const artist = await publicSpotifyApi.artists.get(id);
	const albums = await publicSpotifyApi.artists.albums(id, "album,single");

	if (!accessToken) {
		return { artist, albums, isFollowing: false };
	}

	const followedArtists = await privateSpotifyApi(
		accessToken,
	).currentUser.followedArtists("", 50);
	const isFollowing = followedArtists.artists.items.some(
		(artist) => artist.id === id,
	);
	return { artist, albums, isFollowing };
});

export const getAlbum = cache(async (id: string) => {
	const accessToken = await getAccessToken();
	const album = await publicSpotifyApi.albums.get(id);

	if (!accessToken) {
		return { album, isSaved: false };
	}

	const savedAlbums = await privateSpotifyApi(
		accessToken,
	).currentUser.albums.hasSavedAlbums([id]);
	const isSaved = savedAlbums[0];
	return { album, isSaved };
});
