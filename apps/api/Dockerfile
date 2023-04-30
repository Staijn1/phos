FROM staijn/angulon:nx-base AS builder
ARG NX_DAEMON=false
RUN npx nx build api

CMD ["node", "./dist/apps/api/main.js"]
