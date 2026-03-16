import {
	createFileRoute,
	notFound,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EventForm } from "@/components/event-form";
import { H1, P } from "@/components/ui/typography";
import { getEventById, updateEvent } from "@/data/services/event";
import { getProfileByUserId } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/events/$id/editar/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}
		return { session };
	},
	loader: async ({ params, context }) => {
		const event = await getEventById({ data: params.id });
		if (!event) {
			throw notFound();
		}

		const userId = (context as { session: { user: { id: string } } })
			.session.user.id;
		const userProfile = await getProfileByUserId({ data: userId });
		const userRole = userProfile?.role ?? "member";

		const isAuthor = event.submittedBy === userId;
		const isModAdmin = userRole === "moderator" || userRole === "admin";

		if (!isModAdmin && !(isAuthor && event.status === "rejected")) {
			throw redirect({ to: "/events/$id", params: { id: params.id } });
		}

		return { event, userRole, isAuthor };
	},
	component: EditEventPage,
});

function EditEventPage() {
	const { userRole } = Route.useRouteContext();
	const { event } = Route.useLoaderData();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const canSetPartner = userRole === "moderator" || userRole === "admin";

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-24">
			<div className="mb-8 text-center">
				<H1>Editar evento</H1>
				<P className="text-muted-foreground">
					{event.status === "rejected"
						? "Corrija o evento e resubmeta para aprovacao."
						: "Atualize as informacoes do evento."}
				</P>
			</div>

			<EventForm
				mode="edit"
				canSetPartner={canSetPartner}
				defaultValues={{
					name: event.name,
					description: event.description,
					date: new Date(event.date),
					format: event.format as "presencial" | "digital",
					address: event.address,
					accessLink: event.accessLink,
					eventLink: event.eventLink,
					bannerUrl: event.bannerUrl,
					organizerName: event.organizerName,
					isPartner: event.isPartner,
				}}
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						await updateEvent({
							data: { eventId: event.id, updates: data },
						});
						toast.success(
							event.status === "rejected"
								? "Evento resubmetido para aprovacao"
								: "Evento atualizado com sucesso",
						);
						navigate({
							to: "/events/$id",
							params: { id: event.id },
						});
					} catch (error) {
						toast.error(
							error instanceof Error
								? error.message
								: "Erro ao salvar evento",
						);
						setIsSubmitting(false);
					}
				}}
				isSubmitting={isSubmitting}
			/>
		</main>
	);
}
