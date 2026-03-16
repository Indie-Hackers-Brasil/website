import { Badge } from "@/components/ui/badge";
import {
	EVENT_STATUS_COLORS,
	EVENT_STATUS_LABELS,
	type EVENT_STATUSES,
} from "@/lib/validations/event";
import { cn } from "@/lib/utils";

interface EventStatusBadgeProps {
	status: (typeof EVENT_STATUSES)[number];
	className?: string;
}

export function EventStatusBadge({
	status,
	className,
}: EventStatusBadgeProps) {
	return (
		<Badge
			variant="secondary"
			className={cn(EVENT_STATUS_COLORS[status] ?? "", className)}
		>
			{EVENT_STATUS_LABELS[status] ?? status}
		</Badge>
	);
}
