# Schema do Banco de Dados

## Visao Geral

O banco de dados usa **Cloudflare D1 (SQLite)** com **Drizzle ORM**. Os schemas sao organizados por dominio, cada um em seu proprio arquivo dentro de `src/lib/db/schema/`.

## Convencoes

Todas as tabelas seguem as convencoes estabelecidas pelo `auth.schema.ts`:

- **IDs**: `text("id").primaryKey()` — strings geradas pela aplicacao (UUIDs)
- **Timestamps**: `integer("col", { mode: "timestamp_ms" })` com `default(sql\`(unixepoch() * 1000)\`)`
- **Booleans**: `integer("col", { mode: "boolean" })`
- **Strings**: `text("col")` — sem limite de tamanho (SQLite nao enforça)
- **Enum-like**: `text("col")` com validacao Zod na camada de aplicacao
- **Foreign keys**: `.references(() => tabela.id, { onDelete: "cascade" })`
- **Indices**: terceiro argumento do `sqliteTable()`, retornando array
- **Naming**: `snake_case` no banco, `camelCase` no TypeScript
- **Relations**: definidas com `relations()` do `drizzle-orm` para o query builder

## Arquivos de Schema

| Arquivo | Responsabilidade | Dependencias |
|---------|-----------------|-------------|
| `auth.schema.ts` | Usuarios e sessoes do Better-Auth | Nenhuma (existente, NAO modificar) |
| `profile.schema.ts` | Perfil publico do usuario | `auth.schema.ts` (user) |
| `projects.schema.ts` | Projetos + membros e roles | `auth.schema.ts` (user) |
| `events.schema.ts` | Eventos + membros/RSVP (futuro) | `auth.schema.ts` (user) |
| `posts.schema.ts` | Posts do feed (BIP e comunicados) | `auth.schema.ts` (user), `projects.schema.ts` |
| `follows.schema.ts` | Seguir usuarios e projetos | `auth.schema.ts` (user), `projects.schema.ts` |
| `recommendations.schema.ts` | Recomendacoes de projetos | `auth.schema.ts` (user), `projects.schema.ts` |
| `comments.schema.ts` | Comentarios e avaliacoes | `auth.schema.ts` (user), `projects.schema.ts` |

### Ordem de Criacao (por dependencia)

1. `auth.schema.ts` — ja existe
2. `profile.schema.ts` — depende de `user`
3. `projects.schema.ts` — depende de `user`
4. `events.schema.ts` — depende de `user`
5. `posts.schema.ts` — depende de `user` e `projects`
6. `follows.schema.ts` — depende de `user` e `projects`
7. `recommendations.schema.ts` — depende de `user` e `projects`
8. `comments.schema.ts` — depende de `user` e `projects`

Apos criar cada schema, atualizar `src/lib/db/schema/index.ts` para re-exportar:

```typescript
export * from "./auth.schema";
export * from "./profile.schema";
export * from "./projects.schema";
// ... etc
```

---

## Tabelas Existentes (Auth)

> **NAO MODIFICAR** — estas tabelas sao gerenciadas pelo Better-Auth.

### `user`

| Campo | Tipo Drizzle | Restricoes |
|-------|-------------|-----------|
| `id` | `text("id")` | PK |
| `name` | `text("name")` | NOT NULL |
| `email` | `text("email")` | NOT NULL, UNIQUE |
| `emailVerified` | `integer("email_verified", { mode: "boolean" })` | NOT NULL, default `false` |
| `image` | `text("image")` | — |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update |

Indices: `user_email_unique` em `email`.

### `session`

| Campo | Tipo Drizzle | Restricoes |
|-------|-------------|-----------|
| `id` | `text("id")` | PK |
| `expiresAt` | `integer("expires_at", { mode: "timestamp_ms" })` | NOT NULL |
| `token` | `text("token")` | NOT NULL, UNIQUE |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update |
| `ipAddress` | `text("ip_address")` | — |
| `userAgent` | `text("user_agent")` | — |
| `userId` | `text("user_id")` | NOT NULL, FK → `user.id` CASCADE |

Indices: `session_userId_idx` em `userId`, `session_token_unique` em `token`.

### `account`

