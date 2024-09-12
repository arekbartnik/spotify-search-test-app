"use client";

import { Button } from "@/components/ui/button";
import { toggleFollowArtist } from "@/lib/actions";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface FollowArtistButtonProps {
	artistId: string;
	initialIsFollowing: boolean;
}

export default function FollowArtistButton({
	artistId,
	initialIsFollowing,
}: FollowArtistButtonProps) {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const Icon = isFollowing ? HeartFilledIcon : HeartIcon;
	const { status } = useSession();

	const handleFollowToggle = async () => {
		if (status !== "authenticated") {
			return toast.warning("You need to be signed in to follow artists");
		}

		try {
			const newFollowState = await toggleFollowArtist(artistId);
			setIsFollowing(newFollowState);
		} catch (error) {
			console.error("Error toggling follow status:", error);
			toast("Failed to update follow status", {
				description: "Please try again later",
			});
		}
	};

	return (
		<Button
			onClick={handleFollowToggle}
			variant={isFollowing ? "default" : "outline"}
			size="sm"
			className="flex items-center gap-2"
		>
			<Icon className="size-4 fill-current" />
			{isFollowing ? "Following" : "Follow"}
		</Button>
	);
}
