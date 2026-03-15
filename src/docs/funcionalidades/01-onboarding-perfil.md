# Onboarding e Perfil

## Visao Geral

Apos fazer login via Discord, o usuario precisa completar seu perfil na plataforma antes de acessar qualquer funcionalidade. O fluxo de onboarding coleta informacoes que compoem o perfil publico do usuario.

O **username e herdado automaticamente do Discord** — nao ha campo para o usuario escolher um handle separado. Isso simplifica o fluxo e garante consistencia com a identidade do usuario na comunidade.

## Comportamento por Estado de Autenticacao

### Visitante em `/u/:username`

Ve uma versao resumida e publica do perfil:
- Nome de exibicao, avatar e bio
- Lista de projetos do usuario (nome, categoria, status)
- Banner com chamada para se cadastrar na comunidade

Nao ve: contadores de seguidores, botao de seguir, posts recentes.

### Usuario autenticado em `/u/:username` (perfil de outro usuario)

Ve o perfil completo:
- Nome de exibicao, avatar, bio, links (GitHub, Twitter, LinkedIn, site)
- Areas de interesse
- Projetos como owner e como contributor
- Posts recentes de BIP
- Contadores: seguidores, seguindo
- Botao "Seguir" / "Deixar de seguir"

### Usuario autenticado no proprio perfil `/u/:username`

Tudo do perfil completo, mais:
- Botao "Editar perfil" que leva para `/configuracoes`
- Indicador visual de que e o proprio perfil

---

## Fluxo de Onboarding

### Gatilho

O onboarding e ativado quando:
1. O usuario faz login via Discord (sessao criada)
2. Nao existe registro na tabela `profile` para o `user.id`, **ou** o registro existe com `isOnboardingComplete = false`

Nesse caso, qualquer tentativa de acessar rotas que exigem perfil completo resulta em redirecionamento para `/onboarding`.

### Dados Pre-preenchidos do Discord

O Better-Auth armazena na tabela `user`:
- `name` — nome de exibicao do Discord (pre-preenche `displayName`)
- `image` — URL do avatar do Discord (pre-preenche `avatarUrl`)

O username do Discord precisa ser obtido via a API do Discord, usando o `accessToken` armazenado na tabela `account`. Essa chamada deve ser feita no momento do onboarding para popular o campo `username` automaticamente.

### Etapas do Onboarding

O formulario pode ser multi-step ou single-page. Recomendacao: **single-page com secoes visuais**, para simplificar a implementacao e permitir que o usuario preencha no seu ritmo.

**Campos:**

| Campo | Obrigatorio | Pre-preenchido | Descricao |
|-------|------------|----------------|-----------|
| `username` | Sim | Sim (do Discord) | Username do Discord, exibido como `@username`. Nao editavel |
| `displayName` | Nao | Sim (do Discord) | Nome de exibicao. Se vazio, usa `user.name` |
| `bio` | Nao | Nao | Bio curta (max 280 caracteres sugerido) |
| `avatarUrl` | Nao | Sim (do Discord) | URL do avatar. Usa o do Discord por padrao |
| `website` | Nao | Nao | URL do site pessoal |
| `github` | Nao | Nao | Username do GitHub |
| `twitter` | Nao | Nao | Handle do X/Twitter (sem @) |
| `linkedin` | Nao | Nao | URL do perfil LinkedIn |
| `interests` | Nao | Nao | Areas de interesse selecionaveis |

### Areas de Interesse (Sugestoes)

Lista pre-definida para selecao multipla:
- Mobile (iOS/Android)
- SaaS B2B
- SaaS B2C
- Micro-SaaS
- AI / Machine Learning
- Open Source
- E-commerce
- Fintech
- EdTech
- HealthTech
- DevTools
- Automacao
- No-code / Low-code
- Marketing Digital
- Comunidades

O campo `interests` e armazenado como JSON (`text` com `mode: "json"`) — um array de strings.

### Finalizacao

Ao submeter o formulario:
1. Criar (ou atualizar) registro na tabela `profile`
2. Marcar `isOnboardingComplete = true`
3. Redirecionar para `/` (que agora mostra o Feed)

### Perfil "Completo" vs "Incompleto"

- **Incompleto**: `isOnboardingComplete = false` — usuario nao passou pelo onboarding ou nao finalizou
- **Completo**: `isOnboardingComplete = true` — usuario passou pelo onboarding com sucesso

O unico requisito para marcar como completo e ter passado pelo fluxo. Nao ha obrigatoriedade de preencher todos os campos opcionais.

---

