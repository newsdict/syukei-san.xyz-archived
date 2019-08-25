#!/bin/bash
service nginx start
NVM_DIR="/root/.nvm"
. ${NVM_DIR}/nvm.sh \
&& npm start