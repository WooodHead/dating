FROM node:15.14.0-alpine3.13
RUN set -xe \
    && apk update \
    && apk add --no-cache yarn make git mc zsh \
    && apk del --no-cache --no-network  \
    && rm -rf /usr/src/* /tmp/* \
    && npm i -g npm@7.7.6 -g @nestjs/cli

#
# Configure user
#
ENV DOCKER_USER=www

ARG DOCKER_UID=1000
ARG DOCKER_GID=1000


#
# Add host user and group into container
#
RUN set -xe \
		&& deluser node \
		&& addgroup -g $DOCKER_GID $DOCKER_USER \
		&& adduser -g "web user" -s /bin/sh -D -u $DOCKER_UID -G $DOCKER_USER $DOCKER_USER \
		&& delgroup $DOCKER_USER $DOCKER_USER \
		&& echo "$DOCKER_USER:$DOCKER_USER" | chpasswd

WORKDIR /www
USER www

RUN set -xe \
    && sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

#
# Do not stop container, and handle SIGTERM from docker stop or down
#
CMD node -e 'setInterval(() => {}, 60000); process.on("SIGTERM", () => { process.exit(0); });'
#CMD ['pwd']
#CMD [ "pm2", "start", "dist/main.js", "--no-daemon" ]