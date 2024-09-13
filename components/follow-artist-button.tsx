"use client";

import { Button } from "@/components/ui/button";
import { toggleFollowArtist } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

interface FollowArtistButtonProps {
	artistId: string;
	initialIsFollowing: boolean;
}

export default function FollowArtistButton({
	artistId,
	initialIsFollowing,
}: FollowArtistButtonProps) {
	const [optimisticIsFollowing, setOptimisticIsFollowing] = useOptimistic(
		initialIsFollowing,
		(_, newState: boolean) => newState,
	);
	const [isPending, startTransition] = useTransition();
	const { status } = useSession();

	const Icon = optimisticIsFollowing ? HeartFilledIcon : HeartIcon;

	const handleFollowToggle = async () => {
		if (status !== "authenticated") {
			return toast.warning("You need to be signed in to follow artists");
		}

		setOptimisticIsFollowing(!optimisticIsFollowing);

		startTransition(async () => {
			try {
				await toggleFollowArtist(artistId);
			} catch (error) {
				console.error("Error toggling follow status:", error);
				// Revert optimistic update
				setOptimisticIsFollowing(optimisticIsFollowing);
				toast("Failed to update follow status", {
					description: "Please try again later",
				});
			}
		});
	};

	return (
		<Button
			onClick={handleFollowToggle}
			variant={optimisticIsFollowing ? "default" : "outline"}
			size="sm"
			className="flex items-center gap-2"
			disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="size-4 animate-spin" />
			) : (
				<Icon className="size-4 fill-current" />
			)}
			{optimisticIsFollowing ? "Following" : "Follow"}
		</Button>
	);
}
