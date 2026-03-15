import { betterAuthSecret, betterAuthUrl, discordClientId, discordClientSecret } from "@/data/constants/env";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,
  trustedOrigins: betterAuthUrl ? [betterAuthUrl] : [],

  database: drizzleAdapter(getDb(), {
    provider: "sqlite",
    schema,
  }),
  socialProviders: {
    discord: {
      clientId: discordClientId,
      clientSecret: discordClientSecret,
    },
  },
  plugins: [tanstackStartCookies()],
});
