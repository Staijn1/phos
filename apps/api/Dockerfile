FROM staijn/angulon:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG

RUN npx nx build api ${BUILD_FLAG}

CMD ["node", "./dist/apps/api/main.js"]
