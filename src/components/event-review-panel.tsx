import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EventReviewPanelProps {
	onApprove: () => Promise<void>;
	onReject: (reason?: string) => Promise<void>;
}

export function EventReviewPanel({
	onApprove,
	onReject,
}: EventReviewPanelProps) {
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [reason, setReason] = useState("");
	const [isApproving, setIsApproving] = useState(false);
	const [isRejecting, setIsRejecting] = useState(false);

	const handleApprove = async () => {
		setIsApproving(true);
		try {
			await onApprove();
		} finally {
			setIsApproving(false);
		}
	};

	const handleReject = async () => {
		setIsRejecting(true);
		try {
			await onReject(reason || undefined);
		} finally {
			setIsRejecting(false);
		}
	};

	return (
		<div className="rounded-lg border bg-muted/50 p-6">
			<h3 className="mb-4 font-semibold">Revisao do evento</h3>

			{!showRejectForm ? (
				<div className="flex gap-3">
					<Button
						onClick={handleApprove}
						disabled={isApproving}
						className="bg-green-600 hover:bg-green-700"
					>
						<Check className="size-4" />
						{isApproving ? "Aprovando..." : "Aprovar"}
					</Button>
					<Button
						variant="destructive"
						onClick={() => setShowRejectForm(true)}
					>
						<X className="size-4" />
						Rejeitar
					</Button>
				</div>
			) : (
				<div className="space-y-3">
					<Textarea
						placeholder="Motivo da rejeicao (opcional)"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						maxLength={500}
						rows={3}
					/>
					<div className="flex gap-3">
						<Button
							variant="destructive"
							onClick={handleReject}
							disabled={isRejecting}
						>
							{isRejecting ? "Rejeitando..." : "Confirmar rejeicao"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setShowRejectForm(false);
								setReason("");
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
