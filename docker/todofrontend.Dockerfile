FROM node:16
WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin/:$PATH

# install dependencies
COPY todo-frontend/package*.json ./
RUN npm install
RUN npm install react-scripts

# copy app
RUN mkdir public
COPY todo-frontend/public/* public/
RUN mkdir src
COPY todo-frontend/src/* src/

EXPOSE 3000
CMD [ "npm", "start" ]
