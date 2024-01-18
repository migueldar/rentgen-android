FROM alpine:3.18.2

RUN apk add npm

WORKDIR /code

RUN mkdir /images

ENV screenshotDelayMs 500

CMD sh /code/docker-entrypoint.sh