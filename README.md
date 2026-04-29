# Nexplore Test

## Summary

The application uses pnpm to create `monorepo` with frontend, backend, and shared packages.
The backend provides RESTful API endpoints for managing duties, with Swagger documentation and a health check endpoint.
- `migration` has script provided and included in package.json. also it is done in Docker mode and will be automatically applied.
- `swagger` documentation is available with openAPI format. 
The frontend has arquitecture of context + data layer + hooks + component + page architecture, it follows SOLID principles.
- component is pure function with props as input and returns UI as output.
- page only connect hooks with components.
- hooks is the place to manage state and side effects.
- data layer is responsible for API calls and data transformations.
- context is responsible for global state management, in this case it is to manage Jest provide and Query.


It includes:

- A React frontend written in TypeScript
- A Node.js backend written in TypeScript with Express
- PostgreSQL persistence using plain SQL queries
- Docker Compose support for a one-command local startup
- Jest tests for both frontend and backend

## steps for running the project in ANY environment with Docker

Please intall `git` and `docker` before running the project.
```bash
git clone git@github.com:jimmydemx/nexplore-test.git
cd nexplore-test
docker compose up --build -d
```


## steps for running the project locally OUTSIDE Docker

To run the project locally OUTSIDE Docker, install:

- Node.js 20+
- pnpm 10+
- Docker and Docker Compose


For day-to-day development, only PostgreSQL needs to run in Docker. The frontend and backend can run locally for faster feedback.

Create a `.env` file in the repository root using the values from `.env.example`, then run:

```bash
pnpm db:start
pnpm db:migrate
pnpm dev:backend
pnpm dev:react
```

Useful database commands:

```bash
pnpm db:logs
pnpm db:stop
```

Local URLs:

```text
Frontend (Vite): http://localhost:5173
Backend: http://localhost:3000
Swagger: http://localhost:3000/docs
```


## Architecture

The repository is organized as a small monorepo:

- `apps/frontend`: React + TypeScript frontend
- `apps/backend`: Express + TypeScript backend
- `packages/shared-types`: shared domain types and API-facing types
- `packages/shared-utils`: shared pure utilities
- `docker`: Dockerfiles and Nginx configuration

The design keeps frontend and backend independent while still allowing shared types where that improves consistency.

## Error handling and edge cases

The implementation explicitly handles common edge cases:

- Empty duty names are rejected on both frontend and backend
- Missing records return `404`
- Invalid request payloads return `400`
- Database connectivity problems are surfaced with clear error messages
- The frontend shows request failures in the UI instead of failing silently

## Observability

Production-readiness in this repository is addressed with simple but concrete mechanisms:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`
- Health endpoint: `http://localhost:3000/health`
- Docker logs via `docker compose logs`
- Migration output logged during startup in container mode



In Docker mode:

- PostgreSQL starts in its own container
- The backend waits for PostgreSQL to become healthy
- Pending SQL migrations run automatically before the backend starts
- The frontend is served by Nginx
- `/api` requests from the frontend container are proxied to the backend container

Docker URLs:

```text
Frontend: http://localhost:8080
Backend: http://localhost:3000
Swagger: http://localhost:3000/docs
```

## Build and test commands

These commands are shell-independent and intended to work on Windows, macOS, and Linux as long as `pnpm`, Node.js, and Docker are installed where relevant.

Build:

```bash
pnpm build:backend
pnpm build:react
```


## Requirement coverage and Assessment checklist

The current implementation addresses the assessment requirements in the following way:

- Read, create and update operations are implemented for duties
- The backend uses PostgreSQL and plain SQL through `pg`, without any ORM
- The frontend is a client-side React application, independent from the backend package
- React Query is used for server state; no Redux, `useReducer`, or similar state-management solution is used
- Form validation is implemented for empty duty names during create and rename flows
- Errors are surfaced both in the backend API responses and in the frontend UI
- The codebase is split into frontend, backend, and shared packages to support future growth
- Swagger/OpenAPI documentation is available for backend endpoints
- Health checks, structured API errors, migration logs, and container logs provide basic observability
- Jest is configured and running for both frontend and backend
- No authentication is implemented, as required

The list below maps the stated requirements to the current repository status.

| Requirement | Status | Notes |
| --- | --- | --- |
| Read, create and update operations | Done | Duties can be listed, created, renamed, and completion state can be updated. |
| Public git repository | Repository responsibility | The codebase is ready to publish in one public repository. |
| Full real commit history | Repository responsibility | Keep the existing real history when publishing. |
| Clear README instructions | Done | This README describes local and Docker workflows. |
| Frontend screenshots in README | Pending final asset add | Add real screenshots before submission. |
| Cross-platform build and serve commands | Done | Root `pnpm` commands and Docker Compose workflow are documented. |
| Production-ready readability | Done | The codebase is split into frontend, backend, and shared packages. |
| Production-ready observability | Done | Swagger, health endpoint, migration logs, and Docker logs are available. |
| Architecture ready to grow | Done | Separation into API, hooks, pages, backend routes, migrations, and shared packages supports extension. |
| Correct error communication and handling | Done | Backend returns explicit HTTP errors and frontend surfaces request failures. |
| Edge cases considered | Done | Empty names, invalid payloads, missing records, and DB configuration issues are handled. |
| Jest on frontend and backend | Done | Frontend and backend test suites are configured and passing. |
| No authentication | Done | No user authentication is implemented. |
| React frontend in TypeScript strict mode | Done | Frontend is a client-side React + TypeScript application. |
| Hooks-based UI for duties from backend | Done | The frontend reads duties from the backend API and mutates through hooks. |
| Form validations | Done | Empty duty names are validated on create and rename. |
| Frontend independent from backend project | Done | Frontend is built and run independently and only communicates through HTTP. |
| No server-side frontend framework | Done | The frontend uses Vite + React only. |
| No Redux / useReducer-style state management | Done | Server state uses React Query; local UI state uses component state. |
| Node.js backend in TypeScript strict mode | Done | Backend is implemented in Node.js + TypeScript. |
| PostgreSQL storage | Done | Duties are persisted in PostgreSQL. |
| Plain SQL, no ORM | Done | The backend uses `pg` with explicit SQL queries. |

## Frontend screenshots

Add screenshots from a running application to a directory such as `docs/screenshots/` and reference them here before publishing the final repository.


## Notes for reviewers

- The repository keeps the full commit history
- The backend uses plain SQL instead of an ORM
- The solution is intentionally structured to support additional resources, routes, queries, and frontend features without collapsing into page-level logic
- Docker Compose is configured so migrations run automatically before the backend starts(use `depends_on` also did `healthcheck` for postgres)


## improvements in the future

- Extend backend integration and e2e coverage for the full duties CRUD flow, not only the current happy-path checks.
- Add request logging and structured runtime logs for easier production diagnostics.
- Add pagination, filtering, and sorting to support larger duty lists.
