import FollowArtistButton from "@/components/follow-artist-button";
import { MissingArtistIcon } from "@/components/missing-artist-icon";
import { Badge } from "@/components/ui/badge";
import { getArtist } from "@/lib/queries";
import { isNotEmpty } from "@/lib/utils";
import { PersonStanding } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const { artist } = await getArtist(params.id);
	return {
		title: `${artist.name} | Spotify Search Test App`,
	};
}

export default async function ArtistPage({
	params,
}: {
	params: { id: string };
}) {
	const { artist, albums, isFollowing } = await getArtist(params.id);

	const artistImage = artist.images?.[0]?.url;

	return (
		<div className="container mx-auto py-4 md:py-8">
			<div className="flex flex-col md:flex-row items-start gap-8 mb-16">
				{artistImage ? (
					<Image
						src={artist.images?.[0]?.url}
						alt={artist.name}
						width={300}
						height={300}
						className="rounded-full shadow-lg aspect-square"
					/>
				) : (
					<div className="rounded-full shadow-lg aspect-square size-[300px] flex items-center justify-center">
						<MissingArtistIcon className="size-20 fill-muted-foreground" />
					</div>
				)}
				<div>
					<div className="flex items-center gap-4 mb-2">
						<h1 className="text-4xl font-bold">{artist.name}</h1>
						<FollowArtistButton
							artistId={artist.id}
							initialIsFollowing={isFollowing}
						/>
					</div>
					<p className="text-xl mb-4 text-muted-foreground">
						{artist.followers.total.toLocaleString()} followers
					</p>
					<div className="flex flex-wrap gap-2">
						{artist.genres.map((genre) => (
							<Badge key={genre} variant="secondary">
								{genre}
							</Badge>
						))}
					</div>
				</div>
			</div>

			{isNotEmpty(albums.items) ? (
				<>
					<h2 className="text-2xl font-semibold mb-4">Discography</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{albums.items.map((album) => (
							<div
								className="group cursor-pointer relative"
								key={album.id}
							>
								<Image
									src={album.images[0].url}
									alt={album.name}
									width={200}
									height={200}
									className="w-full aspect-square object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
								/>
								<h3 className="mt-2 font-semibold">
									<Link
										href={`/album/${album.id}`}
										className="before:absolute before:inset-0"
									>
										{album.name}
									</Link>
								</h3>
								<p className="text-sm text-gray-500">
									{album.release_date.split("-")[0]} •{" "}
									{album.album_type}
								</p>
							</div>
						))}
					</div>
				</>
			) : null}
		</div>
	);
}
