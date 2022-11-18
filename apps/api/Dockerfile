FROM staijn/angulon:nx-base AS builder

RUN npx nx build api

CMD ["node", "./dist/apps/api/main.js"]
