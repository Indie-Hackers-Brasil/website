import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import { ensureSession } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { posts, profile, projectMembers, projects } from "@/lib/db/schema";
import {
	type CreatePostInput,
	type FeedFilters,
	type UserPostsFilters,
	createPostSchema,
	feedFiltersSchema,
	userPostsFiltersSchema,
} from "@/lib/validations/post";

async function getUserRole(
	db: ReturnType<typeof getDb>,
	userId: string,
): Promise<string> {
	const p = await db.query.profile.findFirst({
		where: eq(profile.userId, userId),
		columns: { role: true },
	});
	return p?.role ?? "member";
}

function isMod(role: string): boolean {
	return role === "moderator" || role === "admin";
}

export const createPost = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: CreatePostInput }) => {
		const parsed = createPostSchema.parse(data);
		const session = await ensureSession();
		const db = getDb();

		const userProfile = await db.query.profile.findFirst({
			where: eq(profile.userId, session.user.id),
			columns: { isOnboardingComplete: true, role: true },
		});

		if (!userProfile?.isOnboardingComplete) {
			throw new Error("Perfil incompleto");
		}

		if (parsed.type === "announcement") {
			if (!isMod(userProfile.role)) {
				throw new Error(
					"Apenas moderadores e admins podem criar comunicados",
				);
			}
		}

		if (parsed.projectId) {
			const membership = await db.query.projectMembers.findFirst({
				where: and(
					eq(projectMembers.projectId, parsed.projectId),
					eq(projectMembers.userId, session.user.id),
				),
			});

			if (!membership) {
				throw new Error("Voce nao e membro deste projeto");
			}
		}

		const id = crypto.randomUUID();
		await db.insert(posts).values({
			id,
			authorId: session.user.id,
			type: parsed.type,
			content: parsed.content,
			imageUrl: parsed.imageUrl ?? null,
			projectId: parsed.type === "announcement" ? null : (parsed.projectId ?? null),
		});

		return { id };
	},
);

export const deletePost = createServerFn({ method: "POST" }).handler(
	async ({ data: postId }: { data: string }) => {
		const session = await ensureSession();
		const db = getDb();

		const post = await db.query.posts.findFirst({
			where: eq(posts.id, postId),
		});

		if (!post) {
			throw new Error("Post nao encontrado");
		}

		const isAuthor = post.authorId === session.user.id;
		const role = await getUserRole(db, session.user.id);

		if (!isAuthor && !isMod(role)) {
			throw new Error("Sem permissao para excluir este post");
		}

		await db.delete(posts).where(eq(posts.id, postId));

		return { success: true };
	},
);

