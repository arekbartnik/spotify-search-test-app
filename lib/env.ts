import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		AUTH_SPOTIFY_ID: z.string(),
		AUTH_SPOTIFY_SECRET: z.string(),
		AUTH_SECRET: z.string(),
	},
	client: {},
	experimental__runtimeEnv: {},
});
