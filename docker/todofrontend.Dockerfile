FROM node:16
WORKDIR /usr/src/app

COPY todo-frontend/package*.json ./
COPY todo-frontend/server.js .

RUN npm install

EXPOSE 8000
CMD [ "node", "server.js" ]
