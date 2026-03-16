# Eventos

## Visao Geral

O sistema de eventos e uma **vitrine** para divulgar eventos da comunidade Indie Hacking Brasil e de parceiros. Nesta versao inicial, **nao ha sistema de RSVP** — o objetivo e apenas informar sobre eventos e direcionar os interessados para a pagina oficial.

Qualquer membro autenticado com perfil completo pode **submeter eventos**, mas eles so aparecem publicamente apos **aprovacao de um moderator ou admin**. Moderators e admins podem aprovar, rejeitar, editar e excluir eventos.

## Comportamento por Estado de Autenticacao

### Visitante

Ve apenas eventos com `status = approved` na listagem e nas paginas individuais. Eventos pendentes ou rejeitados retornam 404 para visitantes.

### Membro autenticado (role = member)

Na listagem, ve apenas eventos `approved` (mesma experiencia do visitante) + botao "Criar evento" que submete o evento para aprovacao (status inicial `pending`).

Na pagina individual, se for o **autor** do evento, ve o evento em qualquer status com indicacao visual do status atual (pending, approved, rejected) e motivo da rejeicao se aplicavel.

### Moderador (role = moderator)

Tudo do membro + ve todos os eventos independente do status na listagem, com badge visual indicando o status. Fila de eventos pendentes em destaque no topo da listagem. Pode aprovar, rejeitar, editar e excluir eventos.

### Admin (role = admin)

Mesmas permissoes do moderador.

---

## Fluxo de Aprovacao

O fluxo de aprovacao garante qualidade nos eventos publicados, permitindo que qualquer membro contribua:

```
                    ┌─────────────┐
                    │   Membro    │
                    │ cria evento │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
              ┌─────│   pending   │─────┐
              │     └─────────────┘     │
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │  approved   │          │  rejected   │
       └─────────────┘          └──────┬──────┘
              │                        │
              │                        │ Membro corrige
              ▼                        │ e resubmete
        Visivel para                   │
        todos os                       ▼
        usuarios              ┌─────────────┐
                              │   pending   │
                              │ (novamente) │
                              └─────────────┘
```

### Transicoes de Status

| De | Para | Quem | Acao |
|----|------|------|------|
| — | `pending` | Membro (qualquer) | Cria evento via `/events/novo` |
| `pending` | `approved` | Moderator/Admin | Aprova na pagina de revisao |
| `pending` | `rejected` | Moderator/Admin | Rejeita com motivo opcional |
| `rejected` | `pending` | Autor do evento | Corrige e resubmete |

**Regras:**
- Apenas eventos com `status = approved` aparecem na listagem publica
- O autor pode editar e resubmeter um evento `rejected`, voltando para `pending`
- Eventos `approved` nao voltam para `pending` (apenas moderator/admin pode editar diretamente)
- A rejeicao inclui um campo `rejectionReason` opcional para orientar o autor sobre o que corrigir

---

## Schema: `events.schema.ts`

Este arquivo contem duas tabelas: `events` e `event_members`.

