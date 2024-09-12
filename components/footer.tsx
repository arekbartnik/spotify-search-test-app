import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-gray-100 py-4">
			<div className="container max-w-screen-lg mx-auto px-4 md:px-8 text-center">
				<Link
					href="https://github.com/ArekBartnik/spotify-search-test-app"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-inherit hover:text-gray-600 transition-colors duration-300"
				>
					<GitHubLogoIcon className="size-4" />
					View on GitHub
				</Link>
			</div>
		</footer>
	);
}
