#!/bin/bash

DIR_PATH=/home/$USER/workspace/nestjs_monorepo

cd $DIR_PATH

result=$(git pull)

echo "Git pull: $result"

if [[ $result == "Already up to date." ]];
then
  echo "Finish"
else
  echo "Start CI/CD"

  echo "Step 1: build - run"
  docker build --tag nestjs_monorepo_image .
  node ./scripts/generate-docker-compose.js
  echo "Step 1: build - success"

  echo "Step 2: stop containers - run"
  docker-compose down
  echo "Step 2: stop containers - success"

  echo "Step 3: run containers - run"
  docker-compose up -d
  echo "Step 3: run containers - success"

  echo "Finish CI/CD"
fi