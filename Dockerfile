FROM node:22-alpine3.20

WORKDIR /app

COPY .yarnrc.yml package.json yarn.lock ./

RUN corepack enable
RUN corepack install

COPY prisma/ ./

RUN yarn install --immutable
