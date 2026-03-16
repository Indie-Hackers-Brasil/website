import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt, lte, or, sql } from "drizzle-orm";
import { ensureSession, getSession } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { events, profile } from "@/lib/db/schema";
import {
	type CreateEventInput,
	type UpdateEventInput,
	createEventSchema,
	updateEventSchema,
} from "@/lib/validations/event";

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

export const createEvent = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: CreateEventInput }) => {
		const parsed = createEventSchema.parse(data);
		const session = await ensureSession();
		const db = getDb();

		const userProfile = await db.query.profile.findFirst({
			where: eq(profile.userId, session.user.id),
			columns: { isOnboardingComplete: true },
		});

		if (!userProfile?.isOnboardingComplete) {
			throw new Error("Perfil incompleto");
		}

		const id = crypto.randomUUID();
		await db.insert(events).values({
			id,
			name: parsed.name,
			description: parsed.description ?? null,
			date: parsed.date,
			format: parsed.format,
			address: parsed.address ?? null,
			accessLink: parsed.accessLink ?? null,
			eventLink: parsed.eventLink,
			bannerUrl: parsed.bannerUrl ?? null,
			organizerName: parsed.organizerName,
			isPartner: parsed.isPartner,
			status: "pending",
			submittedBy: session.user.id,
		});

		return { id };
	},
);

export const updateEvent = createServerFn({ method: "POST" }).handler(
	async ({
		data,
	}: { data: { eventId: string; updates: UpdateEventInput } }) => {
		const parsed = updateEventSchema.parse(data.updates);
		const session = await ensureSession();
		const db = getDb();

		const event = await db.query.events.findFirst({
			where: eq(events.id, data.eventId),
		});

		if (!event) {
			throw new Error("Evento nao encontrado");
		}

		const role = await getUserRole(db, session.user.id);
		const isAuthor = event.submittedBy === session.user.id;

		if (!isMod(role) && !(isAuthor && event.status === "rejected")) {
			throw new Error("Sem permissao para editar este evento");
		}

		const updateData: Record<string, unknown> = {
			name: parsed.name,
			description: parsed.description ?? null,
			date: parsed.date,
			format: parsed.format,
			address: parsed.address ?? null,
			accessLink: parsed.accessLink ?? null,
			eventLink: parsed.eventLink,
			bannerUrl: parsed.bannerUrl ?? null,
			organizerName: parsed.organizerName,
			isPartner: parsed.isPartner,
		};

		if (isAuthor && event.status === "rejected") {
			updateData.status = "pending";
			updateData.rejectionReason = null;
			updateData.reviewedBy = null;
			updateData.reviewedAt = null;
		}

		await db
			.update(events)
			.set(updateData)
			.where(eq(events.id, data.eventId));

		return { success: true };
	},
);

export const deleteEvent = createServerFn({ method: "POST" }).handler(
	async ({ data: eventId }: { data: string }) => {
		const session = await ensureSession();
		const db = getDb();

		const role = await getUserRole(db, session.user.id);
		if (!isMod(role)) {
			throw new Error("Apenas moderadores e admins podem excluir eventos");
		}

		await db.delete(events).where(eq(events.id, eventId));

		return { success: true };
	},
);

export const approveEvent = createServerFn({ method: "POST" }).handler(
	async ({ data: eventId }: { data: string }) => {
		const session = await ensureSession();
		const db = getDb();

		const role = await getUserRole(db, session.user.id);
		if (!isMod(role)) {
			throw new Error("Apenas moderadores e admins podem aprovar eventos");
		}

		const event = await db.query.events.findFirst({
			where: eq(events.id, eventId),
		});

		if (!event) {
			throw new Error("Evento nao encontrado");
		}

		if (event.status !== "pending") {
			throw new Error("Apenas eventos pendentes podem ser aprovados");
		}

		await db
			.update(events)
			.set({
				status: "approved",
				reviewedBy: session.user.id,
				reviewedAt: new Date(),
			})
			.where(eq(events.id, eventId));

		return { success: true };
	},
);

