# Backend

Express + TypeScript backend with PostgreSQL and Swagger.

## Environment

Set `DATABASE_URL` when you want the duties endpoints to use PostgreSQL.

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexplore
export PORT=3000
```

## Daily development

During normal development, only run PostgreSQL in Docker. Keep the backend and frontend local for fast reloads.

From the repository root:

```bash
pnpm db:start
pnpm db:migrate
pnpm dev:backend
pnpm dev:react
```

Stop or inspect only PostgreSQL with:

```bash
pnpm db:stop
pnpm db:logs
```

## Migrations

SQL migrations live in `src/db/migrations`.

Apply pending migrations with:

```bash
pnpm db:migrate
```

Applied files are tracked in the `schema_migrations` table.

## API docs

Swagger UI: `http://localhost:3000/docs`

OpenAPI JSON: `http://localhost:3000/docs.json`
