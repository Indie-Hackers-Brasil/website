import { Link } from "@tanstack/react-router";
import { Megaphone, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { LinkedProjectPreview } from "@/components/linked-project-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePost } from "@/data/services/post";
import { renderMarkdown } from "@/lib/markdown";
import { formatRelativeTime } from "@/lib/utils";
import { POST_TYPE_LABELS } from "@/lib/validations/post";

interface PostCardProps {
	id: string;
	type: string;
	content: string;
	imageUrl: string | null;
	createdAt: Date;
	authorProfile: {
		userId: string;
		username: string;
		displayName: string | null;
		avatarUrl: string | null;
	} | null;
	linkedProject: {
		id: string;
		name: string;
		slug: string;
		logoUrl: string | null;
		status: string;
	} | null;
	currentUserId: string | null;
	currentUserRole: string;
	onDeleted?: () => void;
}

export function PostCard({
	id,
	type,
	content,
	imageUrl,
	createdAt,
	authorProfile,
	linkedProject,
	currentUserId,
	currentUserRole,
	onDeleted,
}: PostCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const isAuthor = currentUserId === authorProfile?.userId;
	const canDelete =
		isAuthor ||
		currentUserRole === "moderator" ||
		currentUserRole === "admin";
	const isAnnouncement = type === "announcement";

	const displayName =
		authorProfile?.displayName || authorProfile?.username || "Usuario";
	const username = authorProfile?.username || "usuario";

	const handleDelete = async () => {
		if (isDeleting) return;
		setIsDeleting(true);
		try {
			await deletePost({ data: id });
			onDeleted?.();
		} catch {
			setIsDeleting(false);
		}
	};

	return (
		<article
			className={`rounded-lg border p-4 ${
				isAnnouncement
					? "border-l-4 border-l-primary bg-primary/5"
					: ""
			}`}
		>
			<div className="flex items-start gap-3">
				<Link to="/u/$username" params={{ username }}>
					<Avatar className="size-10 shrink-0">
						<AvatarImage
							src={authorProfile?.avatarUrl ?? undefined}
							alt={displayName}
						/>
						<AvatarFallback className="text-sm">
							{displayName[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Link>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<Link
							to="/u/$username"
							params={{ username }}
							className="truncate font-medium hover:underline"
						>
							{displayName}
						</Link>
						<span className="text-sm text-muted-foreground">
							@{username}
						</span>
						<span className="text-sm text-muted-foreground">
							· {formatRelativeTime(new Date(createdAt))}
						</span>
					</div>

					<div className="mt-1 flex items-center gap-2">
						{isAnnouncement && (
							<Badge variant="secondary" className="gap-1">
								<Megaphone className="size-3" />
								{POST_TYPE_LABELS.announcement}
							</Badge>
						)}
						{!isAnnouncement && (
							<Badge variant="outline">
								{POST_TYPE_LABELS.build_in_public}
							</Badge>
						)}
					</div>
				</div>

				{canDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<MoreHorizontal className="size-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={handleDelete}
								disabled={isDeleting}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="size-4" />
								{isDeleting ? "Excluindo..." : "Excluir post"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			<div
				className="prose prose-sm dark:prose-invert mt-3 max-w-none"
				dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
			/>

			{imageUrl && (
				<img
					src={imageUrl}
					alt=""
					className="mt-3 max-h-96 w-full rounded-lg object-cover"
				/>
			)}

			{linkedProject && (
				<LinkedProjectPreview
					slug={linkedProject.slug}
					name={linkedProject.name}
					logoUrl={linkedProject.logoUrl}
					status={linkedProject.status}
				/>
			)}
		</article>
	);
}
