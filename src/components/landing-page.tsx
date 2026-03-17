import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Calendar,
	Code,
	LogIn,
	Rocket,
	Users,
} from "lucide-react";
import { EventCard } from "@/components/event-card";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { H2, P } from "@/components/ui/typography";
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
		<div>
			{/* Hero Banner */}
			<section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 sm:py-24">
				<div className="mx-auto w-full max-w-6xl px-4 text-center">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						Construa em publico.
						<br />
						<span className="text-primary">Cresça junto.</span>
					</h1>
					<P className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
						Comunidade brasileira com mais de 12 mil membros construindo
						produtos digitais — Apps, SaaS, Micro-SaaS e Startups.
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

					{/* Mini stats inline */}
					<div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<Users className="size-4" />
							<span className="font-semibold text-foreground">
								{stats.members}
							</span>
							membros
						</div>
						<div className="flex items-center gap-1.5">
							<Rocket className="size-4" />
							<span className="font-semibold text-foreground">
								{stats.projects}
							</span>
							projetos
						</div>
						<div className="flex items-center gap-1.5">
							<Calendar className="size-4" />
							<span className="font-semibold text-foreground">
								{stats.events}
							</span>
							eventos
						</div>
					</div>
				</div>
			</section>

			{/* Featured projects */}
			{projects.length > 0 && (
				<section className="mx-auto w-full max-w-6xl px-4 py-12">
					<div className="mb-6 flex items-center justify-between">
						<H2 className="text-xl">Ultimos projetos</H2>
						<Button variant="ghost" size="sm" asChild>
							<Link to="/projects">
								Ver todos
								<ArrowRight className="size-4" />
							</Link>
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

			{/* Discord CTA */}
			<section className="border-y bg-muted/30 py-12">
				<div className="mx-auto w-full max-w-6xl px-4 text-center">
					<Code className="mx-auto mb-3 size-10 text-primary" />
					<H2 className="text-xl">Junte-se ao Indie Hacking Brasil</H2>
					<P className="mx-auto mt-2 max-w-lg text-muted-foreground">
						Faca parte de uma comunidade ativa de indie hackers brasileiros.
						Compartilhe seus projetos, receba feedback e construa em publico.
					</P>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
								Acessar o servidor
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Upcoming events */}
			{events.length > 0 && (
				<section className="mx-auto w-full max-w-6xl px-4 py-12">
					<div className="mb-6 flex items-center justify-between">
						<H2 className="text-xl">Proximos eventos</H2>
						<Button variant="ghost" size="sm" asChild>
							<Link to="/events">
								Ver todos
								<ArrowRight className="size-4" />
							</Link>
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
		</div>
	);
}
