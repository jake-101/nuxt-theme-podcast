# Build stage
FROM node:20-slim AS build

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

# Production stage — minimal runtime
FROM node:20-slim AS production

WORKDIR /app

# Copy only the self-contained Nitro output
COPY --from=build /app/playground/.output /app/.output

# Nitro listens on 0.0.0.0:3000 by default
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
