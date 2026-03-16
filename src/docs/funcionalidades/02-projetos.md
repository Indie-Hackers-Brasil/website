# Projetos

## Visao Geral

Usuarios publicam seus projetos na plataforma para dar visibilidade ao que estao construindo. Cada projeto tem um **owner** (dono) e pode ter **contributors** (colaboradores).

Tipos de projeto suportados: **App**, **SaaS**, **Micro-SaaS**, **Startup** e **Outro**.

Cada projeto passa por um ciclo de vida com status: **Ideia** → **Construindo** → **Lancado** → **Adquirido**.

## Comportamento por Estado de Autenticacao

### Visitante na listagem `/projects`

- Ve a lista de projetos com informacoes basicas: nome, descricao curta, categoria, status
- Nao pode interagir (sem botoes de seguir, recomendar, comentar)
- Banner convidando a se cadastrar para criar e interagir com projetos

### Visitante na pagina `/projects/:slug`

- Ve descricao completa, equipe (membros com roles) e lista de recomendacoes
- Nao pode recomendar, comentar, avaliar ou seguir
- Banner de cadastro

### Usuario autenticado (membro)

- Na listagem: filtros por categoria e status, botao "Criar projeto" no topo
- Na pagina: botoes de recomendar, comentar, avaliar e seguir o projeto

### Owner do projeto

Tudo do membro autenticado, mais:
- Botao "Editar projeto"
- Botao "Gerenciar colaboradores" (adicionar/remover contributors)
- Botao "Excluir projeto"

---

## Schema: `projects.schema.ts`

Este arquivo contem duas tabelas: `projects` e `project_members`.

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#projects-em-projectsschemats).

### Tabela `projects`

```
projects
├── id (PK)
├── name (NOT NULL)
├── slug (NOT NULL, UNIQUE)
├── description
├── url
├── logoUrl
├── category (NOT NULL, default "outro")
│   valores: app | saas | micro_saas | startup | outro
├── status (NOT NULL, default "ideia")
│   valores: ideia | construindo | lancado | adquirido
├── tags (JSON — array de strings)
├── createdAt
└── updatedAt
```

### Tabela `project_members`

```
project_members
├── id (PK)
├── projectId (FK → projects.id)
├── userId (FK → user.id)
├── role (NOT NULL, default "contributor")
│   valores: owner | contributor
└── joinedAt
```

---

## Categorias

| Valor | Exibicao | Descricao |
|-------|---------|-----------|
| `app` | App | Aplicativo mobile ou desktop |
| `saas` | SaaS | Software as a Service |
| `micro_saas` | Micro-SaaS | SaaS de nicho, operado por 1-2 pessoas |
| `startup` | Startup | Empresa em estagio inicial |
| `outro` | Outro | Nao se encaixa nas categorias acima |

## Status (Ciclo de Vida)

| Valor | Exibicao | Cor sugerida | Descricao |
|-------|---------|-------------|-----------|
| `ideia` | Ideia | Cinza | Apenas conceito, nao comecou a construir |
| `construindo` | Construindo | Amarelo | Em desenvolvimento ativo |
| `lancado` | Lancado | Verde | Produto disponivel para usuarios |
| `adquirido` | Adquirido | Azul | Projeto vendido ou adquirido |

---

## Sistema de Roles

### Owner

- Criado automaticamente ao criar o projeto (o criador e sempre o owner)
- **Unico** por projeto — nao pode haver dois owners
- Pode: editar o projeto, excluir o projeto, adicionar/remover contributors
- Nao pode: transferir ownership (funcionalidade futura, se necessario)

### Contributor

- Adicionado pelo owner
- Pode haver **multiplos** contributors por projeto
- Na pagina do projeto, contributors aparecem na secao de equipe
- Nao pode editar o projeto ou gerenciar outros membros

### Regras

- Ao criar um projeto, um registro `project_members` com `role = "owner"` e criado automaticamente
- O owner adiciona contributors buscando por username
- O owner pode remover qualquer contributor
- Um contributor pode se remover (sair do projeto)

---

## Rotas

### `/projects` — `src/routes/projects/page.tsx`

Listagem publica de projetos.

- **Filtros**: por categoria, por status, busca por nome
- **Ordenacao**: mais recentes primeiro (padrao), ou por nome
- **Paginacao**: offset-based (projetos nao mudam de posicao com frequencia)
- **Botao "Criar projeto"**: visivel apenas para membros autenticados

