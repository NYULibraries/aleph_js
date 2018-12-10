ARG NODE_VERSION=8

FROM node:${NODE_VERSION}

# Install dependencies & Chrome
ARG BUILD_PACKAGES="zlib1g-dev liblzma-dev unzip nodejs"
ARG RUN_PACKAGES="gnupg xvfb libgconf2-4 libnss3 wget vim"
ARG CHROME_VERSION=71.0.3578.80-1
ARG CHROMIUM_DRIVER_VERSION=2.44
RUN apt-get update && apt-get -y --no-install-recommends install $BUILD_PACKAGES $RUN_PACKAGES \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -  \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
  && apt-get update && apt-get -y --no-install-recommends install google-chrome-stable=$CHROME_VERSION \
  && wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/$CHROMIUM_DRIVER_VERSION/chromedriver_linux64.zip \
  && unzip /tmp/chromedriver.zip chromedriver -d /usr/bin/ \
  && rm /tmp/chromedriver.zip \
  && chmod ugo+rx /usr/bin/chromedriver \
  && apt-get --purge -y autoremove $BUILD_PACKAGES \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh ./

ENV INSTALL_PATH /app

# Install node_modules with yarn
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH

ENTRYPOINT ["/entrypoint.sh"]