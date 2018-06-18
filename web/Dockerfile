FROM node:10-alpine

COPY . /srv
WORKDIR /srv
RUN npm install

WORKDIR /srv/server
RUN npm install
CMD npm start
