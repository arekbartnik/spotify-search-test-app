import { NewAlbumReleases } from "@/components/new-album-releases";
import { SearchInput } from "@/components/search-input";
import { SearchResults } from "@/components/search-results";
import { searchSpotify } from "@/lib/queries";
import { isNotEmpty } from "@/lib/utils";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: { search: string };
}) {
	const query = searchParams.search;

	const data = await searchSpotify(query ?? "", ["artist", "album", "track"]);

	return (
		<main>
			<SearchInput />

			{isNotEmpty(data) ? (
				<SearchResults results={data} />
			) : (
				<NewAlbumReleases />
			)}
		</main>
	);
}
