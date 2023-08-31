FROM node:18-alpine as base

WORKDIR /usr/share/app
COPY package*.json ./

RUN apk add docker docker-compose \
    && npm ci --omit=dev

# ----------------------------
FROM base as builder

WORKDIR /usr/share/app

COPY . .

RUN npm install
RUN npm run build

# ----------------------------
FROM base

ENV API_KEY=

WORKDIR /usr/share/app
COPY --from=builder /usr/share/app/dist/ ./

EXPOSE 8080

CMD ["node", "index.js"]