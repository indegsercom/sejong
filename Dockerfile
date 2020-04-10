FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN mkdir node_modules

COPY build build

EXPOSE 3000

CMD ["npm", "start"]