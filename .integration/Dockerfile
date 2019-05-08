FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN yarn install
RUN npm i -g cross-env pino-gelf

COPY . /usr/src/app
