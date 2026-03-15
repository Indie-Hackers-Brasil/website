# Eventos

## Visao Geral

O sistema de eventos e uma **vitrine simples** para divulgar eventos da comunidade Indie Hacking Brasil e de parceiros. Nesta versao inicial, **nao ha sistema de RSVP** — o objetivo e apenas informar sobre eventos e direcionar os interessados para a pagina oficial.

A criacao e edicao de eventos e **restrita a admins**.

## Comportamento por Estado de Autenticacao

### Visitante

Ve a listagem e as paginas de eventos normalmente. Eventos sao **conteudo 100% publico** — nao ha diferenca de conteudo entre visitante e membro autenticado nesta versao.

### Membro autenticado

Mesma experiencia do visitante. O RSVP e funcionalidade futura.

### Admin

Mesma experiencia + botoes "Criar evento", "Editar evento" e "Excluir evento".

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
├── createdBy (FK → user.id — admin que cadastrou)
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

Listagem de eventos, dividida em duas secoes:

1. **Proximos eventos**: eventos com `date` no futuro, ordenados por data (mais proximo primeiro)
2. **Eventos passados**: eventos com `date` no passado, ordenados por data (mais recente primeiro)

- Admins veem botao "Criar evento" no topo
- Nao ha paginacao nesta versao (volume baixo esperado)

### `/events/:id` — `src/routes/events/$id/page.tsx`

Pagina individual do evento.

**Secoes:**
1. **Banner** (se houver imagem)
2. **Header**: nome do evento, data formatada, formato badge
3. **Detalhes**: descricao, local ou link de acesso conforme formato
4. **Organizador**: nome, badge de comunidade ou parceiro
5. **CTA**: botao "Ver pagina oficial" linkando para `eventLink`
6. **Acoes de admin**: botoes editar/excluir (visivel apenas para admins)

### `/events/novo` — `src/routes/events/novo/page.tsx`

Formulario de criacao. Restrito a admins.

### `/events/:id/editar` — `src/routes/events/$id/editar/page.tsx`

Formulario de edicao. Restrito a admins.

---

## Server Functions

### `createEvent(adminUserId: string, data: CreateEventInput)`
Cria evento. Verifica se o usuario e admin.

### `updateEvent(eventId: string, adminUserId: string, data: UpdateEventInput)`
Atualiza evento. Verifica se o usuario e admin.

### `deleteEvent(eventId: string, adminUserId: string)`
Exclui evento. Verifica se o usuario e admin.

### `getEventById(eventId: string)`
Busca evento por ID com todos os detalhes.

### `listEvents()`
Lista todos os eventos, separados em proximos e passados.

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
Card de evento para listagem. Exibe: nome, data formatada, formato badge, organizador, badge de comunidade/parceiro.

### `EventForm`
Formulario de criacao/edicao. Campos condicionais baseados no formato selecionado (presencial mostra campo de endereco, digital mostra campo de link de acesso).

### `EventFormatBadge`
Badge visual indicando se o evento e presencial ou digital.

### `EventPartnerBadge`
Badge indicando se e evento da comunidade ou de parceiro.

---

## Formatacao de Data

Datas devem ser exibidas em formato brasileiro:
- Listagem: "15 de mar. de 2026, 19:00"
- Pagina do evento: "Sabado, 15 de marco de 2026 as 19:00"

Usar `Intl.DateTimeFormat("pt-BR", ...)` para formatacao consistente.

---

## Pontos em Aberto

- **Sistema de admin**: definicao de como verificar se um usuario e admin (mesmo ponto em aberto do [`conteudo-condicional.md`](../conteudo-condicional.md#pontos-em-aberto))
- **Upload de banner**: mesma decisao de storage do upload de logo de projetos
- **Eventos recorrentes**: nao suportado nesta versao. Se necessario, cada ocorrencia seria um evento separado
