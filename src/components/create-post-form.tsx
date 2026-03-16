import { ImagePlus, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/data/services/post";
import { renderMarkdown } from "@/lib/markdown";
import { createPostSchema } from "@/lib/validations/post";

interface UserProject {
	id: string;
	name: string;
	slug: string;
	logoUrl: string | null;
}

interface CreatePostFormProps {
	userProfile: {
		displayName: string | null;
		username: string;
		avatarUrl: string | null;
		role: string;
	};
	userProjects: UserProject[];
	onPostCreated: () => void;
}

export function CreatePostForm({
	userProfile,
	userProjects,
	onPostCreated,
}: CreatePostFormProps) {
	const [content, setContent] = useState("");
	const [isAnnouncement, setIsAnnouncement] = useState(false);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [previewMode, setPreviewMode] = useState<string>("write");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isMod =
		userProfile.role === "moderator" || userProfile.role === "admin";
	const displayName = userProfile.displayName || userProfile.username;
	const postType = isAnnouncement ? "announcement" : "build_in_public";

	const handleImageUpload = async (file: File) => {
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("category", "post-images");

			const response = await fetch("/api/uploads/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Erro ao fazer upload");
			}

			const result = await response.json();
			setImageUrl(result.url);
		} catch (err) {
			setErrors((prev) => ({
				...prev,
				image:
					err instanceof Error ? err.message : "Erro ao fazer upload",
			}));
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async () => {
		const formData = {
			type: postType as "announcement" | "build_in_public",
			content,
			imageUrl: imageUrl || null,
			projectId: postType === "build_in_public" ? projectId : null,
		};

		const result = createPostSchema.safeParse(formData);

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0];
				if (field) {
					fieldErrors[String(field)] = issue.message;
				}
			}
			setErrors(fieldErrors);
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		try {
			await createPost({ data: result.data });
			setContent("");
			setImageUrl(null);
			setProjectId(null);
			setIsAnnouncement(false);
			setPreviewMode("write");
			onPostCreated();
		} catch (err) {
			setErrors({
				submit:
					err instanceof Error ? err.message : "Erro ao publicar post",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="rounded-lg border p-4">
			<div className="flex gap-3">
				<Avatar className="size-10 shrink-0">
					<AvatarImage
						src={userProfile.avatarUrl ?? undefined}
						alt={displayName}
					/>
					<AvatarFallback className="text-sm">
						{displayName[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1 space-y-3">
					<Tabs value={previewMode} onValueChange={setPreviewMode}>
						<TabsList>
							<TabsTrigger value="write">Escrever</TabsTrigger>
							<TabsTrigger value="preview">Preview</TabsTrigger>
						</TabsList>
					</Tabs>

					{previewMode === "write" ? (
						<Textarea
							placeholder="Compartilhe uma atualizacao..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							maxLength={5000}
							rows={4}
							className="resize-none"
						/>
					) : (
						<div className="min-h-[100px] rounded-md border p-3">
							{content ? (
								<div
									className="prose prose-sm dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{
										__html: renderMarkdown(content),
									}}
								/>
							) : (
								<p className="text-sm text-muted-foreground">
									Nada para visualizar
								</p>
							)}
						</div>
					)}

					{errors.content && (
						<p className="text-sm text-destructive">{errors.content}</p>
					)}

					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span>Suporte a Markdown</span>
						<span>{content.length}/5000</span>
					</div>

					{imageUrl && (
						<div className="relative">
							<img
								src={imageUrl}
								alt=""
								className="max-h-40 rounded-lg object-cover"
							/>
							<button
								type="button"
								onClick={() => setImageUrl(null)}
								className="absolute top-1 right-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
							>
								Remover
							</button>
						</div>
					)}
					{errors.image && (
						<p className="text-sm text-destructive">{errors.image}</p>
					)}

					<div className="flex flex-wrap items-center gap-3">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp,image/svg+xml"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) handleImageUpload(file);
								e.target.value = "";
							}}
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isUploading}
							onClick={() => fileInputRef.current?.click()}
						>
							<ImagePlus className="size-4" />
							{isUploading ? "Enviando..." : "Imagem"}
						</Button>

						{isMod && (
							<div className="flex items-center gap-2">
								<Switch
									id="announcement-toggle"
									checked={isAnnouncement}
									onCheckedChange={setIsAnnouncement}
								/>
								<Label
									htmlFor="announcement-toggle"
									className="text-sm"
								>
									Comunicado
								</Label>
							</div>
						)}

						{!isAnnouncement && userProjects.length > 0 && (
							<Select
								value={projectId ?? "none"}
								onValueChange={(val) =>
									setProjectId(val === "none" ? null : val)
								}
							>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Vincular projeto" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">
										Sem projeto
									</SelectItem>
									{userProjects.map((project) => (
										<SelectItem
											key={project.id}
											value={project.id}
										>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}

						<Button
							type="button"
							size="sm"
							className="ml-auto"
							disabled={isSubmitting || !content.trim()}
							onClick={handleSubmit}
						>
							<Send className="size-4" />
							{isSubmitting ? "Publicando..." : "Publicar"}
						</Button>
					</div>

					{errors.submit && (
						<p className="text-sm text-destructive">{errors.submit}</p>
					)}
				</div>
			</div>
		</div>
	);
}
