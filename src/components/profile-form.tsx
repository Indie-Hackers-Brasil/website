import { AtSign, Github, Globe, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { InterestSelector } from "@/components/interest-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateProfileInput,
	createProfileSchema,
	type UpdateProfileInput,
	updateProfileSchema,
} from "@/lib/validations/profile";

interface ProfileFormProps {
	mode: "create" | "edit";
	defaultValues: Partial<CreateProfileInput> & { avatarUrl?: string | null };
	onSubmit: (data: CreateProfileInput | UpdateProfileInput) => Promise<void>;
	isSubmitting: boolean;
}

export function ProfileForm({
	mode,
	defaultValues,
	onSubmit,
	isSubmitting,
}: ProfileFormProps) {
	const [displayName, setDisplayName] = useState(
		defaultValues.displayName ?? "",
	);
	const [bio, setBio] = useState(defaultValues.bio ?? "");
	const [avatarUrl] = useState(defaultValues.avatarUrl ?? "");
	const [website, setWebsite] = useState(defaultValues.website ?? "");
	const [github, setGithub] = useState(defaultValues.github ?? "");
	const [twitter, setTwitter] = useState(defaultValues.twitter ?? "");
	const [linkedin, setLinkedin] = useState(defaultValues.linkedin ?? "");
	const [interests, setInterests] = useState<string[]>(
		defaultValues.interests ?? [],
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async () => {
		const formData: Record<string, unknown> = {
			displayName: displayName || null,
			bio: bio || null,
			avatarUrl: avatarUrl || null,
			website: website || null,
			github: github || null,
			twitter: twitter || null,
			linkedin: linkedin || null,
			interests: interests.length > 0 ? interests : null,
		};

		if (mode === "create") {
			formData.username = defaultValues.username;
		}

		const schema =
			mode === "create" ? createProfileSchema : updateProfileSchema;
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
			<div className="flex items-center gap-4">
				<Avatar className="size-16">
					<AvatarImage src={avatarUrl} alt={defaultValues.username ?? ""} />
					<AvatarFallback className="text-lg">
						{(defaultValues.username ?? "?")[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				{mode === "create" && defaultValues.username && (
					<div>
						<p className="flex items-center gap-1 text-sm text-muted-foreground">
							<AtSign className="size-3.5" />
							{defaultValues.username}
						</p>
						<p className="text-xs text-muted-foreground">Herdado do Discord</p>
					</div>
				)}
			</div>

			<Field>
				<FieldLabel htmlFor="displayName">Nome de exibicao</FieldLabel>
				<FieldDescription>
					Como voce quer ser chamado na plataforma
				</FieldDescription>
				<Input
					id="displayName"
					placeholder="Seu nome"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					maxLength={100}
				/>
				{errors.displayName && <FieldError>{errors.displayName}</FieldError>}
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel htmlFor="bio">Bio</FieldLabel>
				<FieldDescription>
					Conte um pouco sobre voce (max. 280 caracteres)
				</FieldDescription>
				<Textarea
					id="bio"
					placeholder="O que voce esta construindo?"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
					maxLength={280}
				/>
				{errors.bio && <FieldError>{errors.bio}</FieldError>}
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel>Links</FieldLabel>
				<FieldDescription>Seus perfis e site pessoal</FieldDescription>
			</Field>

			<Field>
				<FieldLabel htmlFor="website">
					<Globe className="size-4" />
					Site
				</FieldLabel>
				<Input
					id="website"
					type="url"
					placeholder="https://seusite.com"
					value={website}
					onChange={(e) => setWebsite(e.target.value)}
				/>
				{errors.website && <FieldError>{errors.website}</FieldError>}
			</Field>

			<Field>
				<FieldLabel htmlFor="github">
					<Github className="size-4" />
					GitHub
				</FieldLabel>
				<Input
					id="github"
					placeholder="username"
					value={github}
					onChange={(e) => setGithub(e.target.value)}
					maxLength={39}
				/>
				{errors.github && <FieldError>{errors.github}</FieldError>}
			</Field>

			<Field>
				<FieldLabel htmlFor="twitter">
					<Twitter className="size-4" />X / Twitter
				</FieldLabel>
				<Input
					id="twitter"
					placeholder="handle (sem @)"
					value={twitter}
					onChange={(e) => setTwitter(e.target.value)}
					maxLength={15}
				/>
				{errors.twitter && <FieldError>{errors.twitter}</FieldError>}
			</Field>

			<Field>
				<FieldLabel htmlFor="linkedin">
					<Linkedin className="size-4" />
					LinkedIn
				</FieldLabel>
				<Input
					id="linkedin"
					type="url"
					placeholder="https://linkedin.com/in/seu-perfil"
					value={linkedin}
					onChange={(e) => setLinkedin(e.target.value)}
				/>
				{errors.linkedin && <FieldError>{errors.linkedin}</FieldError>}
			</Field>

			<FieldSeparator />

			<Field>
				<FieldLabel>Areas de interesse</FieldLabel>
				<FieldDescription>
					Selecione as areas que mais te interessam
				</FieldDescription>
				<InterestSelector value={interests} onChange={setInterests} />
				{errors.interests && <FieldError>{errors.interests}</FieldError>}
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
						? "Completar perfil"
						: "Salvar alteracoes"}
			</Button>
		</FieldGroup>
	);
}
