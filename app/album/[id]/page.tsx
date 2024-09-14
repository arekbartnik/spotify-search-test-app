import { SaveAlbumButton } from "@/components/save-album-button";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAlbum } from "@/lib/queries";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const { album } = await getAlbum(params.id);
	return {
		title: `${album.name} by ${album.artists[0].name} | Spotify Search Test App`,
	};
}

export default async function AlbumPage({
	params,
}: {
	params: { id: string };
}) {
	const { album, isSaved } = await getAlbum(params.id);

	return (
		<div className="container mx-auto pt-3 md:pt-8">
			<div className="flex flex-col md:flex-row items-start gap-8">
				<Image
					src={album.images[0].url}
					alt={album.name}
					width={300}
					height={300}
					className="rounded-lg shadow-lg w-full md:w-[400px]"
				/>
				<div className="flex-1 w-full">
					<div className="flex justify-between items-start mb-2 gap-2">
						<h1 className="text-3xl font-bold text-balance">
							{album.name}
						</h1>
						<div className="flex items-center gap-2">
							<SaveAlbumButton
								albumId={album.id}
								defaultIsSaved={isSaved}
							/>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Button
											asChild
											variant="outline"
											size="icon"
											className="size-10"
										>
											<Link
												href={
													album.external_urls.spotify
												}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Open in Spotify"
											>
												<ExternalLinkIcon className="size-4" />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Open in Spotify</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
					<p className="text-xl mb-4">
						by{" "}
						<Link
							href={`/artist/${album.artists[0].id}`}
							className="hover:underline"
						>
							{album.artists[0].name}
						</Link>
					</p>
					<p className="text-lg mb-6 text-muted-foreground">
						{album.tracks.total} tracks
					</p>

					<h2 className="text-2xl font-semibold mb-4">Tracks</h2>
					<ul className="flex flex-col gap-1">
						{album.tracks.items.map((track) => (
							<li
								key={track.id}
								className="flex items-center rounded-md bg-zinc-50 py-2 dark:bg-zinc-900"
							>
								<span className="mr-2 text-muted-foreground w-10 flex items-center justify-center">
									{track.track_number}.
								</span>
								<span>{track.name}</span>
								<span className="ml-auto text-muted-foreground px-2">
									{Math.floor(track.duration_ms / 60000)}:
									{((track.duration_ms % 60000) / 1000)
										.toFixed(0)
										.padStart(2, "0")}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
