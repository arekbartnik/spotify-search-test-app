import { signIn } from "@/lib/auth";
import { Button } from "./ui/button";

export function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("spotify");
			}}
		>
			<Button variant="outline" type="submit">
				<span>
					Sign In{" "}
					<span className="sr-only md:not-sr-only">with Spotify</span>
				</span>
			</Button>
		</form>
	);
}
