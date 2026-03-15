# Visao Geral da Plataforma

## O que e o Indie Hacking Brasil

O **Indie Hacking Brasil** e uma comunidade brasileira com mais de 12 mil membros no Discord, reunindo pessoas que estao construindo seus proprios produtos digitais — Apps, SaaS, Micro-SaaS e Startups — com foco em networking, troca de conhecimento e cultura de Build In Public.

Esta plataforma web serve como **complemento ao Discord**, oferecendo funcionalidades que o Discord nao suporta bem: perfis publicos permanentes, vitrine de projetos, historico de atualizacoes e visibilidade para quem esta fora do servidor.

## Proposito e Objetivos

A plataforma existe para:

1. **Dar visibilidade aos membros e seus projetos** — perfis publicos e paginas de projeto indexaveis, compartilhaveis e com URL permanente.
2. **Registrar a jornada de Build In Public** — um feed cronologico onde membros compartilham atualizacoes dos seus projetos, criando um historico que nao se perde no fluxo do Discord.
3. **Divulgar eventos da comunidade** — uma vitrine centralizada de meetups, lives, workshops e hackathons.
4. **Facilitar conexoes** — funcionalidades sociais como seguir usuarios, recomendar projetos e comentar em projetos de outros membros.
5. **Servir como porta de entrada** — visitantes podem conhecer a comunidade, ver projetos e perfis, e ser incentivados a entrar no Discord.

## Publico-alvo

- **Solo founders** e **indie hackers** brasileiros construindo produtos digitais
- **Desenvolvedores** que querem compartilhar seus side projects e receber feedback
- **Empreendedores** em estagio inicial buscando networking e validacao
- **Curiosos e aspirantes** que querem conhecer a comunidade antes de entrar no Discord

## Relacao com a Comunidade no Discord

O Discord continua sendo o **centro de comunicacao em tempo real** da comunidade. A plataforma web nao substitui o Discord — ela o complementa:

| Discord | Plataforma Web |
|---------|---------------|
| Conversas em tempo real | Conteudo permanente e indexavel |
| Canais tematicos | Perfis publicos e paginas de projeto |
| Efemero por natureza | Historico persistente de BIP |
| Fechado (precisa entrar no servidor) | Aberto (visitantes veem conteudo publico) |
| Autenticacao propria | Login via Discord OAuth |

O **login na plataforma e feito exclusivamente via Discord**, reforçando o vinculo entre os dois ambientes. O username do Discord e herdado automaticamente como identificador do usuario na plataforma.

## Principios e Valores

### Edge-first
A plataforma roda em Cloudflare Workers com banco de dados D1 (SQLite), garantindo latencia minima para usuarios no Brasil e no mundo. Toda a arquitetura e pensada para o edge.

### Simplicidade
Sem algoritmos, sem gamificacao excessiva, sem metricas de vaidade. O feed e cronologico. As funcionalidades sao diretas. A interface e limpa.

### Portugues-primeiro
Toda a interface, documentacao e conteudo padrao sao em Portugues do Brasil. A comunidade e brasileira e a plataforma reflete isso.

### Comunidade como base
Decisoes de produto priorizam o coletivo. A plataforma existe para servir a comunidade, nao para monetizar em cima dela.

### Transparencia
Build In Public nao e so para os membros — a propria plataforma e construida com transparencia, com codigo aberto e decisoes documentadas.

## Conteudo Condicional por Estado de Autenticacao

A plataforma adota um padrao consistente em todas as paginas: **o conteudo exibido varia de acordo com o estado de autenticacao do usuario**.

### Filosofia

- **Visitante (nao logado)**: ve Landing Pages com apresentacao da comunidade, banners de chamada para o Discord, projetos em destaque e informacoes publicas. O objetivo e apresentar o Indie Hacking Brasil e incentivar o cadastro.
- **Usuario autenticado**: ve o conteudo real da plataforma — Feed, perfis completos, projetos interativos, etc. — no lugar das Landing Pages.

Esse padrao se aplica a Home, paginas de Perfil, Projetos, Eventos e Feed. O documento dedicado [`conteudo-condicional.md`](./conteudo-condicional.md) detalha o comportamento especifico de cada rota.

### Motivacao

Esse modelo permite que a plataforma funcione simultaneamente como:
- **Site institucional** para visitantes (SEO, apresentacao, conversao)
- **Ferramenta de comunidade** para membros autenticados (interacao, conteudo, networking)

## Funcionalidades Principais

A plataforma sera construida em fases incrementais:

1. **[Onboarding e Perfil](./funcionalidades/01-onboarding-perfil.md)** — Perfis publicos com informacoes pessoais, links e areas de interesse.
2. **[Projetos](./funcionalidades/02-projetos.md)** — Vitrine de projetos com sistema de roles (owner/contributor).
3. **[Eventos](./funcionalidades/03-eventos.md)** — Divulgacao de eventos da comunidade e parceiros.
4. **[Feed / Build In Public](./funcionalidades/04-feed.md)** — Feed cronologico com atualizacoes de projeto e comunicados.
5. **[Funcionalidades Sociais](./funcionalidades/05-social.md)** — Seguir usuarios/projetos, recomendar projetos, comentar e avaliar.

Consulte o [`roadmap.md`](./roadmap.md) para a ordem de desenvolvimento e dependencias entre fases.

## Estado Atual

A infraestrutura base esta pronta:

- TanStack Start (React 19 + Vite) configurado e rodando
- Deploy em Cloudflare Workers funcional
- Autenticacao com Discord via Better-Auth operacional
- Banco de dados D1 com tabelas de auth (user, session, account, verification)
- 30+ componentes shadcn/ui instalados
- Tema claro/escuro configurado
- Biome para linting/formatacao

O que falta: todas as funcionalidades de produto listadas acima. Esta documentacao e o primeiro passo antes da implementacao.
