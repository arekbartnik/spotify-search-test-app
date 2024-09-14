import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
	return (
		<footer className="bg-zinc-100 py-2 dark:bg-zinc-800 relative">
			<div className="container max-w-screen-lg mx-auto px-4 md:px-8 text-center">
				<Link
					href="https://github.com/ArekBartnik/spotify-search-test-app"
					target="_blank"
					rel="noopener noreferrer"
					className="h-10 inline-flex items-center gap-2 text-inherit hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-300"
				>
					<GitHubLogoIcon className="size-4" />
					View on GitHub
				</Link>
				<ThemeSwitcher />
			</div>
		</footer>
	);
}
