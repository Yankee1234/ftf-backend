FROM ubuntu:20.04

WORKDIR /ftf-backend

# Curl for healthcheck
RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

RUN apt install apt-transport-https ca-certificates curl software-properties-common

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

RUN apt update

RUN apt-cache policy docker-ce

RUN apt install docker-ce

RUN service docker status
  
COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN docker network create usernet || true && docker-compose -f docker-compose-db.yml -f docker-compose-services.yml

FROM node:14.17.0-slim

RUN yarn install
RUN yarn run build