export const rejectEvent = createServerFn({ method: "POST" }).handler(
	async ({
		data,
	}: { data: { eventId: string; reason?: string } }) => {
		const session = await ensureSession();
		const db = getDb();

		const role = await getUserRole(db, session.user.id);
		if (!isMod(role)) {
			throw new Error("Apenas moderadores e admins podem rejeitar eventos");
		}

		const event = await db.query.events.findFirst({
			where: eq(events.id, data.eventId),
		});

		if (!event) {
			throw new Error("Evento nao encontrado");
		}

		if (event.status !== "pending") {
			throw new Error("Apenas eventos pendentes podem ser rejeitados");
		}

		await db
			.update(events)
			.set({
				status: "rejected",
				rejectionReason: data.reason ?? null,
				reviewedBy: session.user.id,
				reviewedAt: new Date(),
			})
			.where(eq(events.id, data.eventId));

		return { success: true };
	},
);

export const resubmitEvent = createServerFn({ method: "POST" }).handler(
	async ({ data: eventId }: { data: string }) => {
		const session = await ensureSession();
		const db = getDb();

		const event = await db.query.events.findFirst({
			where: eq(events.id, eventId),
		});

		if (!event) {
			throw new Error("Evento nao encontrado");
		}

		if (event.submittedBy !== session.user.id) {
			throw new Error("Apenas o autor pode resubmeter o evento");
		}

		if (event.status !== "rejected") {
			throw new Error("Apenas eventos rejeitados podem ser resubmetidos");
		}

		await db
			.update(events)
			.set({
				status: "pending",
				rejectionReason: null,
				reviewedBy: null,
				reviewedAt: null,
			})
			.where(eq(events.id, eventId));

		return { success: true };
	},
);

export const getEventById = createServerFn({ method: "GET" }).handler(
	async ({ data: eventId }: { data: string }) => {
		const session = await getSession();
		const db = getDb();

		const event = await db.query.events.findFirst({
			where: eq(events.id, eventId),
		});

		if (!event) return null;

		if (event.status !== "approved") {
			if (!session) return null;

			const isAuthor = event.submittedBy === session.user.id;
			const role = await getUserRole(db, session.user.id);

			if (!isAuthor && !isMod(role)) return null;
		}

		const submitterProfile = await db.query.profile.findFirst({
			where: eq(profile.userId, event.submittedBy),
			columns: {
				username: true,
				displayName: true,
				avatarUrl: true,
			},
		});

		return {
			...event,
			submitterProfile: submitterProfile ?? null,
		};
	},
);

export const listEvents = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await getSession();
		const db = getDb();

		let requesterRole = "visitor";
		const userId = session?.user?.id;

		if (userId) {
			requesterRole = await getUserRole(db, userId);
		}

		const now = new Date();

		let allEvents: (typeof events.$inferSelect)[];

		if (isMod(requesterRole)) {
			allEvents = await db.query.events.findMany({
				orderBy: (events, { asc, desc }) => [desc(events.createdAt)],
			});
		} else if (userId) {
			allEvents = await db.query.events.findMany({
				where: or(
					eq(events.status, "approved"),
					eq(events.submittedBy, userId),
				),
				orderBy: (events, { desc }) => [desc(events.createdAt)],
			});
		} else {
			allEvents = await db.query.events.findMany({
				where: eq(events.status, "approved"),
				orderBy: (events, { desc }) => [desc(events.createdAt)],
			});
		}

		const pending = allEvents
			.filter((e) => e.status === "pending")
			.sort(
				(a, b) =>
					(a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0),
			);

		const upcoming = allEvents
			.filter((e) => e.status === "approved" && e.date > now)
			.sort((a, b) => a.date.getTime() - b.date.getTime());

		const past = allEvents
			.filter((e) => e.status === "approved" && e.date <= now)
			.sort((a, b) => b.date.getTime() - a.date.getTime());

		const rejected = allEvents.filter((e) => e.status === "rejected");

		return { pending, upcoming, past, rejected, requesterRole };
	},
);
