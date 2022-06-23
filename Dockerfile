FROM ubuntu:18.04

WORKDIR /ftf-backend

# Curl for healthcheck
RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

RUN npm install --global yarn

COPY package.json ./

COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn run start:prod