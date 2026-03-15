# Roadmap de Desenvolvimento

## Fase 0 — Fundacao (Concluida)

Infraestrutura base ja implementada:

- [x] TanStack Start (React 19 + Vite) configurado
- [x] Deploy em Cloudflare Workers funcional
- [x] Autenticacao com Discord via Better-Auth
- [x] Banco de dados D1 com tabelas de auth (user, session, account, verification)
- [x] Drizzle ORM configurado com migrations
- [x] 30+ componentes shadcn/ui instalados
- [x] Tema claro/escuro (next-themes)
- [x] Biome para linting/formatacao
- [x] Estrutura de pastas definida

---

## Fase 1 — Onboarding e Perfil

> **Foco atual** — primeira funcionalidade a ser implementada.

**Documentacao**: [`funcionalidades/01-onboarding-perfil.md`](./funcionalidades/01-onboarding-perfil.md)

### Entregas

- [ ] Criar `profile.schema.ts` com tabela `profile`
- [ ] Atualizar `index.ts` do schema para exportar profile
- [ ] Gerar e aplicar migration
- [ ] Resolver obtencao do username do Discord (via API ou `mapProfileToUser`)
- [ ] Server functions: `createProfile`, `updateProfile`, `getProfileByUsername`, `getProfileByUserId`
- [ ] Validacao Zod para inputs de perfil
- [ ] Rota `/onboarding` com formulario de criacao de perfil
- [ ] Guard de onboarding (redirecionar usuario sem perfil)
- [ ] Rota `/u/:username` com pagina de perfil publico
- [ ] Rota `/configuracoes` com formulario de edicao
- [ ] Componentes: ProfileCard, ProfileForm, InterestSelector
- [ ] Logica de conteudo condicional na Home (Landing Page vs redirect para onboarding)

### Dependencias

- Nenhuma (alem da Fase 0 ja concluida)

### Pre-requisito para proximas fases

Todas as fases seguintes dependem do perfil estar implementado, pois `user.id` e referenciado como FK em praticamente todas as tabelas.

---

## Fase 2 — Projetos

**Documentacao**: [`funcionalidades/02-projetos.md`](./funcionalidades/02-projetos.md)

### Entregas

- [ ] Criar `projects.schema.ts` com tabelas `projects` e `project_members`
- [ ] Gerar e aplicar migration
- [ ] Server functions: CRUD de projetos, gerenciamento de contributors
- [ ] Validacao Zod para inputs de projeto
- [ ] Geracao automatica de slug
- [ ] Rota `/projects` com listagem e filtros
- [ ] Rota `/projects/novo` com formulario de criacao
- [ ] Rota `/projects/:slug` com pagina individual
- [ ] Rota `/projects/:slug/editar` com formulario de edicao (owner only)
- [ ] Componentes: ProjectCard, ProjectForm, ProjectStatusBadge, TeamSection, AddContributorDialog
- [ ] Sistema de roles: owner automatico na criacao, adicao/remocao de contributors

### Dependencias

- Fase 1 (Perfil) — precisa de `user.id` para FK em `project_members`

---

## Fase 3 — Eventos

**Documentacao**: [`funcionalidades/03-eventos.md`](./funcionalidades/03-eventos.md)

### Entregas

- [ ] Criar `events.schema.ts` com tabelas `events` e `event_members`
- [ ] Gerar e aplicar migration
- [ ] Definir sistema de admin (como marcar usuarios como admin)
- [ ] Server functions: CRUD de eventos (admin-only)
- [ ] Validacao Zod com campos condicionais (presencial vs digital)
- [ ] Rota `/events` com listagem (proximos + passados)
- [ ] Rota `/events/:id` com pagina individual
- [ ] Rota `/events/novo` e `/events/:id/editar` (admin-only)
- [ ] Componentes: EventCard, EventForm, EventFormatBadge
- [ ] Formatacao de datas em pt-BR

### Dependencias

- Fase 1 (Perfil) — precisa de `user.id` para `createdBy`
- Sistema de admin definido

### Nota

A tabela `event_members` e criada nesta fase mas nao e exposta na interface. Funcionalidade de RSVP e futura.

---

## Fase 4 — Feed / Build In Public

**Documentacao**: [`funcionalidades/04-feed.md`](./funcionalidades/04-feed.md)

### Entregas