### `/projects/novo` — `src/routes/projects/novo/page.tsx`

Formulario de criacao de projeto. Rota protegida (requer autenticacao + perfil completo).

### `/projects/:slug` — `src/routes/projects/$slug/page.tsx`

Pagina individual do projeto.

**Secoes:**
1. **Header**: logo, nome, categoria badge, status badge
2. **Descricao**: texto completo do projeto
3. **Links**: URL do projeto, tags
4. **Equipe**: lista de membros com roles (owner em destaque)
5. **Recomendacoes**: lista de usuarios que recomendaram, com mensagem opcional
6. **Comentarios**: comentarios em ordem cronologica, com avaliacoes (estrelas)

### `/projects/:slug/editar` — `src/routes/projects/$slug/editar/page.tsx`

Formulario de edicao. Acessivel apenas pelo owner.

---

## Server Functions

### `createProject(data: CreateProjectInput)`
Cria o projeto e o registro de `project_members` com `role = "owner"` em uma transacao.

### `updateProject(projectId: string, userId: string, data: UpdateProjectInput)`
Atualiza o projeto. Verifica se `userId` e owner antes de permitir.

### `deleteProject(projectId: string, userId: string)`
Exclui o projeto e todos os registros relacionados (cascade). Verifica ownership.

### `getProjectBySlug(slug: string)`
Busca projeto pelo slug, incluindo membros (com perfis) e contagem de recomendacoes.

### `listProjects(filters: ProjectFilters)`
Lista projetos com filtros e paginacao.

### `addContributor(projectId: string, ownerId: string, contributorUserId: string)`
Adiciona contributor. Verifica se `ownerId` e owner do projeto.

### `removeContributor(projectId: string, requesterId: string, contributorUserId: string)`
Remove contributor. Permite se `requesterId` e owner OU se `requesterId = contributorUserId` (auto-remocao).

---

## Geracao de Slug

O slug e gerado automaticamente a partir do nome do projeto:

1. Converter para minusculas
2. Remover acentos (normalize + replace)
3. Substituir espacos e caracteres especiais por `-`
4. Remover hifens consecutivos
5. Trimmar hifens no inicio e fim
6. Se slug ja existir no banco, adicionar sufixo numerico (`-2`, `-3`, etc.)

Exemplo: "Meu App Incrivel!" → `meu-app-incrivel`

---

## Validacao (Zod)

```
CreateProjectInput:
  name: string — min 2, max 100
  description: string | null — max 2000
  url: string | null — URL valida
  logoUrl: string | null — URL valida
  category: enum — app | saas | micro_saas | startup | outro
  status: enum — ideia | construindo | lancado | adquirido
  tags: string[] | null — max 10 tags, cada uma max 30 chars
```

---

## Componentes

### `ProjectCard`
Card de projeto para listagens. Exibe: logo, nome, descricao curta (truncada), categoria badge, status badge, contagem de recomendacoes.

### `ProjectForm`
Formulario reutilizado para criacao e edicao. Campos dinamicos baseados na categoria selecionada.

### `ProjectStatusBadge`
Badge colorido indicando o status do projeto.

### `ProjectCategoryBadge`
Badge indicando a categoria do projeto.

### `TeamSection`
Secao de equipe com lista de membros, destacando o owner. Botao "Adicionar colaborador" visivel apenas para o owner.

### `AddContributorDialog`
Dialog para buscar e adicionar contributors por username.

---

## Decisoes Tomadas

### Upload de logo: Cloudflare R2

Upload de imagens via **Cloudflare R2**, com utilitario generico reutilizavel para avatar de perfil e banner de eventos.

- Bucket binding `STORAGE` no `wrangler.jsonc`
- API route `POST /api/uploads/*` para upload e `GET /api/uploads/*` para servir arquivos
- Limite: 2MB, formatos JPEG/PNG/WebP/SVG
- Campo `logoUrl` armazena o caminho relativo `/api/uploads/{key}`
- Categorias de upload: `project-logos`, `avatars`, `event-banners`

### Tags: Lista pre-definida

Tags organizadas por categoria em `src/data/constants/tags.ts`.

- Categorias: **Tecnologia**, **Mercado**, **Modelo de Negocio**
- Usuarios selecionam de lista fixa (sem free-form)
- Maximo de 10 tags por projeto
- Lista inicial focada na comunidade brasileira de indie hackers
- Arquivo bem comentado para facilitar contribuicoes via Pull Request (repositorio open source)
