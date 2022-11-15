FROM node:lts-alpine3.15 as builder

WORKDIR /app
RUN apk add --no-cache python2 g++ make

ARG NODE_ENV
ARG BUILD_FLAGWORKDIR /app/builder

COPY . .

RUN npm i

# docker build . -t staijn/angulon:nx-base
