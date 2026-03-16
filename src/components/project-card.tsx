import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectCategoryBadge } from "@/components/project-category-badge";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import type { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/validations/project";

interface ProjectCardProps {
	slug: string;
	name: string;
	description: string | null;
	logoUrl: string | null;
	category: (typeof PROJECT_CATEGORIES)[number];
	status: (typeof PROJECT_STATUSES)[number];
}

export function ProjectCard({
	slug,
	name,
	description,
	logoUrl,
	category,
	status,
}: ProjectCardProps) {
	const truncated =
		description && description.length > 120
			? `${description.slice(0, 120)}...`
			: description;

	return (
		<Link
			to="/projects/$slug"
			params={{ slug }}
			className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
		>
			<div className="flex items-start gap-3">
				<Avatar className="size-10 shrink-0">
					<AvatarImage src={logoUrl ?? undefined} alt={name} />
					<AvatarFallback className="text-sm">
						{name[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium group-hover:underline">
						{name}
					</h3>
					{truncated && (
						<p className="mt-1 text-sm text-muted-foreground line-clamp-2">
							{truncated}
						</p>
					)}
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<ProjectCategoryBadge category={category} />
				<ProjectStatusBadge status={status} />
			</div>
		</Link>
	);
}
