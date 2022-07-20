FROM php:8.0-fpm-alpine

RUN set -xe \
		&& apk add --update --no-cache \
			libpng \
			libzip \
			libmcrypt \
			libjpeg-turbo \
			freetype \
			ffmpeg \
			libmaxminddb \
			icu-dev \
            busybox-suid \
            git \
            mariadb-client \
			gmp-dev \
            zip \
            supervisor \
            curl \
            nodejs npm
RUN set -xe \
		&& apk add --no-cache --virtual .make-ext-deps \
			libpng-dev \
			libjpeg-turbo-dev \
			freetype-dev \
			ffmpeg-dev \
			libzip-dev \
			libmcrypt-dev  \
            curl-dev \
            openssl-dev\
			$PHPIZE_DEPS

RUN set -xe \
		&& docker-php-ext-configure gd \
			--with-freetype \
			--with-jpeg
			
RUN set -xe \
		&& docker-php-ext-install -j$(nproc) \
			gd \
			bcmath \
			intl \
			pcntl \
			gmp \
			pdo_mysql \
            zip \
            exif \
            opcache \
            sockets

#RUN set -xe \
#    && apk add --no-cache libmaxminddb \
#    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS git libmaxminddb-dev \
#    && git clone https://github.com/maxmind/MaxMind-DB-Reader-php.git \
#    && ( \
#      cd MaxMind-DB-Reader-php/ext \
#      && phpize \
#      && ./configure \
#      && make \
#      && make install \
#    ) \
#    && rm -r MaxMind-DB-Reader-php \
#    && docker-php-ext-enable maxminddb

RUN set -xe \
    && apk add --no-cache imagemagick-libs jpegoptim \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS imagemagick-dev \
    && yes '' | pecl install imagick \
    && docker-php-ext-enable imagick

RUN set -xe \
        && pecl config-set php_ini /etc/php.ini \
		&& pecl install xdebug  redis  apcu  swoole mongodb \
        && docker-php-ext-enable xdebug apcu redis sockets swoole mongodb\
        &&  \
          pecl clear-cache

RUN set -xe \
		&& apk del --no-cache --no-network --purge .make-ext-deps \
		&& rm -rf /usr/src/* /tmp/*





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
		&& addgroup -g $DOCKER_GID $DOCKER_USER \
		&& adduser -g "web user" -s /bin/sh -D -u $DOCKER_UID -G $DOCKER_USER $DOCKER_USER \
		&& delgroup $DOCKER_USER $DOCKER_USER \
		&& echo "$DOCKER_USER:$DOCKER_USER" | chpasswd

#
# Exctend entry point with own code
#
COPY docker-ep-extra.sh /

RUN set -xe \
        && mkdir -p /etc/supervisor.d \
		&& sed -i '/^set -e/r /docker-ep-extra.sh' /usr/local/bin/docker-php-entrypoint \
		&& rm -f /docker-ep-extra.sh \
        && sed -i '$ d' /usr/local/bin/docker-php-entrypoint \
        && echo " /usr/sbin/crond && cd /www/admin && npm i && composer u && php artisan octane:start --watch --host='0.0.0.0' --workers=2 --task-workers=1 --max-requests=250" >> /usr/local/bin/docker-php-entrypoint


#
# Set working directory
#
WORKDIR /www


#
# Run php-fpm with docker user
# Increase memory limit for php
# Install composer
# Link composer cache into project folder
#
ARG COMPOSER_VERSION=2.2.4
ENV COMPOSER_HOME=/home/.composer

RUN set -xe \
		&& echo -e "\n[www]\nuser = $DOCKER_USER\ngroup = $DOCKER_USER" >> /usr/local/etc/php-fpm.d/zz-docker.conf \
		&& curl https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=$COMPOSER_VERSION \
		&& ln -s $(pwd)/.composer /home/$DOCKER_USER/.composer \
		&& chown -R $DOCKER_USER:$DOCKER_USER $COMPOSER_HOME



ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS="0"