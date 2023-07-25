FROM node:19-slim as builder
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3000
ENTRYPOINT ["node" ,"app.js"]