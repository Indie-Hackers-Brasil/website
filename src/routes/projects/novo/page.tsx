import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProjectForm } from "@/components/project-form";
import { H1, P } from "@/components/ui/typography";
import { createProject } from "@/data/services/project";
import { getProfileByUserId } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/projects/novo/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}

		const userProfile = await getProfileByUserId({ data: session.user.id });
		if (!userProfile?.isOnboardingComplete) {
			throw redirect({ to: "/onboarding" });
		}

		return { session };
	},
	component: NewProjectPage,
});

function NewProjectPage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-24">
			<div className="mb-8 text-center">
				<H1>Criar projeto</H1>
				<P className="text-muted-foreground">
					Publique seu projeto para a comunidade conhecer.
				</P>
			</div>

			<ProjectForm
				mode="create"
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						const result = await createProject({ data });
						navigate({
							to: "/projects/$slug",
							params: { slug: result.slug },
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
