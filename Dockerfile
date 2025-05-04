# ========================================
# BASE
# ========================================
FROM node:22-alpine AS base

RUN apk add --no-cache openssl libssl3

# ========================================
# BUILD
# ========================================
FROM base AS build

WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm i && pnpm prisma:generate && pnpm build

# ========================================
# RUN
# ========================================
FROM base AS run

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

WORKDIR /app
EXPOSE 4000
CMD ["node", "dist/main.js"]