- [ ] Criar `posts.schema.ts` com tabela `posts`
- [ ] Gerar e aplicar migration
- [ ] Server functions: criar post, listar feed, excluir post
- [ ] Paginacao cursor-based
- [ ] Renderizacao de Markdown para HTML (com sanitizacao)
- [ ] Conteudo condicional na Home: Landing Page (visitante) vs Feed (membro)
- [ ] Rota `/feed` dedicada (protegida)
- [ ] Componentes: FeedList, PostCard, CreatePostForm, PostTypeFilter, LandingPage
- [ ] Filtros por tipo (todos / BIP / comunicados)
- [ ] Destaque visual para announcements
- [ ] Vinculo de post com projeto (opcional)

### Dependencias

- Fase 1 (Perfil) — precisa de `user.id` para `authorId`
- Fase 2 (Projetos) — para vinculo de post com projeto via `projectId`
- Sistema de admin — para posts do tipo `announcement`

---

## Fase 5 — Funcionalidades Sociais

**Documentacao**: [`funcionalidades/05-social.md`](./funcionalidades/05-social.md)

### Entregas

- [ ] Criar `follows.schema.ts` com tabela `follows`
- [ ] Criar `recommendations.schema.ts` com tabela `recommendations`
- [ ] Criar `comments.schema.ts` com tabela `comments`
- [ ] Gerar e aplicar migrations
- [ ] Server functions: follow/unfollow, recomendar/remover recomendacao, CRUD de comentarios
- [ ] Logica de rating unico por usuario/projeto
- [ ] Calculo de media de avaliacoes
- [ ] Botao "Seguir" em perfis e projetos
- [ ] Contadores de seguidores em perfis e projetos
- [ ] Secao "Recomendacoes" na pagina de projeto
- [ ] Secao "Comentarios e Avaliacoes" na pagina de projeto
- [ ] Componentes: FollowButton, RecommendButton, RecommendationList, CommentList, CommentForm, StarRating, RatingSummary

### Dependencias

- Fase 1 (Perfil) — precisa de `user.id` para todas as tabelas
- Fase 2 (Projetos) — precisa de `projects.id` para recomendacoes e comentarios

---

## Futuro (Sem Fase Definida)

Funcionalidades planejadas para alem das 5 fases iniciais, sem ordem de prioridade definida:

### RSVP para Eventos
- Ativar funcionalidade da tabela `event_members` (ja criada na Fase 3)
- Status: interessado, nao vou, confirmado
- Limite de vagas com lista de espera
- Contador de confirmados na pagina do evento

### Sistema de Notificacoes
- Notificacoes in-app para: novo seguidor, recomendacao recebida, comentario no projeto, novo post de quem segue
- Centro de notificacoes (`/notificacoes`)
- Badge de contagem no header
- Opcoes de preferencia de notificacao

### Integracao com Bot do Discord
- Notificar no Discord quando: novo projeto publicado, novo evento criado, marcos de BIP
- Sincronizar roles do Discord com permissoes na plataforma (ex.: role de admin)
- Comando de bot para consultar perfil/projeto diretamente no Discord

### Busca Global
- Busca unificada por: usuarios, projetos, posts, eventos
- Implementacao com SQLite FTS5 (Full-Text Search)
- Barra de busca no header com resultados categorized

### Email Transacional
- Infraestrutura ja parcialmente preparada (Resend API key no `.env`)
- Emails para: boas-vindas, resumo semanal, notificacoes importantes
- Templates em pt-BR

### Feed Personalizado
- Opcao de ver apenas posts de usuarios/projetos que segue
- Feed "Descubra" com projetos novos e populares

### Analytics para Projetos
- Dashboard do owner com metricas: visitas ao perfil, recomendacoes ao longo do tempo, seguidores
- Metricas opcionais: MRR, usuarios ativos (informados manualmente pelo owner)

---

## Tarefas Tecnicas Transversais

Tarefas que devem ser feitas em paralelo ou entre as fases:

- [ ] **Atualizar `site.ts`**: mudar `name` de "Rychillie" para "Indie Hacking Brasil"
- [ ] **Meta tags**: adicionar Open Graph e Twitter Cards no `__root.tsx` para SEO
- [ ] **Error boundaries**: implementar paginas de erro 404 e 500
- [ ] **Loading states**: skeleton screens consistentes para todas as paginas
- [ ] **Responsividade**: garantir que todas as paginas funcionam bem em mobile
- [ ] **Acessibilidade**: labels, focus management, contraste adequado
- [ ] **Storage de imagens**: decidir solucao para upload (R2, Uploadthing, ou URL externa)
- [ ] **Sistema de admin**: definir como identificar admins (campo no profile, env var, ou tabela separada)
- [ ] **Geracao de IDs**: definir estrategia (`crypto.randomUUID()` vs `nanoid`)
- [ ] **Rate limiting**: proteger endpoints de criacao contra abuso
