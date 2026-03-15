# Feed / Build In Public

## Visao Geral

O Feed e o coracao da plataforma — um espaco onde membros compartilham atualizacoes sobre seus projetos (Build In Public) e admins publicam comunicados da comunidade. A exibicao e **cronologica reversa** (mais recente primeiro), sem algoritmo.

## Comportamento por Estado de Autenticacao

### Visitante na Home `/`

Nao ve o Feed. Em vez disso, ve a **Landing Page** com:
- Apresentacao da comunidade Indie Hacking Brasil
- Banner de chamada para entrar no Discord
- Projetos em destaque
- Proximos eventos
- Numeros da comunidade (membros, projetos, etc.)

### Membro autenticado na Home `/`

O Feed **substitui a Landing Page completamente**. A mesma rota `/` exibe conteudo diferente conforme o estado de auth.

### Rota `/feed`

URL dedicada para o Feed. Acessivel apenas para membros autenticados. Visitantes sao redirecionados para `/`.

---

## Schema: `posts.schema.ts`

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#posts-em-postsschemats).

```
posts
├── id (PK)
├── authorId (FK → user.id)
├── type (NOT NULL)
│   valores: announcement | build_in_public
├── content (NOT NULL — Markdown)
├── imageUrl
├── projectId (FK → projects.id, opcional)
└── createdAt
```

**Nota**: posts sao **imutaveis** apos publicacao — nao tem campo `updatedAt`. Se o autor quiser corrigir algo, exclui e recria o post.

---

## Tipos de Post

### `announcement` — Comunicado

- Criado **apenas por admins**
- Aparece com **destaque visual** diferenciado no feed (borda, icone ou cor de fundo distintos)
- Usado para novidades da comunidade, avisos, mudancas de regra, etc.
- Nao e vinculado a um projeto

### `build_in_public` — Build In Public (BIP)

- Criado por **qualquer membro com perfil completo**
- Pode (opcionalmente) ser vinculado a um projeto via `projectId`
- Quando vinculado, exibe informacoes resumidas do projeto junto ao post (nome, logo, status)
- Conteudo tipico: atualizacoes de desenvolvimento, marcos alcancados, metricas, aprendizados, perguntas

---

## Comportamento do Feed

### Exibicao

- **Ordem**: cronologica reversa — mais recente primeiro
- **Feed unificado**: announcements e BIP aparecem juntos no mesmo fluxo
- **Indicacao visual**: cada post tem badge ou icone indicando seu tipo
- Announcements tem destaque visual (ex.: fundo sutil diferente, icone de megafone)

### Filtros

Filtro opcional no topo do feed:
- **Todos** (padrao) — announcements + BIP misturados
- **Build In Public** — somente posts BIP
- **Comunicados** — somente announcements

### Paginacao

**Cursor-based** (recomendada para feeds cronologicos):
- O cursor e o `createdAt` do ultimo post carregado
- Cada pagina carrega N posts com `createdAt < cursor`
- Evita problemas de offset com posts novos sendo criados enquanto o usuario navega
- Implementacao: `WHERE created_at < ? ORDER BY created_at DESC LIMIT ?`

### Formulario de Novo Post

No topo do feed, formulario inline para criar um novo post:
- Campo de texto com suporte a Markdown
- Seletor de projeto (opcional) — dropdown com projetos do usuario
- Upload de imagem (opcional)
- Botao "Publicar"

Admins veem um toggle adicional para marcar o post como `announcement`.

---

## Suporte a Markdown

O campo `content` aceita Markdown. Na exibicao:
- Renderizar Markdown para HTML
- Sanitizar o HTML para evitar XSS (usar lib como `rehype-sanitize`)
- Suportar: headings, bold, italic, links, listas, code blocks, imagens inline

No formulario de criacao, oferecer preview do Markdown antes de publicar.

---

## Rotas

### `/` — `src/routes/page.tsx`

Rota da Home. Renderiza condicionalmente:
- Visitante: Landing Page
- Membro: Feed (mesmo componente que `/feed`)

### `/feed` — `src/routes/feed/page.tsx`

Rota dedicada do Feed. Protegida (requer auth + perfil completo).

---

## Server Functions

### `createPost(data: CreatePostInput)`
Cria post. Se `type = "announcement"`, verifica se o usuario e admin.

### `deletePost(postId: string, userId: string)`
Exclui post. Permite se `userId` e o autor do post ou um admin.

### `listFeed(cursor?: number, limit?: number, type?: string)`
Lista posts com paginacao cursor-based. Filtra por tipo se especificado.

Retorna para cada post:
- Dados do post
- Dados do autor (nome, username, avatar — via join com profile)
- Dados do projeto vinculado, se houver (nome, logo, slug — via join com projects)

### `getUserPosts(userId: string, cursor?: number, limit?: number)`
Lista posts de um usuario especifico. Usado na pagina de perfil.

---

## Validacao (Zod)

```
CreatePostInput:
  type: enum — announcement | build_in_public
  content: string — min 1, max 5000
  imageUrl: string | null — URL valida
  projectId: string | null — UUID valido, deve ser projeto existente do usuario
```

---

## Componentes

### `FeedList`
Lista de posts com infinite scroll (carrega mais ao chegar no final).

### `PostCard`
Card de post individual. Exibe: avatar do autor, nome, username, data relativa ("ha 2 horas"), tipo badge, conteudo renderizado (Markdown → HTML), imagem (se houver), projeto vinculado (se houver).

### `CreatePostForm`
Formulario inline no topo do feed. Textarea com preview Markdown, seletor de projeto, upload de imagem.

### `PostTypeFilter`
Filtros no topo do feed: Todos / Build In Public / Comunicados.

### `LinkedProjectPreview`
Preview compacto do projeto vinculado ao post (logo, nome, status badge). Clicavel, leva para a pagina do projeto.

### `LandingPage`
Componente da Landing Page exibida para visitantes na Home.

---

## Pontos em Aberto

- **Reacoes em posts**: nesta especificacao, posts nao tem reacoes (likes, etc.). Seria uma evolucao natural para a Fase 5 (Social), mas nao esta no escopo definido. Avaliar se faz sentido incluir.
- **Edicao de posts**: a decisao atual e que posts sao imutaveis. Se isso gerar fricacao com usuarios, considerar adicionar `updatedAt` e funcionalidade de edicao.
- **Limite de imagem**: definir tamanho maximo e formato aceito para `imageUrl`. Se usando URL externa, validar que e uma URL de imagem valida.
