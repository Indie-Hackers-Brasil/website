import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { events, profile, projects } from "@/lib/db/schema";

export const getCommunityStats = createServerFn({ method: "GET" }).handler(
	async () => {
		const db = getDb();

		const [profileCount, projectCount, eventCount] = await Promise.all([
			db
				.select({ count: count() })
				.from(profile)
				.where(eq(profile.isOnboardingComplete, true)),
			db.select({ count: count() }).from(projects),
			db
				.select({ count: count() })
				.from(events)
				.where(eq(events.status, "approved")),
		]);

		return {
			members: profileCount[0]?.count ?? 0,
			projects: projectCount[0]?.count ?? 0,
			events: eventCount[0]?.count ?? 0,
		};
	},
);
