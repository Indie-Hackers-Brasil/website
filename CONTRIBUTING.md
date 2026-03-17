# Contribuindo com o Indie Hacking Brasil

Obrigado pelo interesse em contribuir! Este projeto é open source e construído pela comunidade. Toda ajuda é bem-vinda, seja corrigindo um bug, melhorando a documentação ou implementando uma nova feature.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Bun](https://bun.sh/) (package manager e runtime)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`bun install -g wrangler`)
- [Git](https://git-scm.com/)
- Uma [aplicação Discord](https://discord.com/developers/applications) configurada com OAuth2 (para testar autenticação)

## Setup do Ambiente

1. **Faça um fork** do repositório no GitHub

2. **Clone o seu fork**

```bash
git clone https://github.com/SEU_USUARIO/website.git
cd website
```

3. **Instale as dependências**

```bash
bun install
```

4. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Preencha o `.env` com suas credenciais. As variáveis do Cloudflare (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN`) são opcionais para desenvolvimento local — só são necessárias para migrations remotas.

5. **Configure o banco de dados local**

```bash
bun run db:local
```

6. **Rode o servidor**

```bash
bun run dev
```

Acesse `http://localhost:3000`.

## Fluxo de Trabalho

1. **Crie uma branch** a partir da `main`:

```bash
git checkout -b feat/nome-da-feature
```

Use os prefixos:
- `feat/` — nova funcionalidade
- `fix/` — correção de bug
- `docs/` — alteração em documentação
- `refactor/` — refatoração de código
- `chore/` — tarefas de manutenção

2. **Faça suas alterações** seguindo os padrões do projeto (veja abaixo)

3. **Rode o linter e formatador** antes de commitar:

```bash
bun run check
```

4. **Faça commit** das suas alterações com uma mensagem clara:

```bash
git commit -m "feat: adiciona filtro por categoria na listagem de projetos"
```

5. **Envie para o seu fork**:

```bash
git push origin feat/nome-da-feature
```

6. **Abra um Pull Request** para a branch `main` do repositório original

## Padrões do Projeto

### Código

- **Linting/Formatação**: Biome (tabs para indentação, aspas duplas)
- **Linguagem do código**: Nomes de variáveis e funções em inglês
- **Interface e documentação**: Português do Brasil
- **Validação**: Schemas Zod para inputs de formulários e server functions
- **Server functions**: Usar `createServerFn` do TanStack Start

### Arquivos e Rotas

- Nomes de arquivos em **kebab-case** (`profile-form.tsx`, `event-card.tsx`)
- Rotas usam tokens do TanStack Router: `page.tsx` (rota), `layout.tsx` (layout)
- Parâmetros dinâmicos com `$`: `$username/page.tsx`, `$slug/page.tsx`

### Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo: descrição curta em português

Exemplos:
feat: adiciona componente de upload de imagem
fix: corrige redirecionamento após login
docs: atualiza documentação do schema de eventos
refactor: simplifica lógica de paginação do feed
```

## Entendendo o Projeto

A documentação interna em [`src/docs/`](./src/docs/) é o melhor ponto de partida para entender a arquitetura e as decisões do projeto:

- **[Visão Geral](./src/docs/visao-geral.md)** — O que é o projeto e seus princípios
- **[Stack Técnica](./src/docs/stack-tecnica.md)** — Tecnologias, convenções e padrões
- **[Schema do Banco](./src/docs/schema-banco-de-dados.md)** — Estrutura do banco de dados
- **[Roadmap](./src/docs/roadmap.md)** — Fases de desenvolvimento e o que está sendo feito
- **[Funcionalidades](./src/docs/funcionalidades/)** — Especificações detalhadas de cada feature

## Reportando Bugs

Abra uma [issue no GitHub](https://github.com/Indie-Hackers-Brasil/website/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. observado
- Capturas de tela (se aplicável)

## Sugerindo Features

Também via [issues no GitHub](https://github.com/Indie-Hackers-Brasil/website/issues). Descreva:

- O problema que a feature resolve
- Como você imagina que funcionaria
- Se possível, referências visuais ou de outros produtos

## Dúvidas?

Entre no nosso [Discord](https://discord.gg/indiehackersbrasil) e converse com a comunidade!
