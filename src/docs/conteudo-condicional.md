# Conteudo Condicional por Estado de Autenticacao

## Visao Geral

A plataforma exibe conteudo diferente dependendo do estado de autenticacao do usuario. Esse padrao e consistente em todas as rotas.

### Estados Possiveis

| Estado | Descricao | Como identificar |
|--------|-----------|-----------------|
| **Visitante** | Nao logado | `getSession()` retorna `null` |
| **Autenticado sem perfil** | Logou via Discord mas nao completou onboarding | Sessao existe, mas `profile` nao existe ou `isOnboardingComplete = false` |
| **Membro** | Logou e completou onboarding | Sessao existe e `profile.isOnboardingComplete = true` |
| **Owner/Admin** | Membro com permissoes especiais no contexto | Membro + dono do recurso ou admin da plataforma |

## Implementacao Tecnica

### Server-side (beforeLoad)

```typescript
// Rota protegida — redireciona visitantes para a home
export const Route = createFileRoute("/feed")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/" });
    }
    return { session };
  },
  component: FeedPage,
});
```

### Client-side (useSession)

```typescript
const { data: session, isPending } = authClient.useSession();

if (isPending) return <Skeleton />;
if (!session) return <LandingContent />;
return <AuthenticatedContent />;
```

### Guard de Onboarding

Apos verificar que o usuario esta autenticado, verificar se completou o onboarding. Se nao completou, redirecionar para `/onboarding`:

```typescript
// No beforeLoad de rotas que exigem perfil completo
const session = await getSession();
if (!session) throw redirect({ to: "/" });

const profile = await getProfileByUserId(session.user.id);
if (!profile || !profile.isOnboardingComplete) {
  throw redirect({ to: "/onboarding" });
}
```

---

## Comportamento por Rota

### `/` — Home

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Landing Page: apresentacao da comunidade, banner de chamada para o Discord, projetos em destaque, proximos eventos, numeros da comunidade |
| **Autenticado sem perfil** | Redireciona para `/onboarding` |
| **Membro** | Feed de atualizacoes (substitui a Landing Page completamente) |

**Decisao tecnica**: a rota `/` usa renderizacao condicional no client (`useSession`) para alternar entre Landing Page e Feed, sem redirecionamento. Isso preserva a URL `/` para ambos os estados e melhora a experiencia de transicao.

---

### `/u/:username` — Perfil do Usuario

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Versao resumida e publica: nome, bio, avatar, lista de projetos. Botao "Entrar na comunidade" no lugar das interacoes sociais |
| **Membro (vendo outro perfil)** | Perfil completo: bio, links, projetos, posts recentes, contadores (seguidores, seguindo). Botao "Seguir" |
| **Membro (proprio perfil)** | Mesmo que acima + botao "Editar perfil" e acesso as configuracoes |

**Nota**: se o `:username` nao existir, exibir pagina 404.

---

### `/projects` — Listagem de Projetos

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Lista de projetos com informacoes basicas (nome, descricao, categoria, status). Sem interacao (sem botoes de seguir/recomendar). Banner convidando a se cadastrar para interagir |
| **Membro** | Lista completa com filtros por categoria e status. Botao "Criar projeto" no topo. Botoes de interacao (seguir, recomendar) em cada card |

---

### `/projects/:slug` — Pagina de Projeto

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Descricao, equipe (membros), recomendacoes (lista). Sem poder recomendar, comentar ou seguir. Banner de cadastro |
| **Membro** | Tudo do visitante + botoes de recomendar, comentar, avaliar e seguir |
| **Owner do projeto** | Tudo do membro + botao "Editar projeto", "Gerenciar colaboradores", "Excluir projeto" |

---

### `/events` — Listagem de Eventos

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Lista de proximos eventos em destaque e eventos passados. Acesso total — eventos sao conteudo publico |
| **Membro** | Mesma experiencia do visitante (RSVP e funcionalidade futura) |
| **Admin** | Mesma experiencia + botao "Criar evento" |

**Nota**: eventos sao 100% publicos nesta versao. Nao ha diferenca de conteudo entre visitante e membro autenticado.

---

### `/events/:id` — Pagina de Evento

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Detalhes completos do evento: nome, data, formato, local/link, organizador, banner |
| **Membro** | Mesma experiencia do visitante |
| **Admin** | Mesma experiencia + botoes "Editar evento" e "Excluir evento" |

---

### `/feed` — Feed (URL propria)

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Redireciona para `/` (a Landing Page) |
| **Autenticado sem perfil** | Redireciona para `/onboarding` |
| **Membro** | Feed cronologico com posts BIP e comunicados. Filtro por tipo. Formulario de novo post |

**Nota**: o Feed tambem aparece na Home (`/`) para membros autenticados. A rota `/feed` e um atalho direto, util para compartilhar ou bookmarkar.

---

### `/onboarding` — Fluxo de Criacao de Perfil

| Estado | Comportamento |
|--------|--------------|
| **Visitante** | Redireciona para `/` (precisa logar primeiro) |
| **Autenticado sem perfil** | Formulario multi-step de criacao de perfil |
| **Membro (perfil completo)** | Redireciona para `/` (onboarding ja foi concluido) |

---

## Resumo de Redirecionamentos

| Situacao | De | Para |
|----------|-----|------|
| Visitante tenta acessar rota protegida | `/feed`, `/onboarding` | `/` |
| Autenticado sem perfil tenta acessar conteudo | `/`, `/feed`, qualquer rota que exige perfil | `/onboarding` |
| Membro tenta acessar onboarding | `/onboarding` | `/` |

## Componentes Reutilizaveis Sugeridos

- **`AuthGuard`**: wrapper que verifica sessao e redireciona visitantes
- **`OnboardingGuard`**: wrapper que verifica se perfil esta completo
- **`ConditionalContent`**: componente que renderiza conteudo A ou B baseado no estado de auth
- **`LoginCTA`**: call-to-action padrao para visitantes, com botao de login via Discord

## Pontos em Aberto

- **Sistema de admin**: como definir quem e admin? Opcoes: campo `isAdmin` na tabela `profile`, tabela separada de roles, ou lista de IDs no `.env`. Decisao a ser tomada antes de implementar Eventos e Feed (que tem funcionalidades restritas a admins).
