import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateEventInput,
	EVENT_FORMATS,
	EVENT_FORMAT_LABELS,
	type UpdateEventInput,
	createEventSchema,
	updateEventSchema,
} from "@/lib/validations/event";

interface EventFormProps {
	mode: "create" | "edit";
	defaultValues?: Partial<CreateEventInput & { date: Date | string }>;
	onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
	isSubmitting: boolean;
	canSetPartner?: boolean;
}

function toDatetimeLocalValue(date: Date | string | undefined): string {
	if (!date) return "";
	const d = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting,
	canSetPartner = false,
}: EventFormProps) {
	const [name, setName] = useState(defaultValues?.name ?? "");
	const [description, setDescription] = useState(
		defaultValues?.description ?? "",
	);
	const [dateStr, setDateStr] = useState(
		toDatetimeLocalValue(defaultValues?.date),
	);
	const [format, setFormat] = useState<(typeof EVENT_FORMATS)[number]>(
		(defaultValues?.format as (typeof EVENT_FORMATS)[number]) ?? "digital",
	);
	const [address, setAddress] = useState(defaultValues?.address ?? "");
	const [accessLink, setAccessLink] = useState(
		defaultValues?.accessLink ?? "",
	);
	const [eventLink, setEventLink] = useState(defaultValues?.eventLink ?? "");
	const [bannerUrl, setBannerUrl] = useState(defaultValues?.bannerUrl ?? "");
	const [organizerName, setOrganizerName] = useState(
		defaultValues?.organizerName ?? "",
	);
	const [isPartner, setIsPartner] = useState(
		defaultValues?.isPartner ?? false,
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async () => {
		const formData = {
			name,
			description: description || null,
			date: dateStr ? new Date(dateStr) : undefined,
			format,
			address: format === "presencial" ? address || null : null,
			accessLink: format === "digital" ? accessLink || null : null,
			eventLink,
			bannerUrl: bannerUrl || null,
			organizerName,
			isPartner,
		};

		const schema =
			mode === "create" ? createEventSchema : updateEventSchema;
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
				<FieldLabel>Banner do evento</FieldLabel>
				<FieldDescription>
					Imagem do evento, maximo 2MB (JPEG, PNG, WebP ou SVG)
				</FieldDescription>
				<ImageUpload
					value={bannerUrl || null}
					onChange={(val) => setBannerUrl(val ?? "")}
					category="event-banners"
					fallback={name || "E"}
				/>
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="name">Nome do evento *</FieldLabel>
				<Input
					id="name"
					placeholder="Nome do evento"
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={200}
				/>
				{errors.name && <FieldError>{errors.name}</FieldError>}
			</Field>

			<Field>
				<FieldLabel htmlFor="description">Descricao</FieldLabel>
				<FieldDescription>
					Descreva o evento (max. 1000 caracteres)
				</FieldDescription>
				<Textarea
					id="description"
					placeholder="Detalhes sobre o evento..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					maxLength={1000}
					rows={4}
				/>
				{errors.description && (
					<FieldError>{errors.description}</FieldError>
				)}
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="date">Data e horario *</FieldLabel>
				<Input
					id="date"
					type="datetime-local"
					value={dateStr}
					onChange={(e) => setDateStr(e.target.value)}
				/>
				{errors.date && <FieldError>{errors.date}</FieldError>}
			</Field>

			<Field>
				<FieldLabel>Formato *</FieldLabel>
				<Select
					value={format}
					onValueChange={(val) =>
						setFormat(val as (typeof EVENT_FORMATS)[number])
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{EVENT_FORMATS.map((f) => (
							<SelectItem key={f} value={f}>
								{EVENT_FORMAT_LABELS[f]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.format && <FieldError>{errors.format}</FieldError>}
			</Field>

			{format === "presencial" && (
				<Field>
					<FieldLabel htmlFor="address">Endereco *</FieldLabel>
					<FieldDescription>
						Endereco completo do local do evento
					</FieldDescription>
					<Input
						id="address"
						placeholder="Rua, numero, cidade..."
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					{errors.address && <FieldError>{errors.address}</FieldError>}
				</Field>
			)}

			{format === "digital" && (
				<Field>
					<FieldLabel htmlFor="accessLink">Link de acesso *</FieldLabel>
					<FieldDescription>
						Link para acessar o evento online (Discord, Zoom, YouTube, etc.)
					</FieldDescription>
					<Input
						id="accessLink"
						type="url"
						placeholder="https://discord.gg/..."
						value={accessLink}
						onChange={(e) => setAccessLink(e.target.value)}
					/>
					{errors.accessLink && (
						<FieldError>{errors.accessLink}</FieldError>
					)}
				</Field>
			)}

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="eventLink">Pagina oficial do evento *</FieldLabel>
				<FieldDescription>
					Link para a pagina oficial com mais informacoes
				</FieldDescription>
				<Input
					id="eventLink"
					type="url"
					placeholder="https://..."
					value={eventLink}
					onChange={(e) => setEventLink(e.target.value)}
				/>
				{errors.eventLink && <FieldError>{errors.eventLink}</FieldError>}
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="organizerName">
					Nome do organizador *
				</FieldLabel>
				<Input
					id="organizerName"
					placeholder="Nome da pessoa ou organizacao"
					value={organizerName}
					onChange={(e) => setOrganizerName(e.target.value)}
					maxLength={100}
				/>
				{errors.organizerName && (
					<FieldError>{errors.organizerName}</FieldError>
				)}
			</Field>

			{canSetPartner && (
				<Field>
					<div className="flex items-center gap-3">
						<Switch
							id="isPartner"
							checked={isPartner}
							onCheckedChange={setIsPartner}
						/>
						<FieldLabel htmlFor="isPartner" className="mb-0">
							Evento de parceiro externo
						</FieldLabel>
					</div>
					<FieldDescription>
						Marque se o evento e organizado por um parceiro externo, nao pela
						comunidade
					</FieldDescription>
				</Field>
			)}

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
						? "Submeter evento"
						: "Salvar alteracoes"}
			</Button>
		</FieldGroup>
	);
}
