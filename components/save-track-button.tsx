"use client";

import { Button } from "@/components/ui/button";
import { toggleSaveTrack } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

interface SaveTrackButtonProps {
	trackId: string;
	initialSavedState: boolean;
}

export function SaveTrackButton({
	trackId,
	initialSavedState,
}: SaveTrackButtonProps) {
	const [optimisticIsSaved, setOptimisticIsSaved] = useOptimistic(
		initialSavedState,
		(_, newState: boolean) => newState,
	);
	const [isPending, startTransition] = useTransition();
	const { status } = useSession();

	const handleToggleSave = async () => {
		if (status !== "authenticated") {
			return toast.warning("Please sign in to save tracks");
		}

		startTransition(async () => {
			try {
				setOptimisticIsSaved(!optimisticIsSaved);
				await toggleSaveTrack(trackId);
			} catch (error) {
				console.error("Error toggling save status:", error);
				// Revert optimistic update
				setOptimisticIsSaved(optimisticIsSaved);
				toast("Failed to save track", {
					description: "Please try again later",
				});
			}
		});
	};

	const Icon = optimisticIsSaved ? HeartFilledIcon : HeartIcon;

	return (
		<Button
			variant={optimisticIsSaved ? "default" : "outline"}
			size="icon"
			className="shrink-0"
			onClick={handleToggleSave}
			disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="size-4 animate-spin" />
			) : (
				<Icon className="size-4 fill-current" />
			)}
		</Button>
	);
}
