#!/bin/bash
echo "docker-compose -f ./.dev/docker-compose.yml up -d $1"
docker-compose -f ./.dev/docker-compose.yml up -d $1

echo "docker exec -it network-wiki bash"
docker exec -it network-wiki bash
