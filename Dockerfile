FROM ubuntu:18.04

WORKDIR /ftf-backend

# Curl for healthcheck
RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

FROM node:14.17.0-slim

COPY package.json ./

COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn run start:prod