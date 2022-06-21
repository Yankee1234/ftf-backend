FROM node:16-slim

RUN yarn run docker:all up

RUN yarn install

RUN yarn run start:dev