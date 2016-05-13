#!/bin/bash

#################################################
## this script is for crontab
## monitor master branch
## If updated, automatically pull; npm install; then execute forever restart 0

## SECTION1: check updated

REPO=https://github.com/eastandwest/skyway-box.git
HOME=/Users/komasshu
DIR=skyway-box

if [ -d ${HOME}/${DIR} ]; then
  echo "find ${DIR}! Skip clone process";
else
  echo "can't find ${DIR}. start clone process";
  cd ${HOME}
  git clone ${REPO}
  cd ${DIR}
  npm install
fi



## SECTION2: run update commands
