FROM node:lts-alpine3.15 AS builder

WORKDIR /app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

ARG BUILD_FLAGWORKDIR /app/builder

COPY . .

RUN npm i

# docker build . -t staijn/angulon:nx-base
