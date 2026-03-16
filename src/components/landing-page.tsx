import { Link } from "@tanstack/react-router";
import {
	Calendar,
	Code,
	LogIn,
	Rocket,
	Users,
} from "lucide-react";
import { EventCard } from "@/components/event-card";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { H1, H2, P } from "@/components/ui/typography";
import { SITE } from "@/data/constants";
import { authClient } from "@/lib/auth/client";
import type { EVENT_FORMATS } from "@/lib/validations/event";
import type { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/validations/project";

interface ProjectData {
	slug: string;
	name: string;
	description: string | null;
	logoUrl: string | null;
	category: string;
	status: string;
}

interface EventData {
	id: string;
	name: string;
	date: Date;
	format: string;
	organizerName: string;
	isPartner: boolean;
}

interface LandingPageProps {
	projects: ProjectData[];
	events: EventData[];
	stats: {
		members: number;
		projects: number;
		events: number;
	};
}

export function LandingPage({ projects, events, stats }: LandingPageProps) {
	const handleSignIn = () => {
		authClient.signIn.social({
			provider: SITE.auth.provider,
			callbackURL: SITE.auth.callbackURL,
		});
	};

	return (
		<div className="space-y-16">
			{/* Hero */}
			<section className="text-center">
				<H1 className="text-4xl sm:text-5xl">Indie Hacking Brasil</H1>
				<P className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
					Comunidade brasileira com mais de 12 mil membros construindo
					produtos digitais — Apps, SaaS, Micro-SaaS e Startups. Networking,
					troca de conhecimento e Build In Public.
				</P>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
					<Button size="lg" onClick={handleSignIn}>
						<LogIn className="size-4" />
						Entrar com Discord
					</Button>
					<Button variant="outline" size="lg" asChild>
						<a
							href="https://discord.gg/indiehackersbrasil"
							target="_blank"
							rel="noopener noreferrer"
						>
							Conhecer a comunidade
						</a>
					</Button>
				</div>
			</section>

			{/* Community numbers */}
			<section>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div className="flex flex-col items-center rounded-lg border p-6">
						<Users className="mb-2 size-8 text-muted-foreground" />
						<span className="text-3xl font-bold">{stats.members}</span>
						<span className="text-sm text-muted-foreground">
							Membros
						</span>
					</div>
					<div className="flex flex-col items-center rounded-lg border p-6">
						<Rocket className="mb-2 size-8 text-muted-foreground" />
						<span className="text-3xl font-bold">{stats.projects}</span>
						<span className="text-sm text-muted-foreground">
							Projetos
						</span>
					</div>
					<div className="flex flex-col items-center rounded-lg border p-6">
						<Calendar className="mb-2 size-8 text-muted-foreground" />
						<span className="text-3xl font-bold">{stats.events}</span>
						<span className="text-sm text-muted-foreground">
							Eventos
						</span>
					</div>
				</div>
			</section>

			{/* Featured projects */}
			{projects.length > 0 && (
				<section>
					<div className="mb-6 flex items-center justify-between">
						<H2 className="text-xl">Projetos em destaque</H2>
						<Button variant="ghost" size="sm" asChild>
							<Link to="/projects">Ver todos</Link>
						</Button>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{projects.map((project) => (
							<ProjectCard
								key={project.slug}
								slug={project.slug}
								name={project.name}
								description={project.description}
								logoUrl={project.logoUrl}
								category={
									project.category as (typeof PROJECT_CATEGORIES)[number]
								}
								status={
									project.status as (typeof PROJECT_STATUSES)[number]
								}
							/>
						))}
					</div>
				</section>
			)}

			{/* Upcoming events */}
			{events.length > 0 && (
				<section>
					<div className="mb-6 flex items-center justify-between">
						<H2 className="text-xl">Proximos eventos</H2>
						<Button variant="ghost" size="sm" asChild>
							<Link to="/events">Ver todos</Link>
						</Button>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{events.map((event) => (
							<EventCard
								key={event.id}
								id={event.id}
								name={event.name}
								date={new Date(event.date)}
								format={
									event.format as (typeof EVENT_FORMATS)[number]
								}
								organizerName={event.organizerName}
								isPartner={event.isPartner}
							/>
						))}
					</div>
				</section>
			)}

			{/* Discord CTA */}
			<section className="rounded-lg border bg-muted/50 p-8 text-center">
				<Code className="mx-auto mb-3 size-10 text-muted-foreground" />
				<H2 className="text-xl">Junte-se ao Indie Hacking Brasil</H2>
				<P className="mx-auto mt-2 max-w-lg text-muted-foreground">
					Faca parte de uma comunidade ativa de indie hackers brasileiros.
					Compartilhe seus projetos, receba feedback e construa em publico.
				</P>
				<Button size="lg" className="mt-6" onClick={handleSignIn}>
					<LogIn className="size-4" />
					Entrar com Discord
				</Button>
			</section>
		</div>
	);
}
