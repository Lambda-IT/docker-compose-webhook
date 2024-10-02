FROM node:18-alpine AS base

ARG VERSION=0.0.0
ARG BUILD_NO=0
ARG BRANCH=default
ARG GIT_HASH=000000000000000000000000000000000000000
ENV VERSION=$VERSION
ENV BUILD_NO=$BUILD_NO
ENV BRANCH=$BRANCH
ENV GIT_HASH=$GIT_HASH

WORKDIR /usr/share/app
COPY package*.json ./

RUN apk add docker docker-compose \
    && npm ci --omit=dev --no-optional

# ----------------------------
FROM base AS builder

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