FROM node:lts-alpine AS builder

WORKDIR /app
RUN apk add --update g++ make python3 && rm -rf /var/cache/apk/*

ARG BUILD_FLAGWORKDIR /app/builder

COPY . .

RUN npm i

# docker build . -t staijn/angulon:nx-base