## Schema: `profile.schema.ts`

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#profile-em-profileschemats).

Resumo dos campos:

```
profile
├── id (PK)
├── userId (FK → user.id, UNIQUE)
├── username (UNIQUE — do Discord)
├── displayName
├── bio
├── avatarUrl
├── website
├── github
├── twitter
├── linkedin
├── interests (JSON)
├── isOnboardingComplete (boolean)
├── createdAt
└── updatedAt
```

---

## Rotas

### `/onboarding` — `src/routes/onboarding/page.tsx`

Formulario de criacao de perfil.

- **Visitante**: redireciona para `/`
- **Autenticado sem perfil**: exibe o formulario
- **Membro com perfil completo**: redireciona para `/`

### `/u/:username` — `src/routes/u/$username/page.tsx`

Pagina de perfil publico.

- Carrega o perfil pelo `username` (parametro da URL)
- Se nao encontrar, exibe pagina 404
- Conteudo varia por estado de auth (ver secao acima)

### `/configuracoes` — `src/routes/configuracoes/page.tsx`

Pagina de edicao de perfil (apenas para o proprio usuario).

- **Visitante**: redireciona para `/`
- **Autenticado**: exibe formulario de edicao com todos os campos do perfil
- Pre-preenche com os dados atuais do perfil
- `username` continua nao editavel

---

## Server Functions

### `getProfileByUsername(username: string)`
Busca perfil pelo username. Usado para a pagina `/u/:username`.

### `getProfileByUserId(userId: string)`
Busca perfil pelo ID do usuario auth. Usado para verificar se onboarding foi concluido.

### `createProfile(data: CreateProfileInput)`
Cria registro de perfil no onboarding. Valida unicidade do username.

### `updateProfile(userId: string, data: UpdateProfileInput)`
Atualiza perfil existente. Nao permite alterar `username`.

### `getDiscordUsername(userId: string)`
Busca o username do Discord usando o `accessToken` da tabela `account`. Chamado durante o onboarding para popular o campo `username`.

---

## Validacao (Zod)

```
CreateProfileInput:
  username: string — min 2, max 32, regex slug-safe (a-z, 0-9, _, .), readonly
  displayName: string | null — max 100
  bio: string | null — max 280
  avatarUrl: string | null — URL valida
  website: string | null — URL valida
  github: string | null — max 39 (limite do GitHub)
  twitter: string | null — max 15
  linkedin: string | null — URL valida
  interests: string[] | null — array de strings da lista pre-definida
```

---

## Componentes

### `ProfileCard`
Card compacto de perfil (avatar, nome, username, bio curta). Usado em listagens.

### `ProfilePage`
Pagina completa de perfil com todas as secoes.

### `ProfileForm`
Formulario de edicao de perfil, reutilizado no onboarding e na pagina de configuracoes.

### `InterestSelector`
Seletor de areas de interesse com chips/tags selecionaveis.

---

## Pagina de Perfil — Secoes Exibidas

1. **Header**: avatar, nome de exibicao, @username, bio
2. **Links**: icones clicaveis para GitHub, Twitter, LinkedIn, site
3. **Areas de interesse**: tags/chips
4. **Contadores**: seguidores, seguindo (apenas para membros autenticados)
5. **Projetos**: lista de projetos como owner e como contributor
6. **Posts recentes**: ultimos posts de BIP do usuario (apenas para membros autenticados)

---

## Decisoes Tomadas

### Obtencao do username do Discord

**Abordagem escolhida: Chamar a API do Discord com o `accessToken` durante o onboarding.**

A tabela `account` do Better-Auth ja armazena o `accessToken` do Discord. Durante o onboarding (que acontece logo apos o login), o token esta fresco. A server function `getDiscordUsername()` faz `GET https://discord.com/api/users/@me` com o token armazenado e retorna o campo `username`.

**Fallback**: se o token expirou (usuario voltou dias depois sem completar o onboarding), a funcao retorna `null` e o formulario exibe aviso para re-logar.

**Por que nao as outras opcoes:**
- `mapProfileToUser`: campos extras retornados por essa funcao nao sao persistidos na tabela `user` (que nao devemos modificar), e combinar com `databaseHooks` adiciona complexidade desnecessaria ao auth config
- Plugin `username` do Better-Auth: adiciona colunas a tabela `user` gerenciada pelo Better-Auth, conflitando com a regra de nao modificar `auth.schema.ts`

---

## Pontos em Aberto

- **Avatar custom**: nesta versao, o avatar e sempre o do Discord. Permitir upload de avatar customizado e uma melhoria futura.
