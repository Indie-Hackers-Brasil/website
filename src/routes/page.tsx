import { createFileRoute, redirect } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { H1, P } from "@/components/ui/typography";
import { SITE } from "@/data/constants";
import { getProfileByUserId } from "@/data/services/profile";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			const userProfile = await getProfileByUserId({
				data: session.user.id,
			});
			if (!userProfile || !userProfile.isOnboardingComplete) {
				throw redirect({ to: "/onboarding" });
			}
		}
		return { session };
	},
	component: App,
});

function App() {
	const { data: session, isPending } = authClient.useSession();

	const handleSignIn = () => {
		authClient.signIn.social({
			provider: SITE.auth.provider,
			callbackURL: SITE.auth.callbackURL,
		});
	};

	const handleSignOut = () => {
		authClient.signOut();
	};

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-24">
			<H1 className="text-center">Indie Hacking Brasil</H1>
			<P className="text-center">Estamos em construcao</P>

			{isPending ? (
				<span className="inline-flex sm:ml-auto">Carregando...</span>
			) : (
				<button
					type="button"
					onClick={session ? handleSignOut : handleSignIn}
					className="inline-flex cursor-pointer items-center justify-center gap-1 sm:ml-auto"
				>
					{session ? "Deslogar" : "Acessar"}
					{session ? <LogOut size={16} /> : <LogIn size={16} />}
				</button>
			)}
		</main>
	);
}
