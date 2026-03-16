import {
	createFileRoute,
	notFound,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectForm } from "@/components/project-form";
import { H1, P } from "@/components/ui/typography";
import { getProjectBySlug, updateProject } from "@/data/services/project";
import { getSession } from "@/lib/auth/server";

export const Route = createFileRoute("/projects/$slug/editar/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/" });
		}
		return { session };
	},
	loader: async ({ params, context }) => {
		const project = await getProjectBySlug({ data: params.slug });
		if (!project) {
			throw notFound();
		}

		const isOwner = project.members.some(
			(m) =>
				m.userId === (context as { session: { user: { id: string } } }).session.user.id &&
				m.role === "owner",
		);

		if (!isOwner) {
			throw redirect({ to: "/projects/$slug", params: { slug: params.slug } });
		}

		return { project };
	},
	component: EditProjectPage,
});

function EditProjectPage() {
	const { project } = Route.useLoaderData();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<main className="mx-auto w-full max-w-xl px-4 py-24">
			<div className="mb-8 text-center">
				<H1>Editar projeto</H1>
				<P className="text-muted-foreground">
					Atualize as informacoes de "{project.name}".
				</P>
			</div>

			<ProjectForm
				mode="edit"
				defaultValues={{
					name: project.name,
					description: project.description,
					url: project.url,
					logoUrl: project.logoUrl,
					category: project.category as "app" | "saas" | "micro_saas" | "startup" | "outro",
					status: project.status as "ideia" | "construindo" | "lancado" | "adquirido",
					tags: (project.tags ?? []) as string[],
				}}
				onSubmit={async (data) => {
					setIsSubmitting(true);
					try {
						await updateProject({
							data: { projectId: project.id, updates: data },
						});
						toast.success("Projeto atualizado com sucesso!");
						navigate({
							to: "/projects/$slug",
							params: { slug: project.slug },
						});
					} catch (error) {
						toast.error("Erro ao atualizar projeto");
						setIsSubmitting(false);
						throw error;
					}
				}}
				isSubmitting={isSubmitting}
			/>
		</main>
	);
}
