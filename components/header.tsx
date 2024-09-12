import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { SpotifyLogo } from "@/components/sporify-logo";
import { auth } from "@/lib/auth";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export async function Header() {
	const session = await auth();
	const isLoggedIn = !!session;
	const avatar = session?.user?.image;

	return (
		<div className="flex justify-between mb-10 gap-8">
			<Link className="flex items-center gap-4 select-none" href="/">
				<SpotifyLogo className="size-8 md:size-12" />
				<h1 className="text-lg md:text-2xl font-bold">Spotify Search</h1>
			</Link>
			<div className="flex items-center gap-4 md:gap-10">
				{isLoggedIn ? (
					<div className="flex justify-center items-center gap-3">
						<Avatar className="size-8">
							{avatar ? <AvatarImage src={avatar} alt="Avatar" /> : null}
							<AvatarFallback className="font-semibold bg-[#FF978D]">
								{session?.user?.name?.[0].toUpperCase() || (
									<PersonIcon className="size-4" />
								)}
							</AvatarFallback>
						</Avatar>

						<span className="hidden md:block">{session?.user?.name}</span>
					</div>
				) : null}
				{session ? <SignOut /> : <SignIn />}
			</div>
		</div>
	);
}
