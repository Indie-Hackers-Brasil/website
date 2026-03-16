import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventPartnerBadgeProps {
	isPartner: boolean;
	className?: string;
}

export function EventPartnerBadge({
	isPartner,
	className,
}: EventPartnerBadgeProps) {
	return (
		<Badge
			variant="outline"
			className={cn(
				isPartner
					? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
					: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
				className,
			)}
		>
			{isPartner ? "Parceiro" : "Comunidade"}
		</Badge>
	);
}
