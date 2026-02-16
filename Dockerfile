FROM node:20-alpine AS base

# ---

# Build stage
FROM base AS build

# Enable pnpm via corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ---

# Production stage — no package manager needed, Nitro output is self-contained
FROM base AS production

WORKDIR /app

# Copy only the self-contained Nitro output
COPY --from=build /app/playground/.output /app/.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
