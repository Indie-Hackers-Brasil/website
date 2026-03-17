import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProfileForm } from "@/components/profile-form";
import { H1, P } from "@/components/ui/typography";
import {
	createProfile,
	getDiscordUsername,
	getProfileByUserId,
} from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/onboarding/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}

		const userProfile = await getProfileByUserId({ data: session.user.id });
		if (userProfile?.isOnboardingComplete) {
			throw redirect({ to: "/" });
		}

		return { session };
	},
	loader: async () => {
		const discordUsername = await getDiscordUsername();
		return { discordUsername };
	},
	component: OnboardingPage,
});

function OnboardingPage() {
	const { session } = Route.useRouteContext();
	const { discordUsername } = Route.useLoaderData();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-8">
			<div className="mb-8 text-center">
				<H1>Complete seu perfil</H1>
				<P className="text-muted-foreground">
					Preencha as informacoes abaixo para participar da comunidade.
				</P>
			</div>

			{!discordUsername && (
				<div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
					Nao foi possivel obter seu username do Discord. Tente fazer login
					novamente.
				</div>
			)}

			<ProfileForm
				mode="create"
				defaultValues={{
					username: discordUsername ?? "",
					displayName: session.user.name,
					avatarUrl: session.user.image,
				}}
				isSubmitting={isSubmitting}
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						await createProfile({ data });
						navigate({ to: "/" });
					} catch (error) {
						setIsSubmitting(false);
						throw error;
					}
				}}
			/>
		</main>
	);
}
