import { Badge } from "@/components/ui/badge";
import {
	EVENT_FORMAT_COLORS,
	EVENT_FORMAT_LABELS,
	type EVENT_FORMATS,
} from "@/lib/validations/event";
import { cn } from "@/lib/utils";

interface EventFormatBadgeProps {
	format: (typeof EVENT_FORMATS)[number];
	className?: string;
}

export function EventFormatBadge({
	format,
	className,
}: EventFormatBadgeProps) {
	return (
		<Badge
			variant="outline"
			className={cn(EVENT_FORMAT_COLORS[format] ?? "", className)}
		>
			{EVENT_FORMAT_LABELS[format] ?? format}
		</Badge>
	);
}
