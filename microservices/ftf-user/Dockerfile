FROM node:16-slim

WORKDIR /microservices/ftf-user

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN cp ./.env.docker ./.env

RUN rm ./.env.docker

RUN yarn install

RUN yarn run build