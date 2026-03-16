import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { EventFormatBadge } from "@/components/event-format-badge";
import { EventPartnerBadge } from "@/components/event-partner-badge";
import { EventStatusBadge } from "@/components/event-status-badge";
import type { EVENT_FORMATS, EVENT_STATUSES } from "@/lib/validations/event";
import { formatEventDateShort } from "@/lib/utils";

interface EventCardProps {
	id: string;
	name: string;
	date: Date;
	format: (typeof EVENT_FORMATS)[number];
	organizerName: string;
	isPartner: boolean;
	status?: (typeof EVENT_STATUSES)[number];
	showStatus?: boolean;
}

export function EventCard({
	id,
	name,
	date,
	format,
	organizerName,
	isPartner,
	status,
	showStatus = false,
}: EventCardProps) {
	return (
		<Link
			to="/events/$id"
			params={{ id }}
			className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium group-hover:underline">
						{name}
					</h3>
					<div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
						<Calendar className="size-3.5 shrink-0" />
						<span>{formatEventDateShort(date)}</span>
					</div>
				</div>
				{showStatus && status && <EventStatusBadge status={status} />}
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<EventFormatBadge format={format} />
				<EventPartnerBadge isPartner={isPartner} />
				<span className="text-xs text-muted-foreground">
					por {organizerName}
				</span>
			</div>
		</Link>
	);
}
