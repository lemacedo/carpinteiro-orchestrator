FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/src/server.js ./src/server.js
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3002
USER node
EXPOSE 3002

CMD ["node", "src/server.js"]
