import { Crown, LogOut, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddContributorDialog } from "@/components/add-contributor-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/typography";

interface MemberProfile {
	userId: string;
	username: string;
	displayName: string | null;
	avatarUrl: string | null;
}

interface Member {
	id: string;
	userId: string;
	role: string;
	profile: MemberProfile | null;
}

interface TeamSectionProps {
	projectId: string;
	members: Member[];
	isOwner: boolean;
	currentUserId: string | null;
	onAddContributor: (userId: string) => Promise<void>;
	onRemoveContributor: (userId: string) => Promise<void>;
}

export function TeamSection({
	projectId,
	members,
	isOwner,
	currentUserId,
	onAddContributor,
	onRemoveContributor,
}: TeamSectionProps) {
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [removingId, setRemovingId] = useState<string | null>(null);

	const sortedMembers = [...members].sort((a, b) => {
		if (a.role === "owner") return -1;
		if (b.role === "owner") return 1;
		return 0;
	});

	const existingUserIds = members.map((m) => m.userId);

	const handleRemove = async (userId: string) => {
		setRemovingId(userId);
		try {
			await onRemoveContributor(userId);
		} finally {
			setRemovingId(null);
		}
	};

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<Muted>Equipe</Muted>
				{isOwner && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowAddDialog(true)}
					>
						<UserPlus className="size-3.5" />
						Adicionar colaborador
					</Button>
				)}
			</div>

			<div className="space-y-3">
				{sortedMembers.map((member) => {
					const name =
						member.profile?.displayName ??
						member.profile?.username ??
						"Usuario";
					const isCurrentUser = member.userId === currentUserId;
					const canRemove =
						member.role === "contributor" &&
						(isOwner || isCurrentUser);

					return (
						<div
							key={member.id}
							className="flex items-center justify-between gap-3"
						>
							<div className="flex items-center gap-3">
								<Avatar className="size-8">
									<AvatarImage
										src={member.profile?.avatarUrl ?? undefined}
										alt={name}
									/>
									<AvatarFallback className="text-xs">
										{name[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium">{name}</p>
									{member.profile?.username && (
										<p className="text-xs text-muted-foreground">
											@{member.profile.username}
										</p>
									)}
								</div>
								{member.role === "owner" && (
									<Badge variant="secondary" className="gap-1">
										<Crown className="size-3" />
										Dono
									</Badge>
								)}
							</div>

							{canRemove && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleRemove(member.userId)}
									disabled={removingId === member.userId}
									className="text-muted-foreground hover:text-destructive"
								>
									{isCurrentUser ? (
										<>
											<LogOut className="size-3.5" />
											Sair
										</>
									) : (
										<>
											<UserMinus className="size-3.5" />
											Remover
										</>
									)}
								</Button>
							)}
						</div>
					);
				})}
			</div>

			{isOwner && (
				<AddContributorDialog
					projectId={projectId}
					open={showAddDialog}
					onOpenChange={setShowAddDialog}
					existingUserIds={existingUserIds}
					onAdd={async (userId) => {
						await onAddContributor(userId);
						setShowAddDialog(false);
					}}
				/>
			)}
		</div>
	);
}
