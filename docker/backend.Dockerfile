FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @nexplore-test/shared-types build
RUN pnpm --filter @nexplore-test/backend build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "--filter", "@nexplore-test/backend", "start:prod"]
