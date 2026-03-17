import {
	createFileRoute,
	Link,
	notFound,
	useNavigate,
} from "@tanstack/react-router";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EventFormatBadge } from "@/components/event-format-badge";
import { EventPartnerBadge } from "@/components/event-partner-badge";
import { EventRejectionNotice } from "@/components/event-rejection-notice";
import { EventStatusBadge } from "@/components/event-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { H1, Muted, P } from "@/components/ui/typography";
import { deleteEvent, getEventById } from "@/data/services/event";
import { getProfileByUserId } from "@/data/services/profile";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";
import { formatEventDateLong } from "@/lib/utils";
import type { EVENT_FORMATS, EVENT_STATUSES } from "@/lib/validations/event";

export const Route = createFileRoute("/events/$id/")({
	beforeLoad: async () => {
		const session = await getSession();
		let userRole = "visitor";
		if (session) {
			const userProfile = await getProfileByUserId({
				data: session.user.id,
			});
			userRole = userProfile?.role ?? "member";
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
	component: EventDetailPage,
	notFoundComponent: EventNotFound,
});

function EventNotFound() {
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8 text-center">
			<H1>Evento nao encontrado</H1>
			<P className="text-muted-foreground">
				O evento que voce procura nao existe ou nao esta disponivel.
			</P>
			<Button asChild className="mt-4">
				<Link to="/events">Voltar para eventos</Link>
			</Button>
		</main>
	);
}

function EventDetailPage() {
	const { session, userRole } = Route.useRouteContext();
	const { event } = Route.useLoaderData();
	const { data: clientSession } = authClient.useSession();
	const navigate = useNavigate();

	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const currentUserId = session?.user?.id ?? clientSession?.user?.id ?? null;
	const isAuthor = currentUserId === event.submittedBy;
	const isModAdmin = userRole === "moderator" || userRole === "admin";

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteEvent({ data: event.id });
			toast.success("Evento excluido com sucesso");
			navigate({ to: "/events" });
		} catch {
			toast.error("Erro ao excluir evento");
			setIsDeleting(false);
		}
	};

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8">
			{event.bannerUrl && (
				<div className="mb-6 overflow-hidden rounded-lg">
					<img
						src={event.bannerUrl}
						alt={event.name}
						className="h-48 w-full object-cover"
					/>
				</div>
			)}

			{event.status !== "approved" && (isAuthor || isModAdmin) && (
				<div className="mb-4">
					<EventStatusBadge
						status={event.status as (typeof EVENT_STATUSES)[number]}
					/>
				</div>
			)}

			<div className="flex items-start gap-4">
				<div className="flex-1">
					<H1 className="text-2xl">{event.name}</H1>
					<p className="mt-1 text-muted-foreground">
						{formatEventDateLong(new Date(event.date))}
					</p>
					<div className="mt-3 flex flex-wrap gap-2">
						<EventFormatBadge
							format={event.format as (typeof EVENT_FORMATS)[number]}
						/>
						<EventPartnerBadge isPartner={event.isPartner} />
					</div>
				</div>
			</div>

			{(isModAdmin || event.eventLink) && (
				<div className="mt-4 flex flex-wrap gap-2">
					{event.eventLink && (
						<Button variant="outline" size="sm" asChild>
							<a
								href={event.eventLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="size-3.5" />
								Ver pagina oficial
							</a>
						</Button>
					)}
					{isModAdmin && (
						<>
							<Button variant="outline" size="sm" asChild>
								<Link
									to="/events/$id/editar"
									params={{ id: event.id }}
								>
									<Pencil className="size-3.5" />
									Editar
								</Link>
							</Button>
							{event.status === "pending" && (
								<Button variant="outline" size="sm" asChild>
									<Link
										to="/events/$id/revisao"
										params={{ id: event.id }}
									>
										<Eye className="size-3.5" />
										Revisar
									</Link>
								</Button>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="size-3.5" />
								Excluir
							</Button>
						</>
					)}
				</div>
			)}

			{event.description && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Descricao</Muted>
						<P className="whitespace-pre-wrap">{event.description}</P>
					</div>
				</>
			)}

			{event.format === "presencial" && event.address && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Local</Muted>
						<P>{event.address}</P>
					</div>
				</>
			)}

			{event.format === "digital" && event.accessLink && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Link de acesso</Muted>
						<a
							href={event.accessLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary underline"
						>
							{event.accessLink}
						</a>
					</div>
				</>
			)}

			<Separator className="my-6" />
			<div>
				<Muted className="mb-3">Organizador</Muted>
				<P>{event.organizerName}</P>
			</div>

			{event.submitterProfile && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Submetido por</Muted>
						<Link
							to="/u/$username"
							params={{ username: event.submitterProfile.username }}
							className="flex items-center gap-3 hover:underline"
						>
							<Avatar className="size-8">
								<AvatarImage
									src={event.submitterProfile.avatarUrl ?? undefined}
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

			{event.status === "rejected" && isAuthor && (
				<>
					<Separator className="my-6" />
					<EventRejectionNotice
						rejectionReason={event.rejectionReason}
						eventId={event.id}
					/>
				</>
			)}

			{!currentUserId && (
				<div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
					<P className="font-medium">
						Faca parte da comunidade Indie Hacking Brasil
					</P>
					<Muted>
						Entre para criar e interagir com eventos.
					</Muted>
				</div>
			)}

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Excluir evento</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja excluir "{event.name}"? Esta acao nao
							pode ser desfeita.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Excluindo..." : "Excluir"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
