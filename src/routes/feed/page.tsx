import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { CreatePostForm } from "@/components/create-post-form";
import { FeedList } from "@/components/feed-list";
import { PostTypeFilter } from "@/components/post-type-filter";
import { H1 } from "@/components/ui/typography";
import { listFeed } from "@/data/services/post";
import { getProjectsByUserId } from "@/data/services/project";
import { getProfileByUserId } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/feed/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}

		const userProfile = await getProfileByUserId({
			data: session.user.id,
		});

		if (!userProfile || !userProfile.isOnboardingComplete) {
			throw redirect({ to: "/onboarding" });
		}

		return { session, userProfile };
	},
	loader: async ({ context }) => {
		const { session, userProfile } = context;

		const [feedResult, userProjects] = await Promise.all([
			listFeed({ data: { limit: 20 } }),
			getProjectsByUserId({ data: session.user.id }),
		]);

		return { feedResult, userProjects, userProfile };
	},
	component: FeedPage,
});

function FeedPage() {
	const { feedResult, userProjects, userProfile } = Route.useLoaderData();
	const [typeFilter, setTypeFilter] = useState("all");
	const [refreshKey, setRefreshKey] = useState(0);

	const projectsForForm = userProjects.map((p) => ({
		id: p.id,
		name: p.name,
		slug: p.slug,
		logoUrl: p.logoUrl,
	}));

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-24">
			<H1 className="mb-6 text-2xl">Feed</H1>

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
