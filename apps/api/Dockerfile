FROM staijn/angulon:nx-base AS builder
ARG NX_DAEMON=false
RUN npx nx build api

ENTRYPOINT npx nx run api:migrations-run && node ./dist/apps/api/main.js
