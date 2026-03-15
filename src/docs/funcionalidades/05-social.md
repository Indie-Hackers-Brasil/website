# Funcionalidades Sociais

## Visao Geral

A plataforma oferece um conjunto de interacoes sociais entre usuarios e projetos:

1. **Seguir usuarios** — acompanhar a atividade de outros membros
2. **Seguir projetos** — acompanhar atualizacoes de projetos
3. **Recomendar projetos** — endosso publico de um projeto
4. **Comentar e avaliar projetos** — feedback em projetos de outros membros

Todas as interacoes sociais requerem **perfil completo** (onboarding concluido).

---

## 1. Follows (Seguir)

### Schema: `follows.schema.ts`

Tabela polimorfica que cobre seguir usuarios e projetos no mesmo modelo. Em arquivo proprio porque cruza dominios.

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#follows-em-followsschemats).

```
follows
├── id (PK)
├── followerId (FK → user.id — quem segue)
├── targetType (user | project)
├── targetId (ID do usuario ou projeto seguido)
└── createdAt
```

Indice unico em (`followerId`, `targetType`, `targetId`) — evita follows duplicados.

### Comportamento

- **Seguir e silencioso** — nao gera notificacao nesta versao
- Um usuario **nao pode seguir a si mesmo**
- O botao "Seguir"/"Deixar de seguir" aparece:
  - Na pagina de perfil de outro usuario
  - Na pagina de um projeto
  - Nos cards de projeto e perfil em listagens (opcional)

### Contadores

- **Perfil do usuario**: exibe "X seguidores" e "Seguindo Y"
- **Pagina do projeto**: exibe "X seguidores"
- Contadores sao calculados via `COUNT` na tabela `follows` com o filtro de `targetType` e `targetId`

### Server Functions

#### `followTarget(followerId: string, targetType: string, targetId: string)`
Cria registro de follow. Valida que o alvo existe e que nao e auto-follow.

#### `unfollowTarget(followerId: string, targetType: string, targetId: string)`
Remove registro de follow.

#### `isFollowing(followerId: string, targetType: string, targetId: string)`
Verifica se o usuario ja segue o alvo. Usado para renderizar o estado do botao.

#### `getFollowerCount(targetType: string, targetId: string)`
Conta seguidores de um alvo.

#### `getFollowingCount(userId: string)`
Conta quantos usuarios/projetos o usuario segue.

#### `getFollowers(targetType: string, targetId: string, cursor?: number)`
Lista seguidores de um alvo com paginacao.

#### `getFollowing(userId: string, targetType?: string, cursor?: number)`
Lista quem/o que o usuario segue, com filtro opcional por tipo.

### Componentes

#### `FollowButton`
Botao toggle: "Seguir" (outline) / "Seguindo" (filled). Ao hover no estado "Seguindo", muda para "Deixar de seguir" (vermelho).

#### `FollowerCount`
Texto clicavel "X seguidores" que abre lista de seguidores.

---

## 2. Recomendacoes

### Schema: `recommendations.schema.ts`

Endosso publico de um usuario para um projeto. Diferente de um "like" — e uma recomendacao com peso social, pois mostra publicamente quem recomendou.

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#recommendations-em-recommendationsschemats).

```
recommendations
├── id (PK)
├── userId (FK → user.id — quem recomenda)
├── projectId (FK → projects.id)
├── message (texto curto opcional)
└── createdAt
```

Indice unico em (`userId`, `projectId`) — um usuario so pode recomendar o mesmo projeto uma vez.

### Regras de Negocio

- Um usuario so pode recomendar o mesmo projeto **uma vez**
- O **owner do projeto nao pode recomendar o proprio projeto** (validacao na aplicacao)
- Contributors **podem** recomendar o projeto em que participam
- A recomendacao e **publica** — aparece na pagina do projeto com nome e avatar de quem recomendou
- A mensagem e opcional — o usuario pode recomendar sem explicar o motivo

### Exibicao na Pagina do Projeto

Secao "Recomendacoes" mostrando:
- Contagem total ("12 recomendacoes")
- Lista de quem recomendou: avatar, nome, e mensagem (se houver)
- Botao "Recomendar" para quem ainda nao recomendou
- Texto "Voce ja recomendou este projeto" para quem ja recomendou (com opcao de remover)

### Server Functions

#### `recommendProject(userId: string, projectId: string, message?: string)`
Cria recomendacao. Valida: usuario nao e owner, nao recomendou antes.

#### `removeRecommendation(userId: string, projectId: string)`
Remove a propria recomendacao.

#### `getProjectRecommendations(projectId: string)`
Lista todas as recomendacoes de um projeto com dados dos usuarios.

#### `hasRecommended(userId: string, projectId: string)`
Verifica se o usuario ja recomendou o projeto.

#### `getRecommendationCount(projectId: string)`
Conta recomendacoes de um projeto.

### Componentes

#### `RecommendButton`
Botao para recomendar um projeto. Pode abrir um dialog para adicionar mensagem opcional.

