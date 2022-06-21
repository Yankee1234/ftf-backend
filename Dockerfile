FROM node:16-slim

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn run docker:all up

RUN yarn run start:dev