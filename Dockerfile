FROM node:9.10.0-slim

LABEL version="0.2"
LABEL description="Image for telegram-bot-secretary"
LABEL maintainer="Wendy <wencodes@gmail.com>"

RUN mkdir -p /usr/app/telegram-bot-secretary
WORKDIR /usr/app/telegram-bot-secretary

# Set the time zone
ENV TZ=Asia/Singapore
RUN echo "Asia/Singapore" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

COPY ["package.json", "yarn.lock", "./"]


RUN yarn global add forever && \
    cd /usr/app/telegram-bot-secretary && \
    yarn install

COPY . .

CMD [ "forever", "src/index.js", "live" ]

# USER node
