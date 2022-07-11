#!/bin/bash
ls -al
docker stop frontend_testdance_container
docker rm -f frontend_testdance_container
docker rmi -f frontend_testdance:latest

docker build . -t frontend_testdance --no-cache
docker run -d -p 8082:8082 --name frontend_testdance_container frontend_testdance