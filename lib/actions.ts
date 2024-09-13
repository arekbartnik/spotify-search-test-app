"use server";

import { privateSpotifyApi } from "@/lib/spotify-api";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "./auth";

export async function toggleFollowArtist(artistId: string) {
	const accessToken = await getAccessToken();
	const api = privateSpotifyApi(accessToken);
	const followedArtists = await api.currentUser.followedArtists("", 50);
	const isFollowing = followedArtists.artists.items.some(
		(artist) => artist.id === artistId,
	);

	if (isFollowing) {
		await api.currentUser.unfollowArtistsOrUsers([artistId], "artist");
	} else {
		await api.currentUser.followArtistsOrUsers([artistId], "artist");
	}

	// Revalidate the artist data
	revalidatePath(`/artist/${artistId}`, "page");

	return !isFollowing;
}

export async function toggleSavedAlbum(albumId: string) {
	const accessToken = await getAccessToken();
	const api = privateSpotifyApi(accessToken);

	const savedAlbums = await api.currentUser.albums.hasSavedAlbums([albumId]);
	const isSaved = savedAlbums[0];

	if (isSaved) {
		await api.currentUser.albums.removeSavedAlbums([albumId]);
	} else {
		await api.currentUser.albums.saveAlbums([albumId]);
	}

	// Revalidate the album data
	revalidatePath(`/album/${albumId}`, "page");

	return !isSaved;
}

export async function toggleSaveTrack(trackId: string) {
	const accessToken = await getAccessToken();
	const api = privateSpotifyApi(accessToken);

	const [isSaved] = await api.currentUser.tracks.hasSavedTracks([trackId]);

	if (isSaved) {
		await api.currentUser.tracks.removeSavedTracks([trackId]);
	} else {
		await api.currentUser.tracks.saveTracks([trackId]);
	}

	// Revalidate the album data
	revalidatePath("/", "page");

	return !isSaved;
}
