# Inspired by:
# https://github.com/alpeware/chrome-headless-stable/blob/master/Dockerfile
FROM ubuntu:20.10

LABEL maintainer "Foo <hello@foo.software>"

# install node
RUN apt-get update \
  && apt-get -y install curl gnupg build-essential \
  && curl -sL https://deb.nodesource.com/setup_14.x  | bash - \
  && apt-get -y install nodejs

RUN node -v
RUN npm -v

# install chrome
RUN apt-get update -qqy \
  && apt-get -qqy install libnss3 libnss3-tools libfontconfig1 wget ca-certificates apt-transport-https inotify-tools \
  gnupg \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install google-chrome-stable \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN google-chrome-stable --version

RUN npm install @foo-software/lighthouse-check -g

CMD ["lighthouse-check"]
