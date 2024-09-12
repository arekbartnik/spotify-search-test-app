"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function BackButton() {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return (
		<Button variant="outline" className="mb-4" onClick={handleBack}>
			<ChevronLeftIcon className="mr-2 size-4 -ml-2" />
			Back
		</Button>
	);
}
