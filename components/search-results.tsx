"use client";

import { Box } from "@/components/box";
import { TrackBox } from "@/components/track-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { searchSpotify } from "@/lib/queries";
import { useState } from "react";

type SearchResults = NonNullable<Awaited<ReturnType<typeof searchSpotify>>>;
type SearchType = Extract<keyof SearchResults, "artists" | "albums" | "tracks">;

export function SearchResults({ results }: { results: SearchResults }) {
	const [activeTab, setActiveTab] = useState<SearchType>("artists");

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => setActiveTab(value as SearchType)}
		>
			<TabsList className="w-full justify-start">
				<TabsTrigger value="artists" className="flex-1 md:flex-initial">
					Artists
				</TabsTrigger>
				<TabsTrigger value="albums" className="flex-1 md:flex-initial">
					Albums
				</TabsTrigger>
				<TabsTrigger value="tracks" className="flex-1 md:flex-initial">
					Tracks
				</TabsTrigger>
			</TabsList>
			<TabsContent value={activeTab}>
				{activeTab === "tracks" ? (
					<div className="flex flex-col gap-2">
						{results.tracks?.items?.map((result) => (
							<TrackBox
								key={result.id}
								id={result.id}
								name={result.name}
								artistName={
									result.artists?.[0]?.name ||
									"Unknown Artist"
								}
								albumId={result.album?.id || ""}
								albumName={
									result.album?.name || "Unknown Album"
								}
								albumCoverUrl={
									result.album?.images[0]?.url || ""
								}
								isSaved={result.isSaved}
								duration={result.duration_ms || 0}
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
						{results[activeTab]?.items?.map((result) => (
							<Box
								key={result.id}
								id={result.id}
								name={result.name}
								type={result.type}
								imageUrl={result.images?.[0]?.url || ""}
							/>
						))}
					</div>
				)}
			</TabsContent>
		</Tabs>
	);
}
