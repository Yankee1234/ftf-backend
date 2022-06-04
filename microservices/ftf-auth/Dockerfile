FROM node:16-slim

WORKDIR /microservices/ftf-auth

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN cp ./ormconfig.docker.js ./ormconfig.js

RUN rm ./ormconfig.docker.js

RUN yarn install

RUN yarn run build