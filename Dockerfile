FROM node:16-slim

VOLUME [ "/var/run/docker.sock:/var/run/docker.sock" ]

RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz \
  && tar xzvf docker-17.04.0-ce.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker-17.04.0-ce.tgz

RUN  curl -sSL https://get.docker.com/ | sh

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn run docker:all up

RUN yarn run start:dev