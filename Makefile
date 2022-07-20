include .env


up: # create and start containers
	@docker-compose -f ${DOCKER_CONFIG} up -d

down: # stop and destroy containers
	@docker-compose -f ${DOCKER_CONFIG} down

down-volume: #  WARNING: stop and destroy containers with volumes
	@docker-compose -f ${DOCKER_CONFIG} down -v

start: # start already created containers
	@docker-compose -f ${DOCKER_CONFIG} start

stop: # stop containers, but not destory
	@docker-compose -f ${DOCKER_CONFIG} stop

ps: # show started containers and their status
	@docker-compose -f ${DOCKER_CONFIG} ps

build: # build all dockerfile, if not built yet
	@docker-compose -f ${DOCKER_CONFIG} build

connect_backend: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www nest sh

connect_php: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www/admin php sh

connect_php_root: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u root -w /www/admin php sh

ti: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www/admin php php artisan ti

connect_loveisahead: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www loveisahead sh
	
connect_matchyoursecondhalf: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www matchyoursecondhalf sh

connect_reallovesearch: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www reallovesearch sh

connect_bestdatingever: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www bestdatingever sh

connect_matchingforadults: # app command line
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www matchingforadults sh

connect_nginx: # nginx command line
	@docker-compose -f ${DOCKER_CONFIG} exec -w /www nginx sh

connect_certbot: # nginx command line
	@docker-compose -f ${DOCKER_CONFIG} exec -w /var/www/certbot certbot sh

connect_db: # database command line
	@docker-compose -f ${DOCKER_CONFIG} exec db sh

connect_minio1:
	@docker-compose -f ${DOCKER_CONFIG} exec minio1 sh

connect_minio4:
	@docker-compose -f ${DOCKER_CONFIG} exec minio4 sh

database-open:
	@docker-compose -f ${DOCKER_CONFIG} exec db mongo -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}


database-dump: # dump database
	docker-compose -f ${DOCKER_CONFIG} exec db bash -c "cd /dumps/ && mongodump -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}  --archive=dump_`date +%F_%R`.gz --gzip -d ${DOCKER_DATABASE}"
	@echo dump_`date +%F_%R`.gz created successfully.

database-import:
	@mongo/snapshot/database_import.sh

watch_nest_logs:
	@docker-compose -f 	${DOCKER_CONFIG} logs --follow nest

fresh: down-volume up
	@rm -rf backend/uploads/static/avatars/*
	@sleep 7s
	@docker-compose -f ${DOCKER_CONFIG} exec -u www -w /www seeder sh -c 'npm i && npm run seed' 

local_hostname:
	@docker-compose -f ${DOCKER_CONFIG} exec -u root reallovesearch sh -c "{ ping -c1 nginx | sed -nE 's/^PING[^(]+\(([^)]+)\).*/\1/p'; echo 'bestdatingever.loc matchingforadults.loc reallovesearch.loc loveisahead.loc matchyoursecondhalf.loc'; } | tr '\n' '\t' >> /etc/hosts"
	@docker-compose -f ${DOCKER_CONFIG} exec -u root matchyoursecondhalf sh -c "{ ping -c1 nginx | sed -nE 's/^PING[^(]+\(([^)]+)\).*/\1/p'; echo 'bestdatingever.loc matchingforadults.loc reallovesearch.loc loveisahead.loc matchyoursecondhalf.loc'; } | tr '\n' '\t' >> /etc/hosts"
	@docker-compose -f ${DOCKER_CONFIG} exec -u root loveisahead sh -c "{ ping -c1 nginx | sed -nE 's/^PING[^(]+\(([^)]+)\).*/\1/p'; echo 'bestdatingever.loc matchingforadults.loc reallovesearch.loc loveisahead.loc matchyoursecondhalf.loc'; } | tr '\n' '\t' >> /etc/hosts"
	@docker-compose -f ${DOCKER_CONFIG} exec -u root nest sh -c "{ ping -c1 nginx | sed -nE 's/^PING[^(]+\(([^)]+)\).*/\1/p'; echo 'bestdatingever.loc matchingforadults.loc reallovesearch.loc loveisahead.loc matchyoursecondhalf.loc'; } | tr '\n' '\t' >> /etc/hosts"

storage_link:
	@docker-compose -f ${DOCKER_CONFIG} exec -u www php sh -c "rm /www/admin/storage/app/public/static"
	@docker-compose -f ${DOCKER_CONFIG} exec -u www php sh -c "ln -s /www/backend/uploads/static /www/admin/storage/app/public"