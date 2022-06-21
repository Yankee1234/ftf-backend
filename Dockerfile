FROM node:16-slim

RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

RUN npm i -g --force corepack

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn run docker:all up

RUN yarn run start:dev