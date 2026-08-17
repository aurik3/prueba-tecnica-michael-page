FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci --workspace backend --include-workspace-root=false

COPY backend backend

RUN npm run build --workspace backend

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci --workspace backend --include-workspace-root=false --omit=dev

COPY --from=build /app/backend/dist backend/dist

RUN mkdir -p backend/storage/evidence

EXPOSE 4000

CMD ["sh", "-c", "npm run db:sync:prod --workspace backend && npm run start --workspace backend"]
