import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { CreatePostForm } from "@/components/create-post-form";
import { FeedList } from "@/components/feed-list";
import { LandingPage } from "@/components/landing-page";
import { PostTypeFilter } from "@/components/post-type-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { listFeed } from "@/data/services/post";
import { getProjectsByUserId } from "@/data/services/project";
import { listEvents } from "@/data/services/event";
import { listProjects } from "@/data/services/project";
import { getCommunityStats } from "@/data/services/stats";
import { getProfileByUserId } from "@/data/services/profile";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			const userProfile = await getProfileByUserId({
				data: session.user.id,
			});
			if (!userProfile || !userProfile.isOnboardingComplete) {
				throw redirect({ to: "/onboarding" });
			}
			return { session, userProfile };
		}
		return { session: null, userProfile: null };
	},
	loader: async ({ context }) => {
		const { session, userProfile } = context;

		const [projectsResult, eventsResult, stats] = await Promise.all([
			listProjects({ data: { page: 1, pageSize: 6 } }),
			listEvents(),
			getCommunityStats(),
		]);

		let feedResult = null;
		let userProjects: Awaited<ReturnType<typeof getProjectsByUserId>> = [];

		if (session) {
			const [feed, projects] = await Promise.all([
				listFeed({ data: { limit: 20 } }),
				getProjectsByUserId({ data: session.user.id }),
			]);
			feedResult = feed;
			userProjects = projects;
		}

		const now = new Date();
		const upcomingEvents = (eventsResult.upcoming ?? [])
			.filter((e) => e.status === "approved" && new Date(e.date) > now)
			.slice(0, 6);

		return {
			projectsResult,
			upcomingEvents,
			stats,
			feedResult,
			userProjects,
			userProfile,
		};
	},
	component: HomePage,
});

function HomePage() {
	const {
		projectsResult,
		upcomingEvents,
		stats,
		feedResult,
		userProjects,
		userProfile,
	} = Route.useLoaderData();
	const { data: session, isPending } = authClient.useSession();
	const [typeFilter, setTypeFilter] = useState("all");
	const [refreshKey, setRefreshKey] = useState(0);

	if (isPending) {
		return (
			<main className="mx-auto w-full max-w-6xl px-4 py-24">
				<div className="space-y-4">
					<Skeleton className="h-12 w-64" />
					<Skeleton className="h-6 w-96" />
					<div className="grid gap-4 sm:grid-cols-3">
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
						<Skeleton className="h-32" />
					</div>
				</div>
			</main>
		);
	}

	if (!session || !userProfile || !feedResult) {
		return (
			<main className="mx-auto w-full max-w-6xl px-4 py-24">
				<LandingPage
					projects={projectsResult.projects}
					events={upcomingEvents}
					stats={stats}
				/>
			</main>
		);
	}

	const projectsForForm = userProjects.map((p) => ({
		id: p.id,
		name: p.name,
		slug: p.slug,
		logoUrl: p.logoUrl,
	}));

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-24">
			<div className="space-y-6">
				<CreatePostForm
					userProfile={{
						displayName: userProfile.displayName,
						username: userProfile.username,
						avatarUrl: userProfile.avatarUrl,
						role: userProfile.role,
					}}
					userProjects={projectsForForm}
					onPostCreated={() => setRefreshKey((k) => k + 1)}
				/>

				<PostTypeFilter value={typeFilter} onChange={setTypeFilter} />

				<FeedList
					initialPosts={feedResult.posts}
					initialNextCursor={feedResult.nextCursor}
					initialHasMore={feedResult.hasMore}
					typeFilter={typeFilter}
					currentUserId={userProfile.userId}
					currentUserRole={userProfile.role}
					refreshKey={refreshKey}
				/>
			</div>
		</main>
	);
}