export const listFeed = createServerFn({ method: "GET" }).handler(
	async ({ data }: { data: FeedFilters }) => {
		const parsed = feedFiltersSchema.parse(data);
		await ensureSession();
		const db = getDb();

		const conditions = [];

		if (parsed.cursor) {
			conditions.push(lt(posts.createdAt, new Date(parsed.cursor)));
		}

		if (parsed.type) {
			conditions.push(eq(posts.type, parsed.type));
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;
		const fetchLimit = parsed.limit + 1;

		const postList = await db.query.posts.findMany({
			where,
			orderBy: [desc(posts.createdAt)],
			limit: fetchLimit,
		});

		const hasMore = postList.length > parsed.limit;
		const items = hasMore ? postList.slice(0, parsed.limit) : postList;

		const authorIds = [...new Set(items.map((p) => p.authorId))];
		const projectIds = [
			...new Set(items.map((p) => p.projectId).filter(Boolean)),
		] as string[];

		let profiles: {
			userId: string;
			username: string;
			displayName: string | null;
			avatarUrl: string | null;
		}[] = [];

		if (authorIds.length > 0) {
			profiles = await db
				.select({
					userId: profile.userId,
					username: profile.username,
					displayName: profile.displayName,
					avatarUrl: profile.avatarUrl,
				})
				.from(profile)
				.where(
					sql`${profile.userId} IN (${sql.join(
						authorIds.map((id) => sql`${id}`),
						sql`, `,
					)})`,
				);
		}

		let projectList: {
			id: string;
			name: string;
			slug: string;
			logoUrl: string | null;
			status: string;
		}[] = [];

		if (projectIds.length > 0) {
			projectList = await db
				.select({
					id: projects.id,
					name: projects.name,
					slug: projects.slug,
					logoUrl: projects.logoUrl,
					status: projects.status,
				})
				.from(projects)
				.where(
					sql`${projects.id} IN (${sql.join(
						projectIds.map((id) => sql`${id}`),
						sql`, `,
					)})`,
				);
		}

		const profileMap = new Map(profiles.map((p) => [p.userId, p]));
		const projectMap = new Map(projectList.map((p) => [p.id, p]));

		const enrichedPosts = items.map((post) => ({
			...post,
			authorProfile: profileMap.get(post.authorId) ?? null,
			linkedProject: post.projectId
				? (projectMap.get(post.projectId) ?? null)
				: null,
		}));

		const nextCursor =
			hasMore && items.length > 0
				? items[items.length - 1].createdAt?.getTime() ?? null
				: null;

		return { posts: enrichedPosts, nextCursor, hasMore };
	},
);

export const getUserPosts = createServerFn({ method: "GET" }).handler(
	async ({ data }: { data: UserPostsFilters }) => {
		const parsed = userPostsFiltersSchema.parse(data);
		const db = getDb();

		const conditions = [eq(posts.authorId, parsed.userId)];

		if (parsed.cursor) {
			conditions.push(lt(posts.createdAt, new Date(parsed.cursor)));
		}

		const fetchLimit = parsed.limit + 1;

		const postList = await db.query.posts.findMany({
			where: and(...conditions),
			orderBy: [desc(posts.createdAt)],
			limit: fetchLimit,
		});

		const hasMore = postList.length > parsed.limit;
		const items = hasMore ? postList.slice(0, parsed.limit) : postList;

		const authorIds = [...new Set(items.map((p) => p.authorId))];
		const projectIds = [
			...new Set(items.map((p) => p.projectId).filter(Boolean)),
		] as string[];

		let profiles: {
			userId: string;
			username: string;
			displayName: string | null;
			avatarUrl: string | null;
		}[] = [];

		if (authorIds.length > 0) {
			profiles = await db
				.select({
					userId: profile.userId,
					username: profile.username,
					displayName: profile.displayName,
					avatarUrl: profile.avatarUrl,
				})
				.from(profile)
				.where(
					sql`${profile.userId} IN (${sql.join(
						authorIds.map((id) => sql`${id}`),
						sql`, `,
					)})`,
				);
		}

		let projectList2: {
			id: string;
			name: string;
			slug: string;
			logoUrl: string | null;
			status: string;
		}[] = [];

		if (projectIds.length > 0) {
			projectList2 = await db
				.select({
					id: projects.id,
					name: projects.name,
					slug: projects.slug,
					logoUrl: projects.logoUrl,
					status: projects.status,
				})
				.from(projects)
				.where(
					sql`${projects.id} IN (${sql.join(
						projectIds.map((id) => sql`${id}`),
						sql`, `,
					)})`,
				);
		}

		const profileMap = new Map(profiles.map((p) => [p.userId, p]));
		const projectMap = new Map(projectList2.map((p) => [p.id, p]));

		const enrichedPosts = items.map((post) => ({
			...post,
			authorProfile: profileMap.get(post.authorId) ?? null,
			linkedProject: post.projectId
				? (projectMap.get(post.projectId) ?? null)
				: null,
		}));

		const nextCursor =
			hasMore && items.length > 0
				? items[items.length - 1].createdAt?.getTime() ?? null
				: null;

		return { posts: enrichedPosts, nextCursor, hasMore };
	},
);
