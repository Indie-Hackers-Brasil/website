import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AtSign, Github, Globe, Linkedin, Pencil, Plus, Twitter } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H1, Muted, P } from "@/components/ui/typography";
import { getProfileByUsername } from "@/data/services/profile";
import { getProjectsByUserId } from "@/data/services/project";
import { authClient } from "@/lib/auth/client";
import { INTEREST_LABELS } from "@/lib/validations/profile";
import type { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/validations/project";

export const Route = createFileRoute("/u/$username/")({
	loader: async ({ params }) => {
		const profileData = await getProfileByUsername({
			data: params.username,
		});
		if (!profileData) {
			throw notFound();
		}
		const userProjects = await getProjectsByUserId({
			data: profileData.userId,
		});
		return { profile: profileData, projects: userProjects };
	},
	component: ProfilePage,
	notFoundComponent: ProfileNotFound,
});

function ProfileNotFound() {
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8 text-center">
			<H1>Perfil nao encontrado</H1>
			<P className="text-muted-foreground">
				O usuario que voce procura nao existe.
			</P>
			<Button asChild className="mt-4">
				<Link to="/">Voltar para o inicio</Link>
			</Button>
		</main>
	);
}

function ProfilePage() {
	const { profile, projects } = Route.useLoaderData();
	const { data: session } = authClient.useSession();

	const isOwnProfile = session?.user?.id === profile.userId;
	const displayName = profile.displayName || profile.username;
	const interests = (profile.interests ?? []) as string[];

	const links = [
		{
			icon: Globe,
			value: profile.website,
			href: profile.website,
			label: "Site",
		},
		{
			icon: Github,
			value: profile.github,
			href: `https://github.com/${profile.github}`,
			label: "GitHub",
		},
		{
			icon: Twitter,
			value: profile.twitter,
			href: `https://x.com/${profile.twitter}`,
			label: "X / Twitter",
		},
		{
			icon: Linkedin,
			value: profile.linkedin,
			href: profile.linkedin,
			label: "LinkedIn",
		},
	].filter(
		(link): link is typeof link & { value: string; href: string } =>
			!!link.value,
	);

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8">
			<div className="flex items-start gap-6">
				<Avatar className="size-20">
					<AvatarImage src={profile.avatarUrl ?? undefined} alt={displayName} />
					<AvatarFallback className="text-2xl">
						{displayName[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="flex items-center gap-3">
						<H1 className="text-2xl">{displayName}</H1>
						{isOwnProfile && (
							<Button variant="outline" size="sm" asChild>
								<Link to="/configuracoes">
									<Pencil className="size-3.5" />
									Editar perfil
								</Link>
							</Button>
						)}
					</div>
					<p className="flex items-center gap-1 text-sm text-muted-foreground">
						<AtSign className="size-3.5" />
						{profile.username}
					</p>
					{profile.bio && <P className="mt-2">{profile.bio}</P>}
				</div>
			</div>

			{links.length > 0 && (
				<>
					<Separator className="my-6" />
					<div className="flex flex-wrap gap-3">
						{links.map((link) => (
							<Button key={link.label} variant="outline" size="sm" asChild>
								<a href={link.href} target="_blank" rel="noopener noreferrer">
									<link.icon className="size-4" />
									{link.label}
								</a>
							</Button>
						))}
					</div>
				</>
			)}

			{interests.length > 0 && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Areas de interesse</Muted>
						<div className="flex flex-wrap gap-2">
							{interests.map((interest) => (
								<Badge key={interest} variant="secondary">
									{INTEREST_LABELS[interest as keyof typeof INTEREST_LABELS] ??
										interest}
								</Badge>
							))}
						</div>
					</div>
				</>
			)}

			<Separator className="my-6" />
			<div>
				<Muted className="mb-3">Projetos</Muted>
				{projects.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2">
						{projects.map((project) => (
							<ProjectCard
								key={project.id}
								slug={project.slug}
								name={project.name}
								description={project.description}
								logoUrl={project.logoUrl}
								category={project.category as (typeof PROJECT_CATEGORIES)[number]}
								status={project.status as (typeof PROJECT_STATUSES)[number]}
							/>
						))}
					</div>
				) : (
					<div>
						<P className="text-sm text-muted-foreground">
							Nenhum projeto ainda.
						</P>
						{isOwnProfile && (
							<Button asChild size="sm" variant="outline" className="mt-2">
								<Link to="/projects/novo">
									<Plus className="size-3.5" />
									Criar projeto
								</Link>
							</Button>
						)}
					</div>
				)}
			</div>

			{!session && (
				<div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
					<P className="font-medium">
						Faca parte da comunidade Indie Hacking Brasil
					</P>
					<Muted>
						Entre para ver mais detalhes e interagir com outros membros.
					</Muted>
				</div>
			)}
		</main>
	);
}
