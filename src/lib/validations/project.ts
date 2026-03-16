import { z } from "zod";
import { TAG_OPTIONS } from "@/data/constants/tags";

export const PROJECT_CATEGORIES = [
	"app",
	"saas",
	"micro_saas",
	"startup",
	"outro",
] as const;

export const PROJECT_CATEGORY_LABELS: Record<
	(typeof PROJECT_CATEGORIES)[number],
	string
> = {
	app: "App",
	saas: "SaaS",
	micro_saas: "Micro-SaaS",
	startup: "Startup",
	outro: "Outro",
};

export const PROJECT_STATUSES = [
	"ideia",
	"construindo",
	"lancado",
	"adquirido",
] as const;

export const PROJECT_STATUS_LABELS: Record<
	(typeof PROJECT_STATUSES)[number],
	string
> = {
	ideia: "Ideia",
	construindo: "Construindo",
	lancado: "Lancado",
	adquirido: "Adquirido",
};

export const PROJECT_STATUS_COLORS: Record<
	(typeof PROJECT_STATUSES)[number],
	string
> = {
	ideia: "bg-muted text-muted-foreground",
	construindo:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	lancado:
		"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	adquirido:
		"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(100, "Nome deve ter no maximo 100 caracteres"),
	description: z
		.string()
		.max(2000, "Descricao deve ter no maximo 2000 caracteres")
		.nullable()
		.optional(),
	url: z.string().url("URL do projeto invalida").nullable().optional(),
	logoUrl: z.string().url("URL do logo invalida").nullable().optional(),
	category: z.enum(PROJECT_CATEGORIES, {
		error: "Categoria invalida",
	}),
	status: z.enum(PROJECT_STATUSES, {
		error: "Status invalido",
	}),
	tags: z
		.array(z.enum(TAG_OPTIONS, { error: "Tag invalida" }))
		.max(10, "Maximo de 10 tags")
		.nullable()
		.optional(),
});

export const updateProjectSchema = createProjectSchema;

export const projectFiltersSchema = z.object({
	category: z.enum(PROJECT_CATEGORIES).optional(),
	status: z.enum(PROJECT_STATUSES).optional(),
	search: z.string().max(100).optional(),
	page: z.number().int().min(1).default(1),
	pageSize: z.number().int().min(1).max(50).default(12),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectFilters = z.infer<typeof projectFiltersSchema>;
