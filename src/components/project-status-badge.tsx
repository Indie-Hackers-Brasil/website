import { Badge } from "@/components/ui/badge";
import {
	PROJECT_STATUS_COLORS,
	PROJECT_STATUS_LABELS,
	type PROJECT_STATUSES,
} from "@/lib/validations/project";
import { cn } from "@/lib/utils";

interface ProjectStatusBadgeProps {
	status: (typeof PROJECT_STATUSES)[number];
	className?: string;
}

export function ProjectStatusBadge({
	status,
	className,
}: ProjectStatusBadgeProps) {
	return (
		<Badge
			variant="secondary"
			className={cn(
				PROJECT_STATUS_COLORS[status] ?? "",
				className,
			)}
		>
			{PROJECT_STATUS_LABELS[status] ?? status}
		</Badge>
	);
}
