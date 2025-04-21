#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run package:build

# publish
npm publish
