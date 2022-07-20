
PHP_INI_PATH=/usr/local/etc/php/php.ini

if [ -f "$PHP_INI_PATH-$DOCKER_PHP_CONFIG" ] && [ ! -f "$PHP_INI_PATH" ]
then
	cp "$PHP_INI_PATH-$DOCKER_PHP_CONFIG" "$PHP_INI_PATH"
fi



DOCKER_SUPERVISOR_DIR=$(pwd)/docker/supervisor.d

if [ "$DOCKER_SUPERVISOR" == "y" ] && [ -d "$DOCKER_SUPERVISOR_DIR" ]
then
	mkdir -p /etc/supervisor.d

	for i in $(ls -1 $DOCKER_SUPERVISOR_DIR/*.ini)
	do
		cat $i > "/etc/supervisor.d/$(basename $i)"
	done

	PWD=/run /usr/bin/supervisord -c /etc/supervisord.conf -j /run/supervisord.pid
fi

DOCKER_CRON_DIR=$(pwd)/docker/cron.d

if [ "$DOCKER_CRON" == "y" ] && [ -d "$DOCKER_CRON_DIR" ]
then
	for i in $(ls -1 $DOCKER_CRON_DIR)
	do
		crontab -u $i $DOCKER_CRON_DIR/$i
	done

	/usr/sbin/crond
fi

