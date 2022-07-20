FROM node:15.14.0-alpine3.13

RUN set -xe \
    && apk update \
    && apk add --no-cache yarn make git mc zsh sudo \
    && apk del --no-cache --no-network  \
    && rm -rf /usr/src/* /tmp/* \
    && npm i -g npm@latest -g @nestjs/cli \
    && addgroup --system www \
    && adduser --system -G www www 

COPY --chown=www:www reallovesearch/. /www/

WORKDIR www
#
# Configure user
#
ENV DOCKER_USER=www

ARG DOCKER_UID=1000
ARG DOCKER_GID=1000


#
# Add host user and group into container
#

RUN ls
USER www
RUN cp .env.example .env
RUN yarn 
RUN yarn build
RUN set -xe \
    && sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

#
# Do not stop container, and handle SIGTERM from docker stop or down
#
CMD node -e 'setInterval(() => {}, 60000); process.on("SIGTERM", () => { process.exit(0); });'
#CMD ['pwd']
#CMD [ "pm2", "start", "dist/main.js", "--no-daemon" ]
CMD yarn start
