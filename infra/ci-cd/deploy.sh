#!/bin/bash
set -e

docker build -t layer8-backend -f infra/docker/Dockerfile.backend .
docker build -t layer8-frontend -f infra/docker/Dockerfile.frontend .

docker compose -f infra/docker-compose.yml up -d
