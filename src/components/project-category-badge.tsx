import { Badge } from "@/components/ui/badge";
import {
	PROJECT_CATEGORY_LABELS,
	type PROJECT_CATEGORIES,
} from "@/lib/validations/project";

interface ProjectCategoryBadgeProps {
	category: (typeof PROJECT_CATEGORIES)[number];
	className?: string;
}

export function ProjectCategoryBadge({
	category,
	className,
}: ProjectCategoryBadgeProps) {
	return (
		<Badge variant="outline" className={className}>
			{PROJECT_CATEGORY_LABELS[category] ?? category}
		</Badge>
	);
}
