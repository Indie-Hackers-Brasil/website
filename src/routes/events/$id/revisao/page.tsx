import {
	createFileRoute,
	Link,
	notFound,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { EventFormatBadge } from "@/components/event-format-badge";
import { EventPartnerBadge } from "@/components/event-partner-badge";
import { EventReviewPanel } from "@/components/event-review-panel";
import { EventStatusBadge } from "@/components/event-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { H1, Muted, P } from "@/components/ui/typography";
import {
	approveEvent,
	getEventById,
	rejectEvent,
} from "@/data/services/event";
import { getProfileByUserId } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";
import { formatEventDateLong } from "@/lib/utils";
import type { EVENT_FORMATS, EVENT_STATUSES } from "@/lib/validations/event";

export const Route = createFileRoute("/events/$id/revisao/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}

		const userProfile = await getProfileByUserId({
			data: session.user.id,
		});
		const userRole = userProfile?.role ?? "member";

		if (userRole !== "moderator" && userRole !== "admin") {
			throw redirect({ to: "/events" });
		}

		return { session, userRole };
	},
	loader: async ({ params }) => {
		const event = await getEventById({ data: params.id });
		if (!event) {
			throw notFound();
		}
		return { event };
	},
	component: EventReviewPage,
});

function EventReviewPage() {
	const { event } = Route.useLoaderData();
	const navigate = useNavigate();

	const handleApprove = async () => {
		await approveEvent({ data: event.id });
		toast.success("Evento aprovado com sucesso");
		navigate({ to: "/events/$id", params: { id: event.id } });
	};

	const handleReject = async (reason?: string) => {
		await rejectEvent({
			data: { eventId: event.id, reason },
		});
		toast.success("Evento rejeitado");
		navigate({ to: "/events" });
	};

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-24">
			<div className="mb-6">
				<Muted className="mb-2">Revisao de evento</Muted>
				<H1 className="text-2xl">Revisar: {event.name}</H1>
			</div>

			<EventStatusBadge
				status={event.status as (typeof EVENT_STATUSES)[number]}
			/>

			{event.bannerUrl && (
				<div className="mt-4 overflow-hidden rounded-lg">
					<img
						src={event.bannerUrl}
						alt={event.name}
						className="h-48 w-full object-cover"
					/>
				</div>
			)}

			<Separator className="my-6" />

			<div className="space-y-4">
				<div>
					<Muted>Data e horario</Muted>
					<P>{formatEventDateLong(new Date(event.date))}</P>
				</div>

				<div className="flex flex-wrap gap-2">
					<EventFormatBadge
						format={event.format as (typeof EVENT_FORMATS)[number]}
					/>
					<EventPartnerBadge isPartner={event.isPartner} />
				</div>

				{event.description && (
					<div>
						<Muted>Descricao</Muted>
						<P className="whitespace-pre-wrap">{event.description}</P>
					</div>
				)}

				{event.format === "presencial" && event.address && (
					<div>
						<Muted>Local</Muted>
						<P>{event.address}</P>
					</div>
				)}

				{event.format === "digital" && event.accessLink && (
					<div>
						<Muted>Link de acesso</Muted>
						<a
							href={event.accessLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary underline"
						>
							{event.accessLink}
						</a>
					</div>
				)}

				{event.eventLink && (
					<div>
						<Muted>Pagina oficial</Muted>
						<a
							href={event.eventLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary underline"
						>
							{event.eventLink}
						</a>
					</div>
				)}

				<div>
					<Muted>Organizador</Muted>
					<P>{event.organizerName}</P>
				</div>
			</div>

			{event.submitterProfile && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Submetido por</Muted>
						<Link
							to="/u/$username"
							params={{
								username: event.submitterProfile.username,
							}}
							className="flex items-center gap-3 hover:underline"
						>
							<Avatar className="size-8">
								<AvatarImage
									src={
										event.submitterProfile.avatarUrl ?? undefined
									}
									alt={event.submitterProfile.username}
								/>
								<AvatarFallback className="text-xs">
									{event.submitterProfile.username[0]?.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm">
								{event.submitterProfile.displayName ??
									event.submitterProfile.username}
							</span>
						</Link>
					</div>
				</>
			)}

			{event.status === "pending" && (
				<>
					<Separator className="my-6" />
					<EventReviewPanel
						onApprove={handleApprove}
						onReject={handleReject}
					/>
				</>
			)}
		</main>
	);
}
