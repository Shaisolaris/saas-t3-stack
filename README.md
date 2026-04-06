# saas-t3-stack

![CI](https://github.com/Shaisolaris/saas-t3-stack/actions/workflows/ci.yml/badge.svg)

T3 Stack SaaS starter with tRPC for end-to-end type safety, Prisma for database access, NextAuth for authentication, and Zod for runtime validation. Features project and task management with CRUD operations, protected procedures, and type-safe API layer.

## Stack

- **Framework:** Next.js 14 App Router
- **API:** tRPC v10 with superjson transformer
- **Database:** Prisma (PostgreSQL)
- **Auth:** NextAuth.js
- **Validation:** Zod
- **Query:** TanStack React Query (via tRPC)

## tRPC API

### Project Router
| Procedure | Type | Input | Description |
|---|---|---|---|
| `project.getAll` | Query | — | List all projects |
| `project.getBySlug` | Query | `{ slug }` | Get project by slug |
| `project.create` | Mutation | `{ name, description? }` | Create project (auto-generates slug) |
| `project.delete` | Mutation | `{ id }` | Delete project |

### Task Router
| Procedure | Type | Input | Description |
|---|---|---|---|
| `task.getByProject` | Query | `{ projectId }` | List tasks in project |
| `task.create` | Mutation | `{ title, projectId, priority }` | Create task |
| `task.updateStatus` | Mutation | `{ id, status }` | Update task status (todo/in_progress/in_review/done) |
| `task.delete` | Mutation | `{ id }` | Delete task |

All procedures use `protectedProcedure` requiring authentication.

## Architecture

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing with feature cards
├── server/
│   ├── trpc.ts                       # tRPC init, context, public/protected procedures
│   └── api/
│       ├── root.ts                   # Root router combining project + task routers
│       └── routers/index.ts          # Project and task CRUD procedures
├── lib/                              # Prisma client, utilities
└── types/                            # Shared types

prisma/
└── schema.prisma                     # User, Account, Session, Project, Task models
```

## Database Schema

- **User** — name, email, role, projects, tasks
- **Account** — OAuth provider accounts (NextAuth adapter)
- **Session** — Auth sessions
- **Project** — name, description, slug (unique), owner relation, tasks
- **Task** — title, description, status (todo/in_progress/in_review/done), priority (low/medium/high), project, assignee, due date

## Setup

```bash
git clone https://github.com/Shaisolaris/saas-t3-stack.git
cd saas-t3-stack
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Key Design Decisions

**tRPC for type safety.** The entire API is defined as tRPC routers with Zod input schemas. TypeScript infers the full request/response types from router definitions. No codegen, no OpenAPI spec, no manual type maintenance. Change a Zod schema and the client gets compile errors immediately.

**Protected procedures via middleware.** `protectedProcedure` wraps tRPC's middleware to enforce authentication. The session is injected into context and narrowed to a non-null type, so handlers can safely access `ctx.session.user` without null checks.

**superjson transformer.** tRPC uses superjson to serialize Dates, Maps, Sets, and other JavaScript types that JSON.stringify drops. This means Date objects from Prisma come through as actual Date instances on the client.

**Zod for runtime + compile-time validation.** Every tRPC input uses Zod schemas that validate at runtime and infer TypeScript types at compile time. Invalid inputs are caught before the handler runs, with structured error messages via the custom error formatter.

## License

MIT
