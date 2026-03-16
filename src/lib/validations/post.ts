import { z } from "zod";

export const POST_TYPES = ["announcement", "build_in_public"] as const;

export const POST_TYPE_LABELS: Record<(typeof POST_TYPES)[number], string> = {
	announcement: "Comunicado",
	build_in_public: "Build In Public",
};

export const createPostSchema = z.object({
	type: z.enum(POST_TYPES, { error: "Tipo de post invalido" }),
	content: z
		.string()
		.min(1, "Conteudo e obrigatorio")
		.max(5000, "Conteudo deve ter no maximo 5000 caracteres"),
	imageUrl: z
		.string()
		.url("URL da imagem invalida")
		.nullable()
		.optional()
		.or(z.literal("").transform(() => null)),
	projectId: z
		.string()
		.nullable()
		.optional()
		.transform((v) => v || null),
});

export const feedFiltersSchema = z.object({
	cursor: z.number().optional(),
	limit: z.number().int().min(1).max(50).default(20),
	type: z.enum(POST_TYPES).optional(),
});

export const userPostsFiltersSchema = z.object({
	userId: z.string(),
	cursor: z.number().optional(),
	limit: z.number().int().min(1).max(50).default(20),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type FeedFilters = z.infer<typeof feedFiltersSchema>;
export type UserPostsFilters = z.infer<typeof userPostsFiltersSchema>;
