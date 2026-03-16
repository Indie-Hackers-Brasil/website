import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import type { PROJECT_STATUSES } from "@/lib/validations/project";

interface LinkedProjectPreviewProps {
	slug: string;
	name: string;
	logoUrl: string | null;
	status: string;
}

export function LinkedProjectPreview({
	slug,
	name,
	logoUrl,
	status,
}: LinkedProjectPreviewProps) {
	return (
		<Link
			to="/projects/$slug"
			params={{ slug }}
			className="mt-2 flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/60"
		>
			<Avatar className="size-5 shrink-0">
				<AvatarImage src={logoUrl ?? undefined} alt={name} />
				<AvatarFallback className="text-[10px]">
					{name[0]?.toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<span className="truncate text-sm font-medium">{name}</span>
			<ProjectStatusBadge
				status={status as (typeof PROJECT_STATUSES)[number]}
			/>
		</Link>
	);
}
