import { Link } from "@tanstack/react-router";
import { AlertCircle, Pencil } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface EventRejectionNoticeProps {
	rejectionReason: string | null;
	eventId: string;
}

export function EventRejectionNotice({
	rejectionReason,
	eventId,
}: EventRejectionNoticeProps) {
	return (
		<Alert variant="destructive">
			<AlertCircle className="size-4" />
			<AlertTitle>Evento rejeitado</AlertTitle>
			<AlertDescription className="mt-2">
				<p>
					{rejectionReason || "Nenhum motivo informado pelo moderador."}
				</p>
				<Button asChild size="sm" variant="outline" className="mt-3">
					<Link to="/events/$id/editar" params={{ id: eventId }}>
						<Pencil className="size-3.5" />
						Editar e resubmeter
					</Link>
				</Button>
			</AlertDescription>
		</Alert>
	);
}
