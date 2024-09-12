"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

export function SearchInput() {
	const [query, setQuery] = useState("");
	const { replace } = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(() => {
			replace(`${pathname}?search=${query}`);
		});
	};

	return (
		<div className="w-full mb-12 select-none">
			<form
				onSubmit={handleSearch}
				className="flex flex-col md:flex-row gap-2 items-center"
			>
				<Input
					required
					type="text"
					placeholder="Search for artists, albums, or tracks"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="h-11"
					minLength={2}
				/>
				<Button type="submit" disabled={isPending} size="lg">
					{isPending ? "Searching..." : "Search"}
				</Button>
			</form>
		</div>
	);
}
