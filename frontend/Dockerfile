FROM node:18-alpine AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN npm install -g bun && bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["bun", "run", "preview"] 