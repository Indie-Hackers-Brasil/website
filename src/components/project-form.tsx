import { Globe } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { TagSelector } from "@/components/tag-selector";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateProjectInput,
	PROJECT_CATEGORIES,
	PROJECT_CATEGORY_LABELS,
	PROJECT_STATUSES,
	PROJECT_STATUS_LABELS,
	type UpdateProjectInput,
	createProjectSchema,
	updateProjectSchema,
} from "@/lib/validations/project";

interface ProjectFormProps {
	mode: "create" | "edit";
	defaultValues?: Partial<CreateProjectInput>;
	onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
	isSubmitting: boolean;
}

export function ProjectForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting,
}: ProjectFormProps) {
	const [name, setName] = useState(defaultValues?.name ?? "");
	const [description, setDescription] = useState(
		defaultValues?.description ?? "",
	);
	const [url, setUrl] = useState(defaultValues?.url ?? "");
	const [logoUrl, setLogoUrl] = useState(defaultValues?.logoUrl ?? "");
	const [category, setCategory] = useState(
		defaultValues?.category ?? "outro",
	);
	const [status, setStatus] = useState(defaultValues?.status ?? "ideia");
	const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async () => {
		const formData = {
			name,
			description: description || null,
			url: url || null,
			logoUrl: logoUrl || null,
			category,
			status,
			tags: tags.length > 0 ? tags : null,
		};

		const schema =
			mode === "create" ? createProjectSchema : updateProjectSchema;
		const result = schema.safeParse(formData);

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
		await onSubmit(result.data);
	};

	return (
		<FieldGroup>
			<Field>
				<FieldLabel>Logo do projeto</FieldLabel>
				<FieldDescription>
					Imagem quadrada, maximo 2MB (JPEG, PNG, WebP ou SVG)
				</FieldDescription>
				<ImageUpload
					value={logoUrl || null}
					onChange={(val) => setLogoUrl(val ?? "")}
					category="project-logos"
					fallback={name || "P"}
				/>
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="name">Nome do projeto *</FieldLabel>
				<FieldDescription>
					O nome que sera exibido na plataforma
				</FieldDescription>
				<Input
					id="name"
					placeholder="Meu Projeto Incrivel"
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={100}
				/>
				{errors.name && <FieldError>{errors.name}</FieldError>}
			</Field>

			<Field>
				<FieldLabel htmlFor="description">Descricao</FieldLabel>
				<FieldDescription>
					Descreva o que seu projeto faz (max. 2000 caracteres)
				</FieldDescription>
				<Textarea
					id="description"
					placeholder="Uma descricao detalhada do projeto..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					maxLength={2000}
					rows={4}
				/>
				{errors.description && (
					<FieldError>{errors.description}</FieldError>
				)}
			</Field>

			<Field>
				<FieldLabel htmlFor="url">
					<Globe className="size-4" />
					URL do projeto
				</FieldLabel>
				<Input
					id="url"
					type="url"
					placeholder="https://meuprojeto.com"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				{errors.url && <FieldError>{errors.url}</FieldError>}
			</Field>

			<FieldSeparator />

			<div className="grid grid-cols-2 gap-4">
				<Field>
					<FieldLabel>Categoria *</FieldLabel>
					<Select
						value={category}
						onValueChange={(val) =>
							setCategory(val as (typeof PROJECT_CATEGORIES)[number])
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PROJECT_CATEGORIES.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{PROJECT_CATEGORY_LABELS[cat]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.category && <FieldError>{errors.category}</FieldError>}
				</Field>

				<Field>
					<FieldLabel>Status *</FieldLabel>
					<Select
						value={status}
						onValueChange={(val) =>
							setStatus(val as (typeof PROJECT_STATUSES)[number])
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PROJECT_STATUSES.map((s) => (
								<SelectItem key={s} value={s}>
									{PROJECT_STATUS_LABELS[s]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.status && <FieldError>{errors.status}</FieldError>}
				</Field>
			</div>

			<FieldSeparator />

			<Field>
				<FieldLabel>Tags</FieldLabel>
				<FieldDescription>
					Selecione ate 10 tags que descrevem seu projeto
				</FieldDescription>
				<TagSelector value={tags} onChange={setTags} />
				{errors.tags && <FieldError>{errors.tags}</FieldError>}
			</Field>

			<Button
				type="button"
				className="w-full"
				size="lg"
				disabled={isSubmitting}
				onClick={handleSubmit}
			>
				{isSubmitting
					? "Salvando..."
					: mode === "create"
						? "Criar projeto"
						: "Salvar alteracoes"}
			</Button>
		</FieldGroup>
	);
}
