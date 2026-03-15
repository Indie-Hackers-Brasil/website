export const isDevelopment = process.env.NODE_ENV === "development";
export const defaultProtocol = isDevelopment ? "http" : "https";

// Auth URLs
export const betterAuthUrl = process.env.BETTER_AUTH_URL;
export const betterAuthSecret = process.env.BETTER_AUTH_SECRET;

// Discord Credentials
export const discordClientId = process.env.DISCORD_CLIENT_ID as string;
export const discordClientSecret = process.env.DISCORD_CLIENT_SECRET as string;

// Email (Resend)
export const resendApiKey = process.env.RESEND_API_KEY;
export const resendFrom = process.env.RESEND_FROM;

// Cloudflare D1
export const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
export const cloudflareDatabaseId = process.env.CLOUDFLARE_DATABASE_ID;
export const cloudflareD1Token = process.env.CLOUDFLARE_D1_TOKEN;
