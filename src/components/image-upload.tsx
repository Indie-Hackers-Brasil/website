import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
	value: string | null;
	onChange: (url: string | null) => void;
	category: string;
	fallback?: string;
}

export function ImageUpload({
	value,
	onChange,
	category,
	fallback = "?",
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);
		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("category", category);

			const res = await fetch("/api/uploads/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error ?? "Erro ao enviar arquivo");
				return;
			}

			onChange(data.url);
		} catch {
			setError("Erro ao enviar arquivo");
		} finally {
			setIsUploading(false);
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	};

	return (
		<div className="flex items-center gap-4">
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={isUploading}
				className="group relative cursor-pointer"
			>
				<Avatar className="size-16">
					<AvatarImage src={value ?? undefined} alt="Logo" />
					<AvatarFallback className="text-lg">
						{isUploading ? (
							<Loader2 className="size-5 animate-spin" />
						) : (
							fallback[0]?.toUpperCase() ?? <ImagePlus className="size-5" />
						)}
					</AvatarFallback>
				</Avatar>
				<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
					<ImagePlus className="size-5 text-white" />
				</div>
			</button>

			<div className="flex flex-col gap-1">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => inputRef.current?.click()}
					disabled={isUploading}
				>
					{isUploading ? "Enviando..." : value ? "Trocar imagem" : "Enviar imagem"}
				</Button>
				{value && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onChange(null)}
						className="text-muted-foreground"
					>
						<X className="size-3.5" />
						Remover
					</Button>
				)}
				{error && <p className="text-xs text-destructive">{error}</p>}
			</div>

			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/svg+xml"
				className="hidden"
				onChange={handleFileSelect}
			/>
		</div>
	);
}
