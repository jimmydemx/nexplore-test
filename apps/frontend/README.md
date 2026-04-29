# Frontend

This package contains the React frontend for the TODO list application.

## Stack

- React
- TypeScript in strict mode
- React Query for server state
- Ant Design for UI components
- Jest + Testing Library for tests

## Responsibilities

The frontend is intentionally independent from the backend runtime.

It is responsible for:

- Rendering the list of duties fetched from the backend
- Creating duties
- Updating duties
- Showing validation and request errors to the user

## Development

Run from the repository root:

```bash
pnpm dev:react
```

In local development, `/api` requests are proxied by Vite to the backend on port `3000`.

## Tests

Run from the repository root:

```bash
pnpm --filter @nexplore-test/frontend test
```

See the root README for the full project setup and Docker instructions.
