FROM node:alpine
WORKDIR /usr/src/app

RUN npm i micro
COPY package*.json ./

COPY build build

EXPOSE 3000

CMD ["npm", "start"]