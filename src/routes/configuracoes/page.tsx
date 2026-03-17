import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/ui/typography";
import { getCurrentUserProfile, updateProfile } from "@/data/services/profile";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/configuracoes/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}
		return { session };
	},
	loader: async () => {
		const userProfile = await getCurrentUserProfile();
		if (!userProfile) {
			throw redirect({ to: "/onboarding" });
		}
		return { profile: userProfile };
	},
	component: SettingsPage,
});

function SettingsPage() {
	const { profile } = Route.useLoaderData();
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<H1 className="text-2xl">Configuracoes</H1>
					<Muted>Edite as informacoes do seu perfil.</Muted>
				</div>
				<Button variant="outline" size="sm" asChild>
					<Link to="/u/$username" params={{ username: profile.username }}>
						<ExternalLink className="size-3.5" />
						Ver meu perfil
					</Link>
				</Button>
			</div>

			<div className="mb-6 rounded-md border bg-muted/50 px-4 py-3">
				<Muted>
					Username:{" "}
					<span className="font-medium text-foreground">
						@{profile.username}
					</span>
				</Muted>
			</div>

			<ProfileForm
				mode="edit"
				defaultValues={{
					displayName: profile.displayName,
					bio: profile.bio,
					avatarUrl: profile.avatarUrl,
					website: profile.website,
					github: profile.github,
					twitter: profile.twitter,
					linkedin: profile.linkedin,
					interests: (profile.interests ?? []) as string[],
				}}
				isSubmitting={isSubmitting}
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						await updateProfile({ data });
						toast.success("Perfil atualizado com sucesso!");
					} catch (error) {
						toast.error("Erro ao atualizar perfil.");
						throw error;
					} finally {
						setIsSubmitting(false);
					}
				}}
			/>
		</main>
	);
}
