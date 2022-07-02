FROM ubuntu:latest

WORKDIR /ftf-backend
  
COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN docker network create usernet || true

RUN docker-compose -f docker-compose-db.yml -f docker-compose-services.yml build

RUN docker-compose -f docker-compose-db.yml -f docker-compose-services.yml up -d

FROM node:14.17.0-slim

RUN yarn install

RUN yarn run build