| Campo | Tipo Drizzle | Restricoes |
|-------|-------------|-----------|
| `id` | `text("id")` | PK |
| `accountId` | `text("account_id")` | NOT NULL |
| `providerId` | `text("provider_id")` | NOT NULL |
| `userId` | `text("user_id")` | NOT NULL, FK → `user.id` CASCADE |
| `accessToken` | `text("access_token")` | — |
| `refreshToken` | `text("refresh_token")` | — |
| `idToken` | `text("id_token")` | — |
| `accessTokenExpiresAt` | `integer("access_token_expires_at", { mode: "timestamp_ms" })` | — |
| `refreshTokenExpiresAt` | `integer("refresh_token_expires_at", { mode: "timestamp_ms" })` | — |
| `scope` | `text("scope")` | — |
| `password` | `text("password")` | — |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update |

Indices: `account_userId_idx` em `userId`, `account_provider_account_unique` em (`providerId`, `accountId`).

### `verification`

| Campo | Tipo Drizzle | Restricoes |
|-------|-------------|-----------|
| `id` | `text("id")` | PK |
| `identifier` | `text("identifier")` | NOT NULL |
| `value` | `text("value")` | NOT NULL |
| `expiresAt` | `integer("expires_at", { mode: "timestamp_ms" })` | NOT NULL |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update |

Indices: `verification_identifier_idx` em `identifier`.

### Relations (Auth)

```
user 1 ──→ N session
user 1 ──→ N account
```

---

## Tabelas Novas

### `profile` (em `profile.schema.ts`)

Perfil publico do usuario. Relacao 1:1 com `user`.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID gerado pela aplicacao |
| `userId` | `text("user_id")` | NOT NULL, UNIQUE, FK → `user.id` CASCADE | Vinculo com tabela auth |
| `username` | `text("username")` | NOT NULL, UNIQUE | Username do Discord — identificador publico, usado na URL |
| `displayName` | `text("display_name")` | — | Nome de exibicao (pode ser diferente do Discord) |
| `bio` | `text("bio")` | — | Bio curta do usuario |
| `avatarUrl` | `text("avatar_url")` | — | URL do avatar (usa o do Discord por padrao) |
| `website` | `text("website")` | — | Site pessoal |
| `github` | `text("github")` | — | Username do GitHub |
| `twitter` | `text("twitter")` | — | Handle do X/Twitter |
| `linkedin` | `text("linkedin")` | — | URL do LinkedIn |
| `interests` | `text("interests", { mode: "json" })` | — | Array JSON de areas de interesse |
| `isOnboardingComplete` | `integer("is_onboarding_complete", { mode: "boolean" })` | NOT NULL, default `false` | Controle de fluxo do onboarding |
| `role` | `text("role")` | NOT NULL, default `"member"` | Role na plataforma: `member` / `moderator` / `admin` |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update | |

**Valores de `role`:**

| Valor | Descricao |
|-------|-----------|
| `member` | Membro comum da comunidade (padrao para todos os usuarios) |
| `moderator` | Moderador da comunidade — pode aprovar/rejeitar eventos e criar comunicados |
| `admin` | Administrador da plataforma — todas as permissoes de moderator + gerenciamento geral |

**Nota**: a role e atribuida manualmente no banco de dados ou via dashboard administrativo (futuro). Em uma versao futura, sera possivel sincronizar roles com as roles da comunidade no Discord via API.

**Indices:**
- `profile_userId_unique` em `userId` (UNIQUE)
- `profile_username_unique` em `username` (UNIQUE)
- `profile_role_idx` em `role`

**Relations:**
```
user 1 ──→ 1 profile
profile 1 ──→ N project_members (via userId)
```

---

### `projects` (em `projects.schema.ts`)

Projetos publicados pelos membros da comunidade.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `name` | `text("name")` | NOT NULL | Nome do projeto |
| `slug` | `text("slug")` | NOT NULL, UNIQUE | Slug para URL (gerado a partir do nome) |
| `description` | `text("description")` | — | Descricao detalhada do projeto |
| `url` | `text("url")` | — | URL do projeto/produto |
| `logoUrl` | `text("logo_url")` | — | URL do logo |
| `category` | `text("category")` | NOT NULL, default `"outro"` | `app` / `saas` / `micro_saas` / `startup` / `outro` |
| `status` | `text("status")` | NOT NULL, default `"ideia"` | `ideia` / `construindo` / `lancado` / `adquirido` |
| `tags` | `text("tags", { mode: "json" })` | — | Array JSON de tags |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update | |

