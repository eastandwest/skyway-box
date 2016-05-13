#!/bin/bash

#################################################
## this script is for crontab
## monitor master branch
## If updated, automatically pull; npm install; then execute forever restart 0

## SECTION1: check app installed

REPO=https://github.com/eastandwest/skyway-box.git
DIR=skyway-box
MASTERCONF=${HOME}/config.json.master

if [ -d ${HOME}/${DIR} ]; then
  echo "find ${DIR}! Skip clone process";
else
  echo "can't find ${DIR}. start clone process";
  if [ -f ${MASTERCONF} ]; then
    # clone repository
    cd ${HOME}
    git clone ${REPO}

    # install package
    cd ${DIR}
    npm install

    # copy config file
    cp ${MASTERCONF} ${HOME}/${DIR}/conf/config.json

    # run via forever
    NODE_ENV=production forever start ${HOME}/${DIR}/index.js
  else
    echo "can't find ${MASTERCONF}"
  fi
fi

if [ ! -d ${HOME}/${DIR} ]; then
  echo "Error"; exit
fi

## SECTION2: check updated

cd ${HOME}/${DIR}
CHECKER=`git fetch origin master|grep "origin\/master"`

## SECTION3: run update commands


if [ "${CHECKER}" = "" ]; then
  echo "nothing updated"
else
  cd ${HOME}/${DIR}
  git merge
  npm install
  forever restart 0
fi
