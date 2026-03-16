import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const profile = sqliteTable(
	"profile",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		username: text("username").notNull(),
		displayName: text("display_name"),
		bio: text("bio"),
		avatarUrl: text("avatar_url"),
		website: text("website"),
		github: text("github"),
		twitter: text("twitter"),
		linkedin: text("linkedin"),
		interests: text("interests", { mode: "json" }).$type<string[]>(),
		isOnboardingComplete: integer("is_onboarding_complete", {
			mode: "boolean",
		})
			.notNull()
			.default(false),

		role: text("role").notNull().default("member"),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),

		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("profile_userId_unique").on(table.userId),
		uniqueIndex("profile_username_unique").on(table.username),
		index("profile_role_idx").on(table.role),
	],
);

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(user, { fields: [profile.userId], references: [user.id] }),
}));
