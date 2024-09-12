import { publicSpotifyApi } from "@/lib/spotify-api";
import Image from "next/image";
import Link from "next/link";

async function getNewReleases() {
	return publicSpotifyApi.browse.getNewReleases();
}

export async function NewAlbumReleases() {
	const releases = await getNewReleases();
	const albums = releases.albums.items;

	return (
		<section>
			<h2 className="text-2xl font-bold mt-8 mb-4">New Releases</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{albums.map((album) => (
					<div className="group cursor-pointer relative" key={album.id}>
						<Image
							src={album.images[0].url}
							alt={album.name}
							width={200}
							height={200}
							className="w-full aspect-square object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
						/>
						<h3 className="mt-2 font-semibold text-balance">
							<Link
								href={`/album/${album.id}`}
								className="before:absolute before:inset-0"
							>
								{album.name}
							</Link>
						</h3>
						<p className="text-sm text-muted-foreground">
							{album.artists[0].name} • {album.release_date.split("-")[0]}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
