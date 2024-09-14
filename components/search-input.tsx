"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { type FormEvent, useEffect, useRef, useTransition } from "react";

const SEARCH_PARAM = "search";

export function SearchInput() {
	const pathname = usePathname();
	const { replace } = useRouter();
	const [query, setQuery] = useQueryState(SEARCH_PARAM);
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			const search = searchParams.get(SEARCH_PARAM);
			if (search && search !== query) {
				setQuery(search);
			}
			isInitialMount.current = false;
		}
	}, [searchParams, setQuery, query]);

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(() => {
			replace(`${pathname}?${SEARCH_PARAM}=${query}`);
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
					value={query || ""}
					onChange={(e) => setQuery(e.target.value || null)}
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
