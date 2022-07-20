FROM nginx:1.19-alpine

RUN set -xe \
        && apk update \
        && apk upgrade \
		&& apk add --no-cache \
			python3 \
			py-pip \
		&& apk del --no-cache --no-network  \
		&& rm -rf /usr/src/* /tmp/* \
        && pip install sentrylogs

RUN /bin/sh -c 'sentrylogs --sentrydsn https://b4be4a8ec87642148cb0797b6398a7fb@o450921.ingest.sentry.io/5452884 --nginxerrorpath /var/log/nginx/error.log --daemonize'

