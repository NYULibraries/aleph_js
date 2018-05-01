FROM node:9-slim

ENV INSTALL_PATH /app

RUN apt-get update && apt-get install -y \
  libfontconfig \
  libpython-dev \
  python \
  python-pip

RUN pip install --upgrade pip && pip install \
  awscli

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH
