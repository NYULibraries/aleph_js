FROM geekykaran/headless-chrome-node-docker:latest

ENV INSTALL_PATH /app

# Install node_modules with yarn
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH


