import {
	createFileRoute,
	Link,
	notFound,
	useNavigate,
} from "@tanstack/react-router";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectCategoryBadge } from "@/components/project-category-badge";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import { TeamSection } from "@/components/team-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { H1, Muted, P } from "@/components/ui/typography";
import {
	addContributor,
	deleteProject,
	getProjectBySlug,
	removeContributor,
} from "@/data/services/project";
import { authClient } from "@/lib/auth/client";
import { getSession } from "@/lib/auth/server";
import {
	type PROJECT_CATEGORIES,
	type PROJECT_STATUSES,
} from "@/lib/validations/project";
import { TAG_LABELS, type TagOption } from "@/data/constants/tags";

export const Route = createFileRoute("/projects/$slug/")({
	beforeLoad: async () => {
		const session = await getSession();
		return { session };
	},
	loader: async ({ params }) => {
		const project = await getProjectBySlug({ data: params.slug });
		if (!project) {
			throw notFound();
		}
		return { project };
	},
	component: ProjectDetailPage,
	notFoundComponent: ProjectNotFound,
});

function ProjectNotFound() {
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8 text-center">
			<H1>Projeto nao encontrado</H1>
			<P className="text-muted-foreground">
				O projeto que voce procura nao existe.
			</P>
			<Button asChild className="mt-4">
				<Link to="/projects">Voltar para projetos</Link>
			</Button>
		</main>
	);
}

function ProjectDetailPage() {
	const { session } = Route.useRouteContext();
	const { project } = Route.useLoaderData();
	const { data: clientSession } = authClient.useSession();
	const navigate = useNavigate();

	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const currentUserId = session?.user?.id ?? clientSession?.user?.id ?? null;

	const isOwner = project.members.some(
		(m) => m.userId === currentUserId && m.role === "owner",
	);

	const isMember = project.members.some((m) => m.userId === currentUserId);

	const tags = (project.tags ?? []) as string[];

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteProject({ data: project.id });
			toast.success("Projeto excluido com sucesso");
			navigate({ to: "/projects" });
		} catch {
			toast.error("Erro ao excluir projeto");
			setIsDeleting(false);
		}
	};

	const handleAddContributor = async (userId: string) => {
		try {
			await addContributor({
				data: { projectId: project.id, contributorUserId: userId },
			});
			toast.success("Colaborador adicionado");
			navigate({
				to: "/projects/$slug",
				params: { slug: project.slug },
				reloadDocument: true,
			});
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Erro ao adicionar colaborador",
			);
		}
	};

	const handleRemoveContributor = async (userId: string) => {
		try {
			await removeContributor({
				data: { projectId: project.id, contributorUserId: userId },
			});
			toast.success(
				userId === currentUserId
					? "Voce saiu do projeto"
					: "Colaborador removido",
			);
			navigate({
				to: "/projects/$slug",
				params: { slug: project.slug },
				reloadDocument: true,
			});
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Erro ao remover colaborador",
			);
		}
	};

	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-8">
			<div className="flex items-start gap-6">
				<Avatar className="size-20 shrink-0">
					<AvatarImage
						src={project.logoUrl ?? undefined}
						alt={project.name}
					/>
					<AvatarFallback className="text-2xl">
						{project.name[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="flex items-center gap-3">
						<H1 className="text-2xl">{project.name}</H1>
					</div>
					<div className="mt-2 flex flex-wrap gap-2">
						<ProjectCategoryBadge
							category={
								project.category as (typeof PROJECT_CATEGORIES)[number]
							}
						/>
						<ProjectStatusBadge
							status={project.status as (typeof PROJECT_STATUSES)[number]}
						/>
					</div>
				</div>
			</div>

			{(isOwner || project.url) && (
				<div className="mt-4 flex flex-wrap gap-2">
					{project.url && (
						<Button variant="outline" size="sm" asChild>
							<a
								href={project.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="size-3.5" />
								Visitar projeto
							</a>
						</Button>
					)}
					{isOwner && (
						<>
							<Button variant="outline" size="sm" asChild>
								<Link
									to="/projects/$slug/editar"
									params={{ slug: project.slug }}
								>
									<Pencil className="size-3.5" />
									Editar
								</Link>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="size-3.5" />
								Excluir
							</Button>
						</>
					)}
				</div>
			)}

			{project.description && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Descricao</Muted>
						<P className="whitespace-pre-wrap">{project.description}</P>
					</div>
				</>
			)}

			{tags.length > 0 && (
				<>
					<Separator className="my-6" />
					<div>
						<Muted className="mb-3">Tags</Muted>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{TAG_LABELS[tag as TagOption] ?? tag}
								</Badge>
							))}
						</div>
					</div>
				</>
			)}

			<Separator className="my-6" />
			<TeamSection
				projectId={project.id}
				members={project.members}
				isOwner={isOwner}
				currentUserId={currentUserId}
				onAddContributor={handleAddContributor}
				onRemoveContributor={handleRemoveContributor}
			/>

			<Separator className="my-6" />
			<div>
				<Muted className="mb-3">Recomendacoes</Muted>
				<P className="text-sm text-muted-foreground">
					Em breve — disponivel na Fase 5.
				</P>
			</div>

			<Separator className="my-6" />
			<div>
				<Muted className="mb-3">Comentarios</Muted>
				<P className="text-sm text-muted-foreground">
					Em breve — disponivel na Fase 5.
				</P>
			</div>

			{!currentUserId && (
				<div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
					<P className="font-medium">
						Faca parte da comunidade Indie Hacking Brasil
					</P>
					<Muted>
						Entre para recomendar, comentar e interagir com projetos.
					</Muted>
				</div>
			)}

			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Excluir projeto</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja excluir "{project.name}"? Esta acao
							nao pode ser desfeita.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Excluindo..." : "Excluir"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</main>
	);
}
