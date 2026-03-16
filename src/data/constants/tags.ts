// =============================================================================
// Tags predefinidas para projetos — Indie Hacking Brasil
// =============================================================================
//
// Como contribuir com novas tags (repositorio open source):
// 1. Escolha a categoria adequada (tecnologia, mercado ou modelo)
// 2. Adicione o slug no array da categoria (lowercase, sem acentos, hifenizado)
// 3. Adicione o label em portugues no objeto TAG_LABELS
// 4. Abra um Pull Request com a justificativa
//
// Convencoes:
// - Slugs: lowercase, sem acentos, palavras separadas por hifen
// - Labels: nome amigavel em portugues (ou ingles quando termo tecnico)
// - Maximo de 10 tags por projeto
// =============================================================================

// ---------------------------------------------------------------------------
// Tecnologia — stack tecnica, linguagens, plataformas e infraestrutura
// ---------------------------------------------------------------------------
// Inclui linguagens de programacao, frameworks, plataformas de deploy
// e areas tecnicas (IA, blockchain, etc.)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mercado — segmento de atuacao e publico-alvo
// ---------------------------------------------------------------------------
// Inclui verticais (fintech, edtech, etc.), modelo B2B/B2C,
// e areas de atuacao do produto
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Modelo de Negocio — como o produto gera receita ou se distribui
// ---------------------------------------------------------------------------
// Inclui estrategias de monetizacao, tipo de produto
// e formato de distribuicao
// ---------------------------------------------------------------------------

export const TAG_CATEGORIES = {
	tecnologia: [
		"react",
		"next-js",
		"vue",
		"svelte",
		"angular",
		"node-js",
		"python",
		"ruby",
		"php",
		"flutter",
		"react-native",
		"swift",
		"kotlin",
		"typescript",
		"go",
		"rust",
		"elixir",
		"ai-ml",
		"blockchain",
		"api",
		"cli",
		"cloudflare",
		"aws",
		"vercel",
		"supabase",
		"firebase",
	],
	mercado: [
		"b2b",
		"b2c",
		"marketplace",
		"fintech",
		"edtech",
		"healthtech",
		"legaltech",
		"agritech",
		"proptech",
		"foodtech",
		"e-commerce",
		"creator-economy",
		"devtools",
		"produtividade",
		"automacao",
		"marketing",
		"rh-recrutamento",
		"logistica",
	],
	modelo: [
		"freemium",
		"assinatura",
		"lifetime-deal",
		"pay-per-use",
		"open-source",
		"saas",
		"micro-saas",
		"mobile-app",
		"chrome-extension",
		"template",
		"curso-digital",
		"comunidade-paga",
		"consultoria-produtizada",
		"api-as-a-service",
	],
} as const;

export const TAG_OPTIONS = [
	...TAG_CATEGORIES.tecnologia,
	...TAG_CATEGORIES.mercado,
	...TAG_CATEGORIES.modelo,
] as const;

export type TagOption = (typeof TAG_OPTIONS)[number];

export const TAG_LABELS: Record<TagOption, string> = {
	// Tecnologia
	react: "React",
	"next-js": "Next.js",
	vue: "Vue",
	svelte: "Svelte",
	angular: "Angular",
	"node-js": "Node.js",
	python: "Python",
	ruby: "Ruby",
	php: "PHP",
	flutter: "Flutter",
	"react-native": "React Native",
	swift: "Swift",
	kotlin: "Kotlin",
	typescript: "TypeScript",
	go: "Go",
	rust: "Rust",
	elixir: "Elixir",
	"ai-ml": "AI / Machine Learning",
	blockchain: "Blockchain / Web3",
	api: "API",
	cli: "CLI",
	cloudflare: "Cloudflare",
	aws: "AWS",
	vercel: "Vercel",
	supabase: "Supabase",
	firebase: "Firebase",
	// Mercado
	b2b: "B2B",
	b2c: "B2C",
	marketplace: "Marketplace",
	fintech: "Fintech",
	edtech: "EdTech",
	healthtech: "HealthTech",
	legaltech: "LegalTech",
	agritech: "AgriTech",
	proptech: "PropTech",
	foodtech: "FoodTech",
	"e-commerce": "E-commerce",
	"creator-economy": "Creator Economy",
	devtools: "DevTools",
	produtividade: "Produtividade",
	automacao: "Automacao",
	marketing: "Marketing",
	"rh-recrutamento": "RH / Recrutamento",
	logistica: "Logistica",
	// Modelo de Negocio
	freemium: "Freemium",
	assinatura: "Assinatura",
	"lifetime-deal": "Lifetime Deal",
	"pay-per-use": "Pay-per-use",
	"open-source": "Open Source",
	saas: "SaaS",
	"micro-saas": "Micro-SaaS",
	"mobile-app": "App Mobile",
	"chrome-extension": "Extensao Chrome",
	template: "Template / Boilerplate",
	"curso-digital": "Curso / Produto Digital",
	"comunidade-paga": "Comunidade Paga",
	"consultoria-produtizada": "Consultoria Produtizada",
	"api-as-a-service": "API as a Service",
};

export const TAG_CATEGORY_LABELS: Record<keyof typeof TAG_CATEGORIES, string> =
	{
		tecnologia: "Tecnologia",
		mercado: "Mercado",
		modelo: "Modelo de Negocio",
	};
