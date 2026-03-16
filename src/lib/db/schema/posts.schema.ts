import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { projects } from "./projects.schema";

export const posts = sqliteTable(
	"posts",
	{
		id: text("id").primaryKey(),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		content: text("content").notNull(),
		imageUrl: text("image_url"),
		projectId: text("project_id").references(() => projects.id, {
			onDelete: "set null",
		}),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		index("posts_authorId_idx").on(table.authorId),
		index("posts_projectId_idx").on(table.projectId),
		index("posts_createdAt_idx").on(table.createdAt),
		index("posts_type_idx").on(table.type),
	],
);

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id],
	}),
	project: one(projects, {
		fields: [posts.projectId],
		references: [projects.id],
	}),
}));
