"use client";

import { Button } from "@/components/ui/button";
import { toggleSavedAlbum } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface SaveAlbumButtonProps {
	albumId: string;
	defaultIsSaved?: boolean;
}

export function SaveAlbumButton({
	albumId,
	defaultIsSaved = false,
}: SaveAlbumButtonProps) {
	const [isSaved, setIsSaved] = useState(defaultIsSaved);
	const { status } = useSession();

	const handleSave = async () => {
		if (status !== "authenticated") {
			return toast.warning("You need to be signed in to save albums");
		}

		const newSavedState = await toggleSavedAlbum(albumId);
		setIsSaved(newSavedState);
	};

	const Icon = isSaved ? HeartFilledIcon : HeartIcon;

	return (
		<Button
			variant={isSaved ? "default" : "outline"}
			size="icon"
			className="shrink-0"
			onClick={handleSave}
		>
			<Icon className="size-4 fill-current" />
		</Button>
	);
}
