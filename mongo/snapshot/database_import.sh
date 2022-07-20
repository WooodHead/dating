#!/bin/bash

 . .env
cd mongo/snapshot
select dump in `ls *.gz`; do
#  sed -i "1iuse $DOCKER_DATABASE;" $dump
  cd ../../
  docker-compose -f $DOCKER_CONFIG exec -w /dumps db bash -c "mongorestore -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} -d ${DOCKER_DATABASE} --gzip --archive=${dump}"
  break
done
