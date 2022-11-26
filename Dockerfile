FROM node:lts-alpine3.15 as builder

WORKDIR /app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

ARG BUILD_FLAGWORKDIR /app/builder

COPY . .

# Necessary to change dotenv file. See https://www.prisma.io/docs/guides/development-environment/environment-variables/using-multiple-env-files
RUN npm install -g dotenv-cli
RUN npm i --legacy-peer-deps

# docker build . -t staijn/angulon:nx-base
