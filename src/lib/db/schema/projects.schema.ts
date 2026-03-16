import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const projects = sqliteTable(
	"projects",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		description: text("description"),
		url: text("url"),
		logoUrl: text("logo_url"),
		category: text("category").notNull().default("outro"),
		status: text("status").notNull().default("ideia"),
		tags: text("tags", { mode: "json" }).$type<string[]>(),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`)
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex("projects_slug_unique").on(table.slug)],
);

export const projectMembers = sqliteTable(
	"project_members",
	{
		id: text("id").primaryKey(),
		projectId: text("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").notNull().default("contributor"),

		joinedAt: integer("joined_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		uniqueIndex("project_members_project_user_unique").on(
			table.projectId,
			table.userId,
		),
		index("project_members_project_idx").on(table.projectId),
		index("project_members_user_idx").on(table.userId),
	],
);

export const projectsRelations = relations(projects, ({ many }) => ({
	members: many(projectMembers),
}));

export const projectMembersRelations = relations(
	projectMembers,
	({ one }) => ({
		project: one(projects, {
			fields: [projectMembers.projectId],
			references: [projects.id],
		}),
		user: one(user, {
			fields: [projectMembers.userId],
			references: [user.id],
		}),
	}),
);
