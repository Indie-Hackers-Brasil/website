import { z } from "zod";

export const INTEREST_OPTIONS = [
	"mobile",
	"saas-b2b",
	"saas-b2c",
	"micro-saas",
	"ai-ml",
	"open-source",
	"e-commerce",
	"fintech",
	"edtech",
	"healthtech",
	"devtools",
	"automacao",
	"no-code-low-code",
	"marketing-digital",
	"comunidades",
] as const;

export const INTEREST_LABELS: Record<
	(typeof INTEREST_OPTIONS)[number],
	string
> = {
	mobile: "Mobile (iOS/Android)",
	"saas-b2b": "SaaS B2B",
	"saas-b2c": "SaaS B2C",
	"micro-saas": "Micro-SaaS",
	"ai-ml": "AI / Machine Learning",
	"open-source": "Open Source",
	"e-commerce": "E-commerce",
	fintech: "Fintech",
	edtech: "EdTech",
	healthtech: "HealthTech",
	devtools: "DevTools",
	automacao: "Automacao",
	"no-code-low-code": "No-code / Low-code",
	"marketing-digital": "Marketing Digital",
	comunidades: "Comunidades",
};

export const createProfileSchema = z.object({
	username: z
		.string()
		.min(2, "Username deve ter pelo menos 2 caracteres")
		.max(32, "Username deve ter no maximo 32 caracteres")
		.regex(
			/^[a-z0-9_.]+$/,
			"Username deve conter apenas letras minusculas, numeros, _ e .",
		),
	displayName: z
		.string()
		.max(100, "Nome de exibicao deve ter no maximo 100 caracteres")
		.nullable()
		.optional(),
	bio: z
		.string()
		.max(280, "Bio deve ter no maximo 280 caracteres")
		.nullable()
		.optional(),
	avatarUrl: z.string().url("URL do avatar invalida").nullable().optional(),
	website: z.string().url("URL do site invalida").nullable().optional(),
	github: z
		.string()
		.max(39, "Username do GitHub deve ter no maximo 39 caracteres")
		.nullable()
		.optional(),
	twitter: z
		.string()
		.max(15, "Handle do Twitter deve ter no maximo 15 caracteres")
		.nullable()
		.optional(),
	linkedin: z.string().url("URL do LinkedIn invalida").nullable().optional(),
	interests: z.array(z.enum(INTEREST_OPTIONS)).nullable().optional(),
});

export const updateProfileSchema = createProfileSchema.omit({
	username: true,
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
