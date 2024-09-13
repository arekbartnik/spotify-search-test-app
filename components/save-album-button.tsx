"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleSavedAlbum } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

interface SaveAlbumButtonProps {
	albumId: string;
	defaultIsSaved: boolean;
}

export function SaveAlbumButton({
	albumId,
	defaultIsSaved,
}: SaveAlbumButtonProps) {
	const [optimisticIsSaved, setOptimisticIsSaved] = useOptimistic(
		defaultIsSaved,
		(_, newState: boolean) => newState,
	);
	const [isPending, startTransition] = useTransition();
	const { status } = useSession();

	const handleSave = async () => {
		if (status !== "authenticated") {
			return toast.warning("You need to be signed in to save albums");
		}

		startTransition(async () => {
			try {
				setOptimisticIsSaved(!optimisticIsSaved);
				await toggleSavedAlbum(albumId);
			} catch (error) {
				console.error("Error toggling save album:", error);
				// Revert optimistic update
				setOptimisticIsSaved(optimisticIsSaved);
				toast("Failed to save album", {
					description: "Please try again later",
				});
			}
		});
	};

	const Icon = optimisticIsSaved ? HeartFilledIcon : HeartIcon;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={optimisticIsSaved ? "default" : "outline"}
						size="icon"
						className="shrink-0"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Icon className="size-4 fill-current" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Save Album</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
