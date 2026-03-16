import { Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";
import { searchUsersByUsername } from "@/data/services/project";

interface UserResult {
	userId: string;
	username: string;
	displayName: string | null;
	avatarUrl: string | null;
}

interface AddContributorDialogProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	existingUserIds: string[];
	onAdd: (userId: string) => Promise<void>;
}

export function AddContributorDialog({
	open,
	onOpenChange,
	existingUserIds,
	onAdd,
}: AddContributorDialogProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<UserResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [addingId, setAddingId] = useState<string | null>(null);

	useEffect(() => {
		if (!query || query.length < 2) {
			setResults([]);
			return;
		}

		const timeout = setTimeout(async () => {
			setIsSearching(true);
			try {
				const data = await searchUsersByUsername({ data: query });
				setResults(
					data.filter(
						(u: UserResult) => !existingUserIds.includes(u.userId),
					),
				);
			} catch {
				setResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [query, existingUserIds]);

	const handleAdd = async (userId: string) => {
		setAddingId(userId);
		try {
			await onAdd(userId);
			setResults((prev) => prev.filter((u) => u.userId !== userId));
		} finally {
			setAddingId(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar colaborador</DialogTitle>
					<DialogDescription>
						Busque por username para adicionar um colaborador ao projeto.
					</DialogDescription>
				</DialogHeader>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Buscar por username..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				<div className="max-h-64 space-y-2 overflow-y-auto">
					{isSearching && (
						<Muted className="py-4 text-center">Buscando...</Muted>
					)}

					{!isSearching && query.length >= 2 && results.length === 0 && (
						<Muted className="py-4 text-center">
							Nenhum usuario encontrado
						</Muted>
					)}

					{results.map((user) => {
						const name = user.displayName ?? user.username;
						return (
							<div
								key={user.userId}
								className="flex items-center justify-between gap-3 rounded-md border p-3"
							>
								<div className="flex items-center gap-3">
									<Avatar className="size-8">
										<AvatarImage
											src={user.avatarUrl ?? undefined}
											alt={name}
										/>
										<AvatarFallback className="text-xs">
											{name[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">{name}</p>
										<p className="text-xs text-muted-foreground">
											@{user.username}
										</p>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleAdd(user.userId)}
									disabled={addingId === user.userId}
								>
									<UserPlus className="size-3.5" />
									{addingId === user.userId ? "Adicionando..." : "Adicionar"}
								</Button>
							</div>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
}
