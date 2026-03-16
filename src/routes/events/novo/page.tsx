import {
	createFileRoute,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { EventForm } from "@/components/event-form";
import { H1, P } from "@/components/ui/typography";
import { createEvent } from "@/data/services/event";
import { getProfileByUserId } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/events/novo/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}

		const userProfile = await getProfileByUserId({
			data: session.user.id,
		});
		if (!userProfile?.isOnboardingComplete) {
			throw redirect({ to: "/onboarding" });
		}

		return { session, userProfile };
	},
	component: NewEventPage,
});

function NewEventPage() {
	const { userProfile } = Route.useRouteContext();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const canSetPartner =
		userProfile.role === "moderator" || userProfile.role === "admin";

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-24">
			<div className="mb-8 text-center">
				<H1>Criar evento</H1>
				<P className="text-muted-foreground">
					Submeta um evento para a comunidade. Ele sera revisado antes de
					ser publicado.
				</P>
			</div>

			<EventForm
				mode="create"
				canSetPartner={canSetPartner}
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						const result = await createEvent({ data });
						navigate({
							to: "/events/$id",
							params: { id: result.id },
						});
					} catch (error) {
						setIsSubmitting(false);
						throw error;
					}
				}}
				isSubmitting={isSubmitting}
			/>
		</main>
	);
}
