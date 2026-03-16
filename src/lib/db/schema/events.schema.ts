import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const events = sqliteTable(
	"events",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		date: integer("date", { mode: "timestamp_ms" }).notNull(),
		format: text("format").notNull(),
		address: text("address"),
		accessLink: text("access_link"),
		eventLink: text("event_link").notNull(),
		bannerUrl: text("banner_url"),
		organizerName: text("organizer_name").notNull(),
		isPartner: integer("is_partner", { mode: "boolean" })
			.notNull()
			.default(false),
		status: text("status").notNull().default("pending"),
		rejectionReason: text("rejection_reason"),
		submittedBy: text("submitted_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		reviewedBy: text("reviewed_by").references(() => user.id, {
			onDelete: "set null",
		}),
		reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("events_date_idx").on(table.date),
		index("events_status_idx").on(table.status),
		index("events_submittedBy_idx").on(table.submittedBy),
	],
);

export const eventMembers = sqliteTable(
	"event_members",
	{
		id: text("id").primaryKey(),
		eventId: text("event_id")
			.notNull()
			.references(() => events.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		status: text("status").notNull().default("interessado"),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		uniqueIndex("event_members_event_user_unique").on(
			table.eventId,
			table.userId,
		),
	],
);

export const eventsRelations = relations(events, ({ one, many }) => ({
	submitter: one(user, {
		fields: [events.submittedBy],
		references: [user.id],
		relationName: "eventSubmitter",
	}),
	reviewer: one(user, {
		fields: [events.reviewedBy],
		references: [user.id],
		relationName: "eventReviewer",
	}),
	members: many(eventMembers),
}));

export const eventMembersRelations = relations(eventMembers, ({ one }) => ({
	event: one(events, {
		fields: [eventMembers.eventId],
		references: [events.id],
	}),
	user: one(user, {
		fields: [eventMembers.userId],
		references: [user.id],
	}),
}));
