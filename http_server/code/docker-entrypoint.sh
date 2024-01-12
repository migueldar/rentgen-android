#!/bin/bash

npm i
npm run build
node waitSocket.mjs
node index.mjs

#tail -f /dev/null
