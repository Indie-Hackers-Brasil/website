import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Plus } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { H1, Muted, P } from "@/components/ui/typography";
import { listEvents } from "@/data/services/event";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";
import type { EVENT_FORMATS, EVENT_STATUSES } from "@/lib/validations/event";

export const Route = createFileRoute("/events/")({
	beforeLoad: async () => {
		const session = await getSession();
		return { session };
	},
	loader: async () => {
		const result = await listEvents();
		return { result };
	},
	component: EventsPage,
});

function EventsPage() {
	const { session } = Route.useRouteContext();
	const { result } = Route.useLoaderData();
	const { data: clientSession } = authClient.useSession();

	const isAuthenticated = !!session || !!clientSession;
	const isModerator =
		result.requesterRole === "moderator" ||
		result.requesterRole === "admin";

	const hasEvents =
		result.pending.length > 0 ||
		result.upcoming.length > 0 ||
		result.past.length > 0;

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<H1 className="text-2xl">Eventos</H1>
					<P className="text-muted-foreground">
						Descubra eventos da comunidade e parceiros
					</P>
				</div>
				{isAuthenticated && (
					<Button asChild>
						<Link to="/events/novo">
							<Plus className="size-4" />
							Criar evento
						</Link>
					</Button>
				)}
			</div>

			{isModerator && result.pending.length > 0 && (
				<section className="mb-8">
					<div className="mb-4 flex items-center gap-2">
						<h2 className="text-lg font-semibold">Fila de aprovacao</h2>
						<span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
							{result.pending.length}
						</span>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.pending.map((event) => (
							<EventCard
								key={event.id}
								id={event.id}
								name={event.name}
								date={new Date(event.date)}
								format={event.format as (typeof EVENT_FORMATS)[number]}
								organizerName={event.organizerName}
								isPartner={event.isPartner}
								status={event.status as (typeof EVENT_STATUSES)[number]}
								showStatus
							/>
						))}
					</div>
				</section>
			)}

			{result.rejected.length > 0 && (
				<section className="mb-8">
					<h2 className="mb-4 text-lg font-semibold">Seus eventos rejeitados</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.rejected.map((event) => (
							<EventCard
								key={event.id}
								id={event.id}
								name={event.name}
								date={new Date(event.date)}
								format={event.format as (typeof EVENT_FORMATS)[number]}
								organizerName={event.organizerName}
								isPartner={event.isPartner}
								status={event.status as (typeof EVENT_STATUSES)[number]}
								showStatus
							/>
						))}
					</div>
				</section>
			)}

			{result.upcoming.length > 0 && (
				<section className="mb-8">
					<h2 className="mb-4 text-lg font-semibold">Proximos eventos</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.upcoming.map((event) => (
							<EventCard
								key={event.id}
								id={event.id}
								name={event.name}
								date={new Date(event.date)}
								format={event.format as (typeof EVENT_FORMATS)[number]}
								organizerName={event.organizerName}
								isPartner={event.isPartner}
								status={
									isModerator
										? (event.status as (typeof EVENT_STATUSES)[number])
										: undefined
								}
								showStatus={isModerator}
							/>
						))}
					</div>
				</section>
			)}

			{result.past.length > 0 && (
				<section className="mb-8">
					<h2 className="mb-4 text-lg font-semibold">Eventos passados</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.past.map((event) => (
							<EventCard
								key={event.id}
								id={event.id}
								name={event.name}
								date={new Date(event.date)}
								format={event.format as (typeof EVENT_FORMATS)[number]}
								organizerName={event.organizerName}
								isPartner={event.isPartner}
								status={
									isModerator
										? (event.status as (typeof EVENT_STATUSES)[number])
										: undefined
								}
								showStatus={isModerator}
							/>
						))}
					</div>
				</section>
			)}

			{!hasEvents && (
				<Empty>
					<Calendar className="mx-auto mb-2 size-10 text-muted-foreground" />
					<EmptyTitle>Nenhum evento encontrado</EmptyTitle>
					<EmptyDescription>
						Seja o primeiro a divulgar um evento da comunidade!
					</EmptyDescription>
					{isAuthenticated && (
						<Button asChild className="mt-4">
							<Link to="/events/novo">
								<Plus className="size-4" />
								Criar evento
							</Link>
						</Button>
					)}
				</Empty>
			)}

			{!isAuthenticated && (
				<div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
					<P className="font-medium">
						Faca parte da comunidade Indie Hacking Brasil
					</P>
					<Muted>
						Entre para criar e divulgar eventos.
					</Muted>
				</div>
			)}
		</main>
	);
}
