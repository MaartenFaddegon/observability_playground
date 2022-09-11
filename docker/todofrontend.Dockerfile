FROM node:16
WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin/:$PATH

# install dependencies
COPY todo-frontend/package*.json ./
RUN npm install
RUN npm install react-scripts

# copy protos
RUN mkdir -p ../todo-backend/proto
COPY todo-backend/proto/*.proto ../todo-backend/proto

# copy backend
COPY todo-frontend/server.js ./

# copy & build frontend code
RUN mkdir -p client/src
RUN mkdir -p client/public
COPY todo-frontend/client/package*.json client/
COPY todo-frontend/client/public/* client/public/
COPY todo-frontend/client/src/* client/src/
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
