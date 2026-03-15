import { cloudflareAccountId, cloudflareD1Token, cloudflareDatabaseId } from "@/data/constants/env";
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!cloudflareAccountId || !cloudflareDatabaseId || !cloudflareD1Token) {
  throw new Error("Missing required Cloudflare D1 environment variables");
}

export default defineConfig({
  out: './src/lib/db/migrations',
  schema: "./src/lib/db/schema/index.ts",
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: cloudflareAccountId,
    databaseId: cloudflareDatabaseId,
    token: cloudflareD1Token,
  },
});
