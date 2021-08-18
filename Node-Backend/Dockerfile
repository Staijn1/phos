FROM node:lts-buster-slim

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm i typescript -g
RUN npm i copyfiles -g

COPY . .

EXPOSE 5000
EXPOSE 5001

RUN npm run build
RUN rm -r src

CMD ["npm","run", "start:prod"]


# Build image with:         docker build . --tag angulon-backend:latest
# Tag image as latest       docker tag angulon-backend staijn/angulon-backend:latest
# push to repository        docker push staijn/angulon-backend:latest
