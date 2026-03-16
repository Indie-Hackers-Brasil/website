import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/svg+xml",
];
const ALLOWED_CATEGORIES = ["project-logos", "avatars", "event-banners", "post-images"];

export const Route = createFileRoute("/api/uploads/$")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const formData = await request.formData();
				const file = formData.get("file") as File | null;
				const category = formData.get("category") as string | null;

				if (!file) {
					return new Response(
						JSON.stringify({ error: "Nenhum arquivo enviado" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				if (!category || !ALLOWED_CATEGORIES.includes(category)) {
					return new Response(
						JSON.stringify({ error: "Categoria de upload invalida" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				if (!ALLOWED_TYPES.includes(file.type)) {
					return new Response(
						JSON.stringify({
							error:
								"Tipo de arquivo nao permitido. Use JPEG, PNG, WebP ou SVG.",
						}),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				if (file.size > MAX_FILE_SIZE) {
					return new Response(
						JSON.stringify({ error: "Arquivo muito grande. Maximo 2MB." }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const ext = file.name.split(".").pop() ?? "png";
				const key = `${category}/${crypto.randomUUID()}.${ext}`;

				await env.STORAGE.put(key, file.stream(), {
					httpMetadata: { contentType: file.type },
				});

				const url = `/api/uploads/${key}`;
				return new Response(JSON.stringify({ key, url }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			},

			GET: async ({ request }: { request: Request }) => {
				const url = new URL(request.url);
				const key = url.pathname.replace("/api/uploads/", "");

				if (!key) {
					return new Response("Not found", { status: 404 });
				}

				const object = await env.STORAGE.get(key);
				if (!object) {
					return new Response("Not found", { status: 404 });
				}

				return new Response(object.body, {
					headers: {
						"Content-Type":
							object.httpMetadata?.contentType ?? "application/octet-stream",
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
			},
		},
	},
});
