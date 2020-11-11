#!/bin/bash

rm source.tar
tar cvf source.tar -X ./.dockerignore *
tar rvf source.tar .postcssrc.js
tar rvf source.tar .babelrc
#cp source.tar ../../docker_deploy/mp/webgateway
