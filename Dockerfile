FROM ubuntu:20.04

WORKDIR /ftf-backend
  
COPY package.json ./

COPY yarn.lock ./

COPY . .

FROM node:14.17.0-slim

RUN yarn install

RUN yarn run build