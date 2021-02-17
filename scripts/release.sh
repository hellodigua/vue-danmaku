#!/usr/bin/env sh

# abort on errors
set -e

# build

npm run package

# publish

npm publish
