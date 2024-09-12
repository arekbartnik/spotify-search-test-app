"use client";

import { Button } from "@/components/ui/button";
import { toggleSaveTrack } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface SaveTrackButtonProps {
	trackId: string;
	initialSavedState: boolean;
}

export function SaveTrackButton({
	trackId,
	initialSavedState,
}: SaveTrackButtonProps) {
	const [isSaved, setIsSaved] = useState(initialSavedState);
	const { status } = useSession();

	const handleToggleSave = async () => {
		if (status !== "authenticated") {
			return toast.warning("Please sign in to save tracks");
		}

		const newSaveState = await toggleSaveTrack(trackId);
		setIsSaved(newSaveState);
	};

	const Icon = isSaved ? HeartFilledIcon : HeartIcon;

	return (
		<Button
			variant={isSaved ? "default" : "outline"}
			size="icon"
			className="shrink-0"
			onClick={handleToggleSave}
		>
			<Icon className="size-4 fill-current" />
		</Button>
	);
}
