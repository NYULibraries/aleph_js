FROM node:7.7.2

ENV INSTALL_PATH /apps/aleph_js

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH

ENTRYPOINT ["npm", "run"]

CMD ["test"]
