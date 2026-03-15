# Stack Tecnica

## Visao Geral da Arquitetura

```
[Navegador] <---> [Cloudflare Workers (Edge)] <---> [Cloudflare D1 (SQLite)]
                         |
                   TanStack Start
                   (SSR + API Routes)
                         |
                   Better-Auth (Discord OAuth)
```

A aplicacao roda inteiramente no edge via Cloudflare Workers. Nao ha servidor de origem — tudo e processado nos data centers da Cloudflare mais proximos do usuario.

## Framework e Roteamento

### TanStack Start

- **Framework**: [TanStack Start](https://tanstack.com/start) com React 19 e Vite 7
- **Tipo**: Full-stack com SSR (Server-Side Rendering)
- **Roteamento**: File-based via TanStack Router

### Convencoes de Roteamento

O projeto usa tokens customizados para nomes de arquivo de rota:

| Tipo | Nome do arquivo | Exemplo |
|------|----------------|---------|
| Pagina (index) | `page.tsx` | `src/routes/page.tsx` → `/` |
| Layout | `layout.tsx` | `src/routes/layout.tsx` |
| Rota dinamica | `$param/page.tsx` | `src/routes/projetos/$slug/page.tsx` → `/projetos/:slug` |
| API Route | `$.ts` | `src/routes/api/auth/$.ts` → `/api/auth/*` |

**Importante**: o projeto usa `page.tsx` (nao `index.tsx`) e `layout.tsx` (nao `_layout.tsx`). Isso e configurado no `vite.config.ts` com `indexToken: "page"` e `routeToken: "layout"`.

A rota raiz e a excecao: `src/routes/__root.tsx` continua com o nome padrao do TanStack Router.

### Estrutura de Rotas Atual

```
src/routes/
├── __root.tsx          # Layout raiz (ThemeProvider, Toaster, DevTools)
├── page.tsx            # Homepage (/)
└── api/
    └── auth/
        └── $.ts        # Better-Auth handler (/api/auth/*)
```

## Runtime e Deploy

### Cloudflare Workers

- **Runtime**: Cloudflare Workers (edge, V8 isolates)
- **Plugin Vite**: `@cloudflare/vite-plugin`
- **Compatibilidade**: `compatibility_date: "2025-09-02"`, `nodejs_compat` habilitado
- **Configuracao**: `wrangler.jsonc` na raiz do projeto
- **Observabilidade**: habilitada no wrangler (`observability.enabled: true`)

### Banco de Dados

- **Servico**: Cloudflare D1 (SQLite distribuido no edge)
- **Binding**: `DB` (acessivel via `env.DB` no worker)
- **Nome do banco**: `indiehackersbrasil-db`
- **Migrations**: `src/lib/db/migrations/`

## ORM — Drizzle

### Configuracao

- **Dialeto**: SQLite
- **Driver**: D1 HTTP
- **Arquivo de config**: `drizzle.config.ts`
- **Schema**: `src/lib/db/schema/index.ts` (barrel file que re-exporta todos os schemas)
- **Migrations**: `src/lib/db/migrations/`

### Acesso ao Banco

O banco e acessado via a funcao `getDb()` em `src/lib/db/index.ts`, que le o binding `DB` do ambiente Cloudflare.

### Convencoes de Tipos SQLite/Drizzle

O SQLite tem um sistema de tipos limitado. O Drizzle abstrai isso com modos tipados:

| Conceito | Drizzle/SQLite | NAO usar (PostgreSQL) |
|----------|---------------|----------------------|
| String | `text("col")` | `varchar("col", { length: 255 })` |
| Inteiro | `integer("col")` | `serial("col")`, `bigint` |
| Booleano | `integer("col", { mode: "boolean" })` | `boolean("col")` |
| Timestamp | `integer("col", { mode: "timestamp_ms" })` | `timestamp("col")` |
| JSON | `text("col", { mode: "json" })` | `jsonb("col")` |
| Chave primaria | `text("id").primaryKey()` | `serial("id").primaryKey()` |
| Enum-like | `text("status")` + validacao Zod | `pgEnum(...)` |
| Table builder | `sqliteTable(...)` | `pgTable(...)` |

**Padroes extraidos do `auth.schema.ts` existente:**

```typescript
// ID — texto, chave primaria (Better-Auth gera UUIDs como string)
id: text("id").primaryKey()

// Timestamp — inteiro em milissegundos Unix
createdAt: integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .default(sql`(unixepoch() * 1000)`)

// Timestamp com auto-update
updatedAt: integer("updated_at", { mode: "timestamp_ms" })
  .notNull()
  .default(sql`(unixepoch() * 1000)`)
  .$onUpdate(() => new Date())

// Booleano
emailVerified: integer("email_verified", { mode: "boolean" })
  .notNull()
  .default(false)

// Foreign Key
userId: text("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" })

// Indices — terceiro argumento do sqliteTable
(table) => [
  index("nome_idx").on(table.campo),
  uniqueIndex("nome_unique").on(table.campo),
]
```

**Naming**: colunas em `snake_case` no banco, propriedades em `camelCase` no TypeScript.

## Autenticacao — Better-Auth

### Configuracao

- **Provedor**: Discord OAuth (unico provedor)
- **Adapter**: `drizzleAdapter` com `provider: "sqlite"`
- **Plugin**: `tanstackStartCookies()` para integracao com TanStack Start
- **Arquivo principal**: `src/lib/auth/index.ts`

### Server Functions

Duas server functions em `src/lib/auth/server.ts`:

```typescript
// Retorna a sessao ou null
getSession()

// Retorna a sessao ou lanca Error("Unauthorized")
ensureSession()
```

Ambas usam `createServerFn({ method: "GET" })` do TanStack Start e leem headers via `getRequestHeaders()`.

### Client

O cliente de auth e criado em `src/lib/auth/client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

Uso no componente:

```typescript
const { data: session, isPending } = authClient.useSession();
```

### Dados do Discord

Ao fazer login via Discord, o Better-Auth armazena automaticamente:

- `user.name` — nome de exibicao do Discord
- `user.email` — email vinculado ao Discord
- `user.image` — avatar do Discord
- `account.accountId` — ID numerico do Discord
- `account.providerId` — `"discord"`

**Nota importante**: o **username do Discord** (handle com @) nao e armazenado diretamente pelo Better-Auth na tabela `user`. O campo `user.name` contem o nome de exibicao (display name), nao o username. Para obter o username do Discord, sera necessario usar a API do Discord via `account.accessToken` ou configurar o Better-Auth com `mapProfileToUser` para incluir o username.

## UI e Estilizacao

### Tailwind CSS 4

- Configurado via `@tailwindcss/vite` plugin
- Variaveis CSS para temas em `src/styles.css`
- Classes utilitarias padrao do Tailwind

### shadcn/ui

- **Estilo**: `new-york`
- **Configuracao**: `components.json` na raiz
- **Componentes**: `src/components/ui/`
- **30+ componentes instalados**: alert, avatar, badge, breadcrumb, button, card, checkbox, dialog, dropdown-menu, empty, input, kbd, label, navigation-menu, pagination, popover, select, separator, skeleton, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, typography
- **Comando para adicionar**: `bunx --bun shadcn@latest add <componente>`

### Tema (Dark Mode)

- Gerenciado por `next-themes` com `ThemeProvider` no `__root.tsx`
- Suporta: `light`, `dark`, `system`
- Atributo: `class` (adiciona classe no elemento raiz)

### Icones

- **Biblioteca**: Lucide React (`lucide-react`)
- Importar icones individualmente: `import { NomeDoIcone } from "lucide-react"`

## Alias de Importacao

O projeto usa um unico alias:

```
@/* → ./src/*
```

Configurado em `tsconfig.json` (`paths`) e `vite.config.ts` (`resolve.alias`).

**Exemplos de uso:**

```typescript
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/constants";
```

**Nota**: o `package.json` tambem define `#/*` como subpath import do Node, mas o codigo do projeto usa `@/*` via TypeScript paths. Usar sempre `@/*`.

## Estrutura de Pastas

```
src/
├── components/
│   └── ui/              # Componentes shadcn/ui
├── data/
│   └── constants/       # Constantes (env, site config)
│       ├── env.ts       # Variaveis de ambiente
│       ├── site.ts      # Configuracao do site
│       └── index.ts     # Barrel file
├── lib/
│   ├── auth/            # Better-Auth (config, server, client)
│   ├── db/              # Drizzle ORM (conexao, schemas, migrations)
│   │   ├── schema/      # Schemas do banco (um arquivo por dominio)
│   │   └── migrations/  # Migrations geradas pelo Drizzle Kit
│   └── utils.ts         # Utilitarios (cn para classes)
├── routes/              # Rotas TanStack Router
├── router.tsx           # Configuracao do router
├── routeTree.gen.ts     # Arvore de rotas (auto-gerado)
└── styles.css           # Estilos globais + variaveis CSS
```

### Convencao de Schemas

Cada dominio tem seu proprio arquivo em `src/lib/db/schema/`:

- Um arquivo por dominio (ex.: `profile.schema.ts`, `projects.schema.ts`)
- Tabelas de juncao ficam dentro do schema do dominio que as contem
- Schemas que cruzam multiplos dominios ganham arquivo proprio (ex.: `follows.schema.ts`)
- Todos os schemas sao re-exportados pelo `index.ts` do diretorio

Ver [`schema-banco-de-dados.md`](./schema-banco-de-dados.md) para a lista completa de schemas planejados.

## Linting e Formatacao

### Biome

- **Arquivo de config**: `biome.json`
- **Indentacao**: tabs (nao espacos)
- **Aspas**: double quotes
- **Regras**: recommended do Biome habilitadas
- **Integrado ao editor** (recomendado: extensao Biome no VS Code)

## Scripts Disponiveis

| Script | Comando | Descricao |
|--------|---------|-----------|
| `dev` | `vite dev --port 3000` | Servidor de desenvolvimento local |
| `build` | `vite build` | Build para producao |
| `deploy` | `bun run build && wrangler deploy` | Build + deploy para Cloudflare |
| `db:generate` | `drizzle-kit generate` | Gera migrations a partir dos schemas |
| `db:migrate` | `drizzle-kit migrate` | Aplica migrations pendentes |
| `db:studio` | `drizzle-kit studio` | Abre o Drizzle Studio (interface web do banco) |

**Package manager**: Bun (`bun run`, `bunx`, `bun.lock`).

## Variaveis de Ambiente

Definidas em `.env` (local) e `.env.example` (template):

| Variavel | Descricao |
|----------|-----------|
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare |
| `CLOUDFLARE_DATABASE_ID` | ID do banco D1 |
| `CLOUDFLARE_D1_TOKEN` | Token de API para acesso ao D1 |
| `BETTER_AUTH_SECRET` | Secret para assinatura de tokens |
| `BETTER_AUTH_URL` | URL base da aplicacao (ex.: `http://localhost:3000`) |
| `DISCORD_CLIENT_ID` | Client ID do app Discord OAuth |
| `DISCORD_CLIENT_SECRET` | Client Secret do app Discord OAuth |
| `RESEND_API_KEY` | API key do Resend (email — reservado para uso futuro) |
| `RESEND_FROM` | Remetente padrao de emails |

As variaveis sao acessadas via `src/data/constants/env.ts`, que as le do `process.env`.
