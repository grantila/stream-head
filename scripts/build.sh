#!/bin/sh

rm -rf dist-es5 dist-es6

node_modules/.bin/tsc -p tsconfig-es6.json
node_modules/.bin/tsc -p tsconfig-es5.json
