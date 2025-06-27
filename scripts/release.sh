#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run package

# publish
echo "发布包到 npm..."
npm publish