Ver definicao completa em [`schema-banco-de-dados.md`](../schema-banco-de-dados.md#events-em-eventsschemats).

### Tabela `events`

```
events
├── id (PK)
├── name (NOT NULL)
├── description
├── date (NOT NULL — data e horario)
├── format (NOT NULL)
│   valores: presencial | digital
├── address (condicional — obrigatorio se presencial)
├── accessLink (condicional — obrigatorio se digital)
├── eventLink (NOT NULL — link para pagina oficial)
├── bannerUrl
├── organizerName (NOT NULL)
├── isPartner (boolean, default false)
├── status (NOT NULL, default "pending")
│   valores: pending | approved | rejected
├── rejectionReason (motivo da rejeicao, preenchido por moderator/admin)
├── submittedBy (FK → user.id — membro que submeteu o evento)
├── reviewedBy (FK → user.id — moderator/admin que revisou)
├── reviewedAt (data da revisao)
├── createdAt
└── updatedAt
```

### Tabela `event_members` (reservada para uso futuro)

```
event_members
├── id (PK)
├── eventId (FK → events.id)
├── userId (FK → user.id)
├── status (default "interessado")
│   valores: interessado | nao_vou | confirmado
└── createdAt
```

**Importante**: a tabela `event_members` e criada agora para evitar migrations complexas no futuro, mas **nenhuma funcionalidade de RSVP e exposta na interface**. Nao criar rotas, server functions ou componentes para RSVP nesta fase.

---

## Formatos de Evento

| Valor | Descricao | Campos condicionais |
|-------|-----------|-------------------|
| `presencial` | Evento fisico | `address` obrigatorio |
| `digital` | Evento online (Discord Stage, YouTube, Zoom, etc.) | `accessLink` obrigatorio |

---

## Organizador

O campo `organizerName` identifica quem organiza o evento. O campo `isPartner` diferencia:

| `isPartner` | Significado |
|------------|------------|
| `false` | Organizado pela propria comunidade Indie Hacking Brasil |
| `true` | Organizado por um parceiro externo |

Isso permite diferenciar visualmente eventos da comunidade de eventos de parceiros na listagem.

---

## Rotas

### `/events` — `src/routes/events/page.tsx`

Listagem de eventos.

**Visitantes e membros (role = member):**
Dividida em duas secoes, exibindo apenas eventos com `status = approved`:

1. **Proximos eventos**: eventos com `date` no futuro, ordenados por data (mais proximo primeiro)
2. **Eventos passados**: eventos com `date` no passado, ordenados por data (mais recente primeiro)

- Membros veem botao "Criar evento" no topo
- Nao ha paginacao nesta versao (volume baixo esperado)

**Moderators e admins:**
Mesma estrutura + secao adicional no topo:

3. **Fila de aprovacao**: eventos com `status = pending`, ordenados por data de submissao (mais antigo primeiro)

Todos os eventos exibem badge visual indicando o status: `pending` (amarelo), `approved` (verde), `rejected` (vermelho).

### `/events/:id` — `src/routes/events/$id/page.tsx`

Pagina individual do evento.

**Secoes:**
1. **Banner** (se houver imagem)
2. **Status badge** (visivel para o autor e moderators/admins se `status != approved`)
3. **Header**: nome do evento, data formatada, formato badge
4. **Detalhes**: descricao, local ou link de acesso conforme formato
5. **Organizador**: nome, badge de comunidade ou parceiro
6. **CTA**: botao "Ver pagina oficial" linkando para `eventLink`
7. **Motivo da rejeicao** (visivel apenas se `status = rejected`, para o autor e moderators/admins)
8. **Acoes de moderacao**: botoes editar/excluir (visivel para moderators e admins)

**Regras de acesso:**
- `status = approved`: publico para todos
- `status = pending` ou `rejected`: acessivel apenas pelo autor (campo `submittedBy`) e por moderators/admins. Para outros usuarios, retorna 404

### `/events/novo` — `src/routes/events/novo/page.tsx`

Formulario de criacao de evento. Acessivel para qualquer membro autenticado com perfil completo.

O evento criado inicia com `status = pending` e fica aguardando aprovacao.

### `/events/:id/editar` — `src/routes/events/$id/editar/page.tsx`

Formulario de edicao. Acessivel para:
- O autor do evento (se `status = rejected`, permitindo correcao e resubmissao)
- Moderators e admins (podem editar qualquer evento em qualquer status)

### `/events/:id/revisao` — `src/routes/events/$id/revisao/page.tsx`

Pagina de revisao de evento. Visivel apenas para moderators e admins.

**Secoes:**
1. Detalhes completos do evento (preview de como ficara publicado)
2. Informacoes do autor (nome, username, link para perfil)
3. Botao "Aprovar" — muda status para `approved`
4. Botao "Rejeitar" — abre campo para motivo opcional, muda status para `rejected`

---

## Server Functions

### `createEvent(userId: string, data: CreateEventInput)`
Cria evento com `status = "pending"` e `submittedBy = userId`. Qualquer membro com perfil completo pode chamar.

### `updateEvent(eventId: string, userId: string, data: UpdateEventInput)`
Atualiza evento. Permite se o usuario e moderator, admin, ou o autor (se `status = rejected`).

### `deleteEvent(eventId: string, userId: string)`
Exclui evento. Permite se o usuario e moderator ou admin.

### `approveEvent(eventId: string, reviewerId: string)`
Muda status para `approved`. Registra `reviewedBy` e `reviewedAt`. Apenas moderator ou admin.

### `rejectEvent(eventId: string, reviewerId: string, reason?: string)`
Muda status para `rejected`. Registra `rejectionReason`, `reviewedBy` e `reviewedAt`. Apenas moderator ou admin.

### `resubmitEvent(eventId: string, userId: string)`
Volta status para `pending`. Limpa `rejectionReason`, `reviewedBy` e `reviewedAt`. Apenas o autor do evento pode chamar, e somente se `status = rejected`.

### `getEventById(eventId: string, requesterId?: string)`
Busca evento por ID. Se o evento nao e `approved`, retorna apenas se `requesterId` e o autor ou um moderator/admin.

### `listEvents(requesterId?: string, requesterRole?: string)`
Lista eventos. Visitantes e membros recebem apenas `approved`. Moderators e admins recebem todos os status. Separados em proximos e passados (e pendentes, para moderators/admins).

---

## Validacao (Zod)

```
CreateEventInput:
  name: string — min 2, max 200
  description: string | null — max 1000
  date: Date — deve ser no futuro (para criacao)
  format: enum — presencial | digital
  address: string | null — obrigatorio se format = presencial
  accessLink: string | null — URL valida, obrigatorio se format = digital
  eventLink: string — URL valida, obrigatorio
  bannerUrl: string | null — URL valida
  organizerName: string — min 2, max 100
  isPartner: boolean — default false
```

Validacao condicional: `address` e obrigatorio quando `format = "presencial"`, `accessLink` e obrigatorio quando `format = "digital"`.

---

## Componentes

### `EventCard`
Card de evento para listagem. Exibe: nome, data formatada, formato badge, organizador, badge de comunidade/parceiro. Para moderators/admins, inclui badge de status (`pending`/`approved`/`rejected`).

### `EventForm`
Formulario de criacao/edicao. Campos condicionais baseados no formato selecionado (presencial mostra campo de endereco, digital mostra campo de link de acesso).

### `EventFormatBadge`
Badge visual indicando se o evento e presencial ou digital.

### `EventPartnerBadge`
Badge indicando se e evento da comunidade ou de parceiro.

### `EventStatusBadge`
Badge indicando o status de aprovacao do evento: `pending` (amarelo), `approved` (verde), `rejected` (vermelho).

### `EventReviewPanel`
Painel de revisao com botoes de aprovar e rejeitar + campo de motivo para rejeicao. Usado na pagina `/events/:id/revisao`.

### `EventRejectionNotice`
Alerta exibido ao autor quando o evento foi rejeitado, mostrando o motivo da rejeicao e botao para editar e resubmeter.

---

## Formatacao de Data

Datas devem ser exibidas em formato brasileiro:
- Listagem: "15 de mar. de 2026, 19:00"
- Pagina do evento: "Sabado, 15 de marco de 2026 as 19:00"

Usar `Intl.DateTimeFormat("pt-BR", ...)` para formatacao consistente.

---

## Pontos em Aberto

- **Upload de banner**: mesma decisao de storage do upload de logo de projetos
- **Eventos recorrentes**: nao suportado nesta versao. Se necessario, cada ocorrencia seria um evento separado
- **Notificacao ao autor**: quando o evento e aprovado ou rejeitado, idealmente o autor recebe notificacao. Depende do sistema de notificacoes (funcionalidade futura)
