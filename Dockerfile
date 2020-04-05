FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json ./

COPY build build

EXPOSE 3000

CMD ["npm", "start"]