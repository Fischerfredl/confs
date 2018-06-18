FROM node:8-alpine

RUN mkdir /app
WORKDIR /app

# early install of dependencies
COPY package.json /app
RUN npm install

# copy contents
COPY . /app

# build
RUN npm run build

# start server
WORKDIR /app/server
RUN npm install
CMD npm start
