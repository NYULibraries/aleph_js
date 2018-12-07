FROM node:9-alpine

ENV INSTALL_PATH /app

ENV RUN_PACKAGES fontconfig
ENV BUILD_PACKAGES wget

RUN apk add --no-cache $BUILD_PACKAGES $RUN_PACKAGES \
  && wget --no-check-certificate -q -O - https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz | tar xz -C / \
  && npm config set user 0 \
  && npm install -g phantomjs-prebuilt \
  && npm install -g testem@1.15.0 \
&& apk del $BUILD_PACKAGES

# Install node_modules with yarn
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH

CMD ["npm", "run", "test"]