import { z } from "zod";

export const EVENT_FORMATS = ["presencial", "digital"] as const;

export const EVENT_FORMAT_LABELS: Record<
	(typeof EVENT_FORMATS)[number],
	string
> = {
	presencial: "Presencial",
	digital: "Digital",
};

export const EVENT_FORMAT_COLORS: Record<
	(typeof EVENT_FORMATS)[number],
	string
> = {
	presencial:
		"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
	digital:
		"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export const EVENT_STATUSES = ["pending", "approved", "rejected"] as const;

export const EVENT_STATUS_LABELS: Record<
	(typeof EVENT_STATUSES)[number],
	string
> = {
	pending: "Pendente",
	approved: "Aprovado",
	rejected: "Rejeitado",
};

export const EVENT_STATUS_COLORS: Record<
	(typeof EVENT_STATUSES)[number],
	string
> = {
	pending:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	approved:
		"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	rejected:
		"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const baseEventSchema = z
	.object({
		name: z
			.string()
			.min(2, "Nome deve ter pelo menos 2 caracteres")
			.max(200, "Nome deve ter no maximo 200 caracteres"),
		description: z
			.string()
			.max(1000, "Descricao deve ter no maximo 1000 caracteres")
			.nullable()
			.optional(),
		date: z.coerce.date({ message: "Data invalida" }),
		format: z.enum(EVENT_FORMATS, {
			error: "Formato invalido",
		}),
		address: z.string().nullable().optional(),
		accessLink: z
			.string()
			.url("URL de acesso invalida")
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		eventLink: z.string().url("URL da pagina oficial invalida"),
		bannerUrl: z
			.string()
			.url("URL do banner invalida")
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		organizerName: z
			.string()
			.min(2, "Nome do organizador deve ter pelo menos 2 caracteres")
			.max(100, "Nome do organizador deve ter no maximo 100 caracteres"),
		isPartner: z.boolean().default(false),
	})
	.superRefine((data, ctx) => {
		if (data.format === "presencial" && (!data.address || data.address.trim() === "")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Endereco e obrigatorio para eventos presenciais",
				path: ["address"],
			});
		}
		if (data.format === "digital" && (!data.accessLink || data.accessLink.trim() === "")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Link de acesso e obrigatorio para eventos digitais",
				path: ["accessLink"],
			});
		}
	});

export const createEventSchema = baseEventSchema.refine(
	(data) => data.date > new Date(),
	{
		message: "Data deve ser no futuro",
		path: ["date"],
	},
);

export const updateEventSchema = baseEventSchema;

export const rejectEventSchema = z.object({
	reason: z
		.string()
		.max(500, "Motivo deve ter no maximo 500 caracteres")
		.nullable()
		.optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
