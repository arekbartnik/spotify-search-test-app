import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { ExitIcon } from "@radix-ui/react-icons";

export function SignOut() {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({ redirectTo: "/" });
			}}
		>
			<Button
				type="submit"
				variant="outline"
				className="flex items-center gap-2"
			>
				<ExitIcon className="size-4" />
				<span className="sr-only md:not-sr-only">Sign Out</span>
			</Button>
		</form>
	);
}
