import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, like, sql } from "drizzle-orm";
import { ensureSession, getSession } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { profile, projectMembers, projects } from "@/lib/db/schema";
import { generateSlug } from "@/lib/utils";
import {
	type CreateProjectInput,
	type ProjectFilters,
	type UpdateProjectInput,
	createProjectSchema,
	projectFiltersSchema,
	updateProjectSchema,
} from "@/lib/validations/project";

export const createProject = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: CreateProjectInput }) => {
		const parsed = createProjectSchema.parse(data);
		const session = await ensureSession();
		const db = getDb();

		let slug = generateSlug(parsed.name);
		if (!slug) slug = "projeto";

		const existing = await db.query.projects.findFirst({
			where: eq(projects.slug, slug),
		});

		if (existing) {
			let suffix = 2;
			while (true) {
				const candidate = `${slug}-${suffix}`;
				const found = await db.query.projects.findFirst({
					where: eq(projects.slug, candidate),
				});
				if (!found) {
					slug = candidate;
					break;
				}
				suffix++;
			}
		}

		const projectId = crypto.randomUUID();
		const memberId = crypto.randomUUID();

		await db.batch([
			db.insert(projects).values({
				id: projectId,
				name: parsed.name,
				slug,
				description: parsed.description ?? null,
				url: parsed.url ?? null,
				logoUrl: parsed.logoUrl ?? null,
				category: parsed.category,
				status: parsed.status,
				tags: parsed.tags ?? null,
			}),
			db.insert(projectMembers).values({
				id: memberId,
				projectId,
				userId: session.user.id,
				role: "owner",
			}),
		]);

		return { id: projectId, slug };
	},
);

export const updateProject = createServerFn({ method: "POST" }).handler(
	async ({
		data,
	}: { data: { projectId: string; updates: UpdateProjectInput } }) => {
		const parsed = updateProjectSchema.parse(data.updates);
		const session = await ensureSession();
		const db = getDb();

		const membership = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, data.projectId),
				eq(projectMembers.userId, session.user.id),
				eq(projectMembers.role, "owner"),
			),
		});

		if (!membership) {
			throw new Error("Apenas o dono pode editar o projeto");
		}

		await db
			.update(projects)
			.set({
				name: parsed.name,
				description: parsed.description ?? null,
				url: parsed.url ?? null,
				logoUrl: parsed.logoUrl ?? null,
				category: parsed.category,
				status: parsed.status,
				tags: parsed.tags ?? null,
			})
			.where(eq(projects.id, data.projectId));

		return { success: true };
	},
);

export const deleteProject = createServerFn({ method: "POST" }).handler(
	async ({ data: projectId }: { data: string }) => {
		const session = await ensureSession();
		const db = getDb();

		const membership = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, projectId),
				eq(projectMembers.userId, session.user.id),
				eq(projectMembers.role, "owner"),
			),
		});

		if (!membership) {
			throw new Error("Apenas o dono pode excluir o projeto");
		}

		await db.delete(projects).where(eq(projects.id, projectId));

		return { success: true };
	},
);

export const getProjectBySlug = createServerFn({ method: "GET" }).handler(
	async ({ data: slug }: { data: string }) => {
		const db = getDb();

		const project = await db.query.projects.findFirst({
			where: eq(projects.slug, slug),
			with: {
				members: true,
			},
		});

		if (!project) return null;

		const memberUserIds = project.members.map((m) => m.userId);

		let profiles: {
			userId: string;
			username: string;
			displayName: string | null;
			avatarUrl: string | null;
		}[] = [];

		if (memberUserIds.length > 0) {
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
						memberUserIds.map((id) => sql`${id}`),
						sql`, `,
					)})`,
				);
		}

		const profileMap = new Map(profiles.map((p) => [p.userId, p]));

		const membersWithProfiles = project.members.map((m) => ({
			...m,
			profile: profileMap.get(m.userId) ?? null,
		}));

		return {
			...project,
			members: membersWithProfiles,
		};
	},
);

export const listProjects = createServerFn({ method: "GET" }).handler(
	async ({ data }: { data: ProjectFilters }) => {
		const parsed = projectFiltersSchema.parse(data);
		const db = getDb();

		const conditions = [];

		if (parsed.category) {
			conditions.push(eq(projects.category, parsed.category));
		}

		if (parsed.status) {
			conditions.push(eq(projects.status, parsed.status));
		}

		if (parsed.search) {
			conditions.push(like(projects.name, `%${parsed.search}%`));
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [projectList, totalResult] = await Promise.all([
			db.query.projects.findMany({
				where,
				orderBy: [desc(projects.createdAt)],
				limit: parsed.pageSize,
				offset: (parsed.page - 1) * parsed.pageSize,
			}),
			db
				.select({ total: count() })
				.from(projects)
				.where(where ?? sql`1=1`),
		]);

		return {
			projects: projectList,
			total: totalResult[0]?.total ?? 0,
			page: parsed.page,
			pageSize: parsed.pageSize,
		};
	},
);

export const addContributor = createServerFn({ method: "POST" }).handler(
	async ({
		data,
	}: { data: { projectId: string; contributorUserId: string } }) => {
		const session = await ensureSession();
		const db = getDb();

		const membership = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, data.projectId),
				eq(projectMembers.userId, session.user.id),
				eq(projectMembers.role, "owner"),
			),
		});

		if (!membership) {
			throw new Error("Apenas o dono pode adicionar colaboradores");
		}

		const existing = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, data.projectId),
				eq(projectMembers.userId, data.contributorUserId),
			),
		});

		if (existing) {
			throw new Error("Usuario ja e membro deste projeto");
		}

		const id = crypto.randomUUID();
		await db.insert(projectMembers).values({
			id,
			projectId: data.projectId,
			userId: data.contributorUserId,
			role: "contributor",
		});

		return { success: true };
	},
);

export const removeContributor = createServerFn({ method: "POST" }).handler(
	async ({
		data,
	}: { data: { projectId: string; contributorUserId: string } }) => {
		const session = await ensureSession();
		const db = getDb();

		const isOwner = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, data.projectId),
				eq(projectMembers.userId, session.user.id),
				eq(projectMembers.role, "owner"),
			),
		});

		const isSelfRemoval = session.user.id === data.contributorUserId;

		if (!isOwner && !isSelfRemoval) {
			throw new Error("Sem permissao para remover este colaborador");
		}

		const member = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, data.projectId),
				eq(projectMembers.userId, data.contributorUserId),
				eq(projectMembers.role, "contributor"),
			),
		});

		if (!member) {
			throw new Error("Colaborador nao encontrado");
		}

		await db
			.delete(projectMembers)
			.where(eq(projectMembers.id, member.id));

		return { success: true };
	},
);

export const searchUsersByUsername = createServerFn({ method: "GET" }).handler(
	async ({ data: query }: { data: string }) => {
		await ensureSession();
		const db = getDb();

		if (!query || query.length < 2) return [];

		const results = await db
			.select({
				userId: profile.userId,
				username: profile.username,
				displayName: profile.displayName,
				avatarUrl: profile.avatarUrl,
			})
			.from(profile)
			.where(like(profile.username, `%${query}%`))
			.limit(10);

		return results;
	},
);

export const getProjectsByUserId = createServerFn({ method: "GET" }).handler(
	async ({ data: userId }: { data: string }) => {
		const db = getDb();

		const memberships = await db.query.projectMembers.findMany({
			where: eq(projectMembers.userId, userId),
			with: {
				project: true,
			},
		});

		return memberships.map((m) => ({
			...m.project,
			role: m.role,
		}));
	},
);
