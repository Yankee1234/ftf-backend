FROM ubuntu:20.04

VOLUME [ "/var/run/docker.sock" ]

RUN apt-get update && \
    apt-get -qy full-upgrade && \
    apt-get install -qy curl && \
    apt-get install -qy curl && \
    curl -sSL https://get.docker.com/ | sh

RUN curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

RUN chmod +x /usr/local/bin/docker-compose

RUN docker-compose --version

WORKDIR /ftf-backend
  
COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN docker-compose -f docker-compose-db.yml -f docker-compose-services.yml

FROM node:14.17.0-slim

RUN yarn install
RUN yarn run build