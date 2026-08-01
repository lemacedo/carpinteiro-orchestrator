FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3002
USER node
EXPOSE 3002

CMD ["node", "src/server.js"]
