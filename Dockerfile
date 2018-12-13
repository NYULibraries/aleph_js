FROM nyulibraries/selenium_chrome_headless_node:8-slim-chrome_71

ENV INSTALL_PATH /app

ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn install && yarn autoclean --force \
    && mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH

CMD ["yarn", "run", "test"]