**Indices:**
- `projects_slug_unique` em `slug` (UNIQUE)

---

### `project_members` (em `projects.schema.ts`)

Tabela de juncao para membros de um projeto com seus papeis. Vive dentro de `projects.schema.ts` por ser interna ao dominio de projetos.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `projectId` | `text("project_id")` | NOT NULL, FK → `projects.id` CASCADE | |
| `userId` | `text("user_id")` | NOT NULL, FK → `user.id` CASCADE | |
| `role` | `text("role")` | NOT NULL, default `"contributor"` | `owner` / `contributor` |
| `joinedAt` | `integer("joined_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |

**Indices:**
- `project_members_project_user_unique` em (`projectId`, `userId`) (UNIQUE)
- `project_members_project_idx` em `projectId`
- `project_members_user_idx` em `userId`

**Regras de negocio:**
- Cada projeto tem exatamente 1 membro com `role = "owner"` (criado automaticamente ao criar o projeto)
- Pode ter N membros com `role = "contributor"` (adicionados pelo owner)
- O owner e o unico que pode editar/excluir o projeto e gerenciar colaboradores

**Relations:**
```
projects 1 ──→ N project_members
user 1 ──→ N project_members
```

---

### `events` (em `events.schema.ts`)

Eventos da comunidade e parceiros.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `name` | `text("name")` | NOT NULL | Nome do evento |
| `description` | `text("description")` | — | Descricao curta |
| `date` | `integer("date", { mode: "timestamp_ms" })` | NOT NULL | Data e horario do evento |
| `format` | `text("format")` | NOT NULL | `presencial` / `digital` |
| `address` | `text("address")` | — | Endereco completo (somente se presencial) |
| `accessLink` | `text("access_link")` | — | Link de acesso (somente se digital) |
| `eventLink` | `text("event_link")` | NOT NULL | Link para pagina oficial do evento |
| `bannerUrl` | `text("banner_url")` | — | Banner/imagem do evento |
| `organizerName` | `text("organizer_name")` | NOT NULL | Nome do organizador |
| `isPartner` | `integer("is_partner", { mode: "boolean" })` | NOT NULL, default `false` | Se e parceiro externo (true) ou a propria comunidade (false) |
| `status` | `text("status")` | NOT NULL, default `"pending"` | Status de aprovacao: `pending` / `approved` / `rejected` |
| `rejectionReason` | `text("rejection_reason")` | — | Motivo da rejeicao, preenchido por moderator/admin |
| `submittedBy` | `text("submitted_by")` | NOT NULL, FK → `user.id` CASCADE | Membro que submeteu o evento |
| `reviewedBy` | `text("reviewed_by")` | FK → `user.id` SET NULL | Moderator/admin que revisou |
| `reviewedAt` | `integer("reviewed_at", { mode: "timestamp_ms" })` | — | Data da revisao |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update | |

**Indices:**
- `events_date_idx` em `date` (para ordenar proximos/passados)
- `events_status_idx` em `status` (para filtrar por status de aprovacao)
- `events_submittedBy_idx` em `submittedBy`

---

### `event_members` (em `events.schema.ts`)

Tabela reservada para o futuro sistema de RSVP. Criada agora para evitar migrations complexas depois, mas **nenhuma funcionalidade de RSVP sera exposta nesta versao**.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `eventId` | `text("event_id")` | NOT NULL, FK → `events.id` CASCADE | |
| `userId` | `text("user_id")` | NOT NULL, FK → `user.id` CASCADE | |
| `status` | `text("status")` | NOT NULL, default `"interessado"` | `interessado` / `nao_vou` / `confirmado` |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |

**Indices:**
- `event_members_event_user_unique` em (`eventId`, `userId`) (UNIQUE)

**Relations:**
```
events 1 ──→ N event_members
user 1 ──→ N event_members
```

---

### `posts` (em `posts.schema.ts`)

Posts do feed — comunicados de moderator/admin e atualizacoes de Build In Public.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `authorId` | `text("author_id")` | NOT NULL, FK → `user.id` CASCADE | Autor do post |
| `type` | `text("type")` | NOT NULL | `announcement` / `build_in_public` |
| `content` | `text("content")` | NOT NULL | Texto com suporte a Markdown |
| `imageUrl` | `text("image_url")` | — | Imagem opcional |
| `projectId` | `text("project_id")` | FK → `projects.id` SET NULL | Projeto vinculado (opcional, para posts BIP) |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |

**Nota**: posts nao tem `updatedAt` — sao imutaveis apos publicacao. Se necessario editar, o autor pode excluir e recriar.

**Indices:**
- `posts_authorId_idx` em `authorId`
- `posts_projectId_idx` em `projectId`
- `posts_createdAt_idx` em `createdAt` (para paginacao cronologica)
- `posts_type_idx` em `type` (para filtro por tipo)

**Relations:**
```
user 1 ──→ N posts
projects 1 ──→ N posts (opcional)
```

---

### `follows` (em `follows.schema.ts`)

Tabela polimorfica para seguir usuarios e projetos. Em arquivo proprio porque cruza dominios.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `followerId` | `text("follower_id")` | NOT NULL, FK → `user.id` CASCADE | Quem esta seguindo |
| `targetType` | `text("target_type")` | NOT NULL | `user` / `project` |
| `targetId` | `text("target_id")` | NOT NULL | ID do usuario ou projeto seguido |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |

**Indices:**
- `follows_follower_target_unique` em (`followerId`, `targetType`, `targetId`) (UNIQUE — evita follows duplicados)
- `follows_followerId_idx` em `followerId`
- `follows_target_idx` em (`targetType`, `targetId`) (para contar seguidores de um alvo)

**Nota sobre FK polimorfica**: `targetId` nao tem FK no banco porque aponta para tabelas diferentes conforme `targetType`. A integridade e garantida pela aplicacao. Alternativamente, pode-se criar duas tabelas separadas (`user_follows` e `project_follows`), mas a abordagem polimorfica e mais simples e suficiente para o escopo atual.

**Relations:**
```
user 1 ──→ N follows (como follower)
user/project ←── N follows (como target)
```

---

### `recommendations` (em `recommendations.schema.ts`)

Endosso publico de um usuario para um projeto. Em arquivo proprio porque cruza dominios.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `userId` | `text("user_id")` | NOT NULL, FK → `user.id` CASCADE | Quem esta recomendando |
| `projectId` | `text("project_id")` | NOT NULL, FK → `projects.id` CASCADE | Projeto recomendado |
| `message` | `text("message")` | — | Texto curto opcional explicando a recomendacao |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |

**Indices:**
- `recommendations_user_project_unique` em (`userId`, `projectId`) (UNIQUE — um usuario so pode recomendar o mesmo projeto uma vez)
- `recommendations_projectId_idx` em `projectId` (para listar recomendacoes de um projeto)

**Regras de negocio:**
- O owner do projeto **nao pode** recomendar o proprio projeto (validacao na aplicacao)
- A recomendacao e publica e aparece na pagina do projeto

**Relations:**
```
user 1 ──→ N recommendations
projects 1 ──→ N recommendations
```

---

### `comments` (em `comments.schema.ts`)

Comentarios e avaliacoes em projetos. Em arquivo proprio porque cruza dominios.

| Campo | Tipo Drizzle | Restricoes | Descricao |
|-------|-------------|-----------|-----------|
| `id` | `text("id")` | PK | UUID |
| `authorId` | `text("author_id")` | NOT NULL, FK → `user.id` CASCADE | Autor do comentario |
| `projectId` | `text("project_id")` | NOT NULL, FK → `projects.id` CASCADE | Projeto comentado |
| `content` | `text("content")` | NOT NULL | Texto do comentario (Markdown) |
| `rating` | `integer("rating")` | — | Avaliacao de 1 a 5 (opcional) |
| `createdAt` | `integer("created_at", { mode: "timestamp_ms" })` | NOT NULL, default now | |
| `updatedAt` | `integer("updated_at", { mode: "timestamp_ms" })` | NOT NULL, default now, auto-update | |

**Indices:**
- `comments_projectId_idx` em `projectId`
- `comments_authorId_idx` em `authorId`
- `comments_rating_unique` em (`authorId`, `projectId`) onde `rating IS NOT NULL` — logica: um usuario pode deixar multiplos comentarios, mas apenas **uma avaliacao (rating)** por projeto

**Nota sobre rating unico**: SQLite nao suporta indices parciais com WHERE nativamente no Drizzle. A unicidade do rating por usuario/projeto deve ser garantida na camada de aplicacao:
- Ao submeter um comentario com rating, verificar se o usuario ja tem um rating para aquele projeto
- Se ja existir, atualizar o rating existente em vez de criar um novo
- Comentarios sem rating podem ser ilimitados

**Relations:**
```
user 1 ──→ N comments
projects 1 ──→ N comments
```

---

## Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTH (existente)                            │
│                                                                     │
│  ┌────────┐    1:N    ┌──────────┐                                 │
│  │  user  │──────────→│ session  │                                 │
│  │        │           └──────────┘                                 │
│  │        │    1:N    ┌──────────┐                                 │
│  │        │──────────→│ account  │                                 │
│  └────┬───┘           └──────────┘                                 │
│       │                                                             │
└───────┼─────────────────────────────────────────────────────────────┘
        │
        │ 1:1
        ▼
  ┌──────────┐
  │ profile  │
  └──────────┘
        │
        │ (via user.id)
        ▼
   ┌─────────────────────────────────────────────────────┐
   │                                                     │
   │    ┌──────────┐    1:N    ┌─────────────────┐      │
   │    │ projects │──────────→│ project_members  │←── user
   │    │          │           └─────────────────┘      │
   │    └────┬─────┘                                    │
   │         │                                          │
   │         │ 1:N         1:N         1:N              │
   │         ├────────→ posts ←──── user                │
   │         ├────────→ recommendations ←── user        │
   │         ├────────→ comments ←── user                │
   │         └────────→ follows (target) ←── user       │
   │                                                     │
   │    ┌──────────┐    1:N    ┌─────────────────┐      │
   │    │ events   │──────────→│ event_members   │←── user
   │    └──────────┘           └─────────────────┘      │
   │                                                     │
   │    follows (user target) ←── user                   │
   │                                                     │
   └─────────────────────────────────────────────────────┘
```

### Resumo de Relacionamentos

| De | Para | Tipo | Via |
|----|------|------|-----|
| `user` | `profile` | 1:1 | `profile.userId` |
| `user` | `project_members` | 1:N | `project_members.userId` |
| `projects` | `project_members` | 1:N | `project_members.projectId` |
| `user` | `events` | 1:N | `events.submittedBy` |
| `user` | `events` | 1:N | `events.reviewedBy` (moderator/admin que revisou) |
| `events` | `event_members` | 1:N | `event_members.eventId` |
| `user` | `event_members` | 1:N | `event_members.userId` |
| `user` | `posts` | 1:N | `posts.authorId` |
| `projects` | `posts` | 1:N | `posts.projectId` (opcional) |
| `user` | `follows` | 1:N | `follows.followerId` |
| `user` | `recommendations` | 1:N | `recommendations.userId` |
| `projects` | `recommendations` | 1:N | `recommendations.projectId` |
| `user` | `comments` | 1:N | `comments.authorId` |
| `projects` | `comments` | 1:N | `comments.projectId` |

## Pontos em Aberto

- **Geracao de IDs**: definir se usaremos `crypto.randomUUID()` (disponivel em Cloudflare Workers) ou uma lib como `nanoid`. O `auth.schema.ts` delega a geracao ao Better-Auth — para os novos schemas, a aplicacao sera responsavel.
- **Soft delete**: nenhuma tabela usa soft delete no momento. Se necessario no futuro (ex.: projetos excluidos que precisam manter historico), adicionar campo `deletedAt` nas tabelas relevantes.
- **Full-text search**: SQLite suporta FTS5 para busca textual. Se busca global for implementada no futuro, considerar criar tabelas virtuais FTS para projetos, perfis e posts.
