import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { H1, P } from "@/components/ui/typography";
import { listProjects } from "@/data/services/project";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";
import {
	PROJECT_CATEGORIES,
	PROJECT_CATEGORY_LABELS,
	PROJECT_STATUSES,
	PROJECT_STATUS_LABELS,
} from "@/lib/validations/project";

export const Route = createFileRoute("/projects/")({
	beforeLoad: async () => {
		const session = await getSession();
		return { session };
	},
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const filters = {
			category: (deps as Record<string, string>).category || undefined,
			status: (deps as Record<string, string>).status || undefined,
			search: (deps as Record<string, string>).search || undefined,
			page: Number((deps as Record<string, string>).page) || 1,
			pageSize: 12,
		};
		const result = await listProjects({ data: filters });
		return { result, filters };
	},
	component: ProjectsPage,
});

function ProjectsPage() {
	const { session } = Route.useRouteContext();
	const { result, filters } = Route.useLoaderData();
	const { data: clientSession } = authClient.useSession();
	const navigate = useNavigate();

	const isAuthenticated = !!session || !!clientSession;

	const [searchInput, setSearchInput] = useState(filters.search ?? "");

	const updateFilters = (updates: Record<string, string | undefined>) => {
		const current = { ...filters, ...updates, page: 1 };
		const params: Record<string, string> = {};
		if (current.category) params.category = current.category;
		if (current.status) params.status = current.status;
		if (current.search) params.search = current.search;
		if (current.page && current.page > 1) params.page = String(current.page);
		navigate({ to: "/projects", search: params });
	};

	const totalPages = Math.ceil(result.total / result.pageSize);

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<H1 className="text-2xl">Projetos</H1>
					<P className="text-muted-foreground">
						Descubra o que a comunidade esta construindo
					</P>
				</div>
				{isAuthenticated && (
					<Button asChild>
						<Link to="/projects/novo">
							<Plus className="size-4" />
							Criar projeto
						</Link>
					</Button>
				)}
			</div>

			<div className="mb-6 flex flex-wrap gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Buscar projetos..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								updateFilters({ search: searchInput || undefined });
							}
						}}
						className="pl-9"
					/>
				</div>

				<Select
					value={filters.category ?? "all"}
					onValueChange={(val) =>
						updateFilters({
							category: val === "all" ? undefined : val,
						})
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Categoria" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todas categorias</SelectItem>
						{PROJECT_CATEGORIES.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{PROJECT_CATEGORY_LABELS[cat]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={filters.status ?? "all"}
					onValueChange={(val) =>
						updateFilters({
							status: val === "all" ? undefined : val,
						})
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos status</SelectItem>
						{PROJECT_STATUSES.map((s) => (
							<SelectItem key={s} value={s}>
								{PROJECT_STATUS_LABELS[s]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{result.projects.length > 0 ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{result.projects.map((project) => (
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

					{totalPages > 1 && (
						<div className="mt-8 flex justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={result.page <= 1}
								onClick={() =>
									updateFilters({ page: String(result.page - 1) })
								}
							>
								Anterior
							</Button>
							<span className="flex items-center px-3 text-sm text-muted-foreground">
								Pagina {result.page} de {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={result.page >= totalPages}
								onClick={() =>
									updateFilters({ page: String(result.page + 1) })
								}
							>
								Proxima
							</Button>
						</div>
					)}
				</>
			) : (
				<Empty>
					<EmptyTitle>Nenhum projeto encontrado</EmptyTitle>
					<EmptyDescription>
						{filters.search || filters.category || filters.status
							? "Tente ajustar os filtros de busca."
							: "Seja o primeiro a publicar um projeto!"}
					</EmptyDescription>
					{isAuthenticated &&
						!filters.search &&
						!filters.category &&
						!filters.status && (
							<Button asChild className="mt-4">
								<Link to="/projects/novo">
									<Plus className="size-4" />
									Criar projeto
								</Link>
							</Button>
						)}
				</Empty>
			)}

			{!isAuthenticated && (
				<div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
					<P className="font-medium">
						Faca parte da comunidade Indie Hacking Brasil
					</P>
					<P className="text-sm text-muted-foreground">
						Entre para criar e interagir com projetos.
					</P>
				</div>
			)}
		</main>
	);
}
