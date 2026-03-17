# Indie Hacking Brasil

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Plataforma web da comunidade **Indie Hacking Brasil** — complemento ao Discord com perfis públicos, vitrine de projetos, eventos e feed de Build In Public.

## Sobre

O [Indie Hacking Brasil](https://discord.gg/indiehackersbrasil) é uma comunidade brasileira com mais de 12 mil membros no Discord, reunindo pessoas que estão construindo seus próprios produtos digitais — Apps, SaaS, Micro-SaaS e Startups.

Esta plataforma serve como **complemento ao Discord**, oferecendo:

- **Perfis públicos** permanentes e indexáveis
- **Vitrine de projetos** com sistema de membros (owner/contributor)
- **Eventos** da comunidade com fluxo de aprovação
- **Feed de Build In Public** com atualizações cronológicas dos projetos
- **Funcionalidades sociais** (seguir, recomendar, comentar) — em breve

## Stack Técnica

| Tecnologia | Uso |
|---|---|
| [TanStack Start](https://tanstack.com/start) | Framework full-stack (React 19 + Vite 7) |
| [Cloudflare Workers](https://workers.cloudflare.com/) | Runtime edge (deploy + hosting) |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | Banco de dados SQLite no edge |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | Storage de arquivos (uploads) |
| [Drizzle ORM](https://orm.drizzle.team/) | ORM para SQLite/D1 |
| [Better-Auth](https://better-auth.com/) | Autenticação (Discord OAuth) |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilização |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes de UI (30+) |
| [Biome](https://biomejs.dev/) | Linting e formatação |
| [Vitest](https://vitest.dev/) | Testes |
| [Bun](https://bun.sh/) | Package manager e runtime |

## Como Rodar Localmente

### Pré-requisitos

- [Bun](https://bun.sh/) instalado
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`bun install -g wrangler`)
- Uma [aplicação Discord](https://discord.com/developers/applications) configurada com OAuth2

### Setup

1. **Clone o repositório**

```bash
git clone https://github.com/Indie-Hackers-Brasil/website.git
cd website
```

2. **Instale as dependências**

```bash
bun install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Preencha o `.env` com suas credenciais:

- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN` — para migrations remotas (opcional para dev local)
- `BETTER_AUTH_SECRET` — string aleatória com 32+ caracteres
- `BETTER_AUTH_URL` — `http://localhost:3000`
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` — da sua aplicação Discord

4. **Configure o banco de dados local**

```bash
bun run db:local
```

5. **Rode o servidor de desenvolvimento**

```bash
bun run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

| Script | Descrição |
|---|---|
| `bun run dev` | Servidor de desenvolvimento (porta 3000) |
| `bun run build` | Build para produção |
| `bun run preview` | Preview do build de produção |
| `bun run deploy` | Build + deploy para Cloudflare Workers |
| `bun run test` | Rodar testes com Vitest |
| `bun run lint` | Verificar código com Biome |
| `bun run format` | Formatar código com Biome |
| `bun run check` | Lint + format com Biome |
| `bun run db:generate` | Gerar migrations do Drizzle |
| `bun run db:migrate` | Aplicar migrations (remoto) |
| `bun run db:studio` | Abrir Drizzle Studio (UI do banco) |
| `bun run db:local` | Aplicar migrations no D1 local |

## Estrutura do Projeto

```
src/
├── components/        # Componentes React (UI + custom)
│   └── ui/            # Componentes shadcn/ui
├── data/
│   ├── constants/     # Variáveis de ambiente, config do site, tags
│   └── services/      # Lógica de negócio (server functions)
├── docs/              # Documentação interna do projeto
│   └── funcionalidades/  # Specs detalhadas por feature
├── lib/
│   ├── auth/          # Configuração do Better-Auth
│   ├── db/            # Drizzle ORM (schemas + migrations)
│   └── validations/   # Schemas Zod para validação
├── routes/            # Rotas (file-based routing do TanStack)
├── router.tsx         # Configuração do router
└── styles.css         # Estilos globais + variáveis CSS
```

## Documentação

Para entender a arquitetura, decisões de produto e especificações detalhadas, consulte a documentação em [`src/docs/`](./src/docs/):

| Documento | Descrição |
|---|---|
| [Visão Geral](./src/docs/visao-geral.md) | Propósito, público-alvo e princípios da plataforma |
| [Stack Técnica](./src/docs/stack-tecnica.md) | Detalhes da stack, convenções e padrões de código |
| [Schema do Banco](./src/docs/schema-banco-de-dados.md) | Estrutura completa do banco de dados |
| [Conteúdo Condicional](./src/docs/conteudo-condicional.md) | Lógica de exibição por estado de autenticação |
| [Roadmap](./src/docs/roadmap.md) | Fases de desenvolvimento e progresso atual |
| [Funcionalidades](./src/docs/funcionalidades/) | Especificações detalhadas de cada feature |

## Como Contribuir

Contribuições são muito bem-vindas! Leia o [guia de contribuição](./CONTRIBUTING.md) para saber como participar.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## Comunidade

- [Discord](https://discord.gg/indiehackersbrasil) — Junte-se a mais de 12 mil indie hackers brasileiros
