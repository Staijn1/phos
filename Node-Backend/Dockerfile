FROM node:lts-buster-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 5001

CMD ["npm", "start"]


# Build image with:         docker build . --tag angulon-backend:latest
# Tag image as latest       docker tag angulon-backend staijn/angulon-backend:latest
# push to repository        docker push staijn/angulon-backend:latest
