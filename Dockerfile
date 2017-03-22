FROM node:7.7.2

ADD . /apps/aleph_js
USER root

WORKDIR /apps/aleph_js

RUN rm -rf node_modules
RUN npm install
CMD npm run testem-launchers
