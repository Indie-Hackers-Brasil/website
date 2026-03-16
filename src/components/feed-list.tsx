import { FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { listFeed } from "@/data/services/post";

interface PostData {
	id: string;
	authorId: string;
	type: string;
	content: string;
	imageUrl: string | null;
	projectId: string | null;
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
}

interface FeedListProps {
	initialPosts: PostData[];
	initialNextCursor: number | null;
	initialHasMore: boolean;
	typeFilter: string;
	currentUserId: string;
	currentUserRole: string;
	refreshKey: number;
}

export function FeedList({
	initialPosts,
	initialNextCursor,
	initialHasMore,
	typeFilter,
	currentUserId,
	currentUserRole,
	refreshKey,
}: FeedListProps) {
	const [posts, setPosts] = useState<PostData[]>(initialPosts);
	const [nextCursor, setNextCursor] = useState<number | null>(
		initialNextCursor,
	);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [isLoading, setIsLoading] = useState(false);

	const fetchPosts = useCallback(
		async (cursor?: number) => {
			setIsLoading(true);
			try {
				const filterType =
					typeFilter === "all" ? undefined : typeFilter;
				const result = await listFeed({
					data: {
						cursor,
						limit: 20,
						type: filterType as
							| "announcement"
							| "build_in_public"
							| undefined,
					},
				});
				return result;
			} finally {
				setIsLoading(false);
			}
		},
		[typeFilter],
	);

	useEffect(() => {
		let cancelled = false;

		async function refresh() {
			const result = await fetchPosts();
			if (!cancelled) {
				setPosts(result.posts as PostData[]);
				setNextCursor(result.nextCursor);
				setHasMore(result.hasMore);
			}
		}

		refresh();

		return () => {
			cancelled = true;
		};
	}, [typeFilter, refreshKey, fetchPosts]);

	const loadMore = async () => {
		if (!nextCursor || isLoading) return;

		const result = await fetchPosts(nextCursor);
		setPosts((prev) => [...prev, ...(result.posts as PostData[])]);
		setNextCursor(result.nextCursor);
		setHasMore(result.hasMore);
	};

	const handlePostDeleted = (deletedId: string) => {
		setPosts((prev) => prev.filter((p) => p.id !== deletedId));
	};

	if (!isLoading && posts.length === 0) {
		return (
			<Empty>
				<FileText className="mx-auto mb-2 size-10 text-muted-foreground" />
				<EmptyTitle>Nenhum post encontrado</EmptyTitle>
				<EmptyDescription>
					Seja o primeiro a compartilhar uma atualizacao!
				</EmptyDescription>
			</Empty>
		);
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					id={post.id}
					type={post.type}
					content={post.content}
					imageUrl={post.imageUrl}
					createdAt={new Date(post.createdAt)}
					authorProfile={post.authorProfile}
					linkedProject={post.linkedProject}
					currentUserId={currentUserId}
					currentUserRole={currentUserRole}
					onDeleted={() => handlePostDeleted(post.id)}
				/>
			))}

			{hasMore && (
				<div className="flex justify-center pt-4">
					<Button
						variant="outline"
						onClick={loadMore}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Spinner className="size-4" />
								Carregando...
							</>
						) : (
							"Carregar mais"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
