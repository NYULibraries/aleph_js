FROM node:7.7.2


ADD . /apps/aleph_js
USER root

WORKDIR /apps/aleph_js
RUN npm install
RUN npm test
