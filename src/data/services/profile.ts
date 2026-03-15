import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { ensureSession } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { account, profile } from "@/lib/db/schema";
import type {
	CreateProfileInput,
	UpdateProfileInput,
} from "@/lib/validations/profile";
import {
	createProfileSchema,
	updateProfileSchema,
} from "@/lib/validations/profile";

export const getDiscordUsername = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await ensureSession();
		const db = getDb();

		const discordAccount = await db.query.account.findFirst({
			where: and(
				eq(account.userId, session.user.id),
				eq(account.providerId, "discord"),
			),
		});

		if (!discordAccount?.accessToken) return null;

		const res = await fetch("https://discord.com/api/users/@me", {
			headers: { Authorization: `Bearer ${discordAccount.accessToken}` },
		});

		if (!res.ok) return null;

		const discordProfile = (await res.json()) as { username: string };
		return discordProfile.username;
	},
);

export const getProfileByUserId = createServerFn({ method: "GET" }).handler(
	async ({ data: userId }: { data: string }) => {
		const db = getDb();
		const result = await db.query.profile.findFirst({
			where: eq(profile.userId, userId),
		});
		return result ?? null;
	},
);

export const getProfileByUsername = createServerFn({ method: "GET" }).handler(
	async ({ data: username }: { data: string }) => {
		const db = getDb();
		const result = await db.query.profile.findFirst({
			where: eq(profile.username, username),
		});
		return result ?? null;
	},
);

export const getCurrentUserProfile = createServerFn({
	method: "GET",
}).handler(async () => {
	const session = await ensureSession();
	const db = getDb();
	const result = await db.query.profile.findFirst({
		where: eq(profile.userId, session.user.id),
	});
	return result ?? null;
});

export const createProfile = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: CreateProfileInput }) => {
		const parsed = createProfileSchema.parse(data);
		const session = await ensureSession();
		const db = getDb();

		const existing = await db.query.profile.findFirst({
			where: eq(profile.username, parsed.username),
		});
		if (existing) {
			throw new Error("Username ja esta em uso");
		}

		const id = crypto.randomUUID();
		await db.insert(profile).values({
			id,
			userId: session.user.id,
			username: parsed.username,
			displayName: parsed.displayName ?? null,
			bio: parsed.bio ?? null,
			avatarUrl: parsed.avatarUrl ?? session.user.image ?? null,
			website: parsed.website ?? null,
			github: parsed.github ?? null,
			twitter: parsed.twitter ?? null,
			linkedin: parsed.linkedin ?? null,
			interests: parsed.interests ?? null,
			isOnboardingComplete: true,
		});

		return { id, username: parsed.username };
	},
);

export const updateProfile = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: UpdateProfileInput }) => {
		const parsed = updateProfileSchema.parse(data);
		const session = await ensureSession();
		const db = getDb();

		await db
			.update(profile)
			.set({
				displayName: parsed.displayName ?? null,
				bio: parsed.bio ?? null,
				avatarUrl: parsed.avatarUrl ?? null,
				website: parsed.website ?? null,
				github: parsed.github ?? null,
				twitter: parsed.twitter ?? null,
				linkedin: parsed.linkedin ?? null,
				interests: parsed.interests ?? null,
			})
			.where(eq(profile.userId, session.user.id));

		return { success: true };
	},
);
