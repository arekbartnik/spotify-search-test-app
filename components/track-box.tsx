import { SaveTrackButton } from "@/components/save-track-button";
import Image from "next/image";
import Link from "next/link";

interface TrackBoxProps {
	id: string;
	name: string;
	artistName: string;
	albumName: string;
	albumCoverUrl: string;
	duration: number;
	albumId: string;
	isSaved: boolean;
}

export function TrackBox({
	id,
	name,
	artistName,
	albumName,
	albumCoverUrl,
	duration,
	albumId,
	isSaved,
}: TrackBoxProps) {
	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	return (
		<div className="grid grid-cols-[1fr_40px_max-content] md:grid-cols-[2fr_1fr_80px_max-content] items-center justify-between gap-4 p-2 rounded-md hover:bg-zinc-100">
			<div className="flex gap-4 items-center min-w-0">
				<Image
					src={albumCoverUrl}
					alt={albumName}
					width={64}
					height={64}
					className="rounded-md aspect-square object-cover"
				/>
				<div className="grow min-w-0">
					<h3 className="font-semibold truncate min-w-0">{name}</h3>
					<p className="text-sm text-muted-foreground truncate min-w-0">
						{artistName}
					</p>
					<Link
						href={`/album/${albumId}`}
						className="text-sm text-muted-foreground truncate min-w-0 md:hidden hover:underline"
					>
						{albumName}
					</Link>
				</div>
			</div>
			<Link
				href={`/album/${albumId}`}
				className="text-sm text-muted-foreground truncate flex-1 hidden md:block hover:underline"
			>
				{albumName}
			</Link>
			<p className="text-sm text-muted-foreground mx-2">
				{formatDuration(duration)}
			</p>
			<SaveTrackButton trackId={id} initialSavedState={isSaved} />
		</div>
	);
}
