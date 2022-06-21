FROM node:16-slim

RUN apt-get remove docker docker-engine docker.io \
  && apt-get update \
  && apt install docker.io

RUN snap install docker 

RUN npm i -g --force corepack

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn run docker:all up

RUN yarn run start:dev