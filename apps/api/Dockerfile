FROM staijn/angulon:nx-base AS builder
ARG NX_DAEMON=false
RUN npx nx build api

# npx nx run api:migrations-run
CMD ["npx", "nx", "run", "api:migrations-run"]

ENTRYPOINT ["node", "./dist/apps/api/main.js"]