#### `RecommendationList`
Lista de recomendacoes na pagina do projeto. Cada item: avatar, nome (link para perfil), mensagem.

#### `RecommendDialog`
Dialog com textarea para mensagem opcional e botao de confirmar.

---

## 3. Comentarios e Avaliacoes

### Schema: `comments.schema.ts`

Comentarios e avaliacoes em projetos. Cada comentario pode ter uma nota (rating) opcional de 1 a 5.

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#comments-em-commentsschemats).

```
comments
├── id (PK)
├── authorId (FK → user.id)
├── projectId (FK → projects.id)
├── content (NOT NULL — Markdown)
├── rating (1-5, opcional)
├── createdAt
└── updatedAt
```

### Regras para Rating

A regra de rating merece atencao especial:

- Um usuario pode deixar **multiplos comentarios** no mesmo projeto (feedback continuo)
- Um usuario pode deixar **apenas uma avaliacao (rating)** por projeto
- Se o usuario ja avaliou e submeter novo comentario com rating, o rating anterior e atualizado
- Comentarios sem rating sao ilimitados

**Implementacao sugerida:**
1. Ao submeter comentario com rating, verificar se ja existe um rating do usuario para o projeto
2. Se sim: atualizar o rating no comentario existente e criar o novo comentario sem rating
3. Se nao: criar o comentario com o rating

### Media de Avaliacoes

A pagina do projeto exibe a **media das avaliacoes** e a quantidade de avaliacoes:
- "4.2 / 5 (23 avaliacoes)"
- Calculada via `AVG(rating)` e `COUNT(rating)` nos comentarios com `rating IS NOT NULL`

### Exibicao na Pagina do Projeto

Secao "Comentarios e Avaliacoes":
1. **Resumo de avaliacoes**: media, quantidade, distribuicao por estrela (grafico de barras horizontal simples)
2. **Formulario de novo comentario**: textarea + seletor de estrelas (opcional)
3. **Lista de comentarios**: ordem cronologica (mais recente primeiro)
   - Cada comentario: avatar, nome, data, estrelas (se houver), conteudo

### Permissoes

- **Criar comentario**: qualquer membro com perfil completo
- **Editar comentario**: apenas o autor
- **Excluir comentario**: autor ou admin
- **Owner do projeto**: pode comentar no proprio projeto (ex.: responder perguntas), mas nao pode se auto-avaliar (rating bloqueado no proprio projeto)

### Server Functions

#### `createComment(data: CreateCommentInput)`
Cria comentario. Se incluir rating, verifica a regra de rating unico.

#### `updateComment(commentId: string, authorId: string, data: UpdateCommentInput)`
Atualiza comentario. Apenas o autor pode editar.

#### `deleteComment(commentId: string, requesterId: string)`
Exclui comentario. Permite se for o autor ou admin.

#### `getProjectComments(projectId: string, cursor?: number)`
Lista comentarios do projeto com paginacao cursor-based.

#### `getProjectRatingSummary(projectId: string)`
Retorna media, contagem total e distribuicao por estrela.

### Validacao (Zod)

```
CreateCommentInput:
  projectId: string — UUID valido
  content: string — min 1, max 2000
  rating: number | null — inteiro de 1 a 5
```

### Componentes

#### `CommentList`
Lista de comentarios com paginacao.

#### `CommentCard`
Card de comentario individual: avatar, nome, data, estrelas (se houver), conteudo Markdown renderizado.

#### `CommentForm`
Formulario: textarea + seletor de estrelas opcional + botao "Comentar".

#### `RatingSummary`
Exibicao da media de avaliacoes com estrelas visuais e barra de distribuicao.

#### `StarRating`
Componente de selecao de estrelas (1-5), reutilizado no formulario e na exibicao.

---

## Requisitos Transversais

### Perfil Completo Obrigatorio

Todas as interacoes sociais (seguir, recomendar, comentar) requerem `profile.isOnboardingComplete = true`. Se o usuario tentar interagir sem perfil completo, deve ser redirecionado para o onboarding.

### Performance

- Contadores (seguidores, recomendacoes, media de avaliacoes) podem ser cacheados se o volume crescer
- Para o escopo inicial, calcular em tempo real via queries agregadas e suficiente
- Queries de feed social (posts de quem o usuario segue) sao complexas — considerar desnormalizar se necessario no futuro

---

## Pontos em Aberto

- **Notificacoes**: nao ha sistema de notificacoes nesta versao. Follows, recomendacoes e comentarios sao "silenciosos". Notificacoes sao planejadas para uma fase futura.
- **Moderacao de comentarios**: nao ha sistema de report/denuncia ou moderacao automatica. Se necessario, adicionar campo `isHidden` e fluxo de report.
- **Follows polimorficos vs tabelas separadas**: a abordagem polimorfica (campo `targetType`) e mais simples, mas impede FKs no banco. Se a integridade referencial for preocupacao, considerar tabelas separadas `user_follows` e `project_follows`. Para o escopo atual, a abordagem polimorfica e adequada.
