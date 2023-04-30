FROM staijn/angulon:nx-base AS builder
ARG NX_DAEMON=false
WORKDIR /app/builder
COPY . .
RUN npx nx build website

FROM nginx:1.19.2

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/dist/apps/website ./
COPY --from=builder /app/builder/apps/website/nginx.conf /etc/nginx/nginx.conf
