#!/bin/bash

npm i -C /code
node /code/waitSocket.mjs
node /code/index.js

#tail -f /dev/null