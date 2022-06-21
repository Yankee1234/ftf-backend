FROM node:16-slim

VOLUME [ "/var/run/docker.sock:/var/run/docker.sock" ]

RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn run docker:all up

RUN yarn run start:dev