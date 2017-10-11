FROM node:latest

ENV INSTALL_PATH /app

RUN apt-get update && apt-get install -y python python-pip libpython-dev
RUN pip install --upgrade pip
RUN pip install awscli

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH
