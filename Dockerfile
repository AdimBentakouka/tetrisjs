# FIRST STAGE for install pnpm
FROM node:18.13.0-alpine AS base
RUN npm i -g pnpm
RUN npm i -g serve
# SECONDES STAGES for install dependencies
FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# THIRD STAGES for build app
FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build
RUN pnpm prune --prod


# QUARTET STAGES Deploy app
FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist"]